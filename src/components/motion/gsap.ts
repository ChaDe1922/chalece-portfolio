"use client";

/**
 * Single GSAP registration point. Import { gsap, ScrollTrigger, useGSAP } from
 * here so the plugin is registered exactly once. useGSAP is the StrictMode-safe
 * hook (wraps work in gsap.context and auto-reverts on unmount / dependency
 * change), which is the correct React 19 pattern.
 *
 * Note: GSAP (~50kb) rides in the initial client bundle because directed reveals
 * must SSR their children (content works with JS off) and therefore cannot be
 * ssr:false. The heavy dependency (three / R3F, ~150kb+) is the one that stays
 * lazy, via the ssr:false dynamic import of the hero canvas.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export { gsap, ScrollTrigger, useGSAP };
