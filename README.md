# Portfolio — Homepage V1

Next.js (App Router) · TypeScript · Tailwind CSS 4 · Motion for React.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Where to change things

| What | Where |
|---|---|
| Colors, type scale, spacing, grid, breakpoints, CSS easing/durations | `src/app/globals.css` (`@theme` block) |
| Fonts (Fraunces display, Geist body) | `src/design/fonts.ts` |
| Motion timing (loader, HX glide, hero roll and dock, content swaps) | `src/design/motion.ts` |
| Hero copy, loader name, nav (Work / About / Resume), footer, email | `src/content/site.ts` |
| Projects and case-study sections | `src/content/projects.ts` |
| Capabilities and evidence snippets | `src/content/capabilities.ts` |
| Data access (swap in CMS / AI-curated evidence later) | `src/content/index.ts` |

Evidence snippets carry `capabilityIds`, `projectSlug`, `sectionId` (deep link to
`/work/[slug]#section`), optional `image`, `status` and `provenance`
(`curated` or `generated`), so new snippets from any source render without UI changes.

## Components

`Header`, `Hero`, `ExploreSection`, `ModeSelector`, `ProjectGallery`,
`ProjectTile`, `CapabilitySelector`, `EvidencePreview`, `Footer`, plus `ui/`
primitives (`RollText`, `Media`, `PlaceholderTag`, `Icons`).

## Notes

- Opening sequence follows the Figma frames: loader counts to 100%, the name collapses to
  "HX", which glides to the header logo; the headline rolls in, then docks to the left.
  Every value lives in `intro` in `src/design/motion.ts`.
  Turn the loader off with `site.loader.enabled = false`.
- "Get to know me by" panel (`KnowMe`) wipes in after the headline docks; options live in `site.knowMe`.
- `/about`, `/resume` and `/hanxgpt` are placeholders until their content is supplied.
- Explore view state is shareable: `/?view=capability&capability=design-systems#explore`.
- `prefers-reduced-motion` removes movement (Motion `reducedMotion="user"` + CSS guard).
- Placeholder artwork in `public/placeholders/` is generated, not from any reference site.
