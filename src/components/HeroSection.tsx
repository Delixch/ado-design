import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { scrollToSection } from '../lib/nav';
import { MATRIX_MODE_EVENT } from './MatrixMode';
import { useLanguage } from '../lib/LanguageContext';
import { useTheme } from '../lib/ThemeContext';

const LOGO_SRC: Record<string, string> = {
  orange: '/logo-orange.svg',
  amber: '/logo-amber.svg',
  cyan: '/logo-cyan.svg',
};

const container: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.25 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * Eine Zeile, deren Buchstaben einzeln aus der Kante hochfahren.
 * Der Umbruch bleibt erhalten: jedes Wort ist eine eigene Einheit,
 * nur innerhalb des Wortes wird zerlegt.
 */
const KineticLine: React.FC<{
  text: string;
  className?: string;
  delay?: number;
}> = ({ text, className = '', delay = 0 }) => {
  let i = 0;
  return (
    <span className={`block overflow-hidden ${className}`}>
      {text.split(' ').map((word, w) => (
        <span key={w} className="inline-block whitespace-nowrap">
          {word.split('').map((char) => {
            const step = i++;
            return (
              <motion.span
                key={step}
                initial={{ y: '115%', rotate: 7 }}
                animate={{ y: '0%', rotate: 0 }}
                transition={{
                  duration: 0.9,
                  delay: delay + step * 0.035,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            );
          })}
          {w < text.split(' ').length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
};

/** Sekunde, in der im Video das Fingerschnippen sitzt.
 *  333.mp4 ist 10.00s lang und 1280x720 gross. Erst stand der
 *  Wert bei 9.54s (0.46s vor Schluss), das kam zu spaet —
 *  zwei Sekunden vorgezogen. Stimmt die Stelle nicht, ist es
 *  diese eine Zahl. */
const SNAP_CUE_S = 7.54;

export const HeroSection: React.FC<{ onSnap: () => void }> = ({ onSnap }) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [snapped, setSnapped] = useState(false);
  const hasEndedRef = useRef(false);

  /* Der Schlag gehoert genau einem Bild im Video. `onTimeUpdate`
     feuert etwa viermal je Sekunde, deshalb wird ab der Marke
     ausgeloest und danach gesperrt — sonst zuendet die Schleife
     bei jedem Durchlauf erneut. */
  /* `autoPlay` allein reicht nicht: manche Browser starten stumme
     Videos erst nach einem Anlauf aus dem Skript, und ein Video,
     das niemand sieht, soll ohnehin nicht dekodieren. Beides
     erledigt derselbe Beobachter. */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoEnded = () => {
      hasEndedRef.current = true;
    };

    video.addEventListener('ended', handleVideoEnded);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!hasEndedRef.current && !video.ended) {
            void video.play().catch(() => {});
          }
        } else {
          video.pause();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(video);
    return () => {
      video.removeEventListener('ended', handleVideoEnded);
      observer.disconnect();
    };
  }, []);

  const [phoneVisible, setPhoneVisible] = useState(false);
  const [codeVisible, setCodeVisible] = useState(false);

  /* `transform: scale(clamp(0.45, ...))` mit einer nackten Zahl
     wird vom Browser als ungueltig verworfen — die ganze
     `transform`-Deklaration faellt weg, das Telefon bleibt auf
     voller Groesse. Deshalb in JS, und nur unter der Seiten-weiten
     Mobil-Schwelle (1000px) — ab dort bleibt Position und Groesse
     exakt wie auf dem Desktop, unangetastet. */
  const [phoneScale, setPhoneScale] = useState(1);
  const [phoneRight, setPhoneRight] = useState('22%');
  useEffect(() => {
    const compute = () => {
      const vw = window.innerWidth;
      if (vw >= 1000) {
        setPhoneScale(1);
        setPhoneRight('22%');
        return;
      }
      const t = Math.min(Math.max((vw - 320) / (999 - 320), 0), 1);
      setPhoneScale(0.32 + t * 0.28);
      setPhoneRight('4%');
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  // Telefon nach 5 Sekunden einblenden
  useEffect(() => {
    const t1 = window.setTimeout(() => setPhoneVisible(true), 5000);
    // Code-Scroll 3 Sekunden nach dem Telefon
    const t2 = window.setTimeout(() => setCodeVisible(true), 8000);
    return () => { window.clearTimeout(t1); window.clearTimeout(t2); };
  }, []);

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const t = e.currentTarget.currentTime;
    if (snapped) return;
    if (t < SNAP_CUE_S) return;
    setSnapped(true);
    onSnap();
  };

  // Zeigerlage, auf zwei Federn gelegt: die Geisterebenen der
  // Ueberschrift und das Portraet laufen unterschiedlich weit mit.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 90, damping: 20, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 90, damping: 20, mass: 0.6 });

  // Die Videoschicht laeuft dem Zeiger leicht entgegen.
  const videoX = useTransform(sx, [-0.5, 0.5], [12, -12]);
  const videoY = useTransform(sy, [-0.5, 0.5], [8, -8]);

  const handlePointer = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };

  // Die Umrisszeile fuellt sich, waehrend der Auftakt wegscrollt.
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ['start start', 'end start'],
  });
  const fillInset = useTransform(scrollYProgress, [0, 0.55], ['100%', '0%']);
  const fillClip = useTransform(fillInset, (v) => `inset(${v} 0 0 0)`);

  return (
    <section
      id="top"
      ref={rootRef}
      onPointerMove={handlePointer}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
      className="tinted framed relative flex w-full items-center pb-16 pt-28 fluid-gutter sm:pt-32"
      style={{ minHeight: 'clamp(28rem, 22rem + 18svh, 42rem)', overflow: 'clip' }}
    >
      {/* Das Video liegt ueber die volle Breite hinter dem Satz.
          Damit Anthrazit auf Bewegtbild lesbar bleibt, liegt ein
          Cremeschleier darueber: links deckend, nach rechts hin
          durchsichtig — dort steht kein Text, dort darf man das
          Bild sehen. */}
      <div
        aria-hidden
        className="layer bg-void"
      >
        {/* Base dark background */}
        <span
          className="absolute inset-0 bg-void"
        />

        <motion.div 
          style={{ 
            x: videoX, 
            y: videoY,
          }} 
          className="absolute -inset-6 z-0"
        >
          <video
            ref={videoRef}
            src="/videos/333.mp4"
            className="h-full w-full origin-bottom translate-x-0 scale-[0.85] object-contain grayscale contrast-[1.15]"
            style={{
              objectPosition: 'center bottom',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, transparent 15%, black 45%)',
              maskImage: 'linear-gradient(to right, transparent 0%, transparent 15%, black 45%)'
            }}
            autoPlay
            muted
            playsInline
            preload="auto"
            // @ts-expect-error - fetchPriority ist fuer <video> noch nicht in @types/react, existiert im Browser trotzdem.
            fetchPriority="high"
            onTimeUpdate={handleTimeUpdate}
          />
        </motion.div>

        <span
          className="absolute inset-0 opacity-[0.10] pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, rgba(255,255,255,0.05) 0 1px, transparent 1px 4px)',
          }}
        />
      </div>

      {/* Toter Raum rechts vom Telefon (Video ist objectcontain, deckt
          auf breiten Viewports nicht die volle Breite) - ab 1400px
          sichtbar, darunter ueberlappt es mit dem schrumpfenden Telefon.
          `position` steht in `style`, nicht in `className`: `.tinted > *`
          (index.css) erzwingt sonst `position: relative` auf jedem
          direkten Section-Kind und die Utility-Klasse verliert den
          Kaskaden-Wettstreit — dasselbe Problem wie beim Video oben. */}
      <motion.img
        src={LOGO_SRC[theme]}
        alt=""
        aria-hidden="true"
        animate={reducedMotion ? undefined : { scale: [1, 1.06, 1], opacity: [0.65, 0.9, 0.65] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none hidden w-64 opacity-80 min-[1400px]:block"
        style={{
          position: 'absolute',
          top: '50%',
          /* Toter Streifen reicht von right:0 bis zur Telefon-Aussenkante
             bei right:22%+200px - `right` hier + translate(50%) zentriert
             das Logo in der Mitte dieses Streifens, unabhaengig von der
             Logo-Breite selbst. */
          right: 'calc(9% + 80px)',
          x: '50%',
          y: '-50%',
          zIndex: 20,
        }}
      />

      {/* Großes Telefon-Mockup, das bei 5s ins Bild gleitet.
          Der Rahmen bleibt bei 200x420 (Referenzgroesse ab 1500px),
          `phoneScale` (oben, in JS berechnet) schrumpft ihn auf
          mobilen Breiten von der rechten unteren Ecke aus — die
          Ankerposition bleibt so erhalten, statt jede Innenmasszahl
          einzeln umzuschreiben. */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: '8%',
          right: phoneRight,
          width: 200,
          height: 420,
          transformOrigin: 'bottom right',
          transform: `scale(${phoneScale})`,
          zIndex: 30,
        }}
      >
      <motion.div
        initial={{ opacity: 0, y: 60, rotate: 0 }}
        animate={phoneVisible
          ? { opacity: 1, y: 0, rotate: 0 }
          : { opacity: 0, y: 60, rotate: 0 }
        }
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Phone Body */}
        <div style={{ position: 'absolute', inset: 0, borderRadius: 36, background: '#111', border: '5px solid #222', padding: 5, boxShadow: '0 30px 60px rgba(0,0,0,0.8)', overflow: 'hidden' }}>
          
          {/* Spinning Neon Border Light */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'conic-gradient(from 0deg, transparent 75%, rgba(255,255,255,0.8) 95%, #ffffff 100%)',
              zIndex: 0,
            }}
          />

          {/* Screen */}
          <div style={{ position: 'absolute', inset: 5, borderRadius: 30, background: '#000', overflow: 'hidden', zIndex: 10 }}>
            
            {/* Dynamic Island */}
            <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: 60, height: 18, borderRadius: 10, background: '#050505', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 6px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#111' }} />
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#222' }} />
            </div>

            {/* Screen Content: scroll code if active, else standby */}
            {codeVisible ? (
              <div
                className="code-scroll"
                style={{
                  padding: '30px 10px 10px 10px',
                  fontFamily: 'monospace',
                  fontSize: 9,
                  lineHeight: 1.6,
                  color: 'var(--color-brand)',
                  whiteSpace: 'nowrap',
                  letterSpacing: 0,
                  userSelect: 'none',
                }}
              >
                {[
                  'const app = require("./core");',
                  'fn(x) => x * 0x4A3F + 1;',
                  '#!/usr/bin/env node -e',
                  'while(i<len) { buf[i++]; }',
                  'import { exec } from "child";',
                  'git commit -m "fix: #892"',
                  'SELECT * FROM users LIMIT 9;',
                  'try { parse(buf) } catch(e)',
                  'sudo systemctl restart app',
                  'λx.λy.(x y) => reduce(fn)',
                  'npm run build --prod --ci',
                  '0xFF3A & 0b10110001 >> 3',
                  'async function* gen() {}',
                  '_.map(arr, fn).filter(!!x)',
                  'docker run -p 3000:3000 app',
                  'export default class App {}',
                  '[].reduce((a,b)=>a+b, 0x0)',
                  'ssh root@192.168.1.1 -i key',
                  'const x = await fetch(url);',
                  'grep -r "TODO" ./src --color',
                ].map((line, i) => (
                  <div key={i} style={{ color: i % 5 === 0 ? 'var(--color-brand)' : i % 3 === 0 ? '#FF8C5A' : 'var(--color-brand)', opacity: 0.85 + (i % 3) * 0.05 }}>
                    {line}
                  </div>
                ))}
              </div>
            ) : (
              /* Standby: 3x4 App Icons */
              <div style={{ padding: '35px 15px 15px 15px' }}>
                {/* Status bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15, opacity: 0.4 }}>
                  <div style={{ width: 16, height: 2, borderRadius: 2, background: '#fff' }} />
                  <div style={{ width: 12, height: 2, borderRadius: 2, background: '#fff' }} />
                </div>
                {/* 3 columns x 4 rows = 12 square icons */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                  {[
                    '#333333', '#444444', 'var(--color-brand)',
                    '#555555', '#222222', '#666666',
                    'var(--color-brand)', '#333333', '#111111',
                    'var(--color-brand)', '#444444', '#222222',
                    '#555555', '#FF8C5A', '#333333',
                  ].map((color, i) => (
                    <div key={i} style={{
                      aspectRatio: '1 / 1',
                      borderRadius: 8,
                      background: color,
                      opacity: 0.8,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
                    }} />
                  ))}
                </div>
              </div>
            )}

            {/* Matrix-Trigger: bleibt dauerhaft im Screen, unter dem
                hochlaufenden Code — der Standby-Screen wechselt nach 8s
                weg und war zu kurz sichtbar. */}
            <motion.button
              type="button"
              tabIndex={-1}
              onClick={() => window.dispatchEvent(new CustomEvent(MATRIX_MODE_EVENT))}
              animate={{ opacity: [0.5, 1, 0.5], boxShadow: ['0 0 4px var(--color-brand)', '0 0 14px var(--color-brand)', '0 0 4px var(--color-brand)'] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                bottom: 22,
                right: 12,
                width: 26,
                height: 26,
                borderRadius: 7,
                background: '#0A0A0A',
                border: '1px solid var(--color-brand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'monospace',
                fontSize: 9,
                color: 'var(--color-brand)',
                fontWeight: 700,
                zIndex: 45,
              }}
            >
              &gt;_
            </motion.button>
          </div>
          {/* Home indicator */}
          <div
            style={{
              position: 'absolute',
              bottom: 10,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 60,
              height: 4,
              borderRadius: 2,
              background: '#ffffff',
              opacity: 0.5,
              zIndex: 40,
            }}
          />
        </div>
        {/* Power button */}
        <div style={{ position: 'absolute', right: -3, top: 100, width: 3, height: 30, borderRadius: '0 2px 2px 0', background: '#444' }} />
        {/* Volume buttons */}
        <div style={{ position: 'absolute', left: -3, top: 80, width: 3, height: 20, borderRadius: '2px 0 0 2px', background: '#444' }} />
        <div style={{ position: 'absolute', left: -3, top: 110, width: 3, height: 20, borderRadius: '2px 0 0 2px', background: '#444' }} />
      </motion.div>
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 min-[1000px]:grid-cols-12">
        {/* ---------- Satz ---------- */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="min-[1000px]:col-span-12"
        >
          <motion.div variants={fadeUp} className="mb-5 flex flex-wrap items-center gap-2">
            <span className="font-mono-ui flex items-center gap-2 rounded-sm bg-ink px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-ground">
              <span className="h-1.5 w-1.5 animate-pulse bg-brand" />
              {t.hero.badgeAvailable}
            </span>
            <span className="font-mono-ui rounded-sm bg-white/5 border border-white/10 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-white">
              {t.hero.badgeLocation}
            </span>
          </motion.div>

          <h1 className="font-robot relative uppercase text-ground text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
            {/* Zeile 1 */}
            <span className="relative block">
              <KineticLine text={t.hero.lineBuild} delay={0.3} />
            </span>

            {/* Zeile 2: digitale Erlebnisse */}
            <div className="flex flex-wrap items-baseline gap-x-[0.3em] overflow-hidden mt-2">
              <span className="relative inline-block overflow-hidden">
                <motion.span
                  initial={{ y: '115%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="block text-brand font-black"
                >
                  {t.hero.lineDigital}
                </motion.span>
              </span>
              <span className="relative inline-block">
                <span className="stroke-text stroke-text-light block">{t.hero.lineExperiences}</span>
                <motion.span
                  aria-hidden
                  style={{ clipPath: fillClip }}
                  className="absolute inset-0 block text-brand"
                >
                  {t.hero.lineExperiences}
                </motion.span>
              </span>
            </div>
          </h1>

          <motion.div variants={fadeUp} className="mt-6 max-w-[clamp(200px,45vw,36rem)] space-y-4">
            <p className="font-mono-ui fluid-eyebrow uppercase text-ground/60">
              {t.hero.roleLine} <span className="text-brand">•</span> 3D &amp; Motion{' '}
              <span className="text-brand">•</span> Zürich
            </p>
            <p className="font-sans-ui fluid-body leading-[1.75] text-ground/85">
              {t.hero.subtitle}
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={() => scrollToSection('work')}
              className="group font-robot relative overflow-hidden rounded-sm bg-brand px-5 py-3 text-[10px] tracking-[0.2em] text-black transition-transform duration-300"
            >
              <span className="absolute inset-0 -translate-x-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0" />
              <span className="relative transition-colors duration-500">
                {t.hero.ctaWork}
              </span>
            </button>
            <a
              href="mailto:adnan.aydin@bluewin.ch"
              className="font-robot inline-block rounded-sm border-2 border-ground/15 px-5 py-3 text-[10px] tracking-[0.2em] text-ground transition-all hover:border-ground hover:bg-ground hover:text-ink duration-300"
            >
              {t.hero.ctaEmail}
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-8 inline-block max-w-[190px] rounded-sm bg-white/5 border border-white/10 px-3 py-2.5 shadow-lg"
          >
            <p className="font-display text-[11px] uppercase leading-tight text-white/80 font-medium">
              {t.hero.quoteLine1}
              <br />
              {t.hero.quoteLine2}
            </p>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;
