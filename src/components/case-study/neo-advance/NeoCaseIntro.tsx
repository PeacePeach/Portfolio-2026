"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { cameByFade, landCaseMorph, morphElapsed, morphTiming, useCaseMorph } from "@/lib/caseMorph";
import { neoAdvanceIntro as intro } from "@/content/neoAdvance";
import { NeoHero } from "./NeoHero";

/**
 * Top of the Neo Advance case study (Figma 51:24883): the hero band, title,
 * summary and facts. Arriving from the Work tile, the band stays hidden
 * until the transition layer hands it over, and the text rises in last.
 */
export function NeoCaseIntro({ children }: { children?: ReactNode }) {
  const morph = useCaseMorph();
  const [enterAt] = useState(() => morphElapsed(morph));
  const [fade] = useState(cameByFade);
  useEffect(() => {
    if (morph) landCaseMorph();
  }, [morph]);

  return (
    <motion.div
      initial={fade ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <NeoHero className="mt-(--spacing-header-bar)" style={{ visibility: morph ? "hidden" : undefined }} />
      <div className="container-page pt-[5.6875rem]">
        <Rise index={0} enterAt={enterAt}>
          <h1 className="type-display-m">{intro.title}</h1>
        </Rise>
        <Rise index={1} enterAt={enterAt}>
          <p className="mt-6 max-w-[53.1875rem] type-body-m">{intro.summary}</p>
        </Rise>
        <Rise index={2} enterAt={enterAt}>
          <dl className="mt-[7.625rem] flex flex-wrap gap-x-12 gap-y-8">
            {intro.facts.map((f) => (
              <div key={f.label} className="flex flex-col gap-1">
                <dt className="type-label-s text-primary">{f.label}</dt>
                {f.items.map((item) => (
                  <dd key={item} className="type-body-s text-secondary">
                    {item}
                  </dd>
                ))}
              </div>
            ))}
          </dl>
        </Rise>
        {children}
      </div>
    </motion.div>
  );
}

function Rise({ index, enterAt, children }: { index: number; enterAt: number; children: ReactNode }) {
  const t = morphTiming.text;
  const entering = enterAt !== Infinity;
  return (
    <motion.div
      initial={entering ? { opacity: 0, y: t.rise } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: t.duration,
        ease: morphTiming.settle,
        delay: entering ? Math.max(0, t.delay + index * t.stagger - enterAt) : 0,
      }}
    >
      {children}
    </motion.div>
  );
}
