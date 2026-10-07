-- Native public application intake. Browser clients receive no database access.
alter table public.mentorship_intake_connections drop constraint mentorship_intake_connections_provider_check;
alter table public.mentorship_intake_connections add constraint mentorship_intake_connections_provider_check check(provider in ('gmail','typeform','native'));
alter table public.mentorship_intake_events drop constraint mentorship_intake_events_provider_check;
alter table public.mentorship_intake_events add constraint mentorship_intake_events_provider_check check(provider in ('gmail','typeform','native'));
alter table public.mentorship_leads drop constraint mentorship_leads_first_contact_channel_check;
alter table public.mentorship_leads add constraint mentorship_leads_first_contact_channel_check check(first_contact_channel in ('Gmail handraiser','Typeform application','Native application','Website application','Direct enquiry','Other','Not recorded'));

-- Extend intake support while retaining the original Gmail and Typeform rules.
create or replace function public.ingest_mentorship_lead(p_cohort_id uuid,p_provider text,p_external_id text,p_lead jsonb,p_occurred_at timestamptz,p_summary text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare
  contact public.mentorship_leads;
  previous public.mentorship_intake_events;
  contact_email text:=lower(btrim(p_lead->>'email'));
  incoming_stage text:=coalesce(p_lead->>'stage',case when p_provider in ('typeform','native') then 'applied' else 'new' end);
  source_link text:=case when p_provider='gmail' then p_lead->>'email_thread_url' else p_lead->>'application_url' end;
  channel text:=case p_provider when 'gmail' then 'Gmail handraiser' when 'typeform' then 'Typeform application' when 'native' then 'Native application' end;
begin
  if not (coalesce(public.is_mentorship_staff(),false) or coalesce(auth.role(),'')='service_role') then raise exception 'Staff access required' using errcode='42501'; end if;
  if p_provider not in ('gmail','typeform','native') or p_provider is null or length(btrim(p_external_id)) not between 1 and 300 or p_external_id is null then raise exception 'Invalid source'; end if;
  if contact_email is null or contact_email !~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$' then raise exception 'Valid email required'; end if;
  if incoming_stage not in ('new','waitlist','applied') then raise exception 'Intake cannot confirm offers or payments'; end if;
  if p_provider='gmail' and incoming_stage='applied' then raise exception 'Application evidence is required'; end if;
  if p_occurred_at is null or p_occurred_at>now()+interval '5 minutes' then raise exception 'Valid source date required'; end if;
  if p_summary is null or length(btrim(p_summary)) not between 1 and 6000 then raise exception 'Source summary required'; end if;
  perform pg_advisory_xact_lock(hashtextextended(p_cohort_id::text||p_provider||p_external_id,0));
  select * into previous from public.mentorship_intake_events where cohort_id=p_cohort_id and provider=p_provider and external_id=p_external_id;
  if found then
    if not exists(select 1 from public.mentorship_leads where id=previous.lead_id and email=contact_email) then raise exception 'Source ID is already linked to another contact'; end if;
    return jsonb_build_object('lead_id',previous.lead_id,'duplicate',true);
  end if;
  insert into public.mentorship_leads(cohort_id,full_name,email,stage,source,source_detail,first_contact_channel,email_thread_url,application_url,music_url,goals,next_action,due_on)
  values(p_cohort_id,coalesce(nullif(btrim(p_lead->>'full_name'),''),contact_email),contact_email,incoming_stage,
    coalesce(nullif(p_lead->>'source',''),'Not recorded'),coalesce(p_lead->>'source_detail',''),channel,
    nullif(p_lead->>'email_thread_url',''),nullif(p_lead->>'application_url',''),nullif(p_lead->>'music_url',''),coalesce(p_lead->>'goals',''),
    coalesce(p_lead->>'next_action',case when p_provider in ('typeform','native') then 'Review application' else 'Review enquiry and reply' end),
    nullif(p_lead->>'due_on','')::date)
  on conflict(cohort_id,email) do nothing;
  select * into contact from public.mentorship_leads where cohort_id=p_cohort_id and email=contact_email for update;
  if (incoming_stage='applied' and contact.stage in ('new','waitlist') and contact.enrollment_id is null)
    or (contact.email_thread_url is null and nullif(p_lead->>'email_thread_url','') is not null)
    or (contact.application_url is null and nullif(p_lead->>'application_url','') is not null)
    or (contact.source='Not recorded' and coalesce(p_lead->>'source','Not recorded')<>'Not recorded')
    or (contact.first_contact_channel='Not recorded' and channel is not null) then
    update public.mentorship_leads set
      stage=case when incoming_stage='applied' and stage in ('new','waitlist') and enrollment_id is null then 'applied' else stage end,
      email_thread_url=coalesce(email_thread_url,nullif(p_lead->>'email_thread_url','')),
      application_url=coalesce(application_url,nullif(p_lead->>'application_url','')),
      source=case when source='Not recorded' then coalesce(nullif(p_lead->>'source',''),'Not recorded') else source end,
      first_contact_channel=case when first_contact_channel='Not recorded' then channel else first_contact_channel end,
      goals=case when goals='' then coalesce(p_lead->>'goals','') else goals end,
      music_url=coalesce(music_url,nullif(p_lead->>'music_url',''))
    where id=contact.id;
  end if;
  insert into public.mentorship_intake_events(cohort_id,provider,external_id,lead_id,occurred_at,source_url,summary)
    values(p_cohort_id,p_provider,p_external_id,contact.id,p_occurred_at,source_link,p_summary);
  insert into public.mentorship_lead_activity(lead_id,kind,body,actor_id,created_at)
    values(contact.id,'note',p_summary,auth.uid(),p_occurred_at);
  insert into public.mentorship_intake_connections(cohort_id,provider,last_received_at)
    values(p_cohort_id,p_provider,now()) on conflict(cohort_id,provider) do update set last_received_at=excluded.last_received_at;
  return jsonb_build_object('lead_id',contact.id,'duplicate',false);
end $$;
revoke all on function public.ingest_mentorship_lead(uuid,text,text,jsonb,timestamptz,text) from public,anon;
grant execute on function public.ingest_mentorship_lead(uuid,text,text,jsonb,timestamptz,text) to authenticated,service_role;

alter table public.mentorship_applications
  add column attribution jsonb not null default '{}'::jsonb check(jsonb_typeof(attribution)='object' and octet_length(attribution::text)<=12000);

create table public.mentorship_native_application_routes (
  form_id text primary key check(form_id='cohort-2-v1'),
  cohort_id uuid not null references public.mentorship_cohorts(id),
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.mentorship_native_application_routes enable row level security;
revoke all on public.mentorship_native_application_routes from public,anon,authenticated;
grant all on public.mentorship_native_application_routes to service_role;
insert into public.mentorship_native_application_routes(form_id,cohort_id)
values('cohort-2-v1','faa94fb4-dcf0-4d96-9369-d834c71fb0c2')
on conflict(form_id) do update set cohort_id=excluded.cohort_id;
insert into public.mentorship_intake_connections(cohort_id,provider,status,account_label,detail)
values('faa94fb4-dcf0-4d96-9369-d834c71fb0c2','native','setup_needed','Rob Late application form','Native application endpoint configured; end-to-end verification pending.')
on conflict(cohort_id,provider) do nothing;

-- Only irreversible hashes are retained for rolling limits. Rows expire after one hour.
create table public.mentorship_application_rate_limits (
  key_type text not null check(key_type in ('ip','email')),
  key_hash text not null check(key_hash ~ '^[0-9a-f]{64}$'),
  hit_at timestamptz not null default now()
);
create index mentorship_application_rate_limits_lookup on public.mentorship_application_rate_limits(key_type,key_hash,hit_at desc);
alter table public.mentorship_application_rate_limits enable row level security;
revoke all on public.mentorship_application_rate_limits from public,anon,authenticated;
grant all on public.mentorship_application_rate_limits to service_role;

create or replace function public.record_mentorship_milestone()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  if TG_TABLE_NAME='mentorship_intake_events' then
    if NEW.provider in ('typeform','native') then
      insert into public.mentorship_lead_milestones values(NEW.lead_id,NEW.cohort_id,'applied',NEW.occurred_at,case when NEW.provider='native' then 'Native application' else 'Typeform response' end)
      on conflict(lead_id,milestone) do update set occurred_at=least(mentorship_lead_milestones.occurred_at,excluded.occurred_at),evidence=excluded.evidence;
    end if;
  elsif NEW.stage in ('waitlist','applied','approved','offer_sent') then
    insert into public.mentorship_lead_milestones values(NEW.id,NEW.cohort_id,NEW.stage,now(),'Stage recorded by staff or intake') on conflict do nothing;
  end if;
  return NEW;
end $$;
revoke all on function public.record_mentorship_milestone() from public;

create or replace function public.submit_mentorship_application(
  p_form_id text,p_submission_id uuid,p_lead jsonb,p_answers jsonb,p_attribution jsonb,p_ip_hash text,p_email_hash text
) returns jsonb language plpgsql security definer set search_path=public as $$
declare
  route public.mentorship_native_application_routes;
  prior public.mentorship_applications;
  intake_result jsonb;
  contact_email text:=lower(btrim(p_lead->>'email'));
  submitted_at timestamptz:=now();
  summary text:='Native mentorship application submitted';
  rate_count integer;
  digest text;
begin
  if coalesce(auth.role(),'')<>'service_role' then raise exception 'Service access required' using errcode='42501'; end if;
  if p_form_id is null or p_form_id<>'cohort-2-v1' or p_submission_id is null then raise exception 'Invalid application'; end if;
  if p_ip_hash is null or p_ip_hash !~ '^[0-9a-f]{64}$' or p_email_hash is null or p_email_hash !~ '^[0-9a-f]{64}$' then raise exception 'Invalid request'; end if;
  if contact_email is null or length(contact_email)>254 or contact_email !~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$' then raise exception 'Invalid application'; end if;
  if coalesce(jsonb_typeof(p_answers),'')<>'array' or octet_length(p_answers::text)>250000 or coalesce(jsonb_typeof(p_attribution),'')<>'object' or octet_length(p_attribution::text)>12000 then raise exception 'Invalid application'; end if;
  if coalesce(length(btrim(p_lead->>'full_name')),0) not between 1 and 160 then raise exception 'Invalid application'; end if;
  perform pg_advisory_xact_lock(hashtextextended('native-submission:'||p_form_id||':'||p_submission_id::text,0));
  select * into prior from public.mentorship_applications where form_id=p_form_id and response_id=p_submission_id::text;
  if found then
    if prior.answers<>p_answers or prior.attribution<>p_attribution then raise exception 'Submission ID conflict' using errcode='22000'; end if;
    return jsonb_build_object('success',true,'submission_id',p_submission_id);
  end if;
  select * into route from public.mentorship_native_application_routes where form_id=p_form_id and enabled;
  if not found or not exists(select 1 from public.mentorship_cohorts where id=route.cohort_id and status not in ('archived','completed')) then raise exception 'Applications are unavailable' using errcode='P0404'; end if;

  -- Acquire both rate-limit locks in lexical order to avoid cross-request deadlocks.
  for digest in select item from unnest(array['ip:'||p_ip_hash,'email:'||p_email_hash]) as locks(item) order by item loop
    perform pg_advisory_xact_lock(hashtextextended('native-rate:'||digest,0));
  end loop;
  delete from public.mentorship_application_rate_limits where hit_at<now()-interval '1 hour';
  select count(*) into rate_count from public.mentorship_application_rate_limits where key_type='ip' and key_hash=p_ip_hash and hit_at>=now()-interval '1 hour';
  if rate_count>=20 then raise exception 'Application rate limit exceeded' using errcode='P0408'; end if;
  select count(*) into rate_count from public.mentorship_application_rate_limits where key_type='email' and key_hash=p_email_hash and hit_at>=now()-interval '1 hour';
  if rate_count>=5 then raise exception 'Application rate limit exceeded' using errcode='P0408'; end if;
  insert into public.mentorship_application_rate_limits(key_type,key_hash) values('ip',p_ip_hash),('email',p_email_hash);

  p_lead:=p_lead||jsonb_build_object('stage','applied','due_on',current_date);
  intake_result:=public.ingest_mentorship_lead(route.cohort_id,'native',p_submission_id::text,p_lead,submitted_at,summary);
  insert into public.mentorship_applications(lead_id,form_id,response_id,submitted_at,answers,attribution)
    values((intake_result->>'lead_id')::uuid,p_form_id,p_submission_id::text,submitted_at,p_answers,p_attribution);
  update public.mentorship_intake_connections set last_received_at=now()
    where cohort_id=route.cohort_id and provider='native';
  return jsonb_build_object('success',true,'submission_id',p_submission_id);
end $$;
revoke all on function public.submit_mentorship_application(text,uuid,jsonb,jsonb,jsonb,text,text) from public,anon,authenticated;
grant execute on function public.submit_mentorship_application(text,uuid,jsonb,jsonb,jsonb,text,text) to service_role;
