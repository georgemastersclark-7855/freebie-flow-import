// Dev preview only (VITE_MENTORSHIP_BACKEND=demo): made-up people, so the Applications screen can be checked without signing in.
import { defaultSettings, type CrmWorkspace, type FunnelData, type FunnelRow, type LeadReview } from './crmApi';
import type { Lead } from './crm';
import type { ApplicationRecord } from './crmPipeline';

const cohortId = 'demo-cohort';
export const demoWrites = {
  reviews: [{ lead_id: 'a2', reviewer: 'Rob', verdict: 'yes' }, { lead_id: 'a2', reviewer: 'George', verdict: 'yes' }, { lead_id: 'a1', reviewer: 'George', verdict: 'maybe' }, { lead_id: 'a6', reviewer: 'Rob', verdict: 'no' }, { lead_id: 'a6', reviewer: 'George', verdict: 'no' }] as LeadReview[],
  placesUpdatedAt: null as string | null,
  leads: {} as Record<string, Lead>,
};
export const demoCohorts = [{ id: cohortId, internal_name: 'Cohort 2', display_name: 'Demo programme', status: 'draft', starts_at: null, current_week: 1, timezone: 'Europe/London' }];
const hoursAgo = (hours: number) => new Date(Date.now() - hours * 3600_000).toISOString();
const lead = (id: string, full_name: string, stage: Lead['stage'], source: string, created_at: string): Lead => ({ id, cohort_id: cohortId, full_name, email: `${full_name.split(' ')[0].toLowerCase()}@example.com`, stage, source, source_detail: '', first_contact_channel: 'Not recorded', email_thread_url: null, goals: '', music_url: null, application_url: null, owner_id: null, next_action: '', due_on: null, payment_status: 'unconfirmed', payment_reference: '', payment_on: null, enrollment_id: null, created_at, updated_at: created_at });
const application = (id: string, lead_id: string, hours: number, music: string, experience: string, income: string, investment: string, goal: string, struggles: string): ApplicationRecord => ({ id, lead_id, submitted_at: hoursAgo(hours), attribution: { utm_source: 'Klaviyo', utm_medium: 'campaign' }, answers: [
  { key: 'name', question: "What's your name?", answer: id }, { key: 'email', question: "What's your email address?", answer: `${id}@example.com` }, { key: 'social', question: "What's your IG handle?", answer: music ? '' : 'sample.handle' },
  { key: 'music', question: 'Link some music of yours below.', answer: music || 'Instagram and TikTok' }, { key: 'experience', question: 'How long have you been producing?', answer: experience }, { key: 'goal', question: "What's your goal with music?", answer: goal }, { key: 'struggles', question: 'What are the 3 main struggles holding you back with your music?', answer: struggles }, { key: 'income', question: 'How much are you currently making from music?', answer: income }, { key: 'investment', question: 'The six-week mentorship is $2,497 USD. Are you ready to invest?', answer: investment }, { key: 'source', question: 'How did you hear about Rob?', answer: 'Instagram' }] });

