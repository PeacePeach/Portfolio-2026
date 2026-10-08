import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ExploreSection } from "@/components/ExploreSection";
import { Footer } from "@/components/Footer";
import { PageSlide } from "@/components/PageSlide";
import { getCapabilities, getEvidenceByCapability, getProjects } from "@/content";

export default function Home() {
  return (
    <PageSlide>
      <Header />
      <main id="main">
        <Hero />
        <ExploreSection
          id="explore"
          projects={getProjects()}
          capabilities={getCapabilities()}
          evidence={getEvidenceByCapability()}
        />
      </main>
      <Footer />
    </PageSlide>
  );
}
