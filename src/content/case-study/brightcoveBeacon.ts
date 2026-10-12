import type { ImageRef } from "@/content/types";
import type { IntroData } from "@/components/case-study/templates/IntroTemplate";
import type { SimpleSectionData } from "@/components/case-study/templates/SimpleSectionTemplate";
import type { TwoColumnTextData } from "@/components/case-study/templates/TwoColumnTextTemplate";
import type { NarrativeData } from "@/components/case-study/templates/NarrativeTemplate";
import type { PersonaTasksData } from "@/components/case-study/shared/PersonaTasks";
import type { NarrativeImage } from "@/components/case-study/templates/NarrativeTemplate";
import type { ImpactData } from "@/components/case-study/templates/ImpactTemplate";
import type { BeforeAfterTabsData } from "@/components/case-study/templates/BeforeAfterTemplate";
import type { PersonaQuoteData } from "@/components/case-study/shared/PersonaQuote";
import type { ReflectionData } from "@/components/case-study/templates/ReflectionTemplate";
import type { FollowUpData } from "@/components/case-study/templates/FollowUpTemplate";

/** Brightcove Beacon intro (Figma 924:1807, 924:1795): title, copy and facts. */
export const brightcoveBeaconIntro = {
  title: "Brightcove Beacon",
  paragraphs: [
    "Brightcove Beacon is a platform that significantly reduces the time and cost required for video streaming companies to develop their branded apps. I helped the team define users, scope, and structure of the product, then led the design of the Monetize module.",
  ],
  facts: [
    { label: "Duration", items: ["6 months"] },
    { label: "Platform", items: ["Desktop"] },
    { label: "Type", items: ["1-N product", "B2B", "CMS", "Monetization"] },
    { label: "Role", items: ["Design lead", "User research", "UX strategy", "Design execution"] },
  ],
} satisfies IntroData;

/** "Impact" (Figma 929:1880). */
export const brightcoveBeaconImpact = {
  title: "Impact",
  cards: [
    { icon: "users", value: "500+", label: "Net new users", body: "After one year since the launch of phase 2, the platform gained over 500 net new users." },
    { icon: "refresh", value: "82%", label: "User retention", body: "The platform achieved a record-high annual customer retention of 82% among all company products." },
    { icon: "task", value: "75", label: "SUS score", body: "We conducted a survey among 87 active users, resulting in a notable SUS score of 75." },
  ],
} satisfies ImpactData;

const img = (name: string, alt: string, width: number, height: number): ImageRef => ({ src: `/case-studies/brightcove-beacon/${name}`, alt, width, height });

/**
 * Chapter 1 opener (Figma AI-Portfolio 164:5169, "Rolling artifacts"): the world of Xstream.ly, then its
 * three key roles, as one scrolling narrative. The team map is `BeaconTeamMap` (code);
 * the personas are full-width cards (2x exports of 114:2425, 114:2579 and Brandon's new card).
 */
export const brightcoveBeaconContext = {
  label: "The World of Xstream.ly",
  imageLayout: "separate",
  steps: [
    {
      id: "beacon-context",
      title: "The World of Xstream.ly",
      body:
        "Xstream.ly is a video streaming company with the goal of growing audience with engaging content. The company operates with a 'team of teams' structure, involving extensive cross-team collaborations with various internal and external roles.",
      // Visual: `BeaconTeamMap`, the bubble map rebuilt in code (set where the page renders this narrative).
    },
    {
      // No visual: holds the team map while the text swaps (copy and highlights from `brightcoveBeaconProblem`).
      id: "customer-problem",
      title: "Customer Problem",
    },
    {
      id: "persona-laurel",
      title: "Laurel, Product Manager",
      body: "“I am a trailblazer who takes others with me, like it or not!”",
      images: [img(
        "persona-laurel-card.jpg",
        "Persona card for Laurel, Product Manager at Xstream.ly: current tools, aptitude and altitude, responsibilities, goals, needs and pain points",
        1818, 1028,
      )],
    },
    {
      id: "persona-sharyn",
      title: "Sharyn, Content Producer",
      body: "“I always thrive to give the best for producing engaging videos.”",
      images: [img(
        "persona-sharyn.jpg",
        "Persona card for Sharyn, Content Producer at Xstream.ly: current tools, aptitude and altitude, responsibilities, goals, needs and pain points",
        1818, 1028,
      )],
    },
    {
      id: "persona-brandon",
      title: "Brandon, Pricing Manager",
      body: "“Every plan should earn its keep: priced right, accurate, and live without waiting on a developer.”",
      images: [img(
        "persona-brandon-card.jpg",
        "Persona card for Brandon, Pricing Manager at Xstream.ly: current tools, aptitude and altitude, responsibilities, goals, needs and pain points",
        1818, 1028,
      )],
    },
  ],
} satisfies NarrativeData;

