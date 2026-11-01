// Staff "Grant portal access" button on a CRM lead: the manual backstop for payments the Shopify
// webhook does not see (bank transfer, a webhook outage). The caller must be signed in as staff
// (is_mentorship_staff()). Makes sure a confirmed account exists for the lead's email, then enrols
// it through grant_mentorship_portal_access under the caller's own sign-in, so the database does
// the staff check again and the CRM records who did it. No login link is made or returned.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { afterResponse, findOrCreateAuthUser, notifyAccessGranted } from "../_shared/mentorshipAccess.ts";
import { firstName } from "../_shared/shopifyOrder.ts";

const allowedOrigin = (origin: string | null) => {
  if (!origin) return false;
  try {
    const url = new URL(origin);
    if (url.protocol === "https:") return url.hostname === "audio.roblate.com" || url.hostname.endsWith(".lovable.app") || url.hostname.endsWith(".lovableproject.com");
    return url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname);
  } catch { return false; }
};

Deno.serve(async (request) => {
  const origin = request.headers.get("origin");
  const cors: Record<string, string> = {
    "Access-Control-Allow-Origin": allowedOrigin(origin) ? origin! : "https://audio.roblate.com",
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
  const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json", "Cache-Control": "no-store" } });
  if (request.method === "OPTIONS") return new Response(null, { headers: cors });
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL"), anonKey = Deno.env.get("SUPABASE_ANON_KEY"), serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !anonKey || !serviceKey) return json({ error: "The access service is not configured." }, 503);
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!token) return json({ error: "Sign in as staff to grant access." }, 401);

  const caller = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: auth, error: authError } = await caller.auth.getUser(token);
  if (authError || !auth.user) return json({ error: "Sign in as staff to grant access." }, 401);
  const { data: isStaff, error: staffError } = await caller.rpc("is_mentorship_staff");
  if (staffError || isStaff !== true) return json({ error: "Staff access required." }, 403);

  let leadId = "";
  try { leadId = String((await request.json())?.lead_id ?? ""); } catch { /* handled below */ }
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(leadId)) return json({ error: "Choose a lead first." }, 400);

  // Read through the caller's own sign-in, so CRM row-level security applies.
  const { data: lead, error: leadError } = await caller.from("mentorship_leads").select("id, email, full_name").eq("id", leadId).maybeSingle();
  if (leadError) return json({ error: "Could not load this lead. Please try again." }, 503);
  if (!lead) return json({ error: "Lead not found." }, 404);

  try {
    const admin = createClient(supabaseUrl, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
    const account = await findOrCreateAuthUser(admin, String(lead.email).toLowerCase(), String(lead.full_name ?? "").trim());
    const { data, error } = await caller.rpc("grant_mentorship_portal_access", { p_lead_id: leadId });
    if (error) {
      const known = ["Lead not found", "This cohort is not accepting enrolments", "There is no portal account for this email yet", "This email belongs to a staff test enrolment", "Staff access required"];
      return json({ error: known.find((text) => error.message.includes(text)) ?? "Access could not be granted. Please try again." }, error.code === "42501" ? 403 : 409);
    }
    if (!data?.already_active) {
      await afterResponse(notifyAccessGranted({
        email: String(lead.email).toLowerCase(), firstName: firstName(String(lead.full_name ?? "")), cohortSlug: String(data?.cohort_slug ?? ""),
        cohortName: String(data?.cohort_name ?? ""), uniqueId: `mentorship-access-staff-${data?.enrollment_id}-${Date.now()}`, source: "staff",
      }));
    }
    return json({ ok: true, enrollment_id: data?.enrollment_id, already_active: Boolean(data?.already_active),
      reactivated: Boolean(data?.reactivated), created_account: account.created });
  } catch (error) {
    console.error("grant-mentorship-access failed", error instanceof Error ? error.message : String(error));
    return json({ error: "Access could not be granted. Please try again." }, 500);
  }
});
