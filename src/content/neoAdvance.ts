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
