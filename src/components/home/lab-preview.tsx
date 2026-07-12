import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { DirectedReveal } from "@/components/motion/directed-reveal";
import { liveExperiments } from "@/data/experiments";
import type { ProjectAccent } from "@/data/projects";

const accentText: Record<ProjectAccent, string> = {
  iris: "text-signal-iris",
  cyan: "text-signal-cyan",
  coral: "text-signal-coral",
  gold: "text-signal-gold",
};

/** Learning Lab preview on a warm ivory scene. Shows live experiments only
 *  (linking into the real, shipped lab lessons) plus a route to the full Lab. */
export function LabPreview() {
  const items = liveExperiments();

  return (
    <section
      data-scene="ivory"
      aria-labelledby="lab-heading"
      className="bg-background"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
        <Reveal>
          <SectionHeading
            id="lab-heading"
            eyebrow="Learning Lab"
            title="Learning should invite action."
            description="Small, working demonstrations of how I make difficult ideas visible, manipulable, and memorable."
          />
        </Reveal>

        <DirectedReveal deal className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((exp) => (
            <Link
              key={exp.id}
              href={exp.href}
              className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <p
                className={cn(
                  "font-mono text-[11px] uppercase tracking-widest",
                  accentText[exp.accent],
                )}
              >
                Live
              </p>
              <h3 className="mt-3 font-heading text-lg font-semibold">
                {exp.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {exp.blurb}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-link">
                {exp.cta}
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          ))}
        </DirectedReveal>

        <Reveal className="mt-10">
          <Link
            href="/lab"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Explore the Learning Lab
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
