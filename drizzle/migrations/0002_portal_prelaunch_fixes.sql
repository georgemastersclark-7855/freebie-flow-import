-- Portal pre-launch fixes and Shopify payment to portal access.
--
-- Apply AFTER 20261029090000_mentorship_reapply_review_queue.sql and
-- 20261031170000_cohort_planner_application_close.sql (both are in this folder and were
-- unapplied when this was written; this file does not depend on them).
--
-- Safe to run once in one go: everything is in a single transaction, and every step is
-- written to be a no-op if it has already been applied.
--
--   (a) Only admins can change roles, add or delete profiles, or add or delete enrolments.
--   (b) mentorship_resources.download_url (the Master Bundle link) with an HTTPS check.
--   (c) Cohort 2 week 5 becomes "Finish your track"; week 6 becomes "Final call" with no uploads.
--   (d) Onboarding task text says WhatsApp group / group chat, not Circle.
--   (e) The test student is NOT touched here. See supabase/manual/retire_test_student_georgemastersclark.sql.
--   (f) The two migrations above replace live functions; live definitions matched the repo on
--       1 Nov 2026, so there was no drift to reconcile.
--   (g) HTTPS checks on student-facing links.
--   (h) Shopify orders: processed-order log, account lookup and the order RPCs.
--   (i) Staff "Grant portal access" RPC.

-- ---------------------------------------------------------------------------------------------
-- (a) Role escalation fix
-- ---------------------------------------------------------------------------------------------
create or replace function public.is_mentorship_admin()
returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.mentorship_profiles where user_id=auth.uid() and role='admin');
$$;
revoke all on function public.is_mentorship_admin() from public, anon;
grant execute on function public.is_mentorship_admin() to authenticated, service_role;

-- Signed-in users who are not admins cannot set or change a role. Service-role edge functions,
-- the auth sign-up trigger and migrations run without auth.uid(), so they are unaffected.
create or replace function public.guard_mentorship_profile_role()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  if auth.uid() is not null and not public.is_mentorship_admin() then
    if TG_OP='INSERT' and NEW.role<>'student' then
      raise exception 'Only an admin can give someone a staff role' using errcode='42501';
    elsif TG_OP='UPDATE' and NEW.role is distinct from OLD.role then
      raise exception 'Only an admin can change a role' using errcode='42501';
    end if;
  end if;
  if TG_OP='UPDATE' and OLD.role='admin' and NEW.role<>'admin'
     and not exists(select 1 from public.mentorship_profiles where role='admin' and user_id<>OLD.user_id) then
    raise exception 'Keep at least one admin' using errcode='42501';
  end if;
  return NEW;
end $$;
revoke all on function public.guard_mentorship_profile_role() from public, anon, authenticated;
drop trigger if exists guard_mentorship_profile_role on public.mentorship_profiles;
create trigger guard_mentorship_profile_role before insert or update on public.mentorship_profiles
for each row execute function public.guard_mentorship_profile_role();

-- Staff can still edit an enrolment's status, but only an admin can move it to another person
-- or cohort, or turn a real enrolment into a staff test one (or back).
create or replace function public.guard_mentorship_enrollment_identity()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  if auth.uid() is not null and not public.is_mentorship_admin()
     and (NEW.user_id is distinct from OLD.user_id or NEW.cohort_id is distinct from OLD.cohort_id
          or NEW.is_walkthrough is distinct from OLD.is_walkthrough) then
    raise exception 'Only an admin can move an enrolment to another person or cohort' using errcode='42501';
  end if;
  return NEW;
end $$;
revoke all on function public.guard_mentorship_enrollment_identity() from public, anon, authenticated;
drop trigger if exists guard_mentorship_enrollment_identity on public.mentorship_enrollments;
create trigger guard_mentorship_enrollment_identity before update on public.mentorship_enrollments
for each row execute function public.guard_mentorship_enrollment_identity();

