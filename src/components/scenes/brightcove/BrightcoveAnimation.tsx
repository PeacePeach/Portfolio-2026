"use client";

/**
 * Brightcove tile as a loop (Figma 35:19621): the CMS screenshot shrinks from the
 * zoomed-in first frame to the whole screen in the second, rests, then fades
 * out and the first frame fades back in to start again.
 *
 * The screenshot's width is animated rather than its scale, so its 10 px
 * corners and drop shadow stay the same size in both frames, as in Figma.
 * One looping clock `t` drives it, so any moment can be frozen with `at`.
 * With reduced motion the second frame is shown, still.
 */

import { useEffect, useRef, useSyncExternalStore } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ASPECT, LOOP, ORIGIN, TILE, WIDTH, beats } from "./timeline";

/** Rectangle 7: the tile background. */
const background = "#e2d5ca";
/** Group 3's Figma drop shadow. */
const shadow = "0 4px 20px rgba(0,0,0,0.2)";

const smooth = (u: number) => u * u * u * (u * (u * 6 - 15) + 10);

/**
 * Screenshot width, its opacity, and the frame-1 overlay's opacity at time
 * `t`. On the way round frame 2 fades out to the background first, then
 * frame 1 fades in, so the two never show at once.
 */
function stateAt(t: number) {
  const time = ((t % LOOP) + LOOP) % LOOP;
  const shrinkStart = beats.hold;
  const shrinkEnd = shrinkStart + beats.shrink;
  const backStart = shrinkEnd + beats.rest;
  const u = Math.min(Math.max((time - shrinkStart) / beats.shrink, 0), 1);
  const width = WIDTH.from + (WIDTH.to - WIDTH.from) * smooth(u);
  const back = Math.min(Math.max((time - backStart) / beats.back, 0), 1);
  return {
    width,
    out: 1 - smooth(Math.min(back * 2, 1)),
    back: smooth(Math.max(back * 2 - 1, 0)),
  };
}

const noop = () => () => {};
const LABEL = "Brightcove: a streaming CMS, zooming out from the playlist editor to the whole screen";

export function BrightcoveAnimation({
  at,
  rounded = true,
  label = LABEL,
}: {
  at?: number;
  rounded?: boolean;
  label?: string;
}) {
  const reduce = useReducedMotion();
  const hydrated = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const still = reduce && hydrated && at === undefined ? beats.hold + beats.shrink : at;

  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { margin: "100px" });
  const t = useMotionValue(still ?? 0);

  useEffect(() => {
    if (still !== undefined) {
      t.set(still);
      return;
    }
    if (!inView) return;
    const from = t.get() % LOOP;
    const first = animate(t, LOOP, { duration: LOOP - from, ease: "linear" });
    let rest: ReturnType<typeof animate> | undefined;
    first.then(() => {
      t.set(0);
      rest = animate(t, LOOP, {
        duration: LOOP,
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop",
      });
    });
    return () => {
      first.stop();
      rest?.stop();
    };
  }, [still, inView, t]);

  const width = useTransform(t, (v) => stateAt(v).width);
  const height = useTransform(width, (w) => w * ASPECT);
  const opacity = useTransform(t, (v) => stateAt(v).out);
  const overlay = useTransform(t, (v) => stateAt(v).back);

  return (
    <div
      ref={root}
      className={`relative overflow-hidden ${rounded ? "rounded-[15px]" : ""}`}
      style={{ width: TILE.width, height: TILE.height, background }}
      role="img"
      aria-label={label}
    >
      <motion.div aria-hidden className="absolute inset-0" style={{ opacity }}>
        <Screenshot width={width} height={height} />
      </motion.div>
      {/* On the way round, frame 1 fades back in. */}
      <motion.div aria-hidden className="absolute inset-0" style={{ opacity: overlay }}>
        <Screenshot width={WIDTH.from} height={WIDTH.from * ASPECT} />
      </motion.div>
    </div>
  );
}

function Screenshot({
  width,
  height,
}: {
  width: number | MotionValue<number>;
  height: number | MotionValue<number>;
}) {
  return (
    <motion.div
      aria-hidden
      className="absolute overflow-hidden rounded-[10px]"
      style={{ left: ORIGIN.x, top: ORIGIN.y, width, height, boxShadow: shadow }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/scenes/brightcove/cms.webp" alt="" className="block size-full" draggable={false} />
    </motion.div>
  );
}
