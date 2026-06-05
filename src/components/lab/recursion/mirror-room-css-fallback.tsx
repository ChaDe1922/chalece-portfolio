"use client";

import * as React from "react";

const MAX = 7;
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

/** The original CSS-scale mirror illusion. Used as the visual stage when WebGL
 *  is unavailable or the learner prefers reduced motion. Pixel-identical to the
 *  pre-3D version; reduced motion removes the zoom transition. */
export function MirrorRoomCssFallback({ depth, reduced }: { depth: number; reduced: boolean }) {
  const zoom = 1 / Math.pow(SCALE, depth);
  return (
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
  );
}
