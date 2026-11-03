-- Live places count for the public sales page and application form.
--
-- Cohort 2 goes out showing 11 places (George, 3 Nov 2026). Each public Shopify sale takes one off:
-- distinct paying emails on non-test mentorship orders for the cohort, leaving out second payments
-- and staff test accounts. Students added by hand in the portal are not Shopify orders, so they
-- never move the count. Never below 0. Other cohorts return null, and the pages fall back to their
-- own text.
--
-- p_slug is a cohort slug or an application form slug, so both pages can ask with what they have.
create or replace function public.get_mentorship_places_left(p_slug text)
returns integer language sql stable security definer set search_path=public as $$
  select case when c.slug='cohort-2' then greatest(0, 11 - (
    select count(distinct lower(o.email))::int from public.mentorship_shopify_orders o
    where o.cohort_id=c.id and not o.test_order and o.email is not null
      and (o.outcome is null or o.outcome in ('access_granted','already_enrolled'))
  )) end
  from public.mentorship_cohorts c
  where c.slug=p_slug or c.id=(select f.cohort_id from public.mentorship_application_forms f where f.slug=p_slug)
  limit 1;
$$;
revoke all on function public.get_mentorship_places_left(text) from public;
grant execute on function public.get_mentorship_places_left(text) to anon, authenticated, service_role;
