import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, GraduationCap } from 'lucide-react';
import { site } from '../config/site.js';
import { education, experience } from '../data/experience.js';
import { EASE, Reveal } from '../lib/motion.jsx';
import { SectionHeading } from './Common.jsx';

function TimelineItem({ item, open, onToggle }) {
  const panelId = `xp-panel-${item.id}`;
  const btnId = `xp-btn-${item.id}`;
  return (
    <li className={`xp${open ? ' is-open' : ''}`}>
      <span className="xp__dot" aria-hidden="true" />
      <h3 className="xp__heading">
        <button
          id={btnId}
          type="button"
          className="xp__btn"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <span className="xp__when">
            {item.start} — {item.end}
          </span>
          <span className="xp__main">
            <span className="xp__role">{item.role}</span>
            <span className="xp__org">
              {item.org}
              {item.location && <span className="xp__loc"> · {item.location}</span>}
            </span>
          </span>
          {item.type && <span className="xp__type">{item.type}</span>}
          <ChevronDown className="xp__chev" size={20} aria-hidden="true" />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={btnId}
            className="xp__panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="xp__panel-inner">
              {item.context && <p className="xp__context">{item.context}</p>}
              <ul className="xp__points">
                {item.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              {item.tools?.length > 0 && (
                <ul className="tags" aria-label="Tech used">
                  {item.tools.map((t) => (
                    <li key={t} className="tag">
                      {t}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export function Experience() {
  const [openIds, setOpenIds] = useState(() => new Set(experience.length ? [experience[0].id] : []));
  const toggle = (id) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  if (!experience.length && !education.length) return null;

  return (
    <section id="experience" className="section experience" aria-labelledby="experience-title">
      <div className="container">
        <SectionHeading
          id="experience-title"
          index="03"
          kicker="Experience"
          title="Where I've shipped."
          aside="An AI collaboration platform, fintech payment rails, and the training that got me there."
        />

        {experience.length > 0 && (
          <Reveal>
            <ol className="timeline" data-build="box">
              {experience.map((item) => (
                <TimelineItem key={item.id} item={item} open={openIds.has(item.id)} onToggle={() => toggle(item.id)} />
              ))}
            </ol>
          </Reveal>
        )}

        {site.preferences.showEducation && education.length > 0 && (
          <div className="edu">
            <Reveal className="subhead">
              <h3 data-build="text">Education</h3>
            </Reveal>
            {education.map((e) => (
              <Reveal key={e.id} className="edu__card">
                <div data-build="box">
                  <GraduationCap className="edu__icon" size={28} aria-hidden="true" />
                  <div className="edu__main">
                    <p className="edu__degree">{e.degree}</p>
                    <p className="edu__school">
                      {e.institution}
                      {e.location && ` · ${e.location}`}
                    </p>
                  </div>
                  <div className="edu__side">
                    <p className="edu__years">
                      {e.start} — {e.end}
                    </p>
                    {e.notes?.length > 0 && (
                      <ul className="edu__notes">
                        {e.notes.map((n) => (
                          <li key={n}>{n}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
