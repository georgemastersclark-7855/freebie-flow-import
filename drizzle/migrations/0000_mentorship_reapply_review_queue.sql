-- A waitlist, new or previously closed lead who then applies joins the review
-- queue like a fresh applicant: stage applied, "Review application" due today.
-- Previously only the stage moved, so the old next action and date stayed.
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
  if (incoming_stage='applied' and contact.stage in ('new','waitlist','closed') and contact.enrollment_id is null)
    or (contact.email_thread_url is null and nullif(p_lead->>'email_thread_url','') is not null)
    or (contact.application_url is null and nullif(p_lead->>'application_url','') is not null)
    or (contact.source='Not recorded' and coalesce(p_lead->>'source','Not recorded')<>'Not recorded')
    or (contact.first_contact_channel='Not recorded' and channel is not null) then
    update public.mentorship_leads set
      stage=case when incoming_stage='applied' and stage in ('new','waitlist','closed') and enrollment_id is null then 'applied' else stage end,
      next_action=case when incoming_stage='applied' and stage in ('new','waitlist','closed') and enrollment_id is null then coalesce(nullif(p_lead->>'next_action',''),'Review application') else next_action end,
      due_on=case when incoming_stage='applied' and stage in ('new','waitlist','closed') and enrollment_id is null then coalesce(nullif(p_lead->>'due_on','')::date,current_date) else due_on end,
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