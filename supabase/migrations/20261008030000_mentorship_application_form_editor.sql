create table public.mentorship_application_forms (
  id text primary key check(length(id) between 1 and 100),
  name text not null check(length(btrim(name)) between 1 and 120),
  slug text not null unique check(slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) between 3 and 80),
  cohort_id uuid not null references public.mentorship_cohorts(id),
  draft_config jsonb not null,
  draft_version integer not null default 1 check(draft_version>0),
  published_revision integer,
  published_draft_version integer,
  is_open boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.mentorship_application_forms enable row level security;
revoke all on public.mentorship_application_forms from public,anon,authenticated;
grant select on public.mentorship_application_forms to authenticated;
grant all on public.mentorship_application_forms to service_role;

create table public.mentorship_application_form_revisions (
  form_id text not null references public.mentorship_application_forms(id) on delete cascade,
  revision integer not null check(revision>0),
  cohort_id uuid not null references public.mentorship_cohorts(id),
  config jsonb not null,
  published_at timestamptz not null default now(),
  published_by uuid references public.mentorship_profiles(user_id),
  primary key(form_id,revision)
);
alter table public.mentorship_application_form_revisions enable row level security;
revoke all on public.mentorship_application_form_revisions from public,anon,authenticated;
grant all on public.mentorship_application_form_revisions to service_role;

create or replace function public.prevent_mentorship_application_revision_mutation()
returns trigger language plpgsql set search_path=public as $$
begin
  raise exception 'Published application revisions are immutable' using errcode='55000';
end $$;
revoke all on function public.prevent_mentorship_application_revision_mutation() from public,anon,authenticated,service_role;
create trigger keep_published_application_revisions_immutable
before update or delete on public.mentorship_application_form_revisions
for each row execute function public.prevent_mentorship_application_revision_mutation();

create or replace function public.is_mentorship_application_form_admin()
returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.mentorship_profiles where user_id=auth.uid() and role='admin');
$$;
revoke all on function public.is_mentorship_application_form_admin() from public,anon;
grant execute on function public.is_mentorship_application_form_admin() to authenticated;
create policy "Admins read application form drafts" on public.mentorship_application_forms
  for select to authenticated using(public.is_mentorship_application_form_admin());

create or replace function public.validate_mentorship_application_form_config(p_config jsonb)
returns void language plpgsql immutable set search_path=public as $$
declare
  question jsonb;
  option_value text;
  question_count integer;
