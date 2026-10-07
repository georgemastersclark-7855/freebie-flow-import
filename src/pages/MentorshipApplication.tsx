import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowRight, ArrowUpRight, Check, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Loader2, LockKeyhole, RotateCcw } from 'lucide-react';
import { APPLICATION_FIELDS } from '../../supabase/functions/_shared/mentorshipApplication';
import { MembershipBadge } from '@/mentorship/components/StudentAvatar';
import { ANSWER_KEYS, clearDraft, emptyAnswers, FORM_VERSION, readAttribution, readDraft, saveDraft, type Answers, type AnswerKey, type ApplicationDraft } from '@/application/applicationDraft';
import './mentorship-application.css';

type Screen = 'welcome'|'question'|'review'|'success';
type Field = {key:string;title:string;type:'text'|'email'|'textarea'|'choice';required:boolean;options?:readonly string[];maxLength?:number};
const fields = APPLICATION_FIELDS as readonly Field[];
const sections = [
  {label:'About you',from:0,to:2},
  {label:'Your music',from:3,to:4},
  {label:'Your goals',from:5,to:7},
  {label:'Your place',from:8,to:9},
];
const hints:Record<string,string> = {
  name:"Let's start with what we should call you.",
  email:"We'll get back to you here about your application.",
  social:"Include the platform if it isn't Instagram.",
  music:"Spotify, SoundCloud, YouTube or a private listening link. Make sure we can play it.",
  experience:"This helps me understand where you're starting from.",
  goal:"Pick the one that best describes what you're working towards.",
  struggles:"Tell me where you get stuck. The more specific you can be, the better.",
  income:"This gives me a little more context about where you're at. Amounts are in US dollars.",
  investment:"Applying doesn't take a payment or reserve a place. We'll review your application first.",
  source:"Where did you first discover my work?",
};
const placeholders:Record<string,string> = {
  name:'Your full name',
  email:'you@example.com',
  social:'@yourhandle',
  music:'Paste your music links here…',
  struggles:'The things I want help with are…',
};

