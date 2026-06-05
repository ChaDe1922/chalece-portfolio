"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { recursionLab } from "@/data/recursion-lab";

const data = recursionLab.slides.why;

/** A small nested-square mark: the same shape inside itself. */
function NestedMark({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className="size-10" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={4 + i * 7}
          y={4 + i * 7}
          width={56 - i * 14}
          height={56 - i * 14}
          rx={3}
          fill="none"
          stroke={active ? "var(--primary)" : "var(--border)"}
          strokeWidth={2}
        />
      ))}
    </svg>
  );
}

/** Slide 3: define recursion plainly, say why it matters, and show where it
 *  shows up. Tap an application to highlight the same nested shape. */
export function WhyRecursion() {
  const [active, setActive] = React.useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Definition front and center */}
      <p className="rounded-xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-5 text-lg font-medium leading-relaxed text-foreground">
        {data.definition}
      </p>

      <p className="text-base leading-relaxed text-muted-foreground">{data.why}</p>

      <p className="text-base font-medium text-foreground">{data.instruction}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        {data.apps.map((app) => {
          const on = active === app.id;
          return (
            <button
              key={app.id}
              type="button"
              onClick={() => setActive(on ? null : app.id)}
              aria-pressed={on}
              className={cn(
                "flex items-center gap-4 rounded-2xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                on ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40",
              )}
            >
              <NestedMark active={on} />
              <span>
                <span className="block font-heading text-base font-semibold text-foreground">
                  {app.label}
                </span>
                <span className="mt-0.5 block text-sm text-muted-foreground">{app.hint}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
