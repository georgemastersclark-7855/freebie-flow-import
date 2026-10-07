-- Durable, replay-safe Calendly invitee event intake. The edge receiver must verify
-- Calendly authenticity and pass the configured cohort ID; this RPC accepts
-- service-role calls only.
alter table public.mentorship_onboarding_calls
  add column calendly_invitee_uri text,
  add column calendly_updated_at timestamptz;

create table public.mentorship_booking_inbox (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.mentorship_cohorts(id) on delete cascade,
  email text not null check (email = lower(btrim(email)) and email ~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$' and length(email) <= 254),
  invitee_uri text not null check (length(btrim(invitee_uri)) between 1 and 2048),
  scheduled_at timestamptz,
  status text not null check (status in ('active','cancelled','rescheduled','superseded')),
  rescheduled_to_invitee_uri text check (rescheduled_to_invitee_uri is null or length(btrim(rescheduled_to_invitee_uri)) between 1 and 2048),
  provider_updated_at timestamptz not null,
  enrollment_id uuid references public.mentorship_enrollments(id) on delete set null,
  lead_id uuid references public.mentorship_leads(id) on delete set null,
  received_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cohort_id, invitee_uri),
  check ((status = 'active' and scheduled_at is not null and rescheduled_to_invitee_uri is null)
    or (status = 'cancelled' and rescheduled_to_invitee_uri is null)
    or (status = 'rescheduled' and rescheduled_to_invitee_uri is not null)
    or (status = 'superseded' and scheduled_at is not null and rescheduled_to_invitee_uri is null))
);

create index mentorship_booking_inbox_staff_idx
  on public.mentorship_booking_inbox(cohort_id, status, provider_updated_at desc);
create index mentorship_booking_inbox_identity_idx
  on public.mentorship_booking_inbox(cohort_id, email, provider_updated_at desc);

