/* eslint-disable @typescript-eslint/no-explicit-any */
// New staff tables are not in the generated Supabase types yet.
import { supabase } from '@/integrations/supabase/client';
import { loadStudentProfilesForEnrollments } from './studentProfileApi';
import type { StudentProfile, PortalFile, ReviewItem } from './types';
import { onboardingNoteBody, type OnboardingPlan } from './onboardingPlan';
const db = supabase as any;
export const successRoot = '/mentorship-portal/admin/cohorts';

export interface SuccessCohort { id: string; internal_name: string; display_name: string; status: string; starts_at: string | null; current_week: number; timezone: string }
export interface SuccessEnrollment { id: string; cohort_id: string; user_id: string; status: string; is_walkthrough: boolean; enrolled_at: string; name: string; email: string; profile?: StudentProfile }
export interface SuccessWeek { id: string; week_number: number; deadline_at: string | null; opens_at: string | null; required_ideas: number }
export interface SuccessSubmission { id: string; enrollment_id: string; week_id: string; state: string; submitted_at: string | null; updated_at: string }
export interface SuccessFile { id: string; submission_id: string; file_name: string; storage_path: string; kind: 'idea' | 'song' | 'stems'; uploaded_at: string; size_bytes: number }
export interface SuccessFeedback { id: string; submission_id: string; status: string; written_notes: string; next_action: string; published_at: string | null; action_confirmed_at: string | null; student_next_action: string | null; audio_storage_path: string | null; audio_file_name: string | null; video_url: string | null }
export interface SuccessSurgery { id: string; submission_id: string; selected_at: string; delivered_at: string | null }
export interface SuccessAction { id: string; enrollment_id: string; title: string; owner_id: string | null; due_on: string | null; completed_at: string | null; updated_at: string }
export interface SuccessContext { enrollment_id: string; goals: string; current_focus: string; updated_at: string }
export interface SuccessNote { id: string; enrollment_id: string; kind: 'note' | 'onboarding' | 'group'; title: string; body: string; transcript: string; source_url: string | null; occurred_on: string; call_id: string | null; created_by: string; created_at: string; updated_at: string; questionnaire?: unknown }
export interface SuccessCall { id: string; title: string; call_type: string; starts_at: string; ends_at: string | null }
export interface SuccessAttendance { call_id: string; enrollment_id: string; attended: boolean; minutes_attended: number | null }
export interface SuccessExample { id: string; enrollment_id: string; title: string; before_file_id: string; after_file_id: string; created_at: string }
export interface StaffPerson { user_id: string; full_name: string }
export interface CohortWorkspace { cohort: SuccessCohort; students: SuccessEnrollment[]; weeks: SuccessWeek[]; submissions: SuccessSubmission[]; feedback: SuccessFeedback[]; actions: SuccessAction[]; files: SuccessFile[]; surgeries: SuccessSurgery[] }
export interface StudentWorkspace extends CohortWorkspace { student: SuccessEnrollment; context: SuccessContext | null; notes: SuccessNote[]; calls: SuccessCall[]; attendance: SuccessAttendance[]; examples: SuccessExample[]; staff: StaffPerson[] }

