-- NOT A MIGRATION. For George to read, then run by hand in the Lovable Cloud SQL editor if he agrees.
--
-- georgemastersclark@gmail.com is a real (not test) student enrolment in cohort 2, so it counts as a
-- student in the CRM, the cohort board and the onboarding queue. Checked 1 Nov 2026: role student,
-- no uploads, no feedback, no student profile, no CRM lead.
--
-- Option A (default below, reversible): switch its portal access off. The account stays, so it can
-- still be used to test the Shopify purchase: a paid order switches access back on and flags it in
-- the CRM as a test order.
-- Option B (permanent): delete the enrolment instead. Swap the commented blocks to use it.
--
-- Marking it is_walkthrough was considered and rejected: walkthrough enrolments are only opened by
-- staff accounts, so a student account marked that way could sign in but would see no enrolment.
begin;

do $$
declare matches integer;
begin
  select count(*) into matches
  from public.mentorship_enrollments e
  join public.mentorship_profiles p on p.user_id=e.user_id
  join public.mentorship_cohorts c on c.id=e.cohort_id
  where p.email='georgemastersclark@gmail.com' and c.slug='cohort-2' and not e.is_walkthrough;
  if matches<>1 then raise exception 'Expected one cohort 2 enrolment for the test student, found %. Nothing changed.', matches; end if;

  if exists(
    select 1 from public.mentorship_submission_files f
    join public.mentorship_submissions s on s.id=f.submission_id
    join public.mentorship_enrollments e on e.id=s.enrollment_id
    join public.mentorship_profiles p on p.user_id=e.user_id
    where p.email='georgemastersclark@gmail.com'
  ) then raise exception 'The test student now has uploads. Remove them in Storage first. Nothing changed.'; end if;
end $$;

-- Option A: switch access off.
update public.mentorship_enrollments e set status='inactive'
from public.mentorship_profiles p, public.mentorship_cohorts c
where p.user_id=e.user_id and c.id=e.cohort_id
  and p.email='georgemastersclark@gmail.com' and c.slug='cohort-2' and not e.is_walkthrough
returning e.id, e.status;

-- Option B: delete the enrolment (also removes its six empty weekly submissions and any onboarding
-- ticks). The login account itself stays; delete that in Authentication > Users if wanted.
-- delete from public.mentorship_enrollments e
-- using public.mentorship_profiles p, public.mentorship_cohorts c
-- where p.user_id=e.user_id and c.id=e.cohort_id
--   and p.email='georgemastersclark@gmail.com' and c.slug='cohort-2' and not e.is_walkthrough
-- returning e.id;

commit;
