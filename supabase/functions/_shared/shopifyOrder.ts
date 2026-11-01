// Pure helpers for the Shopify "Order payment" (orders/paid) webhook. No network or database
// access here, so the signature check and order filter can be unit tested with `deno test`.

// "Rob Late - 6 Week Mentorship" on roblate.com, $2,497 USD.
export const MENTORSHIP_PRODUCT_ID = "15895629267331";
export const MENTORSHIP_VARIANT_ID = "57784130732419";

export interface MentorshipProductIds { productIds: string[]; variantIds: string[] }

/** The ids above, plus any extra comma-separated ids in MENTORSHIP_SHOPIFY_PRODUCT_IDS / _VARIANT_IDS. */
export function mentorshipProductIds(env: (name: string) => string | undefined = () => undefined): MentorshipProductIds {
  const list = (value: string | undefined) => (value ?? "").split(",").map((item) => item.trim()).filter((item) => /^\d{1,30}$/.test(item));
  return {
    productIds: [MENTORSHIP_PRODUCT_ID, ...list(env("MENTORSHIP_SHOPIFY_PRODUCT_IDS"))],
    variantIds: [MENTORSHIP_VARIANT_ID, ...list(env("MENTORSHIP_SHOPIFY_VARIANT_IDS"))],
  };
}

/** Compares two byte arrays without stopping at the first difference. */
export function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) difference |= a[index] ^ b[index];
  return difference === 0;
}

/** Shopify sends base64(HMAC-SHA256(raw body, secret)) in X-Shopify-Hmac-Sha256. */
export async function verifyShopifyHmac(raw: Uint8Array, header: string | null, secret: string | undefined): Promise<boolean> {
  if (!secret || !header) return false;
  const value = header.trim();
  if (!/^[A-Za-z0-9+/]{43}=$/.test(value)) return false;
  let supplied: Uint8Array;
  try { supplied = Uint8Array.from(atob(value), (character) => character.charCodeAt(0)); } catch { return false; }
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const expected = new Uint8Array(await crypto.subtle.sign("HMAC", key, new Uint8Array(raw)));
  return timingSafeEqual(expected, supplied);
}

type Money = { amount?: string | number | null; currency_code?: string | null } | null | undefined;
type MoneySet = { shop_money?: Money } | null | undefined;
export interface ShopifyLineItem {
  product_id?: number | string | null;
  variant_id?: number | string | null;
  quantity?: number | null;
  price?: string | number | null;
  price_set?: MoneySet;
  discount_allocations?: { amount?: string | number | null; amount_set?: MoneySet }[] | null;
  properties?: { name?: string | null; value?: unknown }[] | null;
}
export interface ShopifyOrder {
  id?: number | string | null;
  admin_graphql_api_id?: string | null;
  name?: string | null;
  email?: string | null;
  contact_email?: string | null;
  customer?: { email?: string | null; first_name?: string | null; last_name?: string | null } | null;
  billing_address?: { name?: string | null } | null;
  shipping_address?: { name?: string | null } | null;
  note_attributes?: { name?: string | null; value?: unknown }[] | null;
  line_items?: ShopifyLineItem[] | null;
  total_price?: string | number | null;
  total_price_set?: MoneySet;
  currency?: string | null;
  processed_at?: string | null;
  created_at?: string | null;
  test?: boolean | null;
  cancelled_at?: string | null;
}

export interface MentorshipOrder {
  orderId: string;
  orderName: string | null;
  email: string;
  fullName: string;
  applicationId: string | null;
  amountMinor: number | null;
  currency: string | null;
  paidAt: string | null;
  test: boolean;
  flags: string[];
}

export type OrderResult =
  | { kind: "ignored"; reason: string }
  | { kind: "invalid"; reason: string; orderId: string; orderName: string | null; test: boolean }
  | { kind: "mentorship"; order: MentorshipOrder };

const idText = (value: unknown) => typeof value === "number" && Number.isSafeInteger(value) ? String(value)
  : typeof value === "string" && /^\d{1,30}$/.test(value.trim()) ? value.trim() : "";

/** True when a line item is the mentorship product or variant. */
export function isMentorshipLine(line: ShopifyLineItem, ids: MentorshipProductIds = mentorshipProductIds()): boolean {
  const variant = idText(line.variant_id), product = idText(line.product_id);
  return (variant !== "" && ids.variantIds.includes(variant)) || (product !== "" && ids.productIds.includes(product));
}

