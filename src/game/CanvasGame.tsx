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

  // Handle Mouse / Touch Aiming
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

    // Bullet origin from cannon
    const startX = cannonRef.current.x;
    const startY = cannonRef.current.y - 20;
    const targetX = mousePosRef.current.x;
    const targetY = mousePosRef.current.y;

    particleSystemRef.current.fireBullet(startX, startY, targetX, targetY, useFlak);
  }, [isPlaying, isPaused, ammo37mm, ammoFlak, useFlak, onConsumeAmmo, onNeedAmmo]);

  // Main Game Loop (60 FPS)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to parent container
    const handleResize = () => {
      if (!canvas) return;
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      cannonRef.current.setPosition(canvas.width / 2, canvas.height - 40);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const loop = (timestamp: number) => {
      if (isPlaying && !isPaused) {
        // 1. Spawn Aircraft at dynamic intervals (Interval shrinks as game progresses)
        const spawnInterval = Math.max(1800 - elapsedSeconds * 8, 800);
        if (timestamp - lastSpawnTimeRef.current > spawnInterval) {
          lastSpawnTimeRef.current = timestamp;
          // Pick random plane from historical catalog
          const randomPlaneData = HISTORICAL_PLANES[Math.floor(Math.random() * HISTORICAL_PLANES.length)];
          const newPlane = new PlaneEntity(randomPlaneData, canvas.width, canvas.height, elapsedSeconds);
          planesRef.current.push(newPlane);
        }

        // 2. Update Cannon & Particles
        cannonRef.current.update();
        particleSystemRef.current.update();

        // 3. Update & Move Bullets & Check Collisions
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
            if (plane.checkHit(b.x, b.y, b.isFlak ? 40 : 20)) {
              bulletHit = true;
              sound.playHitSound();

              const downed = plane.takeDamage(b.isFlak ? 3 : 1, particleSystemRef.current);
              if (downed) {
                sound.playPlaneDownAlarm();
                onScoreGained(plane.data.baseScore);
                onPlaneDowned(plane.data);
              }
              break;
            }
          }

          // Flak detonation at target distance or hit
          if (bulletHit || b.distanceTraveled >= b.totalDistance) {
            if (b.isFlak) {
              particleSystemRef.current.createFlakBurst(b.x, b.y, true);
            }
            bullets.splice(bIdx, 1);
          }
        }

        // 4. Update Planes
        for (let i = planesRef.current.length - 1; i >= 0; i--) {
          const plane = planesRef.current[i];
          const isAlive = plane.update(canvas.width, canvas.height, particleSystemRef.current);
          if (!isAlive && plane.state !== 'FALLING') {
            planesRef.current.splice(i, 1);
          }
        }
      }

      // ═══ RENDER SCENE ═══
      ctx.save();

      // Screen Shake offset
      if (particleSystemRef.current.screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * particleSystemRef.current.screenShake;
        const shakeY = (Math.random() - 0.5) * particleSystemRef.current.screenShake;
        ctx.translate(shakeX, shakeY);
      }

      // A. Sky & Atmospheric Battlefield
      const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGradient.addColorStop(0, '#101710');
      skyGradient.addColorStop(0.5, '#1e291b');
      skyGradient.addColorStop(0.85, '#2e3d29');
      skyGradient.addColorStop(1, '#3b2f21');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Distant mountain silhouettes (Đồi Him Lam, Bản Kéo, Dãy Phăng-sĩ-păng)
      ctx.fillStyle = 'rgba(15, 22, 14, 0.7)';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.7);
      ctx.lineTo(canvas.width * 0.25, canvas.height * 0.58);
      ctx.lineTo(canvas.width * 0.55, canvas.height * 0.65);
      ctx.lineTo(canvas.width * 0.85, canvas.height * 0.54);
      ctx.lineTo(canvas.width, canvas.height * 0.68);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();

      // Closer trench line & sandbags (Trận địa chiến hào)
      ctx.fillStyle = '#261e15';
      ctx.fillRect(0, canvas.height - 85, canvas.width, 85);
      ctx.fillStyle = '#3a2d1f';
      ctx.fillRect(0, canvas.height - 70, canvas.width, 70);

      // B. Draw Airplanes
      for (const plane of planesRef.current) {
        plane.draw(ctx);
      }

      // C. Draw Bullets & Particle FX
      particleSystemRef.current.draw(ctx);

      // D. Draw 37mm Anti-Aircraft Cannon & Crosshair
      cannonRef.current.draw(ctx, mousePosRef.current.x, mousePosRef.current.y, useFlak);

      ctx.restore();

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [isPlaying, isPaused, elapsedSeconds, useFlak, onConsumeAmmo, onPlaneDowned, onScoreGained, onNeedAmmo]);

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onClick={handleFire}
      className="w-full h-full block select-none game-crosshair touch-none"
    />
  );
};
