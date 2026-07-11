"use client";

import * as React from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { Brain, Compass, Hand, Plus, Sparkles, Target, Trophy, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { teaching } from "@/data/teaching";

// One icon per belief, in order. Sparkles is the fallback if the list grows.
const ICONS: LucideIcon[] = [Hand, Brain, Target, Trophy, Compass];

/** The andragogy section as a set of fun, animated dropdowns. Each belief is a
 *  button that springs open to reveal its explanation; multiple can be open. The
 *  page that renders this stays a Server Component, so the interactivity lives
 *  here. Accessible (aria-expanded/controls) and reduced-motion safe. */
export function TeachingBeliefs() {
  const reduced = useReducedMotion();
  const [open, setOpen] = React.useState<Set<number>>(new Set());

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <section aria-labelledby="teaching-heading">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-link">{teaching.eyebrow}</p>
      <h2
        id="teaching-heading"
        className="mt-3 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
      >
        {teaching.heading}
      </h2>
      <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">{teaching.lede}</p>

      <ul className="lesson-stagger mt-8 space-y-3">
        {teaching.principles.map((p, i) => {
          const Icon = ICONS[i] ?? Sparkles;
          const isOpen = open.has(i);
          const panelId = `belief-panel-${i}`;
          const buttonId = `belief-button-${i}`;
          return (
            <li key={p.title}>
              <div
                className={cn(
                  "overflow-hidden rounded-2xl border transition-colors",
                  isOpen
                    ? "border-link/40 bg-[color-mix(in_oklch,var(--link)_7%,var(--card))]"
                    : "border-border bg-card hover:border-link/30 hover:bg-muted/40",
                )}
              >
                <button
                  type="button"
                  id={buttonId}
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex w-full items-center gap-4 px-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset sm:px-5"
                >
                  {/* Icon chip: fills and pops on open. */}
                  <m.span
                    aria-hidden="true"
                    animate={
                      reduced
                        ? {}
                        : { scale: isOpen ? [1, 1.18, 1] : 1 }
                    }
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    className={cn(
                      "grid size-10 shrink-0 place-items-center rounded-xl transition-colors",
                      isOpen ? "bg-primary text-primary-foreground" : "bg-primary/10 text-link",
                    )}
                  >
                    <Icon className="size-5" />
                  </m.span>

                  <span className="flex-1 font-heading text-base font-semibold text-foreground">
                    {p.title}
                  </span>

                  {/* Plus that rotates 45 degrees into an x when open. */}
                  <m.span
                    aria-hidden="true"
                    animate={reduced ? {} : { rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className={cn(
                      "grid size-7 shrink-0 place-items-center rounded-full border",
                      isOpen ? "border-link/40 text-link" : "border-border text-muted-foreground",
                    )}
                  >
                    <Plus className="size-4" />
                  </m.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <m.div
                      key="panel"
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reduced ? 0 : 0.32, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-4 pl-[4.5rem] text-sm leading-relaxed text-muted-foreground sm:px-5 sm:pb-5 sm:pl-[4.75rem]">
                        {p.body}
                      </p>
                    </m.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
