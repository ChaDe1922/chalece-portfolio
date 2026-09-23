import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { site } from "@/data/site";

type Channel = {
  label: string;
  value: string;
  href: string;
  external?: boolean;
};

const channels: Channel[] = [
  { label: "Email", value: site.email, href: site.links.email },
  {
    label: "LinkedIn",
    value: "in/chalecedelacoudray",
    href: site.links.linkedin,
    external: true,
  },
  {
    label: "Coursera",
    value: "10 published courses",
    href: site.links.coursera,
    external: true,
  },
];

/** Contact channels as a hairline list. Email + LinkedIn + Coursera, no form
 *  in v1. Each row is one full-width link; hover turns the value bronze. */
export function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-24 border-t border-border bg-background"
    >
      <div className="mx-auto max-w-5xl px-4 py-20 md:px-8 md:py-28 print:py-6">
        <Reveal>
          <SectionHeading
            id="contact-heading"
            eyebrow="Availability"
            title="Contact"
            description="Available for senior learning-design roles and for curriculum, AI-assisted production, and learning-systems engagements."
          />
        </Reveal>

        <Reveal className="mt-12 print:mt-5">
          <ul className="divide-y divide-border border-y border-border">
            {channels.map(({ label, value, href, external }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="contact-card group flex min-h-14 items-center gap-4 py-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring print:py-2"
                >
                  <span className="flex min-w-0 flex-1 flex-col gap-1 sm:grid sm:grid-cols-[10rem_1fr] sm:items-center sm:gap-4">
                    <span className="eyebrow">{label}</span>
                    <span className="break-words text-base transition-colors group-hover:text-link group-focus-visible:text-link sm:text-lg">
                      {value}
                    </span>
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 text-muted-foreground transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-link group-focus-visible:-translate-y-0.5 group-focus-visible:translate-x-0.5 group-focus-visible:text-link"
                  />
                  {external ? (
                    <span className="sr-only"> (opens in a new tab)</span>
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
