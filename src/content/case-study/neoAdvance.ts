import type { TwoColumnTextData } from "@/components/case-study/templates/TwoColumnTextTemplate";
import type { BeforeAfterData } from "@/components/case-study/templates/BeforeAfterTemplate";

/** First simple Before & After example, Figma 89:3854. */
export const neoAdvanceBeforeAfter = {
  title: "Doorway Testing",
  description: "I used lightweight doorway tests to challenge high-confidence, low-evidence business ideas—validating whether users understood and valued the concept before investing in the full experience.",
  before: {
    label: "Before",
    images: [{ src: "/images/neo/theme-2-tested.png", alt: "Original Advance offer combining a starting limit and a growth goal" }],
    bullets: [{ tone: "negative", text: "Starting limit and growth goal compete for attention" }],
  },
  after: {
    label: "After",
    images: [{ src: "/images/neo/theme-2-explored.png", alt: "Revised offer prioritizing the starting limit before explaining growth" }],
    bullets: [
      { tone: "positive", text: "Clarifies the immediate decision: “What is my starting limit?”" },
      { tone: "negative", text: "A low starting limit can weaken perceived value at activation" },
    ],
  },
} satisfies BeforeAfterData;

/** Figma 89:4106 repeats the Before evidence in the Iterated example. */
export const neoAdvanceBeforeIteratedAfter = {
  ...neoAdvanceBeforeAfter,
  variant: "before-iterated-after",
  iterated: { ...neoAdvanceBeforeAfter.before, label: "Iterated" },
} satisfies BeforeAfterData;

/** Figma 89:4186: two Before images share one pill and one bullet list. */
export const neoAdvanceGroupedBeforeAfter = {
  ...neoAdvanceBeforeAfter,
  variant: "grouped-before-after",
  before: {
    ...neoAdvanceBeforeAfter.before,
    images: [neoAdvanceBeforeAfter.before.images[0], neoAdvanceBeforeAfter.before.images[0]],
    bullets: [neoAdvanceBeforeAfter.before.bullets[0], neoAdvanceBeforeAfter.before.bullets[0]],
  },
} satisfies BeforeAfterData;

export const neoAdvanceTemplateExamples = [
  { id: "simple", label: "Theme 1", data: neoAdvanceBeforeAfter },
  { id: "iterated", label: "Theme 2", data: neoAdvanceBeforeIteratedAfter },
  { id: "grouped", label: "Theme 3", data: neoAdvanceGroupedBeforeAfter },
] satisfies { id: string; label: string; data: BeforeAfterData }[];


