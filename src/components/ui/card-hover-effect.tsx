import React, { useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface RepoItem {
  title: string;
  badge?: string;
  description: string;
  stars?: number;
  tags?: string[];
  link: string;
}

export const HoverEffect = ({
  items,
  className,
}: {
  items: RepoItem[];
  className?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const topItems = items.slice(0, 4);
  const bottomItems = items.slice(4);

  const activeItem = expandedIndex !== null ? items[expandedIndex] : null;

  return (
    <LayoutGroup id="repo-cards">
    <div
      className={cn('space-y-3.5 py-4', className)}
      onMouseLeave={() => {
        setHoveredIndex(null);
        setExpandedIndex(null);
      }}
    >
      {/* ─── Top 4 Cards (2x2 Grid Cluster: Items 0, 1, 2, 3) ─────────────── */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-x-1 gap-y-3.5">
        {topItems.map((item, idx) => {
          const isCovered = expandedIndex !== null && expandedIndex < 4;
          return (
            <div
              key={item.title}
              className={cn(
                'relative group block p-2 h-[280px] w-full transition-opacity duration-200',
                isCovered ? 'opacity-0 pointer-events-none' : 'opacity-100'
              )}
              onMouseEnter={() => setHoveredIndex(idx)}
            >
              <AnimatePresence>
                {hoveredIndex === idx && expandedIndex === null && (
                  <motion.span
                    className="absolute inset-0 h-full w-full bg-[#FF5A1F]/[0.2] border border-[#FF5A1F]/30 block rounded-3xl z-0 pointer-events-none"
                    layoutId="hoverBackground"
                    layout="position"
                    transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.15 } }}
                    exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
                  />
                )}
              </AnimatePresence>

              <Card>
                <div className="flex items-center justify-between gap-2 mb-3">
                  {item.badge && <span className="card-badge">{item.badge}</span>}
                  <div className="flex items-center gap-2">
                    {item.stars && (
                      <span className="font-mono-ui text-[11px] text-white/50">
                        ★ {(item.stars / 1000).toFixed(1)}k
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setExpandedIndex(idx);
                      }}
                      className="px-2 py-0.5 text-[10px] font-mono-ui uppercase font-bold text-[#FF5A1F] border border-[#FF5A1F]/40 hover:bg-[#FF5A1F] hover:text-black rounded transition-all cursor-pointer"
                    >
                      DREHEN ↺
                    </button>
                  </div>
                </div>

                <div>
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
                </div>
              </Card>
            </div>
          );
        })}

        {/* Overlay for Top 4 Cards (100% exact fit with inset-2) */}
        <AnimatePresence>
          {expandedIndex !== null && expandedIndex < 4 && activeItem && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-2 z-50 p-6 bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl flex flex-col justify-between overflow-hidden"
              onMouseLeave={() => setExpandedIndex(null)}
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="card-badge">{activeItem.badge}</span>
                  <div className="flex items-center gap-3">
                    {activeItem.stars && (
                      <span className="font-mono-ui text-[11px] text-white/50">
                        ★ {(activeItem.stars / 1000).toFixed(1)}k
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setExpandedIndex(null)}
                      className="px-2.5 py-1 text-[10px] font-mono-ui uppercase font-bold text-[#FF5A1F] border border-[#FF5A1F]/40 hover:bg-[#FF5A1F] hover:text-black rounded transition-all cursor-pointer"
                    >
                      KAPAT ✕
                    </button>
                  </div>
                </div>

                <h4 className="card-title text-white font-bold tracking-wide mt-2 text-xl mb-3">
                  {activeItem.title}
                </h4>

                <p className="card-body mt-2 text-white/80 tracking-wide leading-relaxed text-sm mb-5">
                  {activeItem.description} Dieses Projekt ist ein wesentlicher Bestandteil der modernen Webentwicklung. Es bietet hochoptimierte Workflows, performante Algorithmen und eine saubere Architektur.
                </p>

                {activeItem.tags && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {activeItem.tags.map((t) => (
                      <span key={t} className="card-tag">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                <span className="font-mono-ui text-[11px] text-white/50 uppercase">
                  GitHub Repository
                </span>
                <a
                  href={activeItem.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold font-mono-ui text-black bg-[#FF5A1F] hover:bg-white rounded transition-colors duration-200"
                >
                  GITHUB'DA AÇ ↗
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Bottom Cards (Items 4, 5) ─────────────────────────────────────── */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-x-1 gap-y-3.5">
        {bottomItems.map((item, relIdx) => {
          const idx = relIdx + 4;
          const isCovered = expandedIndex !== null && expandedIndex >= 4;
          return (
            <div
              key={item.title}
              className={cn(
                'relative group block p-2 h-[280px] w-full transition-opacity duration-200',
                isCovered ? 'opacity-0 pointer-events-none' : 'opacity-100'
              )}
              onMouseEnter={() => setHoveredIndex(idx)}
            >
              <AnimatePresence>
                {hoveredIndex === idx && expandedIndex === null && (
                  <motion.span
                    className="absolute inset-0 h-full w-full bg-[#FF5A1F]/[0.2] border border-[#FF5A1F]/30 block rounded-3xl z-0 pointer-events-none"
                    layoutId="hoverBackground"
                    layout="position"
                    transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.15 } }}
                    exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
                  />
                )}
              </AnimatePresence>

              <Card>
                <div className="flex items-center justify-between gap-2 mb-3">
                  {item.badge && <span className="card-badge">{item.badge}</span>}
                  <div className="flex items-center gap-2">
                    {item.stars && (
                      <span className="font-mono-ui text-[11px] text-white/50">
                        ★ {(item.stars / 1000).toFixed(1)}k
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setExpandedIndex(idx);
                      }}
                      className="px-2 py-0.5 text-[10px] font-mono-ui uppercase font-bold text-[#FF5A1F] border border-[#FF5A1F]/40 hover:bg-[#FF5A1F] hover:text-black rounded transition-all cursor-pointer"
                    >
                      DREHEN ↺
                    </button>
                  </div>
                </div>

                <div>
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
                </div>
              </Card>
            </div>
          );
        })}

        {/* Overlay for Bottom Cards (100% exact fit with inset-2) */}
        <AnimatePresence>
          {expandedIndex !== null && expandedIndex >= 4 && activeItem && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-2 z-50 p-6 bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl flex flex-col justify-between overflow-hidden"
              onMouseLeave={() => setExpandedIndex(null)}
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="card-badge">{activeItem.badge}</span>
                  <div className="flex items-center gap-3">
                    {activeItem.stars && (
                      <span className="font-mono-ui text-[11px] text-white/50">
                        ★ {(activeItem.stars / 1000).toFixed(1)}k
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setExpandedIndex(null)}
                      className="px-2.5 py-1 text-[10px] font-mono-ui uppercase font-bold text-[#FF5A1F] border border-[#FF5A1F]/40 hover:bg-[#FF5A1F] hover:text-black rounded transition-all cursor-pointer"
                    >
                      KAPAT ✕
                    </button>
                  </div>
                </div>

                <h4 className="card-title text-white font-bold tracking-wide mt-2 text-xl mb-3">
                  {activeItem.title}
                </h4>

                <p className="card-body mt-2 text-white/80 tracking-wide leading-relaxed text-sm mb-5">
                  {activeItem.description} Dieses Projekt ist ein wesentlicher Bestandteil der modernen Webentwicklung. Es bietet hochoptimierte Workflows, performante Algorithmen und eine saubere Architektur.
                </p>

                {activeItem.tags && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {activeItem.tags.map((t) => (
                      <span key={t} className="card-tag">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                <span className="font-mono-ui text-[11px] text-white/50 uppercase">
                  GitHub Repository
                </span>
                <a
                  href={activeItem.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold font-mono-ui text-black bg-[#FF5A1F] hover:bg-white rounded transition-colors duration-200"
                >
                  GITHUB'DA AÇ ↗
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    </LayoutGroup>
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
        'rounded-2xl h-full w-full p-5 overflow-hidden bg-[#0A0A0A] border border-white/10 group-hover:border-[#FF5A1F]/50 relative z-20 transition-all duration-300',
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
