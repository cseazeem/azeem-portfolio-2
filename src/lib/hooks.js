import { useEffect, useLayoutEffect, useState } from 'react';

export function useMediaQuery(query) {
  const get = () => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : false);
  const [matches, setMatches] = useState(get);
  useEffect(() => {
    const mq = window.matchMedia?.(query);
    if (!mq) return undefined;
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, [query]);
  return matches;
}

/** Returns the id of the section currently crossing the middle of the viewport. */
export function useActiveSection(ids) {
  const [active, setActive] = useState('');
  const key = ids.join('|');
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length || !('IntersectionObserver' in window)) return undefined;
    const visible = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target.id, e.isIntersecting));
        const current = ids.find((id) => visible.get(id));
        setActive(current || '');
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return active;
}

/**
 * Fits the widest line inside `textRef` to the width of `boxRef`, and writes the
 * result to the CSS variable `--fit-size` on `boxRef`. CSS provides a clamp()
 * fallback until fonts load / JS runs.
 */
export function useFitText(boxRef, textRef, { max = 420, deps = [] } = {}) {
  useLayoutEffect(() => {
    const box = boxRef.current;
    const text = textRef.current;
    if (!box || !text) return undefined;
    let frame = 0;
    const fit = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const prev = text.style.fontSize;
        text.style.fontSize = '100px';
        const lines = text.querySelectorAll('[data-fit-line]');
        let widest = 0;
        lines.forEach((l) => {
          widest = Math.max(widest, l.getBoundingClientRect().width);
        });
        text.style.fontSize = prev;
        const available = box.clientWidth;
        if (!widest || !available) return;
        const size = Math.min(max, (available / widest) * 100 * 0.995);
        box.style.setProperty('--fit-size', `${size.toFixed(2)}px`);
      });
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    document.fonts?.ready.then(fit).catch(() => {});
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Locks page scroll while `locked` is true. */
export function useScrollLock(locked) {
  useEffect(() => {
    if (!locked) return undefined;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prev;
    };
  }, [locked]);
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

/** Keeps Tab / Shift+Tab inside `container`. */
export function trapFocus(event, container) {
  if (event.key !== 'Tab' || !container) return;
  const items = [...container.querySelectorAll(FOCUSABLE)].filter(
    (el) => el.offsetParent !== null || el === document.activeElement,
  );
  if (!items.length) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (event.shiftKey && (document.activeElement === first || !container.contains(document.activeElement))) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
