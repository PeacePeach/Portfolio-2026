# Portfolio Design System

Source: `src/design-system/`

Codex, Claude Code, and future coding agents must read this file before implementing new portfolio UI. Import public primitives from `@/design-system`.

## Tokens

- **colors** — CSS-variable references in `tokens/colors.ts`.
- **typography** — existing `typeStyles` catalog; use the existing `type-*` CSS utilities. Fonts remain in `src/design/fonts.ts`.
- **spacing** — references to the existing base unit and layout tokens.
- **radius** — existing surface (10px) and control (8px) values.
- **motion** — re-exports `src/design/motion.ts`; no second motion system.

CSS values remain authoritative in `src/app/globals.css`. Do not duplicate them in TypeScript. Shared component CSS is imported globally from `components/primitives.css`.

## Components

- **Button** — deferred; no generic export yet. Reuse existing native-button implementations until a repeated pattern justifies extraction.
- **Tabs** — existing theme-tab presentation, `outline`/`filled` states, and `useRovingTabs` keyboard behavior. Retain distinct mode/capability selector presentations.
- **Pill** — `project`, `placeholder`, and `evidence` appearances.
- **Input** — deferred; no generic export yet. Existing filter controls, textarea, and range inputs retain their behavior.
- **Panel** — surface chrome only; `card`/`evidence` surfaces and `div`/`section`/`article` semantics. Callers own layout and interactions.

`Tabs` and evidence `Pill` use the existing case-study token scope: prefer `CaseStudyTabs` and `EvidencePill` adapters in case studies. Keep `EvidencePanelShell` for evidence layout.

Also exported: `Reveal`, `ScrollReveal`, `ChapterHeaderReveal`, `ArrowDown`, and `ArrowUpRight`. Chapter reveal preserves the earlier trigger (amount 0, bottom margin -15%), 320ms duration, and 50ms divider stagger; reduced motion is respected.

## Usage Rules

1. Reuse existing tokens/components first.
2. Do not introduce new colors, spacing, typography, radius, or motion unless necessary.
3. Extend an existing primitive before creating a new one.
4. Case-specific layouts/content must not redefine global styling.
5. Preserve the existing visual language unless Figma explicitly changes it.
6. Reuse existing motion primitives before creating new animation behavior.
7. Prefer configuration/content changes over component rewrites.

Preserve semantics, keyboard navigation, focus, selected/disabled states, reduced motion, and visual geometry. Keep product-scene artwork styling local. For case-study layout and content contracts, read [case-study templates](case-study-templates.md).
