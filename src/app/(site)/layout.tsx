import type { ReactNode } from "react";

import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

/** Marketing chrome (nav, footer) for the main site. Routes outside this
 *  group (e.g. /lab) render bare on the root layout. The pointer effects
 *  (cursor trail, click ripple) were retired from the marketing page; the
 *  components stay in the repo because the lab decks still use them. */
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
      {/* tabIndex lets the skip link actually move focus, not just scroll. */}
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <Footer />
    </>
  );
}
