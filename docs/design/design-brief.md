# Design Brief: Chalece DeLaCoudray Portfolio — "Night Session"

> This brief documents the visual direction already implemented on `feat/three-pillars`, written retroactively so the design-critic rubric has a committed direction to check the build against. It is not a new proposal.

**Product:** Chalece DeLaCoudray personal portfolio (chalece-portfolio)
**Author:** design-critic (retroactive capture from implementation + owner-picked mockups)
**Date:** 2026-09-30
**Status:** Implemented, uncommitted on `feat/three-pillars`
**Linked screen map:** home (`/`), pillar pages (`/music-tech`, `/software`, `/curriculum`), `/lab` index, lesson decks (`/lab/[lesson]`)

> **Craft standards:** follows [visual-design.md](../../../.claude/rules/visual-design.md) and [design-system.md](../../../.claude/rules/design-system.md).

---

## Product Personality

- Studio-grade, not portfolio-template
- Technical but warm — a musician's ear applied to software and teaching
- Confident, a little playful (the console is literally interactive), never cute
- Dense with real information (work, resume, lessons) but never cluttered

**This product should feel like:** A recording studio at night, console lit, everything else dark — you are looking at one instrument (the mixing board) that also happens to be a resume, a portfolio, and a set of lessons.

**This product should NOT feel like:** A generic "creative portfolio" dark-mode template. No purple-gradient hero, no glassmorphism cards, no `rounded-lg`/`shadow-sm` shadcn-default surfaces, no single blue accent standing in for "brand."

---

## Audience Influence on Design

- **Technical sophistication:** Mixed — hiring managers (Medium), engineers/researchers (High), and site visitors trying a lesson (Low-to-Medium). The console metaphor has to read instantly to all three without an explainer.
- **Primary device:** Both, roughly even split expected for a portfolio; lessons skew toward being tried live in the browser on any device.
- **Use context:** A recruiter or hiring manager scanning quickly (needs the pillar/hierarchy legible in 5 seconds) and a curious visitor playing with a lesson end-to-end (needs sustained legibility + touch targets on mobile).
- **Accessibility requirements:** WCAG AA in the single dark theme (no light-mode fallback for Night — see Color System), full keyboard operation of the console and lesson decks, `prefers-reduced-motion` respected everywhere motion is used.

---

## References and Standards

> Full detail in `docs/design/design-references.md`.

- **References (1–3):** Owner-picked Night Session mockups (primary, see below) · Ableton Live session view · Linear's dark UI
- **Current standards for this surface:** dark-mode-by-default portfolios/product sites with semantic tokens, restrained single accents per section, tokenized micro-motion, real empty/loading states in interactive demos
- **Trend read (will-it-age):** fluid/clamp display type and OKLCH-authored dark neutrals — yes, durable. Decorative cursor-trail/click-burst micro-interactions — used sparingly and gated to `prefers-reduced-motion`, acceptable as a personality flourish, not core UI
- **Anti-generic guard:** must not read as raw slate + one blue + rounded-lg + untouched shadcn. The Night Session direction largely clears this bar (see critique); the graded-check/quiz components are the one place generic Tailwind `emerald`/`amber` leaked back in and need remapping into the Night token system.

---

## Color System

Bias neutrals toward the accent hue; one token layer drives the whole Night surface via `.theme-night` in `src/app/globals.css` (applied through `MixProvider`, which sets `class="dark theme-night"`).

| Role | Token | Hex | Usage |
|---|---|---|---|
| Background | `--background` | `#0f1115` | Page background |
| Surface | `--card` / `--color-night-surface` | `#14171d` | Cards, console monitor |
| Raised | `--color-night-raised` | `#1d212a` | Channel strips, active surfaces |
| Border | `--border` / `--color-night-line` | `#262a33` | Dividers, card borders |
| Border strong | `--color-night-line-strong` | `#3a3f4b` | Emphasis borders, inactive control outlines |
| Text primary | `--foreground` | `#ecebe6` | Headings, primary copy |
| Text body | `--color-night-body` | `#b3b5bb` | Body copy |
| Text muted | `--muted-foreground` | `#9a9ca3` | Labels, captions, eyebrows |
| Accent — Music Tech | `--pillar-music` | `#ff7a59` (coral) | Also `--signal`/`--primary`/`--coral` at master/full-mix |
| Accent — Software | `--pillar-software` | `#5ad1c8` (teal) | |
| Accent — Curriculum | `--pillar-curriculum` | `#f5c542` (yellow) | |
| Destructive | `--destructive` (inherited from `.dark`, **not** redefined in `.theme-night`) | `#ff7a6b` | Quiz wrong-answer state — **near-identical to `--pillar-music` `#ff7a59`, see critique #6** |

