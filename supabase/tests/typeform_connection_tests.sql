begin;
select set_config('request.jwt.claims','{"role":"service_role"}',true);
do $test$
declare cohort uuid; result jsonb; lead uuid; route jsonb; start_time timestamptz;
begin
  insert into public.mentorship_cohorts(slug,internal_name,display_name) values('typeform-qa-'||txid_current(),'Typeform QA','Typeform QA') returning id into cohort;
  route:=public.prepare_mentorship_typeform('QAForm123',cohort,'QA form','{"email":"email"}');
  start_time:=(route->>'accepts_from')::timestamptz;
  if length(route->>'secret')<>64 then raise exception 'Missing signing secret'; end if;
  if public.prepare_mentorship_typeform('QAForm123',cohort,'QA form','{"email":"email"}')->>'secret'<>route->>'secret' then raise exception 'Reconnect rotated the secret unexpectedly'; end if;
  update public.mentorship_typeform_routes set enabled=true where form_id='QAForm123';
  result:=public.ingest_mentorship_typeform('QAForm123','old-response',start_time-interval '1 day','{"email":"qa-typeform@example.invalid"}','[]','Older application');
  if result->>'ignored'<>'before_connection' or exists(select 1 from public.mentorship_leads where cohort_id=cohort) then raise exception 'Historic application counted as new'; end if;
  insert into public.mentorship_leads(cohort_id,full_name,email,stage,source,next_action) values(cohort,'Existing lead','qa-typeform@example.invalid','waitlist','Email','Personal staff follow-up') returning id into lead;
  result:=public.ingest_mentorship_typeform('QAForm123','response-one',start_time,'{"email":"qa-typeform@example.invalid","full_name":"Applicant","stage":"applied","source":"Instagram","goals":"Finish music"}','[{"question":"Goal","answer":"Finish music"}]','New application');
  if result->>'lead_id'<>lead::text or (select count(*) from public.mentorship_leads where cohort_id=cohort)<>1 then raise exception 'Email match duplicated contact'; end if;
  if not exists(select 1 from public.mentorship_leads where id=lead and stage='applied' and source='Email' and next_action='Personal staff follow-up') then raise exception 'Intake replaced staff follow-up or original attribution'; end if;
  result:=public.ingest_mentorship_typeform('QAForm123','response-one',start_time,'{"email":"qa-typeform@example.invalid","stage":"applied"}','[]','Replay');
  if result->>'duplicate'<>'true' or (select count(*) from public.mentorship_applications where lead_id=lead)<>1 then raise exception 'Replay duplicated application'; end if;
  update public.mentorship_leads set stage='approved' where id=lead;
  perform public.ingest_mentorship_typeform('QAForm123','response-two',start_time,'{"email":"qa-typeform@example.invalid","stage":"applied"}','[]','Follow-up application');
  if (select stage from public.mentorship_leads where id=lead)<>'approved' then raise exception 'Webhook regressed staff approval'; end if;
  if not exists(select 1 from public.mentorship_lead_milestones where lead_id=lead and milestone='applied' and occurred_at=start_time) then raise exception 'Application milestone missing'; end if;
  if has_function_privilege('authenticated','public.get_mentorship_typeform_route(text)','execute') or has_table_privilege('authenticated','public.mentorship_typeform_routes','select') or has_table_privilege('anon','public.mentorship_applications','select') then raise exception 'Provider secrets or answers exposed'; end if;
  perform set_config('request.jwt.claims','{"role":"authenticated"}',true);
  begin
    perform public.get_mentorship_typeform_route('QAForm123');
    raise exception 'Non-service caller read signing secret';
  exception when insufficient_privilege then null;
  end;
end $test$;
rollback;
select 'Typeform tests passed: signed-secret isolation, reconnect safety, cutover, email merge, replay, attribution/staff-state preservation and application evidence. No fixtures kept.' as result;
