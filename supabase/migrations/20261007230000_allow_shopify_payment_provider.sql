-- Shopify is the selected mentorship payment provider. This only enables
-- staff-recorded Shopify receipts; it does not connect checkout automation.
alter table public.mentorship_lead_payments
  drop constraint if exists mentorship_lead_payments_provider_check;

alter table public.mentorship_lead_payments
  add constraint mentorship_lead_payments_provider_check
  check (provider in ('stripe','paypal','whop','bank','other','shopify'));
