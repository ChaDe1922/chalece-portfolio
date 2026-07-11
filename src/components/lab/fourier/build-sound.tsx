"use client";

import * as React from "react";
import { Check, Play, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { RichText } from "@/components/lab/rich-text";
import { useAudioEngineContext, AudioControls } from "@/components/lab/audio/audio-context";
import { usePlayable } from "@/components/lab/audio/use-playable";
import { PartialGraphs, harmonicColor } from "./partial-graphs";
import { useAdditiveVoice, type Partial } from "./use-additive-voice";
import { GuidedGoals } from "./guided-goals";
import { HarmonicStackDiagram } from "./harmonic-stack-diagram";
import { LabProse, LabRail } from "./lab-layout";
import { fourierLab } from "@/data/fourier-lab";

const data = fourierLab.slides.stack;
const N = data.harmonicCount;
const TARGET = data.target.slice(0, N);
const MATCH_TOL = 0.15; // per-harmonic closeness for "match the target recipe"

/** Energy in the upper harmonics (everything above the fundamental), the "brightness". */
const upperEnergy = (a: readonly number[]) => a.slice(1).reduce((s, v) => s + v, 0);

const partialsOf = (amps: readonly number[]): Partial[] => amps.map((g, i) => ({ mult: i + 1, gain: g }));
const termFreq = (i: number) => `2π${i === 0 ? "" : "·" + (i + 1)}f·t`;

/** "Build a sound from pure tones": additive synthesis as a live, explorable
 *  instrument. The recipe is a tappable formula, tap a term to select it (its sine
 *  highlights in the wave, its bar emphasizes, and an amount control appears), with
 *  synced H1-H6 sliders below and a separate tap-to-decode breakdown. */
export function BuildSound() {
  const engine = useAudioEngineContext();
  const voice = useAdditiveVoice(engine, data.baseFreq, "p2");
  const { playingId, toggle: toggleTarget } = usePlayable();
  const playing = voice.playing;
  const targetPlaying = playingId === "target";
  const playTarget = () =>
    toggleTarget("target", () => {
      engine.ensure();
      const partials = TARGET.map((g, i) => ({ freq: data.baseFreq * (i + 1), gain: g })).filter((p) => p.gain > 0.001);
      return engine.playPartials(partials, { duration: 1.4, env: { attack: 0.02, decay: 0.2, sustain: 0.7, release: 0.2 } });
    });
  const [amps, setAmps] = React.useState<number[]>(() => Array.from({ length: N }, (_, i) => (i === 0 ? 1 : 0)));
  const [selected, setSelected] = React.useState<number | null>(null);
  // One instrument, two jobs: freely build a sound, or match a target recipe. The
  // H1-H6 sliders are shared across both so they render exactly once.
  const [tab, setTab] = React.useState<"build" | "match">("build");
  // Goals complete in order: first raise the upper harmonics (brighter), then lower
  // them back (smoother). Tracked against the start state (only the fundamental).
  const [doneGoals, setDoneGoals] = React.useState<Set<string>>(() => new Set());
  const brightenedRef = React.useRef(false);

  const evaluateGoals = React.useCallback((next: readonly number[]) => {
    const upper = upperEnergy(next);
    setDoneGoals((prev) => {
      const out = new Set(prev);
      if (upper > 0.4) {
        brightenedRef.current = true;
        out.add("brighter");
      }
      // "smoother" only counts once it has first been made brighter, then quieted.
      if (brightenedRef.current && out.has("brighter") && upper < 0.15) out.add("smoother");
      return out;
    });
  }, []);

  // How close the current mix is to the target recipe (every harmonic within tol).
  const matchedTarget = amps.length === TARGET.length && amps.every((a, i) => Math.abs(a - TARGET[i]) <= MATCH_TOL);

  const toggle = () => {
    if (playing) voice.stop();
    else voice.play(partialsOf(amps));
  };

  const setHarmonic = (i: number, v: number) => {
    setSelected(i);
    setAmps((prev) => {
      const next = prev.slice();
      next[i] = v;
      voice.update(partialsOf(next));
      evaluateGoals(next);
      return next;
    });
  };

  const applyPreset = (next: readonly number[]) => {
    const a = next.slice(0, N) as number[];
    setSelected(null);
    setAmps(a);
    evaluateGoals(a);
    if (playing) voice.update(partialsOf(a));
    else voice.play(partialsOf(a));
  };

  const active = amps.map((a, i) => ({ a, i })).filter((t) => t.a > 0.02);
  const activeCount = active.length;

  return (
    <div className="lesson-stagger space-y-6">
      <LabProse>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-link">{data.thesis}</p>
        <p className="text-lg leading-relaxed text-foreground">
          <RichText text={data.lead} />
        </p>
        <div>
          <p className="text-base leading-relaxed text-muted-foreground">{data.instruction}</p>
          <ul className="mt-2 space-y-1">
            {data.bullets.map((bsx) => (
              <li key={bsx} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/50" />
                {bsx}
              </li>
            ))}
          </ul>
        </div>
      </LabProse>

      {/* What you are stacking: an interactive labeled harmonic stack, tucked into an
          optional dive so the instrument leads. */}
      <details className="group rounded-2xl border border-border bg-card p-5">
        <summary className="cursor-pointer font-heading text-base font-semibold text-foreground marker:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          {data.stackDiagramLead}
        </summary>
        <div className="mt-3">
          <HarmonicStackDiagram amps={data.stackDiagramAmps} terms={data.stackTerms} hint={data.stackDiagramHint} />
          <p className="mt-4 text-sm leading-relaxed text-foreground">{data.mixNote}</p>
        </div>
      </details>

      <LabRail
        main={
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={toggle}
                aria-pressed={playing}
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {playing ? <Square aria-hidden="true" className="size-4 fill-current" /> : <Play aria-hidden="true" className="size-4 fill-current" />}
                {playing ? "Stop" : data.playLabel}
              </button>
              <AudioControls engine={engine} />
            </div>

            <PartialGraphs amps={amps} view="both" layered highlight={selected} className="[&_canvas]:h-44 lg:[&_canvas]:h-52" />

            {/* Live tunable formula, given prominence as the heart of the instrument. */}
            <div className="mt-4 rounded-xl border-2 border-primary/30 bg-primary/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-link">{data.recipeLead}</p>
              <div className="mt-2 flex flex-wrap items-baseline gap-x-1.5 gap-y-2 overflow-x-auto font-mono text-base sm:text-lg">
                <span className="text-muted-foreground">y(t) =</span>
                {activeCount === 0 ? (
                  <span className="text-muted-foreground">0</span>
                ) : (
                  active.map(({ i }, k) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelected(i)}
                      aria-pressed={selected === i}
                      aria-label={`Tune harmonic ${i + 1}`}
                      className={cn(
                        "whitespace-nowrap rounded-md px-1.5 py-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        selected === i ? "bg-primary/15 ring-1 ring-primary/40" : "hover:bg-muted",
                      )}
                    >
                      {k > 0 ? <span className="text-muted-foreground">+ </span> : null}
                      <span style={{ color: harmonicColor(i, N) }}>{amps[i].toFixed(2)}</span>
                      <span className="text-muted-foreground">·sin({termFreq(i)})</span>
                    </button>
                  ))
                )}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                <RichText text={data.sinNote} />
              </p>

              {selected != null ? (
                <div className="mt-3 rounded-lg border border-primary/40 bg-primary/5 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-medium" style={{ color: harmonicColor(selected, N) }}>
                      Harmonic {selected + 1}
                      {selected === 0 ? " (fundamental)" : ""} · {(selected + 1) * data.baseFreq} Hz
                    </span>
                    <span className="font-mono text-sm text-foreground">amount {amps[selected].toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={amps[selected]}
                    onChange={(e) => setHarmonic(selected, Number(e.target.value))}
                    aria-label={`Amount of harmonic ${selected + 1}`}
                    className="mt-2 w-full accent-[var(--primary)]"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">Drag to change how much of this tone is in the mix. Its wave and bar respond as you go.</p>
                </div>
              ) : (
                <p className="mt-2 text-xs text-muted-foreground">{data.recipeHint}</p>
              )}
            </div>

            <p aria-live="polite" className="mt-3 text-sm font-medium text-foreground">
              {activeCount} {activeCount === 1 ? "harmonic" : "harmonics"} in the mix.
            </p>

            {/* One job at a time: build freely, or match a target. Modeled on the
                view toggle so the H1-H6 sliders below render exactly once. */}
            <div className="mt-4 inline-flex overflow-hidden rounded-lg border border-border" role="group" aria-label="Instrument mode">
              {(["build", "match"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setTab(m)}
                  aria-pressed={tab === m}
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                    tab === m ? "bg-primary text-primary-foreground" : "bg-background text-foreground hover:bg-muted",
                  )}
                >
                  {m === "build" ? "Build" : "Match the target"}
                </button>
              ))}
            </div>

            {/* Match mode: the faint target the current bars aim at. */}
            {tab === "match" ? (
              <div className="mt-4 rounded-xl border border-border bg-background p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-heading text-sm font-semibold text-foreground">{data.targetLabel}</p>
                  <button
                    type="button"
                    onClick={playTarget}
                    aria-pressed={targetPlaying}
                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {targetPlaying ? <Square aria-hidden="true" className="size-4 fill-current" /> : <Play aria-hidden="true" className="size-4 fill-current" />}
                    {targetPlaying ? "Stop" : "Play target"}
                  </button>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{data.targetPrompt}</p>
                <div className="mt-4 flex items-end gap-3" aria-hidden="true">
                  {TARGET.map((t, i) => {
                    const close = Math.abs(amps[i] - t) <= MATCH_TOL;
                    return (
                      <div key={i} className="flex flex-1 flex-col items-center gap-1">
                        <div className="relative flex h-32 w-full items-end justify-center">
                          <span className="absolute bottom-0 w-5 rounded-t" style={{ height: `${Math.max(4, t * 120)}px`, backgroundColor: harmonicColor(i, N), opacity: 0.25 }} />
                          <span className={cn("relative w-3 rounded-t", close ? "ring-2 ring-emerald-400" : "")} style={{ height: `${Math.max(2, amps[i] * 120)}px`, backgroundColor: harmonicColor(i, N) }} />
                        </div>
                        <span className="text-[11px] text-muted-foreground">H{i + 1}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {/* Shared H1-H6 sliders (render once). In match mode, each shows a check
                when its bar is within tolerance of the target. */}
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-link">{data.addLabel}</p>
            <div className="mt-2 space-y-2.5">
              {amps.map((a, i) => {
                const close = tab === "match" && Math.abs(a - TARGET[i]) <= MATCH_TOL;
                return (
                  <label key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex w-28 items-center gap-2 font-medium">
                      <span aria-hidden="true" className="size-3 shrink-0 rounded-full" style={{ backgroundColor: harmonicColor(i, N) }} />
                      {i === 0 ? "H1 (base)" : `H${i + 1}`}
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={a}
                      onChange={(e) => setHarmonic(i, Number(e.target.value))}
                      className="flex-1 accent-[var(--primary)]"
                      aria-label={`Harmonic ${i + 1} level`}
                    />
                    {tab === "match" ? (close ? <Check aria-hidden="true" className="size-4 shrink-0 text-emerald-500" /> : <span className="size-4 shrink-0" />) : null}
                  </label>
                );
              })}
            </div>

            {tab === "build" ? (
              <>
                {/* Presets */}
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-link">{data.presetLead}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {data.presets.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => applyPreset(p.amps)}
                      className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                <ul className="mt-3 space-y-1 text-xs leading-relaxed text-muted-foreground">
                  {data.characters.map((c) => (
                    <li key={c.label}>
                      <span className="font-medium text-foreground">{c.label}.</span> {c.body}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p aria-live="polite" className="mt-4 text-sm font-medium text-foreground">
                {matchedTarget ? "Matched. Your spectrum is close to the target across every harmonic." : "Drag each slider until your bar reaches its faint target."}
              </p>
            )}
          </div>
        }
        aside={
          <>
            {/* Guided quest: make it brighter, then smoother. */}
            <GuidedGoals
              label={data.challengeLead}
              intro="Use the harmonic sliders to meet each goal, one at a time."
              goals={data.goals}
              doneIds={doneGoals}
              allDoneText="Brighter, then smoother. The pitch never moved, only the recipe."
            />
            <div className="rounded-2xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-5">
              <p className="text-sm leading-relaxed text-foreground">
                <RichText text={data.insight} />
              </p>
            </div>
          </>
        }
      />
    </div>
  );
}
