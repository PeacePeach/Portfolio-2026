import type { ReactNode } from "react";
import { caseStudyType } from "./caseStudyTokens";

/** `text` replaces the title and description with any component; the header keeps its spacing. */
export function EvidencePanelHeader({ id, title, description, text }: { id: string; title: string; description: string; text?: ReactNode }) {
  if (text) return <header id={id} aria-label={title} className="cs-panel-header">{text}</header>;
  return <header className="cs-panel-header">
    <h3 id={id} className={caseStudyType.panelTitle}>{title}</h3>
    <p className={caseStudyType.panelDescription}>{description}</p>
  </header>;
}
