// deno test supabase/functions/_shared/shopifyOrder.test.ts
import {
  isMentorshipLine, mentorshipProductIds, readMentorshipOrder, timingSafeEqual, toMinor, verifyShopifyHmac,
  MENTORSHIP_PRODUCT_ID, MENTORSHIP_VARIANT_ID, type ShopifyOrder,
} from "./shopifyOrder.ts";

function assertEquals(actual: unknown, expected: unknown, label = "") {
  const a = JSON.stringify(actual), e = JSON.stringify(expected);
  if (a !== e) throw new Error(`${label} expected ${e}, got ${a}`);
}

const secret = "shpss_test_secret";
const encoder = new TextEncoder();
async function sign(body: Uint8Array, key = secret) {
  const cryptoKey = await crypto.subtle.importKey("raw", encoder.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.sign("HMAC", cryptoKey, new Uint8Array(body)))));
}

Deno.test("HMAC: accepts Shopify's signature over the exact raw bytes", async () => {
  const body = encoder.encode('{"id":820982911946154500,"email":"jon@example.com"}');
  assertEquals(await verifyShopifyHmac(body, await sign(body), secret), true);
  assertEquals(await verifyShopifyHmac(body, ` ${await sign(body)} `, secret), true, "surrounding whitespace");
});

Deno.test("HMAC: rejects a changed body, wrong secret, missing or malformed header", async () => {
  const body = encoder.encode('{"id":1}');
  const signature = await sign(body);
  assertEquals(await verifyShopifyHmac(encoder.encode('{"id":2}'), signature, secret), false, "changed body");
  assertEquals(await verifyShopifyHmac(encoder.encode('{"id":1} '), signature, secret), false, "re-serialised body");
  assertEquals(await verifyShopifyHmac(body, await sign(body, "other"), secret), false, "wrong secret");
  assertEquals(await verifyShopifyHmac(body, null, secret), false, "no header");
  assertEquals(await verifyShopifyHmac(body, "", secret), false, "empty header");
  assertEquals(await verifyShopifyHmac(body, "not-base64!", secret), false, "garbage");
  assertEquals(await verifyShopifyHmac(body, signature.slice(0, 20), secret), false, "truncated");
  assertEquals(await verifyShopifyHmac(body, signature, undefined), false, "no secret configured");
  assertEquals(await verifyShopifyHmac(body, signature, ""), false, "empty secret");
});

Deno.test("timingSafeEqual compares every byte", () => {
  assertEquals(timingSafeEqual(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 3])), true);
  assertEquals(timingSafeEqual(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 4])), false);
  assertEquals(timingSafeEqual(new Uint8Array([1, 2]), new Uint8Array([1, 2, 3])), false);
});

const mentorshipLine = { product_id: Number(MENTORSHIP_PRODUCT_ID), variant_id: Number(MENTORSHIP_VARIANT_ID), quantity: 1, price: "2497.00" };
const baseOrder = (extra: Partial<ShopifyOrder> = {}): ShopifyOrder => ({
  id: 5678901234567, name: "#1042", email: " Student@Example.com ", currency: "USD", total_price: "2497.00",
  total_price_set: { shop_money: { amount: "2497.00", currency_code: "USD" } },
  customer: { first_name: "Sam", last_name: "Producer" }, processed_at: "2026-11-12T19:30:00+00:00",
  line_items: [mentorshipLine], note_attributes: [], ...extra,
});

Deno.test("Filter: matches the mentorship variant or product, ignores everything else", () => {
  const ids = mentorshipProductIds();
  assertEquals(isMentorshipLine({ variant_id: 57784130732419 }, ids), true, "variant number");
  assertEquals(isMentorshipLine({ variant_id: "57784130732419" }, ids), true, "variant string");
  assertEquals(isMentorshipLine({ product_id: 15895629267331, variant_id: 1 }, ids), true, "product only");
  assertEquals(isMentorshipLine({ product_id: 1, variant_id: 2 }, ids), false, "other product");
  assertEquals(isMentorshipLine({}, ids), false, "no ids");
  assertEquals(readMentorshipOrder(baseOrder({ line_items: [{ product_id: 1, variant_id: 2, price: "29.00" }] })), { kind: "ignored", reason: "not_mentorship" });
  assertEquals(readMentorshipOrder(baseOrder({ line_items: [] })).kind, "ignored", "empty order");
  assertEquals(readMentorshipOrder({} as ShopifyOrder).kind, "ignored", "junk");
});

