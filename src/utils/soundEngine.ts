/**
 * Web Audio API procedural sound engine for Tic Tac Toe Unlimited.
 * Generates crisp, original arcade SFX and ambient synth chords without external audio files.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private sfxVolume: number = 0.7;
  private musicVolume: number = 0.3;
  private isMusicPlaying: boolean = false;
  private musicInterval: any = null;
  private musicOscillators: OscillatorNode[] = [];
  private musicGainNode: GainNode | null = null;

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.musicGainNode && this.ctx) {
      this.musicGainNode.gain.setValueAtTime(0, this.ctx.currentTime);
    } else if (!muted && this.musicGainNode && this.ctx && this.isMusicPlaying) {
      this.musicGainNode.gain.setValueAtTime(this.musicVolume * 0.15, this.ctx.currentTime);
    }
  }

  public setVolume(volume: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    if (this.musicGainNode && this.ctx && !this.isMuted && this.isMusicPlaying) {
      this.musicGainNode.gain.setValueAtTime(this.musicVolume * this.sfxVolume * 0.15, this.ctx.currentTime);
    }
  }

  /**
   * Sound for Player 1 (X) move: Crisp cybernetic laser chirp
   */
  public playXMove() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(this.sfxVolume * 0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // Audio error safety
    }
  }

  /**
   * Sound for Player 2 (O) move: Warm resonant orb/bubble pop
   */
  public playOMove() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.07);

      gain.gain.setValueAtTime(this.sfxVolume * 0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch {
      // Audio error safety
    }
  }

  /**
   * Sound when a scoring triplet is completed (+1 point)
   */
  public playScorePoint() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const freqs = [659.25, 830.61, 1046.5]; // E5, G#5, C6 (bright neon major chord)
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);

        gain.gain.setValueAtTime(0, now + i * 0.06);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.3, now + i * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.3);
      });
    } catch {
      // Audio error safety
    }
  }

  /**
   * Sound when multiple scoring triplets are completed in a single move (+2 or +3 points!)
   */
  public playScoreCombo(count: number) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = count >= 3 
        ? [523.25, 659.25, 783.99, 1046.5, 1318.51] // C5, E5, G5, C6, E6
        : [587.33, 739.99, 880.0, 1174.66]; // D5, F#5, A5, D6

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);

        gain.gain.setValueAtTime(0, now + i * 0.05);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.35, now + i * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.36);
      });
    } catch {
      // Audio error safety
    }
  }

  /**
   * Victory fanfare on game over
   */
  public playVictory() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const melody = [
        { f: 523.25, d: 0.12, t: 0 },    // C5
        { f: 659.25, d: 0.12, t: 0.12 }, // E5
        { f: 783.99, d: 0.12, t: 0.24 }, // G5
        { f: 1046.5, d: 0.35, t: 0.38 }, // C6
        { f: 880.0,  d: 0.15, t: 0.75 }, // A5
        { f: 1046.5, d: 0.5,  t: 0.92 }, // C6 long
      ];

      melody.forEach(({ f, d, t }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(f, now + t);

        gain.gain.setValueAtTime(0, now + t);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.22, now + t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + d);

        // Low-pass filter to give smooth 80s arcade feel
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2400, now + t);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + t);
        osc.stop(now + t + d + 0.05);
      });
    } catch {
      // Audio error safety
    }
  }

  /**
   * Calmer sound for a tie / draw
   */
  public playDraw() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const chords = [
        { f: 440, t: 0, d: 0.4 },
        { f: 554.37, t: 0, d: 0.4 },
        { f: 392, t: 0.4, d: 0.6 },
        { f: 493.88, t: 0.4, d: 0.6 },
      ];

      chords.forEach(({ f, t, d }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + t);

        gain.gain.setValueAtTime(0, now + t);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.2, now + t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + t);
        osc.stop(now + t + d);
      });
    } catch {
      // Audio error safety
    }
  }

  private lastHoverTime: number = 0;

  /**
   * Subtle, pleasant micro-frequency chirp on UI element hover
   */
  public playHoverChirp() {
    if (this.isMuted) return;
    const nowMs = Date.now();
    if (nowMs - this.lastHoverTime < 90) return; // rate limit hover sounds
    this.lastHoverTime = nowMs;

    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1100, now);
      osc.frequency.exponentialRampToValueAtTime(1600, now + 0.035);

      gain.gain.setValueAtTime(this.sfxVolume * 0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch {
      // Audio error safety
    }
  }

  /**
   * High-tech cyber blip for filters, toggles, and tech buttons
   */
  public playCyberBlip() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(840, now);
      osc.frequency.exponentialRampToValueAtTime(1260, now + 0.05);

      gain.gain.setValueAtTime(this.sfxVolume * 0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.065);
    } catch {
      // Audio error safety
    }
  }

  /**
   * Sound for YES button in Think a Number: Bright, harmonious affirmation chime
   */
  public playYesSound() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.04);

        gain.gain.setValueAtTime(0, now + i * 0.04);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.28, now + i * 0.04 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 0.2);
      });
    } catch {
      // Audio error safety
    }
  }

  /**
   * Sound for NO button in Think a Number: Soft, distinct low-key acknowledgment
   */
  public playNoSound() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [440.0, 349.23]; // A4, F4
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);

        gain.gain.setValueAtTime(0, now + i * 0.05);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.22, now + i * 0.05 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.16);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.18);
      });
    } catch {
      // Audio error safety
    }
  }

  /**
   * Sound for mind reading reveal: Exciting mystical suspense arpeggio resolving to a glowing chord
   */
  public playMagicReveal() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Fast mystical cascade building up to high octave
      const cascade = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 1046.5, 1318.51];
      cascade.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.045);

        gain.gain.setValueAtTime(0, now + i * 0.045);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.24, now + i * 0.045 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.045 + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.045);
        osc.stop(now + i * 0.045 + 0.3);
      });

      // Triumphant chord bloom at the end
      const chord = [523.25, 659.25, 783.99, 1046.5];
      chord.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + 0.38);

        gain.gain.setValueAtTime(0, now + 0.38);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.3, now + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + 0.38);
        osc.stop(now + 1.15);
      });
    } catch {
      // Audio error safety
    }
  }

  /**
   * Sound when a new card arrives: Crisp cybernetic deck slide / card deal
   * Dynamically raises pitch as card index increases (ascending powers of 2)
   */
  public playCardDeal(cardIndex: number = 0) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Ascend base frequency with each card step (e.g. 360Hz -> 720Hz)
      const baseFreq = 380 + Math.min(cardIndex * 65, 500);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.2, now + 0.12);

      gain.gain.setValueAtTime(this.sfxVolume * 0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);

      // Mechanical target acquisition latch sound at end of deal
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(baseFreq * 2.4, now + 0.08);
      osc2.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.18);

      gain2.gain.setValueAtTime(this.sfxVolume * 0.18, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(now + 0.08);
      osc2.stop(now + 0.22);
    } catch {
      // Audio error safety
    }
  }

  /**
   * Sound when target brackets lock onto the active card
   */
  public playCardLock() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.setValueAtTime(1800, now + 0.03);

      gain.gain.setValueAtTime(this.sfxVolume * 0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Audio error safety
    }
  }

  /**
   * Sound when a card de-materializes into quantum energy
   */
  public playDematerialize() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // High-frequency energy disintegrator with frequency dip and resonance
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.22);

      gain.gain.setValueAtTime(this.sfxVolume * 0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);

      // Noise sparkle burst
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1400, now);
      osc2.frequency.linearRampToValueAtTime(320, now + 0.18);

      gain2.gain.setValueAtTime(this.sfxVolume * 0.15, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(now);
      osc2.stop(now + 0.2);
    } catch {
      // Audio error safety
    }
  }

  /**
   * Sound when a new card materializes from quantum lattice
   */
  public playMaterialize(cardIndex: number = 0) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const baseFreq = 440 + Math.min(cardIndex * 70, 520);

      // Quantum assembly chord
      [baseFreq, baseFreq * 1.25, baseFreq * 1.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * 0.6, now);
        osc.frequency.exponentialRampToValueAtTime(freq, now + 0.08 + i * 0.02);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.18, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.35);
      });
    } catch {
      // Audio error safety
    }
  }

  /**
   * Subtle typewriter micro-click when typing characters letter by letter
   */
  public playTypewriterTick() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400 + Math.random() * 200, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.018);

      gain.gain.setValueAtTime(this.sfxVolume * 0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.022);
    } catch {
      // Audio safety
    }
  }

  /**
   * Tactile button click sound
   */
  public playButtonClick() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

      gain.gain.setValueAtTime(this.sfxVolume * 0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Audio error safety
    }
  }

  /**
   * Sound for game start / boot: Energetic retro-arcade power-up fanfare
   * Features a punchy sub-bass transient, fast ascending neon arpeggio, and bright chord bloom.
   */
  public playGameStart() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // 1. Tactile Sub-Bass Impact Punch
      const punchOsc = ctx.createOscillator();
      const punchGain = ctx.createGain();
      punchOsc.type = 'sine';
      punchOsc.frequency.setValueAtTime(160, now);
      punchOsc.frequency.exponentialRampToValueAtTime(38, now + 0.16);

      punchGain.gain.setValueAtTime(this.sfxVolume * 0.45, now);
      punchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      punchOsc.connect(punchGain);
      punchGain.connect(ctx.destination);
      punchOsc.start(now);
      punchOsc.stop(now + 0.2);

      // 2. High-energy ascending arcade power-up arpeggio
      const notes = [
        { f: 261.63, t: 0.02, d: 0.12 }, // C4
        { f: 329.63, t: 0.06, d: 0.12 }, // E4
        { f: 392.00, t: 0.10, d: 0.12 }, // G4
        { f: 523.25, t: 0.14, d: 0.14 }, // C5
        { f: 659.25, t: 0.18, d: 0.16 }, // E5
        { f: 783.99, t: 0.22, d: 0.20 }, // G5
        { f: 1046.50, t: 0.26, d: 0.42 }, // C6 (grand finish)
      ];

      notes.forEach(({ f, t, d }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + t);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2800, now + t);

        gain.gain.setValueAtTime(0, now + t);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.32, now + t + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + d);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + t);
        osc.stop(now + t + d + 0.02);
      });

      // 3. Shimmering high harmonic layer on the final chord note
      const shimmerOsc = ctx.createOscillator();
      const shimmerGain = ctx.createGain();
      shimmerOsc.type = 'sine';
      shimmerOsc.frequency.setValueAtTime(2093.00, now + 0.26); // C7 sparkle
      shimmerGain.gain.setValueAtTime(0, now + 0.26);
      shimmerGain.gain.linearRampToValueAtTime(this.sfxVolume * 0.18, now + 0.28);
      shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 0.62);

      shimmerOsc.connect(shimmerGain);
      shimmerGain.connect(ctx.destination);
      shimmerOsc.start(now + 0.26);
      shimmerOsc.stop(now + 0.65);
    } catch {
      // Audio error safety
    }
  }

  /**
   * Resonant neon synthesizer tone for Memory Sequence tile activation
   */
  public playTileTone(tileIndex: number = 0) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const frequencies = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25, 587.33];
      const freq = frequencies[tileIndex % frequencies.length] || 330;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.45, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // Audio error safety
    }
  }

  /**
   * Harmonic pair match chime for Memory Match
   */
  public playMatchChime() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      [659.25, 987.77].forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + idx * 0.06);

        gain.gain.setValueAtTime(0, now + idx * 0.06);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.35, now + idx * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.32);
      });
    } catch {
      // Audio error safety
    }
  }

  /**
   * Low invalid-action buzz
   */
  public playInvalid() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.setValueAtTime(120, now + 0.05);

      gain.gain.setValueAtTime(this.sfxVolume * 0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.11);
    } catch {
      // Audio error safety
    }
  }

  /**
   * Sound when answering correctly in Shape Hunter
   */
  public playCorrectGeometry() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [587.33, 739.99, 880.0, 1174.66]; // D5, F#5, A5, D6 (pure bright D-major arpeggio)
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);

        gain.gain.setValueAtTime(0, now + i * 0.05);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.28, now + i * 0.05 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.26);
      });
    } catch {
      // Audio error safety
    }
  }

  /**
   * Sound when answering incorrectly in Shape Hunter
   */
  public playWrongGeometry() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.linearRampToValueAtTime(160, now + 0.22);

      gain.gain.setValueAtTime(this.sfxVolume * 0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.23);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.24);
    } catch {
      // Audio error safety
    }
  }

  /**
   * Warning tick for countdown <= 15s
   */
  public playWarningTick() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);

      gain.gain.setValueAtTime(this.sfxVolume * 0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Audio error safety
    }
  }

  /**
   * Critical warning tick for countdown <= 5s
   */
  public playCriticalTick() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(1200, now);

      gain.gain.setValueAtTime(this.sfxVolume * 0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {
      // Audio error safety
    }
  }

  /**
   * Timeout buzzer when question expires at 00:00
   */
  public playTimeoutBuzzer() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.setValueAtTime(140, now + 0.15);

      gain.gain.setValueAtTime(this.sfxVolume * 0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.42);
    } catch {
      // Audio error safety
    }
  }

  /**
   * Grand Level Victory Fanfare
   */
  public playLevelVictory() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const chords = [
        [523.25, 659.25, 783.99], // C5
        [587.33, 739.99, 880.0],  // D5
        [659.25, 830.61, 987.77], // E5
        [783.99, 987.77, 1174.66, 1567.98] // G5-B5-D6-G6 grand resolve
      ];

      chords.forEach((chord, step) => {
        const time = now + step * 0.16;
        chord.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, time);

          const duration = step === chords.length - 1 ? 0.7 : 0.22;
          gain.gain.setValueAtTime(0, time);
          gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.22, time + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(time);
          osc.stop(time + duration + 0.05);
        });
      });
    } catch {
      // Audio error safety
    }
  }

  /**
   * Ambient synthwave loop
   */
  public startAmbientMusic() {
    if (this.isMusicPlaying) return;
    const ctx = this.initContext();
    if (!ctx) return;

    this.isMusicPlaying = true;
    try {
      this.musicGainNode = ctx.createGain();
      const targetGain = this.isMuted ? 0 : this.musicVolume * this.sfxVolume * 0.12;
      this.musicGainNode.gain.setValueAtTime(targetGain, ctx.currentTime);
      this.musicGainNode.connect(ctx.destination);

      // Play soft synth chords cycling every 4 seconds
      const chordProgression = [
        [130.81, 196.0, 246.94], // C3, G3, B3
        [110.0, 164.81, 220.0],  // A2, E3, A3
        [146.83, 220.0, 293.66], // D3, A3, D4
        [123.47, 185.0, 246.94], // B2, F#3, B3
      ];

      let chordIndex = 0;
      const playStep = () => {
        if (!this.isMusicPlaying || !this.ctx) return;
        const currentChord = chordProgression[chordIndex % chordProgression.length];
        chordIndex++;

        // Stop previous chord oscillators
        this.musicOscillators.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {}
        });
        this.musicOscillators = [];

        const now = this.ctx.currentTime;
        currentChord.forEach((f) => {
          if (!this.ctx || !this.musicGainNode) return;
          const osc = this.ctx.createOscillator();
          const filter = this.ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(450, now);

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, now);

          osc.connect(filter);
          filter.connect(this.musicGainNode);
          osc.start(now);
          this.musicOscillators.push(osc);
        });
      };

      playStep();
      this.musicInterval = setInterval(playStep, 4000);
    } catch {
      // Audio error safety
    }
  }

  public stopAmbientMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.musicOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });
    this.musicOscillators = [];
  }
}

export const sound = new SoundEngine();
