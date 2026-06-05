# 026 - Slide 6: where you see it, and who made this (#everywhere-close)

**Goal:** Payoff (recursion is everywhere) and a quiet attribution that links back to the portfolio.

## Content (recursion-lab-brief §4.2 slide 6)
- Three small cards that each animate the same "ask the one ahead" shape: a nested list, folders in folders, a search splitting.
- Tap each card to highlight the same recursive shape.
- Copy: "Once you see it, recursion is everywhere."
- Footer card: "Made by Chalece DeLaCoudray, who builds interactive learning like this." Links: portfolio home, LinkedIn. No hard sell.
- Component: `src/components/lab/recursion/everywhere.tsx`. Reuse `magnetic-button.tsx` for the footer links where it fits.

## Acceptance criteria
- [ ] Each card is keyboard activatable and reveals the recursive shape highlight (not color-only).
- [ ] Footer links use `rel="noopener noreferrer"` for external; portfolio home links internally.
- [ ] Reduced-motion: highlight without motion.
- [ ] Copy verbatim, no em dashes.

## States
- Cards idle / one active (shape highlighted). Footer default / hover / focus.