/** Customer problem (Figma 114:2736), shown as a held step of the opening narrative; `[...]` marks the highlighted phrases. */
export const brightcoveBeaconProblem = {
  title: "Customer Problem",
  columns: [
    { title: "Costly app development", body: "Xstream.ly aims to rapidly acquire viewers with their branded app, but the [significant development cost] hinders its progress." },
    { title: "Manual content work", body: "The sheer amount of [manual work] in curating, publishing, and monetizing video content greatly [reduces efficiency]." },
  ],
} as const;

/** Job mapping (Figma 114:2763), over the job map (2x export, cropped). */
export const brightcoveBeaconJobMap = {
  align: "left",
  label: "Job mapping",
  heading: "section",
  compact: true,
  title: "Which areas to streamline?",
  body:
    "Understanding the product's goal of streamlining user workflow, I developed a job map from interview data. Then, I led a workshop with Project Managers and UX strategists to pinpoint focus areas.",
} satisfies SimpleSectionData;

export const brightcoveBeaconJobMapImage = img(
  "job-map.jpg",
  "Job map of each role's jobs from strategize to collaborate; red dots mark priority by frequency or importance",
  2496, 1612,
);

/** Information architecture (Figma 114:2783), over the module map (2x export, cropped). */
export const brightcoveBeaconInfoArch = {
  align: "left",
  label: "Info arch",
  heading: "section",
  compact: true,
  title: "Where Do They Live?",
  body:
    "The information architecture was structured to concentrate each role's workflows within their own module, while enabling flexible interactions across different modules.",
} satisfies SimpleSectionData;

export const brightcoveBeaconInfoArchImage = img(
  "info-arch.jpg",
  "Information architecture: Home, Media, Experience, Monetize, Analytics and Settings modules, with the content producer, product manager and pricing manager above the modules they work in",
  2496, 1382,
);

/** Key experience (Figma 114:2259): section text, then the collaboration flow below. */
export const brightcoveBeaconCollaboration = {
  align: "left",
  label: "Key experience",
  heading: "section",
  title: "How They Collaborate?",
  body:
    "The initial release prioritized the needs of content producers and product managers. It empowered them with tools to independently manage videos and viewer applications within their respective modules, while also facilitating cross-module collaboration.",
} satisfies SimpleSectionData;

const avatar = (name: string) => `/case-studies/brightcove-beacon/avatar-${name}.jpg`;
const sharyn = { name: "Sharyn", role: "Content Producer", avatar: avatar("sharyn") };
const brandon = { name: "Brandon", role: "Pricing Manager", avatar: avatar("brandon") };
const laurel = { name: "Laurel", role: "Product Manager", avatar: avatar("laurel") };
const screen = (name: string, alt: string, height = 908): NarrativeImage => img(`collab-${name}.jpg`, alt, 1640, height);

