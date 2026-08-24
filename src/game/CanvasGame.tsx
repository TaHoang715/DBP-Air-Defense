import React, { useRef, useEffect, useCallback } from 'react';
import { ParticleSystem } from './ParticleSystem';
import { PlaneEntity } from './PlaneEntity';
import { CannonEntity } from './CannonEntity';
import { HISTORICAL_PLANES } from '../data/planesData';
import type { HistoricalPlane } from '../data/planesData';
import { sound } from '../audio/SoundEngine';

interface CanvasGameProps {
  isPlaying: boolean;
  isPaused: boolean;
  ammo37mm: number;
  ammoFlak: number;
  useFlak: boolean;
  elapsedSeconds: number;
  onConsumeAmmo: (isFlak: boolean) => boolean;
  onPlaneDowned: (plane: HistoricalPlane) => void;
  onScoreGained: (points: number) => void;
  onNeedAmmo: () => void;
}

export const CanvasGame: React.FC<CanvasGameProps> = ({
  isPlaying,
  isPaused,
  ammo37mm,
  ammoFlak,
  useFlak,
  elapsedSeconds,
  onConsumeAmmo,
  onPlaneDowned,
  onScoreGained,
  onNeedAmmo
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particleSystemRef = useRef<ParticleSystem>(new ParticleSystem());
  const cannonRef = useRef<CannonEntity>(new CannonEntity());
  const planesRef = useRef<PlaneEntity[]>([]);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastSpawnTimeRef = useRef<number>(0);
  const animFrameIdRef = useRef<number>(0);
  const searchlightAngleRef = useRef<number>(0);
  const screenShakeRef = useRef<number>(0);

  // Handle Mouse Aiming
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    mousePosRef.current = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
    cannonRef.current.aimAt(mousePosRef.current.x, mousePosRef.current.y);
  };

  // Handle Touch Aiming
  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || e.touches.length === 0) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    mousePosRef.current = {
      x: (e.touches[0].clientX - rect.left) * scaleX,
      y: (e.touches[0].clientY - rect.top) * scaleY
    };
    cannonRef.current.aimAt(mousePosRef.current.x, mousePosRef.current.y);
  };

  // Fire Cannon
  const handleFire = useCallback(() => {
    if (!isPlaying || isPaused) return;

    // Check ammo
    const currentAmmo = useFlak ? ammoFlak : ammo37mm;
    if (currentAmmo <= 0) {
      sound.playQuizWrong();
      onNeedAmmo();
      return;
    }

    const consumed = onConsumeAmmo(useFlak);
    if (!consumed) return;

    // Fire sound & animation
    sound.playCannonShot(useFlak);
    cannonRef.current.triggerRecoil();
    screenShakeRef.current = useFlak ? 8 : 4;

    // Bullet origin from cannon
    const startX = cannonRef.current.x;
    const startY = cannonRef.current.y - 20;
    const targetX = mousePosRef.current.x;
    const targetY = mousePosRef.current.y;

    particleSystemRef.current.fireBullet(startX, startY, targetX, targetY, useFlak);
  }, [isPlaying, isPaused, ammo37mm, ammoFlak, useFlak, onConsumeAmmo, onNeedAmmo]);

  // Main 60 FPS Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas
    const handleResize = () => {
      if (!canvas) return;
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      cannonRef.current.setPosition(canvas.width / 2, canvas.height - 35);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const loop = (timestamp: number) => {
      if (isPlaying && !isPaused) {
        // 1. Spawn Aircraft (Interval shrinks dynamically as match progresses)
        const spawnInterval = Math.max(1700 - elapsedSeconds * 7, 750);
        if (timestamp - lastSpawnTimeRef.current > spawnInterval) {
          lastSpawnTimeRef.current = timestamp;
          const randomPlaneData = HISTORICAL_PLANES[Math.floor(Math.random() * HISTORICAL_PLANES.length)];
          const newPlane = new PlaneEntity(randomPlaneData, canvas.width, canvas.height, elapsedSeconds);
          planesRef.current.push(newPlane);
        }

        // 2. Update Cannon & Particle Systems
        cannonRef.current.update();
        particleSystemRef.current.update();
        searchlightAngleRef.current += 0.015;

        // Screen Shake Decay
        if (screenShakeRef.current > 0) {
          screenShakeRef.current *= 0.88;
          if (screenShakeRef.current < 0.1) screenShakeRef.current = 0;
        }

        // 3. Move Bullets & Check Hit Collisions
        const bullets = particleSystemRef.current.bullets;
        for (let bIdx = bullets.length - 1; bIdx >= 0; bIdx--) {
          const b = bullets[bIdx];
          b.x += b.vx;
          b.y += b.vy;
          b.distanceTraveled += b.speed;

          let bulletHit = false;

          // Check hit against active planes
          for (let pIdx = planesRef.current.length - 1; pIdx >= 0; pIdx--) {
            const plane = planesRef.current[pIdx];
            if (plane.checkHit(b.x, b.y, b.isFlak ? 45 : 24)) {
              bulletHit = true;
              sound.playHitSound();

              const downed = plane.takeDamage(b.isFlak ? 3 : 1, particleSystemRef.current);
              if (downed) {
                sound.playPlaneDownAlarm();
                screenShakeRef.current = 12;
                onScoreGained(plane.data.baseScore);
                onPlaneDowned(plane.data);
              }
              break;
            }
          }

          // Flak detonation
          if (bulletHit || b.distanceTraveled >= b.totalDistance) {
            if (b.isFlak) {
              particleSystemRef.current.createFlakBurst(b.x, b.y, true);
            }
            bullets.splice(bIdx, 1);
          }
        }

        // 4. Update Planes & Clean Out-of-Bounds
        for (let pIdx = planesRef.current.length - 1; pIdx >= 0; pIdx--) {
          const plane = planesRef.current[pIdx];
          const isAlive = plane.update(canvas.width, canvas.height, particleSystemRef.current);
          if (!isAlive) {
            planesRef.current.splice(pIdx, 1);
          }
        }
      }

      // ═══ 5. RENDERING ═══
      ctx.save();

      // Screen Shake offset
      if (screenShakeRef.current > 0) {
        const shakeX = (Math.random() - 0.5) * screenShakeRef.current * 2;
        const shakeY = (Math.random() - 0.5) * screenShakeRef.current * 2;
        ctx.translate(shakeX, shakeY);
      }

      // 5.1 Atmospheric Night Sky Gradient of Muong Thanh Basin
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGrad.addColorStop(0, '#090f0a');
      skyGrad.addColorStop(0.5, '#121c13');
      skyGrad.addColorStop(1, '#1b291a');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 5.2 Antiaircraft Searchlight Beams Sweeping Across the Clouds
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const beamX1 = canvas.width * 0.25;
      const beamX2 = canvas.width * 0.75;
      const angle1 = Math.sin(searchlightAngleRef.current) * 0.45 - 0.2;
      const angle2 = Math.cos(searchlightAngleRef.current * 0.8) * 0.45 + 0.2;

      // Beam 1
      ctx.beginPath();
      ctx.moveTo(beamX1, canvas.height - 30);
      ctx.lineTo(beamX1 + Math.tan(angle1) * (canvas.height - 50) - 80, 0);
      ctx.lineTo(beamX1 + Math.tan(angle1) * (canvas.height - 50) + 80, 0);
      ctx.closePath();
      const beamGrad1 = ctx.createLinearGradient(beamX1, canvas.height - 30, beamX1, 0);
      beamGrad1.addColorStop(0, 'rgba(255, 240, 180, 0.22)');
      beamGrad1.addColorStop(1, 'rgba(255, 240, 180, 0.01)');
      ctx.fillStyle = beamGrad1;
      ctx.fill();

      // Beam 2
      ctx.beginPath();
      ctx.moveTo(beamX2, canvas.height - 30);
      ctx.lineTo(beamX2 + Math.tan(angle2) * (canvas.height - 50) - 90, 0);
      ctx.lineTo(beamX2 + Math.tan(angle2) * (canvas.height - 50) + 90, 0);
      ctx.closePath();
      const beamGrad2 = ctx.createLinearGradient(beamX2, canvas.height - 30, beamX2, 0);
      beamGrad2.addColorStop(0, 'rgba(200, 255, 220, 0.18)');
      beamGrad2.addColorStop(1, 'rgba(200, 255, 220, 0.01)');
      ctx.fillStyle = beamGrad2;
      ctx.fill();
      ctx.restore();

      // 5.3 Distant Mountain Ranges of Dien Bien (Him Lam, Doc Lap, A1)
      ctx.fillStyle = '#0f1710';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 70);
      ctx.lineTo(canvas.width * 0.15, canvas.height - 140);
      ctx.lineTo(canvas.width * 0.35, canvas.height - 85);
      ctx.lineTo(canvas.width * 0.55, canvas.height - 170);
      ctx.lineTo(canvas.width * 0.75, canvas.height - 100);
      ctx.lineTo(canvas.width * 0.9, canvas.height - 150);
      ctx.lineTo(canvas.width, canvas.height - 80);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();

      // Foreground Trench Mound
      ctx.fillStyle = '#0a100a';
      ctx.beginPath();
      ctx.ellipse(canvas.width / 2, canvas.height - 10, canvas.width * 0.6, 60, 0, 0, Math.PI * 2);
      ctx.fill();

      // 5.4 Render Aircraft
      for (const plane of planesRef.current) {
        plane.draw(ctx);
      }

      // 5.5 Render Particle Systems (Bullets, Tracers, Flak Smoke, Shrapnel)
      particleSystemRef.current.draw(ctx);

      // 5.6 Render 37mm Anti-Aircraft Cannon Unit & Optical Crosshair HUD
      cannonRef.current.draw(ctx, mousePosRef.current.x, mousePosRef.current.y, useFlak);

      ctx.restore();

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isPlaying, isPaused, elapsedSeconds, useFlak, onScoreGained, onPlaneDowned]);

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onClick={handleFire}
      className="w-full h-full cursor-crosshair block touch-none"
    />
  );
};
