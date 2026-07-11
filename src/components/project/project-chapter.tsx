import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { DirectedReveal } from "@/components/motion/directed-reveal";
import { ProjectMedia } from "@/components/project/project-media";
import type { Project, ProjectAccent } from "@/data/projects";

const accent: Record<
  ProjectAccent,
  { text: string; border: string; dot: string; rule: string }
> = {
  iris: {
    text: "text-signal-iris",
    border: "border-signal-iris/40",
    dot: "bg-signal-iris",
    rule: "bg-signal-iris/40",
  },
  cyan: {
    text: "text-signal-cyan",
    border: "border-signal-cyan/40",
    dot: "bg-signal-cyan",
    rule: "bg-signal-cyan/40",
  },
  coral: {
    text: "text-signal-coral",
    border: "border-signal-coral/40",
    dot: "bg-signal-coral",
    rule: "bg-signal-coral/40",
  },
  gold: {
    text: "text-signal-gold",
    border: "border-signal-gold/40",
    dot: "bg-signal-gold",
    rule: "bg-signal-gold/40",
  },
};

type Variant = "grid" | "pipeline" | "tags";

type ProjectChapterProps = {
  project: Project;
  index: number;
  eyebrow: string;
  ctaLabel: string;
  ctaHref: string;
  variant: Variant;
};

/** Renders a flagship's supporting proof three visibly different ways so the
 *  three chapters do not read as one card repeated. */
function Highlights({
  items,
  variant,
  a,
}: {
  items: string[];
  variant: Variant;
  a: (typeof accent)[ProjectAccent];
}) {
  if (variant === "grid") {
    return (
      <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className={cn("mt-2 size-1.5 shrink-0 rounded-full", a.dot)}
            />
            <span className="text-sm leading-relaxed text-foreground/90">
              {item}
            </span>
          </li>
        ))}
      </ul>
    );
  }

  if (variant === "pipeline") {
    return (
      <ol className={cn("mt-8 space-y-4 border-l pl-6", a.border)}>
        {items.map((item, i) => (
          <li key={item} className="relative">
            <span
              aria-hidden="true"
              className={cn(
                "absolute -left-[1.65rem] top-1 flex size-4 items-center justify-center rounded-full",
                a.dot,
              )}
            >
              <span className="font-mono text-[9px] text-signal-black">
                {i + 1}
              </span>
            </span>
            <span className="text-sm leading-relaxed text-foreground/90">
              {item}
            </span>
          </li>
        ))}
      </ol>
    );
  }

  // tags
  return (
    <ul className="mt-8 flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs font-medium text-foreground/90",
            a.border,
          )}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

export function ProjectChapter({
  project,
  index,
  eyebrow,
  ctaLabel,
  ctaHref,
  variant,
}: ProjectChapterProps) {
  const a = accent[project.accent];
  const mediaFirst = index % 2 === 1; // alternate the media side on desktop
  const external = ctaHref.startsWith("http");

  return (
    <section
      aria-labelledby={`chapter-${project.slug}`}
      className="border-t border-border/50"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Media (enters from the outer edge) */}
          <DirectedReveal
            direction={mediaFirst ? "left" : "right"}
            className={cn(mediaFirst ? "lg:order-first" : "lg:order-last")}
          >
            <ProjectMedia media={project.heroMedia} accent={project.accent} />
          </DirectedReveal>

          {/* Text (enters from the opposite edge) */}
          <DirectedReveal direction={mediaFirst ? "right" : "left"}>
            <p
              className={cn(
                "font-mono text-xs uppercase tracking-[0.2em]",
                a.text,
              )}
            >
              {String(index + 1).padStart(2, "0")} · {eyebrow}
            </p>
            <h2
              id={`chapter-${project.slug}`}
              className="font-display mt-4 text-3xl leading-[1.05] tracking-tight sm:text-5xl"
            >
              {project.thesis}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {project.summary}
            </p>

            {project.highlights ? (
              <Highlights items={project.highlights} variant={variant} a={a} />
            ) : null}

            <Link
              href={ctaHref}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className={cn(
                "mt-9 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                a.border,
              )}
            >
              {ctaLabel}
              <ArrowUpRight aria-hidden="true" className="size-4" />
              {external ? (
                <span className="sr-only"> (opens in a new tab)</span>
              ) : null}
            </Link>
          </DirectedReveal>
        </div>
      </div>
    </section>
  );
}
