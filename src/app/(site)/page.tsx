import { HeroStatement } from "@/components/home/hero-statement";
import { MetricStrip } from "@/components/home/metric-strip";
import { EditorialStatement } from "@/components/home/editorial-statement";
import { SelectedSystemsIntro } from "@/components/home/selected-systems-intro";
import { ProjectChapter } from "@/components/project/project-chapter";
import { FullStack } from "@/components/home/full-stack";
import { LeadershipPreview } from "@/components/home/leadership-preview";
import { LabPreview } from "@/components/home/lab-preview";
import { ArchivePreview } from "@/components/home/archive-preview";
import { AboutPreview } from "@/components/home/about-preview";
import { ClosingCta } from "@/components/home/closing-cta";
import { WorldLayer } from "@/components/world/world-layer";
import { getFeaturedProjects } from "@/data/projects";

/**
 * V2 homepage. Editorial, act-based composition that alternates cinematic
 * (obsidian) and ivory (warm) scenes. Static and complete without JavaScript;
 * motion and sound are layered in later increments without changing this order.
 */

// Presentation for each flagship chapter, keyed by slug. Distinct variants keep
// the three chapters from reading as one repeated card.
const chapterConfig: Record<
  string,
  {
    eyebrow: string;
    ctaLabel: string;
    ctaHref: string;
    variant: "grid" | "pipeline" | "tags";
  }
> = {
  "codio-course-ecosystem": {
    eyebrow: "Technical learning at scale",
    ctaLabel: "Enter the course ecosystem",
    ctaHref: "/work/codio-course-ecosystem",
    variant: "grid",
  },
  "ai-curriculum-systems": {
    eyebrow: "AI-assisted content systems",
    ctaLabel: "Inspect the system",
    ctaHref: "/work/ai-curriculum-systems",
    variant: "pipeline",
  },
  "making-sound-visible": {
    eyebrow: "Interactive music technology",
    ctaLabel: "Enter the signal lab",
    ctaHref: "/lab/sound",
    variant: "tags",
  },
};

export default function HomePage() {
  const flagships = getFeaturedProjects();

  return (
    <>
      {/* Persistent world behind the content: the camera dollies into the distant
          wave rooms as you scroll. Decorative; renders nothing under
          reduced-motion / no-WebGL. */}
      <WorldLayer />

      {/* Act I: the transformation */}
      <HeroStatement />
      <MetricStrip />
      <EditorialStatement />

      {/* Act II: three flagship systems */}
      <SelectedSystemsIntro />
      {flagships.map((project, i) => {
        const config = chapterConfig[project.slug];
        if (!config) return null;
        return (
          <ProjectChapter
            key={project.slug}
            project={project}
            index={i}
            eyebrow={config.eyebrow}
            ctaLabel={config.ctaLabel}
            ctaHref={config.ctaHref}
            variant={config.variant}
          />
        );
      })}

      {/* Act III: point of view, lab, wider work, and contact */}
      <FullStack />
      <LeadershipPreview />
      <LabPreview />
      <ArchivePreview />
      <AboutPreview />
      <ClosingCta />
    </>
  );
}
