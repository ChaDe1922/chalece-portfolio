"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { RichText } from "@/components/lab/rich-text";
import { LabProse, LabRail } from "./lab-layout";
import { fourierLab } from "@/data/fourier-lab";

const data = fourierLab.slides.phase;

const N = 64;
const BIN = 2; // visible cycles across the canvas

function readVar(canvas: HTMLCanvasElement, name: string, fallback: string) {
  return getComputedStyle(canvas).getPropertyValue(name).trim() || fallback;
}

/** A tiny wave thumbnail so learners can sort by shape. More cycles = higher
 *  frequency; a phase offset only shifts where the wave starts. */
function MiniWave({ cycles, phaseDeg }: { cycles: number; phaseDeg: number }) {
  const w = 56;
  const h = 22;
  const mid = h / 2;
  const amp = h * 0.34;
  const steps = 40;
  const phi = (phaseDeg * Math.PI) / 180;
  let d = "";
  for (let k = 0; k <= steps; k++) {
    const p = k / steps;
    const x = p * w;
    const y = mid - Math.cos(p * cycles * 2 * Math.PI + phi) * amp;
    d += k === 0 ? `M${x.toFixed(1)} ${y.toFixed(1)}` : ` L${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return (
    <svg viewBox={`0 0 ${w} ${h}`} aria-hidden="true" className="h-5 w-14 shrink-0 text-link">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Screen 18: phase can hide a match. The signal shares the test wave's frequency
 *  but slides in time as the phase changes. The single cosine test's match total
 *  shrinks as the signal shifts, even though the frequency never changes. The
 *  inline bucket-sort micro sorts shifted waves into same-frequency versus
 *  different-frequency. Canvas is decorative; the aria-live total carries it. */
export function PhaseSlide() {
  const [deg, setDeg] = React.useState(0);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const phi = (deg * Math.PI) / 180;

  // Single cosine test correlation with the phase-shifted signal: shrinks with phase.
  const matchTotal = React.useMemo(() => {
    let c = 0;
    for (let n = 0; n < N; n++) {
      const sig = Math.cos((2 * Math.PI * BIN * n) / N + phi);
      c += sig * Math.cos((2 * Math.PI * BIN * n) / N);
    }
    return c / (N / 2);
  }, [phi]);

  const draw = React.useCallback(() => {
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
    const cy = h / 2;
    const ampY = h * 0.36;
    const steps = Math.max(2, Math.ceil(w * 4));

    ctx.strokeStyle = grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.stroke();

    // Fixed cosine test wave (faint).
    ctx.strokeStyle = grid;
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    for (let k = 0; k <= steps; k++) {
      const p = k / steps;
      const y = cy - Math.cos(p * BIN * 2 * Math.PI) * ampY;
      if (k === 0) ctx.moveTo(p * w, y);
      else ctx.lineTo(p * w, y);
    }
    ctx.stroke();

    // The signal, shifted by phase (solid).
    ctx.strokeStyle = primary;
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let k = 0; k <= steps; k++) {
      const p = k / steps;
      const y = cy - Math.cos(p * BIN * 2 * Math.PI + phi) * ampY;
      if (k === 0) ctx.moveTo(p * w, y);
      else ctx.lineTo(p * w, y);
    }
    ctx.stroke();
  }, [phi]);

  React.useEffect(() => {
    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, [draw]);

  return (
    <div className="lesson-stagger space-y-6">
      <LabProse>
        <p className="text-lg leading-relaxed text-foreground">
          <RichText text={data.lead} />
        </p>
        <p className="text-base leading-relaxed text-foreground">
          <RichText text={data.body} />
        </p>
        <p className="text-base leading-relaxed text-muted-foreground">{data.instruction}</p>
      </LabProse>

      <LabRail
        main={
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
            <canvas ref={canvasRef} aria-hidden="true" className="h-52 lg:h-64 w-full rounded-lg border border-border bg-background" />
        <p className="mt-1 text-center text-xs text-muted-foreground">The signal (solid) shifting against the fixed cosine test (faint)</p>
        <div className="mt-2 grid grid-cols-1 gap-1 text-xs text-muted-foreground sm:grid-cols-2">
          <span className="rounded-md bg-muted/60 px-2 py-1 text-center">Same spacing means the same frequency.</span>
          <span className="rounded-md bg-muted/60 px-2 py-1 text-center">A different starting point means a different phase.</span>
        </div>

        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">Match total (single test)</span>
            <span className="font-mono text-xs text-link">{matchTotal.toFixed(2)}</span>
          </div>
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
            <div aria-hidden="true" className="absolute inset-y-0 left-1/2 w-px bg-border" />
            <div
              className={cn("absolute inset-y-0 rounded-full transition-all duration-150", matchTotal >= 0 ? "bg-primary" : "bg-destructive")}
              style={
                matchTotal >= 0
                  ? { left: "50%", width: `${Math.min(50, Math.abs(matchTotal) * 50)}%` }
                  : { right: "50%", width: `${Math.min(50, Math.abs(matchTotal) * 50)}%` }
              }
            />
          </div>
        </div>

        <p aria-live="polite" className="mt-3 text-sm font-medium text-foreground">
          {`Phase ${deg} degrees. Match total ${matchTotal.toFixed(2)}. The frequency never changed, yet a single test can fade as the signal slides.`}
        </p>

        <label className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
          <span className="w-28 font-medium">{data.changePhaseLabel}</span>
          <input
            type="range"
            min={0}
            max={360}
            step={1}
            value={deg}
            onChange={(e) => setDeg(Number(e.target.value))}
            className="flex-1 accent-[var(--primary)]"
            aria-label="Phase shift in degrees"
          />
          <span className="w-12 text-right font-mono text-xs text-foreground">{deg}°</span>
        </label>
          </div>
        }
        aside={
          <>
            {/* Micro-challenge: Same or new frequency? Inline bucket sort. */}
            <BucketSort />

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

/** Inline bucket-sort: click an item, then click a bucket; lock it on a correct
 *  placement. Built inline (no external imports) per the screen spec. */
function BucketSort() {
  const [active, setActive] = React.useState<string | null>(null);
  const [placed, setPlaced] = React.useState<Record<string, string>>({});
  const [msg, setMsg] = React.useState("");

  const allDone = data.items.every((it) => placed[it.id]);

  const placeIn = (bucketId: string) => {
    if (!active) {
      setMsg("Pick an item first, then choose a bucket.");
      return;
    }
    const item = data.items.find((it) => it.id === active);
    if (!item) return;
    if (item.bucket === bucketId) {
      setPlaced((p) => ({ ...p, [item.id]: bucketId }));
      setActive(null);
      setMsg(`Correct. "${item.label}" goes in this bucket.`);
    } else {
      setMsg(`Not that bucket. Look at what changed in "${item.label}" before sorting it.`);
    }
  };

  const remaining = data.items.filter((it) => !placed[it.id]);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <p className="text-sm font-semibold text-foreground">{data.challengeLead}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{data.challengePrompt}</p>

      {/* Items to sort. */}
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Waves to sort">
        {remaining.length > 0 ? (
          remaining.map((it) => (
            <button
              key={it.id}
              type="button"
              onClick={() => setActive(it.id)}
              aria-pressed={active === it.id}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active === it.id ? "border-primary bg-primary/10 text-link" : "border-border bg-background text-link hover:bg-muted",
              )}
            >
              <MiniWave cycles={it.cycles} phaseDeg={it.phaseDeg} />
              <span>{it.label}</span>
            </button>
          ))
        ) : (
          <p className="text-sm font-medium text-foreground">Every wave is sorted.</p>
        )}
      </div>

      {/* Buckets. */}
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {data.buckets.map((b) => {
          const contents = data.items.filter((it) => placed[it.id] === b.id);
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => placeIn(b.id)}
              className="rounded-xl border border-dashed border-border bg-background p-3 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="block text-sm font-semibold text-foreground">{b.label}</span>
              <span className="mt-2 flex flex-wrap gap-1.5">
                {contents.length > 0 ? (
                  contents.map((it) => (
                    <span key={it.id} className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-link">
                      {it.label}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">Tap to drop the selected wave here</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="mt-2 min-h-5 text-sm font-medium text-foreground">
        {allDone ? "All sorted. Same frequency with a shift is still the same frequency, just a different phase." : msg}
      </p>
    </div>
  );
}