-- Replace the "staff can do anything" policies. Reading is unchanged: the existing
-- "Mentorship users view own profile" and "...view own enrollment" policies already let
-- staff read every row and students read their own.
drop policy if exists "Mentorship staff manage profiles" on public.mentorship_profiles;
drop policy if exists "Mentorship staff update profiles" on public.mentorship_profiles;
drop policy if exists "Mentorship admins add profiles" on public.mentorship_profiles;
drop policy if exists "Mentorship admins delete profiles" on public.mentorship_profiles;
create policy "Mentorship staff update profiles" on public.mentorship_profiles
for update to authenticated using (public.is_mentorship_staff()) with check (public.is_mentorship_staff());
create policy "Mentorship admins add profiles" on public.mentorship_profiles
for insert to authenticated with check (public.is_mentorship_admin());
create policy "Mentorship admins delete profiles" on public.mentorship_profiles
for delete to authenticated using (public.is_mentorship_admin());

drop policy if exists "Mentorship staff manage enrollments" on public.mentorship_enrollments;
drop policy if exists "Mentorship staff update enrollments" on public.mentorship_enrollments;
drop policy if exists "Mentorship admins add enrollments" on public.mentorship_enrollments;
drop policy if exists "Mentorship admins delete enrollments" on public.mentorship_enrollments;
create policy "Mentorship staff update enrollments" on public.mentorship_enrollments
for update to authenticated using (public.is_mentorship_staff()) with check (public.is_mentorship_staff());
create policy "Mentorship admins add enrollments" on public.mentorship_enrollments
for insert to authenticated with check (public.is_mentorship_admin());
create policy "Mentorship admins delete enrollments" on public.mentorship_enrollments
for delete to authenticated using (public.is_mentorship_admin());

-- ---------------------------------------------------------------------------------------------
-- (b) Master Bundle download link
-- ---------------------------------------------------------------------------------------------
alter table public.mentorship_resources add column if not exists download_url text;
do $$ begin
  if not exists(select 1 from pg_constraint where conname='mentorship_resources_download_url_https'
                and conrelid='public.mentorship_resources'::regclass) then
    alter table public.mentorship_resources add constraint mentorship_resources_download_url_https
      check (download_url is null or (length(download_url)<=2048
        and download_url ~ '^https://[^[:space:]/?#@]+([/?#][^[:space:]]*)?$'));
  end if;
end $$;
comment on column public.mentorship_resources.download_url is
  'Optional HTTPS download link. On the sound-library resource it is the Master Bundle download.';

-- ---------------------------------------------------------------------------------------------
-- (c) Week 5 = finish the track, week 6 = final call with nothing to upload (cohort 2).
-- Dates are left to the cohort planner: it already sets week 5's deadline to the Thursday
-- (17 Dec, 23:59 UK) and week 6's to the final call's start (Sun 20 Dec, 7pm UK).
-- ---------------------------------------------------------------------------------------------
update public.mentorship_weeks w set
  title='Finish your track', short_title='Finish',
  brief='Finish the track you chose in week 4, then send Rob the finished version and its stems by the deadline.',
  required_ideas=0, song_required=true, stems_required=true
from public.mentorship_cohorts c
where c.id=w.cohort_id and c.slug='cohort-2' and w.week_number=5
  and (w.title, w.short_title, w.brief, w.required_ideas, w.song_required, w.stems_required) is distinct from
      ('Finish your track', 'Finish', 'Finish the track you chose in week 4, then send Rob the finished version and its stems by the deadline.', 0::smallint, true, true);

update public.mentorship_weeks w set
  title='Final call', short_title='Final call',
  brief='Join Rob for the final group call. We play and review the finished tracks together. Nothing to upload this week.',
  required_ideas=0, song_required=false, stems_required=false
from public.mentorship_cohorts c
where c.id=w.cohort_id and c.slug='cohort-2' and w.week_number=6
  and (w.title, w.short_title, w.brief, w.required_ideas, w.song_required, w.stems_required) is distinct from
      ('Final call', 'Final call', 'Join Rob for the final group call. We play and review the finished tracks together. Nothing to upload this week.', 0::smallint, false, false);

