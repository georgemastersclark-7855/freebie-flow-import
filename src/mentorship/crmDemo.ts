// Dev preview only (VITE_MENTORSHIP_BACKEND=demo): made-up people, so the Applications screen can be checked without signing in.
import { defaultSettings, type CrmWorkspace, type LeadReview } from './crmApi';
import type { Lead } from './crm';
import type { ApplicationRecord } from './crmPipeline';

const cohortId = 'demo-cohort';
export const demoWrites = {
  reviews: [{ lead_id: 'a2', reviewer: 'Rob', verdict: 'yes' }, { lead_id: 'a2', reviewer: 'George', verdict: 'yes' }, { lead_id: 'a1', reviewer: 'George', verdict: 'maybe' }, { lead_id: 'a6', reviewer: 'Rob', verdict: 'no' }, { lead_id: 'a6', reviewer: 'George', verdict: 'no' }] as LeadReview[],
  placesUpdatedAt: null as string | null,
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
  return { reviews: demoWrites.reviews, placesShownAt: demoWrites.placesUpdatedAt, answerOrder, leads, students: [], staff: [], capacity: 12, settings, milestones: [], payments: [], intake: [], shopifyOrders: [], applications, closesAt: closes.toISOString(), timezone: 'Europe/London' };
}
