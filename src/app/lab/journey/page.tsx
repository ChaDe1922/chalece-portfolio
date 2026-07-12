import type { Metadata } from "next";

import { Journey } from "@/components/world/journey";

// Unlisted prototype of the immersive-journey model (scroll-crossfade content
// beats over the living 3D world). Not indexed, not linked from the Lab index or
// the sitemap. Reachable by direct URL only.
export const metadata: Metadata = {
  title: { absolute: "Journey (prototype) — Chalece DeLaCoudray" },
  description: "An unlisted prototype of the immersive scroll-journey model.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/lab/journey" },
};

export default function JourneyPage() {
  return <Journey />;
}