-- ---------------------------------------------------------------------------------------------
-- (d) No more Circle wording in onboarding tasks. The task key stays 'circle' because the
-- portal code looks it up by that key.
-- ---------------------------------------------------------------------------------------------
update public.mentorship_onboarding_tasks set
  title='Join the WhatsApp group',
  description='Meet the other producers, say hello and ask Rob questions between calls. Announcements go in the group chat throughout the six weeks.',
  action_label='Join the WhatsApp group'
where task_key='circle'
  and (title ~* 'circle' or description ~* 'circle' or coalesce(action_label,'') ~* 'circle');

-- ---------------------------------------------------------------------------------------------
-- (g) HTTPS checks on student-facing links. Live data passed these on 1 Nov 2026. If a bad row
-- appears before this runs, the check still applies to new and edited rows and a notice says
-- which constraint to validate once the row is fixed.
-- ---------------------------------------------------------------------------------------------
do $$
declare item record;
begin
  for item in select * from (values
    ('mentorship_feedback', 'video_url', 'mentorship_feedback_video_url_https'),
    ('mentorship_onboarding_tasks', 'action_url', 'mentorship_onboarding_tasks_action_url_https'),
    ('mentorship_cohorts', 'circle_url', 'mentorship_cohorts_circle_url_https'),
    ('mentorship_calls', 'calendar_url', 'mentorship_calls_calendar_url_https')
  ) as t(tab, col, con) loop
    if not exists(select 1 from pg_constraint where conname=item.con and conrelid=format('public.%I', item.tab)::regclass) then
      execute format('alter table public.%I add constraint %I check (%I is null or (length(%I)<=2048 and %I ~ %L)) not valid',
        item.tab, item.con, item.col, item.col, item.col, '^https://[^[:space:]/?#@]+([/?#][^[:space:]]*)?$');
    end if;
    begin
      execute format('alter table public.%I validate constraint %I', item.tab, item.con);
    exception when check_violation then
      raise notice 'Some existing %.% values are not HTTPS. Fix them, then run: alter table public.% validate constraint %;',
        item.tab, item.col, item.tab, item.con;
    end;
  end loop;
end $$;

-- ---------------------------------------------------------------------------------------------
-- (h) Shopify orders. One row per paid mentorship order: it makes the webhook idempotent and is
-- the list of orders staff need to check (flags or failures), shown in the CRM.
-- ---------------------------------------------------------------------------------------------
create table if not exists public.mentorship_shopify_orders (
  shopify_order_id text primary key check (shopify_order_id ~ '^[0-9]{1,30}$'),
  shop_domain text check (shop_domain is null or length(shop_domain)<=255),
  order_name text check (order_name is null or length(order_name)<=100),
  cohort_id uuid references public.mentorship_cohorts(id),
  email text check (email is null or length(email)<=254),
  lead_id uuid references public.mentorship_leads(id) on delete set null,
  enrollment_id uuid references public.mentorship_enrollments(id) on delete set null,
  payment_id uuid references public.mentorship_lead_payments(id) on delete set null,
  amount_minor bigint,
  currency text,
  test_order boolean not null default false,
  status text not null default 'failed' check (status in ('processed','failed')),
  outcome text check (outcome is null or outcome in ('access_granted','already_enrolled','duplicate_payment','not_granted')),
  flags text[] not null default '{}',
  last_error text check (last_error is null or length(last_error)<=2000),
  attempts integer not null default 1,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid references public.mentorship_profiles(user_id) on delete set null
);
create index if not exists mentorship_shopify_orders_attention_idx on public.mentorship_shopify_orders(received_at desc)
  where reviewed_at is null and (status='failed' or cardinality(flags)>0);
comment on table public.mentorship_shopify_orders is
  'Paid Shopify mentorship orders, written by the shopify-order-paid edge function. Staff read only; staff mark flagged rows as checked.';
