import type { Metadata } from "next";
import { WorkGrid } from "@/components/work-grid";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Work",
  description:
    "Selected work by Chalece DeLaCoudray: technical courses, AI-assisted production, interactive learning, audio, video, research, and program leadership.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <div data-scene="ivory" className="bg-background text-foreground">
      <WorkGrid
        id="work"
        eyebrow="Work"
        title="One practice. Many forms."
        description="Technical courses, AI-assisted production, interactive learning, audio, video, published research, and program leadership. Public work links out where it lives."
      />
    </div>
  );
}
