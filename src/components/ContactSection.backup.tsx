import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { SectionHead } from './ui';



export const ContactSection: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  // 3D Magnetic Card Tilts for the Form
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(mx, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 22 });
  const ry = useSpring(useTransform(my, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 22 });

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
        <div 
          className="absolute top-0 right-0 bottom-0 w-1/2 hidden min-[1000px]:block border-l border-white/5 pointer-events-auto"
          style={{ background: '#000000' }} 
        >
          {/* Stationary hover target for the airplane effect */}
          <motion.div 
            className="absolute inset-y-16 inset-x-12 z-0 pointer-events-auto cursor-pointer"
            initial="initial"
            whileHover="hover"
          >
            <motion.div 
              className="absolute inset-0 w-full h-full"
              style={{ filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.15))' }}
              variants={{
                initial: { x: 0, y: 0, scale: 1, rotateZ: 0, opacity: 1, clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' },
                hover: { 
                  x: [0, 0, -800], 
                  y: [0, 0, 0], // Fly straight left into the email form
                  scale: [1, 0.5, 0.05], 
                  rotateZ: [0, 0, 0], 
                  opacity: [1, 1, 0],
                  clipPath: [
                    'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', 
                    'polygon(100% 20%, 0% 50%, 100% 80%, 80% 50%)', 
                    'polygon(100% 20%, 0% 50%, 100% 80%, 80% 50%)'
                  ],
                  transition: { duration: 2.5, times: [0, 0.3, 1], ease: "easeInOut" }
                }
              }}
            >
              {/* Base Image */}
              <img 
                src="/images/contact-bg.jpg" 
                className="absolute inset-0 w-full h-full object-cover object-center rounded-2xl" 
                alt="Contact Background"
              />
              
              {/* 3D Fold Shadow Overlay - Creates the bottom wing of the paper airplane */}
              <motion.div 
                className="absolute inset-0 bg-black/50 pointer-events-none"
                variants={{
                  initial: { opacity: 0, clipPath: 'polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%)' },
                  hover: { 
                    opacity: [0, 1, 1],
                    clipPath: [
                      'polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%)',
                      'polygon(0% 50%, 80% 50%, 100% 80%, 0% 50%)', 
                      'polygon(0% 50%, 80% 50%, 100% 80%, 0% 50%)'
                    ],
                    transition: { duration: 2.5, times: [0, 0.3, 1], ease: "easeInOut" }
                  }
                }}
              />
            </motion.div>
          </motion.div>

          {/* Vertical Glowing Light Pillars - Wrapped in overflow-hidden so they don't spill */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
            <div className="absolute inset-x-0 bottom-0 h-[650px] flex gap-12 opacity-90 justify-center">
              {[
              { color: '#1E202A', delay: 0 },
              { color: '#1E202A', delay: 1.25 },
              { color: '#1E202A', delay: 2.5 },
              { color: '#1E202A', delay: 3.75 }
            ].map((s, idx) => (
              <div 
                key={idx}
                className="w-5 h-full rounded-t-full relative overflow-hidden"
                style={{
                  background: `linear-gradient(to top, ${s.color} 20%, ${s.color}35 80%, transparent)`,
                  boxShadow: `0 0 30px ${s.color}33`,
                }}
              >
                {/* Upward flowing light pulse */}
                <motion.div
                  initial={{ y: "650px" }}
                  animate={{ y: "-200px" }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                    delay: s.delay,
                  }}
                  className="absolute left-0 right-0 h-48 bg-gradient-to-b from-transparent via-white/50 to-transparent pointer-events-none"
                />
              </div>
            ))}
            </div>
          </div>
        </div>
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
            />

            <p className="font-sans-ui text-[12px] max-w-xl leading-relaxed text-white/80">
              Ein Projekt, eine Website, die nicht mehr passt, oder einfach eine Frage? Schreiben Sie
              mir — unverbindlich und ohne Fachjargon.
            </p>

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
              </div>
            </motion.div>
          </div>

          {/* Right half is completely empty */}
          <div className="hidden min-[1000px]:block min-[1000px]:col-span-6" />
        </div>
      </div>
    </footer>
  );
};

export default ContactSection;