alter table public.mentorship_shopify_orders enable row level security;
revoke all on public.mentorship_shopify_orders from public, anon, authenticated;
grant select on public.mentorship_shopify_orders to authenticated;
grant all on public.mentorship_shopify_orders to service_role;
drop policy if exists "Staff read Shopify orders" on public.mentorship_shopify_orders;
create policy "Staff read Shopify orders" on public.mentorship_shopify_orders
for select to authenticated using (public.is_mentorship_staff());

-- Reliable account lookup by email (auth.users is not paginated here). Service role only.
create or replace function public.find_mentorship_auth_user(p_email text)
returns jsonb language plpgsql stable security definer set search_path=public as $$
declare found_user record;
begin
  if coalesce(auth.role(),'')<>'service_role' then raise exception 'Service access required' using errcode='42501'; end if;
  select u.id, u.email_confirmed_at into found_user from auth.users u
  where lower(u.email)=lower(btrim(p_email)) and u.deleted_at is null and not coalesce(u.is_anonymous,false)
  order by u.created_at limit 1;
  if not found then return null; end if;
  return jsonb_build_object('user_id', found_user.id, 'email_confirmed', found_user.email_confirmed_at is not null);
end $$;
revoke all on function public.find_mentorship_auth_user(text) from public, anon, authenticated;
grant execute on function public.find_mentorship_auth_user(text) to service_role;

-- Applies one paid order: enrols the account in the cohort, matches and updates the CRM lead,
-- records the payment like the staff "Record payment" button, and stores the order with any
-- flags for staff. The account must already exist (the edge function creates it).
create or replace function public.apply_mentorship_shopify_order(p_order jsonb, p_user_id uuid)
returns jsonb language plpgsql security definer set search_path=public as $$
declare
  v_order_id text:=nullif(btrim(p_order->>'order_id'),'');
  v_order_name text:=left(nullif(btrim(p_order->>'order_name'),''),100);
  v_label text;
  v_shop text:=left(nullif(lower(btrim(p_order->>'shop_domain')),''),255);
  v_email text:=lower(btrim(coalesce(p_order->>'email','')));
  v_name text:=left(nullif(btrim(p_order->>'full_name'),''),160);
  v_slug text:=coalesce(nullif(btrim(p_order->>'cohort_slug'),''),'cohort-2');
  v_app text:=left(nullif(btrim(p_order->>'application_id'),''),300);
  v_amount bigint;
  v_currency text:=upper(nullif(btrim(p_order->>'currency'),''));
  v_paid_at timestamptz:=coalesce(nullif(p_order->>'paid_at','')::timestamptz, now());
  v_paid_on date;
  v_test boolean:=coalesce((p_order->>'test')::boolean,false);
  v_flags text[]:=array[]::text[];
  previous public.mentorship_shopify_orders;
  target_cohort public.mentorship_cohorts;
  account public.mentorship_profiles;
  enrolment public.mentorship_enrollments;
  contact public.mentorship_leads;
  previous_status public.mentorship_enrollment_status;
  v_payment_id uuid;
  v_outcome text;
  v_granted boolean:=false;
  v_app_matched boolean:=false;
  v_app_lead_id uuid;
  v_note text;