const image = (name: string, alt: string, height: number) => ({ src: `/images/neo/${name}.png`, alt, height, width: 200 });
const good = (text: string) => ({ tone: 'positive' as const, text });
const bad = (text: string) => ({ tone: 'negative' as const, text });
const themes = [
  {
    id: '1', title: 'Benchmarkable Decisions → AI-assisted Research',
    description: 'Use AI to quickly scan comparable products, reviews, and patterns when external evidence can resolve the question quickly.',
    groups: [
      { label: 'Before', images: [image('theme-1-tested-primary', 'Tested Advance hub showing available credit and rates', 433), image('theme-1-tested-secondary', 'Tested Advance limit details and growth milestones', 433)], bullets: [good('Optimized for simplicity'), bad('Under-serves immediate user intent'), bad('Hides the product’s long-term value')] },
      { label: 'After', images: [image('theme-1-refined', 'Refined Advance hub with Pay, Use advance, and credit progress', 433)], bullets: [good('Optimized around key user intents'), good('Connects usage with long-term credit value'), bad('Trades simplicity for greater utility')] },
    ],
  },
  {
    id: '2', title: 'Risky Business Assumptions → Doorway Testing',
    description: 'I used lightweight doorway tests to challenge high-confidence, low-evidence business ideas—validating whether users understood and valued the concept before investing in the full experience.',
    groups: [
      { label: 'Before', images: [{ ...image('theme-2-tested', 'Tested starting limit and growth goal competing for attention', 202 * 1808 / 750), width: 202 }], bullets: [bad('Starting limit and growth goal compete for attention')] },
      { label: 'Explored', images: [{ ...image('theme-2-explored', 'Explored starting limit with a slider and steps to grow', 202 * 1808 / 750), width: 202 }], bullets: [good('Clarifies the immediate decision: “What is my starting limit?”'), bad('A low starting limit can weaken perceived value at activation')] },
      { label: 'After', images: [{ ...image('theme-2-refined', 'Refined starting limit separated from the long-term growth goal', 486), width: 202 }], bullets: [good('Separates today’s limit from long-term growth potential'), good('Balances user clarity with business needs')] },
    ],
  },
  {
    id: '3', title: 'Critical Usability Tradeoffs → A/B Usability Testing',
    description: 'I A/B tested three debated interaction areas with 6 recruited users on UserTesting.com, using counterbalanced tasks to reduce ordering bias and objectively resolve decisions where both options had strong internal support.',
    groups: [
      { label: 'Option A', images: [image('theme-3-tested', 'Tested send-money screen with the full transfer calculation', 427)], bullets: [good('Everything on one screen ... and transparent math'), bad('Overwhelming math')] },
      { label: 'Option B', images: [image('theme-3-refined-primary', 'Refined send-money screen clarifying the funding account', 427), { ...image('theme-3-refined-secondary-base', 'Advance coverage explanation layered over the transfer screen', 427), baseHeight: 419, overlay: '/images/neo/theme-3-refined-secondary-overlay.png' }], bullets: [good('It’s more clear on the source of transfer'), bad('Showing the value of the product'), bad('Trades physical friction for lower cognitive load.')] },
    ],
  },
];

/** Section 03, Figma 79:2211. Each tab is configuration for the same renderer. */
export const neoAdvanceValidationThemes = themes.map((theme, index) => {
  const { groups, ...content } = theme;
  const data: BeforeAfterData = index === 1
    ? { ...content, variant: 'before-iterated-after', before: groups[0], iterated: groups[1], after: groups[2] }
    : index === 0
      ? { ...content, variant: 'grouped-before-after', before: { ...groups[0], images: [groups[0].images[0], groups[0].images[1]] }, after: groups[1] }
      : { ...content, variant: 'grouped-before-after', groupedSide: 'after', before: groups[0], after: { ...groups[1], images: [groups[1].images[0], groups[1].images[1]] } };
  return { id: theme.id, label: `Theme ${theme.id}`, data };
});

/** Early discovery: content for the shared two-column text template. */
export const neoAdvanceEarlyDiscovery = {
  columns: [
    {
      label: "WHERE WE WERE STUCK",
      title: "The Chicken-and-Egg Problem",
      body: "Neo Advance was intended to set the pattern for future lending products, but those products were still undefined. During early concept exploration, the team was split between optimizing for launch and designing for the future, blocking decisions on entry points, account IA, and shared patterns.",
    },
    {
      label: "HOW I UNBLOCKED",
      title: "Defined the Lending Platform Template",
      body: "In 2 days, I benchmarked Neo Advance alongside future lending products—term loans, HELOCs, and mortgages—to identify the common platform patterns they would all need. I then translated those patterns into a reusable template for Neo Advance, aligning 3 product leads and 2 founders on account IA, entry points, and core lending experiences.",
    },
  ],
} satisfies TwoColumnTextData;

/** Section 03 story, composed with the same text template as early discovery. */
export const neoAdvanceValidationStory = {
  "columns": [
    {
      "label": "WHERE WE WERE STUCK",
      "title": "Too Late to Test,\nToo Risky Not To",
      "body": "Two weeks before launch, the team was still misaligned on several key decisions. Product and Design wanted a final usability test, but leadership pushed back because testing all 10 flows and 200+ screens would take too long."
    },
    {
      "label": "HOW I UNBLOCKED",
      "title": "Breaking the\nValidation Trap",
      "body": "After a tough leadership discussion, I grouped the open questions by type and matched each with the fastest research method. After a quick stakeholder sync, I ran 3 focused studies in 3 days, giving the team clear evidence to finalize the design."
    }
  ]
} satisfies TwoColumnTextData;
