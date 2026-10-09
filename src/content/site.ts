/**
 * Site-wide copy. Everything here is placeholder and safe to edit.
 */
export const site = {
  name: "Han Xu",
  /** Header logo; the loader collapses the name into it. */
  shortName: "HX",
  role: "Product Design Lead",
  title: "Han Xu — Product Design Lead",
  description:
    "Product Design Lead with 10+ years across fintech and B2B SaaS. I turn ambiguity into momentum through clarity, alignment, and evidence.",
  email: "hello@example.com",

  /** Opening loader. Each word's first letter stays and forms the logo. */
  loader: {
    enabled: true,
    /** One entry per line. */
    lines: ["Han", "Xu"],
  },

  nav: [
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
    // Placeholder until the resume file is added (e.g. /public/resume.pdf).
    { label: "Resume", href: "/resume" },
  ],

  hero: {
    /** One entry per line. */
    statement: ["From", "ambiguity", "to", "momentum"],
    /** Which line the supporting copy sits beside on desktop. */
    asideLine: 2,
    description:
      "Product Design Lead with 10+ years across fintech and B2B SaaS. I turn ambiguity into momentum through clarity, alignment, and evidence.",
  },

  /** Panel right of the headline (Figma 2:31, hover 2:134). */
  knowMe: {
    heading: "Get to know me by",
    options: [
      { label: "Case studies", hint: "Traditional way to get started", href: "/work?view=case-studies" },
      { label: "Super powers", hint: "Something different", href: "/work?view=super-powers" },
      { label: "HanXGPT", hint: "Something more different", href: "/work?view=hanxgpt" },
    ],
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
