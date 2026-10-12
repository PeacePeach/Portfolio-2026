import type { Metadata } from "next";
import { Fragment, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Media } from "@/components/ui/Media";
import { NeoHero } from "@/components/case-study/neo-advance/NeoHero";
import { AnalyticsHero } from "@/components/case-study/reimagining-analytics/AnalyticsHero";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { CaseIntroTemplate } from "@/components/case-study/templates/CaseIntroTemplate";
import { MediaRowTemplate } from "@/components/case-study/templates/MediaRowTemplate";
import { TwoColumnTextTemplate } from "@/components/case-study/templates/TwoColumnTextTemplate";
import { FollowUpTemplate } from "@/components/case-study/templates/FollowUpTemplate";
import { SimpleSectionTemplate } from "@/components/case-study/templates/SimpleSectionTemplate";
import { ImpactTemplate } from "@/components/case-study/templates/ImpactTemplate";
import { NarrativeTemplate } from "@/components/case-study/templates/NarrativeTemplate";
import { BeforeAfterTemplate } from "@/components/case-study/templates/BeforeAfterTemplate";
import { HorizontalSlidesTemplate } from "@/components/case-study/templates/HorizontalSlidesTemplate";
import { ReflectionTemplate } from "@/components/case-study/templates/ReflectionTemplate";
import { PersonaQuote } from "@/components/case-study/shared/PersonaQuote";
import { caseStudyTokens } from "@/components/case-study/shared/caseStudyTokens";
import { CaseStudyChapterHeader } from "@/components/case-study/shared/CaseStudyChapterHeader";
import {
  neoAdvanceCoreFlows,
  neoAdvanceDeliveryPanels,
  neoAdvanceHow,
  neoAdvanceImpact,
  neoAdvanceIntro,
  neoAdvanceJourneyMap,
  neoAdvanceNarrative,
  neoAdvanceReflection,
} from "@/content/neoAdvance";
import {
  neoAdvanceClosing,
  neoAdvanceConceptExploration,
  neoAdvanceEarlyDiscovery,
  neoAdvanceHiFiExploration,
  neoAdvanceValidation,
} from "@/content/case-study/neoAdvance";
import {
  reimaginingAnalyticsImpact,
  reimaginingAnalyticsIntro,
  reimaginingAnalyticsPatterns,
  reimaginingAnalyticsPatternsMockup,
  reimaginingAnalyticsRolesIntro,
  reimaginingAnalyticsRoles,
  reimaginingAnalyticsRoleInsights,
  reimaginingAnalyticsRoleCards,
  reimaginingAnalyticsFinalDesign,
  reimaginingAnalyticsReflection,
  reimaginingAnalyticsFollowUp,
  reimaginingAnalyticsPatternsIntro,
  reimaginingAnalyticsProblem,
  reimaginingAnalyticsReframing,
  reimaginingAnalyticsStrategy,
} from "@/content/case-study/reimaginingAnalytics";
import { brightcoveBeaconHero, brightcoveBeaconImpact, brightcoveBeaconIntro } from "@/content/case-study/brightcoveBeacon";
import { getProject, getProjects } from "@/content";
import { site } from "@/content/site";

/**
 * Placeholder case study. Exists so project tiles and evidence deep links
 * (/work/[slug]#section) can be tested. Real case studies come later.
 */
export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  return { title: project ? `${project.title} — ${site.name}` : site.title };
}

export default function CaseStudyPage(props: PageProps<"/work/[slug]">) {
  return (
    <Suspense
      fallback={
        <main id="main" className="container-page pt-[calc(var(--spacing-header)+4rem)]">
          <p role="status" className="type-body-l text-secondary">Loading case study…</p>
        </main>
      }
    >
      <CaseStudyContent {...props} />
    </Suspense>
  );
}

