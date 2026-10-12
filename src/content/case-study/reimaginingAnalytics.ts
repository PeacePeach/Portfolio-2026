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

/** "02 _ UX STRATEGY" (Figma 116:714): two rolling steps beside separate cards (2x exports of 140:2183, 140:2235). */
export const reimaginingAnalyticsStrategy = {
  label: "UX strategy",
  imageLayout: "separate",
  steps: [
    {
      id: "okrs",
      title: "Mapping UX Back to Business",
      body:
        "With the PM, I used OKRs to translate a broad engagement problem into measurable outcomes, three value propositions, and three UX goals the team could design and test against.",
      images: [{
        src: "/case-studies/reimagining-analytics/okr-map.png",
        alt: "OKR map: the business objective to increase engagement with analytics, three key results, the value props Efficient, Consistent and Purposeful, and three UX goals: findability, cohesive patterns and role-based surfaces",
        width: 1404, height: 822,
      }],
    },
    {
      id: "findability",
      title: "Proving Findability Before Rebuilding the UI",
      body:
        "With the PM, I used OKRs to translate a broad engagement problem into measurable outcomes, three value propositions, and three UX goals the team could design and test against.",
      images: [{
        src: "/case-studies/reimagining-analytics/tree-test.png",
        alt: "Tree test of three navigation structures for finding leads from the last 28 days: average task success rose from 54% to 76% to 87%, and task time fell from 68s to 42s to 12s",
        width: 1404, height: 802,
      }],
    },
  ],
} satisfies NarrativeData;

/** "UX goal 2" (Figma 5NB8dL3E3HQQtXFRcjaKVd 101:274): story text, then one before/after simple section per pattern (2x exports). */
const pattern = (name: string) => `/case-studies/reimagining-analytics/pattern-${name}.png`;
export const reimaginingAnalyticsPatterns = {
  intro: {
    label: "UX GOAL 2",
    title: "Consolidating Design Patterns",
    body:
      "I audited existing components, identifying 17 design patterns in the Analytics module. I simplified them into three categories, reducing both visual complexity for users and maintenance effort for developers.",
  },
  sections: [
    {
      variant: "before-after",
      title: "Hero Graph",
      body: "Displaying critical metrics at the top of the page, associated with a line chart or bar chart to depict changes over the past period.",
      before: { images: [{ src: pattern("hero-before"), alt: "Before: several unrelated metric strips, bar charts and line charts at the top of different Analytics pages" }] },
      after: { images: [{ src: pattern("hero-after"), alt: "After: one hero graph with four metric tabs above a line chart, and a comparison state with two series" }] },
    },
    {
      variant: "before-after",
      title: "Highlight Cards",
      body: "Displaying highlights across a single metric coupled with a dimension (e.g., top 3 videos by views), users can drill down for details.",
      before: { images: [{ src: pattern("highlight-before"), alt: "Before: four differently styled highlight widgets, including a donut chart and ranked lists" }] },
      after: { images: [{ src: pattern("highlight-after"), alt: "After: two consistent highlight cards, Best performing posts and Best performing videos, each with bars and a View more link" }] },
    },
    {
      variant: "before-after",
      title: "Data Table",
      body: "Displaying granular data across a dimension and multiple metrics, users can drill down to a single unit for detailed insights.",
      before: { images: [{ src: pattern("table-before"), alt: "Before: two inconsistent data tables with different columns, thumbnails and progress bars" }] },
      after: { images: [{ src: pattern("table-after"), alt: "After: one data table with a summary row and consistent video rows across views, minutes, play rate and completion" }] },
    },
  ],
} satisfies { intro: SimpleSectionData; sections: readonly SimpleSectionData[] };
