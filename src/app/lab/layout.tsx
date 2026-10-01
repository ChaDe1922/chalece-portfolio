import type { ReactNode } from "react";

import { MixProvider } from "@/components/night/mix-provider";
import { nightFonts } from "@/components/night/fonts";
import { LabAccent } from "@/components/lab/lab-accent";

/** Night Session theme for the lab. Lessons stay full screen, so the nav and
 *  footer live on the index page only. */
export default function LabLayout({ children }: { children: ReactNode }) {
  return (
    <MixProvider className={nightFonts}>
      <LabAccent>{children}</LabAccent>
    </MixProvider>
  );
}
