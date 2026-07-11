"use client";

import { SlideDeck } from "@/components/deck/slide-deck";
import type { Slide } from "@/components/deck/types";
import { ClickWord } from "@/components/click-word";
import { AudioEngineProvider } from "@/components/lab/audio/audio-context";
import { IntroTwo } from "@/components/lab/fourier/intro-two";
import { SampleTheWave } from "@/components/lab/fourier/sample-the-wave";
import { ReverseProblem } from "@/components/lab/fourier/reverse-problem";
import { TestWaveMaker } from "@/components/lab/fourier/test-wave-maker";
import { MultiplyAddScanner } from "@/components/lab/fourier/multiply-add-scanner";
import { MatchLanes } from "@/components/lab/fourier/match-lanes";
import { PhaseSlide } from "@/components/lab/fourier/phase-slide";
import { CosineSineVector } from "@/components/lab/fourier/cosine-sine-vector";
import { FormulaBreakdown } from "@/components/lab/fourier/formula-breakdown";
import { WorkedCalc } from "@/components/lab/fourier/worked-calc";
import { Checkpoint } from "@/components/lab/fourier/checkpoint";
import { OutroTwo } from "@/components/lab/fourier/outro-two";
import { fourierLab } from "@/data/fourier-lab";

const s = fourierLab.slides;

const slides: Slide[] = [
  {
    id: s.introTwo.id,
    title: s.introTwo.title,
    titleNode: (
      <>
        How does a computer find the <ClickWord label="recipe">recipe</ClickWord>?
      </>
    ),
    render: () => <IntroTwo />,
    layout: "orientation",
  },
  {
    id: s.samples.id,
    title: s.samples.title,
    titleNode: (
      <>
        A computer sees sound as <ClickWord label="dots">dots</ClickWord>
      </>
    ),
    render: () => <SampleTheWave />,
    layout: "lab",
  },
  {
    id: s.reverse.id,
    title: s.reverse.title,
    titleNode: (
      <>
        The mystery <ClickWord label="sound">sound</ClickWord>
      </>
    ),
    render: () => <ReverseProblem />,
    layout: "lab",
  },
  {
    id: s.testWave.id,
    title: s.testWave.title,
    titleNode: (
      <>
        Ask the sound one <ClickWord label="question">question</ClickWord>
      </>
    ),
    render: () => <TestWaveMaker />,
    layout: "lab",
  },
  {
    id: s.multiplyAdd.id,
    title: s.multiplyAdd.title,
    titleNode: (
      <>
        Multiply, then <ClickWord label="add">add</ClickWord>
      </>
    ),
    render: () => <MultiplyAddScanner />,
    layout: "lab",
  },
  {
    id: s.match.id,
    title: s.match.title,
    titleNode: (
      <>
        A match adds <ClickWord label="up">up</ClickWord>
      </>
    ),
    render: () => <MatchLanes />,
    layout: "lab",
  },
  {
    id: s.phase.id,
    title: s.phase.title,
    titleNode: (
      <>
        Phase can hide a <ClickWord label="match">match</ClickWord>
      </>
    ),
    render: () => <PhaseSlide />,
    layout: "lab",
  },
  {
    id: s.cosineSine.id,
    title: s.cosineSine.title,
    titleNode: (
      <>
        Cosine and sine work as a <ClickWord label="team">team</ClickWord>
      </>
    ),
    render: () => <CosineSineVector />,
    layout: "lab",
  },
  {
    id: s.formula.id,
    title: s.formula.title,
    titleNode: (
      <>
        The formula is a <ClickWord label="shortcut">shortcut</ClickWord>
      </>
    ),
    render: () => <FormulaBreakdown />,
    layout: "lab",
  },
  {
    id: s.byHand.id,
    title: s.byHand.title,
    titleNode: (
      <>
        Calculate one frequency by <ClickWord label="hand">hand</ClickWord>
      </>
    ),
    render: () => <WorkedCalc />,
    layout: "lab",
  },
  {
    id: s.checkpoint2.id,
    title: s.checkpoint2.title,
    titleNode: (
      <>
        Checkpoint: find the <ClickWord label="recipe">recipe</ClickWord>
      </>
    ),
    render: () => <Checkpoint part={2} />,
    layout: "challenge",
  },
  {
    id: s.outroTwo.id,
    title: s.outroTwo.title,
    titleNode: (
      <>
        You can find the <ClickWord label="recipe">recipe</ClickWord>
      </>
    ),
    render: () => <OutroTwo />,
    layout: "orientation",
  },
];

export function FourierDeck() {
  return (
    <AudioEngineProvider>
      <SlideDeck slides={slides} deckId="fourier" />
    </AudioEngineProvider>
  );
}
