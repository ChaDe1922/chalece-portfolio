# 004 - Featured Work (#work)

**Goal:** Bento-grid showcase of 6 featured projects, each linking to live proof where public.

## Content (brief §6.3) - typed in `src/data/work.ts`
1. **Coursera Course Catalog (Codio)** - 7 published courses (DevOps, containers, CI/CD, OS, Unix, web security), 30,630+ learners. Tags: Curriculum, Assessment, Technical. Link: https://www.coursera.org/instructor/~88911140
2. **Multi-Agent AI Systems** - ~14 production-grade multi-agent systems for curriculum, professional learning, UX accessibility, venture strategy. Tags: AI, Systems, Prototyping.
3. **Your Voice Is Power** - Curriculum + coding competition with CEISMC, Amazon, Georgia Tech, Pharrell's YELLOW on EarSketch. Tags: Curriculum, Equity, Music + Code.
4. **Planet Bug (ACM CHI 2020)** - Published educational conservation game with custom hardware controller; programmed embedded microcontrollers and sensors. Tags: Game-based learning, Published, Hardware.
5. **Audio Program Management at Amazon Music** - Led Audio Quality and Hardware Compatibility across 50+ device combinations, 1,200+ test scenarios; stood up a testing lab. Tags: Program Management, Audio, Scale.
6. **E22 / Atlanta Truth Data Systems** - Co-founded an athletic development company; built the data and analytics backbone for a women's tackle football team. Tags: Data, Dashboards, Sports.

## Acceptance criteria
- [ ] `WorkCard` + `WorkGrid`, data-driven from `work.ts` (title, description, tags, optional href).
- [ ] Bento layout via CSS Grid `grid-template-areas`, varied tile sizes; collapses to single column on mobile.
- [ ] Cards with a link render as accessible links (whole-card click target ok, but keep a real focusable anchor); external links use `target="_blank" rel="noopener noreferrer"` with an external-link cue.
- [ ] Pure-CSS hover lift + focus-visible ring. Tags rendered with shadcn `Badge`.
- [ ] Cards without a link are clearly non-interactive (no fake affordance).

## States
- Default / hover / focus. No empty state needed (static content).
