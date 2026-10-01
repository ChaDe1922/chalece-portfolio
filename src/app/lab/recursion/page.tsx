import type { Metadata } from "next";

import { LAB_OG_IMAGE, lessonTitle, site } from "@/data/site";
import { recursionLab } from "@/data/recursion-lab";
import { RecursionDeck } from "./recursion-deck";

const ogTitle = recursionLab.meta.ogTitle;

export const metadata: Metadata = {
  title: { absolute: lessonTitle(recursionLab.meta.title) },
  description: recursionLab.meta.description,
  alternates: { canonical: "/lab/recursion" },
  openGraph: {
    type: "article",
    images: [LAB_OG_IMAGE],
    url: `${site.url}/lab/recursion`,
    title: ogTitle,
    description: recursionLab.meta.description,
  },
  twitter: {
    card: "summary_large_image",
    images: [LAB_OG_IMAGE],
    title: ogTitle,
    description: recursionLab.meta.description,
  },
};

export default function RecursionLabPage() {
  return <RecursionDeck />;
}
