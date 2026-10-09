"use client";

/**
 * Neo Advance tile animation (Figma 31:6146, "Animation 1"), reproduced as
 * static frames in HTML/CSS/SVG. All values are in the 422 × 314 tile's own
 * pixels; wrap a frame in <SceneStage width={422} height={314}> to scale it.
 *
 * The five frames, left to right in Figma:
 *   1. cover      Transfer sheet: "Neo Advance will cover you" (Group 4)
 *   2. continue   Same sheet scrolled up 264 px to the Continue button (Group 5)
 *   3. unlocked   "You've unlocked a higher limit!" screen (Group 10)
 *   4. limit-75   Current limit card, $75, bar 25% (Group 8)
 *   5. limit-200  Same card, $200, bar ~50% (Group 9)
 *
 * The product UI uses Neo's own type (TT Commons Pro, not licensed here), so
 * text is set in the site's Geist at Neo's sizes and weights. Colours mirror
 * Neo's tokens and stay local to this scene.
 *
 * The surfaces take optional Motion styles so NeoAdvanceAnimation can drive
 * the same markup through one continuous loop.
 */

import type { ReactNode } from "react";
import { motion, type MotionStyle } from "motion/react";
import { neo, neoFrames, NEO_TILE, type NeoFrame } from "./frames";

const limits = {
  "limit-75": { amount: "$75", progress: 0.25 },
  "limit-200": { amount: "$200", progress: 0.5015 },
} as const;

export function NeoAdvanceScene({ frame }: { frame: NeoFrame }) {
  return (
    <div
      className="relative overflow-hidden rounded-[15px] font-sans"
      style={{ width: NEO_TILE.width, height: NEO_TILE.height, backgroundImage: neo.tile }}
      role="img"
      aria-label={neoFrames.find((f) => f.id === frame)?.label}
    >
      {/* Figma's "Group 3" drop shadow sits on whichever phone surface is showing. */}
      <div className="absolute inset-0" style={{ filter: neo.groupShadow }}>
        {frame === "cover" || frame === "continue" ? <CoverSheet top={frame === "cover" ? 53 : -211} /> : null}
        {frame === "unlocked" ? <UnlockedScreen /> : null}
        {frame === "limit-75" || frame === "limit-200" ? <LimitCard {...limits[frame]} /> : null}
      </div>
    </div>
  );
}

/* ---- Frames 1 & 2: transfer bottom sheet ------------------------------ */

export function CoverSheet({ top, style, buttonStyle }: { top: number; style?: MotionStyle; buttonStyle?: MotionStyle }) {
  return (
    <motion.div
      className="absolute left-[23px] flex h-[458px] w-[375px] flex-col overflow-hidden rounded-[15px]"
      style={{ top, background: neo.bg, boxShadow: neo.sheetShadow, ...style }}
    >
      <div className="flex flex-col items-center gap-8 py-6">
        <div className="flex flex-col items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/scenes/neo-advance/shield.svg" alt="" width={56} height={56} />
          <div className="flex w-[335px] flex-col gap-3 text-center">
            <p className="text-[20px] leading-[25px] font-semibold tracking-[-0.4px]" style={{ color: "#000" }}>
              Neo Advance will cover you
            </p>
            <p className="text-[14px] leading-[17.5px] font-medium" style={{ color: neo.subdued }}>
              There’s not enough funds in your account to send. Don’t worry—the rest is covered by your advance.
            </p>
          </div>
        </div>

        <div className="flex w-[335px] flex-col gap-2 rounded-[12px] p-5" style={{ background: neo.surface }}>
          <Metric label="From Chequing" value="$0.00" />
          <Metric label="From Advance" value="$60.00" />
          <Metric label="Total transfer amount" value="$60.00" strong />
        </div>
      </div>

      <div className="mt-auto">
        <div className="p-5">
          <motion.div
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-[12px] p-4 text-[16px] leading-5 font-semibold text-white"
            style={{ background: neo.ink, ...buttonStyle }}
          >
            Continue
            <ArrowLongForward />
          </motion.div>
        </div>
        <div className="relative h-[34px]" style={{ background: neo.bg }}>
          <div className="absolute bottom-2 left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full" style={{ background: "#000" }} />
        </div>
      </div>
    </motion.div>
  );
}

