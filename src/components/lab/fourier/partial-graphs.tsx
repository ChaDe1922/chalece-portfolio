"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/** Computed waveform + spectrum drawn from a harmonic-amplitude array. The bars
 *  and the wave morph smoothly toward the target amps (Chrome Music Lab feel),
 *  then the loop idles. Canvases are decorative (aria-hidden); the meaning is in
 *  the readout the parent renders. Reduced motion snaps to the final frame. */

export type GraphView = "wave" | "bars" | "both";

/** Harmonic color: violet (fundamental) to coral (top), on brand. */
export function harmonicColor(i: number, count: number): string {
  const a = [0x6d, 0x5a, 0xe6];
  const b = [0xff, 0x6b, 0x5e];
  const t = count > 1 ? i / (count - 1) : 0;
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

function sizeCanvas(canvas: HTMLCanvasElement): { ctx: CanvasRenderingContext2D; w: number; h: number } | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const dpr = Math.min(2, (typeof window !== "undefined" && window.devicePixelRatio) || 1);
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  return { ctx, w, h };
}

function gridColor(canvas: HTMLCanvasElement): string {
  return getComputedStyle(canvas).getPropertyValue("--border").trim() || "#e3dfd8";
}
function primaryColor(canvas: HTMLCanvasElement): string {
  return getComputedStyle(canvas).getPropertyValue("--primary").trim() || "#6d5ae6";
}

function drawWave(canvas: HTMLCanvasElement, amps: number[], layered = false, highlight: number | null = null) {
  const sized = sizeCanvas(canvas);
  if (!sized) return;
  const { ctx, w, h } = sized;
  const cy = h / 2;
  ctx.strokeStyle = gridColor(canvas);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, cy);
  ctx.lineTo(w, cy);
  ctx.stroke();

  let norm = 0;
  for (const a of amps) norm += Math.abs(a);
  norm = Math.max(1, norm);
  const cycles = 2;
  const hasHi = highlight != null && highlight >= 0 && highlight < amps.length && Math.abs(amps[highlight]) > 0.001;

  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  // Sample well above one point per pixel so fast high harmonics stay smooth.
  const steps = Math.max(2, Math.ceil(w * 4));

  // One harmonic's pure sine, drawn at a given style.
  const harmonicPath = (i: number) => {
    ctx.beginPath();
    for (let k = 0; k <= steps; k++) {
      const px = (k / steps) * w;
      const ph = (px / w) * cycles * 2 * Math.PI;
      const Y = cy - ((amps[i] * Math.sin((i + 1) * ph)) / norm) * (h * 0.42);
      if (k === 0) ctx.moveTo(px, Y);
      else ctx.lineTo(px, Y);
    }
    ctx.stroke();
  };

  // Layered: each harmonic as a faint colored sine, so the sum visibly stacks out.
  if (layered) {
    for (let i = 0; i < amps.length; i++) {
      if (Math.abs(amps[i]) <= 0.02 || i === highlight) continue;
      ctx.strokeStyle = harmonicColor(i, amps.length);
      ctx.globalAlpha = 0.28;
      ctx.lineWidth = 1.5;
      harmonicPath(i);
    }
    ctx.globalAlpha = 1;
  }

  // The summed waveform. Dimmed when a single harmonic is being highlighted.
  ctx.strokeStyle = primaryColor(canvas);
  ctx.lineWidth = hasHi ? 2 : 3;
  ctx.globalAlpha = hasHi ? 0.4 : 1;
  ctx.beginPath();
  for (let k = 0; k <= steps; k++) {
    const px = (k / steps) * w;
    const ph = (px / w) * cycles * 2 * Math.PI;
    let y = 0;
    for (let i = 0; i < amps.length; i++) y += amps[i] * Math.sin((i + 1) * ph);
    const Y = cy - (y / norm) * (h * 0.42);
    if (k === 0) ctx.moveTo(px, Y);
    else ctx.lineTo(px, Y);
  }
  ctx.stroke();

  // The highlighted harmonic, bold and on top, so its contribution stands out.
  if (hasHi) {
    ctx.strokeStyle = harmonicColor(highlight, amps.length);
    ctx.globalAlpha = 1;
    ctx.lineWidth = 3;
    harmonicPath(highlight);
  }
  ctx.globalAlpha = 1;
}

