// Staff "Approve and send offer" button on a CRM lead. The caller must be signed in as staff
// (is_mentorship_staff()). Tells Klaviyo "Mentorship Application Approved" with the lead's own
// payment link, which sends the offer email, then moves the lead to "Offer sent". The payment link
// carries the lead id as the order's application_id, so the Shopify webhook can match the payment
// back to this lead. Nothing changes in the CRM if Klaviyo refuses the event.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { firstName } from "../_shared/shopifyOrder.ts";

const allowedOrigin = (origin: string | null) => {
  if (!origin) return false;
  try {
    const url = new URL(origin);
    if (url.protocol === "https:") return url.hostname === "audio.roblate.com" || url.hostname.endsWith(".lovable.app") || url.hostname.endsWith(".lovableproject.com");
    return url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname);
  } catch { return false; }
};

const DEFAULT_CHECKOUT_URL = "https://roblate.com/cart/57784130732419:1";
const OFFER_HOURS = 24;

/** The cart link with the email filled in and the lead id saved on the order. */
export function paymentUrl(base: string, email: string, leadId: string): string {
  const url = new URL(base);
  url.searchParams.set("checkout[email]", email);
  url.searchParams.set("attributes[application_id]", leadId);
  return url.toString();
}

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

  const supabaseUrl = Deno.env.get("SUPABASE_URL"), anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const klaviyoKey = Deno.env.get("KLAVIYO_PRIVATE_KEY");
  if (!supabaseUrl || !anonKey) return json({ error: "The offer service is not configured." }, 503);
  if (!klaviyoKey) return json({ error: "Offer emails are not set up yet (the Klaviyo key is missing)." }, 503);
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!token) return json({ error: "Sign in as staff to send offers." }, 401);

  const caller = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: auth, error: authError } = await caller.auth.getUser(token);
  if (authError || !auth.user) return json({ error: "Sign in as staff to send offers." }, 401);
  const { data: isStaff, error: staffError } = await caller.rpc("is_mentorship_staff");
  if (staffError || isStaff !== true) return json({ error: "Staff access required." }, 403);

  let leadId = "", resend = false;
  try { const body = await request.json(); leadId = String(body?.lead_id ?? ""); resend = body?.resend === true; } catch { /* handled below */ }
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(leadId)) return json({ error: "Choose a lead first." }, 400);

  // Read through the caller's own sign-in, so CRM row-level security applies.
  const { data: lead, error: leadError } = await caller.from("mentorship_leads").select("id, email, full_name, stage, cohort_id, enrollment_id").eq("id", leadId).maybeSingle();
  if (leadError) return json({ error: "Could not load this lead. Please try again." }, 503);
  if (!lead) return json({ error: "Lead not found." }, 404);
  if (lead.enrollment_id) return json({ error: "This person is already enrolled, so no offer was sent." }, 409);
  if (lead.stage === "offer_sent" && !resend) return json({ error: "An offer was already sent. Use Send the offer again if they need it." }, 409);
  const { data: cohort } = await caller.from("mentorship_cohorts").select("slug, display_name").eq("id", lead.cohort_id).maybeSingle();

  const email = String(lead.email).toLowerCase();
  const name = firstName(String(lead.full_name ?? ""));
  const link = paymentUrl(Deno.env.get("MENTORSHIP_CHECKOUT_URL")?.trim() || DEFAULT_CHECKOUT_URL, email, lead.id);
  const expires = new Date(Date.now() + OFFER_HOURS * 3600_000).toISOString();

  try {
    const response = await fetch("https://a.klaviyo.com/api/events/", {
      method: "POST",
      signal: AbortSignal.timeout(8000),
      headers: { "Authorization": `Klaviyo-API-Key ${klaviyoKey}`, "revision": "2024-10-15", "accept": "application/vnd.api+json", "content-type": "application/vnd.api+json" },
      body: JSON.stringify({ data: { type: "event", attributes: {
        properties: { first_name: name, cohort: cohort?.slug ?? "", cohort_name: cohort?.display_name ?? "", payment_url: link,
          offer_expires_at: expires, offer_hours: OFFER_HOURS, lead_id: lead.id, resend },
        metric: { data: { type: "metric", attributes: { name: "Mentorship Application Approved" } } },
        profile: { data: { type: "profile", attributes: { email, ...(name ? { first_name: name } : {}) } } },
        // One offer per lead; a deliberate resend gets its own id so Klaviyo sends it again.
        unique_id: resend ? `mentorship-offer-${lead.id}-${Date.now()}` : `mentorship-offer-${lead.id}`,
      } } }),
    });
    if (!response.ok) {
      console.error("Klaviyo offer event refused", response.status);
      return json({ error: "Klaviyo did not accept the offer, so nothing was sent. Please try again." }, 502);
    }
  } catch (error) {
    console.error("Klaviyo offer event failed", error instanceof Error ? error.name : "error");
    return json({ error: "Klaviyo could not be reached, so nothing was sent. Please try again." }, 502);
  }

  const due = expires.slice(0, 10);
  const { error: updateError } = await caller.from("mentorship_leads")
    .update({ stage: "offer_sent", next_action: "Check they have paid", due_on: due }).eq("id", lead.id);
  await caller.from("mentorship_lead_activity").insert({ lead_id: lead.id, kind: "note",
    body: `Approved. Personal payment link created for the offer email (held for ${OFFER_HOURS} hours): ${link}` });
  if (updateError) return json({ ok: true, payment_url: link, warning: "The offer was sent, but the lead could not be moved to Offer sent. Move it by hand." });
  return json({ ok: true, payment_url: link });
});
