import type { IntroData } from "@/components/case-study/templates/IntroTemplate";
import type { SimpleSectionData } from "@/components/case-study/templates/SimpleSectionTemplate";
import type { ImageRef } from "@/content/types";
import type { NarrativeData } from "@/components/case-study/templates/NarrativeTemplate";
import type { StatCircleData } from "@/components/case-study/shared/StatCircles";

/** Mutexa / EnzyHTP case study intro. */
export const mutexaIntro = {
  title: "Mutexa HTP",
  paragraphs: [
    "Computational chemistry tools were fragmented and difficult to use, forcing scientists to become experts in disconnected software. I led the 0→1 design of an AI-assisted research workflow that helped scientists design, run, and interpret complex experiments more efficiently.",
    "A rapid collaboration with computational scientists from Vanderbilt University.",
  ],
  facts: [
    { label: "Role", items: ["Lead designer"] },
    { label: "Duration", items: ["6 weeks"] },
    { label: "Team", items: ["4 computational chemists", "2 software engineers"] },
    { label: "Platform", items: ["Desktop web"] },
  ],
} satisfies IntroData;

/** "The Context" (Figma Slides 187:3394). */
export const mutexaContext = {
  label: "The Context",
  title: "How enzyme mutation works?",
} satisfies SimpleSectionData;

/**
 * The Context figure (Figma AI-Portfolio 176:3670): one prototype recording of the three steps, 822 × 318,
 * with each caption centred under its step's enzyme.
 */
export const mutexaContextFigure = {
  src: "/case-studies/mutexa/context/enzyme-mutation.webp",
  alt: "Three steps of enzyme mutation: a starch chain in the enzyme's active site, a hand reshaping the site, and the mutated enzyme splitting the chain",
  width: 822,
  height: 318,
  /** `x`: caption centre under the step's enzyme, % of the figure's width; `src`: the step alone, stacked below `md`. */
  steps: [
    { caption: "The original enzyme (wild type) breaks down starch at its natural speed.", x: 11.2, src: "/case-studies/mutexa/context/wild-type.webp" },
    { caption: "Scientists mutate the active site to alter its structure.", x: 51.93, src: "/case-studies/mutexa/context/mutation.webp" },
    { caption: "The mutated enzyme is tested to see if it works faster.", x: 87.9, src: "/case-studies/mutexa/context/testing.webp" },
  ],
} as const;

/** "The Opportunity" (Figma Slides 187:3402). */
export const mutexaOpportunity = {
  label: "The Opportunity",
  title: "Enzyme development is slow, inefficient, and unpredictable.",
} satisfies SimpleSectionData;

export const mutexaOpportunityStats = [
  { value: "5-10 years", label: "Development Time" },
  { value: "~0.2%", label: "Success Rate" },
  { value: "~50%", label: "Off-target Effects" },
] satisfies StatCircleData[];

const screen = (name: string, alt: string) => ({ src: `/case-studies/mutexa/key-experience/${name}.webp`, alt, width: 1600, height: 861 });

/** "Key experience" (Figma Slides 187:3421, 187:3424, 187:3427, 187:3430): rolling steps beside separate screens. Each screen is the slide's own recording (GIF, cropped to the app, as animated WebP), without the slides' blue backdrop. */
export const mutexaKeyExperience = {
  label: "Key experience",
  imageLayout: "separate",
  steps: [
    {
      id: "creating-experiment",
      title: "Creating an experiment",
      body: "Scientists create and manage experiments in one workspace, instead of stitching together separate tools.",
      images: [screen("creating-experiment", "Mutexa's All experiments table: each experiment's type, status, description, metrics and last update, with a New experiment button")],
    },
    {
      id: "refining-plan",
      title: "Refining the research plan with AI",
      body: "Inside an experiment, the AI works like a research partner: scientists describe the goal, and the copilot refines the plan, tools and parameters.",
      images: [screen("refining-plan", "AI Planner: after the wild-type PDB file is uploaded, HTP Copilot suggests how to sharpen the research question, beside the protein in the GUI view")],
    },
    {
      id: "3d-wild-type",
      title: "Interacting with the 3D wild type",
      body: "Scientists can still inspect and interact with the real molecular structure, so the AI never hides it behind a chat.",
      images: [screen("3d-wild-type", "AI Planner with a confirmed four-step workflow and prompts for choosing mutations, beside the wild-type protein in the GUI view")],
    },
    {
      id: "plan-review",
      title: "AI-assisted research plan review and outcome analysis",
      body: "When everything is ready, scientists run the experiment and review the results once it finishes.",
      images: [screen("plan-review", "HTP Copilot confirms the selected residue and mutations while the GUI view compares the wild type with three mutations")],
    },
  ],
} satisfies NarrativeData;

/** "01 Design the relationship before the intelligence" (Figma Slides 187:3446). */
export const mutexaRelationship = {
  label: "Story 1",
  title: "Design the human–AI relationship before the intelligence",
  body: "Before deciding what AI should automate, I interviewed scientists and mapped their workflows to find where human judgment matters. AI helped synthesize the research and surface workflow patterns.",
} satisfies SimpleSectionData;

/** Figma Slides 187:3466: one line of body copy (the page passes it as `text`) over the Cursor build beside four prototype screens, composed on a transparent ground. */
export const mutexaPrototypes = {
  align: "left",
  title: "I used Cursor to turn six workflow hypotheses into runnable prototypes, testing different step structures, state transitions, and human–AI handoffs before converging on the final flow.",
} satisfies SimpleSectionData;

export const mutexaPrototypesImage: ImageRef = {
  src: "/case-studies/mutexa/relationship/prototypes.webp",
  alt: "A prototype step built in Cursor, beside four prototype screens: defining the research question, choosing the active site, filtering generated candidates and using your own tools",
  width: 2778,
  height: 1000,
};

const iteration = (name: string, alt: string, width: number, height: number) => ({ src: `/case-studies/mutexa/relationship/${name}.webp`, alt, width, height });

/** Figma Slides 187:3474, 187:3479, 187:3484: rolling steps beside separate screens, without the slides' blue backdrop. */
export const mutexaIterations = {
  label: "From manual workflow to AI autonomy",
  imageLayout: "separate",
  steps: [
    {
      id: "iteration-1",
      title: "1st Iteration",
      body: "I started with a fully manual workflow, giving scientists control over every input and parameter. It was transparent, but still required them to configure each step themselves.",
      images: [iteration("iteration-1", "First iteration: a step-by-step form where the scientist picks every target metric by hand", 2000, 1287)],
    },
    {
      id: "iteration-2",
      title: "2nd Iteration",
      body: "I introduced AI as a copilot, translating scientific intent into recommendations and reducing setup. The scientist still drove the workflow, but with less manual configuration.",
      images: [iteration("iteration-2", "Second iteration: set-up as a conversation with HTP Copilot before the workflow step", 2000, 1344)],
    },
    {
      id: "final-design",
      title: "Final design",
      body: "I gave AI more autonomy to propose the workflow, tools, and parameters, while scientists retained review and approval. AI handled coordination; scientists kept scientific judgment.",
      images: [iteration("final-design", "Final design: the AI Planner proposes a four-step workflow the scientist confirms, beside the progress tracker and the protein in the GUI view", 2000, 1419)],
    },
  ],
} satisfies NarrativeData;
