import React, { useEffect, useRef, useState } from 'react';
import { playGlitch } from '../lib/sound';

export const MATRIX_MODE_EVENT = 'ado:matrix-mode';

const CHARS = 'アイウエオカキクケコサシスセソ01337FF5A1F';

/** Vollbild-"Regen" fuer ein paar Sekunden — angestossen vom
 *  versteckten App-Icon im Hero-Telefon. Schaltet sich selbst
 *  wieder ab, kein Klick zum Schliessen noetig. */
export const MatrixMode: React.FC = () => {
  const [active, setActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const onTrigger = () => {
      setActive(true);
      playGlitch();
    };
    window.addEventListener(MATRIX_MODE_EVENT, onTrigger);
    return () => window.removeEventListener(MATRIX_MODE_EVENT, onTrigger);
  }, []);

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const t = window.setTimeout(() => setActive(false), 200);
      return () => window.clearTimeout(t);
    }

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fontSize = 16;
    const columns = Math.ceil(canvas.width / fontSize);
    const drops = new Array(columns).fill(1);

    let rafId = 0;
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#FF5A1F';
      ctx.font = `${fontSize}px monospace`;
      drops.forEach((y, i) => {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillText(char, i * fontSize, y * fontSize);
        if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
      rafId = requestAnimationFrame(draw);
    };
    rafId = requestAnimationFrame(draw);

    const closeTimer = window.setTimeout(() => setActive(false), 3800);
    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(closeTimer);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9997]"
    />
  );
};
