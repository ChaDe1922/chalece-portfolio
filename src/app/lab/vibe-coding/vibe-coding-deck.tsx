"use client";

import * as React from "react";
import { SlideDeck } from "@/components/deck/slide-deck";
import type { Slide } from "@/components/deck/types";
import { ClickWord } from "@/components/click-word";
import { Hook } from "@/components/lab/vibe-coding/hook";
import { Framework } from "@/components/lab/vibe-coding/framework";
import { Artifact } from "@/components/lab/vibe-coding/artifact";
import { RemixPrompts, RemixTitle } from "@/components/lab/vibe-coding/remix-prompts";
import { Reflection } from "@/components/lab/vibe-coding/reflection";
import { AiPanel } from "@/components/lab/vibe-coding/ai-panel";
import { VibeBuildProvider } from "@/components/lab/vibe-coding/vibe-context";
import { vibeCodingLab } from "@/data/vibe-coding-lab";

const s = vibeCodingLab.slides;

// Five steps, each with one interaction: hook (first design decision), the
// say/test/remix loop, a real beat maker you direct and test, remix prompts you
// sharpen, and a reflection self-check. No advance gate: exploration, not a
// graded path. The "Try it for real" panel sits beside the deck.
const slides: Slide[] = [
  {
    id: s.hook.id,
    title: s.hook.title,
    render: () => <Hook />,
  },
  {
    id: s.framework.id,
    title: s.framework.title,
    titleNode: (
      <>
        <ClickWord label="vibe">Vibe</ClickWord> Coding in 3 Steps.
      </>
    ),
    render: () => <Framework />,
  },
  {
    id: s.artifact.id,
    title: s.artifact.title,
    render: () => <Artifact />,
  },
  {
    id: s.remix.id,
    title: "Remix it",
    titleNode: <RemixTitle />,
    render: () => <RemixPrompts />,
  },
  {
    id: s.reflection.id,
    title: "That is vibe coding.",
    titleNode: (
      <>
        That is <ClickWord label="vibe">vibe</ClickWord> coding.
      </>
    ),
    render: () => <Reflection />,
  },
];

/** Side-by-side workbench: the lesson deck and a persistent "Try it for real"
 *  AI panel. Desktop splits into two columns (deck left, panel right); mobile
 *  stacks the panel below the full-screen deck. The panel is hidden on the final
 *  slide, which is a conclusion/outro and has its own contact + CTAs. */
function VibeCodingWorkbench() {
  const [currentId, setCurrentId] = React.useState(slides[0].id);
  const onSlideChange = React.useCallback((id: string) => setCurrentId(id), []);
  const showPanel = currentId !== s.reflection.id;

  return (
    <div className="flex min-h-[100svh] w-full flex-col lg:h-[100svh] lg:flex-row lg:overflow-hidden">
      <div className="min-w-0 lg:flex-1">
        <SlideDeck slides={slides} deckId="vibe-coding" onSlideChange={onSlideChange} />
      </div>
      {showPanel ? (
        <aside
          aria-label="Try it for real"
          className="w-full border-t border-border bg-card lg:h-[100svh] lg:w-[360px] lg:shrink-0 lg:overflow-y-auto lg:border-l lg:border-t-0 xl:w-[420px]"
        >
          <AiPanel />
        </aside>
      ) : null}
    </div>
  );
}

export function VibeCodingDeck() {
  return (
    <VibeBuildProvider>
      <VibeCodingWorkbench />
    </VibeBuildProvider>
  );
}
