import { ArrowDown, ArrowUpRight } from "lucide-react";
import { CtaLink } from "@/components/cta-link";
import { site } from "@/data/site";

/** Above-the-fold hero. A serif display headline on the plain ivory ground,
 *  a factual subhead, one primary CTA and two text links. The h1 is the
 *  page's LCP element, so it stays server-rendered with no decoration
 *  layers in front of it. */
export function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-heading">
      <div className="mx-auto max-w-5xl px-4 pb-20 pt-20 md:px-8 md:pb-28 md:pt-32 print:pb-4 print:pt-2">
        <p className="enter enter-1 eyebrow mb-6">
          Learning experience design · Technology · {site.location}
        </p>
        <h1
          id="hero-heading"
          className="enter enter-2 display-1 max-w-4xl print:text-4xl"
        >
          Complex technology, <em>made learnable.</em>
        </h1>
        <p className="enter enter-3 mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl print:text-base">
          Ten years turning complex technical content into learning people
          actually finish and use. Ten published Coursera courses, 48,000+
          learners. M.S. Music Technology, Georgia Tech.
        </p>
        {/* Print-only: a clickable link to the interactive lessons. Hidden on
            screen (the text link below covers that); shown in the PDF, where
            the absolute URL becomes a clickable annotation. */}
        <p className="mt-5 hidden text-base text-muted-foreground print:block">
          Try an interactive lesson:{" "}
          <a className="text-link underline" href={`${site.url}/lab`}>
            chalece-portfolio.vercel.app/lab
          </a>
        </p>
        <div className="enter enter-4 mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7 print:hidden">
          <CtaLink href="#work">
            View selected work
            <ArrowDown aria-hidden="true" />
          </CtaLink>
          <CtaLink
            href={site.resumePath}
            variant="text"
            download
            aria-label="Résumé, PDF download"
          >
            Résumé (PDF)
          </CtaLink>
          <CtaLink href="/lab" variant="text">
            Interactive lessons
            <ArrowUpRight aria-hidden="true" />
          </CtaLink>
        </div>
      </div>
    </section>
  );
}
