/**
 * Build / dev / preview script (esbuild).
 *
 *   node scripts/build.mjs            → production build into dist/
 *   node scripts/build.mjs --dev      → watch + local server with live reload
 *   node scripts/build.mjs --preview  → production build, then serve dist/
 *
 * index.html is a template: {{TOKENS}} are filled from src/config/site.js so
 * the title, meta, Open Graph, canonical URL and JSON-LD always match the config.
 */
import * as esbuild from 'esbuild';
import { cp, mkdir, readFile, rm, writeFile, access, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const args = new Set(process.argv.slice(2));
const isDev = args.has('--dev');
const isPreview = args.has('--preview');
const PORT = Number(process.env.PORT) || 5173;

const exists = (p) => access(p).then(() => true, () => false);

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

async function loadConfig() {
  const bust = `?t=${Date.now()}`;
  const imp = (rel) => import(pathToFileURL(path.join(root, rel)).href + bust);
  const [{ site, storageKeys }, { experience, education }] = await Promise.all([
    imp('src/config/site.js'),
    imp('src/data/experience.js'),
  ]);
  return { site, storageKeys, experience, education };
}

function absoluteUrl(site, rel) {
  if (!rel) return '';
  if (/^https?:\/\//.test(rel)) return rel;
  return new URL(rel.replace(/^\.?\//, ''), site.websiteUrl).href;
}

function fontsUrl(a) {
  const fam = (name, spec = '') => `family=${encodeURIComponent(name).replace(/%20/g, '+')}${spec}`;
  const parts = [fam(a.displayFont), fam(a.bodyFont, ':wght@400;500;600;700;800')];
  if (a.accentFont) parts.push(fam(a.accentFont, ':wght@500;600'));
  return `https://fonts.googleapis.com/css2?${parts.join('&')}&display=swap`;
}

function jsonLd({ site, experience, education }) {
  const { identity, contact } = site;
  const current = experience.find((e) => /present/i.test(e.end));
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: identity.fullName,
    jobTitle: identity.profession,
    url: site.websiteUrl,
    image: absoluteUrl(site, identity.ogImage),
    email: contact.email ? `mailto:${contact.email}` : undefined,
    address: identity.location
      ? { '@type': 'PostalAddress', addressLocality: identity.location }
      : undefined,
    worksFor: current ? { '@type': 'Organization', name: current.org } : undefined,
    alumniOf: education.map((e) => ({ '@type': 'CollegeOrUniversity', name: e.institution })),
    knowsAbout: site.specialties,
    sameAs: [contact.linkedin, contact.github, contact.instagram, contact.youtube, contact.behance, contact.dribbble]
      .filter(Boolean),
  };
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

function noscript({ site }) {
  const { identity, contact } = site;
  const links = [
    contact.email && `<a href="mailto:${esc(contact.email)}">${esc(contact.email)}</a>`,
    contact.linkedin && `<a href="${esc(contact.linkedin)}">LinkedIn</a>`,
    contact.github && `<a href="${esc(contact.github)}">GitHub</a>`,
    identity.resume && site.preferences.showDownloadResume && `<a href="${esc(identity.resume)}">Resume (PDF)</a>`,
  ].filter(Boolean);
  return `<div class="noscript"><h1>${esc(identity.fullName)}</h1><p>${esc(identity.profession)} — ${esc(identity.roleLine2)}</p><p>${esc(identity.intro)}</p><p>${links.join(' · ')}</p></div>`;
}

function tokensCss(a) {
  // `:root:root` outranks the defaults in styles.css, so the config always wins.
  return `:root:root{--bg:${a.background};--text:${a.text};--accent:${a.accent};--muted:${a.muted};` +
    `--font-display:'${a.displayFont}',Impact,'Arial Narrow Bold',sans-serif;` +
    `--font-body:'${a.bodyFont}',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;` +
    `--font-accent:'${a.accentFont}','Bradley Hand',cursive}`;
}

function faviconSvg(site) {
  const { background, text, accent } = site.appearance;
  const initial = site.identity.displayName.trim().charAt(0).toUpperCase() || '•';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${background}"/><text x="30" y="47" text-anchor="middle" font-family="Anton, Impact, 'Arial Narrow', sans-serif" font-size="42" font-weight="700" fill="${text}">${esc(initial)}</text><circle cx="50" cy="44" r="5" fill="${accent}"/></svg>`;
}

async function renderHtml(outputs) {
  const cfg = await loadConfig();
  const { site, storageKeys } = cfg;
  const { identity, appearance } = site;
  const template = await readFile(path.join(root, 'index.html'), 'utf8');

  const title = `${identity.fullName} — ${identity.profession}`;
  const description = identity.seoDescription || identity.intro;
  const motionScript =
    `<script>(function(){var d=document.documentElement,v=null;try{v=localStorage.getItem(${JSON.stringify(storageKeys.motion)})}catch(e){}` +
    `if(v!=='on'&&v!=='off'){v=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches?'off':'on'}d.setAttribute('data-motion',v)})();</script>`;
  const devReload = isDev
    ? `<script>new EventSource('/esbuild').addEventListener('change',function(){location.reload()})</script>`
    : '';
  const heroPreload = identity.portrait?.cutout
    ? `<link rel="preload" as="image" href="${esc(identity.portrait.cutout)}" fetchpriority="high" />`
    : '';

  const tokens = {
    LANG: appearance.language || 'en',
    TITLE: esc(title),
    DESCRIPTION: esc(description),
    CANONICAL: esc(site.websiteUrl),
    THEME_COLOR: esc(appearance.background),
    FAVICON: esc(identity.favicon || 'assets/favicon.svg'),
    OG_TITLE: esc(title),
    OG_DESCRIPTION: esc(description),
    OG_URL: esc(site.websiteUrl),
    OG_IMAGE: esc(absoluteUrl(site, identity.ogImage)),
    OG_IMAGE_ALT: esc(identity.portrait?.alt || identity.fullName),
    SITE_NAME: esc(identity.fullName),
    AUTHOR: esc(identity.fullName),
    MOTION_SCRIPT: motionScript,
    FONTS_URL: esc(fontsUrl(appearance)),
    HERO_PRELOAD: heroPreload,
    TOKENS: tokensCss(appearance),
    CSS: outputs.css,
    JS: outputs.js,
    JSON_LD: jsonLd(cfg),
    NOSCRIPT: noscript(cfg),
    DEV_RELOAD: devReload,
  };
  const html = template.replace(/\{\{([A-Z_]+)\}\}/g, (m, key) => (key in tokens ? tokens[key] : m));
  await writeFile(path.join(dist, 'index.html'), html);

  // Generated helpers: favicon (unless one is supplied), robots.txt, sitemap.xml
  const fav = identity.favicon || 'assets/favicon.svg';
  if (!(await exists(path.join(root, 'public', fav)))) {
    await mkdir(path.dirname(path.join(dist, fav)), { recursive: true });
    await writeFile(path.join(dist, fav), faviconSvg(site));
  }
  await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap.xml', site.websiteUrl).href}\n`);
  await writeFile(
    path.join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${esc(site.websiteUrl)}</loc></url></urlset>\n`,
  );
}

function outputsFrom(metafile) {
  const rel = (p) => path.relative(dist, path.resolve(root, p)).split(path.sep).join('/');
  let js = '';
  let css = '';
  for (const [file, info] of Object.entries(metafile.outputs)) {
    if (info.entryPoint && file.endsWith('.js')) {
      js = rel(file);
      if (info.cssBundle) css = rel(info.cssBundle);
    }
  }
  return { js, css };
}

const htmlPlugin = {
  name: 'html',
  setup(build) {
    build.onEnd(async (result) => {
      if (result.errors.length || !result.metafile) return;
      try {
        await renderHtml(outputsFrom(result.metafile));
      } catch (err) {
        console.error('✖ index.html generation failed:', err);
        if (!isDev) process.exitCode = 1;
      }
    });
  },
};

const options = {
  absWorkingDir: root,
  entryPoints: { app: 'src/main.jsx' },
  bundle: true,
  outdir: 'dist/assets',
  entryNames: isDev ? '[name]' : '[name]-[hash]',
  assetNames: '[name]-[hash]',
  format: 'esm',
  target: ['es2020', 'chrome100', 'safari15', 'firefox100'],
  jsx: 'automatic',
  minify: !isDev,
  sourcemap: isDev ? 'inline' : false,
  metafile: true,
  legalComments: 'none',
  logLevel: 'info',
  define: { 'process.env.NODE_ENV': JSON.stringify(isDev ? 'development' : 'production') },
  plugins: [htmlPlugin],
};

async function prepareDist() {
  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });
  if (await exists(path.join(root, 'public'))) await cp(path.join(root, 'public'), dist, { recursive: true });
  await writeFile(path.join(dist, '.nojekyll'), '');
}

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.pdf': 'application/pdf', '.json': 'application/json', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml',
  '.woff2': 'font/woff2', '.ico': 'image/x-icon',
};

function serveStatic(dir, port) {
  const server = createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      let file = path.join(dir, urlPath);
      if (!file.startsWith(dir)) { res.writeHead(403).end(); return; }
      if ((await stat(file).catch(() => null))?.isDirectory()) file = path.join(file, 'index.html');
      const body = await readFile(file);
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' }).end(body);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
    }
  });
  server.listen(port, () => console.log(`\n  ▸ Preview: http://localhost:${port}/\n`));
}

await prepareDist();

if (isDev) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
  const { port } = await ctx.serve({ servedir: dist, port: PORT });
  console.log(`\n  ▸ Dev server: http://localhost:${port}/  (live reload on save)\n`);
} else {
  const result = await esbuild.build(options);
  if (result.errors.length) process.exit(1);
  console.log('✔ Build complete → dist/');
  if (isPreview) serveStatic(dist, PORT);
}
