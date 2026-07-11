import type { Metadata } from "next";

import { site } from "@/data/site";
import { fourierLab } from "@/data/fourier-lab";
import { FourierDeck } from "./fourier-deck";

const meta = fourierLab.lessonTwo;

export const metadata: Metadata = {
  title: { absolute: meta.title },
  description: meta.description,
  alternates: { canonical: "/lab/fourier" },
  openGraph: {
    type: "article",
    url: `${site.url}/lab/fourier`,
    title: meta.ogTitle,
    description: meta.description,
  },
  twitter: {
    card: "summary_large_image",
    title: meta.ogTitle,
    description: meta.description,
  },
};

export default function FourierLabPage() {
  return <FourierDeck />;
}
