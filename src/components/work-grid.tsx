import { work } from "@/data/work";
import { WorkCard } from "@/components/work-card";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";

/** Selected work as a hairline grid: 1 column on mobile, 2 on tablet, 3 on
 *  desktop. The 1px gap over a border-colored ground draws the rules between
 *  cells, so the cards need no individual borders. */
export function WorkGrid() {
  return (
    <section id="work" aria-labelledby="work-heading" className="scroll-mt-24">
      <div className="mx-auto max-w-5xl px-4 py-20 md:px-8 md:py-28 print:py-6">
        <Reveal>
          <SectionHeading
            id="work-heading"
            eyebrow="Selected work"
            title="Ten years of technical learning, programs, and research."
            description="Public work links out where it lives."
          />
        </Reveal>

        <Reveal className="mt-12 print:mt-4">
          <ul className="work-grid grid grid-cols-1 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {work.map((item, i) => (
              <li key={item.title} className="contents">
                <WorkCard item={item} index={i + 1} />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
