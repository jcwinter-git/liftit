# Changelog

## 2026-09-09 (night)

### Home
- **The trend mark is now a solid zigzag bolt** instead of a thin line — it holds
  its own next to the black new-workout block.
- **LiftIt is 25% bigger** in the header, and the trend mark now sits on the same
  line, over on the right — it used to hang below on its own row. It only shows
  on the home screen.
- **Tapping a day on the calendar now opens that workout in a pop-up** instead of
  navigating away — exercises, sets and per-exercise totals, with an `x` in the
  top right to dismiss it. "Open workout" in the pop-up still takes you to the
  full page if you want to edit.

### Data
- Added `supabase/migrations/0007_backfill_workout_log.sql`, which backfills the
  handwritten log from **8 Aug through 7 Sep** — 9 sessions, 78 sets. Bench,
  biceps, military press and RDL loads are doubled, since those are logged per
  dumbbell. Run it in the Supabase SQL editor; it skips any date that already has
  a workout, so it's safe to re-run.

## 2026-09-09 (evening)

### Exercises
- **Abs moved from orange to teal**, so it no longer sits almost on top of Arms'
  amber. Changed everywhere — the body-part tiles, History exercise names, and
  trend lines. Teal reads at 5.5:1 on white, so it stays comfortably legible.

## 2026-09-09 (later)

### Home
- The new-workout button is back to the solid black block with the `+` that spins
  on press. The hand-drawn pencil circle is gone.
- Added a small line-chart mark in the top right that opens History.

### Logging a workout
- All the text is roughly 25% larger, and Cancel / Save are now full-size buttons.
  Inputs are 16px, which also stops iOS zooming in when you tap a field.
- Fixed the alignment knocked out by the drag handle — the exercise pill and set
  rows now sit clear of it.

### History
- Trend charts now have a **y-axis with numbers** (short-form, e.g. `1.0k`).
- Exercise names are **colour-coded by muscle group**, and the trend line matches.
  Every colour was darkened to pass WCAG AA contrast on the page background —
  Arms in particular moved off the pale amber to a deep amber at 5.0:1.

## 2026-09-09

### Logging a workout
- Exercise cards can be **dragged into a different order** using the handle on the
  left, so targets picked in the wrong order can be rearranged.
- **Press and hold the `+`** next to a set to duplicate the last set you filled in;
  a normal tap still adds an empty one.
- The progress bar now reuses the calendar's green ramp: it starts pale and deepens
  as you close on your last session, holding full contrast from there up to your
  best ever. The blue fill and the star marker are gone.

### Mobile
- Added `touch-action: manipulation` to controls, removing the browser's ~300ms
  double-tap-zoom delay that made taps feel dropped.
- Dialogs now sit above the backdrop on their own layer, are capped to 90% of the
  *visible* viewport height and scroll internally, so a tall dialog can't run under
  the browser chrome.
- Removed the backdrop blur behind dialogs — it's a known source of hit-testing
  glitches on iOS.
- The dialog close button is now a 42px tap target instead of ~28px.

### Home
- The new-workout button is now a hand-drawn circle around a `+` instead of the
  large filled rectangle.

## 2026-09-08 (evening, later)

### Home
- Dropped the weekday initials from the calendar — it reads better as a purely
  abstract block of squares.
- The call to action is now wordless: a large `+` in a light blue rounded
  rectangle, matching the blue used to mark today on the calendar. The home
  screen now has no visible text on it at all.

## 2026-09-08 (evening)

### Logging a workout
- Replaced the `Today / Prev / Max` numbers with a wordless progress bar. It fills
  toward your last session and turns green once you pass it; a small star marks
  your best ever.
- **Today's targets**: the Start workout button is now full width and always
  works — with nothing selected it just starts an empty workout. Removed the
  separate Skip button, since closing with the × does the same thing.

### Home
- The activity grid is now a proper calendar: Sunday to Saturday, four weeks,
  weekday initials across the top. Today is ringed in light blue, days still
  later this week are dimmed, and the green load gradient is unchanged.

## 2026-09-08 (later)

### Navigation
- **LiftIt** is now the large wordmark at the top left, and History / Sign out moved
  into a drawer behind the hamburger on the left.
- Removed the **Workouts** nav link — it went to the same place as the LiftIt
  wordmark.

### Home
- Stripped back to just the activity grid and the call to action. The workout list
  moved to History.
- Activity grid extended from 14 to **28 days**, and each day you trained is now
  clickable — it opens that workout.
- **New workout** is now a full-width block button rather than a small one.

### History
- Added a **body-part filter** row using the same icons, scrollable, nothing
  selected by default. Only body parts you've actually logged appear.
- Added per-exercise **trend charts** — total volume over time with your best
  weight in parentheses, ordered by how often you train each one. Deliberately
  spare: no gridlines, axes or legends, with the detail in the tooltip.
- Exercises trained only once show "One session so far" instead of a chart with a
  single floating point.
- Added a discreet icon-only **exercise filter** at the top right, listing
  exercises alphabetically; it stacks with the body-part filter.
- The full workout list now lives at the bottom of this page.

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
