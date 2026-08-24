// Canvas 2D Particle Engine for Dien Bien Phu Air Defense

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'smoke' | 'fire' | 'spark' | 'debris' | 'tracer';
  alpha: number;
}

export interface Bullet {
  id: string;
  startX: number;
  startY: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  speed: number;
  isFlak: boolean;
  distanceTraveled: number;
  totalDistance: number;
}

export class ParticleSystem {
  public particles: Particle[] = [];
  public bullets: Bullet[] = [];
  public screenShake: number = 0;

  public addScreenShake(amount: number) {
    this.screenShake = Math.min(this.screenShake + amount, 20);
  }

  // Create AA Cannon Tracer Bullet
  public fireBullet(startX: number, startY: number, targetX: number, targetY: number, isFlak = false): Bullet {
    const dx = targetX - startX;
    const dy = targetY - startY;
    const dist = Math.hypot(dx, dy);
    const speed = isFlak ? 26 : 32;

    const bullet: Bullet = {
      id: Math.random().toString(36).substring(2, 9),
      startX,
      startY,
      x: startX,
      y: startY,
      targetX,
      targetY,
      vx: (dx / dist) * speed,
      vy: (dy / dist) * speed,
      speed,
      isFlak,
      distanceTraveled: 0,
      totalDistance: dist
    };

    this.bullets.push(bullet);
    this.addScreenShake(isFlak ? 4 : 2);
    return bullet;
  }

  // Flak Explosion Burst at detonation point
  public createFlakBurst(x: number, y: number, isBig = false) {
    const count = isBig ? 40 : 25;
    this.addScreenShake(isBig ? 12 : 6);

    // Fire sparks
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * (isBig ? 8 : 5) + 1;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: Math.random() * 20 + 20,
        size: Math.random() * 5 + 3,
        color: Math.random() > 0.4 ? '#ffcc00' : '#ff4500',
        type: 'fire',
        alpha: 1
      });
    }

    // Heavy black flak smoke
    const smokeCount = isBig ? 20 : 12;
    for (let i = 0; i < smokeCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 0.5;
      this.particles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.3,
        life: 1,
        maxLife: Math.random() * 35 + 40,
        size: Math.random() * 14 + 10,
        color: '#2a2a2a',
        type: 'smoke',
        alpha: 0.8
      });
    }
  }

  // Engine Smoke Trail for hit aircraft
  public addPlaneSmoke(x: number, y: number, isFiery = false) {
    this.particles.push({
      x: x + (Math.random() - 0.5) * 8,
      y: y + (Math.random() - 0.5) * 8,
      vx: (Math.random() - 0.5) * 1.5,
      vy: Math.random() * 1.2 + 0.5,
      life: 1,
      maxLife: Math.random() * 25 + 25,
      size: Math.random() * 8 + 6,
      color: isFiery ? (Math.random() > 0.5 ? '#ff4500' : '#ffaa00') : '#1a1a1a',
      type: isFiery ? 'fire' : 'smoke',
      alpha: 0.7
    });
  }

  // Update physics & lifespan
  public update() {
    // Decay screen shake
    if (this.screenShake > 0) {
      this.screenShake *= 0.88;
      if (this.screenShake < 0.1) this.screenShake = 0;
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life++;

      // Expanding smoke
      if (p.type === 'smoke') {
        p.size += 0.3;
        p.alpha = Math.max(0, 1 - (p.life / p.maxLife));
      } else if (p.type === 'fire') {
        p.size = Math.max(1, p.size * 0.94);
        p.alpha = Math.max(0, 1 - (p.life / p.maxLife));
      }

      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
      }
    }
  }

  // Render on Canvas
  public draw(ctx: CanvasRenderingContext2D) {
    // 1. Draw bullets & tracer glowing lines
    for (const b of this.bullets) {
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = b.isFlak ? '#ff9900' : '#ffe600';
      ctx.lineWidth = b.isFlak ? 4 : 2.5;
      ctx.shadowColor = b.isFlak ? '#ff4500' : '#ffff00';
      ctx.shadowBlur = 10;

      // Draw tracer line from slightly behind to head
      const trailLength = 25;
      const angle = Math.atan2(b.vy, b.vx);
      const tailX = b.x - Math.cos(angle) * trailLength;
      const tailY = b.y - Math.sin(angle) * trailLength;

      ctx.moveTo(tailX, tailY);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();

      // Glowing tip
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.isFlak ? 3.5 : 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 2. Draw particles
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}
