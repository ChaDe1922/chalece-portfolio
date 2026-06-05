# 021 - Recursion route and data (#lab-recursion)

**Goal:** The `/lab/recursion` route shell plus a single source of truth for all lab copy, captions, and answers.

## Content (recursion-lab-brief §5)
- `src/app/lab/recursion/page.tsx`: server shell, exports page `metadata` (title "Recursion, watch it run. An interactive lesson by Chalece DeLaCoudray.", description, `alternates.canonical: "/lab/recursion"`, openGraph). Renders the client deck.
- `src/app/lab/recursion/recursion-deck.tsx`: client component that assembles `Slide[]` (with `render` callbacks) and renders `<SlideDeck slides deckId="recursion" />`.
- `src/data/recursion-lab.ts`: slide titles and copy, call-stack caption builders, challenge model answers, `N_RANGE = [2,3,4,5,6]`, default `n = 4`. Named-const + exported types, no em dashes.

## Acceptance criteria
- [ ] `/lab/recursion` renders the deck full-viewport and runs in light and dark.
- [ ] All slide copy and captions are read from `src/data/recursion-lab.ts` (no copy hardcoded in components).
- [ ] `render` callbacks live in the client component (not passed from the server shell).
- [ ] Page metadata is set; canonical is `/lab/recursion`.

## States
- Server render of the shell, client hydration of the deck. Direct deep-link to `/lab/recursion#<id>`.
