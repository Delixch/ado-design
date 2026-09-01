import { useCallback, useEffect, useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsSection } from './components/SkillsSection';
import { ExperienceSection } from './components/ExperienceSection';
import { ContactSection } from './components/ContactSection';
import { ScrollProgress } from './components/ui';
import { useSmoothScroll } from './lib/motion';
import { Analytics } from '@vercel/analytics/react';
import { CursorTrail } from './components/CursorTrail';
import { SecretTerminal } from './components/SecretTerminal';
import { MatrixMode } from './components/MatrixMode';
import { ScrollToTop } from './components/ScrollToTop';

function App() {
  useSmoothScroll();

  // Handys stellen beim (Neu-)Laden gern die letzte Scrollposition
  // wieder her — die Seite soll aber immer ganz oben starten.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  // Der Farbschlag haengt am Fingerschnippen im Auftaktvideo.
  // Er laeuft genau einmal: die Ebene kommt in den Baum, spielt
  // 900ms und verschwindet wieder — nichts bleibt bildschirm-
  // fuellend stehen.
  const [burst, setBurst] = useState(false);
  const handleSnap = useCallback(() => {
    setBurst(true);
    window.setTimeout(() => setBurst(false), 1400);
  }, []);

  return (
    <div className="w-full bg-ground text-ink selection:bg-punch selection:text-ink">
      <CursorTrail />
      <ScrollProgress />

      {burst && (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-[70]">
          <span className="burst-flash absolute inset-0 block bg-ink" />
          <span
            className="burst-ring absolute left-1/2 top-1/2 block h-[70vmin] w-[70vmin] rounded-full border-[14px] border-ground"
          />
        </div>
      )}
      <Header />
      <main>
        <HeroSection onSnap={handleSnap} />
        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
        <ExperienceSection />
      </main>
      <ContactSection />

      {/* Kleiner Streifen ganz unten: welche Werkzeuge dahinter stehen —
          Impressum/Datenschutz kommen dazu, sobald die echten Angaben da sind. */}
      <div className="border-t border-white/10 bg-[#000000] py-6 fluid-gutter">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 text-center">
          <p className="font-mono-ui text-[9px] uppercase tracking-[0.2em] text-white/40">
            Gebaut mit React · TypeScript · Vite · Tailwind CSS · Framer Motion · GSAP
          </p>
          <p className="font-mono-ui text-[9px] uppercase tracking-[0.2em] text-white/30">
            © {new Date().getFullYear()} Adnan Aydin · Zürich
          </p>
        </div>
      </div>

      <Analytics />
      <SecretTerminal />
      <MatrixMode />
      <ScrollToTop />
    </div>
  );
}

export default App;
