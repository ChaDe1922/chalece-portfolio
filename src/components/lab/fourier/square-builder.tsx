"use client";

import * as React from "react";
import { Play, Plus, RotateCcw, Sparkles, Square } from "lucide-react";
import { RichText } from "@/components/lab/rich-text";
import { useAudioEngineContext, AudioControls } from "@/components/lab/audio/audio-context";
import { fourierLab } from "@/data/fourier-lab";
import { PartialGraphs } from "./partial-graphs";
import { MathFormula } from "./math-formula";
import { FormulaSayItAloud } from "./formula-say-it-aloud";
import { CheckpointDivider } from "./checkpoint-divider";
import { SortColumns } from "./sort-columns";
import { LabProse, LabRail } from "./lab-layout";
import { useAdditiveVoice } from "./use-additive-voice";

const data = fourierLab.slides.square;
const ODDS = data.oddHarmonics;
const MAX_LEN = ODDS[ODDS.length - 1]; // highest harmonic number, for bar positions

type PlayingWhat = null | "pure" | "square" | "build";

/** Square waves: add odd harmonics (amp 1/n) one at a time (or auto-build) and watch
 *  a square wave build itself out of smooth sines. Every play button toggles to Stop.
 *  Includes the clickable recipe with pronunciation, and an odd-vs-even sort check. */
