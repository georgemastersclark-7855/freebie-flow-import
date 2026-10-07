-- Run after the migration inside the same transaction, or standalone against an
-- installed migration. Every fixture is rolled back, including file metadata.
begin;
do $$
declare c uuid; c2 uuid; e uuid; own_e uuid; other_e uuid; u uuid; a uuid; b uuid; w uuid; s uuid; other_s uuid; f1 uuid; f2 uuid; foreign_f uuid; foreign_c uuid;
begin
  select user_id into u from public.mentorship_profiles where role='student' limit 1;
  select user_id into a from public.mentorship_profiles where role='admin' limit 1;
  select user_id into b from public.mentorship_profiles where role='coach' limit 1;
  if u is null or a is null or b is null then raise exception 'Test requires existing student, admin and coach identities'; end if;
  insert into public.mentorship_cohorts(slug,internal_name,display_name) values ('success-qa-'||txid_current(),'QA','QA') returning id into c;
  insert into public.mentorship_cohorts(slug,internal_name,display_name) values ('success-other-qa-'||txid_current(),'QA other','QA other') returning id into c2;
  insert into public.mentorship_enrollments(cohort_id,user_id) values(c,u) returning id into e;
  insert into public.mentorship_enrollments(cohort_id,user_id,is_walkthrough) values(c,a,true) returning id into own_e;
  insert into public.mentorship_enrollments(cohort_id,user_id,is_walkthrough) values(c,b,true) returning id into other_e;
  insert into public.mentorship_weeks(cohort_id,week_number,title,short_title) values(c,1,'Week 1','Week 1') returning id into w;
  insert into public.mentorship_submissions(enrollment_id,week_id) values(e,w) on conflict (enrollment_id,week_id) do update set state=excluded.state returning id into s;
  insert into public.mentorship_submissions(enrollment_id,week_id) values(other_e,w) on conflict (enrollment_id,week_id) do update set state=excluded.state returning id into other_s;
  insert into public.mentorship_submission_files(submission_id,uploader_id,kind,storage_path,file_name) values(s,u,'idea','qa/'||gen_random_uuid(),'Before.wav') returning id into f1;
  insert into public.mentorship_submission_files(submission_id,uploader_id,kind,storage_path,file_name) values(s,u,'song','qa/'||gen_random_uuid(),'After.wav') returning id into f2;
  insert into public.mentorship_submission_files(submission_id,uploader_id,kind,storage_path,file_name) values(other_s,b,'song','qa/'||gen_random_uuid(),'Other.wav') returning id into foreign_f;
  insert into public.mentorship_calls(cohort_id,title,starts_at) values(c2,'Other call',now()) returning id into foreign_c;
  perform set_config('qa.student',u::text,true); perform set_config('qa.staff',a::text,true); perform set_config('qa.coach',b::text,true);
  perform set_config('qa.enrollment',e::text,true); perform set_config('qa.own',own_e::text,true); perform set_config('qa.other',other_e::text,true);
  perform set_config('qa.before',f1::text,true); perform set_config('qa.after',f2::text,true); perform set_config('qa.foreign_file',foreign_f::text,true); perform set_config('qa.foreign_call',foreign_c::text,true);
