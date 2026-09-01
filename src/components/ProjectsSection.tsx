import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { projects } from '../lib/projects';
import type { Project } from '../lib/projects';
import { useMediaQuery } from '../lib/motion';
import { SectionHead } from './ui';

/** Zu jedem Projekt liegt ein Bildschirmfoto unter /shots. */
const shot = (project: Project) => `/shots/${project.number}.webp`;

/** Der sichtbare Teil einer Zeile — in beiden Fassungen gleich. */const Row: React.FC<{ project: Project; isActive: boolean }> = ({ project, isActive }) => (
  <>
    <span
      className={`font-mono-ui w-8 shrink-0 text-[10px] transition-colors duration-300 relative z-10 ${
        isActive ? 'font-semibold text-white' : 'text-white/80'
      }`}
    >
      {project.number}
    </span>

    <span
      className={`font-sans-ui text-[12.5px] uppercase tracking-[0.08em] leading-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] relative z-10 ${
        isActive ? 'translate-x-3 text-[#FF5A1F] font-bold' : 'text-[#FF5A1F]'
      }`}
    >
      {project.title}
    </span>

    <span
      className={`font-mono-ui ml-auto hidden shrink-0 text-[9px] uppercase tracking-[0.14em] transition-colors duration-300 min-[760px]:block relative z-10 ${
        isActive ? 'text-white' : 'text-white/70'
      }`}
    >
      {project.category}
    </span>

    <span
      className={`font-robot shrink-0 text-[12px] transition-all duration-300 relative z-10 ${
        isActive ? 'translate-x-1 -translate-y-1 scale-110 text-white' : 'text-white/70'
      }`}
      aria-hidden
    >
      ↗
    </span>
  </>
);

// Alle Karten tragen denselben Ton — ein Eintrag statt vier
// identischer, `% length` liefert ihn unabhaengig vom Index.
const projectColors = ['#0A0A0A'];

/**
 * Die Projekte als reine Liste auf schwarzer Wand: neun Zeilen,
 * gross gesetzt. Wer mit dem Zeiger darueberfaehrt, bekommt das
 * Bildschirmfoto mitten ins Bild, es haengt dem Zeiger nach.
 *
 * Ein Zeiger ist aber nicht ueberall vorhanden. Die Fassung fuer
 * Finger klappt dieselbe Zeile stattdessen auf. Beide haengen an
 * EINER Abfrage — `(hover: hover)` —, damit zwischen ihnen keine
 * Luecke entstehen kann.
 */

/* ─── Portrait mit Neon-Grid-Effekt ─────────────────────────
   Eigenes Effekt (Grid + Scanlines), nicht das TV-Static aus
   Über-mich. Zweimal gemountet: Split-Panel auf dem Desktop,
   eingereihter Block auf Mobil — dort loest `pointerdown` den
   Effekt aus, `pointerup`/`pointercancel` beendet ihn. */
