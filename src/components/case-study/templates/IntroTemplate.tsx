import type { ReactNode } from "react";
import { CaseStudyTextReveal } from "../shared/CaseStudyMotion";

export type IntroFact = { label: string; items: readonly string[] };

export type IntroData = {
  title: string;
  paragraphs: readonly string[];
  facts: readonly IntroFact[];
};

/** Wraps each of the three parts (title, copy, facts) in order; defaults to the case-study text reveal. */
type IntroReveal = (index: number, children: ReactNode) => ReactNode;

const scrollReveal: IntroReveal = (index, children) => <CaseStudyTextReveal index={index}>{children}</CaseStudyTextReveal>;

/**
 * Figma 83:3038 / 51:24883. Structure only: a 720 px block centred on the page,
 * title and copy at left, facts at right, 128 px below the hero. Callers own the hero.
 */
export function IntroTemplate({ title, paragraphs, facts, reveal = scrollReveal }: IntroData & { reveal?: IntroReveal }) {
  return <div className="mx-auto flex max-w-[45rem] flex-col pt-32 gap-12 md:flex-row md:justify-between md:gap-10">
    <div className="max-w-[29.875rem]">
      {reveal(0, <h1 className="type-display-m">{title}</h1>)}
      {reveal(1, <div className="mt-6 flex flex-col gap-6 type-body-m">
        {paragraphs.map((p) => <p key={p}>{p}</p>)}
      </div>)}
    </div>
    {reveal(2, <dl className="flex flex-wrap gap-x-12 gap-y-8 md:mt-[1.0625rem] md:w-[8.9375rem] md:flex-col md:flex-nowrap">
      {facts.map((f) => <div key={f.label} className="flex flex-col">
        <dt className="mb-1 type-label-s text-primary">{f.label}</dt>
        {f.items.map((item, i) => <dd key={i} className="type-body-s text-secondary">{item}</dd>)}
      </div>)}
    </dl>)}
  </div>;
}
