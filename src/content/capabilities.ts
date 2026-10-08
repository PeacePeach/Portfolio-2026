import type { Capability, Evidence } from "./types";

export const capabilities: Capability[] = [
  {
    id: "design-systems",
    label: "Design Systems",
    summary: "Placeholder. How shared foundations let many teams ship consistent, accessible experiences.",
  },
  {
    id: "design-strategy",
    label: "Design Strategy",
    summary: "Placeholder. How design shaped product direction, priorities and investment.",
  },
  {
    id: "unlocking-ambiguity",
    label: "Unlocking Ambiguity",
    summary: "Placeholder. How undefined problems became clear, shippable work.",
  },
];

/**
 * Evidence snippets. Illustrative sample data only: not verified portfolio
 * content, no results or metrics. Replace or extend freely; new entries
 * (including AI-generated ones with provenance.kind = "generated") appear
 * automatically under every capability they list.
 */
export const evidence: Evidence[] = [
  // Design Systems
  {
    id: "banking-shared-patterns",
    image: { src: "/placeholders/banking-platform.svg", alt: "", width: 1200, height: 1500 },
    capabilityIds: ["design-systems"],
    projectSlug: "banking-platform",
    sectionId: "system",
    title: "One set of patterns across many banking journeys",
    body: "Sample snippet. Describe how recurring needs such as forms, confirmations and errors were consolidated into shared patterns so separate journeys behaved alike.",
    order: 1,
    provenance: { kind: "curated" },
    status: "placeholder",
  },
  {
    id: "banking-governance",
    capabilityIds: ["design-systems", "design-strategy"],
    projectSlug: "banking-platform",
    sectionId: "governance",
    title: "A contribution model teams actually used",
    body: "Sample snippet. Explain how the system was governed, who could contribute, and how decisions about new components were made.",
    order: 2,
    provenance: { kind: "curated" },
    status: "placeholder",
  },
  {
    id: "neo-foundations",
    capabilityIds: ["design-systems"],
    projectSlug: "neo-advance",
    sectionId: "concept",
    title: "Foundations set early, before the first release",
    body: "Sample snippet. Show which foundations were defined up front and how they kept a fast-moving 0→1 product coherent.",
    order: 3,
    provenance: { kind: "curated" },
    status: "placeholder",
  },

  // Design Strategy
  {
    id: "neo-framing",
    image: { src: "/placeholders/neo-advance.svg", alt: "", width: 1600, height: 1200 },
    capabilityIds: ["design-strategy", "unlocking-ambiguity"],
    projectSlug: "neo-advance",
    sectionId: "framing",
    title: "Reframing the brief around the customer’s real decision",
    body: "Sample snippet. Describe the original brief, what research or reasoning changed it, and how the new framing set direction for the team.",
    order: 1,
    provenance: { kind: "curated" },
    status: "placeholder",
  },
  {
    id: "ai-principles",
    capabilityIds: ["design-strategy"],
    projectSlug: "ai-experimental",
    sectionId: "principles",
    title: "Principles for designing with AI",
    body: "Sample snippet. Summarise the principles that guided AI-assisted features and how they were used to evaluate ideas.",
    order: 3,
    provenance: { kind: "curated" },
    status: "placeholder",
  },

  // Unlocking Ambiguity
  {
    id: "neo-concept-to-product",
    image: { src: "/placeholders/neo-advance.svg", alt: "", width: 1600, height: 1200 },
    capabilityIds: ["unlocking-ambiguity"],
    projectSlug: "neo-advance",
    sectionId: "concept",
    title: "From an undefined financial concept to a shippable experience",
    body: "Sample snippet. Walk through how an open-ended idea was narrowed into a first release: what was tested, what was cut, and why.",
    order: 1,
    provenance: { kind: "curated" },
    status: "placeholder",
  },
  {
    id: "ai-explorations",
    capabilityIds: ["unlocking-ambiguity"],
    projectSlug: "ai-experimental",
    sectionId: "explorations",
    title: "Prototyping to find the question worth answering",
    body: "Sample snippet. Explain how quick prototypes were used to learn where AI genuinely helped before committing to a direction.",
    order: 3,
    provenance: { kind: "curated" },
    status: "placeholder",
  },
];
