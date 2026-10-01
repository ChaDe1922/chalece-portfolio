import { site } from "@/data/site";
import { isPillarId, pillarById, pillarIds } from "@/data/pillars";
import { CHANNELS } from "@/data/mix";
import { nightCard, OG_SIZE } from "@/components/og/night-card";

export const alt = `${site.name}, one craft of three`;
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return pillarIds.map((pillar) => ({ pillar }));
}

/** Pillar share card: that craft's channel soloed. */
export default async function OpengraphImage({ params }: { params: Promise<{ pillar: string }> }) {
  const { pillar: id } = await params;
  const solo = isPillarId(id) ? id : "music-tech";
  const pillar = pillarById[solo];
  return nightCard({
    eyebrow: `Track ${CHANNELS[solo].num}`,
    title: pillar.headline,
    subtitle: pillar.name,
    solo,
  });
}
