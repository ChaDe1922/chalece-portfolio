import type * as React from "react";

/** One full-viewport slide. `render` returns the slide body (usually an
 *  interactive component). `advanceGate` keeps Next disabled until the body
 *  calls `markComplete(id)` via the deck context. */
export type Slide = {
  id: string; // stable, used in the URL hash
  title?: string;
  /** Optional rich heading rendered in place of `title` (which stays the plain
   *  string used for dot/slide aria labels). */
  titleNode?: React.ReactNode;
  render: () => React.ReactNode;
  advanceGate?: boolean;
  /** Content-wrapper layout mode. Undefined renders exactly like today (narrow
   *  max-w-3xl, vertically centered) so shipped decks are unchanged. `lab` is a
   *  wider, top-aligned container for interactive screens; `challenge` is
   *  reading-width but top-aligned; `orientation` matches the default cover look. */
  layout?: "orientation" | "lab" | "challenge";
};

/** Exposed to slide bodies through `useDeck()` so a gated slide can signal it
 *  is done (e.g. a correct match) and read its own completion state. */
export type DeckContextValue = {
  markComplete: (id: string) => void;
  isComplete: (id: string) => boolean;
  /** Advance to the next slide (used by an in-slide CTA like a Begin button). */
  next: () => void;
};
