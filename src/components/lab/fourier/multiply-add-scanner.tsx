"use client";

import * as React from "react";
import { Play, RotateCcw, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "motion/react";
import { RichText } from "@/components/lab/rich-text";
import { LabProse, LabSplit, LabDuo } from "./lab-layout";
import { fourierLab } from "@/data/fourier-lab";

const data = fourierLab.slides.multiplyAdd;

const SOUND = data.soundSignal;
const TEST = data.testSignal;
const N = data.n;

function readVar(canvas: HTMLCanvasElement, name: string, fallback: string) {
  return getComputedStyle(canvas).getPropertyValue(name).trim() || fallback;
}

/** Sign label for a product, matched against the data.signChoices order. */
function signLabel(product: number): string {
  if (Math.abs(product) < 0.02) return data.signChoices[2]; // near zero
  return product > 0 ? data.signChoices[0] : data.signChoices[1]; // positive / negative
}

/** Draw a row of sample dots with the active index highlighted. Decorative. */
function drawDots(canvas: HTMLCanvasElement | null, values: readonly number[], active: number, color: string) {
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

  const grid = readVar(canvas, "--border", "#e3dfd8");
  const coral = "#e0564a";
  const cy = h / 2;
  const ampY = (h / 2) * 0.72;
  const padX = 16;
  const plotW = w - padX * 2;

  ctx.strokeStyle = grid;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padX, cy);
  ctx.lineTo(w - padX, cy);
  ctx.stroke();

  // Smooth connecting curve through the ACTUAL sample dots, so any signal (cosine or
  // sine) reads smoothly and every dot sits on the line.
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.4;
  ctx.lineWidth = 2;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  const pts = values.map((v, i) => ({
    x: padX + (values.length === 1 ? plotW / 2 : (i / (values.length - 1)) * plotW),
    y: cy - v * ampY,
  }));
  ctx.beginPath();
  if (pts.length > 0) {
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 0; i < pts.length - 1; i++) {
      const mx = (pts[i].x + pts[i + 1].x) / 2;
      const my = (pts[i].y + pts[i + 1].y) / 2;
      ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
    }
    const last = pts[pts.length - 1];
    ctx.lineTo(last.x, last.y);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;

  for (let i = 0; i < values.length; i++) {
    const x = padX + (values.length === 1 ? plotW / 2 : (i / (values.length - 1)) * plotW);
    const y = cy - values[i] * ampY;
    const on = i <= active;
    const isActive = i === active;
    ctx.beginPath();
    ctx.fillStyle = isActive ? coral : color;
    ctx.globalAlpha = on ? 1 : 0.25;
    if (isActive) {
      ctx.shadowColor = coral;
      ctx.shadowBlur = 12;
    }
    ctx.arc(x, y, isActive ? 6 : 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }
}

/** Screen 16: the centerpiece. Multiply, then add. Step through sample by sample:
 *  each step lights the matching sound and test dots, shows a multiplication tile,
 *  adds the product to a running total, and fills a positive or negative bucket.
 *  "Predict the product" asks for the sign before the reveal. Canvases are
 *  decorative; the aria-live total carries the meaning. */
export function MultiplyAddScanner() {
  const reduced = useReducedMotion();
  // step = -1 means nothing computed yet; step in 0..N-1 means that index is shown.
  const [step, setStep] = React.useState(-1);
  const [auto, setAuto] = React.useState(false);
  const [guess, setGuess] = React.useState<string | null>(null);
  const [guessResult, setGuessResult] = React.useState<string>("");

  const soundRef = React.useRef<HTMLCanvasElement>(null);
  const testRef = React.useRef<HTMLCanvasElement>(null);
  const timerRef = React.useRef<number | null>(null);

  // Products and the running totals up to and including `step`.
  const products = React.useMemo(() => SOUND.map((s, i) => s * TEST[i]), []);
  const totals = React.useMemo(() => {
    const out: number[] = [];
    let run = 0;
    for (let i = 0; i < N; i++) {
      run += products[i];
      out.push(run);
    }
    return out;
  }, [products]);

  const shownIndex = Math.max(0, step);
  const runningTotal = step < 0 ? 0 : totals[step];
  const posBucket = step < 0 ? 0 : products.slice(0, step + 1).filter((p) => p > 0).reduce((a, b) => a + b, 0);
  const negBucket = step < 0 ? 0 : products.slice(0, step + 1).filter((p) => p < 0).reduce((a, b) => a + Math.abs(b), 0);
  const maxBucket = Math.max(0.001, posBucket, negBucket);

  const paint = React.useCallback(() => {
    const primary = soundRef.current ? readVar(soundRef.current, "--primary", "#6d5ae6") : "#6d5ae6";
    drawDots(soundRef.current, SOUND, step, primary);
    drawDots(testRef.current, TEST, step, "#c2820a");
  }, [step]);

  React.useEffect(() => {
    paint();
    window.addEventListener("resize", paint);
    return () => window.removeEventListener("resize", paint);
  }, [paint]);

  const next = React.useCallback(() => {
    setStep((s) => {
      const ns = Math.min(N - 1, s + 1);
      return ns;
    });
    setGuess(null);
    setGuessResult("");
  }, []);

  const reset = () => {
    setStep(-1);
    setAuto(false);
    setGuess(null);
    setGuessResult("");
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startAuto = () => {
    if (reduced) {
      // Reduced motion: skip the animation and jump straight to the final total.
      setStep(N - 1);
      return;
    }
    setAuto(true);
  };

  // Auto-play steps on an interval while `auto` is set (reduced motion never sets it).
  React.useEffect(() => {
    if (!auto) return;
    timerRef.current = window.setInterval(() => {
      setStep((s) => {
        if (s >= N - 1) {
          if (timerRef.current) window.clearInterval(timerRef.current);
          timerRef.current = null;
          setAuto(false);
          return s;
        }
        return s + 1;
      });
    }, 900);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [auto]);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const checkGuess = (choice: string) => {
    // Predict the product for the NEXT step (the one about to be revealed).
    const idx = Math.min(N - 1, step + 1);
    const actual = signLabel(products[idx]);
    setGuess(choice);
    if (choice === actual) {
      setGuessResult(`Right. Sample ${idx}: ${SOUND[idx].toFixed(2)} times ${TEST[idx].toFixed(2)} is ${actual}.`);
    } else {
      setGuessResult(`Look at the two signs again. Sample ${idx}: ${SOUND[idx].toFixed(2)} times ${TEST[idx].toFixed(2)} is ${actual}.`);
    }
  };

  const started = step >= 0;
  const done = step >= N - 1;
  const canPredict = step < N - 1;

  return (
    <div className="lesson-stagger space-y-6">
      <LabProse>
        <p className="text-lg leading-relaxed text-foreground">
          <RichText text={data.lead} />
        </p>
        <ul className="space-y-1.5">
          {data.steps.map((s, i) => (
            <li key={i} className="flex gap-2 text-base leading-relaxed text-muted-foreground">
              <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
              <span><RichText text={s} /></span>
            </li>
          ))}
        </ul>
        <p className="text-base leading-relaxed text-muted-foreground">{data.instruction}</p>
      </LabProse>

      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={next}
            disabled={done || auto}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
          >
            <ChevronRight aria-hidden="true" className="size-4" /> {data.nextLabel}
          </button>
          <button
            type="button"
            onClick={startAuto}
            disabled={done || auto}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-semibold text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
          >
            <Play aria-hidden="true" className="size-4 fill-current" /> {data.autoLabel}
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-semibold text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <RotateCcw aria-hidden="true" className="size-4" /> {data.resetLabel}
          </button>
        </div>

        <LabSplit
          start={
            <>
              <figure className="space-y-1">
                <canvas ref={soundRef} aria-hidden="true" className="h-28 w-full rounded-lg border border-border bg-background sm:h-32 lg:h-36" />
          <figcaption className="flex justify-between text-xs font-medium text-muted-foreground">
            <span>Sound samples</span>
            <span>Time, left to right</span>
          </figcaption>
        </figure>
        <figure className="mt-3 space-y-1">
          <canvas ref={testRef} aria-hidden="true" className="h-28 w-full rounded-lg border border-border bg-background sm:h-32 lg:h-36" />
          <figcaption className="flex justify-between text-xs font-medium text-muted-foreground">
            <span>Test-wave samples</span>
            <span>Time, left to right</span>
          </figcaption>
        </figure>

        {/* Multiplication tile for the current step. */}
        <div className="mt-4 rounded-lg border border-border bg-muted/40 px-4 py-3 text-center">
          {started ? (
            <p className="font-mono text-base text-foreground">
              {`n=${shownIndex}:  ${SOUND[shownIndex].toFixed(2)} × ${TEST[shownIndex].toFixed(2)} = `}
              <span className={cn("font-semibold", products[shownIndex] >= 0 ? "text-primary" : "text-destructive")}>
                {products[shownIndex].toFixed(2)}
              </span>
            </p>
          ) : (
            <p className="font-mono text-base text-muted-foreground">Press Next sample to begin.</p>
          )}
              </div>
            </>
          }
          end={
            <>
              {/* Positive and negative buckets. */}
              <div className="mt-4 grid grid-cols-1 gap-3">
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">Positive bucket</span>
              <span className="font-mono text-xs text-link">{posBucket.toFixed(2)}</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary transition-all duration-200" style={{ width: `${(posBucket / maxBucket) * 100}%` }} />
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">Negative bucket</span>
              <span className="font-mono text-xs text-link">{negBucket.toFixed(2)}</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-destructive transition-all duration-200" style={{ width: `${(negBucket / maxBucket) * 100}%` }} />
            </div>
          </div>
        </div>

              <p aria-live="polite" className="mt-4 text-center text-base font-semibold text-foreground">
                {`Running total: ${runningTotal.toFixed(2)}`}
              </p>
            </>
          }
        />
      </div>

      <LabDuo>
        {/* Micro-challenge: Predict the product. */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <p className="text-sm font-semibold text-foreground">{data.challengeLead}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{data.challengePrompt}</p>
        {canPredict ? (
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={data.challengePrompt}>
            {data.signChoices.map((choice) => (
              <button
                key={choice}
                type="button"
                onClick={() => checkGuess(choice)}
                aria-pressed={guess === choice}
                className={cn(
                  "inline-flex h-10 items-center rounded-lg border px-4 text-sm font-semibold capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  guess === choice ? "border-primary bg-primary/10 text-link" : "border-border bg-background text-link hover:bg-muted",
                )}
              >
                {choice}
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">All samples are in. Reset to predict again.</p>
        )}
        <p aria-live="polite" className="mt-2 min-h-5 text-sm font-medium text-foreground">
          {guessResult}
        </p>
      </div>

        <div className="rounded-2xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-5">
          <p className="text-sm leading-relaxed text-foreground">
            <RichText text={data.insight} />
          </p>
        </div>
      </LabDuo>
    </div>
  );
}
