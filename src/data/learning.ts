/**
 * Continued learning: coursework Chalece has completed herself, kept distinct
 * from the 10 Coursera courses she authored. Single source of truth, consumed
 * by the About section (list) and the Resume section (one-line summary).
 * Copy style rule: no em dashes anywhere.
 */

export type ContinuedLearningItem = {
  source: string;
  detail: string;
};

/** Grouped list form, for the About section. */
export const continuedLearning: ContinuedLearningItem[] = [
  {
    source: "Georgia Tech",
    detail:
      "Graduate electives in Educational Technology and Human-Computer Interaction, completed alongside the M.S. in Music Technology.",
  },
  {
    source: "LinkedIn Learning",
    detail:
      "Ongoing instructional-design study: Articulate Storyline and Articulate 360, instructional-design models, learning science and neuroscience for L&D, e-learning storyboarding, SCORM and xAPI, and gamification of learning.",
  },
];

/** One-line form, for the Resume section. */
export const continuedLearningSummary =
  "Graduate electives in Educational Technology and Human-Computer Interaction at Georgia Tech, completed alongside the M.S., plus ongoing instructional-design study through LinkedIn Learning (Articulate Storyline and 360, ID models, learning science, SCORM and xAPI, gamification).";
