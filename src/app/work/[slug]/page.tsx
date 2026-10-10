import type { Metadata } from "next";
import { Fragment, Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Media } from "@/components/ui/Media";
import { NeoCaseIntro } from "@/components/case-study/neo-advance/NeoCaseIntro";
import { NeoHowItWorks } from "@/components/case-study/neo-advance/NeoHowItWorks";
import { NeoImpact } from "@/components/case-study/neo-advance/NeoImpact";
import { NeoEarlyDiscovery } from "@/components/case-study/neo-advance/NeoEarlyDiscovery";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
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
          <NeoCaseIntro>
            {/* Each piece reveals on its own: divider, then heading, then each card. */}
            <ScrollReveal as="hr" className="mt-24 border-line" />
            <NeoHowItWorks className="mt-24" />
            <ScrollReveal as="hr" className="mt-24 border-line" />
            <NeoImpact className="mt-24" />
            <NeoEarlyDiscovery />
          </NeoCaseIntro>
        </main>
      </>
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
