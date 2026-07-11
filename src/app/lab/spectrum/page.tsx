import type { Metadata } from "next";

import { site } from "@/data/site";
import { fourierLab } from "@/data/fourier-lab";
import { SpectrumDeck } from "./spectrum-deck";

const meta = fourierLab.lessonOne;

export const metadata: Metadata = {
  title: { absolute: meta.title },
  description: meta.description,
  alternates: { canonical: "/lab/spectrum" },
  openGraph: {
    type: "article",
    url: `${site.url}/lab/spectrum`,
    title: meta.ogTitle,
    description: meta.description,
  },
  twitter: {
    card: "summary_large_image",
    title: meta.ogTitle,
    description: meta.description,
  },
};

export default function SpectrumLabPage() {
  return <SpectrumDeck />;
}
