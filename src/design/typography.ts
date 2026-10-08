/**
 * Semantic type styles, mirroring the Figma text styles (type spec 16:10).
 * The values live in globals.css (--text-* tokens and type-* utilities);
 * this list only documents them and drives the /typography specimen page.
 * To add a style: add the tokens and a type-* utility in globals.css, then
 * an entry here.
 */
export const typeStyles = [
  { token: "type-display-l", figma: "Display_L", spec: "Fraunces SemiBold 110 / 120%, -3%", use: "Hero statement, loader name, page titles" },
  { token: "type-display-m", figma: "Display_M", spec: "Fraunces SemiBold 64 / 120%, -3%", use: "Case study titles, mode labels" },
  { token: "type-display-s", figma: "Display_S", spec: "Fraunces SemiBold 48 / 120%, -3%", use: "Loader percentage, case study sections" },
  { token: "type-heading-xl", figma: "Heading_XL", spec: "Geist SemiBold 40 / 120%", use: "Capability labels (desktop)" },
  { token: "type-heading-l", figma: "Heading_L", spec: "Geist SemiBold 32 / 120%", use: "Project titles" },
  { token: "type-heading-m", figma: "Heading_M", spec: "Geist SemiBold 20 / 120%", use: "Evidence titles" },
  { token: "type-heading-s", figma: "Heading_S", spec: "Geist SemiBold 16 / 120%", use: "Small headings" },
  { token: "type-body-l", figma: "Body_L", spec: "Geist Light 20 / 150%", use: "Lead paragraphs" },
  { token: "type-body-m", figma: "Body_M_1.5", spec: "Geist Light 16 / 150%", use: "Body copy, navigation" },
  { token: "type-body-m-tight", figma: "Body_M_1.2", spec: "Geist Light 16 / 120%", use: "Hero supporting copy, Know me by panel" },
  { token: "type-body-s", figma: "Body_S", spec: "Geist Light 14 / 150%", use: "Hints, secondary copy" },
  { token: "type-body-xs", figma: "Body_XS", spec: "Geist Light 12 / 120%", use: "Fine print" },
  { token: "type-label-l", figma: "Label_L", spec: "Geist SemiBold 16 / 120%, uppercase", use: "Prominent labels" },
  { token: "type-label-m", figma: "Label_M", spec: "Geist SemiBold 14 / 120%, uppercase", use: "Labels" },
  { token: "type-label-s", figma: "Label_S", spec: "Geist SemiBold 12 / 120%, uppercase", use: "Indices, captions, meta" },
] as const;
