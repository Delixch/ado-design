import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SectionHead } from './ui';
import { HoverEffect, RepoItem } from './ui/card-hover-effect';
import { OPEN_SECTION_EVENT } from '../lib/nav';
import { useReducedMotion } from '../lib/motion';

const repos: RepoItem[] = [
  {
    title: 'Aceternity UI',
    badge: 'UI Framework',
    description: 'Moderne, animierte und immersive Tailwind CSS Komponentensammlung.',
    stars: 14200,
    tags: ['React', 'TailwindCSS', 'Framer Motion'],
    link: 'https://ui.aceternity.com',
  },
  {
    title: 'Google Antigravity',
    badge: 'AI Agent Engine',
    description: 'Erweitertes KI-Pairing und autonomes Coding-Assistenten-System.',
    stars: 28900,
    tags: ['AI', 'Gemini', 'Agentic Workflow'],
    link: 'https://github.com/google',
  },
  {
    title: 'Framer Motion',
    badge: 'Animation Engine',
    description: 'Produktionsreife 60FPS-Animationsbibliothek für React.',
    stars: 24500,
    tags: ['React', 'TypeScript', 'Physics'],
    link: 'https://github.com/framer/motion',
  },
  {
    title: 'WebAudio Sound Engine',
    badge: 'Audio Engine',
    description: 'Echtzeit-Synthesizer für mechanische und Sci-Fi Soundeffekte.',
    stars: 8700,
    tags: ['WebAudio API', 'Synthesizer', 'DSP'],
    link: 'https://github.com/Delixch/ado-design',
  },
  {
    title: 'Three.js & WebGL',
    badge: '3D Graphics',
    description: 'Hardware-beschleunigte 3D-Partikel- und Shader-Szenen im Browser.',
    stars: 98000,
    tags: ['Three.js', 'WebGL', 'GLSL Shaders'],
    link: 'https://github.com/mrdoob/three.js',
  },
  {
    title: 'Supabase Backend',
    badge: 'Open Source Firebase',
    description: 'PostgreSQL-basierte Echtzeit-Datenbank und Authentifizierungsmotor.',
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

/* ─── Main Repos Section ───────────────────────────────────── */
export const ReposSection: React.FC = () => {
  const [sectionOpen, setSectionOpen] = useState(false);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const d = (e as CustomEvent<string>).detail;
      if (d === 'repos' || d === 'all') setSectionOpen(true);
    };
    window.addEventListener(OPEN_SECTION_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_SECTION_EVENT, onOpen);
  }, []);

  return (
    <section
      id="repos"
      className="framed relative w-full overflow-hidden py-16 fluid-gutter sm:py-24"
      style={{ background: '#000000' }}
    >
      {/* Dark left-half split screen background (Exact clone of ProjectsSection) */}
      <div className="layer pointer-events-none">
        <ReposPortrait variant="desktop" />
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

                {/* Official Aceternity UI Hover Effect Component */}
                <HoverEffect items={repos} />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

