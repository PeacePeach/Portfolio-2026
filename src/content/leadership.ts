import type { IntroData } from "@/components/case-study/templates/IntroTemplate";
import type { SimpleSectionData } from "@/components/case-study/templates/SimpleSectionTemplate";
import type { ImageRef } from "./types";

/**
 * Leadership page (Figma AI-Portfolio 174:2747). Copy and config only; the
 * page composes the shared case-study templates and Super power fragments.
 */
export const leadershipIntro: IntroData = {
  eyebrow: "HOW I LEAD",
  align: "left",
  title: "I Make Progress Repeatable.",
  paragraphs: [
    "Complexity is inevitable. I create direction from ambiguity, bring people together around shared decisions, and calibrate judgment through evidence and critique. My goal isn’t just to move projects forward, but to build teams that can sustain momentum.",
  ],
};

/** Framework header (Figma 174:3221) over the static diagram (Figma 174:3227). */
export const leadershipFramework = {
  title: "How I Turn Ambiguity Into Momentum",
  description:
    "Direction creates clarity. Cohesion brings people together. Calibration sharpens decisions. Together, they help teams navigate complexity and sustain momentum.",
};

export const leadershipFrameworkDiagram: ImageRef = {
  src: "/leadership/framework-diagram.svg",
  alt: "Overlapping circles for Direction, Cohesion and Calibration inside Ambiguity, meeting at Complexity. Direction holds vision, systems, strategy, framing and journeys; Cohesion holds people, mentorship, facilitation, communication and trust; Calibration holds outcomes, insight, validation, judgment and iteration; critique, trade-offs and alignment sit where they overlap.",
  width: 1020,
  height: 484,
};

export type PillarFramework = {
  challenge: string;
  questions: readonly string[];
  methods: readonly { title: string; detail: string }[];
  enables: readonly string[];
};

export type LeadershipPillar = {
  id: string;
  /** Chapter header, e.g. "01 _ PILLAR: DIRECTION". */
  chapter: string;
  section: SimpleSectionData;
  framework: PillarFramework;
  /** Super power fragment ids (src/content/powers.ts) shown as featured proof. */
  proof: readonly string[];
};

/** The three pillars (Figma 176:3851, 176:3852, 176:3853). */
export const leadershipPillars: readonly LeadershipPillar[] = [
  {
    id: "pillar-direction",
    chapter: "01 _ PILLAR: DIRECTION",
    section: {
      title: "Direction starts with focus.",
      body: "I frame the right problem, connect fragmented experiences into a coherent product model, and make strategic trade-offs explicit. The result is a clear, shared direction teams can execute.",
      heading: "section",
      layout: "horizontal",
    },
    framework: {
      challenge: "Competing priorities. Fragmented experiences. No shared product direction.",
      questions: ["Are we solving the right problem?", "How do the pieces fit together?", "What matters most, and when?"],
      methods: [
        { title: "Problem Framing", detail: "Research synthesis, opportunity mapping" },
        { title: "System Mapping", detail: "Journey mapping, experience architecture" },
        { title: "Prioritization", detail: "Trade-offs, scenario planning" },
      ],
      enables: ["Shared problem definition and success criteria", "Coherent product model and experience vision", "Clear priorities and phased execution"],
    },
    proof: ["template", "partnership"],
  },
  {
    id: "pillar-cohesion",
    chapter: "02 _ PILLAR: COHESION",
    section: {
      title: "Make alignment last.",
      body: "I surface competing priorities, create shared decision criteria, and turn disagreements into commitments teams can carry forward—without reopening the same debates at every handoff.",
      heading: "section",
      layout: "horizontal",
    },
    framework: {
      challenge: "Siloed teams. Competing agendas. Decisions stall without shared ownership.",
      questions: ["Where do priorities collide?", "What trade-offs can we commit to?", "How do decisions survive handoffs?"],
      methods: [
        { title: "Facilitation", detail: "Stakeholder mapping, workshops" },
        { title: "Decision Rules", detail: "Shared criteria, trade-off reviews" },
        { title: "Team Enablement", detail: "Decision records, mentorship" },
      ],
      enables: ["Shared goals across functions", "Trade-offs teams can defend", "Ownership beyond one meeting"],
    },
    proof: ["journey", "roles"],
  },
  {
    id: "pillar-calibration",
    chapter: "03 _ PILLAR: CALIBRATION",
    section: {
      title: "Challenge assumptions before they scale.",
      body: "I use targeted evidence to challenge confident assumptions, resolve the riskiest questions, and turn what we learn into shared quality standards—without slowing down delivery.",
      heading: "section",
      layout: "horizontal",
    },
    framework: {
      challenge: "Opinion-led decisions. Risks found too late. Quality varies as teams scale.",
      questions: ["Which assumptions put us at risk?", "What’s the fastest credible test?", "How do we scale sound judgment?"],
      methods: [
        { title: "Risk Triage", detail: "Assumption audits, risk mapping" },
        { title: "Targeted Testing", detail: "Benchmark, doorway, A/B tests" },
        { title: "Quality Standards", detail: "Critique, review checklists" },
      ],
      enables: ["Critical risks surfaced earlier", "Evidence-backed product decisions", "More consistent quality at scale"],
    },
    proof: ["validation", "navigation"],
  },
];

export const leadershipProofLabel = "Featured proof";

/** Closing (Figma 176:4571). */
export const leadershipClosing = {
  title: "Leadership should outlast the leader.",
  description: [
    "I believe leadership means making the people and systems around you stronger. I create clarity from ambiguity, build trust across disciplines, and help teams develop the judgment to move forward without me.",
    "The perspectives below span four sides of my work: mentorship, strategic direction, collaboration, and analytical thinking.",
  ],
};

const recommendations = "https://www.linkedin.com/in/han-xu-a4392366/details/recommendations/?detailScreenTabIndex=0";

/** Testimonials (Figma 176:4657), two per row. */
export const leadershipTestimonials = [
  {
    quote: "MENTORSHIP — Han brings clarity to complex challenges and gives designers the support, feedback, and confidence to grow into stronger thinkers.",
    author: "Pei-Heng Yiu · Direct report",
    href: recommendations,
  },
  {
    quote: "PEOPLE LEADERSHIP — Han combines exceptional craft with natural leadership. He guides teams through complex options by grounding decisions in user impact, business impact, and what it takes to ship.",
    author: "Jake Janosik · VP, Design",
    href: recommendations,
  },
  {
    quote: "COLLABORATION — “At Neo, he was a pillar of the design team - someone colleagues consistently turned to for clarity, support, and mentorship.”",
    author: "Marcelle Saulnier-Holland · Director, Design",
    href: recommendations,
  },
  {
    quote: "ANALYTICAL PROBLEM-SOLVING — Han is a deep thinker with a highly analytical approach. He challenges assumptions, uncovers the structure behind complexity, and turns it into clear solutions.",
    author: "Carolyn Pampino · Former VP Design, Brightcove",
  },
] as const;