export function demoCrm(): CrmWorkspace {
  const leads = [lead('a1', 'Sam Porter', 'applied', 'Newsletter', hoursAgo(300)), lead('a2', 'Alex Reed', 'applied', 'Instagram', hoursAgo(11)), lead('a3', 'Jo Marsh', 'applied', 'Newsletter', hoursAgo(5)), lead('a4', 'Dana Quinn', 'closed', 'Instagram', hoursAgo(40)),
    ...['Riley Stone', 'Morgan Hale', 'Casey Ward', 'Taylor Brook', 'Jamie Cole', 'Drew Lane'].map((name, i) => lead(`w${i}`, name, 'waitlist', i % 2 ? 'Newsletter' : 'Instagram DM', hoursAgo(100 + i * 30)))];
  leads.push({ ...lead('a5', 'Chris Vale', 'applied', 'Instagram', hoursAgo(30)), next_action: 'Waiting on his music' }, lead('a6', 'Robin Hart', 'applied', 'Newsletter', hoursAgo(25)));
  const applications = [application('a6', 'a6', 25, 'https://open.spotify.com/playlist/demo2', 'Less than 1 year', '$0', 'Not right now', 'Get better', 'Finishing tracks'), application('a5', 'a5', 30, '', 'Less than 1 year', '$0', "Yes, I'm ready", 'Get better', 'Finishing tracks'), application('a1', 'a1', 11, 'https://on.soundcloud.com/one\nhttps://on.soundcloud.com/two', '10+ years', '$0', "Yes, I'm ready", 'Become a touring artist', 'Original production, unique sound design'),
    application('a2', 'a2', 9, '', '1–3 years', '$0', "Yes, I'm ready", 'Improve my production, learn to make sounds from scratch and improve my mixing', 'Playing synths in a modern way, mixing and layering'),
    application('a3', 'a3', 5, 'https://open.spotify.com/playlist/demo', '5–10 years', '$1–5k/month', 'I have questions first', "I already work as a producer, and my biggest goal is to take my productions to a truly world-class level.\n\nI want records that stand next to the ones I look up to.", '1. Closing the gap between my work and the records I look up to.\n\n2. Trusting my creative instincts instead of second-guessing every decision.\n\n3. A faster workflow without losing creativity.')];
  const settings = { ...defaultSettings, reviewers: ['Rob', 'George'], places_updated_at: demoWrites.placesUpdatedAt, capacity: 12, currency: 'USD', seat_price_minor: 249700, list_columns: [{ key: 'experience', label: 'Producing' }, { key: 'income', label: 'Making from music' }, { key: 'investment', label: 'Ready to invest' }], links_question_key: 'music', links_label: 'Their music' };
  const closes = new Date(Date.now() + 7.7 * 86_400_000); closes.setUTCHours(23, 59, 0, 0);
  const answerOrder = { experience: ['Less than 1 year', '1–3 years', '3–5 years', '5–10 years', '10+ years', 'Returning after a break'], income: ['$0', 'Under $1k/month', '$1–5k/month', '$5k+/month'], investment: ["Yes, I'm ready", 'I have questions first', 'Not right now'] };
  return { reviews: demoWrites.reviews, placesShownAt: demoWrites.placesUpdatedAt, answerOrder, leads: leads.map(l => demoWrites.leads[l.id] ?? l), students: [], staff: [], capacity: 12, settings, milestones: [], payments: [], intake: [], shopifyOrders: [], applications, closesAt: closes.toISOString(), timezone: 'Europe/London' };
}

