-- Retain the original attribution when a handraiser subsequently applies.
alter table public.mentorship_leads
  add column first_contact_channel text not null default 'Not recorded'
    check (first_contact_channel in ('Gmail handraiser','Typeform application','Direct enquiry','Other','Not recorded')),
  add column email_thread_url text
    check (email_thread_url is null or (
      length(email_thread_url) <= 2048 and
      email_thread_url ~ '^https://mail[.]google[.]com/[^[:space:]]*$'
    ));
