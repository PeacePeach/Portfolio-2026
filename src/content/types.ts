/**
 * Content model. The UI only depends on these types and on the accessors in
 * src/content/index.ts, so evidence can later come from a curated CMS export
 * or an AI pipeline without touching components.
 */

export type ImageRef = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type ContentStatus = "placeholder" | "draft" | "published";

/** A section of a case study that evidence can deep-link into. */
export type CaseStudySection = {
  /** URL fragment, e.g. /work/neo-advance#discovery */
  id: string;
  title: string;
};

export type Project = {
  slug: string;
  title: string;
  /** One or two sentences shown on the tile. */
  summary: string;
  /** Short meta shown beside the title, e.g. discipline or domain. */
  meta: string[];
  year?: string;
  image?: ImageRef;
  sections: CaseStudySection[];
  status: ContentStatus;
};

export type Capability = {
  id: string;
  label: string;
  /** Framing sentence shown above the evidence list. */
  summary: string;
};

/** Where a piece of evidence came from. Lets AI-written snippets be added and reviewed later. */
export type Provenance =
  | { kind: "curated" }
  | { kind: "generated"; model?: string; generatedAt?: string; reviewedBy?: string };

export type Evidence = {
  id: string;
  /** One snippet can support several capabilities. */
  capabilityIds: string[];
  projectSlug: string;
  /** Must match a CaseStudySection.id on the project. */
  sectionId: string;
  title: string;
  body: string;
  image?: ImageRef;
  /** Lower comes first within a capability. */
  order?: number;
  provenance: Provenance;
  status: ContentStatus;
};
