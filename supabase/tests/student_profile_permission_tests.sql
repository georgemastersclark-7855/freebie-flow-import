-- Rollback-only profile/RLS regression. Run as a DB owner after the migration.
-- QA enrollments use existing auth identities in a disposable cohort. Avatar
-- rows are metadata fixtures only (no Storage API uploads or object bytes).
begin;

do $$
declare
  qa_cohort uuid;
  student_user uuid;
  staff_owner uuid;
  other_staff uuid;
  student_enrollment uuid;
  walkthrough_enrollment uuid;
begin
  select user_id into student_user
  from public.mentorship_profiles where role = 'student' order by created_at limit 1;
  select user_id into staff_owner
  from public.mentorship_profiles where role in ('coach', 'admin') order by created_at limit 1;
  select user_id into other_staff
  from public.mentorship_profiles
  where role in ('coach', 'admin') and user_id <> staff_owner
  order by created_at limit 1;
  if student_user is null or staff_owner is null or other_staff is null then
    raise exception 'Profile guard test needs an existing student and two existing staff auth identities';
  end if;

  insert into public.mentorship_cohorts (slug, internal_name, display_name, status)
  values ('profile-guard-tx-' || txid_current()::text, 'Rollback profile guard test', 'Rollback profile guard test', 'draft')
  returning id into qa_cohort;
  insert into public.mentorship_enrollments (cohort_id, user_id, status, is_walkthrough)
  values (qa_cohort, student_user, 'active', false)
  returning id into student_enrollment;
  insert into public.mentorship_enrollments (cohort_id, user_id, status, is_walkthrough)
  values (qa_cohort, staff_owner, 'active', true)
  returning id into walkthrough_enrollment;

  perform set_config('test.qa_student_user', student_user::text, true);
  perform set_config('test.qa_student_enrollment', student_enrollment::text, true);
  perform set_config('test.qa_staff_owner', staff_owner::text, true);
  perform set_config('test.qa_other_staff', other_staff::text, true);
  perform set_config('test.qa_walkthrough_enrollment', walkthrough_enrollment::text, true);
  perform set_config('test.qa_foreign_subject', gen_random_uuid()::text, true);

  -- Simulated Storage metadata only. No object bytes are uploaded; all rows roll back.
  insert into storage.objects (bucket_id, name, metadata) values
    ('mentorship-student-avatars', student_enrollment::text || '/33333333-3333-4333-8333-333333333333.webp', '{"mimetype":"image/webp","size":0}'::jsonb),
    ('mentorship-student-avatars', student_enrollment::text || '/44444444-4444-4444-8444-444444444444.webp', '{"mimetype":"image/webp","size":2097153}'::jsonb),
    ('mentorship-student-avatars', student_enrollment::text || '/55555555-5555-4555-8555-555555555555.webp', '{"size":512}'::jsonb),
    ('mentorship-student-avatars', student_enrollment::text || '/66666666-6666-4666-8666-666666666666.png', '{"mimetype":"image/gif","size":512}'::jsonb);
end;
$$;

select set_config('request.jwt.claims', jsonb_build_object('sub', current_setting('test.qa_student_user'), 'role', 'authenticated')::text, true);
select set_config('request.jwt.claim.sub', current_setting('test.qa_student_user'), true);
set local role authenticated;

do $$
declare
  student_enrollment uuid := current_setting('test.qa_student_enrollment')::uuid;
  walkthrough_enrollment uuid := current_setting('test.qa_walkthrough_enrollment')::uuid;
  old_path text := current_setting('test.qa_student_enrollment') || '/11111111-1111-4111-8111-111111111111.webp';
  new_path text := current_setting('test.qa_student_enrollment') || '/22222222-2222-4222-8222-222222222222.webp';
  foreign_path text := current_setting('test.qa_walkthrough_enrollment') || '/77777777-7777-4777-8777-777777777777.webp';
  preflight_path text := current_setting('test.qa_student_enrollment') || '/dddddddd-dddd-4ddd-8ddd-dddddddddddd.webp';
  saved public.mentorship_student_profiles;
  updated public.mentorship_student_profiles;
  error_text text;
  rejected boolean;
  affected_rows integer;
