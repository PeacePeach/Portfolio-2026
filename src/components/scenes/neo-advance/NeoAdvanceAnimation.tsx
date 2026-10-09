"use client";

/**
 * Neo Advance tile as one continuous loop (Figma 31:6146). One stage, with
 * persistent surfaces driven by a single looping clock `t`:
 *
 *   0–2s     shield pops in with a ring, then the cover sheet is dragged up
 *            264 px to reveal Continue
 *   2–3.5s   a fingertip presses Continue (scale, flash, ripple); the sheet
 *            sinks and fades as the unlocked screen rises
 *   3.5–4.5s gift hops in and wiggles, confetti bursts out, then the headline
 *   4.5–6s   the unlocked screen's surface morphs into the Current limit card
 *            while its contents swap
 *   6–8.5s   $75 counts to $200 in blue, bar 25% → 50%; on landing the card
 *            pulses, the bar glints, sparkles fly and a +$125 tag springs in
 *   8.5–9.9s card sinks and fades, values reset off-screen, the cover sheet
 *            rises back from below and the loop closes on its first frame
 *
 * Every property is a pure function of `t`, so a frame can be inspected by
 * passing `at` (seconds) instead of playing. With reduced motion the five
 * states are shown in turn with short fades and no movement.
 */

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  animate,
  cubicBezier,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type EasingFunction,
  type MotionValue,
} from "motion/react";
import { useScenePaused } from "../ScenePause";
import { neo, neoFrames, NEO_TILE } from "./frames";
import { CoverSheet, LimitBody, NeoAdvanceScene, ShieldImage, UnlockedBody } from "./NeoAdvanceScene";
import { giftBox, giftConfetti } from "./giftPaths";

const noop = () => () => {};

/** Loop length in seconds. */
export const NEO_LOOP = 9.9;

const linear: EasingFunction = (p) => p;
const drag = cubicBezier(0.5, 0, 0.2, 1); // hand-dragged scroll: soft start, long settle
const settle = cubicBezier(0.22, 1, 0.36, 1); // arrivals
const leave = cubicBezier(0.4, 0, 0.2, 1); // departures
const morph = cubicBezier(0.6, 0, 0.2, 1); // shared-surface morph
const press = cubicBezier(0.3, 0, 0.3, 1);
const count = cubicBezier(0.65, 0, 0.2, 1); // builds speed, then lands softly

/** Damped spring as an easing curve over the segment. */
function springEase(zeta: number, omega: number): EasingFunction {
  const wd = omega * Math.sqrt(1 - zeta * zeta);
  const raw = (p: number) => 1 - Math.exp(-zeta * omega * p) * (Math.cos(wd * p) + ((zeta * omega) / wd) * Math.sin(wd * p));
  const end = raw(1);
  return (p) => raw(p) / end;
}
/** ≈2% overshoot, no visible bounce. */
const restrainedSpring = springEase(0.78, 8.5);
/** ≈15% overshoot and one soft rebound: for the moments meant to delight. */
const lively = springEase(0.5, 11);

/** Times (s) of each beat in the loop. */
const at = {
  shield: 0,
  dragStart: 1.2,
  dragEnd: 2.0,
  touchIn: 2.3,
  pressDown: 2.55,
  pressUp: 2.72,
  pressEnd: 2.98,
  sheetOut: 2.95,
  sheetGone: 3.45,
  screenIn: 3.0,
  screenSettled: 3.8,
  gift: 3.25,
  confetti: 3.4,
  headline: 3.5,
  morph: 4.6,
  morphEnd: 5.6,
  swapOut: 4.9,
  limitIn: 5.05,
  count: 6.15,
  countEnd: 7.35,
  pulseEnd: 7.85,
  cardOut: 8.55,
  cardGone: 9.0,
  reset: 9.05,
  sheetIn: 8.9,
  sheetBack: 9.75,
} as const;

