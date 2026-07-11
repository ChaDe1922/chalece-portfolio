/**
 * Featured-work card shape, now DERIVED from the project source of truth in
 * `projects.ts` so there is a single place to edit work content.
 * Copy is paste-ready (no em dashes). `href` is optional; cards without a link
 * render as non-interactive.
 */

import {
  publishedProjects,
  getArchiveProjects,
  type Project,
} from "@/data/projects";

export type WorkItem = {
  title: string;
  description: string;
  tags: string[];
  href?: string;
};

/** Thin adapter: a Project rendered as a compact WorkCard. */
export function toWorkItem(project: Project): WorkItem {
  return {
    title: project.title,
    description: project.summary,
    tags: project.disciplines.slice(0, 3),
    href: project.href,
  };
}

/** Every real project (flagships + archive), for the /work index. */
export const work: WorkItem[] = publishedProjects.map(toWorkItem);

/** Archive-only (non-flagship) projects, for the homepage "wider work" strip. */
export const archiveWork: WorkItem[] = getArchiveProjects().map(toWorkItem);
