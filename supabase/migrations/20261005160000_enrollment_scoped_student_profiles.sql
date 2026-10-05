-- Store student-facing account setup separately from auth/staff identity and
-- scope it to an enrollment (including a staff-owned walkthrough enrollment).
create table public.mentorship_student_profiles (
  enrollment_id uuid primary key references public.mentorship_enrollments(id) on delete cascade,
  display_name text not null check (display_name = btrim(display_name) and length(display_name) between 1 and 80),
  photo_path text not null check (photo_path ~ ('^' || enrollment_id::text || '/[0-9a-fA-F-]{36}[.](jpg|jpeg|png|webp)$')),
  artist_name text check (artist_name is null or (artist_name = btrim(artist_name) and length(artist_name) <= 80)),
  instagram text check (instagram is null or (
    instagram = lower(btrim(instagram))
    and length(instagram) between 1 and 30
    and instagram ~ '^[a-z0-9._]{1,30}$'
  )),
  music_url text check (music_url is null or (
    length(music_url) <= 2048
    and music_url ~ '^https://[^/?#[:space:]]+(/[^[:space:]?#]*)?([?][^[:space:]#]*)?([#][^[:space:]]*)?$'
    and split_part(split_part(music_url, '/', 3), '?', 1) !~ '[@%]'
  )),
  daw text check (daw is null or (daw = btrim(daw) and length(daw) <= 80)),
  completed_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.mentorship_student_profiles is
  'Student-facing display profile, isolated by active mentorship enrollment; does not change mentorship_profiles staff identity.';

alter table public.mentorship_student_profiles enable row level security;
revoke all on public.mentorship_student_profiles from public, anon, authenticated;
grant select on public.mentorship_student_profiles to authenticated;
grant all on public.mentorship_student_profiles to service_role;

create policy "Mentorship users view own enrollment profile" on public.mentorship_student_profiles
for select to authenticated using (
  public.owns_mentorship_enrollment(enrollment_id)
  or (
    public.is_mentorship_staff()
    and exists (
      select 1 from public.mentorship_enrollments enrollment
      where enrollment.id = mentorship_student_profiles.enrollment_id and not enrollment.is_walkthrough
    )
  )
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'mentorship-student-avatars',
  'mentorship-student-avatars',
  false,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update set
  name = excluded.name,
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create or replace function public.mentorship_student_avatar_can_upload(object_name text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if auth.uid() is null
    or object_name !~ '^[0-9a-fA-F-]{36}/[0-9a-fA-F-]{36}[.](jpg|jpeg|png|webp)$' then
    return false;
  end if;
  return exists (
    select 1 from public.mentorship_enrollments enrollment
    where enrollment.id::text = split_part(object_name, '/', 1)
      and enrollment.user_id = auth.uid()
      and enrollment.status = 'active'
  );
end;
$$;
revoke all on function public.mentorship_student_avatar_can_upload(text) from public, anon;
grant execute on function public.mentorship_student_avatar_can_upload(text) to authenticated;

create or replace function public.mentorship_student_avatar_metadata_is_allowed(object_metadata jsonb, object_name text)
returns boolean
language plpgsql
immutable
set search_path = public
as $$
declare
  image_mime text := lower(object_metadata ->> 'mimetype');
  image_size text := object_metadata ->> 'size';
  image_extension text := lower(split_part(object_name, '.', 2));
begin
  if image_mime is null
    or image_mime not in ('image/jpeg', 'image/png', 'image/webp')
    or image_size is null
    or image_size !~ '^[0-9]+$'
    or length(image_size) > 7 then
    return false;
  end if;
  if image_size::bigint < 1 or image_size::bigint > 2097152 then
    return false;
  end if;
  return (image_extension in ('jpg', 'jpeg') and image_mime = 'image/jpeg')
    or (image_extension = 'png' and image_mime = 'image/png')
    or (image_extension = 'webp' and image_mime = 'image/webp');
end;
$$;
revoke all on function public.mentorship_student_avatar_metadata_is_allowed(jsonb, text) from public, anon;
grant execute on function public.mentorship_student_avatar_metadata_is_allowed(jsonb, text) to authenticated;

create or replace function public.mentorship_student_avatar_can_read(object_name text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if auth.uid() is null
    or object_name !~ '^[0-9a-fA-F-]{36}/[0-9a-fA-F-]{36}[.](jpg|jpeg|png|webp)$' then
    return false;
  end if;
  return exists (
    select 1 from public.mentorship_enrollments enrollment
    where enrollment.id::text = split_part(object_name, '/', 1)
      and (
        enrollment.user_id = auth.uid()
        or (public.is_mentorship_staff() and not enrollment.is_walkthrough)
      )
  );
end;
$$;
revoke all on function public.mentorship_student_avatar_can_read(text) from public, anon;
grant execute on function public.mentorship_student_avatar_can_read(text) to authenticated;

drop policy if exists "Mentorship users read private student avatars" on storage.objects;
create policy "Mentorship users read private student avatars" on storage.objects
for select to authenticated using (
  bucket_id = 'mentorship-student-avatars'
  and public.mentorship_student_avatar_can_read(name)
);

drop policy if exists "Mentorship users upload own student avatars" on storage.objects;
create policy "Mentorship users upload own student avatars" on storage.objects
for insert to authenticated with check (
  bucket_id = 'mentorship-student-avatars'
  and public.mentorship_student_avatar_can_upload(name)
  and public.mentorship_student_avatar_metadata_is_allowed(metadata, name)
);

drop policy if exists "Mentorship users remove own student avatars" on storage.objects;
create policy "Mentorship users remove own student avatars" on storage.objects
for delete to authenticated using (
  bucket_id = 'mentorship-student-avatars'
  and public.mentorship_student_avatar_can_upload(name)
  and not exists (
    select 1 from public.mentorship_student_profiles profile
    where profile.photo_path = name
  )
);

create or replace function public.save_mentorship_student_profile(
  target_enrollment_id uuid,
  display_name_value text,
  artist_name_value text default null,
  instagram_value text default null,
  music_url_value text default null,
  daw_value text default null,
  photo_path_value text default null
)
returns public.mentorship_student_profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  saved_profile public.mentorship_student_profiles;
  clean_display_name text := btrim(coalesce(display_name_value, ''));
  clean_artist_name text := nullif(btrim(coalesce(artist_name_value, '')), '');
  clean_instagram text := nullif(lower(regexp_replace(btrim(coalesce(instagram_value, '')), '^@', '')), '');
  clean_music_url text := nullif(btrim(coalesce(music_url_value, '')), '');
  clean_daw text := nullif(btrim(coalesce(daw_value, '')), '');
  avatar_mime text;
  avatar_size text;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;
  if target_enrollment_id is null or not exists (
    select 1 from public.mentorship_enrollments enrollment
    where enrollment.id = target_enrollment_id
      and enrollment.user_id = auth.uid()
      and enrollment.status = 'active'
  ) then
    raise exception 'An active owned enrollment is required';
  end if;
  if length(clean_display_name) not between 1 and 80 then
    raise exception 'Display name must be between 1 and 80 characters';
  end if;
  if clean_artist_name is not null and length(clean_artist_name) > 80 then
    raise exception 'Artist name must be 80 characters or fewer';
  end if;
  if clean_daw is not null and length(clean_daw) > 80 then
    raise exception 'DAW must be 80 characters or fewer';
  end if;
  if clean_instagram is not null and (
    length(clean_instagram) > 30
    or clean_instagram !~ '^[a-z0-9._]{1,30}$'
  ) then
    raise exception 'Enter a valid Instagram handle';
  end if;
  if clean_music_url is not null and (
    length(clean_music_url) > 2048
    or clean_music_url !~ '^https://[^/?#[:space:]]+(/[^[:space:]?#]*)?([?][^[:space:]#]*)?([#][^[:space:]]*)?$'
    or split_part(split_part(clean_music_url, '/', 3), '?', 1) ~ '[@%]'
  ) then
    raise exception 'Music link must be HTTPS and contain no login details';
  end if;

  if photo_path_value is null
    or photo_path_value !~ ('^' || target_enrollment_id::text || '/[0-9a-fA-F-]{36}[.](jpg|jpeg|png|webp)$') then
    raise exception 'Upload a profile photo for this enrollment first';
  end if;
  select lower(avatar_object.metadata ->> 'mimetype'), avatar_object.metadata ->> 'size'
    into avatar_mime, avatar_size
  from storage.objects avatar_object
  where avatar_object.bucket_id = 'mentorship-student-avatars'
    and avatar_object.name = photo_path_value;
  if not found or avatar_mime is null or avatar_mime not in ('image/jpeg', 'image/png', 'image/webp') then
    raise exception 'The uploaded profile photo was not found or is not a supported image';
  end if;
  if avatar_size is null or avatar_size !~ '^[0-9]+$' or length(avatar_size) > 7 then
    raise exception 'The uploaded profile photo has invalid size metadata';
  end if;
  if avatar_size::bigint < 1 or avatar_size::bigint > 2097152 then
    raise exception 'Profile photo must be 2 MB or smaller';
  end if;
  if (split_part(photo_path_value, '.', 2) = 'jpg' or split_part(photo_path_value, '.', 2) = 'jpeg') and avatar_mime <> 'image/jpeg'
    or split_part(photo_path_value, '.', 2) = 'png' and avatar_mime <> 'image/png'
    or split_part(photo_path_value, '.', 2) = 'webp' and avatar_mime <> 'image/webp' then
    raise exception 'Profile photo type does not match its file name';
  end if;

  insert into public.mentorship_student_profiles (
    enrollment_id, display_name, photo_path, artist_name, instagram, music_url, daw
  ) values (
    target_enrollment_id, clean_display_name, photo_path_value, clean_artist_name,
    clean_instagram, clean_music_url, clean_daw
  )
  on conflict (enrollment_id) do update set
    display_name = excluded.display_name,
    photo_path = excluded.photo_path,
    artist_name = excluded.artist_name,
    instagram = excluded.instagram,
    music_url = excluded.music_url,
    daw = excluded.daw,
    updated_at = now()
  returning * into saved_profile;
  return saved_profile;
end;
$$;
revoke all on function public.save_mentorship_student_profile(uuid, text, text, text, text, text, text) from public, anon;
grant execute on function public.save_mentorship_student_profile(uuid, text, text, text, text, text, text) to authenticated;
