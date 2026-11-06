create table if not exists public.mentorship_funnel_events (
  id bigint generated always as identity primary key,
  cohort_slug text not null,
  visit_id uuid not null,
  event text not null check (event in (
    'page_view','page_scroll','price_seen','apply_click','video_play','page_exit',
    'form_view','form_error','form_start','question_view','question_done','question_error',
    'review_view','send_click','send_ok','send_fail','js_error'
  )),
  source text not null check (source in ('instagram','link_in_bio','email','youtube','facebook','other')),
  campaign text,
  device text,
  in_app boolean not null default false,
  step integer,
  question text,
  duration_ms integer,
  detail text,
  is_test boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists mentorship_funnel_events_cohort_created_idx on public.mentorship_funnel_events (cohort_slug, created_at);
create index if not exists mentorship_funnel_events_visit_idx on public.mentorship_funnel_events (visit_id);

alter table public.mentorship_funnel_events enable row level security;
revoke all on public.mentorship_funnel_events from public, anon, authenticated;
grant all on public.mentorship_funnel_events to service_role;
grant select on public.mentorship_funnel_events to authenticated;
drop policy if exists "Staff read funnel events" on public.mentorship_funnel_events;
create policy "Staff read funnel events" on public.mentorship_funnel_events for select to authenticated
  using (public.is_mentorship_staff());

create or replace function public.record_mentorship_funnel_event(
  p_cohort_slug text,
  p_visit_id uuid,
  p_event text,
  p_source text,
  p_campaign text default null,
  p_device text default null,
  p_in_app boolean default false,
  p_step integer default null,
  p_question text default null,
  p_duration_ms integer default null,
  p_detail text default null,
  p_is_test boolean default false
) returns void language plpgsql security definer set search_path=public as $$
begin
  if p_visit_id is null or p_event is null or nullif(btrim(p_cohort_slug),'') is null
     or p_event <> all (array[
       'page_view','page_scroll','price_seen','apply_click','video_play','page_exit',
       'form_view','form_error','form_start','question_view','question_done','question_error',
       'review_view','send_click','send_ok','send_fail','js_error'
     ]) then
    return;
  end if;
  insert into public.mentorship_funnel_events(cohort_slug, visit_id, event, source, campaign, device, in_app, step, question, duration_ms, detail, is_test)
  values (
    left(btrim(p_cohort_slug), 80),
    p_visit_id,
    p_event,
    case when p_source in ('instagram','link_in_bio','email','youtube','facebook') then p_source else 'other' end,
    left(nullif(btrim(p_campaign),''), 120),
    left(nullif(btrim(p_device),''), 20),
    coalesce(p_in_app, false),
    p_step,
    left(nullif(btrim(p_question),''), 60),
    case when p_duration_ms is null then null else least(greatest(p_duration_ms, 0), 86400000) end,
    left(nullif(btrim(p_detail),''), 200),
    coalesce(p_is_test, false)
  );
end $$;
revoke all on function public.record_mentorship_funnel_event(text,uuid,text,text,text,text,boolean,integer,text,integer,text,boolean) from public;
grant execute on function public.record_mentorship_funnel_event(text,uuid,text,text,text,text,boolean,integer,text,integer,text,boolean) to anon, authenticated, service_role;

create or replace function public.get_mentorship_funnel(p_cohort_id uuid, p_since timestamptz default null, p_source text default null)
returns jsonb language plpgsql stable security definer set search_path=public as $$
declare
  v_slugs text[];
begin
  if not coalesce(public.is_mentorship_staff(), false) then
    raise exception 'Staff access required' using errcode='42501';
  end if;

  select coalesce(array_agg(x.slug), '{}'::text[]) into v_slugs from (
    select c.slug from public.mentorship_cohorts c where c.id = p_cohort_id
    union
    select f.slug from public.mentorship_application_forms f where f.cohort_id = p_cohort_id
  ) x where x.slug is not null;

  return (
    with counted as (
      select e.* from public.mentorship_funnel_events e
      where not e.is_test and e.cohort_slug = any(v_slugs)
    ),
    visit as (
      select c.visit_id,
        (array_agg(c.source order by c.created_at, c.id))[1] as source,
        (array_agg(c.campaign order by c.created_at, c.id) filter (where c.campaign is not null))[1] as campaign,
        (array_agg(c.device order by c.created_at, c.id) filter (where c.device is not null))[1] as device,
        bool_or(c.in_app) as in_app,
        bool_or(c.event = 'apply_click') as apply,
        bool_or(c.event = 'form_view') as form,
        bool_or(c.event = 'form_start') as started,
        bool_or(c.event = 'send_ok') as sent
      from counted c
      group by c.visit_id
      having p_since is null or min(c.created_at) >= p_since
    ),
    shown as (
      select * from visit v where nullif(p_source,'') is null or v.source = p_source
    ),
    ev as (
      select c.* from counted c join shown s on s.visit_id = c.visit_id
    )
    select jsonb_build_object(
      'first_event', (select min(created_at) from counted),
      'visits', (select count(*) from shown),
      'steps', coalesce((select jsonb_object_agg(t.event, t.n) from (
        select event, count(distinct visit_id) as n from ev group by event) t), '{}'::jsonb),
      'scroll', coalesce((select jsonb_object_agg(t.step::text, t.n) from (
        select step, count(distinct visit_id) as n from ev where event = 'page_scroll' and step is not null group by step) t), '{}'::jsonb),
      'apply_clicks', coalesce((select jsonb_object_agg(t.detail, t.n) from (
        select detail, count(distinct visit_id) as n from ev where event = 'apply_click' and detail is not null group by detail) t), '{}'::jsonb),
      'video_plays', coalesce((select jsonb_object_agg(t.detail, t.n) from (
        select detail, count(distinct visit_id) as n from ev where event = 'video_play' and detail is not null group by detail) t), '{}'::jsonb),
      'page_seconds', coalesce((select round((percentile_cont(0.5) within group (order by t.ms)) / 1000.0)::integer from (
        select visit_id, max(duration_ms) as ms from ev where event = 'page_exit' and duration_ms is not null group by visit_id) t), 0),
      'questions', coalesce((select jsonb_agg(jsonb_build_object(
          'step', t.step, 'question', t.question, 'reached', t.reached, 'answered', t.answered, 'errors', t.errors, 'median_ms', t.median_ms
        ) order by t.step nulls last, t.question) from (
        select step, question,
          count(distinct visit_id) filter (where event = 'question_view') as reached,
          count(distinct visit_id) filter (where event = 'question_done') as answered,
          count(*) filter (where event = 'question_error') as errors,
          coalesce(round(percentile_cont(0.5) within group (order by duration_ms) filter (where event = 'question_done' and duration_ms is not null))::integer, 0) as median_ms
        from ev where question is not null and event in ('question_view','question_done','question_error')
        group by step, question) t), '[]'::jsonb),
      'question_errors', coalesce((select jsonb_agg(jsonb_build_object(
          'step', t.step, 'question', t.question, 'detail', t.detail, 'count', t.n
        ) order by t.step nulls last, t.n desc) from (
        select step, question, coalesce(detail,'') as detail, count(*) as n
        from ev where event = 'question_error' and question is not null
        group by step, question, coalesce(detail,'')) t), '[]'::jsonb),
      'send_failures', coalesce((select jsonb_agg(jsonb_build_object('detail', t.detail, 'count', t.n) order by t.n desc) from (
        select coalesce(detail,'') as detail, count(*) as n from ev where event = 'send_fail' group by coalesce(detail,'')) t), '[]'::jsonb),
      'page_errors', coalesce((select jsonb_agg(jsonb_build_object('event', t.event, 'detail', t.detail, 'count', t.n) order by t.n desc) from (
        select event, coalesce(detail,'') as detail, count(*) as n from ev where event in ('js_error','form_error') group by event, coalesce(detail,'')) t), '[]'::jsonb),
      'sources', coalesce((select jsonb_agg(jsonb_build_object(
          'key', t.source, 'visits', t.visits, 'apply', t.apply, 'form', t.form, 'started', t.started, 'sent', t.sent
        ) order by t.visits desc, t.source) from (
        select source, count(*) as visits, count(*) filter (where apply) as apply, count(*) filter (where form) as form,
          count(*) filter (where started) as started, count(*) filter (where sent) as sent
        from visit group by source) t), '[]'::jsonb),
      'campaigns', coalesce((select jsonb_agg(jsonb_build_object(
          'key', t.campaign, 'source', t.source, 'visits', t.visits, 'apply', t.apply, 'form', t.form, 'started', t.started, 'sent', t.sent
        ) order by t.visits desc, t.campaign) from (
        select campaign, source, count(*) as visits, count(*) filter (where apply) as apply, count(*) filter (where form) as form,
          count(*) filter (where started) as started, count(*) filter (where sent) as sent
        from shown where campaign is not null group by campaign, source) t), '[]'::jsonb),
      'devices', coalesce((select jsonb_agg(jsonb_build_object(
          'key', t.device, 'visits', t.visits, 'apply', t.apply, 'form', t.form, 'started', t.started, 'sent', t.sent
        ) order by t.visits desc, t.device) from (
        select device, count(*) as visits, count(*) filter (where apply) as apply, count(*) filter (where form) as form,
          count(*) filter (where started) as started, count(*) filter (where sent) as sent
        from shown where device is not null group by device) t), '[]'::jsonb),
      'in_app_visits', (select count(*) from shown where in_app)
    )
  );
end $$;
revoke all on function public.get_mentorship_funnel(uuid,timestamptz,text) from public, anon;
grant execute on function public.get_mentorship_funnel(uuid,timestamptz,text) to authenticated, service_role;