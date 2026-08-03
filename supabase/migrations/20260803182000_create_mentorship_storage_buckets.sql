-- Private storage used by the mentorship portal. Keep the limits aligned with
-- the resumable student upload flow and Rob's feedback upload flow.
insert into storage.buckets (id, name, public, file_size_limit)
values
  ('mentorship-submissions', 'mentorship-submissions', false, 2147483648),
  ('mentorship-feedback', 'mentorship-feedback', false, 536870912)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit;
