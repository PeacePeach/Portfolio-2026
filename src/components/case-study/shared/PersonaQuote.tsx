import Image from "next/image";
import { caseStudyType } from "./caseStudyTokens";

export type PersonaQuoteData = { name: string; avatar: string; quote: string };

/**
 * Figma 43:348: a 48px persona avatar over its name (one word per line, as wide as the longest), 12px beside the persona's quote.
 * Made for template `text` slots (e.g. HorizontalSlidesTemplate slides).
 */
export function PersonaQuote({ name, avatar, quote }: PersonaQuoteData) {
  return <figure className="flex items-center gap-3">
    <figcaption className="flex w-min shrink-0 flex-col items-start gap-2 text-left [overflow-wrap:normal]">
      <Image src={avatar} alt="" width={48} height={48} className="size-12 rounded-full" />
      <span className={`${caseStudyType.chapterLabel} uppercase`}>{name}</span>
    </figcaption>
    <blockquote className={`${caseStudyType.quote} min-w-0 text-(--cs-primary)`}>{quote}</blockquote>
  </figure>;
}
