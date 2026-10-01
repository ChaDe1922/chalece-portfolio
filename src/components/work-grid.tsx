import { Suspense } from "react";
import { work, workForPillar } from "@/data/work";
import { pillarById, type PillarId } from "@/data/pillars";
import { WorkCards } from "@/components/work-cards";
import { WorkFilter } from "@/components/work-filter";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";

/**
 * Featured work. On the homepage it has a pillar filter; on a pillar page it
 * shows that pillar's work, primary cards first, with no filter.
 */
export function WorkGrid({ pillar }: { pillar?: PillarId }) {
  const heading = pillar
    ? {
        eyebrow: "Featured work",
        title: `${pillarById[pillar].short} work`,
        description: "Work where this is the main skill comes first, then work where it plays a supporting part.",
      }
    : {
        eyebrow: "Featured work",
        title: "Proof, not promises.",
        description:
          "Courses, audio programs and software that shipped. Filter by the work you care about. Public work links out where it lives.",
      };

  return (
    <section id="work" aria-labelledby="work-heading" className="scroll-mt-24">
      <div className="mx-auto max-w-5xl px-4 py-20 md:px-8 md:py-28 print:py-6">
        <Reveal>
          <SectionHeading id="work-heading" {...heading} />
        </Reveal>

        {pillar ? (
          <WorkCards items={workForPillar(pillar)} className="mt-10" />
        ) : (
          <Suspense fallback={<WorkCards items={work} className="mt-10" />}>
            <WorkFilter />
          </Suspense>
        )}
      </div>
    </section>
  );
}
