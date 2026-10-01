import { site } from "@/data/site";
import { nightCard, OG_SIZE } from "@/components/og/night-card";

export const alt = `Interactive lessons by ${site.name}`;
export const size = OG_SIZE;
export const contentType = "image/png";

/** Lab share card. Lessons inherit it. */
export default function OpengraphImage() {
  return nightCard({
    eyebrow: "The lab",
    title: "Interactive lessons",
    subtitle: "Build a synth, step through recursion, or see what Git does underneath.",
  });
}
