import type { Metadata } from "next";

import { site } from "@/data/site";
import { gitLab } from "@/data/git-lab";
import { GitDeck } from "./git-deck";

const ogTitle = gitLab.meta.ogTitle;

export const metadata: Metadata = {
  title: { absolute: gitLab.meta.title },
  description: gitLab.meta.description,
  alternates: { canonical: "/lab/git" },
  openGraph: {
    type: "article",
    url: `${site.url}/lab/git`,
    title: ogTitle,
    description: gitLab.meta.description,
  },
  twitter: {
    card: "summary_large_image",
    title: ogTitle,
    description: gitLab.meta.description,
  },
};

export default function GitLabPage() {
  return <GitDeck />;
}
