import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { navItems, scrollToSection, openAllSections } from '../lib/nav';
import { SocialLinks } from './ui';
import { isSoundMuted, toggleSound, playChime, playOpen, playClose, playClick, SOUND_MUTE_EVENT } from '../lib/sound';
import { useLanguage } from '../lib/LanguageContext';
import { useTheme } from '../lib/ThemeContext';

/**
 * Ein einziges Menue fuer alle Breiten. Statt einer waagrechten
 * Liste, die auf schmalen Fenstern zusammenklappt, faehrt hier
 * immer dieselbe Flaeche auf. Das erspart die zweite Fassung —
 * und damit die Luecke, die zwischen zwei Fassungen entsteht.
 */

/** Alle Abschnitte tragen denselben Ton — eine Konstante statt
 *  fuenf identischer Eintraege. */
const TONE = { flood: '#000000', text: '#FAFAFA', dot: '#FAFAFA' };

const clock = () =>
  new Intl.DateTimeFormat('de-CH', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Zurich',
  }).format(new Date());

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme, accentHex } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const [hovered, setHovered] = useState<string | null>(null);
  const [time, setTime] = useState(clock);
  const [soundMuted, setSoundMuted] = useState(isSoundMuted());

  useEffect(() => {
    const onChange = () => setSoundMuted(isSoundMuted());
    window.addEventListener(SOUND_MUTE_EVENT, onChange);
    return () => window.removeEventListener(SOUND_MUTE_EVENT, onChange);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setTime(clock()), 20_000);
    return () => window.clearInterval(id);
  }, []);

  // Welcher Abschnitt steht gerade unter der Kopfzeile?
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    navItems.forEach((item) => {
      const node = document.getElementById(item.id);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, []);

  // Solange die Flaeche offen ist, scrollt nichts dahinter weg.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (id: string) => {
    playClick();
    setOpen(false);
    scrollToSection(id);
  };

  const tone = hovered ? TONE : null;

  return (
    <>
      {/*
        Kein Balken quer ueber die Seite: der Kopf ist eine Zeile,
        die nur beim Scrollen einen hauchduennen Cremegrund und
        eine Haarlinie bekommt. Die fuenf Striche in der Mitte
        sind die Abschnitte — der aktive wird breit und nimmt den
        Farbton, den auch sein Abschnitt und sein Menueeintrag
        tragen. Das ersetzt die Beschriftung, ohne Platz zu
        nehmen.
      */}
      <motion.header
        animate={{
          backgroundColor: scrolled ? 'rgba(17,17,17,1)' : 'rgba(17,17,17,0.92)',
          paddingTop: scrolled ? 8 : 14,
          paddingBottom: scrolled ? 8 : 14,
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        /* Schwarz wie der Rahmen: die Zeile liest sich als dessen
           obere Kante, nicht als eigenes Element. */
        className="fixed inset-x-0 top-0 z-50 fluid-gutter"
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group flex items-center gap-2.5"
          >
            <span className="relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-ground">
              <span className="h-1.5 w-1.5 rounded-full bg-punch transition-transform duration-500 group-hover:scale-[2.4]" />
            </span>
            <span className="font-robot text-[12px] tracking-[0.14em] text-ground">
              ADO DESIGN<span className="cursor-blink text-brand">█</span>
            </span>
          </button>

          {/* Abschnittsstriche */}
          <ul className="hidden flex-1 items-center justify-center gap-1.5 min-[560px]:flex">
            {navItems.map((item) => {
              const on = active === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => go(item.id)}
                    aria-label={t.nav[item.id as keyof typeof t.nav]}
                    className="group flex h-6 items-center"
                  >
                    <motion.span
                      animate={{
                        width: on ? 30 : 12,
                        backgroundColor: on ? accentHex : 'rgba(250,250,250,0.3)',
                      }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="block h-[3px] rounded-full group-hover:opacity-70"
                    />
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            <span className="font-mono-ui hidden text-[10px] uppercase tracking-[0.2em] text-ground/60 min-[760px]:block">
              ZRH {time}
            </span>
            <button
              type="button"
              onClick={toggleSound}
              aria-pressed={!soundMuted}
              aria-label={soundMuted ? t.header.soundOn : t.header.soundOff}
              className="flex h-6 w-6 shrink-0 items-end justify-center gap-[2px] rounded-full border-2 border-ground/40 transition-colors hover:border-ground"
            >
              {[3, 6, 4].map((h, i) => (
                <span
                  key={i}
                  className="w-[2.5px] rounded-full transition-all duration-300"
                  style={{
                    height: soundMuted ? 2 : h,
                    backgroundColor: soundMuted ? 'rgba(250,250,250,0.3)' : 'var(--color-brand)',
                  }}
                />
              ))}
            </button>
            <button
              type="button"
              onClick={() => {
                playClick();
                setLanguage(language === 'de' ? 'tr' : 'de');
              }}
              aria-label={language === 'de' ? 'TR: Türkçeye geç' : 'DE: Almancaya geç'}
              className="flex h-6 items-center justify-center rounded-full border-2 border-ground/40 px-2 font-mono-ui text-[9px] uppercase tracking-[0.14em] text-ground/70 transition-colors hover:border-ground hover:text-ground"
            >
              {language === 'de' ? 'TR' : 'DE'}
            </button>
            <button
              type="button"
              onClick={() => {
                playClick();
                setTheme(theme === 'orange' ? 'amber' : 'orange');
              }}
              aria-label={theme === 'orange' ? 'Switch to amber theme' : 'Turuncu temaya geç'}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-ground/40 transition-colors hover:border-ground"
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: theme === 'orange' ? '#FFD60A' : '#FF5A1F' }}
              />
            </button>
            <button
              onClick={() => {
                if (open) {
                  playClose();
                } else {
                  playOpen();
                }
                setOpen((v) => !v);
              }}
              aria-expanded={open}
              aria-label={open ? t.header.menuClose : t.header.menuOpen}
              className="group flex items-center gap-2.5 rounded-full border-2 border-ground px-4 py-1.5 text-ground transition-colors hover:bg-ground hover:text-ink"
            >
              <span className="font-robot text-[10px] tracking-[0.22em]">
                {open ? (language === 'tr' ? 'KAPAT' : 'ZU') : 'MENÜ'}
              </span>
              <span className="relative flex h-4 w-4 items-center justify-center">
                <motion.span
                  animate={open ? { rotate: 45, y: 0, width: 14 } : { rotate: 0, y: -3, width: 14 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute block h-[2px] rounded bg-current"
                />
                <motion.span
                  animate={open ? { rotate: -45, y: 0, width: 14 } : { rotate: 0, y: 3, width: 8 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 block h-[2px] rounded bg-current"
                />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col overflow-hidden"
            style={{
              backgroundColor: tone ? tone.flood : '#FAFAFA',
              transition: 'background-color 0.5s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            {/* Raster im Hintergrund der Flaeche */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.16]"
              style={{
                backgroundImage:
                  'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
                backgroundSize: 'clamp(2.5rem, 4vw, 4rem) clamp(2.5rem, 4vw, 4rem)',
                color: tone ? tone.text : '#111111',
              }}
            />

            <nav
              className="relative flex flex-1 flex-col justify-center fluid-gutter"
              style={{ color: tone ? tone.text : '#111111' }}
              onMouseLeave={() => setHovered(null)}
            >
              <ul>
                {navItems.map((item, i) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, y: 34 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.16 + i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="border-b border-current/20"
                  >
                    <button
                      onClick={() => go(item.id)}
                      onMouseEnter={() => setHovered(item.id)}
                      onFocus={() => setHovered(item.id)}
                      className="group flex w-full items-baseline gap-4 py-[clamp(0.35rem,0.1rem+0.9vh,0.9rem)] text-left"
                    >
                      <span className="font-mono-ui w-8 shrink-0 text-[11px] opacity-60">
                        0{i + 1}
                      </span>
                      <span className="font-robot fluid-display fluid-display-xs uppercase transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3">
                        {t.nav[item.id as keyof typeof t.nav]}
                      </span>
                      <span
                        className="ml-auto h-2.5 w-2.5 shrink-0 scale-0 rounded-full transition-transform duration-300 group-hover:scale-100"
                        style={{ backgroundColor: TONE.dot }}
                      />
                    </button>
                  </motion.li>
                ))}
              </ul>

              {/* Gleiche Zeile wie die fuenf Abschnitte, durch einen
                  Trennstrich abgesetzt — nur der Puls markiert sie
                  als Sonderfall, keine eigene Farbe. */}
              <ul className="border-t border-current/20 pt-0">
                <motion.li
                  initial={{ opacity: 0, y: 34 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16 + navItems.length * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="border-b border-current/20"
                >
                  <motion.button
                    onClick={() => { playChime(); openAllSections(); setOpen(false); }}
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                    className="group flex w-full items-baseline gap-4 py-[clamp(0.35rem,0.1rem+0.9vh,0.9rem)] text-left"
                  >
                    <span className="font-mono-ui w-8 shrink-0 text-[11px] opacity-60">
                      ✦
                    </span>
                    <span className="font-robot fluid-display fluid-display-xs uppercase transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3">
                      {t.header.allOpen}
                    </span>
                    <span
                      className="ml-auto h-2.5 w-2.5 shrink-0 scale-0 rounded-full transition-transform duration-300 group-hover:scale-100"
                      style={{ backgroundColor: TONE.dot }}
                    />
                  </motion.button>
                </motion.li>
              </ul>
            </nav>

            <div
              className="relative flex flex-wrap items-center justify-between gap-3 pb-7 fluid-gutter"
              style={{ color: tone ? tone.text : '#111111' }}
            >
              <a
                href="mailto:adnan.aydin@bluewin.ch"
                className="font-mono-ui text-[11px] uppercase tracking-[0.18em] underline underline-offset-4"
              >
                adnan.aydin@bluewin.ch
              </a>
              <span className="font-mono-ui text-[11px] uppercase tracking-[0.18em] opacity-70">
                Zürich · {time}
              </span>
              <SocialLinks />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