/** The collaboration flow (Figma 114:2259): each step's people and tasks (PersonaTasks) beside its screens (2x exports). */
export const brightcoveBeaconCollaborationFlow: { label: string; steps: (Omit<NarrativeData["steps"][number], "text"> & { persona: PersonaTasksData })[] } = {
  label: "How they collaborate",
  steps: [
    {
      id: "collab-content",
      title: "Sharyn uploads and organizes content",
      persona: { people: [sharyn], tasks: ["Upload video content", "Tag content", "Categorize content", "Make playlists", "Manage restriction"] },
      images: [
        screen("media-library", "Beacon Media module: the movie library with status, dates and plan availability"),
        screen("video-details", "Video details for “Aerials from Scandinavia and Iceland”: player, metadata and video type", 1593),
      ],
    },
    {
      id: "collab-pricing",
      title: "Brandon monetizes the content",
      persona: { people: [brandon], handoff: "Notified by Sharyn", tasks: ["Configure ad tags", "Set up SVOD plans with 3rd-party", "Add videos to plan"] },
      images: [screen("monetization", "Series availability for “The Ultimate Rush”: rule set with calendar, location and device restrictions and SVOD plan selection")],
    },
    {
      id: "collab-app",
      title: "Laurel builds and publishes the viewer app",
      persona: { people: [laurel], handoff: "Sharyn collaborates, Brandon notifies", tasks: ["Set up and publish viewer app", "Build pages with templates", "Add content to pages", "Configure restrictions", "Select devices", "Schedule streaming time"] },
      images: [
        screen("page-templates", "Experience module: building the XStream Sports page from a playlist grid template"),
        screen("video-settings", "Episodic content page settings: thumbnails, details layout and player options"),
      ],
    },
    {
      id: "collab-viewers",
      title: "Viewers watch on the app",
      persona: { people: [{ name: "Viewers", role: "Xstream.ly app" }], tasks: ["Download app", "Watch VOD and live content"] },
      images: [screen("viewer-app", "The Xstream.ly viewer app: Xstream Classics row of shows", 836)],
    },
  ],
};

/** Diving deeper (Figma AI-Portfolio 166:5550): a simple section, text beside the pricing manager's persona card. */
export const brightcoveBeaconDivingDeeper = {
  layout: "horizontal",
  label: "Diving deeper",
  title: "Post-MVP, I focused on the pricing manager persona, refining monetization workflows and interactions.",
} satisfies SimpleSectionData;

export const brightcoveBeaconDivingDeeperImage = img(
  "persona-brandon-focus.jpg",
  "Persona card for Brandon, Pricing Manager at Xstream.ly: responsibilities, goals, needs and pain points",
  1408, 758,
);

/** Chapter 2 (Figma AI-Portfolio 166:5756, top): the challenge, then a Tell Me About It prompt that reveals the approach, then the discovery process diagram. */
export const brightcoveBeaconDiscovery = {
  columns: [
    {
      label: "Challenge in discovery",
      title: "Discrepancy Between Old and New Research Findings",
      body: "During discovery, conflicting research emerged around monetization ownership. Earlier findings pointed to the pricing manager, while my Monetize interviews suggested the video producer. Resolving this was critical because each model required a fundamentally different data structure and front-end experience.",
    },
    {
      tellMeAboutIt: {
        variant: "prompt",
        eyebrow: "TELL ME ABOUT IT",
        title: "What would you do if you were me?",
        resolved: {
          label: "Approach",
          title: "Sequenced Validation",
          body: "Upon undertaking subsequent steps, it was discovered that the product primarily catered to small organizations where the content producer monetizes their content. Thus, after validating with customers, we chose to proceed in that direction.",
        },
      },
    },
  ],
} satisfies TwoColumnTextData;

/** Exported on the page background, so it sits unframed, as wide as the two text columns above it. */
export const brightcoveBeaconDiscoveryImage = img(
  "discovery-process.jpg",
  "Discovery process: distill patterns through deeper research (larger orgs: a monetizer makes sure the correct plans exist and content is associated to them; small orgs: a product coordinator uploads content and assigns it to plans at the same time), align with business goals to narrow down solutions, and test the assumption with storyboarding",
  1762, 1200,
);

/** Chapter 3 (Figma AI-Portfolio 166:5756, bottom): the challenge, then a Tell Me About It prompt that reveals the approach, then micro-jobs and their user flows. */
export const brightcoveBeaconIdeation = {
  columns: [
    {
      label: "Challenge in ideation",
      title: "Complex Collaboration and workflows",
      body: "In the ideation phase, the team was overwhelmed by research data, and the design process was blocked by the complexities of collaboration and workflows.",
    },
    {
      tellMeAboutIt: {
        variant: "prompt",
        eyebrow: "TELL ME ABOUT IT",
        title: "What would you do if you were me?",
        resolved: {
          label: "Approach",
          title: "Leveraging Granularity",
          body: "Using the job map as a guide, I broke down the primary job into four distinct micro-jobs, each with its own set of user flows. I assigned each flow to a Junior Designer, while I took on a flow myself. We then iterated on our respective flows based on user feedback gathered from usability tests, creating a collaborative and dynamic design process.",
        },
      },
    },
  ],
} satisfies TwoColumnTextData;

