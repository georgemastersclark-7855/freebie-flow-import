import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Save } from 'lucide-react';
import { answerLabels, emptyOnboardingPlan, extraReviewLabels, readOnboardingPlan, type AnswerKey, type ExtraReview, type OnboardingPlan } from '../onboardingPlan';
import { saveOnboardingQuestionnaire, saveStudentContext, type StudentWorkspace, type SuccessNote } from '../studentSuccessApi';
import { localDateInput } from '../studentSuccess';
import { sopRoot } from '../staffSops';
import '../staffSops.css';
import { StudentLeadContext } from './StudentLeadContext';

type Props = { data: StudentWorkspace; save: (work: () => Promise<void>, message: string) => Promise<boolean>; onDirty: (dirty: boolean) => void; openFollowUps: () => void };
export function OnboardingQuestionnaire({ data, save, onDirty, openFollowUps }: Props) {
  const existing = data.notes.find(n => readOnboardingPlan(n.questionnaire));
  const [previous, setPrevious] = useState<SuccessNote | undefined>(existing);
  const [plan, setPlan] = useState<OnboardingPlan>(() => readOnboardingPlan(existing?.questionnaire) ?? emptyOnboardingPlan());
  const [date, setDate] = useState(existing?.occurred_on ?? localDateInput());
  const [source, setSource] = useState(existing?.source_url ?? '');
  const [transcript, setTranscript] = useState(existing?.transcript ?? '');
  const [formError, setFormError] = useState('');
  const snapshot = JSON.stringify({ plan, date, source, transcript });
  const [savedSnapshot, setSavedSnapshot] = useState(snapshot);
  const dirty = snapshot !== savedSnapshot;
  const unsupported = data.notes.some(n => n.questionnaire && !readOnboardingPlan(n.questionnaire));
  useEffect(() => { onDirty(dirty); return () => onDirty(false); }, [dirty, onDirty]);
  useEffect(() => {
    if (!dirty) return;
    const unload = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    const leave = (event: MouseEvent) => {
      const a = (event.target as Element).closest?.('a');
      if (!a || a.target === '_blank' || !a.href || a.getAttribute('href')?.startsWith('#')) return;
      if (!window.confirm('Leave this questionnaire? Your unsaved answers will be lost.')) { event.preventDefault(); event.stopPropagation(); }
    };
    window.addEventListener('beforeunload', unload); document.addEventListener('click', leave, true);
    return () => { window.removeEventListener('beforeunload', unload); document.removeEventListener('click', leave, true); };
  }, [dirty]);
  const answer = (key: AnswerKey, value: string) => setPlan(p => ({ ...p, answers: { ...p.answers, [key]: value } }));
  const field = (key: AnswerKey, hint?: string, rows = 3) => <label className="ss-field" key={key}>{answerLabels[key]}{hint && <span>{hint}</span>}<textarea value={plan.answers[key]} rows={rows} maxLength={2000} onChange={e => answer(key, e.target.value)}/></label>;
  const persist = async () => {
    setFormError('');
    let stored: SuccessNote | undefined;
    if (await save(async () => {
      try { stored = await saveOnboardingQuestionnaire(data.student.id, plan, date, source, transcript, previous); }
      catch (error) { setFormError(error instanceof Error ? error.message : 'Could not save. Please try again.'); throw error; }
    }, 'Onboarding questionnaire saved.')) {
      setPrevious(stored); setSavedSnapshot(snapshot);
    }
  };
  const focusText = [plan.answers.focus, `Week-one practice: ${plan.answers.practice}`, `Listen for: ${plan.answers.listenFor}`].join('\n\n');
  const focusMatches = data.context?.goals === plan.answers.goal.trim() && data.context?.current_focus === focusText.trim();
  if (unsupported) return <div className="ss-error">This student has a questionnaire version this screen cannot edit. Open Calls & notes to read it.</div>;
  return <div className="sop-layout sop-call-layout"><form className="sop-questionnaire" onSubmit={e => { e.preventDefault(); void persist(); }}>
    <div className="ss-row"><div><h2>Onboarding call & week-one plan</h2><p className="ss-muted">Save notes as you go. These answers are visible to staff.</p></div><span className="ss-badge">{previous ? readOnboardingPlan(previous.questionnaire)?.status === 'agreed' ? 'Plan agreed' : 'Draft saved' : 'Not saved yet'}</span></div>
    <StudentLeadContext enrollmentId={data.student.id}/>
    <section className="ss-card sop-step"><div className="sop-step-heading"><span>1</span><h2>Prepare and listen</h2></div>
      <label className="ss-field">Call date<input type="date" required value={date} onChange={e => setDate(e.target.value)}/></label>
      <label className="sop-check"><input type="checkbox" checked={plan.musicReviewed} onChange={e => setPlan(p => ({ ...p, musicReviewed: e.target.checked }))}/> Rob has listened to the student’s music</label>
      <label className="sop-check"><input type="checkbox" checked={plan.recordingChecked} onChange={e => setPlan(p => ({ ...p, recordingChecked: e.target.checked }))}/> Recording has been checked and discussed with the student</label>
      {field('music', 'Record the track name, version and any useful timestamps.')}{field('strengths', 'Identify something specific that already works.')}
    </section>
    <section className="ss-card sop-step"><div className="sop-step-heading"><span>2</span><h2>Understand their starting point</h2></div>{field('goal')}{field('startingPoint')}{field('capacity', 'Agree a realistic way to fit the weekly work around their commitments.')}</section>
    <section className="ss-card sop-step"><div className="sop-step-heading"><span>3</span><h2>Agree their week-one plan</h2></div>{field('focus', 'Be specific about what you hear and why it matters.')}{field('practice', 'Use a demonstration, reference or practical example, then apply it within their weekly work.')}{field('listenFor', 'Explain what improvement you will listen for. Ask the student to talk through what they will try first.')}</section>
    <section className="ss-card sop-step"><div className="sop-step-heading"><span>4</span><h2>Arrange support and extra reviews</h2></div>{field('george', 'George can review music midweek and help them apply the agreed coaching focus.')}
      <label className="ss-field">Additional existing-track review<span>Rob can agree an extra review alongside the normal weekly submission.</span><select value={plan.extraReview} onChange={e => setPlan(p => ({ ...p, extraReview: e.target.value as ExtraReview }))}>{Object.entries(extraReviewLabels).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      {['requested','agreed'].includes(plan.extraReview) && <>{field('extraTrack', 'Record the track and version, the question, the section or full song Rob will hear, and how it will be shared.')}<label className="ss-field">{answerLabels.extraDate}<input type="date" value={plan.answers.extraDate} onChange={e => answer('extraDate', e.target.value)}/></label></>}
      {field('handover', 'Include any promised check-in, resource or demonstration, with an owner and date where agreed.')}
    </section>
    <section className="ss-card"><h2>Close the call</h2><p>Recap the plan with the student. Check they know what to practise, how to get help and what Rob will listen for.</p><label className="ss-field mt-4">Plan status<select value={plan.status} onChange={e => setPlan(p => ({ ...p, status: e.target.value as OnboardingPlan['status'] }))}><option value="draft">Draft / still discussing</option><option value="agreed">Agreed with the student</option></select></label><details className="ss-transcript"><summary>Recording link and transcript</summary><div className="ss-form"><label className="ss-field">Recording link (optional)<input type="url" value={source} onChange={e => setSource(e.target.value)} maxLength={2048} placeholder="https://…"/></label><label className="ss-field">Transcript or relevant excerpt (optional)<textarea rows={6} maxLength={500000} value={transcript} onChange={e => setTranscript(e.target.value)}/></label></div></details></section>
    <div className="sop-save-bar">{formError && <div role="alert" className="ss-error w-full mb-0">{formError}</div>}<span role="status" className="ss-muted">{dirty ? 'Unsaved changes' : previous ? 'Saved to student record' : 'Ready to take notes'}</span><button className="ss-button ss-primary" type="submit"><Save size={15}/> Save questionnaire</button></div>
  </form><aside className="ss-card sop-outline"><h2>Onboarding call</h2><p>Leave the student with a clear first step they know how to take.</p><a href={`${sopRoot}/onboarding`} target="_blank" rel="noreferrer" className="ss-link mt-4">Open the call guide <ExternalLink size={14}/></a>
    <h3 className="ss-section-label">After saving</h3><p className="ss-muted">Use the agreed goal and week-one plan in the coaching summary. Review this before replacing an existing focus.</p>
    <button className="ss-button mt-3" type="button" disabled={dirty || !previous || plan.status !== 'agreed' || focusMatches} onClick={() => { if (data.context && !window.confirm('Replace the current goals and coaching focus with this onboarding plan?')) return; void save(() => saveStudentContext(data.student.id, plan.answers.goal, focusText, data.context), 'Goals & current focus updated.'); }}>{focusMatches ? 'Coaching focus is up to date' : 'Use as coaching focus'}</button>
    <h3 className="ss-section-label">Follow through</h3><p className="ss-muted">Add any promised extra review or check-in with an owner and date. Share the agreed plan with the student through your agreed channel.</p><button type="button" onClick={openFollowUps} className="ss-link mt-3">Open follow-ups <ArrowRight size={14}/></button>
    <Link className="ss-link mt-5" to={sopRoot}>Browse SOP library <ArrowRight size={14}/></Link>
  </aside></div>;
}
