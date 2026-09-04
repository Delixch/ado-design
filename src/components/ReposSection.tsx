import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SectionHead } from './ui';
import { HoverEffect, RepoItem } from './ui/card-hover-effect';
import { OPEN_SECTION_EVENT } from '../lib/nav';
import { useReducedMotion } from '../lib/motion';
import { playPrint, stopPrint, playClick } from '../lib/sound';
import { cn } from '../lib/utils';
import { useLanguage } from '../lib/LanguageContext';

// Sprachneutral: Titel, Befehle (nur `cmd`/`kind`), Sterne, Link. Badge/
// Beschreibung/Details/Kommentare/Tags kommen aus t.repos.items (gleiche
// Reihenfolge) und werden in ReposSection() zusammengefuehrt.
const reposMeta: { title: string; commands?: { cmd: string; kind?: 'shell' | 'prompt' }[]; stars?: number; link: string }[] = [
  {
    title: 'Aceternity UI',
    commands: [{ cmd: 'npx shadcn@latest add card-hover-effect' }],
    stars: 14200,
    link: 'https://ui.aceternity.com',
  },
  {
    title: 'Google Antigravity',
    commands: [
      { kind: 'prompt', cmd: 'Erstelle eine responsive Navbar mit Dark Mode' },
      { kind: 'prompt', cmd: 'Finde und behebe den Bug in checkout.ts' },
      { kind: 'prompt', cmd: 'Schreibe Tests für alle Funktionen in utils.ts' },
    ],
    stars: 28900,
    link: 'https://github.com/google',
  },
  {
    title: 'Framer Motion',
    commands: [{ cmd: 'npm install framer-motion' }],
    stars: 24500,
    link: 'https://github.com/framer/motion',
  },
  {
    title: 'WebAudio Sound Engine',
    commands: [
      { cmd: 'playClick()' },
      { cmd: 'playOpen()' },
      { cmd: 'playClose()' },
      { cmd: 'playChime()' },
      { cmd: 'playPrint()' },
      { cmd: 'playGlitch()' },
    ],
    stars: 8700,
    link: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API',
  },
  {
    title: 'Three.js & WebGL',
    commands: [{ cmd: 'npm install three' }],
    stars: 98000,
    link: 'https://github.com/mrdoob/three.js',
  },
  {
    title: 'Supabase Backend',
    commands: [{ cmd: 'npm install @supabase/supabase-js' }],
    stars: 68000,
    link: 'https://github.com/supabase/supabase',
  },
  {
    title: 'Awesome MCP Servers',
    commands: [
      { cmd: 'npx -y @modelcontextprotocol/server-filesystem ~/Projekte' },
      { cmd: 'claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem ~/Projekte' },
    ],
    stars: 65000,
    link: 'https://github.com/punkpeye/awesome-mcp-servers',
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
        className="absolute inset-0 pointer-events-none bg-brand"
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
          {/* Breite statt Hoehe begrenzt: der Rahmen wird je nach
              Seiteninhalt (Kartenzahl) unterschiedlich hoch, aber die
              Rahmenbreite bleibt konstant - darauf die Obergrenze zu
              setzen (statt auf die schwankende Hoehe) haelt das Foto
              gleich gross, ohne das Seitenverhaeltnis zu verzerren. */}
          <div className="relative max-w-full" style={{ aspectRatio: '1 / 1', width: 'min(74%, 25rem)', height: 'auto' }}>
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
                  background: 'conic-gradient(from 0deg, transparent 70%, color-mix(in srgb, var(--color-brand) 50%, transparent) 95%, var(--color-brand) 100%)',
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
                <stop offset="50%" stopColor="var(--color-brand)" />
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

/* ─── Kopierbarer Terminal-Befehl ─────────────────────────────
   Sitzt auf dem hellen Papier: nur ein schwarzer Rahmen, keine
   dunkle Fuellung mehr - die war auf dem Papierhintergrund kaum
   lesbar. Statt eines Text-Labels ein Icon-Chip zum Kopieren. */
const CodeSnippet: React.FC<{ cmd: string; note: string; kind?: 'shell' | 'prompt' }> = ({ cmd, note, kind }) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        playClick();
        try {
          await navigator.clipboard.writeText(cmd);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        } catch {
          // Zwischenablage nicht verfuegbar - kein Absturz noetig.
        }
      }}
      className="group mt-3 flex w-full items-center justify-between gap-3 rounded-lg border-2 border-black px-4 py-3 text-left cursor-pointer"
    >
      <span className="min-w-0">
        <code className="block font-mono-ui text-[12px] text-[#FF3B30] truncate">
          {kind === 'prompt' ? '» ' : '$ '}{cmd}
        </code>
        <span className="block text-[10px] text-black/50 mt-0.5">{note}</span>
      </span>
      <span
        className={cn(
          'shrink-0 flex h-7 w-7 items-center justify-center rounded-full transition-colors',
          copied ? 'bg-brand text-black' : 'bg-black text-white group-hover:bg-brand group-hover:text-black',
        )}
        aria-label={copied ? t.repos.copied : t.repos.copy}
      >
        {copied ? (
          <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5">
            <path d="M4 10.5L8 14.5L16 5.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5">
            <rect x="7" y="7" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth={1.6} />
            <path d="M13 7V4.5A1.5 1.5 0 0 0 11.5 3H4.5A1.5 1.5 0 0 0 3 4.5v7A1.5 1.5 0 0 0 4.5 13H7" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
          </svg>
        )}
      </span>
    </button>
  );
};

