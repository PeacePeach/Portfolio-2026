<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Case-study system

Before creating or editing case-study sections, read [docs/case-study-templates.md](docs/case-study-templates.md). Reuse the templates and shared rules in `src/components/case-study/`; change content configuration first. Keep the system documentation in that single file.

## Portfolio design system

Read [docs/design-system.md](docs/design-system.md) before adding portfolio primitives. Reuse `src/design-system/`; CSS foundation values remain in `src/app/globals.css`, and existing typography/motion definitions remain in `src/design/`.
