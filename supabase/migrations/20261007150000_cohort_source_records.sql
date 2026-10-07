-- Staff-only casebooks for students whose source records predate portal accounts.
-- No auth accounts, invitations, current schedules or submission records are created.
create table public.mentorship_cohort_records (
  id text primary key check (id ~ '^[a-z0-9-]+$'),
  name text not null,
  payload jsonb not null check (
    payload->>'version' = '1'
    and jsonb_typeof(payload->'students') = 'array'
    and jsonb_typeof(payload->'sources') = 'array'
  ),
  student_count integer generated always as (jsonb_array_length(payload->'students')) stored,
  created_at timestamptz not null default now()
);
alter table public.mentorship_cohort_records enable row level security;
revoke all on public.mentorship_cohort_records from public, anon, authenticated;
grant select on public.mentorship_cohort_records to authenticated;
create policy "Staff can read cohort source records" on public.mentorship_cohort_records
  for select to authenticated using (public.is_mentorship_staff());
grant all on public.mentorship_cohort_records to service_role;
