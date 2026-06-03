# 003 - Proof Stats (#proof)

**Goal:** Four headline stat blocks that give instant credibility.

## Content (brief §6.2)
- **30,630+** learners reached
- **7** published Coursera courses
- **10+** years in learning and technology
- **M.S.** Music Technology, Georgia Tech (3.75 GPA)

## Acceptance criteria
- [ ] `StatBlock` component (big number + label), driven by `src/data/stats.ts`.
- [ ] Count-up animation on scroll-into-view via `IntersectionObserver` + `requestAnimationFrame`, runs once.
- [ ] Final number is the real DOM text (accessible source of truth); under `prefers-reduced-motion` show it instantly, no animation.
- [ ] Non-numeric stats (`M.S.`) render statically.
- [ ] Responsive grid: 1 col mobile, 2 col `sm`, 4 col `lg`.

## States
- Default. Reduced-motion = static final values.
