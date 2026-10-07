import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowRight, ArrowUpRight, Check, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Loader2, LockKeyhole, RotateCcw } from 'lucide-react';
import { useParams } from 'react-router-dom';
import type { ApplicationFormConfig, ApplicationQuestion } from '../../supabase/functions/_shared/applicationFormSchema';
import { MembershipBadge } from '@/mentorship/components/StudentAvatar';
import { clearDraft, emptyAnswers, readAttribution, readDraft, saveDraft, type Answers, type ApplicationDraft } from '@/application/applicationDraft';
import './mentorship-application.css';

type Screen = 'welcome'|'question'|'review'|'success';
type Field = ApplicationQuestion;
export type PublicApplicationForm = {id:string;name:string;slug:string;revision:number;config:ApplicationFormConfig};

function fieldError(field:Field, answers:Answers):string {
  const value = answers[field.key]?.trim() || '';
  if (!value) return field.required ? (field.type==='choice'?'Choose an option to continue.':field.key==='name'?'Please enter your name.':field.type==='email'?'Please enter your email address.':'Please answer this question to continue.') : '';
  if (field.maxLength && value.length > field.maxLength) return 'Please keep this answer under '+field.maxLength+' characters.';
  if (field.type==='email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address.';
  if (field.options && !field.options.includes(value)) return 'Please choose one of the options.';
  if (field.key==='music') {
    const links=(value.match(/https:\/\/[^\s<>"']+/gi) || []).map(link=>link.replace(/[),.;!?\]}]+$/g,''));
    if (/\bhttp:\/\//i.test(value) || links.some(link=>{try {const u=new URL(link);return u.protocol!=='https:'||!u.hostname||!!u.username||!!u.password;}catch{return true;}})) return 'Use a full HTTPS link, for example https://soundcloud.com/your-track.';
    if (links.length>8) return 'Please include up to 8 music links.';
  }
  return '';
}

function Brand() {
  return <div className="ma-brand">
    <span className="ma-avatar"><img src="/assets/rob-profile.jpg" alt="Rob Late" width="40" height="40"/></span>
    <span><span className="ma-brand-name">Rob Late <MembershipBadge className="ma-badge"/></span><span className="ma-brand-subtitle">Producer Mentorship</span></span>
  </div>;
}

export default function MentorshipApplication() {
  const {slug}=useParams();
  const [form,setForm]=useState<PublicApplicationForm|null>(null);
  const [problem,setProblem]=useState('');
  const [retry,setRetry]=useState(0);
  useEffect(()=>{
    const controller=new AbortController();
    setForm(null);setProblem('');
    fetch(import.meta.env.VITE_SUPABASE_URL+'/functions/v1/submit-mentorship-application'+(slug?'?slug='+encodeURIComponent(slug):''),{
      headers:{apikey:import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY},signal:controller.signal,
    }).then(async response=>{
      const result=await response.json();
      if(!response.ok||!result.form)throw new Error(response.status===404||response.status===410?'This application form is not currently accepting applications.':'The application could not be loaded. Please try again.');
      setForm(result.form);
    }).catch(error=>{if(error.name!=='AbortError')setProblem(error.message||'The application could not be loaded.');});
    return()=>controller.abort();
  },[slug,retry]);
  if(!form)return <div className="ma-loading"><Brand/><h1>{problem?'Application unavailable':'Loading your application…'}</h1>{problem&&<><p role="alert">{problem}</p><button className="ma-secondary" onClick={()=>setRetry(n=>n+1)}>Try again</button><a href="mailto:team@roblate.com">Contact the mentorship team</a></>}</div>;
  return <ApplicationExperience key={form.id+':'+form.revision} form={form}/>;
}

export function ApplicationExperience({form,preview=false}:{form:PublicApplicationForm;preview?:boolean}) {
  const fields=form.config.questions;
  const keys=fields.map(field=>field.key);
  const sections=[...new Set(fields.map(field=>field.section).filter(Boolean))];
  const [initial] = useState(()=>preview?null:readDraft(form.id,form.revision,keys));
  const [screen,setScreen] = useState<Screen>('welcome');
  const [answers,setAnswers] = useState<Answers>(initial?.answers || (()=>emptyAnswers(keys)));
  const [step,setStep] = useState(initial?.step || 0);
  const [id,setId] = useState(initial?.id || '');
  const [attribution,setAttribution] = useState(initial?.attribution || readAttribution);
  const [hasDraft,setHasDraft] = useState(Boolean(initial));
  const [storageAvailable,setStorageAvailable] = useState(true);
  const [error,setError] = useState('');
  const [submitting,setSubmitting] = useState(false);
  const [submittedEmail,setSubmittedEmail] = useState('');
  const [editing,setEditing] = useState(false);
  const [confirmReset,setConfirmReset] = useState(false);
  const [direction,setDirection] = useState<'forward'|'back'>('forward');
  const heading = useRef<HTMLHeadingElement>(null);
  const answerInput = useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  const honeypot=useRef<HTMLInputElement>(null);
  const sending=useRef(false);
  const active=fields[Math.min(step,fields.length-1)];
  const section=sections.indexOf(active.section);
  const answered=keys.filter(key=>answers[key].trim()).length;
  const completed=screen==='success'?fields.length:screen==='review'?fields.length:screen==='question'?step:0;

  useEffect(()=>{
    if(preview)return;
    document.title="Apply — Rob Late's Producer Mentorship";
    const meta=document.createElement('meta'); meta.name='robots';meta.content='noindex,follow';document.head.appendChild(meta);
    return ()=>meta.remove();
  },[preview]);
  useEffect(()=>{
    if(!id || screen==='success' || preview) return;
    const draft:ApplicationDraft={version:form.id,revision:form.revision,id,answers,step,attribution,updatedAt:Date.now()};
    setStorageAvailable(saveDraft(draft));setHasDraft(true);
  },[answers,step,id,attribution,screen,preview,form.id,form.revision]);
  useEffect(()=>{
    if(screen==='welcome') return;
    heading.current?.focus({preventScroll:true});
    if(!preview)window.scrollTo({top:0,behavior:'instant'});
    if(screen==='question' && active.type!=='choice' && window.matchMedia('(min-width: 760px)').matches) answerInput.current?.focus({preventScroll:true});
  },[screen,step,active.type,preview]);

  const start=()=>{
    if(!id) setId(crypto.randomUUID());
    setScreen(step>=fields.length?'review':'question');
  };
  const update=(value:string)=>{setAnswers(prev=>({...prev,[active.key]:value}));setError('');};
  const go=(next:number)=>{
    setError('');setDirection(next<step?'back':'forward');setStep(next);setScreen(next>=fields.length?'review':'question');
  };
  const next=()=>{
    const problem=fieldError(active,answers);
    if(problem){setError(problem);answerInput.current?.focus();return;}
    if(editing){setEditing(false);go(fields.length);return;}
    go(step+1);
  };
  const previous=()=>{setError('');if(screen==='review'){go(fields.length-1);}else if(step>0){go(step-1);}else{setScreen('welcome');}};
  const reset=()=>{
    if(!preview)clearDraft(form.id);setAnswers(emptyAnswers(keys));setId('');setStep(0);setHasDraft(false);
    setAttribution(readAttribution());setError('');setEditing(false);setConfirmReset(false);setScreen('welcome');
  };
  const keyDown=(event:KeyboardEvent<HTMLElement>)=>{
    if(event.nativeEvent.isComposing||event.ctrlKey||event.metaKey||event.altKey||submitting) return;
    if(screen!=='question') return;
    if(event.key==='Enter' && !(active.type==='textarea' && event.shiftKey) && (event.target===answerInput.current)){
      event.preventDefault();next();
    }
  };
  useEffect(()=>{
    if(screen!=='question' || active.type!=='choice') return;
    const listener=(event:globalThis.KeyboardEvent)=>{
      if(event.ctrlKey||event.metaKey||event.altKey||event.isComposing||/INPUT|TEXTAREA/.test((event.target as HTMLElement)?.tagName))return;
      const index=event.key.toUpperCase().charCodeAt(0)-65;
      if(event.key.length===1 && index>=0 && index<(active.options?.length||0)){
        event.preventDefault();setAnswers(prev=>({...prev,[active.key]:active.options![index]}));setError('');
      }
      if(event.key==='Enter' && (event.target===document.body||event.target===heading.current)){event.preventDefault();next();}
    };
    window.addEventListener('keydown',listener);return()=>window.removeEventListener('keydown',listener);
  });

  const submit=async()=>{
    if(sending.current)return;
    if(preview){setSubmittedEmail(answers.email?.trim()||'your email address');setScreen('success');return;}
    const invalid=fields.findIndex(field=>Boolean(fieldError(field,answers)));
    if(invalid>=0){setEditing(true);go(invalid);setError(fieldError(fields[invalid],answers));return;}
    sending.current=true;setSubmitting(true);setError('');
    const controller=new AbortController();
    const timeout=window.setTimeout(()=>controller.abort(),25000);
    try {
      const response=await fetch(import.meta.env.VITE_SUPABASE_URL+'/functions/v1/submit-mentorship-application',{
        method:'POST',headers:{'Content-Type':'application/json','apikey':import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY},
        body:JSON.stringify({form_id:form.id,form_revision:form.revision,submission_id:id,answers,attribution,website:honeypot.current?.value||''}),
        signal:controller.signal,
      });
      const result=await response.json().catch(()=>null);
      if(!response.ok || result?.success!==true || result?.submission_id!==id){
        if(response.status===429) throw new Error("You've made several attempts. Your answers are saved—please try again later, or email team@roblate.com.");
        if(response.status===410) throw new Error("Applications are currently closed. Email team@roblate.com if you'd like to ask about a place.");
        if(response.status===409) throw new Error("This application was already sent with different answers. Email team@roblate.com if you need to update it.");
        if(response.status===400) throw new Error("We couldn't accept one of your answers. Check your email and music links, then try again.");
        throw new Error("We couldn't confirm your application was saved. Your answers are still here. Please try again.");
      }
      setSubmittedEmail(answers.email.trim());clearDraft(form.id);setHasDraft(false);setScreen('success');
      setAnswers(emptyAnswers(keys));
    } catch(err) {
      setError(err instanceof Error && err.name!=='AbortError'?err.message:"The connection took too long. Your answers are still here—please try again.");
    } finally {window.clearTimeout(timeout);sending.current=false;setSubmitting(false);}
  };

  return <div className={'mentorship-application ma-screen-'+screen} onKeyDown={keyDown}>
    <aside className="ma-identity" aria-label="Rob Late's Producer Mentorship">
      <img className="ma-studio-photo" src="/assets/rob-home-studio-wide.jpg" alt="Rob in his music studio"/>
      <div className="ma-photo-shade"/>
      <div className="ma-identity-top"><Brand/></div>
      <div className="ma-identity-bottom">
        <span className="ma-photo-label">{form.config.identity.cohortLabel}</span>
        <h2>{form.config.identity.title}</h2>
        <p>{form.config.identity.description}</p>
        <div className="ma-photo-meta">{form.config.identity.details.map((detail,index)=><span key={index}>{detail}</span>)}</div>
      </div>
    </aside>
    <div className="ma-workspace">{preview&&<div className="ma-preview-label">Preview only · no application will be sent</div>}
      <header className="ma-topbar">
        <div className="ma-mobile-brand"><Brand/></div>
        <span className="ma-desktop-label">PRODUCER MENTORSHIP <span>/</span> APPLICATION</span>
        <a href="mailto:team@roblate.com">Need a hand? <ArrowUpRight size={14}/></a>
      </header>
      <main className="ma-main">
        {screen==='welcome' && <div className="ma-intro ma-enter">
          <p className="ma-kicker">{form.config.welcome.eyebrow}</p>
          <h1>{form.config.welcome.title}</h1>
          <p className="ma-intro-copy">{form.config.welcome.description}</p>
          <div className="ma-signoff"><img src="/assets/rob-profile.jpg" alt="" width="28" height="28"/><span>Rob Late</span><MembershipBadge className="ma-badge"/></div>
          {hasDraft && <div className="ma-resume"><RotateCcw size={18}/><div><strong>Your application is saved</strong><span>{initial?.updatedForm?"The form has changed. Your saved answers are here—please review them.":`${answered} of ${fields.length} questions answered. Pick up where you left off.`}</span></div></div>}
          <button className="ma-primary" onClick={start}>{hasDraft?'Continue application':form.config.welcome.buttonText}<ArrowRight size={20}/></button>
          <div className="ma-time"><Clock3 size={15}/><span>About {Math.max(1,Math.ceil(fields.length/2))} minutes</span><span aria-hidden="true">·</span><span>No payment taken</span></div>
          {hasDraft && <button className="ma-text-button ma-start-over" onClick={()=>setConfirmReset(true)}>Start again</button>}
          {confirmReset && <div className="ma-reset-confirm" role="alert"><p>Clear your saved answers and start a new application?</p><button className="ma-secondary" onClick={reset}>Clear and start again</button><button className="ma-text-button" onClick={()=>setConfirmReset(false)}>Keep my answers</button></div>}
        </div>}
        {screen==='question' && <div className="ma-question-layout">
          <nav className="ma-sections" aria-label="Application sections">{sections.map((s,i)=><span key={s} className={i===section?'is-current':i<section?'is-complete':''} aria-current={i===section?'step':undefined}>{i<section?<Check size={13}/>:<span className="ma-section-dot"/>}{s}</span>)}</nav>
          <form className={'ma-question ma-enter ma-'+direction} key={step} onSubmit={event=>{event.preventDefault();next();}}>
            <div className="ma-question-number"><span>{String(step+1).padStart(2,'0')}</span><ArrowRight size={15}/><span>{active.required?'Required':'Optional'}</span></div>
            <h1 id="ma-question-title" tabIndex={-1} ref={heading}>{active.title}</h1>
            <p className="ma-hint" id="ma-question-hint">{active.description}</p>
            {active.type==='choice' ? <fieldset className="ma-choices" aria-labelledby="ma-question-title" aria-describedby={'ma-question-hint'+(error?' ma-error':'')}>
              <legend className="ma-sr-only">{active.title}</legend>
              {active.options?.map((option,index)=><label key={option} className={'ma-choice '+(answers[active.key]===option?'is-selected':'')}>
                <input type="radio" name={active.key} value={option} checked={answers[active.key]===option} onChange={()=>update(option)} />
                <span className="ma-choice-letter" aria-hidden="true">{String.fromCharCode(65+index)}</span><span>{option}</span><Check size={18} className="ma-choice-check" aria-hidden="true"/>
              </label>)}
            </fieldset>:active.type==='textarea'?<>
              <textarea ref={answerInput} className="ma-answer ma-answer-long" aria-labelledby="ma-question-title" aria-describedby={'ma-question-hint'+(error?' ma-error':'')} aria-invalid={!!error} rows={4} maxLength={active.maxLength||4000} value={answers[active.key]} onChange={e=>update(e.target.value)} placeholder={active.placeholder} />
              <div className="ma-input-meta"><span><span className="ma-keyboard-hint">Shift + Enter for a new line</span></span><span>{answers[active.key].length.toLocaleString()} / {(active.maxLength||4000).toLocaleString()}</span></div>
            </>:<input ref={answerInput} className="ma-answer" type={active.type==='email'?'email':'text'} inputMode={active.type==='email'?'email':'text'} autoComplete={active.key==='name'?'name':active.key==='email'?'email':'off'} autoCapitalize={active.type==='email'?'none':undefined} spellCheck={active.type!=='email'} aria-labelledby="ma-question-title" aria-describedby={'ma-question-hint'+(error?' ma-error':'')} aria-invalid={!!error} maxLength={active.maxLength||254} value={answers[active.key]} onChange={e=>update(e.target.value)} placeholder={active.placeholder} />}
            {error && <p className="ma-error" id="ma-error" role="alert">{error}</p>}
            <div className="ma-question-actions"><button type="submit" className="ma-primary">{editing?'Save answer':step===fields.length-1?'Review application':!active.required&&!answers[active.key].trim()?'Skip question':'Continue'}<ArrowRight size={19}/></button><span className="ma-keyboard-hint">press <strong>Enter ↵</strong></span></div>
          </form>
        </div>}
        {screen==='review' && <div className="ma-review ma-enter">
          <p className="ma-kicker">One last check</p>
          <h1 tabIndex={-1} ref={heading}>Ready to send?</h1>
          <p className="ma-hint">Check your answers below. You can change anything before sending your application.</p>
          <dl className="ma-review-list">{fields.map((field,index)=><div className="ma-review-row" key={field.key}><div><dt>{field.title}</dt><dd>{answers[field.key]||<span className="ma-empty-answer">Not provided</span>}</dd></div><button type="button" className="ma-text-button" disabled={submitting} aria-label={'Edit '+field.title} onClick={()=>{setEditing(true);go(index);}}>Edit</button></div>)}</dl>
          <div className="ma-honeypot" aria-hidden="true"><label>Website<input ref={honeypot} type="text" tabIndex={-1} autoComplete="off" name="website"/></label></div>
          <p className="ma-submit-note"><LockKeyhole size={16}/>Your answers are shared with Rob’s mentorship team to review your application. <a href="/legal/privacy-policy" target="_blank" rel="noreferrer">Privacy policy</a></p>
          {error && <p className="ma-error" role="alert">{error}</p>}
          <button className="ma-primary" disabled={submitting} onClick={()=>void submit()}>{submitting?<><Loader2 size={18} className="ma-spinner"/>Sending your application…</>:<>Send application<ArrowRight size={20}/></>}</button>
          <p className="ma-small-print">Applying doesn’t take a payment or reserve a place.</p>
        </div>}
        {screen==='success' && <div className="ma-success ma-enter">
          <span className="ma-success-icon"><CheckCircle2 size={35}/></span>
          <p className="ma-kicker">Application received</p>
          <h1 ref={heading} tabIndex={-1}>{form.config.completion.title}</h1>
          <p className="ma-intro-copy">{form.config.completion.description.split('{email}').join(submittedEmail)}</p>
          <div className="ma-next"><span className="ma-next-number">01</span><div><strong>We review your application</strong><p>Rob and the team will look through your answers and listen to the music you’ve shared.</p></div></div>
          <div className="ma-next"><span className="ma-next-number">02</span><div><strong>We’ll email you about the next step</strong><p>You don’t need to book a call or make a payment now.</p></div></div>
          <a className="ma-secondary ma-return" href="https://roblate.com">Back to Rob Late<ArrowUpRight size={17}/></a>
        </div>}
      </main>
      <footer className="ma-footer">
        {screen==='question'||screen==='review'?<>
          <div className="ma-progress-info"><span>{screen==='review'?'Review your answers':'Question '+(step+1)+' of '+fields.length}</span><span className="ma-save-label">{preview?'Preview · answers are not saved':storageAvailable?'Progress saved on this device':'Keep this tab open to keep your answers'}</span></div>
          <div className="ma-progress-track" role="progressbar" aria-label="Application progress" aria-valuemin={0} aria-valuemax={fields.length} aria-valuenow={completed}><span style={{width:completed/fields.length*100+'%'}}/></div>
          <div className="ma-footer-nav"><button aria-label="Previous question" disabled={submitting} onClick={previous}><ChevronLeft size={20}/></button>{screen==='question'&&<button aria-label="Next question" onClick={next}><ChevronRight size={20}/></button>}</div>
        </>:<div className="ma-footer-simple"><span>Rob Late’s Producer Mentorship</span><a href="/legal/privacy-policy" target="_blank" rel="noreferrer">Privacy</a></div>}
      </footer>
    </div>
  </div>;
}
