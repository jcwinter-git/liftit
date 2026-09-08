# LiftIt

A lightweight personal workout tracker. Log exercises with weight/reps per set, then see workout frequency and per-exercise volume (reps × weight) over time.

Built with Next.js (App Router), Supabase (Postgres + Auth), and shadcn/ui, deployed on Vercel.

## Getting started

1. Create a Supabase project and run [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) in its SQL editor.
2. Copy `.env.local.example` to `.env.local` and fill in your Supabase project URL and anon key.
3. Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign in via the magic-link email flow, then log a workout.

## Deploying

```bash
vercel link
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel deploy --prod
```
