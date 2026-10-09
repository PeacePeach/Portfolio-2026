"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { endCaseMorph, morphElapsed, morphTiming as T, useCaseMorph, type CaseMorph } from "@/lib/caseMorph";
import { neo } from "@/components/scenes/neo-advance/frames";
import { NeoHero } from "./neo-advance/NeoHero";
import { HERO, HERO_MIN_UNIT, PRIMARY, PRIMARY_PHONE, SCREEN_SHADOW } from "./neo-advance/hero";

/** The Work tile's design size: its CoverSheet sits 23 px in, in 375-wide phone pixels. */
const TILE = { width: 422, sheetLeft: 23 };
const TILE_RADIUS = 10;
const TILT = (Math.atan2(0.34635, 0.9381) * 180) / Math.PI;

type Rect = { left: number; top: number; width: number; height: number };
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Plays the Work tile → case study transition. Lives in the /work layout, so
 * it stays mounted while the route changes underneath it; the top nav sits
 * above it and never moves.
 *
 *   surface   one blue shape grows from the tile into the hero band
 *             (a clip on a fixed layer, so it never crossfades)
 *   primary   the tile's sheet holds, then turns and settles into its screen
 *   screens   the other screens surface around it, nearest first
 *
 * When it ends, the page's own hero, identical and already in place
 * underneath, takes over.
 */
export function CaseMorphLayer() {
  const m = useCaseMorph();
  return m ? <Morph key={m.start} m={m} /> : null;
}

function Morph({ m }: { m: CaseMorph }) {
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
  const k = m.tile.width / TILE.width; // phone px → screen px on the tile

  const rect = (v: number): Rect => {
    const a = m.tile;
    const b = target.current;
    return {
      left: mix(a.left, b.left, v),
      top: mix(a.top, b.top, v),
      width: mix(a.width, b.width, v),
      height: mix(a.height, b.height, v),
    };
  };

  const clipPath = useTransform(surface, (v) => {
    const r = rect(v);
    const el = layer.current;
    const w = el?.clientWidth ?? window.innerWidth;
    const h = el?.clientHeight ?? window.innerHeight;
    const right = w - r.left - r.width;
    const bottom = h - r.top - r.height;
    return `inset(${r.top}px ${right}px ${bottom}px ${r.left}px round ${mix(TILE_RADIUS, 0, v)}px)`;
  });
  const gLeft = useTransform(surface, (v) => rect(v).left);
  const gTop = useTransform(surface, (v) => rect(v).top);
  const gWidth = useTransform(surface, (v) => rect(v).width);
  const gHeight = useTransform(surface, (v) => rect(v).height);
  const gradient = useMotionValue(1);
  const scene = useMotionValue(1);

  const primaryTransform = useTransform(primary, (v) => {
    const b = target.current;
    const u = unitRef.current;
    const stageLeft = b.left + (b.width - HERO.width * u) / 2;
    const x = mix(m.tile.left + TILE.sheetLeft * k, stageLeft + PRIMARY.x * u, v);
    const y = mix(m.tile.top, b.top + PRIMARY.y * u, v);
    const s = mix(k, (PRIMARY.w / PRIMARY_PHONE.width) * u, v);
    return `translate(${x}px, ${y}px) rotate(${mix(0, TILT, v)}deg) scale(${s})`;
  });
  // The tile shows the screen from its sheet down; the rest of the screen opens up as it travels.
  const crop = useTransform(primary, (v) => {
    const t = Math.min(1, v / 0.6);
    return `inset(${mix(PRIMARY_PHONE.sheetTop, 0, t)}px 0 0 0 round ${mix(PRIMARY_PHONE.sheetRadius, 0, t)}px)`;
  });

  useLayoutEffect(() => {
    const el = band.current;
    if (el) {
      const r = el.getBoundingClientRect();
      target.current = { left: r.left, top: r.top, width: r.width, height: r.height };
      unitRef.current = Math.max(r.width / HERO.width, HERO_MIN_UNIT);
      setUnit(unitRef.current);
    }
    if (m.scene && sceneHost.current) sceneHost.current.appendChild(m.scene);
  }, [m.scene]);

  useEffect(() => {
    const at = (d: number) => Math.max(0, d - enterAt);
    const runs = [
      animate(scene, 0, { delay: at(T.sceneFade.delay), duration: T.sceneFade.duration, ease: "easeOut" }),
      animate(surface, 1, { delay: at(T.surface.delay), duration: T.surface.duration, ease: T.ease }),
      animate(gradient, 0, { delay: at(T.gradient.delay), duration: T.gradient.duration, ease: "easeInOut" }),
      animate(primary, 1, { delay: at(T.primary.delay), duration: T.primary.duration, ease: T.ease }),
    ];
    const timer = window.setTimeout(() => setDone(true), at(T.end) * 1000);
    return () => {
      runs.forEach((r) => r.stop());
      window.clearTimeout(timer);
    };
  }, [enterAt, gradient, primary, scene, surface]);

  // Hand over once the motion has settled and the page's hero is in place; never hang on.
  useEffect(() => {
    if (done && m.landed) endCaseMorph();
  }, [done, m.landed]);
  useEffect(() => {
    const t = window.setTimeout(endCaseMorph, 4000);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div ref={layer} aria-hidden="true" className="pointer-events-none fixed inset-0 z-30">
      <motion.div className="absolute inset-0" style={{ clipPath, background: HERO.blue }}>
        <motion.div
          className="absolute"
          style={{
            left: gLeft,
            top: gTop,
            width: gWidth,
            height: gHeight,
            backgroundImage: neo.tile,
            opacity: gradient,
          }}
        />
        <NeoHero
          bandRef={band}
          blue={false}
          primary={false}
          enterAt={enterAt}
          className="absolute inset-x-0 top-(--spacing-header-bar)"
        />
        <div
          className="absolute inset-0"
          style={{
            filter: `drop-shadow(0 ${SCREEN_SHADOW.y * unit}px ${SCREEN_SHADOW.blur * unit}px rgba(0,0,0,${SCREEN_SHADOW.alpha}))`,
          }}
        >
          <motion.div
            className="absolute top-0 left-0 origin-top-left"
            style={{ width: PRIMARY_PHONE.width, height: PRIMARY_PHONE.height, transform: primaryTransform }}
          >
            <motion.img
              src={PRIMARY.src}
              alt=""
              draggable={false}
              className="size-full max-w-none"
              style={{ clipPath: crop }}
            />
          </motion.div>
        </div>
        <motion.div
          ref={sceneHost}
          className="absolute overflow-hidden"
          style={{ ...m.tile, borderRadius: TILE_RADIUS, opacity: scene }}
        />
      </motion.div>
    </div>
  );
}
