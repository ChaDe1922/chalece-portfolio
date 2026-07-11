import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${site.url}/lab`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${site.url}/lab/vibe-coding`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${site.url}/lab/recursion`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${site.url}/lab/spectrum`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${site.url}/lab/fourier`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${site.url}/lab/audio-tools`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
