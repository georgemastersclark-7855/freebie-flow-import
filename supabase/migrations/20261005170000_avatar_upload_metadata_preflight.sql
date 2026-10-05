-- Supabase Storage first inserts an object row before it has computed/stored
-- size and content-type metadata. Allow that path-only preflight for the
-- authenticated owner; final metadata remains bucket-limited and is required
-- by the profile-save RPC before any avatar can be referenced/read as a profile.
drop policy if exists "Mentorship users upload own student avatars" on storage.objects;
create policy "Mentorship users upload own student avatars" on storage.objects
for insert to authenticated with check (
  bucket_id = 'mentorship-student-avatars'
  and public.mentorship_student_avatar_can_upload(name)
  and (
    metadata is null
    or (
      jsonb_typeof(metadata) = 'object'
      and not (metadata ? 'mimetype')
      and not (metadata ? 'size')
    )
    or public.mentorship_student_avatar_metadata_is_allowed(metadata, name)
  )
);
