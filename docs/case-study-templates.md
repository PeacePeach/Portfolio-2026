# Case-study templates

Central system: `src/components/case-study/`. Preview catalog: `/case-study-templates`.

| Layer | Location | Owns |
| --- | --- | --- |
| Shared rules and primitives | `shared/` | Case-study tokens (`caseStudyTokens.ts`), CSS (`caseStudy.css`), motion (`caseStudyMotion.ts`, `CaseStudyMotion.tsx`), `StoryTextBlock`, `CaseStudyChapterHeader`, `CaseStudyTabs`, evidence primitives (`EvidencePanelShell`, `EvidencePanelHeader`, `EvidenceColumn`, `EvidenceBullet`, `EvidencePill`) |
| Interactions | `shared/tell-me-about-it/` | `TellMeAboutIt` (below) |
| Templates | `templates/` | Structure only |
| Content | `src/content/case-study/`, `src/content/neoAdvance.ts` | Copy and config (`neoAdvance.ts`, `reimaginingAnalytics.ts`, `templateExamples.ts`) |
| Project visuals | `neo-advance/`, `reimagining-analytics/` | Only the custom hero artwork and the Work → case morph (`NeoHero`, `AnalyticsHero`, `AnalyticsMorph`) |

## Where things go

Three layers, top to bottom:

1. **Global design system** (`src/app/globals.css`, `src/design-system/`, `src/design/`): typography, colors, spacing, radius, motion, basic primitives. See [design-system.md](design-system.md).
2. **Shared case-study templates** (this document): chapter structure, intro shell, story text, narrative, before / after, horizontal slides and long artifacts, media rows, reflection.
3. **Project content and visuals**: copy, assets and config in `src/content/`; custom hero artwork and morph animation in the project folder.

A case-study page composes chapters directly in `src/app/work/[slug]/page.tsx`: `CaseStudyChapterHeader` followed by templates spread from content config. Do not add a project-specific component that only wraps a chapter header and templates, or that repeats a template's layout with different content. If a section needs something a template can't do, add a variant or config option to the closest template (and a preview), tell Han, then use it from content. Only hero artwork and morph animation stay project-specific.

| Need | Use |
| --- | --- |
| Hero band, title, copy and facts | `CaseIntroTemplate` (`hero` slot) |
| Chapter title and divider | `CaseStudyChapterHeader` |
| Centered or left text over full-width content | `SimpleSectionTemplate` |
| Two columns of story text or Tell Me About It | `TwoColumnTextTemplate` |
| Headline + row of captioned media (GIFs, recordings) | `MediaRowTemplate` |
| Impact numbers | `ImpactTemplate` |
| Pinned text beside scrolling images or phone screens | `NarrativeTemplate` (`imageLayout`) |
| Before / After evidence, with or without tabs | `BeforeAfterTemplate` (`variant`, `tabs`) |
| Pinned slideshow, or one long artifact moving sideways | `HorizontalSlidesTemplate` (`slides` or `artifact`) |
| Closing reflection | `ReflectionTemplate` |
| Closing feedback + next case study | `FollowUpTemplate` |

## Evidence primitives

Figma `89:3670`. Desktop width is `--cs-content-width-desktop` (Figma variable `Case study / Content width / Desktop`, 1174px).

- `EvidencePanelShell` draws no background, border or radius; the tab bar's top and bottom dividers are the only rules.
- `EvidenceBullet` owns the one 16px check/x icon: `--cs-positive` / `--cs-negative` circle, white centred mark. The icon is centred on the first line box, so it sits centred beside a one-line bullet and level with the first line of a longer one. Do not offset individual bullets.

Shared tokens alias the site foundation in `src/app/globals.css` and the design system in `src/design-system/` (see [design-system.md](design-system.md)); motion composes the existing site primitives.

## Chapters

Case-study chapters use `CaseStudyChapterHeader` (`## _ CHAPTER TITLE`, dotted divider, chapter reveal): 128px chapter spacing, 12px title-to-divider, and 96px divider-to-content. Sections within a chapter use `.cs-section`: consecutive sections get 96px, a separator line, then 96px (`--cs-chapter-gap`, `--cs-section-gap`).

## CaseIntroTemplate

`templates/CaseIntroTemplate.tsx`

The top of a case study: the project's hero band (`hero`, any node), then `IntroTemplate`, then the page's chapters (`children`) in `container-page`. The shell places the hero under the nav bar and keeps it hidden while the Work → case morph layer still covers it; the intro text rises in last (`morphTiming`). Contract: `{ hero, intro: IntroData, children }`. The hero artwork itself stays project-specific.

