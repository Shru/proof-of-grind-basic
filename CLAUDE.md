# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:3000
npm run build     # Production build (output to build/)
```

To deploy the Edge Function:
```bash
supabase functions deploy <function-name> --use-api
```

No test suite or linter is configured.

## Environment Setup

Copy `.env.example` to `.env` and fill in Supabase credentials:
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anon (public) key

Variables prefixed with `VITE_` are exposed to the browser bundle.

## Architecture

This is a React + Vite + TypeScript SPA backed by a Supabase-hosted Deno/Hono Edge Function.

### Frontend (`src/`)

All application state lives in `App.tsx` and is passed down as props — there is no global state library. The three top-level views (`filter === "all"` / `"active"` / `"completed"`) conditionally render different feature panels:

- `filter === "all"` → `TodoInput` (add tasks)
- `filter === "active"` → `TodoFilters` (sort/filter controls)
- `filter === "completed"` → `ShareGrind` (share modal)

Data is persisted via debounced auto-save (500 ms) whenever `todos` or `customCategories` state changes.

API calls go through `src/utils/api.ts` (not yet explored, but imported as `checkAuthentication`, `login`, `logout`, `signup`, `fetchTodos`, `saveTodos`, `fetchCategories`, `saveCategories`, `createShareLink`). This module is the sole boundary between the frontend and the backend.

### Backend (`supabase/functions/<function-name>/`)

A Deno/Hono Edge Function deployed on Supabase. The source lives in two places — `supabase/functions/` is what the Supabase CLI deploys; `src/supabase/functions/` is the copy kept alongside the frontend source. Keep them in sync when making changes. User data (todos, categories, share snapshots) is stored in a Supabase Postgres table as a JSON key-value store via `kv_store.ts`. Keys follow the pattern:
- `user:{userId}:todos`
- `user:{userId}:categories`
- `share:{shareId}`

Auth is handled by Supabase Auth; the server verifies JWTs by calling `supabase.auth.getUser(accessToken)` on each request. User creation uses `supabase.auth.admin.createUser` with `email_confirm: true` (no email confirmation flow).

### Share feature

`ShareGrind` lets users create a shareable link to their completed tasks. The link encodes a `?share=<uuid>` query param; on load, `App.tsx` detects this param and renders `ShareView` instead of the main app, fetching the snapshot from the server by ID.

### UI components

`src/components/ui/` contains shadcn/ui primitives (Radix UI + Tailwind). These are generated files — prefer using them as-is over modifying them. Use `cn()` from `src/components/ui/utils.ts` for conditional class merging.

The app logo is at `src/assets/logo.png` and imported directly in `App.tsx`, `Auth.tsx`, `ShareGrind.tsx`, and `ShareView.tsx`.
