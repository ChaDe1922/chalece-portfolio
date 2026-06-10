"use client";

import * as React from "react";

/** The kind of thing the learner chose to build on slide 1. Drives the
 *  personalized examples on the Three steps slide (and could feed the AI
 *  panel). */
export type BuildId = "game" | "music" | "school";

type VibeBuildValue = {
  build: BuildId | null;
  setBuild: (id: BuildId) => void;
};

const VibeBuildContext = React.createContext<VibeBuildValue | null>(null);

/** Holds the build choice for the whole lab so it survives slide navigation.
 *  Wrap the deck and the AI panel together. */
export function VibeBuildProvider({ children }: { children: React.ReactNode }) {
  const [build, setBuild] = React.useState<BuildId | null>(null);
  const value = React.useMemo(() => ({ build, setBuild }), [build]);
  return <VibeBuildContext.Provider value={value}>{children}</VibeBuildContext.Provider>;
}

/** Read the build choice from any slide. Returns a no-op default outside a
 *  provider so a slide can still render standalone (mirrors useDeck). */
export function useVibeBuild(): VibeBuildValue {
  const ctx = React.useContext(VibeBuildContext);
  if (ctx) return ctx;
  return { build: null, setBuild: () => {} };
}
