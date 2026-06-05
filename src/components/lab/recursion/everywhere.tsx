"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { MagneticButton } from "@/components/magnetic-button";
import { site } from "@/data/site";
import { recursionLab } from "@/data/recursion-lab";

const data = recursionLab.slides.close;

/** A small nested-square mark that animates the same shrink-and-return shape. */
function NestedMark({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className="size-12" aria-hidden="true">
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

/** Slide 6: recursion is everywhere, plus a quiet attribution. */
export function Everywhere() {
  const [active, setActive] = React.useState<string | null>(null);

  return (
    <div className="space-y-6">
      <p className="text-lg leading-relaxed text-muted-foreground">{data.instruction}</p>

      <div className="grid gap-4 sm:grid-cols-3">
        {data.cards.map((c) => {
          const on = active === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setActive(on ? null : c.id)}
              aria-pressed={on}
              className={cn(
                "flex flex-col items-start gap-3 rounded-2xl border p-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                on ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40",
              )}
            >
              <NestedMark active={on} />
              <span className="font-heading text-base font-semibold text-foreground">{c.label}</span>
              <span className="text-sm text-muted-foreground">{c.hint}</span>
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="text-base text-foreground">{data.footer}</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <MagneticButton href="/">Back to the portfolio</MagneticButton>
          <MagneticButton href={site.links.linkedin} variant="outline" external>
            LinkedIn
          </MagneticButton>
        </div>
      </div>
    </div>
  );
}
