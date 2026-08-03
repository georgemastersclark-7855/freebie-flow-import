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
5. Deploy `provision-mentorship-student` and
   `publish-mentorship-feedback`.
6. Set the Edge Function secrets listed below.
7. In Zapier, send a successful Shopify order to the provisioning function,
   then send the returned `account_action_link` in the existing welcome email.
8. Point the feedback webhook at a Zap that sends the student a direct link to
   their week page.
9. Enable `VITE_MENTORSHIP_BACKEND=supabase`, build and test with one staff and
   one student account before inviting the cohort.

Required secrets:

```text
MENTORSHIP_ZAPIER_SECRET
MENTORSHIP_INVITE_REDIRECT_URL=https://YOUR-DOMAIN/mentorship-portal/set-password
MENTORSHIP_PORTAL_URL=https://YOUR-DOMAIN/mentorship-portal
MENTORSHIP_FEEDBACK_ZAPIER_URL=https://hooks.zapier.com/...
```

### Shopify/Zapier provisioning request

`POST /functions/v1/provision-mentorship-student`

Header:

```text
x-mentorship-secret: <MENTORSHIP_ZAPIER_SECRET>
```

Body:

```json
{
  "email": "student@example.com",
  "full_name": "Student Name",
  "cohort_slug": "cohort-2",
  "shopify_order_id": "123456789",
  "application_id": "typeform-response-id"
}
```

The function is idempotent for a student/cohort pair. It returns an account
link for new users and preserves an existing account if that email has already
used another Rob Late product.

## Current external blocker

The connected Supabase project `budvnuggykvqydjmkyfx` is paused. The code can
be built and reviewed locally, but migrations and Edge Functions cannot be
applied or tested remotely until the project is restored in Supabase.
