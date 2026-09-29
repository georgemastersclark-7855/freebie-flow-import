begin;
alter table public.mentorship_enrollments add column if not exists is_walkthrough boolean not null default false;

-- Staff use their own enrolment, so normal ownership and private storage rules
-- apply without impersonating a student or sharing login credentials.
create or replace function public.open_mentorship_walkthrough()
returns uuid language plpgsql security definer set search_path = public as $$
declare cohort_id_value uuid; enrollment_id_value uuid;
begin
  if not public.is_mentorship_staff() then raise exception 'Staff access required'; end if;
  perform pg_advisory_xact_lock(hashtext(auth.uid()::text));
  select id into cohort_id_value from public.mentorship_cohorts
    where status in ('active','draft')
    order by case when status='active' then 0 else 1 end, starts_at desc nulls last limit 1;
  if cohort_id_value is null then raise exception 'No mentorship cohort is available'; end if;
  select id into enrollment_id_value from public.mentorship_enrollments
    where user_id=auth.uid() and cohort_id=cohort_id_value and is_walkthrough;
  if enrollment_id_value is null then
    insert into public.mentorship_enrollments (user_id,cohort_id,is_walkthrough)
      values (auth.uid(),cohort_id_value,true) returning id into enrollment_id_value;
  else
    update public.mentorship_enrollments set status='active' where id=enrollment_id_value;
  end if;
  return enrollment_id_value;
end $$;
revoke all on function public.open_mentorship_walkthrough() from public, anon;
grant execute on function public.open_mentorship_walkthrough() to authenticated;

-- Test feedback uses real feedback rows and private audio. It deliberately
-- creates no outbound email event. Normal student publishing is unchanged.
create or replace function public.publish_mentorship_walkthrough_feedback(
  target_submission_id uuid, notes text, action_text text,
  audio_path text default null, audio_name text default null, video_link text default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare target public.mentorship_submissions; v_owner_id uuid; feedback_id_value uuid;
begin
  if not public.is_mentorship_staff() then raise exception 'Staff access required'; end if;
  select s.* into target from public.mentorship_submissions s
    join public.mentorship_enrollments e on e.id=s.enrollment_id
    where s.id=target_submission_id and e.is_walkthrough and e.status='active'
    for update of s;
  if target.id is null then raise exception 'Test submission not found'; end if;
  if target.state not in ('submitted','late') then raise exception 'Submit the music before publishing feedback'; end if;
  if nullif(trim(action_text),'') is null or (
    nullif(trim(notes),'') is null and nullif(audio_path,'') is null and nullif(video_link,'') is null
  ) then raise exception 'Feedback and a next action are required'; end if;
  select user_id into v_owner_id from public.mentorship_enrollments where id=target.enrollment_id;
  if audio_path is not null and not exists (
    select 1 from storage.objects where bucket_id='mentorship-feedback'
      and name=audio_path and (storage.foldername(name))[1]=v_owner_id::text
  ) then raise exception 'Feedback audio not found'; end if;
  if video_link is not null and video_link !~ '^https://' then raise exception 'Use an HTTPS video link'; end if;
  insert into public.mentorship_feedback (
    submission_id,author_id,status,written_notes,next_action,audio_storage_path,
    audio_file_name,video_url,published_at,viewed_at,student_next_action,action_confirmed_at
  ) values (
    target.id,auth.uid(),'published',trim(coalesce(notes,'')),trim(action_text),audio_path,
    audio_name,video_link,now(),null,null,null
  ) on conflict (submission_id) do update set
    author_id=excluded.author_id,status=excluded.status,written_notes=excluded.written_notes,
    next_action=excluded.next_action,audio_storage_path=excluded.audio_storage_path,
    audio_file_name=excluded.audio_file_name,video_url=excluded.video_url,published_at=excluded.published_at,
    viewed_at=null,student_next_action=null,action_confirmed_at=null
  returning id into feedback_id_value;
  return jsonb_build_object('feedback_id',feedback_id_value,'notification_queued',false,'notification_skipped',true);
end $$;
revoke all on function public.publish_mentorship_walkthrough_feedback(uuid,text,text,text,text,text) from public, anon;
grant execute on function public.publish_mentorship_walkthrough_feedback(uuid,text,text,text,text,text) to authenticated;

create or replace function public.reset_mentorship_walkthrough(target_enrollment_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_mentorship_staff() or not exists (
    select 1 from public.mentorship_enrollments
    where id=target_enrollment_id and user_id=auth.uid() and is_walkthrough
  ) then raise exception 'Your staff test enrolment is required'; end if;
  -- Object deletion is performed through the Storage API first.
  if exists (
    select 1 from storage.objects o join public.mentorship_submission_files f on o.name=f.storage_path
    join public.mentorship_submissions s on s.id=f.submission_id
    where s.enrollment_id=target_enrollment_id and o.bucket_id='mentorship-submissions'
  ) or exists (
    select 1 from storage.objects o join public.mentorship_feedback f on o.name=f.audio_storage_path
    join public.mentorship_submissions s on s.id=f.submission_id
    where s.enrollment_id=target_enrollment_id and o.bucket_id='mentorship-feedback'
  ) then raise exception 'Remove the test files from storage before resetting'; end if;
  delete from public.mentorship_surgeries where submission_id in (select id from public.mentorship_submissions where enrollment_id=target_enrollment_id);
  delete from public.mentorship_feedback where submission_id in (select id from public.mentorship_submissions where enrollment_id=target_enrollment_id);
  delete from public.mentorship_submission_files where submission_id in (select id from public.mentorship_submissions where enrollment_id=target_enrollment_id);
  update public.mentorship_submissions set state='not_started',submitted_at=null where enrollment_id=target_enrollment_id;
end $$;
revoke all on function public.reset_mentorship_walkthrough(uuid) from public, anon;
grant execute on function public.reset_mentorship_walkthrough(uuid) to authenticated;
commit;
