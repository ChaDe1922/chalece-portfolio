"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { Play, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { recursionLab } from "@/data/recursion-lab";
import { RichText } from "@/components/lab/rich-text";
import { NoBaseCasePlates } from "@/components/lab/recursion/no-base-case-plates";
import { useWebGLSupport } from "@/components/lab/recursion/mirror-tunnel/use-webgl-support";

const data = recursionLab.slides.noBaseCase;
const MAX_FRAMES = 11; // a tall, clearly-overflowing stack before the crash

/** Slide 6: teach RecursionError before the assessment tests it. Run the
 *  base-case-less function, watch the calls pile up with nothing returning,
 *  then Python pulls the brake. Reframed as protection, with the one-line fix. */
export function NoBaseCase() {
  const reduced = useReducedMotion();
  const webgl = useWebGLSupport();
  const [count, setCount] = React.useState(0);
  const [phase, setPhase] = React.useState<"idle" | "running" | "crashed">("idle");
  const timer = React.useRef<ReturnType<typeof setInterval> | null>(null);

  React.useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  // Pause/unmount the canvas when the stage is hidden or scrolled offscreen.
  const stageRef = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(true);
  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    const onVis = () => setActive(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const use3D = webgl === true && !reduced;
  // What the broken function prints as the calls pile up: 3, 2, 1, 0, -1, ...
  // (it prints n, then recurses with no base case, so it never stops at 0).
  const printed = Array.from({ length: count }, (_, i) => 3 - i);

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
    }, 120);
  }

  return (
    <div className="lesson-stagger space-y-5">
      <p className="text-base leading-relaxed text-muted-foreground">
        <RichText text={data.recap} />
      </p>
      <p className="text-lg leading-relaxed text-foreground">
        <RichText text={data.intro} />
      </p>

      {/* The broken function */}
      <div className="rounded-xl border border-border bg-card p-4 font-mono text-sm [font-feature-settings:'liga'_0,'calt'_0]">
        <pre className="whitespace-pre-wrap text-foreground">{data.broken}</pre>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        <RichText text={data.brokenNote} />
      </p>

      {/* The run command and the pile-up, side by side. */}
      <div className="grid gap-4 md:grid-cols-2 md:items-start">
        {/* Left: instruction, button, expectation beneath. */}
        <div className="space-y-2">
          <p className="text-base font-medium text-foreground">{data.runLead}</p>
          <button
            type="button"
            onClick={run}
            disabled={phase === "running"}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
          >
            <Play aria-hidden="true" className="size-4" /> {phase === "crashed" ? "Run again" : data.run}
          </button>
          <p className="text-sm leading-relaxed text-muted-foreground">
            <RichText text={data.expectNote} />
          </p>
        </div>

        {/* Right: physics plates when able, else the DOM growing stack. */}
        <div ref={stageRef}>
          {phase === "idle" ? (
            <div className="h-[260px] w-full rounded-xl border border-dashed border-border bg-card/50" />
          ) : use3D && active ? (
            <NoBaseCasePlates count={count} phase={phase} />
          ) : (
            <div className="max-h-[260px] overflow-hidden rounded-xl border border-border bg-[#0d1016] p-3">
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
          )}
        </div>
      </div>

      {/* What the program prints: numbers marching past zero, never reaching Go!. */}
      {phase !== "idle" ? (
        <div className="rounded-xl border border-border bg-muted p-4 dark:bg-[#0d1016]">
          <p className="mb-2 font-mono text-xs uppercase tracking-wide text-muted-foreground dark:text-slate-400">
            Output
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-sm text-emerald-700 dark:text-emerald-300">
            {printed.map((v, i) => (
              <span key={i}>{v}</span>
            ))}
            {phase === "crashed" ? <span className="text-muted-foreground dark:text-slate-500">...</span> : null}
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            <RichText text="It prints `n`, then calls itself again, so the numbers march straight past `0` and never reach `Go!`." />
          </p>
        </div>
      ) : null}

      {/* The crash + reframe + fix */}
      {phase === "crashed" ? (
        <div className="space-y-4" aria-live="polite">
          <pre className="overflow-x-auto whitespace-pre rounded-xl border border-destructive/40 bg-[#0d1016] p-4 font-mono text-xs leading-relaxed text-red-300">
            {data.traceback}
          </pre>
          <div className="flex items-start gap-3 rounded-xl border border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/40">
            <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <p className="text-sm leading-relaxed text-foreground">
              <RichText text={data.reframe} />
            </p>
          </div>
          <p className="text-base leading-relaxed text-foreground">
            <RichText text={data.fixIntro} />
          </p>
          <div className="rounded-xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-4 font-mono text-sm leading-6 [font-feature-settings:'liga'_0,'calt'_0]">
            {data.fixedLines.map((line, i) => (
              <div
                key={i}
                className={cn(
                  "whitespace-pre rounded px-2 text-foreground",
                  "base" in line && "border-l-2 border-primary bg-primary/15",
                )}
              >
                {line.text}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
