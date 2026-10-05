-- Storage's canUpload permission check inserts a temporary object row with
-- metadata {mimetype, contentLength}; contentLength may be undefined and this
-- is not the final stored metadata. Its request handler validates the bucket's
-- allowed MIME types and size before running the check. Keep RLS scoped to the
-- private bucket and active owner's UUID path; the profile RPC separately
-- validates final stored mimetype + size before referencing the object.
drop policy if exists "Mentorship users upload own student avatars" on storage.objects;
create policy "Mentorship users upload own student avatars" on storage.objects
for insert to authenticated with check (
  bucket_id = 'mentorship-student-avatars'
  and public.mentorship_student_avatar_can_upload(name)
);
