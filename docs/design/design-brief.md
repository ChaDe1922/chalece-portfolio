# Design Brief: Chalece DeLaCoudray portfolio, V1 editorial restyle ("Studio Bronze")

**Product:** chalece-portfolio (single-page marketing site at `/`; `/lab` lessons inherit tokens)
**Author:** Claude (ui-visual-designer), workshopped with the owner
**Date:** 2026-09-16
**Status:** Implemented on `feat/v1-editorial-restyle`, awaiting owner review on `:3100`
**Linked references:** `docs/design/design-references.md`

> Craft standards: references and current standards before design, fluid type, spacing rhythm, semantic tokens, light and dark, motion tokens, anti-generic. `design-critic` and `accessibility-agent` run before hand-off.

---

## Product Personality

- Editorial
- Assured
- Warm
- Precise
- Quiet

**This product should feel like:** A design studio's index page written in the first person: the work is listed plainly, the numbers are real, the type does the talking.

**This product should NOT feel like:** A friendly startup landing page. No gradient blobs, no grain, no pill badges, no cursor effects, no winking copy.

---

## Audience Influence on Design

- **Technical sophistication:** Medium to High. Two readers weighted equally: hiring managers for senior LXD / L&D roles, and prospective consulting clients (often technical founders or engineering leads). Mono meta lines and the interactive-lesson link speak to the second reader without alienating the first.
- **Primary device:** Both. Recruiters skim on a phone; clients read on a laptop. Stats and contact must read at 375px without wrapping mid-word.
- **Use context:** Sixty-second skim from a résumé link or LinkedIn. Proof must be above the fold on desktop and within one scroll on mobile. The print stylesheet is a résumé companion.
- **Accessibility requirements:** WCAG 2.2 AA. Owner-tuned theme cross-fade stays. Reduced motion must render every final value with no animation.

---

## References and Standards

- **References:** Pentagram (numbered index, hairlines, serif at 400; avoid its coldness). Frank Chimero (ivory ground, big serif with an italic turn, humane voice; avoid essay-length pages). rauno.me (mono meta, restrained hover; avoid the dev-tool register).
- **Current standards:** one serif display + one sans body + one mono; one accent; semantic tokens with both themes; flat cards or hairline grids; motion only for arrival and state change; a real print stylesheet.
- **Trend read:** serif italic turn and mono eyebrows pass the will-this-age test. Bento grids, gradient meshes, grain, and cursor effects do not, and were removed.
- **Anti-generic guard:** neutrals are warm (ivory / warm near-black), not slate. The accent is bronze, not blue. Radius is `0.375rem`, not `rounded-lg` everywhere. shadcn `buttonVariants` is themed through tokens, not shipped raw.

---

## Color System

Semantic tokens live in `src/app/globals.css` on `:root` and `.dark`. Components style through tokens only; token names are unchanged from V1 so the 111 lab files inherit the palette without edits. `--formula-*` (lab math color-coding) is untouched.

| Role | Token | Light | Dark | Usage |
|---|---|---|---|---|
| Background | `--background` | `#f6f3ee` ivory | `#161511` warm near-black | Page ground |
| Foreground | `--foreground` | `#17161a` ink | `#ece7dd` | Headings, body |
| Surface | `--card` / `--popover` | `#fdfbf7` | `#1f1d19` | Work cards, sheet |
| Secondary / muted | `--secondary` / `--muted` | `#ece8e0` | `#26231e` | Code chips, fills |
| Muted text | `--muted-foreground` | `#5f5a52` (6.2:1) | `#aaa397` (7.3:1) | Eyebrows, labels, subhead |
| Accent wash | `--accent` / `--accent-foreground` | `#efe6d6` / `#4a3a1c` | `#2e2818` / `#e6d4a8` | Monogram fallback, callouts |
| Border | `--border` / `--input` | `#dcd6cb` | `#2e2b25` | Hairlines, dividers, grid gaps |
| Primary | `--primary` / `--primary-foreground` | `#8a6a2f` bronze / `#ffffff` (5.0:1) | `#c9a55c` brass / `#161511` (7.9:1) | Primary CTA, active nav |
| Ring | `--ring` | `#8a6a2f` | `#c9a55c` | Focus rings |
| Link | `--link` | `#7a5c26` (5.6:1) | `#d4b46b` (9.2:1) | Text links, hover color, active underline |
| Coral (decorative, labs) | `--coral` | `#b8743a` terracotta | `#d9925a` | Lab waveforms and second warm tone |
| Destructive | `--destructive` | `#b53a2b` | `#f08a7a` | Lab error states only |

