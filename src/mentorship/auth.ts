import type { EmailOtpType } from "@supabase/supabase-js";

// Email links always point at the live portal. The redirect allowlist accepts
// https://audio.roblate.com/<any path>, so these work from any build.
export const PORTAL_URL = "https://audio.roblate.com/mentorship-portal";
export const AUTH_CONFIRM_URL = `${PORTAL_URL}/auth/confirm`;
export const SET_PASSWORD_URL = `${PORTAL_URL}/set-password`;
export const SUPPORT_EMAIL = "team@roblate.com";
export const CODE_LENGTH = 6;
export const RESEND_SECONDS = 60;
export const MIN_PASSWORD_LENGTH = 8;

export const normalizeEmail = (email: string) => email.trim().toLowerCase();
export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
export const digitsOnly = (value: string) => value.replace(/\D/g, "").slice(0, CODE_LENGTH);

export const NEUTRAL_CODE_MESSAGE = "If that email has a place in the mentorship, we've sent you a code.";

export type AuthContext = "send-code" | "verify-code" | "password" | "reset" | "set-password" | "link" | "sign-out";

export type AuthProblemKind =
  | "no-account"
  | "rate-limit"
  | "expired"
  | "credentials"
  | "unconfirmed"
  | "weak-password"
  | "same-password"
  | "session-missing"
  | "invalid-email"
  | "network"
  | "unknown";

export interface AuthProblem {
  kind: AuthProblemKind;
  message: string;
  waitSeconds?: number;
}

const field = (error: unknown, key: string) =>
  error && typeof error === "object" && key in error ? (error as Record<string, unknown>)[key] : undefined;

/**
 * Turns any Supabase auth error into plain words for students. Raw error text
 * is never shown: unknown cases fall back to a friendly message with the support
 * address.
 */
export function describeAuthError(error: unknown, context: AuthContext): AuthProblem {
  const code = String(field(error, "code") ?? "");
  const status = Number(field(error, "status") ?? 0);
  const name = String(field(error, "name") ?? "");
  const message = String(field(error, "message") ?? "");
  const wait = Number(message.match(/after (\d+) seconds?/i)?.[1] ?? 0) || undefined;
  const asking = "another code";

  if (wait) return { kind: "rate-limit", waitSeconds: wait, message: `Please wait ${wait} seconds before asking for ${asking}.` };
  if (code === "over_email_send_rate_limit" || /email rate limit/i.test(message)) {
    return { kind: "rate-limit", message: `We've sent a lot of emails in a short time. Please wait a few minutes before asking for ${asking}, or email ${SUPPORT_EMAIL}.` };
  }
  if (code === "over_request_rate_limit" || status === 429) {
    return { kind: "rate-limit", message: "Too many tries in a short time. Please wait a minute, then try again." };
  }
  if (["otp_disabled", "user_not_found", "signup_disabled"].includes(code) || /signups? not allowed|user not found/i.test(message)) {
    return { kind: "no-account", message: NEUTRAL_CODE_MESSAGE };
  }
  if (code === "otp_expired" || /expired|invalid.*(token|otp)|token.*invalid/i.test(message)) {
    return {
      kind: "expired",
      message: context === "verify-code"
        ? "That code didn't work. It may have expired or been mistyped. Check your latest email, or ask for a new code."
        : "That link has expired or was already used. Enter your email and we'll send a fresh code.",
    };
  }
  if (code === "invalid_credentials" || /invalid login credentials/i.test(message)) {
    return { kind: "credentials", message: "That email and password don't match. Try again or use Forgot password. First time here? Set up your login below." };
  }
  if (code === "email_not_confirmed") {
    return { kind: "unconfirmed", message: "Set up your login below. We'll confirm your email with a code, then you choose a password." };
  }
  if (code === "weak_password" || name === "AuthWeakPasswordError") {
    return { kind: "weak-password", message: `Choose a stronger password: at least ${MIN_PASSWORD_LENGTH} characters, ideally a few words with a number.` };
  }
  if (code === "same_password") return { kind: "same-password", message: "That's your current password. Choose a new one." };
  if (code === "session_not_found" || code === "session_expired" || name === "AuthSessionMissingError" || /session missing/i.test(message)) {
    return { kind: "session-missing", message: "Your sign-in has expired. Enter your email and we'll send a fresh code." };
  }
  if (code === "email_address_invalid" || code === "validation_failed") {
    return { kind: "invalid-email", message: "Check your email address and try again." };
  }
  if (name === "AuthRetryableFetchError" || (error instanceof TypeError && /fetch|network|load failed/i.test(message))) {
    return { kind: "network", message: "We couldn't reach the portal. Check your connection and try again." };
  }
  const fallback: Record<AuthContext, string> = {
    "send-code": `We couldn't send a code just now. Please try again in a few minutes, or email ${SUPPORT_EMAIL}.`,
    "verify-code": `We couldn't check that code just now. Please try again, or email ${SUPPORT_EMAIL}.`,
    password: `We couldn't sign you in just now. Please try again, or email ${SUPPORT_EMAIL}.`,
    reset: `We couldn't send a code just now. Please try again in a few minutes, or email ${SUPPORT_EMAIL}.`,
    "set-password": `We couldn't save your password just now. Please try again, or email ${SUPPORT_EMAIL}.`,
    link: "That link has expired or was already used. Enter your email and we'll send a fresh code.",
    "sign-out": "We couldn't sign you out. Check your connection and try again.",
  };
  return { kind: "unknown", message: fallback[context] };
}

