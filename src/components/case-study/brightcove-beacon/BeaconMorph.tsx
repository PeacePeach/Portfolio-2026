"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { endCaseMorph, morphElapsed, morphTiming as T, type CaseMorph } from "@/lib/caseMorph";
import { TILE } from "@/components/scenes/brightcove/timeline";
import { BeaconHero } from "./BeaconHero";
import { BEACON_HERO, BEACON_HERO_MIN_UNIT, BEACON_PRIMARY, PRIMARY_FULL, SCREEN_RADIUS, SHADOW_LAYERS, SHADOW_TINT, TILE_SHOT, TILT } from "./hero";

const TILE_RADIUS = 10;
const rad = (TILT * Math.PI) / 180;
type Rect = { left: number; top: number; width: number; height: number };
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Work tile → Brightcove Beacon, on Neo's clock (see CaseMorphLayer): the
 * tile's sand surface grows into the hero band, the tile's TV Series
 * screenshot turns and settles into the page type editor (the same layout),
 * cropping to the hero's framing and crossfading to that screen as it
 * travels, and the other screens surface around it.
 */
export function BeaconMorph({ m }: { m: CaseMorph }) {
  const layer = useRef<HTMLDivElement>(null);
  const band = useRef<HTMLDivElement>(null);
  const sceneHost = useRef<HTMLDivElement>(null);
  const target = useRef<Rect>(m.tile);
  const [unit, setUnit] = useState(1);
  const unitRef = useRef(1);
  const [enterAt] = useState(() => morphElapsed(m));
  const [done, setDone] = useState(false);

  const surface = useMotionValue(0);
  const primary = useMotionValue(0);
  const scene = useMotionValue(1);
  const k = m.tile.width / TILE.width; // tile px → screen px

  const rect = (v: number): Rect => {
    const a = m.tile;
    const b = target.current;
    return { left: mix(a.left, b.left, v), top: mix(a.top, b.top, v), width: mix(a.width, b.width, v), height: mix(a.height, b.height, v) };
  };
  const clipPath = useTransform(surface, (v) => {
    const r = rect(v);
    const w = layer.current?.clientWidth ?? window.innerWidth;
    const h = layer.current?.clientHeight ?? window.innerHeight;
    return `inset(${r.top}px ${w - r.left - r.width}px ${h - r.top - r.height}px ${r.left}px round ${mix(TILE_RADIUS, 0, v)}px)`;
  });

  // The whole screenshot, PRIMARY_FULL band px wide, about its top-left corner: from the tile, flat, to the primary's place, turned.
  const startScale = (TILE_SHOT.width * k) / PRIMARY_FULL.width;
  const endScale = () => unitRef.current;
  const flight = useTransform(primary, (v) => {
    const b = target.current;
    const u = unitRef.current;
    const stageLeft = b.left + (b.width - BEACON_HERO.width * u) / 2;
    // the screenshot's corner sits up and left of the cropped screen's corner, along the turned axes
    const dx = -PRIMARY_FULL.crop.left * PRIMARY_FULL.width;
    const dy = -PRIMARY_FULL.crop.top * PRIMARY_FULL.height;
    const ex = BEACON_PRIMARY.x + Math.cos(rad) * dx - Math.sin(rad) * dy;
    const ey = BEACON_PRIMARY.y + Math.sin(rad) * dx + Math.cos(rad) * dy;
    const x = mix(m.tile.left + TILE_SHOT.left * k, stageLeft + ex * u, v);
    const y = mix(m.tile.top + TILE_SHOT.top * k, b.top + ey * u, v);
    return `translate(${x}px, ${y}px) rotate(${mix(0, TILT, v)}deg) scale(${mix(startScale, endScale(), v)})`;
  });
  // The tile shows the whole screenshot; it crops to the hero's framing as it travels.
  const swap = useTransform(primary, [0.25, 0.75], [0, 1]);
  const crop = useTransform(primary, (v) => {
    const t = Math.min(1, v / 0.6);
    const radius = mix(TILE_RADIUS * k / startScale, SCREEN_RADIUS, v);
    return `inset(${mix(0, PRIMARY_FULL.crop.top * PRIMARY_FULL.height, t)}px 0 0 ${mix(0, PRIMARY_FULL.crop.left * PRIMARY_FULL.width, t)}px round ${radius}px)`;
  });

  useLayoutEffect(() => {
    const el = band.current;
    if (el) {
      const r = el.getBoundingClientRect();
      target.current = { left: r.left, top: r.top, width: r.width, height: r.height };
      unitRef.current = Math.max(r.width / BEACON_HERO.width, BEACON_HERO_MIN_UNIT);
      setUnit(unitRef.current);
    }
    if (m.scene && sceneHost.current) sceneHost.current.appendChild(m.scene);
  }, [m.scene]);

  useEffect(() => {
    const at = (d: number) => Math.max(0, d - enterAt);
    const runs = [
      animate(scene, 0, { delay: at(T.sceneFade.delay), duration: T.sceneFade.duration, ease: "easeOut" }),
      animate(surface, 1, { delay: at(T.surface.delay), duration: T.surface.duration, ease: T.ease }),
      animate(primary, 1, { delay: at(T.primary.delay), duration: T.primary.duration, ease: T.ease }),
    ];
    const timer = window.setTimeout(() => setDone(true), at(T.end) * 1000);
    return () => {
      runs.forEach((r) => r.stop());
      window.clearTimeout(timer);
    };
  }, [enterAt, primary, scene, surface]);

  // Hand over once the motion has settled and the page's hero is in place; never hang on.
  useEffect(() => {
    if (done && m.landed) endCaseMorph();
  }, [done, m.landed]);
  useEffect(() => {
    const t = window.setTimeout(endCaseMorph, 4000);
    return () => window.clearTimeout(t);
  }, []);

  // the hero's screen shadow, in screen space (it points straight down either way)
  const shadow = SHADOW_LAYERS.map((l) => `drop-shadow(0 ${l.y * unit}px ${(l.blur / 2) * unit}px rgba(${SHADOW_TINT},${l.alpha}))`).join(" ");
  return (
    <div ref={layer} aria-hidden="true" className="pointer-events-none fixed inset-0 z-30">
      <motion.div className="absolute inset-0" style={{ clipPath, background: BEACON_HERO.background }}>
        <BeaconHero bandRef={band} paint={false} primary={false} enterAt={enterAt} className="absolute inset-x-0 top-(--spacing-header-bar)" />
        <div className="absolute inset-0" style={{ filter: shadow }}>
          <motion.div
            className="absolute top-0 left-0 origin-top-left"
            style={{ width: PRIMARY_FULL.width, height: PRIMARY_FULL.height, transform: flight }}
          >
            <motion.div className="relative size-full" style={{ clipPath: crop }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={PRIMARY_FULL.from} alt="" draggable={false} className="absolute inset-0 size-full max-w-none" />
              <motion.img src={PRIMARY_FULL.to} alt="" draggable={false} className="absolute inset-0 size-full max-w-none" style={{ opacity: swap }} />
            </motion.div>
          </motion.div>
        </div>
        <motion.div ref={sceneHost} className="absolute overflow-hidden" style={{ ...m.tile, borderRadius: TILE_RADIUS, opacity: scene }} />
      </motion.div>
    </div>
  );
}
