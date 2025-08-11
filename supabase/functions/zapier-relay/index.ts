import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json().catch(() => ({}));
    const payload = body?.payload ?? {};
    const webhookOverride = body?.webhook as string | undefined;

    const webhook = webhookOverride || Deno.env.get('ZAPIER_WEBHOOK_URL');
    if (!webhook) {
      return new Response(JSON.stringify({ error: 'Missing Zapier webhook URL' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const enriched = {
      ...payload,
      relayed_via: 'supabase_edge',
      relayed_at: new Date().toISOString(),
    };

    let ok = false;
    let err: any = null;
    let status = 0;
    let statusText = '';
    let bodyText = '';
    try {
      const resp = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enriched),
      });
      status = resp.status;
      statusText = resp.statusText;
      try {
        bodyText = await resp.text();
      } catch {}
      ok = resp.ok;
    } catch (e) {
      err = String(e);
    }

    if (!ok) {
      return new Response(
        JSON.stringify({ ok: false, error: err || 'relay_failed', status, statusText, body: bodyText?.slice(0, 500) }),
        {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ ok: true, method: 'edge', ts: new Date().toISOString(), forwarded_status: status }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
