// Shopify "Order payment" webhook (orders/paid) for the Rob Late mentorship.
//
// 1. Verifies X-Shopify-Hmac-Sha256 over the raw body with SHOPIFY_WEBHOOK_SECRET (constant time).
// 2. Ignores orders without the mentorship product (200, so Shopify does not retry).
// 3. Finds or creates a confirmed account for the order email. No login link is made or returned:
//    students sign in with a code emailed to them.
// 4. apply_mentorship_shopify_order enrols them in MENTORSHIP_CURRENT_COHORT_SLUG (default cohort-2),
//    links and updates their CRM lead, records the payment and stores the order (idempotent on the
//    Shopify order id). Anything odd is flagged for staff in the CRM.
// 5. Optionally sends Klaviyo "Mentorship Access Granted" for the welcome flow, after responding.
// Unexpected failures are logged for staff and answered with 500 so Shopify retries.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { firstName, mentorshipProductIds, readMentorshipOrder, verifyShopifyHmac, type ShopifyOrder } from "../_shared/shopifyOrder.ts";
import { afterResponse, findOrCreateAuthUser, notifyAccessGranted } from "../_shared/mentorshipAccess.ts";

const MAX_BODY_BYTES = 1_000_000;
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
});
const message = (error: unknown) => error instanceof Error ? error.message
  : error && typeof error === "object" && "message" in error ? String((error as { message: unknown }).message) : String(error);

Deno.serve(async (request) => {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const secret = Deno.env.get("SHOPIFY_WEBHOOK_SECRET");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!secret || !supabaseUrl || !serviceKey) {
    console.error("shopify-order-paid is missing SHOPIFY_WEBHOOK_SECRET or Supabase configuration");
    return json({ error: "Not configured" }, 503);
  }
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return json({ error: "Payload too large" }, 413);
  const raw = new Uint8Array(await request.arrayBuffer());
  if (raw.byteLength > MAX_BODY_BYTES) return json({ error: "Payload too large" }, 413);
  if (!await verifyShopifyHmac(raw, request.headers.get("x-shopify-hmac-sha256"), secret)) return json({ error: "Invalid signature" }, 401);

  const topic = request.headers.get("x-shopify-topic");
  if (topic && topic !== "orders/paid") return json({ ignored: "topic" });
  let payload: ShopifyOrder;
  try { payload = JSON.parse(new TextDecoder().decode(raw)); } catch { return json({ error: "Invalid JSON" }, 400); }

  const result = readMentorshipOrder(payload, mentorshipProductIds((name) => Deno.env.get(name)));
  if (result.kind === "ignored") return json({ ignored: result.reason });

  const shopDomain = (request.headers.get("x-shopify-shop-domain") ?? "").trim().toLowerCase().slice(0, 255) || null;
  const cohortSlug = Deno.env.get("MENTORSHIP_CURRENT_COHORT_SLUG")?.trim() || "cohort-2";
  const admin = createClient(supabaseUrl, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const logFailure = async (order: Record<string, unknown>, reason: string) => {
    const { error } = await admin.rpc("log_mentorship_shopify_failure", { p_order: order, p_error: reason.slice(0, 2000) });
    if (error) console.error("Could not record the failed Shopify order", order.order_id, error.message);
  };

  // A paid mentorship order we cannot act on (no email, cancelled). Retrying will not help, so
  // record it for staff and answer 200.
  if (result.kind === "invalid") {
    await logFailure({ order_id: result.orderId, order_name: result.orderName, shop_domain: shopDomain, cohort_slug: cohortSlug, test: result.test }, result.reason);
    return json({ ok: false, flagged: true });
  }

  const order = result.order;
  const base = { order_id: order.orderId, order_name: order.orderName, shop_domain: shopDomain, email: order.email, cohort_slug: cohortSlug, test: order.test };
  try {
    const { data: seen, error: seenError } = await admin.from("mentorship_shopify_orders").select("status").eq("shopify_order_id", order.orderId).maybeSingle();
    if (seenError) throw seenError;
    if (seen?.status === "processed") return json({ ok: true, duplicate_delivery: true });

    const account = await findOrCreateAuthUser(admin, order.email, order.fullName);
    const flags = [...order.flags];
    if (account.unconfirmed) flags.push("An unconfirmed account already existed for this email. They confirm it with their first sign-in code. Check it is theirs.");
    const { data, error } = await admin.rpc("apply_mentorship_shopify_order", {
      p_order: { ...base, full_name: order.fullName, application_id: order.applicationId, amount_minor: order.amountMinor,
        currency: order.currency, paid_at: order.paidAt, flags },
      p_user_id: account.userId,
    });
    if (error) throw error;

    if (data?.access_granted) {
      await afterResponse(notifyAccessGranted({
        email: order.email, firstName: firstName(order.fullName), cohortSlug: String(data.cohort_slug ?? cohortSlug),
        cohortName: String(data.cohort_name ?? ""), uniqueId: `mentorship-access-${order.orderId}`, source: "shopify",
      }));
    }
    return json({ ok: true, outcome: data?.outcome ?? null, duplicate_delivery: Boolean(data?.duplicate_delivery),
      flagged: Array.isArray(data?.flags) && data.flags.length > 0 });
  } catch (error) {
    console.error("shopify-order-paid failed for order", order.orderId, message(error));
    await logFailure(base, message(error)).catch(() => undefined);
    return json({ error: "Temporarily unavailable" }, 500);
  }
});
