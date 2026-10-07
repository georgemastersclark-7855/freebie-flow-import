begin;
do $$ declare c uuid; u uuid; a uuid; b uuid; e uuid; l uuid; begin
 select user_id into u from public.mentorship_profiles where role='student' limit 1;
 select user_id into a from public.mentorship_profiles where role='admin' limit 1;
 select user_id into b from public.mentorship_profiles where role='coach' limit 1;
 if u is null or a is null or b is null then raise exception 'Need student/admin/coach fixtures'; end if;
 insert into public.mentorship_cohorts(slug,internal_name,display_name) values('crm-qa-'||txid_current(),'CRM QA','CRM QA') returning id into c;
 -- Prove exact identity auto-links when an enrolment arrives after the lead.
 insert into public.mentorship_leads(cohort_id,full_name,email,goals) select c,'QA student',email,'Application goal retained' from public.mentorship_profiles where user_id=u returning id into l;
 insert into public.mentorship_enrollments(cohort_id,user_id) values(c,u) returning id into e;
 if not exists(select 1 from public.mentorship_leads where id=l and enrollment_id=e and goals='Application goal retained') then raise exception 'Enrollment handover failed'; end if;
 perform set_config('qa.cohort',c::text,true);perform set_config('qa.student',u::text,true);perform set_config('qa.staff',a::text,true);perform set_config('qa.coach',b::text,true);perform set_config('qa.enrollment',e::text,true);perform set_config('qa.linkedlead',l::text,true);
end $$;
select set_config('request.jwt.claim.sub',current_setting('qa.staff'),true);
select set_config('request.jwt.claims',jsonb_build_object('sub',current_setting('qa.staff'),'role','authenticated')::text,true);
set local role authenticated;
do $$ declare c uuid:=current_setting('qa.cohort')::uuid; e uuid:=current_setting('qa.enrollment')::uuid; l uuid; rejected boolean; n integer; stamp timestamptz; begin
 insert into public.mentorship_leads(cohort_id,full_name,email,stage,source,owner_id,next_action,due_on) values(c,'CRM QA','  CRM-QA@EXAMPLE.COM ','waitlist','Email reply',current_setting('qa.coach')::uuid,'Share offer',current_date) returning id,updated_at into l,stamp;
 if not exists(select 1 from public.mentorship_leads where id=l and email='crm-qa@example.com') then raise exception 'Email normalisation failed';end if;
 perform set_config('qa.lead',l::text,true);
 update public.mentorship_leads set stage='offer_sent' where id=l and updated_at=stamp;
 update public.mentorship_leads set stage='closed' where id=l and updated_at=stamp;
 get diagnostics n=row_count;if n<>0 then raise exception 'Stale update accepted';end if;
 if not exists(select 1 from public.mentorship_lead_activity where lead_id=l and kind='updated') then raise exception 'Stage history missing';end if;
 insert into public.mentorship_lead_activity(lead_id,kind,body) values(l,'note','QA note');
 rejected:=false;begin insert into public.mentorship_leads(cohort_id,full_name,email) values(c,'Duplicate','CRM-QA@example.com');exception when unique_violation then rejected:=true;end;if not rejected then raise exception 'Duplicate accepted';end if;
 rejected:=false;begin update public.mentorship_leads set payment_status='confirmed' where id=l;exception when check_violation then rejected:=true;end;if not rejected then raise exception 'Payment accepted without reference';end if;
 rejected:=false;begin update public.mentorship_leads set enrollment_id=e where id=l;exception when raise_exception then rejected:=true;end;if not rejected then raise exception 'Wrong student link accepted';end if;
 rejected:=false;begin update public.mentorship_leads set owner_id=current_setting('qa.student')::uuid where id=l;exception when raise_exception then rejected:=true;end;if not rejected then raise exception 'Student owner accepted';end if;
 rejected:=false;begin update public.mentorship_leads set music_url='https://user:pass@example.com' where id=l;exception when raise_exception then rejected:=true;end;if not rejected then raise exception 'Credential URL accepted';end if;
 insert into public.mentorship_onboarding_calls(enrollment_id,booked_at,owner_id) values(e,now()+interval '1 day',current_setting('qa.coach')::uuid);
 update public.mentorship_onboarding_calls set completed_at=now() where enrollment_id=e;
 insert into public.mentorship_admissions_settings(cohort_id,capacity) values(c,10);
end $$;
reset role;
select set_config('request.jwt.claim.sub',current_setting('qa.student'),true);
select set_config('request.jwt.claims',jsonb_build_object('sub',current_setting('qa.student'),'role','authenticated')::text,true);
set local role authenticated;
do $$ declare tab text; n integer; rejected boolean;begin
 foreach tab in array array['mentorship_leads','mentorship_lead_activity','mentorship_onboarding_calls','mentorship_admissions_settings'] loop
 execute format('select count(*) from public.%I',tab) into n;if n<>0 then raise exception 'Student can read %',tab;end if;
 end loop;
 rejected:=false;begin insert into public.mentorship_leads(cohort_id,full_name,email) values(current_setting('qa.cohort')::uuid,'Injected','inject@example.com');exception when insufficient_privilege then rejected:=true;end;if not rejected then raise exception 'Student can insert lead';end if;
 update public.mentorship_leads set stage='closed' where id=current_setting('qa.lead')::uuid;get diagnostics n=row_count;if n<>0 then raise exception 'Student can update lead';end if;
 rejected:=false;begin insert into public.mentorship_lead_activity(lead_id,kind,body) values(current_setting('qa.lead')::uuid,'note','Injected');exception when insufficient_privilege then rejected:=true;end;if not rejected then raise exception 'Student can write notes';end if;
 rejected:=false;begin insert into public.mentorship_onboarding_calls(enrollment_id) values(current_setting('qa.enrollment')::uuid);exception when insufficient_privilege then rejected:=true;end;if not rejected then raise exception 'Student can update onboarding';end if;
end $$;
reset role;
select set_config('request.jwt.claim.sub',current_setting('qa.coach'),true);
select set_config('request.jwt.claims',jsonb_build_object('sub',current_setting('qa.coach'),'role','authenticated')::text,true);
set local role authenticated;
do $$ begin if not exists(select 1 from public.mentorship_leads where id=current_setting('qa.lead')::uuid) then raise exception 'Coach cannot see CRM';end if;end $$;
reset role;
set local role anon;
do $$ declare rejected boolean:=false;begin begin perform 1 from public.mentorship_leads;exception when insufficient_privilege then rejected:=true;end;if not rejected then raise exception 'Anonymous access';end if;end $$;
reset role;
rollback;
select 'CRM privacy, stage history, duplicate protection, concurrency, payment evidence, and enrollment handover passed. All fixtures rolled back.' as result;
