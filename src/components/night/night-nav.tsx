"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { roleMailto, site } from "@/data/site";
import { CHANNELS, ORDER, SESSION_SECONDS, TABS } from "@/data/mix";
import { EqMeter } from "./eq-meter";
import { nightFonts } from "./fonts";
import { SHELL } from "./shell";

function timecode(progress: number): string {
  const secs = Math.round(progress * SESSION_SECONDS);
  const mm = Math.floor(secs / 60);
  const ss = secs % 60;
  return `00:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

const TOTAL = timecode(1);

/** Sticky header: brand, section tabs with a live meter on the one in view,
 *  an email button, a page strip with the crafts and the lab, a scroll
 *  timecode, and a playhead bar that tracks page progress. */
export function NightNav() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("top");

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const doc = document.documentElement;
      const span = Math.max(1, doc.scrollHeight - window.innerHeight);
      setProgress(Math.min(1, Math.max(0, window.scrollY / span)));
      if (!onHome) return;
      const vh = window.innerHeight || 800;
      let next = "top";
      TABS.forEach((t) => {
        const el = document.getElementById(t.id);
        if (el && el.getBoundingClientRect().top < vh * 0.4) next = t.id;
      });
      setActive(next);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [onHome]);

  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);
  const pct = `${(progress * 100).toFixed(2)}%`;

  return (
    <header className="sticky top-0 z-40 bg-[rgba(15,17,21,0.94)] backdrop-blur-md print:hidden">
      <nav aria-label="Primary" className={cn(SHELL, "flex h-[72px] items-center justify-between gap-4")}>
        <Link
          href={onHome ? "#top" : "/"}
          className="inline-flex min-h-11 items-center gap-2.5 font-display text-lg font-bold text-night-fg"
        >
          <span aria-hidden="true" className="size-2.5 rounded-full bg-signal transition-colors duration-200" />
          {site.name}
        </Link>

        <ul className="hidden items-center gap-1 font-mono text-sm lg:flex">
          {TABS.map((t) => {
            const current = onHome && active === t.id;
            return (
              <li key={t.id}>
                <a
                  href={href(t.id)}
                  aria-current={current ? "location" : undefined}
                  className={cn(
                    "inline-flex min-h-10 items-center gap-2 rounded-lg px-3 transition-colors duration-200 hover:text-night-fg",
                    current ? "bg-night-raised text-night-fg" : "text-night-muted"
                  )}
                >
                  {current && <EqMeter />}
                  {t.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <Timecode progress={progress} className="hidden sm:inline lg:hidden" />
          <a
            href={roleMailto()}
            className="hidden h-11 items-center gap-2 rounded-[10px] bg-signal px-4 text-sm font-semibold text-night transition-colors duration-200 lg:inline-flex"
          >
            <Mail className="size-4" aria-hidden="true" />
            Email me
          </a>
          <MobileMenu href={href} />
        </div>
      </nav>

      <div className="hidden border-t border-night-line lg:block">
        <div className={cn(SHELL, "flex h-10 items-center justify-between gap-4")}>
          <ul aria-label="Pages" className="flex items-center gap-1 text-[13px]">
            {PAGE_LINKS.map((l) => {
              const current = pathname === l.href || pathname.startsWith(`${l.href}/`);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "inline-flex min-h-8 items-center gap-2 rounded-md px-2.5 transition-colors duration-200 hover:text-night-fg",
                      current ? "bg-night-raised text-night-fg" : "text-night-muted"
                    )}
                  >
                    <span aria-hidden="true" className="size-1.5 rounded-full bg-night-fg" style={l.color ? { background: l.color } : undefined} />
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Timecode progress={progress} className="py-1 text-[13px]" />
        </div>
      </div>

      <div aria-hidden="true" className="relative h-[3px] bg-night-line">
        <div className="absolute inset-y-0 left-0 bg-signal" style={{ width: pct }} />
        <div className="absolute -top-1 -ml-px h-[11px] w-0.5 bg-night-fg" style={{ left: pct }} />
      </div>
    </header>
  );
}

function Timecode({ progress, className }: { progress: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "rounded-lg border border-night-line bg-night-strip px-3 py-2 font-mono text-sm tabular-nums text-signal",
        className
      )}
    >
      {timecode(progress)} <span className="text-night-muted">/ {TOTAL}</span>
    </span>
  );
}

const PAGE_LINKS = [
  ...ORDER.map((id) => ({ label: CHANNELS[id].short, href: `/${id}`, color: CHANNELS[id].color })),
  { label: "Lab", href: "/lab", color: undefined },
];

function MobileMenu({ href }: { href: (id: string) => string }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-lg border border-night-line-strong text-night-fg lg:hidden"
            aria-label="Open menu"
          />
        }
      >
        <Menu className="size-5" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent side="right" className={cn("dark theme-night w-[min(20rem,85vw)] border-night-line", nightFonts)}>
        <SheetHeader>
          <SheetTitle className="font-display text-night-fg">Menu</SheetTitle>
        </SheetHeader>
        <ul className="flex flex-col gap-1 px-4 font-mono text-base">
          {TABS.map((t) => (
            <li key={t.id}>
              <SheetClose
                render={
                  <a href={href(t.id)} className="flex min-h-11 items-center rounded-lg px-3 text-night-body hover:bg-night-raised hover:text-night-fg" />
                }
              >
                {t.label}
              </SheetClose>
            </li>
          ))}
        </ul>
        <ul className="mt-4 flex flex-col gap-1 border-t border-night-line px-4 pt-4 text-base">
          {PAGE_LINKS.map((l) => (
            <li key={l.href}>
              <SheetClose
                render={
                  <Link href={l.href} className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-night-body hover:bg-night-raised hover:text-night-fg" />
                }
              >
                <span aria-hidden="true" className="size-2 rounded-full bg-night-fg" style={l.color ? { background: l.color } : undefined} />
                {l.label}
              </SheetClose>
            </li>
          ))}
        </ul>
        <div className="mt-4 border-t border-night-line px-4 pt-4">
          <a
            href={roleMailto()}
            className="flex min-h-11 items-center justify-center gap-2 rounded-[10px] bg-signal px-4 text-base font-semibold text-night"
          >
            <Mail className="size-4" aria-hidden="true" />
            Email me
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
