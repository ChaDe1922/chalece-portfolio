"use client";

import * as React from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "motion/react";
import { RichText } from "@/components/lab/rich-text";
import { LabProse, LabRail } from "./lab-layout";
import { fourierLab } from "@/data/fourier-lab";

const data = fourierLab.slides.samples;

/** The 8-sample cosine example drives both the table and the dropping dots. */
const EXAMPLE = data.exampleSignal;
const EXAMPLE_N = data.exampleN;

function readVar(canvas: HTMLCanvasElement, name: string, fallback: string) {
  return getComputedStyle(canvas).getPropertyValue(name).trim() || fallback;
}

/** Sample value at fractional position p (0..1) for the smooth cosine: one cycle. */
function curveAt(p: number): number {
  return Math.cos(2 * Math.PI * p);
}

/** Screen 13: a computer sees sound as dots. A smooth wave on a labeled graph,
 *  a sample-count control, an animated scan that drops glowing dots onto the
 *  curve and fills a table, then a "Catch the sample" micro-challenge. The canvas
 *  is decorative; the table and aria-live readouts carry the meaning. */
export function SampleTheWave() {
  const reduced = useReducedMotion();
  const [count, setCount] = React.useState<number>(data.defaultCount);
  const [revealed, setRevealed] = React.useState(0); // how many dots have dropped
  const [animating, setAnimating] = React.useState(false);
  const [scan, setScan] = React.useState(1); // scan-line fraction 0..1
  // Micro-challenge target row, chosen by a state index (SSR-safe, no Math.random in render).
  const [targetRow, setTargetRow] = React.useState<number | null>(null);
  const [picked, setPicked] = React.useState<number | null>(null);
  const [challengeMsg, setChallengeMsg] = React.useState("");

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const rafRef = React.useRef(0);

  // Sample times/values for the current count, along a single smooth cycle.
  const samples = React.useMemo(
    () => Array.from({ length: count }, (_, n) => ({ n, t: n / count, value: curveAt(n / count) })),
    [count],
  );

  const draw = React.useCallback(
    (scanFrac: number, dotsShown: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const dpr = Math.min(2, (typeof window !== "undefined" && window.devicePixelRatio) || 1);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const primary = readVar(canvas, "--primary", "#6d5ae6");
      const grid = readVar(canvas, "--border", "#e3dfd8");
      const ink = readVar(canvas, "--foreground", "#1c1b22");
      const padL = 30;
      const padR = 12;
      const padY = 14;
      const plotW = w - padL - padR;
      const cy = h / 2;
      const ampY = (h / 2 - padY) * 0.92;

      // Axes: x = time, y = value.
      ctx.strokeStyle = grid;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padL, cy);
      ctx.lineTo(w - padR, cy);
      ctx.moveTo(padL, padY);
      ctx.lineTo(padL, h - padY);
      ctx.stroke();

      // Smooth wave (oversampled so it never looks blocky).
      const steps = Math.max(2, Math.ceil(plotW * 4));
      ctx.strokeStyle = primary;
      ctx.globalAlpha = 0.85;
      ctx.lineWidth = 2.5;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();
      for (let k = 0; k <= steps; k++) {
        const p = k / steps;
        const x = padL + p * plotW;
        const y = cy - curveAt(p) * ampY;
        if (k === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Scan line.
      if (dotsShown < samples.length || scanFrac < 1) {
        const sx = padL + scanFrac * plotW;
        ctx.strokeStyle = ink;
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(sx, padY);
        ctx.lineTo(sx, h - padY);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Glowing dots that have dropped so far.
      for (let i = 0; i < Math.min(dotsShown, samples.length); i++) {
        const s = samples[i];
        const x = padL + s.t * plotW;
        const y = cy - s.value * ampY;
        const isTarget = targetRow != null && s.n === targetRow;
        ctx.beginPath();
        ctx.fillStyle = isTarget ? "#e0564a" : primary;
        ctx.shadowColor = isTarget ? "#e0564a" : primary;
        ctx.shadowBlur = 10;
        ctx.arc(x, y, isTarget ? 6 : 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    },
    [samples, targetRow],
  );

  React.useEffect(() => {
    draw(scan, revealed);
    const onResize = () => draw(scan, revealed);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [draw, scan, revealed]);

  // Reset reveal when the sample count changes so the table and dots stay in sync.
  const chooseCount = (cnt: number) => {
    if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    setCount(cnt);
    setRevealed(0);
    setScan(1);
    setAnimating(false);
    setTargetRow(null);
    setPicked(null);
    setChallengeMsg("");
  };

  const animate = React.useCallback(() => {
    setRevealed(0);
    setScan(0);
    setTargetRow(null);
    setPicked(null);
    setChallengeMsg("");
    if (reduced) {
      // No motion: drop every dot and finish at once.
      setScan(1);
      setRevealed(samples.length);
      return;
    }
    setAnimating(true);
    const start = performance.now();
    const durationMs = 2200;
    const loop = (now: number) => {
      const frac = Math.min(1, (now - start) / durationMs);
      setScan(frac);
      const dropped = Math.floor(frac * samples.length + 0.0001);
      setRevealed(dropped);
      if (frac < 1) {
        rafRef.current = window.requestAnimationFrame(loop);
      } else {
        setRevealed(samples.length);
        setAnimating(false);
      }
    };
    rafRef.current = window.requestAnimationFrame(loop);
  }, [reduced, samples.length]);

  React.useEffect(() => {
    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Catch-the-sample challenge: highlight a dot picked by a rotating index, ask
  // for its row. The challenge only renders once 8 samples are fully placed.
  const startChallenge = () => {
    // Rotate the target deterministically from prior state, not Math.random.
    const seed = targetRow == null ? 3 : targetRow;
    const idx = (seed + 3) % EXAMPLE_N;
    setTargetRow(idx);
    setPicked(null);
    setChallengeMsg("");
  };

  const pickRow = (n: number) => {
    if (targetRow == null) return;
    setPicked(n);
    if (n === targetRow) {
      setChallengeMsg(`Correct. The glowing dot is sample ${n}, where x[${n}] = ${EXAMPLE[n].toFixed(2)}.`);
    } else {
      setChallengeMsg(`Not that row. Look at where the highlighted dot sits, then try again.`);
    }
  };

  const showTable = count === EXAMPLE_N;
  const challengeReady = showTable && revealed >= EXAMPLE_N;

  return (
    <div className="lesson-stagger space-y-6">
      <LabProse>
        <p className="text-lg leading-relaxed text-foreground">
          <RichText text={data.lead} />
        </p>
        <p className="text-base leading-relaxed text-muted-foreground">
          <RichText text={data.body} />
        </p>
        <p className="text-base leading-relaxed text-muted-foreground">{data.instruction}</p>
      </LabProse>

      <LabRail
        main={
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
            <div className="mb-3 flex flex-wrap items-center gap-2" role="group" aria-label={data.countLabel}>
          <span className="mr-1 text-sm font-medium text-foreground">{data.countLabel}</span>
          {data.counts.map((cnt) => (
            <button
              key={cnt}
              type="button"
              onClick={() => chooseCount(cnt)}
              aria-pressed={count === cnt}
              className={cn(
                "inline-flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                count === cnt ? "border-primary bg-primary/10 text-link" : "border-border bg-background text-link hover:bg-muted",
              )}
            >
              {cnt}
            </button>
          ))}
          <button
            type="button"
            onClick={animate}
            disabled={animating}
            className="ml-auto inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
          >
            <Play aria-hidden="true" className="size-4 fill-current" /> {data.animateLabel}
          </button>
        </div>

        <figure className="space-y-1">
          <canvas ref={canvasRef} aria-hidden="true" className="h-56 w-full rounded-lg border border-border bg-background sm:h-64 lg:h-72" />
          <figcaption className="flex justify-between text-xs text-muted-foreground">
            <span>Time, left to right</span>
            <span>Value, up and down</span>
          </figcaption>
        </figure>

        <p aria-live="polite" className="mt-2 text-sm font-medium text-foreground">
          {`${count} samples taken across one cycle. ${revealed} of ${count} dots placed so far.`}
        </p>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          <RichText text={data.vocab} />
        </p>

        {showTable ? (
          <div className="mt-3 overflow-hidden rounded-lg border border-border">
            <table className="w-full border-collapse text-sm">
              <caption className="sr-only">{data.exampleNote}</caption>
              <thead>
                <tr className="bg-muted/50 text-left text-foreground">
                  <th scope="col" className="px-3 py-2 font-semibold">n</th>
                  <th scope="col" className="px-3 py-2 font-semibold">time</th>
                  <th scope="col" className="px-3 py-2 font-semibold">x[n]</th>
                </tr>
              </thead>
              <tbody>
                {EXAMPLE.map((v, n) => {
                  const shown = n < revealed;
                  const isTarget = targetRow === n;
                  const isPicked = picked === n;
                  const clickable = challengeReady && targetRow != null;
                  const time = (n / EXAMPLE_N).toFixed(2);
                  return (
                    <tr
                      key={n}
                      onClick={clickable ? () => pickRow(n) : undefined}
                      className={cn(
                        "border-t border-border transition-colors",
                        clickable && "cursor-pointer hover:bg-muted/60",
                        isTarget && picked === targetRow && "bg-primary/10",
                        isPicked && n !== targetRow && "bg-destructive/10",
                      )}
                    >
                      <td className="px-3 py-1.5 font-mono text-xs text-foreground">{n}</td>
                      <td className="px-3 py-1.5 font-mono text-xs text-muted-foreground">{time}</td>
                      <td className="px-3 py-1.5 font-mono text-xs text-foreground">{shown ? v.toFixed(2) : "..."}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-3 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            Choose 8 samples to see the full table and the catch-the-sample challenge.
          </p>
        )}
          </div>
        }
        aside={
          <>
            {/* Micro-challenge: Catch the sample. */}
            {challengeReady ? (
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
          <p className="text-sm font-semibold text-foreground">{data.challengeLead}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{data.challengePrompt}</p>
          <button
            type="button"
            onClick={startChallenge}
            className="mt-3 inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-semibold text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {targetRow == null ? "Highlight a sample" : "Highlight another"}
          </button>
          {targetRow != null ? (
            <p className="mt-2 text-sm text-foreground">
              {`A dot is glowing in the graph. Click the table row that matches it.`}
            </p>
          ) : null}
          <p aria-live="polite" className="mt-2 min-h-5 text-sm font-medium text-foreground">
            {challengeMsg}
          </p>
        </div>
      ) : null}

            <div className="rounded-2xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-5">
              <p className="text-sm leading-relaxed text-foreground">
                <RichText text={data.insight} />
              </p>
            </div>
          </>
        }
      />
    </div>
  );
}
