import type { ReactNode } from "react";

import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ClickRipple } from "@/components/click-ripple";
import { CursorTrail } from "@/components/cursor-glow";
import { ScrollRefresh } from "@/components/motion/scroll-refresh";

/**
 * Marketing chrome for the main site. The whole shell is wrapped in
 * data-scene="cinematic", which re-points the semantic design tokens to the V2
 * obsidian identity for this subtree only. Routes outside this group (e.g.
 * /lab) render on the root layout with no wrapper, so they keep the original
 * warm/light + dark-toggle tokens untouched. Individual pages/sections may
 * override with data-scene="ivory" for warm editorial reading surfaces.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div
      data-scene="cinematic"
      className="flex min-h-full flex-1 flex-col bg-background text-foreground"
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg print:hidden"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <CursorTrail />
      <ClickRipple />
      <ScrollRefresh />
    </div>
  );
}
