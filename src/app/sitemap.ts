import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { projectSlugs } from "@/data/projects";

const labRoutes = [
  "/lab",
  "/lab/recursion",
  "/lab/git",
  "/lab/sound",
  "/lab/spectrum",
  "/lab/fourier",
  "/lab/audio-tools",
  "/lab/vibe-coding",
];

const marketingRoutes = ["/work", "/leadership", "/about", "/resume", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const abs = (path: string) => `${site.url}${path}`;

  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    ...marketingRoutes.map((path) => ({
      url: abs(path),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...projectSlugs().map((slug) => ({
      url: abs(`/work/${slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...labRoutes.map((path) => ({
      url: abs(path),
      changeFrequency: "monthly" as const,
      priority: path === "/lab" ? 0.6 : 0.7,
    })),
  ];
}
