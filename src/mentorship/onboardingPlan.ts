export const onboardingTemplate = 'onboarding-v1';
export const answerLabels = {
  goal: 'What would make these six weeks a success?',
  startingPoint: 'What are they working on, and where do they get stuck?',
  music: 'Which track and version did Rob listen to?',
  strengths: 'What is already working in their music?',
  focus: 'What are the one or two coaching priorities?',
  practice: 'What will they practise in week one, and how?',
  listenFor: 'What will Rob listen for in the first submission?',
  capacity: 'What time do they have, and what could get in the way?',
  george: 'What should George help with midweek?',
  extraTrack: 'Existing track, version, question and listening scope',
  extraDate: 'Agreed additional review date',
  handover: 'What else has been agreed or promised?',
} as const;
export type AnswerKey = keyof typeof answerLabels;
export type OnboardingAnswers = Record<AnswerKey, string>;
export type ExtraReview = 'not-discussed' | 'not-requested' | 'requested' | 'agreed';
export interface OnboardingPlan {
  template: typeof onboardingTemplate;
  status: 'draft' | 'agreed';
  answers: OnboardingAnswers;
  extraReview: ExtraReview;
  musicReviewed: boolean;
  recordingChecked: boolean;
}
export const extraReviewLabels: Record<ExtraReview, string> = {
  'not-discussed': 'Not discussed yet', 'not-requested': 'No additional review requested',
  requested: 'Requested; Rob has not agreed yet', agreed: 'Additional review agreed by Rob',
};
export function emptyOnboardingPlan(): OnboardingPlan {
  return { template: onboardingTemplate, status: 'draft', answers: Object.fromEntries(Object.keys(answerLabels).map(k => [k, ''])) as OnboardingAnswers, extraReview: 'not-discussed', musicReviewed: false, recordingChecked: false };
}
export function readOnboardingPlan(value: unknown): OnboardingPlan | null {
  if (!value || typeof value !== 'object') return null;
  const p = value as OnboardingPlan;
  if (p.template !== onboardingTemplate || !['draft','agreed'].includes(p.status) || !Object.prototype.hasOwnProperty.call(extraReviewLabels, p.extraReview)
      || typeof p.musicReviewed !== 'boolean' || typeof p.recordingChecked !== 'boolean' || !p.answers || typeof p.answers !== 'object') return null;
  if (Object.keys(answerLabels).some(k => typeof p.answers[k as AnswerKey] !== 'string' || p.answers[k as AnswerKey].length > 2000)) return null;
  return { template: onboardingTemplate, status: p.status, extraReview: p.extraReview, musicReviewed: p.musicReviewed, recordingChecked: p.recordingChecked,
    answers: Object.fromEntries(Object.keys(answerLabels).map(k => [k, p.answers[k as AnswerKey]])) as OnboardingAnswers };
}
export function validateOnboardingPlan(plan: OnboardingPlan) {
  if (!readOnboardingPlan(plan)) throw new Error('The questionnaire could not be read. Refresh before saving.');
  if (plan.status === 'agreed') {
    const required: AnswerKey[] = ['goal','music','focus','practice','listenFor'];
    if (!plan.musicReviewed || required.some(k => !plan.answers[k].trim())) throw new Error('Record the goal, music reviewed, coaching focus, week-one practice and what Rob will listen for before marking the plan agreed.');
    if (plan.extraReview === 'agreed' && (!plan.answers.extraTrack.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(plan.answers.extraDate))) throw new Error('Record the track, review scope and agreed date for the additional review.');
  }
}
export function onboardingNoteBody(plan: OnboardingPlan) {
  validateOnboardingPlan(plan);
  return [`Onboarding plan: ${plan.status === 'agreed' ? 'Agreed with student' : 'Draft'}`,
    `Music reviewed: ${plan.musicReviewed ? 'Yes' : 'Not confirmed'}`,
    `Recording checked: ${plan.recordingChecked ? 'Yes' : 'Not confirmed'}`,
    ...Object.entries(answerLabels).filter(([k]) => !['extraTrack','extraDate'].includes(k)).map(([k,label]) => `${label}\n${plan.answers[k as AnswerKey].trim() || 'Not recorded'}`),
    `Additional review\n${extraReviewLabels[plan.extraReview]}`,
    ...(['requested','agreed'].includes(plan.extraReview) ? [`${answerLabels.extraTrack}\n${plan.answers.extraTrack.trim() || 'Not recorded'}`,`${answerLabels.extraDate}\n${plan.answers.extraDate || 'Not agreed'}`] : []),
  ].join('\n\n');
}
