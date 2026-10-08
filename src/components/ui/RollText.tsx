"use client";

import { motion } from "motion/react";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

type Bezier = readonly [number, number, number, number];

/**
 * Text split into letters, each sitting in its own mask with a second copy
 * stacked underneath. Playing the roll slides every stack up one line,
 * letter by letter, so the next copy takes the visible slot.
 *
 * - `next` decides what each letter rolls to. Default: the same letter
 *   (a flip that lands on identical text). Return "" to roll a letter out.
 * - Screen readers get the plain text once; the letters are aria-hidden.
 */
export function RollText({
  text,
  play,
  delay = 0,
  stagger = 0.025,
  duration = 0.42,
  ease,
  next = (c) => c,
  className,
  letterRef,
}: {
  text: string;
  play: boolean;
  delay?: number;
  stagger?: number;
  duration?: number;
  ease: Bezier;
  next?: (char: string, index: number) => string;
  className?: string;
  letterRef?: (index: number) => (el: HTMLSpanElement | null) => void;
}) {
  const chars = Array.from(text);
  let visibleIndex = 0;

  return (
    <span className={cn("inline-block whitespace-pre", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-flex items-start">
        {chars.map((c, i) => {
          if (c === " ") return <span key={i}>&nbsp;</span>;
          const order = visibleIndex++;
          return (
            <span key={i} ref={letterRef?.(i)} className="relative inline-block overflow-hidden" style={maskStyle}>
              <motion.span
                className="block will-change-transform"
                initial={false}
                animate={{ y: play ? "-50%" : "0%" }}
                transition={{ duration, ease, delay: delay + order * stagger }}
              >
                <span className="block" style={slotStyle}>
                  {c}
                </span>
                <span className="block" style={slotStyle}>
                  {next(c, i) || " "}
                </span>
              </motion.span>
            </span>
          );
        })}
      </span>
    </span>
  );
}

// Each slot is one line tall plus a little room above and below so glyphs
// are not clipped; the mask shows exactly one slot and gives the extra room
// back with negative margins so line spacing is unchanged.
const pad = "0.12em";
const maskStyle: CSSProperties = { height: `calc(1lh + ${pad} * 2)`, marginBlock: `calc(${pad} * -1)` };
const slotStyle: CSSProperties = { paddingBlock: pad };
