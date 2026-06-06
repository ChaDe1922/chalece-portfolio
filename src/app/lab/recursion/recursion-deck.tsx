"use client";

import { SlideDeck } from "@/components/deck/slide-deck";
import type { Slide } from "@/components/deck/types";
import { ClickWord } from "@/components/click-word";
import { PythonWord } from "@/components/lab/recursion/python-word";
import { Intro } from "@/components/lab/recursion/intro";
import { MirrorRoom } from "@/components/lab/recursion/mirror-room";
import { Dolls } from "@/components/lab/recursion/dolls";
import { WhyRecursion } from "@/components/lab/recursion/why-recursion";
import { CountdownCode } from "@/components/lab/recursion/countdown-code";
import { CallStack } from "@/components/lab/recursion/call-stack";
import { NoBaseCase } from "@/components/lab/recursion/no-base-case";
import { FractalTree } from "@/components/lab/recursion/fractal-tree";
import { Quiz } from "@/components/lab/recursion/quiz";
import { Outro } from "@/components/lab/recursion/outro";
import { recursionLab } from "@/data/recursion-lab";

const s = recursionLab.slides;

// One taught lesson: cover, experience, name + define, why/where, how to write,
// run it, break it (RecursionError), payoff, assess.
const slides: Slide[] = [
  {
    id: s.intro.id,
    title: s.intro.title,
    titleNode: (
      <>
        Inside <ClickWord label="Recursion">Recursion</ClickWord>
      </>
    ),
    render: () => <Intro />,
  },
  {
    id: s.mirror.id,
    title: s.mirror.title,
    titleNode: (
      <>
        Step into <ClickWord label="recursion">recursion</ClickWord>
      </>
    ),
    render: () => <MirrorRoom />,
  },
  {
    id: s.dolls.id,
    title: s.dolls.title,
    titleNode: (
      <>
        The two <ClickWord label="rules">rules</ClickWord> of recursion
      </>
    ),
    render: () => <Dolls />,
  },
  {
    id: s.why.id,
    title: s.why.title,
    titleNode: (
      <>
        What is <ClickWord label="recursion">recursion</ClickWord> and where will I find it?
      </>
    ),
    render: () => <WhyRecursion />,
  },
  {
    id: s.code.id,
    title: s.code.title,
    titleNode: (
      <>
        Writing a recursive function in <PythonWord>Python</PythonWord>.
      </>
    ),
    render: () => <CountdownCode />,
  },
  {
    id: s.callStack.id,
    title: s.callStack.title,
    titleNode: (
      <>
        Wait, what is a <ClickWord label="call stack">call stack</ClickWord>?
      </>
    ),
    render: () => <CallStack />,
  },
  {
    id: s.noBaseCase.id,
    title: s.noBaseCase.title,
    titleNode: (
      <>
        What if there is no <ClickWord label="base case">base case</ClickWord>?
      </>
    ),
    render: () => <NoBaseCase />,
  },
  {
    id: s.fractal.id,
    title: s.fractal.title,
    titleNode: (
      <>
        <ClickWord label="Recursion">Recursion</ClickWord> draws the world around us
      </>
    ),
    render: () => <FractalTree />,
  },
  {
    id: s.quiz.id,
    title: s.quiz.title,
    titleNode: (
      <>
        <ClickWord label="Check">Check</ClickWord> what you learned
      </>
    ),
    render: () => <Quiz />,
  },
  { id: s.outro.id, title: s.outro.title, render: () => <Outro /> },
];

export function RecursionDeck() {
  return <SlideDeck slides={slides} deckId="recursion" />;
}
