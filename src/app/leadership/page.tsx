import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { IntroTemplate } from "@/components/case-study/templates/IntroTemplate";
import { NarrativeTemplate } from "@/components/case-study/templates/NarrativeTemplate";
import { PillarFramework } from "@/components/case-study/shared/PillarFramework";
import { Testimonial } from "@/components/case-study/shared/Testimonial";
import { CaseStudyTextReveal } from "@/components/case-study/shared/CaseStudyMotion";
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
  leadershipTestimonials,
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
            {/* Scrolling artifacts: the pillar text stays pinned beside its framework, then its featured proof. */}
            <NarrativeTemplate
              label={pillar.title}
              imageLayout="separate"
              steps={[{
                id: pillar.id,
                title: pillar.title,
                body: pillar.body,
                frame: false,
                visual: <div className="flex flex-col gap-12">
                  <PillarFramework {...pillar.framework} />
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
                </div>,
              }]}
            />
          </section>
        ))}

        <ScrollReveal as="hr" className="border-line" />
        <section aria-labelledby="leadership-closing" style={caseStudyTokens} className="cs-section">
          <ScrollReveal>
            <CaseStudySectionHeader id="leadership-closing" {...leadershipClosing} />
          </ScrollReveal>
          {/* Testimonials (Figma 176:4657): two per row, on the shared text-column grid. */}
          <div className="cs-text-columns mt-24 [--cs-column-gap:calc(var(--spacing)*24)]">
            {leadershipTestimonials.map((t, i) => (
              <CaseStudyTextReveal key={t.author} index={i % 2}>
                <Testimonial {...t} />
              </CaseStudyTextReveal>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
