/**
 * Figma 67:703 / 110:19032: a 508 px block, Display XS title over Body M copy.
 * A title on its own centres on the block (Figma 110:18656).
 */
export function CaseStudySectionHeader({ id, title, description, className = "" }: { id: string; title: string; description?: string; className?: string }) {
  return <header className={`mx-auto flex w-full max-w-[31.75rem] flex-col gap-3 ${className}`}>
    <h2 id={id} className={`type-display-xs text-[2rem]! font-normal! text-ink ${description ? "" : "text-center"}`}>{title}</h2>
    {description && <p className="type-body-m text-secondary">{description}</p>}
  </header>;
}
