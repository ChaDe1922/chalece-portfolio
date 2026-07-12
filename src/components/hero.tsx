import { ArrowDown, FileDown, Sparkles } from "lucide-react";
import { MagneticButton } from "@/components/magnetic-button";
import { ClickWord } from "@/components/click-word";
import { site } from "@/data/site";

/** Above-the-fold hero. Oversized editorial headline, a soft gradient accent
 *  with grain overlay, and two CTAs. The h1 is the page's LCP element. */
export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden"
    >
      {/* Decorative gradient accent, kept to the right so the left-aligned
          text column sits on near-paper and keeps full AA contrast. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(48%_55%_at_92%_-8%,color-mix(in_oklch,var(--primary)_20%,transparent),transparent_70%),radial-gradient(42%_48%_at_100%_55%,color-mix(in_oklch,var(--coral)_14%,transparent),transparent_72%)] print:hidden"
      />
      {/* Decorative grain (sibling layer, behind content) */}
      <div
        aria-hidden="true"
        className="grain-overlay pointer-events-none absolute inset-0 -z-10 print:hidden"
      />
      <div className="relative mx-auto max-w-5xl px-4 pb-20 pt-20 md:px-8 md:pb-28 md:pt-28 print:pb-4 print:pt-2">
        <p className="enter enter-1 mb-5 text-sm font-medium uppercase tracking-[0.18em] text-link">
          Learning Experience Designer · Technologist · {site.location}
        </p>
        <h1
          id="hero-heading"
          className="enter enter-2 max-w-4xl text-[2rem] font-bold leading-[1.06] tracking-tight sm:text-balance sm:text-6xl sm:leading-[1.04] md:text-7xl print:text-4xl"
        >
          I make complex technical concepts <ClickWord />
        </h1>
        <p className="enter enter-3 mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl print:text-base">
          Ten years turning complex technical content into learning people
          actually finish and use. Ten published Coursera courses, 48,000+
          learners. M.S. Music Technology, Georgia Tech.
        </p>
        {/* Print-only: a clickable link to the interactive lessons. Hidden on
            screen (the hero CTA below covers that); shown in the PDF, where the
            absolute URL becomes a clickable annotation. */}
        <p className="mt-5 hidden text-base text-muted-foreground print:block">
          Try an interactive lesson:{" "}
          <a className="text-link underline" href={`${site.url}/lab`}>
            chalece-portfolio.vercel.app/lab
          </a>
        </p>
        <div className="enter enter-4 mt-9 flex flex-col gap-3 sm:flex-row sm:items-center print:hidden">
          <MagneticButton href="#work">
            See my work
            <ArrowDown aria-hidden="true" />
          </MagneticButton>
          <MagneticButton
            href={site.resumePath}
            variant="outline"
            download
            aria-label="Download resume, PDF"
          >
            <FileDown aria-hidden="true" />
            Download resume
          </MagneticButton>
          <MagneticButton href="/lab" variant="outline">
            <Sparkles aria-hidden="true" />
            Try an interactive lesson
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
