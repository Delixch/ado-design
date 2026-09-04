import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SectionHead } from './ui';
import { HoverEffect, RepoItem } from './ui/card-hover-effect';
import { OPEN_SECTION_EVENT } from '../lib/nav';
import { useReducedMotion } from '../lib/motion';
import { playPrint, stopPrint } from '../lib/sound';

const repos: RepoItem[] = [
  {
    title: 'Aceternity UI',
    badge: 'UI Framework',
    description: 'Moderne, animierte und immersive Tailwind CSS Komponentensammlung.',
    details:
      'Kein eigenständiges npm-Paket: Komponenten werden per shadcn-CLI direkt in den eigenen Code kopiert — z. B. mit "npx shadcn@latest add card-hover-effect". Danach gehört der Code vollständig dir, frei anpassbar mit Tailwind CSS und Framer Motion. Genau dieser Karten-Hover-Effekt hier stammt von dort.',
    stars: 14200,
    tags: ['React', 'TailwindCSS', 'Framer Motion'],
    link: 'https://ui.aceternity.com',
  },
  {
    title: 'Google Antigravity',
    badge: 'AI Agent Engine',
    description: 'Erweitertes KI-Pairing und autonomes Coding-Assistenten-System.',
    details:
      'Eigenständige, agentische Entwicklungsumgebung von Google, kein npm-Paket. Download unter antigravity.google. Der Agent liest, schreibt und testet Code direkt im Editor.',
    stars: 28900,
    tags: ['AI', 'Gemini', 'Agentic Workflow'],
    link: 'https://github.com/google',
  },
  {
    title: 'Framer Motion',
    badge: 'Animation Engine',
    description: 'Produktionsreife 60FPS-Animationsbibliothek für React.',
    details:
      'Installation: "npm install framer-motion". Deklarative Animationen für React — motion.div, AnimatePresence, geteilte Layout-Übergänge über layoutId. Treibt auf dieser Seite fast jede Bewegung an: Karten-Hover, Sektionen-Aufklappen, Seitenübergänge, auch dieses Detail-Panel.',
    stars: 24500,
    tags: ['React', 'TypeScript', 'Physics'],
    link: 'https://github.com/framer/motion',
  },
  {
    title: 'WebAudio Sound Engine',
    badge: 'Audio Engine',
    description: 'Echtzeit-Synthesizer für mechanische und Sci-Fi Soundeffekte.',
    details:
      'Kein externes Paket: eigener Code direkt auf der nativen Web Audio API, in src/lib/sound.ts. Erzeugt Klicks, Chimes und den Herzschlag-Puls der FloatingDock im Browser, ganz ohne Audio-Dateien.',
    stars: 8700,
    tags: ['WebAudio API', 'Synthesizer', 'DSP'],
    link: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API',
  },
  {
    title: 'Three.js & WebGL',
    badge: '3D Graphics',
    description: 'Hardware-beschleunigte 3D-Partikel- und Shader-Szenen im Browser.',
    details:
      'Installation: "npm install three". Die Standardbibliothek für 3D im Browser — Szenen, Kameras, Licht und GLSL-Shader über WebGL. Treibt die Partikel- und Shader-Experimente an, die als Nächstes im Bereich "Im Aufbau" live gehen.',
    stars: 98000,
    tags: ['Three.js', 'WebGL', 'GLSL Shaders'],
    link: 'https://github.com/mrdoob/three.js',
  },
  {
    title: 'Supabase Backend',
    badge: 'Open Source Firebase',
    description: 'PostgreSQL-basierte Echtzeit-Datenbank und Authentifizierungsmotor.',
    details:
      'Installation: "npm install @supabase/supabase-js". Open-Source-Alternative zu Firebase auf PostgreSQL-Basis — Datenbank, Auth, Realtime-Subscriptions und Storage über eine einzige API.',
    stars: 68000,
    tags: ['PostgreSQL', 'Realtime', 'Auth'],
    link: 'https://github.com/supabase/supabase',
  },
];

