"use client";

import * as React from "react";
import { Play, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { RichText } from "@/components/lab/rich-text";
import { useAudioEngineContext, AudioControls } from "@/components/lab/audio/audio-context";
import { fourierLab } from "@/data/fourier-lab";
import { PartialGraphs } from "./partial-graphs";
import { usePlayable } from "@/components/lab/audio/use-playable";
import { CheckpointDivider } from "./checkpoint-divider";
import { GraphAxes } from "./graph-axes";
import { SortLine } from "./sort-line";
import { SortColumns } from "./sort-columns";
import { MatchToSound } from "./match-to-sound";
import { SpectrumAnatomy } from "./spectrum-anatomy";
import { LabelTheSpectrum } from "./label-the-spectrum";
import { LabProse, LabRail } from "./lab-layout";

/** The three "two ways to see a sound" screens, split one-idea-per-screen:
 *  WaveformView (time), SpectrumView (frequency), BothViews (same sound, switch the
 *  view). Each is one shared instrument: pick a sound, play it, read the graph. */

/** Real CC0 recordings for each sound choice (all A4, so it is the same note in three
 *  timbres). The graphs stay computed; only the audio is a real sample. */
const SAMPLES: Record<string, string> = {
  pure: "/audio/pure-tone-a4.m4a",
  flute: "/audio/flute-a4.m4a",
  violin: "/audio/violin-a4.m4a",
};

type Sound = { id: string; label: string; amps: readonly number[] };

function Bullets({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-2 space-y-1.5">
      {items.map((it) => (
        <li key={it} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/50" />
          {it}
        </li>
      ))}
    </ul>
  );
}

/** Shared instrument: a sound picker + Play + the graph in a fixed or toggled view. */
function Instrument({
  sounds,
  prefix,
  chooseLabel,
  playLabel,
  mode,
  xLabel,
  yLabel,
  xLeft,
  xRight,
}: {
  sounds: readonly Sound[];
  baseFreq: number;
  prefix: string;
  chooseLabel: string;
  playLabel: string;
  mode: "wave" | "bars" | "both";
  xLabel?: string;
  yLabel?: string;
  xLeft?: string;
  xRight?: string;
}) {
  const engine = useAudioEngineContext();
  const { playingId, toggle: togglePlay, play } = usePlayable();
  const [soundId, setSoundId] = React.useState<string>(sounds[0].id);
  const [flip, setFlip] = React.useState<"wave" | "bars">("wave");
  const current = sounds.find((s) => s.id === soundId) ?? sounds[0];
  const amps = current.amps;
  const playing = playingId === prefix;
  const view = mode === "both" ? flip : mode;

  const starter = (id: string) => () => {
    engine.ensure();
    return engine.playSample(SAMPLES[id] ?? SAMPLES.flute, { gain: 0.9 });
  };
  const toggle = () => togglePlay(prefix, starter(soundId));
  const pickSound = (id: string) => {
    setSoundId(id);
    if (playing) play(prefix, starter(id));
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-pressed={playing}
          aria-label={playLabel}
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {playing ? <Square aria-hidden="true" className="size-4 fill-current" /> : <Play aria-hidden="true" className="size-4 fill-current" />}
          {playing ? "Stop" : playLabel}
        </button>
        {mode === "both" ? (
          <div className="inline-flex overflow-hidden rounded-lg border border-border" role="group" aria-label="View">
            {(["wave", "bars"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setFlip(v)}
                aria-pressed={flip === v}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                  flip === v ? "bg-primary text-primary-foreground" : "bg-background text-foreground hover:bg-muted",
                )}
              >
                {v === "wave" ? "Show waveform" : "Show spectrum"}
              </button>
            ))}
          </div>
        ) : null}
        <AudioControls engine={engine} />
      </div>

      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{chooseLabel}</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label={chooseLabel}>
        {sounds.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => pickSound(s.id)}
            aria-pressed={soundId === s.id}
            className={cn(
              "rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              soundId === s.id ? "border-primary bg-primary/10 text-link" : "border-border bg-background text-foreground hover:bg-muted",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {yLabel || xLabel || xLeft || xRight ? (
          <GraphAxes yLabel={yLabel} xLabel={xLabel} xLeft={xLeft} xRight={xRight}>
            <PartialGraphs amps={amps} view={view} className="[&_canvas]:h-56 lg:[&_canvas]:h-64" />
          </GraphAxes>
        ) : (
          <PartialGraphs amps={amps} view={view} className="[&_canvas]:h-56 lg:[&_canvas]:h-64" />
        )}
      </div>
    </div>
  );
}