/** Builds an error shaped like a Supabase auth error, for the local demo. */
export const demoAuthError = (code: string, message: string, status = 400) =>
  Object.assign(new Error(message), { code, status, name: "AuthApiError" });

const linkTypes: EmailOtpType[] = ["email", "magiclink", "recovery", "invite", "signup", "email_change"];

export interface AuthUrlState {
  tokenHash?: string;
  type: EmailOtpType;
  error?: { code: string; description?: string };
  /** Legacy links that arrive with a session in the hash (#access_token=...). */
  hasSessionTokens: boolean;
}

export function readAuthUrl(search: string, hash: string): AuthUrlState {
  const query = new URLSearchParams(search);
  const fragment = new URLSearchParams(hash.replace(/^#/, ""));
  const read = (key: string) => query.get(key) ?? fragment.get(key) ?? undefined;
  const rawType = read("type");
  const type = linkTypes.includes(rawType as EmailOtpType) ? rawType as EmailOtpType : "email";
  const errorCode = read("error_code") ?? read("error");
  return {
    tokenHash: query.get("token_hash") ?? undefined,
    type,
    error: errorCode ? { code: errorCode, description: read("error_description") } : undefined,
    hasSessionTokens: fragment.has("access_token"),
  };
}

export function hasAuthPayload(search: string, hash: string) {
  const state = readAuthUrl(search, hash);
  return Boolean(state.tokenHash || state.error || state.hasSessionTokens);
}

/** Recovery and invite links finish on the set-password page; everything else opens the portal. */
export const linkNeedsPassword = (type: EmailOtpType) => type === "recovery" || type === "invite";

/** Every emailed code or link ends with choosing a password: a new one, or a replacement. */
export type PasswordPurpose = "setup" | "reset";
export const purposeForLink = (type: EmailOtpType): PasswordPurpose => type === "recovery" ? "reset" : "setup";

/** How the code was sent decides how it's checked: sign-in codes as "email", reset codes as "recovery". */
export type CodeChannel = "email" | "recovery";

// The resend countdown survives a refresh, so the portal never asks Supabase for
// a second code inside its own cooldown (which would leak whether an email exists).
const cooldownKey = "rla-portal-code-sent";

export function pendingCode(email: string, purpose: PasswordPurpose, now = Date.now()): { seconds: number; channel: CodeChannel } | null {
  try {
    const stored = JSON.parse(window.sessionStorage.getItem(cooldownKey) ?? "null") as { email: string; purpose: PasswordPurpose; channel: CodeChannel; resendAt: number } | null;
    if (!stored || stored.email !== normalizeEmail(email) || stored.purpose !== purpose) return null;
    const seconds = Math.ceil((stored.resendAt - now) / 1000);
    return seconds > 0 ? { seconds, channel: stored.channel } : null;
  } catch {
    return null;
  }
}

export function startResendCooldown(email: string, purpose: PasswordPurpose, channel: CodeChannel, seconds = RESEND_SECONDS) {
  try {
    window.sessionStorage.setItem(cooldownKey, JSON.stringify({ email: normalizeEmail(email), purpose, channel, resendAt: Date.now() + seconds * 1000 }));
  } catch {
    // Private browsing can block storage; the on-screen countdown still runs.
  }
}

// A signed-out student who opens a deep link (for example a feedback email)
// returns to it after signing in.
const returnKey = "rla-portal-return-to";
const returnable = (path: string) => path.startsWith("/mentorship-portal/")
  && !/^\/mentorship-portal\/(auth|staff|set-password)(\/|$|\?|#)/.test(path);

// Which password screen to show once a code or link has signed someone in. Kept
// for the tab so a refresh on the password screen keeps the right wording.
const passwordStepKey = "rla-portal-password-step";
export function readPasswordStep(): PasswordPurpose | undefined {
  try {
    const value = window.sessionStorage.getItem(passwordStepKey);
    return value === "setup" || value === "reset" ? value : undefined;
  } catch {
    return undefined;
  }
}
export function writePasswordStep(step?: PasswordPurpose) {
  try {
    if (step) window.sessionStorage.setItem(passwordStepKey, step);
    else window.sessionStorage.removeItem(passwordStepKey);
  } catch { /* storage unavailable */ }
}

export function rememberReturnTo(path: string) {
  try { if (returnable(path)) window.sessionStorage.setItem(returnKey, path); } catch { /* storage unavailable */ }
}

export function peekReturnTo() {
  try {
    const path = window.sessionStorage.getItem(returnKey);
    return path && returnable(path) ? path : undefined;
  } catch {
    return undefined;
  }
}

export function clearReturnTo() {
  try { window.sessionStorage.removeItem(returnKey); } catch { /* storage unavailable */ }
}