function Metric({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between text-[14px] ${strong ? "leading-5 font-semibold" : "leading-[17.5px] font-medium"}`}
    >
      <span style={{ color: strong ? neo.ink : neo.subdued }}>{label}</span>
      <span style={{ color: neo.ink }}>{value}</span>
    </div>
  );
}

/** Neo "arrow-long-forward", 20 px. */
function ArrowLongForward() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        transform="translate(16.67 3.68) scale(-1 1)"
        fill="currentColor"
        fillRule="evenodd"
        d="M 12.154826820424715 5.487333536148071 L 2.84649385002115 5.487333536148071 L 6.91482685966662 1.4190000295639038 C 7.23959013485139 1.0936791449785233 7.23959013485139 0.5668208996454875 6.91482685966662 0.24150001506010693 L 6.910660097734506 0.24150001506010693 C 6.585824303567034 -0.08050002157688141 6.062162991008655 -0.08050002157688141 5.737327196841184 0.24150001506010693 L 0.24232724709270795 5.737333297729492 C -0.08077574075247998 6.062364503741264 -0.08077574075247998 6.587301964561145 0.24232724709270795 6.912333170572917 L 5.7381604697547495 12.40399996439616 C 6.063191667811227 12.727102960149448 6.588129115783012 12.727102960149448 6.91316031383949 12.40399996439616 L 6.91316031383949 12.40399996439616 C 7.236263301684678 12.078968758384388 7.236263301684678 11.554031297564507 6.91316031383949 11.229000091552734 L 2.84649385002115 7.1539998054504395 L 12.154826820424715 7.1539998054504395 C 12.615064123463902 7.1539998054504395 12.988160133361816 6.780904183785121 12.988160133361816 6.320666869481405 L 12.988160133361816 6.320666869481405 C 12.988160133361816 5.8604295551776895 12.615064123463902 5.487333536148071 12.154826820424715 5.487333536148071 Z"
      />
    </svg>
  );
}

/* ---- Frame 3: higher limit unlocked --------------------------------------- */

function UnlockedScreen() {
  return (
    <div
      className="absolute top-[26px] left-[22.5px] h-[1000px] w-[376px] overflow-hidden rounded-[20px]"
      style={{ background: neo.bg }}
    >
      <UnlockedBody />
    </div>
  );
}

/** Contents of the unlocked screen, laid out from the screen's top-left. */
export function UnlockedBody({
  gift = <GiftImage />,
  giftStyle,
  headlineStyle,
  restStyle,
}: {
  gift?: ReactNode;
  giftStyle?: MotionStyle;
  headlineStyle?: MotionStyle;
  restStyle?: MotionStyle;
}) {
  return (
    <div className="absolute top-[38px] left-5 flex w-[335px] flex-col items-center gap-10">
      <div className="flex flex-col items-center gap-6">
        <div className="flex w-[335px] flex-col items-center gap-8">
          <motion.div className="size-[112px]" style={giftStyle}>
            {gift}
          </motion.div>
          <motion.p
            className="text-center text-[28px] leading-[35px] font-semibold tracking-[-0.56px]"
            style={{ color: "#000", ...headlineStyle }}
          >
            You’ve unlocked a higher limit!
          </motion.p>
        </div>
        <motion.span
          className="rounded-full px-3 py-2 text-[14px] leading-[17.5px]"
          style={{ background: neo.surface, color: neo.ink, ...restStyle }}
        >
          Expires April 15, 2026
        </motion.span>
      </div>

      <motion.div className="flex w-[335px] flex-col gap-4" style={restStyle}>
        <p className="text-[16px] leading-5 font-semibold tracking-[-0.32px]" style={{ color: "#000" }}>
          Neo Advance
        </p>
        <div className="overflow-hidden rounded-[12px]" style={{ background: neo.surface }}>
          <div className="flex items-center pl-5">
            <div className="py-5 pr-4">
              <div
                className="grid size-10 place-items-center rounded-[8px] border-[0.5px]"
                style={{ background: neo.bg, borderColor: neo.border }}
              >
                <MoneyIcon />
              </div>
            </div>
            <p className="py-5 pr-5 text-[16px] leading-5" style={{ color: neo.ink }}>
              Neo Chequing
            </p>
          </div>
          <div className="pl-5">
            <div className="h-px" style={{ background: neo.border }} />
          </div>
          <LimitRow label="Current limit" value="$50" divider />
          <LimitRow label="New limit" value="$60" action="Edit" />
        </div>
      </motion.div>
    </div>
  );
}

function GiftImage() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/scenes/neo-advance/gift.svg" alt="" width={112} height={112} />;
}

function LimitRow({ label, value, action, divider = false }: { label: string; value: string; action?: string; divider?: boolean }) {
  return (
    <div className="pl-5">
      <div
        className="flex min-h-[60px] items-center gap-4 py-5 pr-5"
        style={divider ? { borderBottom: `0.5px solid ${neo.border}` } : undefined}
      >
        <div className="flex flex-1 flex-col gap-1">
          <span className="text-[14px] leading-[17.5px]" style={{ color: neo.subdued }}>
            {label}
          </span>
          <span className="text-[16px] leading-5" style={{ color: "#000" }}>
            {value}
          </span>
        </div>
        {action ? (
          <span className="text-[16px] leading-5" style={{ color: neo.info }}>
            {action}
          </span>
        ) : null}
      </div>
    </div>
  );
}

/** Neo "account / money", 24 px, grey gradient. */
function MoneyIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <defs>
        <linearGradient id="neo-money" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#999999" />
          <stop offset="1" stopColor="#111111" />
        </linearGradient>
      </defs>
      <path
        transform="translate(2 2)"
        fill="url(#neo-money)"
        d="M 10 0 C 4.480000019073486 0 0 4.480000019073486 0 10 C 0 15.519999980926514 4.480000019073486 20 10 20 C 15.519999980926514 20 20 15.519999980926514 20 10 C 20 4.480000019073486 15.519999980926514 0 10 0 Z M 11.40999984741211 16.09000015258789 L 11.40999984741211 16.670000076293945 C 11.40999984741211 17.40000009536743 10.809999942779541 18 10.079999923706055 18 L 10.069999694824219 18 C 9.339999675750732 18 8.739999771118164 17.40000009536743 8.739999771118164 16.670000076293945 L 8.739999771118164 16.06999969482422 C 7.40999972820282 15.789999693632126 6.230000019073486 15.059999942779541 5.730000019073486 13.829999923706055 C 5.500000014901161 13.279999911785126 5.9299997091293335 12.670000076293945 6.529999732971191 12.670000076293945 L 6.770000457763672 12.670000076293945 C 7.1400004625320435 12.670000076293945 7.439999923110008 12.920000463724136 7.579999923706055 13.270000457763672 C 7.869999915361404 14.020000457763672 8.630000114440918 14.540000915527344 10.09000015258789 14.540000915527344 C 12.050000190734863 14.540000915527344 12.489999771118164 13.559999823570251 12.489999771118164 12.949999809265137 C 12.489999771118164 12.119999825954437 12.049999713897705 11.34000039100647 9.819999694824219 10.8100004196167 C 7.339999675750732 10.210000395774841 5.639999866485596 9.190000295639038 5.639999866485596 7.140000343322754 C 5.639999866485596 5.420000314712524 7.0299999713897705 4.299999833106995 8.75 3.929999828338623 L 8.75 3.3299999237060547 C 8.75 2.5999999046325684 9.349999904632568 2 10.079999923706055 2 L 10.09000015258789 2 C 10.820000171661377 2 11.420000076293945 2.5999999046325684 11.420000076293945 3.3299999237060547 L 11.420000076293945 3.9499998092651367 C 12.800000071525574 4.289999812841415 13.669999241828918 5.150000095367432 14.049999237060547 6.210000038146973 C 14.24999924004078 6.760000050067902 13.82999974489212 7.340000152587891 13.239999771118164 7.340000152587891 L 12.979999542236328 7.340000152587891 C 12.609999537467957 7.340000152587891 12.310000039637089 7.080000281333923 12.210000038146973 6.720000267028809 C 11.980000033974648 5.960000276565552 11.350000143051147 5.46999979019165 10.09000015258789 5.46999979019165 C 8.59000015258789 5.46999979019165 7.689999580383301 6.149999678134918 7.689999580383301 7.109999656677246 C 7.689999580383301 7.949999630451202 8.339999675750732 8.500000476837158 10.359999656677246 9.020000457763672 C 12.37999963760376 9.540000438690186 14.540000915527344 10.410000324249268 14.540000915527344 12.930000305175781 C 14.520000915974379 14.760000348091125 13.149999856948853 15.760000139474869 11.40999984741211 16.09000015258789 L 11.40999984741211 16.09000015258789 Z"
      />
    </svg>
  );
}

/* ---- Frames 4 & 5: current limit card -------------------------------------- */

function LimitCard({ amount, progress }: { amount: string; progress: number }) {
  return (
    <div className="absolute top-[88px] left-[43px] w-[336px] rounded-[12px]" style={{ background: neo.surface }}>
      <LimitBody amount={amount} progress={`${progress * 100}%`} />
    </div>
  );
}

/** Current limit card contents: 336 × 137 with the card's 20 px padding. */
export function LimitBody({
  amount,
  progress,
  enter = [],
}: {
  amount: ReactNode;
  /** fill width, e.g. "25%" */
  progress: MotionStyle["width"];
  /** styles for label, amount, bar and predicted limit, in that order */
  enter?: (MotionStyle | undefined)[];
}) {
  return (
    <div className="flex w-[336px] flex-col gap-5 p-5">
      <div className="flex flex-col gap-2">
        <motion.span className="text-[16px] leading-5" style={{ color: neo.subdued, ...enter[0] }}>
          Current limit
        </motion.span>
        <motion.span
          className="text-[20px] leading-[25px] font-semibold tracking-[-0.4px] tabular-nums"
          style={{ color: "#000", ...enter[1] }}
        >
          {amount}
        </motion.span>
      </div>
      <div className="flex flex-col items-end gap-1">
        <motion.div
          className="relative h-[5px] w-full overflow-hidden rounded-full"
          style={{ background: neo.track, ...enter[2] }}
        >
          <motion.div className="absolute inset-y-0 left-0" style={{ width: progress, backgroundImage: neo.fill }} />
        </motion.div>
        <motion.span
          className="w-full text-right text-[12px] leading-[15px] font-medium"
          style={{ color: neo.subdued, ...enter[3] }}
        >
          Predicted limit: $300
        </motion.span>
      </div>
    </div>
  );
}
