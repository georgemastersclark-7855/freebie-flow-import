// Account and welcome-event helpers shared by the Shopify webhook and the staff "Grant portal
// access" function. Students sign in with an emailed code, so all we ever do is make sure a
// confirmed account exists for the email. No login or invite link is generated or returned.
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

export interface AuthAccount { userId: string; created: boolean; unconfirmed: boolean }

const missingFunction = (error: { code?: string; message?: string } | null) =>
  Boolean(error && (error.code === "PGRST202" || error.code === "42883" || /could not find the function/i.test(error.message ?? "")));

/** Looks the email up in auth.users (via a service-role RPC), or pages through every user if the RPC is not installed yet. */
export async function findAuthUser(admin: SupabaseClient, email: string): Promise<{ id: string; confirmed: boolean } | null> {
  const { data, error } = await admin.rpc("find_mentorship_auth_user", { p_email: email });
  if (!error) return data ? { id: String(data.user_id), confirmed: Boolean(data.email_confirmed) } : null;
  if (!missingFunction(error)) throw error;
  for (let page = 1; page <= 500; page += 1) {
    const { data: list, error: listError } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (listError) throw listError;
    const match = list.users.find((user) => user.email?.toLowerCase() === email);
    if (match) return { id: match.id, confirmed: Boolean(match.email_confirmed_at) };
    if (list.users.length < 1000) return null;
  }
  throw new Error("Too many accounts to search");
}

/** Finds the account for this email or creates a confirmed one with no password. */
export async function findOrCreateAuthUser(admin: SupabaseClient, email: string, fullName: string): Promise<AuthAccount> {
  const existing = await findAuthUser(admin, email);
  // An existing unconfirmed account is left as it is: the student confirms it by entering their
  // first sign-in code. Confirming it here would also confirm a password someone else may have set.
  if (existing) return { userId: existing.id, created: false, unconfirmed: !existing.confirmed };
  const { data, error } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: fullName ? { full_name: fullName } : {},
  });
  if (!error && data.user) return { userId: data.user.id, created: true, unconfirmed: false };
  // Another delivery may have created it a moment ago.
  const retry = await findAuthUser(admin, email);
  if (retry) return { userId: retry.id, created: false, unconfirmed: !retry.confirmed };
  throw error ?? new Error("The account could not be created");
}

/**
 * Tells Klaviyo a student now has portal access, for the welcome flow. Needs KLAVIYO_PRIVATE_KEY;
 * without it this does nothing. Never throws, so it can never block access.
 */
export async function notifyAccessGranted(input: { email: string; firstName: string; cohortSlug: string; cohortName: string; uniqueId: string; source: "shopify" | "staff" }): Promise<void> {
  const key = Deno.env.get("KLAVIYO_PRIVATE_KEY");
  if (!key) return;
  const portalUrl = Deno.env.get("MENTORSHIP_PORTAL_URL")?.trim() || "https://audio.roblate.com/mentorship-portal";
  try {
    const response = await fetch("https://a.klaviyo.com/api/events/", {
      method: "POST",
      signal: AbortSignal.timeout(4000),
      headers: { "Authorization": `Klaviyo-API-Key ${key}`, "revision": "2024-10-15", "accept": "application/vnd.api+json", "content-type": "application/vnd.api+json" },
      body: JSON.stringify({ data: { type: "event", attributes: {
        properties: { first_name: input.firstName, cohort: input.cohortSlug, cohort_name: input.cohortName, portal_url: portalUrl, source: input.source },
        metric: { data: { type: "metric", attributes: { name: "Mentorship Access Granted" } } },
        profile: { data: { type: "profile", attributes: { email: input.email, ...(input.firstName ? { first_name: input.firstName } : {}) } } },
        unique_id: input.uniqueId,
      } } }),
    });
    if (!response.ok) console.error("Klaviyo access event refused", response.status);
  } catch (error) {
    console.error("Klaviyo access event failed", error instanceof Error ? error.name : "error");
  }
}

/** Runs a promise after the response is sent where the runtime allows it. */
export function afterResponse(task: Promise<unknown>) {
  const runtime = (globalThis as { EdgeRuntime?: { waitUntil?: (promise: Promise<unknown>) => void } }).EdgeRuntime;
  if (runtime?.waitUntil) runtime.waitUntil(task);
  return runtime?.waitUntil ? Promise.resolve() : task;
}
