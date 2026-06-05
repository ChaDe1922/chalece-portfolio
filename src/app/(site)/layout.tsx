import type { ReactNode } from "react";

import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ClickRipple } from "@/components/click-ripple";
import { CursorTrail } from "@/components/cursor-glow";

/** Marketing chrome (nav, footer, global pointer effects) for the main site.
 *  Routes outside this group (e.g. /lab) render bare on the root layout. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg print:hidden"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <CursorTrail />
      <ClickRipple />
    </>
  );
}
