import type { Metadata } from "next";
import { AboutSection } from "@/components/about-section";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "Chalece DeLaCoudray is a learning experience designer and technologist who turns complex technical systems into learning people can see, hear, explore, and master.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div data-scene="ivory" className="bg-background text-foreground">
      <AboutSection />
    </div>
  );
}
