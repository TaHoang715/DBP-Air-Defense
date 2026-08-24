// Web Audio API Procedural Sound Engine for Dien Bien Phu Air Defense Game

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private bgmInterval: number | null = null;
  private bgmGain: GainNode | null = null;
  private isBgmPlaying: boolean = false;

  constructor() {
    // Lazy initialize on first user interaction
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime);
    }
    if (this.isMuted) {
      this.stopBgm();
    } else if (this.isBgmPlaying) {
      this.startBgm();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // 1. Pháo cao xạ 37mm khai hỏa (Heavy Anti-Aircraft Cannon Shot)
  public playCannonShot(isFlak = false) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;

    // Sub-bass thump
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = isFlak ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(isFlak ? 160 : 120, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.28);

    gain.gain.setValueAtTime(0.9, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.28);

    // Muzzle blast noise
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.25);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(isFlak ? 2000 : 1300, now);
    noiseFilter.frequency.linearRampToValueAtTime(200, now + 0.22);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.85, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.start(now);
    noise.stop(now + 0.22);
  }

  // 2. Tiếng đạn trúng thân máy bay (Metal Armor Hit)
  public playHitSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(650, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  // 3. Tiếng máy bay nổ tung & lao dốc (Explosion & Falling Dive Whistle)
  public playPlaneDownAlarm() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;

    // Dramatic dive whistle
    const diveOsc = this.ctx.createOscillator();
    const diveGain = this.ctx.createGain();
    diveOsc.type = 'sawtooth';
    diveOsc.frequency.setValueAtTime(950, now);
    diveOsc.frequency.exponentialRampToValueAtTime(120, now + 1.3);

    diveGain.gain.setValueAtTime(0.4, now);
    diveGain.gain.linearRampToValueAtTime(0.6, now + 0.9);
    diveGain.gain.exponentialRampToValueAtTime(0.01, now + 1.3);

    diveOsc.connect(diveGain);
    diveGain.connect(this.masterGain);
    diveOsc.start(now);
    diveOsc.stop(now + 1.3);

    // Deep crash explosion
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.9);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(800, now + 0.2);
    noiseFilter.frequency.exponentialRampToValueAtTime(80, now + 1.0);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.9, now + 0.2);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 1.0);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.start(now + 0.2);
    noise.stop(now + 1.0);
  }

  // 4. Còi báo động phòng không xuất kích (Air Raid Siren)
  public playAirRaidSiren() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.linearRampToValueAtTime(880, now + 0.6);
    osc.frequency.linearRampToValueAtTime(440, now + 1.2);
    osc.frequency.linearRampToValueAtTime(880, now + 1.8);
    osc.frequency.linearRampToValueAtTime(440, now + 2.4);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.3);
    gain.gain.linearRampToValueAtTime(0.4, now + 2.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 2.5);
  }

  // 5. Trả lời đúng trắc nghiệm (Chime + Chime harmonic)
  public playQuizSuccess() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Major arpeggio)
    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(0.35, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.35);
    });
  }

  // 6. Trả lời sai (Buzz low sound)
  public playQuizWrong() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.linearRampToValueAtTime(110, now + 0.3);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  // 7. Nhạc nền hành khúc phòng không (Procedural Background March)
  public startBgm() {
    if (this.isMuted || this.bgmInterval) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    this.isBgmPlaying = true;
    const tempo = 120; // 120 BPM
    const stepTime = 60 / tempo / 2; // Eighth note

    // Patriotic Vietnamese march motifs (in D minor / F major pentatonic)
    const melodyNotes = [
      293.66, 0, 349.23, 392.00, 440.00, 0, 392.00, 349.23,
      293.66, 349.23, 440.00, 523.25, 587.33, 0, 523.25, 440.00,
      392.00, 440.00, 523.25, 392.00, 349.23, 0, 293.66, 0,
      349.23, 392.00, 440.00, 523.25, 587.33, 523.25, 440.00, 349.23
    ];
    let step = 0;

    this.bgmInterval = window.setInterval(() => {
      if (this.isMuted || !this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      const freq = melodyNotes[step % melodyNotes.length];

      if (freq > 0) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + stepTime * 0.9);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + stepTime * 0.9);
      }

      // March snare drum tap every 2 steps
      if (step % 2 === 0) {
        const snareOsc = this.ctx.createOscillator();
        const snareGain = this.ctx.createGain();
        snareOsc.type = 'sine';
        snareOsc.frequency.setValueAtTime(100, now);
        snareOsc.frequency.exponentialRampToValueAtTime(40, now + 0.05);

        snareGain.gain.setValueAtTime(0.12, now);
        snareGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        snareOsc.connect(snareGain);
        snareGain.connect(this.masterGain);
        snareOsc.start(now);
        snareOsc.stop(now + 0.05);
      }

      step++;
    }, stepTime * 1000);
  }

  public stopBgm() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    this.isBgmPlaying = false;
  }
}

export const sound = new SoundEngine();
