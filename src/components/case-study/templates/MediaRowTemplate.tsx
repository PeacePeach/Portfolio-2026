import { useId } from "react";
import Image from "next/image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export type MediaRowItem = { caption: string; src: string; alt: string; width: number; height: number };

export type MediaRowData = { title: string; items: readonly MediaRowItem[]; className?: string };

/**
 * Figma 68:712: a heading over a row of media (screen recordings, GIFs), each
 * under its own caption. Items keep their intrinsic width, reveal one after
 * another, and stack into one column on small screens.
 */
export function MediaRowTemplate({ title, items, className = "" }: MediaRowData) {
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className={`flex flex-col items-center gap-12 ${className}`}>
      <ScrollReveal>
        <h2 id={titleId} className="type-display-xs text-[2rem]! font-normal! text-ink">
          {title}
        </h2>
      </ScrollReveal>
      <ol className="flex flex-col items-center gap-12 md:flex-row md:items-start md:gap-6">
        {items.map((item, i) => (
          <ScrollReveal as="li" key={item.caption} delay={i * 0.12}>
            {/* Each item is as wide as its media, so the caption wraps to it. */}
            <div style={{ width: `${item.width / 16}rem` }} className="flex flex-col items-center gap-8">
              <p className="type-body-m text-center text-primary">{item.caption}</p>
              {/* Animated GIFs: next/image serves them as is, and lazy-loads below the fold. */}
              <Image
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                unoptimized
                className="h-auto w-full rounded-[2.1875rem]"
              />
            </div>
          </ScrollReveal>
        ))}
      </ol>
    </section>
  );
}
