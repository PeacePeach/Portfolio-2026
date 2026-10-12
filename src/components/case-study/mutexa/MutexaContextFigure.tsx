import Image from "next/image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { mutexaContextFigure } from "@/content/case-study/mutexa";

/**
 * Mutexa "The Context" (Figma AI-Portfolio 176:3670): from `md`, the three-step
 * recording at 822px with each Body M caption (218px) centred under its step's
 * enzyme, shifted so the middle enzyme sits on the page's centre line, under the
 * heading's. Below `md` the steps stack, each centred over its caption.
 */
export function MutexaContextFigure({ figure }: { figure: typeof mutexaContextFigure }) {
  return (
    <>
      <ScrollReveal className="hidden md:block">
        <figure className="relative mx-auto" style={{ width: `${figure.width / 16}rem`, transform: `translateX(${50 - figure.steps[1].x}%)` }}>
          {/* Animated WebP: served as is. */}
          <Image src={figure.src} alt={figure.alt} width={figure.width} height={figure.height} unoptimized className="block h-auto w-full" />
          <figcaption>
            {figure.steps.map((s) => (
              <p key={s.caption} className="absolute top-[65.7%] w-[26.5%] -translate-x-1/2 type-body-m text-center text-primary" style={{ left: `${s.x}%` }}>
                {s.caption}
              </p>
            ))}
          </figcaption>
        </figure>
      </ScrollReveal>
      <ol className="flex flex-col items-center gap-12 md:hidden">
        {figure.steps.map((s) => (
          <ScrollReveal as="li" key={s.caption} className="flex w-[16rem] flex-col items-center gap-4">
            <Image src={s.src} alt="" width={256} height={131} unoptimized className="block h-auto w-full" />
            <p className="w-[13.625rem] type-body-m text-center text-primary">{s.caption}</p>
          </ScrollReveal>
        ))}
      </ol>
    </>
  );
}
