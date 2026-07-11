import * as React from "react";
import { cn } from "@/lib/utils";

/** Shared layout primitives for the wide "lab" slides. They keep the two-column
 *  grids consistent and, critically, guard against horizontal overflow: every grid
 *  track is minmax(0,...) and every cell is min-w-0, so wide canvases and tables
 *  never force the page wider than the viewport. All classes are static so Tailwind
 *  v4 extracts them. Two-column engages at lg; below that everything stacks in DOM
 *  order (put the visualization first so mobile leads with it). */

/** Caps intro/summary prose to a readable measure (~70ch) inside the wide container. */
export function LabProse({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("max-w-2xl space-y-4", className)}>{children}</div>;
}

/** Pattern A: a full main column (the interactive visualization card) beside a
 *  narrower rail (the formative check + takeaway). Stacks below lg. */
export function LabRail({ main, aside, className }: { main: React.ReactNode; aside: React.ReactNode; className?: string }) {
  return (
    <div className={cn("grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:items-start lg:gap-8", className)}>
      <div className="min-w-0">{main}</div>
      <div className="min-w-0 space-y-5">{aside}</div>
    </div>
  );
}

/** Pattern B: an inside-card split (large visualization | its controls or readout).
 *  Stacks below lg. */
export function LabSplit({ start, end, className }: { start: React.ReactNode; end: React.ReactNode; className?: string }) {
  return (
    <div className={cn("grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-start lg:gap-8", className)}>
      <div className="min-w-0">{start}</div>
      <div className="min-w-0">{end}</div>
    </div>
  );
}

/** A simple two-up row for secondary cards (check | takeaway) beneath a full-width
 *  lab card, so they use the wide container instead of stacking. Stacks below sm. */
export function LabDuo({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("grid gap-4 sm:grid-cols-2 sm:items-start", className)}>{children}</div>;
}
