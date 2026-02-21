// Reliable Zapier/Klaviyo webhook sender.
// Key rule: only "edge" responses are treated as confirmed delivery.
import { getKlaviyoWebhookUrl } from "@/config/marketing";

export type Transport = "edge" | "fetch" | "beacon" | "get";
export type SendResult = { ok: boolean; method?: Transport; error?: string };

type QueuedEvent = {
  payload: Record<string, any>;
  queued_at: string;
  attempts: number;
  last_error?: string;
};

const QUEUE_KEY = "zapier_queue_v2";
const LEGACY_QUEUE_KEY = "zapier_queue";
const LAST_SENT_KEY = "zapier_last_sent";
const MAX_QUEUE_ITEMS = 40;

let flushPromise: Promise<void> | null = null;
let scheduledFlushTimer: number | null = null;
let autoFlushInitialized = false;

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveLastSent(method: Transport) {
  try {
    localStorage.setItem(
      LAST_SENT_KEY,
      JSON.stringify({ method, timestamp: new Date().toISOString() })
    );
  } catch {
    // Ignore storage failures.
  }
}

function readLegacyQueue(): QueuedEvent[] {
  const legacy = safeParse<any[]>(localStorage.getItem(LEGACY_QUEUE_KEY), []);
  if (!Array.isArray(legacy) || !legacy.length) return [];
  return legacy.map((payload) => ({
    payload,
    queued_at: new Date().toISOString(),
    attempts: 0,
  }));
}

function getQueue(): QueuedEvent[] {
  try {
    const v2 = safeParse<QueuedEvent[]>(localStorage.getItem(QUEUE_KEY), []);
    if (Array.isArray(v2) && v2.length) return v2;
    return readLegacyQueue();
  } catch {
    return [];
  }
}

function setQueue(items: QueuedEvent[]) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage failures.
  }
}

function queueEvent(payload: Record<string, any>, error?: string) {
  const queue = getQueue();
  queue.push({
    payload,
    queued_at: new Date().toISOString(),
    attempts: 0,
    last_error: error,
  });
  const trimmed = queue.slice(-MAX_QUEUE_ITEMS);
  setQueue(trimmed);
}

function toQuery(obj: Record<string, any>): string {
  const params = new URLSearchParams();
  Object.entries(obj || {}).forEach(([key, value]) => {
    if (value == null) return;
    const serialized = typeof value === "object" ? JSON.stringify(value) : String(value);
    params.append(key, serialized);
  });
  return params.toString();
}

function enrichPayload(payload: Record<string, any>): Record<string, any> {
  return {
    ...payload,
    timestamp: payload.timestamp || new Date().toISOString(),
    page_url: payload.page_url || window.location.href,
    user_agent: payload.user_agent || navigator.userAgent,
    source: payload.source || "rob_late_website",
  };
}

async function tryEdge(url: string, payload: Record<string, any>): Promise<SendResult> {
  try {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data, error } = await supabase.functions.invoke("zapier-relay", {
      body: { webhook: url, payload },
    });
    if (error) throw error;
    if (!data?.ok) {
      throw new Error(data?.error || "edge_relay_failed");
    }
    saveLastSent("edge");
    return { ok: true, method: "edge" };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

// Fire-and-forget helpers. These are best-effort only, not confirmed delivery.
async function fireFetchNoCors(url: string, payload: Record<string, any>): Promise<boolean> {
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "no-cors",
      keepalive: true,
      body: JSON.stringify(payload),
    });
    saveLastSent("fetch");
    return true;
  } catch {
    return false;
  }
}

function fireBeacon(url: string, payload: Record<string, any>): boolean {
  try {
    if (!navigator.sendBeacon) return false;
    const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
    const ok = navigator.sendBeacon(url, blob);
    if (ok) saveLastSent("beacon");
    return ok;
  } catch {
    return false;
  }
}

