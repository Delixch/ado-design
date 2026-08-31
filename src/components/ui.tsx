import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * Kleinteile, die mehrere Abschnitte teilen. Sie liegen zusammen,
 * damit ein Stilwechsel an einer Stelle passiert und nicht an fuenf.
 */

interface SectionHeadProps {
  index: string;
  eyebrow: string;
  /** Erste Zeile in Anthrazit. */
  line1: string;
  /** Zweite Zeile im Akzent. */
  line2: string;
  accent?: 'punch' | 'coral';
  className?: string;
  /** Zusatzklasse fuer die Ueberschrift, z. B. eine kleinere Stufe. */
  headClass?: string;
  /** Steht der Kopf auf schwarzem Grund, drehen sich die Werte um. */
  onDark?: boolean;
  /** Fuellt die zweite Zeile mit einem edlen Premium-Verlauf anstelle einer Vollfarbe. */
  gradientLine2?: boolean;
  /** Optional custom tailwind classes for horizontal padding and margins on the content wrapper. */
  contentClass?: string;
}

export const SectionHead: React.FC<SectionHeadProps> = (props) => {
  const {
    index,
    eyebrow,
    line1,
    line2,
    className = '',
    headClass = '',
    gradientLine2 = false,
    contentClass = 'min-[1000px]:px-0',
  } = props;
  const headRef = useRef<HTMLHeadingElement>(null);

  const { scrollYProgress } = useScroll({
    target: headRef,
    offset: ['start 88%', 'start 38%'],
  });
  const fillClip = useTransform(scrollYProgress, [0, 1], ['inset(100% 0 0 0)', 'inset(0% 0 0 0)']);

  // Use a sleek monochrome dark color for the band across all sections
  const bgAccentColor = '#0A0A0A';

  const isLeftSide = index === '01' || index === '03' || index === '05';

  return (
    <div className={`relative ${className}`}>
      {/* Full-bleed background band */}
      <div 
        className="absolute top-0 bottom-0 z-0 pointer-events-none border-y border-white/10 shadow-md"
        style={{
          left: isLeftSide ? '-100vw' : '0',
          right: isLeftSide ? '0' : '-100vw',
          backgroundColor: bgAccentColor,
        }}
      >
        {/* Gloss/Reflection overlay inside the band */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
      </div>

      {/* Content wrapper with matching vertical and left/right padding */}
      <div className={`relative z-10 py-5 px-4 ${contentClass}`}>
        {/* Eyebrow and Index row */}
        <motion.div
          initial={{ opacity: 0, x: -18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4 flex items-center gap-3"
        >
          <span className="font-mono-ui rounded-full px-2.5 py-0.5 text-[9px] font-semibold bg-white text-ink">
            {index}
          </span>
          <span className="font-mono-ui text-[10px] uppercase tracking-wider text-white/80">
            {eyebrow}
          </span>
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="h-[1.5px] w-12 origin-left rounded-full bg-white/30 sm:w-20"
          />
        </motion.div>

        {/* Title h2 */}
        <motion.h2
          ref={headRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className={`font-display relative flex flex-wrap gap-x-[0.3em] uppercase text-white text-base md:text-lg lg:text-xl font-bold tracking-tight ${headClass}`}
        >
          <motion.span className="relative block">
            <motion.span
              aria-hidden
              variants={{
                hidden: { x: 16, y: -6, opacity: 0.85 },
                visible: { x: 0, y: 0, opacity: 0, transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="pointer-events-none absolute inset-0 block text-white/20 mix-blend-screen"
            >
              {line1}
            </motion.span>
            <motion.span
              aria-hidden
              variants={{
                hidden: { x: -18, y: 7, opacity: 0.85 },
                visible: {
                  x: 0,
                  y: 0,
                  opacity: 0,
                  transition: { duration: 1.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              className="pointer-events-none absolute inset-0 block text-white/10 mix-blend-screen"
            >
              {line1}
            </motion.span>

            <motion.span className="block overflow-hidden">
              <motion.span
                variants={{
                  hidden: { y: '112%', rotate: 5 },
                  visible: { y: '0%', rotate: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
                }}
                className="block origin-left"
              >
                {line1}
              </motion.span>
            </motion.span>
          </motion.span>

          <motion.span className="block overflow-hidden">
            <motion.span
              variants={{
                hidden: { y: '112%' },
                visible: { y: '0%', transition: { duration: 1, delay: 0.12, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="relative block"
            >
              <span className="block text-white/30">{line2}</span>
              {/* Deckungsgleich darueber: die volle Schrift, von unten
                  nach oben freigegeben. */}
              <motion.span
                aria-hidden
                style={{ clipPath: fillClip }}
                className={`absolute inset-0 block ${gradientLine2 ? 'grad-text' : 'text-white'}`}
              >
                {line2}
              </motion.span>
            </motion.span>
          </motion.span>
        </motion.h2>
      </div>
    </div>
  );
};

/** Instagram + WhatsApp + GitHub — an zwei Stellen dieselben Links,
 *  deshalb hier einmal statt zweimal von Hand nachgebaut. */
export const SocialLinks: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <a
      href="https://www.instagram.com/adnanaydin53/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Instagram"
      className="text-[#FF5A1F] transition-opacity hover:opacity-70"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    </a>
    <a
      href="https://wa.me/41763920099"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="text-[#FF5A1F] transition-opacity hover:opacity-70"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.33 4.95L2.05 22l5.29-1.39a9.87 9.87 0 0 0 4.7 1.2h.01c5.46 0 9.91-4.45 9.91-9.9C21.96 6.45 17.51 2 12.04 2zm5.8 14.06c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.11.11-1.79-.11-.41-.13-.94-.3-1.62-.6-2.85-1.23-4.71-4.1-4.85-4.29-.14-.19-1.16-1.54-1.16-2.94s.72-2.08.98-2.36c.24-.28.53-.35.71-.35h.5c.16 0 .38-.06.59.45.24.58.8 2.01.87 2.16.07.15.12.32.02.51-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.28-.12.56.16.28.71 1.18 1.53 1.91 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.6-.07.16-.19.68-.79.87-1.06.19-.28.37-.23.62-.14.26.1 1.63.77 1.91.91.28.14.47.21.54.33.07.13.07.72-.17 1.4z" />
      </svg>
    </a>
    <a
      href="https://github.com/Delixch"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="GitHub"
      className="text-[#FF5A1F] transition-opacity hover:opacity-70"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.58 2 12.19c0 4.49 2.87 8.3 6.84 9.64.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.72-2.78.62-3.37-1.36-3.37-1.36-.46-1.19-1.11-1.51-1.11-1.51-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 2.5-.35c.85 0 1.7.12 2.5.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.95.68 1.92 0 1.39-.01 2.51-.01 2.85 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.19C22 6.58 17.52 2 12 2z" />
      </svg>
    </a>
  </div>
);

/** Fortschrittsbalken am oberen Rand. */
export const ScrollProgress: React.FC = () => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
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
    <div aria-hidden className="fixed left-0 right-0 top-0 z-[60] h-[3px] bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-[#FF5A1F] to-[#C23E10]"
        style={{ transform: `scaleX(${progress})`, transformOrigin: 'left' }}
      />
    </div>
  );
};
