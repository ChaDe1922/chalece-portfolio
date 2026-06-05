"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { Play, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { recursionLab } from "@/data/recursion-lab";

const data = recursionLab.slides.noBaseCase;
const MAX_FRAMES = 11; // a tall, clearly-overflowing stack before the crash

/** Slide 6: teach RecursionError before the assessment tests it. Run the
 *  base-case-less function, watch the stack pile up with nothing returning,
 *  then Python pulls the brake. Reframed as protection, with the one-line fix. */
export function NoBaseCase() {
  const reduced = useReducedMotion();
  const [count, setCount] = React.useState(0);
  const [phase, setPhase] = React.useState<"idle" | "running" | "crashed">("idle");
  const timer = React.useRef<ReturnType<typeof setInterval> | null>(null);

  React.useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  function run() {
    if (reduced) {
      setCount(MAX_FRAMES);
      setPhase("crashed");
      return;
    }
    setPhase("running");
    setCount(0);
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      setCount((c) => {
        if (c >= MAX_FRAMES) {
          if (timer.current) clearInterval(timer.current);
          setPhase("crashed");
          return c;
        }
        return c + 1;
      });
    }, 130);
  }

  return (
    <div className="lesson-stagger space-y-5">
      <p className="text-lg leading-relaxed text-foreground">{data.intro}</p>

      {/* The broken function */}
      <div className="rounded-xl border border-border bg-card p-4 font-mono text-sm [font-feature-settings:'liga'_0,'calt'_0]">
        <pre className="whitespace-pre-wrap text-foreground">{data.broken}</pre>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{data.brokenNote}</p>

      {/* Teach the outcome first, then let them run it to witness it. */}
      <div className="flex items-start gap-3 rounded-xl border border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/40">
        <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <p className="text-sm leading-relaxed text-foreground">{data.reframe}</p>
      </div>

      {phase === "idle" ? (
        <button
          type="button"
          onClick={run}
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Play aria-hidden="true" className="size-4" /> {data.run}
        </button>
      ) : null}

      {/* Growing stack */}
      {phase !== "idle" ? (
        <div className="max-h-64 overflow-hidden rounded-xl border border-border bg-[#0d1016] p-3">
          <ol className="flex flex-col gap-1">
            {Array.from({ length: count }, (_, i) => (
              <li
                key={i}
                style={{ marginLeft: `${i * 12}px` }}
                className={cn(
                  "rounded border border-slate-700 bg-slate-800/60 px-2 py-1 font-mono text-xs text-slate-200",
                  reduced ? "" : "transition-all",
                )}
              >
                {data.running(3 - i)} waiting
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {/* The crash + reframe + fix */}
      {phase === "crashed" ? (
        <div className="space-y-4" aria-live="polite">
          <pre className="overflow-x-auto whitespace-pre rounded-xl border border-destructive/40 bg-[#0d1016] p-4 font-mono text-xs leading-relaxed text-red-300">
            {data.traceback}
          </pre>
          <p className="text-base leading-relaxed text-foreground">{data.fixIntro}</p>
          <div className="rounded-xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-4 font-mono text-sm [font-feature-settings:'liga'_0,'calt'_0]">
            <pre className="whitespace-pre-wrap text-foreground">{data.fixed}</pre>
          </div>
        </div>
      ) : null}
    </div>
  );
}
