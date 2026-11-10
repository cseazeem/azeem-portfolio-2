import { useRef, useState } from 'react';
import { Check, Copy, Download, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { site } from '../config/site.js';
import { Reveal } from '../lib/motion.jsx';
import { ExternalLink } from './Common.jsx';
import { GithubIcon, LinkedinIcon } from './BrandIcons.jsx';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = 'Please tell me your name.';
  if (!values.email.trim()) errors.email = 'Please add your email so I can reply.';
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = 'That email address doesn’t look right.';
  if (values.message.trim().length < 10) errors.message = 'A little more detail, please (at least 10 characters).';
  return errors;
}

function ContactForm() {
  const { contact, identity } = site;
  const [values, setValues] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');
  const formRef = useRef(null);

  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      setStatus('');
      formRef.current?.querySelector(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    const subject = values.subject.trim() || `Hello ${identity.displayName} — from ${values.name.trim()}`;
    const body = `${values.message.trim()}\n\n— ${values.name.trim()}\n${values.email.trim()}`;
    const href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
    setStatus(
      `Your email app should now open with this message ready to send. Nothing is sent until you press send there. If nothing opened, write to ${contact.email}.`,
    );
  };

  const field = (name, label, props = {}, Tag = 'input') => (
    <div className={`field${errors[name] ? ' has-error' : ''}`}>
      <label htmlFor={`cf-${name}`}>
        {label}
        {props.required && <span aria-hidden="true"> *</span>}
      </label>
      <Tag
        id={`cf-${name}`}
        name={name}
        value={values[name]}
        onChange={set(name)}
        aria-invalid={errors[name] ? true : undefined}
        aria-describedby={errors[name] ? `cf-${name}-error` : undefined}
        {...props}
      />
      {errors[name] && (
        <p id={`cf-${name}-error`} className="field__error">
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <form ref={formRef} className="cform" onSubmit={onSubmit} noValidate aria-labelledby="cform-title" data-build="box">
      <h3 id="cform-title" className="cform__title">
        Send a message
      </h3>
      <p className="cform__hint">This opens your own email app with the message filled in — no data is stored on this site.</p>
      <div className="cform__row">
        {field('name', 'Name', { type: 'text', autoComplete: 'name', required: true })}
        {field('email', 'Email', { type: 'email', autoComplete: 'email', required: true, inputMode: 'email' })}
      </div>
      {field('subject', 'Subject', { type: 'text' })}
      {field('message', 'Message', { rows: 5, required: true }, 'textarea')}
      <button type="submit" className="btn btn--accent cform__submit">
        Compose email <Send size={16} aria-hidden="true" />
      </button>
      <p className="cform__status" role="status" aria-live="polite">
        {status}
      </p>
    </form>
  );
}

export function Contact() {
  const { contact, identity, preferences, labels } = site;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const socials = [
    contact.linkedin && { label: 'LinkedIn', href: contact.linkedin, Icon: LinkedinIcon, handle: contact.linkedin.replace(/^https?:\/\/(www\.)?/, '') },
    contact.github && { label: 'GitHub', href: contact.github, Icon: GithubIcon, handle: contact.github.replace(/^https?:\/\/(www\.)?/, '') },
    ...(contact.otherLinks || []),
  ].filter(Boolean);

  const waHref = contact.whatsapp
    ? `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${identity.displayName}, I found your portfolio and would like to talk.`)}`
    : '';

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="container">
        <Reveal className="contact__head">
          <p className="shead__kicker">
            <span className="shead__index">04</span>
            <span aria-hidden="true">/</span>
            Contact
          </p>
          <h2 id="contact-title" className="contact__title" data-build="text">
            Let&rsquo;s build <span className="contact__accent">something real.</span>
          </h2>
          {identity.availability && (
            <p className="contact__sub" data-build="text">
              {identity.availability}. {contact.responseNote}
            </p>
          )}
        </Reveal>

        <div className={`contact__grid${preferences.showContactForm && contact.email ? '' : ' contact__grid--solo'}`}>
          <Reveal className="contact__info">
            {contact.email && (
              <div className="contact__email-wrap" data-build="box">
                <p className="contact__label">Email</p>
                <a className="contact__email" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
                <button type="button" className="copy-btn" onClick={copy} aria-live="polite">
                  {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                  {copied ? 'Copied' : 'Copy address'}
                </button>
              </div>
            )}

            <ul className="contact__list" data-build="box">
              {contact.phone && (
                <li>
                  <Phone size={18} aria-hidden="true" />
                  <a href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}>{contact.phone}</a>
                </li>
              )}
              {identity.location && (
                <li>
                  <MapPin size={18} aria-hidden="true" />
                  <span>
                    {identity.location}
                    {identity.locationNote && ` · ${identity.locationNote}`}
                  </span>
                </li>
              )}
              {socials.map(({ label, href, Icon, handle }) => (
                <li key={href}>
                  {Icon ? <Icon width={18} height={18} /> : <Mail size={18} aria-hidden="true" />}
                  <ExternalLink href={href} aria-label={`${label} (opens in a new tab)`}>
                    {handle || label}
                  </ExternalLink>
                </li>
              ))}
            </ul>

            <div className="contact__actions" data-build="box">
              {waHref && (
                <ExternalLink href={waHref} className="btn btn--ghost">
                  <MessageCircle size={18} aria-hidden="true" /> WhatsApp
                </ExternalLink>
              )}
              {preferences.showDownloadResume && identity.resume && (
                <a href={identity.resume} className="btn btn--ghost" download={identity.resumeFileName}>
                  <Download size={18} aria-hidden="true" /> Download {labels.resume.toLowerCase()} <span className="sr-only">(PDF)</span>
                </a>
              )}
            </div>
          </Reveal>

          {preferences.showContactForm && contact.email && (
            <Reveal delay={0.08}>
              <ContactForm />
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
