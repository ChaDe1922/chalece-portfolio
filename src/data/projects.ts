/**
 * Portfolio V2 project model: the single source of truth for all work.
 * Copy style rule: no em dashes anywhere.
 *
 * Truthfulness rules (from the overhaul brief and the studio compliance rules):
 * - Every numeric metric carries `verified`. Only verified metrics may render
 *   as fact. Unverified numbers stay `verified:false` with a TODO note.
 * - Placeholder media carries `placeholder:true`; components render a labeled
 *   placeholder, never a broken <img>. Never present a mockup as a screenshot.
 * - `scenes` are the deep case-study bodies, deferred to a later increment.
 */

export type ProjectAccent = "iris" | "cyan" | "coral" | "gold";

export type MediaAsset = {
  kind: "image" | "video" | "poster" | "illustration";
  /** Path under /public, or a route for interactive embeds. */
  src: string;
  alt: string;
  width: number;
  height: number;
  aspectRatio: `${number}:${number}`;
  poster?: string;
  caption?: string;
  /** True while awaiting the real asset. Components show a labeled placeholder. */
  placeholder?: boolean;
};

export type Metric = {
  /** Display string, e.g. "30,630+" or "M.S." Allows non-numeric values. */
  value: string;
  label: string;
  /** Optional numeric target so a MetricStrip can count up (reuses StatBlock). */
  countTo?: number;
  suffix?: string;
  /** Only verified metrics render as fact. */
  verified: boolean;
};

export type ProjectScene = {
  id: string;
  kind:
    | "challenge"
    | "role"
    | "system"
    | "experience"
    | "artifacts"
    | "outcome"
    | "reflection"
    | "media";
  heading: string;
  body?: string;
  media?: MediaAsset;
  todo?: boolean;
};

export type Project = {
  slug: string;
  title: string;
  shortTitle: string;
  thesis: string;
  summary: string;
  role: string[];
  audiences: string[];
  disciplines: string[];
  formats: string[];
  /** Human-readable range, e.g. "2021 to present". Empty string = not shown. */
  dateRange: string;
  metrics: Metric[];
  /** Short supporting-proof bullets for flagship chapters (verified statements). */
  highlights?: string[];
  featured: boolean;
  accent: ProjectAccent;
  heroMedia: MediaAsset;
  thumbnailMedia: MediaAsset;
  /** Deep case-study body scenes. Empty this increment. */
  scenes: ProjectScene[];
  relatedProjects: string[];
  /** Canonical external (or internal) place the work lives. */
  href?: string;
  /** Scaffolding placeholder named in the brief but not yet real. Not rendered. */
  todo?: boolean;
};

/** Labeled placeholder media so nothing renders a broken image this increment. */
function placeholderMedia(
  alt: string,
  aspectRatio: `${number}:${number}`,
  width: number,
  height: number,
): MediaAsset {
  return {
    kind: "illustration",
    src: "",
    alt,
    width,
    height,
    aspectRatio,
    placeholder: true,
  };
}

