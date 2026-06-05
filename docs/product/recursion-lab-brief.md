# Product Brief: Recursion Lab (Interactive Slide Experience)

**Last updated:** 2026-06-05
**Status:** Approved by owner, ready for build (naming and scope confirmed 2026-06-05)
**Audience / pipeline:** Product Agent → Website Agent → Frontend Agent → Implementation (Next.js) → Deploy (Vercel)
**Owner:** Chalece DeLaCoudray
**Style rule (non-negotiable):** No em dashes anywhere in copy or code comments. Use commas, periods, colons, or "to" for ranges.
**Author note:** This is one of two related briefs. It also defines the shared `SlideDeck` engine that `about-experience-brief.md` reuses. Build this engine first.

**Shipped (2026-06-05):** `/lab/recursion` now delivers one complete, taught lesson adapted from `curriculum-dev-agent/courses/recursion-intro` (M1 L1): mirror room (experience) to nested dolls (base case, recursive case) to countdown code (chunked, predict the output) to call stack (countdown visualizer) to fractal tree (payoff) to a graded assessment finale (multiple choice with per-option feedback, a fill-in trace, and a synthesis reflection with a self-assessment rubric). The §4.2 manipulatives arc below is archived. The SlideDeck engine is unchanged and still powers it.

---

## 0. TL;DR for the build team
Build a self-contained, **interactive slide-style lesson** that teaches recursion by letting the learner drive it: a short deck of full-viewport slides, each with one idea, an interactive diagram, and a thing to do, ending in a steppable call-stack visualizer and a mini challenge. It lives at the route **`/lab/recursion`** in the existing portfolio app, is shareable as a standalone link (it is the work sample Chalece submits to Brilliant), and is built on the existing stack (Next.js 16 App Router, React 19, TypeScript, Tailwind v4, shadcn + `@base-ui/react`, `motion` for animation). Teaching style is **instruction-driven, manipulatives before code**: never a story or an essay. Each slide gives the learner a short instruction and a thing to manipulate (drag concrete shapes to play with the idea first, then ramp up to code). They construct the concept, then watch it run. WCAG 2.2 AA, keyboard and touch navigable, respects reduced motion.

## 1. Problem / Opportunity
Chalece is applying for the Brilliant CS Learning Designer role, which asks for samples of teaching a new concept, ideally **interactive learning experiences**. A static PDF undersells her. Recursion is named directly in the job description (recursion, dynamic programming, backtracking). An interactive recursion lesson does double duty: it is the strongest possible Brilliant sample, and it becomes a permanent showpiece in her portfolio that proves she builds the exact thing the role hires for. A working prototype already exists as a single HTML file (`personal-ops-agent/outputs/career/applications/2026-06-05_brilliant-work-sample-recursion-interactive.html`); this brief turns it into a polished, on-brand slide experience in the real app.

## 2. Goals and non-goals
**Goals**
- Teach one concept (recursion) so well that a reviewer feels it click.
- Demonstrate Chalece's signature method (interactive, visual, learner-driven) in the artifact itself.
- Be shareable as a clean public link and embeddable in the portfolio.

**Non-goals**
- Not a full CS course. One concept, one tight arc.
- No backend, no accounts, no saved progress beyond the URL.
- No heavy game engine. Plain React, `motion`, SVG, and CSS.

## 3. Target users and flows
- **Primary: Brilliant hiring reviewer.** Opens the shared link cold, on desktop, gives it 2 to 4 minutes. Goal: see Chalece teach interactively. Flow: lands on the hook, steps through, plays with the call stack, tries the challenge, ends on a quiet "who made this" + portfolio link.
- **Secondary: recruiters and learners** arriving from her portfolio `/lab` index. Same flow.
- **Tertiary: Chalece**, who wants a stable link to paste into applications.

## 4. The experience

### 4.1 Format
A horizontal deck of full-viewport slides advanced by: on-screen Prev/Next buttons, left/right arrow keys, touch swipe, and clickable progress dots. A thin top progress bar. The current slide is reflected in the URL hash (`/lab/recursion#3`) for deep-linking. A persistent small "Restart" control. One idea per slide. Copy is minimal; the interaction carries the teaching.

### 4.2 Slide-by-slide spec
Each slide lists: purpose, the interactive diagram, the instruction (what the learner does), and on-slide copy (final, paste-ready, no em dashes). No scenarios or narration. Manipulatives come first; code comes later. Advancing is allowed any time; construct slides celebrate a correct answer rather than blocking.

