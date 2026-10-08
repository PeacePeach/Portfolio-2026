import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { site } from "@/content/site";
import { typeStyles } from "@/design/typography";

export const metadata: Metadata = { title: `Typography — ${site.name}`, robots: { index: false } };

/** Specimen of the semantic type styles. Not linked from the site. */
export default function TypographyPage() {
  return (
    <>
      <Header />
      <main id="main" className="container-page pt-[calc(var(--spacing-header)+3rem)] pb-section">
        <h1 className="type-display-m">Typography</h1>
        <p className="mt-4 max-w-[60ch] type-body-m text-ink-muted">
          Semantic type styles from the Figma type spec. Components use the type-* classes only.
        </p>
        <ul className="mt-16 divide-y divide-line border-y border-line">
          {typeStyles.map((s) => (
            <li key={s.token} className="grid gap-4 py-8 md:grid-cols-[16rem_1fr]">
              <div className="space-y-1">
                <p className="type-label-s">{s.token}</p>
                <p className="type-body-xs text-ink-muted">Figma: {s.figma}</p>
                <p className="type-body-xs text-ink-muted">{s.spec}</p>
                <p className="type-body-xs text-ink-faint">{s.use}</p>
              </div>
              <p className={`${s.token} min-w-0 break-words`}>Designing for complexity</p>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
