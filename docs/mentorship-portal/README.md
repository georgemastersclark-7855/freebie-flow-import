# Rob Late's Producer Mentorship portal

The portal is isolated under `/mentorship-portal/*`; it does not change the
existing mentorship sales page or any current marketing route.

## Product boundary

- Circle remains the place for calls, announcements, chat and teaching.
- This portal handles the arrival experience, weekly music uploads, Rob's
  formal feedback and the fulfilment KPI record.
- The existing offer document and Typeform application remain the source of
  application answers. The portal does not ask the student for the same data a
  second time.

## Student experience

- Email/password account with password reset and persistent Supabase session.
- A focused Start Here page with Rob's welcome, the four setup videos, the
  onboarding checklist and the first-call date.
- Six weekly workspaces for ideas, the selected song and a stems ZIP.
- Private/resumable uploads. Students can only access their own files.
- Server-side submission requirements, so a week cannot be marked submitted
  while a required file is missing.
- Feedback attached to the exact weekly song, with private audio playback,
  written/video feedback and a student next-action confirmation.
- A notification bell remains until the student confirms what they will do.

## Rob and staff experience

- Live cohort KPI board and rescue queue.
- Private in-browser song playback plus idea/stems downloads.
- Live-surgery shortlist based on students who supplied stems.
- Real microphone recording or uploaded audio feedback.
- Draft feedback and a publish action that updates the student's portal and
  calls the Zapier email webhook.
- Viewed/actioned feedback state, call-attendance schema and check-in records.

## Local modes

The default local mode is the approved self-contained demo:

```sh
npm install
npm run dev -- --host 127.0.0.1
```

Open `http://127.0.0.1:8080/mentorship-portal`.

- Student demo: `jack@demo.com` / `demo`
- Rob demo: `rob@demo.com` / `demo`

To use the real backend, add this to the local environment and restart Vite:

```sh
VITE_MENTORSHIP_BACKEND=supabase
```

Do this only after the migrations, storage buckets, functions and cohort data
have been applied.

## Production wiring

1. Apply the two mentorship migrations in `supabase/migrations`.
2. Promote Rob and George's existing `mentorship_profiles.role` values to
   `coach` and `admin` respectively.
3. Add cohort dates, deadlines, Circle/booking/calendar links and calls.
4. Add the five video URLs to `mentorship_resources` and set `published=true`.
5. Deploy `shopify-order-paid`, `grant-mentorship-access` and
   `publish-mentorship-feedback`.
6. Set the Edge Function secrets listed below.
7. In Shopify, Settings > Notifications > Webhooks, create an "Order payment"
   webhook in JSON format pointing at
   `https://owjcahmjbsksoctgfhzo.supabase.co/functions/v1/shopify-order-paid`,
   and copy the signing secret shown on that page into `SHOPIFY_WEBHOOK_SECRET`.
8. Point the feedback webhook at a Zap that sends the student a direct link to
   their week page.
9. Enable `VITE_MENTORSHIP_BACKEND=supabase`, build and test with one staff and
   one student account before inviting the cohort.

Secrets:

```text
SHOPIFY_WEBHOOK_SECRET                 required for shopify-order-paid
MENTORSHIP_CURRENT_COHORT_SLUG=cohort-2 optional, the cohort a paid order enrols into
KLAVIYO_PRIVATE_KEY                    optional, sends "Mentorship Access Granted"
MENTORSHIP_PORTAL_URL=https://audio.roblate.com/mentorship-portal  optional, sent to Klaviyo
MENTORSHIP_FEEDBACK_ZAPIER_URL=https://hooks.zapier.com/...
```

### From Shopify payment to portal access

A paid order containing the "Rob Late - 6 Week Mentorship" product creates a
confirmed account for the order email (no password, no link), enrols it in the
current cohort, links and updates the CRM lead (by the order's `application_id`
note attribute, then by email), records the payment in the lead's ledger and
stores the order in `mentorship_shopify_orders`. Students sign in with a code
emailed to them. Anything unusual (a second payment, an email with no
application, a test order) appears under "Shopify orders to check" in the CRM.
Staff can also give access by hand with "Grant portal access" on a lead.

`provision-mentorship-student` is deprecated and no longer returns a link.
Delete it and remove `MENTORSHIP_ZAPIER_SECRET` when convenient.

## Current external blocker

The connected Supabase project `budvnuggykvqydjmkyfx` is paused. The code can
be built and reviewed locally, but migrations and Edge Functions cannot be
applied or tested remotely until the project is restored in Supabase.
