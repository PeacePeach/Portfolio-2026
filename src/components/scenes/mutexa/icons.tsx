/**
 * Mutexa card icons (IBM Carbon glyphs as used in Figma 34:12825), drawn
 * from the Figma vector paths in each icon's own unrotated 16 px box.
 */

import type { CSSProperties } from "react";

type Vec = { d: string; at: [number, number]; fill?: string; stroke?: string; width?: number; transform?: string };

function Glyph({ vecs, size = 16, view = 16, style }: { vecs: Vec[]; size?: number; view?: number; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${view} ${view}`} fill="none" aria-hidden style={style} className="shrink-0">
      {vecs.map((v, i) => (
        <path
          key={i}
          d={v.d}
          transform={v.transform ?? `translate(${v.at[0]} ${v.at[1]})`}
          fill={v.fill ?? "none"}
          stroke={v.stroke}
          strokeWidth={v.stroke ? (v.width ?? 1) : undefined}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}

const dot = "M1.333 .667A.667.667 0 1 1 0 .667a.667.667 0 0 1 1.333 0Z";

export const ShareIcon = () => (
  <Glyph
    vecs={[
      { d: "M0 0V5.333C0 5.687.14 6.026.39 6.276S.98 6.667 1.333 6.667H9.333C9.687 6.667 10.026 6.526 10.276 6.276S10.667 5.687 10.667 5.333V0", at: [2.667, 8], stroke: "#000" },
      { d: "M5.333 2.667L2.667 0 0 2.667", at: [5.333, 1.333], stroke: "#000" },
      { d: "M0 0V8.667", at: [8, 1.333], stroke: "#000" },
    ]}
  />
);

export const MoreIcon = () => (
  <Glyph
    vecs={[
      { d: dot, at: [2.667, 7.333], fill: "#161616", stroke: "#000" },
      { d: dot, at: [7.333, 7.333], fill: "#161616", stroke: "#000" },
      { d: dot, at: [12, 7.333], fill: "#161616", stroke: "#000" },
    ]}
  />
);

export const ChevronDownIcon = () => <Glyph vecs={[{ d: "M0 0L4 4 8 0", at: [4, 6], stroke: "#000", width: 1.5 }]} />;

/** Carbon chevron--down, turned to point right (Figma rotates it -90°). */
export const ChevronRightIcon = () => (
  <Glyph
    style={{ transform: "rotate(-90deg)" }}
    vecs={[{ d: "M5 5.7L0 .7.7 0 5 4.3 9.3 0 10 .7 5 5.7Z", at: [3, 5.3], fill: "#525252" }]}
  />
);

export const InfoIcon = () => (
  <Glyph
    vecs={[
      { d: "M13.333 6.667A6.667 6.667 0 1 1 0 6.667a6.667 6.667 0 0 1 13.333 0Z", at: [1.333, 1.333], stroke: "#393939", width: 1.5 },
      { d: "M0 2.667V0", at: [8, 8], stroke: "#393939", width: 1.5 },
      { d: "M0 0H.007", at: [8, 5.333], stroke: "#393939", width: 1.5 },
    ]}
  />
);

export const FileTextIcon = () => (
  <Glyph
    vecs={[
      { d: "M6.667 0H1.333C.98 0 .641.14.391.391S0 .98 0 1.333V12C0 12.354.14 12.693.391 12.943S.98 13.333 1.333 13.333H9.333C9.687 13.333 10.026 13.193 10.276 12.943S10.667 12.354 10.667 12V4L6.667 0Z", at: [2.667, 1.333], stroke: "#357dfb" },
      { d: "M0 0V4H4", at: [9.333, 1.333], stroke: "#357dfb" },
      { d: "M5.333 0H0", at: [5.333, 8.667], stroke: "#357dfb" },
      { d: "M5.333 0H0", at: [5.333, 11.333], stroke: "#357dfb" },
      { d: "M1.333 0H0", at: [5.333, 6], stroke: "#357dfb" },
    ]}
  />
);

export const downloadTray = "M12 0V2.667C12 3.02 11.86 3.359 11.609 3.609S11.02 4 10.667 4H1.333C.98 4 .641 3.86.391 3.609S0 3.02 0 2.667V0";
export const downloadArrow = [
  { d: "M0 0L3.333 3.333 6.667 0", at: [4.667, 6.667] as [number, number] },
  { d: "M0 8V0", at: [8, 2] as [number, number] },
];

export const AiIcon = () => (
  <Glyph
    vecs={[
      { d: "M2.934 5.516L3.912 2.582H5.177L6.155 5.516 9.088 6.494V7.759L6.155 8.737 5.177 11.671H3.912L2.934 8.737 0 7.759V6.494L2.934 5.516Z", at: [1.789, 1.874], fill: "#357dfb" },
      { d: "M8.978 1.56L9.498 0H10.257L10.777 1.56 12.337 2.08V2.839L10.777 3.359 10.257 4.92H9.498L8.978 3.359 7.418 2.839V2.08L8.978 1.56Z", at: [1.789, 1.874], fill: "#357dfb" },
    ]}
  />
);

export const UserIcon = () => (
  <Glyph
    size={14}
    view={14}
    vecs={[
      { d: "M9.333 3.5V2.333C9.333 1.714 9.088 1.121 8.65.683S7.619 0 7 0H2.333C1.714 0 1.121.246.683.683S0 1.714 0 2.333V3.5", at: [2.333, 8.75], stroke: "#0f62fe" },
      { d: "M4.667 2.333A2.333 2.333 0 1 1 0 2.333a2.333 2.333 0 0 1 4.667 0Z", at: [4.667, 1.75], stroke: "#0f62fe" },
    ]}
  />
);

export const SendIcon = () => (
  <Glyph
    view={16.43}
    vecs={[
      { d: "M6.389 0L0 6.389", at: [0, 0], transform: "matrix(.707 .707 -.707 .707 11.91 3.696)", stroke: "#fff" },
      { d: "M11.616 0L7.551 11.616 5.227 6.389 0 4.066 11.616 0Z", at: [0, 0], transform: "matrix(.707 .707 -.707 .707 8.214 0)", stroke: "#fff" },
    ]}
  />
);

/* Progress stepper glyphs (Carbon checkmark--outline, incomplete, circle-dash). */

export const checkPaths = [
  "M6 9.707L3.5 7.207 4.207 6.5 6 8.293 9.793 4.5 10.5 5.207 6 9.707Z",
  "M7 0A7 7 0 1 0 7 14 7 7 0 0 0 7 0ZM7 13A6 6 0 1 1 7 1 6 6 0 0 1 7 13Z",
];

export const incompleteArcs = [
  "M10.882 2.43L11.525 1.664C10.904 1.139 10.196.726 9.434.444L9.092 1.382C9.745 1.625 10.351 1.979 10.882 2.43Z",
  "M12.905 6L13.889 5.794C13.751 4.995 13.473 4.226 13.07 3.523L12.204 4C12.55 4.622 12.787 5.298 12.905 6Z",
  "M9.092 12.618L9.434 13.557C10.196 13.274 10.904 12.861 11.525 12.336L10.882 11.57C10.351 12.021 9.745 12.375 9.092 12.618Z",
  "M12.204 10L13.07 10.5C13.474 9.789 13.751 9.013 13.889 8.206L12.905 8.033C12.787 8.724 12.55 9.39 12.204 10Z",
];
export const incompleteHalf = "M7 14V0A7 7 0 0 0 7 14Z";

export const circleDashPath =
  "M2.851 1.351C2.277 1.791 1.772 2.313 1.351 2.901L2.151 3.501C2.518 2.991 2.956 2.537 3.451 2.151L2.851 1.351ZM1.301 5.151L.351 4.851C.109 5.541-.009 6.269.001 7.001H1.001C.999 6.372 1.1 5.747 1.301 5.151ZM.351 9.201C.582 9.898.92 10.555 1.351 11.151L2.151 10.551C1.789 10.044 1.503 9.489 1.301 8.901L.351 9.201ZM2.901 12.651C3.496 13.081 4.153 13.419 4.851 13.651L5.151 12.701C4.562 12.498 4.007 12.212 3.501 11.851L2.901 12.651ZM4.851.351L5.151 1.301C5.747 1.1 6.372.999 7.001 1.001V.001C6.269-.009 5.541.109 4.851.351ZM11.101 12.651C11.69 12.212 12.212 11.69 12.651 11.101L11.851 10.501C11.479 11.022 11.022 11.479 10.501 11.851L11.101 12.651ZM12.701 8.851L13.651 9.151C13.868 8.454 13.986 7.73 14.001 7.001H13.001C13.003 7.63 12.901 8.255 12.701 8.851ZM13.601 4.801C13.369 4.103 13.031 3.446 12.601 2.851L11.801 3.451C12.162 3.957 12.448 4.512 12.651 5.101L13.601 4.801ZM11.051 1.301C10.455.87 9.798.532 9.101.301L8.801 1.251C9.389 1.453 9.944 1.739 10.451 2.101L11.051 1.301ZM9.151 13.651L8.851 12.701C8.255 12.901 7.63 13.003 7.001 13.001V14.001C7.727 13.957 8.448 13.84 9.151 13.651Z";
