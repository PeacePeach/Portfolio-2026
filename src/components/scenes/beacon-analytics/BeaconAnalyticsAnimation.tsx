"use client";

/**
 * Beacon Analytics tile as a loop (Figma 41:23982): the Views card stays put
 * while the total counts up to 1,500 and the line draws in from the left on
 * the same curve, a small dot riding its tip. The trend then settles in, the
 * card rests, and everything fades back to an empty card to start again.
 *
 * One looping clock `t` drives it, so any moment can be frozen with `at`.
 * With reduced motion the finished card is shown, still.
 */

import { useEffect, useRef, useSyncExternalStore } from "react";
import { Public_Sans } from "next/font/google";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useScenePaused } from "../ScenePause";
import { LOOP, TILE, beats, doneAt } from "./timeline";

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const c = {
  tile: "#e2faff", // Rectangle 7
  border: "#e5e6e6",
  muted: "#4d5056",
  ink: "#01050e",
  trend: "#3a5de8",
  icon: "#092dbd",
  lineFrom: "#809dff",
  lineTo: "#3a5de8",
};

const TOTAL = 1500;

/** Vector 1, in its own 165 × 48 box at (34, 12) in the chart. */
const linePath =
  "M0 48L13.22 40.9H28.35L38.2 33.99H44.8L47.14 30.01H54.86L57.8 23.63L60.85 20.98L66.13 13.81L68.97 14.61L72.02 13.81L74.66 10.09L78.01 9.03L81.16 5.58L82.48 3.45L83.54 0L85.93 6.9L89.59 13.81L92.83 17L95.27 23.63L97 26.82L99.23 28.41L102.38 24.17L104.61 24.96L106.04 30.54L112.74 28.41L115.95 27.35L119.41 25.23L122.55 23.63L125.9 25.23L127.23 22.04L128.85 20.71L130.27 18.89L131.79 14.61L134.84 18.89L137.07 19.92L139.12 18.89L142.15 21.24H145.3L147.94 24.96L151.29 26.02L155.05 26.82L158.4 28.68H161.65L165 27.62";

const clamp = (v: number) => Math.min(Math.max(v, 0), 1);
/** Fast start, long soft landing: the count and the line share it. */
const settle = (u: number) => 1 - (1 - u) ** 4;
const smooth = (u: number) => u * u * (3 - 2 * u);

function stateAt(t: number) {
  const time = ((t % LOOP) + LOOP) % LOOP;
  const drawEnd = beats.wait + beats.draw;
  const outStart = drawEnd + beats.hold;
  const inStart = outStart + beats.out;
  const progress = settle(clamp((time - beats.wait) / beats.draw));
  const fadeOut = 1 - smooth(clamp((time - outStart) / beats.out));
  const reset = time >= inStart;
  return {
    progress: reset ? 0 : progress,
    /** Line and trend opacity. */
    shown: reset ? 0 : fadeOut,
    /** Number opacity: out with the rest, then back in at 0. */
    number: reset ? smooth(clamp((time - inStart) / beats.in)) : fadeOut,
    /** Trend arrives as the count lands. */
    trend: reset ? 0 : smooth(clamp((time - drawEnd + 0.5) / 0.6)) * fadeOut,
    /** Tip dot: shows while drawing, gone once the line is finished. */
    tip: reset
      ? 0
      : smooth(clamp((time - beats.wait) / 0.2)) *
        (1 - smooth(clamp((time - drawEnd + 0.3) / 0.5))),
  };
}

const format = (v: number) => Math.round(v).toLocaleString("en-US");

const noop = () => () => {};
const LABEL =
  "Beacon Analytics: a Views card counting up to 1,500 as its line chart draws in";

