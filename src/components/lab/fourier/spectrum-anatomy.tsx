"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { RichText } from "@/components/lab/rich-text";
import { harmonicColor } from "./partial-graphs";

/** The parts of a spectrum, taught interactively (the spectrum analogue of
 *  wave-anatomy). A representative spectrum is drawn as bars with labeled axes:
 *  left is low frequency, right is high; taller is stronger, shorter is weaker.
 *  Hovering, focusing, or tapping a reading lights up the matching region, and
 *  hovering a region lights up its reading. */

type Reading = { id: string; text: string };
type Region = "low" | "high" | "tall" | "short";

const PLAIN: Record<Region, string> = {
  low: "the low-frequency (left) side",
  high: "the high-frequency (right) side",
  tall: "the tallest, strongest bar",
  short: "the shortest, weakest bar",
};

function barGeom(w: number, n: number) {
  const gap = Math.max(4, w * 0.02);
  const bw = (w - gap * (n + 1)) / n;
  const x = (i: number) => gap + i * (bw + gap);
  return { gap, bw, x, center: (i: number) => x(i) + bw / 2 };
}

export function SpectrumAnatomy({ amps, readings, hint }: { amps: readonly number[]; readings: readonly Reading[]; hint: string }) {
  const [hovered, setHovered] = React.useState<Region | null>(null);
  const [pinned, setPinned] = React.useState<Region | null>(null);
  const active = hovered ?? pinned;
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const n = amps.length;
  const tallIdx = React.useMemo(() => amps.reduce((best, a, i) => (Math.abs(a) > Math.abs(amps[best]) ? i : best), 0), [amps]);
  const shortIdx = React.useMemo(() => {
    let idx = -1;
    for (let i = 0; i < amps.length; i++) {
      if (Math.abs(amps[i]) < 0.001) continue;
      if (idx < 0 || Math.abs(amps[i]) < Math.abs(amps[idx])) idx = i;
    }
    return idx < 0 ? amps.length - 1 : idx;
  }, [amps]);

  const paint = React.useCallback(
    (hi: Region | null) => {
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
      const primary = getComputedStyle(canvas).getPropertyValue("--primary").trim() || "#6d5ae6";

      // Shade the low (left) or high (right) half.
      if (hi === "low" || hi === "high") {
        ctx.fillStyle = primary;
        ctx.globalAlpha = 0.1;
        if (hi === "low") ctx.fillRect(0, 0, w / 2, h);
        else ctx.fillRect(w / 2, 0, w / 2, h);
        ctx.globalAlpha = 1;
      }

      const { bw, x } = barGeom(w, n);
      let max = 0;
      for (const a of amps) max = Math.max(max, Math.abs(a));
      const denom = Math.max(max, 1);
      const baseY = h - 4;
      for (let i = 0; i < n; i++) {
        const bh = Math.max(2, (Math.abs(amps[i]) / denom) * (h - 12));
        const emphasized = (hi === "tall" && i === tallIdx) || (hi === "short" && i === shortIdx);
        const dimmed = (hi === "tall" || hi === "short") && !emphasized;
        ctx.fillStyle = harmonicColor(i, n);
        ctx.globalAlpha = dimmed ? 0.28 : 1;
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") ctx.roundRect(x(i), baseY - bh, bw, bh, 3);
        else ctx.rect(x(i), baseY - bh, bw, bh);
        ctx.fill();
        if (emphasized) {
          ctx.globalAlpha = 1;
          ctx.lineWidth = 2;
          ctx.strokeStyle = harmonicColor(i, n);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    },
    [amps, n, tallIdx, shortIdx],
  );

  React.useEffect(() => {
    paint(active);
    const onResize = () => paint(active);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [active, paint]);

  const bind = (region: Region) => ({
    onMouseEnter: () => setHovered(region),
    onMouseLeave: () => setHovered(null),
    onFocus: () => setHovered(region),
    onBlur: () => setHovered(null),
    onClick: () => setPinned((p) => (p === region ? null : region)),
  });

  // Percentage centers for the tall/short bar hotspots.
  const pct = (i: number) => {
    const approxW = 1000;
    return (barGeom(approxW, n).center(i) / approxW) * 100;
  };

  return (
    <div>
      <div className="flex items-stretch gap-2">
        <span className="flex shrink-0 items-center justify-center text-xs font-medium text-muted-foreground" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
          Strength
        </span>
        <div className="relative min-w-0 flex-1">
          <canvas ref={canvasRef} aria-hidden="true" className="h-40 w-full rounded-lg border border-border bg-background" />

          {/* Region hotspots */}
        <button type="button" aria-label={`Highlight ${PLAIN.low}`} {...bind("low")} className="absolute inset-y-0 left-0 w-1/2 rounded-l-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        <button type="button" aria-label={`Highlight ${PLAIN.high}`} {...bind("high")} className="absolute inset-y-0 right-0 w-1/2 rounded-r-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        <button type="button" aria-label={`Highlight ${PLAIN.tall}`} {...bind("tall")} style={{ left: `${pct(tallIdx)}%` }} className="absolute top-2 bottom-2 z-10 w-8 -translate-x-1/2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          <button type="button" aria-label={`Highlight ${PLAIN.short}`} {...bind("short")} style={{ left: `${pct(shortIdx)}%` }} className="absolute top-2 bottom-2 z-10 w-8 -translate-x-1/2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        </div>
      </div>

      <p className="mt-1 text-center text-xs font-medium text-muted-foreground">Frequency, low to high &rarr;</p>

      <ul className="mt-4 space-y-2">
        {readings.map((r) => {
          const region = r.id as Region;
          const on = active === region;
          return (
            <li key={r.id}>
              <button
                type="button"
                {...bind(region)}
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
