-- Cohort planner: applications close at the planned time without anyone switching the form off at
-- midnight. Adds a close time to each application form, respects it everywhere the form is read or
-- submitted, and lets an admin set it for a cohort from the planner.
--
-- Permissions are unchanged: setting the close time is admin-only, the same as opening or closing a
-- form by hand today (set_mentorship_application_form_open). Cohort start and end dates need no change;
-- staff can already update their cohort row through the existing "Mentorship staff manage cohorts" policy.

alter table public.mentorship_application_forms add column if not exists closes_at timestamptz;

-- The public form stops loading once the close time has passed.
create or replace function public.get_public_mentorship_application_form(p_slug text default null)
returns jsonb language plpgsql security definer set search_path=public as $$
declare f public.mentorship_application_forms; r public.mentorship_application_form_revisions;
begin
  if coalesce(auth.role(),'')<>'service_role' then raise exception 'Service access required' using errcode='42501'; end if;
  if p_slug is null or p_slug='' then select * into f from public.mentorship_application_forms where id='cohort-2-v1';
  else select * into f from public.mentorship_application_forms where slug=p_slug; end if;
  if not found or not f.is_open or (f.closes_at is not null and f.closes_at<=now()) or f.published_revision is null or not exists(select 1 from public.mentorship_cohorts where id=f.cohort_id and status not in ('completed','archived')) then raise exception 'Applications are unavailable' using errcode='P0404'; end if;
  select * into r from public.mentorship_application_form_revisions where form_id=f.id and revision=f.published_revision;
  return jsonb_build_object('id',f.id,'name',f.name,'slug',f.slug,'revision',r.revision,'config',r.config);
end $$;
revoke all on function public.get_public_mentorship_application_form(text) from public,anon,authenticated;
grant execute on function public.get_public_mentorship_application_form(text) to service_role;

-- The submission edge function reads the revision first, so a late submission is turned away here too.
create or replace function public.get_mentorship_application_form_revision(p_form_id text,p_revision integer)
returns jsonb language plpgsql security definer set search_path=public as $$
declare f public.mentorship_application_forms; r public.mentorship_application_form_revisions;
begin
  if coalesce(auth.role(),'')<>'service_role' then raise exception 'Service access required' using errcode='42501'; end if;
  select * into f from public.mentorship_application_forms where id=p_form_id;
  if not found or not f.is_open or (f.closes_at is not null and f.closes_at<=now()) or not exists(select 1 from public.mentorship_cohorts where id=f.cohort_id and status not in ('completed','archived')) then raise exception 'Applications are unavailable' using errcode='P0404'; end if;
  select * into r from public.mentorship_application_form_revisions where form_id=p_form_id and revision=p_revision;
  if not found then raise exception 'Form revision not found' using errcode='P0404'; end if;
  return jsonb_build_object('form_id',f.id,'revision',r.revision,'cohort_id',r.cohort_id,'config',r.config);
end $$;
revoke all on function public.get_mentorship_application_form_revision(text,integer) from public,anon,authenticated;
grant execute on function public.get_mentorship_application_form_revision(text,integer) to service_role;

-- The database boundary: no application row can be stored after its form's close time, whichever
-- path inserts it. Raising inside submit_mentorship_application rolls back its lead intake as well.
-- Same error and code as the existing closed check, so the edge function answers "Applications are closed".
create or replace function public.reject_mentorship_application_after_close()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  if exists(select 1 from public.mentorship_application_forms f where f.id=new.form_id and f.closes_at is not null and f.closes_at<=now()) then
    raise exception 'Applications are unavailable' using errcode='P0404';
  end if;
  return new;
end $$;
revoke all on function public.reject_mentorship_application_after_close() from public,anon,authenticated;
drop trigger if exists mentorship_applications_respect_close_time on public.mentorship_applications;
create trigger mentorship_applications_respect_close_time before insert on public.mentorship_applications
for each row execute function public.reject_mentorship_application_after_close();

-- Opening a form by hand after its close time has passed clears that close time, so the switch on
-- the forms page still does what it says.
create or replace function public.set_mentorship_application_form_open(p_form_id text,p_open boolean)
returns jsonb language plpgsql security definer set search_path=public as $$
declare current_form public.mentorship_application_forms; saved public.mentorship_application_forms;
begin
  if not coalesce(public.is_mentorship_application_form_admin(),false) then raise exception 'Admin access required' using errcode='42501'; end if;
  select * into current_form from public.mentorship_application_forms where id=p_form_id for update;
  if not found then raise exception 'Form not found' using errcode='P0404'; end if;
  if p_open is null then raise exception 'Choose whether the form should be open'; end if;
  if p_open and (current_form.published_revision is null or not exists(select 1 from public.mentorship_cohorts where id=current_form.cohort_id and status not in ('completed','archived'))) then raise exception 'Form cannot be opened'; end if;
  update public.mentorship_application_forms
    set is_open=p_open,
        closes_at=case when p_open and closes_at is not null and closes_at<=now() then null else closes_at end,
        updated_at=now()
    where id=p_form_id returning * into saved;
  return to_jsonb(saved);
end $$;
revoke all on function public.set_mentorship_application_form_open(text,boolean) from public,anon;
grant execute on function public.set_mentorship_application_form_open(text,boolean) to authenticated;

-- Called by the planner's "Lock in and publish". Sets (or clears, with null) the close time on every
-- application form for the cohort and returns how many forms were updated.
create or replace function public.set_mentorship_application_close(p_cohort_id uuid,p_closes_at timestamptz)
returns integer language plpgsql security definer set search_path=public as $$
declare updated_count integer;
begin
  if not coalesce(public.is_mentorship_application_form_admin(),false) then raise exception 'Admin access required' using errcode='42501'; end if;
  if not exists(select 1 from public.mentorship_cohorts where id=p_cohort_id) then raise exception 'Cohort not found' using errcode='P0404'; end if;
  update public.mentorship_application_forms set closes_at=p_closes_at,updated_at=now() where cohort_id=p_cohort_id;
  get diagnostics updated_count = row_count;
  return updated_count;
end $$;
revoke all on function public.set_mentorship_application_close(uuid,timestamptz) from public,anon;
grant execute on function public.set_mentorship_application_close(uuid,timestamptz) to authenticated;