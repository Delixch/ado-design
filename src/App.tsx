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
import { KonamiCode } from './components/KonamiCode';
import { AiBotBubble } from './components/AiBotBubble';
import { FloatingDock } from './components/ui/floating-dock';
import { Home, User, FolderGit2, Cpu, Briefcase, Mail } from 'lucide-react';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const dockItems = [
  { title: 'Start', icon: <Home className="h-5 w-5" />, href: '#top' },
  { title: 'Über mich', icon: <User className="h-5 w-5" />, href: '#about' },
  { title: 'Projekte', icon: <FolderGit2 className="h-5 w-5" />, href: '#work' },
  { title: 'Werkzeuge', icon: <Cpu className="h-5 w-5" />, href: '#skills' },
  { title: 'Werdegang', icon: <Briefcase className="h-5 w-5" />, href: '#experience' },
  { title: 'Kontakt', icon: <Mail className="h-5 w-5" />, href: 'mailto:adnan.aydin@bluewin.ch' },
  { title: 'GitHub', icon: <GithubIcon className="h-5 w-5" />, href: 'https://github.com' },
];

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
    <div className="w-full bg-black text-ink selection:bg-punch selection:text-ink">
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

      {/* Floating Dock - macOS style magnification dock */}
      <div className="border-t border-white/10 bg-[#000000] pt-12 pb-0 flex justify-center items-center">
        <FloatingDock items={dockItems} />
      </div>

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
      <KonamiCode />
      <AiBotBubble />
    </div>
  );
}

export default App;
