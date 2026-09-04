import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const OPEN_TERMINAL_EVENT = 'ado:open-terminal';

/* Jede Zeile: was getippt wird, dann die Antwort darunter (leer,
   wenn keine noetig ist — der Prompt allein reicht manchmal). */
const SCRIPT: { cmd: string; out?: string[] }[] = [
  { cmd: 'whoami', out: ['Adnan Aydin'] },
  { cmd: 'cat rolle.txt', out: ['Web-Entwickler · Zürich · Frei für Projekte'] },
  { cmd: 'ls fähigkeiten/', out: ['react  typescript  three.js  gsap  supabase  ki-alltag'] },
  { cmd: 'echo "gefunden das versteckte terminal?"', out: ['gefunden das versteckte terminal?'] },
  { cmd: 'echo "nicht schlecht. schreib mir:"', out: ['nicht schlecht. schreib mir:', 'adnan.aydin@bluewin.ch'] },
];

/** Verstecktes Terminal — mit `~` oder per Event von aussen
 *  (der KI-Skillkarte) geoeffnet, tippt sich selbst vor. */
export const SecretTerminal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // `event.code` ist die physische Taste, unabhaengig vom
      // Layout — auf CH/DE-Tastaturen ist `~`/`` ` `` sonst eine
      // "tote Taste" und feuert allein gar kein `key`-Zeichen.
      if (e.code === 'Backquote') setOpen((v) => !v);
      if (e.key === 'Escape') setOpen(false);
    };
    const onEvent = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener(OPEN_TERMINAL_EVENT, onEvent);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener(OPEN_TERMINAL_EVENT, onEvent);
    };
  }, []);

  useEffect(() => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    if (!open) {
      setLines([]);
      return;
    }

    let delay = 300;
    SCRIPT.forEach(({ cmd, out }) => {
      timers.current.push(
        window.setTimeout(() => setLines((prev) => [...prev, `$ ${cmd}`]), delay),
      );
      delay += 500;
      (out ?? []).forEach((line) => {
        timers.current.push(
          window.setTimeout(() => setLines((prev) => [...prev, line]), delay),
        );
        delay += 350;
      });
      delay += 350;
    });

    return () => timers.current.forEach(window.clearTimeout);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-[9998] max-h-[60vh] border-t-2 border-brand bg-black/95 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
            <span className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/50">
              zsh — versteckt gefunden
            </span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Terminal schliessen"
              className="font-mono-ui text-[11px] text-white/50 hover:text-white"
            >
              [~] oder [Esc] schliessen
            </button>
          </div>
          <div className="max-h-[50vh] overflow-y-auto px-4 py-4 font-mono text-[12px] leading-relaxed text-brand">
            {lines.map((line, i) => (
              <div key={i} className={line.startsWith('$') ? 'text-white/70' : ''}>
                {line}
              </div>
            ))}
            <span className="cursor-blink inline-block h-3 w-1.5 bg-brand align-middle" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
