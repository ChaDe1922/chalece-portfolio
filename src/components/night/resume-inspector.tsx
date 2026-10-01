import Link from "next/link";

import type { Clip } from "@/data/timeline";

type Props = {
  id: string;
  clip: Clip;
  lane: { name: string; color: string };
};

/** The detail panel under the timeline: whatever clip is selected. */
export function ResumeInspector({ id, clip, lane }: Props) {
  const where = [clip.org, clip.place].filter(Boolean).join(" · ");
  const external = clip.link && !clip.link.href.startsWith("/");
  const linkClass =
    "mt-6 inline-flex min-h-11 items-center gap-2 rounded-[10px] border px-4 text-sm font-medium text-night-fg hover:bg-night-raised";

  return (
    <article
      id={id}
      aria-labelledby={`${id}-title`}
      className="mt-4 rounded-3xl border border-night-line bg-night p-6 sm:p-8 md:min-h-[268px]"
    >
      <p className="flex items-center gap-2 font-mono text-xs" style={{ color: lane.color }}>
        <span aria-hidden="true" className="size-2 rounded-full" style={{ background: lane.color }} />
        {lane.name} · {clip.label}
      </p>
      <h3
        id={`${id}-title`}
        className="mt-3 font-display text-2xl font-bold leading-tight tracking-[-0.02em] text-night-fg text-balance md:text-[28px]"
      >
        {clip.role}
      </h3>
      <p className="mt-1.5 text-[15px] text-night-muted">{where}</p>
      <ul className="mt-5 flex max-w-[72ch] flex-col gap-2.5">
        {clip.points.map((point) => (
          <li key={point} className="flex gap-3 text-base leading-relaxed text-night-body text-pretty">
            <span aria-hidden="true" className="mt-[0.8em] h-px w-3 shrink-0" style={{ background: lane.color }} />
            {point}
          </li>
        ))}
      </ul>
      {clip.link &&
        (external ? (
          <a
            href={clip.link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
            style={{ borderColor: lane.color }}
          >
            {clip.link.label} ↗<span className="sr-only">, opens in a new tab</span>
          </a>
        ) : (
          <Link href={clip.link.href} className={linkClass} style={{ borderColor: lane.color }}>
            {clip.link.label} →
          </Link>
        ))}
    </article>
  );
}