/** Unlocked screen → Current limit card geometry, in tile pixels. */
const surface = {
  from: { left: 22.5, top: 26, width: 376, height: 300, radius: 20, bg: neo.bg },
  to: { left: 43, top: 88, width: 336, height: 137, radius: 12, bg: neo.surface },
};

/** Off-tile y offsets: far enough that the drop shadow is clipped too. */
const below = { sheet: 300, screen: 320 };

type Key<T> = readonly [time: number, value: T, ease?: EasingFunction];

/** A value of `t` from keyframes; each key's ease shapes the segment arriving at it. */
function useTrack<T extends number | string = number>(t: MotionValue<number>, keys: readonly Key<T>[]) {
  const times = [0, ...keys.map((k) => k[0]), NEO_LOOP];
  const values = [keys[0][1], ...keys.map((k) => k[1]), keys[keys.length - 1][1]];
  const eases = [linear, ...keys.slice(1).map((k) => k[2] ?? linear), linear];
  return useTransform(t, times, values, { ease: eases });
}

export function NeoAdvanceAnimation({
  at: still,
  label = "Neo Advance: a transfer covered by an advance unlocks a higher limit",
  rounded = true,
}: {
  at?: number;
  label?: string;
  /** Figma's 15 px tile corners; off when the host already clips the corners. */
  rounded?: boolean;
}) {
  const reduce = useReducedMotion();
  // The server can't know the preference; switch only after hydration.
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const corners = rounded ? "rounded-[15px]" : "";
  if (reduce && hydrated && still === undefined) return <ReducedLoop label={label} corners={corners} />;
  return <Loop still={still} label={label} corners={corners} />;
}

