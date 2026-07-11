import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";

/** Intro to the three flagship chapters. Anchored by the hero's "Explore
 *  selected work" CTA. */
export function SelectedSystemsIntro() {
  return (
    <section
      id="selected-systems"
      aria-labelledby="selected-systems-heading"
      className="scroll-mt-24"
    >
      <div className="mx-auto max-w-6xl px-4 pb-4 pt-20 md:px-8 md:pt-28">
        <Reveal>
          <SectionHeading
            id="selected-systems-heading"
            eyebrow="Selected systems"
            title="The work behind the point of view."
            description="Three projects showing how I think, direct, and build across curriculum, artificial intelligence, technical systems, sound, and interaction."
          />
        </Reveal>
      </div>
    </section>
  );
}
