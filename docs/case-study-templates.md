# Case-study templates

Central system: `src/components/case-study/`. Preview catalog: `/case-study-templates`.

| Layer | Location | Owns |
| --- | --- | --- |
| Shared rules and primitives | `shared/` | Case-study tokens (`caseStudyTokens.ts`), CSS (`caseStudy.css`), motion (`caseStudyMotion.ts`, `CaseStudyMotion.tsx`), `StoryTextBlock`, `CaseStudyChapterHeader`, `CaseStudyTabs`, evidence primitives (`EvidencePanelShell`, `EvidencePanelHeader`, `EvidenceColumn`, `EvidenceBullet`, `EvidencePill`) |
| Interactions | `shared/tell-me-about-it/` | `TellMeAboutIt` (below) |
| Templates | `templates/` | Structure only |
| Content | `src/content/case-study/` | Copy and config (`neoAdvance.ts`, `templateExamples.ts`) |

Shared tokens alias the site foundation in `src/app/globals.css` and the design system in `src/design-system/` (see [design-system.md](design-system.md)); motion composes the existing site primitives.

## TwoColumnTextTemplate

`templates/TwoColumnTextTemplate.tsx` · Figma `83:3445` · Preview `/case-study-templates/two-column-text`

Contract: `columns: [column, column]`, where each column is either static story text `{ label?, title, body }` (rendered with `StoryTextBlock`) or `{ tellMeAboutIt: TellMeAboutItData }`. One layout covers static + static and static + interactive. Columns use the site scroll reveal with the case-study stagger, stack on mobile, and omit the label gap when no label is given.

Used by Neo Advance early discovery (`neo-advance/NeoEarlyDiscovery.tsx`, content `neoAdvanceEarlyDiscovery`).

## TellMeAboutIt

`shared/tell-me-about-it/TellMeAboutIt.tsx` · Figma `99:39795` (prompt), `99:39796` (feedback) · Preview `/case-study-templates/tell-me-about-it`

The one reader-input interaction. It owns state, the pen-icon header, the response field, send and optional skip, the thinking state and the optional resolution. Callers own the grid, chapter layout and page spacing.

| `variant` | Structure | Config |
| --- | --- | --- |
| `prompt` | Eyebrow, story title, 120px field, Skip and reveal, send → H loader (16px, "Here’s what I did ...") → resolved `StoryTextBlock` | `eyebrow`, `title`, `resolved: { label?, title, body }`; optional `skipLabel`, `loadingLabel`, `placeholder`, `sendLabel` |
| `feedback` | Eyebrow, Heading M title, 275px field with quick replies, send; no skip, loading or resolution | `eyebrow`, `title`, `quickReplies`; optional `placeholder`, `sendLabel`, `sentAnnouncement` |

- Reuses the shared system: case-study type roles (`caseStudyType`), colors, spacing and pill tokens, `react-feather` icons, the site `swap` motion through `caseStudyMotion`, and reduced-motion handling. Interaction-only values are the `--cs-tma-*` entries in `caseStudyTokens`.
- `ThinkingIndicator` is the H loader; `QuickReplyChip` and the 32px send control stay local to this interaction until another one needs them.
- Responses stay on the page; `onSubmit` is optional. Feedback has no visible post-send state.
- Add a new `variant` here rather than copying the interaction.

## Rules

1. Reuse a template and its config before writing a section.
2. Change content/config first.
3. Extend shared primitives minimally when needed.
4. Do not duplicate styling, typography or motion.
