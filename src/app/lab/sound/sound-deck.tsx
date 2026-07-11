"use client";

import { SlideDeck } from "@/components/deck/slide-deck";
import type { Slide } from "@/components/deck/types";
import { ClickWord } from "@/components/click-word";
import { AudioEngineProvider } from "@/components/lab/audio/audio-context";
import { Intro } from "@/components/lab/sound/intro";
import { AirWave } from "@/components/lab/sound/air-wave";
import { ToneExplorer } from "@/components/lab/sound/tone-explorer";
import { EnvelopeShaper } from "@/components/lab/sound/envelope-shaper";
import { SynthKeyboard } from "@/components/lab/sound/synth-keyboard";
import { Check } from "@/components/lab/sound/check";
import { Outro } from "@/components/lab/sound/outro";
import { soundLab } from "@/data/sound-lab";

const s = soundLab.slides;

const slides: Slide[] = [
  {
    id: s.intro.id,
    layout: "orientation",
    title: s.intro.title,
    titleNode: (
      <>
        Make your first <ClickWord label="sound">sound</ClickWord>
      </>
    ),
    render: () => <Intro />,
  },
  {
    id: s.whatIsSound.id,
    layout: "lab",
    title: s.whatIsSound.title,
    titleNode: (
      <>
        What is a <ClickWord label="sound">sound</ClickWord>?
      </>
    ),
    render: () => (
      <AirWave
        lead={s.whatIsSound.lead}
        detail={s.whatIsSound.detail}
        instruction={s.whatIsSound.instruction}
        connector={s.whatIsSound.connector}
        insight={s.whatIsSound.insight}
        baseFreq={s.whatIsSound.baseFreq}
      />
    ),
  },
  {
    id: s.pitch.id,
    layout: "lab",
    title: s.pitch.title,
    titleNode: (
      <>
        <ClickWord label="Pitch">Pitch</ClickWord> is how fast it vibrates
      </>
    ),
    render: () => (
      <ToneExplorer
        control="frequency"
        lead={s.pitch.lead}
        instruction={s.pitch.instruction}
        insight={s.pitch.insight}
        freq={s.pitch.defaultFreq}
        min={s.pitch.min}
        max={s.pitch.max}
      />
    ),
  },
  {
    id: s.loudness.id,
    layout: "lab",
    title: s.loudness.title,
    titleNode: (
      <>
        <ClickWord label="Loudness">Loudness</ClickWord> is how big the wave is
      </>
    ),
    render: () => (
      <ToneExplorer
        control="amplitude"
        lead={s.loudness.lead}
        instruction={s.loudness.instruction}
        insight={s.loudness.insight}
        freq={s.loudness.fixedFreq}
      />
    ),
  },
  {
    id: s.timbre.id,
    layout: "lab",
    title: s.timbre.title,
    titleNode: (
      <>
        Why a flute and a violin sound <ClickWord label="different">different</ClickWord>
      </>
    ),
    render: () => (
      <ToneExplorer
        control="shape"
        lead={s.timbre.lead}
        instruction={s.timbre.instruction}
        insight={s.timbre.insight}
        freq={s.timbre.fixedFreq}
        shapes={s.timbre.shapes}
        instruments={s.timbre.instruments}
      />
    ),
  },
  {
    id: s.envelope.id,
    layout: "lab",
    title: s.envelope.title,
    titleNode: (
      <>
        How a sound <ClickWord label="begins and ends">begins and ends</ClickWord>
      </>
    ),
    render: () => <EnvelopeShaper />,
  },
  {
    id: s.synth.id,
    layout: "lab",
    title: s.synth.title,
    titleNode: (
      <>
        Build your <ClickWord label="synth">synth</ClickWord>, play a tune
      </>
    ),
    render: () => <SynthKeyboard />,
    advanceGate: true,
  },
  {
    id: s.check.id,
    layout: "challenge",
    title: s.check.title,
    titleNode: (
      <>
        <ClickWord label="Check">Check</ClickWord> what you heard
      </>
    ),
    render: () => <Check />,
    advanceGate: true,
  },
  {
    id: s.outro.id,
    layout: "orientation",
    title: s.outro.title,
    titleNode: (
      <>
        That is a <ClickWord label="sound">sound</ClickWord>
      </>
    ),
    render: () => <Outro />,
  },
];

export function SoundDeck() {
  return (
    <AudioEngineProvider>
      <SlideDeck slides={slides} deckId="sound" />
    </AudioEngineProvider>
  );
}
