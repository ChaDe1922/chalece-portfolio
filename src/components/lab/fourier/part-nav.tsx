import * as React from "react";
import { cn } from "@/lib/utils";
import { fourierLab } from "@/data/fourier-lab";

/** Lightweight signposting for the four-part arc: a per-part eyebrow label and a
 *  compact roadmap. Both read the part list from the lesson data so the names stay
 *  in one place. */

const parts = fourierLab.parts;

export function PartLabel({ current }: { current: number }) {
  const part = parts.find((p) => p.n === current);
  if (!part) return null;
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-link">
        Part {part.n} of {parts.length} · {part.name}
      </p>
      {part.bridge ? <p className="text-sm leading-relaxed text-muted-foreground">{part.bridge}</p> : null}
    </div>
  );
}

/** The four-part arc as a left-to-right build-chain, current step highlighted. */
export function Roadmap({ current }: { current: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-y-1 text-sm" aria-label="Lesson roadmap">
      {parts.map((p, i) => {
        const state = p.n === current ? "current" : p.n < current ? "done" : "upcoming";
        return (
          <React.Fragment key={p.n}>
            {i > 0 ? (
              <span aria-hidden="true" className="px-1 text-muted-foreground/50">
                {"→"}
              </span>
            ) : null}
            <li
              aria-current={state === "current" ? "step" : undefined}
              className={cn(
                "rounded-full px-3 py-1",
                state === "current" && "bg-primary/10 font-semibold text-link",
                state === "done" && "text-muted-foreground",
                state === "upcoming" && "text-muted-foreground/70",
              )}
            >
              {p.n}. {p.name}
            </li>
          </React.Fragment>
        );
      })}
    </ol>
  );
}
