-- Adds a muscle-group category to exercises, used to group the exercise
-- picker dropdown (Arms / Back / Legs / Shoulders / Other).
alter table exercises add column category text not null default 'Other'
  check (category in ('Arms', 'Back', 'Legs', 'Shoulders', 'Other'));

-- Seed exercises from your written log that appeared on more than one date.
insert into exercises (user_id, name, category) values
  ('934104f9-ff51-4cb9-b568-52f7aba83652', 'Split squats', 'Legs'),
  ('934104f9-ff51-4cb9-b568-52f7aba83652', 'RDL', 'Legs'),
  ('934104f9-ff51-4cb9-b568-52f7aba83652', 'Military press', 'Shoulders'),
  ('934104f9-ff51-4cb9-b568-52f7aba83652', 'Biceps', 'Arms')
on conflict (user_id, name) do update set category = excluded.category;
