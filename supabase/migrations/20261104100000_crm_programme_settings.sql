-- Per-programme settings for the staff Applications screen, so nothing on it is hard-coded to one offer.
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
