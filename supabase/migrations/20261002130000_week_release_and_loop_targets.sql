-- Keep weekly release rules at the database boundary. An explicit opens_at
-- takes precedence; otherwise the cohort's current_week controls release.
create or replace function public.mentorship_week_is_released(target_week_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.mentorship_weeks week
    join public.mentorship_cohorts cohort on cohort.id = week.cohort_id
    where week.id = target_week_id
      and auth.uid() is not null
      and (
        public.is_mentorship_staff()
        or exists (
          select 1 from public.mentorship_enrollments enrollment
          where enrollment.cohort_id = cohort.id
            and enrollment.user_id = auth.uid()
            and enrollment.status = 'active'
        )
      )
      and case
        when week.opens_at is not null then week.opens_at <= now()
        else week.week_number <= cohort.current_week
      end
  );
$$;

revoke all on function public.mentorship_week_is_released(uuid) from public, anon;
grant execute on function public.mentorship_week_is_released(uuid) to authenticated;

-- Uploads use <user>/<cohort>/week-<n>/<kind>/<filename>. Validate every
-- identity and path segment without casting user-controlled path text.
create or replace function public.mentorship_submission_object_is_released(object_name text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select case
    when auth.uid() is null then false
    when object_name !~ ('^' || auth.uid()::text || '/[0-9a-fA-F-]{36}/week-[1-6]/(idea|song|stems)/[^/]+$') then false
    else exists (
      select 1
      from public.mentorship_enrollments enrollment
      join public.mentorship_cohorts cohort on cohort.id = enrollment.cohort_id
      join public.mentorship_weeks week on week.cohort_id = cohort.id
      join public.mentorship_submissions submission
        on submission.enrollment_id = enrollment.id and submission.week_id = week.id
      where enrollment.user_id = auth.uid()
        and enrollment.status = 'active'
        and submission.state in ('not_started', 'in_progress')
        and cohort.id::text = (storage.foldername(object_name))[2]
        and ('week-' || week.week_number::text) = (storage.foldername(object_name))[3]
        and case
          when week.opens_at is not null then week.opens_at <= now()
          else week.week_number <= cohort.current_week
        end
    )
  end;
$$;

revoke all on function public.mentorship_submission_object_is_released(text) from public, anon;
grant execute on function public.mentorship_submission_object_is_released(text) to authenticated;

drop policy if exists "Mentorship users add own submission files" on public.mentorship_submission_files;
create policy "Mentorship users add own submission files" on public.mentorship_submission_files
for insert to authenticated with check (
  public.is_mentorship_staff()
  or (
    uploader_id = auth.uid()
    and exists (
      select 1
      from public.mentorship_submissions submission
      join public.mentorship_enrollments enrollment on enrollment.id = submission.enrollment_id
      join public.mentorship_weeks week on week.id = submission.week_id
      where submission.id = submission_id
        and enrollment.user_id = auth.uid()
        and enrollment.status = 'active'
        and submission.state in ('not_started', 'in_progress')
        and storage_path ~ ('^' || auth.uid()::text || '/[0-9a-fA-F-]{36}/week-[1-6]/(idea|song|stems)/[^/]+$')
        and (storage.foldername(storage_path))[2] = enrollment.cohort_id::text
        and (storage.foldername(storage_path))[3] = 'week-' || week.week_number::text
        and (storage.foldername(storage_path))[4] = kind::text
        and public.mentorship_week_is_released(submission.week_id)
    )
  )
);

drop policy if exists "Mentorship users delete own submission files" on public.mentorship_submission_files;
create policy "Mentorship users delete own submission files" on public.mentorship_submission_files
for delete to authenticated using (
  public.is_mentorship_staff()
  or exists (
    select 1
    from public.mentorship_submissions submission
    join public.mentorship_enrollments enrollment on enrollment.id = submission.enrollment_id
    where submission.id = submission_id
      and enrollment.user_id = auth.uid()
      and enrollment.status = 'active'
      and submission.state in ('not_started', 'in_progress')
      and public.mentorship_week_is_released(submission.week_id)
  )
);

drop policy if exists "Mentorship students upload own submissions" on storage.objects;
create policy "Mentorship students upload own submissions" on storage.objects
for insert to authenticated with check (
  bucket_id = 'mentorship-submissions'
  and public.mentorship_submission_object_is_released(name)
);

drop policy if exists "Mentorship students remove own submissions" on storage.objects;
create policy "Mentorship students remove own submissions" on storage.objects
for delete to authenticated using (
  bucket_id = 'mentorship-submissions'
  and (
    public.is_mentorship_staff()
    or exists (
      select 1
      from public.mentorship_submission_files file
      join public.mentorship_submissions submission on submission.id = file.submission_id
      join public.mentorship_enrollments enrollment on enrollment.id = submission.enrollment_id
      join public.mentorship_weeks week on week.id = submission.week_id
      where file.storage_path = name
        and enrollment.user_id = auth.uid()
        and enrollment.status = 'active'
        and submission.state in ('not_started', 'in_progress')
        and public.mentorship_week_is_released(submission.week_id)
        and (storage.foldername(name))[1] = auth.uid()::text
        and (storage.foldername(name))[2] = enrollment.cohort_id::text
        and (storage.foldername(name))[3] = 'week-' || week.week_number::text
    )
  )
);

create or replace function public.start_mentorship_submission(target_submission_id uuid)
returns public.mentorship_submission_state
language plpgsql
security definer
set search_path = public
as $$
declare
  next_state public.mentorship_submission_state;
  target_week_id uuid;
begin
  select submission.week_id, submission.state
    into target_week_id, next_state
  from public.mentorship_submissions submission
  join public.mentorship_enrollments enrollment on enrollment.id = submission.enrollment_id
  where submission.id = target_submission_id
    and enrollment.user_id = auth.uid()
    and enrollment.status = 'active'
  for update of submission;

  if target_week_id is null or next_state not in ('not_started', 'in_progress') then
    raise exception 'Submission cannot be edited';
  end if;
  if not public.mentorship_week_is_released(target_week_id) then
    raise exception 'This week has not opened';
  end if;

  update public.mentorship_submissions submission
  set state = case when submission.state = 'not_started' then 'in_progress' else submission.state end
  where submission.id = target_submission_id
  returning state into next_state;
  return next_state;
end;
$$;

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
  staff_access boolean := public.is_mentorship_staff();
begin
  select * into target_submission
  from public.mentorship_submissions
  where id = target_submission_id
  for update;

  if target_submission.id is null then
    raise exception 'Submission not found';
  end if;

  if not public.owns_mentorship_enrollment(target_submission.enrollment_id)
     and not staff_access then
    raise exception 'Not authorised';
  end if;

  if target_submission.state in ('submitted', 'late') then
    raise exception 'This submission has already been sent';
  end if;

  if not staff_access and not exists (
    select 1 from public.mentorship_enrollments enrollment
    where enrollment.id = target_submission.enrollment_id
      and enrollment.user_id = auth.uid()
      and enrollment.status = 'active'
  ) then
    raise exception 'Not authorised';
  end if;

  select * into target_week from public.mentorship_weeks where id = target_submission.week_id;
  if not staff_access and not public.mentorship_week_is_released(target_week.id) then
    raise exception 'This week has not opened';
  end if;

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

-- This cohort's opening target requires five loop ideas for weeks 1–4;
-- weeks 5–6 are finishing weeks and require no new loop ideas.
update public.mentorship_weeks
set required_ideas = case when week_number between 1 and 4 then 5 else 0 end,
    updated_at = now()
where cohort_id = 'faa94fb4-dcf0-4d96-9369-d834c71fb0c2'::uuid
  and week_number between 1 and 6;
