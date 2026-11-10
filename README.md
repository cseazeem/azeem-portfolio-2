# azeem-portfolio-2

Personal portfolio of **Mohd Azeem** — Full Stack Software Engineer (Backend & AI Systems).

Dark, editorial, typography-led single page built with **React 19**, **Framer Motion 12**, **Lucide** icons and plain CSS, bundled with **esbuild** into a static site.

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173 — rebuilds and live-reloads on save
npm run build    # production build → dist/
npm run check    # build + static checks (assets, links, content, SEO tags)
npm run preview  # production build served at http://localhost:5173
```

Requires Node 18+.

## Where to edit things

| What | File |
| --- | --- |
| Name, headline, bio, location, contact, socials, metrics, colours, fonts, section toggles, SEO URL | `src/config/site.js` |
| Projects (cards, archive, case-study dialog) | `src/data/projects.js` |
| Work experience & education | `src/data/experience.js` |
| Skills, "How I work", certifications, marquee | `src/data/profile.js` |
| Portrait, resume PDF, OG image | `public/assets/` |
| Styles / design tokens | `src/styles.css` (colours & fonts are also injected from `site.js`) |

Components never hard-code personal details — everything comes from the files above.
Leave a value empty (`''` or `[]`) and the related UI disappears cleanly (e.g. `contact.whatsapp`, `identity.resume`, `identity.portrait.cutout`).

### Adding a project

Copy the commented template at the bottom of `src/data/projects.js`. Without a `cover.image`,
the card shows an abstract, code-drawn cover chosen by `cover.motif`
(`graph`, `services`, `waves`, `window`, `phone`, `ledger`, `shield`, `docs`). Add real
screenshots to `public/assets/projects/` and set `cover: { image, width, height }` to use them.
Mark 2–4 projects `featured: true`.

### Assets

- `portrait-cutout.webp` — background-removed version of the profile photo (hero).
- `portrait.webp` — the original photo (About section).
- `Mohd-Azeem-Resume.pdf` — compiled from the LaTeX resume. Re-export and replace it when the resume changes.
- `og.jpg` — link-preview image.

## Features

- Full-bleed name headline auto-fitted to the viewport, layered behind the portrait cut-out with an outline copy in front
- Selected work + searchable, filterable project index with "Load more" and a hover preview
- Accessible case-study dialog (focus trap, Esc / backdrop / close button, focus restore, prev/next)
- Expandable experience timeline, skills, process and verified certification links
- Contact section with copy-to-clipboard and a validated form that opens the visitor's own mail app (`mailto:`) — nothing is stored or sent by the site
- **Motion** control in the header:
  - ▶ plays the *swarm build* — a team of cursors rebuilds the current view (selection boxes, size badges, guides, typed text, scanned images). Original code in `src/swarm/swarm.js`, no third-party scripts. `Esc` skips.
  - the switch turns site animations on/off; the choice is saved per browser and defaults to the OS "reduce motion" setting
- SEO: title/description/canonical/Open Graph/Twitter tags and JSON-LD `Person`, all generated from `site.js`; `robots.txt` and `sitemap.xml`

## Deploy (GitHub Pages)

`.github/workflows/deploy.yml` builds and deploys on every push to `main`.
One-time setup: **GitHub → repo Settings → Pages → Build and deployment → Source: GitHub Actions**.
The site will be served at `https://cseazeem.github.io/azeem-portfolio-2/` (set `websiteUrl` in `site.js` if you use a custom domain).

All asset paths are relative, so the `dist/` folder also works on Netlify, Vercel, Cloudflare Pages or any static host
(build command `npm run build`, output directory `dist`).
