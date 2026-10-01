import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site } from "@/data/site";
import { isPillarId, pillarById, pillarIds } from "@/data/pillars";
import { labsForPillar } from "@/data/labs";
import { PillarIntro } from "@/components/pillar/pillar-intro";
import { PillarLessons } from "@/components/pillar/pillar-lessons";
import { PillarCta } from "@/components/pillar/pillar-cta";
import { ProofStats } from "@/components/proof-stats";
import { WorkGrid } from "@/components/work-grid";

type Props = { params: Promise<{ pillar: string }> };

// Only the three pillars exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return pillarIds.map((pillar) => ({ pillar }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pillar: id } = await params;
  if (!isPillarId(id)) return {};
  const pillar = pillarById[id];
  return {
    title: pillar.seo.title,
    description: pillar.seo.description,
    keywords: pillar.seo.keywords,
    alternates: { canonical: `/${id}` },
    openGraph: {
      type: "profile",
      url: `${site.url}/${id}`,
      title: `${pillar.seo.title} | ${site.name}`,
      description: pillar.seo.description,
    },
    twitter: {
      title: `${pillar.seo.title} | ${site.name}`,
      description: pillar.seo.description,
    },
  };
}

/** One template for every pillar, so each gets the same depth. */
export default async function PillarPage({ params }: Props) {
  const { pillar: id } = await params;
  if (!isPillarId(id)) notFound();
  const pillar = pillarById[id];

  return (
    <>
      <PillarIntro pillar={pillar} />
      <ProofStats stats={pillar.stats} label={`${pillar.name} proof points`} />
      <WorkGrid pillar={id} />
      <PillarLessons labs={labsForPillar(id)} />
      <PillarCta pillar={pillar} />
    </>
  );
}
