import { work, type WorkItem } from "@/data/work";
import { WorkCard } from "@/components/work-card";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { DirectedReveal } from "@/components/motion/directed-reveal";

type WorkGridProps = {
  items?: WorkItem[];
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
};

/** Featured work, laid out as a uniform, even card grid: 1 column on mobile,
 *  2 on tablet, 3 on desktop. Cards stretch to equal heights per row.
 *  Copy and item list are overridable so the same grid serves the /work index
 *  and the homepage "wider work" archive strip. */
export function WorkGrid({
  items = work,
  id = "work",
  eyebrow = "Featured work",
  title = "Proof, not promises.",
  description = "A decade of turning complex technical ideas into learning and systems that ship. Public work links out where it lives.",
}: WorkGridProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-24">
      <div className="mx-auto max-w-5xl px-4 py-20 md:px-8 md:py-28 print:py-6">
        <Reveal>
          <SectionHeading
            id={`${id}-heading`}
            eyebrow={eyebrow}
            title={title}
            description={description}
          />
        </Reveal>

        <DirectedReveal
          deal
          className="work-grid mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 print:mt-4 print:gap-3"
        >
          {items.map((item) => (
            <WorkCard key={item.title} item={item} />
          ))}
        </DirectedReveal>
      </div>
    </section>
  );
}