// Made-up funnel counts so every section of the Funnel page can be checked. Picking a source scales them; Facebook has none, to show the empty state.
const funnelRow = (key: string, visits: number, apply: number, form: number, started: number, sent: number, source?: string): FunnelRow => ({ key, visits, apply, form, started, sent, ...(source ? { source } : {}) });
export function demoFunnel(source: string | null = null): FunnelData {
  const sources = [funnelRow('instagram', 168, 41, 52, 33, 14), funnelRow('email', 118, 29, 38, 27, 11), funnelRow('link_in_bio', 64, 13, 15, 9, 3), funnelRow('youtube', 33, 7, 8, 3, 1), funnelRow('other', 29, 6, 5, 2, 2)];
  const q = (step: number, question: string, reached: number, answered: number, errors: number, median_ms: number) => ({ step, question, reached, answered, errors, median_ms });
  const full: FunnelData = {
    first_event: new Date(Date.now() - 9 * 86_400_000).toISOString(), visits: 412, in_app_visits: 171, page_seconds: 74, sources,
    steps: { page_view: 396, price_seen: 171, apply_click: 96, form_view: 118, form_start: 74, review_view: 38, send_click: 36, send_ok: 31 },
    scroll: { 25: 301, 50: 214, 75: 158, 100: 97 }, apply_clicks: { to_price: 71, to_form: 52 }, video_plays: { 'main video': 133, 'testimonial video': 41 },
    questions: [q(1, 'name', 74, 71, 4, 6000), q(2, 'email', 71, 67, 9, 11000), q(3, 'social', 67, 63, 3, 9000), q(4, 'music', 63, 55, 14, 38000), q(5, 'experience', 55, 54, 0, 7000), q(6, 'goal', 54, 50, 2, 52000), q(7, 'struggles', 50, 41, 5, 96000), q(8, 'income', 41, 40, 0, 6000), q(9, 'investment', 40, 39, 0, 8000), q(10, 'source', 39, 38, 0, 5000)],
    question_errors: [
      { step: 4, question: 'music', detail: 'Paste a link so Rob can hear your music. Spotify, SoundCloud, YouTube, Dropbox or Instagram all work.', count: 8 }, { step: 4, question: 'music', detail: 'Use a full HTTPS link, for example https://soundcloud.com/your-track.', count: 6 },
      { step: 2, question: 'email', detail: 'Please enter a valid email address.', count: 9 }, { step: 7, question: 'struggles', detail: 'Please answer this question to continue.', count: 5 }, { step: 1, question: 'name', detail: 'Please enter your name.', count: 4 },
      { step: 3, question: 'social', detail: 'Please answer this question to continue.', count: 3 }, { step: 6, question: 'goal', detail: 'Please answer this question to continue.', count: 2 }],
    send_failures: [{ detail: '503', count: 2 }, { detail: 'Timed out', count: 2 }, { detail: 'No connection', count: 1 }],
    page_errors: [{ event: 'js_error', detail: 'ResizeObserver loop completed with undelivered notifications.', count: 4 }, { event: 'js_error', detail: 'Script error.', count: 3 }, { event: 'form_error', detail: 'The application could not be loaded. Please try again.', count: 2 }],
    campaigns: [funnelRow('Mentorship doors open (01HX7K2)', 71, 18, 24, 17, 7, 'email'), funnelRow('Last chance reminder (01HXA9Q)', 47, 11, 14, 10, 4, 'email'), funnelRow('Reels test', 20, 5, 6, 4, 1, 'instagram')],
    devices: [funnelRow('phone', 301, 74, 83, 50, 20), funnelRow('desktop', 96, 18, 30, 21, 10), funnelRow('tablet', 15, 4, 5, 3, 1)],
  };
  const picked = source ? sources.find(r => r.key === source) : null;
  if (!source) return full;
  const k = picked ? picked.visits / full.visits : 0; const n = (v: number) => Math.round(v * k);
  const scale = (o: Record<string, number>) => Object.fromEntries(Object.entries(o).map(([key, v]) => [key, n(v)]));
  const row = (r: FunnelRow): FunnelRow => ({ ...r, visits: n(r.visits), apply: n(r.apply), form: n(r.form), started: n(r.started), sent: n(r.sent) });
  return { ...full, visits: picked?.visits ?? 0, in_app_visits: n(full.in_app_visits), page_seconds: picked ? full.page_seconds : 0, steps: scale(full.steps), scroll: scale(full.scroll), apply_clicks: scale(full.apply_clicks), video_plays: scale(full.video_plays),
    questions: full.questions.map(x => ({ ...x, reached: n(x.reached), answered: n(x.answered), errors: n(x.errors), median_ms: picked ? x.median_ms : 0 })), question_errors: full.question_errors.map(x => ({ ...x, count: n(x.count) })).filter(x => x.count),
    send_failures: full.send_failures.map(x => ({ ...x, count: n(x.count) })).filter(x => x.count), page_errors: full.page_errors.map(x => ({ ...x, count: n(x.count) })).filter(x => x.count),
    campaigns: full.campaigns.filter(c => c.source === source).map(row), devices: full.devices.map(row).filter(r => r.visits) };
}
