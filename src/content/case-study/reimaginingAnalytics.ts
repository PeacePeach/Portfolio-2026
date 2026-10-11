import type { IntroData } from "@/components/case-study/templates/IntroTemplate";

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
