/**
 * Featured work for the #work grid. Copy is paste-ready (no em dashes).
 * `href` is optional; cards without a link render as non-interactive.
 */

export type WorkItem = {
  title: string;
  description: string;
  tags: string[];
  href?: string;
};

export const work: WorkItem[] = [
  {
    title: "Coursera Course Catalog (Codio)",
    description:
      "Authored 7 published courses on DevOps, containers, CI/CD, operating systems, Unix, Bash scripting, and web security, reaching 30,630+ learners.",
    tags: ["Curriculum", "Assessment", "Technical"],
    href: "https://www.coursera.org/instructor/~88911140",
  },
  {
    title: "AI-Assisted Curriculum Development",
    description:
      "Work fluently with AI tooling like Claude day to day to research, prototype, and accelerate content development, and develop AI and LLM course material, including Azure ML.",
    tags: ["AI Tooling", "LLMs", "Curriculum"],
  },
  {
    title: "Creative Coding Summer Cohort",
    description:
      "Designed and ran a Python and Pygame creative coding summer cohort for two years, guiding high school juniors to college freshmen through game development to final group and capstone project presentations.",
    tags: ["Python + Pygame", "Game Dev", "Cohort"],
  },
  {
    title: "Your Voice Is Power",
    description:
      "Curriculum and coding competition with CEISMC, Amazon, Georgia Tech, and Pharrell Williams' YELLOW, connecting computer science, music, and equity on the EarSketch platform. Published in the IEEE RESPECT and ASEE conference proceedings.",
    tags: ["Curriculum", "Equity", "Published"],
    href: "https://www.amazonfutureengineer.co.uk/your-voice-is-power",
  },
  {
    title: "Music Tech Workshops at Georgia Tech",
    description:
      "Returning contractor for three years, leading annual EarSketch and music technology coding workshops and student panels for high school students at Georgia Tech, introducing computer science through music.",
    tags: ["Teaching", "Workshops", "Music + Code"],
  },
  {
    title: "Audio Programs for Amazon Amp",
    description:
      "Led Audio Quality and Hardware Compatibility programs for Amazon Amp, Amazon Music's live audio streaming app, across 50+ device combinations and 1,200+ test scenarios. Stood up a testing lab.",
    tags: ["Program Management", "Audio", "Scale"],
  },
  {
    title: "Planet Bug (ACM CHI 2020)",
    description:
      "Published educational conservation game with a custom hardware controller. Programmed the embedded microcontrollers and sensors.",
    tags: ["Game-based learning", "Published", "Hardware"],
    href: "https://dl.acm.org/doi/10.1145/3334480.3381654",
  },
  {
    title: "E22 / Atlanta Truth Data Systems",
    description:
      "Co-founded an athletic development company and built the data and analytics backbone, including performance and wellness dashboards, for a women's tackle football team.",
    tags: ["Data", "Dashboards", "Sports"],
  },
  {
    title: "Athlete Storytelling & Video (E22)",
    description:
      "Concept, script, shoot, and edit short-form video, photography, and graphics for E22's women's tackle football athletes, and run their social storytelling. Built to be clear, compelling, and optimized for on-demand viewing.",
    tags: ["Short-form video", "Storytelling", "Graphic design"],
    href: "https://www.instagram.com/_she22much/",
  },
];
