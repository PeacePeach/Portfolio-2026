"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type Ref } from "react";
import { Public_Sans } from "next/font/google";
import { motion } from "motion/react";
import { morphTiming } from "@/lib/caseMorph";
import { BeaconAnalyticsAnimation, linePath } from "@/components/scenes/beacon-analytics/BeaconAnalyticsAnimation";
import { TILE, doneAt } from "@/components/scenes/beacon-analytics/timeline";
import { HERO_MIN_UNIT } from "../neo-advance/hero";

const publicSans = Public_Sans({ subsets: ["latin"], weight: ["400", "600", "700"], display: "swap" });

/**
 * Reimagining Analytics hero: an isometric scene in the Work tile's light
 * blue. The redesigned Analytics Overview (Figma 110:19024) lies on a desktop
 * and a phone, with its cards lifted off the screen in layers; the tile's
 * Views card floats highest, at the centre. Band pixels at 1280 × 485; the
 * band scales with the page and, like Neo's, holds 360 px tall on narrow
 * screens and crops its sides.
 */
export const ANALYTICS_HERO = { width: 1280, height: 485, blue: "#e2faff" } as const;

/** Every layer shares one orthographic tilt: turned on the ground, then tipped back. */
export const ISO = { tip: 52, turn: -38 } as const;
const rad = (d: number) => (d * Math.PI) / 180;
const ORIGIN = { x: 620, y: 250 };

/** Ground point (band px, before the tilt) and height → its centre on screen. */
function project(x: number, y: number, lift = 0) {
  const t = rad(ISO.turn);
  const gx = x * Math.cos(t) - y * Math.sin(t);
  const gy = x * Math.sin(t) + y * Math.cos(t);
  return { x: ORIGIN.x + gx, y: ORIGIN.y + gy * Math.cos(rad(ISO.tip)) - lift };
}
export const isoTransform = (scale = 1) => `scale(${scale}) rotateX(${ISO.tip}deg) rotateZ(${ISO.turn}deg)`;

/** The tile's Views card: centre on screen and size, scaled from the 422 × 314 tile scene. */
export const ANALYTICS_PRIMARY = { ...project(50, 0, 80), scale: 1.05 };

const c = { border: "#e5e6e6", muted: "#4d5056", ink: "#01050e", up: "#3a5de8", down: "#d84a4a", bar: "#809dff", navy: "#0b1533", ground: "rgba(9,45,189,0.18)" };
const card: CSSProperties = { borderColor: c.border, boxShadow: "0 2px 10px rgba(0,0,0,0.08)" };

/** A device body: `depth` px of side wall under the face, drawn as stacked copies of its outline. */
type Slab = { depth: number; radius: number; edge: string };
type Layer = { id: string; x: number; y: number; w: number; h: number; lift: number; order: number; body: ReactNode; slab?: Slab };

const LAYERS: Layer[] = [
  { id: "phone", x: -328, y: -58, w: 140, h: 285, lift: 5, order: 3, body: <Phone />, slab: { depth: 5, radius: 28, edge: "#c9d0d9" } },
  { id: "minutes", x: -150, y: -150, w: 180, h: 86, lift: 40, order: 0, body: <Metric label="Viewed Minutes" value="800" delta="4.5%" down /> },
  { id: "ctr", x: 360, y: -30, w: 160, h: 86, lift: 40, order: 1, body: <Metric label="CTR" value="17%" delta="4.5%" /> },
  { id: "videos", x: 250, y: 125, w: 230, h: 140, lift: 36, order: 2, body: <Videos /> },
  { id: "watched", x: -95, y: 150, w: 180, h: 86, lift: 50, order: 4, body: <Metric label="Avg. % Watched" value="65%" delta="4.5%" /> },
];

