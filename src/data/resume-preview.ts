import { CRAFTS, ENTRIES } from "./resume-bank";
import { ORDER } from "./mix";
import type { PillarId } from "./pillars";
import type { CraftPreview, ResumePreview } from "./resume-mix";

/** A light outline of the resume bank for the contact mixer's page thumbnail. Built on the server. */
export function resumePreview(): ResumePreview {
  const entries = (id: PillarId): CraftPreview["entries"] =>
    ENTRIES.filter((e) => e.home === id).map((e) => ({
      title: e.title,
      kind: e.kind,
      minTier: e.minTier,
      bullets: e.bullets.length,
    }));
  return Object.fromEntries(
    ORDER.map((id) => {
      const c = CRAFTS[id];
      const preview: CraftPreview = {
        section: c.section,
        title: c.title,
        soloHeadline: c.soloHeadline,
        skills: c.skills.length,
        entries: entries(id),
      };
      return [id, preview];
    }),
  ) as ResumePreview;
}
