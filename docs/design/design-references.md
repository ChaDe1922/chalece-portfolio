# Design References & Standards: Portfolio V1 editorial restyle ("Studio Bronze")

**Filled by:** ui-visual-designer (Claude) · **Before:** the V1 restyle on `feat/v1-editorial-restyle` · **Date:** 2026-09-16

> Per the studio's visual-design rule: no direction ships without this. React to something concrete, not adjectives.

Surface: the single-page marketing site (`/`): nav, hero, proof stats, selected work, background, experience, contact, footer. The `/lab` lessons inherit the tokens and are out of scope for direction changes.

---

## References (3)

### Reference 1: Pentagram (pentagram.com, work index)
- **What it is:** A design consultancy's work index. Numbered entries, hairline rules, serif set at regular weight, almost no color.
- **Borrow:** The numbered index (`01`…`09`) on work cards; hairline `gap-px` grid instead of shadowed cards; headings in a serif at 400, never bold; one accent used sparingly.
- **Avoid:** Its coldness and its dependence on large photography. This site has one headshot and no case-study imagery, so warmth has to come from the palette and the voice.

### Reference 2: Frank Chimero (frankchimero.com)
- **What it is:** A designer and writer's personal site. Ivory ground, large serif, humane first-person voice, generous measure.
- **Borrow:** The warm off-white ground (not pure white), the serif display with an italic turn inside the headline, first-person copy that states facts plainly.
- **Avoid:** Essay-length pages and reading-list structure. This is a hiring and consulting page; sections stay short and scannable.

### Reference 3: rauno.me (Rauno Freiberg)
- **What it is:** A product engineer's portfolio. Quiet surface texture, restrained hover states, mono metadata, credible to a technical reader.
- **Borrow:** Mono meta lines (eyebrows, indices, tags joined by `·`), hover that only changes color and a 1px ring, motion limited to state change.
- **Avoid:** The dev-tool register (command palettes, keyboard hints, code-as-decoration). The audience is L&D hiring managers as much as engineers.

---

## Current standards for this surface

What competent senior-portfolio sites do right now:

- One display face with character (usually a serif at regular weight) paired with a clean sans body; a mono face for labels and indices.
- One accent color, spent on links, the primary CTA, and the active nav state. Nothing else is colored.
- Semantic tokens with light and dark themes that both work; the OS preference is respected and a toggle exists.
- Proof is stated as facts and numbers near the top (courses, learners, degree), not as adjectives.
- Cards, when used, are flat: border or hairline grid, no drop shadows, no hover lift.
- Motion only for state change and arrival: a hero fade-up, a scroll reveal, a theme cross-fade. No cursor effects, no click gags.
- Print stylesheet that produces a clean one- or two-page résumé companion.

## Trend read (tasteful, will-this-age filter)

| Trend | Use it? | Will-it-age verdict |
|---|---|---|
| Serif italic turn inside a large display headline | Yes | Editorial convention for decades; reads considered in 2028 |
| Mono uppercase eyebrows and numbered indices | Yes | Utility typography, not decoration; ages well |
| Hairline `gap-px` grids in place of shadowed cards | Yes | Structural, quiet, prints well |
| Bento / asymmetric tile grids | No | Already reads as 2024; would date the site fast |
| Gradient meshes, grain overlays, glow blobs | No | The "friendly startup" look this restyle is removing |
| Cursor trails, click bursts, magnetic buttons | No | Novelty; undercuts "mature and professional" |

---

## Direction in one line

**An editorial studio page: warm ivory and ink with a single bronze accent, Instrument Serif at regular weight over Geist, hairlines instead of shadows, and copy that states the proof and stops.** Not raw slate, not one blue, not rounded-everything, not untouched shadcn.
