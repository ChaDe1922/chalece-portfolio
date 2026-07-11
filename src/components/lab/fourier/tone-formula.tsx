"use client";

import * as React from "react";
import { useAudioEngineContext, AudioControls } from "@/components/lab/audio/audio-context";
import { RichText } from "@/components/lab/rich-text";
import { MathFormula } from "./math-formula";
import { ToneFormulaGraph } from "./tone-formula-graph";
import { FormulaSayItAloud } from "./formula-say-it-aloud";
import { GuidedGoals } from "./guided-goals";
import { LabProse, LabSplit } from "./lab-layout";
import { fourierLab } from "@/data/fourier-lab";

const data = fourierLab.slides.toneFormula;
const COLOR = Object.fromEntries(data.vars.map((v) => [v.id, v.color])) as Record<string, string>;
const START = Object.fromEntries(data.vars.map((v) => [v.id, v.value])) as Record<string, number>;

/** Its own screen now: the single-tone formula y = A sin(2pi f t + phase), rendered
 *  LaTeX-style and color-coded (tap a symbol for a description + example), plus value
 *  sliders and a live substitution so you can compute it. Phase prepares Part 2. */
export function ToneFormula() {
  const engine = useAudioEngineContext();
  const [vals, setVals] = React.useState<Record<string, number>>(() => Object.fromEntries(data.vars.map((v) => [v.id, v.value])));
  const [doneGoals, setDoneGoals] = React.useState<Set<string>>(() => new Set());

  const A = vals.A;
  const f = vals.f;
  const phi = vals.phi;
  const t = vals.t;

  // Tick off the ordered goals against the slider baselines.
  const evaluateGoals = React.useCallback((v: Record<string, number>) => {
    setDoneGoals((prev) => {
      const next = new Set(prev);
      for (const g of data.goals) {
        if (next.has(g.id)) continue;
        const ok =
          g.check === "ampUp"
            ? v.A > START.A + 0.02
            : g.check === "freqUp"
              ? v.f > START.f + 1
              : Math.abs(v.phi - START.phi) > 0.05;
        if (ok) next.add(g.id);
        else break; // complete in order
      }
      return next;
    });
  }, []);

  const setVal = (id: string, value: number) => {
    setVals((p) => {
      const next = { ...p, [id]: value };
      evaluateGoals(next);
      return next;
    });
  };

  const arg = 2 * Math.PI * f * t + phi;
  const s = Math.sin(arg);
  const y = A * s;

  const fmt = (id: string) => (id === "f" ? String(Math.round(f)) : id === "t" ? t.toFixed(4) : vals[id].toFixed(2));

  return (
    <div className="lesson-stagger space-y-6">
      <LabProse>
        <p className="text-lg leading-relaxed text-foreground">{data.lead}</p>
      </LabProse>

      {/* Translation split: the formula (tap + say) on the left, the wave it makes
          plus its sliders and live substitution on the right. Stacks below lg. */}
      <LabSplit
        start={
          <div className="space-y-6">
            {/* The formula itself: tap a symbol to learn it, then hear how to say it. */}
            <div className="rounded-2xl border-2 border-primary/30 bg-card p-4 sm:p-5">
              <MathFormula tokens={data.formula} parts={data.parts} />
            </div>
            <FormulaSayItAloud label={data.sayLabel} chunks={data.sayChunks} />
            {/* Guided quest tucked under the formula so the short left column fills the
                height of the taller wave column beside it. */}
            <GuidedGoals
              label={data.challengeLead}
              intro="Use the sliders to change the wave, one goal at a time."
              goals={data.goals}
              doneIds={doneGoals}
              allDoneText="You changed amplitude, frequency, and phase, the three things that shape one pure tone."
            />
          </div>
        }
        end={
          <ToneFormulaGraph A={A} f={f} phi={phi} t={t} label={data.graphLabel} playLabel={data.graphPlayLabel} canvasClassName="h-44 lg:h-52">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-link">{data.calcLead}</p>
        <div className="space-y-2.5">
          {data.vars.map((v) => (
            <label key={v.id} className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex w-28 shrink-0 items-baseline gap-1">
                <span className="font-serif text-base font-semibold italic" style={{ color: v.color }}>
                  {v.id === "phi" ? "φ" : v.id}
                </span>
                <span className="font-mono text-foreground">{fmt(v.id)}</span>
                {v.unit ? <span className="text-xs">{v.unit}</span> : null}
              </span>
              <input
                type="range"
                min={v.min}
                max={v.max}
                step={v.step}
                value={vals[v.id]}
                onChange={(e) => setVal(v.id, Number(e.target.value))}
                className="flex-1 accent-[var(--primary)]"
                aria-label={`Value of ${v.id === "phi" ? "phase" : v.id}`}
              />
            </label>
          ))}
        </div>

        {/* Live substitution */}
        <div aria-live="polite" className="mt-4 overflow-x-auto rounded-lg bg-muted px-3 py-2 font-mono text-sm">
          <span className="text-muted-foreground">y(t) = </span>
          <span style={{ color: COLOR.A }}>{A.toFixed(2)}</span>
          <span className="text-muted-foreground"> · sin(2π · </span>
          <span style={{ color: COLOR.f }}>{Math.round(f)}</span>
          <span className="text-muted-foreground"> · </span>
          <span style={{ color: COLOR.t }}>{t.toFixed(4)}</span>
          <span className="text-muted-foreground"> + </span>
          <span style={{ color: COLOR.phi }}>{phi.toFixed(2)}</span>
          <span className="text-muted-foreground">) = </span>
          <span className="font-semibold text-foreground">{y.toFixed(2)}</span>
          <span className="mt-1 block text-xs text-muted-foreground">
            sin({arg.toFixed(2)}) = {s.toFixed(2)}
          </span>
        </div>
            <div className="mt-3">
              <AudioControls engine={engine} />
            </div>
          </ToneFormulaGraph>
        }
      />

      {/* Takeaway spans the full width beneath both columns. */}
      <div className="rounded-2xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-5">
        <p className="text-sm leading-relaxed text-foreground">
          <RichText text={data.insight} />
        </p>
      </div>
    </div>
  );
}
