import { VoicePersona } from '../types/quest';

interface ManifestItem {
  file: string | null;
  text: string;
}

type VoiceManifest = Record<VoicePersona, Record<string, ManifestItem>>;

class TTSService {
  private currentAudio: HTMLAudioElement | null = null;
  private manifest: VoiceManifest | null = null;
  private manifestLoading: Promise<VoiceManifest | null> | null = null;

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

  async playKey(key: string, persona: VoicePersona = 'killian', enabled: boolean = true): Promise<boolean> {
    if (!enabled) return false;
    this.stop();

    const manifest = await this.loadManifest();
    const item = manifest?.[persona]?.[key];

    if (item && item.file) {
      return new Promise<boolean>(resolve => {
        const audio = new Audio(item.file!);
        this.currentAudio = audio;
        audio.onended = () => {
          this.currentAudio = null;
          resolve(true);
        };
        audio.onerror = () => {
          this.currentAudio = null;
          // fallback to speech synthesis if audio file failed
          this.speakText(item.text, persona, enabled);
          resolve(false);
        };
        audio.play().catch(() => {
          this.currentAudio = null;
          this.speakText(item.text, persona, enabled);
          resolve(false);
        });
      });
    }

    return false;
  }

  speakText(text: string, persona: VoicePersona = 'killian', enabled: boolean = true) {
    if (!enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.stop();

    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'de-DE';
      u.rate = 0.95;
      u.pitch = persona === 'katja' ? 1.12 : 1.04;

      const voices = window.speechSynthesis.getVoices();
      // Look for natural/neural voices
      const preferred = voices.find(
        v =>
          v.lang.startsWith('de') &&
          (persona === 'katja'
            ? v.name.toLowerCase().includes('katja') || v.name.toLowerCase().includes('petra') || v.name.toLowerCase().includes('anna')
            : v.name.toLowerCase().includes('killian') || v.name.toLowerCase().includes('florian') || v.name.toLowerCase().includes('yannick'))
      ) || voices.find(v => v.lang.startsWith('de') && (v.name.includes('Natural') || v.name.includes('Enhanced') || v.name.includes('Google')));

      if (preferred) {
        u.voice = preferred;
      } else {
        const anyDe = voices.find(v => v.lang.startsWith('de'));
        if (anyDe) u.voice = anyDe;
      }

      window.speechSynthesis.speak(u);
    } catch {
      // Audio permission or unsupported
    }
  }
}

export const ttsService = new TTSService();
