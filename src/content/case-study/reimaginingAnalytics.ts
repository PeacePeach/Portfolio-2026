import type { IntroData } from "@/components/case-study/templates/IntroTemplate";
import type { SimpleSectionData } from "@/components/case-study/templates/SimpleSectionTemplate";
import type { ImpactData } from "@/components/case-study/templates/ImpactTemplate";
import type { NarrativeData } from "@/components/case-study/templates/NarrativeTemplate";

/** Reimagining Analytics intro (Figma 110:18593): title, copy and facts. The hero is AnalyticsHero. */
export const reimaginingAnalyticsIntro = {
  title: "Reimagining Analytics",
  paragraphs: [
    "I led the redesign of the Analytics module, a platform feature across multiple products and verticals, resulting in a significant increase in key business metrics.",
  ],
  facts: [
    { label: "Duration", items: ["4 weeks"] },
    { label: "Platform", items: ["Desktop", "Mobile"] },
    { label: "Type", items: ["1-N product", "B2B", "Analytics", "Design System"] },
    { label: "Role", items: ["Design lead", "User research", "UX strategy", "Design execution"] },
  ],
} satisfies IntroData;

/** "Reframing Analytics Around User Decisions" (Figma 110:18922): simple section, before/after variant. */
export const reimaginingAnalyticsReframing = {
  variant: "before-after",
  title: "Reframing Analytics Around User Decisions",
  body:
    "I led the redesign across desktop and mobile, turning a fragmented reporting experience into a clearer, scalable analytics system that could work across products and verticals.",
  before: {
    images: [{ src: "/case-studies/reimagining-analytics/before.png", alt: "Analytics before the redesign: a single bar chart over a dense data table" }],
  },
  after: {
    images: [{ src: "/case-studies/reimagining-analytics/after.png", alt: "Analytics Overview after the redesign: headline metrics, a trend chart and top-performing lists" }],
  },
} satisfies SimpleSectionData;

/** "Impact" (Figma 110:18653). */
export const reimaginingAnalyticsImpact = {
  title: "Impact",
  cards: [
    { icon: "users", value: "32%", label: "Monthly active users", body: "Monthly active users for Analytics increased 32% within three months of launch." },
    { icon: "export", value: "24%", label: "Report exports", body: "Analytics report exports increased 24% within three months of launch." },
    { icon: "task", value: "87", label: "Satisfaction score", body: "A post-launch survey of 65 users produced an 87 satisfaction score." },
  ],
} satisfies ImpactData;

/** "01 _ PROBLEM" (Figma 116:667): one static text block beside two separate image cards (2x exports of 138:1547, 138:1614). */
export const reimaginingAnalyticsProblem = {
  label: "One Analytics feature, many different jobs",
  imageLayout: "separate",
  steps: [{
    id: "problem",
    title: "One Analytics Feature, Many Different Jobs",
    body:
      "Analytics served more than 10K users across marketing, video streaming, and corporate communication. Yet fewer than 25% of monthly active users engaged with it, and 27% of churned customers cited Analytics as a reason for leaving. Interviews showed the root issue: one generic structure was forcing very different roles to hunt for very different metrics.",
    images: [
      { src: "/case-studies/reimagining-analytics/context-map.png", alt: "Cross-product context map: Analytics sits inside every product across Marketing, Corporate Communication and Video Streaming", width: 2560, height: 1292 },
      { src: "/case-studies/reimagining-analytics/role-needs.png", alt: "Role-specific metric needs: what a campaign manager, video producer and HR coordinator can't find, takes time to find, need manual effort for, or are distracted by", width: 2558, height: 1472 },
    ],
  }],
} satisfies NarrativeData;
