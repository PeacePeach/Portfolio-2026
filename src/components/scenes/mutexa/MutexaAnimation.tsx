"use client";

/**
 * Mutexa tile as one continuous camera track (Figma 34:12825).
 *
 *   MutexaAnimation
 *     ├── fixed purple background
 *     └── moving track: the rotated card group, translated so the camera
 *         point sits at the tile centre, faded in and out at the loop seam
 *          └── cards, each driven by its own focus phase (see track.ts)
 *
 * One looping clock `t` drives everything, so any moment can be frozen with
 * `at`. With reduced motion the five Figma frames are shown in turn with
 * short fades, every card in its finished state.
 */

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentType,
} from "react";
import { IBM_Plex_Sans } from "next/font/google";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  CardId,
  LOOP,
  ROTATION,
  TILE,
  camera,
  cardShadow,
  cards,
  groupOffset,
  keyTimes,
  phaseAt,
  trackOpacity,
} from "./track";
import {
  FieldCard,
  FilesCard,
  GuiCard,
  InsightsCard,
  MetricsCard,
  PlannerCard,
  ProgressCard,
} from "./MutexaCards";

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

/** Rectangle 7: the fixed purple background. */
const background =
  "linear-gradient(-57.34deg, #aaaefd -7.06%, #3741f3 140.75%)";

const cardViews: Record<
  CardId,
  ComponentType<{ phase: MotionValue<number> }>
> = {
  planner: PlannerCard,
  progress: ProgressCard,
  gui: GuiCard,
  metrics: MetricsCard,
  insights: InsightsCard,
  efield: FieldCard,
  files: FilesCard,
};
const ids = Object.keys(cards) as CardId[];

const noop = () => () => {};
const LABEL =
  "Mutexa: an AI research workspace for enzyme mutation experiments";

export function MutexaAnimation({
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
  const corners = rounded ? "rounded-[15px]" : "";
  if (reduce && hydrated && at === undefined)
    return <ReducedLoop corners={corners} label={label} />;
  return <Stage still={at} corners={corners} label={label} />;
}

function Stage({
  still,
  corners,
  label,
  settled = false,
}: {
  still?: number;
  corners: string;
  label: string;
  settled?: boolean;
}) {
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

  const x = useTransform(t, (v) => groupOffset(camera(v)).x);
  const y = useTransform(t, (v) => groupOffset(camera(v)).y);
  const opacity = useTransform(t, (v) => (settled ? 1 : trackOpacity(v)));

  return (
    <div
      ref={root}
      className={`relative overflow-hidden ${plex.className} ${corners}`}
      style={{
        width: TILE.width,
        height: TILE.height,
        backgroundImage: background,
      }}
      role="img"
      aria-label={label}
    >
      <motion.div
        aria-hidden
        className="absolute top-0 left-0 will-change-transform"
        style={{ x, y, opacity, rotate: ROTATION, originX: 0, originY: 0 }}
      >
        {ids.map((id) => (
          <Card key={id} id={id} t={t} settled={settled} />
        ))}
      </motion.div>
    </div>
  );
}

/** One card at its place in the group, driven by its own focus phase. */
function Card({
  id,
  t,
  settled,
}: {
  id: CardId;
  t: MotionValue<number>;
  settled: boolean;
}) {
  const phase = useTransform(t, (v) => (settled ? 99 : phaseAt(id, v)));
  const View = cardViews[id];
  const r = cards[id];
  return (
    <div
      className="absolute"
      style={{
        left: r.x,
        top: r.y,
        width: r.w,
        height: r.h,
        filter: cardShadow,
      }}
    >
      <View phase={phase} />
    </div>
  );
}

/* ---- Reduced motion: the Figma frames in turn, short fades, nothing moves ---- */

const reducedHold = 2500;

function ReducedLoop({ corners, label }: { corners: string; label: string }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % keyTimes.length),
      reducedHold,
    );
    return () => window.clearInterval(id);
  }, []);
  return (
    <div
      className={`relative overflow-hidden ${corners}`}
      style={{
        width: TILE.width,
        height: TILE.height,
        backgroundImage: background,
      }}
      role="img"
      aria-label={label}
    >
      {keyTimes.map((time, i) => (
        <div
          key={time}
          aria-hidden
          className="absolute inset-0 transition-opacity duration-700 ease-out"
          style={{ opacity: i === index ? 1 : 0 }}
        >
          <Stage still={time} corners="" label="" settled />
        </div>
      ))}
    </div>
  );
}
