"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { RichText } from "@/components/lab/rich-text";
import { CheckCard, SuccessCover } from "@/components/lab/assessment/card";

/** "Point to the moment": the learner reads a waveform left to right and taps the
 *  point that matches each moment, one at a time (beginning, then middle, then end).
 *  Markers look identical so the answer comes from the just-taught rule (time runs
 *  left to right), not from a visual tell. Wrong taps give a hint, never a lockout.
 *  Keyboard-operable buttons; solved when all three are found in order. */

type Moment = { id: string; label: string; at: number; prompt: string; hint: string };

type Props = {
  label: string;
  prompt: string;
  moments: readonly Moment[];
  successText: string;
  objective?: string;
  onSolved?: (solved: boolean) => void;
};

/** Same wave shape as the anatomy graph, so the check reads as the same picture. */
function anatomyPressure(x: number): number {
  return Math.sin(x * Math.PI) * Math.sin(x * Math.PI * 2 * 4);
}

const CY_FRAC = 0.5;
const AMP_FRAC = 0.36;

export function TapTheMoment({ label, prompt, moments, successText, objective, onSolved }: Props) {
  const [step, setStep] = React.useState(0);
  const [status, setStatus] = React.useState("");
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const solved = step >= moments.length;

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
    const styles = getComputedStyle(canvas);
    const primary = styles.getPropertyValue("--primary").trim() || "#6d5ae6";
    const border = styles.getPropertyValue("--border").trim() || "#e3dfd8";
    const cy = h * CY_FRAC;
    const amp = h * AMP_FRAC;

    ctx.strokeStyle = border;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.stroke();

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
  }, []);

  React.useEffect(() => {
    paint();
    const onResize = () => paint();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [paint]);

  const tap = (i: number) => {
    if (solved || i < step) return; // already found
    if (i === step) {
      setStep((s) => s + 1);
      setStatus("");
    } else {
      setStatus(moments[step].hint);
    }
  };

  if (solved) {
    return (
      <CheckCard label={label} solved>
        <SuccessCover objective={objective} rationale={successText} />
      </CheckCard>
    );
  }

  const current = moments[step];

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
        {moments.map((m, i) => {
          const found = i < step;
          const topFrac = CY_FRAC - anatomyPressure(m.at) * AMP_FRAC;
          return (
            <button
              key={m.id}
              type="button"
              disabled={found}
              onClick={() => tap(i)}
              aria-label={found ? `${m.label}, found` : `Point ${i + 1} of ${moments.length} on the wave`}
              style={{ left: `${m.at * 100}%`, top: `${topFrac * 100}%` }}
              className={cn(
                "absolute grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                found
                  ? "border-emerald-400 bg-emerald-500/20 text-emerald-600 dark:text-emerald-300"
                  : "border-primary bg-background text-transparent hover:bg-primary/10",
              )}
            >
              {found ? <Check aria-hidden="true" className="size-4" /> : <span aria-hidden="true" className="size-2 rounded-full bg-primary" />}
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="mt-3 min-h-5 text-sm text-muted-foreground">
        {status || `Found ${step} of ${moments.length}.`}
      </p>
    </CheckCard>
  );
}