begin
  if coalesce(jsonb_typeof(p_config),'')<>'object' then raise exception 'Invalid application form config'; end if;
  if (select count(*) from jsonb_object_keys(p_config))<>4 or not (p_config ?& array['welcome','identity','completion','questions']) then raise exception 'Invalid application form config'; end if;
  if coalesce(jsonb_typeof(p_config->'welcome'),'')<>'object' or coalesce(jsonb_typeof(p_config->'identity'),'')<>'object'
    or coalesce(jsonb_typeof(p_config->'completion'),'')<>'object' or coalesce(jsonb_typeof(p_config->'questions'),'')<>'array' then raise exception 'Invalid application form config'; end if;
  if (select count(*) from jsonb_object_keys(p_config->'welcome'))<>4 or not (p_config->'welcome' ?& array['eyebrow','title','description','buttonText'])
    or (select count(*) from jsonb_object_keys(p_config->'identity'))<>4 or not (p_config->'identity' ?& array['title','description','cohortLabel','details'])
    or (select count(*) from jsonb_object_keys(p_config->'completion'))<>2 or not (p_config->'completion' ?& array['title','description']) then raise exception 'Invalid application form copy'; end if;
  if jsonb_typeof(p_config->'welcome'->'eyebrow') is distinct from 'string' or length(p_config->'welcome'->>'eyebrow')>60
    or jsonb_typeof(p_config->'welcome'->'title') is distinct from 'string' or length(btrim(p_config->'welcome'->>'title')) not between 1 and 180
    or jsonb_typeof(p_config->'welcome'->'description') is distinct from 'string' or length(p_config->'welcome'->>'description')>1000
    or jsonb_typeof(p_config->'welcome'->'buttonText') is distinct from 'string' or length(btrim(p_config->'welcome'->>'buttonText')) not between 1 and 60
    or jsonb_typeof(p_config->'identity'->'title') is distinct from 'string' or length(btrim(p_config->'identity'->>'title')) not between 1 and 160
    or jsonb_typeof(p_config->'identity'->'description') is distinct from 'string' or length(p_config->'identity'->>'description')>800
    or jsonb_typeof(p_config->'identity'->'cohortLabel') is distinct from 'string' or length(btrim(p_config->'identity'->>'cohortLabel')) not between 1 and 80
    or jsonb_typeof(p_config->'completion'->'title') is distinct from 'string' or length(btrim(p_config->'completion'->>'title')) not between 1 and 180
    or jsonb_typeof(p_config->'completion'->'description') is distinct from 'string' or length(p_config->'completion'->>'description')>1000 then raise exception 'Invalid application form copy'; end if;
  if jsonb_typeof(p_config->'identity'->'details') is distinct from 'array' then raise exception 'Invalid identity details'; end if;
  if jsonb_array_length(p_config->'identity'->'details') not between 1 and 10
    or exists(select 1 from jsonb_array_elements(p_config->'identity'->'details') d where jsonb_typeof(d) is distinct from 'string' or length(btrim(d#>>'{}')) not between 1 and 100) then raise exception 'Invalid identity details'; end if;

  question_count:=jsonb_array_length(p_config->'questions');
  if question_count not between 2 and 30 then raise exception 'Add between 2 and 30 questions'; end if;
  for question in select value from jsonb_array_elements(p_config->'questions') loop
    if jsonb_typeof(question) is distinct from 'object' then raise exception 'Invalid application question'; end if;
    if not (question ?& array['key','title','description','placeholder','section','type','required','maxLength'])
      or exists(select 1 from jsonb_object_keys(question) k where k not in ('key','title','description','placeholder','section','type','required','options','maxLength')) then raise exception 'Invalid application question'; end if;
    if jsonb_typeof(question->'key') is distinct from 'string' or length(question->>'key')>48
      or jsonb_typeof(question->'title') is distinct from 'string' or length(btrim(question->>'title')) not between 1 and 180
      or jsonb_typeof(question->'description') is distinct from 'string' or length(question->>'description')>800
      or jsonb_typeof(question->'placeholder') is distinct from 'string' or length(question->>'placeholder')>200
      or jsonb_typeof(question->'section') is distinct from 'string' or length(btrim(question->>'section')) not between 1 and 80
      or coalesce(question->>'type','') not in ('text','email','textarea','choice')
      or jsonb_typeof(question->'required') is distinct from 'boolean'
      or jsonb_typeof(question->'maxLength') is distinct from 'number' or (question->>'maxLength') !~ '^[0-9]+$' then raise exception 'Invalid application question'; end if;
    if (question->>'maxLength')::numeric not between 1 and 4000 then raise exception 'Invalid application question length'; end if;
    if (question->>'key' not in ('name','email','social','music','experience','goal','struggles','income','investment','source'))
      and (question->>'key') !~ '^q_[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$' then raise exception 'Invalid application question key'; end if;
    if question->>'type'='choice' then
      if jsonb_typeof(question->'options') is distinct from 'array' then raise exception 'Choice questions need options'; end if;
      if jsonb_array_length(question->'options') not between 2 and 20 then raise exception 'Choice questions need 2 to 20 options'; end if;
      if exists(select 1 from jsonb_array_elements(question->'options') o where jsonb_typeof(o) is distinct from 'string' or length(btrim(o#>>'{}')) not between 1 and 100) then raise exception 'Invalid choice option'; end if;
      if exists(select 1 from jsonb_array_elements_text(question->'options') o(value) group by value having count(*)>1) then raise exception 'Choice options must be unique'; end if;
    elsif question ? 'options' then raise exception 'Only choice questions may have options'; end if;
  end loop;
  if exists(select 1 from jsonb_array_elements(p_config->'questions') q group by q->>'key' having count(*)>1) then raise exception 'Question keys must be unique'; end if;
  if (select count(*) from jsonb_array_elements(p_config->'questions') q where q->>'key'='name' and q->>'type'='text' and q->'required'='true'::jsonb)<>1
    or (select count(*) from jsonb_array_elements(p_config->'questions') q where q->>'key'='email' and q->>'type'='email' and q->'required'='true'::jsonb)<>1
    or exists(select 1 from jsonb_array_elements(p_config->'questions') q where q->>'key'='name' and (q->>'maxLength')::numeric>160)
    or exists(select 1 from jsonb_array_elements(p_config->'questions') q where q->>'key'='email' and (q->>'maxLength')::numeric>254) then raise exception 'Required identity questions are missing'; end if;
end $$;
revoke all on function public.validate_mentorship_application_form_config(jsonb) from public,anon,authenticated,service_role;

create or replace function public.create_mentorship_application_form(p_name text,p_slug text,p_cohort_id uuid,p_config jsonb)
returns jsonb language plpgsql security definer set search_path=public as $$
declare created public.mentorship_application_forms;
begin
  if not coalesce(public.is_mentorship_application_form_admin(),false) then raise exception 'Admin access required' using errcode='42501'; end if;
  if p_name is null or length(btrim(p_name)) not between 1 and 120 or p_slug is null or length(p_slug) not between 3 and 80 or p_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$' then raise exception 'Invalid form name or slug'; end if;
  if not exists(select 1 from public.mentorship_cohorts where id=p_cohort_id and status not in ('completed','archived')) then raise exception 'Choose an available cohort'; end if;
  perform public.validate_mentorship_application_form_config(p_config);
  insert into public.mentorship_application_forms(id,name,slug,cohort_id,draft_config)
    values(gen_random_uuid()::text,btrim(p_name),p_slug,p_cohort_id,p_config) returning * into created;
  return to_jsonb(created);
end $$;
revoke all on function public.create_mentorship_application_form(text,text,uuid,jsonb) from public,anon;
grant execute on function public.create_mentorship_application_form(text,text,uuid,jsonb) to authenticated;

create or replace function public.save_mentorship_application_form(p_form_id text,p_expected_version integer,p_name text,p_config jsonb)
returns jsonb language plpgsql security definer set search_path=public as $$
declare current_form public.mentorship_application_forms; saved public.mentorship_application_forms;
begin
  if not coalesce(public.is_mentorship_application_form_admin(),false) then raise exception 'Admin access required' using errcode='42501'; end if;
  if p_name is null or length(btrim(p_name)) not between 1 and 120 then raise exception 'Invalid form name'; end if;
  perform public.validate_mentorship_application_form_config(p_config);
  select * into current_form from public.mentorship_application_forms where id=p_form_id for update;
  if not found then raise exception 'Form not found' using errcode='P0404'; end if;
  if current_form.draft_version<>p_expected_version then raise exception 'Draft changed; reload before saving' using errcode='P0409'; end if;
  update public.mentorship_application_forms set name=btrim(p_name),draft_config=p_config,draft_version=draft_version+1,updated_at=now()
    where id=p_form_id returning * into saved;
  return to_jsonb(saved);
end $$;
revoke all on function public.save_mentorship_application_form(text,integer,text,jsonb) from public,anon;
grant execute on function public.save_mentorship_application_form(text,integer,text,jsonb) to authenticated;

create or replace function public.publish_mentorship_application_form(p_form_id text,p_expected_version integer)
returns jsonb language plpgsql security definer set search_path=public as $$
declare current_form public.mentorship_application_forms; saved public.mentorship_application_forms; next_revision integer;
begin
  if not coalesce(public.is_mentorship_application_form_admin(),false) then raise exception 'Admin access required' using errcode='42501'; end if;
  select * into current_form from public.mentorship_application_forms where id=p_form_id for update;
  if not found then raise exception 'Form not found' using errcode='P0404'; end if;
  if current_form.draft_version<>p_expected_version then raise exception 'Draft changed; reload before publishing' using errcode='P0409'; end if;
  perform public.validate_mentorship_application_form_config(current_form.draft_config);
  if not exists(select 1 from public.mentorship_cohorts where id=current_form.cohort_id and status not in ('completed','archived')) then raise exception 'Cohort is not accepting applications'; end if;
  next_revision:=coalesce(current_form.published_revision,0)+1;
  insert into public.mentorship_application_form_revisions(form_id,revision,cohort_id,config,published_by)
    values(current_form.id,next_revision,current_form.cohort_id,current_form.draft_config,auth.uid());
  update public.mentorship_application_forms set published_revision=next_revision,published_draft_version=current_form.draft_version,is_open=true,updated_at=now()
    where id=p_form_id returning * into saved;
  return to_jsonb(saved);
end $$;
revoke all on function public.publish_mentorship_application_form(text,integer) from public,anon;
grant execute on function public.publish_mentorship_application_form(text,integer) to authenticated;

create or replace function public.set_mentorship_application_form_open(p_form_id text,p_open boolean)
returns jsonb language plpgsql security definer set search_path=public as $$
declare current_form public.mentorship_application_forms; saved public.mentorship_application_forms;
begin
  if not coalesce(public.is_mentorship_application_form_admin(),false) then raise exception 'Admin access required' using errcode='42501'; end if;
  select * into current_form from public.mentorship_application_forms where id=p_form_id for update;
  if not found then raise exception 'Form not found' using errcode='P0404'; end if;
  if p_open is null then raise exception 'Choose whether the form should be open'; end if;
  if p_open and (current_form.published_revision is null or not exists(select 1 from public.mentorship_cohorts where id=current_form.cohort_id and status not in ('completed','archived'))) then raise exception 'Form cannot be opened'; end if;
  update public.mentorship_application_forms set is_open=p_open,updated_at=now() where id=p_form_id returning * into saved;
  return to_jsonb(saved);
end $$;
revoke all on function public.set_mentorship_application_form_open(text,boolean) from public,anon;
grant execute on function public.set_mentorship_application_form_open(text,boolean) to authenticated;

create or replace function public.get_public_mentorship_application_form(p_slug text default null)
returns jsonb language plpgsql security definer set search_path=public as $$
declare f public.mentorship_application_forms; r public.mentorship_application_form_revisions;
begin
  if coalesce(auth.role(),'')<>'service_role' then raise exception 'Service access required' using errcode='42501'; end if;
  if p_slug is null or p_slug='' then select * into f from public.mentorship_application_forms where id='cohort-2-v1';
  else select * into f from public.mentorship_application_forms where slug=p_slug; end if;
  if not found or not f.is_open or f.published_revision is null or not exists(select 1 from public.mentorship_cohorts where id=f.cohort_id and status not in ('completed','archived')) then raise exception 'Applications are unavailable' using errcode='P0404'; end if;
  select * into r from public.mentorship_application_form_revisions where form_id=f.id and revision=f.published_revision;
  return jsonb_build_object('id',f.id,'name',f.name,'slug',f.slug,'revision',r.revision,'config',r.config);
end $$;
revoke all on function public.get_public_mentorship_application_form(text) from public,anon,authenticated;
grant execute on function public.get_public_mentorship_application_form(text) to service_role;

create or replace function public.get_mentorship_application_form_revision(p_form_id text,p_revision integer)
returns jsonb language plpgsql security definer set search_path=public as $$
declare f public.mentorship_application_forms; r public.mentorship_application_form_revisions;
begin
  if coalesce(auth.role(),'')<>'service_role' then raise exception 'Service access required' using errcode='42501'; end if;
  select * into f from public.mentorship_application_forms where id=p_form_id;
  if not found or not f.is_open or not exists(select 1 from public.mentorship_cohorts where id=f.cohort_id and status not in ('completed','archived')) then raise exception 'Applications are unavailable' using errcode='P0404'; end if;
  select * into r from public.mentorship_application_form_revisions where form_id=p_form_id and revision=p_revision;
  if not found then raise exception 'Form revision not found' using errcode='P0404'; end if;
  return jsonb_build_object('form_id',f.id,'revision',r.revision,'cohort_id',r.cohort_id,'config',r.config);
end $$;
revoke all on function public.get_mentorship_application_form_revision(text,integer) from public,anon,authenticated;
grant execute on function public.get_mentorship_application_form_revision(text,integer) to service_role;

-- Current published native copy is revision one. Draft and snapshot begin identically.
insert into public.mentorship_application_forms(id,name,slug,cohort_id,draft_config,draft_version,published_revision,published_draft_version,is_open)
values('cohort-2-v1','Cohort 2','cohort-2','faa94fb4-dcf0-4d96-9369-d834c71fb0c2',
  '{"welcome":{"eyebrow":"Apply for cohort 2","title":"LET’S HEAR ABOUT YOU.","description":"Tell me where you’re at with your music and what you want to work on. I’ll use your answers to see whether the mentorship is right for you.","buttonText":"Start application"},"identity":{"title":"WORK DIRECTLY WITH ROB LATE.","description":"Six weeks of making music, with my feedback on your work.","cohortLabel":"Cohort 02 / Application","details":["6 weeks","12 places","$2,497 USD"]},"completion":{"title":"THANKS FOR TELLING ME ABOUT YOUR MUSIC.","description":"We’ll review your application and get back to you at {email}. Keep an eye on your inbox."},"questions":[{"key":"name","title":"What''s your name?","description":"Let''s start with what we should call you.","placeholder":"Your full name","section":"About you","type":"text","required":true,"maxLength":160},{"key":"email","title":"What''s your email address?","description":"We''ll get back to you here about your application.","placeholder":"you@example.com","section":"About you","type":"email","required":true,"maxLength":254},{"key":"social","title":"What''s your social media handle?","description":"Include the platform if it isn''t Instagram.","placeholder":"@yourhandle","section":"About you","type":"text","required":false,"maxLength":120},{"key":"music","title":"Got any music we can listen to?","description":"Spotify, SoundCloud, YouTube or a private listening link. Make sure we can play it.","placeholder":"Paste your music links here…","section":"Your music","type":"textarea","required":false,"maxLength":2048},{"key":"experience","title":"How long have you been producing?","description":"This helps me understand where you''re starting from.","placeholder":"","section":"Your music","type":"choice","required":false,"options":["Less than 1 year","1–3 years","3–5 years","5–10 years","10+ years","Returning after a break"],"maxLength":100},{"key":"goal","title":"What''s your goal with music?","description":"Pick the one that best describes what you''re working towards.","placeholder":"","section":"Your goals","type":"choice","required":false,"options":["Full-time career","Side income alongside my job","Serious hobby"],"maxLength":100},{"key":"struggles","title":"What are the 3 main struggles holding you back with your music?","description":"Tell me where you get stuck. The more specific you can be, the better.","placeholder":"The things I want help with are…","section":"Your goals","type":"textarea","required":false,"maxLength":2000},{"key":"income","title":"How much are you currently making from music?","description":"This gives me a little more context about where you''re at. Amounts are in US dollars.","placeholder":"","section":"Your goals","type":"choice","required":false,"options":["$0","Under $1k/month","$1–5k/month","$5k+/month"],"maxLength":100},{"key":"investment","title":"The six-week mentorship is $2,497 USD. Are you ready to invest?","description":"Applying doesn''t take a payment or reserve a place. We''ll review your application first.","placeholder":"","section":"Your place","type":"choice","required":true,"options":["Yes, I''m ready","I have questions first","Not right now"],"maxLength":100},{"key":"source","title":"How did you hear about Rob?","description":"Where did you first discover my work?","placeholder":"","section":"Your place","type":"choice","required":false,"options":["Instagram","YouTube","Friend/word of mouth","Other"],"maxLength":100}]}',1,1,1,true);
insert into public.mentorship_application_form_revisions(form_id,revision,cohort_id,config,published_by)
select id,1,cohort_id,draft_config,null from public.mentorship_application_forms where id='cohort-2-v1';

alter table public.mentorship_applications add column form_revision integer not null default 1 check(form_revision>0);

-- The old seven-argument RPC is replaced, not overloaded. The default revision preserves
-- legacy callers while the new edge function supplies the immutable revision explicitly.
drop function public.submit_mentorship_application(text,uuid,jsonb,jsonb,jsonb,text,text);
create function public.submit_mentorship_application(
  p_form_id text,p_submission_id uuid,p_lead jsonb,p_answers jsonb,p_attribution jsonb,p_ip_hash text,p_email_hash text,p_form_revision integer default 1
) returns jsonb language plpgsql security definer set search_path=public as $$
declare
  f public.mentorship_application_forms;
  r public.mentorship_application_form_revisions;
  prior public.mentorship_applications;
  intake_result jsonb;
  contact_email text;
  answers_input jsonb;
  stored_answers jsonb:='[]'::jsonb;
  question jsonb;
  answer_value text;
  rate_count integer;
  digest text;
  submitted_at timestamptz:=now();
  summary text:='Native mentorship application submitted';
begin
  if coalesce(auth.role(),'')<>'service_role' then raise exception 'Service access required' using errcode='42501'; end if;
  if p_form_id is null or length(p_form_id) not between 1 and 100 or p_submission_id is null or p_form_revision is null or p_form_revision<1 then raise exception 'Invalid application'; end if;
  if p_ip_hash is null or p_ip_hash !~ '^[0-9a-f]{64}$' or p_email_hash is null or p_email_hash !~ '^[0-9a-f]{64}$' then raise exception 'Invalid request'; end if;
  answers_input:=p_answers;
  -- The prior edge function sent [{key,question,answer}]. Accept that shape for
  -- the seeded form during rollout; labels are regenerated from the snapshot.
  if jsonb_typeof(p_answers)='array' then
    if p_form_id<>'cohort-2-v1' or p_form_revision<>1 or exists(
      select 1 from jsonb_array_elements(p_answers) item
      where jsonb_typeof(item) is distinct from 'object'
        or not (item ?& array['key','question','answer'])
        or exists(select 1 from jsonb_object_keys(item) k where k not in ('key','question','answer'))
        or jsonb_typeof(item->'key') is distinct from 'string'
        or jsonb_typeof(item->'question') is distinct from 'string'
        or jsonb_typeof(item->'answer') is distinct from 'string'
    ) then raise exception 'Invalid legacy application answers'; end if;
    if jsonb_array_length(p_answers)>30 or (select count(*) from jsonb_array_elements(p_answers))<>(select count(distinct item->>'key') from jsonb_array_elements(p_answers) item) then raise exception 'Invalid legacy application answers'; end if;
    select coalesce(jsonb_object_agg(item->>'key',item->'answer'),'{}'::jsonb) into answers_input from jsonb_array_elements(p_answers) item;
  end if;
  if coalesce(jsonb_typeof(answers_input),'')<>'object' or octet_length(answers_input::text)>250000 or coalesce(jsonb_typeof(p_attribution),'')<>'object' or octet_length(p_attribution::text)>12000 then raise exception 'Invalid application'; end if;
  perform pg_advisory_xact_lock(hashtextextended('native-submission:'||p_form_id||':'||p_submission_id::text,0));
  select * into prior from public.mentorship_applications where form_id=p_form_id and response_id=p_submission_id::text;

  select * into f from public.mentorship_application_forms where id=p_form_id for share;
  if not found or not f.is_open or not exists(select 1 from public.mentorship_cohorts where id=f.cohort_id and status not in ('completed','archived')) then raise exception 'Applications are unavailable' using errcode='P0404'; end if;
  select * into r from public.mentorship_application_form_revisions where form_id=p_form_id and revision=p_form_revision;
  if not found then raise exception 'Form revision not found' using errcode='P0404'; end if;
  perform public.validate_mentorship_application_form_config(r.config);
  if exists(select 1 from jsonb_object_keys(answers_input) as answer_keys(key) where not exists(select 1 from jsonb_array_elements(r.config->'questions') q where q->>'key'=answer_keys.key)) then raise exception 'Unexpected answer key'; end if;
  for question in select value from jsonb_array_elements(r.config->'questions') loop
    answer_value:=coalesce(answers_input->>(question->>'key'),'');
    if question->>'key'='email' then answer_value:=lower(btrim(answer_value)); end if;
    if length(answer_value)>(question->>'maxLength')::integer or (question->'required'='true'::jsonb and length(btrim(answer_value))=0) then raise exception 'Invalid application answer'; end if;
    if question->>'type'='email' and answer_value<>'' and (answer_value !~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$' or length(answer_value)>254) then raise exception 'Invalid application email'; end if;
    if question->>'type'='choice' and answer_value<>'' and not exists(select 1 from jsonb_array_elements_text(question->'options') as choices(value) where choices.value=answer_value) then raise exception 'Invalid application choice'; end if;
    stored_answers:=stored_answers||jsonb_build_array(jsonb_build_object('key',question->>'key','question',question->>'title','answer',btrim(answer_value)));
  end loop;
  contact_email:=lower(btrim(answers_input->>'email'));
  if contact_email is null or contact_email='' then raise exception 'Invalid application email'; end if;
  if prior.id is not null then
    if prior.answers<>stored_answers or prior.attribution<>p_attribution or prior.form_revision<>p_form_revision then raise exception 'Submission ID conflict' using errcode='22000'; end if;
    return jsonb_build_object('success',true,'submission_id',p_submission_id);
  end if;

  for digest in select item from unnest(array['ip:'||p_ip_hash,'email:'||p_email_hash]) as locks(item) order by item loop
    perform pg_advisory_xact_lock(hashtextextended('native-rate:'||digest,0));
  end loop;
  delete from public.mentorship_application_rate_limits where hit_at<now()-interval '1 hour';
  select count(*) into rate_count from public.mentorship_application_rate_limits where key_type='ip' and key_hash=p_ip_hash and hit_at>=now()-interval '1 hour';
  if rate_count>=20 then raise exception 'Application rate limit exceeded' using errcode='P0408'; end if;
  select count(*) into rate_count from public.mentorship_application_rate_limits where key_type='email' and key_hash=p_email_hash and hit_at>=now()-interval '1 hour';
  if rate_count>=5 then raise exception 'Application rate limit exceeded' using errcode='P0408'; end if;
  insert into public.mentorship_application_rate_limits(key_type,key_hash) values('ip',p_ip_hash),('email',p_email_hash);

  p_lead:=p_lead||jsonb_build_object('full_name',btrim(p_answers->>'name'),'email',contact_email,'source',left(coalesce(nullif(btrim(p_answers->>'source'),''),'Not recorded'),100),'stage','applied','due_on',current_date);
  intake_result:=public.ingest_mentorship_lead(r.cohort_id,'native',p_form_id||':'||p_submission_id::text,p_lead,submitted_at,summary);
  insert into public.mentorship_applications(lead_id,form_id,response_id,submitted_at,answers,attribution,form_revision)
    values((intake_result->>'lead_id')::uuid,p_form_id,p_submission_id::text,submitted_at,stored_answers,p_attribution,p_form_revision);
  update public.mentorship_intake_connections set last_received_at=now() where cohort_id=r.cohort_id and provider='native';
  return jsonb_build_object('success',true,'submission_id',p_submission_id);
end $$;
revoke all on function public.submit_mentorship_application(text,uuid,jsonb,jsonb,jsonb,text,text,integer) from public,anon,authenticated;
grant execute on function public.submit_mentorship_application(text,uuid,jsonb,jsonb,jsonb,text,text,integer) to service_role;
