"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { roleMailto, site } from "@/data/site";
import { CHANNELS, ORDER } from "@/data/mix";
import { useMix } from "./mix-provider";
import { SHELL } from "./shell";

const LINKS = [
  { label: "Email", href: roleMailto(), external: false, mail: true },
  ...ORDER.map((id) => ({ label: CHANNELS[id].short, href: `/${id}`, external: false })),
  { label: "Lab", href: "/lab", external: false },
  { label: "LinkedIn", href: site.links.linkedin, external: true },
  { label: "GitHub", href: site.links.github, external: true },
];

/** Footer: a master bus with one meter per craft, following the mix. */
export function NightFooter() {
  const { on, levels } = useMix();

  return (
    <footer className="border-t border-night-line bg-night-footer print:hidden">
      <div className={cn(SHELL, "pb-12 pt-10")}>
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
          <div aria-hidden="true" className="flex flex-col gap-2.5">
            <p className="font-mono text-[11px] text-night-muted">MASTER</p>
            {ORDER.map((id) => {
              const width = on[id] ? `${levels[id]}%` : "10%";
              return (
                <div key={id} className="grid grid-cols-[70px_1fr] items-center gap-3">
                  <span className="font-mono text-xs" style={{ color: CHANNELS[id].color }}>
                    {CHANNELS[id].verb}
                  </span>
                  <span className="relative h-1.5 rounded-[3px] bg-night-line">
                    <span
                      className="absolute inset-y-0 left-0 rounded-[3px] transition-[width] duration-[400ms] ease-out motion-reduce:transition-none"
                      style={{ width, background: CHANNELS[id].color }}
                    />
                  </span>
                </div>
              );
            })}
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm md:justify-end">
              {LINKS.map((l) => (
                <li key={l.label}>
                  {"mail" in l ? (
                    <a href={l.href} className="inline-flex min-h-11 items-center text-night-body hover:text-night-fg">
                      {l.label}
                    </a>
                  ) : l.external ? (
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center text-night-body hover:text-night-fg"
                    >
                      {l.label}
                      <span className="sr-only">, opens in a new tab</span>
                    </a>
                  ) : (
                    <Link href={l.href} className="inline-flex min-h-11 items-center text-night-body hover:text-night-fg">
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-7 flex flex-wrap justify-between gap-2 border-t border-night-line pt-5 font-mono text-xs text-night-muted">
          <p>© {new Date().getFullYear()} {site.name}</p>
          <p>mixed in Atlanta</p>
        </div>
      </div>
    </footer>
  );
}
