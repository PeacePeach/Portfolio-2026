# Case-study templates

Central system: `src/components/case-study/`. Preview catalog: `/case-study-templates`.

| Layer | Location | Owns |
| --- | --- | --- |
| Shared rules and primitives | `shared/` | Case-study tokens (`caseStudyTokens.ts`), CSS (`caseStudy.css`), motion (`caseStudyMotion.ts`, `CaseStudyMotion.tsx`), `StoryTextBlock`, `CaseStudyChapterHeader`, `CaseStudyTabs`, evidence primitives (`EvidencePanelShell`, `EvidencePanelHeader`, `EvidenceColumn`, `EvidenceBullet`, `EvidencePill`) |
| Interactions | `shared/tell-me-about-it/` | `TellMeAboutIt` (below) |
| Templates | `templates/` | Structure only |
| Content | `src/content/case-study/`, `src/content/neoAdvance.ts` | Copy and config (`neoAdvance.ts`, `reimaginingAnalytics.ts`, `templateExamples.ts`) |
| Project visuals | `neo-advance/`, `reimagining-analytics/`, `brightcove-beacon/`, `mutexa/` | Only the custom hero artwork and the Work → case morph (`NeoHero`, `AnalyticsHero`, `AnalyticsMorph`, `BeaconHero`, `BeaconMorph`, `MutexaHero`, `MutexaMorph`); each hero band is painted in its Work tile's background colour |

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
| Centered or left text over full-width content, or text beside one artifact | `SimpleSectionTemplate` (`layout`) |
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

- `EvidencePanelShell` draws no background, border, radius or rules. Tabs, when given, are the small `CaseStudyTabs` on the content's left edge, 32px above the title (`--cs-tabs-title-gap`); the section around the panel keeps its 96px above and below.
- `EvidenceBullet` owns the one 16px check/x icon: `--cs-positive` / `--cs-negative` circle, white centred mark. The icon is centred on the first line box, so it sits centred beside a one-line bullet and level with the first line of a longer one. Do not offset individual bullets.

Shared tokens alias the site foundation in `src/app/globals.css` and the design system in `src/design-system/` (see [design-system.md](design-system.md)); motion composes the existing site primitives.

## Chapters

Case-study chapters use `CaseStudyChapterHeader` (`## _ CHAPTER TITLE`, dotted divider, chapter reveal): 128px chapter spacing, 12px title-to-divider, and 96px divider-to-content. Numbered headers (`NN _ TITLE`) also drive the nav's case-study progress (Figma `110:21962`, `Header`): once Chapter 01 reaches the anchor line under the nav, the left side shows `Case study: <project title from projects.ts>` and one dot per numbered chapter (completed `check`, current `highlight`, upcoming `tertiary`), each a link to its chapter; unnumbered headers are skipped, and below `lg` the nav is unchanged. Nothing to configure: number a chapter header and it appears. Sections within a chapter use `.cs-section`: consecutive sections get 96px, a separator line, then 96px (`--cs-chapter-gap`, `--cs-section-gap`).

## CaseIntroTemplate

`templates/CaseIntroTemplate.tsx`

The top of a case study: the project's hero band (`hero`, any node), then `IntroTemplate`, then the page's chapters (`children`) in `container-page`. The shell places the hero under the nav bar and keeps it hidden while the Work → case morph layer still covers it; the intro text rises in last (`morphTiming`). Contract: `{ hero, intro: IntroData, children }`. The hero artwork itself stays project-specific.

Used by Neo Advance (`<NeoHero />`, `neoAdvanceIntro`), Reimagining Analytics (`<AnalyticsHero />`, `reimaginingAnalyticsIntro`) Brightcove Beacon (`<BeaconHero />`, `brightcoveBeaconIntro`) and Mutexa (`<MutexaHero />`, `mutexaIntro`).

## IntroTemplate

`templates/IntroTemplate.tsx` · Figma `83:3038` (specimen), `51:24883` (Neo Advance) · Preview `/case-study-templates/intro`

