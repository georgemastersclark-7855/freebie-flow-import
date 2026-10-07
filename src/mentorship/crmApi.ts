/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '@/integrations/supabase/client';
import { loadStudentProfilesForEnrollments } from './studentProfileApi';
import type { SuccessEnrollment, StaffPerson } from './studentSuccessApi';
import { normaliseLead, type Lead, type LeadInput, type OnboardingCall } from './crm';
const db = supabase as any;
async function rows<T>(table: string, select: string, filter: (q:any)=>any = q=>q, order='id'): Promise<T[]> {
  const all:T[]=[];
  for(let offset=0;;offset+=500) { const {data,error}=await filter(db.from(table).select(select)).order(order).range(offset,offset+499); if(error)throw error; all.push(...data); if(data.length<500)return all; }
}
export interface CrmStudent extends SuccessEnrollment { call?: OnboardingCall; questionnaire?: unknown; focus: string; openActions: number }
export interface CrmWorkspace { leads: Lead[]; students: CrmStudent[]; staff: StaffPerson[]; capacity: number }
export async function loadCrm(cohortId: string): Promise<CrmWorkspace> {
  const {data:auth}=await supabase.auth.getUser(); if(!auth.user)throw new Error('Sign in to open admissions.');
  const [leads, enrollments, staff, settings]=await Promise.all([
    rows<Lead>('mentorship_leads','*',q=>q.eq('cohort_id',cohortId)),
    rows<Omit<SuccessEnrollment,'name'|'email'>>('mentorship_enrollments','id,cohort_id,user_id,status,is_walkthrough,enrolled_at',q=>q.eq('cohort_id',cohortId).or(`is_walkthrough.eq.false,user_id.eq.${auth.user!.id}`)),
    rows<StaffPerson>('mentorship_profiles','user_id,full_name',q=>q.in('role',['coach','admin']),'user_id'),
    rows<{capacity:number}>('mentorship_admissions_settings','capacity',q=>q.eq('cohort_id',cohortId),'cohort_id'),
  ]);
  if(!enrollments.length)return {leads,students:[],staff,capacity:settings[0]?.capacity??10};
  const ids=enrollments.map(e=>e.id);
  const [profiles,identities,calls,notes,contexts,actions]=await Promise.all([
    loadStudentProfilesForEnrollments(ids),
    rows<{user_id:string;full_name:string;email:string}>('mentorship_profiles','user_id,full_name,email',q=>q.in('user_id',enrollments.map(e=>e.user_id)),'user_id'),
    rows<OnboardingCall>('mentorship_onboarding_calls','*',q=>q.in('enrollment_id',ids),'enrollment_id'),
    rows<{enrollment_id:string;questionnaire:unknown}>('mentorship_staff_notes','id,enrollment_id,questionnaire',q=>q.in('enrollment_id',ids).not('questionnaire','is',null)),
    rows<{enrollment_id:string;current_focus:string}>('mentorship_student_context','enrollment_id,current_focus',q=>q.in('enrollment_id',ids),'enrollment_id'),
    rows<{enrollment_id:string}>('mentorship_student_actions','id,enrollment_id',q=>q.in('enrollment_id',ids).is('completed_at',null)),
  ]);
  return {leads,staff,capacity:settings[0]?.capacity??10,students:enrollments.map(e=>({...e,name:profiles.get(e.id)?.displayName||identities.find(p=>p.user_id===e.user_id)?.full_name||'Student',email:identities.find(p=>p.user_id===e.user_id)?.email||'',profile:profiles.get(e.id),call:calls.find(c=>c.enrollment_id===e.id),questionnaire:notes.find(n=>n.enrollment_id===e.id)?.questionnaire,focus:contexts.find(c=>c.enrollment_id===e.id)?.current_focus??'',openActions:actions.filter(a=>a.enrollment_id===e.id).length}))};
}
export async function saveLead(input:LeadInput, previous?:Lead):Promise<Lead> {
  const values=normaliseLead(input);
  const query=previous?db.from('mentorship_leads').update(values).eq('id',previous.id).eq('updated_at',previous.updated_at):db.from('mentorship_leads').insert(values);
  const {data,error}=await query.select().maybeSingle();
  if(error?.code==='23505')throw new Error('This email already has a record in this cohort. Search for it to continue.');
  if(error)throw error; if(!data)throw new Error('Someone updated this lead. Close and reopen it to get their changes. Your unsaved notes are still here.'); return data;
}
export const leadInput = (lead:Lead):LeadInput => { const {id,created_at,updated_at,enrollment_id,...input}=lead; void id;void created_at;void updated_at;void enrollment_id;return input; };
export interface LeadActivity {id:string;kind:string;body:string;actor_id:string|null;created_at:string}
export const loadLeadActivity=(id:string)=>rows<LeadActivity>('mentorship_lead_activity','*',q=>q.eq('lead_id',id),'created_at');
export async function addLeadNote(id:string,body:string) { if(!body.trim())throw new Error('Write a note first.'); const {error}=await db.from('mentorship_lead_activity').insert({lead_id:id,kind:'note',body:body.trim()}); if(error)throw error; }
export async function saveOnboardingCall(enrollmentId:string,input:Pick<OnboardingCall,'booked_at'|'completed_at'|'owner_id'|'notes'>,previous?:OnboardingCall) {
  const query=previous?db.from('mentorship_onboarding_calls').update(input).eq('enrollment_id',enrollmentId).eq('updated_at',previous.updated_at):db.from('mentorship_onboarding_calls').insert({...input,enrollment_id:enrollmentId});
  const {data,error}=await query.select().maybeSingle(); if(error?.code==='23505')throw new Error('This booking was just added. Close and reopen it to see the latest details.'); if(error)throw error; if(!data)throw new Error('This booking changed. Close and reopen it before saving.'); return data as OnboardingCall;
}
export async function saveCapacity(cohortId:string,capacity:number) { if(!Number.isInteger(capacity)||capacity<1||capacity>1000)throw new Error('Capacity must be between 1 and 1,000.'); const {error}=await db.from('mentorship_admissions_settings').upsert({cohort_id:cohortId,capacity}); if(error)throw error; }
export async function loadStudentLead(enrollmentId:string) { return (await rows<Lead>('mentorship_leads','*',q=>q.eq('enrollment_id',enrollmentId)))[0]; }
