import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../lib/motion';

const RADIUS = 20;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Kein klassischer Pfeil-Kreis: derselbe orange Ring-Look wie die
 *  Portrait-Rahmen, aber statt idle zu drehen fuellt er sich mit dem
 *  Scrollfortschritt — eine kleine, runde Version der Leiste oben.
 *  Terminal-Anspielung in der Mitte statt Icon: "~" ist das Zuhause
 *  der Shell, genau wie hier der Seitenanfang. */
export const ScrollToTop: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
      setVisible(window.scrollY > window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })}
          aria-label="Nach oben scrollen"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: reducedMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 backdrop-blur-md"
        >
          <svg width="48" height="48" viewBox="0 0 48 48" className="absolute inset-0" aria-hidden>
            <circle cx="24" cy="24" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
            <circle
              cx="24"
              cy="24"
              r={RADIUS}
              fill="none"
              stroke="#FF5A1F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
              transform="rotate(-90 24 24)"
            />
          </svg>
          <span className="font-mono-ui flex items-center text-[11px] font-bold text-[#FF5A1F]">
            ~<span className="cursor-blink ml-0.5 inline-block h-2.5 w-1 bg-[#FF5A1F] align-middle" />
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