export const projects: Project[] = [
  // ---- Flagship 01 ---------------------------------------------------------
  {
    slug: "codio-course-ecosystem",
    title: "Codio and the Coursera Course Ecosystem",
    shortTitle: "Codio × Coursera",
    thesis: "Seven technical courses. One repeatable learning system.",
    summary:
      "I owned course development end to end across DevOps, containers, operating systems, CI/CD, Unix, Bash scripting, and web security. The work combined technical accuracy, clear explanation, hands-on labs, assessments, media, and quality assurance into a system that has reached more than 30,630 learners.",
    role: [
      "Curriculum developer and course owner",
      "Assessment design",
      "Technical and instructional QA",
    ],
    audiences: ["Developers", "Adult learners"],
    disciplines: ["Curriculum", "Assessment", "Technical education"],
    formats: ["Written", "Code labs", "Assessments", "Visuals"],
    dateRange: "",
    metrics: [
      { value: "7", label: "Published courses", countTo: 7, verified: true },
      {
        value: "30,630+",
        label: "Learners reached",
        countTo: 30630,
        suffix: "+",
        verified: true,
      },
    ],
    highlights: [
      "7 published courses",
      "30,630+ learners",
      "Technical and beginner audiences",
      "Curriculum, assessment, media, and QA",
    ],
    featured: true,
    accent: "iris",
    heroMedia: placeholderMedia(
      "A wall of Codio and Coursera course interfaces, lesson pages, coding environments, and assessments.",
      "16:9",
      1600,
      900,
    ),
    thumbnailMedia: placeholderMedia(
      "Codio and Coursera course ecosystem thumbnail.",
      "4:3",
      800,
      600,
    ),
    scenes: [],
    relatedProjects: ["ai-curriculum-systems", "making-sound-visible"],
    href: "https://www.coursera.org/instructor/~88911140",
  },

  // ---- Flagship 02 ---------------------------------------------------------
  {
    slug: "ai-curriculum-systems",
    title: "AI-Assisted Curriculum and Production Systems",
    shortTitle: "AI-Assisted Content Systems",
    thesis: "Encoding craft into the production engine.",
    summary:
      "I work fluently with AI tooling day to day to research, prototype, and accelerate content development, while designing AI and LLM course material (including Azure ML) and building reusable production workflows that keep verification, judgment, and learner empathy in human hands.",
    role: [
      "AI-assisted production",
      "Curriculum and workflow design",
      "Quality standards",
    ],
    audiences: ["Developers", "Adult learners", "Educators"],
    disciplines: ["AI systems", "Curriculum", "Technical education"],
    formats: ["Workflows", "Curriculum", "Prototypes"],
    dateRange: "",
    metrics: [
      // TODO(confirm): "14+ AI and multi-agent systems" is from the brief but is
      // not in the current verified data, and prior guidance moved away from
      // agent-system claims. Kept unverified until Chalece confirms the count.
      {
        value: "14+",
        label: "AI and multi-agent systems",
        verified: false,
      },
    ],
    highlights: [
      "Human verification gates",
      "Reusable quality standards",
      "Research, drafting, review, and maintenance workflows",
      "AI as leverage, judgment kept human",
    ],
    featured: true,
    accent: "cyan",
    heroMedia: placeholderMedia(
      "A raw content brief moving through a visible pipeline of production stages and human review gates.",
      "16:9",
      1600,
      900,
    ),
    thumbnailMedia: placeholderMedia(
      "AI-assisted curriculum production pipeline thumbnail.",
      "4:3",
      800,
      600,
    ),
    scenes: [],
    relatedProjects: ["codio-course-ecosystem", "making-sound-visible"],
  },

  // ---- Flagship 03 ---------------------------------------------------------
  {
    slug: "making-sound-visible",
    title: "Making Sound Visible",
    shortTitle: "Making Sound Visible",
    thesis: "Hear the math. See the sound.",
    summary:
      "An exploratory learning experience that lets beginners play a sound, reveal its waveform, separate its frequencies, manipulate its components, and follow the mathematics one visible step at a time. Built as a working lesson, not a description of one.",
    role: [
      "Curriculum and interaction design",
      "Sound design",
      "Software development",
    ],
    audiences: ["Adult learners", "General public"],
    disciplines: ["Interactive", "Sound", "Technical education"],
    formats: ["Interactive", "Audio", "Animation"],
    dateRange: "",
    metrics: [],
    highlights: [
      "Interactive signal visualization",
      "Sound-driven animation",
      "Beginner-first mathematics",
      "Practice beyond multiple choice",
    ],
    featured: true,
    accent: "coral",
    heroMedia: {
      kind: "illustration",
      src: "/lab/sound",
      alt: "An interactive waveform separating into its component frequencies.",
      width: 1600,
      height: 900,
      aspectRatio: "16:9",
      placeholder: true,
      caption: "Live interactive lesson in the Learning Lab.",
    },
    thumbnailMedia: placeholderMedia(
      "Waveform and frequency spectrum thumbnail.",
      "4:3",
      800,
      600,
    ),
    scenes: [],
    relatedProjects: ["codio-course-ecosystem", "ai-curriculum-systems"],
    href: "/lab/sound",
  },

  // ---- Archive -------------------------------------------------------------
  {
    slug: "your-voice-is-power",
    title: "Your Voice Is Power",
    shortTitle: "Your Voice Is Power",
    thesis: "Computer science, music, and equity in one curriculum.",
    summary:
      "Curriculum and coding competition with CEISMC, Amazon, Georgia Tech, and Pharrell Williams' YELLOW, connecting computer science, music, and equity on the EarSketch platform. Published in the IEEE RESPECT and ASEE conference proceedings.",
    role: ["Curriculum design", "Equity-centered learning"],
    audiences: ["Youth", "Educators"],
    disciplines: ["Curriculum", "Creative coding", "Research"],
    formats: ["Curriculum", "Competition", "Published research"],
    dateRange: "",
    metrics: [
      { value: "Published", label: "IEEE RESPECT and ASEE", verified: true },
    ],
    featured: false,
    accent: "coral",
    heroMedia: placeholderMedia("Your Voice Is Power curriculum.", "16:9", 1600, 900),
    thumbnailMedia: placeholderMedia(
      "Your Voice Is Power thumbnail.",
      "4:3",
      800,
      600,
    ),
    scenes: [],
    relatedProjects: ["making-sound-visible"],
    href: "https://www.amazonfutureengineer.co.uk/your-voice-is-power",
  },
  {
    slug: "amazon-audio-programs",
    title: "Audio Programs for Amazon Amp",
    shortTitle: "Amazon Amp",
    thesis: "Audio quality and hardware compatibility at scale.",
    summary:
      "Led Audio Quality and Hardware Compatibility programs for Amazon Amp, Amazon Music's live audio streaming app, across 50+ device combinations and 1,200+ test scenarios. Stood up a testing lab.",
    role: ["Program management", "Audio quality", "Test operations"],
    audiences: ["Organizations"],
    disciplines: ["Audio", "Program leadership"],
    formats: ["Programs", "Test systems"],
    dateRange: "",
    metrics: [
      {
        value: "50+",
        label: "Device combinations",
        countTo: 50,
        suffix: "+",
        verified: true,
      },
      {
        value: "1,200+",
        label: "Test scenarios",
        countTo: 1200,
        suffix: "+",
        verified: true,
      },
    ],
    featured: false,
    accent: "cyan",
    heroMedia: placeholderMedia("Amazon Amp audio testing program.", "16:9", 1600, 900),
    thumbnailMedia: placeholderMedia("Amazon Amp thumbnail.", "4:3", 800, 600),
    scenes: [],
    relatedProjects: ["making-sound-visible"],
  },
  {
    slug: "creative-coding",
    title: "Creative Coding Summer Cohort",
    shortTitle: "Creative Coding",
    thesis: "Python and Pygame from first line to capstone.",
    summary:
      "Designed and ran a Python and Pygame creative coding summer cohort for two years, guiding high school juniors to college freshmen through game development to final group and capstone project presentations.",
    role: ["Program design", "Instruction", "Mentoring"],
    audiences: ["Youth", "Adult learners"],
    disciplines: ["Creative coding", "Curriculum"],
    formats: ["Cohort", "Project-based"],
    dateRange: "",
    metrics: [],
    featured: false,
    accent: "gold",
    heroMedia: placeholderMedia("Creative coding cohort projects.", "16:9", 1600, 900),
    thumbnailMedia: placeholderMedia("Creative coding thumbnail.", "4:3", 800, 600),
    scenes: [],
    relatedProjects: ["your-voice-is-power"],
  },
  {
    slug: "planet-bug",
    title: "Planet Bug",
    shortTitle: "Planet Bug",
    thesis: "A conservation game with custom hardware.",
    summary:
      "Published educational conservation game with a custom hardware controller. Programmed the embedded microcontrollers and sensors.",
    role: ["Embedded programming", "Game-based learning"],
    audiences: ["General public", "Youth"],
    disciplines: ["Software", "Hardware", "Research"],
    formats: ["Game", "Hardware", "Published research"],
    dateRange: "",
    metrics: [{ value: "Published", label: "ACM CHI 2020", verified: true }],
    featured: false,
    accent: "gold",
    heroMedia: placeholderMedia("Planet Bug game and hardware controller.", "16:9", 1600, 900),
    thumbnailMedia: placeholderMedia("Planet Bug thumbnail.", "4:3", 800, 600),
    scenes: [],
    relatedProjects: [],
    href: "https://dl.acm.org/doi/10.1145/3334480.3381654",
  },
  {
    slug: "music-technology-workshops",
    title: "Music Technology Workshops at Georgia Tech",
    shortTitle: "Music Tech Workshops",
    thesis: "Computer science, taught through music.",
    summary:
      "Returning contractor for three years, leading annual EarSketch and music technology coding workshops and student panels for high school students at Georgia Tech, introducing computer science through music.",
    role: ["Instruction", "Workshop facilitation"],
    audiences: ["Youth", "Educators"],
    disciplines: ["Music and code", "Curriculum"],
    formats: ["Workshops", "Panels"],
    dateRange: "",
    metrics: [],
    featured: false,
    accent: "cyan",
    heroMedia: placeholderMedia("Music technology workshop at Georgia Tech.", "16:9", 1600, 900),
    thumbnailMedia: placeholderMedia("Music tech workshop thumbnail.", "4:3", 800, 600),
    scenes: [],
    relatedProjects: ["your-voice-is-power", "making-sound-visible"],
  },
  {
    slug: "athlete-data-systems",
    title: "Athlete Data and Storytelling Systems",
    shortTitle: "Athlete Systems",
    thesis: "The data and the story behind a team.",
    summary:
      "Co-founded an athletic development company and built the data and analytics backbone, including performance and wellness dashboards, for a women's tackle football team. Also concept, script, shoot, and edit short-form video, photography, and graphics for the athletes, and run their social storytelling.",
    role: ["Data and analytics", "Video and storytelling", "Co-founder"],
    audiences: ["Organizations", "General public"],
    disciplines: ["Data", "Video", "Software"],
    formats: ["Dashboards", "Short-form video", "Graphic design"],
    dateRange: "",
    metrics: [],
    featured: false,
    accent: "coral",
    heroMedia: placeholderMedia("Athlete data dashboards and storytelling video.", "16:9", 1600, 900),
    thumbnailMedia: placeholderMedia("Athlete systems thumbnail.", "4:3", 800, 600),
    scenes: [],
    relatedProjects: [],
    href: "https://www.instagram.com/_she22much/",
  },

  // ---- Scaffolding placeholders (named in the brief, not yet real) ---------
  // Marked todo:true and filtered out of every rendered list until they hold
  // real, verified content. They exist only as slots for a later increment.
  {
    slug: "horizons-at-georgia-tech",
    title: "Horizons at Georgia Tech",
    shortTitle: "Horizons",
    thesis: "TODO: confirm scope and role.",
    summary: "TODO: placeholder record named in the overhaul brief. Not yet written.",
    role: [],
    audiences: [],
    disciplines: [],
    formats: [],
    dateRange: "",
    metrics: [],
    featured: false,
    accent: "iris",
    heroMedia: placeholderMedia("Horizons at Georgia Tech placeholder.", "16:9", 1600, 900),
    thumbnailMedia: placeholderMedia("Horizons placeholder.", "4:3", 800, 600),
    scenes: [],
    relatedProjects: [],
    todo: true,
  },
  {
    slug: "interactive-learning-prototypes",
    title: "Interactive Learning Prototypes",
    shortTitle: "Interactive Prototypes",
    thesis: "TODO: select representative prototypes to feature.",
    summary: "TODO: placeholder record named in the overhaul brief. Not yet written.",
    role: [],
    audiences: [],
    disciplines: [],
    formats: [],
    dateRange: "",
    metrics: [],
    featured: false,
    accent: "gold",
    heroMedia: placeholderMedia("Interactive learning prototypes placeholder.", "16:9", 1600, 900),
    thumbnailMedia: placeholderMedia("Interactive prototypes placeholder.", "4:3", 800, 600),
    scenes: [],
    relatedProjects: [],
    todo: true,
  },
];

/** All real (non-placeholder) projects, ready to render. */
export const publishedProjects = projects.filter((p) => !p.todo);

/** The three flagship projects, in homepage order. */
export const getFeaturedProjects = (): Project[] =>
  publishedProjects.filter((p) => p.featured);

/** Archive projects (real, non-flagship). */
export const getArchiveProjects = (): Project[] =>
  publishedProjects.filter((p) => !p.featured);

export const getProjectBySlug = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug);

/** Slugs for generateStaticParams on /work/[slug] (real projects only). */
export const projectSlugs = (): string[] => publishedProjects.map((p) => p.slug);
