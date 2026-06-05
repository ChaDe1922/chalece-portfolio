"use client";

import { SlideDeck } from "@/components/deck/slide-deck";
import type { Slide } from "@/components/deck/types";
import { MirrorRoom } from "@/components/lab/recursion/mirror-room";
import { Dolls } from "@/components/lab/recursion/dolls";
import { CountdownCode } from "@/components/lab/recursion/countdown-code";
import { CallStack } from "@/components/lab/recursion/call-stack";
import { FractalTree } from "@/components/lab/recursion/fractal-tree";
import { Quiz } from "@/components/lab/recursion/quiz";
import { recursionLab } from "@/data/recursion-lab";

const s = recursionLab.slides;

// One taught lesson: experience, name it, code it, model it, payoff, assess.
const slides: Slide[] = [
  { id: s.mirror.id, title: s.mirror.title, render: () => <MirrorRoom /> },
  { id: s.dolls.id, title: s.dolls.title, render: () => <Dolls /> },
  { id: s.code.id, title: s.code.title, render: () => <CountdownCode /> },
  { id: s.callStack.id, title: s.callStack.title, render: () => <CallStack /> },
  { id: s.fractal.id, title: s.fractal.title, render: () => <FractalTree /> },
  { id: s.quiz.id, title: s.quiz.title, render: () => <Quiz /> },
];

export function RecursionDeck() {
  return <SlideDeck slides={slides} deckId="recursion" />;
}
