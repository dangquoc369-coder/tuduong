/**
 * Web Audio API Acoustic Synthesizer for Buddhist Temple Sounds
 * Zero external audio files required - works 100% offline with zero latency.
 */

class SoundSynthesizer {
  private ctx: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
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

  /**
   * Synthesize resonant wooden temple block (Tiếng Mõ Tụng Kinh)
   * Warm hollow wood knock with fast acoustic decay and body resonance.
   */
  public playWoodblock(volume = 0.8): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Primary body oscillator (wood resonance)
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      // Sharp pitch drop mimics wooden striking impact
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(620, now);
      osc.frequency.exponentialRampToValueAtTime(310, now + 0.08);

      // Amplitude envelope for wooden knock
      oscGain.gain.setValueAtTime(0.001, now);
      oscGain.gain.linearRampToValueAtTime(0.9 * volume, now + 0.004);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      // Resonant bandpass filter to simulate hollow wooden chamber
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(750, now);
      filter.Q.setValueAtTime(4.5, now);

      // Secondary click noise for wood strike realism
      const clickBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.02, ctx.sampleRate);
      const clickData = clickBuffer.getChannelData(0);
      for (let i = 0; i < clickData.length; i++) {
        clickData[i] = (Math.random() * 2 - 1) * Math.exp(-i / 80);
      }
      const clickSource = ctx.createBufferSource();
      clickSource.buffer = clickBuffer;
      const clickGain = ctx.createGain();
      clickGain.gain.setValueAtTime(0.3 * volume, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

      // Connect nodes
      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(ctx.destination);

      clickSource.connect(clickGain);
      clickGain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
      clickSource.start(now);
      clickSource.stop(now + 0.03);
    } catch (e) {
      console.warn('Woodblock audio error:', e);
    }
  }

  /**
   * Synthesize Buddhist Temple Bell / Singing Bowl (Tiếng Chuông Chùa / Chuông Bát)
   * Deep harmonic meditation frequencies (~432Hz fundamental with overtones & lush decay).
   */
  public playTempleBell(volume = 0.75, pitch = 432): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const duration = 3.2;

      // Harmonics for a bronze Buddhist bowl/bell
      const harmonics = [
        { freqMult: 1.0, gain: 0.8 },
        { freqMult: 2.02, gain: 0.35 },
        { freqMult: 3.14, gain: 0.15 },
        { freqMult: 4.25, gain: 0.08 }
      ];

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume * 0.7, now);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      masterGain.connect(ctx.destination);

      harmonics.forEach(({ freqMult, gain }) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(pitch * freqMult, now);

        // Subtle shimmer / binaural beat
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(2.5, now); // 2.5Hz gentle beating
        lfoGain.gain.setValueAtTime(1.5, now);
        lfo.connect(osc.frequency);
        lfo.start(now);
        lfo.stop(now + duration);

        oscGain.gain.setValueAtTime(0.001, now);
        oscGain.gain.linearRampToValueAtTime(gain, now + 0.015);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * (1.2 / freqMult));

        osc.connect(oscGain);
        oscGain.connect(masterGain);

        osc.start(now);
        osc.stop(now + duration);
      });
    } catch (e) {
      console.warn('Temple bell audio error:', e);
    }
  }

  /**
   * Celebratory chime for milestones (108 chuỗi niệm, 500, 1.000 lần)
   */
  public playMilestoneChime(volume = 0.85): void {
    try {
      this.playTempleBell(volume * 0.9, 528); // 528 Hz - Solfeggio Love/Miracle frequency
      setTimeout(() => {
        this.playTempleBell(volume * 0.75, 792);
      }, 350);
      setTimeout(() => {
        this.playTempleBell(volume * 0.6, 1056);
      }, 700);
    } catch (e) {
      console.warn('Milestone chime error:', e);
    }
  }

  /**
   * Trigger mobile haptic vibration
   */
  public triggerHaptic(type: 'tap' | 'milestone' | 'warning' = 'tap'): void {
    if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return;
    try {
      if (type === 'tap') {
        navigator.vibrate(30);
      } else if (type === 'milestone') {
        // Joyful rhythmic vibration [vibrate, pause, vibrate, pause, vibrate]
        navigator.vibrate([60, 50, 60, 50, 120]);
      } else if (type === 'warning') {
        navigator.vibrate([100, 80, 100]);
      }
    } catch {
      // Haptics might be disabled by browser policy
    }
  }
}

export const sound = new SoundSynthesizer();
