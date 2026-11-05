alter table public.mentorship_admissions_settings
  add column if not exists places_updated_at timestamptz,
  add column if not exists reviewers jsonb not null default '[]'::jsonb;

create or replace function public.get_mentorship_places_updated_at(p_slug text)
returns timestamptz language sql stable security definer set search_path=public as $$
  select case when s.places_updated_at is not null then greatest(s.places_updated_at, (
    select max(o.received_at) from public.mentorship_shopify_orders o
    where o.cohort_id=c.id and not o.test_order and o.email is not null and coalesce(o.amount_minor,0)>0
      and (o.outcome is null or o.outcome in ('access_granted','already_enrolled'))
  )) end
  from public.mentorship_cohorts c
  join public.mentorship_admissions_settings s on s.cohort_id=c.id
  where c.slug=p_slug or c.id=(select f.cohort_id from public.mentorship_application_forms f where f.slug=p_slug)
  limit 1;
$$;
revoke all on function public.get_mentorship_places_updated_at(text) from public;
grant execute on function public.get_mentorship_places_updated_at(text) to anon, authenticated, service_role;

create table if not exists public.mentorship_lead_reviews (
  lead_id uuid not null references public.mentorship_leads(id) on delete cascade,
  reviewer text not null,
  verdict text check (verdict in ('yes','no')),
  updated_at timestamptz not null default now(),
  primary key (lead_id, reviewer)
);
alter table public.mentorship_lead_reviews enable row level security;
revoke all on public.mentorship_lead_reviews from public, anon, authenticated;
grant select, insert, update on public.mentorship_lead_reviews to authenticated;
grant all on public.mentorship_lead_reviews to service_role;
drop policy if exists "Staff manage lead reviews" on public.mentorship_lead_reviews;
create policy "Staff manage lead reviews" on public.mentorship_lead_reviews for all to authenticated
  using (public.is_mentorship_staff()) with check (public.is_mentorship_staff());
drop trigger if exists update_lead_reviews on public.mentorship_lead_reviews;
create trigger update_lead_reviews before update on public.mentorship_lead_reviews
  for each row execute function public.set_mentorship_updated_at();

update public.mentorship_admissions_settings s
set reviewers = '["Rob","George"]'::jsonb
from public.mentorship_cohorts c
where c.id = s.cohort_id and c.slug = 'cohort-2';