// Explicit ordering + pagination avoids silently hiding older cohorts/uploads.
async function rows<T>(table: string, select: string, filter: (q: any) => any = q => q, order = 'id'): Promise<T[]> {
  const result: T[] = [];
  for (let offset = 0; ; offset += 500) {
    const { data, error } = await filter(db.from(table).select(select)).order(order).range(offset, offset + 499);
    if (error) throw error;
    result.push(...data);
    if (data.length < 500) return result;
  }
}
export async function loadSuccessCohorts() {
  return rows<SuccessCohort>('mentorship_cohorts', 'id,internal_name,display_name,status,starts_at,current_week,timezone', q => q, 'created_at');
}
export async function loadCohortWorkspace(cohortId: string, enrollmentId?: string): Promise<CohortWorkspace> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error('Sign in to view student records.');
  const cohorts = await rows<SuccessCohort>('mentorship_cohorts', 'id,internal_name,display_name,status,starts_at,current_week,timezone', q => q.eq('id', cohortId));
  if (!cohorts[0]) throw new Error('Cohort not found.');
  const [enrollments, weeks] = await Promise.all([
    rows<Omit<SuccessEnrollment, 'name' | 'email'>>('mentorship_enrollments', 'id,cohort_id,user_id,status,is_walkthrough,enrolled_at', q => {
      q = q.eq('cohort_id', cohortId).or(`is_walkthrough.eq.false,user_id.eq.${auth.user!.id}`);
      return enrollmentId ? q.eq('id', enrollmentId) : q;
    }),
    rows<SuccessWeek>('mentorship_weeks', 'id,week_number,deadline_at,opens_at,required_ideas', q => q.eq('cohort_id', cohortId), 'week_number'),
  ]);
  const ids = enrollments.map(e => e.id);
  if (!ids.length) return { cohort: cohorts[0], students: [], weeks, submissions: [], feedback: [], actions: [], files: [], surgeries: [] };
  const [profiles, identities, submissions, actions] = await Promise.all([
    loadStudentProfilesForEnrollments(ids),
    rows<{ user_id: string; full_name: string; email: string }>('mentorship_profiles', 'user_id,full_name,email', q => q.in('user_id', enrollments.map(e => e.user_id)), 'user_id'),
    rows<SuccessSubmission>('mentorship_submissions', 'id,enrollment_id,week_id,state,submitted_at,updated_at', q => q.in('enrollment_id', ids)),
    rows<SuccessAction>('mentorship_student_actions', 'id,enrollment_id,title,owner_id,due_on,completed_at,updated_at', q => q.in('enrollment_id', ids)),
  ]);
  const students = enrollments.map(e => ({ ...e, name: profiles.get(e.id)?.displayName || identities.find(p => p.user_id === e.user_id)?.full_name || 'Student', email: identities.find(p => p.user_id === e.user_id)?.email || '', profile: profiles.get(e.id) }));
  const submissionIds = submissions.map(s => s.id);
  const [feedback, files, surgeries] = submissionIds.length ? await Promise.all([
    rows<SuccessFeedback>('mentorship_feedback', 'id,submission_id,status,written_notes,next_action,published_at,action_confirmed_at,student_next_action,audio_storage_path,audio_file_name,video_url', q => q.in('submission_id', submissionIds)),
    rows<SuccessFile>('mentorship_submission_files', 'id,submission_id,file_name,storage_path,kind,uploaded_at,size_bytes', q => q.in('submission_id', submissionIds)),
    rows<SuccessSurgery>('mentorship_surgeries', 'id,submission_id,selected_at,delivered_at', q => q.in('submission_id', submissionIds)),
  ]) : [[], [], []];
  return { cohort: cohorts[0], students, weeks, submissions, feedback, actions, files, surgeries };
}
export async function loadStudentWorkspace(cohortId: string, enrollmentId: string): Promise<StudentWorkspace> {
  const workspace = await loadCohortWorkspace(cohortId, enrollmentId);
  const student = workspace.students[0];
  if (!student) throw new Error('Student not found in this cohort.');
  const [contexts, notes, calls, attendance, examples, staff] = await Promise.all([
    rows<SuccessContext>('mentorship_student_context', 'enrollment_id,goals,current_focus,updated_at', q => q.eq('enrollment_id', enrollmentId), 'enrollment_id'),
    rows<SuccessNote>('mentorship_staff_notes', '*', q => q.eq('enrollment_id', enrollmentId)),
    rows<SuccessCall>('mentorship_calls', 'id,title,call_type,starts_at,ends_at', q => q.eq('cohort_id', cohortId), 'starts_at'),
    rows<SuccessAttendance>('mentorship_call_attendance', 'call_id,enrollment_id,attended,minutes_attended', q => q.eq('enrollment_id', enrollmentId), 'call_id'),
    rows<SuccessExample>('mentorship_progress_examples', '*', q => q.eq('enrollment_id', enrollmentId)),
    rows<StaffPerson>('mentorship_profiles', 'user_id,full_name', q => q.in('role', ['coach','admin']), 'user_id'),
  ]);
  return { ...workspace, student, context: contexts[0] ?? null, notes, calls, attendance, examples, staff };
}
async function written(query: any) {
  const { data, error } = await query.select();
  if (error) throw error;
  if (!data?.length) throw new Error('This record changed or access was removed. Refresh before trying again.');
}
export async function saveStudentContext(id: string, goals: string, focus: string, previous: SuccessContext | null) {
  const values = { goals: goals.trim(), current_focus: focus.trim() };
  await written(previous
    ? db.from('mentorship_student_context').update(values).eq('enrollment_id', id).eq('updated_at', previous.updated_at)
    : db.from('mentorship_student_context').insert({ enrollment_id: id, ...values }));
}
export function safeSourceUrl(value: string | null) {
  if (!value) return undefined;
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url.href : undefined; } catch { return undefined; }
}
export async function saveStaffNote(enrollmentId: string, input: Pick<SuccessNote, 'kind' | 'title' | 'body' | 'transcript' | 'source_url' | 'occurred_on' | 'call_id'>, previous?: SuccessNote) {
  if (!input.title.trim()) throw new Error('Give the note a title.');
  if (input.source_url && !safeSourceUrl(input.source_url)) throw new Error('Use an HTTPS recording link without login details.');
  const values = { ...input, title: input.title.trim(), body: input.body.trim(), transcript: input.transcript.trim() };
  await written(previous ? db.from('mentorship_staff_notes').update(values).eq('id', previous.id).eq('updated_at', previous.updated_at)
    : db.from('mentorship_staff_notes').insert({ enrollment_id: enrollmentId, ...values }));
}
export async function saveOnboardingQuestionnaire(enrollmentId: string, plan: OnboardingPlan, date: string, source: string, transcript: string, previous?: SuccessNote): Promise<SuccessNote> {
  if (source.trim() && !safeSourceUrl(source.trim())) throw new Error('Use an HTTPS recording link without login details.');
  const values = { kind: 'onboarding', title: 'Onboarding call & week-one plan', body: onboardingNoteBody(plan), questionnaire: plan,
    occurred_on: date, source_url: source.trim() || null, transcript: transcript.trim() };
  const query = previous
    ? db.from('mentorship_staff_notes').update(values).eq('id', previous.id).eq('enrollment_id', enrollmentId).eq('updated_at', previous.updated_at)
    : db.from('mentorship_staff_notes').insert({ enrollment_id: enrollmentId, ...values });
  const { data, error } = await query.select().maybeSingle();
  if (error?.code === '23505') throw new Error('An onboarding questionnaire was just added by another staff member. Refresh to open it.');
  if (error) throw error;
  if (!data) throw new Error('This questionnaire changed or access was removed. Refresh before trying again. Your unsaved answers are still on screen.');
  return data as SuccessNote;
}
export async function addStudentAction(enrollmentId: string, title: string, ownerId: string, dueOn: string) {
  if (!title.trim()) throw new Error('Enter a follow-up action.');
  await written(db.from('mentorship_student_actions').insert({ enrollment_id: enrollmentId, title: title.trim(), owner_id: ownerId || null, due_on: dueOn || null }));
}
export async function toggleStudentAction(action: SuccessAction) {
  await written(db.from('mentorship_student_actions').update({ completed_at: action.completed_at ? null : new Date().toISOString() }).eq('id', action.id).eq('updated_at', action.updated_at));
}
export async function saveProgressExample(enrollmentId: string, title: string, before: string, after: string) {
  if (!title.trim() || !before || !after || before === after) throw new Error('Name the example and select two different audio uploads.');
  await written(db.from('mentorship_progress_examples').insert({ enrollment_id: enrollmentId, title: title.trim(), before_file_id: before, after_file_id: after }));
}
export async function markSurgeryDelivered(surgery: SuccessSurgery, deliveredOn: string) {
  const date = new Date(deliveredOn);
  if (!Number.isFinite(date.getTime()) || date.getTime() > Date.now()) throw new Error('Choose when the live surgery took place. It cannot be in the future.');
  await written(db.from('mentorship_surgeries').update({ delivered_at: date.toISOString() }).eq('id', surgery.id).is('delivered_at', null));
}
export async function successMediaUrl(path: string, feedback = false) {
  const { data, error } = await supabase.storage.from(feedback ? 'mentorship-feedback' : 'mentorship-submissions').createSignedUrl(path, 3600);
  if (error || !data?.signedUrl) throw new Error('Unable to open this file. Try again.');
  return data.signedUrl;
}

