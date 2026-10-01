import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/data/site";
import { pillars, type Pillar } from "@/data/pillars";
import { ResumeLink } from "@/components/resume-section";
import { PillarIcon } from "@/components/pillar-icon";
import { MagneticButton } from "@/components/magnetic-button";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";

/** Pillar page close: the roles this pillar is open to, the track resume,
 *  an email CTA, and links to the other two pillars. */
export function PillarCta({ pillar }: { pillar: Pillar }) {
  const others = pillars.filter((p) => p.id !== pillar.id);
  return (
    <section id="hire" aria-labelledby="hire-heading" className="scroll-mt-24 lg:scroll-mt-32 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-5xl px-4 py-20 md:px-8 md:py-24 print:py-6">
        <Reveal>
          <SectionHeading
            id="hire-heading"
            eyebrow="Hiring?"
            title="Roles I am open to."
            description={site.openTo}
          />
        </Reveal>

        <Reveal className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <div>
            <ul className="flex flex-wrap gap-2">
              {pillar.roles.map((role) => (
                <li
                  key={role}
                  className={cn("rounded-full px-3.5 py-1.5 text-sm font-medium forced-colors:border", pillar.accent.subtle, pillar.accent.ink)}
                >
                  {role}
                </li>
              ))}
            </ul>
            <div className="mt-8 print:hidden">
              <MagneticButton href={site.links.email}>
                <Mail aria-hidden="true" />
                Email me about a role
              </MagneticButton>
            </div>
          </div>
          <div className="print:hidden">
            <ResumeLink pillar={pillar} />
          </div>
        </Reveal>

        <nav aria-label="Other work" className="mt-16 border-t border-border pt-8 print:hidden">
          <p className="text-sm font-medium text-muted-foreground">I also work in</p>
          <ul className="mt-3 flex flex-col gap-3 sm:flex-row sm:gap-6">
            {others.map((other) => (
              <li key={other.id}>
                <Link
                  href={`/${other.id}`}
                  className={cn(
                    "group inline-flex min-h-11 items-center gap-2 rounded-md font-medium underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    other.accent.ink
                  )}
                >
                  <PillarIcon name={other.icon} className={cn("size-4", other.accent.icon)} />
                  {other.name}
                  <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
