import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { IntroTemplate } from "@/components/case-study/templates/IntroTemplate";
import { SimpleSectionTemplate } from "@/components/case-study/templates/SimpleSectionTemplate";
import { CaseStudyChapterHeader } from "@/components/case-study/shared/CaseStudyChapterHeader";
import { CaseStudySectionHeader } from "@/components/case-study/shared/CaseStudySectionHeader";
import { caseStudyTokens } from "@/components/case-study/shared/caseStudyTokens";
import { PowerFragmentCard } from "@/components/work/PowerFragmentCard";
import { getSuperPowers } from "@/content";
import {
  leadershipClosing,
  leadershipFramework,
  leadershipFrameworkDiagram,
  leadershipIntro,
  leadershipPillars,
  leadershipProofLabel,
} from "@/content/leadership";
import { site } from "@/content/site";

export const metadata: Metadata = { title: `Leadership — ${site.name}` };

/** Leadership page (Figma AI-Portfolio 174:2747), composed from the shared case-study templates. */
export default function LeadershipPage() {
  const diagram = leadershipFrameworkDiagram;
  const fragments = getSuperPowers().flatMap((p) => p.fragments);
  return (
    <>
      <Header />
      <main id="main" className="container-page mt-(--spacing-header-bar)">
        <IntroTemplate {...leadershipIntro} />
        {/* Sections sit 96 px from the dividers between them (--cs-section-gap). */}
        <ScrollReveal as="hr" className="mt-24 border-line" />
        <section aria-labelledby="leadership-framework" style={caseStudyTokens} className="cs-section flex flex-col gap-16">
          <ScrollReveal>
            <CaseStudySectionHeader id="leadership-framework" {...leadershipFramework} />
          </ScrollReveal>
          <ScrollReveal>
            <Image src={diagram.src} alt={diagram.alt} width={diagram.width} height={diagram.height} unoptimized className="mx-auto block h-auto w-full max-w-[1020px]" />
          </ScrollReveal>
        </section>

        {leadershipPillars.map((pillar) => (
          <section key={pillar.id} aria-labelledby={pillar.id}>
            <CaseStudyChapterHeader id={pillar.id}>{pillar.chapter}</CaseStudyChapterHeader>
            <SimpleSectionTemplate {...pillar.section}>
              <div className="flex flex-col gap-4">
                <p className="type-label-m text-secondary">{leadershipProofLabel}</p>
                <ul className="flex flex-col gap-4">
                  {pillar.proof.map((id) => {
                    const fragment = fragments.find((f) => f.id === id);
                    return fragment ? (
                      <ScrollReveal as="li" key={id}>
                        <PowerFragmentCard fragment={fragment} />
                      </ScrollReveal>
                    ) : null;
                  })}
                </ul>
              </div>
            </SimpleSectionTemplate>
          </section>
        ))}

        <ScrollReveal as="hr" className="border-line" />
        <section aria-labelledby="leadership-closing" style={caseStudyTokens} className="cs-section">
          <ScrollReveal>
            <CaseStudySectionHeader id="leadership-closing" {...leadershipClosing} />
          </ScrollReveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