const ProjectsPortrait: React.FC<{ variant: 'desktop' | 'mobile' }> = ({ variant }) => {
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

  const flashlightMask = useMotionTemplate`radial-gradient(200px circle at ${maskX}px ${maskY}px, black 0%, transparent 100%)`;

  /* Innerhalb des Fotos bleibt der kleine, dem Zeiger folgende Kreis
     (Neon-Grid-Flashlight) unveraendert. Nur im schwarzen Rand
     DRUMHERUM schaltet die ganze Flaeche wie ein Lichtschalter auf
     Orange — an, sobald der Zeiger dort steht, sofort wieder aus,
     sobald er ins Foto oder aus der Flaeche wandert. */
  const [bgHover, setBgHover] = useState(false);
  const photoRef = useRef<HTMLDivElement>(null);
  const trackOutside = (e: React.PointerEvent<HTMLDivElement>) => {
    const photo = photoRef.current;
    if (!photo) return;
    const r = photo.getBoundingClientRect();
    const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    setBgHover(!inside);
  };

  return (
    <div
      onPointerMove={trackOutside}
      onPointerLeave={() => setBgHover(false)}
      className={
        variant === 'desktop'
          ? 'absolute top-0 left-0 bottom-0 w-1/2 hidden min-[1000px]:block border-r border-white/5 overflow-hidden pointer-events-auto'
          : 'relative block w-full h-[clamp(16rem,80vw,24rem)] overflow-hidden rounded-2xl pointer-events-auto'
      }
      style={{ background: '#000000' }}
    >
      {/* Flaechendeckendes, flaches Orange bei Hover — kein Verlauf,
        wie ein Lichtschalter: an/aus. */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none bg-[#FF5A1F]"
        animate={{ opacity: bgHover ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      />

      {/* Portrait Image with Neon Grid Flashlight */}
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
        {/* Bild auf sein Seitenverhaeltnis (2048:2048, quadratisch)
            fixiert, damit `object-cover` nichts abschneidet. Die
            Lampen sind bereits im Foto warm beleuchtet — kein
            CSS-Lichtfleck mehr noetig. */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div ref={photoRef} className="relative max-w-full" style={{ aspectRatio: '1 / 1', width: 'auto', height: '74%' }}>
            <img
              src="/images/projects-portrait-color.webp"
              alt="Portrait"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Das Foto zeigt selbst einen Steinkreis — derselbe
                orange Spin-Sweep wie bei den Karten, auf einen duennen
                Rand maskiert, passend auf diesen Kreis gelegt. */}
            <div
              aria-hidden
              className="absolute top-[5%] left-1/2 aspect-square h-[78%] -translate-x-1/2 rounded-full pointer-events-none overflow-hidden"
              style={{
                WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))',
                mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))',
              }}
            >
              <div
                className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%]"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 70%, rgba(255,90,31,0.5) 95%, #FF5A1F 100%)',
                  animation: 'sequence-spin-9 20s linear infinite',
                }}
              />
            </div>
          </div>
        </div>

        {/* Neon Orange Grid & Scanline Effect - Revealed on Hover (Desktop) / Hold (Touch) */}
        <motion.div
          className={`absolute inset-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-100 ${
            active ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            WebkitMaskImage: flashlightMask,
            maskImage: flashlightMask,
          }}
        >
          {/* Orange tint on the image */}
          <div className="absolute inset-0 bg-[#FF5A1F] mix-blend-color opacity-60" />
          {/* Glowing grid */}
          <div
            className="absolute inset-0 opacity-[0.8] mix-blend-screen"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 16 0 L 0 0 0 16' fill='none' stroke='%23FF5A1F' stroke-width='1' stroke-opacity='0.5'/%3E%3C/svg%3E")`,
              backgroundSize: '16px 16px'
            }}
          />
          {/* High contrast overlay to pop the whites */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#FF5A1F]/20 mix-blend-overlay" />
        </motion.div>
      </div>

      {/* Custom Tapering SVG Graphic Stripes (converging to top-right corner) with looping pulse */}
      <div className="absolute inset-0 pointer-events-none opacity-90 z-10">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            {[
              { color: '#0A0A0A', delay: 0, id: `pulse-projects-0-${variant}` },
              { color: '#0A0A0A', delay: 1.125, id: `pulse-projects-1-${variant}` },
              { color: '#0A0A0A', delay: 2.25, id: `pulse-projects-2-${variant}` },
              { color: '#0A0A0A', delay: 3.375, id: `pulse-projects-3-${variant}` }
            ].map((s) => (
              <motion.linearGradient
                key={s.id}
                id={s.id}
                x1="100%"
                y1="-100%"
                x2="0%"
                y2="0%"
                animate={{
                  y1: ["-100%", "200%"],
                  y2: ["0%", "300%"]
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: s.delay,
                }}
              >
                <stop offset="0%" stopColor={s.color} />
                <stop offset="42%" stopColor={s.color} />
                <stop offset="50%" stopColor="#FF5A1F" />
                <stop offset="58%" stopColor={s.color} />
                <stop offset="100%" stopColor={s.color} />
              </motion.linearGradient>
            ))}
          </defs>
          <polygon points="106.3,-10 105.95,-10 30,110 28.4,110" fill={`url(#pulse-projects-0-${variant})`} />
          <polygon points="106.2,-10 105.85,-10 27,110 25.4,110" fill={`url(#pulse-projects-1-${variant})`} />
          <polygon points="106.1,-10 105.75,-10 24,110 22.4,110" fill={`url(#pulse-projects-2-${variant})`} />
          <polygon points="106.0,-10 105.65,-10 21,110 19.4,110" fill={`url(#pulse-projects-3-${variant})`} />
        </svg>
      </div>
    </div>
  );
};

