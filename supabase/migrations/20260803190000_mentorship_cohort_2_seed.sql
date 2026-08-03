-- Operational starting point for the next cohort. Dates, Circle links and video
-- URLs remain deliberately unset until George and Rob lock the launch calendar.

insert into public.mentorship_cohorts (
  slug,
  internal_name,
  display_name,
  status,
  current_week,
  timezone
)
values (
  'cohort-2',
  'Cohort 2',
  'Rob Late''s Producer Mentorship',
  'draft',
  1,
  'Europe/London'
)
on conflict (slug) do nothing;

insert into public.mentorship_weeks (
  cohort_id,
  week_number,
  title,
  short_title,
  brief,
  required_ideas,
  song_required,
  stems_required
)
select cohort.id, source.week_number, source.title, source.short_title,
  source.brief, source.required_ideas, true, true
from public.mentorship_cohorts cohort
cross join (values
  (1, 'Ideas into songs', 'Ideas into songs', 'Build the loops folder, create five usable ideas and turn one into a song.', 5),
  (2, 'Structure', 'Structure', 'Use song structure as the minimum viable product an artist can say yes to.', 3),
  (3, 'A-list projects', 'A-list projects', 'Move from a loops folder into a focused session and a record worth picking.', 3),
  (4, 'Sound selection', 'Sound selection', 'Make the same idea sound expensive, then flag your strongest song.', 3),
  (5, 'The build-out', 'Build-out', 'Build the selected song into a full track without losing the original idea.', 0),
  (6, 'Finish and ship', 'Finish', 'Rough mix it, box it off and leave with a finished songs folder.', 0)
) as source(week_number, title, short_title, brief, required_ideas)
where cohort.slug = 'cohort-2'
on conflict (cohort_id, week_number) do nothing;

insert into public.mentorship_onboarding_tasks (
  cohort_id,
  task_key,
  title,
  description,
  action_label,
  position,
  required
)
select cohort.id, source.task_key, source.title, source.description,
  source.action_label, source.position, true
from public.mentorship_cohorts cohort
cross join (values
  ('book-call', 'Book your onboarding call with Rob', 'Choose a time, then bring the track and goal you submitted with your application.', 'Book your call', 1),
  ('prework', 'Complete the four setup videos', 'Build the sound library, session template, reference playlist and stems workflow you will use every week.', 'Watch the setup videos', 2),
  ('circle', 'Join the private Circle space', 'Calls, announcements and conversation with Rob live there throughout the six weeks.', 'Open Circle', 3),
  ('first-call', 'Put the first live call in your calendar', 'Come live and be ready to work. The confirmed date will appear here before the programme begins.', 'Add to calendar', 4)
) as source(task_key, title, description, action_label, position)
where cohort.slug = 'cohort-2'
on conflict (cohort_id, task_key) do nothing;

insert into public.mentorship_resources (
  cohort_id,
  resource_key,
  resource_kind,
  title,
  description,
  duration_label,
  position,
  published
)
select cohort.id, source.resource_key, source.resource_kind, source.title,
  source.description, source.duration_label, source.position, false
from public.mentorship_cohorts cohort
cross join (values
  ('welcome', 'welcome_video', 'Welcome to the mentorship', 'Rob explains how the six weeks work and what to do first.', null, 0),
  ('sound-library', 'setup_video', 'Craft your sound library', 'Build a trusted stash so every session starts with momentum.', '12 min', 1),
  ('session-template', 'setup_video', 'Build your session template', 'Set up the workhorse project you will use for every weekly rep.', '16 min', 2),
  ('reference-playlist', 'setup_video', 'Curate your reference playlist', 'Choose references that keep your structure and decisions honest.', '11 min', 3),
  ('stems-workflow', 'setup_video', 'Export stems properly', 'Prepare files Rob can open quickly if your track is selected for surgery.', '8 min', 4)
) as source(resource_key, resource_kind, title, description, duration_label, position)
where cohort.slug = 'cohort-2'
on conflict (cohort_id, resource_key) do nothing;
