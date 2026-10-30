class SoundService {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  play(effect: 'tap' | 'drop' | 'empty' | 'victory' | 'dodge' | 'alarm' | 'fail' | 'boil') {
    try {
      const c = this.getContext();
      if (!c) return;
      const t = c.currentTime;

      if (effect === 'tap') {
        const osc = c.createOscillator();
        const g = c.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450, t);
        osc.frequency.exponentialRampToValueAtTime(850, t + 0.05);
        g.gain.setValueAtTime(0.15, t);
        g.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
        osc.connect(g);
        g.connect(c.destination);
        osc.start(t);
        osc.stop(t + 0.05);
      } else if (effect === 'drop') {
        const osc = c.createOscillator();
        const g = c.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(280, t);
        osc.frequency.exponentialRampToValueAtTime(560, t + 0.09);
        g.gain.setValueAtTime(0.25, t);
        g.gain.exponentialRampToValueAtTime(0.01, t + 0.09);
        osc.connect(g);
        g.connect(c.destination);
        osc.start(t);
        osc.stop(t + 0.09);
      } else if (effect === 'empty') {
        const osc = c.createOscillator();
        const g = c.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, t);
        osc.frequency.exponentialRampToValueAtTime(100, t + 0.18);
        g.gain.setValueAtTime(0.2, t);
        g.gain.linearRampToValueAtTime(0.01, t + 0.18);
        osc.connect(g);
        g.connect(c.destination);
        osc.start(t);
        osc.stop(t + 0.18);
      } else if (effect === 'dodge') {
        // Fast swoosh
        const osc = c.createOscillator();
        const g = c.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, t);
        osc.frequency.exponentialRampToValueAtTime(1200, t + 0.12);
        g.gain.setValueAtTime(0.3, t);
        g.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
        osc.connect(g);
        g.connect(c.destination);
        osc.start(t);
        osc.stop(t + 0.12);
      } else if (effect === 'alarm') {
        // Warning siren
        const osc = c.createOscillator();
        const g = c.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(700, t);
        osc.frequency.setValueAtTime(880, t + 0.08);
        g.gain.setValueAtTime(0.2, t);
        g.gain.exponentialRampToValueAtTime(0.01, t + 0.18);
        osc.connect(g);
        g.connect(c.destination);
        osc.start(t);
        osc.stop(t + 0.18);
      } else if (effect === 'victory') {
        // Triad fanfare
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, i) => {
          const osc = c.createOscillator();
          const g = c.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t + i * 0.08);
          g.gain.setValueAtTime(0.2, t + i * 0.08);
          g.gain.exponentialRampToValueAtTime(0.01, t + i * 0.08 + 0.25);
          osc.connect(g);
          g.connect(c.destination);
          osc.start(t + i * 0.08);
          osc.stop(t + i * 0.08 + 0.25);
        });
      } else if (effect === 'fail') {
        const osc = c.createOscillator();
        const g = c.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.linearRampToValueAtTime(80, t + 0.25);
        g.gain.setValueAtTime(0.25, t);
        g.gain.linearRampToValueAtTime(0.01, t + 0.25);
        osc.connect(g);
        g.connect(c.destination);
        osc.start(t);
        osc.stop(t + 0.25);
      } else if (effect === 'boil') {
        for (let i = 0; i < 4; i++) {
          const osc = c.createOscillator();
          const g = c.createGain();
          osc.type = 'sine';
          const delay = i * 0.06;
          osc.frequency.setValueAtTime(300 + Math.random() * 200, t + delay);
          osc.frequency.exponentialRampToValueAtTime(600 + Math.random() * 200, t + delay + 0.04);
          g.gain.setValueAtTime(0.12, t + delay);
          g.gain.exponentialRampToValueAtTime(0.01, t + delay + 0.04);
          osc.connect(g);
          g.connect(c.destination);
          osc.start(t + delay);
          osc.stop(t + delay + 0.04);
        }
      }
    } catch {
      // AudioContext policy
    }
  }
}

export const soundService = new SoundService();
