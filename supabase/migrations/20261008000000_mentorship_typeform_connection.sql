-- Provider secrets stay encrypted in Vault and are readable only by edge functions.
create table public.mentorship_typeform_routes (
  form_id text primary key check(form_id ~ '^[A-Za-z0-9_-]{4,100}$'),
  cohort_id uuid not null references public.mentorship_cohorts(id),
  form_title text not null default '',
  field_map jsonb not null default '{}',
  secret_id uuid not null,
  accepts_from timestamptz not null default now(),
  enabled boolean not null default false,
  connected_at timestamptz
);
alter table public.mentorship_typeform_routes enable row level security;
revoke all on public.mentorship_typeform_routes from public,anon,authenticated;
grant all on public.mentorship_typeform_routes to service_role;

create table public.mentorship_applications (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.mentorship_leads(id) on delete cascade,
  form_id text not null,
  response_id text not null,
  submitted_at timestamptz not null,
  answers jsonb not null check(jsonb_typeof(answers)='array' and octet_length(answers::text)<=250000),
  unique(form_id,response_id)
);
alter table public.mentorship_applications enable row level security;
revoke all on public.mentorship_applications from public,anon,authenticated;
grant select on public.mentorship_applications to authenticated;
grant all on public.mentorship_applications to service_role;
create policy "Staff read application answers" on public.mentorship_applications for select to authenticated using(public.is_mentorship_staff());

create function public.prepare_mentorship_typeform(p_form_id text,p_cohort_id uuid,p_form_title text,p_field_map jsonb)
returns jsonb language plpgsql security definer set search_path=public as $$
declare route public.mentorship_typeform_routes; secret_value text; vault_id uuid;
begin
  if coalesce(auth.role(),'')<>'service_role' then raise exception 'Service access required' using errcode='42501'; end if;
  if not exists(select 1 from public.mentorship_cohorts where id=p_cohort_id and status not in ('archived','completed')) then raise exception 'Cohort is not accepting applications'; end if;
  if p_form_id is null or p_form_id !~ '^[A-Za-z0-9_-]{4,100}$' or coalesce(p_field_map->>'email','')='' then raise exception 'Form and email field required'; end if;
  perform pg_advisory_xact_lock(hashtextextended('typeform-connect:'||p_form_id,0));
  select * into route from public.mentorship_typeform_routes where form_id=p_form_id for update;
  if found then
    if route.cohort_id<>p_cohort_id then raise exception 'This form is assigned to another cohort. Use a separate form.'; end if;
    select decrypted_secret into secret_value from vault.decrypted_secrets where id=route.secret_id;
    update public.mentorship_typeform_routes set form_title=p_form_title,field_map=p_field_map where form_id=p_form_id;
  else
    secret_value:=encode(extensions.gen_random_bytes(32),'hex');
    select vault.create_secret(secret_value,'mentorship-typeform-'||p_form_id,'Typeform webhook signing secret') into vault_id;
    insert into public.mentorship_typeform_routes(form_id,cohort_id,form_title,field_map,secret_id)
      values(p_form_id,p_cohort_id,p_form_title,p_field_map,vault_id) returning * into route;
  end if;
  if secret_value is null then raise exception 'Webhook secret unavailable'; end if;
  return jsonb_build_object('secret',secret_value,'accepts_from',route.accepts_from);
end $$;
revoke all on function public.prepare_mentorship_typeform(text,uuid,text,jsonb) from public,anon,authenticated;
grant execute on function public.prepare_mentorship_typeform(text,uuid,text,jsonb) to service_role;

create function public.get_mentorship_typeform_route(p_form_id text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare route public.mentorship_typeform_routes; secret_value text;
begin
  if coalesce(auth.role(),'')<>'service_role' then raise exception 'Service access required' using errcode='42501'; end if;
  select * into route from public.mentorship_typeform_routes where form_id=p_form_id;
  if not found then return null; end if;
  select decrypted_secret into secret_value from vault.decrypted_secrets where id=route.secret_id;
  return to_jsonb(route)-'secret_id'||jsonb_build_object('secret',secret_value);
end $$;
revoke all on function public.get_mentorship_typeform_route(text) from public,anon,authenticated;
grant execute on function public.get_mentorship_typeform_route(text) to service_role;

create function public.ingest_mentorship_typeform(p_form_id text,p_response_id text,p_submitted_at timestamptz,p_lead jsonb,p_answers jsonb,p_summary text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare route public.mentorship_typeform_routes; result jsonb;
begin
  if coalesce(auth.role(),'')<>'service_role' then raise exception 'Service access required' using errcode='42501'; end if;
  select * into route from public.mentorship_typeform_routes where form_id=p_form_id and enabled;
  if not found then raise exception 'Form is not connected'; end if;
  if p_submitted_at<route.accepts_from then return jsonb_build_object('ignored','before_connection'); end if;
  result:=public.ingest_mentorship_lead(route.cohort_id,'typeform',p_form_id||':'||p_response_id,p_lead,p_submitted_at,p_summary);
  insert into public.mentorship_applications(lead_id,form_id,response_id,submitted_at,answers)
    values((result->>'lead_id')::uuid,p_form_id,p_response_id,p_submitted_at,p_answers) on conflict(form_id,response_id) do nothing;
  update public.mentorship_intake_connections set status='connected',last_checked_at=now(),detail='New completed applications sync automatically. Existing applications remain in Typeform.' where cohort_id=route.cohort_id and provider='typeform';
  return result;
end $$;
revoke all on function public.ingest_mentorship_typeform(text,text,timestamptz,jsonb,jsonb,text) from public,anon,authenticated;
grant execute on function public.ingest_mentorship_typeform(text,text,timestamptz,jsonb,jsonb,text) to service_role;
