import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { DirectedReveal } from "@/components/motion/directed-reveal";

const disciplines = [
  {
    title: "Strategy",
    body: "Define what people must become able to do, not merely what content must be covered.",
  },
  {
    title: "Experience",
    body: "Turn difficult ideas into clear sequences of explanation, exploration, practice, feedback, and transfer.",
  },
  {
    title: "Systems",
    body: "Build workflows, standards, agents, and quality gates that allow excellent work to scale.",
  },
  {
    title: "Media",
    body: "Choose sound, video, animation, code, simulation, or text according to what makes the idea land.",
  },
];

/** Four disciplines Chalece works across, on a warm ivory scene. */
export function FullStack() {
  return (
    <section
      data-scene="ivory"
      aria-labelledby="full-stack-heading"
      className="bg-background"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
        <Reveal>
          <SectionHeading
            id="full-stack-heading"
            eyebrow="The full stack of learning"
            title="I work from strategy to signal."
          />
        </Reveal>
        <DirectedReveal deal className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {disciplines.map((d, i) => (
            <div
              key={d.title}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <p className="font-mono text-xs text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 font-heading text-xl font-semibold">
                {d.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {d.body}
              </p>
            </div>
          ))}
        </DirectedReveal>
      </div>
    </section>
  );
}
