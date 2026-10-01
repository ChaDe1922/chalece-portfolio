import { site } from "@/data/site";
import { nightCard, OG_SIZE } from "@/components/og/night-card";

export const alt = `${site.name}, ${site.role}`;
export const size = OG_SIZE;
export const contentType = "image/png";

/** Homepage share card: the full mix, all three channels lit. */
export default function OpengraphImage() {
  return nightCard({
    eyebrow: site.location,
    title: "I create, I build, and I teach.",
    subtitle: site.role,
  });
}
