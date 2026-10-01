"use client";

import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";

import { labs } from "@/data/labs";
import { nightFonts } from "@/components/night/fonts";
import { labAccentVars } from "./lab-accent";

/** Portals to <body>, outside the lab's theme wrapper, so this re-applies the
 *  Night theme, its fonts and the lesson accent. `contents` adds no box. */
export function LabPortal({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const lab = labs.find((l) => !l.external && pathname.startsWith(l.href));
  return createPortal(
    <div className={`dark theme-night contents ${nightFonts}`} style={lab ? labAccentVars(lab.pillar) : undefined}>
      {children}
    </div>,
    document.body,
  );
}
