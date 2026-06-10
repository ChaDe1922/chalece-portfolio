import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Unlisted, share-by-link pages (e.g. /p/website-services-*.html) stay out of indexes.
      disallow: "/p/",
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