Deno.test("Filter: extra ids can come from the environment", () => {
  const ids = mentorshipProductIds((name) => name === "MENTORSHIP_SHOPIFY_VARIANT_IDS" ? "111, 222,abc" : undefined);
  assertEquals(ids.variantIds, [MENTORSHIP_VARIANT_ID, "111", "222"]);
  assertEquals(isMentorshipLine({ variant_id: 222 }, ids), true);
});

Deno.test("Order: reads the email, name, amount and application id", () => {
  const result = readMentorshipOrder(baseOrder({ note_attributes: [{ name: "application_id", value: "3f2b6c1e-0000-4000-8000-000000000001" }] }));
  if (result.kind !== "mentorship") throw new Error(`expected a mentorship order, got ${result.kind}`);
  assertEquals(result.order, {
    orderId: "5678901234567", orderName: "#1042", email: "student@example.com", fullName: "Sam Producer",
    applicationId: "3f2b6c1e-0000-4000-8000-000000000001", amountMinor: 249700, currency: "USD",
    paidAt: "2026-11-12T19:30:00.000Z", test: false, flags: [],
  });
});

Deno.test("Order: other products, several seats, discounts and line-item application ids", () => {
  const result = readMentorshipOrder(baseOrder({
    total_price: "2600.00",
    line_items: [
      { ...mentorshipLine, quantity: 2, price_set: { shop_money: { amount: "2497.00" } }, discount_allocations: [{ amount: "497.00" }], properties: [{ name: "Application ID", value: "lead-9" }] },
      { product_id: 1, variant_id: 2, quantity: 1, price: "103.00" },
    ],
  }));
  if (result.kind !== "mentorship") throw new Error("expected a mentorship order");
  assertEquals(result.order.amountMinor, 249700 * 2 - 49700, "mentorship lines only, after discounts");
  assertEquals(result.order.applicationId, "lead-9");
  assertEquals(result.order.flags.length, 3, "seats, other products and the discount flagged");
});

Deno.test("Order: missing email or cancelled is flagged, not processed", () => {
  assertEquals(readMentorshipOrder(baseOrder({ email: "", contact_email: null, customer: null })).kind, "invalid");
  assertEquals(readMentorshipOrder(baseOrder({ email: null, contact_email: "c@example.com" })).kind, "mentorship", "contact email fallback");
  assertEquals(readMentorshipOrder(baseOrder({ cancelled_at: "2026-11-12T20:00:00Z" })).kind, "invalid");
  assertEquals(readMentorshipOrder(baseOrder({ id: "not-a-number" })).kind, "ignored");
});

Deno.test("toMinor parses Shopify money strings exactly", () => {
  assertEquals([toMinor("2497.00"), toMinor("2497"), toMinor("0.5"), toMinor(19.99), toMinor("1e3"), toMinor("-5"), toMinor(null)], [249700, 249700, 50, 1999, null, null, null]);
});

Deno.test("Order: the exact GraphQL order id wins over a rounded JSON number", () => {
  const result = readMentorshipOrder(baseOrder({ id: 9007199254740992, admin_graphql_api_id: "gid://shopify/Order/9007199254740993" }));
  if (result.kind !== "mentorship") throw new Error("expected a mentorship order");
  assertEquals(result.order.orderId, "9007199254740993");
});

Deno.test("Discount code on the mentorship is flagged for staff", () => {
  const base: ShopifyOrder = {
    id: 9001, admin_graphql_api_id: "gid://shopify/Order/9001", email: "student@example.com", currency: "USD",
    total_price: "2247.30", total_price_set: { shop_money: { amount: "2247.30", currency_code: "USD" } },
    line_items: [{ product_id: MENTORSHIP_PRODUCT_ID, variant_id: MENTORSHIP_VARIANT_ID, quantity: 1, price: "2497.00",
      discount_allocations: [{ amount: "249.70", amount_set: { shop_money: { amount: "249.70", currency_code: "USD" } } }] }],
    discount_codes: [{ code: "LXZ-TEST10" }],
  };
  const read = readMentorshipOrder(base, mentorshipProductIds());
  if (read.kind !== "mentorship") throw new Error("expected a mentorship order");
  assertEquals(read.order.flags.some((flag) => flag.includes("LXZ-TEST10") && flag.includes("2247.30 USD")), true, "discount flag");
  const full = readMentorshipOrder({ ...base, total_price: "2497.00", total_price_set: { shop_money: { amount: "2497.00", currency_code: "USD" } },
    discount_codes: [], line_items: [{ ...base.line_items![0], discount_allocations: [] }] }, mentorshipProductIds());
  if (full.kind !== "mentorship") throw new Error("expected a mentorship order");
  assertEquals(full.order.flags.length, 0, "no flag at full price");
});
