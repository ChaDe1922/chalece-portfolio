"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { WhatChanged } from "@/components/lab/vibe-coding/what-changed";
import { TryItCta } from "@/components/lab/vibe-coding/try-it-cta";
import { vibeCodingLab } from "@/data/vibe-coding-lab";

const data = vibeCodingLab.builds.game.artifact;
const DURATION = data.duration;

const rand = (min: number, max: number) => Math.round(min + Math.random() * (max - min));
const CENTER = { x: 50, y: 50 };

/** Slide 2 (game): a real, simple clicker game. Tap the target to score before
 *  the timer runs out. Pure DOM + React, no dependencies. */
export function ClickerGame() {
  const reduced = useReducedMotion();

  const [running, setRunning] = React.useState(false);
  const [over, setOver] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [best, setBest] = React.useState(0);
  const [timeLeft, setTimeLeft] = React.useState<number>(DURATION);
  const [pos, setPos] = React.useState(CENTER);

  const containerRef = React.useRef<HTMLDivElement>(null);

  const start = () => {
    setScore(0);
    setTimeLeft(DURATION);
    setOver(false);
    setPos(CENTER);
    setRunning(true);
  };

  const reset = () => {
    setRunning(false);
    setOver(false);
    setScore(0);
    setTimeLeft(DURATION);
    setPos(CENTER);
  };

  const tap = () => {
    if (!running) return;
    setScore((s) => {
      const n = s + 1;
      setBest((b) => Math.max(b, n));
      return n;
    });
    if (!reduced) setPos({ x: rand(12, 88), y: rand(16, 84) });
  };

  // Count the round down while it is running.
  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setRunning(false);
          setOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  // Stop a round if the slide scrolls offscreen or the tab is hidden.
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) setRunning(false);
      },
      { threshold: 0 },
    );
    io.observe(el);
    const onVisibility = () => {
      if (document.visibilityState !== "visible") setRunning(false);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div ref={containerRef} className="lesson-stagger space-y-4">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{data.intro}</p>
        <p className="text-sm text-muted-foreground">{data.patternLead}</p>
        <ul className="space-y-1">
          {data.pattern.map((line) => (
            <li key={line} className="flex items-start gap-2 text-sm leading-relaxed text-foreground">
              <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-link" />
              {line}
            </li>
          ))}
        </ul>
      </div>

      <section aria-label="Clicker game" className="rounded-2xl border border-border bg-card p-4 sm:p-6">
        <h3 className="font-heading text-lg font-semibold text-foreground">{data.gameTitle}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{data.gameSub}</p>

        {/* Stats */}
        <div className="mt-4 flex flex-wrap gap-2.5">
          <div className="rounded-lg border border-border bg-background px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{data.scoreLabel}</p>
            <p className="font-heading text-xl font-bold tabular-nums text-foreground">{score}</p>
          </div>
          <div className="rounded-lg border border-border bg-background px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{data.timeLabel}</p>
            <p className="font-heading text-xl font-bold tabular-nums text-foreground">{timeLeft}s</p>
          </div>
          <div className="rounded-lg border border-border bg-background px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{data.bestLabel}</p>
            <p className="font-heading text-xl font-bold tabular-nums text-foreground">{best}</p>
          </div>
        </div>

        {/* Play area */}
        <div className="relative mt-4 h-56 overflow-hidden rounded-xl border border-border bg-[color-mix(in_oklch,var(--link)_4%,var(--background))]">
          {running ? (
            <button
              type="button"
              onClick={tap}
              aria-label={data.target}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              className={cn(
                "absolute grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                !reduced && "transition-all duration-150 hover:scale-105",
              )}
            >
              {data.target}
            </button>
          ) : (
            <div className="absolute inset-0 grid place-items-center p-4 text-center">
              {over ? (
                <div aria-live="polite">
                  <p className="font-heading text-sm font-semibold text-foreground">{data.overLead}</p>
                  <p className="mt-1 font-heading text-3xl font-bold text-primary">
                    {data.scoreLabel}: {score}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{data.gameSub}</p>
              )}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="mt-4 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={start}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Play aria-hidden="true" className="size-4 fill-current" />
            {over ? data.again : data.start}
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <RotateCcw aria-hidden="true" className="size-4" />
            {data.reset}
          </button>
        </div>
      </section>

      <p className="text-sm text-muted-foreground">{data.tip}</p>

      <WhatChanged check={data.check} />
      <TryItCta />
    </div>
  );
}
