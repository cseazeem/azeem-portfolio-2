import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { site } from '../config/site.js';
import { projects } from '../data/projects.js';
import { EASE, Reveal, useMotionPrefs } from '../lib/motion.jsx';
import { useMediaQuery } from '../lib/hooks.js';
import { ExternalLink, SectionHeading } from './Common.jsx';
import { GithubIcon } from './BrandIcons.jsx';
import { ProjectCover } from './ProjectCover.jsx';
import { ProjectDialog } from './ProjectDialog.jsx';

const ALL = 'All';
const pad = (n) => String(n).padStart(2, '0');
export const numberOf = (project) => pad(projects.indexOf(project) + 1);

function matches(project, query) {
  if (!query) return true;
  const hay = [project.title, project.summary, project.category, project.org, project.role, project.year, ...(project.tools || [])]
    .join(' ')
    .toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => hay.includes(word));
}

function FeaturedCard({ project, onOpen, delay }) {
  return (
    <Reveal as="article" className="fcard" delay={delay}>
      <div className="fcard__media" data-build="image">
        <ProjectCover project={project} number={numberOf(project)} />
      </div>
      <div className="fcard__body" data-build="box">
        <p className="fcard__meta">
          <span>{project.category}</span>
          {project.year && <span>{project.year}</span>}
        </p>
        <h3 className="fcard__title">
          <button
            type="button"
            className="fcard__btn"
            aria-haspopup="dialog"
            onClick={(e) => onOpen(project, e.currentTarget)}
          >
            {project.title}
          </button>
        </h3>
        <p className="fcard__summary">{project.summary}</p>
        {project.tools?.length > 0 && (
          <ul className="tags" aria-label="Tech used">
            {project.tools.slice(0, 4).map((t) => (
              <li key={t} className="tag">
                {t}
              </li>
            ))}
          </ul>
        )}
        <span className="fcard__cta" aria-hidden="true">
          View case study <ArrowUpRight size={18} />
        </span>
      </div>
    </Reveal>
  );
}

