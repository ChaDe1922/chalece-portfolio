# 025 - Slide 5: apply, predict the output (#predict)

**Goal:** Productive struggle kept interactive: the learner commits to an answer before the reveal.

## Content (recursion-lab-brief §4.2 slide 5)
- Diagram: `factorial(4) = 4 x 3 x 2 x 1`, with answer options to choose from.
- Instruction: "Before you peek, pick the answer." Options: 24 (correct), 12, 10.
- On pick: reveal confirms the value and shows a one-line why. Allow one short reflective reveal card ("How would you stop factorial?").
- Copy: "You already know enough. Predict the output."
- Component: `src/components/lab/recursion/challenge.tsx`.

## Acceptance criteria
- [ ] Picking an option is keyboard operable and tap friendly; the choice is a real control with a clear selected state.
- [ ] A wrong pick is corrected gently (shows the right value and why), never punitive.
- [ ] The reflective reveal keeps the learner's framing optional; no required typing.
- [ ] Reduced-motion: reveal appears without motion.

## States
- Unpicked / picked correct / picked wrong (corrected) / reflective reveal shown.
