# LiftIt — working notes

## Changelog

Every user-requested change gets an entry in `CHANGELOG.md`, in the same commit as
the change. Newest first, grouped by date. Describe what changed from the user's
point of view (what they'd notice in the app), not the internal refactor.

## Stack

Vite + React + React Router SPA, Supabase (Postgres + Auth) called directly from
the browser with RLS enforcing per-user access, shadcn/ui components, deployed to
Vercel as a static build. There is no server layer — `src/lib/api/workouts.ts` is
the whole data access surface.

SQL lives in `supabase/migrations/` but is applied by hand in the Supabase SQL
editor; there's no migration runner wired up.