begin
  if not public.mentorship_student_avatar_can_upload(old_path)
    or not public.mentorship_student_avatar_metadata_is_allowed('{"mimetype":"image/webp","size":512}'::jsonb, old_path) then
    raise exception 'Active student avatar upload authorization rejected valid own image metadata';
  end if;
  if public.mentorship_student_avatar_can_upload(foreign_path)
    or public.mentorship_student_avatar_can_upload('../' || old_path) then
    raise exception 'Foreign or malformed enrollment avatar path was authorized';
  end if;
  if public.mentorship_student_avatar_metadata_is_allowed('{"size":512}'::jsonb, old_path)
    or public.mentorship_student_avatar_metadata_is_allowed('{"mimetype":"image/gif","size":512}'::jsonb, old_path)
    or public.mentorship_student_avatar_metadata_is_allowed('{"mimetype":"image/webp","size":0}'::jsonb, old_path)
    or public.mentorship_student_avatar_metadata_is_allowed('{"mimetype":"image/webp","size":2097153}'::jsonb, old_path) then
    raise exception 'Avatar MIME or size validator accepted invalid metadata';
  end if;

  -- Exercise Storage's actual canUpload preflight metadata shape. The gateway
  -- validates MIME/size against bucket settings before running this owner/path policy.
  insert into storage.objects (bucket_id, name, metadata)
  values ('mentorship-student-avatars', old_path, '{"mimetype":"image/webp","size":512}'::jsonb)
  returning name into error_text;
  if error_text <> old_path then raise exception 'Storage insert did not return the owner''s avatar path'; end if;

  -- Supabase Storage's permission dry-run uses mimetype/contentLength, not
  -- final mimetype/size. It must pass for the owner and later cannot satisfy
  -- the profile RPC's final-size requirement.
  insert into storage.objects (bucket_id, name, metadata)
  values ('mentorship-student-avatars', preflight_path, '{"mimetype":"image/webp","contentLength":512}'::jsonb)
  returning name into error_text;
  if error_text <> preflight_path then raise exception 'Storage preflight metadata shape did not pass the owner path policy'; end if;
  rejected := false;
  begin
    perform public.save_mentorship_student_profile(student_enrollment, 'Test Producer', null, null, null, null, preflight_path);
  exception when others then
    get stacked diagnostics error_text = message_text;
    rejected := error_text = 'The uploaded profile photo has invalid size metadata';
  end;
  if not rejected then raise exception 'Profile RPC accepted a preflight-only contentLength field as final image size'; end if;

  -- Empty and absent preflight metadata are also supported by Storage when
  -- content length is unknown, but still cannot complete a profile by themselves.
  insert into storage.objects (bucket_id, name, metadata)
  values ('mentorship-student-avatars', student_enrollment::text || '/eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee.webp', '{}'::jsonb)
  returning name into error_text;
  if error_text <> student_enrollment::text || '/eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee.webp' then
    raise exception 'Storage preflight did not accept an empty metadata object';
  end if;

  rejected := false;
  begin
    insert into storage.objects (bucket_id, name, metadata)
    values ('mentorship-student-avatars', foreign_path, '{"mimetype":"image/webp","size":512}'::jsonb);
  exception when insufficient_privilege then rejected := true;
  end;
  if not rejected then raise exception 'Storage INSERT policy accepted a foreign enrollment path'; end if;

  select * into saved from public.save_mentorship_student_profile(
    student_enrollment, '  Test Producer  ', '  Loop Artist  ', '@_underscored_',
    'https://music.example.com/track?id=1', '  Ableton Live  ', old_path
  );
  if saved.display_name <> 'Test Producer' or saved.artist_name <> 'Loop Artist'
    or saved.instagram <> '_underscored_' or saved.music_url <> 'https://music.example.com/track?id=1'
    or saved.daw <> 'Ableton Live' or saved.photo_path <> old_path or saved.completed_at is null then
    raise exception 'First profile save did not trim fields, normalize Instagram or persist profile data';
  end if;

  rejected := false;
  begin
    perform public.save_mentorship_student_profile(student_enrollment, 'Test Producer', null, null, null, null,
      student_enrollment::text || '/33333333-3333-4333-8333-333333333333.webp');
  exception when others then
    get stacked diagnostics error_text = message_text;
    rejected := error_text = 'Profile photo must be 2 MB or smaller';
  end;
  if not rejected then raise exception 'RPC accepted zero-byte avatar metadata'; end if;

  rejected := false;
  begin
    perform public.save_mentorship_student_profile(student_enrollment, 'Test Producer', null, null, null, null,
      student_enrollment::text || '/44444444-4444-4444-8444-444444444444.webp');
  exception when others then
    get stacked diagnostics error_text = message_text;
    rejected := error_text = 'Profile photo must be 2 MB or smaller';
  end;
  if not rejected then raise exception 'RPC accepted oversized avatar metadata'; end if;

  rejected := false;
  begin
    perform public.save_mentorship_student_profile(student_enrollment, 'Test Producer', null, null, null, null,
      student_enrollment::text || '/55555555-5555-4555-8555-555555555555.webp');
  exception when others then
    get stacked diagnostics error_text = message_text;
    rejected := error_text = 'The uploaded profile photo was not found or is not a supported image';
  end;
  if not rejected then raise exception 'RPC accepted a stored avatar with null MIME'; end if;

  rejected := false;
  begin
    perform public.save_mentorship_student_profile(student_enrollment, 'Test Producer', null, null, null, null,
      student_enrollment::text || '/66666666-6666-4666-8666-666666666666.png');
  exception when others then
    get stacked diagnostics error_text = message_text;
    rejected := error_text = 'The uploaded profile photo was not found or is not a supported image';
  end;
  if not rejected then raise exception 'RPC accepted unsupported image MIME metadata'; end if;

  -- Replacing the avatar keeps first completion time and only permits deletion
  -- after the old path is no longer referenced by the profile row.
  insert into storage.objects (bucket_id, name, metadata)
  values ('mentorship-student-avatars', new_path, '{"mimetype":"image/webp","size":1024}'::jsonb)
  returning name into error_text;
  select * into updated from public.save_mentorship_student_profile(
    student_enrollment, 'Test Producer Updated', null, '@_underscored_', null, null, new_path
  );
  if updated.display_name <> 'Test Producer Updated' or updated.photo_path <> new_path
    or updated.instagram <> '_underscored_' or updated.completed_at <> saved.completed_at then
    raise exception 'Profile edit failed or changed its original completion timestamp';
  end if;
  if not exists (select 1 from public.mentorship_student_profiles where enrollment_id = student_enrollment) then
    raise exception 'Owner could not read their saved profile row';
  end if;

  perform set_config('storage.allow_delete_query', 'true', true);
  delete from storage.objects where bucket_id = 'mentorship-student-avatars' and name = old_path returning name into error_text;
  if error_text <> old_path then raise exception 'Owner could not delete an unreferenced old avatar'; end if;
  delete from storage.objects where bucket_id = 'mentorship-student-avatars' and name = new_path returning name into error_text;
  get diagnostics affected_rows = row_count;
  if affected_rows <> 0 then raise exception 'Owner deleted the avatar currently referenced by their profile'; end if;

  update storage.objects set metadata = metadata
  where bucket_id = 'mentorship-student-avatars' and name = new_path;
  get diagnostics affected_rows = row_count;
  if affected_rows <> 0 then raise exception 'Storage UPDATE policy allowed overwriting an avatar'; end if;

  rejected := false;
  begin
    insert into public.mentorship_student_profiles (enrollment_id, display_name, photo_path)
    values (student_enrollment, 'Direct write', old_path);
  exception when insufficient_privilege then rejected := true;
  end;
  if not rejected then raise exception 'Direct table write bypassed the profile save RPC'; end if;

  perform set_config('test.qa_student_photo', new_path, true);
