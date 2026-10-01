import type { Metadata } from "next";

import { LAB_OG_IMAGE, lessonTitle, site } from "@/data/site";
import { fourierLab } from "@/data/fourier-lab";
import { AudioToolsDeck } from "./audio-tools-deck";

const meta = fourierLab.lessonThree;

export const metadata: Metadata = {
  title: { absolute: lessonTitle(meta.title) },
  description: meta.description,
  alternates: { canonical: "/lab/audio-tools" },
  openGraph: {
    type: "article",
    images: [LAB_OG_IMAGE],
    url: `${site.url}/lab/audio-tools`,
    title: meta.ogTitle,
    description: meta.description,
  },
  twitter: {
    card: "summary_large_image",
    images: [LAB_OG_IMAGE],
    title: meta.ogTitle,
    description: meta.description,
  },
};

export default function AudioToolsLabPage() {
  return <AudioToolsDeck />;
}
