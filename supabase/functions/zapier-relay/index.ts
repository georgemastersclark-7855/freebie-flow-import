import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Only our own Zapier account's catch hooks may be relayed, and only from our own sites.
const ALLOWED_WEBHOOK_PREFIX = "https://hooks.zapier.com/hooks/catch/14759876/";
const ALLOWED_ORIGINS = new Set(["https://audio.roblate.com", "https://freebie-finder-friend.lovable.app"]);
const MAX_BODY_BYTES = 20_000;

function originAllowed(origin: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  try {
    const parsed = new URL(origin);
    return parsed.protocol === "http:" && ["localhost", "127.0.0.1"].includes(parsed.hostname);
  } catch {
    return false;
  }
}

function corsHeaders(origin: string | null): HeadersInit {
  return {
    "Access-Control-Allow-Origin": origin ?? "null",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Vary": "Origin",
  };
}

function json(data: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(data), { status, headers: { ...corsHeaders(origin), "Content-Type": "application/json" } });
}

serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  if (!originAllowed(origin)) return json({ error: "Origin not allowed" }, 403, null);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders(origin) });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405, origin);

  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) return json({ error: "Payload too large" }, 413, origin);
    let body: Record<string, unknown> = {};
    try { body = JSON.parse(raw); } catch { return json({ error: "Invalid body" }, 400, origin); }
    const payload = (body?.payload && typeof body.payload === "object") ? body.payload as Record<string, unknown> : {};
    const requested = typeof body?.webhook === "string" ? body.webhook : "";

    const webhook = requested || Deno.env.get("ZAPIER_WEBHOOK_URL") || "";
    if (!webhook.startsWith(ALLOWED_WEBHOOK_PREFIX)) return json({ error: "Webhook not allowed" }, 400, origin);

    const enriched = { ...payload, relayed_via: "supabase_edge", relayed_at: new Date().toISOString() };
    let status = 0;
    try {
      const resp = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enriched),
      });
      status = resp.status;
      await resp.body?.cancel();
      if (!resp.ok) return json({ ok: false, error: "relay_failed", status }, 502, origin);
    } catch {
      return json({ ok: false, error: "relay_failed" }, 502, origin);
    }

    return json({ ok: true, method: "edge", ts: new Date().toISOString(), forwarded_status: status }, 200, origin);
  } catch {
    return json({ error: "Relay error" }, 500, origin);
  }
});
