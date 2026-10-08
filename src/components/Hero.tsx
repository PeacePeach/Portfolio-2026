"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { site } from "@/content/site";
import { intro, introWithoutLoader } from "@/design/motion";
import { RollText } from "./ui/RollText";
import { ScrollCue } from "./ScrollCue";
import { useIntro } from "./intro/IntroContext";

/**
 * Full-screen hero, laid out after the reference: a centered headline block
 * with indented lines, the index label at the left margin, supporting copy
 * beside one line, and a round scroll button low and centered.
 * Copy and line indents come from site.hero.
 */
export function Hero({ nextSectionId }: { nextSectionId: string }) {
  const { statement, asideLine, description, index, scrollLabel, scrollButtonLabel } = site.hero;
  const { ready, skipped } = useIntro();
  // With no loader, run the same choreography from (almost) zero.
  const shift = skipped ? introWithoutLoader - intro.roll.at : 0;
  const { roll, meta, copy, curtain } = intro;

  const blockRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const aside = useAsidePosition(blockRef, lineRefs, asideLine);

  return (
    <section aria-labelledby="hero-title" className="bg-hero relative min-h-svh overflow-hidden">
      <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />

      <motion.div
        data-reveal
        className="container-page relative min-h-svh pt-[26svh] pb-[30svh] md:pt-[29svh]"
        initial={site.loader.enabled ? { y: curtain.parallax.from } : false}
        animate={{ y: ready ? "0vh" : curtain.parallax.from }}
        transition={{ duration: curtain.parallax.duration, ease: curtain.parallax.ease, delay: skipped ? 0 : curtain.at }}
      >
        <div ref={blockRef} className="relative">
          {/* Index label: left margin on desktop, above the headline on mobile */}
          <p className="mb-6 overflow-hidden text-small uppercase md:absolute md:top-[0.15em] md:left-0 md:mb-0">
            <motion.span
              data-reveal
              className="block"
              initial={{ y: "110%" }}
              animate={{ y: ready ? "0%" : "110%" }}
              transition={{ duration: meta.duration, ease: meta.ease, delay: shift + meta.at }}
            >
              {index} <span aria-hidden="true">—</span> {scrollLabel} <span aria-hidden="true">↓</span>
            </motion.span>
          </p>

          <h1 id="hero-title" className="w-fit font-display text-mega uppercase md:mx-auto">
            {statement.map((line, i) => (
              <span
                key={line.text}
                ref={(el) => {
                  lineRefs.current[i] = el;
                }}
                className="block w-fit"
                style={{ paddingLeft: `${line.indent}em` }}
              >
                <RollText
                  text={line.text}
                  play={ready}
                  delay={shift + roll.at + i * roll.lineStagger}
                  stagger={roll.charStagger}
                  duration={roll.duration}
                  ease={roll.ease}
                />
              </span>
            ))}
          </h1>

          {/* Supporting copy: beside the chosen line on desktop, below on mobile */}
          <div
            className="mt-8 max-w-[22em] overflow-hidden text-small uppercase md:absolute md:mt-0 md:w-[19em]"
            style={aside ? { left: aside.left, top: aside.top } : undefined}
          >
            <motion.p
              data-reveal
              className="indent-[2.8em]"
              initial={{ y: "105%" }}
              animate={{ y: ready ? "0%" : "105%" }}
              transition={{ duration: copy.duration, ease: copy.ease, delay: shift + copy.at }}
            >
              {description}
            </motion.p>
          </div>
        </div>

        <ScrollCue
          targetId={nextSectionId}
          label={scrollButtonLabel}
          className="absolute top-[calc(82svh-var(--cue)/2)] left-1/2 w-(--cue) -translate-x-1/2 [--cue:clamp(3.75rem,6.9vw,7rem)]"
        />
      </motion.div>
    </section>
  );
}

/**
 * Places the supporting copy just right of the chosen headline line,
 * aligned to its cap height. Desktop only; re-measures on resize.
 */
function useAsidePosition(
  blockRef: React.RefObject<HTMLDivElement | null>,
  lineRefs: React.RefObject<Array<HTMLSpanElement | null>>,
  lineIndex: number,
) {
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  useEffect(() => {
    const block = blockRef.current;
    const line = lineRefs.current[lineIndex];
    if (!block || !line) return;
    const mq = window.matchMedia("(min-width: 48rem)");
    const measure = () => {
      if (!mq.matches) return setPos(null);
      const b = block.getBoundingClientRect();
      const l = line.getBoundingClientRect();
      const size = parseFloat(getComputedStyle(line).fontSize);
      setPos({ left: l.right - b.left + size * 0.22, top: l.top - b.top + size * 0.1 });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(block);
    mq.addEventListener("change", measure);
    document.fonts?.ready.then(measure);
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", measure);
    };
  }, [blockRef, lineRefs, lineIndex]);

  return pos;
}
