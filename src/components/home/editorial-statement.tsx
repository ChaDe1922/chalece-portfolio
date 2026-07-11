import { Reveal } from "@/components/reveal";

/**
 * Full-width editorial thesis on a warm ivory scene, creating the dark-to-warm
 * rhythm between cinematic sections. data-scene="ivory" re-points the tokens for
 * this band only. Copy is the approved thesis statement.
 */
export function EditorialStatement() {
  return (
    <section
      data-scene="ivory"
      aria-labelledby="thesis-heading"
      className="bg-background"
    >
      <div className="mx-auto max-w-4xl px-4 py-24 text-center md:px-8 md:py-32">
        <Reveal>
          <h2
            id="thesis-heading"
            className="font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl"
          >
            Complexity is not the problem.
            <br />
            The experience is.
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            People do not need complex ideas stripped of their intelligence.
            They need better ways to enter them, manipulate them, test them, and
            make them their own.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
