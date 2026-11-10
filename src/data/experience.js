/**
 * EXPERIENCE & EDUCATION — real positions only (source: resume / previous portfolio).
 * `type` is shown as a small label: 'Full-time', 'Internship', 'Program', …
 */

export const experience = [
  {
    id: 'novum-studio',
    role: 'Backend Engineer (Full Stack)',
    org: 'Novum Studio Ltd',
    context: 'Ahoy — AI team-collaboration platform (Web / Desktop / Android / Backend)',
    type: 'Full-time',
    location: 'London, UK · Remote',
    start: 'May 2025',
    end: 'Present',
    points: [
      'Architected Java 17 / Spring Boot 3 microservices for a multi-tenant platform with Spring Cloud + Nacos, MySQL (MyBatis-Flex, Liquibase), MongoDB, Redis and AWS SQS / S3; enforced JWT role-based access control and remediated a critical IDOR authentication bypass across 11 backend files.',
      'Designed the Python AI backend: LLM agents on the OpenAI Agents SDK with function tools, a multi-tenant RAG system over ChromaDB with per-workspace isolation and auto-indexing from Spring Boot, and FastAPI / Flask services on Gemini — plus LLM tracing, cost metering and an evaluation harness that gates releases.',
      'Shipped a human-in-the-loop AI task-suggestion workflow (LLM draft, then user confirm-create), improving task acceptance by 35%, along with decision-summary and what’s-new AI commands built on OpenAI structured outputs.',
      'Scaled a Node.js / Socket.IO real-time messaging server horizontally with Node cluster, sticky sessions and a Redis adapter; MongoDB message persistence, SQS-driven event delivery and Docker deployments on AWS.',
      'Developed the cross-platform Electron desktop app (macOS / Windows) in React + TypeScript with an encrypted SQLite (SQLCipher) local store, auto-updates and Sentry monitoring.',
      'Developed the Android app in Kotlin / Java (MVVM, Jetpack, Coroutines, RxJava, Retrofit / OkHttp) with offline-first Room storage and Firebase.',
    ],
    tools: ['Java 17', 'Spring Boot 3', 'Python', 'FastAPI', 'Node.js', 'Socket.IO', 'React', 'Electron', 'Kotlin', 'AWS'],
  },
  {
    id: 'epaylater',
    role: 'Backend Engineering Intern',
    org: 'ePayLater',
    context: 'Fintech — buy-now-pay-later payments',
    type: 'Internship',
    location: 'Gurgaon, Haryana',
    start: 'Jan 2024',
    end: 'Dec 2024',
    points: [
      'Built secure REST APIs (Spring Boot, Dropwizard / JDBI) on Microsoft Azure processing 10K+ daily transactions, cutting response time by 30%.',
      'Migrated services from Java 8 to Java 21 with virtual threads, improving throughput by 15%.',
      'Implemented event-driven UPI fraud alerts with Redis pub/sub for real-time threshold monitoring.',
      'Automated KYC and fraud checks by integrating Signzy, PiChain, Freshdesk and WhatsApp Business with retry / fallback.',
    ],
    tools: ['Java 21', 'Spring Boot', 'Dropwizard', 'JDBI', 'Redis', 'Azure'],
  },
  {
    id: 'acciojob',
    role: 'Full Stack Development — Java Track',
    org: 'AccioJob',
    context: 'Training program',
    type: 'Program',
    location: 'Remote',
    start: 'Nov 2022',
    end: 'Dec 2023',
    points: [
      'Intensive program covering DSA, system design, Spring Boot, microservices and React.',
      'Self-directed upskilling in AI / ML (LangChain, LLMs, RAG, vector databases), AWS, Docker and MongoDB.',
    ],
    tools: ['DSA', 'System Design', 'Spring Boot', 'Microservices', 'React'],
  },
];

export const education = [
  {
    id: 'manuu',
    degree: 'B.Tech, Computer Science & Engineering',
    institution: 'Maulana Azad National Urdu University (NAAC A+)',
    location: 'Hyderabad, Telangana',
    start: '2019',
    end: '2023',
    notes: ['CGPA 8.5', 'University Topper'],
  },
];
