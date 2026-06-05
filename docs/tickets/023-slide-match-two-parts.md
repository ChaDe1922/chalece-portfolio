# 023 - Slide 2: the two parts (#match-two-parts)

**Goal:** Name the two parts the learner just played with (base case, recursive case) through a quick match.

## Content (recursion-lab-brief §4.2 slide 2)
- Two labeled slots: "When to stop" and "How to shrink".
- Two chips that reference Slide 1's boxes: "the smallest box, answer is just 1" and "every bigger box: open the next, then combine".
- On a correct drop, the slot reveals the formal term (base case / recursive case) with a soft confirm.
- Copy: "Every recursion needs exactly two things. Drag each into place."
- Component: `src/components/lab/recursion/match-two-parts.tsx`. Uses the shared `draggable.tsx` primitive.

## Acceptance criteria
- [ ] Match by pointer drag, tap-chip-then-slot, and keyboard only.
- [ ] Correct drop reveals the formal term with a confirm that is not color-only (icon or text).
- [ ] A wrong drop returns the chip with a gentle hint.
- [ ] Reduced-motion: confirm appears without motion.

## States
- Unmatched / one matched / both matched. Keyboard selection state is visible (a picked-up chip is clearly indicated).
