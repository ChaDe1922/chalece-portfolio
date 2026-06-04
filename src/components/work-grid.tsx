import { work } from "@/data/work";
import { WorkCard } from "@/components/work-card";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";

/** Featured work, laid out as a uniform, even card grid: 1 column on mobile,
 *  2 on tablet, 3 on desktop. Cards stretch to equal heights per row. */
export function WorkGrid() {
  return (
    <section id="work" aria-labelledby="work-heading" className="scroll-mt-24">
      <div className="mx-auto max-w-5xl px-4 py-20 md:px-8 md:py-28">
        <Reveal>
          <SectionHeading
            id="work-heading"
            eyebrow="Featured work"
            title="Proof, not promises."
            description="A decade of turning complex technical ideas into learning and systems that ship. Public work links out where it lives."
          />
        </Reveal>

        <Reveal className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {work.map((item) => (
            <WorkCard key={item.title} item={item} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
