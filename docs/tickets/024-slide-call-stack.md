# 024 - Slide 4: the call-stack visualizer (#call-stack)

**Goal:** The centerpiece. Port the existing prototype to a brand-styled, componentized React slide.

## Content (recursion-lab-brief §4.2 slide 4; source prototype `personal-ops-agent/.../2026-06-05_brilliant-work-sample-recursion-interactive.html`)
- `factorial(n)` for n = 2 to 6, default 4. A stack of frames that indents as it winds down; the base case lights up; values fill back in bottom up.
- Controls: `Step`, `Auto`, `Reset`, and the n selector. Heading "Now watch the calls stack up."
- One short caption per step, reused verbatim from the prototype (stored in `recursion-lab.ts`):
  - Ready: "Ready. Press Step to call factorial(n)."
  - Call (k>1): "factorial(k) cannot finish yet. It needs factorial(k-1) first, so it waits."
  - Call (k=1): "factorial(1) is the base case. No more questions, the answer is just 1."
  - Return (k=1): "factorial(1) hands back 1. Now the waiting calls can finish, one at a time."
  - Return (k>1): "factorial(k) = k x factorial(k-1) = <result>."
  - Result: "factorial(n) = <result>"
- Component: `src/components/lab/recursion/call-stack.tsx`.

## Acceptance criteria
- [ ] Event model: calls n down to 1, then returns 1 up to n; `step` index derives the visible frames and returned values. Values appear only once a frame has returned; correct for all n = 2 to 6 (factorial(4) = 24, factorial(6) = 720).
- [ ] `Step` advances one event and is disabled at the end; `Auto` plays at 900ms, stops at the end, and restarts from 0 if pressed when already finished; `Reset` returns to step 0.
- [ ] Base case is signaled by a label and an icon, not color alone.
- [ ] Numbers and code use the mono font (`--font-geist-mono`); brand tokens for all color; light and dark.
- [ ] Reduced-motion: frame changes apply instantly (no transition).

## States
- Ready (step 0) / winding down (waiting frames) / base case reached / unwinding (values filling) / complete (result shown, Step disabled). n changed rebuilds and resets.
