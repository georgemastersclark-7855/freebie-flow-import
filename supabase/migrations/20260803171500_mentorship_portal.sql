-- Rob Late's Producer Mentorship portal
-- Additive schema: does not alter existing marketing or lead-magnet data.

create type public.mentorship_role as enum ('student', 'coach', 'admin');
create type public.mentorship_enrollment_status as enum ('active', 'completed', 'inactive');
create type public.mentorship_submission_state as enum ('not_started', 'in_progress', 'submitted', 'late');
create type public.mentorship_file_kind as enum ('idea', 'song', 'stems');
create type public.mentorship_feedback_status as enum ('draft', 'published');

create table public.mentorship_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  role public.mentorship_role not null default 'student',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.mentorship_cohorts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  internal_name text not null,
  display_name text not null default 'Rob Late''s Producer Mentorship',
  status text not null default 'draft' check (status in ('draft', 'active', 'completed', 'archived')),
  starts_at timestamptz,
  ends_at timestamptz,
  current_week smallint not null default 1 check (current_week between 1 and 6),
  timezone text not null default 'Europe/London',
  circle_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.mentorship_enrollments (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.mentorship_cohorts(id) on delete cascade,
  user_id uuid not null references public.mentorship_profiles(user_id) on delete cascade,
  status public.mentorship_enrollment_status not null default 'active',
  shopify_order_id text,
  application_id text,
  enrolled_at timestamptz not null default now(),
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cohort_id, user_id)
);

create table public.mentorship_weeks (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.mentorship_cohorts(id) on delete cascade,
  week_number smallint not null check (week_number between 1 and 6),
  title text not null,
  short_title text not null,
  brief text not null default '',
  required_ideas smallint not null default 3 check (required_ideas between 0 and 20),
  song_required boolean not null default true,
  stems_required boolean not null default true,
  opens_at timestamptz,
  deadline_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cohort_id, week_number)
);

create table public.mentorship_onboarding_tasks (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.mentorship_cohorts(id) on delete cascade,
  task_key text not null,
  title text not null,
  description text not null default '',
  action_label text,
  action_url text,
  position smallint not null default 0,
  required boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cohort_id, task_key)
);

create table public.mentorship_resources (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.mentorship_cohorts(id) on delete cascade,
  resource_key text not null,
  resource_kind text not null check (resource_kind in ('welcome_video', 'setup_video')),
  title text not null,
  description text not null default '',
  duration_label text,
  video_url text,
  position smallint not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cohort_id, resource_key)
);

create table public.mentorship_onboarding_progress (
  enrollment_id uuid not null references public.mentorship_enrollments(id) on delete cascade,
  task_id uuid not null references public.mentorship_onboarding_tasks(id) on delete cascade,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (enrollment_id, task_id)
);

