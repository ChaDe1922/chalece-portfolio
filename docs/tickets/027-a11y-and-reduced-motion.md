# 027 - Accessibility and reduced motion audit (#a11y)

**Goal:** A full pass so the whole deck meets WCAG 2.2 AA and honors reduced motion everywhere.

## Content (recursion-lab-brief §7, §10)
- Audit every slide and interaction across the deck.

## Acceptance criteria
- [ ] Full keyboard path through every slide and interaction; the Slide 3 match is completable with keyboard only.
- [ ] `prefers-reduced-motion` removes all translate animations (deck transitions and slide bodies); motion is replaced by instant or cross-fade.
- [ ] Color is never the only signal (base case, correct match, active card all carry a label or icon).
- [ ] Contrast meets AA on paper and dark themes; visible focus on all controls; headings and captions use semantic elements; focus moves to the slide heading on change.
- [ ] Touch targets >= 44x44px; no horizontal overflow at 375px.
- [ ] Lighthouse Accessibility 100, no contrast failures; Performance 90+.

## States
- Verified with keyboard only, with reduced-motion on, at 375px, and in dark mode.
