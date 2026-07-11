"use client";

import * as React from "react";
import { ArrowRight, Check } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useDeck } from "@/components/deck/deck-context";
import { useAudioEngineContext } from "@/components/lab/audio/audio-context";
import { CheckCard, SuccessCover } from "@/components/lab/assessment/card";
import { AssignLabels } from "@/components/lab/assessment/assign-labels";
import { MultipleChoice } from "@/components/lab/assessment/multiple-choice";
import { FindTheFrequency } from "@/components/lab/assessment/find-the-frequency";
import { MatchSpectrum } from "@/components/lab/assessment/match-spectrum";
import { MathFormula, type MathPart } from "@/components/lab/fourier/math-formula";
import { fourierLab } from "@/data/fourier-lab";

/** Part 4 challenge screens for Lesson 3, one task per screen. The gated ones mark
 *  their own completion so the deck's advance gate unlocks once the task is solved.
 *  Each component reads its own data key. */

/** Intro: lead in, then a button that advances to the first challenge. */
export function ChallengeIntro() {
  const deck = useDeck();
  const data = fourierLab.slides.challengeIntro;

  return (
    <div className="lesson-stagger space-y-6">
      <p className="text-lg leading-relaxed text-muted-foreground">{data.lead}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        {data.previews.map((pv, i) => (
          <div key={pv.title} className="rounded-2xl border border-border bg-card p-4">
            <p className="flex items-center gap-2 font-heading text-sm font-semibold text-foreground">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-xs text-primary">{i + 1}</span>
              {pv.title}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{pv.body}</p>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => deck.next()}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-heading text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {data.begin}
        <ArrowRight aria-hidden="true" className="size-5" />
      </button>
    </div>
  );
}

/** Challenge 1: find the hidden tone. Reuses FindTheFrequency. */
export function Game1Screen() {
  const deck = useDeck();
  const engine = useAudioEngineContext();
  const data = fourierLab.slides.game1;

  return (
    <div className="lesson-stagger space-y-5">
      <p className="text-lg leading-relaxed text-muted-foreground">{data.intro}</p>

      <FindTheFrequency
        label={data.label}
        prompt={data.prompt}
        engine={engine}
        hiddenFreq={data.hiddenFreq}
        min={data.min}
        max={data.max}
        tolerance={data.tolerance}
        playSoundLabel={data.playSoundLabel}
        lockLabel={data.lockLabel}
        revealLabel={data.revealLabel}
        success={data.success}
        objective={data.objective}
        onSolved={(ok) => {
          if (ok) deck.markComplete(data.id);
        }}
      />
    </div>
  );
}

/** Challenge 2: match the harmonic recipe. Reuses MatchSpectrum. */
export function Game2Screen() {
  const deck = useDeck();
  const engine = useAudioEngineContext();
  const data = fourierLab.slides.game2;

  return (
    <div className="lesson-stagger space-y-5">
      <p className="text-lg leading-relaxed text-muted-foreground">{data.intro}</p>

      <MatchSpectrum
        label={data.label}
        prompt={data.prompt}
        engine={engine}
        target={data.target}
        baseFreq={data.baseFreq}
        tolerance={data.tolerance}
        playTargetLabel={data.playTargetLabel}
        playYoursLabel={data.playYoursLabel}
        revealLabel={data.revealLabel}
        success={data.success}
        objective={data.objective}
        onSolved={(ok) => {
          if (ok) deck.markComplete(data.id);
        }}
      />
    </div>
  );
}

/** A small dot graph of the eight sampled points, with one sample highlighted. */
function SampleDots({ signal, highlight }: { signal: readonly number[]; highlight: number }) {
  const reduced = useReducedMotion();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

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

    const grid = getComputedStyle(canvas).getPropertyValue("--border").trim() || "#e3dfd8";
    const primary = getComputedStyle(canvas).getPropertyValue("--primary").trim() || "#6d5ae6";
    const muted = getComputedStyle(canvas).getPropertyValue("--muted-foreground").trim() || "#7a756c";
    const cy = h / 2;
    const padX = 14;
    const usable = w - padX * 2;

    // Zero line.
    ctx.strokeStyle = grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.stroke();

    // Smooth cosine curve behind the dots.
    ctx.strokeStyle = grid;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const steps = Math.max(2, Math.ceil(w));
    for (let s = 0; s <= steps; s++) {
      const frac = s / steps;
      const x = padX + frac * usable;
      const y = cy - Math.cos(frac * 2 * Math.PI) * (h * 0.36);
      if (s === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Dots.
    const n = signal.length;
    for (let i = 0; i < n; i++) {
      const x = padX + (n > 1 ? i / (n - 1) : 0) * usable;
      const y = cy - signal[i] * (h * 0.36);
      const isHi = i === highlight;
      ctx.beginPath();
      ctx.arc(x, y, isHi ? 7 : 4, 0, 2 * Math.PI);
      ctx.fillStyle = isHi ? primary : muted;
      ctx.globalAlpha = isHi ? 1 : 0.6;
      ctx.fill();
      ctx.globalAlpha = 1;
      if (isHi) {
        ctx.strokeStyle = primary;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 11, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  }, [signal, highlight]);

  React.useEffect(() => {
    draw();
    const onResize = () => draw();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // reduced is read only to keep the dependency honest; the sketch is static either way.
  }, [draw, reduced]);

  return <canvas ref={canvasRef} aria-hidden="true" className="h-32 w-full rounded-lg border border-border bg-background" />;
}

/** Challenge 3: complete one step of the calculation. Pick a value for each slot
 *  from the shared option set; check each against the slot's answer. */
export function SampleCalcReplay() {
  const deck = useDeck();
  const data = fourierLab.slides.sampleCalcReplay;

  const [filled, setFilled] = React.useState<Record<string, string>>({});
  const [status, setStatus] = React.useState("");

  const solved = data.slots.every((s) => filled[s.id] === s.answer);

  React.useEffect(() => {
    if (solved) deck.markComplete(data.id);
  }, [solved, deck, data.id]);

  const pick = (slotId: string, answer: string, value: string) => {
    setFilled((prev) => ({ ...prev, [slotId]: value }));
    if (value === answer) {
      setStatus(`That is right for ${slotId === "product" ? "the product" : slotId}.`);
    } else {
      setStatus("Not quite. Read the highlighted dot and try again.");
    }
  };

  if (solved) {
    return (
      <CheckCard label={data.title} solved>
        <SuccessCover objective={data.objective} rationale={data.success} />
      </CheckCard>
    );
  }

  return (
    <CheckCard label={data.title} solved={false}>
      <p className="text-base font-medium text-foreground">{data.lead}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{data.intro}</p>

      <div className="mt-4">
        <SampleDots signal={data.signal} highlight={data.highlightN} />
        <p className="mt-1 text-center text-xs font-medium text-muted-foreground">Sample n = {data.highlightN} is highlighted.</p>
      </div>

      <ul className="mt-4 space-y-3">
        {data.slots.map((slot) => {
          const current = filled[slot.id];
          const isRight = current === slot.answer;
          return (
            <li key={slot.id} className="rounded-lg border border-border bg-background p-3">
              <p className="mb-2 font-mono text-sm font-semibold text-foreground">{slot.label} =</p>
              <div className="flex flex-wrap gap-2">
                {data.options.map((opt) => {
                  const chosen = current === opt;
                  const showRight = chosen && isRight;
                  const showWrong = chosen && !isRight;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => pick(slot.id, slot.answer, opt)}
                      disabled={isRight}
                      aria-pressed={chosen}
                      aria-label={`Set ${slot.label} to ${opt}`}
                      className={[
                        "inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 font-mono text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none",
                        showRight
                          ? "border-emerald-300 bg-emerald-100/60 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200"
                          : showWrong
                            ? "border-destructive/50 bg-destructive/10 text-foreground"
                            : "border-border bg-card text-foreground hover:bg-muted",
                      ].join(" ")}
                    >
                      {showRight ? <Check aria-hidden="true" className="size-3.5" /> : null}
                      {opt}
                    </button>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ul>

      <p aria-live="polite" className="mt-3 min-h-5 text-sm text-muted-foreground">
        {status}
      </p>
    </CheckCard>
  );
}

/** Challenge 4: annotate the DFT formula by mapping plain-language labels onto its
 *  pieces. Builds a MathFormula with highlightable tokens, then uses AssignLabels.
 *  The k and N pieces live inside the test-wave token, so they are shown as named
 *  slots alongside the visible symbols. */
export function FormulaTranslator() {
  const data = fourierLab.slides.formulaTranslator;

  // Map each label's part to a readable symbol for the formula popovers and slots.
  const SYMBOL: Record<string, string> = {
    result: "X[k]",
    sum: "Σ",
    signal: "x[n]",
    test: "e^(-i 2πkn/N)",
    k: "k",
    N: "N",
  };

  // Minimal parts array so the formula tokens are clickable and color coded.
  const parts: MathPart[] = data.labels.map((l) => ({
    id: l.part,
    label: SYMBOL[l.part] ?? l.label,
    color: "#6d5ae6",
    desc: l.label,
    example: data.kn,
  }));

  // Slots are the formula pieces (by part id, including k and N); labels are the
  // plain-language chips. AssignLabels matches when slot.id === label.id, so both
  // are keyed on the part id.
  const slots = data.labels.map((l) => ({ id: l.part, label: SYMBOL[l.part] ?? l.label }));
  const labels = data.labels.map((l) => ({ id: l.part, label: l.label }));

  return (
    <div className="lesson-stagger space-y-5">
      <p className="text-lg leading-relaxed text-muted-foreground">{data.intro}</p>

      <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
        <MathFormula tokens={data.formula} parts={parts} />
      </div>

      <AssignLabels
        label={data.title}
        prompt={data.intro}
        slots={slots}
        labels={labels}
        successText={data.success}
        objective={data.objective}
        onSolved={() => {}}
      />
    </div>
  );
}

/** A simple response-curve sketch: boosted bass and treble, dipped mids. */
function ResponseCurveSketch() {
  const reduced = useReducedMotion();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

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

    const grid = getComputedStyle(canvas).getPropertyValue("--border").trim() || "#e3dfd8";
    const primary = getComputedStyle(canvas).getPropertyValue("--primary").trim() || "#6d5ae6";
    const cy = h / 2;

    ctx.strokeStyle = grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.stroke();

    // Bass lift on the left, mid dip in the center, treble lift on the right.
    ctx.strokeStyle = primary;
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    const steps = Math.max(2, Math.ceil(w));
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const bass = Math.exp(-((t - 0.05) ** 2) / (2 * 0.12 ** 2));
      const treble = Math.exp(-((t - 0.95) ** 2) / (2 * 0.12 ** 2));
      const midDip = -0.7 * Math.exp(-((t - 0.5) ** 2) / (2 * 0.14 ** 2));
      const db = bass + treble + midDip;
      const x = t * w;
      const y = cy - db * (h * 0.32);
      if (s === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }, []);

  React.useEffect(() => {
    draw();
    const onResize = () => draw();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [draw, reduced]);

  return (
    <div>
      <canvas ref={canvasRef} aria-hidden="true" className="h-28 w-full rounded-lg border border-border bg-background" />
      <p className="mt-1 flex justify-between text-xs text-muted-foreground">
        <span>Bass (boosted)</span>
        <span>Mids (dipped)</span>
        <span>Treble (boosted)</span>
      </p>
    </div>
  );
}

/** Challenge 5: diagnose a response curve and choose the fix. Reuses MultipleChoice. */
export function GearFix() {
  const deck = useDeck();
  const data = fourierLab.slides.gearFix;

  return (
    <div className="lesson-stagger space-y-5">
      <p className="text-lg leading-relaxed text-muted-foreground">{data.intro}</p>

      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <p className="text-sm leading-relaxed text-foreground">{data.scenario}</p>
        <div className="mt-3">
          <ResponseCurveSketch />
        </div>
      </div>

      <MultipleChoice
        label="Gear fix"
        data={{ prompt: data.prompt, options: data.options, objective: data.objective }}
        onSolved={(ok) => {
          if (ok) deck.markComplete(data.id);
        }}
      />
    </div>
  );
}
