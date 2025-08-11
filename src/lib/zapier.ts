// Robust Zapier/Klaviyo webhook sender with fallbacks
import { getKlaviyoWebhookUrl } from "@/config/marketing";
import { supabase } from "@/integrations/supabase/client";

export type Transport = "edge" | "fetch" | "beacon" | "get";
export type SendResult = { ok: boolean; method?: Transport; error?: string };
// Keys for localStorage
const QUEUE_KEY = "zapier_queue";
const LAST_SENT_KEY = "zapier_last_sent";

function saveLastSent(method: Transport) {
  try {
    localStorage.setItem(
      LAST_SENT_KEY,
      JSON.stringify({ method, timestamp: new Date().toISOString() })
    );
  } catch {}
}

function getQueue(): any[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setQueue(items: any[]) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(items));
  } catch {}
}

function toQuery(obj: Record<string, any>): string {
  const params = new URLSearchParams();
  Object.entries(obj || {}).forEach(([k, v]) => {
    if (v == null) return;
    const val = typeof v === "object" ? JSON.stringify(v) : String(v);
    params.append(k, val);
  });
  return params.toString();
}

async function tryEdge(url: string, payload: any) {
  try {
    const { data, error } = await supabase.functions.invoke('zapier-relay', {
      body: { webhook: url, payload },
    });
    if (error) throw error;
    saveLastSent("edge");
    console.log("Zapier: sent via Supabase Edge Function", data);
    return true;
  } catch (e) {
    console.warn("Zapier: edge function failed", e);
    return false;
  }
}

async function tryFetch(url: string, payload: any) {
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "no-cors",
      body: JSON.stringify(payload),
    });
    saveLastSent("fetch");
    console.log("Zapier: sent via fetch POST");
    return true;
  } catch (e) {
    console.warn("Zapier: fetch failed", e);
    return false;
  }
}

function tryBeacon(url: string, payload: any) {
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      const ok = navigator.sendBeacon(url, blob);
      if (ok) {
        saveLastSent("beacon");
        console.log("Zapier: sent via navigator.sendBeacon");
        return true;
      }
    }
    return false;
  } catch (e) {
    console.warn("Zapier: beacon failed", e);
    return false;
  }
}

function tryImgGet(url: string, payload: any): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      const qs = toQuery({ ping: 1, ts: Date.now(), ...payload });
      const full = url.includes("?") ? `${url}&${qs}` : `${url}?${qs}`;
      let settled = false;
      const done = (ok: boolean) => {
        if (settled) return;
        settled = true;
        if (ok) {
          saveLastSent("get");
          console.log("Zapier: sent via Image GET ping");
        }
        resolve(ok);
      };
      img.onload = () => done(true);
      img.onerror = () => done(true); // treat error as fire-and-forget success
      img.src = full;
      // Safety timeout
      setTimeout(() => done(true), 1200);
    } catch (e) {
      console.warn("Zapier: image GET failed", e);
      resolve(false);
    }
  });
}

export async function sendZapierEvent(
  payload: Record<string, any>,
  preferred?: Transport
): Promise<SendResult> {
  const url = getKlaviyoWebhookUrl();
  if (!url) {
    console.log("Zapier: No webhook URL configured");
    return { ok: false, error: 'no_webhook' };
  }

  // Enrich payload with metadata
  const enriched = {
    ...payload,
    timestamp: payload.timestamp || new Date().toISOString(),
    page_url: payload.page_url || window.location.href,
    user_agent: payload.user_agent || navigator.userAgent,
    source: payload.source || "rob_late_website",
  };

  const order: Transport[] = preferred
    ? [preferred, "edge", "fetch", "beacon", "get"]
    : ["edge", "fetch", "beacon", "get"];

  for (const method of order) {
    if (method === "edge") {
      const ok = await tryEdge(url, enriched);
      if (ok) return { ok: true, method };
    } else if (method === "fetch") {
      const ok = await tryFetch(url, enriched);
      if (ok) return { ok: true, method };
    } else if (method === "beacon") {
      const ok = tryBeacon(url, enriched);
      if (ok) return { ok: true, method };
    } else if (method === "get") {
      const ok = await tryImgGet(url, enriched);
      if (ok) return { ok: true, method };
    }
  }

  // As a fallback, queue the event
  const q = getQueue();
  q.push(enriched);
  setQueue(q);
  console.warn("Zapier: queued event for later retry");
  return { ok: false, error: 'queued' };
}

export async function flushZapierQueue() {
  const url = getKlaviyoWebhookUrl();
  if (!url) return;
  const q = getQueue();
  if (!q.length) return;

  const remaining: any[] = [];
  for (const item of q) {
    const ok = await tryEdge(url, item).catch(() => false);
    if (!ok) remaining.push(item);
  }
  setQueue(remaining);
  if (remaining.length) {
    console.warn(`Zapier: ${remaining.length} queued event(s) still pending`);
  } else {
    console.log("Zapier: queue flushed");
  }
}
