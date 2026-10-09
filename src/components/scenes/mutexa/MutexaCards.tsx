"use client";

/**
 * The seven Mutexa cards (Figma 34:12825), rebuilt from Figma in each card's
 * own unrotated 260 px frame. Each card takes `phase`: seconds since the
 * camera brought it into focus, or -1 while it waits. Only the data inside a
 * card animates; the card itself never moves.
 */

import type { ReactNode } from "react";
import {
  cubicBezier,
  motion,
  useTransform,
  type EasingFunction,
  type MotionValue,
} from "motion/react";
import {
  AiIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  FileTextIcon,
  InfoIcon,
  MoreIcon,
  SendIcon,
  ShareIcon,
  UserIcon,
  checkPaths,
  circleDashPath,
  downloadArrow,
  downloadTray,
  incompleteArcs,
  incompleteHalf,
} from "./icons";

export const ink = {
  primary: "#161616",
  secondary: "#525252",
  blue: "#0f62fe",
} as const;

const out = cubicBezier(0.22, 1, 0.36, 1);
const inOut = cubicBezier(0.45, 0, 0.25, 1);

/** 0 → 1 as `phase` runs from `start` to `start + dur`; 0 while waiting. */
function useRamp(
  phase: MotionValue<number>,
  start: number,
  dur: number,
  ease: EasingFunction = out,
) {
  return useTransform(phase, (p) =>
    p < 0 ? 0 : ease(Math.min(Math.max((p - start) / dur, 0), 1)),
  );
}

/** Fade in and lift by `lift` px. */
function useRise(
  phase: MotionValue<number>,
  start: number,
  dur = 0.45,
  lift = 6,
  from = 0,
) {
  const r = useRamp(phase, start, dur);
  return {
    opacity: useTransform(r, (v) => from + (1 - from) * v),
    y: useTransform(r, (v) => (1 - v) * lift),
  };
}

type CardProps = { phase: MotionValue<number> };

const t14 = "text-[14px] leading-6 font-semibold whitespace-nowrap";

function Header({
  title,
  size = 14,
  info = false,
  right,
}: {
  title: string;
  size?: number;
  info?: boolean;
  right: ReactNode;
}) {
  return (
    <div className="flex h-[65px] shrink-0 items-center justify-between rounded-t-[8px] bg-[#fff] p-5">
      <div className="flex items-center gap-2.5">
        <p
          className="leading-6 font-semibold whitespace-nowrap"
          style={{ fontSize: size, color: ink.primary }}
        >
          {title}
        </p>
        {info ? <InfoIcon /> : null}
      </div>
      <div className="flex items-center gap-4">{right}</div>
    </div>
  );
}

/* ---- AI Planner ----------------------------------------------------------- */

function CopilotMark({ w, h }: { w: number; h: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/scenes/mutexa/copilot.webp"
      alt=""
      width={w}
      height={h}
      className="shrink-0 mix-blend-multiply"
      style={{ width: w, height: h }}
    />
  );
}

