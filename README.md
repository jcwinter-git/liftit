# LiftIt

A lightweight personal workout tracker. Log exercises with weight/reps per set, then see workout frequency and per-exercise volume (reps × weight) over time.

Built with Vite + React (client-side SPA), Supabase (Postgres + Auth, called directly from the browser), and shadcn/ui, deployed on Vercel as a static site.

## Getting started

1. Create a Supabase project and run [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) in its SQL editor.
2. Copy `.env.local.example` to `.env.local` and fill in your Supabase project URL and anon key.
3. Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Sign in via the magic-link email flow, then log a workout.

## Deploying

Vercel auto-detects the Vite framework preset. `vercel.json` adds the SPA fallback rewrite so client-side routes (e.g. `/workouts/123`) work on direct load/refresh.

```bash
vercel link
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel deploy --prod
```