function Loop({ still, label, corners }: { still?: number; label: string; corners: string }) {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { margin: "100px" });
  const paused = useScenePaused();
  const t = useMotionValue(still ?? 0);

  useEffect(() => {
    if (still !== undefined) {
      t.set(still);
      return;
    }
    if (!inView || paused) return;
    // Resume from wherever the loop was paused.
    const from = t.get() % NEO_LOOP;
    const first = animate(t, NEO_LOOP, { duration: NEO_LOOP - from, ease: "linear" });
    let rest: ReturnType<typeof animate> | undefined;
    first.then(() => {
      t.set(0);
      rest = animate(t, NEO_LOOP, { duration: NEO_LOOP, ease: "linear", repeat: Infinity, repeatType: "loop" });
    });
    return () => {
      first.stop();
      rest?.stop();
    };
  }, [still, inView, paused, t]);

  /* Cover sheet: drag up, sink and fade, return from below off-screen. */
  const sheetY = useTrack(t, [
    [at.dragStart, 0],
    [at.dragEnd, -264, drag],
    [at.sheetOut, -264],
    [at.sheetGone, -240, leave],
    [at.sheetIn - 0.01, -240],
    [at.sheetIn, below.sheet],
    [at.sheetBack, 0, settle],
  ]);
  const sheetOpacity = useTrack(t, [
    [at.sheetOut, 1],
    [at.sheetGone, 0, leave],
    [at.sheetIn - 0.01, 0],
    [at.sheetIn, 1],
  ]);
  const buttonScale = useTrack(t, [
    [at.pressDown, 1],
    [at.pressDown + 0.14, 0.93, press],
    [at.pressUp, 0.93],
    [at.pressEnd, 1, restrainedSpring],
  ]);
  const buttonBrightness = useTrack(t, [
    [at.pressDown, 1],
    [at.pressDown + 0.14, 1.35, press],
    [at.pressUp, 1.35],
    [at.pressEnd, 1, leave],
  ]);
  const buttonFilter = useTransform(buttonBrightness, (b) => `brightness(${b})`);

  /* Shield: pops in as the sheet settles, with one soft ring. */
  const shieldScale = useTrack(t, [
    [at.shield, 0.4],
    [at.shield + 0.75, 1, lively],
    [at.sheetIn, 1],
    [at.sheetIn + 0.01, 0.4],
  ]);
  const shieldRotate = useTrack(t, [
    [at.shield, -16],
    [at.shield + 0.8, 0, lively],
  ]);
  const shieldOpacity = useTrack(t, [
    [at.shield, 0],
    [at.shield + 0.2, 1, settle],
    [at.sheetIn, 1],
    [at.sheetIn + 0.01, 0],
  ]);
  const ringScale = useTrack(t, [
    [at.shield + 0.2, 0.7],
    [at.shield + 1.1, 1.6, settle],
  ]);
  const ringOpacity = useTrack(t, [
    [at.shield + 0.2, 0],
    [at.shield + 0.3, 0.5],
    [at.shield + 1.1, 0, leave],
  ]);

  /* The one white surface: rises as the unlocked screen, morphs into the limit card. */
  function m<T extends number | string>(from: T, to: T): Key<T>[] {
    return [
      [at.morph, from],
      [at.morphEnd, to, morph],
      [at.reset - 0.01, to],
      [at.reset, from],
    ];
  }
  const left = useTrack(t, m(surface.from.left, surface.to.left));
  const top = useTrack(t, m(surface.from.top, surface.to.top));
  const width = useTrack(t, m(surface.from.width, surface.to.width));
  const height = useTrack(t, m(surface.from.height, surface.to.height));
  const radius = useTrack(t, m(surface.from.radius, surface.to.radius));
  const bg = useTrack<string>(t, m<string>(surface.from.bg, surface.to.bg));
  const surfaceY = useTrack(t, [
    [at.screenIn, below.screen],
    [at.screenSettled, 0, settle],
    [at.cardOut, 0],
    [at.cardGone, 18, leave],
    [at.reset - 0.01, 18],
    [at.reset, below.screen],
  ]);
  const surfaceOpacity = useTrack(t, [
    [at.cardOut, 1],
    [at.cardGone, 0, leave],
    [at.reset - 0.01, 0],
    [at.reset, 1],
  ]);
  const surfaceScale = useTrack(t, [
    [at.countEnd - 0.05, 1],
    [at.countEnd + 0.12, 1.035, press],
    [at.pulseEnd, 1, restrainedSpring],
  ]);

  /* Unlocked contents. */
  const giftOpacity = useTrack(t, [
    [at.gift, 0],
    [at.gift + 0.2, 1, leave],
    [at.morph, 1],
    [at.swapOut, 0, leave],
  ]);
  const giftScale = useTrack(t, [
    [at.gift, 0.5],
    [at.gift + 0.8, 1, lively],
  ]);
  const swapOutY = (start: number) =>
    [
      [start, 0],
      [at.swapOut, -12, leave],
      [at.reset - 0.01, -12],
      [at.reset, 0],
    ] as const;
  const headlineOpacity = useTrack(t, [
    [at.headline, 0],
    [at.headline + 0.4, 1, settle],
    [at.morph, 1],
    [at.swapOut, 0, leave],
  ]);
  const headlineY = useTrack(t, [
    [at.headline, 10],
    [at.headline + 0.45, 0, settle],
    ...swapOutY(at.morph),
  ]);
  const restOpacity = useTrack(t, [
    [at.morph, 1],
    [at.swapOut - 0.08, 0, leave],
    [at.reset - 0.01, 0],
    [at.reset, 1],
  ]);
  const giftY = useTrack(t, swapOutY(at.morph));

  /* Limit card contents. */
  const amount = useTrack(t, [
    [at.count, 75],
    [at.countEnd, 200, count],
    [at.reset - 0.01, 200],
    [at.reset, 75],
  ]);
  const amountText = useTransform(amount, (v) => `$${Math.round(v)}`);
  const progress = useTrack(t, [
    [at.count, "25%"],
    [at.countEnd, "50.15%", count],
    [at.reset - 0.01, "50.15%"],
    [at.reset, "25%"],
  ]);

  // While counting the figure grows and turns blue; on landing it settles back.
  const amountScale = useTrack(t, [
    [at.count, 1],
    [at.countEnd - 0.1, 1.12, count],
    [at.pulseEnd, 1, lively],
  ]);
  const amountColor = useTrack<string>(t, [
    [at.count, "#000000"],
    [at.count + 0.3, neo.info, leave],
    [at.countEnd + 0.5, neo.info],
    [at.countEnd + 1.0, "#000000", leave],
  ]);
  const glow = useTrack(t, [
    [at.count, 0],
    [at.count + 0.3, 0.6, leave],
    [at.countEnd + 0.2, 1],
    [at.countEnd + 0.9, 0, leave],
  ]);
  const shineX = useTrack(t, [
    [at.countEnd - 0.15, -60],
    [at.countEnd + 0.45, 220, leave],
  ]);
  const fillWidth = useTransform(progress, (w) => (parseFloat(w) / 100) * 296); // track is 296 px wide
  const badgeOpacity = useTrack(t, [
    [at.countEnd - 0.05, 0],
    [at.countEnd + 0.15, 1, settle],
    [at.reset - 0.01, 1],
    [at.reset, 0],
  ]);
  const badgeScale = useTrack(t, [
    [at.countEnd - 0.05, 0.4],
    [at.countEnd + 0.6, 1, lively],
  ]);

  const enter = [
    useEnter(t, at.limitIn),
    useEnter(t, at.limitIn + 0.1),
    useEnter(t, at.limitIn + 0.2),
    useEnter(t, at.limitIn + 0.3),
  ];

  return (
    <div
      ref={root}
      className={`relative overflow-hidden font-sans ${corners}`}
      style={{ width: NEO_TILE.width, height: NEO_TILE.height, backgroundImage: neo.tile }}
      role="img"
      aria-label={label}
    >
      <div className="absolute inset-0" style={{ filter: neo.groupShadow }}>
        <CoverSheet
          top={53}
          style={{ y: sheetY, opacity: sheetOpacity }}
          shield={
            <div className="relative size-14">
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: `2px solid ${neo.info}`, scale: ringScale, opacity: ringOpacity }}
              />
              <motion.div style={{ scale: shieldScale, rotate: shieldRotate, opacity: shieldOpacity }}>
                <ShieldImage />
              </motion.div>
            </div>
          }
          buttonStyle={{ scale: buttonScale, filter: buttonFilter }}
          buttonDecor={<Touch t={t} />}
        />

        <motion.div
          className="absolute overflow-hidden"
          style={{
            left,
            top,
            width,
            height,
            borderRadius: radius,
            backgroundColor: bg,
            y: surfaceY,
            opacity: surfaceOpacity,
            scale: surfaceScale,
          }}
        >
          <UnlockedBody
            gift={<Gift t={t} />}
            giftStyle={{ opacity: giftOpacity, scale: giftScale, y: giftY }}
            headlineStyle={{ opacity: headlineOpacity, y: headlineY }}
            restStyle={{ opacity: restOpacity, y: giftY }}
          />
          <div className="absolute top-0 left-0">
            <LimitBody
              amount={<motion.span>{amountText}</motion.span>}
              progress={progress}
              enter={[enter[0], { ...enter[1], scale: amountScale, color: amountColor, originX: 0 }, enter[2], enter[3]]}
            />
            {/* Landing flourish, in LimitBody's coordinates (amount at 20,48; bar at 20,93). */}
            <motion.div
              className="absolute top-[93px] left-5 h-[5px] overflow-hidden rounded-full"
              style={{ width: fillWidth, opacity: glow, boxShadow: "0 0 10px 1px rgba(0,110,255,0.7)" }}
            >
              <motion.div
                className="absolute inset-y-0 w-[50px]"
                style={{ x: shineX, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent)" }}
              />
            </motion.div>
            <motion.span
              className="absolute top-[50px] left-[92px] rounded-full px-2 py-[3px] text-[12px] leading-[15px] font-semibold"
              style={{ background: "#e5f0ff", color: neo.info, opacity: badgeOpacity, scale: badgeScale, originX: 0 }}
            >
              +$125
            </motion.span>
            <Sparkles t={t} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/** Fade and lift in at `start`, hidden again when the loop resets. */
function useEnter(t: MotionValue<number>, start: number) {
  const opacity = useTrack(t, [
    [start, 0],
    [start + 0.45, 1, settle],
    [at.reset - 0.01, 1],
    [at.reset, 0],
  ]);
  const y = useTrack(t, [
    [start, 8],
    [start + 0.5, 0, settle],
    [at.reset - 0.01, 0],
    [at.reset, 8],
  ]);
  return { opacity, y };
}

/** Figma gift, inline: the box lands with a hop and a wiggle, then the confetti bursts out of it. */
function Gift({ t }: { t: MotionValue<number> }) {
  const hop = useTrack(t, [
    [at.gift, 18],
    [at.gift + 0.25, -10, settle],
    [at.gift + 0.7, 0, lively],
  ]);
  const wiggle = useTrack(t, [
    [at.gift + 0.15, -9],
    [at.gift + 0.35, 7, press],
    [at.gift + 0.55, -4, press],
    [at.gift + 0.75, 2, press],
    [at.gift + 0.9, 0, press],
  ]);
  return (
    <svg width="112" height="112" viewBox="0 0 112 112" fill="none" aria-hidden className="overflow-visible">
      <motion.g style={{ y: hop, rotate: wiggle, transformBox: "fill-box", originX: 0.5, originY: 1 }}>
        {giftBox.map((p, i) => (
          <path
            key={i}
            d={p.d}
            fill={p.fill}
            fillRule={p.evenodd ? "evenodd" : undefined}
            clipRule={p.evenodd ? "evenodd" : undefined}
          />
        ))}
      </motion.g>
      {giftConfetti.map((p, i) => (
        <ConfettiPiece key={i} t={t} index={i} d={p.d} fill={p.fill} />
      ))}
    </svg>
  );
}

/** Where the confetti bursts from: the top of the box. */
const burstFrom = { x: 56, y: 40 };

function ConfettiPiece({ t, index, d, fill }: { t: MotionValue<number>; index: number; d: string; fill: string }) {
  const [px, py] = (d.match(/^M\s*([-\d.]+)[ ,]([-\d.]+)/) ?? [, "56", "20"]).slice(1).map(Number);
  const start = at.confetti + (index % 7) * 0.03;
  const opacity = useTrack(t, [
    [start, 0],
    [start + 0.12, 1, settle],
  ]);
  const scale = useTrack(t, [
    [start, 0.2],
    [start + 0.6, 1, lively],
  ]);
  const x = useTrack(t, [
    [start, (burstFrom.x - px) * 0.75],
    [start + 0.6, 0, settle],
  ]);
  const y = useTrack(t, [
    [start, (burstFrom.y - py) * 0.75],
    [start + 0.6, 0, settle],
  ]);
  const rotate = useTrack(t, [
    [start, index % 2 ? -90 : 90],
    [start + 0.7, 0, settle],
  ]);
  return (
    <motion.path
      d={d}
      fill={fill}
      style={{ opacity, scale, x, y, rotate, transformBox: "fill-box", transformOrigin: "center" }}
    />
  );
}

/** A fingertip landing on Continue, with a ripple from the tap. */
function Touch({ t }: { t: MotionValue<number> }) {
  const opacity = useTrack(t, [
    [at.touchIn, 0],
    [at.touchIn + 0.2, 1, settle],
    [at.pressUp, 1],
    [at.pressUp + 0.25, 0, leave],
  ]);
  const scale = useTrack(t, [
    [at.touchIn, 1.5],
    [at.pressDown, 1.1, settle],
    [at.pressDown + 0.14, 0.85, press],
    [at.pressUp, 0.85],
    [at.pressUp + 0.25, 1.2, leave],
  ]);
  const rippleScale = useTrack(t, [
    [at.pressDown + 0.08, 0],
    [at.pressDown + 0.5, 14, settle],
  ]);
  const rippleOpacity = useTrack(t, [
    [at.pressDown + 0.08, 0],
    [at.pressDown + 0.12, 0.22],
    [at.pressDown + 0.7, 0, leave],
  ]);
  return (
    <span aria-hidden className="pointer-events-none absolute top-1/2 left-[62%] size-0">
      <motion.span
        className="absolute -top-[20px] -left-[20px] size-10 rounded-full"
        style={{ background: "rgba(255,255,255,0.9)", scale: rippleScale, opacity: rippleOpacity }}
      />
      <motion.span
        className="absolute -top-[18px] -left-[18px] size-9 rounded-full"
        style={{
          background: "rgba(255,255,255,0.35)",
          boxShadow: "0 0 0 1.5px rgba(255,255,255,0.7)",
          scale,
          opacity,
        }}
      />
    </span>
  );
}

/** Small four-point stars thrown off the $200 as it lands. */
const sparkles = [
  { x: 60, y: 46, dx: -10, dy: -22, size: 14, fill: "#006eff" },
  { x: 74, y: 52, dx: 20, dy: -18, size: 11, fill: "#66a8ff" },
  { x: 40, y: 68, dx: -16, dy: 14, size: 10, fill: "#66a8ff" },
  { x: 78, y: 70, dx: 26, dy: 10, size: 13, fill: "#006eff" },
  { x: 30, y: 50, dx: -22, dy: -10, size: 10, fill: "#006eff" },
  { x: 150, y: 54, dx: 22, dy: -16, size: 13, fill: "#66a8ff" },
];

function Sparkles({ t }: { t: MotionValue<number> }) {
  return (
    <>
      {sparkles.map((p, i) => (
        <Sparkle key={i} t={t} index={i} {...p} />
      ))}
    </>
  );
}

function Sparkle({ t, index, x, y, dx, dy, size, fill }: { t: MotionValue<number>; index: number } & (typeof sparkles)[number]) {
  const start = at.countEnd - 0.05 + index * 0.04;
  const ox = useTrack(t, [
    [start, 0],
    [start + 0.7, dx, settle],
  ]);
  const oy = useTrack(t, [
    [start, 0],
    [start + 0.7, dy, settle],
  ]);
  const scale = useTrack(t, [
    [start, 0],
    [start + 0.25, 1, settle],
    [start + 0.75, 0, leave],
  ]);
  const rotate = useTrack(t, [
    [start, 0],
    [start + 0.75, 90, settle],
  ]);
  return (
    <motion.svg
      aria-hidden
      width={size}
      height={size}
      viewBox="-5 -5 10 10"
      className="absolute"
      style={{ left: x, top: y, x: ox, y: oy, scale, rotate }}
    >
      <path d="M0 -5 L1.3 -1.3 L5 0 L1.3 1.3 L0 5 L-1.3 1.3 L-5 0 L-1.3 -1.3 Z" fill={fill} />
    </motion.svg>
  );
}

/* ---- Reduced motion: the five states in turn, short fades, nothing moves ---- */

const reducedHold = 2000;

function ReducedLoop({ label, corners }: { label: string; corners: string }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % neoFrames.length), reducedHold);
    return () => window.clearInterval(id);
  }, []);
  return (
    <div
      className={`relative overflow-hidden ${corners}`}
      style={{ width: NEO_TILE.width, height: NEO_TILE.height, backgroundImage: neo.tile }}
      role="img"
      aria-label={label}
    >
      {neoFrames.map((f, i) => (
        <div
          key={f.id}
          aria-hidden
          className="absolute inset-0 transition-opacity duration-500 ease-out"
          style={{ opacity: i === index ? 1 : 0 }}
        >
          <NeoAdvanceScene frame={f.id} />
        </div>
      ))}
    </div>
  );
}