**Dark mode:** Required. Both themes designed with equal care; the toggle and the 650ms cross-fade are owner-tuned and unchanged. Print uses the light palette.

Contrast figures above are computed WCAG ratios; axe-core reports 0 violations in both themes.

---

## Typography

| Role | Font | Size | Weight | Usage |
|---|---|---|---|---|
| Display 1 | Instrument Serif | `clamp(2.6rem, 1.9rem + 3.4vw, 4.9rem)`, lh 1.02 | 400, italic turn | Hero headline |
| Display 2 | Instrument Serif | `clamp(1.9rem, 1.45rem + 1.6vw, 2.8rem)`, lh 1.1 | 400 | Section titles |
| Stat numeral | Instrument Serif | `clamp(2.5rem, 2rem + 2vw, 3.75rem)`, tabular | 400 | Proof stats |
| Card heading | Instrument Serif | `text-xl` | 400 | Work card titles |
| Wordmark | Instrument Serif | `text-xl` | 400 | Nav |
| Body | Geist | `text-base` / `text-lg` hero subhead | 400 | Copy |
| Eyebrow / meta | Geist Mono | `0.75rem`, uppercase, tracking `0.14em` | 400 | Section eyebrows, indices, tags, contact labels |
| Small | Geist | `text-sm` | 400 | Stat labels, focus-area rows, footer |

**Font choice:** Instrument Serif (400, roman + italic, non-variable) + Geist + Geist Mono via `next/font/google`, `display: swap`. `font-synthesis-weight: none` so the serif never fakes a bold; utilities like `font-bold` on lab headings resolve to 400 by design.
**Config note:** fonts are wired through `@theme inline` (`--font-sans`, `--font-mono`, `--font-heading`); utilities `display-1`, `display-2`, `stat-numeral`, `eyebrow` are `@utility` rules in `globals.css`.

---

## Spacing and Layout

| Context | Class |
|---|---|
| Page horizontal padding | `px-4 md:px-8` |
| Page max width | `max-w-5xl mx-auto` |
| Section vertical gap | `py-20 md:py-28` (stats row `py-12 md:py-14`) |
| Card padding | `p-6` |
| Hairline grid gap | `gap-px bg-border` |
| List rows | `py-2.5` (focus areas), `py-4` (résumé highlights, contact) |

Density: comfortable. One measure for reading (`max-w-2xl` on the hero subhead and section descriptions).

---

## Border Radius

- **Style:** Subtle. `--radius: 0.375rem`. `rounded-md` on the work grid frame, headshot, and buttons. Hairline rows have no radius.

## Elevation and Shadow

- **Card shadow:** None. Cards are `bg-card` cells in a `bg-border` hairline grid.
- **Hover elevation:** None. Linked work cards get a 1px inset ring in `--link`; contact rows and card titles turn `--link`. No translate, no shadow.

---

## Component Styles

| Component | Style Decision |
|---|---|
| Buttons, primary | `CtaLink` default: bronze fill, white text, `h-11 px-5 rounded-md`, arrow icon |
| Buttons, secondary | `CtaLink` outline (résumé download) and `text` variant: underlined in `--border`, underline turns `--link` on hover |
| Navigation | Sticky top bar, serif wordmark, sans links, active state is a 1px `--link` underline; mobile sheet unchanged |
| Work cards | Mono index `01`…`09`, serif title, one-line description, tags joined with `·` in mono |
| Stats | Four cells divided by hairlines on desktop, 2x2 on mobile, serif numerals with count-up |
| Lists | `divide-y divide-border` rows with mono indices (experience) or mono labels (contact) |
| Badges | Removed from the marketing page |

---

## Iconography

- **Library:** Lucide (already installed). No new icon dependencies.
- **Size:** 16px inline (`size-4`) for arrows; nav and sheet icons unchanged.
- **Style:** Outline. Arrows are the only icons on the marketing page (`ArrowDown` on the primary CTA, `ArrowUpRight` on external links).

---

## Imagery and Illustration

- **Photography:** One headshot, `rounded-md`, in the Background section.
- **Illustration:** None.
- **Avatar fallback:** Serif monogram on `--accent`.
- **Image treatment:** Contained, no overlay, no frame.

---

## Motion and Animation

- **Philosophy:** Quiet. Motion only for arrival and state change.
- **Kept:** hero staggered fade-up (`enter-*`), scroll reveal, stat count-up, theme cross-fade (650ms), hover color transitions at 200ms.
- **Removed from the marketing page:** cursor trail, click-ripple burst, click-word bloom, magnetic pull, grain overlay. The components remain in the repo because the lab decks import them.
- **Reduced motion:** honored globally; stats render final values with no count-up (verified).

