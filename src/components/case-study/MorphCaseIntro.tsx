"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { cameByFade, landCaseMorph, morphElapsed, morphTiming, useCaseMorph } from "@/lib/caseMorph";
import { IntroTemplate, type IntroData } from "./templates/IntroTemplate";

/**
 * Top of a case study the Work tile morphs into: the hero band, then the
 * intro. Arriving from the tile, the band stays hidden until the transition
 * layer hands it over, and the text rises in last.
 */
export function MorphCaseIntro({
  hero,
  intro,
  children,
}: {
  /** the page's hero; `hidden` while the transition layer still covers it */
  hero: (hidden: boolean) => ReactNode;
  intro: IntroData;
  children?: ReactNode;
}) {
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
      {hero(!!morph)}
      <div className="container-page">
        <IntroTemplate
          {...intro}
          reveal={(index, children) => <Rise index={index} enterAt={enterAt}>{children}</Rise>}
        />
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
