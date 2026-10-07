begin;
do $$
declare a uuid; e uuid; c uuid; u uuid;
begin
  select user_id into a from public.mentorship_profiles where role='admin' limit 1;
  select user_id into u from public.mentorship_profiles where role='student' limit 1;
  insert into public.mentorship_cohorts(slug,internal_name,display_name) values('onboarding-qa-'||txid_current(),'QA','QA') returning id into c;
  insert into public.mentorship_enrollments(cohort_id,user_id) values(c,u) returning id into e;
  perform set_config('qa.enrollment',e::text,true); perform set_config('qa.staff',a::text,true); perform set_config('qa.student',u::text,true);
end $$;
select set_config('request.jwt.claim.sub',current_setting('qa.staff'),true);
select set_config('request.jwt.claims',jsonb_build_object('sub',current_setting('qa.staff'),'role','authenticated')::text,true);
set local role authenticated;
do $$
declare e uuid:=current_setting('qa.enrollment')::uuid; n uuid; rejected boolean:=false; changed integer;
begin
  insert into public.mentorship_staff_notes(enrollment_id,kind,title,body,questionnaire)
    values(e,'onboarding','QA onboarding','Private plan','{"template":"onboarding-v1","status":"draft","answers":{"goal":"Private goal"}}') returning id into n;
  if not exists(select 1 from public.mentorship_staff_notes where id=n and questionnaire->'answers'->>'goal'='Private goal') then raise exception 'Questionnaire did not round trip'; end if;
  begin
    insert into public.mentorship_staff_notes(enrollment_id,kind,title,questionnaire)
      values(e,'onboarding','Duplicate','{"template":"onboarding-v1","status":"draft","answers":{}}');
  exception when unique_violation then rejected:=true; end;
  if not rejected then raise exception 'Duplicate onboarding questionnaire accepted'; end if;
  rejected:=false;
  begin update public.mentorship_staff_notes set kind='group' where id=n;
  exception when check_violation then rejected:=true; end;
  if not rejected then raise exception 'Questionnaire moved to unrelated note type'; end if;
  update public.mentorship_staff_notes set body='Stale update' where id=n and updated_at='2000-01-01';
  get diagnostics changed=row_count;
  if changed <> 0 then raise exception 'Stale update changed note'; end if;
end $$;
reset role;
select set_config('request.jwt.claim.sub',current_setting('qa.student'),true);
select set_config('request.jwt.claims',jsonb_build_object('sub',current_setting('qa.student'),'role','authenticated')::text,true);
set local role authenticated;
do $$ declare rejected boolean:=false; begin
  if exists(select 1 from public.mentorship_staff_notes where enrollment_id=current_setting('qa.enrollment')::uuid) then raise exception 'Student can read coaching questionnaire'; end if;
  begin insert into public.mentorship_staff_notes(enrollment_id,kind,title,questionnaire)
    values(current_setting('qa.enrollment')::uuid,'onboarding','Injected','{"template":"onboarding-v1","status":"draft","answers":{}}');
  exception when insufficient_privilege then rejected:=true; end;
  if not rejected then raise exception 'Student can write coaching questionnaire'; end if;
end $$;
reset role;
rollback;
select 'Onboarding questionnaire persistence, duplicate protection, concurrency and privacy passed; fixtures rolled back' as result;
