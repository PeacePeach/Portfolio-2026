"use client";

import type { CSSProperties, Ref } from "react";
import { motion } from "motion/react";
import { morphTiming } from "@/lib/caseMorph";
import { BEACON_HERO, BEACON_HERO_MIN_UNIT, BEACON_PRIMARY, SCREEN_RADIUS, SECONDARY, TILT, screenShadow, ring, type BeaconScreen } from "./hero";

/** One band pixel. Scales with the band's width; like Neo's, the band holds 360 px tall on narrow screens and crops its sides. */
const unit = { "--u": `max(calc(100cqw / ${BEACON_HERO.width}), ${BEACON_HERO_MIN_UNIT}px)` } as CSSProperties;
export const u = (n: number) => `calc(${n} * var(--u))`;

/**
 * The hero band and its screens. The case study page renders it as is; the
 * Work → case study transition renders the same band in a fixed layer, with
 * the screens surfacing (`enterAt`: seconds already elapsed in the morph)
 * and the primary screen left out, because the transition flies it in.
 */
export function BeaconHero({
  bandRef,
  paint = true,
  primary = true,
  enterAt,
  className = "",
  style,
}: {
  bandRef?: Ref<HTMLDivElement>;
  /** paint the band (the transition paints its own, growing surface) */
  paint?: boolean;
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
        style={{ ...unit, height: u(BEACON_HERO.height), background: paint ? BEACON_HERO.background : undefined }}
      >
        <div
          className="absolute inset-y-0"
          style={{ width: u(BEACON_HERO.width), left: `calc((100cqw - ${u(BEACON_HERO.width)}) / 2)` }}
        >
          {SECONDARY.map((s) => (
            <Screen key={s.id} screen={s} enterAt={enterAt} order={ring[s.id]} />
          ))}
          {primary ? <Screen screen={BEACON_PRIMARY} priority /> : null}
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
  screen: BeaconScreen;
  enterAt?: number;
  order?: number;
  priority?: boolean;
}) {
  const t = morphTiming.screens;
  const entering = enterAt !== undefined;
  const cos = Math.cos((TILT * Math.PI) / 180);
  const sin = Math.sin((TILT * Math.PI) / 180);
  return (
    <motion.div
      className="absolute"
      style={{
        left: u(s.x),
        top: u(s.y),
        width: u(s.w),
        height: u(s.h),
        // scale about the screen's own (turned) centre
        transformOrigin: `${u(cos * (s.w / 2) - sin * (s.h / 2))} ${u(sin * (s.w / 2) + cos * (s.h / 2))}`,
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
        style={{ transform: `rotate(${TILT}deg)`, borderRadius: u(SCREEN_RADIUS), boxShadow: screenShadow(u) }}
      />
    </motion.div>
  );
}
