# Case-study templates

Central system: `src/components/case-study/`. Preview catalog: `/case-study-templates`.

| Layer | Location | Owns |
| --- | --- | --- |
| Shared rules and primitives | `shared/` | Case-study tokens (`caseStudyTokens.ts`), CSS (`caseStudy.css`), motion (`caseStudyMotion.ts`, `CaseStudyMotion.tsx`), `StoryTextBlock`, `CaseStudyChapterHeader`, `CaseStudyTabs`, evidence primitives (`EvidencePanelShell`, `EvidencePanelHeader`, `EvidenceColumn`, `EvidenceBullet`, `EvidencePill`) |
| Interactions | `shared/tell-me-about-it/` | `TellMeAboutIt` (below) |
| Templates | `templates/` | Structure only |
| Content | `src/content/case-study/` | Copy and config (`neoAdvance.ts`, `templateExamples.ts`) |

## Evidence primitives

Figma `89:3670`. Desktop width is `--cs-content-width-desktop` (Figma variable `Case study / Content width / Desktop`, 1174px).

- `EvidencePanelShell` draws no background, border or radius; the tab bar's top and bottom dividers are the only rules.
- `EvidenceBullet` owns the one 16px check/x icon: `--cs-positive` / `--cs-negative` circle, white centred mark. The icon is centred on the first line box, so it sits centred beside a one-line bullet and level with the first line of a longer one. Do not offset individual bullets.

Shared tokens alias the site foundation in `src/app/globals.css` and the design system in `src/design-system/` (see [design-system.md](design-system.md)); motion composes the existing site primitives.

## Chapters

Case-study chapters use `CaseStudyChapterHeader` (`## _ CHAPTER TITLE`, dotted divider, chapter reveal): 128px chapter spacing, 12px title-to-divider, and 96px divider-to-content. Sections within a chapter use `.cs-section`: consecutive sections get 96px, a separator line, then 96px (`--cs-chapter-gap`, `--cs-section-gap`).

## IntroTemplate

`templates/IntroTemplate.tsx` · Figma `83:3038` (specimen), `51:24883` (Neo Advance) · Preview `/case-study-templates/intro`

Contract: `{ title, paragraphs, facts: { label, items }[] }`. A 720px block centred on the page: Display M title and Body M copy at left, Label S / Body S facts at right; stacks below `md`. Reuses the site type roles and spacing scale. The block sits 128px (`pt-32`) below the hero. Callers own the hero band and the page container (`container-page`). Each part reveals with the case-study text reveal; pass `reveal` to swap the motion (Neo Advance passes its Work → case morph rise).

Used by Neo Advance (`neo-advance/NeoCaseIntro.tsx`, content `neoAdvanceIntro`).

## SimpleSectionTemplate

`templates/SimpleSectionTemplate.tsx` · Figma `135:1453` · Preview `/case-study-templates/simple-section`

Contract: `StoryTextBlock` data (`label?`, `title`, `body`) plus a `variant`. A 400px `StoryTextBlock` centred above full-width content: 96px from the dividers above and below, 64px from text to content. Text uses the case-study text reveal.

| `variant` | Content | Config |
| --- | --- | --- |
| `container` (default) | Any children | `children` |
| `before-after` | Two 568px desktop screenshots, 16px apart, each 16px under its Before / After pill (Figma `110:18926`); stacks below `md` | `before`, `after` (`EvidenceColumn` data, bullets optional) |

Used by Reimagining Analytics (`reimaginingAnalyticsReframing`, `before-after`).

## ImpactTemplate

`templates/ImpactTemplate.tsx` · Figma `67:703` (Neo Advance), `110:18653` (Reimagining Analytics) · Preview `/case-study-templates/impact`

Contract: `{ title, subtitle?, cards: ImpactCardData[] }`. A 947px block: `CaseStudySectionHeader` over a row of three `ImpactCard`s (one column below `md`). The header and each card use the site scroll reveal, cards staggered.

- `shared/ImpactCard.tsx` (Figma `110:18673`): `{ icon, value, label, body }`. Icon is a key (`users`, `refresh`, `task`, `export`) mapped to `react-feather`, in Figma's accent blue; Display XS value, Heading S label, Body S proof; 40px radius, 1px line border.
- `shared/CaseStudySectionHeader.tsx`: 508px block, Display XS title (32px regular) over Body M secondary copy, 12px apart. A title with no copy centres on the block.

Used by Neo Advance (`neoAdvanceImpact`) and Reimagining Analytics (`reimaginingAnalyticsImpact`).

## TwoColumnTextTemplate

`templates/TwoColumnTextTemplate.tsx` · Figma `83:3445` · Preview `/case-study-templates/two-column-text`

Contract: `columns: [column, column]`, where each column is either static story text `{ label?, title, body }` (rendered with `StoryTextBlock`) or `{ tellMeAboutIt: TellMeAboutItData }`. One layout covers static + static and static + interactive. Columns use the site scroll reveal with the case-study stagger, stack into one column (at most 400px wide) when two fixed columns don't fit, and omit the label gap when no label is given.

