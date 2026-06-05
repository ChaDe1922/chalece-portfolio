"use client";

import { SlideDeck } from "@/components/deck/slide-deck";
import type { Slide } from "@/components/deck/types";
import { ShrinkIt } from "@/components/lab/recursion/shrink-it";
import { MatchTwoParts } from "@/components/lab/recursion/match-two-parts";
import { BuildFunction } from "@/components/lab/recursion/build-function";
import { CallStack } from "@/components/lab/recursion/call-stack";
import { Challenge } from "@/components/lab/recursion/challenge";
import { Everywhere } from "@/components/lab/recursion/everywhere";
import { recursionLab } from "@/data/recursion-lab";

const s = recursionLab.slides;

// Deck order: play, two parts, build, watch it run, predict, close.
const slides: Slide[] = [
  { id: s.shrink.id, title: s.shrink.title, render: () => <ShrinkIt /> },
  { id: s.match.id, title: "The two parts", render: () => <MatchTwoParts /> },
  { id: s.build.id, title: "Build the function", render: () => <BuildFunction /> },
  { id: s.callStack.id, title: s.callStack.title, render: () => <CallStack /> },
  { id: s.predict.id, title: s.predict.title, render: () => <Challenge /> },
  { id: s.close.id, title: s.close.title, render: () => <Everywhere /> },
];

export function RecursionDeck() {
  return <SlideDeck slides={slides} deckId="recursion" />;
}
