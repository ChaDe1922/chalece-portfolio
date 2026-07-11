import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { navItems, contactNav, site } from "@/data/site";

const secondary = [
  { label: "Resume", href: site.resumePath, external: false },
  { label: "LinkedIn", href: site.links.linkedin, external: true },
  { label: "Email", href: site.links.email, external: false },
];

/**
 * V2 site footer: wordmark + positioning, route links, secondary links, and the
 * theme toggle (relocated here since the cinematic marketing shell is a fixed
 * scene; the toggle now governs the lab reading surfaces). Copyright uses a
 * server-rendered year.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-8 print:py-6">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <Link
              href="/"
              className="font-heading text-lg font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              {site.name}
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {site.location}. Learning experience designer, technologist, and
              creative systems builder.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-12 gap-y-8">
            <nav aria-label="Footer" className="print:hidden">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Explore
              </h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {[...navItems, contactNav].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Elsewhere" className="print:hidden">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Elsewhere
              </h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {secondary.map(({ label, href, external }) => (
                  <li key={label}>
                    <a
                      href={href}
                      {...(external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {label}
                      {external ? (
                        <span className="sr-only"> (opens in a new tab)</span>
                      ) : null}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-10 flex flex-col-reverse gap-4 border-t border-border/50 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {year} {site.name}
          </p>
          <div className="print:hidden">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
