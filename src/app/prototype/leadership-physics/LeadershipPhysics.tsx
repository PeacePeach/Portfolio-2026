"use client";

import { useEffect, useRef } from "react";

const TAU = Math.PI * 2;

/*
 * Leadership physics: an isolated experiment (not production code, not shared).
 *
 * Composition follows Figma 174:2747 (Group 636517): Ambiguity is the broad outer
 * field; Calibration, Cohesion and Direction overlap inside it; COMPLEXITY sits in
 * the overlap. Each boundary is a ring of radial springs around a drifting centre:
 * every ring point eases toward an organic, slowly changing target (the Figma
 * contour plus moving harmonics) and is coupled to its neighbours (rope / water
 * membrane feel). Labelled nodes push ring points outward on contact (local bulge,
 * capped) and are then hard-clamped inside their own boundary and inside
 * Ambiguity, so they can never escape. When the pressure goes, the springs ease
 * the ring back.
 *
 * Plain Canvas 2D + a small hand-written solver: no new dependency.
 */

const RING_POINTS = 160;
const CLEARANCE = 2; // min visual gap between a node outline and every boundary holding it (px)
const COS = Float32Array.from({ length: RING_POINTS }, (_, i) => Math.cos((i / RING_POINTS) * TAU));
const SIN = Float32Array.from({ length: RING_POINTS }, (_, i) => Math.sin((i / RING_POINTS) * TAU));

// Colours mirror globals.css tokens (canvas cannot read Tailwind classes).
const C = {
  background: "#0e0e0e",
  primary: "#f0efec",
  secondary: "#c3c2b8",
  highlight: "#2d54dd",
};

/*
 * Geometry in Figma units, measured from the 1019 x 483 diagram group and
 * centred on its middle (510, 228). Contours are rotated ellipses, with a static
 * lobe where the Figma contour is irregular. Label: contour angle (ellipse-local
 * angle + rotation, screen space) and how far inside the contour the label sits.
 */
const FIGMA_CENTRE = { x: 510, y: 228 };
const FIGMA_BOX = { w: 980, h: 445 }; // diagram + room for bulges

type Shape = {
  label: string;
  cx: number;
  cy: number;
  a: number;
  b: number;
  rot: number;
  lobe?: { ang: number; amt: number; width: number }; // ellipse-local angle
  labelAt: number; // screen angle of the label centre on the contour (landscape)
};

const SHAPES: Shape[] = [
  { label: "Ambiguity", cx: 510, cy: 228, a: 468, b: 198, rot: -0.1, labelAt: -Math.PI / 2 },
  {
    label: "Calibration",
    cx: 290,
    cy: 222,
    a: 222,
    b: 78,
    rot: -0.12,
    lobe: { ang: -0.35, amt: 0.32, width: 0.35 },
    labelAt: -2.6,
  },
  { label: "Cohesion", cx: 650, cy: 180, a: 312, b: 98, rot: -0.1, labelAt: -0.32 },
  {
    label: "Direction",
    cx: 530,
    cy: 282,
    a: 280,
    b: 100,
    rot: 0,
    lobe: { ang: -2.0, amt: 0.18, width: 0.5 },
    labelAt: 2.05, // lower-left edge, clear of the converging lines at lower right
  },
];

const COMPLEXITY_AT = { x: 455, y: 228 };

// Figma toolkit nodes: centre (Figma units), diameter, boundary index into SHAPES.
// `ring` is the node's home region; `also` lists extra regions it must stay inside
// at the same time (intersection-only nodes). Every node is also inside Ambiguity.
const NODES: { label: string; x: number; y: number; d: number; ring: number; also?: number[] }[] = [
  // Calibration
  { label: "Insight", x: 221, y: 202, d: 52.4, ring: 1 },
  { label: "Validation", x: 287, y: 184, d: 52.4, ring: 1 },
  { label: "Critique", x: 407, y: 160, d: 52.4, ring: 1, also: [2] }, // Calibration ∩ Cohesion
  { label: "Judgment", x: 283, y: 229, d: 52.4, ring: 1 },
  { label: "Iteration", x: 214, y: 252, d: 52.4, ring: 1 },
  { label: "Outcomes", x: 149, y: 200, d: 52.4, ring: 1 },
  // Cohesion
  { label: "People", x: 560, y: 125, d: 52.4, ring: 2 },
  { label: "Facilitation", x: 720, y: 125, d: 59.9, ring: 2 },
  { label: "Mentorship", x: 647, y: 157, d: 64.4, ring: 2 },
  { label: "Communication", x: 765, y: 175, d: 81.1, ring: 2 },
  { label: "Trust", x: 855, y: 172, d: 52.4, ring: 2 },
  { label: "Alignment", x: 591, y: 236, d: 52.4, ring: 2, also: [3] }, // Cohesion ∩ Direction
  // Direction
  { label: "Vision", x: 462, y: 310, d: 52.4, ring: 3 },
  { label: "Systems", x: 542, y: 310, d: 52.4, ring: 3 },
  { label: "Strategy", x: 630, y: 318, d: 52.4, ring: 3 },
  { label: "Framing", x: 700, y: 310, d: 52.4, ring: 3 },
  { label: "Journeys", x: 494, y: 360, d: 52.4, ring: 3 },
  { label: "Trade-offs", x: 358, y: 268, d: 52.4, ring: 3, also: [1] }, // Direction ∩ Calibration
];

