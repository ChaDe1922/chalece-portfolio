import type { Metadata } from "next";

import { site } from "@/data/site";
import { soundLab } from "@/data/sound-lab";
import { SoundDeck } from "./sound-deck";

const ogTitle = soundLab.meta.ogTitle;

export const metadata: Metadata = {
  title: { absolute: soundLab.meta.title },
  description: soundLab.meta.description,
  alternates: { canonical: "/lab/sound" },
  openGraph: {
    type: "article",
    url: `${site.url}/lab/sound`,
    title: ogTitle,
    description: soundLab.meta.description,
  },
  twitter: {
    card: "summary_large_image",
    title: ogTitle,
    description: soundLab.meta.description,
  },
};

export default function SoundLabPage() {
  return <SoundDeck />;
}
