"use client";

import * as React from "react";
import { RichText } from "@/components/lab/rich-text";
import { CheckCard, SuccessCover } from "@/components/lab/assessment/card";
import { LabProse, LabDuo } from "./lab-layout";
import { fourierLab } from "@/data/fourier-lab";

const data = fourierLab.slides.cosineSine;

const N = 64;
const BIN = 4;

/** Correlate a bin-4 cosine held at phase `deg` against the cosine and sine tests. */
function corr(deg: number) {
  const phi = (deg * Math.PI) / 180;
  let c = 0;
  let s = 0;
  for (let n = 0; n < N; n++) {
    const sig = Math.cos((2 * Math.PI * BIN * n) / N + phi);
    c += sig * Math.cos((2 * Math.PI * BIN * n) / N);
    s += sig * Math.sin((2 * Math.PI * BIN * n) / N);
  }
  c /= N / 2;
  s /= N / 2;
  return { C: c, S: s, amount: Math.sqrt(c * c + s * s) };
}

function readVar(canvas: HTMLCanvasElement, name: string, fallback: string) {
  return getComputedStyle(canvas).getPropertyValue(name).trim() || fallback;
}

/** A signed value bar centered at zero (positive right, negative left). */
function SignedBar({ label, value, max = 1 }: { label: string; value: number; max?: number }) {
  const frac = Math.max(-1, Math.min(1, value / max));
  const widthPct = Math.abs(frac) * 50;
  const leftPct = frac >= 0 ? 50 : 50 - widthPct;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="font-mono text-xs text-link">{value.toFixed(2)}</span>
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
        <div aria-hidden="true" className="absolute inset-y-0 left-1/2 w-px bg-border" />
        <div className="absolute inset-y-0 rounded-full bg-primary transition-all duration-150" style={{ left: `${leftPct}%`, width: `${widthPct}%` }} />
      </div>
    </div>
  );
}

/** Screen 19: cosine and sine work as a team. As the phase changes, C and S trade
 *  strength while the combined amount sqrt(C^2 + S^2) stays steady. The 2D vector
 *  canvas plots the point at (C, S): it travels a circle whose radius is the
 *  amount. The micro is exploratory (copy only). Canvas is decorative; the
 *  aria-live readout carries the meaning. */
export function CosineSineVector() {
  const [deg, setDeg] = React.useState(0);
  const [solved, setSolved] = React.useState(false);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const { C, S, amount } = React.useMemo(() => corr(deg), [deg]);

  // "Keep the amount": solved once C is nearly gone while the amount stays strong,
  // which only happens because S picks up what C drops. Latch in the slider handler
  // (an event, not an effect or a render-time ref write).
  const changeDeg = (v: number) => {
    setDeg(v);
    const r = corr(v);
    if (Math.abs(r.C) < 0.2 && r.amount > 0.8) setSolved(true);
  };

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
    const coral = "#e0564a";
    const cx = w / 2;
    const cy = h / 2;
    const R = Math.min(w, h) / 2 - 16;

    // Axes: horizontal = C, vertical = S.
    ctx.strokeStyle = grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(8, cy);
    ctx.lineTo(w - 8, cy);
    ctx.moveTo(cx, 8);
    ctx.lineTo(cx, h - 8);
    ctx.stroke();

    // The amount circle: radius is the current amount, scaled to the plot.
    const radiusPx = Math.min(R, amount * R);
    ctx.strokeStyle = grid;
    ctx.globalAlpha = 0.7;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, radiusPx, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // The vector from center to (C, S). Screen y is inverted so +S points up.
    const px = cx + C * R;
    const py = cy - S * R;
    ctx.strokeStyle = primary;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(px, py);
    ctx.stroke();

    // The point on the circle.
    ctx.beginPath();
    ctx.fillStyle = coral;
    ctx.shadowColor = coral;
    ctx.shadowBlur = 10;
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }, [C, S, amount]);

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
        <div className="rounded-xl border border-border bg-card/60 p-4">
          <p className="text-sm leading-relaxed text-muted-foreground">{data.how}</p>
        </div>
        <p className="text-base leading-relaxed text-muted-foreground">{data.instruction}</p>
      </LabProse>

      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="grid items-center gap-4 sm:grid-cols-2 lg:gap-8">
          <figure className="space-y-1">
            <canvas ref={canvasRef} aria-hidden="true" className="mx-auto aspect-square w-full max-w-xs rounded-lg border border-border bg-background sm:max-w-sm lg:max-w-md" />
            <figcaption className="text-center text-xs text-muted-foreground">Horizontal is C, vertical is S. The point rides a circle whose radius is the amount.</figcaption>
          </figure>

          <div className="space-y-3">
            <SignedBar label={data.showCosineLabel} value={C} />
            <SignedBar label={data.showSineLabel} value={S} />
            <SignedBar label={data.showMagnitudeLabel} value={amount} />
          </div>
        </div>

        <p aria-live="polite" className="mt-4 text-sm font-medium text-foreground">
          {`Phase ${deg} degrees. C = ${C.toFixed(2)}, S = ${S.toFixed(2)}, amount = ${amount.toFixed(2)}. The amount stays steady while C and S trade.`}
        </p>

        <label className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
          <span className="w-28 font-medium">{data.changePhaseLabel}</span>
          <input
            type="range"
            min={0}
            max={360}
            step={1}
            value={deg}
            onChange={(e) => changeDeg(Number(e.target.value))}
            className="flex-1 accent-[var(--primary)]"
            aria-label="Phase in degrees"
          />
          <span className="w-12 text-right font-mono text-xs text-foreground">{deg}°</span>
        </label>
      </div>

      {/* Micro-challenge (left) + takeaway (right) use the wide container. */}
      <LabDuo>
        <CheckCard label={data.challengeLead} solved={solved}>
          {solved ? (
            <SuccessCover objective="Measure a frequency no matter where it starts." rationale={data.challengeSuccess} />
          ) : (
            <p className="text-sm leading-relaxed text-muted-foreground">{data.challengePrompt}</p>
          )}
        </CheckCard>

        <div className="rounded-2xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-5">
          <p className="text-sm leading-relaxed text-foreground">
            <RichText text={data.insight} />
          </p>
        </div>
      </LabDuo>
    </div>
  );
}
