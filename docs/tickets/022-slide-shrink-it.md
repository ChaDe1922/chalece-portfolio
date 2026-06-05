# 022 - Slide 1: play, make it smaller (#shrink-it)

**Goal:** Build the core intuition by manipulating concrete shapes before any code: shrink a problem to a stopping point, then build the answer back up.

## Content (recursion-lab-brief §4.2 slide 1)
- Interactive diagram: a stack of nested boxes labeled 4, 3, 2, 1 (biggest first). The smallest is the stopping point.
- Instruction phase 1: "Drag the top box aside to open the next smaller one." Each drag peels one box down to 1.
- At 1: it glows and is labeled "smallest: nothing left to open, the answer is just 1."
- Instruction phase 2: "Now stack the answers back up." Dragging each box back shows its running value until the top shows the result.
- Copy: title "Make it smaller, then build it back." Sub: "Open each box until one is too small to open. That smallest box is where recursion stops."
- Component: `src/components/lab/recursion/shrink-it.tsx`. Uses the shared `draggable.tsx` primitive.

## Acceptance criteria
- [ ] No code on this slide. Concrete boxes/shapes only, plain language.
- [ ] Open down to the base and build back up via pointer drag, tap, and keyboard.
- [ ] The smallest box is signaled by a label, not color alone; it cannot be opened further.
- [ ] Replayable (a Reset or by closing all the way back up).
- [ ] Reduced-motion: boxes open/close instantly, no travel animation.

## States
- All closed (start) / opening (peeling down) / base reached / building back up / complete (result shown). Reset returns to start.
