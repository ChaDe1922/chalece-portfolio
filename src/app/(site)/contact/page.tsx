import type { Metadata } from "next";
import { ContactSection } from "@/components/contact-section";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Get in touch with Chalece DeLaCoudray. Open to ambitious work where content, curriculum, AI, creative technology, and human capability meet.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div data-scene="ivory" className="bg-background text-foreground">
      <ContactSection />
    </div>
  );
}