**Slide 1, Play: make it smaller (concrete, no code)**
- Purpose: build the core intuition by manipulating, before any code. Recursion makes a problem smaller until it is small enough to answer, then builds the answer back up.
- Diagram: a stack of nested boxes (or circles) labeled 4, 3, 2, 1, biggest on top. The smallest (1) is the stopping point.
- Instruction: "Drag the top box aside to open the next smaller one." Each drag peels one box (4 to 3 to 2 to 1). At 1, it glows and labels "smallest: nothing left to open, the answer is just 1." Then the instruction flips: "Now stack the answers back up," and each box, dragged back, shows its running value until the top shows the result. Replayable.
- Reduced motion: boxes open and close without travel animation.
- Copy: title "Make it smaller, then build it back." Sub: "Open each box until one is too small to open. That smallest box is where recursion stops."

**Slide 2, The two parts (quick match)**
- Purpose: name the two parts the learner just played with.
- Diagram: two labeled slots, "When to stop" and "How to shrink," and two draggable chips that reference the boxes: "the smallest box, answer is just 1" and "every bigger box: open the next, then combine."
- Instruction: "Every recursion needs two things. Drag each into place." On a correct drop, the slot reveals the formal term (base case / recursive case) with a soft confirm. Tap-to-place and keyboard both work.
- Copy: "Every recursion needs exactly two things. Drag each into place."

**Slide 3, Build the function (ramp to code)**
- Purpose: construct the real thing. This is the marquee build, the moment the concrete idea becomes code.
- Diagram: a `factorial(n)` skeleton with two empty slots, a base-case slot and a recursive-case slot, in Geist Mono.
- Instruction: "Drag the right line into each slot." Blocks offered: `if (n <= 1) return 1;` (base, correct), `return n * factorial(n - 1);` (recursive, correct), plus distractors `return n * factorial(n);` and `if (n == 0) return 0;`. A wrong drop is rejected with a one-line hint (for example, "that never gets smaller"). A correct build confirms with a small celebration and the line "You built it. Now watch it run."
- Copy: "Build factorial. Drag the right line into each slot."

**Slide 4, Watch it run: the call-stack visualizer**
- Purpose: the centerpiece payoff. The function they just built, executing.
- Diagram: pick `factorial(2..6)`; a stack of frames that indents as it winds down, the base case is labeled and lit, then values fill back in bottom up.
- Interaction: `Step`, `Auto`, `Reset`, and the n selector. One short caption per step (reused verbatim from the prototype). Built and componentized to brand tokens.
- Copy: heading "Now watch the calls stack up." Intro: "Here is the function you built, running. Press Step."

**Slide 5, Apply: predict the output**
- Purpose: productive struggle, kept interactive (not an essay).
- Diagram: `factorial(4) = 4 x 3 x 2 x 1`, with answer options to choose from.
- Instruction: "Before you peek, pick the answer." Options 24 (correct), 12, 10. On pick, reveal confirms the value and shows the one-line why. Allow one short reflective reveal card ("How would you stop factorial?").
- Copy: "You already know enough. Predict the output."

**Slide 6, Everywhere + who made this (close)**
- Purpose: payoff and gentle attribution.
- Diagram: three small cards (a nested list, folders in folders, a search that splits) that show the same shrink-and-return shape.
- Instruction: "Tap each to spot the same shape." Then a quiet footer card.
- Copy: "Once you see it, recursion is everywhere." Footer: "Made by Chalece DeLaCoudray, who builds interactive learning like this." Links: portfolio home, LinkedIn. No hard sell.

**Deck order:** Slide 1 (play) to Slide 2 (two parts) to Slide 3 (build) to Slide 4 (watch it run) to Slide 5 (predict) to Slide 6 (close).

### 4.3 Shared SlideDeck engine (build this first, reused by Brief 2)
A reusable, data-driven deck component.

- **Component:** `src/components/deck/slide-deck.tsx` exporting `<SlideDeck slides={Slide[]} accent? deckId />`.
- **Slide model (typed):** `src/components/deck/types.ts`
  ```ts
  export type Slide = {
    id: string;            // stable, used in URL hash
    title?: string;
    render: () => React.ReactNode; // the slide body (usually an interactive component)
    advanceGate?: boolean; // if true, Next is disabled until the slide signals complete
  };
  ```
- **Navigation:** Prev/Next buttons, ArrowLeft/ArrowRight and Space, touch swipe (pointer events, no extra lib), clickable progress dots, top progress bar. Sync current index to `location.hash` and read it on load for deep-linking.
- **Transitions:** `motion` `AnimatePresence`, horizontal slide + fade. Under `prefers-reduced-motion`, replace with an instant cross-fade (no translate).
- **A11y:** each slide is a labelled region; manage focus to the slide heading on change; controls are real buttons with aria-labels; dots expose current via `aria-current`; full keyboard operability; visible focus rings (reuse existing focus styles).
- **State:** local only. Optional `advanceGate` lets a slide require an interaction before Next enables (used sparingly, e.g., Slide 3 match). Expose a small context so slide bodies can call `markComplete()`.
- **Styling:** brand tokens from `globals.css` (`--background`, `--foreground`, `--primary` violet, `--card`, `--muted-foreground`, fonts `--font-space-grotesk` headings, `--font-inter` body, `--font-geist-mono` for code). Respect light/dark via `next-themes`.

