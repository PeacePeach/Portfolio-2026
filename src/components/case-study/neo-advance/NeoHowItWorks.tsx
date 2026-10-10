import Image from "next/image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { neoAdvanceHow as how } from "@/content/neoAdvance";

/** "How Neo Advance Works?" (Figma 68:712): three captioned flow recordings in a row. */
export function NeoHowItWorks({ className = "" }: { className?: string }) {
  return (
    <section aria-labelledby="neo-how" className={`flex flex-col items-center gap-12 ${className}`}>
      <ScrollReveal>
        <h2 id="neo-how" className="type-display-xs text-[2rem]! font-normal! text-ink">
          {how.title}
        </h2>
      </ScrollReveal>
      <ol className="flex flex-col items-center gap-12 md:flex-row md:items-start md:gap-6">
        {how.steps.map((step, i) => (
          <ScrollReveal
            as="li"
            key={step.caption}
            delay={i * 0.12}
            className="flex w-[14.375rem] flex-col items-center gap-8"
          >
            <p className="type-body-m text-center text-primary">{step.caption}</p>
            {/* Animated GIFs: next/image serves them as is, and lazy-loads below the fold. */}
            <Image
              src={step.src}
              alt={step.alt}
              width={230}
              height={475}
              unoptimized
              className="h-auto w-full rounded-[2.1875rem]"
            />
          </ScrollReveal>
        ))}
      </ol>
    </section>
  );
}
