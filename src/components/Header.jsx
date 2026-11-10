import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { Menu, Play, Square, X } from 'lucide-react';
import { site } from '../config/site.js';
import { EASE, useMotionPrefs } from '../lib/motion.jsx';
import { trapFocus, useActiveSection, useScrollLock } from '../lib/hooks.js';
import { startSwarm } from '../swarm/swarm.js';

export function useNavItems() {
  const { labels, preferences } = site;
  return [
    { id: 'work', label: labels.nav.work },
    { id: 'about', label: labels.nav.about },
    preferences.showExperience && { id: 'experience', label: labels.nav.experience },
    { id: 'contact', label: labels.nav.contact },
  ].filter(Boolean);
}

function MotionControl({ compact = false, onBeforePlay }) {
  const { enabled, setEnabled } = useMotionPrefs();
  const [playing, setPlaying] = useState(false);
  const handle = useRef(null);

  const play = useCallback(() => {
    if (handle.current) {
      handle.current.stop();
      return;
    }
    const { accent, text, background } = site.appearance;
    const run = () => {
      setPlaying(true);
      handle.current = startSwarm({
        accent,
        ink: text,
        background,
        reduced: !enabled,
        onFinish: () => {
          handle.current = null;
          setPlaying(false);
        },
      });
    };
    if (onBeforePlay) {
      onBeforePlay();
      setTimeout(run, 380); // let the mobile menu close first
    } else {
      run();
    }
  }, [enabled, onBeforePlay]);

  return (
    <div className={`motion-ctl${compact ? ' motion-ctl--compact' : ''}`} role="group" aria-label="Motion">
      <button
        type="button"
        className="motion-ctl__play"
        onClick={play}
        aria-label={playing ? 'Stop the build animation' : 'Play the build animation'}
        title={playing ? 'Stop' : 'Watch a swarm of cursors rebuild this view'}
      >
        {playing ? <Square size={13} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
        <span className="motion-ctl__label">{site.labels.motion}</span>
      </button>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        className="switch"
        onClick={() => setEnabled(!enabled)}
        aria-label="Animations"
        title={enabled ? 'Animations on' : 'Animations off'}
      >
        <span className="switch__track" aria-hidden="true">
          <span className="switch__knob" />
        </span>
      </button>
    </div>
  );
}

export function Header() {
  const items = useNavItems();
  const active = useActiveSection(items.map((i) => i.id));
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuBtn = useRef(null);
  const panelRef = useRef(null);
  const { enabled } = useMotionPrefs();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });

  useScrollLock(open);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) requestAnimationFrame(() => menuBtn.current?.focus());
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const first = panelRef.current?.querySelector('a, button');
    first?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else {
        trapFocus(e, panelRef.current);
      }
    };
    const onResize = () => {
      if (window.innerWidth > 900) close(false);
    };
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open, close]);

  return (
    <header className="site-header" data-scrolled={scrolled || open}>
      <motion.div
        className="scroll-progress"
        style={{ scaleX: enabled ? progress : scrollYProgress }}
        aria-hidden="true"
      />
      <div className="container site-header__inner">
        <a href="#top" className="wordmark" aria-label={`${site.identity.fullName} — back to top`} data-build="text">
          {site.identity.displayName}
          <span aria-hidden="true">.</span>
        </a>

        <nav className="nav" aria-label="Primary">
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} aria-current={active === item.id ? 'location' : undefined}>
                  {item.label}
                  {active === item.id && (
                    <motion.span
                      layoutId="nav-underline"
                      className="nav__line"
                      transition={{ duration: 0.5, ease: EASE }}
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <MotionControl />
          <a href="#contact" className="btn btn--accent btn--sm header-cta">
            {site.labels.contact}
          </a>
          <button
            ref={menuBtn}
            type="button"
            className="icon-btn menu-btn"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => (open ? close() : setOpen(true))}
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            className="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <div className="mobile-menu__top container">
              <span className="wordmark" aria-hidden="true">
                {site.identity.displayName}
                <span>.</span>
              </span>
              <button type="button" className="icon-btn" onClick={() => close()} aria-label="Close menu">
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <nav aria-label="Mobile" className="container">
              <ol className="mobile-menu__list">
                {items.map((item, i) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.05 + i * 0.05 }}
                  >
                    <a href={`#${item.id}`} onClick={() => close(false)} aria-current={active === item.id ? 'location' : undefined}>
                      <span className="mobile-menu__num" aria-hidden="true">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ol>
            </nav>
            <div className="mobile-menu__foot container">
              <MotionControl compact onBeforePlay={() => close(false)} />
              {site.contact.email && (
                <a className="mobile-menu__email" href={`mailto:${site.contact.email}`}>
                  {site.contact.email}
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
