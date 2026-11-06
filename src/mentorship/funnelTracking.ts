import { useEffect } from 'react';

/* Anonymous funnel counting for the mentorship sales page and application form (see mentorship_funnel_events).
   It records which step a visit reached, never what anyone typed: no answers, names, emails or the fbclid value.
   Details are fixed strings or browser error messages. Counting never throws and never blocks the page. */

export type FunnelEvent =
  | 'page_view' | 'page_scroll' | 'price_seen' | 'apply_click' | 'video_play' | 'page_exit'
  | 'form_view' | 'form_error' | 'form_start' | 'question_view' | 'question_done' | 'question_error'
  | 'review_view' | 'send_click' | 'send_ok' | 'send_fail' | 'js_error';
export type FunnelExtra = { step?: number; question?: string; duration_ms?: number; detail?: string; slug?: string };
type Visit = { id: string; source: string; campaign: string | null; test: boolean };

const COUNTED_HOST = 'audio.roblate.com';
const VISIT_KEY = 'rla-funnel-visit';
const DEFAULT_SLUG = 'cohort-2';
let memoryVisit: Visit | null = null;

const newId = () => {
  try { if (typeof crypto.randomUUID === 'function') return crypto.randomUUID(); } catch { /* insecure page: fall through */ }
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

const userAgent = () => navigator.userAgent || '';
const inAppBrowser = () => /Instagram|FBAN|FBAV/i.test(userAgent());
const deviceType = () => {
  const ua = userAgent();
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua)) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) return 'tablet';
  return /Mobi|iPhone|iPod|Android|Windows Phone/i.test(ua) ? 'phone' : 'desktop';
};

/* Where the visit came from. In-app browsers (Instagram, Facebook) often hide the referrer, so the user agent counts too. */
const detectSource = () => {
  const query = new URLSearchParams(location.search);
  const utmSource = (query.get('utm_source') || '').toLowerCase();
  const utmMedium = (query.get('utm_medium') || '').toLowerCase();
  let host = '';
  let path = '';
  try { const referrer = new URL(document.referrer); host = referrer.hostname.toLowerCase(); path = referrer.pathname; } catch { /* no referrer */ }
  const sameSite = !!host && host === location.hostname;
  if (/klaviyo|mailchimp|convertkit|\bkit\b|email|newsletter/i.test(utmSource) || utmMedium.includes('email') || /mail|com\.google\.android\.gm/.test(host)) return 'email';
  if (/^link[-_ ]?in[-_ ]?bio$/.test(utmSource) || (sameSite && /^\/links(\/|$)/.test(path))) return 'link_in_bio';
  if (/Instagram/i.test(userAgent()) || host.includes('instagram')) return 'instagram';
  if (/FBAN|FBAV/.test(userAgent()) || host.includes('facebook')) return 'facebook';
  // A bare fbclid means a Meta ad click, and Rob's Meta traffic is mostly Instagram.
  if (query.has('fbclid')) return 'instagram';
  if (/(^|\.)(youtube\.com|youtu\.be)$/.test(host) || utmSource === 'youtube') return 'youtube';
  return 'other';
};

/* One visit per browser session, decided on the first counted page. ?funnel_test=1 starts a test visit that is never reported. */
const currentVisit = (): Visit => {
  const wantsTest = new URLSearchParams(location.search).get('funnel_test') === '1';
  let visit = memoryVisit;
  try {
    const stored = JSON.parse(sessionStorage.getItem(VISIT_KEY) || 'null');
    if (stored && typeof stored.id === 'string' && typeof stored.source === 'string') visit = { id: stored.id, source: stored.source, campaign: typeof stored.campaign === 'string' ? stored.campaign : null, test: stored.test === true };
  } catch { /* storage blocked or unreadable: use the one in memory */ }
  if (!visit || (wantsTest && !visit.test)) {
    visit = { id: newId(), source: detectSource(), campaign: (new URLSearchParams(location.search).get('utm_campaign') || '').slice(0, 120) || null, test: wantsTest };
    try { sessionStorage.setItem(VISIT_KEY, JSON.stringify(visit)); } catch { /* keep it in memory only */ }
  }
  memoryVisit = visit;
  return visit;
};

/* Anyone signed in (staff, or a student) is skipped. Supabase keeps the session under sb-<project>-auth-token. */
const signedIn = () => {
  try {
    for (let i = 0; i < localStorage.length; i++) if (/^sb-.+-auth-token$/.test(localStorage.key(i) || '')) return true;
  } catch { /* storage blocked */ }
  return false;
};

