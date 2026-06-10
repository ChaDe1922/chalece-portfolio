"use client";

import { useVibeBuild } from "@/components/lab/vibe-coding/vibe-context";
import { BeatMaker } from "@/components/lab/vibe-coding/beat-maker";
import { ClickerGame } from "@/components/lab/vibe-coding/clicker-game";
import { Flashcards } from "@/components/lab/vibe-coding/flashcards";

/** Slide 2: renders the mini-app that matches the learner's build choice.
 *  Defaults to the beat maker when no choice was made. */
export function Artifact() {
  const { build } = useVibeBuild();
  if (build === "game") return <ClickerGame />;
  if (build === "school") return <Flashcards />;
  return <BeatMaker />;
}
