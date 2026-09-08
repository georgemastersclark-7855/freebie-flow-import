# Rob Late's Producer Mentorship portal

The portal is isolated under `/mentorship-portal/*`; it does not change the
existing mentorship sales page or any current marketing route.

## Product boundary

- Cohort 2 uses a private WhatsApp group between calls. The legacy
  `circle_url` database field holds the configured community invite for compatibility.
- This portal handles the arrival experience, weekly music uploads, Rob's
  formal feedback and the fulfilment KPI record.
- The existing offer document and Typeform application remain the source of
  application answers. The portal does not ask the student for the same data a
  second time.

## Student experience

- Email/password account with password reset and persistent Supabase session.
- A focused Start Here page with Rob's welcome, the four setup videos, the
  onboarding checklist and the first-call date.
- The welcome eyebrow automatically uses the signed-in student's first name
  and the same scalloped blue Meta verified-badge artwork as the Blueprint pages.
- The welcome preview is a fixed 16:9 frame with a play-button mockup until
  Rob's recording is supplied. The four-card setup grid retains its layout;
  each card opens `/mentorship-portal/setup/:lessonKey` with the video,
  supporting notes, practical steps and a downloadable text worksheet.
- All four setup cards have thumbnail images and play overlays. The first
  three use 960×540 JPEG stills from their recordings; stems uses the existing
  Ableton session photograph. Assets are mapped in `setupLessons.ts`.
- The sound-library lesson has a Master Bundle access card. Its optional
  `downloadUrl` comes from the published cohort resource's `download_url`,
  rather than a hardcoded paid-product URL in the JavaScript bundle.
- Display headings use the store's Zürich Black Extended, bundled locally
  with the portal and sized responsively. Body and control text stay readable.
- White and soft white are used for icons, play controls, small labels,
  completion marks and keyboard focus. Brand green is reserved for primary
  action buttons and the embedded booking controls.
- The portal brand avatar uses the existing `/assets/rob-profile.jpg` photo
  from the link-in-bio page, with its exact Instagram gradient and dark inset ring in desktop and mobile navigation.
- Expandable Calendly booking within the onboarding step, with a direct-link
  fallback. The widget loads only when opened and stays mounted when collapsed.
- Weeks 1 to 4: song starter loops, one selected loop developed from the intro
  through the end of the first chorus/drop, and its stems ZIP. Weeks 5 and 6
  focus on finishing the selected full track, with progress and updated stems.
- Private/resumable uploads. Students can only access their own files.
- The weekly-work overview leads with the current week's next action and
  separate cards for loops, the weekly song and matching stems. Earlier work
  sits below; upcoming weeks are grouped in an expandable preview.
- Uploads follow numbered sections with clear file-picker buttons and a
  final Send to Rob step. Required parts come from the cohort configuration;
  the send button stays disabled while files are missing or an operation is busy.
- Submitted weeks show a receipt and read-only files, with feedback when
  available. Feedback reminders remain until the next action is confirmed.
- Server-side submission requirements, so a week cannot be marked submitted
  while a required file is missing.
- Feedback attached to the exact weekly song, with private audio playback,
  written/video feedback and a student next-action confirmation.
- A notification bell remains until the student confirms what they will do.

## Rob and staff experience

Video management is shown only to admins. Rob's coach account focuses on the
cohort and review queue. The admin-only UI route is not a change to the existing
staff database/storage permissions.

- Live cohort KPI board and rescue queue.
- Private in-browser song playback plus idea/stems downloads.
- Live-surgery shortlist based on students who supplied stems.
- Real microphone recording or uploaded audio feedback.
- Draft feedback and a publish action that updates the student's portal and
  calls the Zapier email webhook.
- Viewed/actioned feedback state, call-attendance schema and check-in records.

## Local modes

The self-contained demo must be enabled explicitly in local development:

```sh
npm install
VITE_MENTORSHIP_BACKEND=demo npm run dev -- --host 127.0.0.1
```

Open `http://127.0.0.1:8080/mentorship-portal`.

- Student demo: `jack@demo.com` / `demo`
- Rob demo: `rob@demo.com` / `demo`

Production always uses the real backend. To use it in local development,
set the environment below and restart Vite:

```sh
VITE_MENTORSHIP_BACKEND=supabase
```

Do this only after the migrations, storage buckets, functions and cohort data
have been applied.

## Production wiring

1. Apply the two mentorship migrations in `supabase/migrations`.
2. Promote Rob and George's existing `mentorship_profiles.role` values to
   `coach` and `admin` respectively.
3. Add cohort dates, deadlines, community/booking/calendar links and calls.
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

## Current verification status (8 September 2026)

The live portal uses Supabase project `owjcahmjbsksoctgfhzo`. Student login and
three published setup videos were checked live. Older notes about a paused
`budvnuggykvqydjmkyfx` project are stale.

The current UI revision is prepared locally. Video playback and the lesson
pages work with the existing database. To configure the Master Bundle link,
apply `20260908170000_add_mentorship_lesson_download_url.sql`, then set the
verified fulfilment/access link on the published sound-library resource.
Existing resource RLS restricts that record to its cohort. The link is still
pending, so students currently see an honest access-pending message.
The verified onboarding URL, `https://calendly.com/roblate/onboarding`, is the
default booking destination. A non-empty book-call task `action_url` overrides
it for a specific cohort. Rob still needs to open availability: the live embed
showed no September slots on 8 September. Community links, welcome/stems videos,
dates and calendar details still need completing. Verify the paid-order invite and staff feedback email
journeys using an approved team test account before inviting students.

Student onboarding progress is self-reported and saved against existing task
IDs. Booking happens inside Calendly, then the student ticks the booking step
complete. There is no automatic booking confirmation or video-watch tracking.
The integration uses Calendly's lazy inline widget:
https://developer.calendly.com/api-docs/overview/embedding/getting-started.

### Private recordings in the local demo

The existing three setup MP4s were recovered from the authenticated live
portal and copied into the git-ignored `preview-media.local/` directory.
`dev/mentorshipPreviewMedia.ts` serves only those three known files to local
requests on the Vite development server, including byte-range seeking.
They are excluded from production builds and the source patch. Production
continues using the enrolled student's signed Supabase video URLs. A fresh
checkout without those local files shows the static video preview. George requested final student-facing captions without coming-soon labels; missing files remain an internal launch item.

The welcome and stems-export recordings have not been located. Lesson copy
and worksheets are newly authored support material, not video transcripts.
The four lessons do not add a second completion-tracking system: students
still tick the saved setup task after doing the work.
