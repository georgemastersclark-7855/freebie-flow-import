-- Places count: only paid orders count as a sale. A $0 order (a one-time 100% test code) gives access
-- and is recorded, but does not use up one of the 12 places, so the first real sale still shows 11.
create or replace function public.get_mentorship_places_left(p_slug text)
returns integer language sql stable security definer set search_path=public as $$
  select case when c.slug='cohort-2' then greatest(0, least(11, 12 - (
    select count(distinct lower(o.email))::int from public.mentorship_shopify_orders o
    where o.cohort_id=c.id and not o.test_order and o.email is not null and coalesce(o.amount_minor,0)>0
      and (o.outcome is null or o.outcome in ('access_granted','already_enrolled'))
  ))) end
  from public.mentorship_cohorts c
  where c.slug=p_slug or c.id=(select f.cohort_id from public.mentorship_application_forms f where f.slug=p_slug)
  limit 1;
$$;
revoke all on function public.get_mentorship_places_left(text) from public;
grant execute on function public.get_mentorship_places_left(text) to anon, authenticated, service_role;
