"use client";

import { ArrowRight, Check } from "lucide-react";
import { useDeck } from "@/components/deck/deck-context";
import { useAudioEngineContext } from "@/components/lab/audio/audio-context";
import { soundLab } from "@/data/sound-lab";

const data = soundLab.slides.intro;

/** Decorative sine mark. Static, aria-hidden. */
function WaveMark() {
  return (
    <svg viewBox="0 0 120 60" className="size-28" aria-hidden="true">
      <path
        d="M 4 30 Q 19 2 34 30 T 64 30 T 94 30 T 124 30"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

/** Slide 0: the cover. The button unlocks audio (a real user gesture), plays a
 *  soft note, and begins. */
export function Intro() {
  const deck = useDeck();
  const engine = useAudioEngineContext();

  const begin = () => {
    engine.ensure();
    engine.playTone({ freq: 330, type: "triangle", gain: 0.7, duration: 0.5, env: { attack: 0.01, decay: 0.45, sustain: 0, release: 0.1 } });
    deck.next();
  };

  return (
    <div className="lesson-stagger space-y-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-link">{data.meta}</p>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">{data.promise}</p>
        <div className="shrink-0 self-center">
          <WaveMark />
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
