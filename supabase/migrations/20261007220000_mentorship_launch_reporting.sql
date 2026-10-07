-- Evidence-backed launch reporting. Cash is recorded separately from pipeline stage.
alter table public.mentorship_leads drop constraint mentorship_leads_stage_check;
alter table public.mentorship_leads add constraint mentorship_leads_stage_check check(stage in ('new','waitlist','applied','approved','offer_sent','closed'));
alter table public.mentorship_admissions_settings
  add column currency text check(currency in ('USD','GBP','EUR','CAD','AUD','AED')),
  add column seat_price_minor bigint check(seat_price_minor between 1 and 100000000),
  add column cash_target_minor bigint check(cash_target_minor between 1 and 10000000000),
  add constraint admissions_currency_required check((seat_price_minor is null and cash_target_minor is null) or currency is not null);

create table public.mentorship_lead_milestones (
  lead_id uuid not null references public.mentorship_leads(id) on delete cascade,
  cohort_id uuid not null references public.mentorship_cohorts(id),
  milestone text not null check(milestone in ('waitlist','applied','approved','offer_sent')),
  occurred_at timestamptz not null,
  evidence text not null,
  primary key(lead_id,milestone)
);
alter table public.mentorship_lead_milestones enable row level security;
revoke all on public.mentorship_lead_milestones from public,anon,authenticated;
grant select on public.mentorship_lead_milestones to authenticated;
grant all on public.mentorship_lead_milestones to service_role;
create policy "Staff read admissions milestones" on public.mentorship_lead_milestones for select to authenticated using(public.is_mentorship_staff());

create function public.record_mentorship_milestone() returns trigger language plpgsql security definer set search_path=public as $$
begin
  if TG_TABLE_NAME='mentorship_intake_events' then
    if NEW.provider='typeform' then
      insert into public.mentorship_lead_milestones values(NEW.lead_id,NEW.cohort_id,'applied',NEW.occurred_at,'Typeform response')
      on conflict(lead_id,milestone) do update set occurred_at=least(mentorship_lead_milestones.occurred_at,excluded.occurred_at),evidence='Typeform response';
    end if;
  elsif NEW.stage in ('waitlist','applied','approved','offer_sent') then
    insert into public.mentorship_lead_milestones values(NEW.id,NEW.cohort_id,NEW.stage,now(),'Stage recorded by staff or intake') on conflict do nothing;
  end if;
  return NEW;
end $$;
revoke all on function public.record_mentorship_milestone() from public;
create trigger track_lead_milestones after insert or update of stage on public.mentorship_leads for each row execute function public.record_mentorship_milestone();
create trigger track_application_milestone after insert on public.mentorship_intake_events for each row execute function public.record_mentorship_milestone();
-- Seed only evidenced milestones, without inventing earlier steps or dates.
insert into public.mentorship_lead_milestones
select l.id,l.cohort_id,l.stage,coalesce(min(i.occurred_at) filter(where (l.stage='waitlist' and i.provider='gmail') or (l.stage='applied' and i.provider='typeform')),l.updated_at),'Existing CRM stage'
from public.mentorship_leads l left join public.mentorship_intake_events i on i.lead_id=l.id
where l.stage in ('waitlist','applied','approved','offer_sent') group by l.id on conflict do nothing;
insert into public.mentorship_lead_milestones
select lead_id,cohort_id,'applied',min(occurred_at),'Typeform response' from public.mentorship_intake_events where provider='typeform' group by lead_id,cohort_id
on conflict(lead_id,milestone) do update set occurred_at=least(mentorship_lead_milestones.occurred_at,excluded.occurred_at);

create table public.mentorship_lead_payments (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.mentorship_leads(id),
  cohort_id uuid not null references public.mentorship_cohorts(id),
  kind text not null check(kind in ('payment','refund')),
  amount_minor bigint not null check(amount_minor between 1 and 100000000),
  currency text not null check(currency in ('USD','GBP','EUR','CAD','AUD','AED')),
  paid_on date not null check(paid_on <= current_date),
  provider text not null check(provider in ('stripe','paypal','whop','bank','other')),
  reference text not null check(length(btrim(reference)) between 1 and 300),
  note text not null default '' check(length(note)<=2000),
  created_by uuid default auth.uid() references public.mentorship_profiles(user_id),
  created_at timestamptz not null default now(),
  voided_at timestamptz,
  void_reason text check(length(void_reason) between 1 and 1000),
  unique(provider,reference,kind),
  check((voided_at is null and void_reason is null) or (voided_at is not null and void_reason is not null))
);
create index on public.mentorship_lead_payments(cohort_id,paid_on);
alter table public.mentorship_lead_payments enable row level security;
revoke all on public.mentorship_lead_payments from public,anon,authenticated;
grant select on public.mentorship_lead_payments to authenticated;
grant all on public.mentorship_lead_payments to service_role;
create policy "Staff read recorded payments" on public.mentorship_lead_payments for select to authenticated using(public.is_mentorship_staff());