begin
  if coalesce(auth.role(),'')<>'service_role' then raise exception 'Service access required' using errcode='42501'; end if;
  if v_order_id is null or v_order_id !~ '^[0-9]{1,30}$' then raise exception 'Invalid Shopify order id'; end if;
  if length(v_email)>254 or v_email !~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$' then raise exception 'A valid order email is required'; end if;
  if p_user_id is null then raise exception 'An account is required'; end if;
  v_label:=coalesce(v_order_name, v_order_id);
  -- Flags the edge function noticed in the order itself (other products, quantity and so on).
  if jsonb_typeof(p_order->'flags')='array' then
    v_flags:=array(select left(value,500) from jsonb_array_elements_text(p_order->'flags') limit 20);
  end if;
  begin
    v_amount:=nullif(p_order->>'amount_minor','')::bigint;
  exception when others then v_amount:=null;
  end;

  -- One delivery at a time per order; replays of a processed order change nothing.
  perform pg_advisory_xact_lock(hashtextextended('shopify-order:'||v_order_id,0));
  select * into previous from public.mentorship_shopify_orders where shopify_order_id=v_order_id for update;
  if found and previous.status='processed' then
    return jsonb_build_object('duplicate_delivery',true,'outcome',previous.outcome,'enrollment_id',previous.enrollment_id,
      'lead_id',previous.lead_id,'flags',to_jsonb(previous.flags),'access_granted',false);
  end if;

  if not exists(select 1 from auth.users u where u.id=p_user_id and lower(u.email)=v_email) then
    raise exception 'The account does not match the order email';
  end if;
  select * into target_cohort from public.mentorship_cohorts where slug=v_slug;
  if not found then raise exception 'Cohort % was not found', v_slug; end if;
  if target_cohort.status in ('archived','completed') then raise exception 'Cohort % is not accepting enrolments', v_slug; end if;

  -- One enrolment change at a time per person and cohort, whichever order or staff action it is.
  perform pg_advisory_xact_lock(hashtextextended('mentorship-enrol:'||target_cohort.id::text||':'||p_user_id::text,0));

  if v_test then v_flags:=array_append(v_flags, 'Shopify test order: access was granted. Remove it if this was only a test.'); end if;

  -- Profile: create it as a student if the sign-up trigger has not. Never change an existing role.
  select * into account from public.mentorship_profiles where user_id=p_user_id for update;
  if not found then
    insert into public.mentorship_profiles(user_id,full_name,email,role)
    values(p_user_id, coalesce(v_name, split_part(v_email,'@',1)), v_email, 'student')
    returning * into account;
  elsif account.role in ('coach','admin') then
    v_flags:=array_append(v_flags, 'This email belongs to a staff account. Its role was not changed.');
  end if;

  -- Enrolment: never a second one. A second paid order keeps the first order id and is flagged.
  select * into enrolment from public.mentorship_enrollments where cohort_id=target_cohort.id and user_id=p_user_id for update;
  if not found then
    insert into public.mentorship_enrollments(cohort_id,user_id,status,shopify_order_id,application_id)
    values(target_cohort.id, p_user_id, 'active', v_order_id, v_app)
    returning * into enrolment;
    v_granted:=true; v_outcome:='access_granted';
  elsif enrolment.is_walkthrough then
    v_flags:=array_append(v_flags, 'This account only has a staff test enrolment in this cohort, so no student access was added.');
    v_outcome:='not_granted';
  else
    previous_status:=enrolment.status;
    if enrolment.shopify_order_id is not null and enrolment.shopify_order_id<>v_order_id then
      v_flags:=array_append(v_flags, format('Second payment: this student was already enrolled from Shopify order %s. Check whether a refund is due.', enrolment.shopify_order_id));
      v_outcome:='duplicate_payment';
    else
      v_outcome:='already_enrolled';
    end if;
    if previous_status='completed' then
      v_flags:=array_append(v_flags, 'This enrolment is marked completed, so it was left as it is.');
      update public.mentorship_enrollments set shopify_order_id=coalesce(shopify_order_id,v_order_id), application_id=coalesce(application_id,v_app)
      where id=enrolment.id returning * into enrolment;
    else
      update public.mentorship_enrollments set shopify_order_id=coalesce(shopify_order_id,v_order_id),
        application_id=coalesce(application_id,v_app), status='active'
      where id=enrolment.id returning * into enrolment;
      if previous_status<>'active' then
        v_granted:=true; v_outcome:=case when v_outcome='duplicate_payment' then v_outcome else 'access_granted' end;
        v_flags:=array_append(v_flags, 'Access was switched back on: this enrolment had been made inactive.');
      end if;
    end if;
  end if;

  -- CRM lead: the order's application_id first (a lead id, application id or response id), then email.
  if v_app is not null then
    select l.id into v_app_lead_id from public.mentorship_leads l
    where l.cohort_id=target_cohort.id and (l.id::text=v_app or l.id in (
      select a.lead_id from public.mentorship_applications a where a.id::text=v_app or a.response_id=v_app))
    limit 1;
    if v_app_lead_id is not null then
      select * into contact from public.mentorship_leads where id=v_app_lead_id for update;
      v_app_matched:=true;
      if contact.email<>v_email then
        v_flags:=array_append(v_flags, format('Paid with a different email (%s) from the one on their application (%s). Their CRM lead was not linked to the student record.', v_email, contact.email));
      end if;
    else
      v_flags:=array_append(v_flags, 'The order''s application_id did not match an application, so the lead was matched by email.');
    end if;
  end if;
  if not v_app_matched then
    select * into contact from public.mentorship_leads where cohort_id=target_cohort.id and email=v_email for update;
  end if;
  if contact.id is null then
    insert into public.mentorship_leads(cohort_id,full_name,email,stage,source,source_detail,first_contact_channel,next_action,due_on)
    values(target_cohort.id, left(coalesce(v_name, v_email),160), v_email, 'new', 'Not recorded', 'Shopify order '||v_label, 'Other',
      'Paid with an email we don''t have an application for. Check who this is.', current_date)
    on conflict(cohort_id,email) do nothing;
    select * into contact from public.mentorship_leads where cohort_id=target_cohort.id and email=v_email for update;
    v_flags:=array_append(v_flags, 'Paid with an email we don''t have an application for. A lead was added for them.');
  end if;
  -- The new-enrolment trigger usually links the lead already; this covers existing enrolments.
  if contact.enrollment_id is null and contact.email=lower(account.email) and not enrolment.is_walkthrough then
    update public.mentorship_leads set enrollment_id=enrolment.id where id=contact.id and enrollment_id is null;
  end if;

  -- Payment ledger, the same record the staff "Record payment" button makes.
  if v_amount is null or v_amount<1 then
    v_flags:=array_append(v_flags, 'The order total was zero, so no payment amount was recorded.');
  elsif v_amount>100000000 then
    v_flags:=array_append(v_flags, 'The order amount is above the ledger limit, so no payment amount was recorded.');
  elsif v_currency is null or v_currency not in ('USD','GBP','EUR','CAD','AUD','AED') then
    v_flags:=array_append(v_flags, format('The order currency (%s) is not in the payment ledger. Record the amount by hand.', coalesce(v_currency,'none')));
  elsif exists(select 1 from public.mentorship_lead_payments p where p.provider='shopify' and p.kind='payment' and p.voided_at is null
               and p.reference in (v_order_id, v_label, '#'||ltrim(v_label,'#'), ltrim(v_label,'#'))) then
    v_flags:=array_append(v_flags, 'A payment for this order was already recorded by hand, so no second record was added.');
  else
    v_paid_on:=least((v_paid_at at time zone 'Europe/London')::date, current_date);
    insert into public.mentorship_lead_payments(lead_id,cohort_id,kind,amount_minor,currency,paid_on,provider,reference,note,created_by)
    values(contact.id, target_cohort.id, 'payment', v_amount, v_currency, v_paid_on, 'shopify', v_order_id,
      'Shopify order '||v_label||', recorded automatically', null)
    on conflict(provider,reference,kind) do nothing
    returning id into v_payment_id;
    if v_payment_id is null then
      v_flags:=array_append(v_flags, 'A payment with this Shopify order id already exists on another record. Check the payment ledger.');
    else
      insert into public.mentorship_lead_activity(lead_id,kind,body,actor_id)
      values(contact.id,'note','Payment recorded: '||v_currency||' '||to_char(v_amount/100.0,'FM9999999990.00')||' · shopify · '||v_order_id||' · '||v_paid_on,null);
    end if;
  end if;

  v_note:=case
    when v_outcome='access_granted' then 'Portal access granted from Shopify order '||v_label||'. They sign in with a code sent to '||v_email||'.'
    when v_outcome='duplicate_payment' then 'Shopify order '||v_label||' received for a student who was already enrolled.'
    when v_outcome='not_granted' then 'Shopify order '||v_label||' received, but no student access was added.'
    else 'Shopify order '||v_label||' received. They already had portal access.' end;
  if cardinality(v_flags)>0 then v_note:=v_note||E'\nNeeds a look:\n- '||array_to_string(v_flags,E'\n- '); end if;
  insert into public.mentorship_lead_activity(lead_id,kind,body,actor_id) values(contact.id,'note',left(v_note,6000),null);

  insert into public.mentorship_shopify_orders as o(shopify_order_id,shop_domain,order_name,cohort_id,email,lead_id,enrollment_id,payment_id,
    amount_minor,currency,test_order,status,outcome,flags,last_error,attempts,processed_at)
  values(v_order_id,v_shop,v_order_name,target_cohort.id,v_email,contact.id,enrolment.id,v_payment_id,
    v_amount,v_currency,v_test,'processed',v_outcome,v_flags,null,1,now())
  on conflict(shopify_order_id) do update set shop_domain=excluded.shop_domain, order_name=excluded.order_name,
    cohort_id=excluded.cohort_id, email=excluded.email, lead_id=excluded.lead_id, enrollment_id=excluded.enrollment_id,
    payment_id=excluded.payment_id, amount_minor=excluded.amount_minor, currency=excluded.currency, test_order=excluded.test_order,
    status='processed', outcome=excluded.outcome, flags=excluded.flags, last_error=null, attempts=o.attempts+1, processed_at=now(),
    reviewed_at=null, reviewed_by=null;

  return jsonb_build_object('duplicate_delivery',false,'outcome',v_outcome,'access_granted',v_granted,
    'enrollment_id',enrolment.id,'lead_id',contact.id,'flags',to_jsonb(v_flags),
    'cohort_slug',target_cohort.slug,'cohort_name',target_cohort.display_name);
