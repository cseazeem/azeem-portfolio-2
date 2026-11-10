import { BadgeCheck } from 'lucide-react';
import { site } from '../config/site.js';
import { certifications, processSteps, skillGroups } from '../data/profile.js';
import { education, experience } from '../data/experience.js';
import { Reveal } from '../lib/motion.jsx';
import { ExternalLink, SectionHeading } from './Common.jsx';

export function About() {
  const { identity, preferences } = site;
  const current = experience.find((e) => /present/i.test(e.end));
  const school = education[0];
  const facts = [
    identity.location && { label: 'Based in', value: [identity.location, identity.locationNote].filter(Boolean).join(' · ') },
    current && { label: 'Currently', value: `${current.role} at ${current.org}` },
    school && { label: 'Education', value: [school.degree, ...(school.notes || []).slice(-1)].join(' · ') },
    site.specialties.length > 0 && { label: 'Focus', value: 'System design · AI systems · Full stack' },
  ].filter(Boolean);

  const photo = identity.portrait?.photo;

  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="container">
        <SectionHeading
          id="about-title"
          index="02"
          kicker="About"
          title={identity.aboutTitle || 'About me'}
          aside={identity.aboutAside}
        />

        <div className={`about__grid${photo ? '' : ' about__grid--solo'}`}>
          {photo && (
            <Reveal className="about__photo">
              <figure data-build="image">
                <img
                  src={photo}
                  alt={identity.portrait.alt}
                  width={identity.portrait.photoWidth}
                  height={identity.portrait.photoHeight}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>
                  <span className="about__script">{identity.fullName}</span>
                  <span>{identity.location}</span>
                </figcaption>
              </figure>
            </Reveal>
          )}

          <div className="about__body">
            {identity.about.map((para, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <p className={i === 0 ? 'about__lead' : 'about__text'} data-build="text">
                  {para}
                </p>
              </Reveal>
            ))}
            {facts.length > 0 && (
              <Reveal delay={0.12}>
                <dl className="facts" data-build="box">
                  {facts.map((f) => (
                    <div key={f.label} className="facts__item">
                      <dt>{f.label}</dt>
                      <dd>{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            )}
          </div>
        </div>

        {skillGroups.length > 0 && (
          <div className="skills" aria-labelledby="skills-title">
            <Reveal className="subhead">
              <h3 id="skills-title" data-build="text">
                Skills &amp; tools
              </h3>
              <p>What I reach for, grouped by where it sits in the stack.</p>
            </Reveal>
            <div className="skills__grid">
              {skillGroups.map((g, i) => (
                <Reveal key={g.title} className="skill" delay={(i % 3) * 0.06}>
                  <div data-build="box">
                    <h4 className="skill__title">
                      <span className="skill__num" aria-hidden="true">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {g.title}
                    </h4>
                    <ul className="skill__list">
                      {g.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {preferences.showProcess && processSteps.length > 0 && (
          <div className="process" aria-labelledby="process-title">
            <Reveal className="subhead">
              <h3 id="process-title" data-build="text">
                How I work
              </h3>
            </Reveal>
            <ol className="process__list">
              {processSteps.map((s, i) => (
                <Reveal as="li" key={s.title} className="step" delay={i * 0.07}>
                  <div data-build="box">
                    <span className="step__num" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h4 className="step__title">{s.title}</h4>
                    <p className="step__text">{s.text}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        )}

        {preferences.showCertifications && certifications.length > 0 && (
          <div className="certs" aria-labelledby="certs-title">
            <Reveal className="subhead">
              <h3 id="certs-title" data-build="text">
                Certifications
              </h3>
              <p>Each one links to the public certificate.</p>
            </Reveal>
            <Reveal>
              <ul className="certs__list" data-build="box">
                {certifications.map((c) => (
                  <li key={c.href}>
                    <ExternalLink href={c.href} className="cert" title={`${c.title} — ${c.issuer}`}>
                      <BadgeCheck size={16} aria-hidden="true" />
                      {c.title}
                      <span className="cert__issuer">{c.issuer}</span>
                    </ExternalLink>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}
