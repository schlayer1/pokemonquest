import { ttsService } from './tts';
import { soundService } from './sound';

export interface PreloadProgress {
  phase: string;
  percent: number;
  loadedCount: number;
  totalCount: number;
  currentFile?: string;
  isCompleted: boolean;
  errors: string[];
  report: {
    audioReady: number;
    audioTotal: number;
    imagesReady: number;
    imagesTotal: number;
  };
}

export type ProgressListener = (progress: PreloadProgress) => void;

class AssetPreloader {
  private inProgress: Promise<PreloadProgress> | null = null;
  private listeners: Set<ProgressListener> = new Set();
  private lastReport: PreloadProgress | null = null;

  // Complete registry of all required game assets
  private readonly INGREDIENT_KEYS = [
    'red_mini',
    'blue_mini',
    'yellow_mini',
    'gray_mini',
    'red_root',
    'blue_ice',
    'yellow_honey',
    'gray_shroom',
    'rainbow',
    'mystic_shell'
  ];

  private readonly DECORATION_FILES = [
    'blastoise_fountain.png',
    'chansey_statue.png',
    'charizard_torch.png',
    'dodrio_tent.png',
    'eevee_guitar.png',
    'flareon_cushion.png',
    'gengar_balloon.png',
    'jolteon_cushion.png',
    'kangaskhan_swing.png',
    'machamp_statue.png',
    'meowth_balloon.png',
    'mewtwo_arch.png',
    'pidgeot_wind_sock.png',
    'pikachu_surfboard.png',
    'snorlax_lounger.png',
    'vaporeon_cushion.png',
    'venusaur_planter.png'
  ];

  private readonly BOSS_FILES = [
    'boss_6.png',
    'boss_94.png',
    'boss_95.png',
    'boss_130.png',
    'boss_150.png'
  ];

  subscribe(listener: ProgressListener): () => void {
    this.listeners.add(listener);
    if (this.lastReport) {
      listener(this.lastReport);
    }
    return () => this.listeners.delete(listener);
  }

  private notify(progress: PreloadProgress) {
    this.lastReport = progress;
    for (const l of this.listeners) {
      try {
        l(progress);
      } catch {}
    }
  }

  getLastReport(): PreloadProgress | null {
    return this.lastReport;
  }

  /**
   * Main verification and preloader routine.
   * Checks every voice file, image, sound, and caches them in CacheStorage & memory.
   */
  async startPreload(forceFresh: boolean = false): Promise<PreloadProgress> {
    if (this.inProgress && !forceFresh) {
      return this.inProgress;
    }

    this.inProgress = this.runPreloadPipeline();
    const result = await this.inProgress;
    this.inProgress = null;
    return result;
  }