end $$;
select set_config('request.jwt.claim.sub',current_setting('qa.staff'),true);
select set_config('request.jwt.claims',jsonb_build_object('sub',current_setting('qa.staff'),'role','authenticated')::text,true);
set local role authenticated;
do $$
declare e uuid:=current_setting('qa.enrollment')::uuid; n uuid; a uuid; rejected boolean;
begin
  insert into public.mentorship_student_context(enrollment_id,goals,current_focus) values(e,'Finish a release','Arrangement');
  update public.mentorship_student_context set current_focus='Chorus' where enrollment_id=e;
  insert into public.mentorship_staff_notes(enrollment_id,kind,title,body,transcript) values(e,'onboarding','Onboarding','Needs shorter intros','Student: I get stuck on arrangements') returning id into n;
  update public.mentorship_staff_notes set body='Updated private note' where id=n;
  insert into public.mentorship_student_actions(enrollment_id,title,owner_id) values(e,'Check week 2',current_setting('qa.coach')::uuid) returning id into a;
  update public.mentorship_student_actions set completed_at=now() where id=a;
  if not exists(select 1 from public.mentorship_student_actions where id=a and completed_at is not null) then raise exception 'Staff action save failed'; end if;
  insert into public.mentorship_progress_examples(enrollment_id,title,before_file_id,after_file_id) values(e,'Arrangement progress',current_setting('qa.before')::uuid,current_setting('qa.after')::uuid);
  insert into public.mentorship_student_context(enrollment_id,goals) values(current_setting('qa.own')::uuid,'Walkthrough notes');
  rejected:=false;
  begin insert into public.mentorship_student_context(enrollment_id) values(current_setting('qa.other')::uuid); exception when insufficient_privilege then rejected:=true; end;
  if not rejected then raise exception 'Other staff walkthrough was writable'; end if;
  rejected:=false;
  begin insert into public.mentorship_progress_examples(enrollment_id,title,before_file_id,after_file_id) values(e,'Bad comparison',current_setting('qa.before')::uuid,current_setting('qa.foreign_file')::uuid); exception when raise_exception then rejected:=true; end;
  if not rejected then raise exception 'Cross-student comparison was accepted'; end if;
  rejected:=false;
  begin insert into public.mentorship_staff_notes(enrollment_id,kind,title,call_id) values(e,'group','Wrong call',current_setting('qa.foreign_call')::uuid); exception when raise_exception then rejected:=true; end;
  if not rejected then raise exception 'Cross-cohort call attribution was accepted'; end if;
  rejected:=false;
  begin insert into public.mentorship_student_actions(enrollment_id,title,owner_id) values(e,'Bad owner',current_setting('qa.student')::uuid); exception when raise_exception then rejected:=true; end;
  if not rejected then raise exception 'Student accepted as internal follow-up owner'; end if;
end $$;
reset role;
select set_config('request.jwt.claim.sub',current_setting('qa.student'),true);
select set_config('request.jwt.claims',jsonb_build_object('sub',current_setting('qa.student'),'role','authenticated')::text,true);
set local role authenticated;
do $$
declare tab text; n integer; rejected boolean; e uuid:=current_setting('qa.enrollment')::uuid;
begin
  foreach tab in array array['mentorship_student_context','mentorship_staff_notes','mentorship_student_actions','mentorship_progress_examples'] loop
    execute format('select count(*) from public.%I',tab) into n;
    if n <> 0 then raise exception 'Student could read private table %',tab; end if;
    execute format('delete from public.%I where enrollment_id=$1',tab) using e;
    get diagnostics n = row_count;
    if n <> 0 then raise exception 'Student could delete private records'; end if;
  end loop;
  rejected:=false;
  begin insert into public.mentorship_staff_notes(enrollment_id,kind,title) values(e,'note','Injected'); exception when insufficient_privilege then rejected:=true; end;
  if not rejected then raise exception 'Student could insert staff notes'; end if;
  update public.mentorship_student_context set goals='Injected' where enrollment_id=e;
  get diagnostics n = row_count;
  if n <> 0 then raise exception 'Student could update private records'; end if;
end $$;
reset role;
select set_config('request.jwt.claim.sub',current_setting('qa.coach'),true);
select set_config('request.jwt.claims',jsonb_build_object('sub',current_setting('qa.coach'),'role','authenticated')::text,true);
set local role authenticated;
do $$ begin
  if not exists(select 1 from public.mentorship_staff_notes where enrollment_id=current_setting('qa.enrollment')::uuid) then raise exception 'Coach cannot read student notes'; end if;
  if exists(select 1 from public.mentorship_student_context where enrollment_id=current_setting('qa.own')::uuid) then raise exception 'Coach can read another staff walkthrough'; end if;
end $$;
reset role;
set local role anon;
do $$ declare rejected boolean:=false; begin
  begin perform 1 from public.mentorship_staff_notes; exception when insufficient_privilege then rejected:=true; end;
  if not rejected then raise exception 'Anonymous table access was permitted'; end if;
end $$;
reset role;
rollback;
select 'Student-success permission and relationship tests passed; all fixtures rolled back' as result;
