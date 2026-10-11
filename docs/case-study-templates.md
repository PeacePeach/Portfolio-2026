# Case-study templates

Central system: `src/components/case-study/`. Preview catalog: `/case-study-templates`.

| Template | Content contract | Preview |
| --- | --- | --- |
| `BeforeAfterTemplate` | `title`, `description`, evidence groups below | `/case-study-templates/before-after` |
| `TwoColumnTextTemplate` | `columns: [column, column]`; each column is `{ label?, title, body }` or `{ tellMeAboutIt: TellMeAboutItData }` | `/case-study-templates/two-column-text` |

Both live in `templates/`; all layout values, typography and motion live in `shared/`. Text blocks reuse `StoryTextBlock` and the site scroll reveal. Two-column text follows Figma `83:3445`, stacks on mobile, and omits the label gap when no label is provided. Example content lives in `src/content/case-study/templateExamples.ts`.

Before / After variations:

| `variant` | Structure | Config |
| --- | --- | --- |
| `before-after` (default) | Before / After | `before`, `after` |
| `before-iterated-after` | Before / Iterated / After | `before`, `iterated`, `after` |
| `grouped-before-after` | Two images grouped on either side | `groupedSide` defaults to `before`; use `after` to group `after.images` |

All accept `title`, `description`, optional group labels, local image paths/alt text, and bullets (`positive`/`negative`). The grouped images share one pill and bullet list; on small screens they stack within that same group. Other image arrays stack within their column.

- Shared rules/primitives: `src/components/case-study/shared/`. Tokens alias the site foundation; CSS owns styling; motion composes existing site primitives. Templates contain structure only.
- Content/examples: `src/content/case-study/neoAdvance.ts`. Usage: `<BeforeAfterTemplate {...config} />`.
- Preview: `/case-study-templates/before-after` — tabs demonstrate all three variants. Figma: `89:3854`, `89:4106`, `89:4186`.
- Optional tabs: supply `navigation`, `contentId`, `activeTabId`, and `contentKey`. Only inner content swaps; the shell and tabs remain mounted.

1. Reuse the template and select its variant.
2. Change config/content only.
3. Extend shared primitives minimally when needed.
4. Do not duplicate styling, typography, or motion.

## Tell Me About It

`shared/tell-me-about-it/TellMeAboutIt.tsx` is the one reader-input interaction. Preview: `/case-study-templates/tell-me-about-it`. Figma: `99:39795`, `99:39796`.

| `variant` | Structure | Config |
| --- | --- | --- |
| `prompt` | Pen eyebrow, story title, 120px field, Skip and reveal, send → H loader → resolved `StoryTextBlock` | `eyebrow`, `title`, `resolved: { label?, title, body }`; optional `skipLabel`, `loadingLabel`, `placeholder`, `sendLabel` |
| `feedback` | Pen eyebrow, Heading M title, 275px field with `QuickReplyChip`s, send; no skip/loading/resolved | `eyebrow`, `title`, `quickReplies`; optional `placeholder`, `sendLabel`, `sentAnnouncement` |

It owns state, header, field, send/skip, loading and resolution; callers own grid, chapter and spacing. Place it beside static text via the two-column template (static + static or static + interactive). Responses stay local; `onSubmit` is optional. Extend this component with a new `variant` instead of copying it. `QuickReplyChip` and the 32px send control are interaction-local until reused elsewhere; tokens are the `--cs-tma-*` entries in `caseStudyTokens`.

Section 03 uses `neoAdvanceValidationThemes` in the same content file. Image metadata may specify width/height and an optional overlay for layered Figma evidence. Keep these asset dimensions in content, not page CSS.
