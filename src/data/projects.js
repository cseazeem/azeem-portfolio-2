/**
 * PROJECTS — real work only. Every entry below is taken from the owner's
 * resume / previous portfolio. To add a project, copy the template at the
 * bottom of this file (it is NOT rendered) and fill in real details.
 *
 * Fields
 *  id           unique slug
 *  title        project name
 *  category     single category — filters are derived from these
 *  year         'YYYY' or ''
 *  org          company / context
 *  role         your role
 *  summary      one sentence for cards
 *  description  what you built and why (dialog)
 *  highlights   responsibilities / what you did (dialog bullets)
 *  outcomes     measurable results — only verified numbers
 *  tools        tech actually used
 *  cover        { image?: 'assets/projects/x.webp', width?, height?, motif?: 'graph' | 'services' | 'waves' | 'window' | 'phone' | 'ledger' | 'shield' | 'docs' }
 *               With no image, an abstract code-drawn cover is rendered from the motif.
 *  gallery      [{ src, alt, width, height }]
 *  videoUrl     YouTube URL (loaded only on request, via youtube-nocookie)
 *  links        [{ label, href }]
 *  featured     true → shown in "Selected Work"
 */

export const projects = [
  {
    id: 'ahoy-ai-backend',
    title: 'Ahoy AI Backend',
    category: 'AI Systems',
    year: '2025',
    org: 'Novum Studio Ltd · Ahoy',
    role: 'Backend Engineer (Full Stack)',
    summary:
      'LLM agents, a multi-tenant RAG system and a release-gating evaluation harness behind an AI team-collaboration platform.',
    description:
      'The Python AI backend of Ahoy, a 100K+ MAU AI team-collaboration platform. I designed LLM agents on the OpenAI Agents SDK with function tools, a multi-tenant retrieval-augmented generation system over ChromaDB with per-workspace isolation and auto-indexing from the Spring Boot services, and FastAPI / Flask services on Gemini — backed by LLM tracing, cost metering and an evaluation harness that gates releases.',
    highlights: [
      'LLM agents on the OpenAI Agents SDK with function tools.',
      'Multi-tenant RAG over ChromaDB with per-workspace isolation and auto-indexing triggered from Spring Boot.',
      'Human-in-the-loop AI task suggestions: the LLM drafts, the user confirms and creates.',
      'Decision-summary and “what’s new” AI commands built on OpenAI structured outputs.',
      'LLM tracing, cost metering and an evaluation harness that gates every release.',
    ],
    outcomes: ['35% improvement in AI task-suggestion acceptance.'],
    tools: ['Python', 'FastAPI', 'Flask', 'OpenAI Agents SDK', 'Gemini', 'ChromaDB', 'Embeddings', 'RAG'],
    cover: { motif: 'graph' },
    links: [{ label: 'Ahoy on the App Store', href: 'https://apps.apple.com/us/app/ahoy-smart-workspace/id6743841767/' }],
    featured: true,
  },
  {
    id: 'ahoy-platform-services',
    title: 'Ahoy Platform Microservices',
    category: 'Backend',
    year: '2025',
    org: 'Novum Studio Ltd · Ahoy',
    role: 'Backend Engineer (Full Stack)',
    summary:
      'Java 17 / Spring Boot 3 microservices for a multi-tenant platform, with JWT role-based access control and tenant isolation.',
    description:
      'The core services of the Ahoy platform: Java 17 / Spring Boot 3 microservices wired together with Spring Cloud and Nacos, persisting to MySQL (MyBatis-Flex, Liquibase) and MongoDB, with Redis and AWS SQS / S3 in the loop. Security is part of the design — JWT role-based access control across services, and I identified and remediated a critical IDOR authentication bypass that spanned 11 backend files.',
    highlights: [
      'Architected multi-tenant microservices with Spring Cloud + Nacos service discovery and configuration.',
      'MySQL via MyBatis-Flex with Liquibase migrations, plus MongoDB, Redis and AWS SQS / S3.',
      'Enforced JWT role-based access control across the platform.',
      'Remediated a critical IDOR authentication bypass across 11 backend files.',
    ],
    outcomes: [],
    tools: ['Java 17', 'Spring Boot 3', 'Spring Cloud', 'Nacos', 'MySQL', 'MyBatis-Flex', 'Liquibase', 'MongoDB', 'Redis', 'AWS SQS / S3', 'JWT'],
    cover: { motif: 'services' },
    links: [{ label: 'Ahoy on the App Store', href: 'https://apps.apple.com/us/app/ahoy-smart-workspace/id6743841767/' }],
    featured: true,
  },
  {
    id: 'bnpl-payment-apis',
    title: 'BNPL Payment APIs',
    category: 'Fintech',
    year: '2024',
    org: 'ePayLater',
    role: 'Backend Engineering Intern',
    summary:
      'Secure REST APIs for a buy-now-pay-later product on Azure, plus a Java 8 → Java 21 migration with virtual threads.',
    description:
      'Secure REST APIs for ePayLater’s buy-now-pay-later payments, built with Spring Boot and Dropwizard / JDBI on Microsoft Azure and processing 10K+ transactions a day. I cut response times by 30% and migrated services from Java 8 to Java 21 with virtual threads, improving throughput by 15%.',
    highlights: [
      'Built secure REST APIs with Spring Boot and Dropwizard / JDBI on Microsoft Azure.',
      'Migrated services from Java 8 to Java 21 and adopted virtual threads.',
    ],
    outcomes: ['10K+ daily transactions processed.', '30% lower API response time.', '15% higher throughput after the Java 21 migration.'],
    tools: ['Java 21', 'Spring Boot', 'Dropwizard', 'JDBI', 'Microsoft Azure', 'REST APIs'],
    cover: { motif: 'ledger' },
    links: [{ label: 'ePayLater', href: 'https://www.epaylater.in/' }],
    featured: true,
  },
  {
    id: 'phd-report-system',
    title: 'PhD Report Management System',
    category: 'Full Stack',
    year: '2025',
    org: 'Personal project',
    role: 'Full Stack Developer',
    summary:
      'An academic workflow platform for scholars, coordinators and RAC members with signed PDF export.',
    description:
      'A full-stack academic workflow platform for PhD Scholars, Coordinators and RAC Members. It covers OTP-based registration, JWT role-based access, automated DOCX report generation with Apache POI and digitally signed PDF export with iText, with a React (Vite) front end on a Spring Boot + PostgreSQL backend.',
    highlights: [
      'OTP registration and JWT role-based access for three user roles.',
      'Automated DOCX report generation (Apache POI).',
      'Digitally signed PDF export (iText).',
      'Role-based React (Vite) dashboards.',
    ],
    outcomes: [],
    tools: ['Spring Boot', 'React (Vite)', 'PostgreSQL', 'JWT', 'Apache POI', 'iText'],
    cover: { motif: 'docs' },
    links: [{ label: 'Source on GitHub', href: 'https://github.com/cseazeem/phd-report-system' }],
    featured: true,
  },
  {
    id: 'ahoy-realtime',
    title: 'Ahoy Real-time Messaging',
    category: 'Real-time',
    year: '2025',
    org: 'Novum Studio Ltd · Ahoy',
    role: 'Backend Engineer (Full Stack)',
    summary:
      'A Node.js / Socket.IO messaging server scaled horizontally with Node cluster, sticky sessions and a Redis adapter.',
    description:
      'The real-time layer of Ahoy. I scaled the Node.js / Socket.IO messaging server horizontally with Node cluster, sticky sessions and a Redis adapter, persisted messages to MongoDB, delivered backend events through AWS SQS, and shipped it as Docker deployments on AWS.',
    highlights: [
      'Horizontal scaling with Node cluster, sticky sessions and the Socket.IO Redis adapter.',
      'MongoDB message persistence.',
      'SQS-driven event delivery from the backend services.',
      'Docker deployments on AWS.',
    ],
    outcomes: [],
    tools: ['Node.js', 'Socket.IO', 'Redis', 'MongoDB', 'AWS SQS', 'Docker', 'AWS EC2'],
    cover: { motif: 'waves' },
    links: [],
    featured: false,
  },
  {
    id: 'ahoy-desktop',
    title: 'Ahoy Desktop App',
    category: 'Desktop',
    year: '2025',
    org: 'Novum Studio Ltd · Ahoy',
    role: 'Backend Engineer (Full Stack)',
    summary:
      'A cross-platform Electron app for macOS and Windows with an encrypted local store and auto-updates.',
    description:
      'The cross-platform Ahoy desktop app for macOS and Windows, built with Electron, React and TypeScript (Zustand, TanStack Query, Ant Design). It keeps an encrypted SQLite (SQLCipher) local store, updates itself, and reports errors to Sentry.',
    highlights: [
      'Electron + React + TypeScript with Zustand and TanStack Query.',
      'Encrypted SQLite (SQLCipher) local storage.',
      'Auto-updates and Sentry monitoring.',
    ],
    outcomes: [],
    tools: ['Electron', 'React', 'TypeScript', 'Zustand', 'TanStack Query', 'Ant Design', 'SQLCipher', 'Sentry'],
    cover: { motif: 'window' },
    links: [],
    featured: false,
  },
  {
    id: 'ahoy-android',
    title: 'Ahoy Android App',
    category: 'Mobile',
    year: '2025',
    org: 'Novum Studio Ltd · Ahoy',
    role: 'Backend Engineer (Full Stack)',
    summary:
      'A Kotlin / Java Android client with offline-first Room storage and Firebase messaging and monitoring.',
    description:
      'The Ahoy Android app, written in Kotlin and Java with MVVM, Jetpack, Coroutines, RxJava and Retrofit / OkHttp. It works offline-first on top of Room storage and uses Firebase for push (FCM), crash reporting (Crashlytics) and analytics.',
    highlights: [
      'MVVM architecture with Jetpack, Coroutines and RxJava.',
      'Retrofit / OkHttp networking.',
      'Offline-first storage with Room.',
      'Firebase FCM, Crashlytics and Analytics.',
    ],
    outcomes: [],
    tools: ['Kotlin', 'Java', 'Jetpack', 'MVVM', 'Coroutines', 'RxJava', 'Room', 'Retrofit', 'Firebase'],
    cover: { motif: 'phone' },
    links: [],
    featured: false,
  },
  {
    id: 'upi-fraud-kyc',
    title: 'UPI Fraud Alerts & KYC Automation',
    category: 'Fintech',
    year: '2024',
    org: 'ePayLater',
    role: 'Backend Engineering Intern',
    summary:
      'Event-driven UPI fraud alerts on Redis pub/sub, and automated KYC and fraud checks across third-party providers.',
    description:
      'Event-driven UPI fraud alerts using Redis pub/sub for real-time threshold monitoring, together with automated KYC and fraud checks that orchestrate Signzy, PiChain, Freshdesk and WhatsApp Business with retry and fallback handling.',
    highlights: [
      'Real-time threshold monitoring with Redis pub/sub.',
      'Provider orchestration for KYC and fraud checks: Signzy, PiChain, Freshdesk and WhatsApp Business.',
      'Retry / fallback strategy for third-party failures.',
    ],
    outcomes: [],
    tools: ['Java', 'Spring Boot', 'Redis pub/sub', 'Signzy', 'PiChain', 'Freshdesk', 'WhatsApp Business API'],
    cover: { motif: 'shield' },
    links: [],
    featured: false,
  },
];

/*
 * TEMPLATE — copy into the array above and replace every value with real details.
 * {
 *   id: 'my-project',
 *   title: '',
 *   category: '',
 *   year: '',
 *   org: '',
 *   role: '',
 *   summary: '',
 *   description: '',
 *   highlights: [],
 *   outcomes: [],
 *   tools: [],
 *   cover: { image: 'assets/projects/my-project.webp', width: 1600, height: 1000 },
 *   gallery: [],
 *   videoUrl: '',
 *   links: [{ label: 'Live site', href: 'https://…' }, { label: 'Source', href: 'https://github.com/…' }],
 *   featured: false,
 * },
 */
