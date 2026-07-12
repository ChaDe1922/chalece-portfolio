import type { Metadata } from "next";
import { ResumeSection } from "@/components/resume-section";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Resume",
  description:
    "Resume highlights for Chalece DeLaCoudray: 10 published Coursera courses, 48,000+ learners, M.S. Music Technology from Georgia Tech. Full PDF one click away.",
  path: "/resume",
});

export default function ResumePage() {
  return (
    <div data-scene="ivory" className="bg-background text-foreground">
      <ResumeSection />
    </div>
  );
}
