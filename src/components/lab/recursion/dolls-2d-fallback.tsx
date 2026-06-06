"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const TOTAL = 5;
const DOLL_COLORS = ["#d8412f", "#e8924a", "#6d5ae6", "#3aa6a0", "#16a766"];

function Doll({ size, color, glow }: { size: number; color: string; glow?: "base" | "recursive" }) {
  return (
    <svg
      width={size}
      height={size * 1.5}
      viewBox="0 0 60 90"
      aria-hidden="true"
      className={cn(
        glow === "base" && "drop-shadow-[0_0_10px_rgba(22,167,102,0.85)]",
        glow === "recursive" && "drop-shadow-[0_0_9px_rgba(232,146,74,0.8)]",
      )}
    >
      <ellipse cx="30" cy="60" rx="24" ry="28" fill={color} />
      <ellipse cx="30" cy="66" rx="13" ry="14" fill="#fff" opacity="0.85" />
      <circle cx="30" cy="26" r="18" fill="#f3d9c0" />
      <path d="M12 24 a18 18 0 0 1 36 0 z" fill={color} />
      <circle cx="24" cy="27" r="2" fill="#2a2530" />
      <circle cx="36" cy="27" r="2" fill="#2a2530" />
      <path d="M26 33 q4 3 8 0" stroke="#b5495a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** The original 2D SVG dolls row. Used when WebGL is unavailable or the learner
 *  prefers reduced motion. `highlight` glows the matching dolls so the clickable
 *  terms still work without the 3D scene. */
export function Dolls2DFallback({
  revealed,
  highlight,
}: {
  revealed: number;
  highlight: "base" | "recursive" | null;
}) {
  const atBase = revealed >= TOTAL;
  return (
    <div className="flex min-h-[160px] flex-wrap items-end justify-center gap-3 rounded-xl border border-border bg-card p-5">
      {Array.from({ length: revealed }, (_, i) => {
        const isBase = i === TOTAL - 1;
        const glow =
          highlight === "base" && isBase
            ? "base"
            : highlight === "recursive" && !isBase
              ? "recursive"
              : undefined;
        // Pop the dolls the clicked rule points at (reduced-motion gated in CSS).
        const popping = highlight === "base" ? isBase : highlight === "recursive" ? !isBase : false;
        return (
          <div
            key={`${i}-${highlight ?? ""}`}
            className={cn("flex flex-col items-center gap-1", popping && "doll-pop")}
          >
            <Doll size={64 - i * 9} color={DOLL_COLORS[i]} glow={(isBase && atBase && "base") || glow} />
            {isBase && atBase ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 px-2 py-0.5 text-[0.65rem] font-medium text-emerald-700 dark:border-emerald-800 dark:text-emerald-300">
                <Check aria-hidden="true" className="size-3" /> base case
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