export function SquareBuilder() {
  const engine = useAudioEngineContext();
  const voice = useAdditiveVoice(engine, data.baseFreq, "p3");
  const [count, setCount] = React.useState(1); // how many odd harmonics are in
  const [playingWhat, setPlayingWhat] = React.useState<PlayingWhat>(null);
  const autoRef = React.useRef(0);

  const includedOdds = ODDS.slice(0, count);
  const amps = React.useMemo(() => {
    const arr = Array.from({ length: MAX_LEN }, () => 0);
    for (const h of ODDS.slice(0, count)) arr[h - 1] = 1 / h;
    return arr;
  }, [count]);

  const partialsFor = (c: number) => ODDS.slice(0, c).map((h) => ({ mult: h, gain: 1 / h }));

  const stopAuto = () => {
    if (autoRef.current) window.clearInterval(autoRef.current);
    autoRef.current = 0;
  };

  const stopAll = () => {
    stopAuto();
    voice.stop();
    setPlayingWhat(null);
  };

  const playPure = () => {
    if (playingWhat === "pure") return stopAll();
    stopAuto();
    voice.play([{ mult: 1, gain: 1 }]);
    setPlayingWhat("pure");
  };

  const playSquare = () => {
    if (playingWhat === "square") return stopAll();
    stopAuto();
    voice.play(ODDS.map((h) => ({ mult: h, gain: 1 / h })));
    setPlayingWhat("square");
  };

  const buildToggle = () => {
    if (playingWhat === "build") return stopAll();
    stopAuto();
    voice.play(partialsFor(count));
    setPlayingWhat("build");
  };

  const addNext = () => {
    if (count >= ODDS.length) return;
    stopAuto();
    const next = count + 1;
    setCount(next);
    voice.play(partialsFor(next));
    setPlayingWhat("build");
  };

  const reset = () => {
    stopAuto();
    setCount(1);
    if (playingWhat) voice.update([{ mult: 1, gain: 1 }]);
  };

  // "Watch it build": step from H1 up to the full odd stack on a timer.
  const watchBuild = () => {
    stopAuto();
    setCount(1);
    voice.play(partialsFor(1));
    setPlayingWhat("build");
    let c = 1;
    autoRef.current = window.setInterval(() => {
      c += 1;
      if (c > ODDS.length) {
        stopAuto();
        return;
      }
      setCount(c);
      voice.update(partialsFor(c));
    }, 950);
  };

  React.useEffect(() => () => stopAuto(), []);

  const oddEvenCards = data.challengeBars.map((h) => ({ id: `h${h}`, label: `H${h}`, column: h % 2 === 1 ? "belongs" : "silent" }));

  return (
    <div className="lesson-stagger space-y-6">
      <LabProse>
        <p className="text-lg leading-relaxed text-foreground">
          <RichText text={data.lead} />
        </p>
        <p className="text-base font-semibold leading-relaxed text-foreground">{data.question}</p>
      </LabProse>

      <figure className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-4 sm:p-5">
        <svg viewBox="0 0 360 140" className="h-auto w-full" role="img" aria-label="A square wave: the signal holds a high level, then jumps straight down to a low level, then back up, with sharp vertical edges and flat tops and bottoms, repeating over time.">
          <line x1="8" y1="70" x2="352" y2="70" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M16 110 L16 30 L72 30 L72 110 L128 110 L128 30 L184 30 L184 110 L240 110 L240 30 L296 30 L296 110 L344 110" fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinejoin="miter" strokeLinecap="square" />
        </svg>
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">A square wave: high, low, high, low, with sharp vertical edges.</figcaption>
      </figure>

      <LabRail
        main={
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
            <p className="font-heading text-base font-semibold text-foreground">{data.buildLead}</p>
            <p className="mt-1 mb-4 text-sm leading-relaxed text-muted-foreground">{data.instruction}</p>
            <div className="mb-3 flex items-center justify-between gap-3">
              <button type="button" onClick={buildToggle} aria-pressed={playingWhat === "build"} className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {playingWhat === "build" ? <Square aria-hidden="true" className="size-4 fill-current" /> : <Play aria-hidden="true" className="size-4 fill-current" />}
                {playingWhat === "build" ? "Stop" : "Play"}
              </button>
              <AudioControls engine={engine} />
            </div>

            <PartialGraphs amps={amps} view="both" layered className="[&_canvas]:h-44 lg:[&_canvas]:h-52" />

            <p aria-live="polite" className="mt-3 text-sm font-medium text-foreground">
              {count === 1 ? "Just the fundamental, a pure sine." : `Odd harmonics through ${includedOdds[includedOdds.length - 1]}: ${includedOdds.join(", ")}.`}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={addNext} disabled={count >= ODDS.length} className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40">
                <Plus aria-hidden="true" className="size-4" /> {data.addLabel}
              </button>
              <button type="button" onClick={watchBuild} className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Sparkles aria-hidden="true" className="size-4" /> {data.autoBuildLabel}
              </button>
              {count > 1 ? (
                <button type="button" onClick={reset} className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <RotateCcw aria-hidden="true" className="size-4" /> Reset
                </button>
              ) : null}
            </div>

            {/* Step-by-step */}
            <dl className="mt-5 space-y-3 border-t border-border pt-4">
              {data.steps.map((s) => (
                <div key={s.header}>
                  <dt className="text-sm font-semibold text-foreground">{s.header}</dt>
                  <dd className="text-sm leading-relaxed text-muted-foreground">
                    <RichText text={s.body} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        }
        aside={
          <>
            {/* Compare: pure tone vs full square */}
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
              <p className="font-heading text-base font-semibold text-foreground">{data.compareLead}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{data.compareNote}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button type="button" onClick={playPure} aria-pressed={playingWhat === "pure"} className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-semibold text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {playingWhat === "pure" ? <Square aria-hidden="true" className="size-4 fill-current" /> : <Play aria-hidden="true" className="size-4 fill-current" />}
                  {playingWhat === "pure" ? "Stop" : data.playPureLabel}
                </button>
                <button type="button" onClick={playSquare} aria-pressed={playingWhat === "square"} className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-semibold text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {playingWhat === "square" ? <Square aria-hidden="true" className="size-4 fill-current" /> : <Play aria-hidden="true" className="size-4 fill-current" />}
                  {playingWhat === "square" ? "Stop" : data.playSquareLabel}
                </button>
                <AudioControls engine={engine} />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{data.comparePrompt}</p>
            </div>

            {/* The pattern you built */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="font-heading text-base font-semibold text-foreground">{data.ruleLead}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                <RichText text={data.rule} />
              </p>
            </div>
          </>
        }
      />

      {/* The recipe formula, demoted to an optional dive: tap a piece to learn it,
          then hear how to say it. */}
      <details className="group rounded-2xl border-2 border-primary/30 bg-card p-5">
        <summary className="cursor-pointer font-heading text-base font-semibold text-foreground marker:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          {data.formulaLead}
        </summary>
        <p className="mb-3 mt-1 text-sm text-muted-foreground">{data.formulaNote}</p>
        <MathFormula tokens={data.formula} parts={data.parts} />
        <div className="mt-4">
          <FormulaSayItAloud label={data.sayLabel} chunks={data.sayChunks} />
        </div>
      </details>

      {/* Gibbs (optional deep dive) */}
      <details className="group rounded-2xl border border-border bg-card p-5">
        <summary className="cursor-pointer font-heading text-base font-semibold text-foreground marker:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          {data.gibbsLead}
        </summary>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          <RichText text={data.gibbs} />
        </p>
      </details>

      {/* Quick check: sort odd from even. */}
      <CheckpointDivider label={data.checkpointLabel} />
      <SortColumns
        label={data.challengeLead}
        prompt={data.challengePrompt}
        columns={data.oddEvenColumns}
        cards={oddEvenCards}
        successText={data.oddEvenSuccess}
        objective="Tell a square wave's harmonics from the silent ones."
      />

      <div className="rounded-2xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-5">
        <p className="text-sm leading-relaxed text-foreground">
          <RichText text={data.insight} />
        </p>
      </div>
    </div>
  );
}
