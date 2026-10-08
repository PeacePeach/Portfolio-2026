/**
 * Data access boundary. Components call these functions instead of reading
 * arrays directly, so the source (static files today; a CMS export or a
 * curated AI pipeline later) can change in one place.
 */
import { capabilities, evidence } from "./capabilities";
import { projects } from "./projects";
import type { Capability, Evidence, Project } from "./types";

export type { Capability, Evidence, Project } from "./types";

export function getProjects(): Project[] {
  return projects;
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getCapabilities(): Capability[] {
  return capabilities;
}

/** Evidence resolved with its project and a ready-to-use deep link. */
export type EvidenceItem = Evidence & {
  project: Pick<Project, "slug" | "title">;
  sectionTitle: string;
  href: string;
};

export function getEvidenceByCapability(): Record<string, EvidenceItem[]> {
  const out: Record<string, EvidenceItem[]> = {};
  for (const cap of capabilities) {
    out[cap.id] = evidence
      .filter((e) => e.capabilityIds.includes(cap.id))
      .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
      .map(resolveEvidence)
      .filter((e): e is EvidenceItem => e !== null);
  }
  return out;
}

function resolveEvidence(e: Evidence): EvidenceItem | null {
  const project = getProject(e.projectSlug);
  const section = project?.sections.find((s) => s.id === e.sectionId);
  if (!project || !section) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[content] evidence "${e.id}" points to a missing project or section`);
    }
    return null;
  }
  return {
    ...e,
    project: { slug: project.slug, title: project.title },
    sectionTitle: section.title,
    href: `/work/${project.slug}#${section.id}`,
  };
}
