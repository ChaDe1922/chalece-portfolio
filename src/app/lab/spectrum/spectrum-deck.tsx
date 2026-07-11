"use client";

import { SlideDeck } from "@/components/deck/slide-deck";
import type { Slide } from "@/components/deck/types";
import { ClickWord } from "@/components/click-word";
import { AudioEngineProvider } from "@/components/lab/audio/audio-context";
import { Intro } from "@/components/lab/fourier/intro";
import { PartOneIntro } from "@/components/lab/fourier/part-one-intro";
import { MovingShape } from "@/components/lab/fourier/moving-shape";
import { PureTone } from "@/components/lab/fourier/pure-tone";
import { WaveformView, SpectrumView, BothViews } from "@/components/lab/fourier/view-screens";
import { SonicPrism } from "@/components/lab/fourier/sonic-prism";
import { BuildSound } from "@/components/lab/fourier/build-sound";
import { ToneFormula } from "@/components/lab/fourier/tone-formula";
import { SquareBuilder } from "@/components/lab/fourier/square-builder";
import { FrequencyBands } from "@/components/lab/fourier/frequency-bands";
import { VoiceSpectrum } from "@/components/lab/fourier/voice-spectrum";
import { Checkpoint } from "@/components/lab/fourier/checkpoint";
import { OutroOne } from "@/components/lab/fourier/outro-one";
import { fourierLab } from "@/data/fourier-lab";

const s = fourierLab.slides;

const slides: Slide[] = [
  {
    id: s.intro.id,
    layout: "orientation",
    title: s.intro.title,
    titleNode: (
      <>
        What is inside a <ClickWord label="sound">sound</ClickWord>?
      </>
    ),
    render: () => <Intro />,
  },
  {
    id: s.partOneIntro.id,
    layout: "orientation",
    title: s.partOneIntro.title,
    titleNode: (
      <>
        Part 1: see the <ClickWord label="recipe">recipe</ClickWord>
      </>
    ),
    render: () => <PartOneIntro />,
  },
  {
    id: s.movingShape.id,
    layout: "lab",
    title: s.movingShape.title,
    titleNode: (
      <>
        Sound is a moving <ClickWord label="shape">shape</ClickWord>
      </>
    ),
    render: () => <MovingShape />,
  },
  {
    id: s.pureTone.id,
    layout: "lab",
    title: s.pureTone.title,
    titleNode: (
      <>
        Meet the simplest <ClickWord label="sound">sound</ClickWord>
      </>
    ),
    render: () => <PureTone />,
  },
  {
    id: s.waveformView.id,
    layout: "lab",
    title: s.waveformView.title,
    titleNode: (
      <>
        The waveform: sound across <ClickWord label="time">time</ClickWord>
      </>
    ),
    render: () => <WaveformView />,
  },
  {
    id: s.spectrumView.id,
    layout: "lab",
    title: s.spectrumView.title,
    titleNode: (
      <>
        The spectrum: sound by <ClickWord label="frequency">frequency</ClickWord>
      </>
    ),
    render: () => <SpectrumView />,
  },
  {
    id: s.bothViews.id,
    layout: "lab",
    title: s.bothViews.title,
    titleNode: (
      <>
        Same sound, two <ClickWord label="views">views</ClickWord>
      </>
    ),
    render: () => <BothViews />,
  },
  {
    id: s.sonicPrism.id,
    layout: "lab",
    title: s.sonicPrism.title,
    titleNode: (
      <>
        The sonic <ClickWord label="prism">prism</ClickWord>
      </>
    ),
    render: () => <SonicPrism />,
  },
  {
    id: s.stack.id,
    layout: "lab",
    title: s.stack.title,
    titleNode: (
      <>
        Build a sound from <ClickWord label="pure tones">pure tones</ClickWord>
      </>
    ),
    render: () => <BuildSound />,
  },
  {
    id: s.toneFormula.id,
    layout: "lab",
    title: s.toneFormula.title,
    titleNode: (
      <>
        One pure tone, written as a <ClickWord label="formula">formula</ClickWord>
      </>
    ),
    render: () => <ToneFormula />,
  },
  {
    id: s.square.id,
    layout: "lab",
    title: s.square.title,
    titleNode: (
      <>
        How smooth sines build a <ClickWord label="square wave">square wave</ClickWord>
      </>
    ),
    render: () => <SquareBuilder />,
  },
  {
    id: s.bands.id,
    layout: "lab",
    title: s.bands.title,
    titleNode: (
      <>
        Exploring bass, mids, and <ClickWord label="treble">treble</ClickWord>
      </>
    ),
    render: () => <FrequencyBands />,
  },
  {
    id: s.voice.id,
    layout: "lab",
    title: s.voice.title,
    titleNode: (
      <>
        See your own <ClickWord label="voice">voice</ClickWord>
      </>
    ),
    render: () => <VoiceSpectrum />,
  },
  {
    id: s.checkpoint.id,
    layout: "challenge",
    title: s.checkpoint.title,
    titleNode: (
      <>
        Checkpoint: read the <ClickWord label="recipe">recipe</ClickWord>
      </>
    ),
    render: () => <Checkpoint part={1} />,
  },
  {
    id: s.outroOne.id,
    layout: "orientation",
    title: s.outroOne.title,
    titleNode: (
      <>
        You can read a sound becoming a <ClickWord label="spectrum">spectrum</ClickWord>
      </>
    ),
    render: () => <OutroOne />,
  },
];

export function SpectrumDeck() {
  return (
    <AudioEngineProvider>
      <SlideDeck slides={slides} deckId="spectrum" />
    </AudioEngineProvider>
  );
}
