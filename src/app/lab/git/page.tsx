import type { Metadata } from "next";

import { LAB_OG_IMAGE, lessonTitle, site } from "@/data/site";
import { gitLab } from "@/data/git-lab";
import { GitDeck } from "./git-deck";

const ogTitle = gitLab.meta.ogTitle;

export const metadata: Metadata = {
  title: { absolute: lessonTitle(gitLab.meta.title) },
  description: gitLab.meta.description,
  alternates: { canonical: "/lab/git" },
  openGraph: {
    type: "article",
    images: [LAB_OG_IMAGE],
    url: `${site.url}/lab/git`,
    title: ogTitle,
    description: gitLab.meta.description,
  },
  twitter: {
    card: "summary_large_image",
    images: [LAB_OG_IMAGE],
    title: ogTitle,
    description: gitLab.meta.description,
  },
};

export default function GitLabPage() {
  return <GitDeck />;
}
