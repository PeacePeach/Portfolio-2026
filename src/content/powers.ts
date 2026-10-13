import { superPowerFilters } from "./work";
import type { ImageRef, PowerFragment, SuperPower } from "./types";

/**
 * Super powers (Figma 25:538) and their fragments. Fragment copy follows the
 * Leadership page's featured proof cards (Figma AI-Portfolio 174:2747). Each fragment has one
 * primary power and links to the case-study section that tells its story.
 * Drawings live in public/illustrations: chalkboard style, white and grey
 * lines with dots of the highlight blue, no backdrop, each turned at its own
 * angle.
 */
const art = (name: string, alt: string): ImageRef => ({
  src: `/illustrations/${name}.svg`,
  alt,
  width: 262,
  height: 358,
});

const pool = {
  template: {
    kind: "case",
    title: "Defined the Lending Platform Template",
    body: "Neo Advance had to set patterns for future lending products before they existed. I created a shared model for entry points, account IA, and core journeys—unlocking decisions that had stalled the team.",
    summary: "2 DAYS · 3 PRODUCT LEADS · 2 FOUNDERS",
    project: "neo-advance",
    section: "neo-discovery",
    image: art("ambiguity", "A path through grey fog and a compass with a blue needle"),
  },
  journey: {
    kind: "case",
    title: "Aligned teams by solving the journey",
    body: "Marketing, Product, and Engineering pushed conflicting credit-progression directions. I reframed the debate around the end-to-end journey and aligned stakeholders in 2 days.",
    summary: "2 DAYS · 3 FUNCTIONS · 1 DIRECTION",
    project: "neo-advance",
    section: "neo-concept",
    image: art("journey", "A dotted path between stops, ending at a blue flag"),
  },
  validation: {
    kind: "case",
    title: "Broke the late-stage validation trap",
    body: "Two weeks before launch, testing 10 flows and 200+ screens was impractical. I triaged high-risk questions and ran 3 focused studies in 3 days to resolve critical decisions.",
    summary: "3 STUDIES · 3 DAYS · 200+ SCREENS",
    project: "neo-advance",
    section: "neo-hifi",
    image: art("research", "A magnifying glass over two speech bubbles"),
  },
  roles: {
    kind: "case",
    title: "Aligned three roles around one experience",
    body: "Content, pricing, and product roles needed a coherent streaming workflow. I turned interviews into a job map, led a PM/UX workshop, and shaped an IA supporting ownership and cross-role handoffs.",
    summary: "3 ROLES · JOB MAP · SHARED IA",
    project: "brightcove-beacon",
    section: "beacon-discovery",
    image: art("align", "Three arrows meeting at one blue point"),
  },
  navigation: {
    kind: "case",
    title: "Proved navigation before redesigning",
    body: "I tree-tested three IA options instead of relying on opinions. Task success improved from 54% to 87%, while average task time fell from 68s to 12s—guiding the new analytics structure.",
    summary: "54% → 87% SUCCESS · 68s → 12s",
    project: "reimagining-analytics",
    section: "analytics-strategy",
    image: art("dashboard", "A hand-drawn dashboard with a rising blue line"),
  },
  partnership: {
    kind: "case",
    title: "Designed the human–AI partnership first",
    body: "Scientists faced fragmented experiment workflows. I interviewed computational chemists, mapped where human judgment mattered, and defined a copilot model: AI proposes the plan while scientists retain control.",
    summary: "6 WEEKS · 4 SCIENTISTS · 6 HYPOTHESES",
    project: "mutexa",
    section: "mutexa-relationship",
    image: art("spark", "A pencil line ending in a blue star"),
  },
} satisfies Record<string, Omit<PowerFragment, "id" | "likes" | "notes">>;

type FragmentId = keyof typeof pool;

// Likes start at zero; visitors add theirs (src/lib/likes.ts).
const fragment = (id: FragmentId): PowerFragment => ({ id, likes: 0, notes: 0, ...pool[id] });

// One primary power per fragment.
const fragmentsByPower: Record<string, FragmentId[]> = {
  "navigate-ambiguity": ["template", "journey"],
  "bring-people-together": ["roles"],
  "calibrate-decisions": ["validation", "navigation"],
  "ai-assisted-design": ["partnership"],
};

/** Pillar copy from the Leadership page (Figma 174:2747). */
const descriptions: Record<string, string> = {
  "navigate-ambiguity":
    "I frame the right problem, connect fragmented experiences into a coherent product model, and make strategic trade-offs explicit. The result is a clear, shared direction teams can execute.",
  "bring-people-together":
    "I surface competing priorities, create shared decision criteria, and turn disagreements into commitments teams can carry forward—without reopening the same debates at every handoff.",
  "calibrate-decisions":
    "I use targeted evidence to challenge confident assumptions, resolve the riskiest questions, and turn what we learn into shared quality standards—without slowing down delivery.",
};

export const powers: SuperPower[] = superPowerFilters.map((f) => ({
  id: f.id,
  title: f.label,
  description:
    descriptions[f.id] ?? `Placeholder. One or two lines on what “${f.label.toLowerCase()}” means in how I work.`,
  fragments: (fragmentsByPower[f.id] ?? []).map(fragment),
}));
