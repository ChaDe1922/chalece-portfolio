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
        <p className="eyebrow mb-4 inline-flex items-center gap-3">
          <span aria-hidden="true" className="h-px w-6 bg-border" />
          {eyebrow}
        </p>
      ) : null}
      <h2 id={id} className="display-2">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg print:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
