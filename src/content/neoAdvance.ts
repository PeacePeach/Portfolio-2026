/** Neo Advance case study intro (Figma 51:24883), Han's own copy. */
export const neoAdvanceIntro = {
  title: "Neo Advance",
  paragraphs: [
    "Neo Advance sat between overdraft, cash advance, and credit building — without an established product model for any of them to follow.",
    "I led the experience from early ambiguity through launch, defining how the product should work across banking, lending, lifecycle, and collections while guiding a two-designer team through the highest-risk decisions.",
    "The result was a system customers could understand, teams could build against, and the business could evolve over time.",
  ],
  facts: [
    { label: "Duration", items: ["4 months"] },
    { label: "Platform", items: ["IOS", "Android", "Web"] },
    { label: "Type", items: ["0→1 product", "B2C Fintech", "Cross-product system"] },
    {
      label: "Role",
      items: ["Design lead", "Product Strategy", "User research", "Interaction Design", "Design execution"],
    },
  ],
} as const;

/**
 * "How Neo Advance Works?" (Figma 68:712): three steps, each a caption over a
 * flow recording (animated GIFs exported from Figma).
 */
export const neoAdvanceHow: {
  title: string;
  steps: { caption: string; alt: string; src: string }[];
} = {
  title: "How Neo Advance Works?",
  steps: [
    {
      caption: "Use Advance when a chequing balance falls short.",
      alt: "Neo app flow: drawing an advance when the chequing balance runs short",
      src: "/case-studies/neo-advance/how-use-advance.gif",
    },
    {
      caption: "Pay Advance when balance is due, with payment options.",
      alt: "Neo app flow: repaying an advance and choosing a payment option",
      src: "/case-studies/neo-advance/how-pay.gif",
    },
    {
      caption: "Build credit when use, repay, and grow with Advance.",
      alt: "Neo app flow: building credit by using, repaying and growing the advance limit",
      src: "/case-studies/neo-advance/how-build-credit.gif",
    },
  ],
};

/** "What the new model made possible" (Figma 67:703), Han's own beta and projection figures. */
export const neoAdvanceImpact = {
  title: "What the new model made possible",
  subtitle:
    "A clearer product model translated into stronger adoption, higher conversion, and a scalable revenue path.",
  cards: [
    {
      icon: "users",
      value: "32%",
      label: "Activation",
      body: "32% of 1,208 beta customers opted into Neo Advance within the first 2 months",
    },
    {
      icon: "refresh",
      value: "2.8x",
      label: "New booked users",
      body: "Neo Advance increased booked users from 20 to 56 per 100 applicants based on beta results.",
    },
    {
      icon: "task",
      value: "~$3.5M",
      label: "Projected 2-year revenue",
      body: "Across membership, usage fees, and downstream credit conversion at scale.",
    },
  ],
} as const;

/** Local production exports; full-size images are mounted only by the viewer. */
export const neoAdvanceNarrative = [
  {
    id: "research-insights",
    title: "What Users Revealed",
    subtitle: "We tested the assumptions shaping the product and used what we learned to define clearer system rules.",
    alt: "Research hypotheses compared with what users revealed about credit reporting, balances and overdraft.",
    width: 2200, height: 1322, fullWidth: 3600, fullHeight: 2163,
  },
  {
    id: "lending-journeys",
    title: "Lending Journeys",
    subtitle: "Same journey spine, different behaviours by loan structure.",
    alt: "Demand, term and revolving lending journeys compared across discovery, application, access, repayment and risk.",
    width: 2200, height: 1313, fullWidth: 3600, fullHeight: 2149,
  },
  {
    id: "account-ia",
    title: "Account IA",
    subtitle: "A shared account framework, adapted to each loan structure.",
    alt: "Neo Advance, personal loan and HELOC account screens aligned to a shared information architecture.",
    width: 2200, height: 2150, fullWidth: 3600, fullHeight: 3518,
  },
  {
    id: "payment-framework",
    title: "Payment Framework",
    subtitle: "A shared framework for different ways to pay.",
    alt: "Shared payment screens and adaptations for Neo-funded payments, commitments to pay and settlements.",
    width: 2200, height: 1042, fullWidth: 3600, fullHeight: 1704,
  },
] as const;

/** Figma 79:1979, exported at 2x as one image. */
export const neoAdvanceJourneyMap = {
  label: "End-to-end credit journey",
  src: "/images/neo/credit-journey.webp",
  alt: "End-to-end Neo Advance journey across marketing channels, profile creation, credit onboarding, Advance activation and use, marking which screens were refined, new, removed or unchanged, with notes on the key refinements.",
  width: 4628, height: 1720,
} as const;

/** Figma 94:5545: final delivery, 2x exports. Each group's text stays pinned beside its screens (two staggered columns). */
const screen = (id: string, alt: string, height = 493) => ({ src: `/images/neo/final/${id}.png`, alt, width: 231, height });
export const neoAdvanceFinalDelivery = [
  {
    id: "core-advance",
    title: "Core Advance Experience",
    body: "I set the core interaction model and led a two-designer team through the highest-risk flows, personally owning the key paths from access to repayment.",
    columns: [
      [
        screen("use-advance", "Use advance sheet listing ways to use Neo Advance: pay a bill, linked bank account, Interac e-Transfer and card spending"),
        screen("advance-cover", "Neo Advance will cover you: transfer breakdown from chequing and advance with the convenience fee"),
      ],
      [
        screen("send-money", "Send money screen showing $65 available to transfer with Neo Advance"),
        screen("transfer-success", "Transfer successful, with the chequing balance and amount owed on Neo Advance"),
      ],
    ],
  },
  {
    id: "payment-flow",
    title: "Payment Flow",
    body: "I partnered with Product and Engineering to define the end-to-end payment flow across initiation, review, completion, and edge cases, while keeping the experience consistent with the broader Advance model.",
    columns: [
      [
        screen("overdue-home", "Home screen flagging an overdue advance payment with a view options action", 554),
        screen("split-balance", "Split the balance with Neo: choose a payment date and amount, and how it works", 554),
      ],
      [
        screen("catch-up-options", "Explore ways to catch up faster: split the balance with Neo or pay what you can now", 554),
        screen("payment-options", "Your payment options: catch up on what you owe or settle your balance for less", 554),
      ],
    ],
  },
  {
    id: "credit-progression",
    title: "Credit Progression System",
    body: "I defined the lifecycle framework for eligibility, limit growth, and ongoing use, then reviewed execution across teams to keep 200+ screens coherent.",
    columns: [
      [
        screen("limit-offer-home", "Home screen offering a higher advance limit for a limited time"),
        screen("credit-progress", "Path to $300: current limit progress and tasks that grow the limit"),
      ],
      [screen("limit-unlocked", "You've unlocked a higher limit, with accept and decline actions")],
    ],
  },
] as const;
