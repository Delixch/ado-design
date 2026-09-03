import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { SectionHead, SocialLinks } from './ui';
import { OPEN_SECTION_EVENT } from '../lib/nav';
import { useGyroTilt } from '../hooks/useGyroTilt';
import { useEnterSound } from '../lib/sound';
import { useReducedMotion } from '../lib/motion';



/* ─── Portrait mit Papierflieger-Effekt ──────────────────────
   Eigene Animation (faltet, fliegt weg — kein Hold-Reveal wie
   bei den anderen Portraits). `pointerenter` loest sie wie bisher
   per Maus-Hover aus; `pointerdown` deckt Touch zusaetzlich ab.
   Loslassen/Verlassen faehrt sauber auf "initial" zurueck, weil
   `animate` (nicht `whileHover`) den Zustand traegt. */
const ContactPortrait: React.FC<{ variant: 'desktop' | 'mobile' }> = ({ variant }) => {
  const [active, setActive] = useState(false);
  const engage = () => setActive(true);
  const disengage = () => setActive(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  useEnterSound(rootRef, variant === 'desktop');

  return (
    <div
      ref={rootRef}
      className={
        variant === 'desktop'
          ? 'absolute top-0 right-0 bottom-0 w-1/2 hidden min-[1000px]:block border-l border-white/5 pointer-events-auto'
          : 'relative block w-full h-[clamp(16rem,80vw,24rem)] pointer-events-auto'
      }
      style={{ background: '#000000' }}
    >
      {/* Stationary hover/hold target for the airplane effect */}
      <motion.div
        className={`absolute z-0 pointer-events-auto cursor-pointer touch-none select-none ${
          variant === 'desktop' ? 'inset-y-16 inset-x-12' : 'inset-2'
        }`}
        initial="initial"
        animate={active ? 'hover' : 'initial'}
        onPointerEnter={engage}
        onPointerDown={engage}
        onPointerLeave={disengage}
        onPointerUp={disengage}
        onPointerCancel={disengage}
      >
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{ filter: 'drop-shadow(0 0 15px rgba(255,90,31,0.4))' }}
          variants={{
            initial: { x: 0, y: 0, scale: 1, rotateZ: 0, rotateY: 0, opacity: 1, clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' },
            hover: {
              x: [0, 0, 300, -600, -600], // Folds, flies RIGHT, flies LEFT to center, stays center to fly IN
              y: [0, 0, -150, 50, -50], // Swoops up-right, down-left, then slightly up into the distance
              scale: [1, 0.5, 0.45, 0.35, 0], // Shrinks exactly to 0 at the center
              rotateZ: [0, 0, 25, -15, 0], // Tilts up when flying right, down when flying left
              rotateY: [0, 0, 180, 0, -85], // 180=faces right, 0=faces left, -85=turns back to camera (flies straight in)
              opacity: [1, 1, 1, 1, 0],
              clipPath: [
                'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                'polygon(100% 20%, 0% 50%, 100% 80%, 80% 50%)',
                'polygon(100% 20%, 0% 50%, 100% 80%, 80% 50%)',
                'polygon(100% 20%, 0% 50%, 100% 80%, 80% 50%)',
                'polygon(100% 20%, 0% 50%, 100% 80%, 80% 50%)'
              ],
              transition: { duration: 4.5, times: [0, 0.15, 0.45, 0.75, 1], ease: "easeInOut" }
            }
          }}
        >
          {/* Base Image - Lampen sind bereits im Foto warm beleuchtet,
              kein CSS-Lichtfleck mehr noetig. Auf sein Seitenverhaeltnis
              (1537:1023) fixiert und verkleinert, damit der eigene
              Bildrand nicht abgeschnitten wird. */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative max-w-full" style={{ aspectRatio: '1537 / 1023', width: 'auto', height: '58%' }}>
              <img
                src="/images/contact-bg-color.webp"
                className="absolute inset-0 h-full w-full object-cover rounded-2xl"
                alt="Contact Background"
                loading="lazy"
              />

              {/* 3D Fold Shadow Overlay - Creates the bottom wing of the paper airplane */}
              <motion.div
                className="absolute inset-0 bg-black/50 pointer-events-none"
                variants={{
                  initial: { opacity: 0, clipPath: 'polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%)' },
                  hover: {
                    opacity: [0, 1, 1, 1, 1],
                    clipPath: [
                      'polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%)',
                      'polygon(0% 50%, 80% 50%, 100% 80%, 0% 50%)',
                      'polygon(0% 50%, 80% 50%, 100% 80%, 0% 50%)',
                      'polygon(0% 50%, 80% 50%, 100% 80%, 0% 50%)',
                      'polygon(0% 50%, 80% 50%, 100% 80%, 0% 50%)'
                    ],
                    transition: { duration: 4.5, times: [0, 0.15, 0.45, 0.75, 1], ease: "easeInOut" }
                  }
                }}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Diagonal SVG Stripe Lines with Traveling Orange Pulses */}
      <div className="absolute inset-0 pointer-events-none opacity-90 z-10">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            {[
              { color: '#1E202A', delay: 0, id: `pulse-contact-0-${variant}` },
              { color: '#1E202A', delay: 1.125, id: `pulse-contact-1-${variant}` },
              { color: '#1E202A', delay: 2.25, id: `pulse-contact-2-${variant}` },
              { color: '#1E202A', delay: 3.375, id: `pulse-contact-3-${variant}` }
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
          <polygon points="75,-10 76.6,-10 -0.95,110 -1.3,110" fill={`url(#pulse-contact-0-${variant})`} />
          <polygon points="78,-10 79.6,-10 -0.85,110 -1.2,110" fill={`url(#pulse-contact-1-${variant})`} />
          <polygon points="81,-10 82.6,-10 -0.75,110 -1.1,110" fill={`url(#pulse-contact-2-${variant})`} />
          <polygon points="84,-10 85.6,-10 -0.65,110 -1.0,110" fill={`url(#pulse-contact-3-${variant})`} />
        </svg>
      </div>
    </div>
  );
};

export const ContactSection: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sectionOpen, setSectionOpen] = useState(false);
  useEffect(() => {
    const onOpen = (e: Event) => {
      const d = (e as CustomEvent<string>).detail;
      if (d === 'contact' || d === 'all') setSectionOpen(true);
    };
    window.addEventListener(OPEN_SECTION_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_SECTION_EVENT, onOpen);
  }, []);

  // 3D Magnetic Card Tilts for the Form
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(mx, [-0.5, 0.5], [10, -10]), { stiffness: 200, damping: 22 });
  const ry = useSpring(useTransform(my, [-0.5, 0.5], [-10, 10]), { stiffness: 200, damping: 22 });
  useGyroTilt(mx, my);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Anfrage von ${form.name}`;
    const body = `${form.message}\n\n--\n${form.name}\n${form.email}`;
    window.location.href = `mailto:adnan.aydin@bluewin.ch?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <footer
      id="contact"
      className="framed relative w-full overflow-hidden py-16 fluid-gutter sm:py-24"
      style={{ background: '#000000' }}
    >
      {/* Dark right-half split screen background (wrapped in .layer to escape .tinted > *) */}
      <div className="layer pointer-events-none">
        <ContactPortrait variant="desktop" />
      </div>

      {/* Ambient soft glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-[0.08]">
        
        
      </div>

      {/* Grain overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px',
        }}
      />

      <div className="relative z-20 mx-auto w-full max-w-7xl pointer-events-none">
        <div className="grid grid-cols-1 gap-6 min-[1000px]:grid-cols-12 pointer-events-none">
          
          {/* Left half with all minimized content */}
          <div className="flex flex-col gap-5 min-[1000px]:col-span-6 pointer-events-auto">
            <SectionHead
              index="05"
              eyebrow="Kontakt"
              line1="Schreiben"
              line2="Sie mir."
              gradientLine2={true}
              headClass="fluid-display-xs"
              className="mb-2"
              open={sectionOpen}
              onToggleOpen={() => setSectionOpen((v) => !v)}
            />

            {sectionOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-5 overflow-hidden"
            >
            <p className="font-sans-ui text-[12px] max-w-xl leading-relaxed text-white/80">
              Ein Projekt, eine Website, die nicht mehr passt, oder einfach eine Frage? Schreiben Sie
              mir — unverbindlich und ohne Fachjargon.
            </p>

            {/* Mobil: gleicher Papierflieger-Effekt wie das Split-Panel,
                im Inhaltsfluss. Halten statt Hover. */}
            <div className="min-[1000px]:hidden">
              <ContactPortrait variant="mobile" />
            </div>

            {/* Formular wrapped in a 3D Magnetic Card (minimized) */}
            <motion.div
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                mx.set((e.clientX - r.left) / r.width - 0.5);
                my.set((e.clientY - r.top) / r.height - 0.5);
              }}
              onMouseLeave={() => { mx.set(0); my.set(0); }}
              style={{ rotateX: ry, rotateY: rx, transformStyle: 'preserve-3d', backgroundColor: 'rgba(15, 15, 15, 0.85)' }}
              className="w-full relative overflow-hidden rounded-2xl border border-white/15 p-5 shadow-xl transition-all duration-300 hover:border-white/20 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]"
            >
              {sent ? (
                <div className="space-y-3 py-10 text-center">
                  <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#2A2D39] border border-white/30 text-white text-md font-bold">
                    ✓
                  </span>
                  <h3 className="font-display text-[14px] uppercase text-white font-bold">
                    Mailprogramm geöffnet
                  </h3>
                  <p className="font-sans-ui text-[11px] mx-auto max-w-sm text-white/80 leading-relaxed">
                    Ihre Nachricht ist vorbereitet — bitte im Mailprogramm noch abschicken. Alternativ
                    direkt an adnan.aydin@bluewin.ch.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col-reverse relative group/input">
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Ihr Name"
                        className="font-sans-ui w-full rounded-xl border bg-[#111111]/90 border-[#ffffff]/30 hover:border-[#ffffff]/50 px-3.5 py-2.5 text-[12.5px] font-medium text-white placeholder-[#ffffff]/55 outline-none transition-all duration-300 focus:bg-[#1A1A1A] focus:border-[#ffffff] focus:ring-2 focus:ring-[#ffffff]/30 focus:shadow-[0_0_15px_rgba(255,255,255,0.1)] peer"
                      />
                      <label htmlFor="contact-name" className="font-mono-ui mb-1.5 block text-[9.5px] uppercase tracking-[0.2em] text-white/70 font-bold transition-all duration-300 peer-focus:text-white origin-left peer-focus:scale-105">
                        Name
                      </label>
                    </div>
                    <div className="flex flex-col-reverse relative group/input">
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="Ihre E-Mail-Adresse"
                        className="font-sans-ui w-full rounded-xl border bg-[#111111]/90 border-[#ffffff]/30 hover:border-[#ffffff]/50 px-3.5 py-2.5 text-[12.5px] font-medium text-white placeholder-[#ffffff]/55 outline-none transition-all duration-300 focus:bg-[#1A1A1A] focus:border-[#ffffff] focus:ring-2 focus:ring-[#ffffff]/30 focus:shadow-[0_0_15px_rgba(255,255,255,0.1)] peer"
                      />
                      <label htmlFor="contact-email" className="font-mono-ui mb-1.5 block text-[9.5px] uppercase tracking-[0.2em] text-white/70 font-bold transition-all duration-300 peer-focus:text-white origin-left peer-focus:scale-105">
                        E-Mail
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col-reverse relative group/input">
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Worum geht es?"
                      className="font-sans-ui w-full rounded-xl border bg-[#111111]/90 border-[#ffffff]/30 hover:border-[#ffffff]/50 px-3.5 py-2.5 text-[12.5px] font-medium text-white placeholder-[#ffffff]/55 outline-none transition-all duration-300 focus:bg-[#1A1A1A] focus:border-[#ffffff] focus:ring-2 focus:ring-[#ffffff]/30 focus:shadow-[0_0_15px_rgba(255,255,255,0.1)] peer resize-none"
                    />
                    <label htmlFor="contact-message" className="font-mono-ui mb-1.5 block text-[9.5px] uppercase tracking-[0.2em] text-white/70 font-bold transition-all duration-300 peer-focus:text-white origin-left peer-focus:scale-105">
                      Nachricht
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="group relative w-full overflow-hidden rounded-full bg-[#1E1E1E] py-3 text-white transition-colors duration-500"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-[#ffffff] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0" />
                    <span className="font-sans-ui relative text-[10px] font-bold uppercase tracking-[0.22em] transition-colors duration-500 group-hover:text-[#000000]">
                      Nachricht senden ↗
                    </span>
                  </button>
                </form>
              )}
            </motion.div>

            {/* Details row card with floating animation */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative w-full rounded-xl p-[1px] overflow-hidden border border-white/10 shadow-[0_4px_25px_rgba(0,0,0,0.45)]"
            >
              {/* Animated Neon Line */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] pointer-events-none"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 70%, rgba(255,255,255,0.4) 95%, #ffffff 100%)',
                  zIndex: 0,
                }}
              />

              {/* Inner Card */}
              <div className="relative z-10 w-full rounded-[11px] py-2.5 px-4 flex flex-wrap items-center justify-between gap-4 bg-[#0A0A0A]">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono-ui text-[9px] uppercase tracking-[0.2em] font-semibold text-[#ffffff]">E-Mail:</span>
                  <a href="mailto:adnan.aydin@bluewin.ch" className="font-sans-ui text-[11px] font-medium text-white hover:text-white/80 transition-colors">
                    adnan.aydin@bluewin.ch
                  </a>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono-ui text-[9px] uppercase tracking-[0.2em] font-semibold text-[#ffffff]">Ort:</span>
                  <span className="font-sans-ui text-[11px] font-medium text-white">
                    Zürich · Schweiz
                  </span>
                </div>
                <SocialLinks />
              </div>
            </motion.div>
            </motion.div>
            )}
          </div>

          {/* Right half is completely empty */}
          <div className="hidden min-[1000px]:block min-[1000px]:col-span-6" />
        </div>
      </div>
    </footer>
  );
};

export default ContactSection;
