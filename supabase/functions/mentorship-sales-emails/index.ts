// Staff calendar: the cohort's sales emails, read live from Klaviyo so Rob sees exactly what is going
// out. The caller must be signed in as staff (is_mentorship_staff()). Read-only: nothing here sends,
// schedules or changes anything in Klaviyo. A cohort's campaigns are the ones named "C2 ...".
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { campaignKey, campaignPrefix, emailParagraphs } from "../_shared/klaviyoEmail.ts";

const allowedOrigin = (origin: string | null) => {
  if (!origin) return false;
  try {
    const url = new URL(origin);
    if (url.protocol === "https:") return url.hostname === "audio.roblate.com" || url.hostname.endsWith(".lovable.app") || url.hostname.endsWith(".lovableproject.com");
    return url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname);
  } catch { return false; }
};

const KLAVIYO = "https://a.klaviyo.com/api";
const MAX_PAGES = 5;

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
  if (!supabaseUrl || !anonKey || !klaviyoKey) return json({ error: "Email copy isn't connected to Klaviyo yet." }, 503);
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!token) return json({ error: "Sign in as staff to see the emails." }, 401);

  const caller = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: auth, error: authError } = await caller.auth.getUser(token);
  if (authError || !auth.user) return json({ error: "Sign in as staff to see the emails." }, 401);
  const { data: isStaff, error: staffError } = await caller.rpc("is_mentorship_staff");
  if (staffError || isStaff !== true) return json({ error: "Staff access required." }, 403);

  let cohortId = "";
  try { cohortId = String((await request.json())?.cohort_id ?? ""); } catch { /* handled below */ }
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cohortId)) return json({ error: "Choose a cohort first." }, 400);
  const { data: cohort, error: cohortError } = await caller.from("mentorship_cohorts").select("slug").eq("id", cohortId).maybeSingle();
  if (cohortError || !cohort) return json({ error: "That cohort could not be found." }, 404);
  const prefix = campaignPrefix(String(cohort.slug ?? ""));
  if (!prefix) return json({ ok: true, emails: [] });

  const klaviyo = async (url: string) => {
    const response = await fetch(url, { headers: { Authorization: `Klaviyo-API-Key ${klaviyoKey}`, revision: "2024-10-15", accept: "application/json" } });
    if (!response.ok) throw new Error(`Klaviyo ${response.status}`);
    return await response.json();
  };

  try {
    const filter = encodeURIComponent(`and(equals(messages.channel,'email'),contains(name,'${prefix} '))`);
    // deno-lint-ignore no-explicit-any
    const campaigns: any[] = [];
    let next: string | null = `${KLAVIYO}/campaigns/?filter=${filter}&sort=-updated_at`;
    for (let page = 0; next && page < MAX_PAGES; page += 1) {
      const body = await klaviyo(next);
      campaigns.push(...(body.data ?? []));
      next = body.links?.next ?? null;
    }
    const seen = new Set<string>();
    const wanted = campaigns.filter((campaign) => {
      const key = campaignKey(String(campaign.attributes?.name ?? ""), prefix);
      // Newest first, so a re-made campaign replaces the old one. Cancelled ones never go out.
      if (!key || campaign.attributes?.status === "Cancelled" || seen.has(key.toLowerCase())) return false;
      seen.add(key.toLowerCase());
      return true;
    });
    const emails = await Promise.all(wanted.map(async (campaign) => {
      const messageId = campaign.relationships?.["campaign-messages"]?.data?.[0]?.id;
      if (!messageId) return null;
      const [message, template] = await Promise.all([klaviyo(`${KLAVIYO}/campaign-messages/${messageId}/`), klaviyo(`${KLAVIYO}/campaign-messages/${messageId}/template/`)]);
      const content = message.data?.attributes?.content ?? {};
      return {
        key: campaignKey(String(campaign.attributes.name), prefix),
        status: String(campaign.attributes.status ?? ""),
        send_at: campaign.attributes.send_time ?? message.data?.attributes?.send_times?.[0]?.datetime ?? null,
        subject: String(content.subject ?? ""),
        preview_text: String(content.preview_text ?? ""),
        paragraphs: emailParagraphs(String(template.data?.attributes?.html ?? "")),
      };
    }));
    return json({ ok: true, emails: emails.filter(Boolean) });
  } catch (reason) {
    console.error("mentorship-sales-emails", reason instanceof Error ? reason.message : reason);
    return json({ error: "Klaviyo didn't answer. Try again in a moment." }, 502);
  }
});
