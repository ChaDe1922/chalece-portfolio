import { NightHero } from "@/components/night/night-hero";
import { MixConsole } from "@/components/night/mix-console";
import { Tracklist } from "@/components/night/tracklist";
import { LinerNotes } from "@/components/night/liner-notes";
import { SessionResume } from "@/components/night/session-resume";
import { NightContact } from "@/components/night/night-contact";
import { resumePreview } from "@/data/resume-preview";

export default function Home() {
  return (
    <>
      <NightHero />
      <MixConsole />
      <Tracklist />
      <LinerNotes />
      <SessionResume />
      <NightContact preview={resumePreview()} />
    </>
  );
}
