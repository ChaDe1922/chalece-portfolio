# Design References: "Night Session"

**Product:** Chalece DeLaCoudray portfolio
**Surface:** Home, pillar pages, `/lab`, lesson decks
**Date:** 2026-09-30

---

## References (1–3)

### 1. Owner-picked Night Session mockups (primary reference)
Static `.dc.html` mockups (Main, Home-Dark, Home-Mobile, WS-1 through WS-8, Pillar-MusicTech), reviewed and selected by the site owner on 2026-09-30 as "Style B — Home-B-Combined" per the header comment in `src/data/mix.ts`. This is the committed direction; the live build is judged against it, not against generic taste.

**Borrow:** the mixing-console metaphor as structural literalism — channel strips with S/ON controls, a monitor panel, a resume rendered as a DAW multitrack timeline. The metaphor is carried all the way through copy, iconography, and interaction, not just the hero.
**Avoid:** letting the metaphor's own vocabulary (formula color-coding in lessons, success/error states) drift onto a different, ungoverned palette — see critique finding on `--formula-*` tokens.

### 2. Ableton Live — Session View
**Borrow:** the restrained, information-dense channel-strip visual language (thin dividers, small mono labels, a level meter as the only "loud" element per strip) that the console component (`mix-console.tsx`) draws on directly.
**Avoid:** Ableton's utilitarian flatness reads fine in a pro tool but risks feeling cold on a portfolio; Night compensates correctly with warmer body copy and the craft-color accents, which should stay.

### 3. Linear — dark UI
**Borrow:** token-driven theming discipline (one semantic layer, no ad hoc hex in components), restrained single-accent-per-context, and a visible, deliberate focus ring rather than a suppressed outline. This is the standard the Night token layer in `globals.css` mostly meets.
**Avoid:** Linear's near-total color restraint (one accent, everywhere) does not map cleanly onto a three-craft site; Night's three-way craft accent is the right divergence and should not be flattened to match Linear more closely.

---

## Current Standards for This Surface

Dark-mode-by-default portfolio and product marketing sites in 2026 are expected to: run on a semantic CSS-variable token layer (not hardcoded Tailwind palette classes) so light/dark or multi-theme skinning is systemic; author neutral ramps in a perceptual space (OKLCH) with contrast verified at build time or in-source, as `globals.css` does with its contrast-ratio comments; use fluid, `clamp()`-based display type instead of breakpoint-snapped headings; keep motion tokenized and reduced-motion-safe; and treat interactive demos (like the lab lessons here) as first-class product surfaces with real loading/empty/error states, not just static content.

## Trend Read (will-it-age?)

| Trend used | Ages well? | Why |
|---|---|---|
| Fluid/clamp display type (Syne headings) | Yes | Scales with viewport without breakpoint jumps; not tied to a visual fad |
| OKLCH-authored dark neutral ramp with hue bias toward accent | Yes | Systematic color theory, not a look |
| Console/DAW metaphor as structural device (not just decoration) | Yes, if kept literal | The metaphor drives real functionality (solo/mute, timeline) rather than being surface skin, which is what makes it durable rather than gimmicky |
| Decorative micro-interactions (cursor trail, click-word bloom, python easter egg) | Conditional | Fine as long as they stay optional flourishes gated behind `prefers-reduced-motion` and never carry information — currently true |
| Raw Tailwind `emerald`/`amber` success/warning states in lesson quizzes | No | This is the one place the direction lapses into generic AI-default styling; flagged in critique |

## Direction in One Line

A studio console at night: three craft channels you can solo, one resume that plays back as a timeline, built on a disciplined dark token system — undermined in a few spots by un-tokenized leftover Tailwind defaults that should be pulled into the same system.
