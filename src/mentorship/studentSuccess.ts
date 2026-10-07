import type { CohortWorkspace, SuccessEnrollment, SuccessFile, StudentWorkspace } from './studentSuccessApi';

export function studentProgress(data: CohortWorkspace, student: SuccessEnrollment, now = new Date()) {
  const submissions = data.submissions.filter(s => s.enrollment_id === student.id);
  const ids = new Set(submissions.map(s => s.id));
  const submitted = submissions.filter(s => s.submitted_at);
  const published = new Set(data.feedback.filter(f => f.status === 'published').map(f => f.submission_id));
  const missingWeeks = student.status === 'active' ? data.weeks.filter(w => w.deadline_at && new Date(w.deadline_at) < now && !submitted.some(s => s.week_id === w.id)) : [];
  const reviews = submitted.filter(s => !published.has(s.id)).length;
  const actions = data.actions.filter(a => a.enrollment_id === student.id && !a.completed_at);
  const needsAttention = missingWeeks.length > 0 || reviews > 0 || actions.length > 0;
  return {
    submissions, submitted: submitted.length,
    starters: data.files.filter(f => ids.has(f.submission_id) && f.kind === 'idea').length,
    surgeries: data.surgeries.filter(s => ids.has(s.submission_id) && s.delivered_at).length,
    missingWeeks, reviews, actions, needsAttention,
    lastActivity: submissions.map(s => s.updated_at).sort().slice(-1)[0],
  };
}
export function fileWeek(data: Pick<StudentWorkspace, 'submissions' | 'weeks'>, file: SuccessFile) {
  const submission = data.submissions.find(s => s.id === file.submission_id);
  return data.weeks.find(w => w.id === submission?.week_id)?.week_number;
}
export function audioOptions(data: StudentWorkspace) {
  return data.files.filter(f => f.kind !== 'stems').sort((a, b) => (fileWeek(data, a) ?? 0) - (fileWeek(data, b) ?? 0) || a.uploaded_at.localeCompare(b.uploaded_at));
}
export function localDateInput(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