export const ProjectsSection: React.FC = () => {
  const canHover = useMediaQuery('(hover: hover) and (pointer: fine)');

  const [active, setActive] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const [sectionOpen, setSectionOpen] = useState(true);

  // Zeigerlage in Fensterkoordinaten, auf eine Feder gelegt: das
  // Bild zieht dem Zeiger nach, statt an ihm zu kleben.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 170, damping: 24, mass: 0.7 });
  const sy = useSpring(py, { stiffness: 170, damping: 24, mass: 0.7 });
  // Die Neigung kommt aus der Nachlaufstrecke selbst: je schneller
  // der Zeiger, desto weiter liegt das Bild hinter ihm.
  const tilt = useTransform([px, sx], ([a, b]) =>
    Math.max(-14, Math.min(14, ((a as number) - (b as number)) * 0.12)),
  );

  const handleMove = (e: React.PointerEvent<HTMLElement>) => {
    px.set(e.clientX);
    py.set(e.clientY);
  };

  return (
    <section
      id="work"
      onPointerMove={canHover ? handleMove : undefined}
      className="tinted framed relative w-full overflow-hidden py-16 fluid-gutter sm:py-24"
      /* Der Abschnitt ist eine dunkle Wand, von Rahmen zu Rahmen. */
      style={{ ['--ground-tone' as string]: '#000000', background: '#000000' }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes sequence-spin-9 {
          0% { transform: rotate(0deg); opacity: 1; }
          11% { transform: rotate(360deg); opacity: 1; }
          11.1% { transform: rotate(360deg); opacity: 0; }
          100% { transform: rotate(360deg); opacity: 0; }
        }
      ` }} />
      {/* Dark left-half split screen background (wrapped in .layer to escape .tinted > *) */}
      <div className="layer pointer-events-none">
        <ProjectsPortrait variant="desktop" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl pointer-events-none">
        <div className="grid grid-cols-1 gap-6 min-[1000px]:grid-cols-12 pointer-events-none">
          
          {/* Left half is completely empty */}
          <div className="hidden min-[1000px]:block min-[1000px]:col-span-6" />

          {/* Right half with minimized projects content */}
          <div className="min-[1000px]:col-span-6 pointer-events-auto">
            <SectionHead
              index="02"
              eyebrow="Projekte"
              line1="Neun Arbeiten,"
              line2="eine Handschrift."
              headClass="fluid-display-xs"
              className="mb-8 max-w-4xl"
              gradientLine2={true}
              contentClass="min-[1000px]:pl-12 min-[1000px]:pr-0"
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
            {/* Mobil: gleicher Grid-Effekt wie das Split-Panel, im
                Inhaltsfluss. Halten statt Hover. */}
            <div className="mb-6 min-[1000px]:hidden">
              <ProjectsPortrait variant="mobile" />
            </div>

            <ul className="flex flex-col gap-3 min-[1000px]:pl-12">
              {projects.map((project, i) => {
                const isActive = canHover ? active === i : open === i;
                const baseColor = projectColors[i % projectColors.length];
                const hoverColor = projectColors[(i + 1) % projectColors.length];
                const currentColor = isActive ? hoverColor : baseColor;

                return (
                  <li key={project.number} className="list-none">
                    <motion.div
                      animate={!isActive && i === 2 ? {
                        opacity: [1, 0.55, 1],
                        boxShadow: [
                          "0 0 0px rgba(94, 53, 177, 0)",
                          "0 0 25px rgba(94, 53, 177, 0.85)",
                          "0 0 0px rgba(94, 53, 177, 0)"
                        ]
                      } : {
                        opacity: 1,
                        boxShadow: "0 0 0px rgba(0,0,0,0)"
                      }}
                      transition={!isActive && i === 2 ? {
                        repeat: Infinity,
                        duration: 2.2,
                        ease: "easeInOut"
                      } : undefined}
                      className="rounded-2xl"
                    >
                      {canHover ? (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onPointerEnter={() => setActive(i)}
                          onPointerLeave={() => setActive((v) => (v === i ? null : v))}
                          onFocus={() => setActive(i)}
                          onBlur={() => setActive((v) => (v === i ? null : v))}
                          className="relative block w-full overflow-hidden p-[1px] rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] border border-white/5 shadow-sm"
                        >
                          {/* Animated Neon Line */}
                          <div 
                            className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] pointer-events-none"
                            style={{
                              background: 'conic-gradient(from 0deg, transparent 70%, rgba(255,255,255,0.4) 95%, #ffffff 100%)',
                              animation: `sequence-spin-9 18s linear infinite`,
                              animationDelay: `${i * 2}s`,
                              opacity: 0,
                              zIndex: 0,
                            }}
                          />
                          <div
                            className="relative z-10 flex w-full items-center gap-5 py-4 px-5 rounded-[15px] transition-colors duration-500"
                            style={{ backgroundColor: currentColor }}
                          >
                            <Row project={project} isActive={isActive} />
                          </div>
                        </a>
                      ) : (
                        <button
                          onClick={() => setOpen((v) => (v === i ? null : i))}
                          aria-expanded={isActive}
                          className="relative block text-left w-full overflow-hidden p-[1px] rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] border border-white/5 shadow-sm"
                        >
                          {/* Animated Neon Line */}
                          <div 
                            className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] pointer-events-none"
                            style={{
                              background: 'conic-gradient(from 0deg, transparent 70%, rgba(255,255,255,0.4) 95%, #ffffff 100%)',
                              animation: `sequence-spin-9 18s linear infinite`,
                              animationDelay: `${i * 2}s`,
                              opacity: 0,
                              zIndex: 0,
                            }}
                          />
                          <div
                            className="relative z-10 flex w-full items-center gap-5 py-4 px-5 rounded-[15px] transition-colors duration-500"
                            style={{ backgroundColor: currentColor }}
                          >
                            <Row project={project} isActive={isActive} />
                          </div>
                        </button>
                      )}
                    </motion.div>

                    {/* Aufgeklappte Fassung fuer Finger */}
                    {!canHover && (
                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <div 
                              className="pb-7 px-5 pt-6 rounded-b-2xl border-x border-b -mt-2"
                              style={{
                                backgroundColor: '#000000',
                                borderColor: `${currentColor}30`,
                              }}
                            >
                              <img
                                src={shot(project)}
                                alt={`${project.title} — Bildschirmfoto`}
                                loading="lazy"
                                decoding="async"
                                className="w-full rounded-xl border border-white/10 grayscale"
                              />
                              <p className="font-sans-ui fluid-body-s mt-4 leading-[1.75] text-white/80">
                                {project.description}
                              </p>
                              <dl className="mt-4 grid grid-cols-3 gap-2">
                                {project.metrics.map((m) => (
                                  <div key={m.label}>
                                    <dt className="font-mono-ui text-[9.5px] uppercase tracking-[0.14em] text-white/60">
                                      {m.label}
                                    </dt>
                                    <dd className="font-sans-ui fluid-body-s mt-0.5 text-white">
                                      {m.value}
                                    </dd>
                                  </div>
                                ))}
                              </dl>
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-robot mt-5 inline-flex items-center gap-2 rounded-full px-5 py-3 text-[10.5px] uppercase tracking-[0.16em] text-white"
                                style={{ backgroundColor: baseColor }}
                              >
                                Seite ansehen ↗
                              </a>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </li>
                );
              })}
            </ul>

            <p className="font-mono-ui mt-10 text-[9px] uppercase tracking-[0.2em] text-white/45">
              {canHover ? 'Zeiger auf eine Zeile — das Bild folgt' : 'Zeile antippen'} · neun Arbeiten
            </p>
            </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Das mitlaufende Bild haengt am Fenster, nicht an der Zeile
          — deshalb `fixed`. Es steht nur, solange der Zeiger auf
          einer Zeile ist, und verlaesst danach den Baum: eine
          Ebene, die dauerhaft mitliefe, waere bei jedem Bild neu
          zu zeichnen. */}
      {canHover && (
        <AnimatePresence>
          {active !== null && (() => {
            const activeAccent = projectColors[active % projectColors.length];
            return (
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.8, rotate: -4 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, rotate: 4 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{ left: sx, top: sy, position: 'fixed', rotate: tilt }}
                className="pointer-events-none z-30 -translate-x-1/2 -translate-y-1/2"
              >
                {/* Premium glass frame container */}
                <div 
                  className="relative overflow-hidden rounded-3xl p-2"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(16px)',
                    border: `1px solid ${activeAccent}33`,
                    boxShadow: `0 30px 60px rgba(0,0,0,0.85), 0 0 50px ${activeAccent}18, inset 0 1px 0 rgba(255,255,255,0.15)`,
                    width: 'clamp(16rem, 11rem + 23vw, 28rem)',
                  }}
                >
                  {/* Global theme stripes with circles inside the hover card */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl z-20 opacity-80">
                    <div className="absolute bottom-0 right-0 translate-x-6 translate-y-12 -rotate-45 flex gap-2">
                      {/* Orange Stripe with nodes */}
                      <div className="w-1.5 h-44 bg-[#FF6B35] rounded-full relative">
                        <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#FF6B35] border border-white/30" />
                        <div className="absolute top-[50%] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#FF6B35] border border-white/30" />
                      </div>
                      {/* Cyan Stripe */}
                      <div className="w-1.5 h-44 bg-[#00D4FF] rounded-full relative">
                        <div className="absolute top-[35%] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#00D4FF] border border-white/30" />
                        <div className="absolute top-[60%] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#00D4FF] border border-white/30" />
                      </div>
                      {/* Purple Stripe */}
                      <div className="w-1.5 h-44 bg-[#A855F7] rounded-full relative">
                        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#A855F7] border border-white/30" />
                        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#A855F7] border border-white/30" />
                      </div>
                      {/* Pink Stripe */}
                      <div className="w-1.5 h-44 bg-[#FF3CAC] rounded-full relative">
                        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#FF3CAC] border border-white/30" />
                        <div className="absolute top-[55%] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#FF3CAC] border border-white/30" />
                      </div>
                    </div>
                  </div>

                  {/* Inner image container */}
                  <div className="relative overflow-hidden rounded-2xl border border-white/5 z-10">
                    <img
                      src={shot(projects[active])}
                      alt=""
                      aria-hidden
                      className="block w-full grayscale contrast-[1.1]"
                      style={{
                        transform: 'scale(1.02)',
                      }}
                    />
                    {/* Subtle color overlay using the active project's own accent color */}
                    <span 
                      className="absolute inset-0 mix-blend-color opacity-35" 
                      style={{
                        background: `linear-gradient(135deg, ${activeAccent} 0%, transparent 100%)`,
                      }}
                    />

                    {/* Scanning laser line using the project's accent color */}
                    <span
                      className="scan-run absolute inset-x-0 top-0 h-10 opacity-40 pointer-events-none"
                      style={{
                        background: `linear-gradient(180deg, transparent, ${activeAccent}, transparent)`,
                        animationDuration: '2.5s',
                      }}
                    />
                    
                    {/* Category overlay label */}
                    <div 
                      className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md text-[9px] font-mono font-semibold text-white/90 uppercase tracking-widest"
                      style={{
                        background: 'rgba(10,10,15,0.8)',
                        backdropFilter: 'blur(8px)',
                        border: `1px solid ${activeAccent}40`,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                      }}
                    >
                      {projects[active].category.split(' / ')[0]}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      )}
    </section>
  );
};

export default ProjectsSection;
