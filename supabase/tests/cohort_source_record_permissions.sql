begin;
do $$ declare a uuid; c uuid; s uuid; begin
  select user_id into a from public.mentorship_profiles where role='admin' limit 1;
  select user_id into c from public.mentorship_profiles where role='coach' limit 1;
  select user_id into s from public.mentorship_profiles where role='student' limit 1;
  if a is null or c is null or s is null then raise exception 'Existing staff and student accounts required'; end if;
  perform set_config('qa.admin',a::text,true);
  perform set_config('qa.coach',c::text,true);
  perform set_config('qa.student',s::text,true);
end $$;
select set_config('request.jwt.claim.sub',current_setting('qa.student'),true);
select set_config('request.jwt.claims',jsonb_build_object('sub',current_setting('qa.student'),'role','authenticated')::text,true);
set local role authenticated;
do $$ begin
  if exists(select 1 from public.mentorship_cohort_records) then raise exception 'Student can read staff records'; end if;
end $$;
reset role;
select set_config('request.jwt.claim.sub',current_setting('qa.admin'),true);
select set_config('request.jwt.claims',jsonb_build_object('sub',current_setting('qa.admin'),'role','authenticated')::text,true);
set local role authenticated;
do $$ declare rejected boolean := false; begin
  if not exists(select 1 from public.mentorship_cohort_records where id='cohort-1' and student_count=3) then raise exception 'Admin cannot read cohort records'; end if;
  begin update public.mentorship_cohort_records set name='Changed' where id='cohort-1'; exception when insufficient_privilege then rejected:=true; end;
  if not rejected then raise exception 'Source records can be overwritten by browser client'; end if;
end $$;
reset role;
select set_config('request.jwt.claim.sub',current_setting('qa.coach'),true);
select set_config('request.jwt.claims',jsonb_build_object('sub',current_setting('qa.coach'),'role','authenticated')::text,true);
set local role authenticated;
do $$ begin
  if not exists(select 1 from public.mentorship_cohort_records where id='cohort-1') then raise exception 'Coach cannot read cohort records'; end if;
end $$;
reset role;
set local role anon;
do $$ declare rejected boolean := false; begin
  begin perform 1 from public.mentorship_cohort_records; exception when insufficient_privilege then rejected:=true; end;
  if not rejected then raise exception 'Anonymous access is allowed'; end if;
end $$;
reset role;
rollback;
select 'Cohort source record permissions passed; no data changed' as result;