end $$;
revoke all on function public.apply_mentorship_shopify_order(jsonb,uuid) from public, anon, authenticated;
grant execute on function public.apply_mentorship_shopify_order(jsonb,uuid) to service_role;

-- Records a failed delivery so staff see it in the CRM. Never overwrites a processed order.
create or replace function public.log_mentorship_shopify_failure(p_order jsonb, p_error text)
returns void language plpgsql security definer set search_path=public as $$
declare v_order_id text:=nullif(btrim(p_order->>'order_id'),'');
begin
  if coalesce(auth.role(),'')<>'service_role' then raise exception 'Service access required' using errcode='42501'; end if;
  if v_order_id is null or v_order_id !~ '^[0-9]{1,30}$' then raise exception 'Invalid Shopify order id'; end if;
  insert into public.mentorship_shopify_orders as o(shopify_order_id,shop_domain,order_name,cohort_id,email,test_order,status,last_error)
  values(v_order_id, left(nullif(lower(btrim(p_order->>'shop_domain')),''),255), left(nullif(btrim(p_order->>'order_name'),''),100),
    (select id from public.mentorship_cohorts where slug=nullif(btrim(p_order->>'cohort_slug'),'')),
    left(nullif(lower(btrim(p_order->>'email')),''),254), coalesce((p_order->>'test')::boolean,false), 'failed', left(coalesce(p_error,'Unknown error'),2000))
  on conflict(shopify_order_id) do update set last_error=excluded.last_error, attempts=o.attempts+1,
    email=coalesce(excluded.email,o.email), order_name=coalesce(excluded.order_name,o.order_name),
    cohort_id=coalesce(excluded.cohort_id,o.cohort_id), reviewed_at=null, reviewed_by=null
  where o.status<>'processed';
