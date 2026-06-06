"use client";

import * as React from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { recursionLab } from "@/data/recursion-lab";
import { WHY_SCENES } from "@/components/lab/recursion/why-scenes";

const data = recursionLab.slides.why;

/** Slide 3: define recursion plainly, say why it matters, and show where it
 *  shows up. Tap an application to reveal an illustration of the same nested
 *  shape on the stage below. */
export function WhyRecursion() {
  const reduced = useReducedMotion();
  const [active, setActive] = React.useState<string | null>(null);
  const activeApp = data.apps.find((a) => a.id === active) ?? null;

  return (
    <div className="lesson-stagger space-y-6">
      {/* Definition front and center */}
      <p className="rounded-xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-5 text-lg font-medium leading-relaxed text-foreground">
        {data.definition}
      </p>

      <p className="text-base leading-relaxed text-muted-foreground">{data.why}</p>

      <p className="text-base font-medium text-foreground">{data.instruction}</p>

      <div className="lesson-stagger grid gap-3 sm:grid-cols-2">
        {data.apps.map((app) => {
          const on = active === app.id;
          const Icon = WHY_SCENES[app.id];
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
              <span
                className={cn(
                  "grid size-12 shrink-0 place-items-center rounded-xl border transition-colors",
                  on ? "border-primary/40 bg-primary/10" : "border-border bg-background",
                )}
              >
                {Icon ? <Icon className="size-9" /> : null}
              </span>
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

      {/* Reveal stage: the active scenario's illustration of the same nested
          shape, swapping with a soft crossfade. */}
      <div
        aria-live="polite"
        className="flex min-h-56 flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card p-6 text-center"
      >
        <AnimatePresence mode="wait" initial={false}>
          {activeApp ? (
            <m.div
              key={activeApp.id}
              initial={reduced ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
              transition={{ duration: reduced ? 0.12 : 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-3"
            >
              {(() => {
                const Icon = WHY_SCENES[activeApp.id];
                return Icon ? <Icon className="size-32" /> : null;
              })()}
              <span className="font-heading text-base font-semibold text-foreground">
                {activeApp.label}
              </span>
              <span className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                {activeApp.hint}
              </span>
            </m.div>
          ) : (
            <m.p
              key="empty"
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-xs text-sm text-muted-foreground"
            >
              Tap a scenario above to see the pattern.
            </m.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
