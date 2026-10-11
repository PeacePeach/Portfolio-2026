import { caseStudyType } from "./caseStudyTokens";

export function EvidencePanelHeader({ id, title, description }: { id: string; title: string; description: string }) {
  return <header className="cs-panel-header">
    <h3 id={id} className={caseStudyType.panelTitle}>{title}</h3>
    <p className={caseStudyType.panelDescription}>{description}</p>
  </header>;
}