end $$;
revoke all on function public.log_mentorship_shopify_failure(jsonb,text) from public, anon, authenticated;
grant execute on function public.log_mentorship_shopify_failure(jsonb,text) to service_role;

-- Staff mark a flagged or failed order as checked, which removes it from the CRM list.
create or replace function public.review_mentorship_shopify_order(p_order_id text)
returns void language plpgsql security definer set search_path=public as $$
begin
  if not coalesce(public.is_mentorship_staff(),false) then raise exception 'Staff access required' using errcode='42501'; end if;
  update public.mentorship_shopify_orders set reviewed_at=now(), reviewed_by=auth.uid()
  where shopify_order_id=p_order_id and reviewed_at is null;
  if not found then raise exception 'Order not found or already checked'; end if;
end $$;
revoke all on function public.review_mentorship_shopify_order(text) from public, anon;
grant execute on function public.review_mentorship_shopify_order(text) to authenticated;

-- ---------------------------------------------------------------------------------------------
-- (i) Staff backstop: give a CRM lead portal access by hand (bank transfer, webhook outage).
-- Called by the grant-mentorship-access edge function with the staff member's own sign-in,
-- after that function has made sure an account exists for the lead's email.
-- ---------------------------------------------------------------------------------------------
create or replace function public.grant_mentorship_portal_access(p_lead_id uuid)
returns jsonb language plpgsql security definer set search_path=public as $$
declare
  contact public.mentorship_leads;
  target_cohort public.mentorship_cohorts;
  account public.mentorship_profiles;
  enrolment public.mentorship_enrollments;
  v_already boolean:=false;
  v_reactivated boolean:=false;