Used by Neo Advance (`<NeoHero />`, `neoAdvanceIntro`), Reimagining Analytics (`<AnalyticsHero />`, `reimaginingAnalyticsIntro`) and Brightcove Beacon (an exported hero image, `brightcoveBeaconHero` and `brightcoveBeaconIntro`).

## IntroTemplate

`templates/IntroTemplate.tsx` · Figma `83:3038` (specimen), `51:24883` (Neo Advance) · Preview `/case-study-templates/intro`

Contract: `{ title, paragraphs, facts: { label, items }[] }`. A 720px block centred on the page: Display M title and Body M copy at left, Label S / Body S facts at right; stacks below `md`. Reuses the site type roles and spacing scale. The block sits 128px (`pt-32`) below the hero. Callers own the hero band and the page container (`container-page`). Each part reveals with the case-study text reveal; pass `reveal` to swap the motion (Neo Advance passes its Work → case morph rise).

Rendered by `CaseIntroTemplate`, which passes the morph rise as `reveal`.

## Replacing template text

Every template's text area takes an optional `text` (any React node, e.g. an icon with text) that replaces its label, title and body: `SimpleSectionTemplate` and `StoryTextBlock` (`text`), each `NarrativeTemplate` step and `HorizontalSlidesTemplate` slide (`step.text`, `slide.text`), and the `BeforeAfterTemplate` header (`text`, replacing title and description). The template keeps its width, spacing and reveal around it. `title` stays required: it becomes the accessible name (and Narrative's image-viewer title). Build any new text component in the design system first.

Text components for the slot live in `shared/`:

- `PersonaQuote` (Figma `43:348`): 48px round avatar over the persona name (chapter-label type, uppercase, one word per line, as wide as its longest word), left-aligned, 12px beside the quote (`caseStudyType.quote` = `type-body-m-italic`, primary). Used by Reimagining Analytics final design (`reimaginingAnalyticsFinalDesign`, `SimpleSectionTemplate` with `align: "left"` and `inset`); at the 561px left text width the quote runs about as tall as avatar and name.

## SimpleSectionTemplate

`templates/SimpleSectionTemplate.tsx` · Figma `135:1453` · Preview `/case-study-templates/simple-section`

Contract: `StoryTextBlock` data (`label?`, `title`, `body`, `heading?`) plus `align` and a `variant`. `align: "center"` (default) centres a 400px `StoryTextBlock`; `align: "left"` puts a 561px one on the content's left edge (Figma `150:4909`). `inset` (from 1280px) moves text and content 128px in from each side (`--cs-section-inset`, Figma `43:215`), for screenshots that shouldn't fill the page width. Either sits above full-width content: 96px from the dividers above and below, 64px from text to content. Text uses the case-study text reveal.

| `variant` | Content | Config |
| --- | --- | --- |
| `container` (default) | Any children | `children` |
| `before-after` | Two 568px desktop screenshots, 16px apart, each 16px under its Before / After pill (Figma `110:18926`); stacks below `md` | `before`, `after` (`EvidenceColumn` data, bullets optional) |

Used by Reimagining Analytics (`reimaginingAnalyticsReframing`, `before-after`; role insights, left; final design, one left-aligned `inset` section per screen with a `PersonaQuote` text slot over the screen, `reimaginingAnalyticsFinalDesign`).

## HorizontalSlidesTemplate

`templates/HorizontalSlidesTemplate.tsx` · Figma `89:5440` · Preview `/case-study-templates/horizontal-slides`

Contract: `{ label, slides: [{ id, title, body, image: { src, alt, width, height } }] }`. A 696px section-title `StoryTextBlock` (12px title to body) over 879px slides, 16px apart, 64px below the text; the track bleeds to the right viewport edge and a 337px fade covers the next slide's peek. Images use `radius-image` and `border-default`.

Desktop (≥1024px): the stage pins 20px under the nav bar for one viewport of scroll per slide. Each share of that scroll moves one whole slide in (`caseStudyMotion().slide`: site `duration.slow`, `ease.inOutQuart`), never part-way, and the text above swaps to that slide's with `CaseStudyContentSwap`. Mobile and reduced motion: slides stack, each under its own text.

Long artifact (Figma `79:1979`): pass `{ label, artifact: { src, alt, width, height } }` instead of `slides`. One image wider than the page (a journey map, an end-to-end flow) starts at the page margin and bleeds to both viewport edges, at most 860px tall and never taller than the viewport under the nav. Desktop pins it 20px under the nav bar and moves it sideways one pixel per pixel of scroll, continuously, until its right edge meets the page margin. Mobile and reduced motion get a native horizontal scroller.

