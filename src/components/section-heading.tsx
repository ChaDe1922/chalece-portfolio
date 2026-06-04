import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  /** id for the rendered h2, so a parent <section> can aria-labelledby it. */
  id?: string;
  className?: string;
};

/** Consistent section header: small eyebrow label, h2 title, optional intro. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("section-heading max-w-2xl", className)}>
      {eyebrow ? (
        <p className="mb-3 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-link">
          <span aria-hidden="true" className="h-px w-6 bg-link" />
          {eyebrow}
        </p>
      ) : null}
      <h2 id={id} className="text-3xl font-bold sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
