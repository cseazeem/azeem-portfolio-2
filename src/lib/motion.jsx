import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { MotionConfig, motion, useMotionValue, useSpring } from 'framer-motion';
import { site, storageKeys } from '../config/site.js';
import { useMediaQuery } from './hooks.js';

/** Shared easing curve for every animation on the site. */
export const EASE = [0.22, 1, 0.36, 1];

const INTENSITY = { subtle: 16, balanced: 32, expressive: 48 };
export const REVEAL_Y = INTENSITY[site.appearance.animationIntensity] ?? 32;

function readStored() {
  try {
    const v = localStorage.getItem(storageKeys.motion);
    return v === 'on' || v === 'off' ? v : null;
  } catch {
    return null;
  }
}

function initialEnabled() {
  // index.html sets data-motion before first paint (stored choice → OS preference).
  const attr = document.documentElement.getAttribute('data-motion');
  if (attr === 'on' || attr === 'off') return attr === 'on';
  return !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

const MotionPrefs = createContext({ enabled: true, setEnabled: () => {} });

export function MotionPrefsProvider({ children }) {
  const [enabled, setEnabledState] = useState(initialEnabled);

  const setEnabled = useCallback((value) => {
    setEnabledState(value);
    try {
      localStorage.setItem(storageKeys.motion, value ? 'on' : 'off');
    } catch {
      /* storage unavailable — the choice lasts for this visit */
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-motion', enabled ? 'on' : 'off');
  }, [enabled]);

  // Follow OS changes until the visitor makes an explicit choice.
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return undefined;
    const onChange = () => {
      if (readStored() === null) setEnabledState(!mq.matches);
    };
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  const value = useMemo(() => ({ enabled, setEnabled }), [enabled, setEnabled]);

  return (
    <MotionPrefs.Provider value={value}>
      <MotionConfig reducedMotion={enabled ? 'never' : 'always'} transition={{ ease: EASE }}>
        {children}
      </MotionConfig>
    </MotionPrefs.Provider>
  );
}

export const useMotionPrefs = () => useContext(MotionPrefs);

/**
 * Scroll-reveal wrapper. Content is always rendered; with motion off it simply
 * appears without the fade/slide.
 */
export function Reveal({ as = 'div', delay = 0, y = REVEAL_Y, className, children, ...rest }) {
  const { enabled } = useMotionPrefs();
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      className={className}
      initial={enabled ? { opacity: 0, y } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.75, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/** Magnetic hover for fine pointers only; never required to interact. */
export function Magnetic({ children, strength = 0.28, className = '' }) {
  const ref = useRef(null);
  const { enabled } = useMotionPrefs();
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const active = enabled && finePointer;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  const onMove = (e) => {
    if (!active || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      className={`magnetic ${className}`}
      style={active ? { x: sx, y: sy } : undefined}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.span>
  );
}
