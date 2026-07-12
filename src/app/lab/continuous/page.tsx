import type { Metadata } from "next";

import { ContinuousWorld } from "@/components/lab/continuous/continuous-world";

// Unlisted prototype: kept out of search + not linked from the Lab index or the
// sitemap (absent from data/experiments.ts). Reachable only by direct URL.
export const metadata: Metadata = {
  title: { absolute: "Continuous world (prototype) — Chalece DeLaCoudray" },
  description: "An unlisted prototype of a continuous 3D-world scroll experience.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/lab/continuous" },
};

export default function ContinuousWorldPage() {
  return <ContinuousWorld />;
}
