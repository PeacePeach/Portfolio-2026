import { superPowerFilters } from "./work";
import type { ImageRef, PowerFragment, SuperPower } from "./types";

/**
 * Placeholder super powers (Figma 25:538). Titles follow the filters; the
 * descriptions, fragment titles, copy and counts are stand-ins to replace.
 * Each fragment has its own drawing in public/illustrations (hand-drawn
 * style, black/grey/white with a touch of the highlight blue).
 */
const art = (name: string, alt: string): ImageRef => ({
  src: `/illustrations/${name}.svg`,
  alt,
  width: 262,
  height: 358,
});

const body =
  "Placeholder. A few sentences on the problem, what made it hard, the call I made and what changed because of it. Real write-up to come.";

const pool = {
  dashboard: { kind: "case", title: "Build live dashboard", project: "neo-advance", image: art("dashboard", "A hand-drawn dashboard with a rising blue line") },
  journey: { kind: "case", title: "Map the credit journey", project: "neo-advance", image: art("journey", "A dotted path between stops, ending at a blue flag") },
  align: { kind: "case", title: "Get three teams on one plan", project: "banking-platform", image: art("align", "Three arrows meeting at one blue point") },
  research: { kind: "story", title: "Listen before designing", project: "banking-platform", image: art("research", "A magnifying glass over two speech bubbles") },
  spark: { kind: "case", title: "Prototype with AI", project: "ai-experimental", image: art("spark", "A pencil line ending in a blue star") },
  untangle: { kind: "case", title: "Untangle the rules engine", project: "b2b-platform", image: art("untangle", "A tangled line straightening into three, one blue") },
  ambiguity: { kind: "story", title: "Find a way through", project: "neo-advance", image: art("ambiguity", "A path through grey fog and a compass with a blue needle") },
  steps: { kind: "story", title: "Onboard new designers", project: "banking-platform", image: art("steps", "A figure on top of steps holding a blue flag") },
} satisfies Record<string, Omit<PowerFragment, "id" | "body" | "likes" | "notes">>;

type FragmentId = keyof typeof pool;

// Likes start at zero; visitors add theirs (src/lib/likes.ts).
const fragment = (id: FragmentId): PowerFragment => ({ id, body, likes: 0, notes: 0, ...pool[id] });

const fragmentsByPower: Record<string, FragmentId[]> = {
  "untangle-complexity": ["dashboard", "untangle", "journey", "align"],
  "navigate-ambiguity": ["ambiguity", "journey", "research", "align"],
  "set-people-up": ["steps", "align", "dashboard", "research"],
  "smart-research": ["research", "journey", "ambiguity", "spark"],
  "ai-assisted-design": ["spark", "dashboard", "untangle", "steps"],
};

export const powers: SuperPower[] = superPowerFilters.map((f) => ({
  id: f.id,
  title: f.label,
  description: `Placeholder. One or two lines on what “${f.label.toLowerCase()}” means in how I work.`,
  fragments: (fragmentsByPower[f.id] ?? []).map(fragment),
}));
