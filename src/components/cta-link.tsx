import * as React from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

type CtaLinkProps = {
  href: string;
  children: React.ReactNode;
  /** `default` is the bronze fill, `outline` a hairline button, `text` an
   *  underlined inline link for secondary actions. */
  variant?: "default" | "outline" | "text";
  external?: boolean;
  download?: boolean | string;
  className?: string;
  "aria-label"?: string;
};

/**
 * Plain anchor styled as a marketing CTA. Server-renderable, no motion; the
 * quiet replacement for MagneticButton on the marketing page. Sized to a
 * 44px hit target. Internal hash links keep the default same-tab behavior.
 */
export function CtaLink({
  href,
  children,
  variant = "default",
  external = false,
  download,
  className,
  ...rest
}: CtaLinkProps) {
  const isText = variant === "text";
  return (
    <a
      href={href}
      download={download}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(
        isText
          ? "inline-flex min-h-11 items-center gap-1.5 text-base font-medium text-foreground underline decoration-border underline-offset-[6px] transition-colors hover:text-link hover:decoration-link focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring [&_svg]:size-4 [&_svg]:shrink-0"
          : buttonVariants({ variant }),
        !isText && "h-11 gap-2 rounded-md px-5 text-base font-medium",
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  );
}
