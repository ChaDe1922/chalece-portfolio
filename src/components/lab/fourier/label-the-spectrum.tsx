"use client";

import * as React from "react";
import { RichText } from "@/components/lab/rich-text";
import { CheckCard, SuccessCover } from "@/components/lab/assessment/card";
import { harmonicColor } from "./partial-graphs";

/** "Point to the spectrum": read a description and tap the matching bar, one prompt
 *  at a time (a low bar, a high bar, the strongest bar). Each step accepts a set of
 *  bar indices; a wrong tap gives a hint, never a lockout. Modeled on
 *  tap-the-moment, for a spectrum. Solved when every step is satisfied in order. */

type Step = { id: string; prompt: string; accept: readonly number[]; hint: string };

type Props = {
  label: string;
  prompt: string;
  amps: readonly number[];
  steps: readonly Step[];
  successText: string;
  objective?: string;
  onSolved?: (solved: boolean) => void;
  onPick?: (index: number) => void;
  barLabels?: readonly string[];
};

function barGeom(w: number, n: number) {
  const gap = Math.max(4, w * 0.02);
  const bw = (w - gap * (n + 1)) / n;
  const x = (i: number) => gap + i * (bw + gap);
  return { gap, bw, x };
}

export function LabelTheSpectrum({ label, prompt, amps, steps, successText, objective, onSolved, onPick, barLabels }: Props) {
  const [step, setStep] = React.useState(0);
  const [status, setStatus] = React.useState("");
  const [popped, setPopped] = React.useState<number | null>(null);
  const popTimer = React.useRef(0);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const n = amps.length;
  const solved = step >= steps.length;

  React.useEffect(() => {
    if (solved) onSolved?.(true);
  }, [solved, onSolved]);

  const paint = React.useCallback(() => {
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
    const { bw, x } = barGeom(w, n);
    let max = 0;
    for (const a of amps) max = Math.max(max, Math.abs(a));
    const denom = Math.max(max, 1);
    const baseY = h - 4;
    for (let i = 0; i < n; i++) {
      const pop = i === popped;
      const bh = Math.max(2, (Math.abs(amps[i]) / denom) * (h - 12)) * (pop ? 1.12 : 1);
      ctx.fillStyle = harmonicColor(i, n);
      ctx.globalAlpha = 1;
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") ctx.roundRect(x(i), baseY - bh, bw, bh, 3);
      else ctx.rect(x(i), baseY - bh, bw, bh);
      ctx.fill();
      if (pop) {
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = harmonicColor(i, n);
        ctx.stroke();
      }
    }
  }, [amps, n, popped]);

  React.useEffect(() => {
    paint();
    const onResize = () => paint();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [paint]);

  const tap = (i: number) => {
    if (solved) return;
    onPick?.(i);
    setPopped(i);
    if (popTimer.current) window.clearTimeout(popTimer.current);
    popTimer.current = window.setTimeout(() => setPopped(null), 260);
    const cur = steps[step];
    if (cur.accept.includes(i)) {
      setStep((s) => s + 1);
      setStatus("");
    } else {
      setStatus(cur.hint);
    }
  };

  React.useEffect(() => () => {
    if (popTimer.current) window.clearTimeout(popTimer.current);
  }, []);

  if (solved) {
    return (
      <CheckCard label={label} solved>
        <SuccessCover objective={objective} rationale={successText} />
      </CheckCard>
    );
  }

  const current = steps[step];
  const approxW = 1000;
  const geom = barGeom(approxW, n);

  return (
    <CheckCard label={label} solved={false}>
      <p className="text-base font-medium text-foreground">
        <RichText text={current.prompt} />
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        <RichText text={prompt} />
      </p>

      <div className="relative mt-4">
        <canvas ref={canvasRef} aria-hidden="true" className="h-40 w-full rounded-lg border border-border bg-background" />
        {amps.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => tap(i)}
            aria-label={`Bar ${i + 1} of ${n}`}
            style={{ left: `${(geom.x(i) / approxW) * 100}%`, width: `${(geom.bw / approxW) * 100}%` }}
            className="absolute inset-y-0 rounded hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
          />
        ))}
      </div>
      {barLabels ? (
        <div className="relative mt-1 h-4">
          {barLabels.map((bl, i) => (
            <span key={i} style={{ left: `${(geom.x(i) / approxW) * 100}%`, width: `${(geom.bw / approxW) * 100}%` }} className="absolute text-center text-[11px] font-medium text-muted-foreground">
              {bl}
            </span>
          ))}
        </div>
      ) : null}
      <p className="mt-1 text-center text-xs font-medium text-muted-foreground">Frequency, low to high &rarr;</p>

      <p aria-live="polite" className="mt-3 min-h-5 text-sm text-muted-foreground">
        {status || `Found ${step} of ${steps.length}.`}
      </p>
    </CheckCard>
  );
}
