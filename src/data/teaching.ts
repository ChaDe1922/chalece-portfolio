// Chalece's andragogy: a short statement of the learning beliefs that
// shape the interactive lessons in /lab. Rendered as a block on the lab index.
// No em dashes.

export const teaching = {
  eyebrow: "How I design learning",
  heading: "A few beliefs about teaching",
  lede:
    "These principles shape every lesson above, whether the learner is twelve or a staff engineer.",
  principles: [
    {
      title: "Experience before vocabulary",
      body: "People learn a concept by doing it first, then naming it. Every lesson here opens with something you manipulate, not a definition to memorize.",
    },
    {
      title: "Respect what the learner already knows",
      body: "Learners arrive with real experience. I connect new ideas to the tools and mental models you already use, so it feels like a step, not a leap.",
    },
    {
      title: "Teach the misconception, not just the topic",
      body: "I design around what people actually get wrong, then build the moment that corrects it. Watching a wrong assumption break is the fastest way to learn.",
    },
    {
      title: "Make the goal and the proof explicit",
      body: "You should know what you will be able to do, then prove it to yourself. Every lesson states its objectives up front and ends in a real, graded check.",
    },
    {
      title: "Relevance and autonomy",
      body: "People need to know why something matters and to move at their own pace. Lessons are self-directed, skippable, and tied to work you actually do.",
    },
  ],
} as const;
