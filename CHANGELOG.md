# Changelog

## 2026-09-08

### Editing and viewing workouts
- Saved workouts can now be edited. Opening a workout shows an **Edit** button that
  turns the view into the same form used for logging, pre-filled with what you
  logged, and back to read-only when you save.
- The workout view now shows each exercise's body-part icon next to its name, and a
  **Total** for that exercise (volume, or total reps for bodyweight work).
- **Notes** moved to the bottom of the edit form. It's no longer on New workout,
  since that's the plan-the-workout step — you add notes after the fact.
- Delete now needs a second tap to confirm instead of firing immediately.

### Logging a workout
- **+ Add set** replaced by a small `+` next to the weight/reps fields.
- **Save workout** replaced by **Cancel** and **Save** in the lower right. Cancel
  arms a confirm step first — it turns red and reads "Confirm?" until you tap again
  (or 4 seconds pass).

### Home screen
- Added a 14-day activity grid (two rows of seven) above the workout list. Each day
  is shaded by training load — weighted volume plus reps for bodyweight work —
  scaled against your hardest day in the window.

### Housekeeping
- Added this changelog, plus a `CLAUDE.md` noting that every requested change gets
  an entry here.

## 2026-09-07

### Logging a workout
- Exercise cards get an `×` in the top-right corner instead of a "Remove" button.
- Picking a body part now pre-selects that part's usual exercise (Arms → Bicep
  Curls, Back → Pull ups, Chest → Dumbbell Bench, Shoulders → Military press,
  Legs → Cossacks, Abs → Leg Raises).
- Each exercise shows **Today / Prev / Max** volume, falling back to total reps for
  bodyweight moves.
- A **Today's targets** checklist opens when you start a workout; picking body parts
  builds one pre-filled exercise card each.
- Body part, weight and reps fields narrowed to fit an iPhone 13 screen.
- Body-part icons replaced with anatomical hugeicons glyphs.

### Exercises
- Exercises gained a body-part category (Arms, Back, Chest, Legs, Shoulders, Abs,
  Other), and the exercise dropdown filters to the body part you picked.
- Seeded the exercises from your written log and categorised them.

### Accounts
- Switched sign-in from magic links to email and password, with a
  forgot-password flow, after magic links kept hitting Supabase's email rate limit.

### Foundations
- Rebuilt the app on Vite + React Router (from Next.js) as a client-side SPA talking
  straight to Supabase.
- First version: accounts, logging workouts with weight/reps per set, workout
  history with a calendar, and per-exercise volume trends.
