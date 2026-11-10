import { ArrowUp, Mail } from 'lucide-react';
import { site } from '../config/site.js';
import { ExternalLink } from './Common.jsx';
import { GithubIcon, LinkedinIcon } from './BrandIcons.jsx';
import { useNavItems } from './Header.jsx';

export function Footer() {
  const { identity, contact } = site;
  const items = useNavItems();
  const year = new Date().getFullYear();

  const toTop = () => {
    const reduce = document.documentElement.getAttribute('data-motion') === 'off';
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    document.querySelector('.wordmark')?.focus({ preventScroll: true });
  };

  return (
    <footer className="footer">
      <div className="container">
        <p className="footer__mark" aria-hidden="true" data-build="text">
          {identity.displayName}
          <span>.</span>
        </p>
        <div className="footer__row">
          <p className="footer__copy">
            © {year} {identity.fullName}. {identity.profession}.
          </p>
          <nav aria-label="Footer">
            <ul className="footer__nav">
              {items.map((i) => (
                <li key={i.id}>
                  <a href={`#${i.id}`}>{i.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <ul className="footer__social">
            {contact.email && (
              <li>
                <a href={`mailto:${contact.email}`} className="icon-btn" aria-label={`Email ${identity.fullName}`}>
                  <Mail size={18} aria-hidden="true" />
                </a>
              </li>
            )}
            {contact.linkedin && (
              <li>
                <ExternalLink href={contact.linkedin} className="icon-btn" aria-label="LinkedIn (opens in a new tab)">
                  <LinkedinIcon width={18} height={18} />
                </ExternalLink>
              </li>
            )}
            {contact.github && (
              <li>
                <ExternalLink href={contact.github} className="icon-btn" aria-label="GitHub (opens in a new tab)">
                  <GithubIcon width={18} height={18} />
                </ExternalLink>
              </li>
            )}
            <li>
              <button type="button" className="icon-btn icon-btn--accent" onClick={toTop} aria-label="Back to top">
                <ArrowUp size={18} aria-hidden="true" />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
