import type { Metadata } from "next";

import { site } from "@/data/site";
import { recursionLab } from "@/data/recursion-lab";
import { RecursionDeck } from "./recursion-deck";

const ogTitle = "Recursion, watch it run. An interactive lesson by Chalece DeLaCoudray.";

export const metadata: Metadata = {
  title: { absolute: recursionLab.meta.title },
  description: recursionLab.meta.description,
  alternates: { canonical: "/lab/recursion" },
  openGraph: {
    type: "article",
    url: `${site.url}/lab/recursion`,
    title: ogTitle,
    description: recursionLab.meta.description,
  },
  twitter: {
    card: "summary_large_image",
    title: ogTitle,
    description: recursionLab.meta.description,
  },
};

export default function RecursionLabPage() {
  return <RecursionDeck />;
}
