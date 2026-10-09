"use client";

import type { CSSProperties, Ref } from "react";
import { motion } from "motion/react";
import { morphTiming } from "@/lib/caseMorph";
import { HERO, HERO_MIN_UNIT, PRIMARY, ring, SCREEN_SHADOW, SECONDARY, type HeroScreen } from "./hero";

/** One band pixel. Scales with the band's width; below 950 px wide the band holds 360 px tall and crops its sides. */
const unit = { "--u": `max(calc(100cqw / ${HERO.width}), ${HERO_MIN_UNIT}px)` } as CSSProperties;
const u = (n: number) => `calc(${n} * var(--u))`;
export const screenShadow = `drop-shadow(0 ${u(SCREEN_SHADOW.y)} ${u(SCREEN_SHADOW.blur)} rgba(0,0,0,${SCREEN_SHADOW.alpha}))`;

/**
 * The hero band and its screens. The case study page renders it as is; the
 * Work → case study transition renders the same band in a fixed layer, with
 * the screens surfacing (`enterAt`: seconds already elapsed in the morph)
 * and the primary screen left out, because the transition flies it in.
 */
export function NeoHero({
  bandRef,
  blue = true,
  primary = true,
  enterAt,
  className = "",
  style,
}: {
  bandRef?: Ref<HTMLDivElement>;
  /** paint the band (the transition paints its own, growing surface) */
  blue?: boolean;
  primary?: boolean;
  enterAt?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`@container ${className}`} style={style}>
      <div
        ref={bandRef}
        className="relative overflow-hidden"
        style={{ ...unit, height: u(HERO.height), background: blue ? HERO.blue : undefined }}
      >
        <div
          className="absolute inset-y-0"
          style={{ width: u(HERO.width), left: `calc((100cqw - ${u(HERO.width)}) / 2)` }}
        >
          {SECONDARY.map((s) => (
            <Screen key={s.id} screen={s} enterAt={enterAt === undefined ? undefined : enterAt} order={ring[s.id]} />
          ))}
          {primary ? <Screen screen={PRIMARY} priority /> : null}
        </div>
      </div>
    </div>
  );
}

function Screen({
  screen: s,
  enterAt,
  order = 0,
  priority = false,
}: {
  screen: HeroScreen;
  enterAt?: number;
  order?: number;
  priority?: boolean;
}) {
  const [a, b, c, d] = s.transform.match(/-?[\d.]+/g)!.map(Number);
  const t = morphTiming.screens;
  const entering = enterAt !== undefined;
  return (
    <motion.div
      className="absolute"
      style={{
        left: u(s.x),
        top: u(s.y),
        width: u(s.w),
        height: u(s.h),
        filter: screenShadow,
        // scale about the screen's own (tilted) centre
        transformOrigin: `${u(a * (s.w / 2) + c * (s.h / 2))} ${u(b * (s.w / 2) + d * (s.h / 2))}`,
      }}
      initial={entering ? { opacity: 0, y: t.rise, scale: t.scale } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: t.duration,
        ease: morphTiming.settle,
        delay: entering ? Math.max(0, t.delay + order * t.ring - enterAt) : 0,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={s.src}
        alt={s.alt}
        draggable={false}
        fetchPriority={priority ? "high" : undefined}
        className="absolute top-0 left-0 size-full max-w-none origin-top-left select-none"
        style={{ transform: s.transform }}
      />
    </motion.div>
  );
}
