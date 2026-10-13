import type { IntroData } from "@/components/case-study/templates/IntroTemplate";
import type { PillarFrameworkData } from "@/components/case-study/shared/PillarFramework";
import type { TestimonialData } from "@/components/case-study/shared/Testimonial";
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

export type LeadershipPillar = {
  id: string;
  /** Chapter header, e.g. "01 _ PILLAR: DIRECTION". */
  chapter: string;
  /** Pinned text beside the framework and proof (NarrativeTemplate). */
  title: string;
  body: string;
  framework: PillarFrameworkData;
  /** Super power fragment ids (src/content/powers.ts) shown as featured proof; omit when the framework is the evidence. */
  proof?: readonly string[];
};

/** The three pillars (Figma 176:3851, 176:3852, 176:3853). */
export const leadershipPillars: readonly LeadershipPillar[] = [
  {
    id: "pillar-direction",
    chapter: "01 _ PILLAR: DIRECTION",
    title: "Direction starts with focus.",
    body: "I frame the right problem, connect fragmented experiences into a coherent product model, and make strategic trade-offs explicit. The result is a clear, shared direction teams can execute.",
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
    title: "Help people grow and move together.",
    body: "Strong teams need both alignment and trust. I create the conditions for people to work through disagreement, build shared ownership, strengthen their judgment, and grow together over time.",
    // The people side of leadership: alignment, culture, growth and team health, one mechanism per row.
    framework: {
      challenge: "Competing priorities. Feedback tied to one manager. Friction that goes unspoken.",
      questions: [
        "Where do priorities collide?",
        "Do people feel safe to disagree?",
        "Who owns the outcome together?",
        "How do we raise the bar together?",
        "Who is ready for a bigger problem?",
        "How do we work better next time?",
      ],
      methods: [
        { title: "Alignment", detail: "Explicit trade-offs, shared priorities" },
        { title: "Team Culture", detail: "Trust, safety, shared expectations" },
        { title: "Team Building", detail: "Rituals, working norms" },
        { title: "Design Critique", detail: "Shared criteria, peer feedback" },
        { title: "Growth & Coaching", detail: "Growth tracker, stretch scope" },
        { title: "Retrospectives", detail: "Friction surfaced, practices improved" },
      ],
      enables: [
        "Trade-offs teams can defend",
        "Disagreement that moves work forward",
        "Shared ownership beyond one meeting",
        "Shared judgment that doesn’t wait on the manager",
        "Designers leading ambiguous, higher-impact work",
        "A team that keeps getting stronger",
      ],
    },
    proof: ["journey", "roles"],
  },
  {
    id: "pillar-calibration",
    chapter: "03 _ PILLAR: CALIBRATION",
    title: "Use reality to continuously correct judgment.",
    body: "Strong decisions improve when they are tested against evidence. I use research, user insight, behavioral signals, validation, and iteration to challenge assumptions, advocate for users, and keep the team learning as the product evolves.",
    // Mechanisms for correcting judgment with evidence; user advocacy is one of them, not the theme.
    framework: {
      challenge: "Opinion-led decisions. Risks found too late. Beliefs that outlive the evidence.",
      questions: [
        "Do we understand the problem yet?",
        "What are users telling us that the room is missing?",
        "Which assumptions could break the experience?",
        "What is real usage telling us?",
        "What would change our mind?",
      ],
      methods: [
        { title: "Research", detail: "Interviews, problem framing" },
        { title: "User Advocacy", detail: "Research, feedback, friction, unmet needs" },
        { title: "Validation", detail: "Targeted tests, tree tests" },
        { title: "Behavioral Signals", detail: "Usage, funnels, support feedback" },
        { title: "Iteration", detail: "Decisions as hypotheses" },
      ],
      enables: [
        "Clarity before converging",
        "User reality stays present in important decisions",
        "Critical risks surfaced earlier",
        "Internal beliefs checked against reality",
        "Judgment that improves as the product evolves",
      ],
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
export const leadershipTestimonials: readonly TestimonialData[] = [
  {
    quote: "MENTORSHIP — Han brings clarity to complex challenges and gives designers the support, feedback, and confidence to grow into stronger thinkers.",
    author: "Pei-Heng Yiu · Direct report, Neo Financial",
    href: recommendations,
  },
  {
    quote: "PEOPLE LEADERSHIP — Han combines exceptional craft with natural leadership. He guides teams through complex options by grounding decisions in user impact, business impact, and what it takes to ship.",
    author: "Jake Janosik · VP Design, Neo Financial",
    href: recommendations,
  },
  {
    quote: "COLLABORATION — “At Neo, he was a pillar of the design team - someone colleagues consistently turned to for clarity, support, and mentorship.”",
    author: "Marcelle Saulnier-Holland · Director Design, Neo Financial",
    href: recommendations,
  },
  {
    quote: "ANALYTICAL PROBLEM-SOLVING — Han is a deep thinker with a highly analytical approach. He challenges assumptions, uncovers the structure behind complexity, and turns it into clear solutions.",
    author: "Carolyn Pampino · Former VP Design, Brightcove",
  },
];