end;
$$;

reset role;
select set_config('request.jwt.claims', jsonb_build_object('sub', current_setting('test.qa_foreign_subject'), 'role', 'authenticated')::text, true);
select set_config('request.jwt.claim.sub', current_setting('test.qa_foreign_subject'), true);
set local role authenticated;
do $$
declare
  student_enrollment uuid := current_setting('test.qa_student_enrollment')::uuid;
  photo_path text := current_setting('test.qa_student_photo');
begin
  if exists (select 1 from public.mentorship_student_profiles where enrollment_id = student_enrollment) then
    raise exception 'Unrelated authenticated subject could select a foreign profile';
  end if;
  if exists (select 1 from storage.objects where bucket_id = 'mentorship-student-avatars' and name = photo_path)
    or public.mentorship_student_avatar_can_read(photo_path) then
    raise exception 'Unrelated authenticated subject could read a foreign avatar';
  end if;
end;
$$;

reset role;
select set_config('request.jwt.claims', jsonb_build_object('sub', current_setting('test.qa_staff_owner'), 'role', 'authenticated')::text, true);
select set_config('request.jwt.claim.sub', current_setting('test.qa_staff_owner'), true);
set local role authenticated;
do $$
declare
  student_enrollment uuid := current_setting('test.qa_student_enrollment')::uuid;
  walkthrough_enrollment uuid := current_setting('test.qa_walkthrough_enrollment')::uuid;
  student_photo text := current_setting('test.qa_student_photo');
  walkthrough_photo text := walkthrough_enrollment::text || '/cccccccc-cccc-4ccc-8ccc-cccccccccccc.webp';
  saved public.mentorship_student_profiles;
