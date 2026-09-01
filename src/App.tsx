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
    </div>
  );
}

export default App;
