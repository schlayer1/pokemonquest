import { VoicePersona } from '../types/quest';

interface ManifestItem {
  file: string | null;
  text: string;
}

export type VoiceManifest = Record<VoicePersona, Record<string, ManifestItem>>;

class TTSService {
  private player: HTMLAudioElement | null = null;
  private manifest: VoiceManifest | null = null;
  private manifestLoading: Promise<VoiceManifest | null> | null = null;
  private isUnlocked: boolean = false;
  private preferredVoices: { killian?: SpeechSynthesisVoice; katja?: SpeechSynthesisVoice } = {};
  private currentResolve: ((value: boolean) => void) | null = null;

  constructor() {
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
   * Lazily get or initialize the single shared HTMLAudioElement.
   * Reusing one element prevents mobile OS audio decoder exhaustion (max 16-32 channels).
   */
  private getPlayer(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null;
    if (!this.player) {
      this.player = new Audio();
      this.player.preload = 'auto';

      this.player.addEventListener('ended', () => {
        if (this.currentResolve) {
          const res = this.currentResolve;
          this.currentResolve = null;
          res(true);
        }
      });

      this.player.addEventListener('error', () => {
        if (this.currentResolve) {
          const res = this.currentResolve;
          this.currentResolve = null;
          res(false);
        }
      });
    }
    return this.player;
  }

  /**
   * Unlock browser audio playback within a user gesture.
   */
  unlock() {
    if (typeof window === 'undefined') return;
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
   * Safely preloads voice files into browser HTTP/ServiceWorker cache via fetch.
   * Does NOT instantiate Audio elements to prevent hardware decoder exhaustion!
   */
  async preloadVoiceFiles(
    onProgress?: (loaded: number, total: number, currentKey: string) => void,
    personaOnly?: VoicePersona
  ): Promise<{ loaded: number; total: number; missing: string[] }> {
    const manifest = await this.loadManifest();
    if (!manifest) {
      return { loaded: 0, total: 0, missing: ['manifest.json missing'] };
    }

    const personasToLoad: VoicePersona[] = personaOnly ? [personaOnly] : ['killian', 'katja'];
    const itemsToLoad: Array<{ persona: VoicePersona; key: string; file: string }> = [];

    for (const persona of personasToLoad) {
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

    // Preload audio files gently with moderate batch size to protect CPU & network
    const batchSize = 8;
    for (let i = 0; i < itemsToLoad.length; i += batchSize) {
      const batch = itemsToLoad.slice(i, i + batchSize);
      await Promise.all(
        batch.map(async item => {
          try {
            const res = await fetch(item.file, { cache: 'force-cache' });
            if (res.ok) {
              loaded++;
            } else {
              missing.push(`${item.persona}/${item.key}: ${item.file}`);
            }
          } catch {
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

  stop() {
    if (this.player) {
      try {
        this.player.pause();
        this.player.currentTime = 0;
      } catch {}
    }
    if (this.currentResolve) {
      const res = this.currentResolve;
      this.currentResolve = null;
      res(false);
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
  }

  /**
   * Play pre-recorded Edge-TTS audio file using the single shared audio player.
   */
  async playKey(key: string, persona: VoicePersona = 'killian', enabled: boolean = true): Promise<boolean> {
    if (!enabled) return false;
    this.stop();

    let manifest = this.manifest;
    if (!manifest) {
      manifest = await this.loadManifest();
    }

    const item = manifest?.[persona]?.[key];
    if (!item || !item.file) {
      return false;
    }

    const player = this.getPlayer();
    if (!player) return false;

    return new Promise<boolean>(resolve => {
      this.currentResolve = resolve;

      // Point player to audio file and trigger playback
      player.src = item.file!;
      player.currentTime = 0;

      const playPromise = player.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Play was prevented or user gesture was lost - fallback to Web Speech
          if (this.currentResolve === resolve) {
            this.currentResolve = null;
          }
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
