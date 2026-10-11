import type { IntroData } from "@/components/case-study/templates/IntroTemplate";
import type { SimpleSectionData } from "@/components/case-study/templates/SimpleSectionTemplate";
import type { ImpactData } from "@/components/case-study/templates/ImpactTemplate";

/** Reimagining Analytics intro (Figma 110:18593): hero band export, title, copy and facts. */
export const reimaginingAnalyticsIntro = {
  hero: {
    src: "/case-studies/reimagining-analytics/hero.png",
    alt: "Redesigned Analytics dashboard on a laptop and a phone",
    width: 2560,
    height: 970,
  },
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
} satisfies IntroData & { hero: { src: string; alt: string; width: number; height: number } };

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
