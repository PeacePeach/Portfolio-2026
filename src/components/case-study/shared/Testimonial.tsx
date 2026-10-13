import { AccentBar } from "./AccentBar";

export type TestimonialData = { quote: string; author: string; href?: string };

/** Figma AI-Portfolio 176:4579: accent bar beside the quote (case-study quote style) and its author, 12 px below. */
export function Testimonial({ quote, author, href }: TestimonialData) {
  return <figure className="flex gap-3">
    <AccentBar />
    <div className="flex flex-col gap-3 type-body-m-italic">
      <blockquote className="text-primary">{quote}</blockquote>
      <figcaption className="text-secondary">
        {href ? <a href={href} target="_blank" rel="noreferrer" className="hover-underline hover:text-primary">{author}</a> : author}
      </figcaption>
    </div>
  </figure>;
}
