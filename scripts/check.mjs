/**
 * Static checks run after `npm run build` (see `npm run check`):
 *  - dist/index.html has no unfilled {{TOKENS}} and points at files that exist
 *  - every local asset referenced by the config / project data exists
 *  - content sanity: unique ids, required fields, no "[PLACEHOLDER]" text,
 *    valid URLs/emails, featured count
 *  - every target="_blank" link in components goes through rel="noopener noreferrer"
 *  - gzip size report
 */
import { access, readFile, readdir } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const errors = [];
const warnings = [];
const ok = (msg) => console.log(`  ✔ ${msg}`);
const exists = (p) => access(p).then(() => true, () => false);
const imp = (rel) => import(pathToFileURL(path.join(root, rel)).href);

const { site } = await imp('src/config/site.js');
const { projects } = await imp('src/data/projects.js');
const { experience, education } = await imp('src/data/experience.js');
const { certifications, skillGroups } = await imp('src/data/profile.js');

console.log('\nChecking build output…');

// 1. index.html
const html = await readFile(path.join(dist, 'index.html'), 'utf8');
const leftovers = html.match(/\{\{[A-Z_]+\}\}/g);
if (leftovers) errors.push(`index.html has unfilled tokens: ${[...new Set(leftovers)].join(', ')}`);
else ok('index.html template fully rendered');

const refs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((m) => m[1]).filter((u) => !/^(https?:|mailto:|tel:|#|data:)/.test(u));
for (const ref of refs) {
  if (!(await exists(path.join(dist, ref)))) errors.push(`index.html references missing file: ${ref}`);
}
ok(`${refs.length} local references in index.html resolve`);

if (!/<link rel="canonical" href="https:\/\//.test(html)) errors.push('canonical URL missing or not absolute');
if (!/property="og:image" content="https:\/\//.test(html)) errors.push('og:image missing or not absolute');
try {
  JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  ok('JSON-LD parses');
} catch {
  errors.push('JSON-LD block is missing or invalid JSON');
}

// 2. assets referenced by config + data
const localAssets = [
  site.identity.portrait?.cutout,
  site.identity.portrait?.photo,
  site.preferences.showDownloadResume && site.identity.resume,
  site.identity.ogImage,
  site.identity.favicon,
  ...projects.flatMap((p) => [p.cover?.image, ...(p.gallery || []).map((g) => g.src)]),
].filter((a) => a && !/^https?:/.test(a));
for (const a of localAssets) {
  if (!(await exists(path.join(dist, a)))) errors.push(`asset not found in dist/: ${a}`);
}
ok(`${localAssets.length} configured assets present`);

// 3. content sanity
const isUrl = (u) => {
  try {
    const x = new URL(u);
    return x.protocol === 'https:' || x.protocol === 'http:';
  } catch {
    return false;
  }
};
const strings = JSON.stringify({ site, projects, experience, education, certifications, skillGroups });
const placeholder = strings.match(/\[(?:YOUR|REAL|PATH|SHORT|TRUE|ONE-SENTENCE|WHAT|ACTUAL)[^\]]*\]/);
if (placeholder) errors.push(`placeholder text left in content: ${placeholder[0]}`);
else ok('no [PLACEHOLDER] text in content');

if (!site.identity.fullName) errors.push('identity.fullName is empty');
if (!isUrl(site.websiteUrl) || !site.websiteUrl.endsWith('/')) errors.push('websiteUrl must be an absolute URL ending with "/"');
if (site.contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(site.contact.email)) errors.push('contact.email is not a valid address');
for (const key of ['linkedin', 'github', 'instagram', 'youtube', 'behance', 'dribbble']) {
  if (site.contact[key] && !isUrl(site.contact[key])) errors.push(`contact.${key} is not a valid URL`);
}
if (site.contact.whatsapp && !/^\d{8,15}$/.test(site.contact.whatsapp)) errors.push('contact.whatsapp must be international digits only');

const ids = new Set();
for (const p of projects) {
  if (ids.has(p.id)) errors.push(`duplicate project id: ${p.id}`);
  ids.add(p.id);
  for (const f of ['id', 'title', 'category', 'summary', 'description']) if (!p[f]) errors.push(`project ${p.id || '?'} is missing "${f}"`);
  for (const l of p.links || []) if (!isUrl(l.href)) errors.push(`project ${p.id} has invalid link: ${l.href}`);
}
const featured = projects.filter((p) => p.featured).length;
if (projects.length && (featured < 2 || featured > 4)) warnings.push(`${featured} featured projects (2–4 recommended)`);
ok(`${projects.length} projects valid (${featured} featured)`);

for (const c of certifications) if (!isUrl(c.href)) errors.push(`certification "${c.title}" has invalid link`);
ok(`${experience.length} experience entries, ${education.length} education, ${certifications.length} certifications`);

// 4. external links in components must use the ExternalLink helper or rel=noopener
const compDir = path.join(root, 'src/components');
for (const file of await readdir(compDir)) {
  const src = await readFile(path.join(compDir, file), 'utf8');
  const blanks = [...src.matchAll(/target="_blank"[^>]*/g)];
  for (const m of blanks) if (!/rel="noopener noreferrer"/.test(m[0])) errors.push(`${file}: target="_blank" without rel="noopener noreferrer"`);
}
ok('external links are safe');

// 5. size report
const assetDir = path.join(dist, 'assets');
for (const f of await readdir(assetDir)) {
  if (!/\.(js|css)$/.test(f)) continue;
  const buf = await readFile(path.join(assetDir, f));
  console.log(`  • ${f}  ${(buf.length / 1024).toFixed(1)} kB  (gzip ${(gzipSync(buf).length / 1024).toFixed(1)} kB)`);
}

for (const w of warnings) console.log(`  ⚠ ${w}`);
if (errors.length) {
  console.error(`\n✖ ${errors.length} problem(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log('\n✔ All checks passed.\n');
