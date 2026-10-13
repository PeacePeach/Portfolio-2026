import type { CSSProperties, ReactNode } from "react";
import { caseStudyTokens, caseStudyWideEvidenceTokens } from "./caseStudyTokens";

export type EvidenceLayout = "before-after" | "before-iterated-after" | "grouped-before-after";

/** Content width of one layout, from the case-study tokens; the header, tabs and columns share it. */
export function evidenceContentWidth(layout: EvidenceLayout, pairWidth?: number) {
  if (layout === "before-iterated-after") return "calc(var(--cs-image-width) * 3 + var(--cs-column-gap) * 2)";
  if (layout === "grouped-before-after") return `calc(${pairWidth ? `${pairWidth}px` : "var(--cs-pair-image-width)"} * 2 + var(--cs-image-width) + var(--cs-image-pair-gap) + var(--cs-column-gap))`;
  return "calc(var(--cs-image-width) * 2 + var(--cs-column-gap))";
}

/**
 * No surface chrome: content sits on the page background. Small tabs (`navigation`) sit on the content's
 * left edge, 32px above the title; `contentWidth` keeps them still when tabs have different layouts.
 * Without tabs there is nothing to swap, so the fixed min height drops out.
 */
export function EvidencePanelShell({ children, navigation, labelledBy, contentId, activeTabId, layout = "before-after", groupedSide, pairWidth, size, contentWidth }: { children: ReactNode; navigation?: ReactNode; labelledBy: string; contentId?: string; activeTabId?: string; layout?: EvidenceLayout; groupedSide?: "before" | "after"; pairWidth?: number; size?: "wide"; contentWidth?: string }) {
  return <section aria-labelledby={labelledBy} className="cs-rules cs-panel" data-layout={layout} data-grouped-side={groupedSide} data-size={size} style={{ ...caseStudyTokens, ...(size === "wide" ? caseStudyWideEvidenceTokens : {}), ...(navigation ? {} : { "--cs-panel-min-height": "auto" }), ...(pairWidth ? { "--cs-pair-image-width": `${pairWidth}px` } : {}), "--cs-content-width": contentWidth ?? evidenceContentWidth(layout, pairWidth) } as CSSProperties}>
    <div className="cs-panel-content">
      {navigation && <div className="cs-panel-nav">{navigation}</div>}
      <div id={contentId} role={activeTabId ? "tabpanel" : undefined} aria-labelledby={activeTabId} tabIndex={activeTabId ? 0 : undefined}>{children}</div>
    </div>
  </section>;
}