  private async runPreloadPipeline(): Promise<PreloadProgress> {
    const errors: string[] = [];

    // Construct image URL lists
    const ingredientUrls = this.INGREDIENT_KEYS.map(k => `/assets/ingredients/${k}.png`);
    const recipeUrls = Array.from({ length: 18 }, (_, i) => `/assets/recipes/${i + 1}.png`);
    const worldUrls = Array.from({ length: 12 }, (_, i) => `/assets/worlds/${i + 1}.png`);
    const decorationUrls = this.DECORATION_FILES.map(f => `/assets/decorations/${f}`);
    const bossUrls = this.BOSS_FILES.map(f => `/assets/bosses/${f}`);

    // 151 Classic + 151 Kubo sprites
    const classicSpriteUrls = Array.from({ length: 151 }, (_, i) => `/assets/pokemon/classic/${i + 1}.png`);
    const kuboSpriteUrls = Array.from({ length: 151 }, (_, i) => `/assets/pokemon/kubo/${i + 1}.png`);

    const allImageUrls = [
      ...ingredientUrls,
      ...recipeUrls,
      ...worldUrls,
      ...decorationUrls,
      ...bossUrls,
      ...classicSpriteUrls,
      ...kuboSpriteUrls
    ];

    const imagesTotal = allImageUrls.length; // 364
    let imagesReady = 0;
    const audioTotal = 78; // 39 Killian + 39 Katja
    let audioReady = 0;

    const grandTotal = 1 + audioTotal + imagesTotal; // 1 manifest + 78 audio + 364 images = 443
    let grandLoaded = 0;

    const reportProgress = (phase: string, currentFile?: string) => {
      const percent = Math.min(100, Math.round((grandLoaded / grandTotal) * 100));
      this.notify({
        phase,
        percent,
        loadedCount: grandLoaded,
        totalCount: grandTotal,
        currentFile,
        isCompleted: false,
        errors,
        report: {
          audioReady,
          audioTotal,
          imagesReady,
          imagesTotal
        }
      });
    };

    reportProgress('Initialisiere Kubo-Insel Prüfung...');

    // Open dedicated cache storage if supported
    let cache: Cache | null = null;
    if (typeof window !== 'undefined' && 'caches' in window) {
      try {
        cache = await window.caches.open('pokemonquest-assets-v2');
      } catch {}
    }

    // Phase 1: Load and verify Voice Manifest
    reportProgress('Prüfe Edge-TTS Stimmen-Manifest...', '/audio/voice/manifest.json');
    const manifest = await ttsService.loadManifest();
    grandLoaded++;
    if (!manifest) {
      errors.push('Stimmen-Manifest konnte nicht geladen werden');
    }

    // Phase 2: Preload and cache all 78 Edge-TTS voice files
    reportProgress('Lade 78 Edge-TTS Sprachdateien (Killian & Katja)...');
    try {
      const voiceResult = await ttsService.preloadVoiceFiles((loaded, total, currentKey) => {
        audioReady = loaded;
        grandLoaded = 1 + loaded;
        reportProgress(`Edge-TTS Stimme vorladen (${loaded}/${total})...`, currentKey);
      });
      audioReady = voiceResult.loaded;
      if (voiceResult.missing.length > 0) {
        errors.push(...voiceResult.missing);
      }
    } catch (e) {
      errors.push('Fehler beim Vorladen der Sprachdateien');
    }

    // Phase 3: Preload core images (Ingredients, Recipes, Worlds, Decorations, Bosses)
    reportProgress('Prüfe Kochtopf-Zutaten, Rezepte & Welten...');
    const coreImages = [
      ...ingredientUrls,
      ...recipeUrls,
      ...worldUrls,
      ...decorationUrls,
      ...bossUrls
    ];

    await this.batchLoadImages(coreImages, cache, (url, ok) => {
      grandLoaded++;
      if (ok) imagesReady++;
      else errors.push(`Bild fehlt: ${url}`);
      reportProgress('Prüfe Zutaten, Rezepte & Karten...', url);
    });

    // Phase 4: Preload Pokémon Sprites (151 Classic + 151 Kubo)
    reportProgress('Prüfe 151 Pokémon-Grafiken (Klassisch & 3D Kubo)...');
    const pokemonSprites = [...classicSpriteUrls, ...kuboSpriteUrls];
    await this.batchLoadImages(pokemonSprites, cache, (url, ok) => {
      grandLoaded++;
      if (ok) imagesReady++;
      else errors.push(`Sprite fehlt: ${url}`);
      reportProgress(`Pokémon-Grafiken verifizieren (${imagesReady}/${imagesTotal})...`, url);
    });

    // Phase 5: Warmup Sound FX
    try {
      soundService.unlock();
    } catch {}

    // Final completion state
    const finalReport: PreloadProgress = {
      phase: errors.length === 0 ? 'Alle 443 Dateien & Stimmen bereit!' : 'Dateiprüfung abgeschlossen mit Hinweisen',
      percent: 100,
      loadedCount: grandTotal,
      totalCount: grandTotal,
      currentFile: undefined,
      isCompleted: true,
      errors,
      report: {
        audioReady,
        audioTotal,
        imagesReady,
        imagesTotal
      }
    };

    if (errors.length === 0 && typeof window !== 'undefined') {
      try {
        localStorage.setItem('quest_assets_cached_v2', 'true');
      } catch {}
    }

    this.notify(finalReport);
    return finalReport;
  }

  /**
   * Concurrently preloads images in batches to prevent network or memory bottlenecks.
   */
  private async batchLoadImages(
    urls: string[],
    cache: Cache | null,
    onItem: (url: string, ok: boolean) => void,
    concurrency: number = 10
  ): Promise<void> {
    for (let i = 0; i < urls.length; i += concurrency) {
      const chunk = urls.slice(i, i + concurrency);
      await Promise.all(
        chunk.map(async url => {
          const ok = await this.preloadSingleImage(url, cache);
          onItem(url, ok);
        })
      );
    }
  }

  private preloadSingleImage(url: string, cache: Cache | null): Promise<boolean> {
    return new Promise(resolve => {
      try {
        // Also ensure it is stored in Cache API for offline PWA
        if (cache) {
          cache.match(url).then(cached => {
            if (!cached) {
              fetch(url)
                .then(res => {
                  if (res.ok) cache.put(url, res.clone()).catch(() => {});
                })
                .catch(() => {});
            }
          }).catch(() => {});
        }

        const img = new Image();
        let settled = false;

        const done = (ok: boolean) => {
          if (settled) return;
          settled = true;
          img.onload = null;
          img.onerror = null;
          resolve(ok);
        };

        img.onload = () => done(true);
        img.onerror = () => done(false);
        img.src = url;

        if (img.complete && img.naturalWidth > 0) {
          done(true);
          return;
        }

        // Timeout fallback
        setTimeout(() => {
          if (!settled) {
            done(img.complete && img.naturalWidth > 0);
          }
        }, 3500);
      } catch {
        resolve(false);
      }
    });
  }
}

export const assetPreloader = new AssetPreloader();