// A student record must be able to open historical feedback, not only the
// submissions returned by the current week's review queue.
export async function loadSuccessReview(submissionId: string): Promise<ReviewItem> {
  const found = await rows<SuccessSubmission>('mentorship_submissions', 'id,enrollment_id,week_id,state,submitted_at,updated_at', q => q.eq('id', submissionId));
  const submission = found[0];
  if (!submission?.submitted_at) throw new Error('This submission has not been sent for review.');
  const enrollmentRows = await rows<{ cohort_id: string }>('mentorship_enrollments', 'cohort_id', q => q.eq('id', submission.enrollment_id));
  if (!enrollmentRows[0]) throw new Error('Student enrollment not found.');
  const data = await loadCohortWorkspace(enrollmentRows[0].cohort_id, submission.enrollment_id);
  const student = data.students[0];
  if (!student) throw new Error('This student record is not available to your account.');
  const files = data.files.filter(f => f.submission_id === submission.id);
  const toFile = async (file: SuccessFile): Promise<PortalFile> => ({ id: file.id, name: file.file_name, size: Number(file.size_bytes), kind: file.kind, uploadedAt: file.uploaded_at, storagePath: file.storage_path, objectUrl: await successMediaUrl(file.storage_path) });
  const audio = await Promise.all(files.map(toFile));
  const song = audio.find(f => f.kind === 'song');
  if (!song) throw new Error('No song was uploaded with this submission.');
  const feedback = data.feedback.find(f => f.submission_id === submission.id);
  const status = feedback?.status === 'published' ? 'published' : feedback ? 'draft' : 'awaiting';
  return {
    id: submission.id, submissionId: submission.id, enrollmentId: student.id,
    studentId: student.user_id, studentName: student.name, studentEmail: student.email,
    studentProfile: student.profile, walkthrough: student.is_walkthrough, cohortId: data.cohort.id,
    weekNumber: data.weeks.find(w => w.id === submission.week_id)?.week_number ?? 1,
    songName: song.name, submittedLabel: new Date(submission.submitted_at).toLocaleString('en-GB'),
    stemsReady: files.some(f => f.kind === 'stems'), ideaNames: files.filter(f => f.kind === 'idea').map(f => f.file_name),
    status, song, stems: audio.find(f => f.kind === 'stems'), ideas: audio.filter(f => f.kind === 'idea'),
    surgerySelected: data.surgeries.some(s => s.submission_id === submission.id),
    feedback: feedback ? {
      id: feedback.id, status: status === 'published' ? 'published' : 'draft', writtenNotes: feedback.written_notes,
      nextAction: feedback.next_action, audioStoragePath: feedback.audio_storage_path ?? undefined,
      audioFileName: feedback.audio_file_name ?? undefined,
      audioUrl: feedback.audio_storage_path ? await successMediaUrl(feedback.audio_storage_path, true) : undefined,
      videoUrl: feedback.video_url ?? undefined,
    } : undefined,
  };
}
