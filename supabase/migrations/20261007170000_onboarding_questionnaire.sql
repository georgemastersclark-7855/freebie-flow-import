-- Structured questionnaire answers accompany the readable staff note.
-- Existing staff-only RLS, attribution and optimistic concurrency remain in use.
alter table public.mentorship_staff_notes
  add column questionnaire jsonb;
alter table public.mentorship_staff_notes
  add constraint onboarding_questionnaire_shape check (
    questionnaire is null or (
      kind = 'onboarding' and jsonb_typeof(questionnaire) = 'object'
      and (questionnaire ->> 'template') is not distinct from 'onboarding-v1'
      and coalesce(questionnaire ->> 'status' in ('draft','agreed'), false)
      and jsonb_typeof(questionnaire -> 'answers') is not distinct from 'object'
      and octet_length(questionnaire::text) <= 40000
    )
  );
create unique index mentorship_one_onboarding_questionnaire
  on public.mentorship_staff_notes(enrollment_id)
  where questionnaire ->> 'template' = 'onboarding-v1';