export function AnalyticsHero({
  bandRef,
  blue = true,
  primary = true,
  enterAt,
  className = "",
  style,
}: {
  bandRef?: Ref<HTMLDivElement>;
  /** paint the band (the transition paints its own, growing surface) */
  blue?: boolean;
  primary?: boolean;
  /** seconds already elapsed in the Work → case morph; the scene builds up on its clock */
  enterAt?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => setScale(Math.max(el.clientWidth / ANALYTICS_HERO.width, HERO_MIN_UNIT));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const s = scale ?? 1;

  return (
    <div ref={box} className={className} style={style}>
      <div
        ref={bandRef}
        className={`relative overflow-hidden ${publicSans.className}`}
        style={{ height: ANALYTICS_HERO.height * s, background: blue ? ANALYTICS_HERO.blue : undefined }}
      >
        <div
          className="absolute top-0 left-1/2 origin-top"
          style={{
            width: ANALYTICS_HERO.width,
            height: ANALYTICS_HERO.height,
            transform: `translateX(-50%) scale(${s})`,
            visibility: scale === null ? "hidden" : undefined,
          }}
        >
          <Iso x={40} y={0} w={520} h={325} lift={6} slab={{ depth: 6, radius: 14, edge: "#c9d0d9" }} enterAt={enterAt} order={-1}>
            <Desktop />
          </Iso>
          {LAYERS.map((l) => (
            <Iso key={l.id} x={l.x} y={l.y} w={l.w} h={l.h} lift={l.lift} slab={l.slab} enterAt={enterAt} order={l.order}>
              {l.body}
            </Iso>
          ))}
          <Iso x={50} y={0} w={231 * ANALYTICS_PRIMARY.scale} h={206 * ANALYTICS_PRIMARY.scale} lift={0} shadowOnly />
          {primary ? <AnalyticsPrimary /> : null}
        </div>
      </div>
    </div>
  );
}

/** The tile's Views card, tilted into the scene; its ground shadow is drawn by the hero. */
export function AnalyticsPrimary() {
  return (
    <div
      className="absolute"
      style={{
        left: ANALYTICS_PRIMARY.x - TILE.width / 2,
        top: ANALYTICS_PRIMARY.y - TILE.height / 2,
        transform: isoTransform(ANALYTICS_PRIMARY.scale),
      }}
    >
      <BeaconAnalyticsAnimation at={doneAt} rounded={false} bare label="Analytics Views card: 1,500 views, up 4.5%, over a line chart" />
    </div>
  );
}

/** One layer: lifted off the ground, with its soft shadow left on the ground below it. */
function Iso({
  x,
  y,
  w,
  h,
  lift = 0,
  enterAt,
  order = 0,
  shadowOnly = false,
  slab,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  lift?: number;
  enterAt?: number;
  order?: number;
  shadowOnly?: boolean;
  slab?: Slab;
  children?: ReactNode;
}) {
  const ground = project(x, y);
  const top = project(x, y, lift);
  const t = morphTiming.screens;
  const entering = enterAt !== undefined;
  const place = (p: { x: number; y: number }): CSSProperties => ({ left: p.x - w / 2, top: p.y - h / 2, width: w, height: h, transform: isoTransform() });
  const shadow = lift > 0 && (
    <div aria-hidden className="absolute rounded-[16px]" style={{ ...place(ground), background: c.ground, filter: `blur(${10 + lift / 6}px)` }} />
  );
  if (shadowOnly) return shadow || null;
  return (
    <motion.div
      aria-hidden
      className="absolute inset-0"
      initial={entering ? { opacity: 0, y: t.rise } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: t.duration, ease: morphTiming.settle, delay: entering ? Math.max(0, t.delay + Math.max(order, 0) * t.ring - enterAt) : 0 }}
    >
      {shadow}
      {slab &&
        Array.from({ length: slab.depth }, (_, i) => (
          <div
            key={i}
            className="absolute"
            // The bottom copy is darkest, so the wall reads as lit from above.
            style={{ ...place(project(x, y, lift - slab.depth + i)), borderRadius: slab.radius, background: slab.edge, filter: `brightness(${0.85 + (0.3 * i) / slab.depth})` }}
          />
        ))}
      <div className="absolute" style={place(top)}>{children}</div>
    </motion.div>
  );
}

