import { Hero } from "@/components/hero";
import { ProofStats } from "@/components/proof-stats";
import { WorkGrid } from "@/components/work-grid";
import { AboutSection } from "@/components/about-section";
import { ResumeSection } from "@/components/resume-section";
import { ContactSection } from "@/components/contact-section";

export default function Home() {
  return (
    <>
      <Hero />
      <ProofStats />
      <WorkGrid />
      <AboutSection />
      <ResumeSection />
      <ContactSection />
    </>
  );
}
