"use client";

import type { CSSProperties, ReactNode } from "react";
import { usePathname } from "next/navigation";

import { labs } from "@/data/labs";
import { CHANNELS } from "@/data/mix";
import type { PillarId } from "@/data/pillars";

/*
 * Each lesson wears its craft's colour, the same way a soloed channel lights
 * the homepage. Two-tone diagrams draw with --primary and --coral, so the
 * second colour is a contrasting craft rather than the Night coral twice.
 */
const SECOND: Record<PillarId, PillarId> = {
  "music-tech": "software",
  software: "music-tech",
  curriculum: "software",
};

/** CSS variables that recolour a lesson, or one carousel card, in its craft. */
export function labAccentVars(pillar: PillarId): CSSProperties {
  const main = CHANNELS[pillar].color;
  return {
    "--signal": main,
    "--primary": main,
    "--link": main,
    "--coral": CHANNELS[SECOND[pillar]].color,
  } as CSSProperties;
}

/** Sets the lesson accent from the route. The /lab index keeps the master mix. */
export function LabAccent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const lab = labs.find((l) => !l.external && pathname.startsWith(l.href));

  return (
    <div className="contents" style={lab ? labAccentVars(lab.pillar) : undefined}>
      {children}
    </div>
  );
}
