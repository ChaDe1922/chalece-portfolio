"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { CornerDownLeft, Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  N_RANGE,
  DEFAULT_N,
  factorial,
  callStackCaptions,
  recursionLab,
} from "@/data/recursion-lab";

type Ev = { t: "call" | "ret"; k: number };

function buildEvents(n: number): Ev[] {
  const ev: Ev[] = [];
  for (let k = n; k >= 1; k--) ev.push({ t: "call", k });
  for (let j = 1; j <= n; j++) ev.push({ t: "ret", k: j });
  return ev;
}

const AUTO_MS = 900;
const { dek } = recursionLab.slides.callStack;

/** Slide 4 centerpiece: a steppable factorial call-stack. Ported from the
 *  prototype, restyled to brand tokens and driven by React state. */
export function CallStack() {
  const reduced = useReducedMotion();
  const [n, setN] = React.useState<number>(DEFAULT_N);
  const [step, setStep] = React.useState(0);
  const [auto, setAuto] = React.useState(false);

  const events = React.useMemo(() => buildEvents(n), [n]);
  const done = step >= events.length;

  // Auto play: tick every 900ms, stop at the end.
  React.useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setStep((s) => Math.min(s + 1, events.length)), AUTO_MS);
    return () => clearInterval(id);
  }, [auto, events.length]);

  React.useEffect(() => {
    if (step >= events.length) setAuto(false);
  }, [step, events.length]);

  function pickN(v: number) {
    setAuto(false);
    setN(v);
    setStep(0);
  }
  function onStep() {
    setAuto(false);
    setStep((s) => Math.min(s + 1, events.length));
  }
  function onAuto() {
    if (done) setStep(0);
    setAuto(true);
  }
  function onReset() {
    setAuto(false);
    setStep(0);
  }

  // Derive the visible frames from the events consumed so far.
  const called: number[] = [];
  const returned = new Set<number>();
  for (let i = 0; i < step; i++) {
    const e = events[i];
    if (e.t === "call") called.push(e.k);
    else returned.add(e.k);
  }
  const deepest = called.length ? called[called.length - 1] : null;

  let caption: string;
  if (step === 0) caption = callStackCaptions.ready(n);
  else {
    const ev = events[step - 1];
    caption = ev.t === "call" ? callStackCaptions.call(ev.k) : callStackCaptions.ret(ev.k);
  }

  return (
    <div>
      <p className="mb-5 text-base leading-relaxed text-muted-foreground">{dek}</p>

      {/* Controls */}
      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3">
        <span className="flex items-center gap-1 font-mono text-sm text-muted-foreground">
          factorial(
          <span className="flex items-center gap-1" role="group" aria-label="Choose n">
            {N_RANGE.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => pickN(v)}
                aria-pressed={v === n}
                aria-label={`Set n to ${v}`}
                className={cn(
                  "size-9 rounded-lg border font-mono text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  v === n
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-muted",
                )}
              >
                {v}
              </button>
            ))}
          </span>
          )
        </span>
        <span className="flex-1" />
        <button
          type="button"
          onClick={onStep}
          disabled={done}
          className="inline-flex h-11 items-center gap-1.5 rounded-lg bg-primary px-4 font-heading text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40"
        >
          Step <Play aria-hidden="true" className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={onAuto}
          disabled={auto}
          className="inline-flex h-11 items-center rounded-lg border border-border bg-background px-4 font-heading text-sm font-semibold text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
        >
          Auto
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-border bg-background px-4 font-heading text-sm font-semibold text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <RotateCcw aria-hidden="true" className="size-3.5" /> Reset
        </button>
      </div>

      {/* Stage */}
      <div className="min-h-[230px] rounded-xl border border-border bg-card p-4">
        <ol className="flex flex-col gap-2">
          {called.map((k, i) => {
            const isBase = k === 1;
            const isDone = returned.has(k);
            const isWaiting = !isDone && k !== deepest;
            const value = factorial(k);
            return (
              <li
                key={`${k}-${i}`}
                style={{ marginLeft: `${(n - k) * 20}px` }}
                className={cn(
                  "flex items-center gap-3 rounded-lg border px-3 py-2.5",
                  reduced ? "" : "transition-all duration-200",
                  isBase
                    ? "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40"
                    : isDone
                      ? "border-primary/40 bg-background"
                      : "border-border bg-background",
                  isWaiting && "opacity-60",
                )}
              >
                <span
                  className={cn(
                    "font-mono text-sm font-semibold",
                    isBase ? "text-emerald-700 dark:text-emerald-300" : "text-link",
                  )}
                >
                  factorial({k})
                </span>
                {isBase ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 px-2 py-0.5 font-mono text-xs text-emerald-700 dark:border-emerald-800 dark:text-emerald-300">
                    <CornerDownLeft aria-hidden="true" className="size-3" /> base case
                  </span>
                ) : (
                  <span className="hidden font-mono text-xs text-muted-foreground sm:inline">
                    {k} x factorial({k - 1})
                  </span>
                )}
                {isDone ? (
                  <span
                    className={cn(
                      "ml-auto rounded-md px-2 py-0.5 font-mono text-sm font-bold",
                      isBase
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                        : "bg-primary/10 text-primary",
                    )}
                  >
                    = {value}
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Caption + result */}
      <p className="mt-4 min-h-[42px] text-sm leading-relaxed text-foreground" aria-live="polite">
        {caption}
      </p>
      <p className="mt-2 min-h-[28px] font-mono text-lg font-bold text-emerald-700 dark:text-emerald-300">
        {done ? callStackCaptions.result(n) : ""}
      </p>
    </div>
  );
}
