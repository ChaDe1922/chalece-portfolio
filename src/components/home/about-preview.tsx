import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { site } from "@/data/site";

/** Short about preview with the portrait, on a warm ivory scene. */
export function AboutPreview() {
  return (
    <section
      data-scene="ivory"
      aria-labelledby="about-preview-heading"
      className="bg-background"
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-[1fr_1.6fr] md:items-center md:gap-14 md:px-8 md:py-28">
        <Reveal className="order-first mx-auto w-full max-w-xs md:order-none">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted">
            {site.hasHeadshot ? (
              <Image
                src={site.headshotPath}
                alt={`${site.name}, learning experience designer and technologist`}
                fill
                sizes="(min-width: 768px) 20rem, 16rem"
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

        <Reveal>
          <p className="mb-3 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-link">
            <span aria-hidden="true" className="h-px w-6 bg-link" />
            About
          </p>
          <h2
            id="about-preview-heading"
            className="font-display text-3xl leading-tight sm:text-4xl"
          >
            Hi, I&apos;m Chalece.
          </h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-foreground/90 md:text-lg">
            <p>
              I am a learning experience designer, technologist, curriculum
              builder, and creative systems thinker.
            </p>
            <p>
              Across audio engineering, technical operations, education, program
              leadership, and software development, the pattern has remained
              consistent: I enter complex systems, find the logic, and make them
              usable.
            </p>
          </div>
          <Link
            href="/about"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Read my story
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
