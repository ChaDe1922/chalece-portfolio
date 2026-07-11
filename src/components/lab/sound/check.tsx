"use client";

import * as React from "react";
import { PenLine, Check as CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeck } from "@/components/deck/deck-context";
import { useAudioEngineContext } from "@/components/lab/audio/audio-context";
import { EarTraining } from "@/components/lab/assessment/ear-training";
import { MatchPairs } from "@/components/lab/assessment/match-pairs";
import { MatchSound } from "@/components/lab/sound/match-sound";
import { soundLab } from "@/data/sound-lab";
import type { WaveType } from "@/components/lab/audio/use-audio-engine";

const data = soundLab.slides.check;
// Five skills, matching data.badges: hear pitch, name shape, match controls, build a
// mystery sound, explain timbre (self-marked). The old standalone waveform MCQ is not
// part of the five and is not shown.
const REQUIRED = ["heardPitch", "namedShape", "matchedControls", "builtMystery", "explainedTimbre"] as const;

/** The graded check (challenge mode): five skill checks by ear, by match, by build,
 *  and one self-marked reflection. Gates the deck once all five are checked, and
 *  shows a badge row that lights up as each skill lands. */
export function Check() {
  const deck = useDeck();
  const engine = useAudioEngineContext();
  const [solved, setSolved] = React.useState<Record<string, boolean>>({});
  const [reflection, setReflection] = React.useState("");
  const [showRubric, setShowRubric] = React.useState(false);

  const mark = (id: string, v: boolean) => setSolved((p) => (p[id] === v ? p : { ...p, [id]: v }));
  const onEar1 = React.useCallback((v: boolean) => mark("heardPitch", v), []);
  const onEar2 = React.useCallback((v: boolean) => mark("namedShape", v), []);
  const onPairs = React.useCallback((v: boolean) => mark("matchedControls", v), []);
  const onGame = React.useCallback((v: boolean) => mark("builtMystery", v), []);

  const allDone = REQUIRED.every((k) => solved[k]);
  React.useEffect(() => {
    if (allDone) deck.markComplete(data.id);
  }, [allDone, deck]);

  const solvedCount = REQUIRED.filter((k) => solved[k]).length;

  const playTwoNotes = () => {
    engine.ensure();
    engine.playTone({ freq: data.earHigherLower.lowFreq, type: "sine", gain: 0.8, duration: 0.5 });
    window.setTimeout(() => engine.playTone({ freq: data.earHigherLower.highFreq, type: "sine", gain: 0.8, duration: 0.5 }), 700);
  };
  const playShape = () => {
    engine.ensure();
    engine.playTone({ freq: 330, type: data.earShape.targetType as WaveType, gain: 0.8, duration: 0.7 });
  };

  return (
    <div className="lesson-stagger space-y-5">
      <p className="text-lg leading-relaxed text-muted-foreground">{data.intro}</p>

      {/* Skill badges */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <p aria-live="polite" className="text-sm font-medium text-foreground">
          {data.progressLead}: {solvedCount} of {data.badges.length}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {data.badges.map((b) => {
            const on = Boolean(solved[b.id]);
            return (
              <span
                key={b.id}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
                  on ? "border-emerald-300 bg-emerald-50/60 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200" : "border-border bg-background text-muted-foreground",
                )}
              >
                {on ? <CheckIcon aria-hidden="true" className="size-3" /> : null}
                {b.label}
              </span>
            );
          })}
        </div>
      </div>

      <EarTraining
        label={data.earHigherLower.label}
        prompt={data.earHigherLower.prompt}
        playLabel={data.earHigherLower.playLabel}
        onPlay={playTwoNotes}
        options={data.earHigherLower.options}
        objective={data.earHigherLower.objective}
        onSolved={onEar1}
      />

      <EarTraining
        label={data.earShape.label}
        prompt={data.earShape.prompt}
        playLabel={data.earShape.playLabel}
        onPlay={playShape}
        options={data.earShape.options}
        objective={data.earShape.objective}
        onSolved={onEar2}
      />

      <MatchPairs label={data.matchPairs.label} prompt={data.matchPairs.prompt} pairs={data.matchPairs.pairs} onSolved={onPairs} />

      <MatchSound onSolved={onGame} />

      {/* Reflection (self-marked, counts as the fifth skill) */}
      <div className="rounded-2xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-5 sm:p-6">
        <div className="mb-3 flex items-center gap-2">
          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-link">
            <PenLine aria-hidden="true" className="size-4" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide text-link">Explain timbre</span>
        </div>
        <label htmlFor="reflection" className="text-base font-medium text-foreground">
          {data.reflection.prompt}
        </label>
        <textarea
          id="reflection"
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          rows={3}
          placeholder={data.reflection.placeholder}
          className="mt-3 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {showRubric ? (
          <div className="mt-3 space-y-3">
            <p className="text-sm text-muted-foreground">{data.reflection.instruction}</p>
            <ul className="space-y-2">
              {data.reflection.rubric.map((r) => (
                <li key={r.level} className="rounded-lg border border-border bg-card p-3">
                  <span className="text-sm font-semibold text-link">{r.level}</span>
                  <p className="mt-0.5 text-sm text-muted-foreground">{r.criteria}</p>
                </li>
              ))}
            </ul>
            {solved.explainedTimbre ? (
              <p className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50/60 px-3 py-1.5 text-sm font-medium text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200">
                <CheckIcon aria-hidden="true" className="size-3.5" /> Marked as explained.
              </p>
            ) : (
              <button
                type="button"
                onClick={() => mark("explainedTimbre", true)}
                className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {data.reflectionMarkLabel}
              </button>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowRubric(true)}
            disabled={reflection.trim().length === 0}
            className="mt-3 inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40"
          >
            Check it against the rubric
          </button>
        )}
      </div>

      {allDone ? (
        <p className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
          All five skills checked. You can read and shape a sound.
        </p>
      ) : null}
    </div>
  );
}
