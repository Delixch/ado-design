import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useMotionTemplate, useSpring, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHead } from './ui';
import { OPEN_SECTION_EVENT } from '../lib/nav';
import { useGyroTilt } from '../hooks/useGyroTilt';
import { useEnterSound, playClick } from '../lib/sound';
import { useReducedMotion } from '../lib/motion';
import { useLanguage } from '../lib/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

interface RouteStop {
  id: string;
  year: string;
  title: string;
  organization: string;
  description: string;
  color: string;
}

// Sprachneutral: nur id/Farbe. Jahr/Titel/Organisation/Beschreibung
// kommen aus t.experience.journey (gleiche Reihenfolge).
const journeyMeta = [
  { id: '01', color: 'var(--color-brand)' },
  { id: '02', color: '#00738C' },
  { id: '03', color: '#5E35B1' },
  { id: '04', color: '#C2185B' },
  { id: '05', color: 'var(--color-brand)' },
  { id: '06', color: '#00738C' },
];

/* ─── Portrait mit Lupen-Effekt ──────────────────────────────
   Eigenes Effekt (2x-Zoom, folgt der Zeigerposition), nicht
   Grid, Distorsion oder TV-Static. Zweimal gemountet:
   Split-Panel auf dem Desktop, eingereihter Block auf Mobil —
   dort loest `pointerdown` den Effekt aus, `pointerup`/
   `pointercancel` beendet ihn. */
