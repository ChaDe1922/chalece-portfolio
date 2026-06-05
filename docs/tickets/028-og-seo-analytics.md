# 028 - OG image, SEO, and analytics (#og-seo)

**Goal:** Make the shared `/lab/recursion` link look intentional and measure engagement anonymously.

## Content (recursion-lab-brief §8)
- `src/app/lab/recursion/opengraph-image.tsx`: branded OG card, title "Recursion, watch it run. An interactive lesson by Chalece DeLaCoudray." (mirror the root `opengraph-image.tsx` pattern with `next/og` `ImageResponse`).
- Descriptive metadata + canonical for `/lab/recursion` (confirm against ticket 021).
- Add `/lab/recursion` to `src/app/sitemap.ts`.
- Lightweight `@vercel/analytics` events: Step, Auto, challenge Reveal, and deck completion (anonymous counts only).

## Acceptance criteria
- [ ] Shared link renders a correct, on-brand OG card (1200x630).
- [ ] `/lab/recursion` is present in the sitemap with a canonical URL and descriptive title/description.
- [ ] Analytics events fire once per action, carry no personal data.
- [ ] No layout or performance regression (OG image is build-time/edge, not client weight).

## States
- Link preview in a social/scraper context. Analytics events observed in the Vercel dashboard.