/** "2497.00", "2497" or 2497 to 249700. Null for anything else. */
export function toMinor(value: unknown): number | null {
  const text = typeof value === "number" && Number.isFinite(value) ? value.toFixed(2) : typeof value === "string" ? value.trim() : "";
  const match = /^(\d{1,12})(?:\.(\d{1,2}))?$/.exec(text);
  if (!match) return null;
  return Number(match[1]) * 100 + Number((match[2] ?? "").padEnd(2, "0"));
}

const shopMoney = (set: MoneySet, fallback: unknown) => toMinor(set?.shop_money?.amount ?? fallback);
const clean = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function attribute(list: { name?: string | null; value?: unknown }[] | null | undefined): string | null {
  const found = (list ?? []).find((item) => /^application[\s_-]?id$/i.test(clean(item?.name, 100)));
  const value = typeof found?.value === "string" || typeof found?.value === "number" ? String(found.value).trim() : "";
  return value ? value.slice(0, 300) : null;
}

/** Decides whether a paid order is a mentorship order and pulls out what the database needs. */
export function readMentorshipOrder(order: ShopifyOrder, ids: MentorshipProductIds = mentorshipProductIds()): OrderResult {
  const lines = Array.isArray(order?.line_items) ? order.line_items : [];
  const mentorshipLines = lines.filter((line) => line && isMentorshipLine(line, ids));
  if (!mentorshipLines.length) return { kind: "ignored", reason: "not_mentorship" };
  // The GraphQL id is an exact string; the numeric id is a fallback (JSON numbers lose precision past 2^53).
  const orderId = /^gid:\/\/shopify\/Order\/(\d{1,30})$/.exec(order.admin_graphql_api_id ?? "")?.[1] ?? idText(order.id);
  if (!orderId) return { kind: "ignored", reason: "no_order_id" };
  const orderName = clean(order.name, 100) || null;
  const test = order.test === true;
  if (order.cancelled_at) return { kind: "invalid", reason: "The paid order is marked cancelled in Shopify, so no access was given.", orderId, orderName, test };
  const email = clean(order.email || order.contact_email || order.customer?.email, 254).toLowerCase();
  if (!EMAIL.test(email)) return { kind: "invalid", reason: "The paid order has no usable email address, so no access was given. Add them by hand.", orderId, orderName, test };

  const flags: string[] = [];
  const seats = mentorshipLines.reduce((sum, line) => sum + Math.max(1, Math.trunc(Number(line.quantity) || 1)), 0);
  if (seats > 1) flags.push(`The order had ${seats} mentorship seats. Access was given to the order email only.`);

  let amountMinor: number | null;
  if (mentorshipLines.length === lines.length) {
    amountMinor = shopMoney(order.total_price_set, order.total_price);
  } else {
    flags.push("The order also had other products. Only the mentorship line was recorded as the payment.");
    amountMinor = 0;
    for (const line of mentorshipLines) {
      const unit = shopMoney(line.price_set, line.price), quantity = Math.max(1, Math.trunc(Number(line.quantity) || 1));
      const discounts = (line.discount_allocations ?? []).reduce((sum, item) => sum + (shopMoney(item?.amount_set, item?.amount) ?? 0), 0);
      if (unit === null || amountMinor === null) { amountMinor = null; break; }
      amountMinor += Math.max(0, unit * quantity - discounts);
    }
  }
  const currency = clean(order.total_price_set?.shop_money?.currency_code || order.currency, 3).toUpperCase() || null;

  const customerName = [clean(order.customer?.first_name, 80), clean(order.customer?.last_name, 80)].filter(Boolean).join(" ");
  const fullName = (customerName || clean(order.billing_address?.name, 160) || clean(order.shipping_address?.name, 160)).slice(0, 160);
  const applicationId = attribute(order.note_attributes) ?? mentorshipLines.map((line) => attribute(line.properties)).find(Boolean) ?? null;
  const paid = clean(order.processed_at || order.created_at, 40);
  const paidAt = paid && Number.isFinite(Date.parse(paid)) ? new Date(paid).toISOString() : null;

  return { kind: "mentorship", order: { orderId, orderName, email, fullName, applicationId, amountMinor, currency, paidAt, test, flags } };
}

export const firstName = (fullName: string) => fullName.trim().split(/\s+/)[0] ?? "";
