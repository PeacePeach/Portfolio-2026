/**
 * Brightcove Beacon, chapter 1: Xstream.ly's "team of teams" (Figma 114:282, the old bubble map),
 * rebuilt in code for a 704×403 card (Figma AI-Portfolio 164:5187): three clusters, one per key role,
 * with the links between the key roles running through the open space between them.
 * Bubble colours are the original illustration's; they have no design-system equivalent.
 */
type Role = { name: string; lines: readonly string[]; fill: string; x: number; y: number; r: number };

const roles: readonly Role[] = [
  { name: "Viewers", lines: ["Viewers"], fill: "#ffffff", x: 150.0, y: 105.0, r: 49.9 },
  { name: "Product Manager", lines: ["Product", "Manager"], fill: "#d8e1fc", x: 205.0, y: 262.0, r: 39.7 },
  { name: "Content Producer", lines: ["Content", "Producer"], fill: "#f4d9d7", x: 352.0, y: 128.0, r: 37.8 },
  { name: "Pricing Manager", lines: ["Pricing", "Manager"], fill: "#bee2f7", x: 505.0, y: 262.0, r: 41.0 },
  { name: "Analytics Manager", lines: ["Analytics", "Manager"], fill: "#b0b7cd", x: 155.7, y: 211.1, r: 28.2 },
  { name: "Customer Support", lines: ["Customer", "Support"], fill: "#b0b7cd", x: 130.7, y: 269.1, r: 32.0 },
  { name: "Director of Product", lines: ["Director", "of Product"], fill: "#b0b7cd", x: 166.2, y: 321.3, r: 28.2 },
  { name: "UI/UX Designer", lines: ["UI/UX", "Designer"], fill: "#b0b7cd", x: 224.9, y: 330.0, r: 28.2 },
  { name: "Software Developers", lines: ["Software", "Developers"], fill: "#b1b8e8", x: 214.5, y: 187.9, r: 32.0 },
  { name: "Data Analyst", lines: ["Data", "Analyst"], fill: "#b1b8e8", x: 427.5, y: 147.7, r: 28.2 },
  { name: "Legal and Compliance", lines: ["Legal and", "Compliance"], fill: "#9cb9e4", x: 484.4, y: 191.5, r: 29.4 },
  { name: "Media Editor", lines: ["Media", "Editor"], fill: "#ccbcba", x: 320.9, y: 77.5, r: 19.2 },
  { name: "Integrator", lines: ["Integrator"], fill: "#ccbcba", x: 278.5, y: 94.8, r: 25.6 },
  { name: "Writer", lines: ["Writer"], fill: "#ccbcba", x: 350.6, y: 49.2, r: 19.2 },
  { name: "VP of Digital", lines: ["VP of", "Digital"], fill: "#ccbcba", x: 379.5, y: 75.7, r: 19.2 },
  { name: "Architect", lines: ["Architect"], fill: "#cdbdd5", x: 278.3, y: 149.4, r: 26.9 },
  { name: "Web Developer", lines: ["Web", "Developer"], fill: "#cdbdd5", x: 425.9, y: 89.7, r: 26.9 },
  { name: "Sales Team", lines: ["Sales", "Team"], fill: "#9cb9e4", x: 539.9, y: 203.3, r: 24.3 },
  { name: "Director of Marketing", lines: ["Director of", "Marketing"], fill: "#9bb8c9", x: 578.2, y: 247.0, r: 30.7 },
  { name: "Ad Ops", lines: ["Ad Ops"], fill: "#9bb8c9", x: 457.2, y: 307.1, r: 21.8 },
  { name: "Finance Department", lines: ["Finance", "Department"], fill: "#9bb8c9", x: 503.4, y: 335.4, r: 29.4 },
  { name: "Business Development", lines: ["Business", "Development"], fill: "#9bb8c9", x: 563.1, y: 311.0, r: 32.0 },
];

/** The three key roles; thick dashed links join them, thin dotted links reach their shared teams. */
const key = ["Product Manager", "Content Producer", "Pricing Manager"];
const strong = [["Product Manager", "Content Producer"], ["Content Producer", "Pricing Manager"], ["Product Manager", "Pricing Manager"]] as const;
const weak = [
  ["Product Manager", "Software Developers"], ["Product Manager", "Data Analyst"], ["Product Manager", "Legal and Compliance"], ["Product Manager", "Ad Ops"],
  ["Content Producer", "Web Developer"], ["Content Producer", "Data Analyst"],
  ["Pricing Manager", "Legal and Compliance"], ["Pricing Manager", "Ad Ops"],
] as const;

const at = (name: string) => roles.find(role => role.name === name)!;
const ink = "#2f3447";

/** A link from the edge of one bubble to the edge of the other, so it never runs through an end's label. */
function edges(a: string, b: string) {
  const from = at(a), to = at(b);
  const length = Math.hypot(to.x - from.x, to.y - from.y);
  const ux = (to.x - from.x) / length, uy = (to.y - from.y) / length;
  return { x1: from.x + ux * from.r, y1: from.y + uy * from.r, x2: to.x - ux * to.r, y2: to.y - uy * to.r };
}

function Links({ stroke }: { stroke: string }) {
  return <>
    {weak.map(([a, b]) => <line key={a + b} {...edges(a, b)} stroke={stroke} strokeOpacity={0.6} strokeWidth={0.75} strokeDasharray="1.5 2" />)}
    {strong.map(([a, b]) => <line key={a + b} {...edges(a, b)} stroke={stroke} strokeWidth={1.75} strokeDasharray="4 3" />)}
  </>;
}

export function BeaconTeamMap() {
  return (
    <svg viewBox="0 0 704 403" role="img" aria-label="Xstream.ly's team of teams: the product, content and pricing managers at the centre of clusters of internal and external roles, with viewers alongside" className="block h-auto w-full bg-surface font-sans">
      <defs>
        <clipPath id="beacon-team-bubbles">{roles.map(role => <circle key={role.name} cx={role.x} cy={role.y} r={role.r} />)}</clipPath>
      </defs>
      {/* Links run white across the background, then again in the label colour over the bubbles, so each stays visible end to end. */}
      <Links stroke="white" />
      {roles.map(role => <circle key={role.name} cx={role.x} cy={role.y} r={role.r} fill={role.fill} />)}
      <g clipPath="url(#beacon-team-bubbles)" opacity={0.55}><Links stroke={ink} /></g>
      {roles.map(role => {
        const bold = key.includes(role.name) || role.name === "Viewers";
        const size = bold ? 11 : 9.5;
        return <g key={role.name}>
          <text x={role.x} textAnchor="middle" fontSize={size} fontWeight={bold ? 600 : 400} fill={ink} stroke={role.fill} strokeWidth={3} strokeLinejoin="round" paintOrder="stroke">
            {role.lines.map((line, i) => <tspan key={line} x={role.x} y={role.y + (i - (role.lines.length - 1) / 2) * size * 1.2 + size * 0.35}>{line}</tspan>)}
          </text>
        </g>;
      })}
    </svg>
  );
}
