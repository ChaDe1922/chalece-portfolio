"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { RichText } from "@/components/lab/rich-text";

/** The parts of a waveform, taught interactively. A representative wave is drawn
 *  with labeled axes: Time runs left to right (so the wave has a beginning, a
 *  middle, and an end); up is a push (positive pressure), down is a pull; a bigger
 *  swing is a stronger signal. Hovering, focusing, or tapping a reading lights up
 *  the matching region of the graph, and hovering a region lights up its reading.
 *  This is the teaching that makes the "point to the moment" check below fair. */

type Reading = { id: string; text: string };
type Region = "time" | "up" | "down" | "amp";

const PLAIN: Record<Region, string> = {
  time: "the time axis, left to right",
  up: "the push region above the center",
  down: "the pull region below the center",
  amp: "the size of the swing",
};

/** Envelope-shaped wave: clear beginning and end, biggest swing near the middle. */
function anatomyPressure(x: number): number {
  return Math.sin(x * Math.PI) * Math.sin(x * Math.PI * 2 * 4);
}

function arrowHead(ctx: CanvasRenderingContext2D, x: number, y: number, dir: "up" | "down") {
  const s = 5;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - s, y + (dir === "up" ? s : -s));
  ctx.lineTo(x + s, y + (dir === "up" ? s : -s));
  ctx.closePath();
  ctx.fill();
}

export function WaveAnatomy({ readings, hint }: { readings: readonly Reading[]; hint: string }) {
  const [hovered, setHovered] = React.useState<Region | null>(null);
  const [pinned, setPinned] = React.useState<Region | null>(null);
  const active = hovered ?? pinned;

  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const paint = React.useCallback((hi: Region | null) => {
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
    const primary = styles.getPropertyValue("--primary").trim() || "#6d5ae6";
    const border = styles.getPropertyValue("--border").trim() || "#e3dfd8";
    const cy = h / 2;
    const amp = h * 0.36;

    // Region shading for push (up) / pull (down).
    if (hi === "up" || hi === "down") {
      ctx.fillStyle = primary;
      ctx.globalAlpha = 0.1;
      if (hi === "up") ctx.fillRect(0, 0, w, cy);
      else ctx.fillRect(0, cy, w, h - cy);
      ctx.globalAlpha = 1;
    }

    // Beginning / middle / end guide ticks (faint always, bright on time).
    const marks = [0.12, 0.5, 0.88];
    ctx.strokeStyle = hi === "time" ? primary : border;
    ctx.lineWidth = 1;
    ctx.globalAlpha = hi === "time" ? 0.7 : 1;
    for (const mx of marks) {
      const x = mx * w;
      ctx.beginPath();
      ctx.moveTo(x, h * 0.12);
      ctx.lineTo(x, h * 0.88);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Center baseline (time axis).
    ctx.strokeStyle = hi === "time" ? primary : border;
    ctx.lineWidth = hi === "time" ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.stroke();

    // Left-to-right arrow on the baseline when time is active.
    if (hi === "time") {
      ctx.fillStyle = primary;
      ctx.beginPath();
      ctx.moveTo(w - 2, cy);
      ctx.lineTo(w - 10, cy - 4);
      ctx.lineTo(w - 10, cy + 4);
      ctx.closePath();
      ctx.fill();
    }

    // The waveform.
    ctx.strokeStyle = primary;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    const steps = Math.max(2, Math.ceil(w));
    for (let k = 0; k <= steps; k++) {
      const x = k / steps;
      const px = x * w;
      const py = cy - anatomyPressure(x) * amp;
      if (k === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Amplitude double-arrow (the swing) when amp is active.
    if (hi === "amp") {
      const x = w * 0.5;
      const top = cy - amp * 0.98;
      const bot = cy + amp * 0.98;
      ctx.strokeStyle = primary;
      ctx.fillStyle = primary;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, top + 4);
      ctx.lineTo(x, bot - 4);
      ctx.stroke();
      arrowHead(ctx, x, top, "down");
      arrowHead(ctx, x, bot, "up");
    }
  }, []);

  React.useEffect(() => {
    paint(active);
    const onResize = () => paint(active);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [active, paint]);

  const hotspot = (region: Region, className: string) => (
    <button
      type="button"
      aria-label={`Highlight ${PLAIN[region]}`}
      onMouseEnter={() => setHovered(region)}
      onMouseLeave={() => setHovered(null)}
      onFocus={() => setHovered(region)}
      onBlur={() => setHovered(null)}
      onClick={() => setPinned((p) => (p === region ? null : region))}
      className={cn("absolute focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
    />
  );

  return (
    <div>
      <div className="relative">
        <canvas ref={canvasRef} aria-hidden="true" className="h-44 w-full rounded-lg border border-border bg-background" />

        {/* Pressure axis labels (decorative, do not block the hotspots). */}
        <span className="pointer-events-none absolute left-2 top-1.5 text-xs font-medium text-muted-foreground">Pressure +</span>
        <span className="pointer-events-none absolute bottom-1.5 left-2 text-xs font-medium text-muted-foreground">Pressure -</span>

        {/* Region hotspots: hover or focus to light up the matching reading. */}
        {hotspot("up", "inset-x-0 top-0 h-1/2 rounded-t-lg")}
        {hotspot("down", "inset-x-0 bottom-0 h-1/2 rounded-b-lg")}
        {hotspot("amp", "left-1/2 top-2 bottom-2 z-10 w-12 -translate-x-1/2")}
      </div>

      {/* Time axis: beginning / middle / end, itself a hotspot for the time reading. */}
      <button
        type="button"
        aria-label={`Highlight ${PLAIN.time}`}
        onMouseEnter={() => setHovered("time")}
        onMouseLeave={() => setHovered(null)}
        onFocus={() => setHovered("time")}
        onBlur={() => setHovered(null)}
        onClick={() => setPinned((p) => (p === "time" ? null : "time"))}
        className={cn(
          "mt-1.5 flex w-full flex-col gap-0.5 rounded-lg border px-3 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          active === "time" ? "border-primary bg-primary/10" : "border-border bg-background hover:bg-muted",
        )}
      >
        <span className={cn("text-center text-[0.65rem] font-semibold uppercase tracking-wide", active === "time" ? "text-link" : "text-muted-foreground")}>
          Time &rarr;
        </span>
        <span className={cn("flex items-center justify-between text-xs font-medium", active === "time" ? "text-foreground" : "text-muted-foreground")}>
          <span>beginning</span>
          <span>middle</span>
          <span>end</span>
        </span>
      </button>

      {/* The readings. Hover/focus/tap lights up the matching region above. */}
      <ul className="mt-4 space-y-2">
        {readings.map((r) => {
          const region = r.id as Region;
          const on = active === region;
          return (
            <li key={r.id}>
              <button
                type="button"
                onMouseEnter={() => setHovered(region)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(region)}
                onBlur={() => setHovered(null)}
                onClick={() => setPinned((p) => (p === region ? null : region))}
                aria-pressed={pinned === region}
                className={cn(
                  "flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left text-sm leading-relaxed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  on ? "border-primary bg-primary/10 text-foreground" : "border-border bg-background text-muted-foreground hover:bg-muted",
                )}
              >
                <span aria-hidden="true" className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", on ? "bg-primary" : "bg-primary/40")} />
                <span className="text-foreground">
                  <RichText text={r.text} />
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-3 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}
