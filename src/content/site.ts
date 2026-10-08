/**
 * Site-wide copy. Everything here is placeholder and safe to edit.
 */
export const site = {
  name: "Han",
  role: "Product Design Leadership",
  title: "Han — Product Design Leadership",
  description: "Making complex products and systems understandable, useful, and meaningful.",
  email: "hello@example.com",

  nav: [
    { label: "Work", href: "/#explore" },
    { label: "Contact", href: "/#contact" },
  ],

  hero: {
    /** Each array item renders on its own line. */
    statement: ["Designing", "for", "complexity."],
    description: "Making complex products and systems understandable, useful, and meaningful.",
    scrollLabel: "Explore work",
  },

  explore: {
    title: "Explore my work",
    intro: "Two ways in. Follow a whole project, or follow a skill across projects.",
  },

  footer: {
    heading: "Let’s talk.",
    links: [
      { label: "LinkedIn", href: "#" },
      { label: "Read.cv", href: "#" },
    ],
  },

  /** Show a small "placeholder" tag on content whose status is placeholder. */
  showPlaceholderLabels: true,
} as const;