Used by Neo Advance concept exploration (`neoAdvanceJourneyMap`, artifact). Slides crop tall screens to the viewport; when a whole screen must show, use `SimpleSectionTemplate`s stacked vertically instead (as Reimagining Analytics final design).

## MediaRowTemplate

`templates/MediaRowTemplate.tsx` · Figma `68:712`

Contract: `{ title, items: [{ caption, src, alt, width, height }], className? }`. A centred Display XS heading (32px regular) 48px over a row of media, 24px apart; each item is as wide as its media, with its Body M caption 32px above. Media keep 35px device corners and are served as is (animated GIFs and recordings). The heading and each item reveal in turn; items stack into one column below `md`.

Used by Neo Advance "How Neo Advance Works?" (`neoAdvanceHow`).

## ImpactTemplate

`templates/ImpactTemplate.tsx` · Figma `67:703` (Neo Advance), `110:18653` (Reimagining Analytics), `929:1880` (Brightcove Beacon) · Preview `/case-study-templates/impact`

Contract: `{ title, subtitle?, cards: ImpactCardData[] }`. A 947px block: `CaseStudySectionHeader` over a row of three `ImpactCard`s (one column below `md`). The header and each card use the site scroll reveal, cards staggered.

- `shared/ImpactCard.tsx` (Figma `110:18673`): `{ icon, value, label, body }`. Icon is a key (`users`, `refresh`, `task`, `export`) mapped to `react-feather`, in Figma's accent blue; Display XS value, Heading S label, Body S proof; 40px radius, 1px line border.
- `shared/CaseStudySectionHeader.tsx`: 508px block, Display XS title (32px regular) over Body M secondary copy, 12px apart. A title with no copy centres on the block.

Used by Neo Advance (`neoAdvanceImpact`) and Reimagining Analytics (`reimaginingAnalyticsImpact`).

## ReflectionTemplate

`templates/ReflectionTemplate.tsx` · Figma `89:5173` / `99:38841` · Preview `/case-study-templates/reflection`

Contract: `{ headline, body, accent? }`. A centred 500px column: the headline (story title type, primary), then the supporting copy (story body) 33px below. `accent: "bar"` (default) adds a 4px rounded gradient bar 16px left of the headline (`--cs-reflection-accent` → 20%); `accent: "none"` drops it. Reveals with the site scroll reveal. Goes under a chapter header such as `0N _ REFLECTION`, optionally followed by a `FollowUpTemplate`.

Used by Neo Advance (`neoAdvanceReflection`, then `FollowUpTemplate` with `neoAdvanceClosing`) and Reimagining Analytics (`reimaginingAnalyticsReflection`).

## FollowUpTemplate

`templates/FollowUpTemplate.tsx` · Figma `99:39434` / `99:39393` · Preview `/case-study-templates/follow-up`

The case study's closing follow-up: Tell Me About It feedback on the left, the next case study's Work tile (`UpNext`) on the right. Contract: `{ feedback: { eyebrow, title, quickReplies?, placeholder?, sendLabel?, sentAnnouncement? }, current: thisCaseStudySlug }`. A preset of `TwoColumnTextTemplate`, so layout, spacing, reveal and stacking are the same. Goes last, after the reflection in the same chapter.

Up Next picks the tile itself, so content never names it: the first case study in `upNextOrder` (`src/content/projects.ts`: Neo Advance, Mutexa, Brightcove Beacon, Reimagining Analytics) that isn't the current one and hasn't been opened in this browser session; once every one has been seen, the first in that order. `CaseStudyViewTracker` (in the `/work` layout) records each opened case study in `sessionStorage` (`src/lib/viewedCaseStudies.ts`). The server render and storage-blocked browsers use the plain priority order. To change the recommendation, edit `upNextOrder`.

Used by Neo Advance (`neoAdvanceClosing`) and Reimagining Analytics (`reimaginingAnalyticsFollowUp`).

## TwoColumnTextTemplate

`templates/TwoColumnTextTemplate.tsx` · Figma `83:3445` · Preview `/case-study-templates/two-column-text`

Contract: `columns: [column, column]`, where each column is either static story text `{ label?, title, body }` (rendered with `StoryTextBlock`) or `{ tellMeAboutIt: TellMeAboutItData }`. One layout covers static + static and static + interactive. Columns use the site scroll reveal with the case-study stagger, stack into one column (at most 400px wide) when two fixed columns don't fit, and omit the label gap when no label is given.

Used by Neo Advance early discovery, concept exploration, hi-fi exploration and closing (`neoAdvanceEarlyDiscovery`, `neoAdvanceConceptExploration`, `neoAdvanceHiFiExploration`) and, through `FollowUpTemplate`, every closing follow-up.

