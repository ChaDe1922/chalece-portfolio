import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DirectedReveal } from "@/components/motion/directed-reveal";
import { site } from "@/data/site";

const secondary = [
  { label: "Resume", href: site.resumePath, external: false },
  { label: "LinkedIn", href: site.links.linkedin, external: true },
  { label: "Email", href: site.links.email, external: false },
  { label: "Selected work", href: "/work", external: false },
];

/** Closing call to action on the cinematic scene: the big finish. */
export function ClosingCta() {
  return (
    <section aria-labelledby="closing-heading" className="border-t border-border/50">
      <div className="mx-auto max-w-4xl px-4 py-24 text-center md:px-8 md:py-32">
        <DirectedReveal stagger direction="up">
          <h2
            id="closing-heading"
            className="font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl"
          >
            Let&apos;s build learning worthy of the technology.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            I am interested in ambitious work where content, curriculum,
            artificial intelligence, creative technology, and human capability
            meet.
          </p>
          <div className="mt-9 flex justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Start a conversation
              <ArrowUpRight aria-hidden="true" className="size-5" />
            </Link>
          </div>
          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {secondary.map(({ label, href, external }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="rounded-sm text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {label}
                  {external ? (
                    <span className="sr-only"> (opens in a new tab)</span>
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
        </DirectedReveal>
      </div>
    </section>
  );
}
