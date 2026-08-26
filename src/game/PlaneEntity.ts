import type { HistoricalPlane } from '../data/planesData';
import { ParticleSystem } from './ParticleSystem';

export class PlaneEntity {
  public id: string;
  public data: HistoricalPlane;
  public x: number;
  public y: number;
  public width: number = 70;
  public height: number = 30;
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

    // Scale dimensions based on aircraft category
    if (data.aircraftType === 'B52') {
      this.width = 120;
      this.height = 36;
    } else if (data.aircraftType === 'SWING_WING') {
      this.width = 78;
      this.height = 28;
    } else if (data.aircraftType === 'HELICOPTER') {
      this.width = 80;
      this.height = 32;
    } else if (data.aircraftType === 'DRONE') {
      this.width = 52;
      this.height = 20;
    } else {
      this.width = 72;
      this.height = 26;
    }

    // Start off screen
    this.x = this.direction === 1 ? -this.width - 20 : canvasWidth + 20;
    // Spawn at upper altitude (between 10% and 52% of canvas height)
    this.altitudeY = Math.random() * (canvasHeight * 0.42) + canvasHeight * 0.10;
    this.y = this.altitudeY;

    // Velocity Curve: Speed increases as match progresses
    const velocityMultiplier = 1 + Math.min(elapsedSeconds * 0.006, 1.6);
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
      this.fallVy = 1.6;
      particles.createFlakBurst(this.x, this.y, true);
      return true; // Downed!
    } else {
      this.state = 'SMOKING';
      particles.createFlakBurst(this.x, this.y, false);
      return false; // Damaged
    }
  }

  public update(canvasWidth: number, canvasHeight: number, particles: ParticleSystem): boolean {
    this.propAngle += 0.6;

    if (this.state === 'FLYING' || this.state === 'SMOKING') {
      this.x += this.direction * this.speed;
      // Slight atmospheric bobbing
      this.y = this.altitudeY + Math.sin(this.x * 0.025) * 4;

      if (this.state === 'SMOKING') {
        particles.addPlaneSmoke(this.x - this.direction * (this.width * 0.35), this.y, true);
      }

      // Check if escaped canvas
      if (this.direction === 1 && this.x > canvasWidth + this.width + 40) return false;
      if (this.direction === -1 && this.x < -this.width - 40) return false;
    } else if (this.state === 'FALLING') {
      // Spiraling nose dive into the ground
      this.x += this.direction * (this.speed * 0.4);
      this.fallVy += 0.22;
      this.y += this.fallVy;
      this.rotation += this.direction * 0.07;

      particles.addPlaneSmoke(this.x, this.y, true);
      particles.addPlaneSmoke(this.x - 5, this.y - 5, false);

      // Hit the ground
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

    const { colorScheme, aircraftType } = this.data;

    // ═══ 1. RENDER B-52 STRATOFORTRESS HEAVY BOMBER ═══
    if (aircraftType === 'B52') {
      // Fuselage
      ctx.fillStyle = colorScheme.body;
      ctx.beginPath();
      ctx.ellipse(0, 0, this.width * 0.5, this.height * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Swept Back Wings
      ctx.fillStyle = colorScheme.wing;
      ctx.beginPath();
      ctx.moveTo(-this.width * 0.15, -this.height * 1.8);
      ctx.lineTo(this.width * 0.15, -this.height * 0.2);
      ctx.lineTo(this.width * 0.1, this.height * 1.8);
      ctx.lineTo(-this.width * 0.25, this.height * 1.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // 8 Jet Engines (4 twin pods)
      ctx.fillStyle = '#111';
      ctx.fillRect(-this.width * 0.1, -this.height * 1.1, 14, 5);
      ctx.fillRect(-this.width * 0.1, -this.height * 0.6, 14, 5);
      ctx.fillRect(-this.width * 0.1, this.height * 0.6, 14, 5);
      ctx.fillRect(-this.width * 0.1, this.height * 1.1, 14, 5);

      // Jet Engine Afterburner / Exhaust trail
      ctx.fillStyle = 'rgba(255, 140, 0, 0.4)';
      ctx.fillRect(-this.width * 0.25, -this.height * 1.1 + 1, 10, 3);
      ctx.fillRect(-this.width * 0.25, -this.height * 0.6 + 1, 10, 3);
      ctx.fillRect(-this.width * 0.25, this.height * 0.6 + 1, 10, 3);
      ctx.fillRect(-this.width * 0.25, this.height * 1.1 + 1, 10, 3);

      // Tail Fin
      ctx.fillStyle = colorScheme.wing;
      ctx.beginPath();
      ctx.moveTo(-this.width * 0.4, 0);
      ctx.lineTo(-this.width * 0.55, -this.height * 1.1);
      ctx.lineTo(-this.width * 0.45, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Cockpit Window
      ctx.fillStyle = colorScheme.cockpit;
      ctx.beginPath();
      ctx.ellipse(this.width * 0.35, -this.height * 0.12, 10, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // US Star Insignia on Wing
      const starX = 0;
      const starY = -this.height * 1.1;
      ctx.fillStyle = '#002868';
      ctx.beginPath();
      ctx.arc(starX, starY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(starX, starY, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#bf0a30';
      ctx.fillRect(starX - 6, starY - 1, 12, 2);
    }
    // ═══ 2. RENDER HH-53 HEAVY RESCUE HELICOPTER ═══
    else if (aircraftType === 'HELICOPTER') {
      // Helicopter Body
      ctx.fillStyle = colorScheme.body;
      ctx.beginPath();
      ctx.ellipse(0, 0, this.width * 0.4, this.height * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Tail Boom & Tail Rotor
      ctx.fillStyle = colorScheme.wing;
      ctx.fillRect(-this.width * 0.55, -3, this.width * 0.35, 6);
      ctx.beginPath();
      ctx.moveTo(-this.width * 0.55, -3);
      ctx.lineTo(-this.width * 0.58, -14);
      ctx.lineTo(-this.width * 0.52, -3);
      ctx.closePath();
      ctx.fill();

      // Main Rotor Spinning Blur on Top
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(0, -this.height * 0.75, this.width * 0.65, 4, this.propAngle, 0, Math.PI * 2);
      ctx.stroke();

      // Cockpit
      ctx.fillStyle = colorScheme.cockpit;
      ctx.beginPath();
      ctx.ellipse(this.width * 0.25, -2, 8, 6, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    // ═══ 3. RENDER JET FIGHTER / SWING WING / DRONE ═══
    else {
      // Sleek Jet Fuselage
      ctx.fillStyle = colorScheme.body;
      ctx.beginPath();
      ctx.ellipse(0, 0, this.width / 2, this.height / 2.3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Jet Delta / Swept Wings
      ctx.fillStyle = colorScheme.wing;
      ctx.beginPath();
      const wingSpread = aircraftType === 'SWING_WING' ? 1.4 : 1.1;
      ctx.moveTo(-this.width * 0.15, -this.height * wingSpread);
      ctx.lineTo(this.width * 0.15, -this.height * 0.15);
      ctx.lineTo(this.width * 0.05, this.height * wingSpread);
      ctx.lineTo(-this.width * 0.25, this.height * 0.9);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Tail Wing
      ctx.fillStyle = colorScheme.wing;
      ctx.beginPath();
      ctx.moveTo(-this.width * 0.38, 0);
      ctx.lineTo(-this.width * 0.55, -this.height * 0.85);
      ctx.lineTo(-this.width * 0.42, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Cockpit Glass
      ctx.fillStyle = colorScheme.cockpit;
      ctx.beginPath();
      ctx.ellipse(this.width * 0.18, -this.height * 0.12, this.width * 0.14, this.height * 0.22, 0, 0, Math.PI * 2);
      ctx.fill();

      // Jet Engine Afterburner Exhaust
      ctx.fillStyle = 'rgba(255, 165, 0, 0.6)';
      ctx.beginPath();
      ctx.ellipse(-this.width * 0.52, 0, 6, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      // US Insignia
      const starX = -this.width * 0.1;
      const starY = 0;
      ctx.fillStyle = '#002868';
      ctx.beginPath();
      ctx.arc(starX, starY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(starX, starY, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#bf0a30';
      ctx.fillRect(starX - 5, starY - 1, 10, 2);
    }

    // ═══ 4. HEALTH BAR (NẾU MÁY BAY BỊ TRÚNG ĐẠN NHƯNG CHƯA RƠI) ═══
    if (this.hp < this.maxHp && this.state !== 'FALLING') {
      const barW = 40;
      const barH = 4.5;
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(-barW / 2, -this.height - 10, barW, barH);
      ctx.fillStyle = '#ff3333';
      ctx.fillRect(-barW / 2, -this.height - 10, barW * (this.hp / this.maxHp), barH);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(-barW / 2, -this.height - 10, barW, barH);
    }

    ctx.restore();
  }
}
