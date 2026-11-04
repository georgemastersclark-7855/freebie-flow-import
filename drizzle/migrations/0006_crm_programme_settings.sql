alter table public.mentorship_admissions_settings
  add column if not exists reply_target_hours integer not null default 24 check (reply_target_hours between 1 and 720),
  add column if not exists offer_hold_hours integer not null default 24 check (offer_hold_hours between 1 and 720),
  add column if not exists list_columns jsonb not null default '[]'::jsonb,
  add column if not exists links_question_key text,
  add column if not exists links_label text not null default 'Their links';

update public.mentorship_admissions_settings s
set list_columns = '[{"key":"experience","label":"Producing"},{"key":"income","label":"Making from music"},{"key":"investment","label":"Ready to invest"}]'::jsonb,
    links_question_key = 'music',
    links_label = 'Their music'
from public.mentorship_cohorts c
where c.id = s.cohort_id and c.slug = 'cohort-2';

do $close$
declare v_admin uuid; v_forms int;
begin
  select user_id into v_admin from public.mentorship_profiles where email = 'team@roblate.com' and role = 'admin';
  if v_admin is null then raise exception 'Admin profile not found'; end if;
  perform set_config('request.jwt.claims', json_build_object('sub', v_admin, 'role', 'authenticated')::text, true);
  v_forms := public.set_mentorship_application_close('faa94fb4-dcf0-4d96-9369-d834c71fb0c2', '2026-11-11 23:59:00+00');
  if v_forms < 1 then raise exception 'No application form updated'; end if;
end
$close$;