function Desktop() {
  return (
    <div className="size-full rounded-[14px] border border-[#dfe4ea] bg-[#f1f3f6] p-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/case-studies/reimagining-analytics/overview.webp" alt="" draggable={false} className="size-full rounded-[8px] object-cover object-top select-none" />
    </div>
  );
}

function Phone() {
  return (
    <div className="flex size-full flex-col overflow-hidden rounded-[28px] border-[6px] border-[#f1f3f6] bg-[#f4f6fa] outline outline-1 outline-[#dfe4ea]">
      <div className="px-3 pt-4 pb-2 text-[9px] font-bold tracking-[0.06em] text-white" style={{ background: c.navy }}>
        BRIGHTCOVE
        <div className="mt-2 flex gap-3 text-[8px] font-normal tracking-normal text-white/70">
          <span className="border-b border-white pb-1 text-white">Overview</span>
          <span>Channels</span>
          <span>Funnels</span>
        </div>
      </div>
      <div className="m-2 rounded-[10px] border bg-[#fff] p-2.5" style={card}>
        <p className="text-[8px]" style={{ color: c.muted }}>Views</p>
        <p className="text-[16px] leading-5 font-semibold" style={{ color: c.ink }}>
          1,500 <span className="text-[8px] font-bold" style={{ color: c.up }}>↑ 4.5%</span>
        </p>
        <svg viewBox="0 0 165 48" className="mt-2 h-10 w-full" fill="none">
          <path d={linePath} stroke={c.up} strokeWidth={2} strokeLinejoin="round" />
        </svg>
      </div>
      <div className="mx-2 rounded-[10px] border bg-[#fff] p-2.5" style={card}>
        <p className="text-[8px] font-semibold" style={{ color: c.ink }}>Best performing videos</p>
        {[287, 261, 182, 143].map((v) => (
          <div key={v} className="mt-2 flex items-center gap-1.5">
            <span className="h-3 w-4 rounded-[2px] bg-[#c9d3e6]" />
            <span className="h-1 flex-1 rounded-full" style={{ background: c.border }}>
              <span className="block h-full rounded-full" style={{ width: `${(v / 300) * 100}%`, background: c.bar }} />
            </span>
            <span className="text-[7px]" style={{ color: c.ink }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value, delta, down = false }: { label: string; value: string; delta: string; down?: boolean }) {
  return (
    <div className="flex size-full flex-col justify-center gap-1 rounded-[15px] border bg-[#fff] px-4" style={card}>
      <span className="text-[13px] leading-5" style={{ color: c.muted }}>{label}</span>
      <div className="flex items-end gap-1.5">
        <span className="text-[24px] leading-8 font-semibold tracking-[-0.005em]" style={{ color: c.ink }}>{value}</span>
        <span className="pb-1 text-[13px] leading-5 font-bold" style={{ color: down ? c.down : c.up }}>
          {down ? "↓" : "↑"} {delta}
        </span>
      </div>
    </div>
  );
}

function Videos() {
  const rows: [string, number][] = [["How to make spring rolls", 287], ["Webinar 2023 March", 261], ["Cupcake master you can learn", 182], ["10 things to pay attention to", 143]];
  return (
    <div className="flex size-full flex-col justify-center gap-2.5 rounded-[15px] border bg-[#fff] px-4" style={card}>
      <p className="text-[13px] leading-5 font-semibold" style={{ color: c.ink }}>Best performing videos</p>
      {rows.map(([label, views]) => (
        <div key={label} className="flex items-center gap-2 text-[11px] leading-4" style={{ color: c.ink }}>
          <span className="w-[110px] truncate">{label}</span>
          <span className="h-1 flex-1 rounded-full" style={{ background: c.border }}>
            <span className="block h-full rounded-full" style={{ width: `${(views / 300) * 100}%`, background: `linear-gradient(90deg, ${c.bar}, ${c.up})` }} />
          </span>
          <span className="w-6 text-right">{views}</span>
        </div>
      ))}
    </div>
  );
}
