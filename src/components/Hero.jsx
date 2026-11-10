import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDownRight, Download, MapPin } from 'lucide-react';
import { site } from '../config/site.js';
import { EASE, Magnetic, useMotionPrefs } from '../lib/motion.jsx';
import { useFitText, useMediaQuery } from '../lib/hooks.js';

function NameLines({ lines, enabled, fit = false }) {
  return lines.map((line, i) => (
    <span className="hero__line" key={line}>
      <motion.span
        className="hero__line-in"
        data-fit-line={fit ? '' : undefined}
        initial={enabled ? { y: '108%' } : false}
        animate={{ y: '0%' }}
        transition={{ duration: 1.1, ease: EASE, delay: 0.15 + i * 0.12 }}
      >
        {line}
      </motion.span>
    </span>
  ));
}

export function Hero() {
  const { identity, labels, metrics, specialties, preferences } = site;
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const nameRef = useRef(null);
  const { enabled } = useMotionPrefs();
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  const narrow = useMediaQuery('(max-width: 700px)');
  const lines = narrow ? identity.heroNameLines : [identity.heroNameLines.join(' ')];
  useFitText(stageRef, nameRef, { max: narrow ? 300 : 400, deps: [narrow] });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const portraitY = useTransform(scrollYProgress, (v) => (enabledRef.current ? v * 110 : 0));
  const nameY = useTransform(scrollYProgress, (v) => (enabledRef.current ? v * -50 : 0));

  const cutout = identity.portrait?.cutout;
  const showResume = preferences.showDownloadResume && identity.resume;

  const enter = (delay, y = 24) =>
    enabled
      ? {
          initial: { opacity: 0, y },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, ease: EASE, delay },
        }
      : {};

  return (
    <section id="top" ref={sectionRef} className="hero" aria-labelledby="hero-title">
      <div className="hero__glow" aria-hidden="true" />
      <div className="container hero__inner">
        <div className="hero__topline">
          <motion.p className="eyebrow" data-build="text" {...enter(0.1, 10)}>
            {identity.profession}
            {identity.roleLine2 && (
              <>
                <span className="eyebrow__sep" aria-hidden="true">
                  /
                </span>
                {identity.roleLine2}
              </>
            )}
          </motion.p>
          {identity.availability && (
            <motion.p className="status" data-build="box" {...enter(0.2, 10)}>
              <span className="status__dot" aria-hidden="true" />
              {identity.availability}
            </motion.p>
          )}
        </div>

        <div className={`hero__stage${cutout ? ' hero__stage--portrait' : ''}`} ref={stageRef}>
          {identity.scriptLine && (
            <motion.p className="hero__script" data-build="text" {...enter(1.05, 10)}>
              {identity.scriptLine}
              <svg className="hero__script-arrow" viewBox="0 0 84 56" aria-hidden="true" focusable="false">
                <path d="M4 10c22-8 50-2 64 30" />
                <path d="M57 36l12 7 2-14" />
              </svg>
            </motion.p>
          )}
          {identity.location && (
            <motion.p className="hero__aside" data-build="text" {...enter(1.15, 10)}>
              <MapPin size={14} aria-hidden="true" />
              <span>
                {identity.location}
                {identity.locationNote && <em>{identity.locationNote}</em>}
              </span>
            </motion.p>
          )}

          <motion.h1 id="hero-title" ref={nameRef} className="hero__name" style={{ y: nameY }} data-build="text">
            <span className="sr-only">
              {identity.fullName}, {identity.profession}
            </span>
            <span aria-hidden="true">
              <NameLines lines={lines} enabled={enabled} fit />
            </span>
          </motion.h1>

          {cutout && (
            <div className="hero__portrait-layer">
              <motion.div className="hero__portrait" style={{ y: portraitY }} data-build="image">
                <motion.img
                  src={cutout}
                  alt={identity.portrait.alt}
                  width={identity.portrait.cutoutWidth}
                  height={identity.portrait.cutoutHeight}
                  fetchPriority="high"
                  decoding="async"
                  draggable="false"
                  {...enter(0.3, 60)}
                />
              </motion.div>
            </div>
          )}

          {cutout && (
            <motion.div className="hero__name hero__name--outline" aria-hidden="true" style={{ y: nameY }}>
              <NameLines lines={lines} enabled={enabled} />
            </motion.div>
          )}
        </div>

        <div className="hero__bottom">
          <div className="hero__intro">
            {identity.headline && (
              <motion.p className="hero__headline" data-build="text" {...enter(0.55)}>
                {identity.headline}
              </motion.p>
            )}
            <motion.p className="hero__lede" data-build="text" {...enter(0.65)}>
              {identity.intro}
            </motion.p>
            <motion.div className="hero__ctas" data-build="box" {...enter(0.75)}>
              <Magnetic>
                <a href="#work" className="btn btn--accent">
                  {labels.viewWork}
                  <ArrowDownRight size={18} aria-hidden="true" />
                </a>
              </Magnetic>
              <a href="#contact" className="btn btn--ghost">
                {labels.contact}
              </a>
              {showResume && (
                <a href={identity.resume} className="btn btn--link" download={identity.resumeFileName}>
                  <Download size={16} aria-hidden="true" />
                  {labels.resume} <span className="sr-only">(PDF)</span>
                </a>
              )}
            </motion.div>
          </div>

          <div className="hero__facts">
            {metrics.length > 0 && (
              <dl className="metrics">
                {metrics.map((m, i) => (
                  <motion.div className="metric" key={m.label} data-build="box" {...enter(0.8 + i * 0.07)}>
                    <dt>{m.label}</dt>
                    <dd>{m.value}</dd>
                  </motion.div>
                ))}
              </dl>
            )}
            {specialties.length > 0 && (
              <motion.ul className="chips" aria-label="Specialties" data-build="box" {...enter(1.1)}>
                {specialties.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </motion.ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
