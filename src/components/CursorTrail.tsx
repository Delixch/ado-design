import React, { useEffect, useRef } from 'react';

/* ─── Types ─────────────────────────────────────────────── */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;      // 0 → 1  (1 = just born, 0 = dead)
  size: number;
  hue: number;       // slight hue variance around orange
}

/* ─── CursorTrail ────────────────────────────────────────
   Canvas overlay that follows the mouse and spawns tiny
   orange spark particles. Desktop-only (pointer:fine).     */
export const CursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: -999, y: -999 });
  const rafId = useRef<number>(0);
  const lastSpawn = useRef(0);

  useEffect(() => {
    // Only activate on devices with a fine pointer (desktop mouse),
    // and never when the user has asked for less motion.
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    /* ── Resize ── */
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    /* ── Mouse tracking ── */
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };

      const now = performance.now();
      if (now - lastSpawn.current < 16) return; // max 60fps spawn rate
      lastSpawn.current = now;

      // Spawn 4-7 particles per move event
      const count = Math.floor(Math.random() * 4) + 4;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.5 + 0.5;
        particles.current.push({
          x:    e.clientX + (Math.random() - 0.5) * 6,
          y:    e.clientY + (Math.random() - 0.5) * 6,
          vx:   Math.cos(angle) * speed * 0.6,
          vy:   Math.sin(angle) * speed - 1.2,  // slight upward bias
          life: 1,
          size: Math.random() * 3 + 1.2,
          hue:  Math.random() * 20 - 10,        // ± 10° around orange (25°)
        });
      }
    };
    window.addEventListener('mousemove', onMove);

    /* ── Animation loop ── */
    const DECAY = 0.035; // how fast particles die (lower = longer trail)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current = particles.current.filter(p => p.life > 0);

      for (const p of particles.current) {
        p.x    += p.vx;
        p.y    += p.vy;
        p.vy   += 0.08;              // gravity
        p.vx   *= 0.97;              // air resistance
        p.life -= DECAY;

        const alpha = Math.max(0, p.life);
        const r = p.size * alpha;    // shrinks as it dies

        // Inner hot core (white-ish)
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 1.8);
        grd.addColorStop(0,   `hsla(${25 + p.hue}, 100%, 85%, ${alpha * 0.9})`);
        grd.addColorStop(0.4, `hsla(${20 + p.hue}, 100%, 55%, ${alpha * 0.6})`);
        grd.addColorStop(1,   `hsla(${15 + p.hue}, 90%,  35%, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }

      rafId.current = requestAnimationFrame(draw);
    };
    rafId.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9999]"
      aria-hidden
    />
  );
};
