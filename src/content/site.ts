/**
 * Site-wide copy. Everything here is placeholder and safe to edit.
 */
export const site = {
  name: "Han Xu",
  /** Header wordmark, e.g. first name + last initial. */
  shortName: "Han X.",
  role: "Product Design Leadership",
  title: "Han Xu — Product Design Leadership",
  description: "Making complex products and systems understandable, useful, and meaningful.",
  email: "hello@example.com",

  /** Opening loader. The name collapses to its initials and final period. */
  loader: {
    enabled: true,
    name: "Han Xu.",
  },

  nav: [{ label: "Work", href: "/#explore" }],
  cta: { label: "Get in touch", href: "/#contact" },

  hero: {
    /** One entry per line. `indent` is in em of the headline size. */
    statement: [
      { text: "Designing", indent: 0.9 },
      { text: "for", indent: 0.9 },
      { text: "complexity.", indent: 0 },
    ],
    /** Which line the supporting copy sits beside on desktop. */
    asideLine: 1,
    description: "Making complex products and systems understandable, useful, and meaningful.",
    index: "01 // 02",
    scrollLabel: "Scroll",
    scrollButtonLabel: "Scroll to Explore my work",
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
