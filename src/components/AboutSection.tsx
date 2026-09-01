import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { useCountUp, useReducedMotion } from '../lib/motion';
import { SectionHead } from './ui';
import { OPEN_SECTION_EVENT } from '../lib/nav';
import { useEnterSound } from '../lib/sound';

/* ─── Stats ─────────────────────────────────────────────── */
const stats = [
  { value: 20, suffix: '+', label: 'Jahre Erfahrung' },
  { value: 6,  suffix: '',  label: 'Projekte live' },
  { value: 3,  suffix: '',  label: 'Sprachen' },
  { value: 9,  suffix: '',  label: 'Archiv-Arbeiten' },
];

const sequenceSpinStyles = `
  @keyframes sequence-spin {
    0% { transform: rotate(0deg); opacity: 1; }
    24.9% { transform: rotate(360deg); opacity: 1; }
    25% { transform: rotate(360deg); opacity: 0; }
    100% { transform: rotate(360deg); opacity: 0; }
  }

  @keyframes tv-static {
    0% { background-position: 0px 0px; }
    10% { background-position: -50px 50px; }
    20% { background-position: 100px -20px; }
    30% { background-position: -70px 90px; }
    40% { background-position: 40px 10px; }
    50% { background-position: -80px -80px; }
    60% { background-position: 30px 60px; }
    70% { background-position: -20px -50px; }
    80% { background-position: 90px 40px; }
    90% { background-position: -60px 20px; }
    100% { background-position: 0px 0px; }
  }
`;

/* ─── Single stat card ──────────────────────────────────── */
const StatCard: React.FC<{
  value: number; suffix: string; label: string; i: number;
}> = ({ value, suffix, label, i }) => {
  const ref = useCountUp(value);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: i * 0.05 }}
      className="relative flex flex-col items-center justify-center aspect-square overflow-hidden rounded-sm p-[1px] bg-[#0A0A0A] border border-white/5 shadow-sm"
    >
      {/* Animated Neon Line */}
      <div 
        className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] pointer-events-none"
        style={{
          background: 'conic-gradient(from 0deg, transparent 70%, rgba(255,255,255,0.4) 95%, #ffffff 100%)',
          animation: `sequence-spin 8s linear infinite`,
          animationDelay: `${i * 2}s`,
          opacity: 0,
          zIndex: 0,
        }}
      />
      {/* Inner Card */}
      <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#0A0A0A] rounded-[1px] z-10 p-3">
        <div className="font-robot text-xl font-black leading-none text-[#FF5A1F]">
          <span ref={ref}>0</span>{suffix}
        </div>
        <div className="font-mono-ui mt-2 text-[9px] uppercase tracking-[0.1em] text-white/50 text-center">
          {label}
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Portrait mit TV-Static-Effekt ─────────────────────────
   Zweimal gemountet: als absolutes Split-Panel auf dem Desktop
   und als eingereihter Block auf Mobil. Auf Touch loest
   `pointerdown` den Effekt aus und `pointerup`/`pointercancel`
   beendet ihn wieder — Pointer Events tragen Maus und Finger
   gleichermassen, nur der Trigger unterscheidet sich vom Hover. */
