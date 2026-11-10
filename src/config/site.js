/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SITE CONFIGURATION — the single place to edit personal details.
 *
 *  Everything the UI shows about the owner (name, contact, links, metadata,
 *  section toggles, design tokens) is read from this file. Components never
 *  hard-code personal information.
 *
 *  Source of truth for the current content: the owner's resume (main.tex)
 *  and the owner's previous portfolio. Nothing here is invented — if a value
 *  is unknown, leave it empty and the related UI disappears cleanly.
 *
 *  Projects   → src/data/projects.js
 *  Experience → src/data/experience.js
 *  Skills, process, certifications → src/data/profile.js
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const site = {
  /** Design inspiration only — no content or code is taken from it. */
  referenceWebsite: 'https://touquirakhtar.com/',

  /** Where THIS portfolio lives. Used for canonical + Open Graph URLs. Keep the trailing slash. */
  websiteUrl: 'https://cseazeem.github.io/azeem-portfolio-2/',

  identity: {
    fullName: 'Mohd Azeem',
    displayName: 'Azeem',
    /** Split used by the giant hero headline (one entry per line). */
    heroNameLines: ['Mohd', 'Azeem'],
    profession: 'Full Stack Software Engineer',
    roleLine2: 'Backend & AI Systems',
    location: 'Mohali, India',
    locationNote: 'Remote / Relocation',
    /** Set to '' to hide the availability badge. */
    availability: 'Open to full-stack & backend roles',
    /** Handwritten accent line beside the hero name. '' hides it. */
    scriptLine: 'ships AI to production',
    headline: 'I build the backend, the AI, and the apps on top.',
    /** Meta description for search engines and link previews (~160 characters). */
    seoDescription:
      'Mohd Azeem — Full Stack Software Engineer building Java / Spring Boot and Python / FastAPI microservices, real-time systems and production AI (RAG, LLM agents).',
    intro:
      'Full Stack Software Engineer building production systems since 2024 — Java / Spring Boot and Python / FastAPI microservices, a Node.js real-time server, and React, Electron and Android clients for Ahoy, a 100K+ MAU AI team-collaboration platform.',
    aboutTitle: 'Backend-first. Full-stack capable.',
    aboutAside: 'Comfortable shipping AI into production — not just prototyping it.',
    about: [
      'I work across the whole stack of a product that real teams use every day. At Novum Studio I build Ahoy — an AI team-collaboration platform — from the multi-tenant Spring Boot microservices and the Python AI backend, through the Node.js / Socket.IO real-time server, to the Electron desktop and Android apps.',
      'My centre of gravity is system design: multi-tenant architecture, event-driven services and horizontal scaling, plus AI system design for RAG, LLM agents and evaluation. Before Ahoy I built payment and fraud services in fintech at ePayLater.',
    ],
    portrait: {
      /** Background-removed portrait used in the hero. '' = typographic hero. */
      cutout: 'assets/portrait-cutout.webp',
      cutoutWidth: 507,
      cutoutHeight: 694,
      /** Full photograph used in the About section. '' hides it. */
      photo: 'assets/portrait.webp',
      photoWidth: 760,
      photoHeight: 902,
      alt: 'Portrait of Mohd Azeem',
    },
    /** '' hides every resume button. */
    resume: 'assets/Mohd-Azeem-Resume.pdf',
    resumeFileName: 'Mohd-Azeem-Resume.pdf',
    favicon: 'assets/favicon.svg',
    ogImage: 'assets/og.jpg',
  },

  contact: {
    email: 'cseazeem@gmail.com',
    /** Shown publicly. Set to '' to hide. */
    phone: '+91 86015 33220',
    /** International digits only, e.g. '918601533220'. '' = no WhatsApp buttons. */
    whatsapp: '',
    linkedin: 'https://linkedin.com/in/cseazeem',
    github: 'https://github.com/cseazeem',
    instagram: '',
    youtube: '',
    behance: '',
    dribbble: '',
    otherLinks: [],
    responseNote: 'I usually reply within 24 hours.',
  },

  /** Verified figures only — every one of these comes from the resume. */
  metrics: [
    { value: '100K+', label: 'Monthly active users on the platform I build' },
    { value: '35%', label: 'Higher AI task-suggestion acceptance' },
    { value: '10K+', label: 'Daily payment transactions served' },
    { value: '30%', label: 'Faster API response times' },
  ],

  /** Short specialties shown as chips in the hero. */
  specialties: [
    'Java / Spring Boot',
    'Python / FastAPI',
    'Node.js',
    'React / Electron / Android',
    'AI System Design',
  ],

  appearance: {
    theme: 'dark',
    background: '#090909',
    text: '#f2efeb',
    accent: '#e32b3c',
    muted: '#a09c9a',
    displayFont: 'Anton',
    bodyFont: 'Manrope',
    accentFont: 'Caveat',
    animationIntensity: 'balanced', // subtle | balanced | expressive
    language: 'en',
  },

  preferences: {
    showAwards: false,
    showEducation: true,
    showExperience: true,
    showCertifications: true,
    showProcess: true,
    showBeforeAfter: false,
    showClientLogos: false,
    showTestimonials: false,
    showContactForm: true,
    showDownloadResume: true,
    showProjectArchive: true,
    /** Projects shown per "Load more" step in the archive. */
    archivePageSize: 6,
  },

  /** UI copy — translate here if the site language changes. */
  labels: {
    nav: { work: 'Work', about: 'About', experience: 'Experience', contact: 'Contact' },
    viewWork: 'View work',
    contact: "Let's talk",
    resume: 'Resume',
    motion: 'Motion',
    skip: 'Skip to content',
  },
};

/** URL-safe slug derived from the brand; used for storage keys. */
export const brandSlug = site.identity.fullName
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

export const storageKeys = {
  motion: `${brandSlug}:motion`,
};