begin
  if not exists (select 1 from public.mentorship_student_profiles where enrollment_id = student_enrollment)
    or not public.mentorship_student_avatar_can_read(student_photo) then
    raise exception 'Staff could not read a regular student account profile/photo';
  end if;
  if not public.mentorship_student_avatar_can_upload(walkthrough_photo) then
    raise exception 'Staff owner could not upload to their active walkthrough enrollment';
  end if;
  insert into storage.objects (bucket_id, name, metadata)
  values ('mentorship-student-avatars', walkthrough_photo, '{"mimetype":"image/webp","size":512}'::jsonb);
  select * into saved from public.save_mentorship_student_profile(
    walkthrough_enrollment, 'Test Student', null, null, null, null, walkthrough_photo
  );
  if saved.display_name <> 'Test Student' or not exists (
    select 1 from public.mentorship_student_profiles where enrollment_id = walkthrough_enrollment
  ) then raise exception 'Staff walkthrough profile was not isolated to its test enrollment'; end if;
  perform set_config('test.qa_walkthrough_photo', walkthrough_photo, true);
end;
$$;

reset role;
select set_config('request.jwt.claims', jsonb_build_object('sub', current_setting('test.qa_other_staff'), 'role', 'authenticated')::text, true);
select set_config('request.jwt.claim.sub', current_setting('test.qa_other_staff'), true);
set local role authenticated;
do $$
declare
  walkthrough_enrollment uuid := current_setting('test.qa_walkthrough_enrollment')::uuid;
  walkthrough_photo text := current_setting('test.qa_walkthrough_photo');
  student_enrollment uuid := current_setting('test.qa_student_enrollment')::uuid;
  student_photo text := current_setting('test.qa_student_photo');
begin
  if exists (select 1 from public.mentorship_student_profiles where enrollment_id = walkthrough_enrollment)
    or exists (select 1 from storage.objects where bucket_id = 'mentorship-student-avatars' and name = walkthrough_photo)
    or public.mentorship_student_avatar_can_read(walkthrough_photo) then
    raise exception 'Other staff could read another staff account walkthrough profile/avatar';
  end if;
  if not exists (select 1 from public.mentorship_student_profiles where enrollment_id = student_enrollment)
    or not public.mentorship_student_avatar_can_read(student_photo) then
    raise exception 'Staff could not read a normal student profile/avatar';
  end if;
end;
$$;

reset role;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
set local role anon;
do $$
declare rejected boolean := false;
begin
  begin
    perform public.mentorship_student_avatar_can_upload('bad/path.webp');
  exception when insufficient_privilege then rejected := true;
  end;
  if not rejected then raise exception 'Anonymous avatar authorization helper was executable'; end if;
end;
$$;

rollback;
select 'positive student-profile and rollback-only permission tests passed; all QA records/files rolled back' as result;
