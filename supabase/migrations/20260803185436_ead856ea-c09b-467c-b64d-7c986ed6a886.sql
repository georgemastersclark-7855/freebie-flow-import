alter table public.mentorship_resources
add column if not exists storage_path text;

update public.mentorship_resources
set duration_label = case resource_key
  when 'sound-library' then '7:34'
  when 'session-template' then '6:48'
  when 'reference-playlist' then '4:21'
  else duration_label
end
where resource_key in ('sound-library', 'session-template', 'reference-playlist');

drop policy if exists "Mentorship members watch programme videos" on storage.objects;
create policy "Mentorship members watch programme videos" on storage.objects
for select to authenticated using (
  bucket_id = 'mentorship-videos'
  and (
    public.is_mentorship_staff()
    or exists (
      select 1
      from public.mentorship_cohorts cohort
      where cohort.id::text = (storage.foldername(name))[1]
        and public.is_mentorship_member(cohort.id)
    )
  )
);

drop policy if exists "Mentorship staff upload programme videos" on storage.objects;
create policy "Mentorship staff upload programme videos" on storage.objects
for insert to authenticated with check (
  bucket_id = 'mentorship-videos' and public.is_mentorship_staff()
);

drop policy if exists "Mentorship staff update programme videos" on storage.objects;
create policy "Mentorship staff update programme videos" on storage.objects
for update to authenticated
using (bucket_id = 'mentorship-videos' and public.is_mentorship_staff())
with check (bucket_id = 'mentorship-videos' and public.is_mentorship_staff());

drop policy if exists "Mentorship staff remove programme videos" on storage.objects;
create policy "Mentorship staff remove programme videos" on storage.objects
for delete to authenticated using (
  bucket_id = 'mentorship-videos' and public.is_mentorship_staff()
);