Contract: `{ eyebrow?, title, paragraphs, facts?: { label, items }[], align? }`. A 720px block centred on the page: Display M title and Body M copy at left, Label S / Body S facts at right; stacks below `md`. `eyebrow` adds a Body XS secondary all-caps line 12px above the title; with no `facts` the facts column is dropped. `align: "left"` (Figma AI-Portfolio `174:3199`) puts the title and copy, 647px wide, on the page's left edge instead. Reuses the site type roles and spacing scale. Fact items are sentence case: only the first word is capitalised, plus proper nouns and acronyms (`iOS`, `B2B`, `CMS`, `UX`), e.g. `Design lead`, `B2C fintech`, `Design system`; labels render all caps from CSS. The block sits 128px (`pt-32`) below the hero. Callers own the hero band and the page container (`container-page`). Each part reveals with the case-study text reveal; pass `reveal` to swap the motion (Neo Advance passes its Work → case morph rise).

Rendered by `CaseIntroTemplate`, which passes the morph rise as `reveal`, and by the Leadership page (`leadershipIntro`, `align: "left"` with an eyebrow and no facts). Leadership's pillars are `CaseStudyChapterHeader` + a one-step `NarrativeTemplate` (scrolling artifacts): the pillar text pinned left, and as its unframed `visual` (`frame: false`) a `PillarFramework` panel over the featured-proof `PowerFragmentCard`s (`leadershipPillars`). The closing pairs `Testimonial`s on the `.cs-text-columns` grid.

## Replacing template text

Every template's text area takes an optional `text` (any React node, e.g. an icon with text) that replaces its label, title and body: `SimpleSectionTemplate` and `StoryTextBlock` (`text`), each `NarrativeTemplate` step and `HorizontalSlidesTemplate` slide (`step.text`, `slide.text`), and the `BeforeAfterTemplate` header (`text`, replacing title and description). The template keeps its width, spacing and reveal around it. `title` stays required: it becomes the accessible name (and Narrative's image-viewer title). Build any new text component in the design system first.

Text components for the slot live in `shared/`:

- `PersonaQuote` (Figma `43:348`): 48px round avatar over the persona name (chapter-label type, uppercase, one word per line, as wide as its longest word), left-aligned, 12px beside the quote (`caseStudyType.quote` = `type-body-m-italic`, primary). Used by Reimagining Analytics final design (`reimaginingAnalyticsFinalDesign`, `SimpleSectionTemplate` with `align: "left"` and `inset`); at the 561px left text width the quote runs about as tall as avatar and name. Optional `tags` add the screens' tasks as muted `Pill`s 16px under the quote (as `PersonaTasks`); used by Brightcove Beacon final design (`brightcoveBeaconFinalDesign`).

