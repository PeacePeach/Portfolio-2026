import type { ImageRef } from "@/content/types";
import type { IntroData } from "@/components/case-study/templates/IntroTemplate";
import type { SimpleSectionData } from "@/components/case-study/templates/SimpleSectionTemplate";
import type { NarrativeData } from "@/components/case-study/templates/NarrativeTemplate";
import type { HorizontalSlidesData } from "@/components/case-study/templates/HorizontalSlidesTemplate";
import type { PersonaTasksData } from "@/components/case-study/shared/PersonaTasks";
import type { NarrativeImage } from "@/components/case-study/templates/NarrativeTemplate";
import type { ImpactData } from "@/components/case-study/templates/ImpactTemplate";

/** Brightcove Beacon hero (Figma 924:1766, top 720 px): the angled screen collage, exported as one image. */
export const brightcoveBeaconHero = {
  src: "/case-studies/brightcove-beacon/hero.jpg",
  alt: "Beacon screens laid out at an angle: the welcome page, a page type picker, a monetization modal and the movie library",
  width: 2560,
  height: 1440,
} satisfies ImageRef;

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

/** Chapter 1, "The World of Xstream.ly" (Figma 114:282): static text beside the team map (the source image of 117:325, transparent background). */
export const brightcoveBeaconContext = {
  label: "The World of Xstream.ly",
  imageLayout: "plain",
  steps: [{
    id: "beacon-context",
    label: "Context",
    title: "The World of Xstream.ly",
    body:
      "Xstream.ly is a video streaming company with the goal of growing audience with engaging content. The company operates with a 'team of teams' structure, involving extensive cross-team collaborations with various internal and external roles.",
    images: [img("xstreamly-world.png", "Xstream.ly's team of teams: internal and external roles clustered around the company", 1296, 1294)],
  }],
} satisfies NarrativeData;

/** Customer problem (Figma 114:2736). */
export const brightcoveBeaconProblem = {
  heading: "section",
  title: "Customer Problem",
  body:
    "Xstream.ly aims to rapidly acquire viewers with their branded app, but the significant development cost hinders its progress. The sheer amount of manual work in curating, publishing, and monetizing video content greatly reduces efficiency.",
} satisfies SimpleSectionData;

/** Key roles (Figma 114:2411): one slide per persona card (2x export of 114:2425). */
export const brightcoveBeaconRoles = {
  label: "There are 3 key roles involved",
  slides: [
    {
      id: "persona-laurel",
      title: "Laurel, Product Manager",
      body: "“I am a trailblazer who takes others with me, like it or not!”",
      image: img(
        "persona-laurel.jpg",
        "Persona card for Laurel, Product Manager at Xstream.ly: current tools, aptitude and altitude, responsibilities, goals, needs and pain points",
        1900, 1108,
      ),
    },
  ],
} satisfies HorizontalSlidesData;

/** Job mapping (Figma 114:2763), over the job map (2x export, cropped). */
export const brightcoveBeaconJobMap = {
  align: "left",
  label: "Job mapping",
  heading: "section",
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
