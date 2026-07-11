"use client";

import * as React from "react";
import { Check, ChevronRight, ChevronsRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeck } from "@/components/deck/deck-context";
import { RichText } from "@/components/lab/rich-text";
import { GraphAxes } from "./graph-axes";
import { LabProse, LabSplit, LabDuo } from "./lab-layout";
import { SpotTheError } from "@/components/lab/assessment/spot-the-error";
import { fourierLab } from "@/data/fourier-lab";

const data = fourierLab.slides.byHand;
const X = data.signal as readonly number[];
const NN = data.n;

/** The source wave with one clickable dot per sample, so learners can connect a
 *  table value (x[3]) to the physical point on the wave that produced it. Dots are
 *  real focusable targets; a focus ring draws around the focused dot. */
function SourceGraph({ values, targetN, found, onPick }: { values: readonly number[]; targetN: number; found: boolean; onPick: (n: number) => void }) {
  const [focused, setFocused] = React.useState<number | null>(null);
  const W = 320;
  const H = 120;
  const padX = 18;
  const padY = 16;
  const plotW = W - padX * 2;
  const cy = H / 2;
  const amp = H / 2 - padY;
  const pts = values.map((v, i) => ({ x: padX + (i / (values.length - 1)) * plotW, y: cy - v * amp, v, i }));
  let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const mx = (pts[i].x + pts[i + 1].x) / 2;
    const my = (pts[i].y + pts[i + 1].y) / 2;
    d += ` Q${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
  }
  d += ` L${pts[pts.length - 1].x.toFixed(1)} ${pts[pts.length - 1].y.toFixed(1)}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-40 w-full rounded-lg border border-border bg-background lg:h-44" role="group" aria-label="The sound wave with eight sample dots. Activate a dot to identify its sample.">
      <line x1={padX} y1={cy} x2={W - padX} y2={cy} stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" />
      <path d={d} fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
      {pts.map((p) => (
        <g key={p.i}>
          {focused === p.i ? <circle cx={p.x} cy={p.y} r={11} fill="none" stroke="var(--ring)" strokeWidth={2} /> : null}
          <circle cx={p.x} cy={p.y} r={p.i === targetN && found ? 6 : 4.5} fill={p.i === targetN && found ? "#059669" : "var(--primary)"} />
          <circle
            cx={p.x}
            cy={p.y}
            r={14}
            fill="transparent"
            role="button"
            tabIndex={0}
            aria-label={`Sample x[${p.i}], value ${p.v.toFixed(2)}`}
            onClick={() => onPick(p.i)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onPick(p.i);
              }
            }}
            onFocus={() => setFocused(p.i)}
            onBlur={() => setFocused(null)}
            className="cursor-pointer focus:outline-none"
          />
        </g>
      ))}
    </svg>
  );
}

/** P9: compute one Fourier bin by hand on an N=8 signal. Step the
 *  multiply-and-accumulate for C and S, take the magnitude, and compare it to the
 *  spectrum bar. Completing one bin unlocks Next. */
