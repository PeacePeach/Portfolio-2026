import type { Project } from "./types";

/** Placeholder projects. Copy, imagery and sections are to be replaced. */
export const projects: Project[] = [
  {
    slug: "neo-advance",
    image: { src: "/placeholders/neo-advance.svg", alt: "", width: 1600, height: 1200 },
    title: "Neo Advance",
    summary: "Placeholder summary. One or two sentences on the problem, your role and why the work mattered.",
    meta: ["Fintech", "0→1"],
    year: "20XX",
    status: "placeholder",
    sections: [
      { id: "context", title: "Context" },
      { id: "framing", title: "Framing the problem" },
      { id: "concept", title: "From concept to product" },
      { id: "outcome", title: "Outcome" },
    ],
  },
  {
    slug: "banking-platform",
    image: { src: "/placeholders/banking-platform.svg", alt: "", width: 1200, height: 1500 },
    title: "Banking Platform",
    summary: "Placeholder summary. Describe the platform, the journeys it covered and the scope of your leadership.",
    meta: ["Banking", "Platform"],
    year: "20XX",
    status: "placeholder",
    sections: [
      { id: "context", title: "Context" },
      { id: "system", title: "A shared system" },
      { id: "governance", title: "Adoption and governance" },
      { id: "outcome", title: "Outcome" },
    ],
  },
  {
    slug: "ai-experimental",
    image: { src: "/placeholders/ai-experimental.svg", alt: "", width: 1920, height: 1080 },
    title: "AI / Experimental Work",
    summary: "Placeholder summary. A home for explorations, prototypes and AI-native product thinking.",
    meta: ["AI", "Prototyping"],
    year: "20XX",
    status: "placeholder",
    sections: [
      { id: "context", title: "Context" },
      { id: "explorations", title: "Explorations" },
      { id: "principles", title: "Principles" },
    ],
  },
];
