// Meta Pixel tracking utility for The Producer Blueprint pages
// Pixel ID: 519820396414380

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    _fbq: any;
  }
}

const PIXEL_ID = "519820396414380";
const ATTRIBUTION_KEY = "rla_tpb_attribution";
const SESSION_KEY = "rla_tpb_session_id";

let pixelInitialized = false;

function isDebug(): boolean {
  try {
    return new URLSearchParams(window.location.search).has("meta_debug") &&
      new URLSearchParams(window.location.search).get("meta_debug") === "1";
  } catch {
    return false;
  }
}

function debugLog(...args: any[]) {
  if (isDebug()) {
    console.log("[TPB Meta]", ...args);
  }
}

// ── Init ──────────────────────────────────────────────

export function initMetaPixel() {
  if (pixelInitialized) {
    debugLog("Pixel already initialized, skipping");
    return;
  }

  // Load fbevents.js if not present
  if (!window.fbq) {
    const n: any = (window.fbq = function (...args: any[]) {
      n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
    });
    if (!window._fbq) window._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    const firstScript = document.getElementsByTagName("script")[0];
    firstScript?.parentNode?.insertBefore(script, firstScript);

    debugLog("fbevents.js script injected");
  }

  window.fbq("init", PIXEL_ID);
  pixelInitialized = true;
  debugLog("Pixel initialized:", PIXEL_ID);
}

// ── Event ID ──────────────────────────────────────────

export function generateEventId(): string {
  return crypto.randomUUID();
}

// ── Attribution ───────────────────────────────────────

interface Attribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  fbclid?: string;
  first_landing_path?: string;
  first_seen_at?: string;
}

export function captureAttribution(): Attribution {
  const params = new URLSearchParams(window.location.search);
  const urlAttribution: Partial<Attribution> = {};

  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "fbclid"] as const;
  for (const key of keys) {
    const val = params.get(key);
    if (val) urlAttribution[key] = decodeURIComponent(val);
  }

  // Load existing
  let stored: Attribution = {};
  try {
    const raw = localStorage.getItem(ATTRIBUTION_KEY);
    if (raw) stored = JSON.parse(raw);
  } catch { /* ignore */ }

  // Merge: URL params take priority
  const merged: Attribution = {
    ...stored,
    ...Object.fromEntries(Object.entries(urlAttribution).filter(([, v]) => v !== undefined)),
  };

  // Set first-visit fields if not present
  if (!merged.first_landing_path) {
    merged.first_landing_path = window.location.pathname;
  }
  if (!merged.first_seen_at) {
    merged.first_seen_at = new Date().toISOString();
  }

  localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(merged));
  debugLog("Attribution captured:", merged);
  return merged;
}

// ── Cookie helpers ────────────────────────────────────

function getCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : undefined;
}

export function getFbp(): string | undefined {
  return getCookie("_fbp");
}

export function getFbc(): string | undefined {
  const fbc = getCookie("_fbc");
  if (fbc) return fbc;

  // Fallback: construct from fbclid
  const params = new URLSearchParams(window.location.search);
  const fbclid = params.get("fbclid");
  if (fbclid) {
    return `fb.1.${Date.now()}.${fbclid}`;
  }
  return undefined;
}

// ── Session ID ────────────────────────────────────────

export function getSessionId(): string {
  let sid = localStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

// ── Tracking Context ──────────────────────────────────

export interface TrackingContext {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  fbclid?: string;
  fbp?: string;
  fbc?: string;
  session_id: string;
  first_landing_path?: string;
  current_path: string;
}

export function getTrackingContext(): TrackingContext {
  let stored: Attribution = {};
  try {
    const raw = localStorage.getItem(ATTRIBUTION_KEY);
    if (raw) stored = JSON.parse(raw);
  } catch { /* ignore */ }

  return {
    utm_source: stored.utm_source,
    utm_medium: stored.utm_medium,
    utm_campaign: stored.utm_campaign,
    utm_term: stored.utm_term,
    utm_content: stored.utm_content,
    fbclid: stored.fbclid,
    fbp: getFbp(),
    fbc: getFbc(),
    session_id: getSessionId(),
    first_landing_path: stored.first_landing_path,
    current_path: window.location.pathname,
  };
}

// ── Track helpers ─────────────────────────────────────

export function trackStandard(eventName: string, params?: Record<string, any>, eventId?: string) {
  const eid = eventId || generateEventId();
  const ctx = getTrackingContext();
  const mergedParams = { ...params, ...ctx };

  try {
    window.fbq("track", eventName, mergedParams, { eventID: eid });
    debugLog(`track "${eventName}"`, { params: mergedParams, eventID: eid });
  } catch (err) {
    debugLog(`track "${eventName}" FAILED`, err);
  }
}

export function trackCustom(eventName: string, params?: Record<string, any>, eventId?: string) {
  const eid = eventId || generateEventId();
  const ctx = getTrackingContext();
  const mergedParams = { ...params, ...ctx };

  try {
    window.fbq("trackCustom", eventName, mergedParams, { eventID: eid });
    debugLog(`trackCustom "${eventName}"`, { params: mergedParams, eventID: eid });
  } catch (err) {
    debugLog(`trackCustom "${eventName}" FAILED`, err);
  }
}