type Ring = {
  shape: Shape;
  ax: number; // home centre (screen)
  ay: number;
  cx: number; // drifting centre
  cy: number;
  R: number; // scale reference for drift, bulge cap and pressure
  base: Float32Array; // Figma contour radius per angle (screen space)
  rho: Float32Array; // current radius per angle
  vel: Float32Array;
  target: Float32Array;
  harm: { k: number; a: number; w: number; p: number }[];
  drift: { fx: number; fy: number; px: number; py: number };
  pressure: number; // 0..1, for stroke emphasis
};

type Node = {
  label: string;
  ring: number;
  bounds: number[]; // every boundary the whole node (+ CLEARANCE) must stay inside
  hx: number; // home (Figma position), follows its ring's drift
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  wander: number; // wander heading
  hot: number; // 0..1 hover/drag blend
};

function rand(seed: number) {
  // deterministic so server/client and reloads look the same
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function wrapAngle(a: number) {
  a = (a + Math.PI) % TAU;
  if (a < 0) a += TAU;
  return a - Math.PI;
}

/** Radius of a ring at an arbitrary angle, linearly interpolated. */
function rhoAt(ring: Ring, angle: number) {
  let a = angle % TAU;
  if (a < 0) a += TAU;
  const f = (a / TAU) * RING_POINTS;
  const i = Math.floor(f) % RING_POINTS;
  const j = (i + 1) % RING_POINTS;
  const t = f - Math.floor(f);
  return ring.rho[i] * (1 - t) + ring.rho[j] * t;
}

/** Complexity: one smooth, slowly turning vector field over the whole diagram. */
function field(x: number, y: number, t: number, scale: number) {
  const s = 1 / scale;
  const a =
    Math.sin(x * s * 1.3 + t * 0.11) +
    Math.cos(y * s * 1.7 - t * 0.08) +
    Math.sin((x + y) * s * 0.9 + t * 0.05);
  return a * 1.2;
}

export function LeadershipPhysics({
  label = "Ambiguity as the outer field, with overlapping Calibration, Cohesion and Direction boundaries holding draggable labelled nodes, and Complexity in the overlap.",
}: { label?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const statsRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = reduceQuery.matches;
    const showStats = new URLSearchParams(window.location.search).has("stats");

    let W = 0;
    let H = 0;
    let dpr = 1;
    let unit = 1; // layout scale (px)
    let s = 1; // Figma units -> px
    let portrait = false; // phones: the composition turns 90 degrees
    let nodeFont = 11;
    let labelFont = 12;
    let fontFamily = "sans-serif";
    let rings: Ring[] = [];
    let glyphWidths: Record<string, number> = {};
    const LABEL_TRACKING = 1.2;
    let nodes: Node[] = [];
    let time = 0;

    const pointer = { x: -1e4, y: -1e4, inside: false };
    let hover: Node | null = null;
    let drag: Node | null = null;
    let dragOffset = { x: 0, y: 0 };

    // ---- Layout ------------------------------------------------------------

    /** Figma point -> canvas point (rotated a quarter turn in portrait). */
    function toScreen(x: number, y: number) {
      const u = (x - FIGMA_CENTRE.x) * s;
      const v = (y - FIGMA_CENTRE.y) * s;
      return portrait ? { x: W / 2 - v, y: H / 2 + u } : { x: W / 2 + u, y: H / 2 + v };
    }
    const turn = () => (portrait ? Math.PI / 2 : 0);

    /** Width decides scale; the canvas hugs the diagram (FIGMA_BOX already holds the bulge room), so page spacing stays the template's. */
    function measure(width: number) {
      portrait = width < 640;
      if (portrait) {
        s = Math.min(1, width / (FIGMA_BOX.h + 110));
        return Math.round(FIGMA_BOX.w * s + 70);
      }
      s = Math.min(1.05, (width - 60) / FIGMA_BOX.w);
      return Math.round(FIGMA_BOX.h * s + 20);
    }

    function build() {
      const rnd = rand(7);
      rings = SHAPES.map((shape) => {
        const c = toScreen(shape.cx, shape.cy);
        const rot = shape.rot + turn();
        const base = new Float32Array(RING_POINTS);
        for (let i = 0; i < RING_POINTS; i++) {
          const local = (i / RING_POINTS) * TAU - rot;
          const ca = Math.cos(local) * shape.b;
          const sa = Math.sin(local) * shape.a;
          let r = (shape.a * shape.b) / Math.hypot(ca, sa);
          if (shape.lobe) {
            const d = wrapAngle(local - shape.lobe.ang) / shape.lobe.width;
            r *= 1 + shape.lobe.amt * Math.exp(-d * d);
          }
          base[i] = r * s;
        }
        // Slight, fixed asymmetry on the rest contour, so it reads as a drawn ellipse rather than a perfect one.
        const dents = [0, 1, 2, 3].map(() => ({ ang: rnd() * TAU, amt: -0.025 + rnd() * 0.06, width: 0.45 + rnd() * 0.3 }));
        for (let i = 0; i < RING_POINTS; i++) {
          const th = (i / RING_POINTS) * TAU;
          let m = 1;
          for (const d of dents) {
            const x = wrapAngle(th - d.ang) / d.width;
            m += d.amt * Math.exp(-x * x);
          }
          base[i] *= m;
        }
        const ring: Ring = {
          shape,
          ax: c.x,
          ay: c.y,
          cx: c.x,
          cy: c.y,
          R: 100 * s,
          base,
          rho: new Float32Array(base),
          vel: new Float32Array(RING_POINTS),
          target: new Float32Array(RING_POINTS),
          harm: [2, 3, 4, 5].map((k) => ({
            k,
            a: ((shape.label === "Ambiguity" ? 0.035 : 0.02) / (k - 1)) * (0.7 + rnd() * 0.6),
            w: (0.12 + rnd() * 0.18) * (rnd() < 0.5 ? -1 : 1),
            p: rnd() * TAU,
          })),
          drift: { fx: 0.05 + rnd() * 0.04, fy: 0.04 + rnd() * 0.04, px: rnd() * TAU, py: rnd() * TAU },
          pressure: 0,
        };
        return ring;
      });

      ctx.font = `500 ${labelFont}px ${fontFamily}`;
      glyphWidths = {};
      for (const t of [...SHAPES.map((sh) => sh.label.toUpperCase()), "COMPLEXITY"])
        for (const ch of t) glyphWidths[ch] = ctx.measureText(ch).width + LABEL_TRACKING;

      // Node size: the Figma diameter, grown where needed so the label fits.
      ctx.font = `400 ${nodeFont}px ${fontFamily}`;
      nodes = NODES.map((n) => {
        const p = toScreen(n.x, n.y);
        const fit = ctx.measureText(n.label).width / 2 + 6;
        return {
          label: n.label,
          ring: n.ring,
          bounds: [n.ring, ...(n.also ?? []), 0],
          hx: p.x,
          hy: p.y,
          x: p.x,
          y: p.y,
          vx: 0,
          vy: 0,
          r: Math.max((n.d / 2) * s, fit),
          wander: rnd() * TAU,
          hot: 0,
        };
      });
      updateTargets();
      rings.forEach((r) => r.rho.set(r.target));

      // Intersection-only nodes rest at the roomiest point of their own overlap:
      // farthest from both of its contours and, where there is room, outside the
      // third region, so the three don't all pile into the central triple overlap.
      for (const n of nodes) {
        if (n.bounds.length < 3) continue;
        const [a, b] = n.bounds;
        const c = [1, 2, 3].find((k) => k !== a && k !== b)!;
        const pick = (exclusive: boolean) => {
          let best = -Infinity;
          let at = { x: n.hx, y: n.hy };
          for (let y = n.hy - 200 * s; y <= n.hy + 200 * s; y += 4) {
            for (let x = n.hx - 200 * s; x <= n.hx + 200 * s; x += 4) {
              let room = Math.min(roomIn(rings[a], x, y), roomIn(rings[b], x, y));
              if (exclusive) room = Math.min(room, -roomIn(rings[c], x, y));
              if (room > best) {
                best = room;
                at = { x, y };
              }
            }
          }
          return { best, at };
        };
        let home = pick(true);
        if (home.best < n.r + CLEARANCE) home = pick(false);
        n.hx = n.x = home.at.x;
        n.hy = n.y = home.at.y;
      }
    }

    function resize() {
      const width = Math.max(1, wrap.getBoundingClientRect().width);
      const height = measure(width);
      const changed = width !== W || height !== H;
      W = width;
      H = height;
      wrap.style.height = `${H}px`;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      unit = Math.min(W, H);
      nodeFont = Math.min(11, Math.max(9, 10.5 * s));
      labelFont = Math.min(10.5, Math.max(9, 10 * s));
      fontFamily = getComputedStyle(document.body).fontFamily || "sans-serif";
      // Prototype: a new size simply rebuilds the composition.
      if (changed || !rings.length) build();
    }

    // ---- Physics -----------------------------------------------------------

    function updateTargets() {
      const t = reduced ? 0 : time;
      for (const ring of rings) {
        const dx = Math.sin(t * ring.drift.fx + ring.drift.px) * ring.R * 0.1;
        const dy = Math.cos(t * ring.drift.fy + ring.drift.py) * ring.R * 0.08;
        ring.cx = ring.ax + dx;
        ring.cy = ring.ay + dy;
        for (let i = 0; i < RING_POINTS; i++) {
          const th = (i / RING_POINTS) * TAU;
          let m = 1;
          for (const h of ring.harm) m += h.a * Math.sin(h.k * th + h.w * t + h.p);
          // the rest shape itself also stays inside the diagram (no clipping)
          ring.target[i] = Math.min(ring.base[i] * m, edgeDistance(ring, th));
        }
      }
    }

    /** Distance from a ring's centre to the canvas edge along an angle, minus a margin. */
    function edgeDistance(ring: Ring, angle: number) {
      const ux = Math.cos(angle);
      const uy = Math.sin(angle);
      const m = 6;
      const tx = ux > 0 ? (W - m - ring.cx) / ux : ux < 0 ? (m - ring.cx) / ux : Infinity;
      const ty = uy > 0 ? (H - m - ring.cy) / uy : uy < 0 ? (m - ring.cy) / uy : Infinity;
      return Math.min(tx, ty);
    }

    /**
     * Nearest point on a ring's drawn contour to (x, y). The contour is drawn as
     * quadratic curves through segment midpoints, so each piece lies inside the
     * triangle (midpoint, vertex, midpoint): checking the vertex polyline and the
     * midpoint chords gives a distance that never overestimates the drawn line.
     */
    function nearest(ring: Ring, x: number, y: number) {
      let best = Infinity;
      let qx = 0;
      let qy = 0;
      let qi = 0;
      const px = (i: number) => ring.cx + COS[i] * ring.rho[i];
      const py = (i: number) => ring.cy + SIN[i] * ring.rho[i];
      const seg = (ax: number, ay: number, bx: number, by: number, i: number) => {
        const vx = bx - ax;
        const vy = by - ay;
        const t = Math.max(0, Math.min(1, ((x - ax) * vx + (y - ay) * vy) / (vx * vx + vy * vy || 1)));
        const cx = ax + vx * t;
        const cy = ay + vy * t;
        const d = Math.hypot(x - cx, y - cy);
        if (d < best) {
          best = d;
          qx = cx;
          qy = cy;
          qi = i;
        }
      };
      // Coarse pass on every 4th vertex, then exact segments around the best one.
      let ci = 0;
      let cd = Infinity;
      for (let i = 0; i < RING_POINTS; i += 4) {
        const d = (px(i) - x) ** 2 + (py(i) - y) ** 2;
        if (d < cd) {
          cd = d;
          ci = i;
        }
      }
      for (let o = -8; o <= 8; o++) {
        const i = (((ci + o) % RING_POINTS) + RING_POINTS) % RING_POINTS;
        const j = (i + 1) % RING_POINTS;
        const k = (i + 2) % RING_POINTS;
        const ax = px(i), ay = py(i), bx = px(j), by = py(j), cx = px(k), cy = py(k);
        seg(ax, ay, bx, by, j);
        seg((ax + bx) / 2, (ay + by) / 2, (bx + cx) / 2, (by + cy) / 2, j);
      }
      return { d: best, qx, qy, qi };
    }

    /** Signed distance from (x, y) to a ring's contour: positive inside. */
    function roomIn(ring: Ring, x: number, y: number) {
      const d = nearest(ring, x, y).d;
      return Math.hypot(x - ring.cx, y - ring.cy) < rhoAt(ring, Math.atan2(y - ring.cy, x - ring.cx)) ? d : -d;
    }

    /**
     * Node vs one membrane, using the full node radius plus CLEARANCE: pressing
     * toward the edge bulges the ring out locally (capped); whatever is left is a
     * hard clamp, so no part of the node outline ever gets closer than CLEARANCE.
     */
    function contain(n: Node, ring: Ring) {
      const need = n.r + CLEARANCE;
      // Centre outside the contour (only after a violent drag): pull it back in radially first.
      let dx = n.x - ring.cx;
      let dy = n.y - ring.cy;
      let dc = Math.hypot(dx, dy) || 0.0001;
      let ang = Math.atan2(dy, dx);
      const lim = rhoAt(ring, ang) - need;
      if (dc > lim) {
        const k = Math.max(0, lim) / dc;
        n.x = ring.cx + dx * k;
        n.y = ring.cy + dy * k;
      }

      let q = nearest(ring, n.x, n.y);
      if (q.d >= need) return;
      const pen = need - q.d;
      // inward normal at the contact
      let nx = (n.x - q.qx) / (q.d || 1);
      let ny = (n.y - q.qy) / (q.d || 1);
      // A dragged node presses the membrane out; a free node mostly gets
      // pushed back in, so the membrane can relax once the hand lets go.
      const yieldShare = n === drag ? 0.85 : 0.3;
      dx = n.x - ring.cx;
      dy = n.y - ring.cy;
      dc = Math.hypot(dx, dy) || 0.0001;
      ang = Math.atan2(dy, dx);
      const spacing = (rhoAt(ring, ang) * TAU) / RING_POINTS;
      const sigma = Math.max(2, (n.r * 1.4) / spacing); // bulge width in ring points
      const span = Math.ceil(sigma * 2.5);
      for (let o = -span; o <= span; o++) {
        const idx = (((q.qi + o) % RING_POINTS) + RING_POINTS) % RING_POINTS;
        const g = Math.exp(-(o * o) / (sigma * sigma));
        // radial growth needed for this much normal displacement
        const along = Math.max(0.35, -(COS[idx] * nx + SIN[idx] * ny));
        // never bulge past the diagram's edge (no clipping inside the page)
        const cap = Math.min(ring.target[idx] + ring.R * 0.22, edgeDistance(ring, (idx / RING_POINTS) * TAU));
        ring.rho[idx] = Math.max(ring.rho[idx], Math.min(cap, ring.rho[idx] + (pen * g * yieldShare) / along));
        if (n === drag && ring.vel[idx] < 0) ring.vel[idx] *= 1 - g * 0.6;
      }
      ring.pressure = Math.min(1, ring.pressure + pen / ring.R);

      // Hard containment: whatever the ring did, keep the full clearance.
      q = nearest(ring, n.x, n.y);
      if (q.d < need) {
        nx = (n.x - q.qx) / (q.d || 1);
        ny = (n.y - q.qy) / (q.d || 1);
        n.x += nx * (need - q.d);
        n.y += ny * (need - q.d);
        const vn = n.vx * nx + n.vy * ny;
        if (vn < 0) {
          n.vx -= vn * nx * 1.3;
          n.vy -= vn * ny * 1.3;
        }
      }
    }

    type Glyph = { ch: string; x: number; y: number; rot: number };

    /** Walk `dist` px along a ring's contour from an angle (one Newton step is plenty here). */
    function walk(ring: Ring, angle: number, dist: number) {
      const e = 0.01;
      const r = rhoAt(ring, angle);
      const dr = (rhoAt(ring, angle + e) - rhoAt(ring, angle - e)) / (2 * e);
      return angle + dist / Math.hypot(r, dr);
    }

    /**
     * Boundary labels: small glyphs laid directly on the moving contour (the line
     * is masked behind them), always reading left to right. COMPLEXITY is a quiet
     * straight label in the overlap that drifts with it, not a region.
     */
    function labels(): Glyph[][] {
      const out = rings.map((ring) => {
        const text = ring.shape.label.toUpperCase();
        const a0 = ring.shape.labelAt + turn();
        const r0 = rhoAt(ring, a0);
        const dr0 = (rhoAt(ring, a0 + 0.01) - rhoAt(ring, a0 - 0.01)) / 0.02;
        // tangent for increasing angle; walk the other way if that would read upside down
        const dir = dr0 * Math.cos(a0) - r0 * Math.sin(a0) < 0 ? -1 : 1;
        const total = [...text].reduce((t, ch) => t + (glyphWidths[ch] ?? 0), 0);
        let a = walk(ring, a0, (-dir * total) / 2);
        return [...text].map((ch) => {
          const half = (glyphWidths[ch] ?? 0) / 2;
          const mid = walk(ring, a, dir * half);
          const r = rhoAt(ring, mid);
          const p1 = walk(ring, mid, dir * 2);
          const x = ring.cx + Math.cos(mid) * r;
          const y = ring.cy + Math.sin(mid) * r;
          const r1 = rhoAt(ring, p1);
          const rot = Math.atan2(ring.cy + Math.sin(p1) * r1 - y, ring.cx + Math.cos(p1) * r1 - x);
          a = walk(ring, mid, dir * half);
          return { ch, x, y, rot };
        });
      });
      const home = toScreen(COMPLEXITY_AT.x, COMPLEXITY_AT.y);
      let dx = 0;
      let dy = 0;
      for (let i = 1; i < rings.length; i++) {
        dx += (rings[i].cx - rings[i].ax) / 3;
        dy += (rings[i].cy - rings[i].ay) / 3;
      }
      const text = "COMPLEXITY";
      const total = [...text].reduce((t, ch) => t + (glyphWidths[ch] ?? 0), 0);
      let x = home.x + dx - total / 2;
      out.push(
        [...text].map((ch) => {
          const w = glyphWidths[ch] ?? 0;
          const g = { ch, x: x + w / 2, y: home.y + dy, rot: 0 };
          x += w;
          return g;
        }),
      );
      return out;
    }

    /** Labels stay readable: free nodes are nudged off each glyph like off a small static obstacle. */
    function avoidLabels() {
      const gr = labelFont * 0.65;
      for (const glyphs of labels()) {
        for (const g of glyphs) {
          for (const n of nodes) {
            if (n === drag) continue;
            const dx = n.x - g.x;
            const dy = n.y - g.y;
            const d = Math.hypot(dx, dy) || 0.0001;
            const min = n.r + gr;
            if (d >= min) continue;
            n.x += (dx / d) * (min - d);
            n.y += (dy / d) * (min - d);
          }
        }
      }
    }

    /** Node-node collisions (all pairs; 18 nodes, trivial). */
    function collide(dragHeavy: boolean) {
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const min = a.r + b.r;
          const d2 = dx * dx + dy * dy;
          if (d2 >= min * min || d2 === 0) continue;
          const d = Math.sqrt(d2);
          const nx = dx / d;
          const ny = dy / d;
          const overlap = min - d;
          // dragged node behaves as infinite mass (unless it is being held back by a wall)
          const wa = dragHeavy ? (a === drag ? 0 : b === drag ? 1 : 0.5) : 0.5;
          const wb = dragHeavy ? (b === drag ? 0 : a === drag ? 1 : 0.5) : 0.5;
          a.x -= nx * overlap * wa;
          a.y -= ny * overlap * wa;
          b.x += nx * overlap * wb;
          b.y += ny * overlap * wb;
          const rel = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
          if (rel < 0) {
            const imp = -(1 + 0.6) * rel;
            a.vx -= nx * imp * wa;
            a.vy -= ny * imp * wa;
            b.vx += nx * imp * wb;
            b.vy += ny * imp * wb;
          }
        }
      }
    }

    function step(dt: number) {
      if (!reduced) time += dt;
      updateTargets();

      // Ring springs: toward organic target + neighbour coupling (rope tension).
      // Coupling acts on the deviation from the target, so the Figma contour is
      // the rest shape and only bulges get smoothed out along the rope.
      // Slightly stiffer and better damped than before: elastic but controlled.
      const kTarget = 26;
      const kNeighbour = 320;
      const damping = 9;
      for (const ring of rings) {
        const { rho, vel, target } = ring;
        for (let i = 0; i < RING_POINTS; i++) {
          const l = (i - 1 + RING_POINTS) % RING_POINTS;
          const r = (i + 1) % RING_POINTS;
          const dev = rho[l] - target[l] + rho[r] - target[r] - 2 * (rho[i] - target[i]);
          const acc = kTarget * (target[i] - rho[i]) + kNeighbour * dev - damping * vel[i];
          vel[i] += acc * dt;
        }
        for (let i = 0; i < RING_POINTS; i++) rho[i] += vel[i] * dt;
        ring.pressure *= Math.exp(-dt * 3);
      }

      // Nodes: wander + Complexity field + drag.
      const fieldScale = unit * 0.18;
      const wanderForce = unit * 0.012;
      const fieldForce = reduced ? 0 : unit * 0.01;
      const nodeDamping = reduced ? 3.5 : 1.2;
      const maxSpeed = unit * 0.06;
      for (const n of nodes) {
        if (n === drag) {
          const tx = pointer.x + dragOffset.x;
          const ty = pointer.y + dragOffset.y;
          // critically damped follow, so collisions still see a real velocity
          n.vx = (tx - n.x) * 18;
          n.vy = (ty - n.y) * 18;
        } else {
          // Each node is biased toward its own Figma position (which drifts with its ring).
          // (intersection nodes follow the average drift of their two regions)
          let ddx = 0;
          let ddy = 0;
          const own = n.bounds.slice(0, -1);
          for (const b of own) {
            ddx += (rings[b].cx - rings[b].ax) / own.length;
            ddy += (rings[b].cy - rings[b].ay) / own.length;
          }
          n.vx += (n.hx + ddx - n.x) * 0.5 * dt;
          n.vy += (n.hy + ddy - n.y) * 0.5 * dt;
          if (!reduced) {
            n.wander += (Math.sin(time * 0.7 + n.r) * 0.6 + (Math.random() - 0.5) * 1.5) * dt;
            n.vx += Math.cos(n.wander) * wanderForce * dt;
            n.vy += Math.sin(n.wander) * wanderForce * dt;
            const f = field(n.x, n.y, time, fieldScale);
            n.vx += Math.cos(f) * fieldForce * dt;
            n.vy += Math.sin(f) * fieldForce * dt;
          }
          n.vx -= n.vx * nodeDamping * dt;
          n.vy -= n.vy * nodeDamping * dt;
          const sp = Math.hypot(n.vx, n.vy);
          if (sp > maxSpeed) {
            n.vx *= maxSpeed / sp;
            n.vy *= maxSpeed / sp;
          }
        }
        n.x += n.vx * dt;
        n.y += n.vy * dt;
      }

      collide(true);

      avoidLabels();

      // Multi-boundary containment: every node must sit wholly inside every ring
      // in its `bounds` (own region, Ambiguity, and for intersection-only nodes the
      // second region). Repeated passes converge on the intersection; rings bulge
      // when the room is too tight.
      for (let pass = 0; pass < 3; pass++) {
        for (const n of nodes) for (const b of n.bounds) contain(n, rings[b]);
      }
      // A dragged node pinned by a wall cannot also shove a neighbour through it:
      // resolve overlaps once more with equal weights, then re-contain.
      collide(false);
      for (const n of nodes) for (const b of n.bounds) contain(n, rings[b]);

      // Intersection-only nodes get extra passes until both regions are satisfied.
      for (const n of nodes) {
        if (n.bounds.length < 3) continue;
        for (let pass = 0; pass < 8; pass++) {
          for (const b of n.bounds) contain(n, rings[b]);
          if (n.bounds.every((b) => nearest(rings[b], n.x, n.y).d >= n.r + CLEARANCE - 0.05)) break;
        }
      }
    }

    // ---- Drawing -----------------------------------------------------------

    function ringPoint(ring: Ring, i: number) {
      const th = (i / RING_POINTS) * TAU;
      const r = ring.rho[((i % RING_POINTS) + RING_POINTS) % RING_POINTS];
      return [ring.cx + Math.cos(th) * r, ring.cy + Math.sin(th) * r] as const;
    }

    function tracePath(ring: Ring) {
      // Smooth closed curve through midpoints.
      const [x0, y0] = ringPoint(ring, 0);
      const [x1, y1] = ringPoint(ring, 1);
      ctx.moveTo((x0 + x1) / 2, (y0 + y1) / 2);
      for (let i = 1; i <= RING_POINTS; i++) {
        const [cx, cy] = ringPoint(ring, i);
        const [nx, ny] = ringPoint(ring, i + 1);
        ctx.quadraticCurveTo(cx, cy, (cx + nx) / 2, (cy + ny) / 2);
      }
      ctx.closePath();
    }

    function drawLabels() {
      ctx.font = `500 ${labelFont}px ${fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineJoin = "round";
      ctx.lineWidth = 6;
      ctx.strokeStyle = C.background;
      ctx.fillStyle = "rgba(195,194,184,0.85)";
      // Two passes: mask the contour behind every letter first, then the letters,
      // so a neighbour's mask never eats into a letter.
      const groups = labels();
      const complexity = groups.pop() ?? [];
      const all = groups.flat();
      for (const pass of [0, 1]) {
        for (const g of all) {
          ctx.save();
          ctx.translate(g.x, g.y);
          ctx.rotate(g.rot);
          if (pass === 0) ctx.strokeText(g.ch, 0, 0);
          else ctx.fillText(g.ch, 0, 0);
          ctx.restore();
        }
      }
      // COMPLEXITY: quieter secondary label, no contour to mask.
      ctx.font = `400 ${labelFont}px ${fontFamily}`;
      ctx.fillStyle = "rgba(195,194,184,0.5)";
      for (const g of complexity) ctx.fillText(g.ch, g.x, g.y);
    }

    function draw() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      for (const ring of rings) {
        ctx.beginPath();
        tracePath(ring);
        const p = Math.min(1, ring.pressure * 4);
        ctx.strokeStyle = `rgba(240,239,236,${0.55 + p * 0.35})`;
        ctx.lineWidth = 1 + p * 0.5;
        ctx.stroke();
      }
      drawLabels();

      ctx.font = `400 ${nodeFont}px ${fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const n of nodes) {
        const target = n === hover || n === drag ? 1 : 0;
        n.hot += (target - n.hot) * (reduced ? 1 : 0.25);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, TAU);
        ctx.fillStyle = C.background;
        ctx.fill();
        if (n.hot > 0.01) {
          ctx.fillStyle = `rgba(45,84,221,${n.hot})`;
          ctx.fill();
        }
        ctx.strokeStyle = n.hot > 0.5 ? C.highlight : "rgba(240,239,236,0.22)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = n.hot > 0.5 ? C.primary : "rgba(195,194,184,0.85)";
        ctx.fillText(n.label, n.x, n.y + 0.5);
      }
    }

    // ---- Input -------------------------------------------------------------

    function local(e: { clientX: number; clientY: number }) {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function hit(x: number, y: number, slop = 0) {
      for (let i = nodes.length - 1; i >= 0; i--) {
        const n = nodes[i];
        if (Math.hypot(n.x - x, n.y - y) <= n.r + slop) return n;
      }
      return null;
    }

    function onPointerMove(e: PointerEvent) {
      const p = local(e);
      pointer.x = p.x;
      pointer.y = p.y;
      pointer.inside = true;
      if (!drag) hover = e.pointerType === "mouse" ? hit(p.x, p.y) : null;
      canvas.style.cursor = drag ? "grabbing" : hover ? "grab" : "default";
    }

    function onPointerDown(e: PointerEvent) {
      const p = local(e);
      const n = hit(p.x, p.y, e.pointerType === "mouse" ? 0 : 10);
      if (!n) return;
      drag = n;
      hover = n;
      pointer.x = p.x;
      pointer.y = p.y;
      dragOffset = { x: n.x - p.x, y: n.y - p.y };
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
    }

    function onPointerUp(e: PointerEvent) {
      if (drag && canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
      drag = null;
      if (e.pointerType !== "mouse") hover = null;
      canvas.style.cursor = "default";
    }

    function onPointerLeave() {
      if (!drag) hover = null;
    }

    // Touch: only block page scroll when the touch starts on a node.
    function onTouchStart(e: TouchEvent) {
      const t = e.touches[0];
      if (!t) return;
      const p = local(t);
      if (hit(p.x, p.y, 10)) e.preventDefault();
    }

    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });

    const onReduce = () => {
      reduced = reduceQuery.matches;
    };
    reduceQuery.addEventListener("change", onReduce);

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    // ---- Loop --------------------------------------------------------------

    let raf = 0;
    let last = performance.now();
    let visible = true;
    const frameTimes: number[] = [];
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(wrap);

    function frame(now: number) {
      raf = 0;
      if (!visible) return;
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      const t0 = performance.now();
      const sub = 3;
      for (let k = 0; k < sub; k++) step(dt / sub);
      draw();
      if (showStats && statsRef.current) {
        frameTimes.push(performance.now() - t0);
        if (frameTimes.length > 60) frameTimes.shift();
        const avg = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
        statsRef.current.textContent = `work ${avg.toFixed(2)} ms/frame\nreduced ${reduced}`;
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    // test hook for the prototype screenshots
    (window as unknown as { __lp?: unknown }).__lp = { get nodes() { return nodes; }, get rings() { return rings; } };

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      reduceQuery.removeEventListener("change", onReduce);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("touchstart", onTouchStart);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative h-[487px] w-full">
      <canvas
        ref={canvasRef}
        className="block"
        role="img"
        aria-label={label}
      />
      <pre ref={statsRef} className="pointer-events-none absolute right-4 bottom-4 type-body-xs text-tertiary" />
    </div>
  );
}
