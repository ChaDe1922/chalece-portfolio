import { Mail, GraduationCap, ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { site } from "@/data/site";

type IconProps = { className?: string; "aria-hidden"?: boolean | "true" | "false" };
type IconType = React.ComponentType<IconProps>;

/** lucide removed brand icons, so LinkedIn is an inline glyph. */
function LinkedinIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

type Channel = {
  label: string;
  value: string;
  href: string;
  icon: IconType;
  external?: boolean;
};

const channels: Channel[] = [
  { label: "Email", value: site.email, href: site.links.email, icon: Mail },
  {
    label: "LinkedIn",
    value: "in/chalecedelacoudray",
    href: site.links.linkedin,
    icon: LinkedinIcon,
    external: true,
  },
  {
    label: "Coursera",
    value: "7 published courses",
    href: site.links.coursera,
    icon: GraduationCap,
    external: true,
  },
];

/** Contact channels. Email + LinkedIn + Coursera, no form in v1. */
export function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-24 bg-secondary/40"
    >
      <div className="mx-auto max-w-5xl px-4 py-20 md:px-8 md:py-28">
        <Reveal>
          <SectionHeading
            id="contact-heading"
            eyebrow="Contact"
            title="Let's talk."
            description="Open to remote roles in learning experience design, instructional design, and curriculum."
          />
        </Reveal>

        <Reveal className="mt-10 grid gap-4 sm:grid-cols-3">
          {channels.map(({ label, value, href, icon: Icon, external }) => (
            <a
              key={label}
              href={href}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:border-link/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <div className="flex items-center justify-between">
                <Icon
                  aria-hidden="true"
                  className="size-6 text-link"
                />
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-5 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-link"
                />
              </div>
              <p className="mt-5 font-heading text-lg font-semibold">{label}</p>
              <p className="mt-1 break-words text-sm text-muted-foreground">
                {value}
              </p>
              {external ? (
                <span className="sr-only"> (opens in a new tab)</span>
              ) : null}
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