function HoverPreview({ project }) {
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.5 });
  useEffect(() => {
    const move = (e) => {
      x.set(e.clientX + 24);
      y.set(e.clientY - 90);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [x, y]);
  return (
    <motion.div className="apreview" style={{ x: sx, y: sy }} aria-hidden="true">
      <AnimatePresence mode="popLayout">
        {project && (
          <motion.div
            key={project.id}
            className="apreview__inner"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <ProjectCover project={project} number={numberOf(project)} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Archive({ onOpen }) {
  const pageSize = site.preferences.archivePageSize || 6;
  const categories = useMemo(() => [ALL, ...new Set(projects.map((p) => p.category).filter(Boolean))], []);
  const [category, setCategory] = useState(ALL);
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [limit, setLimit] = useState(pageSize);
  const [hovered, setHovered] = useState(null);
  const { enabled } = useMotionPrefs();
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine) and (min-width: 1000px)');
  const listRef = useRef(null);

  const filtered = useMemo(
    () => projects.filter((p) => (category === ALL || p.category === category) && matches(p, deferredQuery.trim())),
    [category, deferredQuery],
  );
  const visible = filtered.slice(0, limit);

  useEffect(() => setLimit(pageSize), [category, deferredQuery, pageSize]);

  const reset = () => {
    setCategory(ALL);
    setQuery('');
  };

  const loadMore = () => {
    const firstNew = visible.length;
    setLimit((l) => l + pageSize);
    requestAnimationFrame(() => {
      listRef.current?.querySelectorAll('.arow__btn')[firstNew]?.focus({ preventScroll: false });
    });
  };

  return (
    <div className="archive" id="archive">
      <div className="archive__head">
        <Reveal>
          <h3 className="archive__title" data-build="text">
            Project index <span className="archive__count">({projects.length})</span>
          </h3>
        </Reveal>
        <Reveal className="archive__controls" delay={0.05}>
          <div className="filters" role="group" aria-label="Filter projects by category" data-build="box">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                className="filter"
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
              >
                {c}
                {category === c && (
                  <motion.span layoutId="filter-line" className="filter__line" transition={{ duration: 0.45, ease: EASE }} />
                )}
              </button>
            ))}
          </div>
          <div className="search" data-build="box">
            <Search size={16} aria-hidden="true" />
            <label htmlFor="project-search" className="sr-only">
              Search projects
            </label>
            <input
              id="project-search"
              type="search"
              placeholder="Search by name or tech…"
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button type="button" className="search__clear" onClick={() => setQuery('')} aria-label="Clear search">
                <X size={16} aria-hidden="true" />
              </button>
            )}
          </div>
        </Reveal>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {filtered.length === 1 ? '1 project' : `${filtered.length} projects`} shown
      </p>

      {filtered.length > 0 ? (
        <ol className="archive__list" ref={listRef} onPointerLeave={() => setHovered(null)}>
          <AnimatePresence initial={false}>
            {visible.map((p) => (
              <motion.li
                key={p.id}
                className="arow"
                layout={enabled ? 'position' : false}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
                data-build="box"
              >
                <button
                  type="button"
                  className="arow__btn"
                  aria-haspopup="dialog"
                  aria-label={`${p.title} — ${p.category}${p.year ? `, ${p.year}` : ''}. Open details`}
                  onClick={(e) => onOpen(p, e.currentTarget)}
                  onPointerEnter={() => setHovered(p)}
                  onFocus={() => setHovered(null)}
                >
                  <span className="arow__num">{numberOf(p)}</span>
                  <span className="arow__year">{p.year}</span>
                  <span className="arow__main">
                    <span className="arow__title">{p.title}</span>
                    <span className="arow__meta">
                      {p.category}
                      {p.year && ` · ${p.year}`}
                    </span>
                    <span className="arow__summary">{p.summary}</span>
                  </span>
                  <span className="arow__cat">{p.category}</span>
                  <span className="arow__tools">{(p.tools || []).slice(0, 3).join(' · ')}</span>
                  <ArrowUpRight className="arow__icon" size={20} aria-hidden="true" />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
      ) : (
        <div className="empty" role="note">
          <p className="empty__title">Nothing matches that.</p>
          <p className="empty__text">
            No projects match
            {query ? ` “${query}”` : ''}
            {category !== ALL ? ` in ${category}` : ''}. Try another word or category.
          </p>
          <button type="button" className="btn btn--ghost btn--sm" onClick={reset}>
            Reset filters
          </button>
        </div>
      )}

      {visible.length < filtered.length && (
        <div className="archive__more">
          <button type="button" className="btn btn--ghost" onClick={loadMore}>
            Load more <span className="archive__more-count">({filtered.length - visible.length})</span>
          </button>
        </div>
      )}

      {finePointer && enabled && <HoverPreview project={hovered} />}
    </div>
  );
}

export function ProjectGrid() {
  const featured = useMemo(() => {
    const list = projects.filter((p) => p.featured);
    return (list.length ? list : projects).slice(0, 4);
  }, []);
  const [active, setActive] = useState(null);
  const trigger = useRef(null);

  const open = useCallback((project, el) => {
    trigger.current = el || document.activeElement;
    setActive(project);
  }, []);
  const close = useCallback(() => {
    setActive(null);
    const el = trigger.current;
    requestAnimationFrame(() => el?.focus?.({ preventScroll: true }));
  }, []);

  return (
    <section id="work" className="section work" aria-labelledby="work-title">
      <div className="container">
        <SectionHeading
          id="work-title"
          index="01"
          kicker="Selected work"
          title="Production systems, end to end."
          aside="Backend services, AI pipelines, real-time infrastructure and the clients on top — work that runs for real users."
        />

        {projects.length === 0 ? (
          <div className="empty empty--large">
            <p className="empty__title">Case studies are on the way.</p>
            <p className="empty__text">In the meantime, my code lives on GitHub.</p>
            {site.contact.github && (
              <ExternalLink href={site.contact.github} className="btn btn--ghost">
                <GithubIcon /> GitHub
              </ExternalLink>
            )}
          </div>
        ) : (
          <>
            <div className="featured">
              {featured.map((p, i) => (
                <FeaturedCard key={p.id} project={p} onOpen={open} delay={(i % 2) * 0.08} />
              ))}
            </div>
            {site.preferences.showProjectArchive && <Archive onOpen={open} />}
          </>
        )}
      </div>
      <ProjectDialog project={active} onClose={close} onNavigate={setActive} />
    </section>
  );
}
