import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useMotionTemplate } from 'framer-motion';
import { SectionHead } from './ui';

interface RouteStop {
  id: string;
  year: string;
  title: string;
  organization: string;
  description: string;
  color: string;
}

const journey: RouteStop[] = [
  {
    id: '01',
    year: 'seit 2025',
    title: 'Web-Entwickler',
    organization: 'Selbständig · Zürich',
    description:
      'Auftritte für Bäckerei, Autowerkstatt und Privatkunden — von der ersten Skizze bis zum Deployment. Dazu eigene Experimente mit Echtzeit-3D und künstlicher Intelligenz.',
    color: '#FF5A1F',
  },
  {
    id: '02',
    year: '08.2014 — 08.2016',
    title: 'Chauffeur',
    organization: 'Zidus GmbH Transport, Zürich',
    description:
      'Belieferte die Verkaufsstellen zuverlässig, kontrollierte die tägeninge Ladung und sorgte für Pflege und Unterhalt des zugeteilten Fahrzeugs.',
    color: '#00738C',
  },
  {
    id: '03',
    year: '02.2014 — 07.2014',
    title: 'Administration & Personalwesen',
    organization: 'Citybeck AG, Zürich',
    description:
      'Unterstützte Geschäftsleitung und Personalwesen: Lohnzahlungen, Pensionskassenangelegenheiten, Personalunterlagen sowie Ein- und Austritte.',
    color: '#5E35B1',
  },
  {
    id: '04',
    year: '07.2009 — 12.2013',
    title: 'Geschäftsführung / Nachtschichtleitung',
    organization: 'Bäckerei Happy AG, Zürich',
    description:
      'Verantwortlich für Kassenstock, Abrechnung, Einrichtung und Personalwesen. Kundenorientiertes Handeln, Verkaufsbereitschaft, Warenpräsentation und Verkaufsförderung.',
    color: '#C2185B',
  },
  {
    id: '05',
    year: '2002 — 2004',
    title: 'Weiterbildung Web Publisher',
    organization: 'EB Wolbach / Web Publisher Zentrum, Zürich',
    description:
      'Einjähriger Lehrgang plus Aufbaukurse: HTML, CSS und JavaScript, PHP, Datenbanken in phpMyAdmin, ActionScript mit Flash sowie Gestaltung und Präsentation.',
    color: '#FF5A1F',
  },
  {
    id: '06',
    year: '09.1990 — 11.1998',
    title: 'Verkäufer',
    organization: 'Migros Genossenschaftszentrum, Zürich',
    description:
      'Warenbestellungen, Warenannahme, Aktionsaufbauten, Regalpflege sowie MHD- und Bestandskontrollen — dazu die Beratung der Kundschaft.',
    color: '#00738C',
  },
];

/* ─── Portrait mit Lupen-Effekt ──────────────────────────────
   Eigenes Effekt (2x-Zoom, folgt der Zeigerposition), nicht
   Grid, Distorsion oder TV-Static. Zweimal gemountet:
   Split-Panel auf dem Desktop, eingereihter Block auf Mobil —
   dort loest `pointerdown` den Effekt aus, `pointerup`/
   `pointercancel` beendet ihn. */
