"use client";

import { useEffect, useRef } from "react";

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
  labelAt: { ang: number; inset: number; onLine?: boolean };
};

const SHAPES: Shape[] = [
  { label: "Ambiguity", cx: 510, cy: 228, a: 468, b: 198, rot: -0.1, labelAt: { ang: -Math.PI / 2, inset: 0, onLine: true } },
  {
    label: "Calibration",
    cx: 290,
    cy: 222,
    a: 222,
    b: 78,
    rot: -0.12,
    lobe: { ang: -0.35, amt: 0.32, width: 0.35 },
    labelAt: { ang: Math.PI, inset: 62 },
  },
  { label: "Cohesion", cx: 650, cy: 180, a: 312, b: 98, rot: -0.1, labelAt: { ang: -0.15, inset: 76 } },
  {
    label: "Direction",
    cx: 530,
    cy: 282,
    a: 280,
    b: 100,
    rot: 0,
    lobe: { ang: -2.0, amt: 0.18, width: 0.5 },
    labelAt: { ang: 0.28, inset: 13 },
  },
];

const COMPLEXITY_AT = { x: 455, y: 228 };

// Figma toolkit nodes: centre (Figma units), diameter, boundary index into SHAPES.
const NODES: { label: string; x: number; y: number; d: number; ring: number }[] = [
  // Calibration
  { label: "Insight", x: 221, y: 202, d: 52.4, ring: 1 },
  { label: "Validation", x: 287, y: 184, d: 52.4, ring: 1 },
  { label: "Critique", x: 407, y: 160, d: 52.4, ring: 1 },
  { label: "Judgment", x: 283, y: 229, d: 52.4, ring: 1 },
  { label: "Iteration", x: 214, y: 252, d: 52.4, ring: 1 },
  { label: "Outcomes", x: 149, y: 200, d: 52.4, ring: 1 },
  // Cohesion
  { label: "People", x: 560, y: 125, d: 52.4, ring: 2 },
  { label: "Facilitation", x: 720, y: 125, d: 59.9, ring: 2 },
  { label: "Mentorship", x: 647, y: 157, d: 64.4, ring: 2 },
  { label: "Communication", x: 765, y: 175, d: 81.1, ring: 2 },
  { label: "Trust", x: 855, y: 172, d: 52.4, ring: 2 },
  { label: "Alignment", x: 591, y: 236, d: 52.4, ring: 2 },
  // Direction
  { label: "Vision", x: 462, y: 310, d: 52.4, ring: 3 },
  { label: "Systems", x: 542, y: 310, d: 52.4, ring: 3 },
  { label: "Strategy", x: 630, y: 318, d: 52.4, ring: 3 },
  { label: "Framing", x: 700, y: 310, d: 52.4, ring: 3 },
  { label: "Journeys", x: 494, y: 360, d: 52.4, ring: 3 },
  { label: "Trade-offs", x: 358, y: 268, d: 52.4, ring: 3 },
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
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  wander: number; // wander heading
  hot: number; // 0..1 hover/drag blend
};

const TAU = Math.PI * 2;

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

