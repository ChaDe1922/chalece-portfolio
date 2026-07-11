"use client";

import * as React from "react";
import { Play } from "lucide-react";
import { useReducedMotion } from "motion/react";

/** An illustrative pure-tone scope: a computed sine for the current pitch that
 *  draws left to right (over time), dropping a dot on each peak and counting them
 *  so the learner can see what frequency means. Higher pitch shows more peaks. The
 *  count is for illustration, not a literal hertz readout. Reduced motion draws the
 *  full wave and all peaks at once. */

// Continuous cycle count so the wave stretches/compresses smoothly with the slider
// (no integer snapping).
function cyclesFor(freq: number): number {
  return Math.max(1, Math.min(10, freq / 110));
}
// Crest positions across x in 0..1 for a (possibly fractional) cycle count.
function crests(cycles: number): number[] {
  const out: number[] = [];
  for (let n = 0; ; n++) {
    const x = (0.25 + n) / cycles;
    if (x > 1) break;
    out.push(x);
  }
  return out;
}

export function PureToneScope({
  freq,
  active,
  replayLabel,
  peaksLabel,
  hint,
}: {
  freq: number;
  active: boolean;
  replayLabel: string;
  peaksLabel: string;
  hint: string;
}) {
  const reduced = useReducedMotion();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const rafRef = React.useRef(0);
  const animatingRef = React.useRef(false);
  const freqRef = React.useRef(freq);

  const [runToken, setRunToken] = React.useState(0);
  const [peaks, setPeaks] = React.useState(() => crests(cyclesFor(freq)).length);
  const prevActive = React.useRef(active);

  const paint = React.useCallback((f: number, progress: number) => {
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
    const styles = getComputedStyle(canvas);
    const border = styles.getPropertyValue("--border").trim() || "#e3dfd8";
    const primary = styles.getPropertyValue("--primary").trim() || "#6d5ae6";
    const cy = h / 2;
    const amp = h * 0.36;
    const cycles = cyclesFor(f);

    ctx.strokeStyle = border;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.stroke();

    // The sine, drawn up to the sweep progress.
    ctx.strokeStyle = primary;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    const steps = Math.max(2, Math.ceil(w));
    let lastX = 0;
    let lastY = cy;
    for (let k = 0; k <= steps; k++) {
      const x = k / steps;
      if (x > progress) break;
      const px = x * w;
      const py = cy - Math.sin(2 * Math.PI * cycles * x) * amp;
      if (k === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
      lastX = px;
      lastY = py;
    }
    ctx.stroke();

    // A dot on each revealed peak.
    const revealed = crests(cycles).filter((xc) => xc <= progress);
    ctx.fillStyle = primary;
    for (const xc of revealed) {
      const px = xc * w;
      const py = cy - Math.sin(2 * Math.PI * cycles * xc) * amp;
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // The leading tip while sweeping.
    if (progress < 1) {
      ctx.beginPath();
      ctx.arc(lastX, lastY, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    return revealed.length;
  }, []);

  const runSweep = React.useCallback(() => {
    if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    const f = freqRef.current;
    if (reduced) {
      paint(f, 1);
      setPeaks(crests(cyclesFor(f)).length);
      return;
    }
    animatingRef.current = true;
    setPeaks(0);
    const dur = 1300;
    let start = 0;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / dur);
      const shown = paint(f, p) ?? 0;
      setPeaks(shown);
      if (p < 1) {
        rafRef.current = window.requestAnimationFrame(tick);
      } else {
        rafRef.current = 0;
        animatingRef.current = false;
      }
    };
    rafRef.current = window.requestAnimationFrame(tick);
  }, [paint, reduced]);

  // Run a sweep on mount and on each replay/play trigger.
  React.useEffect(() => {
    runSweep();
    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, [runToken, runSweep]);

  // Starting playback triggers one sweep.
  React.useEffect(() => {
    if (active && !prevActive.current) setRunToken((t) => t + 1);
    prevActive.current = active;
  }, [active]);

  // While not animating, keep the static wave in sync with the pitch.
  React.useEffect(() => {
    freqRef.current = freq;
    if (!animatingRef.current) {
      paint(freq, 1);
      setPeaks(crests(cyclesFor(freq)).length);
    }
    const onResize = () => {
      if (!animatingRef.current) paint(freqRef.current, 1);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [freq, paint]);

  return (
    <figure className="space-y-1">
      <canvas ref={canvasRef} aria-hidden="true" className="h-40 w-full rounded-lg border border-border bg-background lg:h-48" />
      <div className="flex items-center justify-between gap-2">
        <figcaption className="text-xs font-medium text-muted-foreground">
          {peaksLabel}: <span className="font-semibold text-link">{peaks}</span>
        </figcaption>
        <button
          type="button"
          onClick={() => setRunToken((t) => t + 1)}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 text-xs font-medium text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Play aria-hidden="true" className="size-3 fill-current" /> {replayLabel}
        </button>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">{hint}</p>
    </figure>
  );
}
