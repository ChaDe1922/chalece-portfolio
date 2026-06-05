"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { LogIn, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { recursionLab } from "@/data/recursion-lab";

const data = recursionLab.slides.mirror;
const MAX = data.maxDepth; // 7
const SCALE = 0.62;

/** One frame nests the next at 62% size, centered. The chain is static; we
 *  zoom by scaling the whole chain so the current depth fills the viewport. */
function Frame({ level }: { level: number }) {
  const deepest = level >= MAX;
  // Silver-white at the entrance, cooling to blue as we go inward.
  const hue = 210;
  const light = 92 - level * 7;
  return (
    <div
      className="absolute inset-0 flex items-center justify-center rounded-lg border"
      style={{
        borderColor: `hsl(${hue},30%,${Math.max(40, light - 25)}%)`,
        background: `hsl(${hue},${20 + level * 4}%,${Math.max(30, light)}%)`,
      }}
    >
      {deepest ? (
        <span className="px-2 text-center text-[0.6rem] font-medium text-slate-700">
          too deep to see, but it continues
        </span>
      ) : (
        <div className="absolute" style={{ inset: "19%" }}>
          <Frame level={level + 1} />
        </div>
      )}
    </div>
  );
}

/** Slide 1 hook: step into nested reflections. Self-reference, before the word
 *  recursion. Reduced motion removes the zoom transition. */
export function MirrorRoom() {
  const reduced = useReducedMotion();
  const [depth, setDepth] = React.useState(0);
  const zoom = 1 / Math.pow(SCALE, depth);

  return (
    <div className="space-y-5">
      <p className="text-lg leading-relaxed text-muted-foreground">{data.intro}</p>

      <div className="mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-xl border border-border bg-slate-900">
        <div
          className="relative size-full"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "center",
            transition: reduced ? "none" : "transform 0.55s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <Frame level={0} />
        </div>
      </div>

      <p aria-live="polite" className="text-center text-sm font-medium text-foreground">
        {data.depthNote(depth, MAX)}
      </p>

      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setDepth((d) => Math.min(MAX, d + 1))}
          disabled={depth >= MAX}
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40"
        >
          <LogIn aria-hidden="true" className="size-4" /> {data.stepIn}
        </button>
        <button
          type="button"
          onClick={() => setDepth((d) => Math.max(0, d - 1))}
          disabled={depth === 0}
          className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40"
        >
          <LogOut aria-hidden="true" className="size-4" /> {data.stepOut}
        </button>
      </div>

      <p className={cn("text-sm leading-relaxed text-muted-foreground")}>{data.prompt}</p>
    </div>
  );
}