export function PlannerCard({ phase }: CardProps) {
  const you = useRise(phase, 0, 0.5);
  const reply = useRise(phase, 0.32, 0.5);
  const next = useRise(phase, 0.6, 0.4);
  return (
    <div className="relative flex h-full flex-col justify-between rounded-[10px] bg-[#fff] pb-4">
      <div className="absolute top-14 left-4 flex w-[227px] flex-col gap-8">
        <div className="flex flex-col items-center gap-6">
          <div className="flex w-full flex-col items-center gap-2">
            <CopilotMark w={36} h={40} />
            <p className={`${t14} text-center`} style={{ color: "#000" }}>
              HTP Copilot
            </p>
          </div>
          <p
            className="text-center text-[14px] leading-[1.4] tracking-[0.16px]"
            style={{ color: ink.primary }}
          >
            Hi, What research questions are you exploring in this enzyme
            mutation experiment?
          </p>
        </div>
        <div className="flex flex-col gap-10">
          <motion.div className="flex items-start gap-3" style={you}>
            <div className="grid size-6 shrink-0 place-items-center rounded-full bg-[#e9effe]">
              <UserIcon />
            </div>
            <div className="flex w-[191px] flex-col gap-2.5">
              <p className={t14} style={{ color: "#000" }}>
                You
              </p>
              <div className="rounded-[8px] bg-[#f6f6f6] px-4 py-3">
                <p
                  className="text-[16px] leading-6"
                  style={{ color: ink.primary }}
                >
                  I want to see if mutation X weakens drug binding by disrupting
                  key interactions.
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div className="flex items-start gap-3" style={reply}>
            <CopilotMark w={21.957} h={24} />
            <div className="flex flex-1 flex-col gap-4">
              <p className={t14} style={{ color: "#000" }}>
                HTP Copilot
              </p>
              <p
                className="w-[193px] text-[16px] leading-6"
                style={{ color: ink.primary }}
              >
                Your PDB file is uploaded! You can view it and locate the
                coordinates of your target using the GUI viewer on the right.
              </p>
            </div>
          </motion.div>
          <motion.div className="flex" style={next}>
            <CopilotMark w={21.957} h={24} />
          </motion.div>
        </div>
      </div>

      <div className="relative flex items-center justify-between rounded-[15px] bg-[#fff] p-5">
        <p className={t14} style={{ color: ink.primary }}>
          AI Planner
        </p>
        <div className="flex items-center gap-4">
          <ShareIcon />
          <MoreIcon />
        </div>
      </div>

      {/* Rectangle 37: white fade under the header. */}
      <div
        className="pointer-events-none absolute top-14 left-0 h-[55px] w-[260px]"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(255,255,255,0.7), rgba(255,255,255,0))",
        }}
      />

      <div className="relative bg-[#fff] px-5 pt-6">
        <div className="isolate flex h-24 items-center justify-between rounded-[8px] bg-[#f2f5fd] px-4 py-6">
          <p
            className="z-[2] min-w-0 flex-1 text-[16px] leading-6 whitespace-nowrap"
            style={{ color: "#8d8d8d" }}
          >
            Type in anything
          </p>
          <div className="z-[1] flex shrink-0 items-center gap-4">
            <p
              className="w-[98px] text-right text-[12px] leading-4 tracking-[0.32px]"
              style={{ color: "#a8a8a8" }}
            >
              0/200
            </p>
            <div className="rounded-[5px] bg-[#c6c6c6] p-2">
              <SendIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Progress ----------------------------------------------------------------- */

export function ProgressCard({ phase }: CardProps) {
  const check = useRamp(phase, 0, 0.4);
  const line = useRamp(phase, 0.18, 0.35, inOut);
  const half = useRamp(phase, 0.42, 0.4);
  const pct = useRamp(phase, 0.05, 0.8, inOut);
  const pctText = useTransform(pct, (v) => `${Math.round(v * 15)}%`);
  return (
    <div className="flex h-full flex-col rounded-[10px] bg-[#fff]">
      <div className="flex items-center justify-between p-5">
        <p className={t14} style={{ color: ink.primary }}>
          Progress
        </p>
        <ChevronDownIcon />
      </div>
      <div className="flex items-end px-5 py-6">
        <div className="flex flex-1 items-center justify-between">
          <div className="mr-[-19px] flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
              <motion.g
                transform="translate(1 1)"
                fill={ink.blue}
                style={{
                  opacity: useTransform(check, [0, 1], [0.3, 1]),
                  scale: useTransform(check, [0, 1], [0.7, 1]),
                  transformBox: "fill-box",
                  transformOrigin: "center",
                }}
              >
                {checkPaths.map((d) => (
                  <path key={d} d={d} />
                ))}
              </motion.g>
            </svg>
            <Connector progress={line} />
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
              <g transform="translate(1 1)" fill={ink.blue}>
                {incompleteArcs.map((d) => (
                  <path key={d} d={d} />
                ))}
                <motion.path
                  d={incompleteHalf}
                  style={{
                    opacity: half,
                    rotate: useTransform(half, [0, 1], [-90, 0]),
                    transformBox: "view-box",
                    transformOrigin: "7px 7px",
                  }}
                />
              </g>
            </svg>
            <Connector />
            <CircleDash />
            <Connector dashed />
            <CircleDash />
            <Connector dashed />
            <CircleDash />
          </div>
          <motion.p
            className="h-[18px] text-[14px] leading-[18px] tracking-[0.16px] whitespace-nowrap tabular-nums"
            style={{ color: ink.secondary }}
          >
            {pctText}
          </motion.p>
        </div>
      </div>
    </div>
  );
}

