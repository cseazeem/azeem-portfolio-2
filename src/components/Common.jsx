import { Reveal } from '../lib/motion.jsx';

export function SectionHeading({ id, index, kicker, title, aside }) {
  return (
    <header className="shead">
      <Reveal className="shead__main">
        <p className="shead__kicker">
          <span className="shead__index">{index}</span>
          <span aria-hidden="true">/</span>
          {kicker}
        </p>
        <h2 id={id} className="shead__title" data-build="text">
          {title}
        </h2>
      </Reveal>
      {aside && (
        <Reveal className="shead__aside" delay={0.1}>
          <p data-build="text">{aside}</p>
        </Reveal>
      )}
    </header>
  );
}

export function ExternalLink({ href, children, className = '', ...rest }) {
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

export function Marquee({ items, label }) {
  if (!items?.length) return null;
  const row = (hidden) => (
    <ul className="marquee__row" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item} className="marquee__item">
          {item}
          <span className="marquee__star" aria-hidden="true">
            ✳
          </span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="marquee" role="region" aria-label={label}>
      <div className="marquee__track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
