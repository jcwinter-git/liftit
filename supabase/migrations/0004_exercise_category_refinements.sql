-- Expand category options (add Chest, Abs) and apply refined categorization.
-- Finds the existing category check constraint by inspecting its definition,
-- rather than assuming a specific auto-generated name.
do $$
declare
  con record;
begin
  for con in
    select conname from pg_constraint
    where conrelid = 'exercises'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%category%'
  loop
    execute format('alter table exercises drop constraint %I', con.conname);
  end loop;
end $$;

alter table exercises add constraint exercises_category_check
  check (category in ('Arms', 'Back', 'Chest', 'Legs', 'Shoulders', 'Abs', 'Other'));

update exercises set category = 'Back' where name = 'Pull ups';
update exercises set name = 'Bicep Curls' where name = 'Biceps';

insert into exercises (user_id, name, category) values
  ('934104f9-ff51-4cb9-b568-52f7aba83652', 'Leg Raises', 'Abs'),
  ('934104f9-ff51-4cb9-b568-52f7aba83652', 'Pistols', 'Legs'),
  ('934104f9-ff51-4cb9-b568-52f7aba83652', 'Dumbbell Bench', 'Chest'),
  ('934104f9-ff51-4cb9-b568-52f7aba83652', 'Cossacks', 'Legs'),
  ('934104f9-ff51-4cb9-b568-52f7aba83652', 'High ROM', 'Shoulders')
on conflict (user_id, name) do update set category = excluded.category;
