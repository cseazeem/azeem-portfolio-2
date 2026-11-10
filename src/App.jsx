import { site } from './config/site.js';
import { marqueeItems } from './data/profile.js';
import { MotionPrefsProvider } from './lib/motion.jsx';
import { Header } from './components/Header.jsx';
import { Hero } from './components/Hero.jsx';
import { Marquee } from './components/Common.jsx';
import { ProjectGrid } from './components/ProjectGrid.jsx';
import { About } from './components/About.jsx';
import { Experience } from './components/Experience.jsx';
import { Contact } from './components/Contact.jsx';
import { Footer } from './components/Footer.jsx';

export default function App() {
  return (
    <MotionPrefsProvider>
      <a href="#main" className="skip-link">
        {site.labels.skip}
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Marquee items={marqueeItems} label="Core stack" />
        <ProjectGrid />
        <About />
        {site.preferences.showExperience && <Experience />}
        <Contact />
      </main>
      <Footer />
    </MotionPrefsProvider>
  );
}
