begin;
select set_config('request.jwt.claims','{"role":"service_role"}',true);
do $test$
declare c uuid:='faa94fb4-dcf0-4d96-9369-d834c71fb0c2'; r jsonb; l uuid;
begin
 r:=public.ingest_mentorship_lead(c,'gmail','intake-test-a','{"email":"INTAKE-QA@example.invalid","full_name":"Intake QA","stage":"waitlist","source":"Newsletter","next_action":"Personal follow-up","email_thread_url":"https://mail.google.com/mail/u/0/#all/test"}',now(),'Verified waitlist request');
 l:=(r->>'lead_id')::uuid;
 r:=public.ingest_mentorship_lead(c,'gmail','intake-test-a','{"email":"intake-qa@example.invalid","full_name":"Other","stage":"waitlist"}',now(),'Repeated delivery');
 if r->>'duplicate'<>'true' or (select count(*) from mentorship_intake_events where lead_id=l)<>1 then raise exception 'Idempotence failed'; end if;
 perform public.ingest_mentorship_lead(c,'typeform','intake-test-b','{"email":"intake-qa@example.invalid","full_name":"Intake QA","stage":"applied","source":"Offer doc","next_action":"Overwrite attempt","application_url":"https://admin.typeform.com/form/test/results"}',now(),'Application received');
 if not exists(select 1 from mentorship_leads where id=l and stage='applied' and source='Newsletter' and next_action='Personal follow-up' and first_contact_channel='Gmail handraiser' and application_url is not null and email_thread_url is not null and payment_status='unconfirmed') then raise exception 'Source or staff decision preservation failed'; end if;
 update mentorship_leads set stage='closed' where id=l;
 perform public.ingest_mentorship_lead(c,'typeform','intake-test-c','{"email":"intake-qa@example.invalid","full_name":"Intake QA","stage":"applied"}',now(),'Another application');
 if (select stage from mentorship_leads where id=l)<>'closed' then raise exception 'Closed lead reopened'; end if;
 begin
  perform public.ingest_mentorship_lead(c,'gmail','intake-test-d','{"email":"intake-qa@example.invalid","stage":"applied"}',now(),'Wrong evidence');
  raise exception 'Expected stage validation';
 exception when others then if sqlerrm='Expected stage validation' then raise; end if; end;
 perform set_config('request.jwt.claims','{"role":"authenticated"}',true);
 begin
  perform public.ingest_mentorship_lead(c,'gmail','intake-test-e','{"email":"intake-qa@example.invalid"}',now(),'Nonstaff attempt');
  raise exception 'Expected permission denied';
 exception when insufficient_privilege then null; end;
 if has_function_privilege('anon','public.ingest_mentorship_lead(uuid,text,text,jsonb,timestamptz,text)','execute') then raise exception 'Anonymous ingestion exposed'; end if;
 if has_table_privilege('authenticated','public.mentorship_intake_events','insert') then raise exception 'Evidence writable from client'; end if;
end $test$;
rollback;
