begin;
do $setup$
declare admin_id uuid; student_id uuid; cohort_id uuid;
begin
  select user_id into admin_id from public.mentorship_profiles where role='admin' limit 1;
  select user_id into student_id from public.mentorship_profiles where role='student' limit 1;
  if admin_id is null or student_id is null then raise exception 'Need admin and student fixtures'; end if;
  insert into public.mentorship_cohorts(slug,internal_name,display_name) values('form-editor-'||txid_current(),'Form editor QA','Form editor QA') returning id into cohort_id;
  perform set_config('qa.admin',admin_id::text,true); perform set_config('qa.student',student_id::text,true); perform set_config('qa.cohort',cohort_id::text,true);
end $setup$;

select set_config('request.jwt.claims',jsonb_build_object('sub',current_setting('qa.admin'),'role','authenticated')::text,true);
set local role authenticated;
do $admin$
declare
  cfg jsonb:='{"welcome":{"eyebrow":"Apply","title":"About you","description":"A short form.","buttonText":"Start"},"identity":{"title":"Program","description":"Six weeks.","cohortLabel":"QA","details":["6 weeks","12 places","$2,497 USD"]},"completion":{"title":"Thanks","description":"We will email you at {email}."},"questions":[{"key":"name","title":"What’s your name?","description":"Name.","placeholder":"Your name","section":"About you","type":"text","required":true,"maxLength":160},{"key":"email","title":"What’s your email?","description":"Email.","placeholder":"you@example.com","section":"About you","type":"email","required":true,"maxLength":254}]}';
  cfg2 jsonb; f jsonb; v_form_id text; rejected boolean:=false;
