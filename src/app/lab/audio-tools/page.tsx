import type { Metadata } from "next";

import { site } from "@/data/site";
import { fourierLab } from "@/data/fourier-lab";
import { AudioToolsDeck } from "./audio-tools-deck";

const meta = fourierLab.lessonThree;

export const metadata: Metadata = {
  title: { absolute: meta.title },
  description: meta.description,
  alternates: { canonical: "/lab/audio-tools" },
  openGraph: {
    type: "article",
    url: `${site.url}/lab/audio-tools`,
    title: meta.ogTitle,
    description: meta.description,
  },
  twitter: {
    card: "summary_large_image",
    title: meta.ogTitle,
    description: meta.description,
  },
};

export default function AudioToolsLabPage() {
  return <AudioToolsDeck />;
}
