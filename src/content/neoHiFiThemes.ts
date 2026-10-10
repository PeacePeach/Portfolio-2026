/** Semantic local exports. Comparison composites are reference-only. */
export type NeoThemeImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type NeoThemeFrame = {
  width: number;
  height: number;
  layers: readonly NeoThemeImage[];
};

export type NeoThemeState = {
  label: "Tested" | "Explored" | "Refined";
  frames: readonly NeoThemeFrame[];
  bullets: readonly { kind: "positive" | "negative"; text: string }[];
};

export type NeoHiFiTheme = {
  id: string;
  tab: string;
  label: string;
  title: string;
  description: string;
  states: readonly NeoThemeState[];
};

const image = (name: string, width: number, height: number, alt: string): NeoThemeImage => ({
  src: `/images/neo/${name}.png`, width, height, alt,
});
const frame = (name: string, width: number, height: number, alt: string): NeoThemeFrame => ({
  width, height, layers: [image(name, width, height, alt)],
});

export const neoHiFiThemes: readonly NeoHiFiTheme[] = [
  {
    id: "theme-1",
    tab: "Theme 1",
    label: "Theme 1 — Benchmarkable Decisions",
    title: "AI-assisted benchmark research",
    description: "Use AI to quickly scan comparable products, reviews, and patterns when external evidence can resolve the question quickly.",
    states: [
      {
        label: "Tested",
        frames: [
          frame("theme-1-tested-primary", 750, 1624, "Tested Neo Advance account overview"),
          frame("theme-1-tested-secondary", 750, 1624, "Tested advance limit details and growth guidance"),
        ],
        bullets: [
          { kind: "positive", text: "Optimized for simplicity" },
          { kind: "negative", text: "Under-serves immediate user intent" },
          { kind: "negative", text: "Hides the product’s long-term value" },
        ],
      },
      {
        label: "Refined",
        frames: [frame("theme-1-refined", 200, 433, "Refined Neo Advance account overview")],
        bullets: [
          { kind: "positive", text: "Optimized around key user intents" },
          { kind: "positive", text: "Connects usage with long-term credit value" },
          { kind: "negative", text: "Trades simplicity for greater utility" },
        ],
      },
    ],
  },
  {
    id: "theme-2",
    tab: "Theme 2",
    label: "Theme 2 — Risky Business Assumptions",
    title: "Doorway Testing",
    description: "I used lightweight doorway tests to challenge high-confidence, low-evidence business ideas—validating whether users understood and valued the concept before investing in the full experience.",
    states: [
      {
        label: "Tested",
        frames: [frame("theme-2-tested", 750, 1808, "Tested starting limit and advance limit goal")],
        bullets: [{ kind: "negative", text: "Starting limit and growth goal compete for attention" }],
      },
      {
        label: "Explored",
        frames: [frame("theme-2-explored", 750, 1808, "Explored starting limit and growth guidance")],
        bullets: [
          { kind: "positive", text: "Clarifies the immediate decision: “What is my starting limit?”" },
          { kind: "negative", text: "A low starting limit can weaken perceived value at activation" },
        ],
      },
      {
        label: "Refined",
        frames: [frame("theme-2-refined", 750, 1806, "Refined starting limit separated from long-term growth")],
        bullets: [
          { kind: "positive", text: "Separates today’s limit from long-term growth potential" },
          { kind: "positive", text: "Balances user clarity with business needs" },
        ],
      },
    ],
  },
  {
    id: "theme-3",
    tab: "Theme 3",
    label: "Theme 3 — Critical Usability Tradeoffs",
    title: "A/B Usability Testing",
    description: "I A/B tested three debated interaction areas with 6 recruited users on UserTesting.com, using counterbalanced tasks to reduce ordering bias and objectively resolve decisions where both options had strong internal support.",
    states: [
      {
        label: "Tested",
        frames: [frame("theme-3-tested", 400, 854, "Tested transfer confirmation with the full payment breakdown")],
        bullets: [
          { kind: "positive", text: "Everything on one screen ... and transparent math" },
          { kind: "negative", text: "Overwelming math" },
        ],
      },
      {
        label: "Refined",
        frames: [
          frame("theme-3-refined-primary", 750, 1600, "Refined transfer screen clarifying the source of funds"),
          {
            width: 750, height: 1600,
            layers: [
              image("theme-3-refined-secondary-base", 750, 1574, "Underlying transfer review screen"),
              image("theme-3-refined-secondary-overlay", 750, 1600, "Refined confirmation explaining how Neo Advance covers the transfer"),
            ],
          },
        ],
        bullets: [
          { kind: "positive", text: "It’s more clear on the source of transfer" },
          { kind: "positive", text: "Showing the value of the product" },
          { kind: "negative", text: "Trades physical friction for lower cognitive load." },
        ],
      },
    ],
  },
];
