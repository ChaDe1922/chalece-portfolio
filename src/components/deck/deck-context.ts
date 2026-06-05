"use client";

import * as React from "react";
import type { DeckContextValue } from "./types";

const DeckContext = React.createContext<DeckContextValue | null>(null);

export const DeckProvider = DeckContext.Provider;

/** Read deck controls from inside a slide body. Returns no-ops if used outside
 *  a SlideDeck, so a slide component can render standalone in tests. */
export function useDeck(): DeckContextValue {
  const ctx = React.useContext(DeckContext);
  if (ctx) return ctx;
  return { markComplete: () => {}, isComplete: () => false, next: () => {} };
}
