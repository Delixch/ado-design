import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '../lib/motion';
import { playChime } from '../lib/sound';

const SEQUENCE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

/** Der klassische Cheat-Code aus den 80ern — funktioniert ueberall
 *  auf der Seite, kein Eingabefeld noetig. Reines Easter Egg, kein
 *  Hinweis irgendwo. Zeigt kurz ein Abzeichen, verschwindet von
 *  selbst wieder. */
export const KonamiCode: React.FC = () => {
  const [show, setShow] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    let buffer: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      buffer = [...buffer, key].slice(-SEQUENCE.length);
      if (buffer.join(',') === SEQUENCE.join(',')) {
        setShow(true);
        playChime();
        buffer = [];
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!show) return;
    const t = window.setTimeout(() => setShow(false), 3600);
    return () => window.clearTimeout(t);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.3 }}
          className="pointer-events-none fixed inset-0 z-[9996] flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.85, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mx-4 max-w-xs rounded-2xl border-2 border-[#FF5A1F] bg-[#0A0A0A] px-6 py-5 text-center shadow-[0_0_40px_rgba(255,90,31,0.35)]"
          >
            <div className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-[#FF5A1F]">
              Konami-Code erkannt
            </div>
            <div className="font-display mt-2 text-[15px] uppercase text-white">
              Respekt.
            </div>
            <div className="font-sans-ui mt-2 text-[11px] text-white/60">
              Ehrlich — wer tippt sowas heute noch.
            </div>
            <div className="font-mono-ui mt-3 text-[10px] text-[#FF5A1F]">+30 LEBEN</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