/* ─── Left Split Screen Portrait (Cloned 1:1 from ProjectsSection) ─ */
const ReposPortrait: React.FC<{ variant: 'desktop' | 'mobile' }> = ({ variant }) => {
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(false);

  return (
    <div
      className={
        variant === 'desktop'
          ? 'absolute top-0 left-0 bottom-0 w-1/2 hidden min-[1000px]:block border-r border-white/5 overflow-hidden pointer-events-auto'
          : 'relative block w-full h-[clamp(16rem,80vw,24rem)] overflow-hidden rounded-2xl pointer-events-auto'
      }
      style={{ background: '#000000' }}
    >
      {/* Background Hover Flash */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none bg-[#FF5A1F]"
        animate={{ opacity: active ? 0.85 : 0 }}
        transition={{ duration: 0.15 }}
      />

      {/* Frame Container */}
      <div
        className={`absolute overflow-hidden shadow-2xl z-0 pointer-events-auto cursor-pointer group touch-none select-none ${
          variant === 'desktop' ? 'inset-y-24 inset-x-16 rounded-2xl' : 'inset-2 rounded-xl'
        }`}
        onPointerDown={() => setActive(true)}
        onPointerUp={() => setActive(false)}
        onPointerLeave={() => setActive(false)}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative max-w-full" style={{ aspectRatio: '1 / 1', width: 'auto', height: '74%' }}>
            <img
              src="/images/projects-portrait-color.webp"
              alt="Inspiration Space"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover rounded-2xl"
            />
            {/* Spinning Sweep Ring */}
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
      </div>

      {/* Tapering SVG Graphic Stripes (Exact 1:1 geometry match with ProjectsSection) */}
      <div className="absolute inset-0 pointer-events-none opacity-90 z-10">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            {[
              { color: '#0A0A0A', delay: 0, id: `pulse-repos-0-${variant}` },
              { color: '#0A0A0A', delay: 1.125, id: `pulse-repos-1-${variant}` },
              { color: '#0A0A0A', delay: 2.25, id: `pulse-repos-2-${variant}` },
              { color: '#0A0A0A', delay: 3.375, id: `pulse-repos-3-${variant}` },
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
          <polygon points="106.3,-10 105.95,-10 30,110 28.4,110" fill={`url(#pulse-repos-0-${variant})`} />
          <polygon points="106.2,-10 105.85,-10 27,110 25.4,110" fill={`url(#pulse-repos-1-${variant})`} />
          <polygon points="106.1,-10 105.75,-10 24,110 22.4,110" fill={`url(#pulse-repos-2-${variant})`} />
          <polygon points="106.0,-10 105.65,-10 21,110 19.4,110" fill={`url(#pulse-repos-3-${variant})`} />
        </svg>
      </div>
    </div>
  );
};

/* ─── Ausdruck-Panel ──────────────────────────────────────────
   Statt eine Karte im Raster wachsen zu lassen (das schob das
   ganze Raster auf und streckte das Portrait darunter), erscheint
   das Detail wie ein frisch ausgedrucktes Blatt ueber dem Foto
   links - Rasterhoehe bleibt konstant, das Portrait auch. */
const RepoPrintPanel: React.FC<{ item: RepoItem | null; onClose: () => void; top: number }> = ({ item, onClose, top }) => {
  useEffect(() => {
    if (item) playPrint();
    return () => stopPrint();
  }, [item]);

  return (
    <div
      className="absolute left-0 right-1/2 bottom-0 hidden min-[1000px]:block px-12 pointer-events-none z-30"
      style={{ top }}
    >
      <div className="relative w-full">
      <AnimatePresence>
        {item && (
          <motion.div
            key={item.title}
            initial={{ clipPath: 'inset(0 0 0 100%)', opacity: 1 }}
            animate={{ clipPath: 'inset(0 0 0 0%)', opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }}
            transition={{ delay: 2, duration: 14, ease: 'linear' }}
            className="w-full max-h-[calc(100%-8rem)] rounded-2xl bg-[#F4F1EC] shadow-2xl pointer-events-auto overflow-y-auto"
          >
            <div className="relative w-full p-7">
              <div>
                <div className="flex items-center gap-3 mb-4 pr-10">
                  {item.badge && (
                    <span className="font-mono-ui text-[10px] uppercase tracking-[0.14em] text-black/50 border border-black/20 rounded-sm px-2 py-0.5">
                      {item.badge}
                    </span>
                  )}
                  {item.stars && (
                    <span className="font-mono-ui text-[11px] text-black/50">
                      ★ {(item.stars / 1000).toFixed(1)}k
                    </span>
                  )}
                </div>

                <h4 className="font-display text-xl uppercase text-black font-bold mb-3">{item.title}</h4>

                <p className="font-sans-ui text-[13px] leading-relaxed text-black/75">
                  {item.details ?? item.description}
                </p>

                {item.tags && (
                  <div className="flex flex-wrap gap-1.5 mt-5">
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        className="font-mono-ui text-[9px] uppercase tracking-[0.1em] text-black/60 border border-black/15 rounded px-1.5 py-0.5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-black/10 flex items-center justify-between gap-4">
                <span className="font-mono-ui text-[10px] text-black/40 uppercase">
                  {item.link.includes('github.com') ? 'GitHub Repository' : 'Externer Link'}
                </span>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold font-mono-ui text-white bg-black hover:bg-[#FF5A1F] rounded transition-colors duration-200"
                >
                  ÖFFNEN ↗
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ausserhalb der geclippten Papier-Flaeche: bleibt sofort
          klickbar, auch waehrend das Blatt noch herausfaehrt. */}
      {item && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Schliessen"
          className="absolute top-5 right-5 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-black/20 text-black hover:bg-black hover:text-white transition-colors cursor-pointer pointer-events-auto"
        >
          ✕
        </button>
      )}
      </div>
    </div>
  );
};

/* ─── Main Repos Section ───────────────────────────────────── */
export const ReposSection: React.FC = () => {
  const [sectionOpen, setSectionOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [panelTop, setPanelTop] = useState(96);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const d = (e as CustomEvent<string>).detail;
      if (d === 'repos' || d === 'all') setSectionOpen(true);
    };
    window.addEventListener(OPEN_SECTION_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_SECTION_EVENT, onOpen);
  }, []);

  // Das Ausdruck-Panel soll immer exakt auf Hoehe der ersten Kartenreihe
  // starten - nicht geschaetzt, sondern an der echten Position der Karten
  // gemessen. Wird laenger, waechst es einfach nach unten weiter.
  useLayoutEffect(() => {
    const measure = () => {
      if (!sectionRef.current || !gridRef.current) return;
      const sectionTop = sectionRef.current.getBoundingClientRect().top;
      const gridTop = gridRef.current.getBoundingClientRect().top;
      setPanelTop(gridTop - sectionTop);
    };
    measure();
    window.addEventListener('resize', measure);
    const id = window.setTimeout(measure, 300);
    return () => {
      window.removeEventListener('resize', measure);
      window.clearTimeout(id);
    };
  }, [sectionOpen]);

  return (
    <section
      ref={sectionRef}
      id="repos"
      className="framed relative w-full overflow-hidden py-16 fluid-gutter sm:py-24"
      style={{ background: '#000000' }}
    >
      {/* Dark left-half split screen background (Exact clone of ProjectsSection) */}
      <div className="layer pointer-events-none">
        <ReposPortrait variant="desktop" />
        <RepoPrintPanel
          item={activeIndex !== null ? repos[activeIndex] : null}
          onClose={() => setActiveIndex(null)}
          top={panelTop}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl pointer-events-none">
        <div className="grid grid-cols-1 gap-6 min-[1000px]:grid-cols-12 pointer-events-none">
          {/* Left half is completely empty */}
          <div className="hidden min-[1000px]:block min-[1000px]:col-span-6" />

          {/* Right half with repos content */}
          <div className="min-[1000px]:col-span-6 pointer-events-auto">
            <SectionHead
              index="04"
              eyebrow="Inspirationsquellen"
              line1="Favoriten &"
              line2="Inspiration."
              headClass="fluid-display-xs"
              className="mb-8 max-w-4xl"
              gradientLine2={true}
              contentClass="min-[1000px]:pl-4 min-[1000px]:pr-0"
              open={sectionOpen}
              onToggleOpen={() => setSectionOpen((v) => !v)}
            />

            {sectionOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-4"
              >
                <p className="card-body">
                  Eine Auswahl an Open-Source-Tools und Repositories, die meine tägliche Arbeit inspirieren.
                  Fahren Sie mit der Maus über die Karten, um die interaktiven Effekte zu entdecken.
                </p>

                {/* Mobile Split Screen Image */}
                <div className="block min-[1000px]:hidden my-6">
                  <ReposPortrait variant="mobile" />
                </div>

                <div ref={gridRef}>
                  <HoverEffect items={repos} activeIndex={activeIndex} onActiveIndexChange={setActiveIndex} />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

