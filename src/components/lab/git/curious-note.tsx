import { Microscope } from "lucide-react";
import { RichText } from "@/components/lab/rich-text";

/** A self-contained "under the hood" disclosure for the precise nuances a sharp
 *  reviewer checks. Beginners can skip it; techies can open it to confirm the
 *  lesson is honest. Native <details> keeps it keyboard- and screen-reader-
 *  friendly with no JS. */
export function CuriousNote({ title, body }: { title: string; body: string }) {
  return (
    <details className="group rounded-xl border border-border bg-card/60 px-4 py-3 [&[open]]:bg-card">
      <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium text-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
        <Microscope aria-hidden="true" className="size-4" />
        {title}
        <span aria-hidden="true" className="ml-auto text-muted-foreground transition-transform group-open:rotate-90">
          &rsaquo;
        </span>
      </summary>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        <RichText text={body} />
      </p>
    </details>
  );
}
