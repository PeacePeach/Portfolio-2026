import type { ReactNode } from "react";
import { CaseStudyTextReveal } from "../shared/CaseStudyMotion";

export type IntroFact = { label: string; items: readonly string[] };

export type IntroData = {
  /** Optional small all-caps line 12 px above the title (Figma AI-Portfolio 174:3204). */
  eyebrow?: string;
  title: string;
  paragraphs: readonly string[];
  /** Omit or leave empty for no facts column. */
  facts?: readonly IntroFact[];
  /** `center` (default): the 720 px block centred. `left`: title and copy, 647 px wide, on the page's left edge (Figma 174:3199). */
  align?: "center" | "left";
};

/** Wraps each of the three parts (title, copy, facts) in order; defaults to the case-study text reveal. */
type IntroReveal = (index: number, children: ReactNode) => ReactNode;

const scrollReveal: IntroReveal = (index, children) => <CaseStudyTextReveal index={index}>{children}</CaseStudyTextReveal>;

/**
 * Figma 83:3038 / 51:24883. Structure only: a 720 px block centred on the page,
 * title and copy at left, facts at right, 128 px below the hero. Callers own the hero.
 * `align: "left"` (Figma 174:3199) puts a 647 px title and copy block on the page's left edge.
 */
export function IntroTemplate({ eyebrow, title, paragraphs, facts = [], align = "center", reveal = scrollReveal }: IntroData & { reveal?: IntroReveal }) {
  const left = align === "left";
  return <div className={`flex flex-col pt-32 gap-12 md:flex-row md:justify-between md:gap-10 ${left ? "max-w-[40.4375rem]" : "mx-auto max-w-[45rem]"}`}>
    <div className={left ? undefined : "max-w-[29.875rem]"}>
      {reveal(0, <>
        {eyebrow && <p className="mb-3 type-body-xs uppercase text-secondary">{eyebrow}</p>}
        <h1 className="type-display-m">{title}</h1>
      </>)}
      {reveal(1, <div className="mt-6 flex flex-col gap-6 type-body-m">
        {paragraphs.map((p) => <p key={p}>{p}</p>)}
      </div>)}
    </div>
    {facts.length > 0 && reveal(2, <dl className="flex flex-wrap gap-x-12 gap-y-8 md:mt-[1.0625rem] md:w-[8.9375rem] md:flex-col md:flex-nowrap">
      {facts.map((f) => <div key={f.label} className="flex flex-col">
        <dt className="mb-1 type-label-s text-primary">{f.label}</dt>
        {f.items.map((item, i) => <dd key={i} className="type-body-s text-secondary">{item}</dd>)}
      </div>)}
    </dl>)}
  </div>;
}
