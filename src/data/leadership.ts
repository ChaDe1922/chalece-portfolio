/**
 * Leadership operating principles for the homepage "How I direct the work"
 * preview and the future /leadership page. Copy from the overhaul brief.
 * No em dashes.
 */

export type LeadershipPrinciple = {
  id: string;
  title: string;
  prompt: string;
  body?: string;
  /** Project slugs that evidence this principle. */
  evidenceSlugs?: string[];
};

export const leadershipThesis = {
  eyebrow: "How I direct the work",
  title: "Quality should survive scale.",
  intro:
    "I do not treat quality as a final review step. I build it into the strategy, workflow, medium, feedback system, and definition of done.",
} as const;

export const leadershipPrinciples: LeadershipPrinciple[] = [
  {
    id: "behavior",
    title: "Start with the behavior.",
    prompt: "What must the learner be able to do afterward?",
    evidenceSlugs: ["codio-course-ecosystem"],
  },
  {
    id: "medium",
    title: "Choose the medium with intent.",
    prompt:
      "What becomes clearer through sound, motion, interaction, demonstration, or practice?",
    evidenceSlugs: ["making-sound-visible"],
  },
  {
    id: "misconception",
    title: "Teach the misconception.",
    prompt: "Where is the learner most likely to form the wrong model?",
    evidenceSlugs: ["making-sound-visible"],
  },
  {
    id: "feedback",
    title: "Make feedback immediate and useful.",
    prompt: "What information helps the learner make a better next attempt?",
    evidenceSlugs: ["codio-course-ecosystem"],
  },
  {
    id: "quality-bar",
    title: "Encode the quality bar.",
    prompt:
      "How can the standard remain intact without one person reviewing everything?",
    evidenceSlugs: ["ai-curriculum-systems"],
  },
  {
    id: "measure",
    title: "Measure what changed.",
    prompt: "What evidence shows that the learning transferred?",
  },
];