create function public.record_mentorship_payment(p_lead_id uuid,p_kind text,p_amount_minor bigint,p_currency text,p_paid_on date,p_provider text,p_reference text,p_note text default '')
returns public.mentorship_lead_payments language plpgsql security definer set search_path=public as $$
declare contact public.mentorship_leads; payment public.mentorship_lead_payments; balance bigint;
begin
  if not coalesce(public.is_mentorship_staff(),false) then raise exception 'Staff access required' using errcode='42501'; end if;
  select * into contact from public.mentorship_leads where id=p_lead_id for update;
  if not found then raise exception 'Lead not found'; end if;
  if p_kind='refund' then
    select coalesce(sum(case when kind='payment' then amount_minor else -amount_minor end),0) into balance from public.mentorship_lead_payments where lead_id=p_lead_id and currency=p_currency and voided_at is null;
    if p_amount_minor>balance then raise exception 'Refund exceeds recorded cash for this contact and currency'; end if;
  end if;
  insert into public.mentorship_lead_payments(lead_id,cohort_id,kind,amount_minor,currency,paid_on,provider,reference,note)
    values(p_lead_id,contact.cohort_id,p_kind,p_amount_minor,p_currency,p_paid_on,p_provider,btrim(p_reference),coalesce(p_note,'')) returning * into payment;
  insert into public.mentorship_lead_activity(lead_id,kind,body) values(p_lead_id,'note',case when p_kind='payment' then 'Payment recorded: ' else 'Refund recorded: ' end||p_currency||' '||to_char(p_amount_minor/100.0,'FM9999999990.00')||' · '||p_provider||' · '||btrim(p_reference)||' · '||p_paid_on);
  return payment;
end $$;
revoke all on function public.record_mentorship_payment(uuid,text,bigint,text,date,text,text,text) from public,anon;
grant execute on function public.record_mentorship_payment(uuid,text,bigint,text,date,text,text,text) to authenticated;

create function public.void_mentorship_payment(p_payment_id uuid,p_reason text)
returns void language plpgsql security definer set search_path=public as $$
declare payment public.mentorship_lead_payments; contact_id uuid; balance bigint;
begin
  if not coalesce(public.is_mentorship_staff(),false) then raise exception 'Staff access required' using errcode='42501'; end if;
  if p_reason is null or length(btrim(p_reason)) not between 1 and 1000 then raise exception 'Give a reason for correcting this record'; end if;
  select lead_id into contact_id from public.mentorship_lead_payments where id=p_payment_id;
  perform 1 from public.mentorship_leads where id=contact_id for update;
  select * into payment from public.mentorship_lead_payments where id=p_payment_id for update;
  if not found or payment.voided_at is not null then raise exception 'Payment is missing or already voided'; end if;
  select coalesce(sum(case when kind='payment' then amount_minor else -amount_minor end),0) into balance from public.mentorship_lead_payments where lead_id=contact_id and currency=payment.currency and voided_at is null and id<>p_payment_id;
  if balance<0 then raise exception 'Correct the linked refund before voiding this payment'; end if;
  update public.mentorship_lead_payments set voided_at=now(),void_reason=btrim(p_reason) where id=p_payment_id;
  insert into public.mentorship_lead_activity(lead_id,kind,body) values(contact_id,'note','Payment record voided: '||payment.reference||E'\n'||btrim(p_reason));
end $$;
revoke all on function public.void_mentorship_payment(uuid,text) from public,anon;
grant execute on function public.void_mentorship_payment(uuid,text) to authenticated;

-- George's stated cohort 2 target, 7 October. Not a cash receipt or payment claim.
insert into public.mentorship_admissions_settings(cohort_id,capacity,currency,seat_price_minor)
values('faa94fb4-dcf0-4d96-9369-d834c71fb0c2',12,'USD',249700)
on conflict(cohort_id) do update set capacity=12,currency='USD',seat_price_minor=249700;
