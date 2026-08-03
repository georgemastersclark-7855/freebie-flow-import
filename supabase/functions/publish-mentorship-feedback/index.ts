import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
};

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, "Content-Type": "application/json" },
});

serve(async (request: Request) => {
  if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const authorization = request.headers.get("Authorization") ?? "";
  if (!supabaseUrl || !anonKey || !serviceRoleKey) return json({ error: "Missing Supabase configuration" }, 500);

  try {
    const authClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authorization } },
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const token = authorization.replace(/^Bearer\s+/i, "");
    const { data: userData, error: userError } = await authClient.auth.getUser(token);
    if (userError || !userData.user) return json({ error: "Unauthorized" }, 401);

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data: staffProfile } = await admin
      .from("mentorship_profiles")
      .select("role, full_name")
      .eq("user_id", userData.user.id)
      .single();
    if (!staffProfile || !["coach", "admin"].includes(staffProfile.role)) {
      return json({ error: "Staff access required" }, 403);
    }

    const body = await request.json();
    const submissionId = String(body.submission_id ?? "");
    const writtenNotes = String(body.written_notes ?? "").trim();
    const nextAction = String(body.next_action ?? "").trim();
    const audioStoragePath = body.audio_storage_path ? String(body.audio_storage_path) : null;
    const audioFileName = body.audio_file_name ? String(body.audio_file_name) : null;
    const videoUrl = body.video_url ? String(body.video_url).trim() : null;
    if (!submissionId || (!writtenNotes && !audioStoragePath && !videoUrl) || !nextAction) {
      return json({ error: "submission_id, feedback and next_action are required" }, 400);
    }

    const { data: submission, error: submissionError } = await admin
      .from("mentorship_submissions")
      .select("id, enrollment_id, week_id")
      .eq("id", submissionId)
      .single();
    if (submissionError || !submission) return json({ error: "Submission not found" }, 404);

    const publishedAt = new Date().toISOString();
    const { data: feedback, error: feedbackError } = await admin
      .from("mentorship_feedback")
      .upsert({
        submission_id: submissionId,
        author_id: userData.user.id,
        status: "published",
        written_notes: writtenNotes,
        next_action: nextAction,
        audio_storage_path: audioStoragePath,
        audio_file_name: audioFileName,
        video_url: videoUrl,
        published_at: publishedAt,
        viewed_at: null,
        student_next_action: null,
        action_confirmed_at: null,
      }, { onConflict: "submission_id" })
      .select("id")
      .single();
    if (feedbackError) throw feedbackError;

    const [{ data: enrollment }, { data: week }] = await Promise.all([
      admin.from("mentorship_enrollments").select("user_id, cohort_id").eq("id", submission.enrollment_id).single(),
      admin.from("mentorship_weeks").select("week_number, title").eq("id", submission.week_id).single(),
    ]);
    if (!enrollment || !week) throw new Error("Submission context is incomplete");

    const [{ data: student }, { data: cohort }] = await Promise.all([
      admin.from("mentorship_profiles").select("full_name, email").eq("user_id", enrollment.user_id).single(),
      admin.from("mentorship_cohorts").select("display_name").eq("id", enrollment.cohort_id).single(),
    ]);

    const eventPayload = {
      feedback_id: feedback.id,
      submission_id: submissionId,
      student_id: enrollment.user_id,
      student_name: student?.full_name,
      student_email: student?.email,
      week_number: week.week_number,
      week_title: week.title,
      cohort_name: cohort?.display_name,
      published_by: staffProfile.full_name,
      published_at: publishedAt,
      portal_url: `${Deno.env.get("MENTORSHIP_PORTAL_URL") ?? ""}/week/${week.week_number}#feedback`,
    };

    const { data: event } = await admin
      .from("mentorship_events")
      .insert({ event_type: "feedback.published", aggregate_id: feedback.id, payload: eventPayload })
      .select("id")
      .single();

    const webhook = Deno.env.get("MENTORSHIP_FEEDBACK_ZAPIER_URL");
    let notificationQueued = false;
    if (webhook) {
      try {
        const response = await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventPayload),
        });
        notificationQueued = response.ok;
        if (event?.id) {
          await admin.from("mentorship_events").update({
            delivered_at: response.ok ? new Date().toISOString() : null,
            attempts: 1,
            last_error: response.ok ? null : `${response.status} ${response.statusText}`,
          }).eq("id", event.id);
        }
      } catch (notificationError) {
        if (event?.id) {
          await admin.from("mentorship_events").update({
            attempts: 1,
            last_error: notificationError instanceof Error ? notificationError.message : String(notificationError),
          }).eq("id", event.id);
        }
      }
    }

    return json({ ok: true, feedback_id: feedback.id, notification_queued: notificationQueued });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : String(error) }, 500);
  }
});
