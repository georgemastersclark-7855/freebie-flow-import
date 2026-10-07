begin;
select set_config('request.jwt.claims','{"role":"service_role"}',true);
do $test$
declare
  configured_cohort uuid;
  enrollment_first_cohort uuid;
  student_user uuid;
  student_email text;
  enrollment uuid;
  already_enrolled uuid;
  lead uuid;
  result jsonb;
  created_at timestamptz:=now()+interval '1 day';
  created_event_at timestamptz:=now()-interval '10 minutes';
  rescheduled_event_at timestamptz:=now()-interval '8 minutes';
  newer_event_at timestamptz:=now()-interval '6 minutes';
  cancel_old_at timestamptz:=now()-interval '5 minutes';
  cancel_current_at timestamptz:=now()-interval '4 minutes';
  cancel_equal_at timestamptz:=now()-interval '30 seconds';
begin
  select user_id,email into student_user,student_email from public.mentorship_profiles where role='student' limit 1;
  if student_user is null then raise exception 'Need a student profile fixture'; end if;
  student_email:=lower(btrim(student_email));
  insert into public.mentorship_cohorts(slug,internal_name,display_name)
  values('booking-sync-qa-'||txid_current(),'Booking sync QA','Booking sync QA') returning id into configured_cohort;
  insert into public.mentorship_cohorts(slug,internal_name,display_name)
  values('booking-sync-enrolled-first-qa-'||txid_current(),'Booking sync enrolled first QA','Booking sync enrolled first QA') returning id into enrollment_first_cohort;

  insert into public.mentorship_leads(cohort_id,full_name,email,source)
  values(configured_cohort,'Booking QA',student_email,'QA') returning id into lead;

  result:=public.ingest_calendly_booking_event(configured_cohort,'cal-event-created','created',student_email,
    'https://api.calendly.com/scheduled_events/AAAAAAAAAAAAAAAA/invitees/invitee-a',created_at,created_event_at);
  if (result->>'matched')::boolean or result->>'lead_id'<>lead::text then raise exception 'Pre-enrollment booking was not retained against the exact cohort lead'; end if;
  result:=public.ingest_calendly_booking_event(configured_cohort,'cal-event-created','created',student_email,
    'https://api.calendly.com/scheduled_events/AAAAAAAAAAAAAAAA/invitees/invitee-a',created_at,created_event_at);
  if result->>'duplicate'<>'true' or (select count(*) from public.mentorship_booking_events where cohort_id=configured_cohort)<>1 then
    raise exception 'Repeated provider delivery was not idempotent';
  end if;

  perform public.ingest_calendly_booking_event(configured_cohort,'cal-event-rescheduled','rescheduled',student_email,
    'https://api.calendly.com/scheduled_events/AAAAAAAAAAAAAAAA/invitees/invitee-a',created_at,rescheduled_event_at,
    'https://api.calendly.com/scheduled_events/AAAAAAAAAAAAAAAA/invitees/invitee-b',created_at+interval '1 day');
  if not exists(select 1 from public.mentorship_booking_inbox where cohort_id=configured_cohort and invitee_uri like '%invitee-a' and status='rescheduled')
     or not exists(select 1 from public.mentorship_booking_inbox where cohort_id=configured_cohort and invitee_uri like '%invitee-b' and status='active') then
    raise exception 'Reschedule did not retain old and replacement booking state';
  end if;
  perform public.ingest_calendly_booking_event(configured_cohort,'cal-event-created-after-reschedule','created',student_email,
    'https://api.calendly.com/scheduled_events/AAAAAAAAAAAAAAAA/invitees/invitee-a',created_at, rescheduled_event_at);
  if not exists(select 1 from public.mentorship_booking_inbox where cohort_id=configured_cohort
       and invitee_uri like '%invitee-a' and status='rescheduled')
     or not exists(select 1 from public.mentorship_booking_inbox where cohort_id=configured_cohort
       and invitee_uri like '%invitee-b' and status='active') then
    raise exception 'Equal-timestamp created delivery resurrected a rescheduled invitee';
  end if;

  insert into public.mentorship_enrollments(cohort_id,user_id) values(configured_cohort,student_user) returning id into enrollment;
  if not exists(select 1 from public.mentorship_booking_inbox where cohort_id=configured_cohort and enrollment_id=enrollment and status='active') then
    raise exception 'Existing booking was not linked when the enrollment arrived';
  end if;
  if not exists(select 1 from public.mentorship_onboarding_calls where enrollment_id=enrollment
       and calendly_invitee_uri like '%invitee-b' and booked_at=created_at+interval '1 day' and completed_at is null) then
    raise exception 'Enrollment did not receive the scheduled call or booking incorrectly marked completion';
  end if;

  update public.mentorship_onboarding_calls set notes='Staff notes retained',completed_at=now() where enrollment_id=enrollment;
  perform public.ingest_calendly_booking_event(configured_cohort,'cal-event-newer','created',student_email,
    'https://api.calendly.com/scheduled_events/AAAAAAAAAAAAAAAA/invitees/invitee-c',created_at+interval '2 days',newer_event_at);
  if not exists(select 1 from public.mentorship_onboarding_calls where enrollment_id=enrollment
       and calendly_invitee_uri like '%invitee-c' and notes='Staff notes retained' and completed_at is not null) then
    raise exception 'Newer booking clobbered staff notes or completion';
  end if;

  perform public.ingest_calendly_booking_event(configured_cohort,'cal-event-cancel-old','cancelled',student_email,
    'https://api.calendly.com/scheduled_events/AAAAAAAAAAAAAAAA/invitees/invitee-b',created_at+interval '1 day',cancel_old_at);
  if not exists(select 1 from public.mentorship_onboarding_calls where enrollment_id=enrollment
       and calendly_invitee_uri like '%invitee-c' and booked_at=created_at+interval '2 days') then
    raise exception 'Stale cancellation cleared a newer booking';
  end if;

  perform public.ingest_calendly_booking_event(configured_cohort,'cal-event-cancel-current','cancelled',student_email,
    'https://api.calendly.com/scheduled_events/AAAAAAAAAAAAAAAA/invitees/invitee-c',created_at+interval '2 days',cancel_current_at);
  if not exists(select 1 from public.mentorship_onboarding_calls where enrollment_id=enrollment
       and booked_at is null and calendly_invitee_uri is null and notes='Staff notes retained' and completed_at is not null) then
    raise exception 'Current cancellation did not clear only the booking fields or preserve staff state';
  end if;

  perform public.ingest_calendly_booking_event(configured_cohort,'cal-event-unmatched','created','unknown-booking@example.invalid',
    'https://api.calendly.com/scheduled_events/AAAAAAAAAAAAAAAA/invitees/invitee-unmatched',created_at,created_event_at);
  if not exists(select 1 from public.mentorship_booking_inbox where cohort_id=configured_cohort and email='unknown-booking@example.invalid'
       and lead_id is null and enrollment_id is null and status='active') then
    raise exception 'Unmatched booking was not retained for staff review';
  end if;

  perform public.ingest_calendly_booking_event(configured_cohort,'cal-event-cancel-before-create','cancelled','cancelled-booking@example.invalid',
    'https://api.calendly.com/scheduled_events/AAAAAAAAAAAAAAAA/invitees/invitee-terminal',null,cancel_equal_at);
  perform public.ingest_calendly_booking_event(configured_cohort,'cal-event-create-equal-to-cancel','created','cancelled-booking@example.invalid',
    'https://api.calendly.com/scheduled_events/AAAAAAAAAAAAAAAA/invitees/invitee-terminal',created_at,cancel_equal_at);
  if not exists(select 1 from public.mentorship_booking_inbox where cohort_id=configured_cohort and email='cancelled-booking@example.invalid'
       and invitee_uri like '%invitee-terminal' and status='cancelled') then
    raise exception 'Equal-timestamp created delivery resurrected a cancelled invitee';
  end if;

  perform public.ingest_calendly_booking_event(configured_cohort,'cal-event-unrelated-cancel-a','cancelled','reordered-booking@example.invalid',
    'https://api.calendly.com/scheduled_events/AAAAAAAAAAAAAAAA/invitees/invitee-old-a',null,now()-interval '2 minutes');
  perform public.ingest_calendly_booking_event(configured_cohort,'cal-event-unrelated-cancel-b','cancelled','reordered-booking@example.invalid',
    'https://api.calendly.com/scheduled_events/AAAAAAAAAAAAAAAA/invitees/invitee-old-b',null,now()-interval '1 minute');
  perform public.ingest_calendly_booking_event(configured_cohort,'cal-event-new-booking-delivered-late','created','reordered-booking@example.invalid',
    'https://api.calendly.com/scheduled_events/AAAAAAAAAAAAAAAA/invitees/invitee-new',created_at,now()-interval '3 minutes');
  if not exists(select 1 from public.mentorship_booking_inbox where cohort_id=configured_cohort and email='reordered-booking@example.invalid'
       and invitee_uri like '%invitee-new' and status='active') then
    raise exception 'Unrelated newer cancellations suppressed a valid booking delivered late';
  end if;

  insert into public.mentorship_enrollments(cohort_id,user_id) values(enrollment_first_cohort,student_user) returning id into already_enrolled;
  result:=public.ingest_calendly_booking_event(enrollment_first_cohort,'cal-event-enrolled-first','created',student_email,
    'https://api.calendly.com/scheduled_events/AAAAAAAAAAAAAAAA/invitees/invitee-enrolled-first',created_at+interval '4 days',now()-interval '3 minutes');
  if (result->>'matched')::boolean is not true or result->>'enrollment_id'<>already_enrolled::text
     or not exists(select 1 from public.mentorship_onboarding_calls where enrollment_id=already_enrolled
       and calendly_invitee_uri like '%invitee-enrolled-first' and booked_at=created_at+interval '4 days') then
    raise exception 'Webhook did not match an enrollment created before the booking';
  end if;

  if has_function_privilege('anon','public.ingest_calendly_booking_event(uuid,text,text,text,text,timestamptz,timestamptz,text,timestamptz)','execute')
     or has_function_privilege('authenticated','public.ingest_calendly_booking_event(uuid,text,text,text,text,timestamptz,timestamptz,text,timestamptz)','execute') then
    raise exception 'Calendly ingestion RPC is exposed outside service role';
  end if;
  if has_table_privilege('authenticated','public.mentorship_booking_inbox','insert')
     or has_table_privilege('authenticated','public.mentorship_booking_events','insert') then
    raise exception 'Authenticated client can write provider booking evidence';
  end if;
  if position(':calendly-email:' in pg_get_functiondef('public.link_calendly_bookings_after_enrollment()'::regprocedure))=0
     or position(':calendly-email:' in pg_get_functiondef('public.ingest_calendly_booking_event(uuid,text,text,text,text,timestamptz,timestamptz,text,timestamptz)'::regprocedure))=0 then
    raise exception 'Enrollment and webhook paths do not serialize on the same cohort/email lock';
  end if;
end
$test$;
rollback;
select 'Calendly replay safety, terminal state ordering, cancellation isolation, both enrollment orderings, stale cancellation, staff-state preservation, and service-only writes passed. Fixtures rolled back.' as result;
