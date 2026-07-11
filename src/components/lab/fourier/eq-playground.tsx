"use client";

import * as React from "react";
import { Play, Square, RotateCcw } from "lucide-react";
import { RichText } from "@/components/lab/rich-text";
import { useAudioEngineContext, AudioControls } from "@/components/lab/audio/audio-context";
import { Spectrum } from "@/components/lab/audio/visualizers";
import { LabProse, LabRail } from "./lab-layout";
import { GuidedGoals } from "./guided-goals";
import { fourierLab } from "@/data/fourier-lab";

const data = fourierLab.slides.eq;

type Chain = { osc: OscillatorNode; pre: GainNode; filters: BiquadFilterNode[] };

/** Your EQ: a 3-band BiquadFilter chain on a rich sawtooth tone, feeding the
 *  engine's master (so the analyser shows the tilt). Boost or cut bass, mids, or
 *  treble and hear plus see the spectrum change. */
export function EqPlayground() {
  const engine = useAudioEngineContext();
  const [gains, setGains] = React.useState<Record<string, number>>({ low: 0, mid: 0, high: 0 });
  const [playing, setPlaying] = React.useState(false);
  const chainRef = React.useRef<Chain | null>(null);

  // Each scenario auto-solves when its band crosses the threshold, so all three read
  // as a guided quest that lights up rather than a one-at-a-time picker.
  const doneScenarios = React.useMemo(() => {
    const done = new Set<string>();
    for (const sc of data.scenarios) {
      const g = gains[sc.band];
      if (sc.dir === "up" ? g >= 4 : g <= -4) done.add(sc.id);
    }
    return done;
  }, [gains]);

  const stop = React.useCallback(() => {
    const c = chainRef.current;
    if (c) {
      try {
        c.osc.stop();
      } catch {
        // already stopped
      }
      c.osc.disconnect();
      c.pre.disconnect();
      c.filters.forEach((f) => f.disconnect());
    }
    chainRef.current = null;
    setPlaying(false);
  }, []);

  const start = React.useCallback(() => {
    const ctx = engine.ensure();
    const master = engine.master();
    if (!ctx || !master) return;
    const osc = ctx.createOscillator();
    osc.type = "sawtooth"; // rich harmonics across bass, mids, and treble
    osc.frequency.value = data.baseFreq;
    const pre = ctx.createGain();
    pre.gain.value = 0.12;
    const low = ctx.createBiquadFilter();
    low.type = "lowshelf";
    low.frequency.value = data.bands[0].freq;
    low.gain.value = gains.low;
    const mid = ctx.createBiquadFilter();
    mid.type = "peaking";
    mid.frequency.value = data.bands[1].freq;
    mid.Q.value = 1;
    mid.gain.value = gains.mid;
    const high = ctx.createBiquadFilter();
    high.type = "highshelf";
    high.frequency.value = data.bands[2].freq;
    high.gain.value = gains.high;
    osc.connect(pre);
    pre.connect(low);
    low.connect(mid);
    mid.connect(high);
    high.connect(master);
    osc.start();
    chainRef.current = { osc, pre, filters: [low, mid, high] };
    setPlaying(true);
  }, [engine, gains]);

  React.useEffect(() => () => stop(), [stop]);

  const setBand = (band: "low" | "mid" | "high", db: number) => {
    setGains((g) => ({ ...g, [band]: db }));
    const c = chainRef.current;
    const ctx = engine.context();
    if (c && ctx) {
      const idx = band === "low" ? 0 : band === "mid" ? 1 : 2;
      c.filters[idx].gain.setTargetAtTime(db, ctx.currentTime, 0.02);
    }
  };

  const reset = () => {
    (["low", "mid", "high"] as const).forEach((b) => setBand(b, 0));
  };

  return (
    <div className="lesson-stagger space-y-6">
      <LabProse>
        <p className="text-lg leading-relaxed text-foreground">
          <RichText text={data.lead} />
        </p>
        <p className="text-base leading-relaxed text-muted-foreground">{data.instruction}</p>
      </LabProse>

      <LabRail
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
                {playing ? "Stop" : data.playLabel}
              </button>
              <AudioControls engine={engine} />
            </div>

            <Spectrum engine={engine} active={playing} redrawKey={`${playing}-${gains.low}-${gains.mid}-${gains.high}`} bars={56} displayBins={320} className="h-48 sm:h-56" />
            <p className="mt-1 text-center text-xs text-muted-foreground">Spectrum, bass on the left to treble on the right</p>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {data.bands.map((b) => {
                const bandLabel = b.id === "low" ? data.bassLabel : b.id === "mid" ? data.midLabel : data.trebleLabel;
                return (
                  <label key={b.id} className="flex flex-col gap-1 text-sm text-muted-foreground">
                    <span className="flex items-center justify-between font-medium text-foreground">
                      {bandLabel}
                      <span className="font-mono text-xs text-link">
                        {gains[b.id] > 0 ? "+" : ""}
                        {gains[b.id]} dB
                      </span>
                    </span>
                    <input
                      type="range"
                      min={-12}
                      max={12}
                      step={1}
                      value={gains[b.id]}
                      onChange={(e) => setBand(b.id as "low" | "mid" | "high", Number(e.target.value))}
                      className="accent-[var(--primary)]"
                      aria-label={`${bandLabel} in decibels`}
                    />
                  </label>
                );
              })}
            </div>
            <div className="mt-3">
              <button
                type="button"
                onClick={reset}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <RotateCcw aria-hidden="true" className="size-4" /> {data.resetLabel}
              </button>
            </div>
          </div>
        }
        aside={
          <>
            <GuidedGoals
              label={data.challengeLead}
              intro="Adjust the band that matches each problem, then listen for the change."
              goals={data.scenarios.map((sc) => ({ id: sc.id, text: `${sc.problem} ${sc.goal}` }))}
              doneIds={doneScenarios}
              allDoneText="You fixed all three: bass for weight, treble for smoothness, mids for vocal presence."
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