export function LeadershipPhysics() {
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
    let labelWidths: Record<string, number> = {};
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

    /** Width decides scale; the diagram sets its own height (600-700 on desktop). */
    function measure(width: number) {
      portrait = width < 640;
      if (portrait) {
        s = Math.min(1, width / (FIGMA_BOX.h + 15));
        return Math.round(FIGMA_BOX.w * s + 20);
      }
      s = Math.min(1.15, (width - 24) / FIGMA_BOX.w);
      return width >= 1000 ? 640 : Math.round(FIGMA_BOX.h * s + 80);
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
            a: (0.05 / (k - 1)) * (0.7 + rnd() * 0.6),
            w: (0.12 + rnd() * 0.18) * (rnd() < 0.5 ? -1 : 1),
            p: rnd() * TAU,
          })),
          drift: { fx: 0.05 + rnd() * 0.04, fy: 0.04 + rnd() * 0.04, px: rnd() * TAU, py: rnd() * TAU },
          pressure: 0,
        };
        return ring;
      });

      ctx.font = `600 ${labelFont}px ${fontFamily}`;
      labelWidths = {};
      for (const t of [...SHAPES.map((sh) => sh.label.toUpperCase()), "COMPLEXITY"]) labelWidths[t] = ctx.measureText(t).width;

      // Node size: the Figma diameter, grown where needed so the label fits.
      ctx.font = `400 ${nodeFont}px ${fontFamily}`;
      nodes = NODES.map((n) => {
        const p = toScreen(n.x, n.y);
        const fit = ctx.measureText(n.label).width / 2 + 6;
        return {
          label: n.label,
          ring: n.ring,
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
      labelFont = Math.min(12, Math.max(10, 12 * s));
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
          ring.target[i] = ring.base[i] * m;
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

    /** Node vs one membrane: push the ring out locally (capped bulge), then hard clamp. */
    function contain(n: Node, ring: Ring) {
      const pad = 2;
      const dx = n.x - ring.cx;
      const dy = n.y - ring.cy;
      const d = Math.hypot(dx, dy) || 0.0001;
      const ang = Math.atan2(dy, dx);
      const need = d + n.r + pad;
      const have = rhoAt(ring, ang);
      if (need > have) {
        const pen = need - have;
        // A dragged node presses the membrane out; a free node mostly gets
        // pushed back in, so the membrane can relax once the hand lets go.
        const yieldShare = n === drag ? 0.85 : 0.3;
        const sigma = (n.r * 2.4) / Math.max(d, n.r); // angular width of the bulge
        const span = Math.ceil((sigma * 2.5 * RING_POINTS) / TAU);
        const centre = (((ang / TAU) * RING_POINTS) % RING_POINTS + RING_POINTS) % RING_POINTS;
        const c0 = Math.round(centre);
        for (let o = -span; o <= span; o++) {
          const idx = (((c0 + o) % RING_POINTS) + RING_POINTS) % RING_POINTS;
          const da = ((c0 + o - centre) / RING_POINTS) * TAU;
          const g = Math.exp(-(da * da) / (sigma * sigma));
          // never bulge past the diagram's edge (no clipping inside the page)
          const cap = Math.min(ring.target[idx] + ring.R * 0.45, edgeDistance(ring, (idx / RING_POINTS) * TAU));
          ring.rho[idx] = Math.min(cap, ring.rho[idx] + pen * g * yieldShare);
          if (n === drag && ring.vel[idx] < 0) ring.vel[idx] *= 1 - g * 0.6;
        }
        ring.pressure = Math.min(1, ring.pressure + pen / ring.R);
      }
      // Hard containment: whatever the ring did, the node stays inside it.
      const limit = Math.max(0, rhoAt(ring, ang) - n.r - pad);
      if (d > limit) {
        const ux = dx / d;
        const uy = dy / d;
        n.x = ring.cx + ux * limit;
        n.y = ring.cy + uy * limit;
        const vn = n.vx * ux + n.vy * uy;
        if (vn > 0) {
          n.vx -= vn * ux * 1.3;
          n.vy -= vn * uy * 1.3;
        }
      }
    }

    type Label = { text: string; x: number; y: number; w: number; onLine?: boolean };

    /**
     * Boundary labels pinned to a point on the moving contour, just inside it
     * (Ambiguity sits on the line, which breaks around it as in Figma), plus
     * COMPLEXITY: a system-wide concept, not a boundary, sitting in the overlap
     * and drifting with it.
     */
    function labels(): Label[] {
      const out: Label[] = rings.map((ring) => {
        const { ang, inset, onLine } = ring.shape.labelAt;
        const a = ang + turn();
        const r = rhoAt(ring, a) - inset * s;
        const text = ring.shape.label.toUpperCase();
        return { text, x: ring.cx + Math.cos(a) * r, y: ring.cy + Math.sin(a) * r, w: labelWidths[text] ?? 0, onLine };
      });
      const home = toScreen(COMPLEXITY_AT.x, COMPLEXITY_AT.y);
      let dx = 0;
      let dy = 0;
      for (let i = 1; i < rings.length; i++) {
        dx += (rings[i].cx - rings[i].ax) / 3;
        dy += (rings[i].cy - rings[i].ay) / 3;
      }
      out.push({ text: "COMPLEXITY", x: home.x + dx, y: home.y + dy, w: labelWidths.COMPLEXITY ?? 0 });
      return out;
    }

    /** Labels stay readable: free nodes are nudged off them like off a static obstacle. */
    function avoidLabels() {
      const halfH = labelFont * 0.8;
      for (const l of labels()) {
        const x0 = l.x - l.w / 2 - 4;
        const x1 = l.x + l.w / 2 + 4;
        const y0 = l.y - halfH;
        const y1 = l.y + halfH;
        for (const n of nodes) {
          if (n === drag) continue;
          const px = Math.min(Math.max(n.x, x0), x1);
          const py = Math.min(Math.max(n.y, y0), y1);
          let dx = n.x - px;
          let dy = n.y - py;
          let d = Math.hypot(dx, dy);
          if (d >= n.r) continue;
          if (d === 0) {
            // centre inside the label box: leave through the nearer vertical side
            dy = n.y < l.y ? -1 : 1;
            dx = 0;
            d = 0;
            n.y = dy < 0 ? y0 - n.r : y1 + n.r;
          } else {
            n.x += (dx / d) * (n.r - d);
            n.y += (dy / d) * (n.r - d);
          }
          const vn = (n.vx * dx + n.vy * dy) / (d || 1);
          if (vn < 0) {
            n.vx -= (vn * dx) / (d || 1);
            n.vy -= (vn * dy) / (d || 1);
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
      const kTarget = 9;
      const kNeighbour = 140;
      const damping = 4.2;
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

      // Node-node collisions (all pairs; 18 nodes, trivial).
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
          // dragged node behaves as infinite mass
          const wa = a === drag ? 0 : b === drag ? 1 : 0.5;
          const wb = b === drag ? 0 : a === drag ? 1 : 0.5;
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

      avoidLabels();

      // Every node stays inside its own boundary and inside Ambiguity.
      for (const n of nodes) {
        contain(n, rings[n.ring]);
        contain(n, rings[0]);
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

    function drawLabel(l: Label) {
      ctx.font = `600 ${labelFont}px ${fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if (l.onLine) {
        ctx.fillStyle = C.background;
        ctx.fillRect(l.x - l.w / 2 - 6, l.y - labelFont, l.w + 12, labelFont * 2);
      }
      ctx.fillStyle = C.primary;
      ctx.fillText(l.text, l.x, l.y);
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
      labels().forEach(drawLabel);

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
    <div ref={wrapRef} className="relative h-[640px] w-full">
      <canvas
        ref={canvasRef}
        className="block"
        role="img"
        aria-label="Prototype: Ambiguity as the outer field, with overlapping Calibration, Cohesion and Direction boundaries holding draggable labelled nodes, and Complexity in the overlap."
      />
      <pre ref={statsRef} className="pointer-events-none absolute right-4 bottom-4 type-body-xs text-tertiary" />
    </div>
  );
}
