"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { RichText } from "@/components/lab/rich-text";
import { CheckCard, SuccessCover } from "@/components/lab/assessment/card";

/** Match by drawing lines: tap a term on the left, then its definition on the right,
 *  and a connector line is drawn between them. Correct pairs lock green; a wrong pair
 *  gives a hint. Keyboard-operable (real buttons); solved when every term is matched.
 *  Definitions are shown in a deterministic scrambled order (SSR-safe). */

type Pair = { id: string; left: string; right: string };

type Props = {
  label: string;
  prompt: string;
  pairs: readonly Pair[];
  successText: string;
  objective?: string;
  onSolved?: (solved: boolean) => void;
};

type Line = { id: string; x1: number; y1: number; x2: number; y2: number };

export function MatchLines({ label, prompt, pairs, successText, objective, onSolved }: Props) {
  const rights = React.useMemo(() => [...pairs].reverse(), [pairs]);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [matched, setMatched] = React.useState<Set<string>>(() => new Set());
  const [status, setStatus] = React.useState("");
  const [lines, setLines] = React.useState<Line[]>([]);

  const wrapRef = React.useRef<HTMLDivElement>(null);
  const leftRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());
  const rightRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());

  const solved = matched.size === pairs.length && pairs.length > 0;

  React.useEffect(() => {
    if (solved) onSolved?.(true);
  }, [solved, onSolved]);

  const measure = React.useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const wr = wrap.getBoundingClientRect();
    const next: Line[] = [];
    for (const id of matched) {
      const l = leftRefs.current.get(id);
      const r = rightRefs.current.get(id);
      if (!l || !r) continue;
      const lr = l.getBoundingClientRect();
      const rr = r.getBoundingClientRect();
      next.push({
        id,
        x1: lr.right - wr.left,
        y1: lr.top + lr.height / 2 - wr.top,
        x2: rr.left - wr.left,
        y2: rr.top + rr.height / 2 - wr.top,
      });
    }
    setLines(next);
  }, [matched]);

  React.useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const clickLeft = (id: string) => {
    if (matched.has(id)) return;
    setSelected((cur) => (cur === id ? null : id));
    setStatus("");
  };

  const clickRight = (rid: string) => {
    if (matched.has(rid)) return;
    if (!selected) {
      setStatus("Pick a term on the left first, then its meaning.");
      return;
    }
    if (selected === rid) {
      setMatched((prev) => new Set(prev).add(rid));
      setSelected(null);
      setStatus("");
    } else {
      setStatus("Not a match. Try a different meaning.");
      setSelected(null);
    }
  };

  if (solved) {
    return (
      <CheckCard label={label} solved>
        <SuccessCover objective={objective} rationale={successText} />
      </CheckCard>
    );
  }

  return (
    <CheckCard label={label} solved={false}>
      <p className="text-base font-medium text-foreground">
        <RichText text={prompt} />
      </p>

      <div ref={wrapRef} className="relative mt-4">
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 h-full w-full">
          {lines.map((ln) => (
            <g key={ln.id}>
              <line x1={ln.x1} y1={ln.y1} x2={ln.x2} y2={ln.y2} stroke="var(--primary)" strokeWidth={2.5} strokeLinecap="round" />
              <circle cx={ln.x1} cy={ln.y1} r={4} fill="var(--primary)" />
              <circle cx={ln.x2} cy={ln.y2} r={4} fill="var(--primary)" />
            </g>
          ))}
        </svg>

        <div className="grid grid-cols-2 gap-x-12 gap-y-2 sm:gap-x-20">
          {/* Terms */}
          <ul className="space-y-2">
            {pairs.map((p) => {
              const done = matched.has(p.id);
              const sel = selected === p.id;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    ref={(el) => {
                      if (el) leftRefs.current.set(p.id, el);
                      else leftRefs.current.delete(p.id);
                    }}
                    onClick={() => clickLeft(p.id)}
                    disabled={done}
                    aria-pressed={sel}
                    className={cn(
                      "w-full rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      done
                        ? "border-emerald-300 bg-emerald-50/50 text-foreground dark:border-emerald-800/70 dark:bg-emerald-950/20"
                        : sel
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border bg-background text-foreground hover:bg-muted",
                    )}
                  >
                    {p.left}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Definitions (scrambled) */}
          <ul className="space-y-2">
            {rights.map((p) => {
              const done = matched.has(p.id);
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    ref={(el) => {
                      if (el) rightRefs.current.set(p.id, el);
                      else rightRefs.current.delete(p.id);
                    }}
                    onClick={() => clickRight(p.id)}
                    disabled={done}
                    className={cn(
                      "w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      done
                        ? "border-emerald-300 bg-emerald-50/50 text-foreground dark:border-emerald-800/70 dark:bg-emerald-950/20"
                        : "border-border bg-background text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {p.right}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <p aria-live="polite" className="mt-3 min-h-5 text-sm text-muted-foreground">
        {status || `${matched.size} of ${pairs.length} matched.`}
      </p>
    </CheckCard>
  );
}
