import type { Metadata } from "next";
import { Fragment, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Media } from "@/components/ui/Media";
import { NeoHero } from "@/components/case-study/neo-advance/NeoHero";
import { AnalyticsHero } from "@/components/case-study/reimagining-analytics/AnalyticsHero";
import { BeaconHero } from "@/components/case-study/brightcove-beacon/BeaconHero";
import { MutexaHero } from "@/components/case-study/mutexa/MutexaHero";
import { MutexaContextFigure } from "@/components/case-study/mutexa/MutexaContextFigure";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { CaseIntroTemplate } from "@/components/case-study/templates/CaseIntroTemplate";
import { MediaRowTemplate } from "@/components/case-study/templates/MediaRowTemplate";
import { TwoColumnTextTemplate } from "@/components/case-study/templates/TwoColumnTextTemplate";
import { StoryTextBlock } from "@/components/case-study/shared/StoryTextBlock";
import { BeaconTeamMap } from "@/components/case-study/brightcove-beacon/BeaconTeamMap";
import { FollowUpTemplate } from "@/components/case-study/templates/FollowUpTemplate";
import { SimpleSectionTemplate } from "@/components/case-study/templates/SimpleSectionTemplate";
import { ImpactTemplate } from "@/components/case-study/templates/ImpactTemplate";
import { NarrativeTemplate } from "@/components/case-study/templates/NarrativeTemplate";
import { BeforeAfterTemplate } from "@/components/case-study/templates/BeforeAfterTemplate";
import { HorizontalSlidesTemplate } from "@/components/case-study/templates/HorizontalSlidesTemplate";
import { ReflectionTemplate } from "@/components/case-study/templates/ReflectionTemplate";
import { PersonaQuote } from "@/components/case-study/shared/PersonaQuote";
import { PersonaTasks } from "@/components/case-study/shared/PersonaTasks";
import { StatCircles } from "@/components/case-study/shared/StatCircles";
import { caseStudyControl, caseStudyTokens, caseStudyType } from "@/components/case-study/shared/caseStudyTokens";
import { ArrowRight } from "react-feather";
import { CaseStudyChapterHeader } from "@/components/case-study/shared/CaseStudyChapterHeader";
import { CaseStudyHashScroll } from "@/components/case-study/CaseStudyHashScroll";
import { ThinkingIndicator } from "@/components/case-study/shared/tell-me-about-it/ThinkingIndicator";
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
import {
  brightcoveBeaconCollaboration,
  brightcoveBeaconCollaborationFlow,
  brightcoveBeaconDivingDeeper,
  brightcoveBeaconDivingDeeperImage,
  brightcoveBeaconDiscovery,
  brightcoveBeaconDiscoveryImage,
  brightcoveBeaconIdeation,
  brightcoveBeaconMicroJobsImage,
  brightcoveBeaconUserFlowsImage,
  brightcoveBeaconExecution,
  brightcoveBeaconSprintFlows,
  brightcoveBeaconFinalDesign,
  brightcoveBeaconReflection,
  brightcoveBeaconFollowUp,
  brightcoveBeaconContext,
  brightcoveBeaconImpact,
  brightcoveBeaconInfoArch,
  brightcoveBeaconInfoArchImage,
  brightcoveBeaconIntro,
  brightcoveBeaconJobMap,
  brightcoveBeaconJobMapImage,
  brightcoveBeaconProblem,
} from "@/content/case-study/brightcoveBeacon";
import { mutexaContext, mutexaContextFigure, mutexaIntro, mutexaKeyExperience, mutexaRelationship, mutexaPrototypes, mutexaPrototypesImage, mutexaIterations, mutexaOpportunity, mutexaOpportunityStats, mutexaExpertise, mutexaToolLandscape, mutexaExitPoints, mutexaDiscovery, mutexaAnomalyTypes, mutexaResponseStates, mutexaErrorToExploration, mutexaOutcome, mutexaReflection, mutexaFollowUp } from "@/content/case-study/mutexa";
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
  return project
    ? { title: `${project.title} — ${site.name}`, alternates: { canonical: `/work/${project.slug}` } }
    : { title: site.title };
}