const ExperiencePortrait: React.FC<{ variant: 'desktop' | 'mobile' }> = ({ variant }) => {
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

  const flashlightMask = useMotionTemplate`radial-gradient(160px circle at ${maskX}px ${maskY}px, black 0%, transparent 100%)`;
  const transformOrigin = useMotionTemplate`${maskX}px ${maskY}px`;

  return (
    <div
      className={
        variant === 'desktop'
          ? 'absolute top-0 left-0 bottom-0 w-1/2 hidden min-[1000px]:block border-r border-ink/5 overflow-hidden pointer-events-auto'
          : 'relative block w-full h-[clamp(16rem,80vw,24rem)] overflow-hidden rounded-2xl pointer-events-auto'
      }
      style={{ background: '#000000' }}
    >
      {/* Experience Board Image with Magnifying Glass Effect */}
      <div
        className={`absolute overflow-hidden shadow-2xl z-0 pointer-events-auto cursor-crosshair group touch-none select-none ${
          variant === 'desktop' ? 'inset-y-16 inset-x-12 rounded-2xl' : 'inset-2 rounded-xl'
        }`}
        onPointerMove={track}
        onPointerDown={handleDown}
        onPointerUp={handleUp}
        onPointerLeave={handleUp}
        onPointerCancel={handleUp}
      >
        {/* Original Image untouched - Lampen bereits im Foto warm
            beleuchtet, kein CSS-Lichtfleck mehr noetig. Auf sein
            Seitenverhaeltnis (1023:1537) fixiert und verkleinert,
            damit der eigene Bildrand nicht abgeschnitten wird. */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative max-w-full overflow-hidden rounded-2xl" style={{ aspectRatio: '1023 / 1537', width: 'auto', height: variant === 'desktop' ? '72%' : '96%' }}>
            {/* Derselbe Spin-Sweep wie bei den Karten, orange, um den
                Bildrand — hier kein Kreis, sondern das runde Rechteck
                des Fotos selbst (Padding-Trick statt Masken-Trick). */}
            <div
              aria-hidden
              className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] pointer-events-none"
              style={{
                background: 'conic-gradient(from 0deg, transparent 70%, rgba(255,90,31,0.5) 95%, #FF5A1F 100%)',
                animation: 'sequence-spin-6 20s linear infinite',
              }}
            />
            <img
              src="/images/experience-board-color.png"
              alt="Experience Board"
              className="absolute inset-[2px] h-[calc(100%-4px)] w-[calc(100%-4px)] rounded-[inherit] object-cover"
            />
          </div>
        </div>

        {/* Magnifying Glass Effect - Revealed on Hover (Desktop) / Hold (Touch) */}
        <motion.div
          className={`absolute inset-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-100 ${
            active ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            WebkitMaskImage: flashlightMask,
            maskImage: flashlightMask,
          }}
        >
          {/* This is the zoomed-in image. Its transformOrigin tracks the pointer perfectly. */}
          <motion.img
            src="/images/experience-board-color.png"
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{
              scale: 1.5,
              transformOrigin,
              filter: 'contrast(1.2) brightness(1.2)'
            }}
          />
        </motion.div>
      </div>

      {/* Custom Tapering SVG Graphic Stripes (converging to top-right corner) with looping pulse */}
      <div className="absolute inset-0 pointer-events-none opacity-90 z-10">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            {[
              { color: '#1E202A', delay: 0, id: `pulse-experience-0-${variant}` },
              { color: '#1E202A', delay: 1.125, id: `pulse-experience-1-${variant}` },
              { color: '#1E202A', delay: 2.25, id: `pulse-experience-2-${variant}` },
              { color: '#1E202A', delay: 3.375, id: `pulse-experience-3-${variant}` }
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
          <polygon points="106.3,-10 105.95,-10 30,110 28.4,110" fill={`url(#pulse-experience-0-${variant})`} />
          <polygon points="106.2,-10 105.85,-10 27,110 25.4,110" fill={`url(#pulse-experience-1-${variant})`} />
          <polygon points="106.1,-10 105.75,-10 24,110 22.4,110" fill={`url(#pulse-experience-2-${variant})`} />
          <polygon points="106.0,-10 105.65,-10 21,110 19.4,110" fill={`url(#pulse-experience-3-${variant})`} />
        </svg>
      </div>
    </div>
  );
};

export const ExperienceSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 70%', 'end 90%'],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section
      id="experience"
      className="framed relative w-full overflow-hidden py-16 fluid-gutter sm:py-24"
      style={{ background: '#000000' }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes sequence-spin-6 {
          0% { transform: rotate(0deg); opacity: 1; }
          16.5% { transform: rotate(360deg); opacity: 1; }
          16.6% { transform: rotate(360deg); opacity: 0; }
          100% { transform: rotate(360deg); opacity: 0; }
        }
      ` }} />
      {/* Dark left-half split screen background (wrapped in .layer to escape .tinted > *) */}
      <div className="layer pointer-events-none">
        <ExperiencePortrait variant="desktop" />
      </div>



      {/* Soft center ambient glow behind content */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-[0.08]">
        
        
      </div>

      {/* Grain overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px',
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl z-20 pointer-events-none">
        <div className="grid grid-cols-1 gap-6 min-[1000px]:grid-cols-12 pointer-events-none">
          
          {/* Left half is completely empty */}
          <div className="hidden min-[1000px]:block min-[1000px]:col-span-6" />

          {/* Right half with minimized experience content */}
          <div className="min-[1000px]:col-span-6 pointer-events-auto">
            <SectionHead
              index="04"
              eyebrow="Werdegang"
              line1="Werdegang &"
              line2="Stationen."
              accent="coral"
              onDark={false}
              gradientLine2={true}
              headClass="fluid-display-xs"
              className="mb-8 max-w-3xl"
              contentClass="min-[1000px]:pl-12 min-[1000px]:pr-0"
            />

            {/* Mobil: gleicher Lupen-Effekt wie das Split-Panel, im
                Inhaltsfluss. Halten statt Hover. */}
            <div className="mb-6 min-[1000px]:hidden">
              <ExperiencePortrait variant="mobile" />
            </div>

            <div ref={containerRef} className="rail relative w-full">
              {/* Grundspur */}
              <div className="rail-line absolute bottom-6 top-2 w-[2px] rounded-full bg-ink/10" />

              <motion.div
                style={{ height: lineHeight }}
                className="rail-line absolute top-2 w-[2px] origin-top rounded-full bg-gradient-to-b bg-white/20"
              />

              <ol className="space-y-9">
                {journey.map((stop, i) => (
                  <motion.li
                    key={stop.id}
                    initial={{ opacity: 0, x: -18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.65, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    className="group relative flex flex-col md:flex-row md:items-start"
                  >
                    {/* Jahr links der Spur ab 768px */}
                    <div className="rail-col hidden shrink-0 pr-9 pt-1 text-right md:block">
                      <span className="font-mono-ui text-[10.5px] uppercase tracking-[0.14em] text-white/60 transition-colors duration-300 group-hover:text-white">
                        {stop.year}
                      </span>
                    </div>

                    {/* Knoten */}
                    <span className="rail-line absolute top-2 flex -translate-x-1/2 items-center justify-center">
                      <span
                        className="absolute h-7 w-7 scale-0 rounded-full transition-transform duration-500 group-hover:scale-100"
                        style={{ backgroundColor: `${stop.color}25` }}
                      />
                      <span
                        className="relative h-3.5 w-3.5 rounded-full border-2 border-white/20 bg-[#000000] transition-colors duration-300 group-hover:bg-white"
                        style={{ borderColor: stop.color }}
                      />
                    </span>

                    {(() => {
                      const cardContent = (
                        <motion.div
                          className="w-full relative overflow-hidden rounded-2xl p-[1px] transition-all duration-500 shadow-lg border border-white/15"
                          style={{ backgroundColor: 'transparent' }}
                          whileHover={{
                            borderColor: 'rgba(255, 255, 255, 0.4)',
                            y: -2,
                          }}
                        >
                          {/* Animated Neon Line */}
                          <div 
                            className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] pointer-events-none"
                            style={{
                              background: 'conic-gradient(from 0deg, transparent 70%, rgba(255,255,255,0.4) 95%, #ffffff 100%)',
                              animation: `sequence-spin-6 12s linear infinite`,
                              animationDelay: `${i * 2}s`,
                              opacity: 0,
                              zIndex: 0,
                            }}
                          />
                          {/* Inner Card Content */}
                          <div className="relative w-full h-full rounded-[15px] z-10 p-5 overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] bg-[#0A0A0A]">
                            <span className="font-mono-ui mb-1.5 block text-[10.5px] uppercase tracking-[0.14em] md:hidden font-semibold text-white/85">
                              {stop.year}
                            </span>
                            <h3 className="font-display text-[15px] uppercase leading-none text-[#FF5A1F] transition-colors duration-300 font-bold">
                              {stop.title}
                            </h3>
                            <span className="font-sans-ui mt-1.5 block text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white/90">
                              {stop.organization}
                            </span>
                            <p className="font-sans-ui text-[11px] mt-3 max-w-xl leading-[1.7] text-white/80 transition-colors duration-300">
                              {stop.description}
                            </p>
                          </div>
                        </motion.div>
                      );

                      if (i === 1) {
                        return (
                          <motion.div
                            animate={{ y: [0, -12, 0] }}
                            transition={{
                              duration: 4.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className="ml-9 flex-1"
                          >
                            {cardContent}
                          </motion.div>
                        );
                      }

                      return (
                        <div className="ml-9 flex-1">
                          {cardContent}
                        </div>
                      );
                    })()}
                  </motion.li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
