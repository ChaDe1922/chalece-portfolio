import { Check, FileDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { pillars, type Pillar } from "@/data/pillars";
import { PillarIcon } from "@/components/pillar-icon";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";

// One line per pillar in create/build/teach order, then credentials.
const highlights = [
  "M.S. in Music Technology from Georgia Tech, and audio quality and hardware compatibility for Amazon Amp across 1,200+ test scenarios.",
  "Software people use: data systems in Athlete OS, embedded game hardware published at ACM CHI 2020, and eight interactive lessons on this site.",
  "Ten published Coursera courses on DevOps, CI/CD, containers and Unix, with 48,000+ learners reached.",
  "B.A. in Music Technology from Bethune-Cookman University, and Your Voice Is Power, published at IEEE RESPECT and ASEE.",
];

/** One resume download, styled with its pillar's quiet fill. */
export function ResumeLink({ pillar, className }: { pillar: Pillar; className?: string }) {
  return (
    <a
      href={pillar.resumePath}
      download
      className={cn(
        "group flex min-h-14 items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
    >
      <span className={cn("grid size-9 shrink-0 place-items-center rounded-lg", pillar.accent.subtle)}>
        <PillarIcon name={pillar.icon} className={cn("size-4", pillar.accent.icon)} />
      </span>
      <span className="flex flex-col">
        <span className="text-sm font-medium">{pillar.name} resume</span>
        <span className="text-xs text-muted-foreground">PDF, ready for applicant tracking systems</span>
      </span>
      <FileDown aria-hidden="true" className="ml-auto size-5 shrink-0 text-muted-foreground group-hover:text-foreground" />
    </a>
  );
}

/** Resume highlights plus one download per pillar. */
export function ResumeSection() {
  return (
    <section id="resume" aria-labelledby="resume-heading" className="scroll-mt-24">
      <div className="mx-auto max-w-5xl px-4 py-20 md:px-8 md:py-28 print:py-6">
        <Reveal>
          <SectionHeading
            id="resume-heading"
            eyebrow="Resume"
            title="The short version."
            description="Pick the resume for the role you are hiring for. Each one is formatted for applicant tracking systems."
          />
        </Reveal>

        <Reveal className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start print:mt-5">
          <ul className="resume-highlights space-y-4">
            {highlights.map((line) => (
              <li key={line} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground"
                >
                  <Check className="size-4" />
                </span>
                <span className="text-base leading-relaxed text-foreground/90 print:text-[15px]">{line}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 print:hidden">
            {pillars.map((pillar) => (
              <ResumeLink key={pillar.id} pillar={pillar} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
