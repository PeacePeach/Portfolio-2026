import { superPowerFilters } from "./work";
import type { ImageRef, PowerFragment, SuperPower } from "./types";

/**
 * Super powers (Figma 25:538) and their fragments. Each fragment has one
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
    title: "Defined the lending platform before it existed",
    body: "Neo Advance had no established lending model. I created a reusable framework across future lending products, aligning product leads and founders around the decisions every downstream experience would inherit.",
    summary: "2 DAYS · 3 PRODUCT LEADS · 2 FOUNDERS",
    project: "neo-advance",
    section: "neo-discovery",
    image: art("ambiguity", "A path through grey fog and a compass with a blue needle"),
  },
  journey: {
    kind: "case",
    title: "Solved the journey, not just the screen",
    body: "Conflicting ideas around credit progression were blocking the experience. I reframed the problem around the full customer journey and created one progression model the team could design against.",
    summary: "1 SHARED MODEL · 200+ SCREENS",
    project: "neo-advance",
    section: "neo-concept",
    image: art("journey", "A dotted path between stops, ending at a blue flag"),
  },
  validation: {
    kind: "case",
    title: "Broke the late-stage validation trap",
    body: "Two weeks before launch, testing 10 flows and 200+ screens was impractical. I triaged the highest-risk questions and ran three focused studies in three days.",
    summary: "3 STUDIES · 3 DAYS · 200+ SCREENS",
    project: "neo-advance",
    section: "neo-hifi",
    image: art("research", "A magnifying glass over two speech bubbles"),
  },
  roles: {
    kind: "case",
    title: "Aligned three roles around one experience",
    body: "Beacon’s monetization workflow depended on producers, pricing managers, and other stakeholders with conflicting ownership models. I clarified responsibilities and designed one workflow across the roles.",
    summary: "3 ROLES · 1 SHARED WORKFLOW",
    project: "brightcove-beacon",
    section: "beacon-discovery",
    image: art("align", "Three arrows meeting at one blue point"),
  },
  navigation: {
    kind: "case",
    title: "Proved navigation before redesigning",
    body: "Before rebuilding Analytics, I tested the information architecture first. Tree testing raised task success from 54% to 87% and cut average task time from 68s to 12s.",
    summary: "54% → 87% · 68s → 12s",
    project: "reimagining-analytics",
    section: "analytics-strategy",
    image: art("dashboard", "A hand-drawn dashboard with a rising blue line"),
  },
  partnership: {
    kind: "case",
    title: "Designed the human–AI partnership first",
    body: "For EnzyHTP, I defined where AI should lead, assist, or step aside before designing the interface, turning fragmented scientific tools into one guided experiment workflow.",
    summary: "6 WEEKS · 4 SCIENTISTS · 2 ENGINEERS",
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
