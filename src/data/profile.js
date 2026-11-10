/**
 * SKILLS, PROCESS & CERTIFICATIONS — real skills only (source: resume / previous portfolio).
 */

export const skillGroups = [
  {
    title: 'Languages',
    items: ['Java (8–21)', 'Kotlin', 'Python', 'TypeScript', 'JavaScript (ES6+)', 'SQL', 'Go', 'C / C++'],
  },
  {
    title: 'Backend & Real-time',
    items: ['Spring Boot 3', 'Spring Cloud', 'Nacos', 'Microservices', 'REST APIs', 'FastAPI', 'Flask', 'Node.js', 'Socket.IO', 'MyBatis-Flex', 'Dropwizard', 'JDBI', 'Liquibase', 'Feign Client'],
  },
  {
    title: 'AI / LLM',
    items: ['OpenAI API & Agents SDK', 'Gemini', 'Anthropic Claude', 'RAG', 'ChromaDB', 'LangChain', 'Embeddings', 'AI Agents', 'LLM Evaluation & Observability', 'Prompt Engineering'],
  },
  {
    title: 'Frontend, Desktop & Mobile',
    items: ['React', 'Electron', 'Zustand', 'TanStack Query', 'Ant Design', 'Tailwind CSS', 'Android (Jetpack, MVVM)', 'Coroutines', 'RxJava', 'Room', 'Retrofit / OkHttp'],
  },
  {
    title: 'System Design',
    items: ['Distributed Systems', 'Multi-tenant Architecture', 'Event-Driven Design', 'Horizontal Scaling', 'Caching', 'AI System Design'],
  },
  {
    title: 'Data & Infrastructure',
    items: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite / SQLCipher', 'AWS (EC2, S3, SQS, CloudWatch)', 'Azure', 'Docker', 'Firebase', 'Sentry', 'CI/CD'],
  },
  {
    title: 'Security & Testing',
    items: ['JWT', 'Role-Based Access Control', 'IDOR Remediation', 'Tenant Isolation', 'TestNG', 'RestAssured'],
  },
];

/** How I work — each step is grounded in work listed on the resume. */
export const processSteps = [
  {
    title: 'Design the system',
    text: 'Service boundaries, tenancy and data flow first — multi-tenant microservices, event-driven delivery and a plan for horizontal scale.',
  },
  {
    title: 'Build across the stack',
    text: 'Spring Boot and FastAPI services, a Socket.IO real-time layer, and the React, Electron and Android clients that use them.',
  },
  {
    title: 'Secure by default',
    text: 'JWT role-based access, tenant isolation and fixing what slips through — like an IDOR bypass spread across 11 files.',
  },
  {
    title: 'Measure, then ship',
    text: 'Sentry, LLM tracing and cost metering in production, with an evaluation harness that has to pass before AI changes go out.',
  },
];

/** LinkedIn Learning certificates — each links to its public certificate. */
export const certifications = [
  { title: 'Java', issuer: 'LinkedIn Learning', href: 'https://www.linkedin.com/learning/certificates/1351e338d440b1148382e3d444002ac89b1eca5d7dfa5a912226ae5fedf3944c' },
  { title: 'AWS', issuer: 'LinkedIn Learning', href: 'https://www.linkedin.com/learning/certificates/ff4f5a07102fe8a4eecaf5378034493c62c385e1e3e74577662b1fec4ac86334' },
  { title: 'AI / ML Advanced', issuer: 'LinkedIn Learning', href: 'https://www.linkedin.com/learning/certificates/995a35a44364f01374bd0e8df23277942d4dad321ab6f11ea69e4ec193fedb53' },
  { title: 'Docker', issuer: 'LinkedIn Learning', href: 'https://www.linkedin.com/learning/certificates/52de8c74b16038c43d7231f0b9d263c2ab6506de9deb77c7e28edd408ff94a69' },
  { title: 'DevOps', issuer: 'LinkedIn Learning', href: 'https://www.linkedin.com/learning/certificates/ed90479fbd827325b0942195e310411ce1a19c2a5b9a1d4afaf015efcacd0703' },
  { title: 'LangChain', issuer: 'LinkedIn Learning', href: 'https://www.linkedin.com/learning/certificates/c2e9c5504780d9cfd5082a2a723c12059f30d0b323f2bb765f302d497c8df711' },
  { title: 'MongoDB', issuer: 'LinkedIn Learning', href: 'https://www.linkedin.com/learning/certificates/3fb0ae30b2188d07e2850bf7360ff853f3c051ae4d8b1d4cc9889bd633163df2' },
  { title: 'GitHub', issuer: 'LinkedIn Learning', href: 'https://www.linkedin.com/learning/certificates/fc30724eb6756b342e33a5bcb04c73496432be144e9f2783668ef66755517706' },
  { title: 'Vector Databases', issuer: 'LinkedIn Learning', href: 'https://www.linkedin.com/learning/certificates/166179aedf9ce410fd2ad274cbea44667d9761b0d2d9f3caa5af80caecc72022' },
  { title: 'Microservices', issuer: 'LinkedIn Learning', href: 'https://www.linkedin.com/learning/certificates/ed6027bddd6c526697e4d3a288ac8c0d21663b29d7a5151277b9189ebf573bac' },
];

/** Marquee strip under the hero. */
export const marqueeItems = [
  'Java 21', 'Spring Boot', 'Python', 'FastAPI', 'Node.js', 'Socket.IO', 'React', 'Electron',
  'Kotlin', 'RAG', 'LLM Agents', 'ChromaDB', 'Redis', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker',
];
