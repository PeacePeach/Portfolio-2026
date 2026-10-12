import type { IntroData } from "@/components/case-study/templates/IntroTemplate";
import type { SimpleSectionData } from "@/components/case-study/templates/SimpleSectionTemplate";
import type { ImpactData } from "@/components/case-study/templates/ImpactTemplate";
import type { NarrativeData } from "@/components/case-study/templates/NarrativeTemplate";
import type { BeforeAfterData } from "@/components/case-study/templates/BeforeAfterTemplate";

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

/** "03 _ DESIGN SYSTEM" (Figma 5NB8dL3E3HQQtXFRcjaKVd 101:274): centred story text, then the three patterns as rolling narrative steps (Figma 135:1472), before over after (2x exports). */
const pattern = (name: string, alt: string, width: number, height: number) => ({
  src: `/case-studies/reimagining-analytics/pattern-${name}.png`, alt, width, height,
  pill: name.endsWith("after") ? { label: "After", emphasis: "primary" as const } : { label: "Before" },
});
export const reimaginingAnalyticsPatternsIntro = {
  title: "From 17 Patterns to 3 Reusable Building Blocks",
  body:
    "I audited the existing Analytics UI and found 17 different design patterns solving overlapping problems. I consolidated them into three reusable patterns—Hero Graphs, Highlight Cards, and Data Tables—reducing cognitive load for users and maintenance cost for engineering.",
} satisfies SimpleSectionData;

export const reimaginingAnalyticsPatterns = {
  label: "Consolidated design patterns",
  imageLayout: "separate",
  steps: [
    {
      id: "hero-graph",
      title: "Hero Graph",
      body: "Displaying critical metrics at the top of the page, associated with a line chart or bar chart to depict changes over the past period.",
      images: [
        pattern("hero-before", "Before: several unrelated metric strips, bar charts and line charts at the top of different Analytics pages", 1418, 374),
        pattern("hero-after", "After: one hero graph with four metric tabs above a line chart, and a comparison state with two series", 1420, 812),
      ],
    },
    {
      id: "highlight-cards",
      title: "Highlight Cards",
      body: "Displaying highlights across a single metric coupled with a dimension (e.g., top 3 videos by views), users can drill down for details.",
      images: [
        pattern("highlight-before", "Before: four differently styled highlight widgets, including a donut chart and ranked lists", 1430, 289),
        pattern("highlight-after", "After: two consistent highlight cards, Best performing posts and Best performing videos, each with bars and a View more link", 1428, 406),
      ],
    },
    {
      id: "data-table",
      title: "Data Table",
      body: "Displaying granular data across a dimension and multiple metrics, users can drill down to a single unit for detailed insights.",
      images: [
        pattern("table-before", "Before: two inconsistent data tables with different columns, thumbnails and progress bars", 1420, 858),
        pattern("table-after", "After: one data table with a summary row and consistent video rows across views, minutes, play rate and completion", 1420, 542),
      ],
    },
  ],
} satisfies NarrativeData;

/** "04 _ ROLE-BASED EXPERIENCE" (Figma 116:891): simple-section story text. */
export const reimaginingAnalyticsRolesIntro = {
  title: "Designing for Roles, Not Averages",
  body:
    "I partnered with a junior designer and ran three rounds of usability testing to combine the new IA and component system into role-based experiences. Testing showed that even people in the same vertical prioritize different metrics, so the system needed a shared structure with tailored starting points.",
} satisfies SimpleSectionData;

const roles = (name: string, alt: string) => ({ src: `/case-studies/reimagining-analytics/roles-${name}.png`, alt });

/** Example task (Figma 116:891 layout, content and 2x images from 25:1364): wide Before / After, no tabs, with the final design as a second row. */
export const reimaginingAnalyticsRoles = {
  size: "wide",
  title: "Example Task: Finding Videos That Generate Leads",
  description: "Role: Campaign Manager",
  before: {
    images: [roles("before", "Before: Analytics opens on generic trend charts and a video table, with lead metrics buried in separate tabs")],
    bullets: [{ tone: "negative", text: "Users can’t find the target metrics after looking through each tab" }],
  },
  after: {
    images: [roles("after", "After: Analytics Overview with headline metrics, a trend chart and best performing videos and pages")],
    bullets: [
      { tone: "positive", text: "Increased task success" },
      { tone: "negative", text: "Avg. 32s task time" },
    ],
  },
  rows: [{
    before: {
      label: "Final design",
      images: [roles("final-overview", "Final design: a marketer’s Analytics Overview leading with lead generation and video likes")],
    },
    after: {
      label: "Final design",
      images: [roles("final-funnel", "Final design: a Funnel view tracing video views to leads and identified viewers")],
      bullets: [{ tone: "positive", text: "Avg. task time decrease to 11s" }],
    },
  }],
} satisfies BeforeAfterData;
