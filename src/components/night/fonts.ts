import { IBM_Plex_Mono, IBM_Plex_Sans, Syne } from "next/font/google";

const syne = Syne({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-syne", display: "swap" });
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

/** Font variables for the Night Session theme. Add to anything portaled
 *  outside the MixProvider wrapper, like the mobile menu sheet. */
export const nightFonts = `${syne.variable} ${plexSans.variable} ${plexMono.variable}`;
