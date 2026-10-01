import type { ReactNode } from "react";

import { MixProvider } from "@/components/night/mix-provider";
import { nightFonts } from "@/components/night/fonts";
import { NightNav } from "@/components/night/night-nav";
import { NightFooter } from "@/components/night/night-footer";

/** Night Session chrome (nav, footer, shared mix state) for the main site.
 *  Routes outside this group (e.g. /lab) render bare on the root layout. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <MixProvider className={nightFonts}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-night-fg focus:px-4 focus:py-2 focus:text-night focus:shadow-lg print:hidden"
      >
        Skip to content
      </a>
      <NightNav />
      <main id="main" className="flex-1">
        {children}
      </main>
      <NightFooter />
    </MixProvider>
  );
}
