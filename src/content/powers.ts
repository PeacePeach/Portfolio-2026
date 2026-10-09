import { superPowerFilters } from "./work";
import type { PowerFragment, SuperPower } from "./types";

/**
 * Placeholder super powers (Figma 25:538). Titles follow the filters; every
 * description, fragment and counter is a stand-in to be replaced.
 */
const art = {
  neo: { src: "/placeholders/neo-advance.svg", alt: "", width: 1600, height: 1200 },
  banking: { src: "/placeholders/banking-platform.svg", alt: "", width: 1200, height: 1500 },
  ai: { src: "/placeholders/ai-experimental.svg", alt: "", width: 1920, height: 1080 },
};

const body =
  "Placeholder. A few sentences on the problem, what made it hard, the call I made and what changed because of it. Real write-up to come.";

const fragments = (power: string): PowerFragment[] => [
  { id: `${power}-1`, kind: "case", title: "Build live dashboard", body, project: "neo-advance", image: art.neo, likes: 12, notes: 8 },
  { id: `${power}-2`, kind: "story", title: "Placeholder story", body, project: "banking-platform", image: art.banking, likes: 12, notes: 8 },
  { id: `${power}-3`, kind: "case", title: "Placeholder fragment", body, project: "banking-platform", image: art.banking, likes: 12, notes: 8 },
  { id: `${power}-4`, kind: "case", title: "Placeholder fragment", body, project: "ai-experimental", image: art.ai, likes: 12, notes: 8 },
];

export const powers: SuperPower[] = superPowerFilters.map((f) => ({
  id: f.id,
  title: f.label,
  description: `Placeholder. One or two lines on what “${f.label.toLowerCase()}” means in how I work.`,
  fragments: fragments(f.id),
}));