begin
  if not coalesce(public.is_mentorship_staff(),false) then raise exception 'Staff access required' using errcode='42501'; end if;
  select * into contact from public.mentorship_leads where id=p_lead_id;
  if not found then raise exception 'Lead not found' using errcode='P0002'; end if;
  select * into target_cohort from public.mentorship_cohorts where id=contact.cohort_id;
  if target_cohort.status in ('archived','completed') then raise exception 'This cohort is not accepting enrolments'; end if;
  select * into account from public.mentorship_profiles where email=contact.email;
  if not found then raise exception 'There is no portal account for this email yet' using errcode='P0002'; end if;
  -- Same lock order as the Shopify webhook (enrolment lock, then lead row) so the two cannot deadlock.
  perform pg_advisory_xact_lock(hashtextextended('mentorship-enrol:'||target_cohort.id::text||':'||account.user_id::text,0));
  select * into contact from public.mentorship_leads where id=p_lead_id for update;
  select * into enrolment from public.mentorship_enrollments where cohort_id=target_cohort.id and user_id=account.user_id for update;
  if not found then
    insert into public.mentorship_enrollments(cohort_id,user_id,status) values(target_cohort.id,account.user_id,'active') returning * into enrolment;
  elsif enrolment.is_walkthrough then
    raise exception 'This email belongs to a staff test enrolment';
  elsif enrolment.status='active' then
    v_already:=true;
  else
    update public.mentorship_enrollments set status='active' where id=enrolment.id returning * into enrolment;
    v_reactivated:=true;
  end if;
  -- A new enrolment is linked by its insert trigger; this covers an existing one.
  update public.mentorship_leads set enrollment_id=enrolment.id where id=contact.id and enrollment_id is null;
  if not v_already then
    insert into public.mentorship_lead_activity(lead_id,kind,body,actor_id)
    values(contact.id,'note',case when v_reactivated then 'Portal access switched back on by staff.' else 'Portal access granted by staff.' end
      ||' They sign in with a code sent to '||contact.email||'.', auth.uid());
  end if;
  return jsonb_build_object('enrollment_id',enrolment.id,'already_active',v_already,'reactivated',v_reactivated,
    'cohort_slug',target_cohort.slug,'cohort_name',target_cohort.display_name,'email',contact.email,'full_name',contact.full_name);
end $$;
revoke all on function public.grant_mentorship_portal_access(uuid) from public, anon;
grant execute on function public.grant_mentorship_portal_access(uuid) to authenticated;