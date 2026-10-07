begin;
select set_config('request.jwt.claims','{"role":"service_role"}',true);
do $test$
declare
  c uuid:='faa94fb4-dcf0-4d96-9369-d834c71fb0c2';
  sid uuid:='c0a80123-4567-489a-8abc-1234567890ab';
  v_answers jsonb:='[{"key":"name","question":"What’s your name?","answer":"Applicant"},{"key":"email","question":"What’s your email address?","answer":"native-qa@example.invalid"}]';
  v_attribution jsonb:='{"utm_source":"instagram","referrer":"https://audio.roblate.com/mentorship/apply"}';
  rollback_sid uuid:='d0a80123-4567-489a-8abc-1234567890ab';
  rollback_answers jsonb:='[{"key":"name","answer":"Rollback QA"},{"key":"email","answer":"rollback-qa@example.invalid"}]';
  v_lead_id uuid;
  result jsonb;
  n integer;
  provider_result jsonb;
  one_email_hash text:=repeat('a',64);
  ip_hash text:=repeat('b',64);
begin
  if not exists(select 1 from public.mentorship_native_application_routes where form_id='cohort-2-v1' and cohort_id=c and enabled) then raise exception 'Fixed native route is missing'; end if;
  if (select status from public.mentorship_intake_connections where cohort_id=c and provider='native')<>'setup_needed' then raise exception 'Native connection was prematurely marked connected'; end if;
  provider_result:=public.ingest_mentorship_lead(c,'gmail','native-review-gmail','{"email":"provider-gmail@example.invalid","stage":"new"}',now(),'Gmail provider regression test');
  if not exists(select 1 from public.mentorship_leads where id=(provider_result->>'lead_id')::uuid and first_contact_channel='Gmail handraiser') then raise exception 'Gmail first-contact channel regressed'; end if;
  provider_result:=public.ingest_mentorship_lead(c,'typeform','native-review-typeform','{"email":"provider-typeform@example.invalid","stage":"applied"}',now(),'Typeform provider regression test');
  if not exists(select 1 from public.mentorship_leads where id=(provider_result->>'lead_id')::uuid and first_contact_channel='Typeform application') then raise exception 'Typeform first-contact channel regressed'; end if;
  if not exists(select 1 from public.mentorship_lead_milestones where lead_id=(provider_result->>'lead_id')::uuid and milestone='applied' and evidence='Typeform response') then raise exception 'Typeform application milestone regressed'; end if;
  insert into public.mentorship_leads(cohort_id,full_name,email,stage,source,source_detail,first_contact_channel,next_action,payment_status,payment_reference,payment_on)
    values(c,'Existing QA','native-qa@example.invalid','approved','Original source','Staff source detail','Direct enquiry','Staff follow-up','confirmed','staff-payment-reference',current_date)
    returning id into v_lead_id;
  insert into public.mentorship_lead_activity(lead_id,kind,body) values(v_lead_id,'note','Preserved staff note');

  result:=public.submit_mentorship_application('cohort-2-v1',sid,
    '{"full_name":"New submitted name","email":"NATIVE-QA@example.invalid","source":"Instagram","source_detail":"utm_source=instagram","stage":"closed","goals":"Career","music_url":"https://soundcloud.com/qa"}',
    v_answers,v_attribution,ip_hash,one_email_hash);
  if result->>'success'<>'true' or result->>'submission_id'<>sid::text then raise exception 'Submission response invalid'; end if;
  if (select count(*) from public.mentorship_leads where cohort_id=c and email='native-qa@example.invalid')<>1 then raise exception 'Existing email was duplicated'; end if;
  if not exists(select 1 from public.mentorship_leads where id=v_lead_id and stage='approved' and source='Original source' and source_detail='Staff source detail' and first_contact_channel='Direct enquiry' and next_action='Staff follow-up' and payment_status='confirmed' and payment_reference='staff-payment-reference' and full_name='Existing QA') then raise exception 'Staff stage, notes, source, identity or payment state changed'; end if;
  if (select count(*) from public.mentorship_lead_activity where lead_id=v_lead_id and body='Preserved staff note')<>1 then raise exception 'Staff note was lost'; end if;
  if not exists(select 1 from public.mentorship_applications where form_id='cohort-2-v1' and response_id=sid::text and lead_id=v_lead_id and answers=v_answers and attribution=v_attribution) then raise exception 'Application answer or attribution evidence missing'; end if;
  if (select application_url from public.mentorship_leads where id=v_lead_id) is not null then raise exception 'Lead received a misleading public application link'; end if;
  if not exists(select 1 from public.mentorship_intake_events where cohort_id=c and provider='native' and external_id=sid::text and lead_id=v_lead_id) then raise exception 'Native intake evidence missing'; end if;
  if not exists(select 1 from public.mentorship_lead_milestones where lead_id=v_lead_id and milestone='applied' and evidence='Native application') then raise exception 'Native application milestone missing'; end if;
  if (select status from public.mentorship_intake_connections where cohort_id=c and provider='native')<>'setup_needed' then raise exception 'Submission prematurely changed connection status'; end if;

  -- A failure after rate rows are prepared leaves no lead, event, application or limit hit.
  begin
    perform public.submit_mentorship_application('cohort-2-v1',rollback_sid,
      '{"full_name":"Rollback QA","email":"rollback-qa@example.invalid","source":"Other","music_url":"javascript:invalid","stage":"applied"}',
      rollback_answers,v_attribution,repeat('d',64),repeat('e',64));
    raise exception 'Expected CRM validation rollback';
  exception when sqlstate 'P0001' then if sqlerrm<>'Use a valid HTTPS music link' then raise; end if; end;
  if exists(select 1 from public.mentorship_leads where cohort_id=c and email='rollback-qa@example.invalid')
     or exists(select 1 from public.mentorship_intake_events where provider='native' and external_id=rollback_sid::text)
     or exists(select 1 from public.mentorship_application_rate_limits where key_hash in (repeat('d',64),repeat('e',64))) then raise exception 'Failed submission left partial state'; end if;
  perform public.submit_mentorship_application('cohort-2-v1',rollback_sid,
    '{"full_name":"Rollback QA","email":"rollback-qa@example.invalid","source":"Other","music_url":"https://soundcloud.com/qa","stage":"applied"}',
    rollback_answers,v_attribution,repeat('d',64),repeat('e',64));
  if not exists(select 1 from public.mentorship_applications where form_id='cohort-2-v1' and response_id=rollback_sid::text) then raise exception 'Retry after rolled-back submission failed'; end if;

  -- A byte-for-byte logical replay succeeds without adding another event or rate hit.
  result:=public.submit_mentorship_application('cohort-2-v1',sid,
    '{"full_name":"New submitted name","email":"native-qa@example.invalid","source":"Instagram","source_detail":"utm_source=instagram","stage":"applied","goals":"Career","music_url":"https://soundcloud.com/qa"}',
    v_answers,v_attribution,ip_hash,one_email_hash);
  if result->>'success'<>'true' or (select count(*) from public.mentorship_applications where form_id='cohort-2-v1' and response_id=sid::text)<>1 then raise exception 'Replay was not idempotent'; end if;
  begin
    perform public.submit_mentorship_application('cohort-2-v1',sid,
      '{"full_name":"Changed","email":"native-qa@example.invalid"}',v_answers||'[{"key":"changed"}]',v_attribution,ip_hash,one_email_hash);
    raise exception 'Expected submission ID conflict';
  exception when sqlstate '22000' then null; end;

  -- Five unique submissions per normalized email are accepted within the hour.
  for n in 1..5 loop
    perform public.submit_mentorship_application('cohort-2-v1',gen_random_uuid(),
      jsonb_build_object('full_name','Rate test','email','rate-qa@example.invalid','source','YouTube','stage','applied'),
      v_answers||jsonb_build_array(jsonb_build_object('key','attempt','answer',n)),v_attribution,ip_hash,repeat('c',64));
  end loop;
  begin
    perform public.submit_mentorship_application('cohort-2-v1',gen_random_uuid(),
      '{"full_name":"Rate test","email":"rate-qa@example.invalid","stage":"applied"}',
      v_answers||'[{"key":"attempt","answer":6}]',v_attribution,ip_hash,repeat('c',64));
    raise exception 'Expected email rate limit';
  exception when sqlstate 'P0408' then if sqlerrm='Expected email rate limit' then raise; end if; end;
  if (select count(*) from public.mentorship_leads where cohort_id=c and email='rate-qa@example.invalid')<>1 then raise exception 'Rate limited attempts changed CRM unexpectedly'; end if;
  if not exists(select 1 from public.mentorship_leads where cohort_id=c and email='rate-qa@example.invalid' and stage='applied' and due_on=current_date) then raise exception 'Native application did not set a review due date'; end if;

  if has_function_privilege('anon','public.submit_mentorship_application(text,uuid,jsonb,jsonb,jsonb,text,text)','execute')
     or has_table_privilege('anon','public.mentorship_applications','select')
     or has_table_privilege('anon','public.mentorship_application_rate_limits','select') then raise exception 'Public application RPC or stored answers exposed'; end if;
  perform set_config('request.jwt.claims','{"role":"anon"}',true);
  begin
    perform public.submit_mentorship_application('cohort-2-v1',gen_random_uuid(),'{}','[]','{}',ip_hash,one_email_hash);
    raise exception 'Expected service-only RPC';
  exception when insufficient_privilege then null; end;
end $test$;
rollback;
select 'Native mentorship application tests passed: service-only access, replay conflict/idempotence, same-email merge, staff-state preservation, milestone/evidence storage and persistent email limits. Fixtures rolled back.' as result;
