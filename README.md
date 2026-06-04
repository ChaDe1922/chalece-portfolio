# Chalece DeLaCoudray Portfolio

A fast, accessible, single-page portfolio site. Next.js (App Router) + TypeScript + Tailwind v4 + shadcn/ui, fully static, deploys free on Vercel.

Spec: [docs/product/product-brief.md](docs/product/product-brief.md). Build tickets: [docs/tickets/](docs/tickets/).

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Production build / preview:

```bash
npm run build
npm run start
```

Quality gates:

```bash
npx tsc --noEmit   # types
npm run lint       # eslint
```

## Editing content

All copy and data live in typed files (no hunting through JSX):

- `src/data/site.ts` — name, role, links, email, SEO strings, nav anchors, headshot flag, deployed URL (`site.url`)
- `src/data/work.ts` — the featured-work bento cards
- `src/data/stats.ts` — the four proof stats
- Bio + skills: `src/components/about-section.tsx`
- Resume highlights: `src/components/resume-section.tsx`

Copy rule: no em dashes anywhere (use commas, periods, colons, or "to" for ranges).

## Before deploying: swap in real assets

1. **Resume PDF** — replace `public/Chalece-DeLaCoudray-Resume.pdf` (currently a placeholder) with the real ATS resume, same filename.
2. **Headshot** — drop a photo at `public/headshot.jpg`, then set `hasHeadshot: true` in `src/data/site.ts`. Until then the About section shows a polished monogram.
3. **Deployed URL** — set `site.url` in `src/data/site.ts` to the real Vercel URL (drives `metadataBase`, canonical, sitemap, robots, JSON-LD).

## Deploy (Vercel)

1. `git init`, commit, push to a new GitHub repo.
2. Import the repo at vercel.com (framework auto-detected). Deploy to the free `*.vercel.app` subdomain.
3. Vercel Web Analytics + Speed Insights are already wired (`<Analytics />`, `<SpeedInsights />`); enable them in the project dashboard. Note: their scripts 404 in local dev and only resolve once deployed on Vercel.

## Verified quality (local, production build)

- Lighthouse: Performance 97, Accessibility 100, Best Practices 96 (the 2 missing points are the Vercel analytics scripts that only exist once deployed), SEO 100. CLS 0, TBT ~10ms.
- axe-core WCAG 2.2 AA: 0 violations in light and dark.
- No horizontal overflow at 390 / 768 / 1280 px. Single `h1`. Zero em dashes.
- Motion (scroll reveals, count-up, magnetic CTA) is reduced-motion safe.

## Tech notes

- Dark mode via `next-themes` (system default + persisted toggle), tokens in `src/app/globals.css`.
- Motion via `motion` (`m` + `LazyMotion`, ~4.6kb) with `reducedMotion="user"`; scroll reveals use native CSS scroll timelines (progressive enhancement).
- OG image generated at build by `src/app/opengraph-image.tsx`.