async function CaseStudyContent({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  // Neo Advance reveals each section below the fold on first scroll into view.
  const Wrap = project.slug === "neo-advance" ? ScrollReveal : Fragment;

  const sections = (
    <>
      <Wrap>
        <nav aria-label="Case study sections" className="mt-16 border-t border-line pt-6">
          <ol className="flex flex-wrap gap-x-8 gap-y-3">
            {project.sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="hover-underline type-label-s text-secondary hover:text-primary">
                  {String(i + 1).padStart(2, "0")} {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </Wrap>

      {project.sections.map((s, i) => (
        <Wrap key={s.id}>
          <section id={s.id} className="grid-page min-h-[70vh] border-t border-line py-16 target:border-ink">
            <p className="type-label-s col-span-4 md:col-span-3 text-tertiary">{String(i + 1).padStart(2, "0")}</p>
            <div className="col-span-4 md:col-span-6">
              <h2 className="type-display-s">{s.title}</h2>
              <p className="mt-6 text-secondary">Case study content to come. This section is a deep-link target.</p>
            </div>
          </section>
        </Wrap>
      ))}
    </>
  );

  // The top nav lives in the /work layout, so it stays put when a Work tile opens its case study.
  if (project.slug === "neo-advance") {
    return (
      <>
        <main id="main">
          <CaseIntroTemplate intro={neoAdvanceIntro} hero={<NeoHero />}>
            {/* Each piece reveals on its own: divider, then heading, then each card. */}
            <ScrollReveal as="hr" className="mt-24 border-line" />
            <MediaRowTemplate {...neoAdvanceHow} className="mt-24" />
            <ScrollReveal as="hr" className="mt-24 border-line" />
            <ImpactTemplate {...neoAdvanceImpact} className="mt-24" />
            <section aria-labelledby="neo-discovery">
              <CaseStudyChapterHeader id="neo-discovery">01 _ EARLY DISCOVERY</CaseStudyChapterHeader>
              <TwoColumnTextTemplate {...neoAdvanceEarlyDiscovery} />
              <NarrativeTemplate label="Lending platform research and frameworks" steps={neoAdvanceNarrative} />
            </section>
            <section aria-labelledby="neo-concept">
              <CaseStudyChapterHeader id="neo-concept">02 _ CONCEPT EXPLORATION</CaseStudyChapterHeader>
              <TwoColumnTextTemplate {...neoAdvanceConceptExploration} />
              <HorizontalSlidesTemplate {...neoAdvanceJourneyMap} />
            </section>
            <section aria-labelledby="neo-hifi">
              <CaseStudyChapterHeader id="neo-hifi">03 _ HI-FI EXPLORATION</CaseStudyChapterHeader>
              <TwoColumnTextTemplate {...neoAdvanceHiFiExploration} />
              <div style={caseStudyTokens} className="cs-section">
                <BeforeAfterTemplate {...neoAdvanceValidation} />
              </div>
            </section>
            <section aria-labelledby="neo-final">
              <CaseStudyChapterHeader id="neo-final">04 _ FINAL DESIGN</CaseStudyChapterHeader>
              <NarrativeTemplate {...neoAdvanceCoreFlows} />
              <NarrativeTemplate label="Delivery frameworks" steps={neoAdvanceDeliveryPanels} imageLayout="plain" />
            </section>
            <section aria-labelledby="neo-reflection">
              <CaseStudyChapterHeader id="neo-reflection">05 _ REFLECTION</CaseStudyChapterHeader>
              <ReflectionTemplate {...neoAdvanceReflection} />
              <FollowUpTemplate {...neoAdvanceClosing} />
            </section>
          </CaseIntroTemplate>
        </main>
      </>
    );
  }

  if (project.slug === "brightcove-beacon") {
    return (
      <main id="main">
        <CaseIntroTemplate
          intro={brightcoveBeaconIntro}
          hero={<Image src={brightcoveBeaconHero.src} alt={brightcoveBeaconHero.alt} width={brightcoveBeaconHero.width} height={brightcoveBeaconHero.height} sizes="100vw" priority className="block h-auto w-full" />}
        >
          <ScrollReveal as="hr" className="mt-24 border-line" />
          <ImpactTemplate {...brightcoveBeaconImpact} className="mt-24" />
        </CaseIntroTemplate>
      </main>
    );
  }

  if (project.slug === "reimagining-analytics") {
    return (
      <main id="main">
        <CaseIntroTemplate intro={reimaginingAnalyticsIntro} hero={<AnalyticsHero />}>
          <ScrollReveal as="hr" className="mt-24 border-line" />
          <SimpleSectionTemplate {...reimaginingAnalyticsReframing} />
          <ScrollReveal as="hr" className="border-line" />
          <ImpactTemplate {...reimaginingAnalyticsImpact} className="mt-24" />
          <section aria-labelledby="analytics-problem">
            <CaseStudyChapterHeader id="analytics-problem">01 _ PROBLEM</CaseStudyChapterHeader>
            <NarrativeTemplate {...reimaginingAnalyticsProblem} />
          </section>
          <section aria-labelledby="analytics-strategy">
            <CaseStudyChapterHeader id="analytics-strategy">02 _ UX STRATEGY</CaseStudyChapterHeader>
            <NarrativeTemplate {...reimaginingAnalyticsStrategy} />
          </section>
          <section aria-labelledby="analytics-patterns">
            <CaseStudyChapterHeader id="analytics-patterns">03 _ DESIGN SYSTEM</CaseStudyChapterHeader>
            <SimpleSectionTemplate {...reimaginingAnalyticsPatternsIntro} />
            <ScrollReveal as="hr" className="border-line" />
            <NarrativeTemplate {...reimaginingAnalyticsPatterns} />
            <ScrollReveal as="hr" className="border-line" />
            <div style={caseStudyTokens} className="cs-section">
              <ScrollReveal>
                <Media image={reimaginingAnalyticsPatternsMockup} ratio="1280 / 724" sizes="(min-width: 1280px) 1152px, 100vw" />
              </ScrollReveal>
            </div>
          </section>
          <section aria-labelledby="analytics-roles">
            <CaseStudyChapterHeader id="analytics-roles">04 _ ROLE-BASED EXPERIENCE</CaseStudyChapterHeader>
            <SimpleSectionTemplate {...reimaginingAnalyticsRolesIntro} />
            <ScrollReveal as="hr" className="border-line" />
            <div style={caseStudyTokens} className="cs-section">
              <BeforeAfterTemplate {...reimaginingAnalyticsRoles} />
            </div>
            <ScrollReveal as="hr" className="border-line" />
            <SimpleSectionTemplate {...reimaginingAnalyticsRoleInsights}>
              <ScrollReveal className="overflow-hidden rounded-image border border-border-default">
                <Image src={reimaginingAnalyticsRoleCards.src} alt={reimaginingAnalyticsRoleCards.alt} width={reimaginingAnalyticsRoleCards.width} height={reimaginingAnalyticsRoleCards.height} sizes="(min-width: 1280px) 1152px, 100vw" className="block h-auto w-full" />
              </ScrollReveal>
            </SimpleSectionTemplate>
          </section>
          <section aria-labelledby="analytics-final">
            <CaseStudyChapterHeader id="analytics-final">05 _ FINAL DESIGN</CaseStudyChapterHeader>
            {reimaginingAnalyticsFinalDesign.map(({ id, title, persona, image }, index) => <Fragment key={id}>
              {index > 0 && <ScrollReveal as="hr" className="border-line" />}
              <SimpleSectionTemplate title={title} align="left" inset text={<PersonaQuote {...persona} />}>
                <ScrollReveal className="overflow-hidden rounded-image border border-border-default">
                  <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(min-width: 1280px) 1040px, 100vw" className="block h-auto w-full" />
                </ScrollReveal>
              </SimpleSectionTemplate>
            </Fragment>)}
          </section>
          <section aria-labelledby="analytics-reflection">
            <CaseStudyChapterHeader id="analytics-reflection">06 _ REFLECTION</CaseStudyChapterHeader>
            <ReflectionTemplate {...reimaginingAnalyticsReflection} />
            <FollowUpTemplate {...reimaginingAnalyticsFollowUp} />
          </section>
        </CaseIntroTemplate>
      </main>
    );
  }


  return (
    <>
      <main id="main" className="container-page pt-[calc(var(--spacing-header)+4rem)]">
        <Link href="/work" className="hover-underline type-label-s text-secondary hover:text-primary">
          ← All work
        </Link>
        <h1 className="mt-10 type-display-m uppercase">{project.title}</h1>
        <p className="mt-8 max-w-[52ch] type-body-l text-secondary">{project.summary}</p>
        <Media image={project.image} ratio="16 / 9" sizes="100vw" className="mt-16" />
        {sections}
      </main>
      <Footer />
    </>
  );
}
