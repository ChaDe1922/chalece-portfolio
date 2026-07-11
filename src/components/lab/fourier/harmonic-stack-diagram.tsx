"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { RichText } from "@/components/lab/rich-text";
import { harmonicColor } from "./partial-graphs";

/** A labeled harmonic stack: a bar per harmonic, with clickable term callouts
 *  (fundamental, harmonics, amplitude, timbre). Hover, focus, or tap a term to light
 *  up the part of the stack it names. The reverse also holds: the term highlights the
 *  matching bars. Teaches the vocabulary before the live instrument below. */

type Term = { id: string; label: string; body: string };

export function HarmonicStackDiagram({ amps, terms, hint }: { amps: readonly number[]; terms: readonly Term[]; hint: string }) {
  const [hovered, setHovered] = React.useState<string | null>(null);
  const [pinned, setPinned] = React.useState<string | null>(null);
  const active = hovered ?? pinned;
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const n = amps.length;

  const paint = React.useCallback(
    (hi: string | null) => {
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
      const gap = Math.max(6, w * 0.03);
      const bw = (w - gap * (n + 1)) / n;
      let max = 0;
      for (const a of amps) max = Math.max(max, Math.abs(a));
      const denom = Math.max(max, 1);
      const baseY = h - 18;
      const x = (i: number) => gap + i * (bw + gap);

      for (let i = 0; i < n; i++) {
        const bh = Math.max(3, (Math.abs(amps[i]) / denom) * (h - 34));
        // Which term (if any) emphasizes this bar.
        const emph =
          (hi === "fundamental" && i === 0) ||
          (hi === "harmonics" && i > 0) ||
          (hi === "amplitude" && i === 1) ||
          hi === "timbre";
        const dim = hi != null && hi !== "timbre" && !emph;
        ctx.fillStyle = harmonicColor(i, n);
        ctx.globalAlpha = dim ? 0.25 : 1;
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") ctx.roundRect(x(i), baseY - bh, bw, bh, 3);
        else ctx.rect(x(i), baseY - bh, bw, bh);
        ctx.fill();
        if (emph && hi !== "timbre") {
          ctx.globalAlpha = 1;
          ctx.lineWidth = 2;
          ctx.strokeStyle = harmonicColor(i, n);
          ctx.stroke();
        }
        // Harmonic labels along the base.
        ctx.globalAlpha = 1;
        ctx.fillStyle = getComputedStyle(canvas).getPropertyValue("--muted-foreground").trim() || "#7a756c";
        ctx.font = "10px ui-sans-serif, system-ui";
        ctx.textAlign = "center";
        ctx.fillText(`H${i + 1}`, x(i) + bw / 2, h - 4);
      }

      // Amplitude cue: a small double arrow on H2 when "amplitude" is active.
      if (hi === "amplitude") {
        const i = 1;
        const bh = Math.max(3, (Math.abs(amps[i]) / denom) * (h - 34));
        const cx = x(i) + bw + 4;
        ctx.strokeStyle = primary;
        ctx.fillStyle = primary;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx, baseY);
        ctx.lineTo(cx, baseY - bh);
        ctx.stroke();
      }
      // Timbre cue: outline the whole stack.
      if (hi === "timbre") {
        ctx.strokeStyle = primary;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 3]);
        ctx.strokeRect(2, 2, w - 4, baseY);
        ctx.setLineDash([]);
      }
    },
    [amps, n],
  );

  React.useEffect(() => {
    paint(active);
    const onResize = () => paint(active);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [active, paint]);

  const bind = (id: string) => ({
    onMouseEnter: () => setHovered(id),
    onMouseLeave: () => setHovered(null),
    onFocus: () => setHovered(id),
    onBlur: () => setHovered(null),
    onClick: () => setPinned((p) => (p === id ? null : id)),
  });

  return (
    <div>
      <canvas ref={canvasRef} aria-hidden="true" className="h-44 w-full rounded-lg border border-border bg-background" />
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {terms.map((t) => {
          const on = active === t.id;
          return (
            <li key={t.id}>
              <button
                type="button"
                {...bind(t.id)}
                aria-pressed={pinned === t.id}
                className={cn(
                  "flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left text-sm leading-relaxed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  on ? "border-primary bg-primary/10" : "border-border bg-background hover:bg-muted",
                )}
              >
                <span aria-hidden="true" className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", on ? "bg-primary" : "bg-primary/40")} />
                <span>
                  <span className="font-semibold text-foreground">{t.label}.</span> <span className="text-muted-foreground">{t.body}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">
        <RichText text={hint} />
      </p>
    </div>
  );
}