function Connector({
  dashed = false,
  progress,
}: {
  dashed?: boolean;
  progress?: MotionValue<number>;
}) {
  return (
    <svg
      width="16"
      height="1"
      viewBox="0 0 16 1"
      aria-hidden
      className="shrink-0 overflow-visible"
    >
      <motion.line
        x1="0"
        y1="0.5"
        x2="16"
        y2="0.5"
        stroke="#6f6f6f"
        strokeDasharray={dashed ? "1.5 2" : undefined}
        style={progress ? { pathLength: progress } : undefined}
      />
    </svg>
  );
}

const CircleDash = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    aria-hidden
    className="shrink-0"
  >
    <path d={circleDashPath} transform="translate(1 1)" fill={ink.primary} />
  </svg>
);

/* ---- GUI view ---------------------------------------------------------------- */

/** Where the target is located on the protein, in card px. */
const target = { x: 132, y: 186 };

export function GuiCard({ phase }: CardProps) {
  // The molecule turns into place, then the target on it is located.
  const turn = useRamp(phase, 0, 1.8, inOut);
  const ring = useRamp(phase, 1.15, 0.6, inOut);
  const dot = useRamp(phase, 1.55, 0.3);
  const pulse = useRamp(phase, 1.65, 0.8);
  const ticks = useRamp(phase, 1.4, 0.4);
  return (
    <div className="relative h-full rounded-[10px] bg-[#fff]">
      <div className="absolute inset-x-0 top-0 flex h-[65.25px] items-center justify-between rounded-[10px] bg-[#fff] p-5">
        <div className="flex items-center gap-2.5">
          <p
            className="text-[12px] leading-6 font-semibold whitespace-nowrap"
            style={{ color: ink.primary }}
          >
            GUI view
          </p>
          <InfoIcon />
        </div>
        <div className="flex items-center gap-4">
          <ShareIcon />
          <MoreIcon />
        </div>
      </div>
      {/* The viewer's backdrop stays put; only the molecule turns. */}
      <div className="absolute top-[65px] left-7 h-[232px] w-[189px] bg-[#fcfbf9]" />
      <motion.div
        className="absolute inset-0"
        style={{
          rotate: useTransform(turn, [0, 1], [-20, 0]),
          scale: useTransform(turn, [0, 1], [0.94, 1]),
          originX: `${28 + 189 / 2}px`,
          originY: `${65 + 232 / 2}px`,
        }}
      >
        {/* Raster in Figma too (a molecular viewer screenshot); its backdrop is keyed out so it can turn. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/scenes/mutexa/protein.webp"
          alt=""
          width={189}
          height={232}
          className="absolute top-[65px] left-7"
        />
        <svg
          className="absolute inset-0 overflow-visible"
          width="260"
          height="325"
          aria-hidden
        >
          <motion.circle
            cx={target.x}
            cy={target.y}
            r="13"
            fill="none"
            stroke={ink.blue}
            strokeWidth="1.5"
            style={{
              pathLength: ring,
              opacity: useTransform(ring, [0, 0.05], [0, 1]),
              rotate: -90,
              transformBox: "fill-box",
              transformOrigin: "center",
            }}
          />
          <motion.g
            stroke={ink.blue}
            strokeWidth="1.5"
            strokeLinecap="round"
            style={{ opacity: ticks }}
          >
            <line
              x1={target.x}
              y1={target.y - 19}
              x2={target.x}
              y2={target.y - 16}
            />
            <line
              x1={target.x}
              y1={target.y + 16}
              x2={target.x}
              y2={target.y + 19}
            />
            <line
              x1={target.x - 19}
              y1={target.y}
              x2={target.x - 16}
              y2={target.y}
            />
            <line
              x1={target.x + 16}
              y1={target.y}
              x2={target.x + 19}
              y2={target.y}
            />
          </motion.g>
          <motion.circle
            cx={target.x}
            cy={target.y}
            r="3"
            fill={ink.blue}
            style={{
              scale: dot,
              transformBox: "fill-box",
              transformOrigin: "center",
            }}
          />
          <motion.circle
            cx={target.x}
            cy={target.y}
            r="13"
            fill="none"
            stroke={ink.blue}
            strokeWidth="1"
            style={{
              scale: useTransform(pulse, [0, 1], [1, 1.9]),
              opacity: useTransform(pulse, [0, 0.1, 1], [0, 0.5, 0]),
              transformBox: "fill-box",
              transformOrigin: "center",
            }}
          />
        </svg>
      </motion.div>
    </div>
  );
}

/* ---- Distribution of Normalized Metrics -------------------------------------------- */

const metricColumns = [
  { track: 167.572, trackTop: 0, value: 101.214, valueTop: 0 },
  { track: 167.572, trackTop: 17.43, value: 131.377, valueTop: 0 },
  { track: 111.268, trackTop: 0, value: 69.71, valueTop: 0 },
  { track: 167.572, trackTop: 0, value: 101.214, valueTop: 12.74 },
  { track: 167.572, trackTop: 0, value: 62.337, valueTop: 26.81 },
];

export function MetricsCard({ phase }: CardProps) {
  return (
    <div className="flex h-full flex-col rounded-[15px]">
      <div className="flex h-[65px] shrink-0 items-center justify-between rounded-t-[8px] bg-[#fff] p-5">
        <p className={`${t14} mr-[-19px]`} style={{ color: ink.primary }}>
          Distribution of Normalized Metrics{" "}
        </p>
        <MoreIcon />
      </div>
      <div className="flex h-[282px] flex-col rounded-b-[8px] bg-[#fff] px-5 py-4">
        <div className="flex h-[207px] w-[220px] items-end gap-2">
          {metricColumns.map((c, i) => (
            <MetricBar key={i} phase={phase} index={i} {...c} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricBar({
  phase,
  index,
  track,
  trackTop,
  value,
  valueTop,
}: CardProps & { index: number } & (typeof metricColumns)[number]) {
  const grow = useRamp(phase, index * 0.08, 0.7);
  return (
    <div className="relative grid flex-1 place-items-start">
      <div
        className="col-start-1 row-start-1 w-full rounded-[200px]"
        style={{
          height: track,
          marginTop: trackTop,
          backgroundImage:
            "linear-gradient(to bottom, rgba(239,243,253,0.1), #f0f4fe)",
        }}
      />
      {/* Reserve the bar's full height so the column keeps its Figma size while it grows. */}
      <div
        className="col-start-1 row-start-1 w-full"
        style={{ height: value, marginTop: valueTop }}
      >
        <motion.div
          className="w-full rounded-[200px]"
          style={{
            height: useTransform(grow, (v) => Math.max(v * value, 0)),
            opacity: useTransform(grow, [0, 0.15], [0, 1]),
            backgroundImage:
              "linear-gradient(to bottom, #507ef3, rgba(80,126,242,0.1))",
          }}
        />
      </div>
    </div>
  );
}

/* ---- Insights ---------------------------------------------------------------- */

const findings = [
  {
    title: "Key Finding",
    body: "The mutation indirectly weakened adjacent stabilizing interactions, leading to a 53% increase in protein flexibility.",
  },
  {
    title: "Unexpected Finding",
    body: "Instead of enhancing promiscuity, substrate binding affinity dropped by 40% (ΔG_bind shifted from -8.5 kcal/mol to -5.1 kcal/mol) due to disrupted hydrogen bonding.",
  },
  {
    title: "Key Finding",
    body: "The mutation indirectly weakened adjacent stabilizing interactions, leading to a 53% increase in protein flexibility and making the drug binding site less rigid.",
  },
];

export function InsightsCard({ phase }: CardProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[15px]">
      <Header title="Insights" info right={<ChevronRightIcon />} />
      <div className="flex flex-col justify-end rounded-b-[8px] bg-[#fff] px-5 py-4">
        <div className="flex flex-col gap-2">
          {findings.map((f, i) => (
            <Finding key={i} phase={phase} index={i} {...f} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Finding({
  phase,
  index,
  title,
  body,
}: CardProps & { index: number; title: string; body: string }) {
  const lit = useRamp(phase, index * 0.12, 0.5);
  return (
    <div className="flex flex-col gap-4 rounded-[8px] bg-[#f2f5fd] p-3">
      <div className="flex items-center gap-2">
        <motion.div
          className="rounded-[4px] p-2"
          style={{
            backgroundColor: useTransform(lit, [0, 1], ["#e6eefc", "#d5e4fb"]),
          }}
        >
          <motion.div
            style={{
              scale: useTransform(lit, [0, 0.6, 1], [0.7, 1.08, 1]),
              opacity: useTransform(lit, [0, 1], [0.35, 1]),
            }}
          >
            <AiIcon />
          </motion.div>
        </motion.div>
        <p
          className="text-[14px] leading-[18px] font-semibold tracking-[0.16px] whitespace-nowrap"
          style={{ color: ink.secondary }}
        >
          {title}
        </p>
      </div>
      <p
        className="text-[14px] leading-[18px] tracking-[0.16px]"
        style={{ color: ink.secondary }}
      >
        {body}
      </p>
    </div>
  );
}

/* ---- Electric Field ------------------------------------------------------------ */

const fieldBars = [
  { w: 22, a: 0.1 },
  { w: 57, a: 0.1 },
  { w: 65, a: 0.2 },
  { w: 75, a: 0.4 },
  { w: 81, a: 0.6 },
  { w: 92, a: 0.8 },
  { w: 104, a: 1 },
  { w: 92, a: 0.8 },
  { w: 75, a: 0.6 },
  { w: 68, a: 0.4 },
  { w: 61, a: 0.2 },
  { w: 65, a: 0.1 },
  { w: 61, a: 0.1 },
  { w: 50, a: 0.1 },
];
const peak = 6;

export function FieldCard({ phase }: CardProps) {
  const count = useRamp(phase, 0.05, 0.9, inOut);
  const value = useTransform(count, (v) => (v * 0.43).toFixed(2));
  return (
    <div className="flex h-full flex-col rounded-[15px]">
      <Header title="Electric Field " info right={<ChevronRightIcon />} />
      <div className="flex min-h-0 flex-1 items-end gap-2.5 rounded-b-[8px] bg-[#fff] px-5 py-4">
        <div className="flex h-full w-[112px] shrink-0 flex-col justify-end gap-1">
          <p
            className="font-semibold tracking-[0.16px] whitespace-nowrap"
            style={{ color: "#000" }}
          >
            <motion.span className="text-[24px] tabular-nums">
              {value}
            </motion.span>
            <span className="text-[24px]"> </span>
            <span className="text-[12px]">V/Å</span>
          </p>
          <p
            className="text-[12px] leading-5 tracking-[0.16px]"
            style={{ color: ink.secondary }}
          >
            On average
          </p>
        </div>
        <div className="flex h-full w-[104px] shrink-0 flex-col items-start justify-between">
          {fieldBars.map((b, i) => (
            <FieldBar key={i} phase={phase} index={i} {...b} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FieldBar({
  phase,
  index,
  w,
  a,
}: CardProps & { index: number; w: number; a: number }) {
  const grow = useRamp(phase, Math.abs(index - peak) * 0.05, 0.5);
  return (
    <motion.div
      className="h-1.5 shrink-0 rounded-[50px]"
      style={{
        width: useTransform(grow, (v) => v * w),
        backgroundColor: `rgba(82,128,243,${a})`,
      }}
    />
  );
}

/* ---- Downloadable files ---------------------------------------------------------- */

const files = ["Fixed wild type", "Parameter files", "Constrain files"];

export function FilesCard({ phase }: CardProps) {
  return (
    <div className="flex h-full flex-col rounded-[15px]">
      <div className="flex h-[65px] shrink-0 items-center rounded-t-[8px] bg-[#fff] p-5">
        <p className={t14} style={{ color: ink.primary }}>
          Downloadable files
        </p>
      </div>
      <div className="flex h-[212px] items-end rounded-b-[8px] bg-[#fff] px-5 py-4">
        <div className="flex flex-1 flex-col gap-2">
          {files.map((f, i) => (
            <FileRow key={f} phase={phase} index={i} label={f} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FileRow({
  phase,
  index,
  label,
}: CardProps & { index: number; label: string }) {
  const rise = useRise(phase, index * 0.15, 0.5, 8);
  return (
    <motion.div
      className="flex items-center justify-between rounded-[8px] bg-[#f5f7f9] p-3"
      style={rise}
    >
      <div className="flex items-center gap-2">
        <div className="rounded-[4px] bg-[#d5e4fb] p-2">
          <FileTextIcon />
        </div>
        <p
          className="text-[14px] leading-[18px] tracking-[0.16px] whitespace-nowrap"
          style={{ color: ink.secondary }}
        >
          {label}
        </p>
      </div>
      <div className="rounded-[4px] bg-[#fff] p-2">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d={downloadTray}
            transform="translate(2 10)"
            stroke="#6f6f6f"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <g>
            {downloadArrow.map((v) => (
              <path
                key={v.d}
                d={v.d}
                transform={`translate(${v.at[0]} ${v.at[1]})`}
                stroke="#6f6f6f"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </g>
        </svg>
      </div>
    </motion.div>
  );
}
