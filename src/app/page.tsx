import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ExploreSection } from "@/components/ExploreSection";
import { Footer } from "@/components/Footer";
import { getCapabilities, getEvidenceByCapability, getProjects } from "@/content";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero nextSectionId="explore" />
        <ExploreSection
          id="explore"
          projects={getProjects()}
          capabilities={getCapabilities()}
          evidence={getEvidenceByCapability()}
        />
      </main>
      <Footer />
    </>
  );
}
