-- Optional paid-student resource link, e.g. Master Bundle access on the
-- sound-library lesson. Existing resource RLS controls who can read this URL.
-- Use a verified access/fulfilment link, never a public copy of the paid assets.
alter table public.mentorship_resources
  add column if not exists download_url text;