function drawBars(canvas: HTMLCanvasElement, amps: number[], highlight: number | null = null) {
  const sized = sizeCanvas(canvas);
  if (!sized) return;
  const { ctx, w, h } = sized;
  const n = amps.length;
  const gap = Math.max(4, w * 0.012);
  const bw = (w - gap * (n + 1)) / n;
  let max = 0;
  for (const a of amps) max = Math.max(max, Math.abs(a));
  const denom = Math.max(max, 1);
  const baseY = h - 4;
  for (let i = 0; i < n; i++) {
    const x = gap + i * (bw + gap);
    const bh = Math.max(2, (Math.abs(amps[i]) / denom) * (h - 12));
    ctx.fillStyle = harmonicColor(i, n);
    ctx.globalAlpha = highlight == null || highlight === i ? 1 : 0.32;
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") ctx.roundRect(x, baseY - bh, bw, bh, 3);
    else ctx.rect(x, baseY - bh, bw, bh);
    ctx.fill();
    if (highlight === i) {
      ctx.globalAlpha = 1;
      ctx.lineWidth = 2;
      ctx.strokeStyle = harmonicColor(i, n);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
}

export function PartialGraphs({
  amps,
  view = "both",
  waveLabel = "Waveform",
  barsLabel = "Spectrum",
  layered = false,
  highlight = null,
  className,
}: {
  amps: readonly number[];
  view?: GraphView;
  waveLabel?: string;
  barsLabel?: string;
  /** Draw each harmonic as a faint colored sine behind the bold sum. */
  layered?: boolean;
  /** Emphasize one harmonic (its bold sine + its bar), dimming the rest. */
  highlight?: number | null;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const waveRef = React.useRef<HTMLCanvasElement>(null);
  const barsRef = React.useRef<HTMLCanvasElement>(null);
  const dispRef = React.useRef<number[]>(amps.map((a) => a));
  const targetRef = React.useRef<number[]>(amps.map((a) => a));
  const rafRef = React.useRef(0);

  const paint = React.useCallback(
    (vals: number[]) => {
      if (waveRef.current && view !== "bars") drawWave(waveRef.current, vals, layered, highlight);
      if (barsRef.current && view !== "wave") drawBars(barsRef.current, vals, highlight);
    },
    [view, layered, highlight],
  );

  React.useEffect(() => {
    // Update the target and sync the displayed-array length inside the effect.
    targetRef.current = amps.map((a) => a);
    if (dispRef.current.length !== amps.length) dispRef.current = amps.map((a) => a);

    const tick = () => {
      const disp = dispRef.current;
      const target = targetRef.current;
      let moving = false;
      for (let i = 0; i < disp.length; i++) {
        const d = target[i] - disp[i];
        if (Math.abs(d) > 0.001) {
          disp[i] += d * (reduced ? 1 : 0.22);
          moving = true;
        } else {
          disp[i] = target[i];
        }
      }
      paint(disp);
      if (moving) rafRef.current = window.requestAnimationFrame(tick);
      else rafRef.current = 0;
    };
    // Start (or restart) the loop whenever the target changes.
    rafRef.current = window.requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, [amps, reduced, paint]);

  // Redraw on resize so the graphs stay crisp.
  React.useEffect(() => {
    const onResize = () => paint(dispRef.current);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [paint]);

  return (
    <div className={cn("grid gap-3", view === "both" ? "sm:grid-cols-2" : "", className)}>
      {view !== "bars" ? (
        <figure className="space-y-1">
          <canvas ref={waveRef} aria-hidden="true" className="h-28 w-full rounded-lg border border-border bg-background" />
          <figcaption className="text-center text-xs font-medium text-muted-foreground">{waveLabel}</figcaption>
        </figure>
      ) : null}
      {view !== "wave" ? (
        <figure className="space-y-1">
          <canvas ref={barsRef} aria-hidden="true" className="h-28 w-full rounded-lg border border-border bg-background" />
          <figcaption className="text-center text-xs font-medium text-muted-foreground">{barsLabel}</figcaption>
        </figure>
      ) : null}
    </div>
  );
}
