-- Staff-only student-success workspace. Student-facing feedback is unchanged.
create or replace function public.can_manage_mentorship_student(target_enrollment uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_mentorship_staff() and exists (
    select 1 from public.mentorship_enrollments e where e.id = target_enrollment
      and (not e.is_walkthrough or e.user_id = auth.uid())
  );
$$;
revoke all on function public.can_manage_mentorship_student(uuid) from public, anon;
grant execute on function public.can_manage_mentorship_student(uuid) to authenticated;

create table public.mentorship_student_context (
  enrollment_id uuid primary key references public.mentorship_enrollments(id) on delete cascade,
  goals text not null default '' check (length(goals) <= 10000),
  current_focus text not null default '' check (length(current_focus) <= 10000),
  updated_by uuid not null default auth.uid() references public.mentorship_profiles(user_id),
  updated_at timestamptz not null default now()
);
create table public.mentorship_staff_notes (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.mentorship_enrollments(id) on delete cascade,
  kind text not null check (kind in ('note','onboarding','group')),
  title text not null check (length(btrim(title)) between 1 and 180),
  body text not null default '' check (length(body) <= 50000),
  transcript text not null default '' check (length(transcript) <= 500000),
  source_url text check (source_url is null or (source_url ~ '^https://[^[:space:]]+$' and length(source_url) <= 2048)),
  occurred_on date not null default current_date,
  call_id uuid references public.mentorship_calls(id) on delete set null,
  created_by uuid not null default auth.uid() references public.mentorship_profiles(user_id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.mentorship_student_actions (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.mentorship_enrollments(id) on delete cascade,
  title text not null check (length(btrim(title)) between 1 and 1000),
  owner_id uuid references public.mentorship_profiles(user_id),
  due_on date,
  completed_at timestamptz,
  created_by uuid not null default auth.uid() references public.mentorship_profiles(user_id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.mentorship_progress_examples (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.mentorship_enrollments(id) on delete cascade,
  title text not null check (length(btrim(title)) between 1 and 180),
  before_file_id uuid not null references public.mentorship_submission_files(id) on delete cascade,
  after_file_id uuid not null references public.mentorship_submission_files(id) on delete cascade,
  created_by uuid not null default auth.uid() references public.mentorship_profiles(user_id),
  created_at timestamptz not null default now(),
  check (before_file_id <> after_file_id)
);

-- Enforce relationships even for direct API writes. Never attach another
-- student's music or a different cohort's call to a student record.
create or replace function public.validate_mentorship_success_record()
returns trigger language plpgsql set search_path = public as $$
begin
  if TG_OP = 'UPDATE' and NEW.enrollment_id <> OLD.enrollment_id then
    raise exception 'The student on a saved record cannot be changed';
  end if;
  if TG_TABLE_NAME = 'mentorship_student_context' then
    NEW.updated_by := auth.uid();
  else
    if TG_OP = 'INSERT' then NEW.created_by := auth.uid();
    else NEW.created_by := OLD.created_by; NEW.created_at := OLD.created_at; end if;
  end if;
  if TG_TABLE_NAME = 'mentorship_staff_notes' then
    if NEW.call_id is not null then
    if not exists (
      select 1 from public.mentorship_calls c join public.mentorship_enrollments e on e.cohort_id = c.cohort_id
      where c.id = NEW.call_id and e.id = NEW.enrollment_id
    ) then raise exception 'The call must belong to this student''s cohort'; end if;
      end if;
  elsif TG_TABLE_NAME = 'mentorship_student_actions' then
    if NEW.owner_id is not null then
    if not exists (select 1 from public.mentorship_profiles p where p.user_id = NEW.owner_id and p.role in ('coach','admin')) then
      raise exception 'Choose a staff member to own this follow-up';
    end if;
      end if;
  elsif TG_TABLE_NAME = 'mentorship_progress_examples' then
    if (select count(*) from public.mentorship_submission_files f
      join public.mentorship_submissions s on s.id = f.submission_id
      where f.id in (NEW.before_file_id, NEW.after_file_id) and s.enrollment_id = NEW.enrollment_id and f.kind in ('idea','song')) <> 2 then
      raise exception 'Choose two audio uploads belonging to this student';
    end if;
  end if;
  return NEW;
end;
$$;
revoke all on function public.validate_mentorship_success_record() from public;

do $$ declare tab text; begin
  foreach tab in array array['mentorship_student_context','mentorship_staff_notes','mentorship_student_actions','mentorship_progress_examples'] loop
    execute format('alter table public.%I enable row level security', tab);
    execute format('revoke all on public.%I from public, anon, authenticated', tab);
    execute format('grant select, insert, update, delete on public.%I to authenticated', tab);
    execute format('grant all on public.%I to service_role', tab);
    execute format('create policy "Staff manage student success" on public.%I for all to authenticated using (public.can_manage_mentorship_student(enrollment_id)) with check (public.can_manage_mentorship_student(enrollment_id))', tab);
    execute format('create trigger validate_success_record before insert or update on public.%I for each row execute function public.validate_mentorship_success_record()', tab);
    if tab <> 'mentorship_progress_examples' then
      execute format('create trigger update_success_timestamp before update on public.%I for each row execute function public.set_mentorship_updated_at()', tab);
    end if;
  end loop;
end $$;
create index on public.mentorship_staff_notes (enrollment_id, occurred_on desc);
create index on public.mentorship_student_actions (enrollment_id, completed_at, due_on);
create index on public.mentorship_progress_examples (enrollment_id, created_at desc);
comment on table public.mentorship_staff_notes is 'Private staff notes and explicitly attributed call excerpts. No automatic AI generation or Fathom import is enabled by this migration.';
