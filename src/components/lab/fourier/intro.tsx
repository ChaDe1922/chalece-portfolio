"use client";

import * as React from "react";
import { ArrowRight, Check, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeck } from "@/components/deck/deck-context";
import { useAudioEngineContext, AudioControls } from "@/components/lab/audio/audio-context";
import { RichText } from "@/components/lab/rich-text";
import { WavesMark } from "@/components/lab/fourier/waves-mark";
import { PronounceWord } from "@/components/lab/pronounce-word";
import { fourierLab } from "@/data/fourier-lab";

const data = fourierLab.slides.intro;
const seriesPath = fourierLab.seriesPath;

type Choice = "same" | "different" | null;

/** Cover slide: hear the same note A as a flute-like and a violin-like tone, decide
 *  whether they sound the same or different (which unlocks the recipe idea), then
 *  read the goals and the four-stage path and begin. The buttons unlock audio
 *  (a real user gesture) via playSample/playPartials. */
export function Intro() {
  const deck = useDeck();
  const engine = useAudioEngineContext();
  const base = data.noteFreq;
  const [choice, setChoice] = React.useState<Choice>(null);

  const fluteAmps = [1, 0.25, 0.1, 0.05];
  const violinAmps = [1, 0.8, 0.6, 0.5, 0.35, 0.28];

  React.useEffect(() => {
    engine.preloadSamples([data.fluteSample, data.violinSample]);
  }, [engine]);

  // Play the real recording; fall back to the synthesized mix if it cannot load.
  const playInstrument = (kind: "flute" | "violin") => {
    engine.ensure();
    const url = kind === "flute" ? data.fluteSample : data.violinSample;
    const amps = kind === "flute" ? fluteAmps : violinAmps;
    const gain = kind === "violin" ? 0.8 : 0.95;
    void engine.playSample(url, { gain }).then((ok) => {
      if (ok) return;
      const partials = amps.map((g, i) => ({ freq: base * (i + 1), gain: g }));
      engine.playPartials(partials, { duration: 1.1, env: { attack: 0.02, decay: 0.2, sustain: 0.7, release: 0.2 } });
    });
  };

  const begin = () => {
    engine.ensure();
    engine.playTone({ freq: base, type: "sine", gain: 0.7, duration: 0.5, env: { attack: 0.01, decay: 0.4, sustain: 0, release: 0.1 } });
    deck.next();
  };

  return (
    <div className="lesson-stagger space-y-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-link">{data.meta}</p>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl space-y-3">
          <p className="text-base font-medium text-foreground">{data.subtitle}</p>
          {data.promise.map((p, i) => (
            <p key={i} className="text-lg leading-relaxed text-muted-foreground">
              <RichText text={p} />
            </p>
          ))}
          <p className="text-lg leading-relaxed text-muted-foreground">
            <RichText text={data.closer.boldLead} />{" "}
            <PronounceWord respelling={data.closer.respelling} src={data.closer.pronounceSrc} label={data.closer.pronounceLabel} />{" "}
            <RichText text={data.closer.rest} />
          </p>
        </div>
        <div className="shrink-0 self-center">
          <WavesMark />
        </div>
      </div>

      {/* Same note, different recipe: hear both, then decide. */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-foreground">{data.hearLead}</p>
          <AudioControls engine={engine} />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => playInstrument("flute")}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-semibold text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Play aria-hidden="true" className="size-4 fill-current" /> {data.fluteLabel}
          </button>
          <button
            type="button"
            onClick={() => playInstrument("violin")}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-semibold text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Play aria-hidden="true" className="size-4 fill-current" /> {data.violinLabel}
          </button>
        </div>

        <div className="mt-4 border-t border-border pt-4">
          <p className="text-sm font-medium text-foreground">{data.noticePrompt}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setChoice("same")}
              aria-pressed={choice === "same"}
              className={cn(
                "rounded-lg border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                choice === "same" ? "border-primary bg-primary/10 text-foreground" : "border-border bg-background text-foreground hover:bg-muted",
              )}
            >
              {data.choiceSame}
            </button>
            <button
              type="button"
              onClick={() => setChoice("different")}
              aria-pressed={choice === "different"}
              className={cn(
                "rounded-lg border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                choice === "different" ? "border-primary bg-primary/10 text-foreground" : "border-border bg-background text-foreground hover:bg-muted",
              )}
            >
              {data.choiceDifferent}
            </button>
          </div>

          <div aria-live="polite" className="mt-3 min-h-5 space-y-2">
            {choice === "different" ? (
              <>
                <p className="text-sm leading-relaxed text-foreground">{data.feedbackDifferent}</p>
                <p className="rounded-lg bg-primary/5 px-3 py-2 text-sm leading-relaxed text-foreground">
                  <RichText text={data.recipeReveal} />
                </p>
              </>
            ) : choice === "same" ? (
              <p className="text-sm leading-relaxed text-muted-foreground">{data.feedbackSame}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="font-heading text-base font-semibold text-foreground">{data.objectivesLead}</p>
        <ul className="lesson-stagger mt-3 space-y-2.5">
          {data.objectives.map((o) => (
            <li key={o} className="flex items-start gap-3 text-sm leading-relaxed text-foreground">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Check aria-hidden="true" className="size-3.5" />
              </span>
              {o}
            </li>
          ))}
        </ul>
      </div>

      {/* The four-stage path ahead, as a numbered list (descriptive, not the roadmap chips). */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-link">{data.roadmapLead}</p>
        <ol className="lesson-stagger mt-3 space-y-3">
          {seriesPath.map((stage) => (
            <li key={stage.n} className="flex items-start gap-3">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-semibold text-primary">
                {stage.n}
              </span>
              <span className="text-sm leading-relaxed text-foreground">
                <span className="font-semibold">{stage.name}.</span> <span className="text-muted-foreground">{stage.desc}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={begin}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-heading text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {data.begin}
          <ArrowRight aria-hidden="true" className="size-5" />
        </button>
        <p className="text-sm text-muted-foreground">{data.byline}</p>
      </div>
    </div>
  );
}
