"use client";

import { SlideDeck } from "@/components/deck/slide-deck";
import type { Slide } from "@/components/deck/types";
import { ClickWord } from "@/components/click-word";
import { AudioEngineProvider } from "@/components/lab/audio/audio-context";
import { IntroThree } from "@/components/lab/fourier/intro-three";
import { EqPlayground } from "@/components/lab/fourier/eq-playground";
import { FrequencyResponse } from "@/components/lab/fourier/frequency-response";
import { Spectrogram } from "@/components/lab/fourier/spectrogram";
import { Applications } from "@/components/lab/fourier/applications";
import { Checkpoint } from "@/components/lab/fourier/checkpoint";
import { ChallengeIntro, Game1Screen, Game2Screen, SampleCalcReplay, FormulaTranslator, GearFix } from "@/components/lab/fourier/challenge-screens";
import { Outro } from "@/components/lab/fourier/outro";
import { fourierLab } from "@/data/fourier-lab";

const s = fourierLab.slides;

const slides: Slide[] = [
  {
    id: s.introThree.id,
    title: s.introThree.title,
    titleNode: (
      <>
        Use it on your <ClickWord label="gear">gear</ClickWord>
      </>
    ),
    render: () => <IntroThree />,
    layout: "orientation",
  },
  {
    id: s.eq.id,
    title: s.eq.title,
    titleNode: (
      <>
        EQ is recipe <ClickWord label="editing">editing</ClickWord>
      </>
    ),
    render: () => <EqPlayground />,
    layout: "lab",
  },
  {
    id: s.response.id,
    title: s.response.title,
    titleNode: (
      <>
        Read a headphone <ClickWord label="curve">curve</ClickWord>
      </>
    ),
    render: () => <FrequencyResponse />,
    layout: "lab",
  },
  {
    id: s.spectrogram.id,
    title: s.spectrogram.title,
    titleNode: (
      <>
        From spectrum to <ClickWord label="spectrogram">spectrogram</ClickWord>
      </>
    ),
    render: () => <Spectrogram />,
    layout: "lab",
  },
  {
    id: s.applications.id,
    title: s.applications.title,
    titleNode: (
      <>
        Where frequency thinking <ClickWord label="lives">lives</ClickWord>
      </>
    ),
    render: () => <Applications />,
    layout: "lab",
  },
  {
    id: s.checkpoint3.id,
    title: s.checkpoint3.title,
    titleNode: (
      <>
        Checkpoint: use the <ClickWord label="recipe">recipe</ClickWord>
      </>
    ),
    render: () => <Checkpoint part={3} />,
    layout: "challenge",
  },
  {
    id: s.challengeIntro.id,
    title: s.challengeIntro.title,
    titleNode: (
      <>
        Decode the <ClickWord label="sound">sound</ClickWord>
      </>
    ),
    render: () => <ChallengeIntro />,
    layout: "challenge",
  },
  {
    id: s.game1.id,
    title: s.game1.title,
    titleNode: (
      <>
        Find the hidden <ClickWord label="tone">tone</ClickWord>
      </>
    ),
    render: () => <Game1Screen />,
    layout: "challenge",
    advanceGate: true,
  },
  {
    id: s.game2.id,
    title: s.game2.title,
    titleNode: (
      <>
        Match the <ClickWord label="recipe">recipe</ClickWord>
      </>
    ),
    render: () => <Game2Screen />,
    layout: "challenge",
    advanceGate: true,
  },
  {
    id: s.sampleCalcReplay.id,
    title: s.sampleCalcReplay.title,
    titleNode: (
      <>
        Sample calculation <ClickWord label="replay">replay</ClickWord>
      </>
    ),
    render: () => <SampleCalcReplay />,
    layout: "challenge",
    advanceGate: true,
  },
  {
    id: s.formulaTranslator.id,
    title: s.formulaTranslator.title,
    titleNode: (
      <>
        Formula <ClickWord label="translator">translator</ClickWord>
      </>
    ),
    render: () => <FormulaTranslator />,
    layout: "challenge",
  },
  {
    id: s.gearFix.id,
    title: s.gearFix.title,
    titleNode: (
      <>
        Gear <ClickWord label="fix">fix</ClickWord>
      </>
    ),
    render: () => <GearFix />,
    layout: "challenge",
    advanceGate: true,
  },
  {
    id: s.outro.id,
    title: s.outro.title,
    titleNode: (
      <>
        You can read a <ClickWord label="sound">sound</ClickWord>
      </>
    ),
    render: () => <Outro />,
    layout: "orientation",
  },
];

export function AudioToolsDeck() {
  return (
    <AudioEngineProvider>
      <SlideDeck slides={slides} deckId="audio-tools" />
    </AudioEngineProvider>
  );
}
