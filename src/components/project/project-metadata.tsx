import type { Project } from "@/data/projects";

type Row = { label: string; values: string[] };

/** Compact, mono-labeled fact panel for a project (role, audiences, disciplines,
 *  formats, and date range when present). Used on the case-study scaffold and
 *  reusable in flagship chapters. */
export function ProjectMetadata({ project }: { project: Project }) {
  const rows: Row[] = [
    { label: "Role", values: project.role },
    { label: "Audience", values: project.audiences },
    { label: "Disciplines", values: project.disciplines },
    { label: "Formats", values: project.formats },
  ].filter((row) => row.values.length > 0);

  if (project.dateRange) {
    rows.push({ label: "Timeframe", values: [project.dateRange] });
  }

  if (rows.length === 0) return null;

  return (
    <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
      {rows.map((row) => (
        <div key={row.label}>
          <dt className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {row.label}
          </dt>
          <dd className="mt-1.5 text-sm leading-relaxed text-foreground/90">
            {row.values.join(", ")}
          </dd>
        </div>
      ))}
    </dl>
  );
}
