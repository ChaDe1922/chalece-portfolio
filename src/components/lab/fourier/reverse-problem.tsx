"use client";

import * as React from "react";
import { Play, Square } from "lucide-react";
import { RichText } from "@/components/lab/rich-text";
import { useAudioEngineContext, AudioControls } from "@/components/lab/audio/audio-context";
import { fourierLab } from "@/data/fourier-lab";
import { PartialGraphs } from "./partial-graphs";
import { PredictionSpectrum } from "./prediction-spectrum";
import { LabProse, LabRail } from "./lab-layout";
import { useAdditiveVoice, type Partial } from "./use-additive-voice";

const data = fourierLab.slides.reverse;
// The mystery sound's hidden pure tones, as harmonic-bin multiples of the base.
const components = [
  { bin: 3, amp: 1 },
  { bin: 7, amp: 0.7 },
];
const BASE = 220;
const MAX_BIN = Math.max(...components.map((c) => c.bin));

/** P5: motivate the reverse problem. Play a mystery sound and see only its
 *  waveform. Its recipe stays hidden until the test in P6 finds it. */
export function ReverseProblem() {
  const engine = useAudioEngineContext();
  const voice = useAdditiveVoice(engine, BASE, "p5");

  // Waveform-only amps (recipe hidden): components sit at their true bin positions.
  const amps = React.useMemo(() => {
    const arr = Array.from({ length: MAX_BIN }, () => 0);
    for (const c of components) arr[c.bin - 1] = c.amp;
    return arr;
  }, []);

  const partials: Partial[] = components.map((c) => ({ mult: c.bin, gain: c.amp }));
  const playing = voice.playing;

  return (
    <div className="lesson-stagger space-y-6">
      <LabProse>
        <p className="text-lg leading-relaxed text-foreground">
          <RichText text={data.lead} />
        </p>
        <p className="text-base leading-relaxed text-foreground">
          <RichText text={data.body} />
        </p>
        <p className="text-base leading-relaxed text-muted-foreground">{data.instruction}</p>
      </LabProse>

      <LabRail
        main={
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => (playing ? voice.stop() : voice.play(partials))}
                aria-pressed={playing}
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {playing ? <Square aria-hidden="true" className="size-4 fill-current" /> : <Play aria-hidden="true" className="size-4 fill-current" />}
                {playing ? "Stop" : data.mysteryLabel}
              </button>
              <AudioControls engine={engine} />
            </div>

            <PartialGraphs amps={amps} view="wave" waveLabel={data.inspectLabel} className="[&_canvas]:h-56 lg:[&_canvas]:h-64" />

            <p className="mt-3 text-sm font-medium text-foreground">A few pure tones are hiding in here. Which ones?</p>
          </div>
        }
        aside={
          <>
            <PredictionSpectrum label={data.challengeLead} prompt={data.challengePrompt} savedText={data.predictionSaved} />
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
