import { readOnboardingPlan, validateOnboardingPlan } from './onboardingPlan';

export const crmRoot = '/mentorship-portal/admin/crm';
export const leadStages = { new: 'New enquiry', waitlist: 'Waitlist', applied: 'Applied', offer_sent: 'Offer sent', enrolled: 'Enrolled', closed: 'Closed' } as const;
export type LeadStage = Exclude<keyof typeof leadStages, 'enrolled'>;
export const leadSources = ['Newsletter', 'Offer doc', 'Instagram', 'Facebook', 'Paid ads', 'Referral', 'Website', 'Not recorded'];
export const leadChannels = ['Gmail handraiser', 'Typeform application', 'Direct enquiry', 'Other', 'Not recorded'];
export interface Lead {
  id: string; cohort_id: string; full_name: string; email: string; stage: LeadStage; source: string; source_detail: string;
  first_contact_channel: string; email_thread_url: string | null;
  goals: string; music_url: string | null; application_url: string | null; owner_id: string | null; next_action: string; due_on: string | null;
  payment_status: 'unconfirmed' | 'confirmed' | 'refunded'; payment_reference: string; payment_on: string | null;
  enrollment_id: string | null; created_at: string; updated_at: string;
}
export type LeadInput = Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'enrollment_id'>;
export interface OnboardingCall { enrollment_id: string; booked_at: string | null; completed_at: string | null; owner_id: string | null; notes: string; updated_at: string }
export const blankLead = (cohortId: string): LeadInput => ({cohort_id:cohortId, full_name:'', email:'', stage:'new', source:'Not recorded', source_detail:'', first_contact_channel:'Not recorded', email_thread_url:null, goals:'', music_url:null, application_url:null, owner_id:null, next_action:'', due_on:null, payment_status:'unconfirmed', payment_reference:'', payment_on:null});
export function normaliseLead(input: LeadInput): LeadInput {
  const result = {...input, full_name:input.full_name.trim(), email:input.email.trim().toLowerCase(), next_action:input.next_action.trim()};
  if (!result.full_name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email)) throw new Error('Enter a name and valid email address.');
  if (!leadChannels.includes(result.first_contact_channel)) throw new Error('Choose how they first got in touch.');
  for (const key of ['music_url','application_url','email_thread_url'] as const) {
    const value = input[key]?.trim(); result[key] = value || null;
    if (value) { let url: URL; try { url = new URL(value); } catch { throw new Error('Use valid HTTPS links.'); }
      if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Use HTTPS links without login details.');
      if (key === 'email_thread_url' && url.hostname !== 'mail.google.com') throw new Error('Use the Gmail link to their email conversation.'); }
  }
  if (result.due_on && !result.next_action) throw new Error('Add a next action for the follow-up date.');
  if (result.payment_status !== 'unconfirmed' && (!result.payment_reference.trim() || !result.payment_on)) throw new Error('Add the payment reference and date before confirming a payment or refund.');
  return result;
}
export function leadStage(lead: Lead, activeEnrollmentIds: Set<string>): keyof typeof leadStages {
  return lead.enrollment_id && activeEnrollmentIds.has(lead.enrollment_id) ? 'enrolled' : lead.stage;
}
export function localDay(date = new Date()) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
export function dueState(due: string | null, today = localDay()) { return !due ? 'none' : due < today ? 'overdue' : due === today ? 'today' : 'upcoming'; }
export function onboardingState(call: OnboardingCall | undefined, questionnaire: unknown, focus: string, now = Date.now()) {
  const plan = readOnboardingPlan(questionnaire);
  let agreed = false;
  if (plan?.status === 'agreed') { try { validateOnboardingPlan(plan); agreed = true; } catch { /* Invalid/incomplete notes remain outstanding. */ } }
  if (agreed && call?.completed_at && focus.trim()) return { key:'complete', label:'Complete', action:'View questionnaire', tone:'green' };
  if (call?.completed_at || plan) return { key:'notes_due', label:'Finish onboarding', action:!call?.completed_at ? 'Confirm call outcome' : !agreed ? 'Complete questionnaire' : 'Set coaching focus', tone:'amber' };
  if (call?.booked_at) return { key:'booked', label:'Booked', action:new Date(call.booked_at).getTime() < now ? 'Check call outcome' : 'Prepare for call', tone:new Date(call.booked_at).getTime() < now ? 'amber' : 'blue' };
  return { key:'not_booked', label:'Awaiting booking', action:'Arrange onboarding call', tone:'gray' };
}
export function readableDate(value: string | null, time = false) {
  if (!value) return 'Not set';
  return new Date(value.length===10 ? `${value}T12:00:00` : value).toLocaleString('en-GB', {day:'numeric',month:'short',...(time ? {hour:'2-digit',minute:'2-digit'} : {})});
}
export function localDateTime(value: string | null) {
  if (!value) return '';
  const d = new Date(value); return `${localDay(d)}T${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}
