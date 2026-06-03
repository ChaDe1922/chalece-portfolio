# Dev Tickets: Chalece DeLaCoudray Portfolio

Lean ticket set for the v1 build. Source spec: [`../product/product-brief.md`](../product/product-brief.md).

**Build order (dependency-aware):**

| # | Ticket | Status |
|---|--------|--------|
| 000 | [Setup & scaffold](000-setup.md) | |
| 001 | [Nav & theme toggle](001-nav-and-theme.md) | |
| 002 | [Hero](002-hero.md) | |
| 003 | [Proof stats](003-proof-stats.md) | |
| 004 | [Featured work (bento)](004-featured-work.md) | |
| 005 | [About](005-about.md) | |
| 006 | [Resume](006-resume.md) | |
| 007 | [Contact & footer](007-contact-footer.md) | |
| 008 | [SEO & metadata](008-seo-metadata.md) | |
| 009 | [Accessibility & Lighthouse](009-a11y-and-lighthouse.md) | |

**Non-negotiables (apply to every ticket):**
- No em dashes anywhere in copy. Use commas, periods, colons, or "to" for ranges.
- WCAG 2.2 AA: labels, focus rings, semantic landmarks, alt text, reduced-motion support.
- Lighthouse 95+ (Performance, Accessibility, Best Practices, SEO). LCP < 2s.
- Motion: animate only `transform`/`opacity`; gate non-essential motion behind `prefers-reduced-motion`.
- Mobile-first; tap targets >= 44x44px; no horizontal overflow at 375px.