begin
  f:=public.create_mentorship_application_form('Editor QA','editor-qa-'||txid_current(),current_setting('qa.cohort')::uuid,cfg);
  v_form_id:=f->>'id'; perform set_config('qa.form_id',v_form_id,true);
  if f->>'draft_version'<>'1' or f->>'is_open'<>'false' then raise exception 'Form did not start as a private draft'; end if;
  f:=public.save_mentorship_application_form(v_form_id,1,'Editor QA',cfg);
  if f->>'draft_version'<>'2' then raise exception 'Draft version did not increment'; end if;
  begin perform public.save_mentorship_application_form(v_form_id,1,'Stale write',cfg); exception when sqlstate 'P0409' then rejected:=true; end;
  if not rejected then raise exception 'Stale draft save was accepted'; end if;
  f:=public.publish_mentorship_application_form(v_form_id,2);
  if f->>'published_revision'<>'1' or f->>'published_draft_version'<>'2' or f->>'is_open'<>'true' then raise exception 'First publish failed'; end if;
  cfg2:=jsonb_set(cfg,'{questions,0,title}','"Your name?"'::jsonb);
  cfg2:=jsonb_set(cfg2,'{questions}',(cfg2->'questions')||jsonb_build_array(jsonb_build_object('key','q_123e4567-e89b-42d3-a456-426614174000','title','Optional contact email','description','','placeholder','','section','About you','type','email','required',false,'maxLength',254)));
  f:=public.save_mentorship_application_form(v_form_id,2,'Editor QA',cfg2);
  if f->>'draft_version'<>'3' or f->>'published_draft_version'<>'2' then raise exception 'Second draft version did not increment or changed published version'; end if;
  if not exists(select 1 from public.mentorship_application_forms where id=v_form_id and draft_config#>>'{questions,0,title}'='Your name?') then raise exception 'Admin cannot read form draft'; end if;
  if has_table_privilege('authenticated','public.mentorship_application_form_revisions','select') then raise exception 'Browser can read published snapshots'; end if;
  if has_function_privilege('anon','public.create_mentorship_application_form(text,text,uuid,jsonb)','execute') or has_table_privilege('anon','public.mentorship_application_forms','select') then raise exception 'Anonymous form access exposed'; end if;
end $admin$;
reset role;

-- Public reads return the published revision only, never a newer draft.
select set_config('request.jwt.claims','{"role":"service_role"}',true);
do $public_read$
declare v_form_id text:=current_setting('qa.form_id'); value jsonb;
begin
  value:=public.get_public_mentorship_application_form((select slug from public.mentorship_application_forms where id=v_form_id));
  if value->>'revision'<>'1' or value#>>'{config,questions,0,title}'<>'What’s your name?' or value ? 'draft_config' then raise exception 'Public form returned draft or wrong revision'; end if;
  begin update public.mentorship_application_form_revisions set config='{}' where form_id=v_form_id and revision=1;
    raise exception 'Published snapshot was mutable';
  exception when sqlstate '55000' then null; end;
end $public_read$;

select set_config('request.jwt.claims',jsonb_build_object('sub',current_setting('qa.admin'),'role','authenticated')::text,true);
set local role authenticated;
do $republish$
declare value jsonb;
begin
  value:=public.publish_mentorship_application_form(current_setting('qa.form_id'),3);
  if value->>'published_revision'<>'2' or value->>'published_draft_version'<>'3' then raise exception 'Second publish did not snapshot current draft'; end if;
end $republish$;
reset role;

select set_config('request.jwt.claims',jsonb_build_object('sub',current_setting('qa.student'),'role','authenticated')::text,true);
set local role authenticated;
do $student$
declare amount integer; rejected boolean:=false;
begin
  select count(*) into amount from public.mentorship_application_forms where id=current_setting('qa.form_id');
  if amount<>0 then raise exception 'Student can read private draft'; end if;
  begin perform public.set_mentorship_application_form_open(current_setting('qa.form_id'),false); exception when insufficient_privilege then rejected:=true; end;
  if not rejected then raise exception 'Student can manage forms'; end if;
end $student$;
reset role;

-- Revision one remains valid after revision two; merge, evidence and replay are still safe.
select set_config('request.jwt.claims','{"role":"service_role"}',true);
do $submit$
declare
  v_form_id text:=current_setting('qa.form_id'); v_cohort_id uuid:=current_setting('qa.cohort')::uuid;
  lead_id uuid; sid uuid:='c0a80123-4567-489a-8abc-1234567890ab'; result jsonb; i integer; legacy_answers jsonb; limited boolean:=false;
  v_answers jsonb:='{"name":"Applicant","email":"form-editor-qa@example.invalid"}'; attribution jsonb:='{"utm_source":"test"}';
begin
  insert into public.mentorship_leads(cohort_id,full_name,email,stage,source,first_contact_channel,next_action,payment_status,payment_reference,payment_on)
    values(v_cohort_id,'Existing staff identity','form-editor-qa@example.invalid','approved','Original source','Direct enquiry','Staff follow-up','confirmed','qa-payment',current_date) returning id into lead_id;
  result:=public.submit_mentorship_application(v_form_id,sid,'{"music_url":null}',v_answers,attribution,repeat('1',64),repeat('2',64),1);
  if result->>'success'<>'true' then raise exception 'Old published revision rejected'; end if;
  if not exists(select 1 from public.mentorship_applications where form_id=v_form_id and response_id=sid::text and form_revision=1 and answers->0->>'question'='What’s your name?') then raise exception 'Question snapshot missing'; end if;
  if not exists(select 1 from public.mentorship_leads where id=lead_id and stage='approved' and full_name='Existing staff identity' and source='Original source' and first_contact_channel='Direct enquiry' and next_action='Staff follow-up' and payment_status='confirmed' and payment_reference='qa-payment') then raise exception 'Submission overwrote staff state'; end if;
  result:=public.submit_mentorship_application(v_form_id,gen_random_uuid(),'{}',jsonb_build_object('name','Revision two applicant','email','revision-two@example.invalid'),attribution,repeat('7',64),repeat('8',64),2);
  if result->>'success'<>'true' or not exists(select 1 from public.mentorship_applications where form_id=v_form_id and response_id=result->>'submission_id' and form_revision=2 and answers->2->>'answer'='') then raise exception 'Optional blank email answer rejected'; end if;
  result:=public.submit_mentorship_application(v_form_id,sid,'{"music_url":null}',v_answers,attribution,repeat('1',64),repeat('2',64),1);
  if result->>'success'<>'true' or (select count(*) from public.mentorship_applications where form_id=v_form_id and response_id=sid::text)<>1 then raise exception 'Submission replay was not idempotent'; end if;
  begin perform public.submit_mentorship_application(v_form_id,sid,'{"music_url":null}',jsonb_set(v_answers,'{name}','"Changed"'::jsonb),attribution,repeat('1',64),repeat('2',64),1);
    raise exception 'Conflicting replay succeeded';
  exception when sqlstate '22000' then null; end;

  -- Existing edge callers sent answer snapshots as [{key,question,answer}].
  legacy_answers:=jsonb_build_array(
    jsonb_build_object('key','name','question','What''s your name?','answer','Legacy applicant'),
    jsonb_build_object('key','email','question','What''s your email address?','answer','legacy@example.invalid'),
    jsonb_build_object('key','investment','question','The six-week mentorship is $2,497 USD. Are you ready to invest?','answer','I have questions first')
  );
  result:=public.submit_mentorship_application('cohort-2-v1',gen_random_uuid(),'{}',legacy_answers,attribution,repeat('4',64),repeat('5',64),1);
  if result->>'success'<>'true' or not exists(select 1 from public.mentorship_applications where form_id='cohort-2-v1' and response_id=result->>'submission_id' and answers->0->>'answer'='Legacy applicant') then raise exception 'Legacy answer-array caller was rejected'; end if;

  -- A rolling IP limit still blocks the twenty-first fresh application.
  for i in 1..20 loop
    result:=public.submit_mentorship_application(v_form_id,gen_random_uuid(),'{}',jsonb_build_object('name','Load test','email','rate-'||i||'@example.invalid'),attribution,repeat('6',64),lpad(to_hex(i),64,'0'),1);
    if result->>'success'<>'true' then raise exception 'Application was rejected before the IP limit'; end if;
  end loop;
  begin
    perform public.submit_mentorship_application(v_form_id,gen_random_uuid(),'{}',jsonb_build_object('name','Load test','email','rate-21@example.invalid'),attribution,repeat('6',64),lpad(to_hex(21),64,'0'),1);
  exception when sqlstate 'P0408' then limited:=true; end;
  if not limited then raise exception 'IP limit did not reject the twenty-first application'; end if;
end $submit$;

select set_config('request.jwt.claims',jsonb_build_object('sub',current_setting('qa.admin'),'role','authenticated')::text,true);
set local role authenticated;
select public.set_mentorship_application_form_open(current_setting('qa.form_id'),false);
reset role;
select set_config('request.jwt.claims','{"role":"service_role"}',true);
do $paused$
declare rejected boolean:=false;
begin
  begin perform public.get_public_mentorship_application_form((select slug from public.mentorship_application_forms where id=current_setting('qa.form_id'))); exception when sqlstate 'P0404' then rejected:=true; end;
  if not rejected then raise exception 'Paused form remained public'; end if;
end $paused$;
rollback;
select 'Application form editor tests passed: admin/student/anonymous ACL, private drafts, optimistic saves, immutable snapshots, old revisions, pause, CRM merge and idempotency. Fixtures rolled back.' as result;