create table public.mentorship_baselines (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null unique references public.mentorship_enrollments(id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  mime_type text,
  size_bytes bigint not null default 0 check (size_bytes >= 0),
  uploaded_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.mentorship_submissions (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.mentorship_enrollments(id) on delete cascade,
  week_id uuid not null references public.mentorship_weeks(id) on delete cascade,
  state public.mentorship_submission_state not null default 'not_started',
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (enrollment_id, week_id)
);

create table public.mentorship_submission_files (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.mentorship_submissions(id) on delete cascade,
  uploader_id uuid not null references public.mentorship_profiles(user_id) on delete restrict,
  kind public.mentorship_file_kind not null,
  storage_path text not null unique,
  file_name text not null,
  mime_type text,
  size_bytes bigint not null default 0 check (size_bytes >= 0),
  uploaded_at timestamptz not null default now()
);

create unique index mentorship_one_song_per_submission
  on public.mentorship_submission_files(submission_id)
  where kind = 'song';

create unique index mentorship_one_stems_file_per_submission
  on public.mentorship_submission_files(submission_id)
  where kind = 'stems';

create table public.mentorship_feedback (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique references public.mentorship_submissions(id) on delete cascade,
  author_id uuid not null references public.mentorship_profiles(user_id) on delete restrict,
  status public.mentorship_feedback_status not null default 'draft',
  written_notes text not null default '',
  next_action text not null default '',
  audio_storage_path text,
  audio_file_name text,
  video_url text,
  published_at timestamptz,
  viewed_at timestamptz,
  student_next_action text,
  action_confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.mentorship_calls (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.mentorship_cohorts(id) on delete cascade,
  week_id uuid references public.mentorship_weeks(id) on delete set null,
  title text not null,
  call_type text not null default 'group' check (call_type in ('onboarding', 'group', 'social', 'other')),
  starts_at timestamptz not null,
  ends_at timestamptz,
  circle_event_url text,
  calendar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.mentorship_call_attendance (
  call_id uuid not null references public.mentorship_calls(id) on delete cascade,
  enrollment_id uuid not null references public.mentorship_enrollments(id) on delete cascade,
  attended boolean not null default false,
  minutes_attended integer check (minutes_attended is null or minutes_attended >= 0),
  notes text,
  updated_at timestamptz not null default now(),
  primary key (call_id, enrollment_id)
);

create table public.mentorship_surgeries (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique references public.mentorship_submissions(id) on delete cascade,
  selected_by uuid not null references public.mentorship_profiles(user_id) on delete restrict,
  selected_at timestamptz not null default now(),
  delivered_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.mentorship_check_ins (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.mentorship_enrollments(id) on delete cascade,
  submission_id uuid references public.mentorship_submissions(id) on delete set null,
  reason text not null,
  status text not null default 'open' check (status in ('open', 'sent', 'resolved', 'dismissed')),
  owner_id uuid references public.mentorship_profiles(user_id) on delete set null,
  sent_at timestamptz,
  resolved_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.mentorship_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  aggregate_id uuid,
  payload jsonb not null default '{}'::jsonb,
  delivered_at timestamptz,
  attempts integer not null default 0,
  last_error text,
  created_at timestamptz not null default now()
);

create index mentorship_enrollments_user_idx on public.mentorship_enrollments(user_id);
create index mentorship_enrollments_cohort_idx on public.mentorship_enrollments(cohort_id);
create index mentorship_weeks_cohort_idx on public.mentorship_weeks(cohort_id, week_number);
create index mentorship_resources_cohort_idx on public.mentorship_resources(cohort_id, position);
create index mentorship_submissions_enrollment_idx on public.mentorship_submissions(enrollment_id);
create index mentorship_submissions_week_idx on public.mentorship_submissions(week_id, state);
create index mentorship_files_submission_idx on public.mentorship_submission_files(submission_id, kind);
create index mentorship_feedback_status_idx on public.mentorship_feedback(status, published_at);
create index mentorship_calls_cohort_idx on public.mentorship_calls(cohort_id, starts_at);
create index mentorship_attendance_enrollment_idx on public.mentorship_call_attendance(enrollment_id);
create index mentorship_surgeries_submission_idx on public.mentorship_surgeries(submission_id);
create index mentorship_check_ins_queue_idx on public.mentorship_check_ins(status, created_at);
create index mentorship_events_delivery_idx on public.mentorship_events(delivered_at, created_at);

create or replace function public.set_mentorship_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger mentorship_profiles_updated_at before update on public.mentorship_profiles
for each row execute function public.set_mentorship_updated_at();
create trigger mentorship_cohorts_updated_at before update on public.mentorship_cohorts
for each row execute function public.set_mentorship_updated_at();
create trigger mentorship_enrollments_updated_at before update on public.mentorship_enrollments
for each row execute function public.set_mentorship_updated_at();
create trigger mentorship_weeks_updated_at before update on public.mentorship_weeks
for each row execute function public.set_mentorship_updated_at();
create trigger mentorship_tasks_updated_at before update on public.mentorship_onboarding_tasks
for each row execute function public.set_mentorship_updated_at();
create trigger mentorship_resources_updated_at before update on public.mentorship_resources
for each row execute function public.set_mentorship_updated_at();
create trigger mentorship_progress_updated_at before update on public.mentorship_onboarding_progress
for each row execute function public.set_mentorship_updated_at();
create trigger mentorship_baselines_updated_at before update on public.mentorship_baselines
for each row execute function public.set_mentorship_updated_at();
create trigger mentorship_submissions_updated_at before update on public.mentorship_submissions
for each row execute function public.set_mentorship_updated_at();
create trigger mentorship_feedback_updated_at before update on public.mentorship_feedback
for each row execute function public.set_mentorship_updated_at();
create trigger mentorship_calls_updated_at before update on public.mentorship_calls
for each row execute function public.set_mentorship_updated_at();
create trigger mentorship_attendance_updated_at before update on public.mentorship_call_attendance
for each row execute function public.set_mentorship_updated_at();
create trigger mentorship_surgeries_updated_at before update on public.mentorship_surgeries
for each row execute function public.set_mentorship_updated_at();
create trigger mentorship_check_ins_updated_at before update on public.mentorship_check_ins
for each row execute function public.set_mentorship_updated_at();

create or replace function public.create_mentorship_profile_for_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.mentorship_profiles (user_id, full_name, email, role)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), split_part(new.email, '@', 1)),
    lower(new.email),
    'student'
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger create_mentorship_profile_after_auth_user
after insert on auth.users
for each row execute function public.create_mentorship_profile_for_auth_user();

create or replace function public.create_submissions_for_mentorship_enrollment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.mentorship_submissions (enrollment_id, week_id)
  select new.id, week.id
  from public.mentorship_weeks week
  where week.cohort_id = new.cohort_id
  on conflict (enrollment_id, week_id) do nothing;
  return new;
end;
$$;

create trigger create_submissions_after_mentorship_enrollment
after insert on public.mentorship_enrollments
for each row execute function public.create_submissions_for_mentorship_enrollment();

create or replace function public.create_submissions_for_mentorship_week()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.mentorship_submissions (enrollment_id, week_id)
  select enrollment.id, new.id
  from public.mentorship_enrollments enrollment
  where enrollment.cohort_id = new.cohort_id
    and enrollment.status = 'active'
  on conflict (enrollment_id, week_id) do nothing;
  return new;
end;
$$;

create trigger create_submissions_after_mentorship_week
after insert on public.mentorship_weeks
for each row execute function public.create_submissions_for_mentorship_week();

create or replace function public.is_mentorship_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.mentorship_profiles
    where user_id = auth.uid() and role in ('coach', 'admin')
  );
$$;

create or replace function public.is_mentorship_member(target_cohort_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.mentorship_enrollments
    where cohort_id = target_cohort_id
      and user_id = auth.uid()
      and status = 'active'
  );
$$;

create or replace function public.owns_mentorship_enrollment(target_enrollment_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.mentorship_enrollments
    where id = target_enrollment_id and user_id = auth.uid()
  );
$$;

alter table public.mentorship_profiles enable row level security;
alter table public.mentorship_cohorts enable row level security;
alter table public.mentorship_enrollments enable row level security;
alter table public.mentorship_weeks enable row level security;
alter table public.mentorship_onboarding_tasks enable row level security;
alter table public.mentorship_resources enable row level security;
alter table public.mentorship_onboarding_progress enable row level security;
alter table public.mentorship_baselines enable row level security;
alter table public.mentorship_submissions enable row level security;
alter table public.mentorship_submission_files enable row level security;
alter table public.mentorship_feedback enable row level security;
alter table public.mentorship_calls enable row level security;
alter table public.mentorship_call_attendance enable row level security;
alter table public.mentorship_surgeries enable row level security;
alter table public.mentorship_check_ins enable row level security;
alter table public.mentorship_events enable row level security;

create policy "Mentorship users view own profile" on public.mentorship_profiles
for select to authenticated using (user_id = auth.uid() or public.is_mentorship_staff());
create policy "Mentorship staff manage profiles" on public.mentorship_profiles
for all to authenticated using (public.is_mentorship_staff()) with check (public.is_mentorship_staff());

create policy "Mentorship members view cohort" on public.mentorship_cohorts
for select to authenticated using (public.is_mentorship_member(id) or public.is_mentorship_staff());
create policy "Mentorship staff manage cohorts" on public.mentorship_cohorts
for all to authenticated using (public.is_mentorship_staff()) with check (public.is_mentorship_staff());

create policy "Mentorship users view own enrollment" on public.mentorship_enrollments
for select to authenticated using (user_id = auth.uid() or public.is_mentorship_staff());
create policy "Mentorship staff manage enrollments" on public.mentorship_enrollments
for all to authenticated using (public.is_mentorship_staff()) with check (public.is_mentorship_staff());

create policy "Mentorship members view weeks" on public.mentorship_weeks
for select to authenticated using (public.is_mentorship_member(cohort_id) or public.is_mentorship_staff());
create policy "Mentorship staff manage weeks" on public.mentorship_weeks
for all to authenticated using (public.is_mentorship_staff()) with check (public.is_mentorship_staff());

create policy "Mentorship members view onboarding tasks" on public.mentorship_onboarding_tasks
for select to authenticated using (public.is_mentorship_member(cohort_id) or public.is_mentorship_staff());
create policy "Mentorship staff manage onboarding tasks" on public.mentorship_onboarding_tasks
for all to authenticated using (public.is_mentorship_staff()) with check (public.is_mentorship_staff());

create policy "Mentorship members view published resources" on public.mentorship_resources
for select to authenticated using (
  public.is_mentorship_staff() or (published and public.is_mentorship_member(cohort_id))
);
create policy "Mentorship staff manage resources" on public.mentorship_resources
for all to authenticated using (public.is_mentorship_staff()) with check (public.is_mentorship_staff());

create policy "Mentorship users manage own onboarding progress" on public.mentorship_onboarding_progress
for all to authenticated
using (public.owns_mentorship_enrollment(enrollment_id) or public.is_mentorship_staff())
with check (public.owns_mentorship_enrollment(enrollment_id) or public.is_mentorship_staff());

create policy "Mentorship users manage own baseline" on public.mentorship_baselines
for all to authenticated
using (public.owns_mentorship_enrollment(enrollment_id) or public.is_mentorship_staff())
with check (public.owns_mentorship_enrollment(enrollment_id) or public.is_mentorship_staff());

create policy "Mentorship users view own submissions" on public.mentorship_submissions
for select to authenticated
using (public.owns_mentorship_enrollment(enrollment_id) or public.is_mentorship_staff());
create policy "Mentorship staff update submissions" on public.mentorship_submissions
for update to authenticated
using (public.is_mentorship_staff())
with check (public.is_mentorship_staff());
create policy "Mentorship staff create submissions" on public.mentorship_submissions
for insert to authenticated with check (public.is_mentorship_staff());

create policy "Mentorship users view own submission files" on public.mentorship_submission_files
for select to authenticated using (
  public.is_mentorship_staff() or exists (
    select 1 from public.mentorship_submissions submission
    where submission.id = submission_id
      and public.owns_mentorship_enrollment(submission.enrollment_id)
  )
);
create policy "Mentorship users add own submission files" on public.mentorship_submission_files
for insert to authenticated with check (
  uploader_id = auth.uid() and exists (
    select 1 from public.mentorship_submissions submission
    where submission.id = submission_id
      and public.owns_mentorship_enrollment(submission.enrollment_id)
      and submission.state in ('not_started', 'in_progress')
  )
  or public.is_mentorship_staff()
);
create policy "Mentorship users delete own submission files" on public.mentorship_submission_files
for delete to authenticated using (
  public.is_mentorship_staff() or exists (
    select 1 from public.mentorship_submissions submission
    where submission.id = submission_id
      and public.owns_mentorship_enrollment(submission.enrollment_id)
      and submission.state in ('not_started', 'in_progress')
  )
);

create policy "Mentorship students view published feedback" on public.mentorship_feedback
for select to authenticated using (
  public.is_mentorship_staff() or (
    status = 'published' and exists (
      select 1
      from public.mentorship_submissions submission
      where submission.id = submission_id
        and public.owns_mentorship_enrollment(submission.enrollment_id)
    )
  )
);
create policy "Mentorship staff manage feedback" on public.mentorship_feedback
for all to authenticated using (public.is_mentorship_staff()) with check (public.is_mentorship_staff());

create policy "Mentorship members view calls" on public.mentorship_calls
for select to authenticated using (public.is_mentorship_member(cohort_id) or public.is_mentorship_staff());
create policy "Mentorship staff manage calls" on public.mentorship_calls
for all to authenticated using (public.is_mentorship_staff()) with check (public.is_mentorship_staff());

create policy "Mentorship users view own attendance" on public.mentorship_call_attendance
for select to authenticated using (public.owns_mentorship_enrollment(enrollment_id) or public.is_mentorship_staff());
create policy "Mentorship staff manage attendance" on public.mentorship_call_attendance
for all to authenticated using (public.is_mentorship_staff()) with check (public.is_mentorship_staff());

create policy "Mentorship users view own surgeries" on public.mentorship_surgeries
for select to authenticated using (
  public.is_mentorship_staff() or exists (
    select 1 from public.mentorship_submissions submission
    where submission.id = submission_id
      and public.owns_mentorship_enrollment(submission.enrollment_id)
  )
);
create policy "Mentorship staff manage surgeries" on public.mentorship_surgeries
for all to authenticated using (public.is_mentorship_staff()) with check (public.is_mentorship_staff());

create policy "Mentorship users view own check-ins" on public.mentorship_check_ins
for select to authenticated using (public.owns_mentorship_enrollment(enrollment_id) or public.is_mentorship_staff());
create policy "Mentorship staff manage check-ins" on public.mentorship_check_ins
for all to authenticated using (public.is_mentorship_staff()) with check (public.is_mentorship_staff());

create policy "Mentorship staff view events" on public.mentorship_events
for select to authenticated using (public.is_mentorship_staff());
create policy "Mentorship staff manage events" on public.mentorship_events
for all to authenticated using (public.is_mentorship_staff()) with check (public.is_mentorship_staff());

create or replace function public.submit_mentorship_week(target_submission_id uuid)
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  target_submission public.mentorship_submissions%rowtype;
  target_week public.mentorship_weeks%rowtype;
  idea_count integer;
  has_song boolean;
  has_stems boolean;
  submitted_time timestamptz := now();
begin
  select * into target_submission
  from public.mentorship_submissions
  where id = target_submission_id;

  if target_submission.id is null then
    raise exception 'Submission not found';
  end if;

  if not public.owns_mentorship_enrollment(target_submission.enrollment_id)
     and not public.is_mentorship_staff() then
    raise exception 'Not authorised';
  end if;

  select * into target_week from public.mentorship_weeks where id = target_submission.week_id;
  select count(*)::integer into idea_count from public.mentorship_submission_files
    where submission_id = target_submission_id and kind = 'idea';
  select exists(select 1 from public.mentorship_submission_files
    where submission_id = target_submission_id and kind = 'song') into has_song;
  select exists(select 1 from public.mentorship_submission_files
    where submission_id = target_submission_id and kind = 'stems') into has_stems;

  if idea_count < target_week.required_ideas then
    raise exception 'Upload % more idea(s)', target_week.required_ideas - idea_count;
  end if;
  if target_week.song_required and not has_song then
    raise exception 'Upload the selected song';
  end if;
  if target_week.stems_required and not has_stems then
    raise exception 'Upload the stems ZIP';
  end if;

  update public.mentorship_submissions
  set state = case when target_week.deadline_at is not null and submitted_time > target_week.deadline_at
    then 'late'::public.mentorship_submission_state
    else 'submitted'::public.mentorship_submission_state end,
      submitted_at = submitted_time
  where id = target_submission_id;

  return submitted_time;
end;
$$;

create or replace function public.start_mentorship_submission(target_submission_id uuid)
returns public.mentorship_submission_state
language plpgsql
security definer
set search_path = public
as $$
declare next_state public.mentorship_submission_state;
begin
  update public.mentorship_submissions submission
  set state = case when submission.state = 'not_started' then 'in_progress' else submission.state end
  where submission.id = target_submission_id
    and public.owns_mentorship_enrollment(submission.enrollment_id)
    and submission.state in ('not_started', 'in_progress')
  returning state into next_state;

  if next_state is null then raise exception 'Submission cannot be edited'; end if;
  return next_state;
end;
$$;

create or replace function public.mark_mentorship_feedback_viewed(target_feedback_id uuid)
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare viewed_time timestamptz;
begin
  update public.mentorship_feedback feedback
  set viewed_at = coalesce(feedback.viewed_at, now())
  where feedback.id = target_feedback_id
    and feedback.status = 'published'
    and exists (
      select 1 from public.mentorship_submissions submission
      where submission.id = feedback.submission_id
        and public.owns_mentorship_enrollment(submission.enrollment_id)
    )
  returning viewed_at into viewed_time;

  if viewed_time is null then raise exception 'Feedback not found'; end if;
  return viewed_time;
end;
$$;

create or replace function public.confirm_mentorship_feedback_action(
  target_feedback_id uuid,
  next_action_text text
)
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare confirmed_time timestamptz := now();
begin
  if nullif(trim(next_action_text), '') is null then
    raise exception 'Next action is required';
  end if;

  update public.mentorship_feedback feedback
  set student_next_action = trim(next_action_text),
      viewed_at = coalesce(feedback.viewed_at, confirmed_time),
      action_confirmed_at = confirmed_time
  where feedback.id = target_feedback_id
    and feedback.status = 'published'
    and exists (
      select 1 from public.mentorship_submissions submission
      where submission.id = feedback.submission_id
        and public.owns_mentorship_enrollment(submission.enrollment_id)
    );

  if not found then raise exception 'Feedback not found'; end if;
  return confirmed_time;
end;
$$;

revoke all on function public.submit_mentorship_week(uuid) from public;
revoke all on function public.start_mentorship_submission(uuid) from public;
revoke all on function public.mark_mentorship_feedback_viewed(uuid) from public;
revoke all on function public.confirm_mentorship_feedback_action(uuid, text) from public;
grant execute on function public.submit_mentorship_week(uuid) to authenticated;
grant execute on function public.start_mentorship_submission(uuid) to authenticated;
grant execute on function public.mark_mentorship_feedback_viewed(uuid) to authenticated;
grant execute on function public.confirm_mentorship_feedback_action(uuid, text) to authenticated;

insert into storage.buckets (id, name, public, file_size_limit)
values
  ('mentorship-submissions', 'mentorship-submissions', false, 2147483648),
  ('mentorship-feedback', 'mentorship-feedback', false, 536870912)
on conflict (id) do nothing;

create policy "Mentorship students read own private files" on storage.objects
for select to authenticated using (
  bucket_id in ('mentorship-submissions', 'mentorship-feedback')
  and ((storage.foldername(name))[1] = auth.uid()::text or public.is_mentorship_staff())
);

create policy "Mentorship students upload own submissions" on storage.objects
for insert to authenticated with check (
  bucket_id = 'mentorship-submissions'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Mentorship students remove own submissions" on storage.objects
for delete to authenticated using (
  bucket_id = 'mentorship-submissions'
  and (
    public.is_mentorship_staff()
    or (
      (storage.foldername(name))[1] = auth.uid()::text
      and exists (
        select 1
        from public.mentorship_submission_files file
        join public.mentorship_submissions submission on submission.id = file.submission_id
        where file.storage_path = name
          and public.owns_mentorship_enrollment(submission.enrollment_id)
          and submission.state in ('not_started', 'in_progress')
      )
    )
  )
);

create policy "Mentorship staff upload feedback files" on storage.objects
for insert to authenticated with check (
  bucket_id = 'mentorship-feedback' and public.is_mentorship_staff()
);

create policy "Mentorship staff update feedback files" on storage.objects
for update to authenticated
using (bucket_id = 'mentorship-feedback' and public.is_mentorship_staff())
with check (bucket_id = 'mentorship-feedback' and public.is_mentorship_staff());

create policy "Mentorship staff remove feedback files" on storage.objects
for delete to authenticated using (
  bucket_id = 'mentorship-feedback' and public.is_mentorship_staff()
);