/* ─── Ausdruck-Panel ──────────────────────────────────────────
   Statt eine Karte im Raster wachsen zu lassen (das schob das
   ganze Raster auf und streckte das Portrait darunter), erscheint
   das Detail wie ein frisch ausgedrucktes Blatt ueber dem Foto
   links - Rasterhoehe bleibt konstant, das Portrait auch. */
const RepoPrintPanel: React.FC<{ item: RepoItem | null; onClose: () => void; onHeightChange: (h: number) => void }> = ({ item, onClose, onHeightChange }) => {
  const { t } = useLanguage();
  const paperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (item) playPrint();
    return () => stopPrint();
  }, [item]);

  // Das Blatt kann laenger sein als das Raster daneben (z.B. auf einer
  // duennen letzten Seite mit nur einer Karte) - ohne diese Messung
  // schneidet `.layer`s eigenes overflow:hidden den Rest einfach ab.
  useEffect(() => {
    if (!item) {
      onHeightChange(0);
      return;
    }
    const el = paperRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => onHeightChange(entry.contentRect.height));
    observer.observe(el);
    return () => observer.disconnect();
  }, [item, onHeightChange]);

  return (
    <div
      // top-24 = 6rem, deckt sich mit dem sm:py-24 der Sektion (bei den
      // Breiten, in denen dieses Panel ueberhaupt sichtbar ist, ist
      // sm: laengst aktiv) - so faengt das Blatt exakt dort an, wo auch
      // der normale Inhalt rechts beginnt, statt unter der Nav zu verschwinden.
      className="absolute left-0 right-1/2 bottom-0 top-24 hidden min-[1000px]:block px-12 pointer-events-none z-30"
    >
      <div className="relative w-full">
      <AnimatePresence>
        {item && (
          <motion.div
            ref={paperRef}
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

                {item.commands?.map((c) => (
                  <CodeSnippet key={c.cmd} cmd={c.cmd} note={c.note} kind={c.kind} />
                ))}

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
                  {item.link.includes('github.com') ? t.repos.githubRepo : t.repos.externalLink}
                </span>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold font-mono-ui text-white bg-black hover:bg-brand hover:text-black rounded transition-colors duration-200"
                >
                  {t.repos.openBtn}
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
          aria-label={t.repos.close}
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
  const { t } = useLanguage();
  const repos: RepoItem[] = reposMeta.map((meta, i) => {
    const text = t.repos.items[i];
    return {
      title: meta.title,
      badge: text.badge,
      description: text.description,
      details: text.details,
      commands: meta.commands?.map((c, ci) => ({ ...c, note: text.commandNotes[ci] })),
      stars: meta.stars,
      tags: text.tags,
      link: meta.link,
    };
  });
  const [sectionOpen, setSectionOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [panelHeight, setPanelHeight] = useState(0);

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
        <RepoPrintPanel
          item={activeIndex !== null ? repos[activeIndex] : null}
          onClose={() => setActiveIndex(null)}
          onHeightChange={setPanelHeight}
        />
      </div>

      <div
        className="relative z-10 mx-auto w-full max-w-7xl pointer-events-none"
        style={activeIndex !== null ? { minHeight: 96 + panelHeight + 24 } : undefined}
      >
        <div className="grid grid-cols-1 gap-6 min-[1000px]:grid-cols-12 pointer-events-none">
          {/* Left half is completely empty */}
          <div className="hidden min-[1000px]:block min-[1000px]:col-span-6" />

          {/* Right half with repos content */}
          <div className="min-[1000px]:col-span-6 pointer-events-auto">
            <SectionHead
              index="04"
              eyebrow={t.repos.eyebrow}
              line1={t.repos.line1}
              line2={t.repos.line2}
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
                  {t.repos.intro}
                </p>

                {/* Mobile Split Screen Image */}
                <div className="block min-[1000px]:hidden my-6">
                  <ReposPortrait variant="mobile" />
                </div>

                <div>
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

