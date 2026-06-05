# 029 - Slide 3: build the function (#build-function)

**Goal:** The marquee construct: the learner assembles the real `factorial` function by dragging code into a skeleton. The moment the concrete idea becomes code.

## Content (recursion-lab-brief §4.2 slide 3)
- Diagram: a `factorial(n)` skeleton with two empty slots (base-case slot, recursive-case slot), rendered in Geist Mono.
- Blocks to drag:
  - `if (n <= 1) return 1;` (base, correct)
  - `return n * factorial(n - 1);` (recursive, correct)
  - `return n * factorial(n);` (distractor, never shrinks)
  - `if (n == 0) return 0;` (distractor, wrong base value)
- Instruction: "Drag the right line into each slot." A wrong drop is rejected with a one-line hint (for example, "that never gets smaller"). A correct build confirms with a small celebration and "You built it. Now watch it run."
- Copy: "Build factorial. Drag the right line into each slot."
- Component: `src/components/lab/recursion/build-function.tsx`. Uses the shared `draggable.tsx` primitive.

## Acceptance criteria
- [ ] Both slots fillable by pointer drag, tap, and keyboard only.
- [ ] Only the correct block satisfies each slot; distractors are rejected with a specific hint, not a generic error.
- [ ] Correct, complete build shows a confirm and the "now watch it run" line (which points at Slide 4).
- [ ] Code is monospace; reads correctly in light and dark; no horizontal overflow at 375px.
- [ ] Reduced-motion: celebration is static (no motion).

## States
- Empty / one slot filled / wrong block attempted (hint, returns) / both correct (celebrate). A reset clears the slots.
