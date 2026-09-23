import { CtaLink } from "@/components/cta-link";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { site } from "@/data/site";

const highlights = [
  "Ten published Coursera courses on DevOps, OS, CI/CD and more, 48,000+ learners reached.",
  "M.S. Music Technology, Georgia Tech (3.75 GPA), plus a B.A. from Bethune-Cookman University.",
  "Led Audio Quality and Hardware Compatibility programs at Amazon Music.",
  "Published research at ACM CHI 2020, with practical AI-tooling proficiency.",
];

/** Experience highlights plus a link to the full PDF résumé. */
export function ResumeSection() {
  return (
    <section
      id="resume"
      aria-labelledby="resume-heading"
      className="scroll-mt-24 border-t border-border"
    >
      <div className="mx-auto max-w-5xl px-4 py-20 md:px-8 md:py-28 print:py-6">
        <Reveal>
          <SectionHeading
            id="resume-heading"
            eyebrow="Résumé"
            title="Experience"
            description="The full history, formatted for ATS, is one click away."
          />
        </Reveal>

        <Reveal className="mt-12 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-start print:mt-5">
          <ol className="resume-highlights divide-y divide-border border-y border-border">
            {highlights.map((line, i) => (
              <li key={line} className="flex gap-5 py-4">
                <span aria-hidden="true" className="eyebrow pt-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-base leading-relaxed text-foreground/90 print:text-[15px]">
                  {line}
                </span>
              </li>
            ))}
          </ol>

          <div className="lg:justify-self-end lg:pt-4 print:hidden">
            <CtaLink
              href={site.resumePath}
              variant="outline"
              download
              aria-label="Résumé, PDF download"
            >
              Résumé (PDF)
            </CtaLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