---

## Responsive Breakpoints

| Breakpoint | Width | Layout change |
|---|---|---|
| Mobile | < 640px | Single column; stats 2x2; contact label stacks over value; work grid one column |
| `sm:` | 640px+ | Work grid two columns; contact rows become `10rem + 1fr` grid; focus areas two columns |
| `md:` | 768px+ | Section padding widens; hero CTAs inline |
| `lg:` | 1024px+ | Stats four across with dividers; work grid three columns; about two columns |

---

## Accessibility Targets

- **WCAG level:** 2.2 AA. axe-core: 0 violations, light and dark.
- **Contrast:** lowest text pair is white on bronze at 5.0:1; everything else 5.6:1 or better.
- **Focus style:** `focus-visible:ring-2 ring-ring` (bronze / brass), inset on rows and cards; never suppressed.
- **Keyboard:** every row and card is a real `<a>`; external links announce "opens in a new tab" via `sr-only`.
- **Lighthouse (built, `next start`):** desktop Perf 100 / A11y 100 / SEO 100; mobile Perf 91 / A11y 100 (see Open Questions).

---

## Website-Specific Design Notes

**Website type:** Portfolio website

| # | Section | Background | Key visual decision |
|---|---|---|---|
| 1 | Hero | `bg-background` | Left-aligned; mono eyebrow, serif display with italic turn, one primary CTA + two text links |
| 2 | Proof stats | `bg-background`, `border-y` | Four serif numerals divided by hairlines |
| 3 | Selected work | `bg-background` | Hairline 3-column grid, numbered cards, no shadows |
| 4 | Background | `bg-background`, `border-t` | Headshot + two paragraphs + two-column focus-area list |
| 5 | Experience | `bg-background`, `border-t` | Numbered highlight rows + outline résumé CTA |
| 6 | Contact | `bg-background`, `border-t` | Three hairline rows: mono label, value, arrow |
| 7 | Footer | `border-t` | Copyright, location, anchor links |

**Navigation:** sticky top, solid `bg-background/90` with blur, mobile sheet.
**CTA styling:** primary bronze fill; secondary outline or underlined text link with arrow.
**Hero visual:** none. Type only.
**Card style:** flat cells in a hairline grid.
**Stats:** large serif number + small label row.

---

## Open Questions

| Question | Owner | Status |
|---|---|---|
| Mobile Lighthouse Perf is 91 (live `main` is 95). Cause: the hero fade-up starts at opacity 0 so Chrome never counts it as LCP; the LCP falls to the stat numeral, and its count-up pushes the "largest" paint to ~3s under simulated throttling. On `main` the grain overlay's SVG happened to be the LCP and masked this. Real-world LCP is under 1s. Option: skip the count-up for stat blocks already on screen at load (only animate when they scroll into view), which also avoids flipping a visible number to 0. Owner's call since count-ups were explicitly kept. | Owner | Open |
| Instrument Serif at 400 means lab headings that use `font-bold` render regular (synthesis is disabled). Reads as intended in the spot-checks; flag if any lab slide wants real emphasis. | Owner | Open |
| Design critic (⚠ Risk, motion): on desktop the proof stats are already in view at load, so the count-up first shows the real number, wipes it to 0, then counts back. Same root cause as the mobile LCP row above. Fix if wanted: only count up for blocks that scroll into view after first paint. | Owner | Open |

**Resolved after review (2026-09-16):** linked work cards now show their destination host next to the arrow so linked and unlinked cells differ at rest; hover-only feedback on cards and contact rows now also fires on keyboard focus; unlinked cards no longer recolor on hover; work grid is a real list; skip link moves focus into `<main>`; count-up numerals are `aria-hidden` behind a static sr-only value; contact values wrap instead of truncating; theme toggle exposes `aria-pressed` and a state-specific label; sheet close button is 44px; footer links have 44px targets; nav uses `aria-current="location"`. Full reports: `docs/design/design-critique.md`, `docs/qa/accessibility-review-homepage.md`.

---

## Next Recommended Artifact

- [x] Frontend build on `feat/v1-editorial-restyle`
- [x] `design-critic` critique: 8 Pass, 2 Risk, 0 Fail; polish risk fixed, motion risk left to owner
- [x] `accessibility-agent` review: 1 High + 9 Medium fixed; 7 Low noted, not actioned
- [ ] Owner review on `:3100`, then merge to `main` and deploy only on explicit instruction
