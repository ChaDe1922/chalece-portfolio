import type { Metadata } from "next";

import { LAB_OG_IMAGE, lessonTitle, site } from "@/data/site";
import { soundLab } from "@/data/sound-lab";
import { SoundDeck } from "./sound-deck";

const ogTitle = soundLab.meta.ogTitle;

export const metadata: Metadata = {
  title: { absolute: lessonTitle(soundLab.meta.title) },
  description: soundLab.meta.description,
  alternates: { canonical: "/lab/sound" },
  openGraph: {
    type: "article",
    images: [LAB_OG_IMAGE],
    url: `${site.url}/lab/sound`,
    title: ogTitle,
    description: soundLab.meta.description,
  },
  twitter: {
    card: "summary_large_image",
    images: [LAB_OG_IMAGE],
    title: ogTitle,
    description: soundLab.meta.description,
  },
};

export default function SoundLabPage() {
  return <SoundDeck />;
}
