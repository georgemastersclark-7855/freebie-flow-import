import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, x-mentorship-secret",
};

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, "Content-Type": "application/json" },
});

serve(async (request: Request) => {
  if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const expectedSecret = Deno.env.get("MENTORSHIP_ZAPIER_SECRET");
  const suppliedSecret = request.headers.get("x-mentorship-secret");
  if (!expectedSecret || suppliedSecret !== expectedSecret) return json({ error: "Unauthorized" }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) return json({ error: "Missing Supabase configuration" }, 500);

  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const fullName = String(body.full_name ?? body.name ?? "").trim();
    const cohortSlug = String(body.cohort_slug ?? "").trim();
    const shopifyOrderId = body.shopify_order_id ? String(body.shopify_order_id) : null;
    const applicationId = body.application_id ? String(body.application_id) : null;
    const redirectTo = String(body.redirect_to ?? Deno.env.get("MENTORSHIP_INVITE_REDIRECT_URL") ?? "").trim();

    if (!email || !fullName || !cohortSlug) {
      return json({ error: "email, full_name and cohort_slug are required" }, 400);
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: cohort, error: cohortError } = await admin
      .from("mentorship_cohorts")
      .select("id, display_name, status")
      .eq("slug", cohortSlug)
      .single();
    if (cohortError || !cohort) return json({ error: "Cohort not found" }, 404);
    if (cohort.status === "archived" || cohort.status === "completed") {
      return json({ error: "Cohort is not accepting enrolments" }, 409);
    }

    const { data: existingProfile } = await admin
      .from("mentorship_profiles")
      .select("user_id, email, role")
      .eq("email", email)
      .maybeSingle();

    let userId = existingProfile?.user_id as string | undefined;
    let actionLink: string | null = null;

    if (!userId) {
      const { data: userPage, error: userListError } = await admin.auth.admin.listUsers({ page: 1, perPage: 1_000 });
      if (userListError) throw userListError;
      const existingAuthUser = userPage.users.find((user) => user.email?.toLowerCase() === email);
      if (existingAuthUser) {
        userId = existingAuthUser.id;
      } else {
        const { data: invite, error: inviteError } = await admin.auth.admin.generateLink({
          type: "invite",
          email,
          options: {
            data: { full_name: fullName },
            redirectTo: redirectTo || undefined,
          },
        });
        if (inviteError || !invite.user) throw inviteError ?? new Error("Unable to create invited user");
        userId = invite.user.id;
        actionLink = invite.properties?.action_link ?? null;
      }
    }

    const profilePayload = existingProfile
      ? { user_id: userId, full_name: fullName, email, role: existingProfile.role }
      : { user_id: userId, full_name: fullName, email, role: "student" };
    const { error: profileError } = await admin.from("mentorship_profiles").upsert(profilePayload, { onConflict: "user_id" });
    if (profileError) throw profileError;

    const { data: enrollment, error: enrollmentError } = await admin
      .from("mentorship_enrollments")
      .upsert({
        cohort_id: cohort.id,
        user_id: userId,
        status: "active",
        shopify_order_id: shopifyOrderId,
        application_id: applicationId,
      }, { onConflict: "cohort_id,user_id" })
      .select("id")
      .single();
    if (enrollmentError) throw enrollmentError;

    return json({
      ok: true,
      user_id: userId,
      enrollment_id: enrollment.id,
      cohort_id: cohort.id,
      cohort_name: cohort.display_name,
      email,
      full_name: fullName,
      account_action_link: actionLink,
      existing_account: Boolean(existingProfile || !actionLink),
    });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : String(error) }, 500);
  }
});