- `brightcove-beacon/BeaconTeamMap` (Figma `114:282`, laid out for AI-Portfolio `164:5187`): Xstream.ly's team of teams as an SVG bubble map filling a 704×403 card; the opener step's `visual` in `brightcoveBeaconContext`. Bubble colours are the original illustration's.
- `PillarFramework` (Figma AI-Portfolio `176:3567`): four columns (Business Challenge, Strategic Questions, Methods & Tools, What It Enables) on a panel styled like the Super power fragment card (`card` fill, 10px corners, `ink/10` border); each item sits beside the shared `AccentBar` (the Reflection bar, now `shared/AccentBar.tsx`), rows lined up across columns; stacks below `md`.
- `Testimonial` (Figma AI-Portfolio `176:4579`): `AccentBar` beside a quote in `type-body-m-italic` and its author (secondary, optional link) 12px below.
- `StatCircles` (Figma Slides `187:3402`): a row of headline numbers, each centred in a 240px circle lit from its lower left in the Impact accent blue and fading into the page at its upper right; value in the Impact value style, label in Body M; circles reveal in turn and stack below `lg` (three 240px circles don't fit a tablet row). Used as `SimpleSectionTemplate` content by Mutexa "The Opportunity" (`mutexaOpportunityStats`).
- `PersonaTasks` (Figma `114:2259`): one workflow step's people (48px round avatar, name in Label S, role in Body S secondary), an optional handoff note (Body XS secondary), then their tasks as `muted` Pills. Used by Brightcove Beacon "How They Collaborate?" as each `NarrativeTemplate` step's `text` (`brightcoveBeaconCollaborationFlow`, `separate`).

## SimpleSectionTemplate

`templates/SimpleSectionTemplate.tsx` · Figma `135:1453` · Preview `/case-study-templates/simple-section`

Contract: `StoryTextBlock` data (`label?`, `title`, `body`, `heading?`) plus `align` and a `variant`. `align: "center"` (default) centres a 400px `StoryTextBlock`; `align: "left"` puts a 561px one on the content's left edge (Figma `150:4909`). `inset` (from 1280px) moves text and content 128px in from each side (`--cs-section-inset`, Figma `43:215`), for screenshots that shouldn't fill the page width. Either sits above full-width content: 96px from the dividers above and below, 64px from text to content. `compact` halves text to content to 32px (`--cs-content-top-compact`). `layout: "horizontal"` (Figma `166:5550`) puts the text (320) beside the content (704) from 1024px, 128px apart on the 1152 grid, both vertically centred; the text keeps every `StoryTextBlock` option, and below 1024px it stacks as usual. Use it for one artifact beside text (Brightcove Beacon Diving deeper); scrolling artifacts stay in `NarrativeTemplate`. Text uses the case-study text reveal. Followed directly by another section with no divider (e.g. a `NarrativeTemplate`), it acts as that section's intro: one 96px gap from its text to the next section's content instead of two (Brightcove Beacon How They Collaborate).

| `variant` | Content | Config |
| --- | --- | --- |
| `container` (default) | Any children | `children` |
| `before-after` | Two 568px desktop screenshots, 16px apart, each 16px under its Before / After pill (Figma `110:18926`); stacks below `md` | `before`, `after` (`EvidenceColumn` data, bullets optional) |

Used by Reimagining Analytics (`reimaginingAnalyticsReframing`, `before-after`; role insights, left; final design, one left-aligned `inset` section per screen with a `PersonaQuote` text slot over the screen, `reimaginingAnalyticsFinalDesign`).

## HorizontalSlidesTemplate

`templates/HorizontalSlidesTemplate.tsx` · Figma `89:5440` · Preview `/case-study-templates/horizontal-slides`

Contract: `{ label, compact?, slides: [{ id, title, body, image: { src, alt, width, height } }] }`. A 696px section-title `StoryTextBlock` (12px title to body) over 879px slides, 16px apart, 64px below the text (32px with `compact`); the track bleeds to the right viewport edge and a 337px fade covers the next slide's peek. Images use `radius-image` and `border-default`.

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
- `shared/CaseStudySectionHeader.tsx`: 508px block, Display XS title (32px regular) over Body M secondary copy, 12px apart. A title with no copy centres on the block. `description` takes a string or several paragraphs (24px apart); the Leadership page uses it for its framework and closing headers (`leadershipFramework`, `leadershipClosing`).

Used by Neo Advance (`neoAdvanceImpact`) and Reimagining Analytics (`reimaginingAnalyticsImpact`).

## ReflectionTemplate

`templates/ReflectionTemplate.tsx` · Figma `89:5173` / `99:38841` · Preview `/case-study-templates/reflection`

Contract: `{ headline, body, accent? }`. A centred 500px column: the headline (story title type, primary), then the supporting copy (story body) 33px below. `accent: "bar"` (default) adds a 4px rounded gradient bar 16px left of the headline (`--cs-reflection-accent` → 20%); `accent: "none"` drops it. Reveals with the site scroll reveal. Goes under a chapter header such as `0N _ REFLECTION`, optionally followed by a `FollowUpTemplate`.

Used by Neo Advance (`neoAdvanceReflection`, then `FollowUpTemplate` with `neoAdvanceClosing`) Reimagining Analytics (`reimaginingAnalyticsReflection`), Brightcove Beacon (`brightcoveBeaconReflection`) and Mutexa (`mutexaReflection`).

## FollowUpTemplate

`templates/FollowUpTemplate.tsx` · Figma `99:39434` / `99:39393` · Preview `/case-study-templates/follow-up`

The case study's closing follow-up: Tell Me About It feedback on the left, the next case study's Work tile (`UpNext`) on the right. Contract: `{ feedback: { eyebrow, title, quickReplies?, placeholder?, sendLabel?, sentAnnouncement? }, current: thisCaseStudySlug }`. A preset of `TwoColumnTextTemplate`, so layout, spacing, reveal and stacking are the same. Goes last, after the reflection in the same chapter.

Up Next picks the tile itself, so content never names it: the first case study in `upNextOrder` (`src/content/projects.ts`: Neo Advance, Mutexa, Brightcove Beacon, Reimagining Analytics) that isn't the current one and hasn't been opened in this browser session; once every one has been seen, the first in that order. `CaseStudyViewTracker` (in the `/work` layout) records each opened case study in `sessionStorage` (`src/lib/viewedCaseStudies.ts`). The server render and storage-blocked browsers use the plain priority order. To change the recommendation, edit `upNextOrder`.

Used by Neo Advance (`neoAdvanceClosing`) and Reimagining Analytics (`reimaginingAnalyticsFollowUp`).

## TwoColumnTextTemplate

`templates/TwoColumnTextTemplate.tsx` · Figma `83:3445` · Preview `/case-study-templates/two-column-text`

Contract: `columns: [column, column]`. Each column is either static story text `{ label?, title, body }` (rendered with `StoryTextBlock`) or `{ tellMeAboutIt: TellMeAboutItData }`. One layout covers static + static and static + interactive. Columns use the site scroll reveal with the case-study stagger, stack into one column (at most 400px wide) when two fixed columns don't fit, and omit the label gap when no label is given.

Used by Neo Advance early discovery, concept exploration, hi-fi exploration and closing (`neoAdvanceEarlyDiscovery`, `neoAdvanceConceptExploration`, `neoAdvanceHiFiExploration`) and, through `FollowUpTemplate`, every closing follow-up.

## StoryTextBlock

`shared/StoryTextBlock.tsx` · Figma `138:1719` · Preview `/case-study-templates/story-text`

The one text block for case-study copy: optional label, title, body. Two switches:

| Switch | Options |
| --- | --- |
| `label` | Omit for no label; Body XS secondary, 12px above the title |
| `heading` | `chapter` (default): Display 32 Regular title. `section`: Heading M title |

The optional label above the title is always rendered all caps (`.cs-chapter-label`), whatever case the content uses. Title to body is 16px under a chapter title and 12px under a section title. Width belongs to the caller (400 for chapter text, the grid column for section text). Used by `SimpleSectionTemplate`, `TwoColumnTextTemplate`, `TellMeAboutIt` (chapter) and `NarrativeTemplate`, `HorizontalSlidesTemplate` (section).

## NarrativeTemplate

`templates/NarrativeTemplate.tsx` · Figma `83:3560` (joined), `116:667` (separate), `89:5173` (plain), `94:5545` (screens) · Preview `/case-study-templates/narrative`

Text pinned on the left (320) beside images on the right (704), 128px apart. Contract: `label`, `steps: [{ id, title, body, images, visual?, frame?, details? }]`; `visual` replaces a step's images with any component (e.g. a diagram built in code), framed like a `separate` image (`frame: false` drops the frame for content that draws its own surfaces), each image `{ src, alt, width, height, full? }`, plus `imageLayout`:

| Steps | Text |
| --- | --- |
| 1 | Static: one text block pinned beside all its images. For text beside a single artifact that doesn't scroll, use `SimpleSectionTemplate` with `layout: "horizontal"` instead |
| 2+ | Rolling: the pinned text swaps (site `swap` motion) as each step's images reach it |
| Held | A step with no `images`, `visual` or `columns` keeps the previous step's visual pinned (desktop) while its own text swaps in; each held step adds 50svh of scroll. The pinned block fills the viewport, so the next visual stays below the fold until the swap is done and the hold releases, then everything scrolls on together. Mobile shows its text in flow. Used by Brightcove Beacon's Customer Problem beside the team map |

| `imageLayout` | Images |
| --- | --- |
| `joined` (default) | One 20px-radius surface, dividers between images, scroll scale 0.98 → 1 |
| `separate` | Each image its own 5px `radius-image` card with a `border-default` border, 16px apart |
| `plain` | Images only: no surface, rounding, divider or scaling |
| `screens` | Each step's `columns` (arrays of phone screenshots) side by side at the screens' own width, 16px apart (32px desktop); screens 16px apart (42px desktop); every column after the first sits 235px lower on desktop and runs into the next step. Steps 48px apart (42px desktop). Use `columns` instead of `images` |

An image with `full` opens the zoom viewer; `pill` puts a shared `EvidencePill` (e.g. Before / After) 16px above it, and labelled blocks sit 32px apart within a step and 64px between steps; `details` adds a text button for the step's first zoomable image. On mobile each step's text sits above its images. Need another kind of visual beside pinned text? Add an `imageLayout`, as `screens` was, rather than reusing `StickyNarrativeText` in a project component.

Used by Neo Advance (`neoAdvanceNarrative`, `neoAdvanceCoreFlows` with `screens`, `neoAdvanceDeliveryPanels` with `separate`) and Reimagining Analytics problem (`reimaginingAnalyticsProblem`, `separate`).

## BeforeAfterTemplate

`templates/BeforeAfterTemplate.tsx` · Figma `89:3854`, `89:4106`, `89:4186`

Structure only, built from the evidence primitives in `shared/`. Contract: `title`, `description`, `before`, `after` (each `{ label?, images, bullets }`, bullets `positive`/`negative`), plus a `variant`:

| `variant` | Structure | Config |
| --- | --- | --- |
| `before-after` (default) | Before / After | `before`, `after` |
| `before-iterated-after` | Before / Iterated / After | adds `iterated` |
| `grouped-before-after` | Two images share one pill and bullet list | `groupedSide`: `before` (default) or `after` |

Bullets are optional; a column with none renders only its pill and images.

`size: "wide"` uses the simple-section screenshot width (568px columns, 16px gaps, 5px `radius-image` corners, `border-default` frames); with tabs it drops the 1066px panel floor (sized for phone screens) and hugs its content, so the next chapter or section starts its usual gap right after the bullets. `rows` (`before-after` only) stacks more Before / After pairs under the same header, 48px apart (`--cs-row-gap`); a column's `label` renames its pill, and `label: null` hides the pill but keeps its space, so one pill can label a whole row. Without `navigation` the panel drops the tab-bar spacing and fixed min height. Used by Reimagining Analytics role-based experience (`reimaginingAnalyticsRoles`, Figma `116:891`).

Tabs (Figma `89:3670`): pass `{ tabsLabel, tabs: [{ id, label, data }] }` instead of one panel's data, where each `data` is a full Before / After configuration (any variant). The template owns the active tab and renders the shared `CaseStudyTabs` at `size="small"`: no divider lines, left-aligned with the title and description, 32px above them. Every tab shares the widest tab's content width, so the tabs and title never move when a tab with another variant opens; narrower content sits at the left. Phone-screen tabs keep an 873px floor (tabs, gap and the tallest Figma panel) so swapping tabs doesn't move the page; `wide` tabs hug their content. Only the inner content swaps, with the case-study swap motion. Used by Neo Advance hi-fi exploration (`neoAdvanceValidation`) and Brightcove Beacon design execution (`brightcoveBeaconSprintFlows`, `wide`).

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
