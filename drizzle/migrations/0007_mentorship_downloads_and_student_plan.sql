-- Files students download from the portal, such as the Master Bundle, stored with the programme videos.
alter table public.mentorship_resources drop constraint if exists mentorship_resources_resource_kind_check;
alter table public.mentorship_resources add constraint mentorship_resources_resource_kind_check
  check (resource_kind in ('welcome_video', 'setup_video', 'download'));

insert into public.mentorship_resources (cohort_id, resource_key, resource_kind, title, description, duration_label, position, published)
select c.id, r.resource_key, 'download', r.title, r.description, '', r.position, false
from public.mentorship_cohorts c
cross join (values
  ('master-bundle-1', 'Master Bundle part 1 of 2', 'First zip of the Master Bundle. Students see it once it is uploaded.', 20),
  ('master-bundle-2', 'Master Bundle part 2 of 2', 'Second zip of the Master Bundle. Students see it once it is uploaded.', 21)
) as r(resource_key, title, description, position)
where c.slug = 'cohort-2'
on conflict (cohort_id, resource_key) do nothing;

-- What a student may see of their agreed onboarding plan. Staff notes stay private, so this returns
-- only the goal, coaching priorities and week-one practice, for the signed-in student's own enrolment.
create or replace function public.get_my_onboarding_plan()
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'goal', n.questionnaire #>> '{answers,goal}',
    'focus', n.questionnaire #>> '{answers,focus}',
    'practice', n.questionnaire #>> '{answers,practice}')
  from public.mentorship_staff_notes n
  join public.mentorship_enrollments e on e.id = n.enrollment_id
  where e.user_id = auth.uid() and e.status = 'active' and n.kind = 'onboarding' and n.questionnaire ->> 'status' = 'agreed'
  order by n.updated_at desc
  limit 1
$$;
revoke all on function public.get_my_onboarding_plan() from public, anon;
grant execute on function public.get_my_onboarding_plan() to authenticated;