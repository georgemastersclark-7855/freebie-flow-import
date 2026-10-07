-- Admissions and onboarding coordination. No checkout, email or access grants.
create table public.mentorship_leads (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.mentorship_cohorts(id),
  full_name text not null check (length(btrim(full_name)) between 1 and 160),
  email text not null check (email = lower(btrim(email)) and email ~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$' and length(email) <= 254),
  stage text not null default 'new' check (stage in ('new','waitlist','applied','offer_sent','closed')),
  source text not null default 'Not recorded' check (length(source) between 1 and 100),
  source_detail text not null default '' check (length(source_detail) <= 1000),
  goals text not null default '' check (length(goals) <= 4000),
  music_url text,
  application_url text,
  owner_id uuid references public.mentorship_profiles(user_id),
  next_action text not null default '' check (length(next_action) <= 1000),
  due_on date,
  payment_status text not null default 'unconfirmed' check (payment_status in ('unconfirmed','confirmed','refunded')),
  payment_reference text not null default '' check (length(payment_reference) <= 300),
  payment_on date,
  enrollment_id uuid unique references public.mentorship_enrollments(id) on delete set null,
  created_by uuid default auth.uid() references public.mentorship_profiles(user_id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cohort_id,email),
  check (due_on is null or length(btrim(next_action)) > 0),
  check (payment_status='unconfirmed' or (length(btrim(payment_reference))>0 and payment_on is not null))
);
create table public.mentorship_lead_activity (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.mentorship_leads(id) on delete cascade,
  kind text not null check (kind in ('note','created','updated')),
  body text not null check (length(btrim(body)) between 1 and 6000),
  actor_id uuid default auth.uid() references public.mentorship_profiles(user_id),
  created_at timestamptz not null default now()
);
create table public.mentorship_onboarding_calls (
  enrollment_id uuid primary key references public.mentorship_enrollments(id) on delete cascade,
  booked_at timestamptz,
  completed_at timestamptz check (completed_at is null or completed_at <= now()),
  owner_id uuid references public.mentorship_profiles(user_id),
  notes text not null default '' check (length(notes)<=4000),
  updated_by uuid default auth.uid() references public.mentorship_profiles(user_id),
  updated_at timestamptz not null default now()
);
create table public.mentorship_admissions_settings (
  cohort_id uuid primary key references public.mentorship_cohorts(id),
  capacity integer not null default 10 check (capacity between 1 and 1000),
  updated_at timestamptz not null default now()
);

create or replace function public.validate_mentorship_crm()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  if TG_TABLE_NAME='mentorship_leads' then
    NEW.email:=lower(btrim(NEW.email)); NEW.full_name:=btrim(NEW.full_name);
    if TG_OP='UPDATE' then
      NEW.created_by:=OLD.created_by; NEW.created_at:=OLD.created_at;
      if NEW.cohort_id<>OLD.cohort_id then raise exception 'Create a separate enquiry for another cohort'; end if;
    else NEW.created_by:=auth.uid(); end if;
    if NEW.music_url is not null and (NEW.music_url !~ '^https://[^[:space:]]+$' or length(NEW.music_url)>2048 or split_part(NEW.music_url,'/',3) ~ '[@%]') then raise exception 'Use a valid HTTPS music link'; end if;
    if NEW.application_url is not null and (NEW.application_url !~ '^https://[^[:space:]]+$' or length(NEW.application_url)>2048 or split_part(NEW.application_url,'/',3) ~ '[@%]') then raise exception 'Use a valid HTTPS application link'; end if;
    if NEW.enrollment_id is null then
      select e.id into NEW.enrollment_id from public.mentorship_enrollments e join public.mentorship_profiles p on p.user_id=e.user_id
      where e.cohort_id=NEW.cohort_id and not e.is_walkthrough and lower(p.email)=NEW.email;
    end if;
    if NEW.enrollment_id is not null and not exists(select 1 from public.mentorship_enrollments e join public.mentorship_profiles p on p.user_id=e.user_id where e.id=NEW.enrollment_id and not e.is_walkthrough and e.cohort_id=NEW.cohort_id and lower(p.email)=NEW.email) then
      raise exception 'The enrolled student must have the same email and cohort';
    end if;
  elsif TG_TABLE_NAME='mentorship_onboarding_calls' then
    if TG_OP='UPDATE' and NEW.enrollment_id<>OLD.enrollment_id then raise exception 'The student cannot be changed'; end if;
    NEW.updated_by:=auth.uid();
  end if;
  if NEW.owner_id is not null and not exists(select 1 from public.mentorship_profiles where user_id=NEW.owner_id and role in ('coach','admin')) then raise exception 'Choose a staff owner'; end if;
  NEW.updated_at:=clock_timestamp();
  return NEW;
end $$;
revoke all on function public.validate_mentorship_crm() from public;
create trigger validate_crm_lead before insert or update on public.mentorship_leads for each row execute function public.validate_mentorship_crm();
create trigger validate_crm_call before insert or update on public.mentorship_onboarding_calls for each row execute function public.validate_mentorship_crm();
create trigger update_admissions_settings before update on public.mentorship_admissions_settings for each row execute function public.set_mentorship_updated_at();

create or replace function public.record_mentorship_lead_activity()
returns trigger language plpgsql security definer set search_path=public as $$
declare changes text[]:=array[]::text[];
begin
  if TG_OP='INSERT' then
    insert into public.mentorship_lead_activity(lead_id,kind,body,actor_id) values(NEW.id,'created','Lead added',auth.uid());
  else
    if NEW.stage is distinct from OLD.stage then changes:=array_append(changes,'Stage: '||replace(OLD.stage,'_',' ')||' → '||replace(NEW.stage,'_',' ')); end if;
    if NEW.payment_status is distinct from OLD.payment_status then changes:=array_append(changes,'Payment record: '||NEW.payment_status); end if;
    if NEW.enrollment_id is distinct from OLD.enrollment_id then changes:=array_append(changes,'Student record linked'); end if;
    if NEW.owner_id is distinct from OLD.owner_id then changes:=array_append(changes,'Owner updated'); end if;
    if NEW.next_action is distinct from OLD.next_action or NEW.due_on is distinct from OLD.due_on then changes:=array_append(changes,'Follow-up: '||coalesce(nullif(NEW.next_action,''),'cleared')); end if;
    if cardinality(changes)=0 then changes:=array['Contact details updated']; end if;
    insert into public.mentorship_lead_activity(lead_id,kind,body,actor_id) values(NEW.id,'updated',array_to_string(changes,E'\n'),auth.uid());
  end if;
  return NEW;
end $$;
revoke all on function public.record_mentorship_lead_activity() from public;
create trigger log_crm_lead after insert or update on public.mentorship_leads for each row execute function public.record_mentorship_lead_activity();

-- Existing lead context follows an enrolment by exact email + cohort. This does
-- not claim payment succeeded, create accounts, or change access permissions.
create or replace function public.link_mentorship_admissions()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  if not NEW.is_walkthrough then
    update public.mentorship_leads l set enrollment_id=NEW.id
      from public.mentorship_profiles p where p.user_id=NEW.user_id and l.cohort_id=NEW.cohort_id
      and l.email=lower(p.email) and l.enrollment_id is null;
  end if;
  return NEW;
end $$;
revoke all on function public.link_mentorship_admissions() from public;
create trigger link_crm_enrollment after insert on public.mentorship_enrollments for each row execute function public.link_mentorship_admissions();

alter table public.mentorship_leads enable row level security;
alter table public.mentorship_lead_activity enable row level security;
alter table public.mentorship_onboarding_calls enable row level security;
alter table public.mentorship_admissions_settings enable row level security;
revoke all on public.mentorship_leads,public.mentorship_lead_activity,public.mentorship_onboarding_calls,public.mentorship_admissions_settings from public,anon,authenticated;
grant select,insert,update on public.mentorship_leads,public.mentorship_onboarding_calls,public.mentorship_admissions_settings to authenticated;
grant select,insert on public.mentorship_lead_activity to authenticated;
grant all on public.mentorship_leads,public.mentorship_lead_activity,public.mentorship_onboarding_calls,public.mentorship_admissions_settings to service_role;
create policy "Staff manage leads" on public.mentorship_leads for all to authenticated using(public.is_mentorship_staff()) with check(public.is_mentorship_staff());
create policy "Staff view lead activity" on public.mentorship_lead_activity for select to authenticated using(public.is_mentorship_staff());
create policy "Staff add lead notes" on public.mentorship_lead_activity for insert to authenticated with check(public.is_mentorship_staff() and kind='note' and actor_id=auth.uid());
create policy "Staff manage onboarding calls" on public.mentorship_onboarding_calls for all to authenticated using(public.can_manage_mentorship_student(enrollment_id)) with check(public.can_manage_mentorship_student(enrollment_id));
create policy "Staff manage capacity" on public.mentorship_admissions_settings for all to authenticated using(public.is_mentorship_staff()) with check(public.is_mentorship_staff());
create index on public.mentorship_leads(cohort_id,stage,due_on);
create index on public.mentorship_lead_activity(lead_id,created_at);
comment on table public.mentorship_leads is 'Private staff CRM. Payment confirmation is a staff record with a reference, not an automatic checkout verification. Linking a student does not grant access.';
