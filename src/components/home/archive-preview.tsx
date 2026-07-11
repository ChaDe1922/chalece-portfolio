import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { WorkGrid } from "@/components/work-grid";
import { Reveal } from "@/components/reveal";
import { archiveWork } from "@/data/work";

/** The wider body of work beyond the three flagships, on the cinematic scene,
 *  with a route to the full /work index. */
export function ArchivePreview() {
  return (
    <div>
      <WorkGrid
        items={archiveWork}
        id="archive"
        eyebrow="More proof, different contexts"
        title="One practice. Many forms."
        description="Technical courses, audio operations, creative coding, published research, youth learning, athlete systems, workshops, and interactive storytelling."
      />
      <div className="mx-auto -mt-8 max-w-6xl px-4 pb-20 md:px-8 md:pb-24">
        <Reveal>
          <Link
            href="/work"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            View all work
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