export const brightcoveBeaconMicroJobsImage = img(
  "micro-jobs.jpg",
  "Four micro-jobs with their user flows: create or update the monetization model, determine ad placement, make sure video content is monetized correctly, and review video and ad engagement analytics",
  2304, 568,
);

export const brightcoveBeaconUserFlowsImage = img(
  "user-flows.jpg",
  "User flows for create plan, add plan to videos and determine ad placement, annotated: identify external manual effort and leverage integration, identify touch points and accommodate collaboration, merge similar flows to reduce internal manual effort",
  2304, 3132,
);

/** Chapter 4 (Figma AI-Portfolio 166:10574, old layout): the challenge, then a Tell Me About It prompt that reveals the approach, then the sprint flows as tabbed Before / After. */
export const brightcoveBeaconExecution = {
  columns: [
    {
      label: "Challenge in design execution",
      title: "Complex Data Structure and Input",
      body: "When we entered the design execution phase, the team was challenged by the complex data input and structure that a user needs to cope with in order to create a plan.",
    },
    {
      tellMeAboutIt: {
        variant: "prompt",
        eyebrow: "TELL ME ABOUT IT",
        title: "What would you do if you were me?",
        resolved: {
          label: "Approach",
          title: "Rigorous Bi-Weekly Design Sprints",
          body: "To address the complexity in data input, I spearheaded bi-weekly design sprints. In these sessions, designers selected relevant stories, collaborated with peers, project managers, and developers, conducted usability tests, and refined designs based on the gathered feedback.",
        },
      },
    },
  ],
} satisfies TwoColumnTextData;

const planScreen = (name: string, alt: string) => ({ src: `/case-studies/brightcove-beacon/${name}.jpg`, alt });

/** Figma 166:12072: each screen's caption is folded into its bullets, so a bullet says what the screen does and how it fares. */
export const brightcoveBeaconSprintFlows = {
  tabsLabel: "Design sprint flows",
  tabs: [
    {
      id: "flow-1", label: "Flow 1",
      data: {
        size: "wide",
        title: "Horizontal Tabs → Vertical Tabs + Stepper",
        description: "Plan details: how the tabs guide users through creating a plan.",
        before: {
          images: [planScreen("plan-horizontal-tabs", "Premium Plan detail with horizontal tabs for monetization, availability, options and appearance")],
          bullets: [{ tone: "negative", text: "Horizontal tabs leave the goal invisible" }],
        },
        after: {
          images: [planScreen("plan-vertical-tabs", "Premium Plan detail with vertical tabs and a stepper, on the availability step with Back and Next")],
          bullets: [
            { tone: "positive", text: "Vertical tabs and a stepper give a clear call-to-action and more flexibility" },
            { tone: "negative", text: "More dev work" },
          ],
        },
      },
    },
    {
      id: "flow-2", label: "Flow 2",
      data: {
        size: "wide",
        title: "All Inputs Upfront → Choose First, Then Add Data",
        description: "Plan setup: when users add each type of data.",
        before: {
          images: [planScreen("plan-vertical-tabs", "Availability step showing calendar and location restriction inputs all at once")],
          bullets: [
            { tone: "negative", text: "Seeing all data inputs upfront takes more mental effort" },
            { tone: "negative", text: "Content the user needs stays invisible" },
          ],
        },
        after: {
          images: [planScreen("plan-choose-first", "Monetization step where the user switches on Web app first, then adds its prices")],
          bullets: [
            { tone: "positive", text: "Choosing the option first, then adding data, takes less mental effort" },
            { tone: "positive", text: "Better visibility" },
          ],
        },
      },
    },
    {
      id: "flow-3", label: "Flow 3",
      data: {
        size: "wide",
        title: "All Inputs Upfront → Preview by Default",
        description: "Ad tags: how an AVOD plan's rule sets are set up.",
        before: {
          images: [planScreen("avod-ad-tags", "My AVOD plan with the ad provider, ad target and every ad tag shown as inputs upfront")],
          bullets: [{ tone: "negative", text: "With every input upfront, users had to create multiple plans for different combinations of ad tags and restrictions" }],
        },
        after: {
          images: [planScreen("avod-rule-sets", "My AVOD plan previewing rule sets, each with its VOD tag, live tag, devices and locations, plus Add rule set")],
          bullets: [
            { tone: "positive", text: "Previewing data by default increases flexibility and control" },
            { tone: "negative", text: "Increased mental effort" },
          ],
        },
      },
    },
  ],
} satisfies BeforeAfterTabsData;

