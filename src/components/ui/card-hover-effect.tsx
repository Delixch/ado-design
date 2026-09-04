import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { playClick } from '../../lib/sound';
import { scrollToSection } from '../../lib/nav';

export interface RepoCommand {
  cmd: string;
  note: string;
  // 'prompt' = natuerlichsprachiger Agenten-Prompt statt Shell-Befehl -
  // bekommt ein Sprechblasen-Zeichen statt "$" davor.
  kind?: 'shell' | 'prompt';
}

export interface RepoItem {
  title: string;
  badge?: string;
  description: string;
  details?: string;
  commands?: RepoCommand[];
  stars?: number;
  tags?: string[];
  link: string;
}

// Ab 1000px zeigt die Sektion das Portraet links - dort erscheint das
// Detail als "Ausdruck" ueber dem Foto, die Karten selbst behalten
// immer ihre Groesse. Darunter gibt es kein Portraet, dort dreht sich
// stattdessen die angetippte Karte in sich selbst.
const DESKTOP_QUERY = '(min-width: 1000px)';

const useIsDesktop = (): boolean => {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(DESKTOP_QUERY).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => setIsDesktop(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return isDesktop;
};

// 4 Karten pro Seite (2x2) - kurz genug, dass das Ausdruck-Panel links
// ohne grosse Hoehensprung zwischen den Seiten passt und der Nutzer
// nicht staendig scrollen muss.
const PAGE_SIZE = 4;

export const HoverEffect = ({
  items,
  activeIndex,
  onActiveIndexChange,
  className,
}: {
  items: RepoItem[];
  activeIndex: number | null;
  onActiveIndexChange: (idx: number | null) => void;
  className?: string;
}) => {
  const isDesktop = useIsDesktop();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(items.length / PAGE_SIZE);
  const pageStart = page * PAGE_SIZE;

  const goToPage = (p: number) => {
    playClick();
    setPage(p);
    setHoveredIndex(null);
    setFlippedIndex(null);
    onActiveIndexChange(null);
    // Seitenwechsel kann die Rasterhoehe aendern (letzte Seite hat
    // weniger Karten) - dieselbe Sprung-Logik wie das Nav-Menu zieht
    // den Abschnittsanfang zurueck an seinen festen Platz.
    scrollToSection('repos');
  };

  return (
    <div>
    <div
      className={cn('relative grid grid-cols-1 sm:grid-cols-2 gap-x-1 gap-y-3.5 py-4', className)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {items.map((item, idx) => {
        if (idx < pageStart || idx >= pageStart + PAGE_SIZE) return null;
        const isFlipped = !isDesktop && flippedIndex === idx;
        return (
          <div
            key={item.title}
            className={cn('relative group block p-2 w-full', isDesktop ? 'h-[280px]' : 'h-[320px]')}
            style={{ perspective: 1200 }}
            role={isDesktop ? undefined : 'button'}
            tabIndex={isDesktop ? undefined : 0}
            onMouseEnter={() => {
              if (!isDesktop) return;
              setHoveredIndex(idx);
            }}
            onClick={() => {
              if (isDesktop) return;
              playClick();
              setFlippedIndex((cur) => (cur === idx ? null : idx));
            }}
            onKeyDown={(e) => {
              if (isDesktop || (e.key !== 'Enter' && e.key !== ' ')) return;
              e.preventDefault();
              playClick();
              setFlippedIndex((cur) => (cur === idx ? null : idx));
            }}
          >
            {isDesktop && (
              <AnimatePresence>
                {hoveredIndex === idx && (
                  <motion.span
                    className={cn(
                      'absolute inset-0 h-full w-full border block rounded-3xl z-0 pointer-events-none',
                      activeIndex === null ? 'bg-[#FF5A1F]/[0.2] border-[#FF5A1F]/30' : 'bg-white/60 border-white/80',
                    )}
                    layoutId="hoverBackground"
                    layout="position"
                    transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.15 } }}
                    exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
                  />
                )}
              </AnimatePresence>
            )}

            <motion.div
              className="relative h-full w-full"
              style={{ transformStyle: 'preserve-3d', WebkitTransformStyle: 'preserve-3d' }}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Vorderseite */}
              <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
                <Card className={activeIndex !== null ? 'group-hover:border-white/40' : undefined}>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {item.badge && <span className="card-badge">{item.badge}</span>}
                    <div className="flex items-center gap-2">
                      {item.stars && (
                        <span className="font-mono-ui text-[11px] text-white/50">
                          ★ {(item.stars / 1000).toFixed(1)}k
                        </span>
                      )}
                      {isDesktop && (
                        <motion.button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            playClick();
                            onActiveIndexChange(idx);
                          }}
                          aria-label={`${item.title} Details anzeigen`}
                          animate={{ scale: [1, 1.32, 1.08, 1.4, 1, 1] }}
                          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', times: [0, 0.14, 0.28, 0.42, 0.6, 1] }}
                          whileHover={{ scale: 1.15 }}
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#FF5A1F]/50 text-[#FF5A1F] hover:bg-[#FF5A1F] hover:text-black transition-colors cursor-pointer"
                        >
                          +
                        </motion.button>
                      )}
                    </div>
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                  {item.tags && (
                    <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap gap-1.5">
                      {item.tags.map((t) => (
                        <span key={t} className="card-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  {!isDesktop && (
                    <span
                      aria-hidden
                      className="absolute bottom-3 right-3 text-[#FF5A1F]/60 text-sm"
                    >
                      ↺
                    </span>
                  )}
                </Card>
              </div>

              {/* Rueckseite - nur mobil/tablet erreichbar (Tap statt Hover).
                  Scrollt intern statt abzuschneiden, falls eine Karte
                  mehrere Befehle/Prompts hat und laenger ist als die Karte. */}
              <div
                className="absolute inset-0"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  WebkitTransform: 'rotateY(180deg)',
                }}
              >
                <Card className="overflow-y-auto">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playClick();
                      setFlippedIndex(null);
                    }}
                    aria-label="Zurückdrehen"
                    className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full border border-[#FF5A1F]/40 text-[#FF5A1F] text-xs"
                  >
                    ✕
                  </button>
                  <CardTitle>{item.title}</CardTitle>
                  <p className="card-body mt-2 text-[12px] leading-relaxed">
                    {item.details ?? item.description}
                  </p>
                  {item.commands?.map((c) => (
                    <button
                      key={c.cmd}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playClick();
                        void navigator.clipboard?.writeText(c.cmd);
                      }}
                      className="mt-2 block w-full rounded bg-[#0A0A0A] px-2.5 py-1.5 text-left cursor-pointer"
                    >
                      <span className="block truncate font-mono-ui text-[10px] text-[#FF3B30]">
                        {c.kind === 'prompt' ? '» ' : '$ '}{c.cmd}
                      </span>
                      <span className="block text-[9px] text-white/40">{c.note}</span>
                    </button>
                  ))}
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold font-mono-ui uppercase text-[#FF5A1F]"
                  >
                    {item.link.includes('github.com') ? "GitHub ↗" : 'Öffnen ↗'}
                  </a>
                </Card>
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>

    {pageCount > 1 && (
      <div className="mt-1 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => goToPage(page - 1)}
          disabled={page === 0}
          aria-label="Vorherige Seite"
          className="flex h-6 w-6 items-center justify-center rounded-full border border-white/15 text-white/60 hover:text-[#FF5A1F] hover:border-[#FF5A1F]/50 disabled:opacity-25 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          ‹
        </button>
        <span className="font-mono-ui text-[10px] tracking-[0.1em] text-white/40">
          {String(page + 1).padStart(2, '0')} / {String(pageCount).padStart(2, '0')}
        </span>
        <button
          type="button"
          onClick={() => goToPage(page + 1)}
          disabled={page === pageCount - 1}
          aria-label="Nächste Seite"
          className="flex h-6 w-6 items-center justify-center rounded-full border border-white/15 text-white/60 hover:text-[#FF5A1F] hover:border-[#FF5A1F]/50 disabled:opacity-25 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          ›
        </button>
      </div>
    )}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        'rounded-2xl h-full w-full p-5 overflow-hidden bg-[#0A0A0A] border border-white/10 group-hover:border-[#FF5A1F]/50 relative z-20 transition-colors duration-300',
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-1">{children}</div>
      </div>
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn('card-title text-white group-hover:text-[#FF5A1F] transition-colors duration-300 font-bold tracking-wide mt-2', className)}>
      {children}
    </h4>
  );
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p className={cn('card-body mt-2 text-white/75 tracking-wide leading-relaxed text-sm', className)}>
      {children}
    </p>
  );
};
