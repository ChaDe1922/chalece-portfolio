/**
 * Learning Lab experiments for the homepage "Learning Lab" preview and the
 * /lab index. To stay truthful, only `status: "live"` experiments render this
 * increment; the two planned flagship experiments (Complexity Translator,
 * Curriculum Console) are scaffolding for a later increment and are filtered
 * out of the UI. The live entries link into the real, shipped lab lessons.
 * No em dashes.
 */

import type { ProjectAccent } from "@/data/projects";

export type Experiment = {
  id: string;
  title: string;
  blurb: string;
  href: string;
  cta: string;
  status: "live" | "planned";
  accent: ProjectAccent;
};

export const experiments: Experiment[] = [
  {
    id: "signal-lab",
    title: "Signal Lab",
    blurb:
      "Play a sound, isolate its frequencies, and watch the underlying mathematics unfold one visible step at a time.",
    href: "/lab/sound",
    cta: "Make some noise",
    status: "live",
    accent: "coral",
  },
  {
    id: "recursion",
    title: "Recursion, watch it run.",
    blurb:
      "Step through a function that calls itself, and see the call stack build up and unwind.",
    href: "/lab/recursion",
    cta: "Trace it",
    status: "live",
    accent: "iris",
  },
  {
    id: "git",
    title: "What Git really does.",
    blurb:
      "See snapshots, pointers, and the real difference between merge and rebase.",
    href: "/lab/git",
    cta: "Explore Git",
    status: "live",
    accent: "gold",
  },
  // ---- Planned flagship experiments (scaffolding, not rendered yet) --------
  {
    id: "complexity-translator",
    title: "Complexity Translator",
    blurb:
      "Watch one technical idea transform from expert language into a visual model, interactive explanation, practice activity, and transfer challenge.",
    href: "/lab",
    cta: "Try the translator",
    status: "planned",
    accent: "iris",
  },
  {
    id: "curriculum-console",
    title: "Curriculum Console",
    blurb:
      "Change the learner, goal, time, difficulty, or delivery format and watch the lesson architecture respond.",
    href: "/lab",
    cta: "Open the console",
    status: "planned",
    accent: "gold",
  },
];

/** Live experiments only, for rendering this increment. */
export const liveExperiments = (): Experiment[] =>
  experiments.filter((e) => e.status === "live");