const finalScreen = (name: string, alt: string, height = 1280): ImageRef => ({ src: `/case-studies/brightcove-beacon/final-${name}.jpg`, alt, width: 2304, height });

/** Final design (Figma AI-Portfolio 167:662): as Reimagining Analytics, one left-aligned inset section per moment, a persona quote with its tasks over the screens. */
const prototype = "https://www.figma.com/proto/UWsN01gp94fLUAfhIMbku1/Beacon-Monetize_Plans?page-id=42%3A12902&type=design&node-id=42-12903&viewport=227%2C444%2C0.04&scaling=min-zoom&starting-point-node-id=42%3A12903";

export const brightcoveBeaconFinalDesign: readonly { id: string; title: string; persona: PersonaQuoteData; images: readonly ImageRef[]; prototype?: string }[] = [
  {
    id: "create-plan",
    title: "Pricing manager: Create plan",
    persona: { name: brandon.role, avatar: brandon.avatar, quote: "“I am thrilled to share that I now have the power to choose from a wide array of exciting monetization models and effortlessly create plans, all on my own. No more reliance on external help!”", tags: ["Create plan", "Select monetization model"] },
    images: [
      finalScreen("plans", "Monetize: the Plans list with plan name, status, type, price, location and device, and a Create plan button"),
      finalScreen("monetization-model", "Select monetization model dialog: AuthVOD, AVOD, SVOD and TVOD models, each with a short description"),
    ],
    prototype,
  },
  {
    id: "configure-plan",
    title: "Pricing manager: Configure and publish plan",
    persona: { name: brandon.role, avatar: brandon.avatar, quote: "“I’m amazed that the time-consuming process of setting up plans that used to take days has been streamlined into a matter of minutes.”", tags: ["Configure plan", "Publish plan"] },
    images: [
      finalScreen("configure-plan", "Premium Plan, monetization step: Web app prices, regional prices, billing frequency and enrollment devices, with Next"),
      finalScreen("publish-plan", "Premium Plan, appearance step with every step checked, a plan preview and a notice that the plan is published"),
    ],
    prototype,
  },
  {
    id: "advanced-path",
    title: "Content producer: Add content to plan, advanced path",
    persona: { name: sharyn.role, avatar: sharyn.avatar, quote: "“I now effortlessly incorporate video content into plans, considering time and geographical restrictions. It saves me time, adds flexibility, and enhances my content curation.”", tags: ["Add content to plan: advanced path"] },
    images: [
      finalScreen("advanced-quick-edit", "Media: Quick Edit for three selected videos, with availability rule sets and a notice that the SVOD plan was created"),
      finalScreen("advanced-rule-set", "Add Rule Set 2: calendar, location and device restrictions, then the monetization model and plan to apply", 1669),
    ],
  },
  {
    id: "easy-path",
    title: "Content producer: Add content to plan, easy path",
    persona: { name: sharyn.role, avatar: sharyn.avatar, quote: "“I can also swiftly add videos to plans during upload or in the CMS using bulk editing, completely disregarding any content restrictions.”", tags: ["Add content to plan: easy path"] },
    images: [finalScreen("easy-path", "Monetize three selected videos in bulk: pick a monetization model and a plan, with no restrictions")],
  },
];

export const brightcoveBeaconReflection: ReflectionData = {
  headline: "Design is great not by simplifying solutions, but by making users comfortable with complexity.",
  body: "Designing the SVOD plan configuration taught me that complexity isn't always something to eliminate. For infrequent, high-stakes tasks, simplifying too much can hide important decisions. By making complex monetization rules clear and manageable, we helped users navigate them with confidence.",
};

/** Closing follow-up, as the other case studies: feedback beside the next case study. */
export const brightcoveBeaconFollowUp: FollowUpData = {
  feedback: {
    eyebrow: "TELL ME ABOUT IT",
    title: "How do you like this case study?",
    quickReplies: ["Loved it!", "Meh ...", "It’s too long"],
  },
  current: "brightcove-beacon",
};
