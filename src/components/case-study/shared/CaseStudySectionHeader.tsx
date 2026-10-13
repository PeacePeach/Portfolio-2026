/**
 * Figma 67:703 / 110:19032: a 508 px block, Display XS title over Body M copy.
 * A title on its own centres on the block (Figma 110:18656).
 */
export function CaseStudySectionHeader({ id, title, description, className = "" }: { id: string; title: string; description?: string | readonly string[]; className?: string }) {
  // Several paragraphs sit one blank Body M line (24 px) apart (Figma AI-Portfolio 176:4574).
  const paragraphs = typeof description === "string" ? [description] : description;
  return <header className={`mx-auto flex w-full max-w-[31.75rem] flex-col gap-3 ${className}`}>
    <h2 id={id} className={`type-display-xs text-[2rem]! font-normal! text-ink ${paragraphs?.length ? "" : "text-center"}`}>{title}</h2>
    {paragraphs?.length ? <div className="flex flex-col gap-6 type-body-m text-secondary">{paragraphs.map((p) => <p key={p}>{p}</p>)}</div> : null}
  </header>;
}
