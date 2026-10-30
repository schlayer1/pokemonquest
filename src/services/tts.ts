import { VoicePersona } from '../types/quest';

interface ManifestItem {
  file: string | null;
  text: string;
}

export type VoiceManifest = Record<VoicePersona, Record<string, ManifestItem>>;

class TTSService {
  private currentAudio: HTMLAudioElement | null = null;
  private manifest: VoiceManifest | null = null;
  private manifestLoading: Promise<VoiceManifest | null> | null = null;
  private audioCache: Map<string, HTMLAudioElement> = new Map();
  private isUnlocked: boolean = false;
  private preferredVoices: { killian?: SpeechSynthesisVoice; katja?: SpeechSynthesisVoice } = {};

  constructor() {
    // Eagerly initiate manifest loading and voice enumeration in browser
    if (typeof window !== 'undefined') {
      this.loadManifest().catch(() => {});
      this.initVoices();
    }
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const findVoices = () => {
      const all = window.speechSynthesis.getVoices();
      if (!all || all.length === 0) return;

      const germanVoices = all.filter(v => v.lang.startsWith('de'));
      if (germanVoices.length === 0) return;

      const findByName = (tokens: string[]) =>
        germanVoices.find(v => tokens.some(t => v.name.toLowerCase().includes(t.toLowerCase())));

      // High-quality natural voices on Edge, Apple, Android, Windows
      this.preferredVoices.killian =
        findByName(['killian', 'conrad', 'florian', 'yannick', 'markus', 'viktor', 'google deutsch']) ||
        germanVoices[0];

      this.preferredVoices.katja =
        findByName(['katja', 'amala', 'marlene', 'anna', 'petra', 'vicki', 'google deutsch']) ||
        germanVoices.find(v => v.name.toLowerCase().includes('female')) ||
        germanVoices[0];
    };

    findVoices();
    window.speechSynthesis.onvoiceschanged = findVoices;
  }

  /**
   * Unlock browser audio playback within a high-priority user gesture.
   */
  unlock() {
    if (this.isUnlocked || typeof window === 'undefined') return;
    this.isUnlocked = true;

    try {
      // Inaudible silent audio to bless HTMLAudio element playback
      const silent = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
      silent.play().catch(() => {});
    } catch {}
  }

