# 020 - SlideDeck engine (#deck)

**Goal:** A reusable, data-driven full-viewport slide deck engine used by `/lab/recursion` and later `/story`. Build this first.

## Content (recursion-lab-brief §4.3)
- Component `src/components/deck/slide-deck.tsx`: `<SlideDeck slides={Slide[]} deckId accent? />`.
- Slide model `src/components/deck/types.ts`: `{ id: string; title?: string; render: () => React.ReactNode; advanceGate?: boolean }`.
- Deck context (`useDeck()`): `markComplete(id)` and `isComplete(id)` so a slide body can satisfy its `advanceGate`.
- One idea per slide, minimal chrome: thin top progress bar, Prev/Next, clickable progress dots, persistent Restart.

## Acceptance criteria
- [ ] Advance/retreat via Prev/Next buttons, ArrowLeft / ArrowRight / Space, touch swipe (pointer events, no extra library), and clickable dots.
- [ ] Current index syncs to `location.hash` as `#<slide.id>`; on load, a valid hash selects that slide (invalid hash falls back to first).
- [ ] Transitions use `motion/react` `AnimatePresence` + `m.div` (horizontal slide + fade). Under `prefers-reduced-motion`, transition is an instant cross-fade (opacity only, no translate).
- [ ] `advanceGate` slides disable Next until the slide calls `markComplete()`; Next re-enables once complete.
- [ ] A11y: each slide is a labelled region; focus moves to the slide heading on change; controls are real buttons with aria-labels; dots expose `aria-current`; visible focus rings; full keyboard operability.
- [ ] Uses brand tokens from `globals.css`; works in light and dark; no horizontal overflow at 375px.

## States
- First slide (Prev disabled) / middle / last slide (Next disabled unless more content). Gated slide before vs after completion. Reduced-motion: cross-fade only. Deep-link load with a hash. Empty/invalid hash.
