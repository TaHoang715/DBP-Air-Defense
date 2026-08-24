import type { HistoricalPlane } from '../data/planesData';
import { ParticleSystem } from './ParticleSystem';

export class PlaneEntity {
  public id: string;
  public data: HistoricalPlane;
  public x: number;
  public y: number;
  public width: number = 70;
  public height: number = 32;
  public direction: number; // 1 = LTR, -1 = RTL
  public speed: number;
  public hp: number;
  public maxHp: number;
  public state: 'FLYING' | 'SMOKING' | 'FALLING' | 'DOWNED' = 'FLYING';
  public rotation: number = 0;
  public fallVy: number = 0;
  public propAngle: number = 0;
  public altitudeY: number;

  constructor(
    data: HistoricalPlane,
    canvasWidth: number,
    canvasHeight: number,
    elapsedSeconds: number
  ) {
    this.id = Math.random().toString(36).substring(2, 9);
    this.data = data;
    this.direction = Math.random() > 0.5 ? 1 : -1;
    this.width = data.id.includes('c47') || data.id.includes('c119') ? 95 : 68;
    this.height = data.id.includes('c47') || data.id.includes('c119') ? 42 : 28;

    // Start off screen
    this.x = this.direction === 1 ? -this.width - 20 : canvasWidth + 20;
    // Spawn at upper altitude (between 12% and 55% of canvas height)
    this.altitudeY = Math.random() * (canvasHeight * 0.42) + canvasHeight * 0.12;
    this.y = this.altitudeY;

    // Velocity Curve: Speed increases as match progresses!
    const velocityMultiplier = 1 + Math.min(elapsedSeconds * 0.007, 1.8);
    this.speed = data.baseSpeed * velocityMultiplier;

    this.maxHp = data.baseHp;
    this.hp = data.baseHp;
  }

  // Hitbox check
  public checkHit(bulletX: number, bulletY: number, radius = 24): boolean {
    if (this.state === 'FALLING' || this.state === 'DOWNED') return false;
    const dx = Math.abs(this.x - bulletX);
    const dy = Math.abs(this.y - bulletY);
    return dx < (this.width / 2 + radius) && dy < (this.height / 2 + radius);
  }

  // Take damage from AA fire
  public takeDamage(amount: number, particles: ParticleSystem): boolean {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.state = 'FALLING';
      this.fallVy = 1.5;
      particles.createFlakBurst(this.x, this.y, true);
      return true; // Downed!
    } else {
      this.state = 'SMOKING';
      particles.createFlakBurst(this.x, this.y, false);
      return false; // Damaged
    }
  }

  public update(canvasWidth: number, canvasHeight: number, particles: ParticleSystem): boolean {
    this.propAngle += 0.5;

    if (this.state === 'FLYING' || this.state === 'SMOKING') {
      this.x += this.direction * this.speed;
      // Slight atmospheric bobbing
      this.y = this.altitudeY + Math.sin(this.x * 0.02) * 5;

      if (this.state === 'SMOKING') {
        particles.addPlaneSmoke(this.x - this.direction * 20, this.y, true);
      }

      // Check if escaped canvas
      if (this.direction === 1 && this.x > canvasWidth + this.width + 40) return false;
      if (this.direction === -1 && this.x < -this.width - 40) return false;
    } else if (this.state === 'FALLING') {
      // Spiraling nose dive into the ground
      this.x += this.direction * (this.speed * 0.5);
      this.fallVy += 0.25;
      this.y += this.fallVy;
      this.rotation += this.direction * 0.08;

      particles.addPlaneSmoke(this.x, this.y, true);
      particles.addPlaneSmoke(this.x - 5, this.y - 5, false);

      // Hit the battlefield ground
      if (this.y >= canvasHeight - 80) {
        this.state = 'DOWNED';
        particles.createFlakBurst(this.x, canvasHeight - 70, true);
        return false;
      }
    }

    return true;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    if (this.direction === -1) {
      ctx.scale(-1, 1);
    }

    const { colorScheme } = this.data;

    // 1. Fuselage (Thân máy bay)
    ctx.fillStyle = colorScheme.body;
    ctx.beginPath();
    ctx.ellipse(0, 0, this.width / 2, this.height / 2.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // 2. Wings (Cánh chính)
    ctx.fillStyle = colorScheme.wing;
    ctx.beginPath();
    ctx.moveTo(-this.width * 0.1, -this.height * 1.3);
    ctx.lineTo(this.width * 0.15, -this.height * 0.2);
    ctx.lineTo(this.width * 0.1, this.height * 1.3);
    ctx.lineTo(-this.width * 0.15, this.height * 1.1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 3. Tail Wing (Cánh đuôi)
    ctx.fillStyle = colorScheme.wing;
    ctx.beginPath();
    ctx.moveTo(-this.width * 0.45, 0);
    ctx.lineTo(-this.width * 0.6, -this.height * 0.8);
    ctx.lineTo(-this.width * 0.48, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 4. Cockpit glass (Kính buồng lái)
    ctx.fillStyle = colorScheme.cockpit;
    ctx.beginPath();
    ctx.ellipse(this.width * 0.12, -this.height * 0.2, this.width * 0.15, this.height * 0.22, 0, 0, Math.PI * 2);
    ctx.fill();

    // 5. French Air Force Roundel (Phù hiệu không quân Pháp Cocarde: Xanh - Trắng - Đỏ)
    const roundelX = -this.width * 0.15;
    const roundelY = 0;
    // Blue outer
    ctx.fillStyle = '#002654';
    ctx.beginPath();
    ctx.arc(roundelX, roundelY, 7, 0, Math.PI * 2);
    ctx.fill();
    // White middle
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(roundelX, roundelY, 4.5, 0, Math.PI * 2);
    ctx.fill();
    // Red center
    ctx.fillStyle = '#ed2939';
    ctx.beginPath();
    ctx.arc(roundelX, roundelY, 2.2, 0, Math.PI * 2);
    ctx.fill();

    // 6. Propeller spinning blur (Cánh quạt quay phía trước)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(this.width * 0.52, 0, 3, this.height * 0.9, this.propAngle, 0, Math.PI * 2);
    ctx.stroke();

    // 7. Health bar (nếu trúng đòn còn sống)
    if (this.hp < this.maxHp && this.state !== 'FALLING') {
      const barW = 36;
      const barH = 4;
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(-barW / 2, -this.height - 8, barW, barH);
      ctx.fillStyle = '#ff4444';
      ctx.fillRect(-barW / 2, -this.height - 8, barW * (this.hp / this.maxHp), barH);
    }

    ctx.restore();
  }
}
