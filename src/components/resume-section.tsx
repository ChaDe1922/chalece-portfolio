import { Check, FileDown } from "lucide-react";
import { MagneticButton } from "@/components/magnetic-button";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { site } from "@/data/site";

const highlights = [
  "Seven published Coursera courses on DevOps, OS, CI/CD and more, 30,630+ learners reached.",
  "M.S. Music Technology, Georgia Tech (3.75 GPA), plus a B.A. from Georgia Tech.",
  "Led Audio Quality and Hardware Compatibility programs at Amazon Music.",
  "Published research at ACM CHI 2020, with practical AI-tooling proficiency.",
];

/** Resume highlights plus a download button for the full PDF. */
export function ResumeSection() {
  return (
    <section id="resume" aria-labelledby="resume-heading" className="scroll-mt-24">
      <div className="mx-auto max-w-5xl px-4 py-20 md:px-8 md:py-28 print:py-6">
        <Reveal>
          <SectionHeading
            id="resume-heading"
            eyebrow="Resume"
            title="The short version."
            description="The full history, formatted for ATS, is one click away."
          />
        </Reveal>

        <Reveal className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-center print:mt-5">
          <ul className="resume-highlights space-y-4">
            {highlights.map((line) => (
              <li key={line} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground"
                >
                  <Check className="size-4" />
                </span>
                <span className="text-base leading-relaxed text-foreground/90 print:text-[15px]">
                  {line}
                </span>
              </li>
            ))}
          </ul>

          <div className="lg:justify-self-end print:hidden">
            <MagneticButton
              href={site.resumePath}
              download
              aria-label="Download resume, PDF"
            >
              <FileDown aria-hidden="true" />
              Download resume (PDF)
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
