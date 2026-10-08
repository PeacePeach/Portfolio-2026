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
| Fonts | `src/design/fonts.ts` |
| Motion timing (hero entrance, content swaps, scroll) | `src/design/motion.ts` |
| Hero copy, nav, footer, email | `src/content/site.ts` |
| Projects and case-study sections | `src/content/projects.ts` |
| Capabilities and evidence snippets | `src/content/capabilities.ts` |
| Data access (swap in CMS / AI-curated evidence later) | `src/content/index.ts` |

Evidence snippets carry `capabilityIds`, `projectSlug`, `sectionId` (deep link to
`/work/[slug]#section`), optional `image`, `status` and `provenance`
(`curated` or `generated`), so new snippets from any source render without UI changes.

## Components

`Header`, `Hero`, `ScrollCue`, `ExploreSection`, `ModeSelector`, `ProjectGallery`,
`ProjectTile`, `CapabilitySelector`, `EvidencePreview`, `Footer`, plus `ui/`
primitives (`MaskReveal`, `FadeIn`, `Media`, `PlaceholderTag`, `Icons`).

## Notes

- Hero entrance timing is provisional (see `heroIntro` in `src/design/motion.ts`).
- Explore view state is shareable: `/?view=capability&capability=design-systems#explore`.
- `prefers-reduced-motion` removes movement (Motion `reducedMotion="user"` + CSS guard).
- Placeholder artwork in `public/placeholders/` is generated, not from any reference site.
