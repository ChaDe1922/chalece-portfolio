import type { Metadata } from "next";
import { site } from "@/data/site";

type BuildMetadataInput = {
  /** Plain title; the root layout applies the "%s | Name" template. Omit for home. */
  title?: string;
  description?: string;
  /** Route path for the canonical + OG url, e.g. "/work". */
  path?: string;
};

/**
 * Reusable per-route metadata helper. Keeps canonical + Open Graph + Twitter in
 * sync from one place. The root layout owns metadataBase and the title template.
 */
export function buildMetadata({
  title,
  description,
  path = "/",
}: BuildMetadataInput = {}): Metadata {
  const resolvedTitle = title ?? site.seo.title;
  const resolvedDescription = description ?? site.seo.description;

  return {
    title,
    description: resolvedDescription,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      siteName: site.name,
      title: resolvedTitle,
      description: resolvedDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
    },
  };
}
