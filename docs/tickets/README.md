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

**Recursion Lab** (source spec: [`../product/recursion-lab-brief.md`](../product/recursion-lab-brief.md)). Build the engine first. Teaching style: instruction-driven, manipulatives before code. **Deck order: 022, 023, 029, 024, 025, 026.**

| # | Ticket | Slide | Status |
|---|--------|-------|--------|
| 020 | [SlideDeck engine](020-deck-engine.md) | engine | |
| 021 | [Recursion route & data](021-recursion-route-and-data.md) | route | |
| 022 | [Play: make it smaller](022-slide-shrink-it.md) | 1 | |
| 023 | [The two parts (match)](023-slide-match-two-parts.md) | 2 | |
| 029 | [Build the function](029-slide-build-function.md) | 3 | |
| 024 | [Watch it run (call-stack)](024-slide-call-stack.md) | 4 | done |
| 025 | [Predict the output](025-slide-predict.md) | 5 | |
| 026 | [Everywhere & close](026-slide-everywhere-and-close.md) | 6 | |
| 027 | [A11y & reduced motion](027-a11y-and-reduced-motion.md) | audit | |
| 028 | [OG, SEO & analytics](028-og-seo-analytics.md) | ship | |

**Non-negotiables (apply to every ticket):**
- No em dashes anywhere in copy. Use commas, periods, colons, or "to" for ranges.
- WCAG 2.2 AA: labels, focus rings, semantic landmarks, alt text, reduced-motion support.
- Lighthouse 95+ (Performance, Accessibility, Best Practices, SEO). LCP < 2s.
- Motion: animate only `transform`/`opacity`; gate non-essential motion behind `prefers-reduced-motion`.
- Mobile-first; tap targets >= 44x44px; no horizontal overflow at 375px.
