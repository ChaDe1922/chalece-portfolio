import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { site } from "@/data/site";
import { continuedLearning } from "@/data/learning";

const skills = [
  "Learning experience design",
  "Curriculum and assessment",
  "Adult learning (ADDIE, Bloom's)",
  "Technical content (DevOps, OS, CI/CD)",
  "AI tooling and prototyping",
  "Storytelling and short-form video",
  "Photography and graphic design",
  "UX and WCAG accessibility",
  "Python, JavaScript, HTML/CSS",
  "Program management",
];

/** Bio, skills snapshot, and headshot. */
export function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="scroll-mt-24 bg-secondary/40"
    >
      <div className="mx-auto max-w-5xl px-4 py-20 md:px-8 md:py-28 print:px-0 print:py-6">
        <Reveal>
          <SectionHeading id="about-heading" eyebrow="About" title="Hi, I'm Chalece." />
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-start lg:gap-12 print:mt-5 print:grid-cols-[1fr_11rem] print:items-start print:gap-6">
          <Reveal className="max-w-prose space-y-5 text-base leading-relaxed text-foreground/90 sm:text-lg print:order-1 print:text-base">
            <p>
              I am a learning experience designer and technologist who turns
              complex, technical material into learning that sticks. I started
              in audio engineering and studio operations, earned a B.A. from
              Bethune-Cookman University and an M.S. in Music Technology from
              Georgia Tech, where my graduate research used music to help
              toddlers build early literacy, and
              built a decade-long career around one idea: that hard things
              become learnable when you design for the learner, not the spec.
            </p>
            <p>
              At Codio I authored ten published Coursera courses, on DevOps,
              containers, CI/CD, operating systems, and more, reaching over
              48,000 learners. At Amazon Music I led technical programs
              and stood up the systems behind them. Along the way I co-founded
              an athletics-development venture, mentored young coders, published
              research at ACM CHI, and work fluently with AI tooling to
              prototype and ship faster.
            </p>
            <p>
              I care about clarity, accessibility, and craft. If you have
              something complex that people need to understand, I can help them
              get there.
            </p>

            <div className="pt-2">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Skills snapshot
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <li key={skill}>
                    <Badge variant="outline" className="font-normal">
                      {skill}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Continued learning
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Courses I have completed myself, separate from the ten I authored.
              </p>
              <ul className="mt-3 space-y-2 text-base leading-relaxed text-foreground/85 sm:text-[15px]">
                {continuedLearning.map((item) => (
                  <li key={item.source}>
                    <span className="font-medium text-foreground">
                      {item.source}:
                    </span>{" "}
                    {item.detail}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal className="about-photo order-first lg:order-none lg:pt-2 print:order-2">
            <div className="about-figure relative mx-auto aspect-square w-full max-w-[16rem] overflow-hidden rounded-2xl border border-border bg-muted sm:max-w-xs lg:mx-0 print:mx-0 print:max-w-[11rem]">
              {site.hasHeadshot ? (
                <Image
                  src={site.headshotPath}
                  alt={`${site.name}, learning experience designer and technologist`}
                  fill
                  sizes="(min-width: 640px) 20rem, 16rem"
                  className="object-cover object-top"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="flex h-full w-full items-center justify-center bg-[radial-gradient(120%_120%_at_20%_0%,color-mix(in_oklch,var(--primary)_28%,var(--card)),var(--card))]"
                >
                  <span className="font-heading text-7xl font-bold text-link/80">
                    {site.initials}
                  </span>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