create table public.mentorship_booking_events (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.mentorship_cohorts(id) on delete cascade,
  external_event_id text not null check (length(btrim(external_event_id)) between 1 and 300),
  event_type text not null check (event_type in ('created','cancelled','rescheduled')),
  email text not null check (email = lower(btrim(email)) and email ~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$' and length(email) <= 254),
  invitee_uri text not null check (length(btrim(invitee_uri)) between 1 and 2048),
  scheduled_at timestamptz,
  rescheduled_to_invitee_uri text check (rescheduled_to_invitee_uri is null or length(btrim(rescheduled_to_invitee_uri)) between 1 and 2048),
  rescheduled_at timestamptz,
  provider_updated_at timestamptz not null,
  received_at timestamptz not null default now(),
  unique (cohort_id, external_event_id),
  check ((event_type='rescheduled' and rescheduled_to_invitee_uri is not null and rescheduled_at is not null)
    or (event_type<>'rescheduled' and rescheduled_to_invitee_uri is null and rescheduled_at is null))
);

alter table public.mentorship_booking_inbox enable row level security;
alter table public.mentorship_booking_events enable row level security;
revoke all on public.mentorship_booking_inbox, public.mentorship_booking_events from public, anon, authenticated, service_role;
grant select on public.mentorship_booking_inbox, public.mentorship_booking_events to authenticated;
grant select,insert,update on public.mentorship_booking_inbox to service_role;
grant select,insert on public.mentorship_booking_events to service_role;
create policy "Staff read booking inbox" on public.mentorship_booking_inbox
  for select to authenticated using (public.is_mentorship_staff());
create policy "Staff read booking event evidence" on public.mentorship_booking_events
  for select to authenticated using (public.is_mentorship_staff());

create or replace function public.sync_mentorship_booking_for_enrollment(p_enrollment_id uuid)
returns void language plpgsql security definer set search_path=public as $$
declare current_booking public.mentorship_booking_inbox;
begin
  select b.* into current_booking
  from public.mentorship_booking_inbox b
  where b.enrollment_id=p_enrollment_id and b.status='active'
  order by b.provider_updated_at desc, b.received_at desc
  limit 1;

  if found then
    insert into public.mentorship_onboarding_calls(enrollment_id,booked_at,calendly_invitee_uri,calendly_updated_at)
    values(p_enrollment_id,current_booking.scheduled_at,current_booking.invitee_uri,current_booking.provider_updated_at)
    on conflict(enrollment_id) do update set
      booked_at=excluded.booked_at,
      calendly_invitee_uri=excluded.calendly_invitee_uri,
      calendly_updated_at=excluded.calendly_updated_at
    where (mentorship_onboarding_calls.calendly_invitee_uri is null
             and mentorship_onboarding_calls.booked_at is null)
       or mentorship_onboarding_calls.calendly_invitee_uri=excluded.calendly_invitee_uri
       or (mentorship_onboarding_calls.calendly_invitee_uri is not null
           and excluded.calendly_updated_at>=coalesce(mentorship_onboarding_calls.calendly_updated_at,'-infinity'::timestamptz));
  else
    update public.mentorship_onboarding_calls c
    set booked_at=null,calendly_invitee_uri=null,calendly_updated_at=now()
    where c.enrollment_id=p_enrollment_id
      and c.calendly_invitee_uri is not null
      and not exists (
        select 1 from public.mentorship_booking_inbox b
        where b.cohort_id=(select e.cohort_id from public.mentorship_enrollments e where e.id=p_enrollment_id)
          and b.invitee_uri=c.calendly_invitee_uri and b.status='active'
      );
  end if;
end $$;
revoke all on function public.sync_mentorship_booking_for_enrollment(uuid) from public,anon,authenticated;
grant execute on function public.sync_mentorship_booking_for_enrollment(uuid) to service_role;

create or replace function public.link_calendly_bookings_after_enrollment()
returns trigger language plpgsql security definer set search_path=public as $$
declare student_email text;
begin
  if not new.is_walkthrough then
    select lower(btrim(p.email)) into student_email
    from public.mentorship_profiles p where p.user_id=new.user_id;
    if student_email is not null then
      perform pg_advisory_xact_lock(hashtextextended(new.cohort_id::text||':calendly-email:'||student_email,0));
      update public.mentorship_booking_inbox b set enrollment_id=new.id,updated_at=now()
      where b.cohort_id=new.cohort_id and b.email=student_email and b.enrollment_id is null;
      perform public.sync_mentorship_booking_for_enrollment(new.id);
    end if;
  end if;
  return new;
end $$;
revoke all on function public.link_calendly_bookings_after_enrollment() from public,anon,authenticated;
create trigger link_calendly_booking_after_enrollment
after insert on public.mentorship_enrollments
for each row execute function public.link_calendly_bookings_after_enrollment();

create or replace function public.ingest_calendly_booking_event(
  p_cohort_id uuid,
  p_external_event_id text,
  p_event_type text,
  p_email text,
  p_invitee_uri text,
  p_scheduled_at timestamptz,
  p_provider_updated_at timestamptz,
  p_rescheduled_to_invitee_uri text default null,
  p_rescheduled_at timestamptz default null
)
returns jsonb language plpgsql security definer set search_path=public as $$
declare
  normalized_email text:=lower(btrim(p_email));
  prior_event public.mentorship_booking_events;
  matched_enrollment uuid;
  matched_lead uuid;
  enrollment_count integer;
  lead_count integer;
  next_invitee_uri text;
  allow_create boolean;
  allow_replacement boolean;
begin
  if coalesce(auth.role(),'')<>'service_role' then
    raise exception 'Service access required' using errcode='42501';
  end if;
  if p_cohort_id is null or not exists(select 1 from public.mentorship_cohorts where id=p_cohort_id) then
    raise exception 'Configured cohort is required';
  end if;
  if p_external_event_id is null or length(btrim(p_external_event_id)) not between 1 and 300 then raise exception 'Provider event ID required'; end if;
  if p_event_type not in ('created','cancelled','rescheduled') or p_event_type is null then raise exception 'Unsupported booking event'; end if;
  if normalized_email is null or normalized_email !~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$' or length(normalized_email)>254 then raise exception 'Valid invitee email required'; end if;
  if p_invitee_uri is null or length(btrim(p_invitee_uri)) not between 1 and 2048 then raise exception 'Calendly invitee URI required'; end if;
  if btrim(p_invitee_uri) !~ '^https://api[.]calendly[.]com/scheduled_events/[^/[:space:]?#]+/invitees/[^/[:space:]?#]+$' then raise exception 'Use the Calendly invitee URI'; end if;
  if p_provider_updated_at is null or p_provider_updated_at>now()+interval '5 minutes' then raise exception 'Valid provider event time required'; end if;
  if p_event_type='created' and p_scheduled_at is null then raise exception 'Scheduled time required for a created booking'; end if;
  if p_event_type='rescheduled' and (p_rescheduled_to_invitee_uri is null or length(btrim(p_rescheduled_to_invitee_uri)) not between 1 and 2048 or p_rescheduled_at is null) then raise exception 'Replacement event and time required for a reschedule'; end if;
  if p_event_type='rescheduled' and btrim(p_rescheduled_to_invitee_uri) !~ '^https://api[.]calendly[.]com/scheduled_events/[^/[:space:]?#]+/invitees/[^/[:space:]?#]+$' then raise exception 'Use the replacement Calendly invitee URI'; end if;
  if btrim(p_rescheduled_to_invitee_uri)=btrim(p_invitee_uri) then raise exception 'Replacement invitee must differ from the original'; end if;

  perform pg_advisory_xact_lock(hashtextextended(p_cohort_id::text||':calendly-event:'||p_external_event_id,0));
  select * into prior_event from public.mentorship_booking_events
    where cohort_id=p_cohort_id and external_event_id=btrim(p_external_event_id);
  if found then
    if prior_event.event_type<>p_event_type or prior_event.email<>normalized_email
       or prior_event.invitee_uri<>btrim(p_invitee_uri)
       or prior_event.scheduled_at is distinct from p_scheduled_at
       or prior_event.rescheduled_to_invitee_uri is distinct from nullif(btrim(p_rescheduled_to_invitee_uri),'')
       or prior_event.rescheduled_at is distinct from p_rescheduled_at
       or prior_event.provider_updated_at is distinct from p_provider_updated_at then
      raise exception 'Provider event ID already belongs to different event data';
    end if;
    return jsonb_build_object('duplicate',true,'inbox_id',null,'enrollment_id',null,'lead_id',null);
  end if;
  perform pg_advisory_xact_lock(hashtextextended(p_cohort_id::text||':calendly-email:'||normalized_email,0));
  perform pg_advisory_xact_lock(hashtextextended(p_cohort_id::text||':calendly-uri:'||btrim(p_invitee_uri),0));
  if p_rescheduled_to_invitee_uri is not null then
    perform pg_advisory_xact_lock(hashtextextended(p_cohort_id::text||':calendly-uri:'||btrim(p_rescheduled_to_invitee_uri),0));
  end if;
  if exists(select 1 from public.mentorship_booking_inbox b
      where b.cohort_id=p_cohort_id and b.invitee_uri=btrim(p_invitee_uri) and b.email<>normalized_email)
     or (p_rescheduled_to_invitee_uri is not null and exists(select 1 from public.mentorship_booking_inbox b
      where b.cohort_id=p_cohort_id and b.invitee_uri=btrim(p_rescheduled_to_invitee_uri) and b.email<>normalized_email)) then
    raise exception 'Calendly invitee URI is already linked to another invitee';
  end if;

  select count(*) into enrollment_count
  from public.mentorship_enrollments e join public.mentorship_profiles p on p.user_id=e.user_id
  where e.cohort_id=p_cohort_id and e.status='active' and not e.is_walkthrough and lower(btrim(p.email))=normalized_email;
  if enrollment_count>1 then raise exception 'Invitee matches multiple active enrollments in the configured cohort'; end if;
  if enrollment_count=1 then
    select e.id into matched_enrollment from public.mentorship_enrollments e
    join public.mentorship_profiles p on p.user_id=e.user_id
    where e.cohort_id=p_cohort_id and e.status='active' and not e.is_walkthrough and lower(btrim(p.email))=normalized_email;
  end if;
  select count(*) into lead_count
  from public.mentorship_leads l where l.cohort_id=p_cohort_id and l.email=normalized_email;
  if lead_count>1 then raise exception 'Invitee matches multiple CRM leads in the configured cohort'; end if;
  if lead_count=1 then
    select l.id into matched_lead from public.mentorship_leads l where l.cohort_id=p_cohort_id and l.email=normalized_email;
  end if;

  select not exists(select 1 from public.mentorship_booking_inbox b
    where b.cohort_id=p_cohort_id and b.email=normalized_email and b.invitee_uri=btrim(p_invitee_uri)
      and b.status in ('cancelled','rescheduled') and b.provider_updated_at>=p_provider_updated_at)
    into allow_create;
  select not exists(select 1 from public.mentorship_booking_inbox b
    where p_event_type='rescheduled' and b.cohort_id=p_cohort_id and b.email=normalized_email
      and b.invitee_uri=btrim(p_rescheduled_to_invitee_uri) and b.status in ('cancelled','rescheduled')
      and b.provider_updated_at>=p_provider_updated_at)
    into allow_replacement;

  insert into public.mentorship_booking_events(
    cohort_id,external_event_id,event_type,email,invitee_uri,scheduled_at,
    rescheduled_to_invitee_uri,rescheduled_at,provider_updated_at
  ) values(
    p_cohort_id,btrim(p_external_event_id),p_event_type,normalized_email,btrim(p_invitee_uri),p_scheduled_at,
    nullif(btrim(p_rescheduled_to_invitee_uri),''),p_rescheduled_at,p_provider_updated_at
  );

  if p_event_type='created' then
    update public.mentorship_booking_inbox set status='superseded',updated_at=now()
    where allow_create and cohort_id=p_cohort_id and email=normalized_email and status='active'
      and invitee_uri<>btrim(p_invitee_uri) and provider_updated_at<=p_provider_updated_at;
    insert into public.mentorship_booking_inbox(cohort_id,email,invitee_uri,scheduled_at,status,provider_updated_at,enrollment_id,lead_id)
    values(p_cohort_id,normalized_email,btrim(p_invitee_uri),p_scheduled_at,
      case when not allow_create or exists(select 1 from public.mentorship_booking_inbox b where b.cohort_id=p_cohort_id and b.email=normalized_email and b.invitee_uri<>btrim(p_invitee_uri) and b.status='active' and b.provider_updated_at>=p_provider_updated_at) then 'superseded' else 'active' end,
      p_provider_updated_at,matched_enrollment,matched_lead)
    on conflict(cohort_id,invitee_uri) do update set
      email=excluded.email,scheduled_at=excluded.scheduled_at,status=excluded.status,rescheduled_to_invitee_uri=null,
      provider_updated_at=excluded.provider_updated_at,enrollment_id=coalesce(mentorship_booking_inbox.enrollment_id,excluded.enrollment_id),
      lead_id=coalesce(mentorship_booking_inbox.lead_id,excluded.lead_id),updated_at=now()
    where excluded.provider_updated_at>mentorship_booking_inbox.provider_updated_at
       or (excluded.provider_updated_at=mentorship_booking_inbox.provider_updated_at
           and mentorship_booking_inbox.status not in ('cancelled','rescheduled'));
  elsif p_event_type='cancelled' then
    insert into public.mentorship_booking_inbox(cohort_id,email,invitee_uri,scheduled_at,status,provider_updated_at,enrollment_id,lead_id)
    values(p_cohort_id,normalized_email,btrim(p_invitee_uri),null,'cancelled',p_provider_updated_at,matched_enrollment,matched_lead)
    on conflict(cohort_id,invitee_uri) do update set
      email=excluded.email,status='cancelled',rescheduled_to_invitee_uri=null,provider_updated_at=excluded.provider_updated_at,
      enrollment_id=coalesce(mentorship_booking_inbox.enrollment_id,excluded.enrollment_id),
      lead_id=coalesce(mentorship_booking_inbox.lead_id,excluded.lead_id),updated_at=now()
    where excluded.provider_updated_at>=mentorship_booking_inbox.provider_updated_at;
  else
    update public.mentorship_booking_inbox set status='superseded',updated_at=now()
    where allow_replacement and cohort_id=p_cohort_id and email=normalized_email and status='active'
      and invitee_uri<>btrim(p_invitee_uri) and provider_updated_at<=p_provider_updated_at;
    insert into public.mentorship_booking_inbox(cohort_id,email,invitee_uri,scheduled_at,status,rescheduled_to_invitee_uri,provider_updated_at,enrollment_id,lead_id)
    values(p_cohort_id,normalized_email,btrim(p_invitee_uri),p_scheduled_at,'rescheduled',btrim(p_rescheduled_to_invitee_uri),p_provider_updated_at,matched_enrollment,matched_lead)
    on conflict(cohort_id,invitee_uri) do update set
      email=excluded.email,status='rescheduled',rescheduled_to_invitee_uri=excluded.rescheduled_to_invitee_uri,
      provider_updated_at=excluded.provider_updated_at,enrollment_id=coalesce(mentorship_booking_inbox.enrollment_id,excluded.enrollment_id),
      lead_id=coalesce(mentorship_booking_inbox.lead_id,excluded.lead_id),updated_at=now()
    where excluded.provider_updated_at>=mentorship_booking_inbox.provider_updated_at;

    insert into public.mentorship_booking_inbox(cohort_id,email,invitee_uri,scheduled_at,status,provider_updated_at,enrollment_id,lead_id)
    values(p_cohort_id,normalized_email,btrim(p_rescheduled_to_invitee_uri),p_rescheduled_at,
      case when not allow_replacement or exists(select 1 from public.mentorship_booking_inbox b where b.cohort_id=p_cohort_id and b.email=normalized_email and b.invitee_uri<>btrim(p_rescheduled_to_invitee_uri) and b.status='active' and b.provider_updated_at>=p_provider_updated_at) then 'superseded' else 'active' end,
      p_provider_updated_at,matched_enrollment,matched_lead)
    on conflict(cohort_id,invitee_uri) do update set
      email=excluded.email,scheduled_at=excluded.scheduled_at,status=excluded.status,rescheduled_to_invitee_uri=null,
      provider_updated_at=excluded.provider_updated_at,enrollment_id=coalesce(mentorship_booking_inbox.enrollment_id,excluded.enrollment_id),
      lead_id=coalesce(mentorship_booking_inbox.lead_id,excluded.lead_id),updated_at=now()
    where excluded.provider_updated_at>mentorship_booking_inbox.provider_updated_at
       or (excluded.provider_updated_at=mentorship_booking_inbox.provider_updated_at
           and mentorship_booking_inbox.status not in ('cancelled','rescheduled'));
  end if;

  next_invitee_uri:=case when p_event_type='rescheduled' then btrim(p_rescheduled_to_invitee_uri) else btrim(p_invitee_uri) end;
  if matched_enrollment is not null then
    perform public.sync_mentorship_booking_for_enrollment(matched_enrollment);
  end if;
  return jsonb_build_object('duplicate',false,'event_type',p_event_type,'invitee_uri',next_invitee_uri,
    'enrollment_id',matched_enrollment,'lead_id',matched_lead,'matched',matched_enrollment is not null);
end $$;
revoke all on function public.ingest_calendly_booking_event(uuid,text,text,text,text,timestamptz,timestamptz,text,timestamptz) from public,anon,authenticated;
grant execute on function public.ingest_calendly_booking_event(uuid,text,text,text,text,timestamptz,timestamptz,text,timestamptz) to service_role;

comment on table public.mentorship_booking_inbox is 'Calendly invitee bookings awaiting or linked to a student. invitee_uri identifies one attendee, including for group events.';
comment on table public.mentorship_booking_events is 'Replay-protection ledger for verified upstream Calendly events. Does not mark onboarding complete.';
comment on column public.mentorship_onboarding_calls.calendly_invitee_uri is 'Current Calendly invitee URI linked to booked_at; cancellation only clears a matching event.';
