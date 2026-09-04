import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SectionHead } from './ui';
import { OPEN_SECTION_EVENT } from '../lib/nav';
import { useReducedMotion } from '../lib/motion';
import { useLanguage } from '../lib/LanguageContext';

/* ─── Right Split Screen Portrait (Cloned 1:1 from AboutSection) ── */
const ConstructionPortrait: React.FC<{ variant: 'desktop' | 'mobile' }> = ({ variant }) => {
  const { t } = useLanguage();
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(false);

  return (
    <div
      className={
        variant === 'desktop'
          ? 'absolute top-0 right-0 bottom-0 w-1/2 hidden min-[1000px]:block border-l border-white/5 overflow-hidden pointer-events-auto'
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
          <div className="relative max-w-full" style={{ aspectRatio: '1537 / 1023', width: variant === 'desktop' ? 'min(74%, 25rem)' : 'auto', height: variant === 'desktop' ? 'auto' : '58%' }}>
            <img
              src="/images/contact-bg-color.webp"
              alt="Im Aufbau Space"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover rounded-2xl filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
            />
            {/* Holographic Glowing Badge */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs">
              <div className="border-2 border-brand bg-black/80 px-6 py-3 rounded-lg shadow-[0_0_25px_color-mix(in_srgb,var(--color-brand)_50%,transparent)] text-center">
                <span className="font-mono-ui text-[11px] font-bold uppercase tracking-[0.2em] text-brand">
                  {t.construction.imageBadge}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thin Diagonal SVG Stripes with Orange Pulses (Exact 1:1 match with AboutSection) */}
      <div className="absolute inset-0 pointer-events-none opacity-90 z-10">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            {[
              { color: '#1E202A', delay: 0, id: `pulse-const-0-${variant}` },
              { color: '#1E202A', delay: 1.125, id: `pulse-const-1-${variant}` },
              { color: '#1E202A', delay: 2.25, id: `pulse-const-2-${variant}` },
              { color: '#1E202A', delay: 3.375, id: `pulse-const-3-${variant}` },
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
          <polygon points="70,-10 71.6,-10 -5.95,110 -6.3,110" fill={`url(#pulse-const-0-${variant})`} />
          <polygon points="73,-10 74.6,-10 -5.85,110 -6.2,110" fill={`url(#pulse-const-1-${variant})`} />
          <polygon points="76,-10 77.6,-10 -5.75,110 -6.1,110" fill={`url(#pulse-const-2-${variant})`} />
          <polygon points="79,-10 80.6,-10 -5.65,110 -6.0,110" fill={`url(#pulse-const-3-${variant})`} />
        </svg>
      </div>
    </div>
  );
};

/* ─── Main Construction Section ───────────────────────────── */
export const ConstructionSection: React.FC = () => {
  const { t } = useLanguage();
  const [sectionOpen, setSectionOpen] = useState(false);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const d = (e as CustomEvent<string>).detail;
      if (d === 'construction' || d === 'all') setSectionOpen(true);
    };
    window.addEventListener(OPEN_SECTION_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_SECTION_EVENT, onOpen);
  }, []);

  return (
    <section
      id="construction"
      className="framed relative w-full overflow-hidden py-16 fluid-gutter sm:py-24"
      style={{ background: '#000000' }}
    >
      {/* Dark right-half split screen background (Exact clone of AboutSection) */}
      <div className="layer pointer-events-none">
        <ConstructionPortrait variant="desktop" />
      </div>

      <div className="relative z-20 mx-auto w-full max-w-7xl pointer-events-none">
        <div className="grid grid-cols-1 gap-6 min-[1000px]:grid-cols-12 pointer-events-none">
          {/* Left Content Half */}
          <div className="min-[1000px]:col-span-6 space-y-6 pointer-events-auto">
            <SectionHead
              index="05"
              eyebrow={t.construction.eyebrow}
              line1={t.construction.line1}
              line2={t.construction.line2}
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
                className="space-y-6"
              >
                <p className="card-body">
                  {t.construction.paragraph}
                </p>

                {/* Mobile Split Screen Image */}
                <div className="block min-[1000px]:hidden my-6">
                  <ConstructionPortrait variant="mobile" />
                </div>

                {/* Construction Preview Card */}
                <div className="card-container space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-brand"></span>
                    </span>
                    <span className="card-badge">
                      {t.construction.statusBadge}
                    </span>
                  </div>
                  <h3 className="card-title">
                    {t.construction.cardTitle}
                  </h3>
                  <p className="card-body">
                    {t.construction.cardDescription}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2">
                    {['WebGL', 'Three.js', 'AI Agents', 'GLSL Shaders', 'NextGen UI'].map((tag) => (
                      <span key={tag} className="card-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