const AboutPortrait: React.FC<{ variant: 'desktop' | 'mobile' }> = ({ variant }) => {
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const [active, setActive] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  useEnterSound(rootRef, variant === 'desktop');
  const reducedMotion = useReducedMotion();

  const track = (e: React.PointerEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };
  const handleDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setActive(true);
    track(e);
  };
  const handleUp = () => {
    setActive(false);
    mouseX.set(-1000);
    mouseY.set(-1000);
  };

  const maskImage = useMotionTemplate`radial-gradient(180px circle at ${mouseX}px ${mouseY}px, black 0%, transparent 100%)`;

  return (
    <div
      ref={rootRef}
      className={
        variant === 'desktop'
          ? 'absolute top-0 right-0 bottom-0 w-1/2 hidden min-[1000px]:block border-l border-white/5 overflow-hidden pointer-events-auto'
          : 'relative block w-full h-[clamp(16rem,80vw,24rem)] overflow-hidden rounded-2xl pointer-events-auto'
      }
      style={{ background: '#000000' }}
    >
      {/* Portrait Image with Padding & TV Static Flashlight */}
      <div
        className={`absolute overflow-hidden shadow-2xl z-0 pointer-events-auto cursor-crosshair group touch-none select-none ${
          variant === 'desktop' ? 'inset-y-24 inset-x-16 rounded-2xl' : 'inset-2 rounded-xl'
        }`}
        onPointerMove={track}
        onPointerDown={handleDown}
        onPointerUp={handleUp}
        onPointerLeave={handleUp}
        onPointerCancel={handleUp}
      >
        {/* Image and Light Effects Wrapper.
            Auf das Seitenverhaeltnis des Fotos (819:1024) fixiert und
            zentriert — vorher sass das Bild per `object-contain` in
            einer Box mit ANDEREM Seitenverhaeltnis (breiter als hoch
            auf dem Desktop), also mit Leerraum links/rechts. Die
            Lampen-Koordinaten in Prozent zielten auf die Box, nicht
            auf das tatsaechlich sichtbare Bild — daher sass der Fleck
            daneben. Mit gleichem Seitenverhaeltnis deckt sich Box und
            Bild exakt, `object-cover` schneidet dann nichts mehr ab. */}
        <div className="absolute inset-0 z-0 flex items-center justify-center" style={{ isolation: 'isolate' }}>
          <div className="relative max-w-full" style={{ aspectRatio: '1 / 1', width: 'auto', height: '100%' }}>
            <img
              src="/images/about-portrait.webp"
              alt="Portrait"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Das Foto zeigt selbst einen Steinkreis, Lampe bereits warm
                im Foto — derselbe orange Spin-Sweep wie bei den anderen
                Portraets, auf einen duennen Rand maskiert. */}
            <div
              aria-hidden
              className="absolute top-[10%] left-1/2 aspect-square h-[80%] -translate-x-1/2 rounded-full pointer-events-none overflow-hidden"
              style={{
                WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))',
                mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))',
              }}
            >
              <div
                className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%]"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 70%, rgba(255,90,31,0.5) 95%, #FF5A1F 100%)',
                  animation: 'sequence-spin 20s linear infinite',
                }}
              />
            </div>
          </div>
        </div>

        {/* TV Static Noise - High Contrast White Dots - Revealed on Hover (Desktop) / Hold (Touch) */}
        <motion.div
          className={`absolute inset-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-100 ${
            active ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            WebkitMaskImage: maskImage,
            maskImage: maskImage,
          }}
        >
          <div
            className="absolute inset-0 mix-blend-screen contrast-200 brightness-[1.2] opacity-[0.55]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              animation: 'tv-static 0.25s steps(4) infinite',
            }}
          />
        </motion.div>
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-90 z-10">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            {[
              { color: '#1E202A', delay: 0, id: `pulse-about-0-${variant}` },
              { color: '#1E202A', delay: 1.125, id: `pulse-about-1-${variant}` },
              { color: '#1E202A', delay: 2.25, id: `pulse-about-2-${variant}` },
              { color: '#1E202A', delay: 3.375, id: `pulse-about-3-${variant}` }
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
                <stop offset="50%" stopColor="#FF5A1F" />
                <stop offset="58%" stopColor={s.color} />
                <stop offset="100%" stopColor={s.color} />
              </linearGradient>
            ))}
          </defs>
          <polygon points="70,-10 71.6,-10 -5.95,110 -6.3,110" fill={`url(#pulse-about-0-${variant})`} />
          <polygon points="73,-10 74.6,-10 -5.85,110 -6.2,110" fill={`url(#pulse-about-1-${variant})`} />
          <polygon points="76,-10 77.6,-10 -5.75,110 -6.1,110" fill={`url(#pulse-about-2-${variant})`} />
          <polygon points="79,-10 80.6,-10 -5.65,110 -6.0,110" fill={`url(#pulse-about-3-${variant})`} />
        </svg>
      </div>
    </div>
  );
};

