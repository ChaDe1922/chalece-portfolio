"use client";

import * as React from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { ArrowRight, GitCommitHorizontal, Hash, Plus, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { gitLab } from "@/data/git-lab";
import { RichText } from "@/components/lab/rich-text";

const data = gitLab.slides.commitObject;
const CHAIN = ["c1", "c2", "c3", "c4"] as const;

const btnPrimary =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40";
const btnGhost =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40";

/** Slide 3: what is inside a commit. Tap each field, watch the four parts hash
 *  into the commit id, change the message to see the id change completely
 *  (tamper-evidence), then build the chain. */
export function CommitObject() {
  const reduced = useReducedMotion();
  const [open, setOpen] = React.useState<string | null>(data.parts[0].id);
  const [edited, setEdited] = React.useState(false);
  const [shown, setShown] = React.useState(1); // commits revealed in the chain

  const id = edited ? data.idAfterEdit : data.idInitial;

  return (
    <div className="lesson-stagger space-y-5">
      <p className="text-lg leading-relaxed text-foreground">{data.lead}</p>
      <p className="text-base leading-relaxed text-muted-foreground">{data.teach}</p>

      {/* The commit object */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-3 flex items-center gap-2">
          <GitCommitHorizontal aria-hidden="true" className="size-4 text-link" />
          <span className="font-mono text-sm font-semibold text-foreground">commit {id}</span>
        </div>
        <ul className="space-y-2">
          {data.parts.map((part) => {
            const isOpen = open === part.id;
            const isMessage = part.id === "message";
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
                  <span
                    className={cn(
                      "rounded px-2 py-0.5 font-mono text-xs font-semibold",
                      isMessage && edited
                        ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                        : "bg-primary/10 text-link",
                    )}
                  >
                    {part.term}
                  </span>
                  {isMessage && edited ? (
                    <span className="text-xs font-medium text-amber-700 dark:text-amber-300">changed</span>
                  ) : null}
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

        {/* Hashing visualization */}
        <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-link">{data.hashLead}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {data.parts.map((p) => (
            <span
              key={p.id}
              className={cn(
                "rounded-md border px-2 py-1 font-mono text-xs",
                p.id === "message" && edited
                  ? "border-amber-300 bg-amber-50/60 text-amber-700 dark:border-amber-800/70 dark:bg-amber-950/20 dark:text-amber-300"
                  : "border-border bg-background text-muted-foreground",
              )}
            >
              {p.term}
            </span>
          ))}
          <ArrowRight aria-hidden="true" className="size-4 text-muted-foreground" />
          <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 font-mono text-xs font-semibold text-link">
            <Hash aria-hidden="true" className="size-3.5" /> hash()
          </span>
          <ArrowRight aria-hidden="true" className="size-4 text-muted-foreground" />
          <AnimatePresence mode="wait" initial={false}>
            <m.span
              key={id}
              initial={{ opacity: 0, scale: 0.6, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6, y: 4 }}
              transition={{ duration: reduced ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-md border-2 border-primary bg-background px-2.5 py-1 font-mono text-sm font-bold text-foreground"
            >
              {id}
            </m.span>
          </AnimatePresence>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          <RichText text={data.hashNote} />
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={() => setEdited(true)} disabled={edited} className={btnGhost}>
            {data.changeMessageLabel}
          </button>
          {edited ? (
            <button type="button" onClick={() => setEdited(false)} className={btnGhost}>
              <RotateCcw aria-hidden="true" className="size-4" /> {data.resetLabel}
            </button>
          ) : null}
        </div>
        {edited ? (
          <p aria-live="polite" className="mt-3 rounded-lg bg-amber-500/10 px-3 py-2 text-sm leading-relaxed text-foreground">
            {data.tamperNote}
          </p>
        ) : null}
      </div>

      {/* The chain */}
      <p className="text-base leading-relaxed text-muted-foreground">{data.instruction}</p>
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center gap-1.5" aria-live="polite">
          {CHAIN.slice(0, shown).map((cid, i) => (
            <React.Fragment key={cid}>
              {i > 0 ? (
                <span aria-hidden="true" className="font-mono text-sm text-muted-foreground">
                  &larr;
                </span>
              ) : null}
              <m.span
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: reduced ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="grid size-12 place-items-center rounded-full border-2 border-primary bg-background font-mono text-sm font-semibold text-foreground"
              >
                {cid}
              </m.span>
            </React.Fragment>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{data.chainHint}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setShown((s) => Math.min(CHAIN.length, s + 1))}
            disabled={shown >= CHAIN.length}
            className={btnPrimary}
          >
            <Plus aria-hidden="true" className="size-4" /> {data.addLabel}
          </button>
          {shown > 1 ? (
            <button type="button" onClick={() => setShown(1)} className={btnGhost}>
              <RotateCcw aria-hidden="true" className="size-4" /> Reset
            </button>
          ) : null}
        </div>
      </div>

      <div className="rounded-2xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-5">
        <p className="text-sm leading-relaxed text-foreground">
          <RichText text={data.insight} />
        </p>
      </div>
    </div>
  );
}
