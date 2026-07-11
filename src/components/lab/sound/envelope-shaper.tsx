"use client";

import * as React from "react";
import { Play } from "lucide-react";
import { RichText } from "@/components/lab/rich-text";
import { useAudioEngineContext, AudioControls } from "@/components/lab/audio/audio-context";
import { LabProse, LabRail } from "@/components/lab/fourier/lab-layout";
import { GuidedGoals } from "@/components/lab/fourier/guided-goals";
import { GraphAxes } from "@/components/lab/fourier/graph-axes";
import { soundLab } from "@/data/sound-lab";

const data = soundLab.slides.envelope;
const TONE_FREQ = 330;

const GOALS = [
  { id: "pluck", text: "Make a pluck: a fast, sharp start and a quick fade." },
  { id: "pad", text: "Make a pad: a slow swell that holds." },
] as const;

/** Sound P6: shape a sound's attack and decay and hear a pluck vs a pad. The
 *  envelope is drawn AROUND a faint waveform, so the outline visibly shapes the
 *  loudness over time. Pluck/pad show as a guided quest. */
export function EnvelopeShaper() {
  const engine = useAudioEngineContext();
  const [attack, setAttack] = React.useState(0.005);
  const [decay, setDecay] = React.useState(0.25);
  const [done, setDone] = React.useState<Set<string>>(() => new Set());

  const markDone = (id: string) => setDone((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  const evalGoals = (a: number, d: number) => {
    if (a <= 0.05 && d <= 0.4) markDone("pluck");
    if (a >= 0.4 && d >= 1.0) markDone("pad");
  };

  const play = React.useCallback(
    (a = attack, d = decay) => {
      engine.ensure();
      engine.playTone({ freq: TONE_FREQ, type: "triangle", gain: 0.8, duration: a + d, env: { attack: a, decay: d, sustain: 0, release: 0.04 } });
    },
    [engine, attack, decay],
  );

  const changeAttack = (a: number) => {
    setAttack(a);
    evalGoals(a, decay);
  };
  const changeDecay = (d: number) => {
    setDecay(d);
    evalGoals(attack, d);
  };
  const applyPreset = (p: { attack: number; decay: number }) => {
    setAttack(p.attack);
    setDecay(p.decay);
    evalGoals(p.attack, p.decay);
    play(p.attack, p.decay);
  };

  // The envelope outline and the waveform it wraps. viewBox 0 0 100 62, mid y = 31.
  const { wave, top, bot } = React.useMemo(() => {
    const total = attack + decay;
    const axFrac = total > 0 ? attack / total : 0; // fraction of width spent rising
    const env = (p: number) => {
      if (p <= axFrac) return axFrac > 0 ? p / axFrac : 1;
      const rem = 1 - axFrac;
      return rem > 0 ? 1 - (p - axFrac) / rem : 0;
    };
    const N = 140;
    const amp = 24;
    const cycles = 9;
    let w = "";
    let t = "";
    let b = "";
    for (let i = 0; i <= N; i++) {
      const p = i / N;
      const x = (p * 100).toFixed(2);
      const e = env(p);
      const cmd = i === 0 ? "M" : "L";
      w += `${cmd}${x} ${(31 - e * amp * Math.sin(p * cycles * 2 * Math.PI)).toFixed(2)} `;
      t += `${cmd}${x} ${(31 - e * amp).toFixed(2)} `;
      b += `${cmd}${x} ${(31 + e * amp).toFixed(2)} `;
    }
    return { wave: w, top: t, bot: b };
  }, [attack, decay]);

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
                onClick={() => play()}
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Play aria-hidden="true" className="size-4 fill-current" /> {data.playLabel}
              </button>
              <AudioControls engine={engine} />
            </div>

            <GraphAxes yLabel="Pressure / loudness" xLabel="Time" ticks={0}>
              <svg viewBox="0 0 100 62" preserveAspectRatio="none" className="h-28 w-full rounded-lg border border-border bg-background sm:h-36" role="img" aria-label="An envelope outline shaping a waveform: it rises over the attack, then falls over the decay.">
                <line x1="0" y1="31" x2="100" y2="31" stroke="var(--border)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <path d={wave} fill="none" stroke="var(--primary)" strokeWidth="1" strokeOpacity="0.45" vectorEffect="non-scaling-stroke" />
                <path d={top} fill="none" stroke="var(--primary)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                <path d={bot} fill="none" stroke="var(--primary)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              </svg>
            </GraphAxes>

            <p aria-live="polite" className="mt-2 text-sm font-medium text-foreground">
              Attack {Math.round(attack * 1000)} ms, decay {Math.round(decay * 1000)} ms.
            </p>

            <div className="mt-4 space-y-3">
              <label className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="w-16 font-medium">Attack</span>
                <input type="range" min={0.005} max={1.2} step={0.005} value={attack} onChange={(e) => changeAttack(Number(e.target.value))} className="flex-1 accent-[var(--primary)]" aria-label="Attack time (instant start to slow start)" />
              </label>
              <label className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="w-16 font-medium">Decay</span>
                <input type="range" min={0.05} max={2} step={0.01} value={decay} onChange={(e) => changeDecay(Number(e.target.value))} className="flex-1 accent-[var(--primary)]" aria-label="Decay time (short fade to long fade)" />
              </label>
              <div className="flex flex-wrap gap-2">
                {data.presets.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        }
        aside={
          <>
            <GuidedGoals label="Try it" intro="Drag the two handles, or start from a preset." goals={GOALS} doneIds={done} allDoneText="You shaped both: a pluck jumps and fades, a pad swells and holds. That is envelope." />
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
