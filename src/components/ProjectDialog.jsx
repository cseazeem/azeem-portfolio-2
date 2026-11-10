import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, Play, X } from 'lucide-react';
import { projects } from '../data/projects.js';
import { EASE } from '../lib/motion.jsx';
import { trapFocus, useScrollLock } from '../lib/hooks.js';
import { ExternalLink } from './Common.jsx';
import { ProjectCover } from './ProjectCover.jsx';

const pad = (n) => String(n).padStart(2, '0');

function youtubeId(url = '') {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  return m ? m[1] : '';
}

function Video({ url, title }) {
  const [load, setLoad] = useState(false);
  const id = youtubeId(url);
  if (!id) {
    return (
      <ExternalLink href={url} className="btn btn--ghost btn--sm">
        <Play size={16} aria-hidden="true" /> Watch video
      </ExternalLink>
    );
  }
  return (
    <div className="video">
      {load ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={`${title} — video`}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <button type="button" className="video__poster" onClick={() => setLoad(true)}>
          <Play size={28} aria-hidden="true" />
          <span>Play video</span>
          <small>Loads YouTube (privacy-enhanced mode)</small>
        </button>
      )}
    </div>
  );
}

export function ProjectDialog({ project, onClose, onNavigate }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const scrollRef = useRef(null);
  const open = Boolean(project);
  useScrollLock(open);

  const index = project ? projects.indexOf(project) : -1;
  const prev = index > 0 ? projects[index - 1] : projects[projects.length - 1];
  const next = index >= 0 ? projects[(index + 1) % projects.length] : null;

  useEffect(() => {
    if (!open) return undefined;
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else {
        trapFocus(e, dialogRef.current);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (project) scrollRef.current?.scrollTo({ top: 0 });
  }, [project]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="dialog-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          <div className="dialog-backdrop" onClick={onClose} aria-hidden="true" />
          <motion.div
            ref={dialogRef}
            className="dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            aria-describedby="dialog-summary"
            initial={{ opacity: 0, y: 48, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <div className="dialog__bar">
              <p className="dialog__crumb">
                Case study <strong>{pad(index + 1)}</strong> / {pad(projects.length)}
              </p>
              <div className="dialog__nav">
                {projects.length > 1 && (
                  <>
                    <button type="button" className="icon-btn" onClick={() => onNavigate(prev)} aria-label={`Previous project: ${prev.title}`}>
                      <ArrowLeft size={18} aria-hidden="true" />
                    </button>
                    <button type="button" className="icon-btn" onClick={() => onNavigate(next)} aria-label={`Next project: ${next.title}`}>
                      <ArrowRight size={18} aria-hidden="true" />
                    </button>
                  </>
                )}
                <button ref={closeRef} type="button" className="icon-btn icon-btn--close" onClick={onClose} aria-label="Close project details">
                  <X size={20} aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="dialog__scroll" ref={scrollRef}>
              <div className="dialog__cover">
                <ProjectCover project={project} number={pad(index + 1)} eager />
              </div>

              <div className="dialog__content">
                <p className="dialog__kicker">
                  {project.category}
                  {project.year && <span> · {project.year}</span>}
                </p>
                <h2 id="dialog-title" className="dialog__title">
                  {project.title}
                </h2>
                <p id="dialog-summary" className="dialog__summary">
                  {project.summary}
                </p>

                <dl className="dialog__facts">
                  {project.role && (
                    <div>
                      <dt>Role</dt>
                      <dd>{project.role}</dd>
                    </div>
                  )}
                  {project.org && (
                    <div>
                      <dt>Context</dt>
                      <dd>{project.org}</dd>
                    </div>
                  )}
                  {project.year && (
                    <div>
                      <dt>Year</dt>
                      <dd>{project.year}</dd>
                    </div>
                  )}
                </dl>

                <div className="dialog__cols">
                  <div>
                    <h3 className="dialog__h">Overview</h3>
                    <p className="dialog__text">{project.description}</p>
                    {project.highlights?.length > 0 && (
                      <>
                        <h3 className="dialog__h">What I did</h3>
                        <ul className="dialog__list">
                          {project.highlights.map((h) => (
                            <li key={h}>{h}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    {project.videoUrl && (
                      <>
                        <h3 className="dialog__h">Video</h3>
                        <Video url={project.videoUrl} title={project.title} />
                      </>
                    )}
                  </div>
                  <aside>
                    {project.outcomes?.length > 0 && (
                      <>
                        <h3 className="dialog__h">Outcomes</h3>
                        <ul className="dialog__outcomes">
                          {project.outcomes.map((o) => (
                            <li key={o}>{o}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    {project.tools?.length > 0 && (
                      <>
                        <h3 className="dialog__h">Stack</h3>
                        <ul className="tags">
                          {project.tools.map((t) => (
                            <li key={t} className="tag">
                              {t}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    {project.links?.length > 0 && (
                      <>
                        <h3 className="dialog__h">Links</h3>
                        <ul className="dialog__links">
                          {project.links.map((l) => (
                            <li key={l.href}>
                              <ExternalLink href={l.href} className="dialog__link">
                                {l.label}
                                <ArrowUpRight size={16} aria-hidden="true" />
                              </ExternalLink>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </aside>
                </div>

                {project.gallery?.length > 0 && (
                  <div className="dialog__gallery">
                    {project.gallery.map((g) => (
                      <img key={g.src} src={g.src} alt={g.alt} width={g.width} height={g.height} loading="lazy" decoding="async" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
