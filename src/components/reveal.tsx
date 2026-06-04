import { cn } from "@/lib/utils";

/**
 * Scroll-reveal wrapper. The `.reveal` class (see globals.css) animates a
 * fade/slide-in via a native scroll timeline ONLY where supported and when the
 * user allows motion. Content is fully visible otherwise, so this is safe,
 * zero-JS progressive enhancement.
 */
export function Reveal({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("reveal", className)} {...props}>
      {children}
    </div>
  );
}
