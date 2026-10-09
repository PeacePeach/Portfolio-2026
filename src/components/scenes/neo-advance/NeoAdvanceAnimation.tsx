"use client";

/**
 * Neo Advance tile as one continuous loop (Figma 31:6146). One stage, with
 * persistent surfaces driven by a single looping clock `t`:
 *
 *   0–1.5s   cover sheet rests, then is dragged up 264 px to reveal Continue
 *   1.5–3s   Continue press; sheet sinks and fades as the unlocked screen
 *            rises; gift springs in with staggered confetti, then the headline
 *   3–5s     the unlocked screen's surface morphs into the Current limit card
 *            while its contents swap
 *   5–7s     $75 counts to $200, bar 25% → 50%, a small pulse on landing
 *   7–9.6s   card sinks and fades, values reset off-screen, the cover sheet
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
import { neo, neoFrames, NEO_TILE } from "./frames";
import { CoverSheet, LimitBody, NeoAdvanceScene, UnlockedBody } from "./NeoAdvanceScene";
import { giftBox, giftConfetti } from "./giftPaths";

const noop = () => () => {};

/** Loop length in seconds. */
export const NEO_LOOP = 9.6;

const linear: EasingFunction = (p) => p;
const drag = cubicBezier(0.5, 0, 0.2, 1); // hand-dragged scroll: soft start, long settle
const settle = cubicBezier(0.22, 1, 0.36, 1); // arrivals
const leave = cubicBezier(0.4, 0, 0.2, 1); // departures
const morph = cubicBezier(0.6, 0, 0.2, 1); // shared-surface morph
const press = cubicBezier(0.3, 0, 0.3, 1);

/** Critically-ish damped spring as an easing curve (≈2% overshoot, no visible bounce). */
const restrainedSpring: EasingFunction = (() => {
  const zeta = 0.78;
  const omega = 8.5;
  const wd = omega * Math.sqrt(1 - zeta * zeta);
  const raw = (p: number) => 1 - Math.exp(-zeta * omega * p) * (Math.cos(wd * p) + ((zeta * omega) / wd) * Math.sin(wd * p));
  const end = raw(1);
  return (p) => raw(p) / end;
})();

/** Times (s) of each beat in the loop. */
const at = {
  dragStart: 0.6,
  dragEnd: 1.4,
  pressDown: 1.95,
  pressUp: 2.07,
  pressEnd: 2.25,
  sheetOut: 2.25,
  sheetGone: 2.75,
  screenIn: 2.3,
  screenSettled: 3.1,
  gift: 2.62,
  confetti: 2.7,
  headline: 2.76, // ~140 ms after the gift
  morph: 3.9,
  morphEnd: 4.9,
  swapOut: 4.2,
  limitIn: 4.35,
  count: 5.6,
  countEnd: 6.5,
  pulseEnd: 6.85,
  cardOut: 7.55,
  cardGone: 8.05,
  reset: 8.1,
  sheetIn: 7.95,
  sheetBack: 8.8,
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

export function NeoAdvanceAnimation({ at: still, label = "Neo Advance: a transfer covered by an advance unlocks a higher limit" }: { at?: number; label?: string }) {
  const reduce = useReducedMotion();
  // The server can't know the preference; switch only after hydration.
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  if (reduce && hydrated && still === undefined) return <ReducedLoop label={label} />;
  return <Loop still={still} label={label} />;
}

function Loop({ still, label }: { still?: number; label: string }) {
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { margin: "100px" });
  const t = useMotionValue(still ?? 0);

  useEffect(() => {
    if (still !== undefined) {
      t.set(still);
      return;
    }
    if (!inView) return;
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
  }, [still, inView, t]);

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
    [at.pressDown - 0.12, 1],
    [at.pressDown, 0.97, press],
    [at.pressEnd, 1, press],
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
    [at.countEnd, 1],
    [at.countEnd + 0.14, 1.015, press],
    [at.pulseEnd, 1, press],
  ]);

  /* Unlocked contents. */
  const giftOpacity = useTrack(t, [
    [at.gift, 0],
    [at.gift + 0.2, 1, leave],
    [at.morph, 1],
    [at.swapOut, 0, leave],
  ]);
  const giftScale = useTrack(t, [
    [at.gift, 0.8],
    [at.gift + 0.65, 1, restrainedSpring],
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
    [at.countEnd, 200, drag],
    [at.reset - 0.01, 200],
    [at.reset, 75],
  ]);
  const amountText = useTransform(amount, (v) => `$${Math.round(v)}`);
  const progress = useTrack(t, [
    [at.count, "25%"],
    [at.countEnd, "50.15%", drag],
    [at.reset - 0.01, "50.15%"],
    [at.reset, "25%"],
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
      className="relative overflow-hidden rounded-[15px] font-sans"
      style={{ width: NEO_TILE.width, height: NEO_TILE.height, backgroundImage: neo.tile }}
      role="img"
      aria-label={label}
    >
      <div className="absolute inset-0" style={{ filter: neo.groupShadow }}>
        <CoverSheet top={53} style={{ y: sheetY, opacity: sheetOpacity }} buttonStyle={{ scale: buttonScale }} />

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
              enter={enter}
            />
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

/** Figma gift, inline so the confetti can arrive in a light stagger after the box. */
function Gift({ t }: { t: MotionValue<number> }) {
  return (
    <svg width="112" height="112" viewBox="0 0 112 112" fill="none" aria-hidden className="overflow-visible">
      {giftConfetti.map((p, i) => (
        <ConfettiPiece key={i} t={t} index={i} d={p.d} fill={p.fill} />
      ))}
      {giftBox.map((p, i) => (
        <path
          key={i}
          d={p.d}
          fill={p.fill}
          fillRule={p.evenodd ? "evenodd" : undefined}
          clipRule={p.evenodd ? "evenodd" : undefined}
        />
      ))}
    </svg>
  );
}

function ConfettiPiece({ t, index, d, fill }: { t: MotionValue<number>; index: number; d: string; fill: string }) {
  const start = at.confetti + index * 0.022;
  const opacity = useTrack(t, [
    [start, 0],
    [start + 0.25, 1, settle],
  ]);
  const scale = useTrack(t, [
    [start, 0.5],
    [start + 0.45, 1, restrainedSpring],
  ]);
  return <motion.path d={d} fill={fill} style={{ opacity, scale, transformBox: "fill-box", transformOrigin: "center" }} />;
}

/* ---- Reduced motion: the five states in turn, short fades, nothing moves ---- */

const reducedHold = 2000;

function ReducedLoop({ label }: { label: string }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % neoFrames.length), reducedHold);
    return () => window.clearInterval(id);
  }, []);
  return (
    <div
      className="relative overflow-hidden rounded-[15px]"
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
