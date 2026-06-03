# 009 - Accessibility & Lighthouse

**Goal:** Pass a manual WCAG 2.2 AA review and hit Lighthouse 95+ across all four categories.

## Accessibility checklist (WCAG 2.2 AA)
- [ ] Keyboard: tab order logical, every interactive element reachable, visible focus everywhere.
- [ ] Landmarks: `header`, `nav`, `main`, `section` (labelled), `footer`. One `h1`, ordered headings.
- [ ] Contrast >= 4.5:1 text / 3:1 large text, verified in BOTH light and dark.
- [ ] Color is never the sole signal (status/active states have text/shape too).
- [ ] All images have alt; decorative images `alt=""` / `aria-hidden`.
- [ ] `prefers-reduced-motion`: count-up, scroll reveals, magnetic CTA all disabled.
- [ ] Mobile menu traps focus and restores it on close.
- [ ] Skip-to-content link.

## Lighthouse targets
- [ ] Performance >= 95, LCP < 2s.
- [ ] Accessibility >= 95.
- [ ] Best Practices >= 95.
- [ ] SEO >= 95.

## Final scrub
- [ ] Grep all rendered copy for em dashes; zero allowed.
