"use client";

import * as React from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { RichText } from "@/components/lab/rich-text";
import { CuriousNote } from "@/components/lab/git/curious-note";
import { SortOrder } from "@/components/lab/assessment/sort-order";
import { LabProse } from "./lab-layout";
import { fourierLab } from "@/data/fourier-lab";

const data = fourierLab.slides.formula;
// Parts that live inside the exponent highlight the e-token when opened.
const INSIDE_EXPONENT = new Set(["test", "k", "n", "N"]);

/** P8: the DFT formula, tap by tap. Each piece expands to the meaning you built
 *  by hand in P6 and P7. Mirrors the git commit-object decomposition pattern. */
export function FormulaBreakdown() {
  const reduced = useReducedMotion();
  const [open, setOpen] = React.useState<string | null>(data.parts[0].id);

  const isTokenLit = (part?: string) => {
    if (!part || !open) return false;
    if (part === open) return true;
    if (part === "test" && INSIDE_EXPONENT.has(open)) return true;
    return false;
  };

  return (
    <div className="lesson-stagger space-y-6">
      <LabProse>
        <p className="text-lg leading-relaxed text-foreground">
          <RichText text={data.lead} />
        </p>
      </LabProse>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-start lg:gap-8">
          <div className="min-w-0">
            {/* The formula as tappable tokens */}
            <div className="flex flex-wrap items-baseline justify-center gap-x-1 gap-y-2 py-3 text-center font-mono text-xl text-foreground sm:text-2xl lg:text-3xl">
          {data.line.map((tok, i) => {
            const part = "part" in tok ? tok.part : undefined;
            const sup = "sup" in tok ? tok.sup : false;
            return part ? (
              <button
                key={i}
                type="button"
                onClick={() => setOpen(part)}
                aria-pressed={open === part}
                className={cn(
                  "rounded-md px-1.5 py-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  sup ? "self-start text-sm sm:text-base" : "",
                  isTokenLit(part) ? "bg-primary/15 text-link" : "hover:bg-muted",
                )}
              >
                {tok.t}
              </button>
            ) : (
              <span key={i} className="whitespace-pre text-muted-foreground">
                {tok.t}
              </span>
            );
          })}
        </div>
            <p className="text-center text-xs text-muted-foreground">{data.caption}</p>
          </div>

          {/* Tappable parts list */}
          <ul className="min-w-0 space-y-2">
          {data.parts.map((part) => {
            const isOpen = open === part.id;
            return (
              <li key={part.id}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : part.id)}
                  aria-expanded={isOpen}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isOpen ? "border-primary/50 bg-primary/5" : "border-border bg-background hover:bg-muted",
                  )}
                >
                  <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-xs font-semibold text-link">{part.term}</span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <m.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: reduced ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden px-3 text-sm leading-relaxed text-muted-foreground"
                    >
                      <span className="block py-2">{part.text}</span>
                    </m.p>
                  ) : null}
                </AnimatePresence>
              </li>
            );
          })}
          </ul>
        </div>
      </div>

      <SortOrder
        label={data.challengeLead}
        prompt={data.challengePrompt}
        items={data.blocks.map((b) => ({ id: b.id, label: b.text }))}
        correctOrder={["b1", "b2", "b3", "b4", "b5"]}
        successText="That is the method in plain language: for frequency k, multiply each sample by the test wave, add the products, and get X[k]."
        objective="Order the steps of the transform."
      />

      <div className="rounded-2xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-5">
        <p className="text-sm leading-relaxed text-foreground">
          <RichText text={data.insight} />
        </p>
      </div>

      <CuriousNote title={data.curious.title} body={data.curious.body} />
    </div>
  );
}
