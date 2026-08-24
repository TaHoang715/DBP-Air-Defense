// Web Audio API Procedural Sound Engine for Dien Bien Phu Air Defense Game

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;

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
    osc.frequency.setValueAtTime(isFlak ? 150 : 120, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.25);

    gain.gain.setValueAtTime(0.9, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.25);

    // Muzzle blast noise
    const bufferSize = this.ctx.sampleRate * 0.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(isFlak ? 1800 : 1200, now);
    noiseFilter.frequency.linearRampToValueAtTime(200, now + 0.2);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.8, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.start(now);
    noise.stop(now + 0.2);
  }

  // 2. Tiếng đạn trúng máy bay (Metal Armor Hit)
  public playHitSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  // 3. Tiếng máy bay nổ tung & rơi xoay tròn (Explosion & Falling Dive)
  public playPlaneDownAlarm() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;

    // Dramatic whistle / dive
    const diveOsc = this.ctx.createOscillator();
    const diveGain = this.ctx.createGain();
    diveOsc.type = 'sawtooth';
    diveOsc.frequency.setValueAtTime(900, now);
    diveOsc.frequency.exponentialRampToValueAtTime(150, now + 1.2);

    diveGain.gain.setValueAtTime(0.4, now);
    diveGain.gain.linearRampToValueAtTime(0.6, now + 0.8);
    diveGain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);

    diveOsc.connect(diveGain);
    diveGain.connect(this.masterGain);
    diveOsc.start(now);
    diveOsc.stop(now + 1.2);

    // Deep crash explosion
    const bufferSize = this.ctx.sampleRate * 0.9;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, now + 0.2);
    filter.frequency.exponentialRampToValueAtTime(80, now + 1.2);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.01, now);
    noiseGain.gain.setValueAtTime(0.9, now + 0.3);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.start(now + 0.2);
    noise.stop(now + 1.2);
  }

  // 4. Còi Báo Động Phòng Không Điện Biên Phủ (Air Raid Siren)
  public playAirRaidSiren() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    // Modulate pitch up and down
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.linearRampToValueAtTime(750, now + 1.2);
    osc.frequency.linearRampToValueAtTime(400, now + 2.4);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.5);
    gain.gain.setValueAtTime(0.4, now + 2.0);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 2.5);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 2.5);
  }

  // 5. Trả lời đúng trắc nghiệm nạp đạn (Ammo Reload Chime)
  public playQuizSuccess() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const notes = [440, 554.37, 659.25, 880]; // A major chord
    notes.forEach((freq, i) => {
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime + i * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.3);
    });
  }

  // 6. Trả lời sai (Wrong Thud)
  public playQuizWrong() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(90, now + 0.25);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.25);
  }
}

export const sound = new SoundEngine();
