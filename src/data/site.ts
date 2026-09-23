/**
 * Single source of truth for site-wide content: identity, links, SEO copy,
 * and nav anchors. Update here, not in component JSX.
 * Copy style rule: no em dashes anywhere.
 */

export const site = {
  name: "Chalece DeLaCoudray",
  role: "Learning Experience Designer & Technologist",
  // Used for metadataBase and absolute URLs. Update when the custom domain lands.
  url: "https://chalece-portfolio.vercel.app",
  location: "Atlanta, Remote",
  email: "cdelacoudray@gmail.com",
  resumePath: "/Chalece-DeLaCoudray-Resume.pdf",
  headshotPath: "/headshot.png",
  // Flip to true once a real headshot is placed at public/headshot.png.
  // Until then the About section shows a polished monogram placeholder.
  hasHeadshot: true,
  initials: "CD",

  links: {
    linkedin: "https://www.linkedin.com/in/chalecedelacoudray",
    coursera: "https://www.coursera.org/instructor/~88911140",
    email: "mailto:cdelacoudray@gmail.com",
  },

  seo: {
    title: "Chalece DeLaCoudray | Learning Experience Designer & Technologist",
    description:
      "Learning experience designer and technologist in Atlanta. 10 published Coursera courses, 48,000+ learners. M.S. Music Technology, Georgia Tech. Open to remote roles.",
    keywords: [
      "Chalece DeLaCoudray",
      "learning experience designer",
      "instructional designer Atlanta",
      "technical curriculum developer",
      "Coursera instructor",
      "music technologist",
      "AI curriculum designer",
      "remote instructional designer",
    ],
  },
} as const;

export type NavItem = { label: string; href: string };

export const navItems: NavItem[] = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Resume", href: "#resume" },
  { label: "Contact", href: "#contact" },
];
