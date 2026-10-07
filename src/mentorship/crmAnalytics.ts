import { onboardingState, type Lead } from './crm';
import type { CrmStudent } from './crmApi';

export const currencies = ['USD', 'GBP', 'EUR', 'CAD', 'AUD', 'AED'] as const;
export interface LaunchSettings { capacity: number; currency: string | null; seat_price_minor: number | null; cash_target_minor: number | null }
export interface LeadMilestone { lead_id: string; milestone: 'waitlist' | 'applied' | 'approved' | 'offer_sent'; occurred_at: string }
export interface RecordedPayment {
  id: string; lead_id: string; cohort_id: string; kind: 'payment'|'refund'; amount_minor: number; currency: string;
  paid_on: string; provider: string; reference: string; note: string; created_at: string; voided_at: string|null; void_reason: string|null;
}
export type PaymentInput = Pick<RecordedPayment,'lead_id'|'kind'|'amount_minor'|'currency'|'paid_on'|'provider'|'reference'|'note'>;
export const funnelLabels = { interest:'Known contacts', applied:'Applications received', approved:'Applications approved', offer_sent:'Offers sent', paid:'First payment received', onboarded:'Onboarding complete' } as const;
export type FunnelStep = keyof typeof funnelLabels;
export function parseMoney(value: string): number {
  if (!/^\d+(\.\d{1,2})?$/.test(value.trim())) throw new Error('Enter an amount with up to two decimal places.');
  const [whole, fraction=''] = value.trim().split('.');
  const minor=Number(whole)*100+Number(fraction.padEnd(2,'0'));
  if(!Number.isSafeInteger(minor)||minor<=0||minor>10000000000)throw new Error('Enter a positive amount within the allowed limit.');
  return minor;
}
export const money = (minor:number,currency:string) => new Intl.NumberFormat('en-US',{style:'currency',currency,maximumFractionDigits:minor%100?2:0}).format(minor/100);
export function cashByCurrency(payments:RecordedPayment[]) {
  const totals:Record<string,{gross:number;refunds:number;net:number}>={};
  for(const p of payments.filter(p=>!p.voided_at)) {
    const t=totals[p.currency]??(totals[p.currency]={gross:0,refunds:0,net:0});
    if(p.kind==='payment')t.gross+=Number(p.amount_minor);else t.refunds+=Number(p.amount_minor);
    t.net=t.gross-t.refunds;
  }
  return totals;
}
export function hasPaid(lead:Lead,payments:RecordedPayment[]) {
  const records=payments.filter(p=>p.lead_id===lead.id&&!p.voided_at);
  // Once an amount ledger exists, it is authoritative over the earlier status-only record.
  if(records.length)return Object.values(cashByCurrency(records)).some(t=>t.net>0);
  return lead.payment_status==='confirmed';
}
export function leadHasMilestone(lead:Lead,milestones:LeadMilestone[],step:LeadMilestone['milestone']) {
  return lead.stage===step||milestones.some(m=>m.lead_id===lead.id&&m.milestone===step);
}
export function launchAnalytics(leads:Lead[],milestones:LeadMilestone[],payments:RecordedPayment[],students:CrmStudent[]) {
  const ids:Record<FunnelStep,Set<string>>={interest:new Set(leads.map(l=>l.id)),applied:new Set(),approved:new Set(),offer_sent:new Set(),paid:new Set(),onboarded:new Set()};
  for(const l of leads) {
    for(const step of ['applied','approved','offer_sent'] as const)if(leadHasMilestone(l,milestones,step))ids[step].add(l.id);
    if(payments.some(p=>p.lead_id===l.id&&p.kind==='payment'&&!p.voided_at)||l.payment_status==='confirmed'||l.payment_status==='refunded')ids.paid.add(l.id);
    const student=students.find(s=>s.id===l.enrollment_id&&!s.is_walkthrough);
    if(student&&onboardingState(student.call,student.questionnaire,student.focus).key==='complete')ids.onboarded.add(l.id);
  }
  const steps=(Object.keys(funnelLabels) as FunnelStep[]).map((key,index,keys)=>{
    const previous=index?ids[keys[index-1]]:null;
    const converted=previous?[...previous].filter(id=>ids[key].has(id)).length:ids[key].size;
    return {key,label:funnelLabels[key],ids:ids[key],count:ids[key].size,converted,base:previous?.size??leads.length,rate:previous?.size?converted/previous.size:index?null:leads.length?1:null,skipped:previous?[...ids[key]].filter(id=>!previous.has(id)).length:0};
  });
  const confirmed=leads.filter(l=>l.stage!=='closed'&&hasPaid(l,payments));
  return {steps,ids,confirmed,totals:cashByCurrency(payments),
    waitlist:leads.filter(l=>l.stage==='waitlist').length,
    unknownAmounts:leads.filter(l=>l.payment_status!=='unconfirmed'&&!payments.some(p=>p.lead_id===l.id&&!p.voided_at)).length,
    leadToPaid:leads.length?ids.paid.size/leads.length:null,
    sources:[...new Set(leads.map(l=>l.source))].sort().map(source=>{
      const group=leads.filter(l=>l.source===source);const groupIds=new Set(group.map(l=>l.id));
      return {source,leads:group.length,applied:group.filter(l=>ids.applied.has(l.id)).length,paid:group.filter(l=>ids.paid.has(l.id)).length,totals:cashByCurrency(payments.filter(p=>groupIds.has(p.lead_id)))};
    })};
}
