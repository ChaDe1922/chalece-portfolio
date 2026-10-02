/** Small inline icons for the course outline. All decorative. */

export function PlayIcon() {
  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
      <path d="M7 4.5v15l12-7.5z" />
    </svg>
  );
}

export function ChevronIcon({ up = false }: { up?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <path d={up ? "m18 15-6-6-6 6" : "m6 9 6 6 6-6"} />
    </svg>
  );
}

/** The lesson's line drawing, in a 160 by 90 box. */
export function ThumbIcon({ path, color }: { path: string; color: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 160 90"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-[58%]"
    >
      <path d={path} />
    </svg>
  );
}
