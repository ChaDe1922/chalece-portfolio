import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import {
  getProjectBySlug,
  projectSlugs,
  type ProjectAccent,
} from "@/data/projects";
import { ProjectMedia } from "@/components/project/project-media";
import { ProjectMetadata } from "@/components/project/project-metadata";
import { buildMetadata } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return buildMetadata({
    title: project.shortTitle,
    description: project.summary,
    path: `/work/${slug}`,
  });
}

const accentText: Record<ProjectAccent, string> = {
  iris: "text-signal-iris",
  cyan: "text-signal-cyan",
  coral: "text-signal-coral",
  gold: "text-signal-gold",
};

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project || project.todo) notFound();

  const verifiedMetrics = project.metrics.filter((m) => m.verified);

  return (
    <div data-scene="ivory" className="bg-background text-foreground">
      <article className="mx-auto max-w-4xl px-4 py-16 md:px-8 md:py-24">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          All work
        </Link>

        <header className="mt-8">
          <p
            className={`font-mono text-xs uppercase tracking-widest ${accentText[project.accent]}`}
          >
            {project.disciplines.join(" · ")}
          </p>
          <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl md:text-6xl">
            {project.thesis}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {project.summary}
          </p>
        </header>

        <div className="mt-10">
          <ProjectMedia media={project.heroMedia} accent={project.accent} priority />
        </div>

        {verifiedMetrics.length > 0 ? (
          <ul className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {verifiedMetrics.map((metric) => (
              <li key={metric.label}>
                <p className="font-heading text-3xl font-bold tabular-nums">
                  {metric.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {metric.label}
                </p>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-12 border-t border-border/60 pt-10">
          <ProjectMetadata project={project} />
        </div>

        {/* The deep, scene-by-scene case study is in production. This scaffold
            presents the verified essentials now without faking depth. */}
        <div className="mt-12 rounded-2xl border border-border bg-card p-6">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            In progress
          </p>
          <p className="mt-2 text-base leading-relaxed text-foreground/90">
            The full case study, with the challenge, the system, the learner
            experience, process artifacts, outcomes, and reflection, is in
            production.
          </p>
          {project.href ? (
            <a
              href={project.href}
              {...(project.href.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="mt-4 inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-link hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              See the work
              <ArrowUpRight aria-hidden="true" className="size-4" />
              {project.href.startsWith("http") ? (
                <span className="sr-only"> (opens in a new tab)</span>
              ) : null}
            </a>
          ) : null}
        </div>
      </article>
    </div>
  );
}
