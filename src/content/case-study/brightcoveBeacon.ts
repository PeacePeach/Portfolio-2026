import type { ImageRef } from "@/content/types";
import type { IntroData } from "@/components/case-study/templates/IntroTemplate";
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