**Dark mode:** Required — this is the site's one visual world. `.theme-night` sets `color-scheme: dark` and is the only theme rendered on the main site and lab; the underlying light/dark shadcn tokens exist for print and are not user-facing on Night surfaces.

**Craft re-accenting:** `lab-accent.tsx` sets `--signal`/`--primary`/`--link` to the active lesson's craft color and `--coral` to a contrasting craft, per lesson. This is the mechanism that makes each lesson "wear" its pillar. The `--formula-*` and quiz/assessment success-state colors do **not** go through this remap — see critique.

---

## Typography

| Role | Font | Size | Weight | Usage |
|---|---|---|---|---|
| Display | Syne | `clamp(3rem,7.5vw,6rem)` (hero) / `clamp(2.25rem,5vw,3.25rem)` (H2) | 700–800 | Hero H1, section H2/H3 |
| Body | IBM Plex Sans | `text-base`–`text-lg` | 400–600 | Body copy, UI labels |
| Utility/mono | IBM Plex Mono | `text-xs`–`text-sm` | 400–500 | Eyebrows, timecodes, channel labels, formula substitution |

**Font choice:** Syne (display) + IBM Plex Sans (body) + IBM Plex Mono (utility) — loaded via `next/font/google` in `src/components/night/fonts.ts`, `display: "swap"`.

**Pending:** the hero H1 copy/face ("I create, I build, and I teach.", currently Syne 800) is being workshopped separately with the owner. Critiqued as-is below but not scored as a blocker.

---

## Spacing and Layout

| Context | Value |
|---|---|
| Page shell | `mx-auto w-full max-w-[1080px] px-4 sm:px-6 xl:px-0` (`SHELL` in `shell.ts`) |
| Section vertical gap | `py-16 md:py-24` |
| Console card padding | `p-3 sm:p-7` (outer) / `p-5 sm:p-8` (monitor) |
| Grid gap | `gap-7`, `gap-4` |

One shell, one section rhythm, reused everywhere via the `SHELL`/`EYEBROW`/`H2` exports in `shell.ts` — this is good discipline and should stay the single source of spacing truth.

---

## Border Radius & Elevation

- **Style:** Moderate-to-large (`rounded-xl`/`rounded-2xl`/`rounded-3xl` on cards and the console), `rounded-[10px]` on buttons/CTAs — deliberately varied by component weight, not a flat `rounded-lg` everywhere.
- **Elevation:** Flat/bordered, no default shadow language visible on Night surfaces; depth comes from the surface ramp (`background` → `surface` → `raised`) rather than box-shadow. Consistent with a console-panel metaphor.

---

## Motion and Animation

- **Philosophy:** Functional + one signature flourish (EQ bars, playhead, channel meters) tied to the console metaphor, plus a few personality moments (click-word bloom, python-snake) gated behind `prefers-reduced-motion`.
- **Tokens:** durations/easings are consistent per-effect (200–400ms UI transitions, `cubic-bezier(0.22,1,0.36,1)` entrances) though not centralized into a single named token set in `globals.css` — each animation defines its own duration/easing inline.
- **Reduced motion:** a global kill switch (`@media (prefers-reduced-motion: reduce)`) plus per-component `motion-reduce:` / `useReducedMotion()` handling in `slide-deck.tsx`. This is thorough — see critique, scored Pass.

---

## Accessibility Targets

- **WCAG level:** AA, verified via contrast math in `globals.css` comments for the Night ramp (fg 15.83:1, body 9.22:1, muted 6.89:1, coral 7.36:1, teal 10.25:1, yellow 11.65:1 on `#0f1115`).
- **Focus style:** `.theme-night :where(button, a):focus-visible { outline: 2px solid #ecebe6; outline-offset: 3px; }` — visible, not suppressed.
- **Keyboard nav:** Console channels, deck navigation, and nav tabs are all real `<button>`/`<a>` elements with `aria-pressed`/`aria-current`.

---

## Open Questions

| Question | Owner | Status |
|---|---|---|
| Final hero H1 face/weight | Chalece (workshopping separately) | Open — pending |
| Console H2/helper copy rewrite | Marketing pass (separate) | Open — pending |
| Should quiz/assessment "correct/incorrect" states adopt Night semantic tokens instead of raw Tailwind `emerald`/`amber`? | Design | See critique #6/#8 — recommend yes |
| Should `--destructive` be redefined inside `.theme-night` so it stops colliding with the music-tech coral? | Design | See critique #6 — recommend yes |

---

## Next Recommended Artifact

- [x] **Design references** — `docs/design/design-references.md`
- [x] **Design critique** — `docs/design/design-critique.md`
- [ ] **Fix tickets** — hand the Blocker/Should list to `frontend-builder` for token remapping (no new components required)