## StoryTextBlock

`shared/StoryTextBlock.tsx` · Figma `138:1719` · Preview `/case-study-templates/story-text`

The one text block for case-study copy: optional label, title, body. Two switches:

| Switch | Options |
| --- | --- |
| `label` | Omit for no label; Body XS secondary, 12px above the title |
| `heading` | `chapter` (default): Display 32 Regular title. `section`: Heading M title |

Title to body is 16px under a chapter title and 12px under a section title. Width belongs to the caller (400 for chapter text, the grid column for section text). Used by `SimpleSectionTemplate`, `TwoColumnTextTemplate`, `TellMeAboutIt` (chapter) and `NarrativeTemplate`, `HorizontalSlidesTemplate` (section).

## NarrativeTemplate

`templates/NarrativeTemplate.tsx` · Figma `83:3560` (joined), `116:667` (separate), `89:5173` (plain), `94:5545` (screens) · Preview `/case-study-templates/narrative`

Text pinned on the left (320) beside images on the right (704), 128px apart. Contract: `label`, `steps: [{ id, title, body, images, details? }]`, each image `{ src, alt, width, height, full? }`, plus `imageLayout`:

| Steps | Text |
| --- | --- |
| 1 | Static: one text block beside all its images |
| 2+ | Rolling: the pinned text swaps (site `swap` motion) as each step's images reach it |

| `imageLayout` | Images |
| --- | --- |
| `joined` (default) | One 20px-radius surface, dividers between images, scroll scale 0.98 → 1 |
| `separate` | Each image its own 5px `radius-image` card with a `border-default` border, 16px apart |
| `plain` | Images only: no surface, rounding, divider or scaling |
| `screens` | Each step's `columns` (arrays of phone screenshots) side by side at the screens' own width, 16px apart (32px desktop); screens 16px apart (42px desktop); every column after the first sits 235px lower on desktop and runs into the next step. Steps 48px apart (42px desktop). Use `columns` instead of `images` |

An image with `full` opens the zoom viewer; `pill` puts a shared `EvidencePill` (e.g. Before / After) 16px above it, and labelled blocks sit 32px apart within a step and 64px between steps; `details` adds a text button for the step's first zoomable image. On mobile each step's text sits above its images. Need another kind of visual beside pinned text? Add an `imageLayout`, as `screens` was, rather than reusing `StickyNarrativeText` in a project component.

Used by Neo Advance (`neoAdvanceNarrative`, `neoAdvanceCoreFlows` with `screens`, `neoAdvanceDeliveryPanels` with `plain`) and Reimagining Analytics problem (`reimaginingAnalyticsProblem`, `separate`).

## BeforeAfterTemplate

`templates/BeforeAfterTemplate.tsx` · Figma `89:3854`, `89:4106`, `89:4186`

Structure only, built from the evidence primitives in `shared/`. Contract: `title`, `description`, `before`, `after` (each `{ label?, images, bullets }`, bullets `positive`/`negative`), plus a `variant`:

| `variant` | Structure | Config |
| --- | --- | --- |
| `before-after` (default) | Before / After | `before`, `after` |
| `before-iterated-after` | Before / Iterated / After | adds `iterated` |
| `grouped-before-after` | Two images share one pill and bullet list | `groupedSide`: `before` (default) or `after` |

Bullets are optional; a column with none renders only its pill and images.

`size: "wide"` uses the simple-section screenshot width (568px columns, 16px gaps, 5px `radius-image` corners, `border-default` frames). `rows` (`before-after` only) stacks more Before / After pairs under the same header, 48px apart (`--cs-row-gap`); a column's `label` renames its pill, and `label: null` hides the pill but keeps its space, so one pill can label a whole row. Without `navigation` the panel drops the tab-bar spacing and fixed min height. Used by Reimagining Analytics role-based experience (`reimaginingAnalyticsRoles`, Figma `116:891`).

Tabs (Figma `79:2211`): pass `{ tabsLabel, tabs: [{ id, label, data }] }` instead of one panel's data, where each `data` is a full Before / After configuration (any variant). The template owns the active tab and renders the shared `CaseStudyTabs`; only the inner content swaps, with the case-study swap motion. Used by Neo Advance hi-fi exploration (`neoAdvanceValidation`).

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

1. Reuse a template and its config before writing a section. Compose chapters in the page from content; no project-specific wrapper components.
2. Change content/config first.
3. Extend shared primitives minimally when needed.
4. Do not duplicate styling, typography or motion.