export default function CaseStudyPage(props: PageProps<"/work/[slug]">) {
  return (
    <Suspense
      fallback={
        // The H loader from Tell Me About It, centred on the screen: 1.5× on phones, 2× from sm.
        <main id="main" style={caseStudyTokens} className="flex min-h-svh items-center justify-center">
          <div className="scale-150 sm:scale-200">
            <ThinkingIndicator label="Loading case study…" reduce={false} />
          </div>
        </main>
      }
    >
      <CaseStudyContent {...props} />
      <CaseStudyHashScroll />
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
              <NarrativeTemplate label="Delivery frameworks" steps={neoAdvanceDeliveryPanels} imageLayout="separate" />
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
          hero={<BeaconHero />}
        >
          <ScrollReveal as="hr" className="mt-24 border-line" />
          <ImpactTemplate {...brightcoveBeaconImpact} className="mt-24" />
          <section aria-labelledby="beacon-users">
            <CaseStudyChapterHeader id="beacon-users">01 _ USERS AND WORKFLOWS</CaseStudyChapterHeader>
            {/* The opener and the held Customer Problem step keep the large story title; persona steps use the section title. */}
            <NarrativeTemplate {...brightcoveBeaconContext} steps={brightcoveBeaconContext.steps.map(step =>
              step.id === "beacon-context" ? { ...step, text: <StoryTextBlock title={step.title} body={step.body} />, visual: <BeaconTeamMap /> }
              : step.id === "customer-problem" ? { ...step, text: <article className="cs-story-text" aria-label={step.title}>
                <h2 className={caseStudyType.storyTitle}>{step.title}</h2>
                {brightcoveBeaconProblem.columns.map(({ body }) => <p key={body} className={caseStudyType.storyBody}>{body.split(/\[(.+?)\]/).map((part, i) => i % 2 ? <strong key={i} className="font-normal text-primary">{part}</strong> : part)}</p>)}
              </article> }
              : step)} />
            {([
              [brightcoveBeaconJobMap, brightcoveBeaconJobMapImage],
              [brightcoveBeaconInfoArch, brightcoveBeaconInfoArchImage],
            ] as const).map(([section, image]) => <Fragment key={section.title}>
              <ScrollReveal as="hr" className="border-line" />
              <SimpleSectionTemplate {...section}>
                <ScrollReveal className="overflow-hidden rounded-image border border-border-default">
                  <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(min-width: 1280px) 1152px, 100vw" className="block h-auto w-full" />
                </ScrollReveal>
              </SimpleSectionTemplate>
            </Fragment>)}
            <ScrollReveal as="hr" className="border-line" />
            <SimpleSectionTemplate {...brightcoveBeaconCollaboration} />
            <NarrativeTemplate
              label={brightcoveBeaconCollaborationFlow.label}
              imageLayout="separate"
              steps={brightcoveBeaconCollaborationFlow.steps.map(({ persona, ...step }) => ({ ...step, text: <PersonaTasks {...persona} /> }))}
            />
            <ScrollReveal as="hr" className="border-line" />
            <SimpleSectionTemplate {...brightcoveBeaconDivingDeeper}>
              <ScrollReveal className="overflow-hidden rounded-image border border-border-default">
                <Image src={brightcoveBeaconDivingDeeperImage.src} alt={brightcoveBeaconDivingDeeperImage.alt} width={brightcoveBeaconDivingDeeperImage.width} height={brightcoveBeaconDivingDeeperImage.height} sizes="(min-width: 1024px) 704px, 100vw" className="block h-auto w-full" />
              </ScrollReveal>
            </SimpleSectionTemplate>
          </section>
          <section aria-labelledby="beacon-discovery">
            <CaseStudyChapterHeader id="beacon-discovery">02 _ CHALLENGE IN DISCOVERY</CaseStudyChapterHeader>
            <TwoColumnTextTemplate {...brightcoveBeaconDiscovery} />
            <ScrollReveal as="hr" className="border-line" />
            {/* Diagrams are exported on the page background, so they sit unframed; this one spans the text columns above. */}
            <div style={caseStudyTokens} className="cs-section">
              <ScrollReveal className="cs-text-columns-width">
                <Image src={brightcoveBeaconDiscoveryImage.src} alt={brightcoveBeaconDiscoveryImage.alt} width={brightcoveBeaconDiscoveryImage.width} height={brightcoveBeaconDiscoveryImage.height} sizes="(min-width: 1024px) 896px, 100vw" className="block h-auto w-full" />
              </ScrollReveal>
            </div>
          </section>
          <section aria-labelledby="beacon-ideation">
            <CaseStudyChapterHeader id="beacon-ideation">03 _ CHALLENGE IN IDEATION</CaseStudyChapterHeader>
            <TwoColumnTextTemplate {...brightcoveBeaconIdeation} />
            <ScrollReveal as="hr" className="border-line" />
            <div style={caseStudyTokens} className="cs-section flex flex-col gap-(--cs-section-gap)">
              {[brightcoveBeaconMicroJobsImage, brightcoveBeaconUserFlowsImage].map(image => <ScrollReveal key={image.src}>
                <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(min-width: 1280px) 1152px, 100vw" className="block h-auto w-full" />
              </ScrollReveal>)}
            </div>
          </section>
          <section aria-labelledby="beacon-execution">
            <CaseStudyChapterHeader id="beacon-execution">04 _ CHALLENGE IN DESIGN EXECUTION</CaseStudyChapterHeader>
            <TwoColumnTextTemplate {...brightcoveBeaconExecution} />
            <div style={caseStudyTokens} className="cs-section">
              <BeforeAfterTemplate {...brightcoveBeaconSprintFlows} />
            </div>
          </section>
          <section aria-labelledby="beacon-final">
            <CaseStudyChapterHeader id="beacon-final">05 _ FINAL DESIGN</CaseStudyChapterHeader>
            {brightcoveBeaconFinalDesign.map(({ id, title, persona, images, prototype }, index) => <Fragment key={id}>
              {index > 0 && <ScrollReveal as="hr" className="border-line" />}
              <SimpleSectionTemplate title={title} align="left" inset text={<PersonaQuote {...persona} />}>
                <div className="flex flex-col gap-(--cs-row-gap)">
                  {images.map(image => <ScrollReveal key={image.src} className="overflow-hidden rounded-image border border-border-default">
                    <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(min-width: 1280px) 1040px, 100vw" className="block h-auto w-full" />
                  </ScrollReveal>)}
                  {prototype && <a href={prototype} target="_blank" rel="noreferrer" className={`${caseStudyControl} gap-2 self-end`}>
                    Try the prototype<ArrowRight size={16} strokeWidth={1.33} aria-hidden="true" />
                  </a>}
                </div>
              </SimpleSectionTemplate>
            </Fragment>)}
          </section>
          <section aria-labelledby="beacon-reflection">
            <CaseStudyChapterHeader id="beacon-reflection">06 _ REFLECTION</CaseStudyChapterHeader>
            <ReflectionTemplate {...brightcoveBeaconReflection} />
            <FollowUpTemplate {...brightcoveBeaconFollowUp} />
          </section>
        </CaseIntroTemplate>
      </main>
    );
  }

  if (project.slug === "mutexa") {
    return (
      <main id="main">
        <CaseIntroTemplate
          intro={mutexaIntro}
          hero={<MutexaHero />}
        >
          {/* Context, opportunity and key experience open the case study before chapter 01, as on Reimagining Analytics. */}
          <ScrollReveal as="hr" className="mt-24 border-line" />
          {/* As Figma 176:3642: the heading block hugs the title and sits on the centre line, over the middle step. */}
          <SimpleSectionTemplate
            {...mutexaContext}
            text={
              <header className="cs-story-text-header relative left-1/2 w-max max-w-[calc(100vw-2.5rem)] -translate-x-1/2">
                <p className={caseStudyType.chapterLabel}>{mutexaContext.label}</p>
                <h2 className={caseStudyType.storyTitle}>{mutexaContext.title}</h2>
              </header>
            }
          >
            <MutexaContextFigure figure={mutexaContextFigure} />
          </SimpleSectionTemplate>
          <ScrollReveal as="hr" className="border-line" />
          {/* As Figma 176:4627: a 318px heading block centred over the circles, 96px above them. */}
          <SimpleSectionTemplate
            {...mutexaOpportunity}
            text={
              <header className="cs-story-text-header mx-auto w-full max-w-[19.875rem]">
                <p className={caseStudyType.chapterLabel}>{mutexaOpportunity.label}</p>
                <h2 className={caseStudyType.storyTitle}>{mutexaOpportunity.title}</h2>
              </header>
            }
          >
            <div className="pt-8">
              <StatCircles stats={mutexaOpportunityStats} />
            </div>
          </SimpleSectionTemplate>
          {/* The section above keeps its 96px bottom padding; pull back so the chapter sits 128px under the circles, as Beacon's chapter 01 under Impact. */}
          <section aria-labelledby="mutexa-product" className="-mt-24">
            <CaseStudyChapterHeader id="mutexa-product">HOW THE PRODUCT WORKS</CaseStudyChapterHeader>
            <NarrativeTemplate {...mutexaKeyExperience} />
          </section>
          <section aria-labelledby="mutexa-relationship">
            <CaseStudyChapterHeader id="mutexa-relationship">01 _ HUMAN–AI COLLABORATION</CaseStudyChapterHeader>
            <SimpleSectionTemplate {...mutexaRelationship} />
            <ScrollReveal as="hr" className="border-line" />
            <SimpleSectionTemplate {...mutexaPrototypes} text={<p className={caseStudyType.storyBody}>{mutexaPrototypes.title}</p>}>
              <ScrollReveal>
                <Image src={mutexaPrototypesImage.src} alt={mutexaPrototypesImage.alt} width={mutexaPrototypesImage.width} height={mutexaPrototypesImage.height} sizes="(min-width: 1280px) 1152px, 100vw" className="block h-auto w-full" />
              </ScrollReveal>
            </SimpleSectionTemplate>
            <ScrollReveal as="hr" className="border-line" />
            <NarrativeTemplate {...mutexaIterations} />
          </section>
          <section aria-labelledby="mutexa-expertise">
            <CaseStudyChapterHeader id="mutexa-expertise">02 _ PROTECTING EXPERTISE</CaseStudyChapterHeader>
            <SimpleSectionTemplate {...mutexaExpertise}>
              {/* 128px from text to diagram: the template's 64px plus 64px. */}
              <ScrollReveal className="pt-16">
                <Image src={mutexaToolLandscape.src} alt={mutexaToolLandscape.alt} width={mutexaToolLandscape.width} height={mutexaToolLandscape.height} sizes="(min-width: 1280px) 1152px, 100vw" className="block h-auto w-full" />
              </ScrollReveal>
            </SimpleSectionTemplate>
            <ScrollReveal as="hr" className="border-line" />
            <NarrativeTemplate {...mutexaExitPoints} />
          </section>
          <section aria-labelledby="mutexa-discovery">
            <CaseStudyChapterHeader id="mutexa-discovery">03 _ DESIGNING FOR DISCOVERY</CaseStudyChapterHeader>
            <SimpleSectionTemplate {...mutexaDiscovery}>
              {/* 128px from text to the diagram, as chapter 02. */}
              <ScrollReveal className="pt-16">
                <Image src={mutexaAnomalyTypes.src} alt={mutexaAnomalyTypes.alt} width={mutexaAnomalyTypes.width} height={mutexaAnomalyTypes.height} sizes="(min-width: 1280px) 1152px, 100vw" className="block h-auto w-full" />
              </ScrollReveal>
            </SimpleSectionTemplate>
            <ScrollReveal as="hr" className="border-line" />
            {/* Image-only section, as Beacon's ideation images; 937px wide per Figma 200:4658. */}
            <div style={caseStudyTokens} className="cs-section">
              <ScrollReveal>
                <Image src={mutexaResponseStates.src} alt={mutexaResponseStates.alt} width={mutexaResponseStates.width} height={mutexaResponseStates.height} sizes="(min-width: 1024px) 937px, 100vw" className="mx-auto block h-auto w-full max-w-[58.5625rem]" />
              </ScrollReveal>
            </div>
            <ScrollReveal as="hr" className="border-line" />
            <NarrativeTemplate {...mutexaErrorToExploration} />
          </section>
          <ScrollReveal as="hr" className="border-line" />
          <ImpactTemplate {...mutexaOutcome} className="mt-24" />
          <section aria-labelledby="mutexa-reflection">
            <CaseStudyChapterHeader id="mutexa-reflection">04 _ REFLECTION</CaseStudyChapterHeader>
            <ReflectionTemplate {...mutexaReflection} />
            <FollowUpTemplate {...mutexaFollowUp} />
          </section>
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
    </>
  );
}
