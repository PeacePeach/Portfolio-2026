"use client";

import type { CSSProperties, Ref } from "react";
import { motion } from "motion/react";
import { morphTiming } from "@/lib/caseMorph";
import { CARD_RADIUS, MUTEXA_HERO, MUTEXA_HERO_MIN_UNIT, MUTEXA_PRIMARY, SECONDARY, TILT, ring, type MutexaCard } from "./hero";

/** One band pixel. Scales with the band's width; like Neo's, the band holds 360 px tall on narrow screens and crops its sides. */
const unit = { "--u": `max(calc(100cqw / ${MUTEXA_HERO.width}), ${MUTEXA_HERO_MIN_UNIT}px)` } as CSSProperties;
export const u = (n: number) => `calc(${n} * var(--u))`;

/**
 * The hero band and its cards. The case study page renders it as is; the
 * Work → case study transition renders the same band in a fixed layer, with
 * the cards surfacing (`enterAt`: seconds already elapsed in the morph)
 * and the primary card left out, because the transition flies it in.
 */
export function MutexaHero({
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
        style={{ ...unit, height: u(MUTEXA_HERO.height), background: paint ? MUTEXA_HERO.background : undefined }}
      >
        <div
          className="absolute inset-y-0"
          style={{ width: u(MUTEXA_HERO.width), left: `calc((100cqw - ${u(MUTEXA_HERO.width)}) / 2)` }}
        >
          {primary ? <Card card={MUTEXA_PRIMARY} priority /> : null}
          {SECONDARY.map((c) => (
            <Card key={c.id} card={c} enterAt={enterAt} order={ring[c.id]} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Card({
  card: c,
  enterAt,
  order = 0,
  priority = false,
}: {
  card: MutexaCard;
  enterAt?: number;
  order?: number;
  priority?: boolean;
}) {
  const t = morphTiming.screens;
  const entering = enterAt !== undefined;
  return (
    <motion.div
      className="absolute"
      style={{ left: u(c.cx - c.w / 2), top: u(c.cy - c.h / 2), width: u(c.w), height: u(c.h) }}
      initial={entering ? { opacity: 0, y: t.rise, scale: t.scale } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: t.duration,
        ease: morphTiming.settle,
        delay: entering ? Math.max(0, t.delay + order * t.ring - enterAt) : 0,
      }}
    >
      <div
        className="size-full overflow-hidden"
        style={{
          transform: `rotate(${TILT}deg)`,
          borderRadius: c.rounded ? u(CARD_RADIUS) : undefined,
          border: c.framed ? `${u(8)} solid #fff` : undefined,
          // White behind the image too, so no band shows through at the frame's inner edge.
          background: c.framed ? "#fff" : undefined,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={c.src}
          alt={c.alt}
          draggable={false}
          fetchPriority={priority ? "high" : undefined}
          className="block size-full max-w-none select-none object-cover"
          style={{ borderRadius: c.rounded ? u(CARD_RADIUS) : undefined }}
        />
      </div>
    </motion.div>
  );
}
