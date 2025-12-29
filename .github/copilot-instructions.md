# Copilot & AI Agent Instructions for jaygenwedding

## Project Overview
- **Framework:** Vue 3 + Vite + TypeScript
- **UI:** TailwindCSS, shadcn-vue, reka-ui, custom animated backgrounds
- **Purpose:** Wedding website with RSVP, event info, and interactive visuals

## Architecture & Patterns
- **Component Structure:**
  - All main UI is in `src/components/`, with further grouping by type (e.g., `ui/button/`, `ui/card/`, etc.)
  - Custom animated backgrounds: `NeuralBg.vue`, `WavyBackground.vue`, `FluidCursor.vue`
  - UI primitives and variants are scaffolded using shadcn-vue conventions (see `ui/` subfolders)
- **Config:**
  - Site-wide data (names, date, venue, etc.) is in `src/config/config.json` and imported where needed
- **Styling:**
  - TailwindCSS is used throughout, with utility merging via `cn()` in `src/lib/utils.ts`
  - Component variants use `class-variance-authority` (see `buttonVariants` in `ui/button/index.ts`)
- **Re-exports:**
  - UI components are re-exported via `index.ts` in each subfolder for ergonomic imports

## Developer Workflows
- **Development:**
  - Start dev server: `npm run dev`
  - Build for production: `npm run build`
  - Preview build: `npm run preview`
- **Type Checking:**
  - Uses `vue-tsc` for type checking in build
- **No explicit test or lint scripts** are present; add as needed

## Conventions & Integration
- **Imports:**
  - Use `@/` alias for `src/` (see `vite.config.ts`)
  - Prefer named imports from `ui/` subfolders via their `index.ts`
- **Props & Types:**
  - All components use TypeScript and `defineProps`/`withDefaults` for prop typing
- **External Libraries:**
  - Animations: `ogl`, `simplex-noise`, `motion-v`, `inspira-ui` (for extra JS animation effects)
  - UI: `reka-ui`, `lucide-vue-next`, `@vueuse/core`
- **No backend/server code** in this repo; all data is static or handled client-side

## Examples
- To add a new button variant, update `buttonVariants` in `src/components/ui/button/index.ts`
- To use config data, import from `@/config/config.json`
- To add a new UI primitive, follow the pattern in `ui/` (component, export in `index.ts`, use `cn()` for classes)

## Key Files & Directories
- `src/components/` — All UI components
- `src/config/config.json` — Site-wide config
- `src/lib/utils.ts` — Utility functions (e.g., `cn`)
- `vite.config.ts` — Build config and path aliases

---
For new patterns or workflows, update this file to keep AI agents effective.