Used by Neo Advance early discovery (`neo-advance/NeoEarlyDiscovery.tsx`, content `neoAdvanceEarlyDiscovery`).

## StoryTextBlock

`shared/StoryTextBlock.tsx` · Figma `138:1719` · Preview `/case-study-templates/story-text`

The one text block for case-study copy: optional label, title, body. Two switches:

| Switch | Options |
| --- | --- |
| `label` | Omit for no label; Body XS secondary, 12px above the title |
| `heading` | `chapter` (default): Display 32 Regular title. `section`: Heading M title |

Title to body is 16px in both. Width belongs to the caller (400 for chapter text, the grid column for section text). Used by `SimpleSectionTemplate`, `TwoColumnTextTemplate`, `TellMeAboutIt` (chapter) and `NarrativeTemplate`, `NeoCoreFlows` (section).

## NarrativeTemplate

`templates/NarrativeTemplate.tsx` · Figma `83:3560` (joined), `116:667` (separate), `89:5173` (plain) · Preview `/case-study-templates/narrative`

Text pinned on the left (320) beside images on the right (704), 128px apart. Contract: `label`, `steps: [{ id, title, body, images, details? }]`, each image `{ src, alt, width, height, full? }`, plus `imageLayout`:

| Steps | Text |
| --- | --- |
| 1 | Static: one text block beside all its images |
| 2+ | Rolling: the pinned text swaps (site `swap` motion) as each step's images reach it |

| `imageLayout` | Images |
| --- | --- |
| `joined` (default) | One 20px-radius surface, dividers between images, scroll scale 0.98 → 1 |
| `separate` | Each image its own 10px-radius card with a 10% ink border, 16px apart |
| `plain` | Images only: no surface, rounding, divider or scaling |

An image with `full` opens the zoom viewer; `details` adds a text button for the step's first zoomable image. On mobile each step's text sits above its images. `StickyNarrativeText` and `shared/useStickyNarrative` are exported for layouts with other visuals (Neo `NeoCoreFlows`).

Used by Neo Advance (`neoAdvanceNarrative`, `neoAdvanceDeliveryPanels` with `plain`) and Reimagining Analytics problem (`reimaginingAnalyticsProblem`, `separate`).

## BeforeAfterTemplate

`templates/BeforeAfterTemplate.tsx` · Figma `89:3854`, `89:4106`, `89:4186`

Structure only, built from the evidence primitives in `shared/`. Contract: `title`, `description`, `before`, `after` (each `{ label?, images, bullets }`, bullets `positive`/`negative`), plus a `variant`:

| `variant` | Structure | Config |
| --- | --- | --- |
| `before-after` (default) | Before / After | `before`, `after` |
| `before-iterated-after` | Before / Iterated / After | adds `iterated` |
| `grouped-before-after` | Two images share one pill and bullet list | `groupedSide`: `before` (default) or `after` |

Bullets are optional; a column with none renders only its pill and images.

Optional tabs: pass `navigation` (`CaseStudyTabs`), `contentId`, `activeTabId` and `contentKey`; only the inner content swaps. Used by Neo Advance hi-fi exploration (`neo-advance/NeoThemePanel.tsx`, content `neoAdvanceValidationThemes`).

## TellMeAboutIt

`shared/tell-me-about-it/TellMeAboutIt.tsx` · Figma `99:39795` (prompt), `99:39796` (feedback) · Preview `/case-study-templates/tell-me-about-it`

The one reader-input interaction. It owns state, the pen-icon header, the response field, send and optional skip, the thinking state and the optional resolution. Callers own the grid, chapter layout and page spacing.

| `variant` | Structure | Config |
| --- | --- | --- |
| `prompt` | Eyebrow, story title, 120px field, Skip and reveal, send → H loader (16px, "Here’s what I did ...") → resolved `StoryTextBlock` | `eyebrow`, `title`, `resolved: { label?, title, body }`; optional `skipLabel`, `loadingLabel`, `placeholder`, `sendLabel` |
| `feedback` | Eyebrow, Heading M title, 275px field with quick replies, send → "Feedback sent." toast inside the field, left with the quick replies and bottom with send (Figma `99:39859`), for 2s; no skip, loading or resolution | `eyebrow`, `title`, `quickReplies`; optional `placeholder`, `sendLabel`, `sentAnnouncement` (toast text) |

- Reuses the shared system: case-study type roles (`caseStudyType`), colors, spacing and pill tokens, `react-feather` icons, the site `swap` motion through `caseStudyMotion`, and reduced-motion handling. Interaction-only values are the `--cs-tma-*` entries in `caseStudyTokens`.
- `ThinkingIndicator` is the H loader; `QuickReplyChip` and the 32px send control stay local to this interaction until another one needs them.
- Responses stay on the page; `onSubmit` is optional. The send control's fill lights up on hover and keyboard focus (Figma `99:39774`). Feedback keeps the response visible and shows the toast with the site `swap` motion; the toast overlays the field, so nothing reflows.
- Add a new `variant` here rather than copying the interaction.

## Rules

1. Reuse a template and its config before writing a section.
2. Change content/config first.
3. Extend shared primitives minimally when needed.
4. Do not duplicate styling, typography or motion.
