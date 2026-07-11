import { ArrowDown, Sparkles } from "lucide-react";
import { MagneticButton } from "@/components/magnetic-button";
import { SignalField } from "@/components/signal/signal-field";

/**
 * V2 hero. Editorial display headline "From signal to skill." with the static
 * signal field. The H1 is present in the initial HTML (LCP, works with JS
 * disabled). CTAs are reachable immediately; on mobile the headline and CTAs
 * sit above the signal illustration. Reel player is deferred; the second CTA
 * routes to the live Learning Lab (real interactive proof) instead of a dead
 * button.
 */
export function HeroStatement() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="grain-overlay pointer-events-none absolute inset-0 -z-10 print:hidden"
      />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-20 pt-16 md:px-8 md:pb-28 md:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12">
        <div>
          <p className="enter enter-1 mb-6 font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Learning systems · AI · Interactive media · Sound
          </p>
          <h1
            id="hero-heading"
            className="font-display enter enter-2 text-[3.25rem] leading-[0.98] tracking-tight sm:text-7xl md:text-8xl"
          >
            From signal to skill.
          </h1>
          <p className="enter enter-3 mt-7 max-w-xl text-lg leading-relaxed text-foreground/90 md:text-xl">
            I design the systems, stories, and experiences that turn complex
            technology into human capability.
          </p>
          <p className="enter enter-3 mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Curriculum strategy, AI-assisted production, technical education,
            interactive learning, sound, motion, and creative technology.
          </p>

          <div className="enter enter-4 mt-9 flex flex-col gap-3 sm:flex-row sm:items-center print:hidden">
            <MagneticButton href="#selected-systems">
              Explore selected work
              <ArrowDown aria-hidden="true" />
            </MagneticButton>
            <MagneticButton href="/lab" variant="outline">
              <Sparkles aria-hidden="true" />
              Enter the Learning Lab
            </MagneticButton>
          </div>

          <p className="mt-8 max-w-xl text-sm text-muted-foreground">
            Atlanta, Georgia · Learning experience designer, technologist, and
            creative systems builder.
          </p>
        </div>

        <div className="order-last lg:order-none">
          <div className="mx-auto aspect-[4/3] w-full max-w-xl lg:max-w-none">
            <SignalField />
          </div>
        </div>
      </div>
    </section>
  );
}