function fireImageGet(url: string, payload: Record<string, any>): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      const qs = toQuery({ ping: 1, ts: Date.now(), ...payload });
      const full = url.includes("?") ? `${url}&${qs}` : `${url}?${qs}`;
      let settled = false;
      const done = (ok: boolean) => {
        if (settled) return;
        settled = true;
        if (ok) saveLastSent("get");
        resolve(ok);
      };
      img.onload = () => done(true);
      // Treat as best effort if blocked; still resolved.
      img.onerror = () => done(true);
      img.src = full;
      setTimeout(() => done(true), 1200);
    } catch {
      resolve(false);
    }
  });
}

function getFallbackOrder(preferred?: Transport): Transport[] {
  const base: Transport[] = ["fetch", "beacon", "get"];
  if (!preferred || preferred === "edge") return base;
  return [preferred, ...base.filter((item) => item !== preferred)];
}

async function runFallbackTransports(url: string, payload: Record<string, any>, preferred?: Transport): Promise<Transport | undefined> {
  const order = getFallbackOrder(preferred);

  for (const method of order) {
    if (method === "fetch" && await fireFetchNoCors(url, payload)) return "fetch";
    if (method === "beacon" && fireBeacon(url, payload)) return "beacon";
    if (method === "get" && await fireImageGet(url, payload)) return "get";
  }

  return undefined;
}

function scheduleZapierQueueFlush(delayMs = 1500) {
  if (typeof window === "undefined") return;
  if (scheduledFlushTimer !== null) return;

  scheduledFlushTimer = window.setTimeout(() => {
    scheduledFlushTimer = null;
    void flushZapierQueue();
  }, delayMs);
}

export async function sendZapierEvent(
  payload: Record<string, any>,
  preferred?: Transport
): Promise<SendResult> {
  const webhook = getKlaviyoWebhookUrl();
  if (!webhook) {
    return { ok: false, error: "no_webhook" };
  }

  const enriched = enrichPayload(payload);

  // Allow explicit edge-only testing from debug mode.
  if (preferred === "edge") {
    const edge = await tryEdge(webhook, enriched);
    if (!edge.ok) {
      queueEvent(enriched, edge.error || "edge_failed");
      scheduleZapierQueueFlush();
    }
    return edge;
  }

  const edge = await tryEdge(webhook, enriched);
  if (edge.ok) return edge;

  // Try browser fallbacks for best effort, but still queue for confirmed retry.
  const fallbackMethod = await runFallbackTransports(webhook, enriched, preferred);
  queueEvent(enriched, edge.error || "edge_failed");
  scheduleZapierQueueFlush();

  return {
    ok: false,
    method: fallbackMethod,
    error: edge.error ? `queued_after_edge_failure:${edge.error}` : "queued_after_edge_failure",
  };
}

export async function flushZapierQueue() {
  if (flushPromise) return flushPromise;

  flushPromise = (async () => {
    const webhook = getKlaviyoWebhookUrl();
    if (!webhook) return;

    const queue = getQueue();
    if (!queue.length) return;

    const remaining: QueuedEvent[] = [];
    for (const item of queue) {
      const result = await tryEdge(webhook, item.payload);
      if (!result.ok) {
        remaining.push({
          ...item,
          attempts: item.attempts + 1,
          last_error: result.error || item.last_error,
        });
      }
    }

    setQueue(remaining.slice(-MAX_QUEUE_ITEMS));
  })();

  try {
    await flushPromise;
  } finally {
    flushPromise = null;
  }
}

export function startZapierQueueAutoFlush() {
  if (autoFlushInitialized || typeof window === "undefined") return;
  autoFlushInitialized = true;

  scheduleZapierQueueFlush(1500);
  window.addEventListener("online", () => scheduleZapierQueueFlush(300));
  window.addEventListener("focus", () => scheduleZapierQueueFlush(300));

  if (typeof document !== "undefined") {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        scheduleZapierQueueFlush(300);
      }
    });
  }
}