function fieldError(field:Field, answers:Answers):string {
  const value = answers[field.key as AnswerKey]?.trim() || '';
  if (!value) return field.required ? (field.key==='investment'?'Choose an option to continue.':'Please enter your '+(field.key==='name'?'name.':'email address.')) : '';
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
  const [initial] = useState(readDraft);
  const [screen,setScreen] = useState<Screen>('welcome');
  const [answers,setAnswers] = useState<Answers>(initial?.answers || emptyAnswers);
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
  const section=sections.findIndex(s=>step>=s.from && step<=s.to);
  const answered=ANSWER_KEYS.filter(key=>answers[key].trim()).length;
  const completed=screen==='success'?10:screen==='review'?10:screen==='question'?step:0;

  useEffect(()=>{
    document.title="Apply — Rob Late's Producer Mentorship";
    const meta=document.createElement('meta'); meta.name='robots';meta.content='noindex,follow';document.head.appendChild(meta);
    return ()=>meta.remove();
  },[]);
  useEffect(()=>{
    if(!id || screen==='success') return;
    const draft:ApplicationDraft={version:FORM_VERSION,id,answers,step,attribution,updatedAt:Date.now()};
    setStorageAvailable(saveDraft(draft));setHasDraft(true);
  },[answers,step,id,attribution,screen]);
  useEffect(()=>{
    if(screen==='welcome') return;
    heading.current?.focus({preventScroll:true});
    window.scrollTo({top:0,behavior:'instant'});
    if(screen==='question' && active.type!=='choice' && window.matchMedia('(min-width: 760px)').matches) answerInput.current?.focus({preventScroll:true});
  },[screen,step,active.type]);

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
    clearDraft();setAnswers(emptyAnswers());setId('');setStep(0);setHasDraft(false);
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
    const invalid=fields.findIndex(field=>Boolean(fieldError(field,answers)));
    if(invalid>=0){setEditing(true);go(invalid);setError(fieldError(fields[invalid],answers));return;}
    sending.current=true;setSubmitting(true);setError('');
    const controller=new AbortController();
    const timeout=window.setTimeout(()=>controller.abort(),25000);
    try {
      const response=await fetch(import.meta.env.VITE_SUPABASE_URL+'/functions/v1/submit-mentorship-application',{
        method:'POST',headers:{'Content-Type':'application/json','apikey':import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY},
        body:JSON.stringify({form_version:FORM_VERSION,submission_id:id,answers,attribution,website:honeypot.current?.value||''}),
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
      setSubmittedEmail(answers.email.trim());clearDraft();setHasDraft(false);setScreen('success');
      setAnswers(emptyAnswers());
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
        <span className="ma-photo-label">Cohort 02 / Application</span>
        <h2>WORK DIRECTLY<br/>WITH ROB LATE.</h2>
        <p>Six weeks of making music,<br/>with my feedback on your work.</p>
        <div className="ma-photo-meta"><span>6 weeks</span><span>12 places</span><span>$2,497 USD</span></div>
      </div>
    </aside>
    <div className="ma-workspace">
      <header className="ma-topbar">
        <div className="ma-mobile-brand"><Brand/></div>
        <span className="ma-desktop-label">PRODUCER MENTORSHIP <span>/</span> APPLICATION</span>
        <a href="mailto:team@roblate.com">Need a hand? <ArrowUpRight size={14}/></a>
      </header>
      <main className="ma-main">
        {screen==='welcome' && <div className="ma-intro ma-enter">
          <p className="ma-kicker">Apply for cohort 2</p>
          <h1>LET’S HEAR<br/>ABOUT YOU.</h1>
          <p className="ma-intro-copy">Tell me where you’re at with your music and what you want to work on. I’ll use your answers to see whether the mentorship is right for you.</p>
          <div className="ma-signoff"><img src="/assets/rob-profile.jpg" alt="" width="28" height="28"/><span>Rob Late</span><MembershipBadge className="ma-badge"/></div>
          {hasDraft && <div className="ma-resume"><RotateCcw size={18}/><div><strong>Your application is saved</strong><span>{answered} of 10 questions answered. Pick up where you left off.</span></div></div>}
          <button className="ma-primary" onClick={start}>{hasDraft?'Continue application':'Start application'}<ArrowRight size={20}/></button>
          <div className="ma-time"><Clock3 size={15}/><span>About 5 minutes</span><span aria-hidden="true">·</span><span>No payment taken</span></div>
          {hasDraft && <button className="ma-text-button ma-start-over" onClick={()=>setConfirmReset(true)}>Start again</button>}
          {confirmReset && <div className="ma-reset-confirm" role="alert"><p>Clear your saved answers and start a new application?</p><button className="ma-secondary" onClick={reset}>Clear and start again</button><button className="ma-text-button" onClick={()=>setConfirmReset(false)}>Keep my answers</button></div>}
        </div>}
        {screen==='question' && <div className="ma-question-layout">
          <nav className="ma-sections" aria-label="Application sections">{sections.map((s,i)=><span key={s.label} className={i===section?'is-current':i<section?'is-complete':''} aria-current={i===section?'step':undefined}>{i<section?<Check size={13}/>:<span className="ma-section-dot"/>}{s.label}</span>)}</nav>
          <form className={'ma-question ma-enter ma-'+direction} key={step} onSubmit={event=>{event.preventDefault();next();}}>
            <div className="ma-question-number"><span>{String(step+1).padStart(2,'0')}</span><ArrowRight size={15}/><span>{active.required?'Required':'Optional'}</span></div>
            <h1 id="ma-question-title" tabIndex={-1} ref={heading}>{active.title}</h1>
            <p className="ma-hint" id="ma-question-hint">{hints[active.key]}</p>
            {active.type==='choice' ? <fieldset className="ma-choices" aria-labelledby="ma-question-title" aria-describedby={'ma-question-hint'+(error?' ma-error':'')}>
              <legend className="ma-sr-only">{active.title}</legend>
              {active.options?.map((option,index)=><label key={option} className={'ma-choice '+(answers[active.key as AnswerKey]===option?'is-selected':'')}>
                <input type="radio" name={active.key} value={option} checked={answers[active.key as AnswerKey]===option} onChange={()=>update(option)} />
                <span className="ma-choice-letter" aria-hidden="true">{String.fromCharCode(65+index)}</span><span>{option}</span><Check size={18} className="ma-choice-check" aria-hidden="true"/>
              </label>)}
            </fieldset>:active.type==='textarea'?<>
              <textarea ref={answerInput} className="ma-answer ma-answer-long" aria-labelledby="ma-question-title" aria-describedby={'ma-question-hint'+(error?' ma-error':'')} aria-invalid={!!error} rows={4} maxLength={active.maxLength||4000} value={answers[active.key as AnswerKey]} onChange={e=>update(e.target.value)} placeholder={placeholders[active.key]} />
              <div className="ma-input-meta"><span><span className="ma-keyboard-hint">Shift + Enter for a new line</span></span><span>{answers[active.key as AnswerKey].length.toLocaleString()} / {(active.maxLength||4000).toLocaleString()}</span></div>
            </>:<input ref={answerInput} className="ma-answer" type={active.type==='email'?'email':'text'} inputMode={active.type==='email'?'email':'text'} autoComplete={active.key==='name'?'name':active.key==='email'?'email':'off'} autoCapitalize={active.type==='email'?'none':undefined} spellCheck={active.type!=='email'} aria-labelledby="ma-question-title" aria-describedby={'ma-question-hint'+(error?' ma-error':'')} aria-invalid={!!error} maxLength={active.maxLength||254} value={answers[active.key as AnswerKey]} onChange={e=>update(e.target.value)} placeholder={placeholders[active.key]} />}
            {error && <p className="ma-error" id="ma-error" role="alert">{error}</p>}
            <div className="ma-question-actions"><button type="submit" className="ma-primary">{editing?'Save answer':step===fields.length-1?'Review application':!active.required&&!answers[active.key as AnswerKey].trim()?'Skip question':'Continue'}<ArrowRight size={19}/></button><span className="ma-keyboard-hint">press <strong>Enter ↵</strong></span></div>
          </form>
        </div>}
        {screen==='review' && <div className="ma-review ma-enter">
          <p className="ma-kicker">One last check</p>
          <h1 tabIndex={-1} ref={heading}>Ready to send?</h1>
          <p className="ma-hint">Check your answers below. You can change anything before sending your application.</p>
          <dl className="ma-review-list">{fields.map((field,index)=><div className="ma-review-row" key={field.key}><div><dt>{field.title}</dt><dd>{answers[field.key as AnswerKey]||<span className="ma-empty-answer">Not provided</span>}</dd></div><button type="button" className="ma-text-button" disabled={submitting} aria-label={'Edit '+field.title} onClick={()=>{setEditing(true);go(index);}}>Edit</button></div>)}</dl>
          <div className="ma-honeypot" aria-hidden="true"><label>Website<input ref={honeypot} type="text" tabIndex={-1} autoComplete="off" name="website"/></label></div>
          <p className="ma-submit-note"><LockKeyhole size={16}/>Your answers are shared with Rob’s mentorship team to review your application. <a href="/legal/privacy-policy" target="_blank" rel="noreferrer">Privacy policy</a></p>
          {error && <p className="ma-error" role="alert">{error}</p>}
          <button className="ma-primary" disabled={submitting} onClick={()=>void submit()}>{submitting?<><Loader2 size={18} className="ma-spinner"/>Sending your application…</>:<>Send application<ArrowRight size={20}/></>}</button>
          <p className="ma-small-print">Applying doesn’t take a payment or reserve a place.</p>
        </div>}
        {screen==='success' && <div className="ma-success ma-enter">
          <span className="ma-success-icon"><CheckCircle2 size={35}/></span>
          <p className="ma-kicker">Application received</p>
          <h1 ref={heading} tabIndex={-1}>THANKS FOR<br/>TELLING ME<br/>ABOUT YOUR MUSIC.</h1>
          <p className="ma-intro-copy">We’ll review your application and get back to you at <strong>{submittedEmail}</strong>. Keep an eye on your inbox.</p>
          <div className="ma-next"><span className="ma-next-number">01</span><div><strong>We review your application</strong><p>Rob and the team will look through your answers and listen to the music you’ve shared.</p></div></div>
          <div className="ma-next"><span className="ma-next-number">02</span><div><strong>We’ll email you about the next step</strong><p>You don’t need to book a call or make a payment now.</p></div></div>
          <a className="ma-secondary ma-return" href="https://roblate.com">Back to Rob Late<ArrowUpRight size={17}/></a>
        </div>}
      </main>
      <footer className="ma-footer">
        {screen==='question'||screen==='review'?<>
          <div className="ma-progress-info"><span>{screen==='review'?'Review your answers':'Question '+(step+1)+' of '+fields.length}</span><span className="ma-save-label">{storageAvailable?'Progress saved on this device':'Keep this tab open to keep your answers'}</span></div>
          <div className="ma-progress-track" role="progressbar" aria-label="Application progress" aria-valuemin={0} aria-valuemax={10} aria-valuenow={completed}><span style={{width:completed*10+'%'}}/></div>
          <div className="ma-footer-nav"><button aria-label="Previous question" disabled={submitting} onClick={previous}><ChevronLeft size={20}/></button>{screen==='question'&&<button aria-label="Next question" onClick={next}><ChevronRight size={20}/></button>}</div>
        </>:<div className="ma-footer-simple"><span>Rob Late’s Producer Mentorship</span><a href="/legal/privacy-policy" target="_blank" rel="noreferrer">Privacy</a></div>}
      </footer>
    </div>
  </div>;
}
