"use client";

import * as React from "react";
import { Play, Square } from "lucide-react";
import { RichText } from "@/components/lab/rich-text";
import { useAudioEngineContext, AudioControls } from "@/components/lab/audio/audio-context";
import { CheckpointDivider } from "./checkpoint-divider";
import { BandDrag } from "./band-drag";
import { LabProse, LabRail } from "./lab-layout";
import { fourierLab } from "@/data/fourier-lab";

const data = fourierLab.slides.bands;
const NOTE_ID = "bands-sweep";
const MIN = data.min;
const MAX = data.max;

// Band fill colors (low = violet, high = coral), kept on brand.
const BAND_COLOR: Record<string, string> = {
  sub: "rgba(91, 69, 204, 0.18)",
  bass: "rgba(109, 90, 230, 0.18)",
  mid: "rgba(167, 139, 250, 0.20)",
  treble: "rgba(255, 107, 94, 0.20)",
};

const logPct = (f: number) => {
  const c = Math.min(MAX, Math.max(MIN, f));
  return ((Math.log(c) - Math.log(MIN)) / (Math.log(MAX) - Math.log(MIN))) * 100;
};
const STEPS = 1000;
const posToFreq = (pos: number) => MIN * Math.pow(MAX / MIN, pos / STEPS);
const freqToPos = (f: number) => Math.round((Math.log(f / MIN) / Math.log(MAX / MIN)) * STEPS);

/** Bass, mids, and treble. Sweep a tone low to high; a marker crosses labeled
 *  bands and shows where everyday sounds live. The x-axis of every EQ. */
export function FrequencyBands() {
  const engine = useAudioEngineContext();
  const [freq, setFreq] = React.useState<number>(data.defaultFreq);
  const [playing, setPlaying] = React.useState(false);

  const start = React.useCallback(
    (f = freq) => {
      engine.ensure();
      engine.noteOn(NOTE_ID, { freq: f, type: "sine", gain: 0.6 });
      setPlaying(true);
    },
    [engine, freq],
  );
  const stop = React.useCallback(() => {
    engine.noteOff(NOTE_ID);
    setPlaying(false);
  }, [engine]);

  React.useEffect(() => () => engine.noteOff(NOTE_ID), [engine]);

  const setFrequency = (f: number) => {
    setFreq(f);
    if (playing) engine.noteUpdate(NOTE_ID, { freq: f });
  };

  const activeBand = data.bands.find((b) => freq >= b.from && freq < b.to) ?? data.bands[data.bands.length - 1];

  return (
    <div className="lesson-stagger space-y-6">
      <LabProse>
        <p className="text-lg leading-relaxed text-foreground">
          <RichText text={data.lead} />
        </p>
        <p className="text-base leading-relaxed text-muted-foreground">{data.instruction}</p>
      </LabProse>

      <LabRail
        aside={
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <p className="text-sm font-medium text-foreground">{data.mapLead}</p>
        {/* An actual map: the three regions laid out on a low-to-high frequency axis. */}
        <div className="relative mt-2 h-24 w-full select-none overflow-hidden rounded-lg border border-border bg-background lg:h-28" aria-hidden="true">
          {data.bands.map((b) => {
            const left = logPct(Math.max(b.from, MIN));
            const right = logPct(Math.min(b.to, MAX));
            return (
              <div key={b.id} className="absolute inset-y-0 flex flex-col items-center justify-center border-l border-border/60 px-1 text-center" style={{ left: `${left}%`, width: `${right - left}%`, backgroundColor: BAND_COLOR[b.id] ?? "transparent" }}>
                <span className="text-xs font-semibold text-foreground">{b.label}</span>
                <span className="mt-0.5 hidden text-[10px] leading-tight text-muted-foreground sm:block">{b.note}</span>
              </div>
            );
          })}
        </div>
        <p className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>Low frequency</span>
          <span>High frequency</span>
        </p>

        <p className="mt-3 text-sm font-medium text-foreground">{data.regionsLead}</p>
        <ul className="mt-2 space-y-1.5">
          {data.regions.map((r) => (
            <li key={r.label} className="flex flex-wrap items-baseline gap-x-2 text-sm leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">{r.label}</span>
              <span>{r.range}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{data.regionsNote}</p>
          </div>
        }
        main={
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => (playing ? stop() : start())}
            aria-pressed={playing}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {playing ? <Square aria-hidden="true" className="size-4 fill-current" /> : <Play aria-hidden="true" className="size-4 fill-current" />}
            {playing ? data.stopLabel : data.playLabel}
          </button>
          <AudioControls engine={engine} />
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">{data.prompt}</p>

        {/* Band strip with everyday-sound markers and the live cursor. */}
        <div className="relative mt-2 h-28 w-full select-none rounded-lg border border-border bg-background lg:h-32" aria-hidden="true">
          {/* sound markers (above) */}
          {data.markers.map((m) => (
            <div key={m.label} className="absolute top-0 -translate-x-1/2" style={{ left: `${logPct(m.freq)}%` }}>
              <span className="block whitespace-nowrap rounded bg-card px-1 text-[10px] font-medium text-muted-foreground">{m.label}</span>
              <span className="mx-auto block h-2 w-px bg-muted-foreground/50" />
            </div>
          ))}
          {/* bands */}
          <div className="absolute inset-x-0 bottom-0 top-7 overflow-hidden rounded-b-lg">
            {data.bands.map((b) => {
              const left = logPct(Math.max(b.from, MIN));
              const right = logPct(Math.min(b.to, MAX));
              return (
                <div
                  key={b.id}
                  className="absolute inset-y-0 flex flex-col items-center justify-center border-l border-border/60 px-1 text-center"
                  style={{ left: `${left}%`, width: `${right - left}%`, backgroundColor: BAND_COLOR[b.id] ?? "transparent" }}
                >
                  <span className="text-xs font-semibold text-foreground">{b.label}</span>
                  <span className="mt-0.5 text-[10px] leading-tight text-muted-foreground">{b.note}</span>
                </div>
              );
            })}
            {/* live cursor */}
            <div className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-primary transition-[left] duration-75" style={{ left: `${logPct(freq)}%` }} />
          </div>
        </div>

        <p aria-live="polite" className="mt-3 text-sm font-medium text-foreground">
          {Math.round(freq)} Hz, in the <span className="text-link">{activeBand.label.toLowerCase()}</span>: {activeBand.note}.
        </p>

        <label className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
          <span className="w-12 font-medium">Low</span>
          <input
            type="range"
            min={0}
            max={STEPS}
            value={freqToPos(freq)}
            onChange={(e) => setFrequency(Math.round(posToFreq(Number(e.target.value))))}
            className="flex-1 accent-[var(--primary)]"
            aria-label={data.sweepLabel}
          />
          <span className="w-12 text-right font-medium">High</span>
        </label>
          </div>
        }
      />

      {/* Quick check: play each sound, watch its spectrum on the map, drag it home. */}
      <CheckpointDivider label={data.checkpointLabel} />
      <BandDrag
        label={data.challengeLead}
        prompt={data.challengePrompt}
        min={MIN}
        max={MAX}
        bands={data.bands}
        markers={data.markers}
        sounds={data.dragSounds}
        successText={data.dragSuccess}
        objective="Place sounds in bass, mids, and treble by their spectrum."
      />

      <div className="rounded-2xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-5">
        <p className="text-sm leading-relaxed text-foreground">
          <RichText text={data.insight} />
        </p>
      </div>
    </div>
  );
}