## 5. Architecture and files
- **Route:** `src/app/lab/recursion/page.tsx` (server component shell) rendering a client `<SlideDeck>`. Add a simple `src/app/lab/page.tsx` index later (Phase 2) listing labs.
- **Content as data:** `src/data/recursion-lab.ts` holds slide copy, captions, and the model answers (single source of truth, no em dashes), mirroring the `src/data/*.ts` convention.
- **Slide bodies:** `src/components/lab/recursion/` (one file per interactive slide: `shrink-it.tsx`, `match-two-parts.tsx`, `build-function.tsx`, `call-stack.tsx`, `challenge.tsx`, `everywhere.tsx`), plus a shared accessible drag primitive `draggable.tsx` (pointer drag + tap-to-place + keyboard, no extra library).
- **Engine:** `src/components/deck/` as in 4.3.
- **Reuse:** existing `reveal.tsx`, `motion-provider.tsx`, `magnetic-button.tsx`, `click-word.tsx` where they fit. Do not reinvent motion setup.
- **Constraint:** per `AGENTS.md`, this is Next.js 16 with breaking changes. Read `node_modules/next/dist/docs/` before writing routing or component code. Mark client components with `"use client"`.

## 6. Visual and brand
- Warm paper background, ink text, electric-violet primary, coral sparingly for highlights. Geist Mono for all code and numbers. Generous whitespace, one idea per screen, calm layout (Chalece's style: warm in feel, minimal on the page, rigorous in substance).
- Motion is purposeful, never decorative noise. Every animation should reveal structure (the call winding down, the value coming back).

## 7. Accessibility (WCAG 2.2 AA, non-negotiable, she does a11y work)
- Full keyboard path through every slide and interaction; drag interactions have a tap or keyboard alternative (Slide 3 must be completable without a mouse).
- `prefers-reduced-motion` fully honored.
- Color is never the only signal (base case uses a label and an icon, not just green).
- Contrast meets AA on paper and dark themes. Visible focus on all controls. Captions and headings use semantic elements.

## 8. Sharing, SEO, analytics
- Unique OG image and title for `/lab/recursion` ("Recursion, watch it run. An interactive lesson by Chalece DeLaCoudray.") so the shared link looks intentional.
- `@vercel/analytics` already present; add a lightweight event on Step, Auto, challenge reveal, and completion (anonymous counts only).
- Canonical URL, descriptive metadata, included in `sitemap.ts`.

## 9. Build plan (tickets)
Create these in `docs/tickets/` following the existing numbered format (Goal, Content, Acceptance criteria, States).
- **020-deck-engine** Shared `SlideDeck` (nav, hash sync, reduced motion, a11y, progress, gate).
- **021-recursion-route-and-data** `/lab/recursion` route + `src/data/recursion-lab.ts` content.
- **022-slide-shrink-it** Slide 1 (concrete nested-boxes manipulative: open down to the base, build back up).
- **023-slide-match-two-parts** Slide 2 (drag/tap/keyboard match: when to stop vs how to shrink).
- **029-slide-build-function** Slide 3 (drag code blocks into the factorial skeleton, with distractors).
- **024-slide-call-stack** Slide 4 (port prototype, restyle, componentize).
- **025-slide-predict** Slide 5 (predict the output, pick from options + reveal).
- **026-slide-everywhere-and-close** Slide 6 (three shape cards + attribution).
- **027-a11y-and-reduced-motion** Audit pass across the deck.
- **028-og-seo-analytics** OG image, metadata, sitemap, events.

Deck order: 022, 023, 029, 024, 025, 026.

## 10. Acceptance criteria
- [ ] `/lab/recursion` runs through 6 slides via buttons, arrow keys, swipe, and dots; URL hash tracks the slide.
- [ ] The call-stack visualizer steps, autoplays, resets, and supports n = 2 to 6 with correct values.
- [ ] Every drag interaction (Slides 1, 2, 3) is completable with keyboard only and by tap on touch.
- [ ] `prefers-reduced-motion` removes translate animations everywhere.
- [ ] Lighthouse: Performance 90+, Accessibility 100, no contrast failures.
- [ ] Zero em dashes in any copy, data file, or comment.
- [ ] Shareable link renders a correct OG card.

## 11. Out of scope (Phase 2)
- A `/lab` index page and additional concept labs (binary search "the power of halving", dynamic programming).
- Saved progress, multi-language, or learner accounts.
