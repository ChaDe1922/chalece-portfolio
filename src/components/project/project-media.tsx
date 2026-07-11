import Image from "next/image";
import { cn } from "@/lib/utils";
import type { MediaAsset, ProjectAccent } from "@/data/projects";

const accentWash: Record<ProjectAccent, string> = {
  iris: "from-signal-iris/25",
  cyan: "from-signal-cyan/25",
  coral: "from-signal-coral/25",
  gold: "from-signal-gold/25",
};

type ProjectMediaProps = {
  media: MediaAsset;
  accent: ProjectAccent;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

/**
 * Renders a project's media. While media.placeholder is true (this increment,
 * before real screenshots/video exist) it draws a labeled, art-directed
 * placeholder with the project's accent, never a broken <img>. The label makes
 * clear it is a placeholder so a mockup is never mistaken for a screenshot.
 * A fixed aspect ratio reserves layout in every case (no CLS).
 */
export function ProjectMedia({
  media,
  accent,
  className,
  priority,
  sizes = "(min-width: 1024px) 42rem, 100vw",
}: ProjectMediaProps) {
  const ratio = media.aspectRatio.replace(":", " / ");

  if (media.placeholder) {
    return (
      <figure
        className={cn(
          "relative isolate overflow-hidden rounded-2xl border border-border bg-card",
          className,
        )}
        style={{ aspectRatio: ratio }}
      >
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-0 -z-10 bg-gradient-to-br to-transparent",
            accentWash[accent],
          )}
        />
        <div
          aria-hidden="true"
          className="grain-overlay pointer-events-none absolute inset-0 -z-10"
        />
        <figcaption className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <span className="rounded-full border border-border/70 bg-background/50 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Media placeholder
          </span>
          <span className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            {media.alt}
          </span>
        </figcaption>
      </figure>
    );
  }

  return (
    <figure
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card",
        className,
      )}
      style={{ aspectRatio: ratio }}
    >
      <Image
        src={media.src}
        alt={media.alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
      />
      {media.caption ? (
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/80 to-transparent p-3 text-xs text-muted-foreground">
          {media.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
