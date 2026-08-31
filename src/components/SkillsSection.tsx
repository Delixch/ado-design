import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { SectionHead } from './ui';

/* ─── Type definitions & Data ───────────────────────────── */
interface SkillBlock {
  title: string;
  badge: string;
  stat: string;
  items: string[];
  description: string;
  span: string;
  accent: string;
}

const blocks: SkillBlock[] = [
  {
    title: 'Echtzeit-3D & Motion',
    badge: 'Kernstärke',
    stat: 'Ein Canvas, volle Szene',
    items: ['Three.js', 'WebGL', 'GLSL', 'GSAP', 'ScrollTrigger'],
    description:
      'Partikelszenen, Shader und scroll-getriebene Kamerafahrten — gebaut für flüssige 60 Bilder pro Sekunde, auch auf dem Handy.',
    span: 'min-[1000px]:col-span-7',
    accent: '#FF5A1F',
  },
  {
    title: 'Frontend-Handwerk',
    badge: 'Oberfläche',
    stat: 'Mobil zuerst',
    items: ['TypeScript', 'React', 'Material UI', 'SCSS', 'Vite'],
    description:
      'Sauber getrennte Bausteine, klare Typografie, bedienbar mit Tastatur und Screenreader — nicht nur hübsch, sondern benutzbar.',
    span: 'min-[1000px]:col-span-5',
    accent: '#00738C',
  },
  {
    title: 'Daten & Betrieb',
    badge: 'Fundament',
    stat: 'Vom Formular bis zur Mail',
    items: ['Supabase', 'PostgreSQL', 'MySQL / phpMyAdmin', 'PHP'],
    description:
      'Tabellen, Beziehungen und Abfragen von Hand geschrieben. Deployment auf Vercel und Cloudflare Pages, inklusive Formularen und E-Mail-Versand.',
    span: 'min-[1000px]:col-span-5',
    accent: '#5E35B1',
  },
  {
    title: 'Künstliche Intelligenz im Alltag',
    badge: 'Werkstatt',
    stat: 'Täglich im Einsatz',
    items: ['Prompt Engineering', 'Bild- & Videogenerierung', 'Serverbefehle', 'Automatisierung'],
    description:
      'Ich nutze KI dort, wo sie Zeit spart — und dokumentiere jeden Schritt auf ADNAN 3D, damit andere ihn nachvollziehen können.',
    span: 'min-[1000px]:col-span-7',
    accent: '#C2185B',
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 34, filter: 'blur(6px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

/* ─── Card 0: Floating particles for 3D card ──────────────── */
const FloatingParticles: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-[#FF5A1F]/20 filter blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
      {[
        { x: [10, 50, -20, 10], y: [20, -50, 40, 20], delay: 0 },
        { x: [-30, 40, -10, -30], y: [-20, 60, -30, -20], delay: 0.8 },
        { x: [50, -30, 30, 50], y: [40, -20, 60, 40], delay: 1.6 },
        { x: [-40, 20, -50, -40], y: [60, 20, -40, 60], delay: 2.4 },
        { x: [20, -40, 10, 20], y: [-30, 30, -50, -30], delay: 3.2 },
        { x: [-10, 30, -20, -10], y: [50, -60, 20, 50], delay: 4.0 },
      ].map((p, idx) => (
        <motion.div
          key={idx}
          className="absolute w-1.5 h-1.5 rounded-full bg-[#FF5A1F]/40"
          style={{
            left: `${15 * (idx + 1)}%`,
            top: `${14 * (idx + 1)}%`,
          }}
          animate={{ x: p.x, y: p.y }}
          transition={{
            repeat: Infinity,
            duration: 6,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

/* ─── Card 1: Precision grid coordinate tooltip ────────────── */
const PrecisionCoordinates: React.FC<{ mx: any; my: any }> = ({ mx, my }) => {
  const xVal = useTransform(mx, [-0.5, 0.5], [0, 400]);
  const yVal = useTransform(my, [-0.5, 0.5], [0, 240]);
  const [coords, setCoords] = useState({ x: 200, y: 120 });

  useEffect(() => {
    const unsubX = xVal.on('change', (v) => setCoords((prev) => ({ ...prev, x: Math.round(v) })));
    const unsubY = yVal.on('change', (v) => setCoords((prev) => ({ ...prev, y: Math.round(v) })));
    return () => { unsubX(); unsubY(); };
  }, [xVal, yVal]);

  return (
    <div className="absolute right-6 bottom-4 opacity-0 group-hover:opacity-85 transition-opacity duration-500 font-mono text-[9px] text-[#00D4FF] select-none text-right">
      <div>ALIGN: GLYPH_GRID</div>
      <div>COORD: X={coords.x}px Y={coords.y}px</div>
    </div>
  );
};

/* ─── Card 3: AI Typewriter Prompt Simulator ───────────────── */
const AICommandPrompt: React.FC = () => {
  const prompts = [
    'ai.generate("3d_blueprint")',
    'ai.optimize_performance()',
    'ai.sync_database()',
    'ai.deploy_production()'
  ];
  const [text, setText] = useState('');
  const [promptIndex, setPromptIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: number;
    const currentFullText = prompts[promptIndex];
    
    if (isDeleting) {
      timer = window.setTimeout(() => {
        setText(currentFullText.substring(0, text.length - 1));
      }, 30);
    } else {
      timer = window.setTimeout(() => {
        setText(currentFullText.substring(0, text.length + 1));
      }, 70);
    }

    if (!isDeleting && text === currentFullText) {
      timer = window.setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && text === '') {
      setIsDeleting(false);
      setPromptIndex((prev) => (prev + 1) % prompts.length);
    }

    return () => window.clearTimeout(timer);
  }, [text, isDeleting, promptIndex]);

  return (
    <div className="absolute right-6 bottom-4 opacity-0 group-hover:opacity-100 transition-all duration-500 font-mono text-[9px] bg-black/45 backdrop-blur-md border border-white/15 px-3 py-2 rounded-xl select-none text-right shadow-xl max-w-[210px] overflow-hidden">
      <div className="flex items-center gap-1.5 justify-end">
        <span className="text-white/40 font-bold">$</span>
        <span className="text-[#00FF88] font-bold">{text}</span>
        <span className="cursor-blink font-bold text-[#00FF88] ml-0.5">█</span>
      </div>
    </div>
  );
};

const SkillCard: React.FC<{ block: SkillBlock; i: number }> = ({ block, i }) => {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(mx, [-0.5, 0.5], [12, -12]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(my, [-0.5, 0.5], [-12, 12]), { stiffness: 200, damping: 20 });

  const cardContent = (
    <motion.article
      custom={i}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-70px' }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      style={{ rotateX: ry, rotateY: rx, transformStyle: 'preserve-3d' }}
      className="group relative overflow-hidden rounded-2xl p-[1px] cursor-default border border-white/15 shadow-lg h-full"
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
      <div className="relative w-full h-full rounded-[15px] z-10 p-5 overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]"
           style={{ backgroundColor: '#0F0F0F' }}>
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
        <div className="absolute inset-0 rounded-[15px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `radial-gradient(circle at 50% 0%, rgba(255,255,255,0.15) 0%, transparent 70%)` }}
        />
        {i === 0 && <FloatingParticles />}
        {i === 1 && (
          <>
            {/* Blueprint Grid Overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.06] transition-opacity duration-700 pointer-events-none"
              style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />
            <PrecisionCoordinates mx={mx} my={my} />
          </>
        )}
        {i === 2 && (
          <>
            {/* Server log scroll */}
            <div className="absolute right-6 bottom-4 opacity-0 group-hover:opacity-35 transition-opacity duration-500 font-mono text-[9px] text-white/70 space-y-0.5 select-none text-right">
              <div>{"db.connect(\"postgres\") -> OK"}</div>
              <div>[SQL] SELECT * FROM works;</div>
              <div>[Vercel] Trigger deployment hook</div>
              <div>[SSL] Certificate verified (14ms)</div>
            </div>
          </>
        )}
        {i === 3 && <AICommandPrompt />}
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/70">
              {block.badge}
            </span>
            <span className="font-mono-ui rounded-full px-3.5 py-1 text-[9.5px] uppercase tracking-[0.14em] text-white/90 border border-white/20 bg-white/5"
            >
              {block.stat}
            </span>
          </div>
          <h3 className="font-display text-[15px] mt-4 uppercase leading-none text-[#FF5A1F] font-bold">{block.title}</h3>
          <p className="font-sans-ui text-[11px] mt-3 max-w-xl leading-[1.7] text-white/80">{block.description}</p>
          <div className="mt-5 flex flex-wrap gap-1.5 border-t border-white/10 pt-4">
            {block.items.map((item) => (
              <motion.span
                key={item}
                className="font-mono-ui rounded-full px-3.5 py-1.5 text-[9.5px] uppercase tracking-[0.1em] transition-all duration-300 text-white/90 bg-white/10 border border-white/15"
                whileHover={{ scale: 1.05, borderColor: '#ffffff', color: '#000000', background: '#ffffff' }}
              >
                {item}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );

  if (i === 3) {
    return (
      <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="h-full">
        {cardContent}
      </motion.div>
    );
  }
  return cardContent;
};

/* ─── Portrait mit Sivi-Distorsion-Effekt ───────────────────
   Eigenes Effekt (feDisplacementMap, folgt der Geschwindigkeit),
   nicht Grid oder TV-Static. Zweimal gemountet: Split-Panel auf
   dem Desktop, eingereihter Block auf Mobil — der Filter braucht
   pro Instanz eine eigene id, sonst teilen sich beide dieselbe
   SVG-Definition. `pointerup`/`pointercancel` setzt die
   Verzerrung auf Touch zurueck, `pointerleave` allein reicht dort
   nicht immer. */
const SkillsPortrait: React.FC<{ variant: 'desktop' | 'mobile' }> = ({ variant }) => {
  const filterId = `liquid-distortion-${variant}`;
  const distortion = useSpring(0, { damping: 15, stiffness: 60 });
  const darkOpacity = useTransform(distortion, [0, 250], [0, 0.95]);

  const lastTime = React.useRef(Date.now());
  const lastPos = React.useRef({ x: 0, y: 0 });
  const distortionTimeout = React.useRef<number | undefined>(undefined);

  const track = (e: React.PointerEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const now = Date.now();
    const dt = Math.max(now - lastTime.current, 1);
    const dx = x - lastPos.current.x;
    const dy = y - lastPos.current.y;
    const speed = Math.sqrt(dx * dx + dy * dy) / dt;

    // Scale the distortion massively based on speed
    distortion.set(Math.min(speed * 300, 350));

    lastTime.current = now;
    lastPos.current = { x, y };

    clearTimeout(distortionTimeout.current);
    distortionTimeout.current = window.setTimeout(() => {
      distortion.set(0);
    }, 150);
  };

  const handleUp = () => {
    distortion.set(0);
    clearTimeout(distortionTimeout.current);
  };

  return (
    <div
      className={
        variant === 'desktop'
          ? 'absolute top-0 right-0 bottom-0 w-1/2 hidden min-[1000px]:block border-l border-white/5 overflow-hidden pointer-events-auto'
          : 'relative block w-full h-[clamp(16rem,80vw,24rem)] overflow-hidden rounded-2xl pointer-events-auto'
      }
      style={{ background: '#000000' }}
    >
      {/* Dynamic SVG Filter for Liquid Distortion */}
      <svg className="hidden">
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise">
              <animate attributeName="baseFrequency" values="0.015;0.02;0.015" dur="5s" repeatCount="indefinite" />
            </feTurbulence>
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 2 -0.5" result="coloredNoise" />
            <motion.feDisplacementMap in="SourceGraphic" in2="coloredNoise" scale={distortion} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Team Image with Liquid Flow / Black Paint Effect */}
      <div
        className={`absolute overflow-hidden shadow-2xl z-0 pointer-events-auto cursor-crosshair group bg-black touch-none select-none ${
          variant === 'desktop' ? 'inset-y-24 inset-x-16 rounded-2xl' : 'inset-2 rounded-xl'
        }`}
        onPointerMove={track}
        onPointerDown={track}
        onPointerUp={handleUp}
        onPointerLeave={handleUp}
        onPointerCancel={handleUp}
      >
        {/* Bild auf sein Seitenverhaeltnis (1535:1024) fixiert, damit
            `object-cover` nichts abschneidet. Die Lampe ist bereits im
            Foto warm beleuchtet — kein CSS-Lichtfleck mehr noetig. */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative max-w-full" style={{ aspectRatio: '1535 / 1024', width: 'auto', height: '68%' }}>
            <div className="absolute inset-0" style={{ transform: 'scale(1.1)' }}>
              <motion.img
                src="/images/skills-team-color.png"
                alt="Team"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: `url(#${filterId})` }}
              />
            </div>

            {/* Das Foto ist selbst ein Kreis (dunkle Vignette) — der Ring
                folgt diesem Kreis, nicht der rechteckigen Karte drumherum.
                Derselbe weisse Spin-Sweep wie bei den Karten
                (`sequence-spin`, siehe StatCard/SkillCard/Row): ein
                Komet lauft einmal rum, verschwindet, wiederholt sich —
                per Maske auf einen duennen Rand reduziert. */}
            <div
              aria-hidden
              className="absolute top-[4%] left-1/2 aspect-square h-[92%] -translate-x-1/2 rounded-full pointer-events-none overflow-hidden"
              style={{
                WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))',
                mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))',
              }}
            >
              <div
                className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%]"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 70%, rgba(255,90,31,0.5) 95%, #FF5A1F 100%)',
                  animation: 'sequence-spin 8s linear infinite',
                }}
              />
            </div>
          </div>
        </div>

        {/* The "Flowing Black Paint" overlay that increases with mouse speed */}
        <motion.div
          className="absolute inset-0 bg-black pointer-events-none"
          style={{
            opacity: darkOpacity,
            filter: `url(#${filterId})`,
          }}
        />
      </div>

      {/* Custom Tapering SVG Graphic Stripes (converging to bottom-left corner) with looping pulse */}
      <div className="absolute inset-0 pointer-events-none opacity-90 z-10">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            {[
              { color: '#1E202A', delay: 0, id: `pulse-skills-0-${variant}` },
              { color: '#1E202A', delay: 1.125, id: `pulse-skills-1-${variant}` },
              { color: '#1E202A', delay: 2.25, id: `pulse-skills-2-${variant}` },
              { color: '#1E202A', delay: 3.375, id: `pulse-skills-3-${variant}` }
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
          <polygon points="70,-10 71.6,-10 -5.95,110 -6.3,110" fill={`url(#pulse-skills-0-${variant})`} />
          <polygon points="73,-10 74.6,-10 -5.85,110 -6.2,110" fill={`url(#pulse-skills-1-${variant})`} />
          <polygon points="76,-10 77.6,-10 -5.75,110 -6.1,110" fill={`url(#pulse-skills-2-${variant})`} />
          <polygon points="79,-10 80.6,-10 -5.65,110 -6.0,110" fill={`url(#pulse-skills-3-${variant})`} />
        </svg>
      </div>
    </div>
  );
};

/* ─── Main Skills Section ───────────────────────────────── */
export const SkillsSection: React.FC = () => {
  return (
    <section
      id="skills"
      className="framed relative w-full overflow-hidden py-16 fluid-gutter sm:py-24"
      style={{ background: '#000000' }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes sequence-spin {
          0% { transform: rotate(0deg); opacity: 1; }
          24.9% { transform: rotate(360deg); opacity: 1; }
          25% { transform: rotate(360deg); opacity: 0; }
          100% { transform: rotate(360deg); opacity: 0; }
        }

        @keyframes tv-static-skills {
          0% { background-position: 0px 0px; }
          20% { background-position: -50px 50px; }
          40% { background-position: 100px -20px; }
          60% { background-position: -70px 90px; }
          80% { background-position: 40px 10px; }
          100% { background-position: 0px 0px; }
        }
      ` }} />
      {/* Dark right-half split screen background (wrapped in .layer to escape .tinted > *) */}
      <div className="layer pointer-events-none">
        <SkillsPortrait variant="desktop" />
      </div>

      {/* Grain overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px',
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl z-20 pointer-events-none">
        <div className="grid grid-cols-1 gap-6 min-[1000px]:grid-cols-12 pointer-events-none">
          
          {/* Left half with minimized skills content */}
          <div className="min-[1000px]:col-span-6 pointer-events-auto">
            <SectionHead
              index="03"
              eyebrow="Werkzeuge"
              line1="Werkzeuge, die ich"
              line2="wirklich beherrsche."
              headClass="fluid-display-xs"
              className="mb-8 max-w-4xl"
              onDark={false}
              gradientLine2={true}
            />

            {/* Mobil: gleicher Distorsion-Effekt wie das Split-Panel,
                im Inhaltsfluss. Halten statt Hover. */}
            <div className="mb-6 min-[1000px]:hidden">
              <SkillsPortrait variant="mobile" />
            </div>

            {/* Compact 2x2 Grid for the 4 SkillCards within the 50% column */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ perspective: 1200 }}>
              {blocks.map((block, i) => (
                <SkillCard key={block.title} block={block} i={i} />
              ))}
            </div>
          </div>

          {/* Right half is completely empty */}
          <div className="hidden min-[1000px]:block min-[1000px]:col-span-6" />
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
