"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { CornerDownLeft, Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { recursionLab } from "@/data/recursion-lab";
import { RichText } from "@/components/lab/recursion/rich-text";
import { CallStackPlates } from "@/components/lab/recursion/call-stack-plates";

const data = recursionLab.slides.callStack;
const N_RANGE = data.nRange;
const AUTO_MS = 900;

type Ev = { t: "call" | "ret"; k: number };

function buildEvents(n: number): Ev[] {
  const ev: Ev[] = [];
  for (let k = n; k >= 0; k--) ev.push({ t: "call", k });
  for (let k = 0; k <= n; k++) ev.push({ t: "ret", k });
  return ev;
}

/** Slide 4: the countdown call stack. Frames push on the way in (printing as
 *  they go), the base case countdown(0) prints Go!, then frames pop in reverse.
 *  Reduced motion applies frame changes instantly. */
export function CallStack() {
  const reduced = useReducedMotion();
  const [n, setN] = React.useState<number>(data.defaultN);
  const [step, setStep] = React.useState(0);
  const [auto, setAuto] = React.useState(false);

  const events = React.useMemo(() => buildEvents(n), [n]);
  const done = step >= events.length;

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
  const onStep = () => {
    setAuto(false);
    setStep((s) => Math.min(s + 1, events.length));
  };
  const onAuto = () => {
    if (done) setStep(0);
    setAuto(true);
  };
  const onReset = () => {
    setAuto(false);
    setStep(0);
  };

  const called: number[] = [];
  const returned = new Set<number>();
  for (let i = 0; i < step; i++) {
    const e = events[i];
    if (e.t === "call") called.push(e.k);
    else returned.add(e.k);
  }
  const activeStack = called.filter((k) => !returned.has(k)); // bottom to top
  const deepest = activeStack.slice(-1)[0] ?? null;
  const output = called.map((k) => (k > 0 ? String(k) : "Go!"));

  let caption: string;
  if (step === 0) caption = data.captions.ready(n);
  else {
    const ev = events[step - 1];
    caption = ev.t === "call" ? data.captions.call(ev.k) : data.captions.ret(ev.k);
  }

  return (
    <div className="lesson-stagger">
      <p className="mb-3 text-base leading-relaxed text-foreground">
        <RichText text={data.framing} />
      </p>
      <p className="mb-4 text-base leading-relaxed text-muted-foreground">
        <RichText text={data.dek} />
      </p>

      {/* What "wait" and "return" mean, for first-timers. */}
      <div className="mb-5 rounded-xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-4">
        <p className="text-sm font-medium text-foreground">{data.glossaryLead}</p>
        <dl className="mt-2 space-y-2">
          {data.glossary.map((g) => (
            <div key={g.term}>
              <dt className="font-heading text-sm font-semibold text-link">{g.term}</dt>
              <dd className="text-sm leading-relaxed text-muted-foreground">
                <RichText text={g.def} />
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Controls */}
      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3">
        <span className="flex items-center gap-1 font-mono text-sm text-muted-foreground">
          countdown(
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

      <div className="grid gap-4 md:grid-cols-[120px_1fr_180px]">
        {/* 3D plates: physical stack metaphor (decorative). */}
        <div className="hidden md:block" aria-hidden="true">
          <CallStackPlates stack={activeStack} />
        </div>

        {/* Stack */}
        <div className="min-h-[230px] rounded-xl border border-border bg-card p-4">
          <ol className="flex flex-col gap-2">
            {called.map((k, i) => {
              const isBase = k === 0;
              const isDone = returned.has(k);
              const isWaiting = !isDone && k !== deepest;
              return (
                <li
                  key={`${k}-${i}`}
                  style={{ marginLeft: `${(n - k) * 18}px` }}
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
                    countdown({k})
                  </span>
                  {isBase ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 px-2 py-0.5 font-mono text-xs text-emerald-700 dark:border-emerald-800 dark:text-emerald-300">
                      <CornerDownLeft aria-hidden="true" className="size-3" /> base case
                    </span>
                  ) : (
                    <span className="hidden font-mono text-xs text-muted-foreground sm:inline">
                      print({k}); countdown({k - 1})
                    </span>
                  )}
                  {isDone ? (
                    <span className="ml-auto rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs font-bold text-primary">
                      returned
                    </span>
                  ) : null}
                </li>
              );
            })}
            {called.length === 0 ? (
              <li className="py-8 text-center text-sm text-muted-foreground">
                Press Step to make the first call.
              </li>
            ) : null}
          </ol>
        </div>

        {/* Output panel */}
        <div className="rounded-xl border border-border bg-muted p-4 dark:bg-[#0d1016]">
          <p className="mb-2 font-mono text-xs uppercase tracking-wide text-muted-foreground dark:text-slate-400">Output</p>
          <div className="flex flex-col gap-1 font-mono text-sm text-emerald-700 dark:text-emerald-300">
            {output.length ? (
              output.map((o, i) => <span key={i}>{o}</span>)
            ) : (
              <span className="text-muted-foreground dark:text-slate-500">(nothing yet)</span>
            )}
          </div>
        </div>
      </div>

      <p className="mt-4 min-h-[42px] text-sm leading-relaxed text-foreground" aria-live="polite">
        <RichText text={done ? data.captions.result : caption} />
      </p>
    </div>
  );
}