const ExperiencePortrait: React.FC<{ variant: 'desktop' | 'mobile' }> = ({ variant }) => {
  const maskX = useMotionValue(-1000);
  const maskY = useMotionValue(-1000);
  const [active, setActive] = useState(false);

  const track = (e: React.PointerEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    maskX.set(e.clientX - left);
    maskY.set(e.clientY - top);
  };
  const handleDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setActive(true);
    track(e);
  };
  const handleUp = () => {
    setActive(false);
    maskX.set(-1000);
    maskY.set(-1000);
  };

  const flashlightMask = useMotionTemplate`radial-gradient(160px circle at ${maskX}px ${maskY}px, black 0%, transparent 100%)`;
  const transformOrigin = useMotionTemplate`${maskX}px ${maskY}px`;

  const rootRef = useRef<HTMLDivElement>(null);
  useEnterSound(rootRef, variant === 'desktop');
  const reducedMotion = useReducedMotion();

  return (
    <div
      ref={rootRef}
      className={
        variant === 'desktop'
          ? 'absolute top-0 left-0 bottom-0 w-1/2 hidden min-[1000px]:block border-r border-ink/5 overflow-hidden pointer-events-auto'
          : 'relative block w-full h-[clamp(16rem,80vw,24rem)] overflow-hidden rounded-2xl pointer-events-auto'
      }
      style={{ background: '#000000' }}
    >
      {/* Experience Board Image with Magnifying Glass Effect */}
      <div
        className={`absolute overflow-hidden shadow-2xl z-0 pointer-events-auto cursor-crosshair group touch-none select-none ${
          variant === 'desktop' ? 'inset-y-16 inset-x-12 rounded-2xl' : 'inset-2 rounded-xl'
        }`}
        onPointerMove={track}
        onPointerDown={handleDown}
        onPointerUp={handleUp}
        onPointerLeave={handleUp}
        onPointerCancel={handleUp}
      >
        {/* Original Image untouched - Lampen bereits im Foto warm
            beleuchtet, kein CSS-Lichtfleck mehr noetig. Auf sein
            Seitenverhaeltnis (1023:1537) fixiert und verkleinert,
            damit der eigene Bildrand nicht abgeschnitten wird. */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative max-w-full overflow-hidden rounded-2xl" style={{ aspectRatio: '1023 / 1537', width: variant === 'desktop' ? 'min(74%, 25rem)' : 'auto', height: variant === 'desktop' ? 'auto' : '96%' }}>
            {/* Derselbe Spin-Sweep wie bei den Karten, orange, um den
                Bildrand — hier kein Kreis, sondern das runde Rechteck
                des Fotos selbst (Padding-Trick statt Masken-Trick). */}
            <div
              aria-hidden
              className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] pointer-events-none"
              style={{
                background: 'conic-gradient(from 0deg, transparent 70%, color-mix(in srgb, var(--color-brand) 50%, transparent) 95%, var(--color-brand) 100%)',
                animation: 'sequence-spin-6 20s linear infinite',
              }}
            />
            <img
              src="/images/experience-board-color.webp"
              alt="Experience Board"
              loading="lazy"
              className="absolute inset-[2px] h-[calc(100%-4px)] w-[calc(100%-4px)] rounded-[inherit] object-cover"
            />
          </div>
        </div>

        {/* Magnifying Glass Effect - Revealed on Hover (Desktop) / Hold (Touch) */}
        <motion.div
          className={`absolute inset-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-100 ${
            active ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            WebkitMaskImage: flashlightMask,
            maskImage: flashlightMask,
          }}
        >
          {/* This is the zoomed-in image. Its transformOrigin tracks the pointer perfectly. */}
          <motion.img
            src="/images/experience-board-color.webp"
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{
              scale: 1.5,
              transformOrigin,
              filter: 'contrast(1.2) brightness(1.2)'
            }}
          />
        </motion.div>
      </div>

      {/* Custom Tapering SVG Graphic Stripes (converging to top-right corner) with looping pulse */}
      <div className="absolute inset-0 pointer-events-none opacity-90 z-10">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            {[
              { color: '#1E202A', delay: 0, id: `pulse-experience-0-${variant}` },
              { color: '#1E202A', delay: 1.125, id: `pulse-experience-1-${variant}` },
              { color: '#1E202A', delay: 2.25, id: `pulse-experience-2-${variant}` },
              { color: '#1E202A', delay: 3.375, id: `pulse-experience-3-${variant}` }
            ].map((s) => (
              <linearGradient key={s.id} id={s.id} x1="100%" y1="-100%" x2="0%" y2="0%">
                {!reducedMotion && (
                  <>
                    <animate
                      attributeName="y1"
                      values="-100%;200%"
                      dur="4.5s"
                      begin={`${s.delay}s`}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="y2"
                      values="0%;300%"
                      dur="4.5s"
                      begin={`${s.delay}s`}
                      repeatCount="indefinite"
                    />
                  </>
                )}
                <stop offset="0%" stopColor={s.color} />
                <stop offset="42%" stopColor={s.color} />
                <stop offset="50%" stopColor="var(--color-brand)" />
                <stop offset="58%" stopColor={s.color} />
                <stop offset="100%" stopColor={s.color} />
              </linearGradient>
            ))}
          </defs>
          <polygon points="106.3,-10 105.95,-10 30,110 28.4,110" fill={`url(#pulse-experience-0-${variant})`} />
          <polygon points="106.2,-10 105.85,-10 27,110 25.4,110" fill={`url(#pulse-experience-1-${variant})`} />
          <polygon points="106.1,-10 105.75,-10 24,110 22.4,110" fill={`url(#pulse-experience-2-${variant})`} />
          <polygon points="106.0,-10 105.65,-10 21,110 19.4,110" fill={`url(#pulse-experience-3-${variant})`} />
        </svg>
      </div>
    </div>
  );
};

/* Timeline-Karte mit 3D-Tilt: Maus auf dem Desktop, Gyroskop
   mobil — dieselben mx/my Motion-Values wie bei den Skill- und
   Kontakt-Karten. Der Lupen-Spotlight im Portrait bleibt davon
   unberuehrt, das ist ein eigener Effekt in ExperiencePortrait. */
const TimelineCard: React.FC<{ stop: RouteStop; i: number }> = ({ stop, i }) => {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(mx, [-0.5, 0.5], [20, -20]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(my, [-0.5, 0.5], [-20, 20]), { stiffness: 200, damping: 20 });
  useGyroTilt(mx, my);

  const cardContent = (
    <motion.div
      className="w-full relative overflow-hidden rounded-2xl p-[1px] transition-all duration-500 shadow-lg border border-white/15"
      onPointerEnter={() => playClick()}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      style={{ backgroundColor: 'transparent', rotateX: ry, rotateY: rx, transformStyle: 'preserve-3d' }}
      whileHover={{
        borderColor: 'rgba(255, 255, 255, 0.4)',
        y: -2,
      }}
    >
      {/* Animated Neon Line */}
      <div
        className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] pointer-events-none"
        style={{
          background: 'conic-gradient(from 0deg, transparent 70%, rgba(255,255,255,0.4) 95%, #ffffff 100%)',
          animation: `sequence-spin-6 12s linear infinite`,
          animationDelay: `${i * 2}s`,
          opacity: 0,
          zIndex: 0,
        }}
      />
      {/* Inner Card Content */}
      <div className="relative w-full h-full rounded-[15px] z-10 p-5 overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] bg-[#0A0A0A]">
        <span className="font-mono-ui mb-1.5 block text-[10.5px] uppercase tracking-[0.14em] md:hidden font-semibold text-white/85">
          {stop.year}
        </span>
        <h3 className="card-title">
          {stop.title}
        </h3>
        <span className="font-sans-ui mt-1.5 block text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white/90">
          {stop.organization}
        </span>
        <p className="card-body mt-2">
          {stop.description}
        </p>
      </div>
    </motion.div>
  );

  if (i === 1) {
    return (
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="ml-9 flex-1"
        style={{ perspective: 1000 }}
      >
        {cardContent}
      </motion.div>
    );
  }

  return (
    <div className="ml-9 flex-1" style={{ perspective: 1000 }}>
      {cardContent}
    </div>
  );
};

