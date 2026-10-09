"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { site } from "@/content/site";
import { intro, introWithoutLoader } from "@/design/motion";
import { RollText } from "./ui/RollText";
import { KnowMe } from "./KnowMe";
import { useIntro } from "./intro/IntroContext";

/**
 * Full-screen hero (Figma 10:101 → 10:2). The headline block starts centred,
 * each line flips through a copy of itself, then the block docks to the
 * left margin. The supporting copy sits beside the shortest line and moves
 * with the block. Copy comes from site.hero.
 */
export function Hero() {
  const { statement, asideLine, description } = site.hero;
  const { ready, skipped } = useIntro();
  const shift = skipped ? introWithoutLoader - intro.roll.at : 0;
  const { roll, copy, dock } = intro;

  // Docked = final layout. Without the loader it starts docked.
  const [dockTimerDone, setDockTimerDone] = useState(false);
  const docked = skipped || dockTimerDone;
  useEffect(() => {
    if (!ready || skipped) return;
    const id = window.setTimeout(() => setDockTimerDone(true), dock.at * 1000);
    return () => window.clearTimeout(id);
  }, [ready, skipped, dock.at]);

  const blockRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const aside = useAsidePosition(blockRef, lineRefs, asideLine);

  return (
    <section aria-labelledby="hero-title" className="relative min-h-svh overflow-hidden bg-background md:h-svh">
      <div
        className={`container-page flex min-h-svh flex-col pt-[22svh] pb-4 md:pt-[30.25svh] md:pb-0 ${
          docked ? "md:items-start" : "md:items-center"
        }`}
      >
        <motion.div
          ref={blockRef}
          layout="position"
          transition={{ layout: { duration: skipped ? 0 : dock.duration, ease: dock.ease } }}
          className="relative"
        >
          <h1 id="hero-title" className="type-display-l uppercase" style={{ lineHeight: "var(--display-l-stack)" }}>
            {statement.map((line, i) => (
              <span
                key={line}
                ref={(el) => {
                  lineRefs.current[i] = el;
                }}
                className="block w-fit"
              >
                <RollText
                  text={line}
                  play={ready}
                  delay={shift + roll.at + i * roll.lineStagger}
                  stagger={roll.charStagger}
                  duration={roll.duration}
                  ease={roll.ease}
                />
              </span>
            ))}
          </h1>

          {/* Beside the chosen line on desktop, below the headline on mobile */}
          <div
            className="mt-8 max-w-[23.94em] overflow-hidden type-body-m-tight md:absolute md:mt-0 md:w-[23.94em] md:-translate-y-1/2"
            style={aside ?? undefined}
          >
            <motion.p
              data-reveal
              initial={{ y: "105%" }}
              animate={{ y: ready ? "0%" : "105%" }}
              transition={{ duration: copy.duration, ease: copy.ease, delay: shift + copy.at }}
            >
              {description}
            </motion.p>
          </div>
        </motion.div>

        {/* Right of the docked headline on desktop, roughly centred on it
            (Figma 10:2 at 1280 × 800: x 988, headline lines 92 px apart from y 242, panel top at y 342) */}
        <KnowMe className="mt-16 md:absolute md:top-[calc(30.25svh+var(--display-l-size)*0.9091)] md:left-[77.1875vw] md:mt-0" />
      </div>
    </section>
  );
}

/**
 * Places the supporting copy just right of the chosen headline line,
 * vertically centred on it (Figma 10:2: about 23 px gap at 110 px type). Desktop only.
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
      // offsetLeft/Top ignore transforms, so the dock animation does not skew this.
      const size = parseFloat(getComputedStyle(line).fontSize);
      setPos({
        left: line.offsetLeft + line.offsetWidth + size * 0.21,
        top: line.offsetTop + line.offsetHeight / 2 + size * 0.02,
      });
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