export function BeaconAnalyticsAnimation({
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
  const still = reduce && hydrated && at === undefined ? doneAt : at;

  const root = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const inView = useInView(root, { margin: "100px" });
  const paused = useScenePaused();
  const t = useMotionValue(still ?? 0);

  useEffect(() => {
    if (still !== undefined) {
      t.set(still);
      return;
    }
    if (!inView || paused) return;
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
  }, [still, inView, paused, t]);

  const progress = useTransform(t, (v) => stateAt(v).progress);
  const shown = useTransform(t, (v) => stateAt(v).shown);
  const numberOpacity = useTransform(t, (v) => stateAt(v).number);
  const trend = useTransform(t, (v) => stateAt(v).trend);
  const trendX = useTransform(trend, (v) => (1 - v) * -4);
  const tipOpacity = useTransform(t, (v) => stateAt(v).tip);
  const count = useTransform(progress, (p) => format(p * TOTAL));
  // The line draws by length, so the tip follows the drawn end exactly.
  const tip = useTransform(progress, (p) => {
    const el = path.current;
    if (!el) return { x: 0, y: 48 };
    const pt = el.getPointAtLength(p * el.getTotalLength());
    return { x: pt.x, y: pt.y };
  });
  const tipX = useTransform(tip, (p) => p.x);
  const tipY = useTransform(tip, (p) => p.y);

  return (
    <div
      ref={root}
      className={`relative overflow-hidden ${publicSans.className} ${rounded ? "rounded-[15px]" : ""}`}
      style={{ width: TILE.width, height: TILE.height, background: c.tile }}
      role="img"
      aria-label={label}
    >
      {/* Frame 95: the Views card. */}
      <div
        aria-hidden
        className="absolute top-[54px] left-[95px] h-[206px] w-[231px] rounded-[15px] border bg-[#fff] p-4"
        style={{
          borderColor: c.border,
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}
      >
        {/* Graph Metric */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <span className="text-[14px] leading-5" style={{ color: c.muted }}>
              Views
            </span>
            <InfoIcon />
          </div>
          <div className="flex h-9 items-end gap-1">
            <motion.span
              className="text-[28.43px] leading-9 font-semibold tracking-[-0.005em]"
              style={{ color: c.ink, opacity: numberOpacity }}
            >
              {count}
            </motion.span>
            <motion.span
              className="flex h-6 items-start pb-1 text-[14px] leading-5 font-bold"
              style={{ color: c.trend, opacity: trend, x: trendX }}
            >
              <ArrowUpIcon />
              4.5%
            </motion.span>
          </div>
          <span className="text-[12px] leading-4" style={{ color: c.muted }}>
            Last 28 days
          </span>
        </div>

        {/* Chart Base, 24 px below the metric. */}
        <div className="relative mt-6 h-[72px] w-[199px]">
          {[
            ["600", 0],
            ["400", 19.48],
            ["200", 38.96],
            ["0", 58.97],
          ].map(([text, y]) => (
            <span
              key={text}
              className="absolute left-0 text-[10px] leading-4"
              style={{ top: (y as number) - 0.7, color: c.muted }}
            >
              {text}
            </span>
          ))}
          <svg
            className="absolute inset-0 overflow-visible"
            width={199}
            height={72}
            viewBox="0 0 199 72"
            fill="none"
          >
            <defs>
              <linearGradient
                id="beacon-line"
                x1="34"
                y1="0"
                x2="199"
                y2="0"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor={c.lineFrom} />
                <stop offset="1" stopColor={c.lineTo} />
              </linearGradient>
            </defs>
            <rect x={27} y={8} width={172} height={1} fill={c.border} />
            {[23.81, 43.28, 62.76].map((y) => (
              <rect
                key={y}
                x={27}
                y={y}
                width={172}
                height={0.54}
                fill={c.border}
              />
            ))}
            <g transform="translate(34 12)">
              <motion.path
                ref={path}
                d={linePath}
                stroke="url(#beacon-line)"
                strokeWidth={2}
                strokeLinejoin="round"
                style={{ pathLength: progress, opacity: shown }}
              />
              <motion.circle
                r={3}
                fill={c.lineTo}
                stroke="#fff"
                strokeWidth={1.5}
                style={{ cx: tipX, cy: tipY, opacity: tipOpacity }}
              />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function InfoIcon() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      stroke={c.icon}
      strokeWidth={1.33}
      strokeLinecap="round"
    >
      <circle cx={8} cy={8} r={6.67} />
      <path d="M8 10.67V8M8 5.33h.007" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      stroke={c.icon}
      strokeWidth={1.33}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5"
    >
      <path d="M8 12.67V3.33M3.33 8 8 3.33 12.67 8" />
    </svg>
  );
}
