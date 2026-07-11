"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SoundControl } from "@/components/site/sound-control";
import { navItems, contactNav, site } from "@/data/site";

/** True when `href` is the current route or a parent of it. */
function isActiveRoute(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * V2 sticky header. Real routes with next/link (prefetch + client nav),
 * usePathname active-route treatment, a Sound placeholder, a "Let's talk"
 * action, and a mobile sheet menu (focus trap + Escape handled by the Sheet
 * primitive). Reads clearly over the cinematic obsidian shell.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/65 print:static print:border-0 print:bg-transparent print:backdrop-blur-none">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8 print:h-auto print:py-2"
      >
        <Link
          href="/"
          className="font-heading text-base font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm print:text-2xl print:font-bold"
        >
          {site.name}
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex print:hidden">
          {navItems.map((item) => {
            const active = isActiveRoute(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary transition-transform duration-200",
                      active ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2 print:hidden">
          <SoundControl />
          <Link
            href={contactNav.href}
            className={cn(
              "hidden rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:inline-flex",
            )}
          >
            {contactNav.label}
          </Link>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  className="size-11 md:hidden"
                  aria-label="Open menu"
                />
              }
            >
              <Menu className="size-5" aria-hidden="true" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <ul className="flex flex-col gap-1 px-2 pb-4">
                {[...navItems, contactNav].map((item) => (
                  <li key={item.href}>
                    <SheetClose
                      render={
                        <Link
                          href={item.href}
                          className="flex min-h-11 items-center rounded-md px-3 text-base font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                      }
                    >
                      {item.label}
                    </SheetClose>
                  </li>
                ))}
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
