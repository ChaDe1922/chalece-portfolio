"use client";

import { SlideDeck } from "@/components/deck/slide-deck";
import type { Slide } from "@/components/deck/types";
import { ClickWord } from "@/components/click-word";
import { Intro } from "@/components/lab/git/intro";
import { WhyGit } from "@/components/lab/git/why-git";
import { Snapshot } from "@/components/lab/git/snapshot";
import { CommitObject } from "@/components/lab/git/commit-object";
import { BranchPointer } from "@/components/lab/git/branch-pointer";
import { ReadGraph } from "@/components/lab/git/read-graph";
import { Diverge } from "@/components/lab/git/diverge";
import { Merge } from "@/components/lab/git/merge";
import { Rebase } from "@/components/lab/git/rebase";
import { Quiz } from "@/components/lab/quiz";
import { Outro } from "@/components/lab/git/outro";
import { gitLab } from "@/data/git-lab";

const s = gitLab.slides;

// One taught lesson, beginner friendly and technically honest: feel version
// history on a timeline, then snapshot (not a diff), the commit object, the
// branch-is-a-label reveal, reading the graph, a real divergence, merge vs
// rebase, and a graded assessment.
const slides: Slide[] = [
  {
    id: s.intro.id,
    title: s.intro.title,
    titleNode: (
      <>
        Git, one <ClickWord label="photo">photo</ClickWord> at a time
      </>
    ),
    render: () => <Intro />,
  },
  {
    id: s.whyGit.id,
    title: s.whyGit.title,
    titleNode: (
      <>
        Your work, on a <ClickWord label="timeline">timeline</ClickWord> you can return to
      </>
    ),
    render: () => <WhyGit />,
  },
  {
    id: s.snapshot.id,
    title: s.snapshot.title,
    titleNode: (
      <>
        A commit is a <ClickWord label="photo">photo</ClickWord>, not a diff
      </>
    ),
    render: () => <Snapshot />,
  },
  {
    id: s.commitObject.id,
    title: s.commitObject.title,
    titleNode: (
      <>
        What is <ClickWord label="inside">inside</ClickWord> a photo
      </>
    ),
    render: () => <CommitObject />,
  },
  {
    id: s.branch.id,
    title: s.branch.title,
    titleNode: (
      <>
        A branch is a <ClickWord label="label">label</ClickWord> you can move
      </>
    ),
    render: () => <BranchPointer />,
    advanceGate: true,
  },
  {
    id: s.graph.id,
    title: s.graph.title,
    titleNode: (
      <>
        Reading the <ClickWord label="timeline">timeline</ClickWord>
      </>
    ),
    render: () => <ReadGraph />,
  },
  {
    id: s.diverge.id,
    title: s.diverge.title,
    titleNode: (
      <>
        Two <ClickWord label="timelines">timelines</ClickWord> from one photo
      </>
    ),
    render: () => <Diverge />,
  },
  {
    id: s.merge.id,
    title: s.merge.title,
    titleNode: (
      <>
        <ClickWord label="Merge">Merge</ClickWord>: join the tracks
      </>
    ),
    render: () => <Merge />,
  },
  {
    id: s.rebase.id,
    title: s.rebase.title,
    titleNode: (
      <>
        <ClickWord label="Rebase">Rebase</ClickWord>: replay onto the other track
      </>
    ),
    render: () => <Rebase />,
  },
  {
    id: s.quiz.id,
    title: s.quiz.title,
    titleNode: (
      <>
        <ClickWord label="Check">Check</ClickWord> what you learned
      </>
    ),
    render: () => <Quiz data={gitLab.slides.quiz} />,
    advanceGate: true,
  },
  {
    id: s.outro.id,
    title: s.outro.title,
    titleNode: (
      <>
        That is <ClickWord label="Git">Git</ClickWord>
      </>
    ),
    render: () => <Outro />,
  },
];

export function GitDeck() {
  return <SlideDeck slides={slides} deckId="git" />;
}
