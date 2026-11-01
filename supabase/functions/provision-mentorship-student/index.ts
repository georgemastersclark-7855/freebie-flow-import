// DEPRECATED (1 Nov 2026). Nothing calls this function. Paid Shopify orders now go through
// shopify-order-paid, and staff use the CRM's "Grant portal access" button
// (grant-mentorship-access). Recommended: delete this function from Lovable Cloud and rotate or
// remove the MENTORSHIP_ZAPIER_SECRET secret.
//
// Until it is deleted it is hardened: it never generates or returns a login link, ignores any
// redirect_to, creates confirmed accounts with no password (students sign in with an emailed code),
// looks accounts up reliably, never downgrades a staff role, never overwrites the first Shopify
// order id, answers server-to-server only (no browser CORS) and compares the secret in constant time.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { findOrCreateAuthUser } from "../_shared/mentorshipAccess.ts";
import { timingSafeEqual } from "../_shared/shopifyOrder.ts";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
});

async function secretMatches(supplied: string | null, expected: string | undefined) {
  if (!supplied || !expected) return false;
  const digest = async (value: string) => new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
  return timingSafeEqual(await digest(supplied), await digest(expected));
}

Deno.serve(async (request: Request) => {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
  if (!await secretMatches(request.headers.get("x-mentorship-secret"), Deno.env.get("MENTORSHIP_ZAPIER_SECRET"))) {
    return json({ error: "Unauthorized" }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) return json({ error: "Missing Supabase configuration" }, 500);

  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const fullName = String(body.full_name ?? body.name ?? "").trim().slice(0, 160);
    const cohortSlug = String(body.cohort_slug ?? "").trim();
    const shopifyOrderId = body.shopify_order_id ? String(body.shopify_order_id).trim() : null;
    const applicationId = body.application_id ? String(body.application_id).trim().slice(0, 300) : null;
    // body.redirect_to is deliberately ignored: no link is generated.

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !fullName || !cohortSlug) {
      return json({ error: "email, full_name and cohort_slug are required" }, 400);
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
    const { data: cohort, error: cohortError } = await admin
      .from("mentorship_cohorts").select("id, display_name, status").eq("slug", cohortSlug).maybeSingle();
    if (cohortError || !cohort) return json({ error: "Cohort not found" }, 404);
    if (cohort.status === "archived" || cohort.status === "completed") return json({ error: "Cohort is not accepting enrolments" }, 409);

    const account = await findOrCreateAuthUser(admin, email, fullName);
    const userId = account.userId;

    // The sign-up trigger normally creates the profile. Create it as a student only if it is missing.
    const { data: profile, error: profileReadError } = await admin.from("mentorship_profiles").select("user_id").eq("user_id", userId).maybeSingle();
    if (profileReadError) throw profileReadError;
    if (!profile) {
      const { error: profileError } = await admin.from("mentorship_profiles").insert({ user_id: userId, full_name: fullName, email, role: "student" });
      if (profileError) throw profileError;
    }

    const { data: existing, error: existingError } = await admin
      .from("mentorship_enrollments").select("id, status, shopify_order_id, application_id, is_walkthrough")
      .eq("cohort_id", cohort.id).eq("user_id", userId).maybeSingle();
    if (existingError) throw existingError;
    let enrollmentId: string;
    if (!existing) {
      const { data: created, error } = await admin.from("mentorship_enrollments")
        .insert({ cohort_id: cohort.id, user_id: userId, status: "active", shopify_order_id: shopifyOrderId, application_id: applicationId })
        .select("id").single();
      if (error) throw error;
      enrollmentId = created.id;
    } else {
      if (existing.is_walkthrough) return json({ error: "This email belongs to a staff test enrolment" }, 409);
      const { error } = await admin.from("mentorship_enrollments").update({
        status: "active",
        shopify_order_id: existing.shopify_order_id ?? shopifyOrderId,
        application_id: existing.application_id ?? applicationId,
      }).eq("id", existing.id);
      if (error) throw error;
      enrollmentId = existing.id;
    }

    return json({
      ok: true,
      deprecated: true,
      user_id: userId,
      enrollment_id: enrollmentId,
      cohort_id: cohort.id,
      cohort_name: cohort.display_name,
      existing_account: !account.created,
      duplicate_order: Boolean(existing?.shopify_order_id && shopifyOrderId && existing.shopify_order_id !== shopifyOrderId),
    });
  } catch (error) {
    console.error("provision-mentorship-student failed", error instanceof Error ? error.message : String(error));
    return json({ error: "Provisioning failed" }, 500);
  }
});
