# 002 - Hero (#hero)

**Goal:** Above-the-fold hero that states who Chalece is and the headline proof, with two CTAs.

## Content (brief §6.1, verbatim, no em dashes)
- Eyebrow: `Learning Experience Designer · Technologist · Atlanta, Remote`
- Headline (oversized display): **"I make hard technical ideas click."**
- Subhead: "Ten years turning complex technical content into learning people actually finish and use. Seven published Coursera courses, 30,630+ learners. M.S. Music Technology, Georgia Tech."
- Primary CTA: `See my work` -> `#work`
- Secondary CTA: `Download resume` (PDF) and/or `Email me`

## Acceptance criteria
- [ ] Single `h1` for the headline; oversized editorial type with generous whitespace.
- [ ] Subtle static gradient accent + inline SVG `feTurbulence` grain overlay (`pointer-events:none`, `aria-hidden`).
- [ ] Optional magnetic effect on the primary CTA: pointer-fine only, disabled under reduced-motion.
- [ ] Hero is the LCP element and renders fast (no blocking JS, font preloaded).
- [ ] Works in light and dark.

## States
- CTA default / hover / focus. Reduced-motion: no magnetic effect, no scroll motion.