  async loadManifest(): Promise<VoiceManifest | null> {
    if (this.manifest) return this.manifest;
    if (this.manifestLoading) return this.manifestLoading;

    this.manifestLoading = fetch('/audio/voice/manifest.json')
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        this.manifest = data;
        return data;
      })
      .catch(() => null);

    return this.manifestLoading;
  }

  getManifest(): VoiceManifest | null {
    return this.manifest;
  }

  /**
   * Preloads all audio files defined in the manifest into memory & browser cache.
   */
  async preloadVoiceFiles(
    onProgress?: (loaded: number, total: number, currentKey: string) => void
  ): Promise<{ loaded: number; total: number; missing: string[] }> {
    const manifest = await this.loadManifest();
    if (!manifest) {
      return { loaded: 0, total: 0, missing: ['manifest.json missing'] };
    }

    const itemsToLoad: Array<{ persona: VoicePersona; key: string; file: string }> = [];
    for (const persona of ['killian', 'katja'] as VoicePersona[]) {
      const keys = manifest[persona] || {};
      for (const [key, item] of Object.entries(keys)) {
        if (item.file) {
          itemsToLoad.push({ persona, key, file: item.file });
        }
      }
    }

    const total = itemsToLoad.length;
    let loaded = 0;
    const missing: string[] = [];

    // Preload audio files with concurrency limit
    const batchSize = 6;
    for (let i = 0; i < itemsToLoad.length; i += batchSize) {
      const batch = itemsToLoad.slice(i, i + batchSize);
      await Promise.all(
        batch.map(async item => {
          const success = await this.preloadSingleFile(item.file);
          if (success) {
            loaded++;
          } else {
            missing.push(`${item.persona}/${item.key}: ${item.file}`);
          }
          if (onProgress) {
            onProgress(loaded, total, `${item.persona}: ${item.key}`);
          }
        })
      );
    }

    return { loaded, total, missing };
  }

  private preloadSingleFile(fileUrl: string): Promise<boolean> {
    if (this.audioCache.has(fileUrl)) return Promise.resolve(true);

    return new Promise(resolve => {
      try {
        const audio = new Audio();
        audio.preload = 'auto';
        audio.src = fileUrl;

        let settled = false;
        const done = (ok: boolean) => {
          if (settled) return;
          settled = true;
          cleanup();
          if (ok) {
            this.audioCache.set(fileUrl, audio);
          }
          resolve(ok);
        };

        const onCanPlay = () => done(true);
        const onError = () => done(false);

        const cleanup = () => {
          audio.removeEventListener('canplaythrough', onCanPlay);
          audio.removeEventListener('loadeddata', onCanPlay);
          audio.removeEventListener('error', onError);
        };

        audio.addEventListener('canplaythrough', onCanPlay, { once: true });
        audio.addEventListener('loadeddata', onCanPlay, { once: true });
        audio.addEventListener('error', onError, { once: true });

        // If browser already had it cached in memory:
        if (audio.readyState >= 2) {
          done(true);
          return;
        }

        audio.load();

        // Safety fallback timeout in case neither event fires
        setTimeout(() => {
          if (!settled) {
            // If it reached at least metadata, it's considered valid
            done(audio.readyState >= 1);
          }
        }, 3000);
      } catch {
        resolve(false);
      }
    });
  }

  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  /**
   * Play pre-recorded Edge-TTS audio file.
   * Runs synchronously inside user gesture when manifest and audio are preloaded.
   */
  async playKey(key: string, persona: VoicePersona = 'killian', enabled: boolean = true): Promise<boolean> {
    if (!enabled) return false;
    this.stop();

    // Fast synchronous path if manifest is already in memory
    let manifest = this.manifest;
    if (!manifest) {
      manifest = await this.loadManifest();
    }

    const item = manifest?.[persona]?.[key];
    if (!item || !item.file) {
      return false;
    }

    const fileUrl = item.file;
    let audio = this.audioCache.get(fileUrl);
    if (!audio) {
      audio = new Audio(fileUrl);
      audio.preload = 'auto';
      this.audioCache.set(fileUrl, audio);
    }

    this.currentAudio = audio;
    audio.currentTime = 0;

    return new Promise<boolean>(resolve => {
      const onEnded = () => {
        this.currentAudio = null;
        cleanup();
        resolve(true);
      };

      const onError = () => {
        this.currentAudio = null;
        cleanup();
        // Fallback to speech synthesis if audio file failed
        this.speakText(item.text, persona, enabled);
        resolve(false);
      };

      const cleanup = () => {
        audio!.removeEventListener('ended', onEnded);
        audio!.removeEventListener('error', onError);
      };

      audio.addEventListener('ended', onEnded, { once: true });
      audio.addEventListener('error', onError, { once: true });

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          // Play was prevented or user gesture was lost
          cleanup();
          this.currentAudio = null;
          // Fallback to speech synthesis
          this.speakText(item.text, persona, enabled);
          resolve(false);
        });
      }
    });
  }

  speakText(text: string, persona: VoicePersona = 'killian', enabled: boolean = true) {
    if (!enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.stop();

    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'de-DE';
      u.rate = 0.96;
      u.pitch = persona === 'katja' ? 1.12 : 1.04;

      const voice = this.preferredVoices[persona];
      if (voice) {
        u.voice = voice;
      } else {
        const anyDe = window.speechSynthesis.getVoices().find(v => v.lang.startsWith('de'));
        if (anyDe) u.voice = anyDe;
      }

      window.speechSynthesis.speak(u);
    } catch {
      // Audio permission or unsupported
    }
  }
}

export const ttsService = new TTSService();