export const ExperienceSection: React.FC = () => {
  const { t } = useLanguage();
  const journey: RouteStop[] = t.experience.journey.map((entry, i) => ({ ...entry, ...journeyMeta[i] }));
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [sectionOpen, setSectionOpen] = useState(false);
  useEffect(() => {
    const onOpen = (e: Event) => {
      const d = (e as CustomEvent<string>).detail;
      if (d === 'experience' || d === 'all') setSectionOpen(true);
    };
    window.addEventListener(OPEN_SECTION_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_SECTION_EVENT, onOpen);
  }, []);

  /* GSAP ScrollTrigger statt framer `useScroll`: die Spur fuellt
     sich `scrub`-exakt mit der Scrollposition, kein Nachfedern.
     `gsap.context` raeumt die Trigger beim Unmount wieder auf. */
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current || !lineRef.current) return;
      gsap.fromTo(
        lineRef.current,
        { height: '0%' },
        {
          height: '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
            end: 'bottom 90%',
            scrub: true,
          },
        },
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      className="framed relative w-full overflow-hidden py-16 fluid-gutter sm:py-24"
      style={{ background: '#000000' }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes sequence-spin-6 {
          0% { transform: rotate(0deg); opacity: 1; }
          16.5% { transform: rotate(360deg); opacity: 1; }
          16.6% { transform: rotate(360deg); opacity: 0; }
          100% { transform: rotate(360deg); opacity: 0; }
        }
      ` }} />
      {/* Dark left-half split screen background (wrapped in .layer to escape .tinted > *) */}
      <div className="layer pointer-events-none">
        <ExperiencePortrait variant="desktop" />
      </div>



      {/* Grain overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px',
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl z-20 pointer-events-none">
        <div className="grid grid-cols-1 gap-6 min-[1000px]:grid-cols-12 pointer-events-none">
          
          {/* Left half is completely empty */}
          <div className="hidden min-[1000px]:block min-[1000px]:col-span-6" />

          {/* Right half with minimized experience content */}
          <div className="min-[1000px]:col-span-6 pointer-events-auto">
            <SectionHead
              index="06"
              eyebrow={t.experience.eyebrow}
              line1={t.experience.line1}
              line2={t.experience.line2}
              gradientLine2={true}
              className="mb-8 max-w-4xl"
              contentClass="min-[1000px]:pl-4 min-[1000px]:pr-0"
              open={sectionOpen}
              onToggleOpen={() => setSectionOpen((v) => !v)}
            />

            {sectionOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
            {/* Mobil: gleicher Lupen-Effekt wie das Split-Panel, im
                Inhaltsfluss. Halten statt Hover. */}
            <div className="mb-6 min-[1000px]:hidden">
              <ExperiencePortrait variant="mobile" />
            </div>

            <div ref={containerRef} className="rail relative w-full">
              {/* Grundspur */}
              <div className="rail-line absolute bottom-6 top-2 w-[2px] rounded-full bg-ink/10" />

              <div
                ref={lineRef}
                className="rail-line absolute top-2 w-[2px] origin-top rounded-full bg-gradient-to-b bg-white/20"
                style={{ height: '0%' }}
              />

              <ol className="space-y-9">
                {journey.map((stop, i) => (
                  <motion.li
                    key={stop.id}
                    initial={{ opacity: 0, x: -18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.65, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    className="group relative flex flex-col md:flex-row md:items-start"
                  >
                    {/* Jahr links der Spur ab 768px */}
                    <div className="rail-col hidden shrink-0 pr-9 pt-1 text-right md:block">
                      <span className="font-mono-ui text-[10.5px] uppercase tracking-[0.14em] text-white/60 transition-colors duration-300 group-hover:text-white">
                        {stop.year}
                      </span>
                    </div>

                    {/* Knoten */}
                    <span className="rail-line absolute top-2 flex -translate-x-1/2 items-center justify-center">
                      <span
                        className="absolute h-7 w-7 scale-0 rounded-full transition-transform duration-500 group-hover:scale-100"
                        style={{ backgroundColor: `color-mix(in srgb, ${stop.color} 15%, transparent)` }}
                      />
                      <span
                        className="relative h-3.5 w-3.5 rounded-full border-2 border-white/20 bg-[#000000] transition-colors duration-300 group-hover:bg-white"
                        style={{ borderColor: stop.color }}
                      />
                    </span>

                    <TimelineCard stop={stop} i={i} />
                  </motion.li>
                ))}
              </ol>
            </div>
            </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
