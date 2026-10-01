import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { labs } from "@/data/labs";
import { pillarIds } from "@/data/pillars";

export default function sitemap(): MetadataRoute.Sitemap {
  // Lab lessons come from the same list the /lab carousel renders, so a new
  // lesson can't be left out of the sitemap. External static demos are skipped.
  const lessons: MetadataRoute.Sitemap = labs
    .filter((lab) => !lab.external)
    .map((lab) => ({
      url: `${site.url}${lab.href}`,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  // One page per pillar, all at the same priority so no craft outranks another.
  const pillarPages: MetadataRoute.Sitemap = pillarIds.map((id) => ({
    url: `${site.url}/${id}`,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  return [
    {
      url: site.url,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...pillarPages,
    {
      url: `${site.url}/lab`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...lessons,
  ];
}
