// 37mm Anti-Aircraft Cannon & Crosshair Entity

export class CannonEntity {
  public x: number = 0;
  public y: number = 0;
  public angle: number = -Math.PI / 2;
  public targetAngle: number = -Math.PI / 2;
  public recoilOffset: number = 0;
  public muzzleFlash: number = 0;
  public barrelLength: number = 65;
  public barrelWidth: number = 8;

  constructor() {}

  public setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public aimAt(mouseX: number, mouseY: number) {
    // Clamp cannon aiming angle (cannot point underground)
    const rawAngle = Math.atan2(mouseY - this.y, mouseX - this.x);
    // Limit angle between -165 deg and -15 deg
    const minAngle = -Math.PI * 0.92;
    const maxAngle = -Math.PI * 0.08;
    this.targetAngle = Math.max(minAngle, Math.min(maxAngle, rawAngle));
  }

  public triggerRecoil() {
    this.recoilOffset = 14;
    this.muzzleFlash = 4;
  }

  public update() {
    // Smooth angle interpolation
    this.angle += (this.targetAngle - this.angle) * 0.25;

    // Recoil recovery
    if (this.recoilOffset > 0) {
      this.recoilOffset *= 0.75;
      if (this.recoilOffset < 0.1) this.recoilOffset = 0;
    }

    if (this.muzzleFlash > 0) {
      this.muzzleFlash--;
    }
  }

  public draw(ctx: CanvasRenderingContext2D, mouseX: number, mouseY: number, isFlakReady = false) {
    // 1. Draw Optical Crosshair HUD at Mouse Cursor
    this.drawCrosshair(ctx, mouseX, mouseY, isFlakReady);

    // 2. Draw 37mm Cannon Emplacement
    ctx.save();
    ctx.translate(this.x, this.y);

    // Turntable Base (Bệ pháo phòng không)
    ctx.fillStyle = '#2d3b27';
    ctx.beginPath();
    ctx.arc(0, 15, 45, Math.PI, 0);
    ctx.fill();
    ctx.strokeStyle = '#182114';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Sandbags / Armor Shield
    ctx.fillStyle = '#44563a';
    ctx.fillRect(-50, 12, 100, 25);
    ctx.strokeStyle = '#1c2419';
    ctx.strokeRect(-50, 12, 100, 25);

    // Cannon Pivot & Barrels (Xoay theo nòng pháo)
    ctx.rotate(this.angle);

    // Recoiling Twin Barrels (2 nòng pháo 37mm)
    const effectiveBarrelLen = this.barrelLength - this.recoilOffset;
    ctx.fillStyle = '#1c2419';

    // Barrel 1
    ctx.fillRect(0, -this.barrelWidth - 2, effectiveBarrelLen, this.barrelWidth);
    // Muzzle Brake (Loa che lửa đầu nòng)
    ctx.fillStyle = '#3a4b32';
    ctx.fillRect(effectiveBarrelLen - 8, -this.barrelWidth - 4, 10, this.barrelWidth + 4);

    // Barrel 2
    ctx.fillStyle = '#1c2419';
    ctx.fillRect(0, 2, effectiveBarrelLen, this.barrelWidth);
    // Muzzle Brake 2
    ctx.fillStyle = '#3a4b32';
    ctx.fillRect(effectiveBarrelLen - 8, 0, 10, this.barrelWidth + 4);

    // Muzzle Flash
    if (this.muzzleFlash > 0) {
      ctx.save();
      ctx.fillStyle = this.muzzleFlash > 2 ? '#ffff66' : '#ff9900';
      ctx.shadowColor = '#ff3300';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(effectiveBarrelLen + 10, -2, 16 + Math.random() * 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Cannon Turret Cap & Gunner Viewfinder
    ctx.fillStyle = '#37472f';
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#151c12';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Red Star Decal (Ngôi sao vàng / đỏ chiến sĩ Điện Biên)
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private drawCrosshair(ctx: CanvasRenderingContext2D, x: number, y: number, isFlak: boolean) {
    ctx.save();
    ctx.strokeStyle = isFlak ? '#ff9900' : '#00ff66';
    ctx.fillStyle = isFlak ? '#ff9900' : '#00ff66';
    ctx.lineWidth = 1.5;

    // Outer Circle with Stadiametric Range Finder
    ctx.beginPath();
    ctx.arc(x, y, 32, 0, Math.PI * 2);
    ctx.stroke();

    // Inner Dot
    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Crosshairs
    const lineLen = 18;
    ctx.beginPath();
    // Top
    ctx.moveTo(x, y - 10);
    ctx.lineTo(x, y - 10 - lineLen);
    // Bottom
    ctx.moveTo(x, y + 10);
    ctx.lineTo(x, y + 10 + lineLen);
    // Left
    ctx.moveTo(x - 10, y);
    ctx.lineTo(x - 10 - lineLen, y);
    // Right
    ctx.moveTo(x + 10, y);
    ctx.lineTo(x + 10 + lineLen, y);
    ctx.stroke();

    // Lead Angle Lead Circles for Aircraft interception
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(x, y, 56, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Rangefinder text
    ctx.font = '10px "Space Grotesk", monospace';
    ctx.fillText(isFlak ? 'FLAK 37MM [SẴN SÀNG]' : 'PHÁO 37MM', x + 38, y - 20);

    ctx.restore();
  }
}