export function track(event: FunnelEvent, extra: FunnelExtra = {}) {
  try {
    const visit = currentVisit();
    if (import.meta.env.DEV) { console.debug('[funnel]', event, extra, visit.source); return; }
    if (location.hostname !== COUNTED_HOST || (!visit.test && signedIn())) return;
    void fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rpc/record_mentorship_funnel_event`, {
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'application/json', apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
      body: JSON.stringify({
        p_cohort_slug: extra.slug || DEFAULT_SLUG, p_visit_id: visit.id, p_event: event, p_source: visit.source, p_campaign: visit.campaign,
        p_device: deviceType(), p_in_app: inAppBrowser(), p_step: extra.step ?? null, p_question: extra.question ?? null,
        p_duration_ms: extra.duration_ms ?? null, p_detail: extra.detail ?? null, p_is_test: visit.test,
      }),
    }).catch(() => {});
  } catch { /* counting must never break the page */ }
}

/* Reports uncaught errors and failed promises, at most five per page. Returns the clean-up. */
export function watchPageErrors() {
  let sent = 0;
  const report = (message: unknown) => {
    if (sent >= 5) return;
    sent++;
    track('js_error', { detail: String(message || 'Unknown error').slice(0, 200) });
  };
  const onError = (e: ErrorEvent) => report(e.message);
  const onRejection = (e: PromiseRejectionEvent) => report(e.reason instanceof Error ? e.reason.message : e.reason);
  window.addEventListener('error', onError);
  window.addEventListener('unhandledrejection', onRejection);
  return () => { window.removeEventListener('error', onError); window.removeEventListener('unhandledrejection', onRejection); };
}

/* Everything the sales page reports: the visit, how far it scrolled, the price, the Apply buttons, the videos and the time spent. */
export function useSalesPageFunnel() {
  useEffect(() => {
    track('page_view');
    const stopErrors = watchPageErrors();

    const scrolled = new Set<number>();
    let sawPrice = false;
    const onScroll = () => {
      if (scrolled.size === 4 && sawPrice) return;
      const page = document.documentElement;
      const ratio = (window.scrollY + window.innerHeight) / Math.max(page.scrollHeight, 1);
      for (const step of [25, 50, 75, 100]) {
        if (!scrolled.has(step) && ratio >= step / 100 - 0.005) { scrolled.add(step); track('page_scroll', { step }); }
      }
      const pricing = document.getElementById('pricing');
      if (!sawPrice && pricing && pricing.getBoundingClientRect().top <= window.innerHeight * 0.75) { sawPrice = true; track('price_seen'); }
    };

    /* The Apply buttons are shared components, so count them from the page: price anchors and links into the form. */
    const onClick = (e: MouseEvent) => {
      const href = (e.target as Element | null)?.closest?.('a[href]')?.getAttribute('href') || '';
      if (href === '#pricing') track('apply_click', { detail: 'to_price' });
      else if (href.startsWith('/mentorship/apply')) track('apply_click', { detail: 'to_form' });
    };

    /* "play" doesn't bubble, so listen in the capture phase. Each video counts once per page load. */
    const played = new WeakSet<Element>();
    const onPlay = (e: Event) => {
      const video = e.target as HTMLVideoElement | null;
      if (!video || played.has(video)) return;
      played.add(video);
      track('video_play', { detail: (video.poster || '').includes('vsl-poster') ? 'main video' : 'testimonial video' });
    };

    /* Time on the page counts only while the tab is visible. Each report is the running total, so the longest one wins. */
    let visibleSince: number | null = document.visibilityState === 'visible' ? performance.now() : null;
    let visibleMs = 0;
    let lastReported = -1;
    const reportTime = () => {
      if (visibleSince !== null) { visibleMs += performance.now() - visibleSince; visibleSince = null; }
      const duration_ms = Math.round(visibleMs);
      if (duration_ms === lastReported) return;
      lastReported = duration_ms;
      track('page_exit', { duration_ms });
    };
    const onVisibility = () => { if (document.visibilityState === 'hidden') reportTime(); else visibleSince = performance.now(); };

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('click', onClick);
    document.addEventListener('play', onPlay, true);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', reportTime);
    return () => {
      stopErrors();
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('click', onClick);
      document.removeEventListener('play', onPlay, true);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', reportTime);
    };
  }, []);
}
