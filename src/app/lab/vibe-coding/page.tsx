import type { Metadata } from "next";

import { LAB_OG_IMAGE, lessonTitle, site } from "@/data/site";
import { vibeCodingLab } from "@/data/vibe-coding-lab";
import { VibeCodingDeck } from "./vibe-coding-deck";

const ogTitle = vibeCodingLab.meta.ogTitle;

export const metadata: Metadata = {
  title: { absolute: lessonTitle(vibeCodingLab.meta.title) },
  description: vibeCodingLab.meta.description,
  alternates: { canonical: "/lab/vibe-coding" },
  openGraph: {
    type: "article",
    images: [LAB_OG_IMAGE],
    url: `${site.url}/lab/vibe-coding`,
    title: ogTitle,
    description: vibeCodingLab.meta.description,
  },
  twitter: {
    card: "summary_large_image",
    images: [LAB_OG_IMAGE],
    title: ogTitle,
    description: vibeCodingLab.meta.description,
  },
};

export default function VibeCodingLabPage() {
  return <VibeCodingDeck />;
}