export function WaveformView() {
  const d = fourierLab.slides.waveformView;
  const engine = useAudioEngineContext();
  const { playingId, toggle } = usePlayable();
  const playSound = (id: string) => {
    toggle(id, () => {
      engine.ensure();
      return engine.playSample(SAMPLES[id] ?? SAMPLES.flute, { gain: 0.9 });
    });
  };
  return (
    <div className="lesson-stagger space-y-6">
      <LabProse>
        <p className="text-lg leading-relaxed text-foreground">
          <RichText text={d.lead} />
        </p>
        <p className="text-sm font-medium text-foreground">{d.useLead}</p>
        <Bullets items={d.uses} />
        <p className="text-sm leading-relaxed text-muted-foreground">{d.note}</p>
        <p className="text-sm leading-relaxed text-muted-foreground">{d.interactionIntro}</p>
      </LabProse>

      <LabRail
        main={<Instrument sounds={d.sounds} baseFreq={d.baseFreq} prefix="v-wave" chooseLabel={d.chooseLabel} playLabel={d.playLabel} mode="wave" xLabel={d.xLabel} yLabel={d.yLabel} />}
        aside={<MatchToSound label={d.matchLead} intro={d.matchIntro} questions={d.matchQuestions} sounds={d.sounds} baseFreq={d.baseFreq} sampleUrls={SAMPLES} successText={d.matchSuccess} />}
      />

      <CheckpointDivider label={d.checkpointLabel} />
      <SortLine
        label={d.challengeLead}
        prompt={d.challengePrompt}
        items={d.sortItems}
        correctOrder={["pure", "flute", "violin"]}
        successText={d.sortFeedback}
        objective="Order waveforms from smoothest to most detailed."
        onPlayItem={playSound}
        playingId={playingId}
      />
      <div className="rounded-2xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-5">
        <p className="text-sm leading-relaxed text-foreground">{d.insight}</p>
      </div>
    </div>
  );
}

export function SpectrumView() {
  const d = fourierLab.slides.spectrumView;
  return (
    <div className="lesson-stagger space-y-6">
      <LabProse>
        <p className="text-lg leading-relaxed text-foreground">
          <RichText text={d.lead} />
        </p>
        <p className="text-sm font-medium text-foreground">{d.useLead}</p>
        <Bullets items={d.uses} />
        <p className="text-sm leading-relaxed text-muted-foreground">{d.note}</p>
        <p className="text-sm leading-relaxed text-muted-foreground">{d.interactionIntro}</p>
      </LabProse>

      <LabRail
        main={<Instrument sounds={d.sounds} baseFreq={d.baseFreq} prefix="v-spec" chooseLabel={d.chooseLabel} playLabel={d.playLabel} mode="bars" xLabel={d.xLabel} yLabel={d.yLabel} xLeft={d.xLow} xRight={d.xHigh} />}
        aside={
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
            <p className="mb-3 font-heading text-base font-semibold text-foreground">{d.anatomyLead}</p>
            <SpectrumAnatomy amps={d.anatomyAmps} readings={d.readings} hint={d.anatomyHint} />
          </div>
        }
      />

      <CheckpointDivider label={d.checkpointLabel} />
      <LabelTheSpectrum
        label={d.challengeLead}
        prompt={d.challengePrompt}
        amps={d.anatomyAmps}
        steps={d.labelSteps}
        successText={d.labelSuccess}
        objective="Read low, high, and strong on a spectrum."
      />

      <div className="rounded-2xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-5">
        <p className="text-sm leading-relaxed text-foreground">{d.insight}</p>
      </div>
    </div>
  );
}

export function BothViews() {
  const d = fourierLab.slides.bothViews;
  return (
    <div className="lesson-stagger space-y-6">
      <LabProse>
        <p className="text-lg leading-relaxed text-foreground">
          <RichText text={d.lead} />
        </p>
        <p className="text-base leading-relaxed text-muted-foreground">{d.leadB}</p>
      </LabProse>

      <LabRail
        main={<Instrument sounds={d.sounds} baseFreq={d.baseFreq} prefix="v-both" chooseLabel={d.chooseLabel} playLabel={d.playLabel} mode="both" />}
        aside={
          <>
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm font-semibold text-foreground">{d.waveformLead}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{d.waveformBody}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm font-semibold text-foreground">{d.spectrumLead}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{d.spectrumBody}</p>
            </div>
            {/* Takeaway rides in the rail beside the instrument so the aside fills the
                height of the tall main column instead of leaving an empty band. */}
            <div className="rounded-2xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-5">
              <p className="text-base font-medium leading-relaxed text-foreground">
                <RichText text={d.insight} />
              </p>
            </div>
          </>
        }
      />

      <p className="text-sm leading-relaxed text-muted-foreground">{d.interactionIntro}</p>
      <CheckpointDivider label={d.checkpointLabel} />
      <SortColumns
        label={d.challengeLead}
        prompt={d.challengePrompt}
        columns={d.buckets}
        cards={d.tasks.map((t) => ({ id: t.id, label: t.label, column: t.bucket }))}
        successText={d.insight}
        objective="Choose waveform or spectrum for a given question."
      />

      <p className="text-sm leading-relaxed text-muted-foreground">{d.transition}</p>
    </div>
  );
}