export function WorkedCalc() {
  const deck = useDeck();
  const [k, setK] = React.useState<number>(data.matchBin);
  const [step, setStep] = React.useState(0); // samples accumulated, 0..NN
  const [done, setDone] = React.useState<Set<number>>(new Set());
  const [foundDot, setFoundDot] = React.useState(false);
  const [dotMsg, setDotMsg] = React.useState("");

  const pickDot = (n: number) => {
    if (n === 3) {
      setFoundDot(true);
      setDotMsg(data.findDotSuccess);
    } else {
      setDotMsg("Not that one. x[3] is the fourth dot, at sample number 3 (counting from 0).");
    }
  };

  // Per-sample test values and products for the current bin.
  const rows = React.useMemo(() => {
    return Array.from({ length: NN }, (_, n) => {
      const theta = (2 * Math.PI * k * n) / NN;
      const cos = Math.cos(theta);
      const sin = Math.sin(theta);
      return { n, x: X[n], cos, sin, pc: X[n] * cos, ps: X[n] * sin };
    });
  }, [k]);

  let C = 0;
  let S = 0;
  for (let i = 0; i < step; i++) {
    C += rows[i].pc;
    S -= rows[i].ps; // S accumulates -x[n] sin(theta), matching e^(-i ...)
  }
  const amount = Math.sqrt(C * C + S * S);

  const fullC = rows.reduce((a, r) => a + r.pc, 0);
  const fullS = rows.reduce((a, r) => a - r.ps, 0);
  const fullAmount = Math.sqrt(fullC * fullC + fullS * fullS);

  const complete = step >= NN;
  const applied = step > 0 ? rows[step - 1] : null; // the sample just added (running totals include it)

  // Completing one bin unlocks Next (deck gate). Marking happens in the step
  // handler; this effect only signals the deck once a bin is done.
  React.useEffect(() => {
    if (done.size >= 1) deck.markComplete(data.id);
  }, [done, deck]);

  const markBinDone = () => {
    if (!done.has(k)) {
      const nd = new Set(done);
      nd.add(k);
      setDone(nd);
    }
  };

  const stepOnce = () => {
    const ns = Math.min(NN, step + 1);
    setStep(ns);
    if (ns >= NN) markBinDone();
  };

  const stepAll = () => {
    setStep(NN);
    markBinDone();
  };

  const pickBin = (b: number) => {
    setK(b);
    setStep(0);
  };

  return (
    <div className="lesson-stagger space-y-6">
      <LabProse>
        <p className="text-lg leading-relaxed text-foreground">
          <RichText text={data.lead} />
        </p>
        <p className="text-base leading-relaxed text-muted-foreground">{data.instruction}</p>
      </LabProse>

      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <LabSplit
          start={
            <>
              {/* Source graph: the wave, its eight sample dots, and a find-the-dot check. */}
        <p className="text-xs font-semibold uppercase tracking-wide text-link">The sound wave and its samples</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{data.sourceNote}</p>
        <div className="mt-2">
          <GraphAxes yLabel="Value" xLabel="Time" ticks={0}>
            <SourceGraph values={X} targetN={3} found={foundDot} onPick={pickDot} />
          </GraphAxes>
        </div>
        <p className="mt-2 text-sm font-medium text-foreground">{data.findDotPrompt}</p>
        <p aria-live="polite" className="mt-1 min-h-5 text-sm text-muted-foreground">{dotMsg}</p>

        {/* The eight samples */}
        <p className="mt-5 border-t border-border pt-4 text-xs font-semibold uppercase tracking-wide text-link">The sound, eight samples</p>
        <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1">
          {rows.map((r) => (
            <div
              key={r.n}
              className={cn(
                "flex min-w-12 flex-1 flex-col items-center rounded-lg border px-2 py-1.5 text-center transition-colors",
                r.n < step ? "border-primary/40 bg-primary/5" : r.n === step ? "border-primary bg-primary/10" : "border-border bg-background",
              )}
            >
              <span className="font-mono text-[11px] text-muted-foreground">x[{r.n}]</span>
              <span className="font-mono text-sm font-semibold text-foreground">{r.x.toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Bin picker */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-foreground">{data.chooseBinLabel}:</span>
          {data.bins.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => pickBin(b)}
              aria-pressed={k === b}
              className={cn(
                "h-9 w-9 rounded-lg border text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                k === b ? "border-primary bg-primary/10 text-link" : "border-border bg-background text-foreground hover:bg-muted",
                done.has(b) ? "ring-1 ring-emerald-400" : "",
              )}
            >
              {b}
            </button>
          ))}
          {done.has(k) ? <Check aria-hidden="true" className="size-4 text-emerald-600 dark:text-emerald-400" /> : null}
              </div>
            </>
          }
          end={
            <>
              {/* Arithmetic for the step JUST applied, so the "= value" and the running
                  totals below always agree (never a "C = 0.00" beneath a "= 1.00" line). */}
              <div className="mt-4 rounded-xl border border-border bg-background p-4 font-mono text-sm">
          {complete ? (
            <p className="text-foreground">All {NN} samples added. Take the magnitude.</p>
          ) : applied ? (
            <div className="space-y-1.5">
              <p className="text-muted-foreground">Just added sample n = {applied.n}</p>
              <p className="text-foreground">C += x[{applied.n}] · cos(2π·{k}·{applied.n}/{NN}) = {applied.x.toFixed(2)} · {applied.cos.toFixed(2)} = {applied.pc.toFixed(2)}</p>
              <p className="text-foreground">S −= x[{applied.n}] · sin(2π·{k}·{applied.n}/{NN}) = {applied.x.toFixed(2)} · {applied.sin.toFixed(2)} = {applied.ps.toFixed(2)}</p>
            </div>
          ) : (
            <p className="text-muted-foreground">Press {data.stepLabel} to add the first sample.</p>
          )}
        </div>

        {/* Running totals */}
        <div aria-live="polite" className="mt-3 grid gap-2 sm:grid-cols-3">
          <div className="rounded-lg bg-muted/60 px-3 py-2 font-mono text-sm">C = {C.toFixed(2)}</div>
          <div className="rounded-lg bg-muted/60 px-3 py-2 font-mono text-sm">S = {S.toFixed(2)}</div>
          <div className="rounded-lg bg-primary/10 px-3 py-2 font-mono text-sm font-semibold text-link">amount = {amount.toFixed(2)}</div>
        </div>

        {/* Controls */}
        <div className="mt-4 flex flex-wrap gap-2">
          {!complete ? (
            <>
              <button
                type="button"
                onClick={stepOnce}
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {data.stepLabel} <ChevronRight aria-hidden="true" className="size-4" />
              </button>
              <button
                type="button"
                onClick={stepAll}
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ChevronsRight aria-hidden="true" className="size-4" /> {data.allLabel}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setStep(0)}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <RotateCcw aria-hidden="true" className="size-4" /> {data.resetLabel}
            </button>
          )}
        </div>

        {/* Result vs spectrum bar, shown when complete */}
        {complete ? (
          <div className="mt-4 rounded-xl border border-border bg-background p-4">
            <p className="text-sm text-foreground">
              Bin {k}: amount = {fullAmount.toFixed(2)}.{" "}
              {fullAmount > 1 ? "A large total. This frequency is in the sound." : "Near zero. This frequency is not in the sound."}
            </p>
            <div className="mt-3 flex items-end gap-3">
              <span className="text-xs text-muted-foreground">Spectrum bar</span>
              <div className="flex h-16 flex-1 items-end rounded-lg border border-border bg-muted/40 p-1">
                <div className="w-10 rounded bg-primary transition-[height] duration-300" style={{ height: `${Math.round(Math.min(1, fullAmount / (NN / 2)) * 100)}%` }} />
              </div>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{data.normalizeNote}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{data.mismatchNote}</p>
          </div>
        ) : null}
            </>
          }
        />
      </div>

      <LabDuo>
        <SpotTheError
        label={data.challengeLead}
        prompt={data.challengePrompt}
        lines={[
          { id: "a", text: "x[0] · cos = 1.00 · 1.00 = 1.00" },
          { id: "b", text: data.errorStep.shown, wrong: true },
          { id: "c", text: "x[4] · cos = -1.00 · -1.00 = 1.00" },
        ]}
        revealText={data.errorStep.correct}
        successText="Multiplying 0.71 by 0.71 gives about 0.50, not 0.71."
        objective="Catch a calculation slip."
      />

        <div className="rounded-2xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-5">
          <p className="text-sm leading-relaxed text-foreground">
            <RichText text={data.insight} />
          </p>
        </div>
      </LabDuo>
    </div>
  );
}