/* ─── Section ────────────────────────────────────────────── */
export const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onOpen = (e: Event) => {
      const d = (e as CustomEvent<string>).detail;
      if (d === 'about' || d === 'all') setOpen(true);
    };
    window.addEventListener(OPEN_SECTION_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_SECTION_EVENT, onOpen);
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="framed relative w-full overflow-hidden py-16 fluid-gutter sm:py-24"
      style={{ background: '#000000' }}
    >
      <style dangerouslySetInnerHTML={{ __html: sequenceSpinStyles }} />
      {/* Grain texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px',
        }}
      />

      <div className="layer pointer-events-none">
        <AboutPortrait variant="desktop" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl z-10 pointer-events-none">
        {/* Grid layout - left half populated, right half empty */}
        <div className="grid grid-cols-1 gap-5 min-[1000px]:grid-cols-12 pointer-events-none">
          
          {/* Left half with all minimized content */}
          <div className="flex flex-col gap-5 min-[1000px]:col-span-6 pointer-events-auto">
            <SectionHead
              index="01"
              eyebrow="Über mich"
              line1="Ich schreibe nicht nur Code."
              line2="Ich baue, was bleibt."
              gradientLine2={false}
              className="mb-6"
              open={open}
              onToggleOpen={() => setOpen((v) => !v)}
            />

            {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-5 overflow-hidden"
            >
            {/* Minimized Bio card containing small Portrait avatar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden rounded-sm p-4 bg-[#0A0A0A] border border-white/5 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                {/* Portrait Avatar - Small, B&W */}
                <div className="relative w-20 h-20 shrink-0 overflow-hidden rounded-sm border border-white/10">
                  <img
                    src="https://res.cloudinary.com/ixyonosn/image/upload/f_auto,q_auto,w_300/v1787056936/koltuk.png"
                    alt="Adnan Aydin"
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover object-top grayscale contrast-125"
                  />
                </div>

                {/* Bio text */}
                <div className="flex-1 text-center sm:text-left">
                  <p className="font-sans-ui text-[12px] leading-relaxed text-white/90 font-semibold">
                    Ich bin <strong className="font-bold text-white">Adnan Aydin</strong>, Web-Entwickler in Zürich.
                  </p>
                  <p className="font-sans-ui text-[11px] leading-relaxed text-white/70 mt-1.5">
                    Angefangen habe ich mit dem Web-Publisher-Lehrgang (HTML, CSS, PHP, DB). Heute entwickle ich moderne High-End-Webseiten mit <strong className="font-semibold text-white">Echtzeit-3D</strong>, <strong className="font-semibold text-white">Motion Design</strong> und performantem Code.
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5 justify-center sm:justify-start">
                    {['Echtzeit-3D', 'Mobil zuerst', 'Ohne Baukasten'].map((tag) => (
                      <span
                        key={tag}
                        className="font-mono-ui rounded-sm px-2 py-0.5 text-[9px] uppercase tracking-[0.1em] text-white/60"
                        style={{ border: '1px solid rgba(255,255,255,0.15)' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Mobil: gleicher Effekt wie das Split-Panel, im Inhaltsfluss
                statt daneben. Halten statt Hover — kein Mauszeiger auf Touch. */}
            <div className="min-[1000px]:hidden">
              <AboutPortrait variant="mobile" />
            </div>

            {/* Minimized Stats Grid */}
            <div className="grid grid-cols-4 gap-3">
              {stats.map((s, i) => <StatCard key={s.label} {...s} i={i} />)}
            </div>

            {/* Minimized CTA button */}
            <div className="mt-2">
              <motion.a
                href="mailto:adnan.aydin@bluewin.ch"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="group relative overflow-hidden rounded-sm px-4 py-2.5 inline-flex items-center justify-between gap-4 bg-[#FF5A1F] shadow-sm"
              >
                <span className="font-robot relative text-[9px] uppercase tracking-[0.15em] text-white">
                  Direkt schreiben
                </span>
                <span className="font-mono-ui relative text-[9px] text-white/80 transition-transform duration-300 group-hover:translate-x-1">
                  adnan.aydin@bluewin.ch ↗
                </span>
              </motion.a>
            </div>
            </motion.div>
            )}
          </div>

          {/* Right half is completely empty */}
          <div className="hidden min-[1000px]:block min-[1000px]:col-span-6" />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
