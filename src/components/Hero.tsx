import { site } from "@/content/site";
import { MaskReveal } from "./ui/MaskReveal";
import { FadeIn } from "./ui/FadeIn";
import { ScrollCue } from "./ScrollCue";

/**
 * Full-screen editorial hero. Copy comes from site.hero.
 * On md+ the supporting text and arrow sit in the open space to the right
 * of the shortest headline line (`asideLine`), all sized from --text-mega.
 */
export function Hero({ nextSectionId }: { nextSectionId: string }) {
  const { statement, description, scrollLabel } = site.hero;
  const asideLine = shortestLine(statement);
  const lineHeight = "calc(var(--text-mega) * var(--text-mega--line-height))";

  return (
    <section
      aria-labelledby="hero-title"
      className="container-page relative flex min-h-svh flex-col pt-header pb-[calc(var(--spacing-margin)*1.25)]"
    >
      <FadeIn className="grid-page pt-6 md:pt-10" step={1}>
        <p className="meta col-span-2 md:col-span-3 text-ink-muted">
          01 <span className="text-ink-faint">{"//"}</span> 02
        </p>
        <p className="meta col-span-2 md:col-span-3 md:col-start-10 justify-self-end text-ink-muted">Scroll</p>
      </FadeIn>

      <div className="relative mt-auto">
        <h1 id="hero-title" className="font-display text-mega uppercase">
          {statement.map((line, i) => (
            <MaskReveal key={line} index={i}>
              {line}
            </MaskReveal>
          ))}
        </h1>

        {/* Desktop: aside aligned to the short line */}
        <div
          className="absolute inset-x-0 hidden md:grid grid-page items-center"
          style={{ top: `calc(${lineHeight} * ${asideLine})`, height: lineHeight }}
        >
          <FadeIn className="col-span-4 col-start-6 lg:col-span-3 lg:col-start-7" step={2}>
            <p className="max-w-[24ch] text-lede text-ink-muted">{description}</p>
          </FadeIn>
          <ScrollCue
            targetId={nextSectionId}
            label={scrollLabel}
            className="col-start-12 h-[clamp(3.5rem,6vw,6.5rem)] w-[clamp(2.5rem,4.5vw,5rem)] justify-self-end"
          />
        </div>
      </div>

      {/* Mobile: aside below the headline */}
      <div className="mt-8 flex items-end justify-between gap-6 md:hidden">
        <FadeIn step={2}>
          <p className="max-w-[26ch] text-lede text-ink-muted">{description}</p>
        </FadeIn>
        <ScrollCue targetId={nextSectionId} label={scrollLabel} className="h-16 w-10 shrink-0" />
      </div>
    </section>
  );
}

function shortestLine(lines: readonly string[]) {
  let idx = 0;
  lines.forEach((l, i) => {
    if (l.length < lines[idx].length) idx = i;
  });
  return idx;
}
