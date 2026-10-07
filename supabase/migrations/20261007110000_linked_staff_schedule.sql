-- A weekly pattern is expanded into the existing dates consumed by the portal.
-- Individual dates remain ordinary week/call rows, preserving their identities.
alter table public.mentorship_cohorts add column if not exists schedule_pattern jsonb;
alter table public.mentorship_cohorts add column if not exists schedule_revision integer not null default 0;

create or replace function public.save_mentorship_schedule(
  p_cohort_id uuid, p_revision integer, p_expected jsonb,
  p_pattern jsonb, p_weeks jsonb, p_calls jsonb
) returns void language plpgsql security invoker set search_path = public as $$
declare
  current_revision integer;
  item jsonb;
  target_id uuid;
  opening timestamptz;
  ending timestamptz;
  linked_week uuid;
begin
  if not public.is_mentorship_staff() then raise exception 'Staff access is required.' using errcode='42501'; end if;
  select schedule_revision into current_revision from public.mentorship_cohorts where id=p_cohort_id for update;
  if not found then raise exception 'Cohort not found.'; end if;
  if current_revision is distinct from p_revision then raise exception 'This schedule has changed. Close the editor and reload the calendar before saving.'; end if;
  if jsonb_typeof(p_expected->'weeks') is distinct from 'array' or jsonb_typeof(p_expected->'calls') is distinct from 'array'
    or jsonb_typeof(p_weeks) is distinct from 'array' or jsonb_typeof(p_calls) is distinct from 'array' then raise exception 'Invalid schedule data.'; end if;
  if p_pattern is not null and (jsonb_typeof(p_pattern) <> 'object' or p_pattern->>'version' is distinct from '1') then raise exception 'Invalid weekly pattern.'; end if;
  -- Also catch direct edits from older clients which do not increment the revision.
  perform id from public.mentorship_weeks where cohort_id=p_cohort_id for update;
  perform id from public.mentorship_calls where cohort_id=p_cohort_id and call_type='group' for update;
  if (select count(*) from public.mentorship_weeks where cohort_id=p_cohort_id) <> jsonb_array_length(p_expected->'weeks')
    or (select count(*) from public.mentorship_calls where cohort_id=p_cohort_id and call_type='group') <> jsonb_array_length(p_expected->'calls') then
    raise exception 'This schedule has changed. Close the editor and reload the calendar before saving.';
  end if;
  if exists(select 1 from jsonb_array_elements(p_expected->'weeks') e left join public.mentorship_weeks w on w.id=(e->>'id')::uuid and w.cohort_id=p_cohort_id where w.id is null or w.updated_at is distinct from (e->>'updatedAt')::timestamptz)
    or exists(select 1 from jsonb_array_elements(p_expected->'calls') e left join public.mentorship_calls c on c.id=(e->>'id')::uuid and c.cohort_id=p_cohort_id and c.call_type='group' where c.id is null or c.updated_at is distinct from (e->>'updatedAt')::timestamptz) then
    raise exception 'This schedule has changed. Close the editor and reload the calendar before saving.';
  end if;
  if exists(select 1 from jsonb_array_elements(p_weeks) e group by e->>'id' having count(*)>1)
    or exists(select 1 from jsonb_array_elements(p_calls) e group by e->>'id' having count(*)>1) then raise exception 'Duplicate schedule entries.'; end if;
  for item in select * from jsonb_array_elements(p_weeks) loop
    target_id := (item->>'id')::uuid;
    opening := (item->>'opensAt')::timestamptz; ending := (item->>'deadlineAt')::timestamptz;
    if not exists(select 1 from public.mentorship_weeks where id=target_id and cohort_id=p_cohort_id) then raise exception 'Week does not belong to this cohort.'; end if;
    if opening is not null and ending is not null and ending<=opening then raise exception 'The deadline must be after the week opens.'; end if;
    update public.mentorship_weeks set opens_at=opening, deadline_at=ending where id=target_id and (opens_at is distinct from opening or deadline_at is distinct from ending);
  end loop;
  for item in select * from jsonb_array_elements(p_calls) loop
    target_id := (item->>'id')::uuid; linked_week := nullif(item->>'weekId','')::uuid;
    opening := (item->>'startsAt')::timestamptz; ending := (item->>'endsAt')::timestamptz;
    if target_id is null or opening is null or nullif(trim(item->>'title'),'') is null then raise exception 'Call title and start time are required.'; end if;
    if ending is not null and ending<=opening then raise exception 'The call must end after it starts.'; end if;
    if linked_week is not null and not exists(select 1 from public.mentorship_weeks where id=linked_week and cohort_id=p_cohort_id) then raise exception 'The call must link to a week in this cohort.'; end if;
    if exists(select 1 from public.mentorship_calls where id=target_id and (cohort_id<>p_cohort_id or call_type<>'group')) then raise exception 'Call does not belong to this cohort.'; end if;
    insert into public.mentorship_calls as existing (id,cohort_id,week_id,title,call_type,starts_at,ends_at,circle_event_url)
      values(target_id,p_cohort_id,linked_week,trim(item->>'title'),'group',opening,ending,nullif(trim(item->>'joinUrl'),''))
      on conflict(id) do update set week_id=excluded.week_id,title=excluded.title,starts_at=excluded.starts_at,ends_at=excluded.ends_at,circle_event_url=excluded.circle_event_url
      where (existing.week_id,existing.title,existing.starts_at,existing.ends_at,existing.circle_event_url) is distinct from (excluded.week_id,excluded.title,excluded.starts_at,excluded.ends_at,excluded.circle_event_url);
  end loop;
  update public.mentorship_cohorts set schedule_pattern=p_pattern,schedule_revision=schedule_revision+1 where id=p_cohort_id;
end;
$$;
revoke all on function public.save_mentorship_schedule(uuid,integer,jsonb,jsonb,jsonb,jsonb) from public,anon;
grant execute on function public.save_mentorship_schedule(uuid,integer,jsonb,jsonb,jsonb,jsonb) to authenticated;
