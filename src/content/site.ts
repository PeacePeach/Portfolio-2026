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
    "Product Design Lead with 10+ years across fintech and B2B SaaS, turning ambiguity and complexity into clear product direction for users and businesses.",
  email: "hello@example.com",

  /** Opening loader. Each word's first letter stays and forms the logo. */
  loader: {
    enabled: true,
    /** One entry per line. */
    lines: ["Han", "Xu"],
  },

  nav: [
    { label: "Work", href: "/#explore" },
    { label: "About", href: "/about" },
    // Placeholder until the resume file is added (e.g. /public/resume.pdf).
    { label: "Resume", href: "/resume" },
  ],

  hero: {
    /** One entry per line. */
    statement: ["Designing", "for", "complexity"],
    /** Which line the supporting copy sits beside on desktop. */
    asideLine: 1,
    description:
      "Product Design Lead with 10+ years across fintech and B2B SaaS, turning ambiguity and complexity into clear product direction for users and businesses.",
  },

  /** Panel right of the headline (Figma 2:31, hover 2:134). */
  knowMe: {
    heading: "Get to know me by",
    options: [
      { label: "Case Studies", hint: "Traditional way to get started", href: "/?view=project#explore", view: "project" },
      { label: "Super Powers", hint: "Something different", href: "/?view=capability#explore", view: "capability" },
      // Placeholder page until HanXGPT exists.
      { label: "HanXGPT", hint: "Something more different", href: "/hanxgpt", view: null },
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
