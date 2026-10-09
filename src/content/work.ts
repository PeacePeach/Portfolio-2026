/**
 * Work page (Figma 21:196): the three ways in, and the filters under each.
 * Filter ids are referenced by Project.tags and Project.powers.
 */
export type WorkView = "case-studies" | "super-powers" | "hanxgpt";

export type WorkFilter = { id: string; label: string };

export const workViews: { id: WorkView; label: string; icon: "grid" | "radio" | "message-circle" }[] = [
  { id: "case-studies", label: "Case studies", icon: "grid" },
  { id: "super-powers", label: "Super powers", icon: "radio" },
  { id: "hanxgpt", label: "HanXGPT", icon: "message-circle" },
];

export const defaultWorkView: WorkView = "case-studies";

export function isWorkView(v: string | null | undefined): v is WorkView {
  return workViews.some((w) => w.id === v);
}

/** Case study filters; "All" is added by the UI. */
export const caseStudyFilters: WorkFilter[] = [
  { id: "fintech", label: "Fintech" },
  { id: "ai", label: "AI" },
  { id: "b2b-saas", label: "B2B SaaS" },
  { id: "insights-analytics", label: "Insights & Analytics" },
  { id: "design-system", label: "Design system" },
];

export const superPowerFilters: WorkFilter[] = [
  { id: "untangle-complexity", label: "Untangle complexity" },
  { id: "navigate-ambiguity", label: "Navigate ambiguity" },
  { id: "set-people-up", label: "Set people for success" },
  { id: "smart-research", label: "Smart research" },
  { id: "ai-assisted-design", label: "AI-assisted design" },
];

export const workCopy = {
  heading: "Get to know me by",
  hanxgpt: "HanXGPT is on its way.",
  empty: "Nothing matches these filters yet.",
  fragment: {
    case: { label: "Case Fragments", action: "View case studies" },
    story: { label: "Story", action: "View full" },
  },
};
