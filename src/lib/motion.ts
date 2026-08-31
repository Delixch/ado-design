import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';

/**
 * Weiches Scrollen, aber nur wenn der Besucher Bewegung will.
 * Steht `prefers-reduced-motion` auf reduce, bleibt das native
 * Scrollen unangetastet.
 */
export const useSmoothScroll = (): void => {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    let frame = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);
};

/** Eine Medienabfrage als React-Zustand, inklusive Nachfuehren. */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);
    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [query]);

  return matches;
};

export const useReducedMotion = (): boolean =>
  useMediaQuery('(prefers-reduced-motion: reduce)');

/**
 * Zaehlt eine Zahl hoch, sobald das Element im Bild steht.
 * Laeuft ueber requestAnimationFrame statt ueber State pro Bild.
 */
export const useCountUp = (target: number, duration = 1400) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      node.textContent = String(target);
      return;
    }

    let frame = 0;
    let start = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();

        const step = (now: number) => {
          if (!start) start = now;
          const p = Math.min((now - start) / duration, 1);
          // Ease-out, damit die letzte Ziffer nicht durchrast.
          node.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
          if (p < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target, duration]);

  return ref;
};
