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

**Recursion Lab** (source spec: [`../product/recursion-lab-brief.md`](../product/recursion-lab-brief.md)). **Shipped 2026-06-05** as one taught lesson adapted from `curriculum-dev-agent/courses/recursion-intro` (mirror to dolls to countdown code to call stack to fractal tree to assessment). Engine reused (020). The earlier manipulatives slide tickets (022, 023, 029, 025, 026) are archived; the shipped lesson slides are below.

| # | Ticket | Item | Status |
|---|--------|------|--------|
| 020 | [SlideDeck engine](020-deck-engine.md) | engine | done |
| 021 | [Recursion route & data](021-recursion-route-and-data.md) | route + data | done |
| 024 | [Call stack (countdown)](024-slide-call-stack.md) | lesson slide 4 | done |
| 027 | [A11y & reduced motion](027-a11y-and-reduced-motion.md) | audit | |
| 028 | [OG, SEO & analytics](028-og-seo-analytics.md) | ship | |

Lesson slides shipped (8, sourced from the curriculum lesson, not separate tickets): mirror room, dolls + definition, what it is and where (why + applications), how to write one (recipe + countdown + predict), call stack (LIFO), no base case = RecursionError, fractal tree, assessment. Every assessed concept is taught first.

**Non-negotiables (apply to every ticket):**
- No em dashes anywhere in copy. Use commas, periods, colons, or "to" for ranges.
- WCAG 2.2 AA: labels, focus rings, semantic landmarks, alt text, reduced-motion support.
- Lighthouse 95+ (Performance, Accessibility, Best Practices, SEO). LCP < 2s.
- Motion: animate only `transform`/`opacity`; gate non-essential motion behind `prefers-reduced-motion`.
- Mobile-first; tap targets >= 44x44px; no horizontal overflow at 375px.
