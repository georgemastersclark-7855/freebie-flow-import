import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, ArrowRight, CalendarDays, Check, KeyRound, Link2, Plus, RefreshCw, Search, Send, X } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';
import { toast } from 'sonner';
import { Calendar } from '@/components/ui/calendar';
import { StudentAvatar } from '../components/StudentAvatar';
import { SuccessError, SuccessLoading } from './AdminCohorts';
import { loadSuccessCohorts, successRoot, type StaffPerson } from '../studentSuccessApi';
import { crmRoot, paymentLink, leadStages, leadSources, leadChannels, blankLead, leadStage, localDay, localDateTime, onboardingState, readableDate, type Lead, type LeadInput, type LeadStage } from '../crm';
import { loadCrm, saveLead, leadInput, loadLeadActivity, addLeadNote, saveOnboardingCall, grantPortalAccess, sendOffer, markShopifyOrderChecked, type CrmStudent, type CrmWorkspace, type ShopifyOrderRecord } from '../crmApi';
import '../studentSuccess.css';
import '../crm.css';
import '../applications.css';
import { hasPaid } from '../crmAnalytics';
import { deadline, latestApplications, pipelineStages } from '../crmPipeline';
import { ApplicationAnswers, Chip, ConfirmStep, CrmStats, InterestedList, LeadLinks, OfferList, PaidList, PeopleList, PipelineStrip, ReviewList, placesFilled, useNow } from './AdminCrmPipeline';
import { LaunchOverview, LaunchTargetsPanel, LeadPayments } from './AdminCrmOverview';

const errorText=(e:unknown)=>e instanceof Error?e.message:'Unable to save. Please try again.';
function Badge({children,tone='gray'}:{children:React.ReactNode;tone?:string}) { return <span className={`crm-badge crm-${tone}`}>{children}</span>; }
function useDirtyWarning(dirty:boolean) { useEffect(()=>{ if(!dirty)return; const warn=(e:BeforeUnloadEvent)=>{e.preventDefault();e.returnValue='';}; window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn); },[dirty]); }
const studentLink=(s:CrmStudent)=>`${successRoot}/${s.cohort_id}/students/${s.id}?tab=Onboarding`;
export function AdminCrm() {
  const [params,setParams]=useSearchParams(); const location=useLocation(); const onboarding=location.pathname.endsWith('/onboarding'); const overview=location.pathname.endsWith('/overview');
  const cache=useQueryClient();
  const cohorts=useQuery({queryKey:['success-cohorts'],queryFn:loadSuccessCohorts});
  const chosen=params.get('cohort'); const cohortId=cohorts.data?.find(c=>c.id===chosen)?.id??[...(cohorts.data??[])].reverse().find(c=>!['archived','completed'].includes(c.status))?.id??cohorts.data?.[0]?.id??'';
  const query=useQuery({queryKey:['crm',cohortId],queryFn:()=>loadCrm(cohortId),enabled:!!cohortId,refetchInterval:60000});
  const [newLead,setNewLead]=useState(false); const [booking,setBooking]=useState<CrmStudent|null>(null); const [connections,setConnections]=useState(false); const [settingsOpen,setSettingsOpen]=useState(false);
  const selected=query.data?.leads.find(l=>l.id===params.get('lead'));
  const openLead=(id:string)=>setParams(p=>{p.set('cohort',cohortId);p.set('lead',id);return p;});
  const closeLead=()=>{setNewLead(false);setParams(p=>{p.delete('lead');return p;},{replace:true});};
  const refresh=async()=>{await cache.invalidateQueries({queryKey:['crm',cohortId]});};
  const data=query.data;
  const activeIds=new Set(data?.students.filter(s=>s.status==='active'&&!s.is_walkthrough).map(s=>s.id));
  return <section className="student-success crm-workspace">
    <header className="ca-head"><h1>{overview?'Sales report':'Applications'}</h1><div className="crm-inline">
      {overview?<><button className="ca-text-link" onClick={()=>setConnections(true)}>Connections</button><button className="ca-text-link" disabled={!data} onClick={()=>setSettingsOpen(true)}>Programme settings</button><Link className="ss-button" to={`${crmRoot}/leads?cohort=${cohortId}`}>Back to applications</Link></>:<Link className="ca-text-link" to={`${crmRoot}/overview?cohort=${cohortId}`}>Sales report</Link>}
      <button className="crm-icon-button" aria-label="Refresh" disabled={query.isFetching} onClick={()=>void refresh()}><RefreshCw size={15} className={query.isFetching?'crm-spin':''}/></button>
      <label className="ss-field"><span className="sr-only">Cohort</span><select aria-label="Cohort" value={cohortId} onChange={e=>setParams({cohort:e.target.value})}>{cohorts.data?.map(c=><option key={c.id} value={c.id}>{c.internal_name}</option>)}</select></label>
      {!overview&&<button className="ss-button ss-primary" disabled={!data} onClick={()=>setNewLead(true)}><Plus size={16}/> Add person</button>}
    </div></header>
    {cohorts.isError?<SuccessError error={cohorts.error} retry={()=>void cohorts.refetch()}/>:cohorts.isPending?<SuccessLoading/>:!cohortId?<div className="ss-empty">Create a cohort first.</div>:query.isPending?<SuccessLoading/>:query.isError?<SuccessError error={query.error} retry={()=>void refresh()}/>:data&&<>
      <ShopifyOrderAlerts orders={data.shopifyOrders} leads={data.leads} openLead={openLead} refresh={refresh}/>
      {overview?<LaunchOverview data={data} editSettings={()=>setSettingsOpen(true)}/>:<ApplicationsHome key={cohortId} data={data} cohortId={cohortId} onboarding={onboarding} activeIds={activeIds} openLead={openLead} onBooking={setBooking}/>}
    </>}
    {data&&(newLead||selected)&&<LeadPanel key={selected?.id??'new'} lead={selected} cohortId={cohortId} staff={data.staff} activeIds={activeIds} data={data} refresh={refresh} onClose={closeLead} onSaved={async l=>{setNewLead(false);await refresh();openLead(l.id);}}/>}
    {booking&&data&&<BookingPanel key={booking.id} student={booking} staff={data.staff} close={()=>setBooking(null)} saved={async()=>{await refresh();setBooking(null);}}/>}
    {settingsOpen&&data&&<LaunchTargetsPanel cohortId={cohortId} settings={data.settings} questions={applicationQuestions(data)} close={()=>setSettingsOpen(false)} saved={async()=>{await refresh();setSettingsOpen(false);}}/>}
    <Sheet open={connections} onOpenChange={setConnections}><SheetContent className="student-success crm-drawer"><SheetTitle>Connections</SheetTitle><SheetDescription>What is currently connected to this workspace.</SheetDescription><div className="crm-connection"><Badge tone="green">Connected</Badge><h3>Student records</h3><p>Enrolled students appear in Onboarding automatically. Matching lead records are linked by email and cohort.</p></div><div className="crm-connection"><Badge tone={data?.shopifyOrders.length?'green':'amber'}>{data?.shopifyOrders.length?'Connected':'Setup needed'}</Badge><h3>Shopify payments and portal access</h3><p>{data?.shopifyOrders.length?`Paid mentorship orders give portal access and record the payment automatically. Last order received ${readableDate(data.shopifyOrders[data.shopifyOrders.length-1].received_at,true)}.`:'Once the Shopify webhook is connected, paid mentorship orders give portal access and record the payment automatically. Until then, record payments here and use Grant portal access on the lead.'}</p></div>{(['gmail','native'] as const).map(provider=>{const connection=data?.intake.find(c=>c.provider===provider);const state=connection?.status??'setup_needed';return <div className="crm-connection" key={provider}><Badge tone={state==='connected'?'green':state==='backfilled'?'blue':'amber'}>{state==='connected'?'Connected':state==='backfilled'?'Imported, automation pending':state==='paused'?'Paused':state==='error'?'Needs attention':'Setup needed'}</Badge><h3>{provider==='gmail'?'Gmail handraisers':'Application form'}</h3>{connection?.account_label&&<strong>{connection.account_label}</strong>}<p>{connection?.detail||(provider==='gmail'?'Connect the team inbox to capture new mentorship enquiries.':'Applications save directly into this CRM from audio.roblate.com/mentorship/apply.')}</p>{connection?.last_checked_at&&<small>Last checked {readableDate(connection.last_checked_at,true)}</small>}{provider==='native'&&<a className="ss-button" href="/mentorship/apply" target="_blank" rel="noreferrer">Open application form <ArrowRight size={14}/></a>}</div>;})}<p className="crm-footnote">An offer-doc view alone does not identify a lead. Original attribution stays on the contact when they later apply.</p><div className="crm-connection"><Badge tone="amber">Setup needed</Badge><h3>Bookings and call transcripts</h3><p>Record bookings in Onboarding. Fathom capture and AI additions to questionnaires still need connecting.</p></div></SheetContent></Sheet>
  </section>;
}
// Every question people have answered, for choosing what the applicant list shows.
function applicationQuestions(data:CrmWorkspace) {
  const seen=new Map<string,string>();
  for(const application of data.applications)for(const a of application.answers??[])if(!['name','email'].includes(a.key)&&!seen.has(a.key))seen.set(a.key,a.question);
  return [...seen].map(([key,question])=>({key,question}));
}

function ApplicationsHome({data,cohortId,onboarding,activeIds,openLead,onBooking}:{data:CrmWorkspace;cohortId:string;onboarding:boolean;activeIds:Set<string>;openLead:(id:string)=>void;onBooking:(s:CrmStudent)=>void}) {
  const [params]=useSearchParams(); const now=useNow(); const [search,setSearch]=useState('');
  const stageOf=(l:Lead)=>leadStage(l,activeIds)==='enrolled'?'enrolled':l.stage!=='closed'&&hasPaid(l,data.payments)?'paid':l.stage;
  const inStages=(...stages:string[])=>data.leads.filter(l=>l.stage!=='closed'&&stages.includes(stageOf(l)));
  const interested=inStages('new','waitlist'); const review=inStages('applied'); const offer=inStages('approved','offer_sent'); const paid=inStages('paid','enrolled');
  const closed=data.leads.filter(l=>l.stage==='closed');
  const toOnboard=data.students.filter(s=>s.status==='active'&&!s.is_walkthrough&&onboardingState(s.call,s.questionnaire,s.focus).key!=='complete');
  const view=onboarding?'onboarding':params.get('view')??'review';
  const term=search.trim().toLowerCase();
  const found=data.leads.filter(l=>[l.full_name,l.email,l.source].join(' ').toLowerCase().includes(term));
  const about=view==='closed'?'People who were closed, including anyone marked not a fit.':pipelineStages.find(s=>s.key===view)?.about;
  return <>
    <CrmStats data={data} now={now} cohortId={cohortId}/>
    <PipelineStrip current={term?'':view} cohortId={cohortId} counts={{interested:interested.length,review:review.length,offer:offer.length,paid:placesFilled(data),onboarding:toOnboard.length}}/>
    <div className="ca-listbar"><p>{term?`Searching everyone: ${found.length} ${found.length===1?'person':'people'}`:about}</p><div className="crm-inline">
      {closed.length>0&&view!=='closed'&&<Link className="ca-text-link" to={`${crmRoot}/leads?cohort=${cohortId}&view=closed`}>Closed ({closed.length})</Link>}
      <label className="ss-search ca-search"><Search size={15}/><input aria-label="Search everyone" placeholder="Search everyone" value={search} onChange={e=>setSearch(e.target.value)}/>{search&&<button type="button" aria-label="Clear search" onClick={()=>setSearch('')}><X size={14}/></button>}</label>
    </div></div>
    {term?<PeopleList leads={found} stageOf={stageOf} openLead={openLead} empty="Nobody matches that"/>
      :view==='interested'?<InterestedList leads={interested} openLead={openLead}/>
      :view==='offer'?<OfferList leads={offer} data={data} now={now} openLead={openLead}/>
      :view==='paid'?<PaidList leads={paid} data={data} openLead={openLead}/>
      :view==='onboarding'?<OnboardingQueue data={data} onBooking={onBooking}/>
      :view==='closed'?<PeopleList leads={closed} stageOf={stageOf} openLead={openLead} empty="Nobody closed yet"/>
      :<ReviewList leads={review} data={data} now={now} openLead={openLead}/>}
  </>;
}

function StageBadge({stage}:{stage:string}) {return <Badge tone={stage==='enrolled'||stage==='paid'?'green':stage==='approved'?'blue':stage==='offer_sent'?'purple':stage==='applied'?'blue':'gray'}>{leadStages[stage as keyof typeof leadStages]}</Badge>;}

function OnboardingQueue({data,onBooking}:{data:CrmWorkspace;onBooking:(s:CrmStudent)=>void}) {
  const [search,setSearch]=useState('');const [filter,setFilter]=useState('all');
  const students=data.students.filter(s=>s.status==='active'&&!s.is_walkthrough);
  const found=students.map(s=>({student:s,state:onboardingState(s.call,s.questionnaire,s.focus)})).filter(({student:s,state})=>[s.name,s.email].join(' ').toLowerCase().includes(search.toLowerCase())&&(filter==='all'||state.key===filter)).sort((a,b)=>(a.state.key==='complete'?1:0)-(b.state.key==='complete'?1:0)||(a.student.call?.booked_at??'9999').localeCompare(b.student.call?.booked_at??'9999'));
  return <><div className="crm-controls"><div className="crm-segments crm-scroll" aria-label="Onboarding status">{[['all','All students'],['not_booked','Awaiting booking'],['booked','Booked'],['notes_due','To complete'],['complete','Complete']].map(([key,label])=><button key={key} aria-pressed={filter===key} onClick={()=>setFilter(key)}>{label}</button>)}</div></div><div className="crm-filterbar"><label className="ss-search"><Search size={16}/><input aria-label="Search onboarding students" placeholder="Search students…" value={search} onChange={e=>setSearch(e.target.value)}/></label><span>{found.length} students</span></div>
    {!found.length?<div className="crm-empty"><CalendarDays size={28}/><h2>{students.length?'No students match this view':'Your enrolled students will appear here'}</h2><p>Each student has a questionnaire ready in their record. There is no separate assignment step.</p></div>:<div className="crm-table-wrap"><table className="crm-table crm-onboarding-table"><thead><tr><th>Student</th><th>Status</th><th>Onboarding call</th><th>Ready for coaching</th><th>Next step</th></tr></thead><tbody>{found.map(({student:s,state})=><tr key={s.id}><td><Link className="crm-person" to={studentLink(s)}><StudentAvatar name={s.name} src={s.profile?.photoUrl} size={38}/><span><strong>{s.name}</strong><small>{s.is_walkthrough?'Your test student':s.email}</small></span></Link></td><td><Badge tone={state.tone}>{state.label}</Badge></td><td><button className="crm-date-button" onClick={()=>onBooking(s)}><CalendarDays size={14}/>{s.call?.booked_at?readableDate(s.call.booked_at,true):'Set booking'}</button><small>{data.staff.find(p=>p.user_id===s.call?.owner_id)?.full_name??'Assign coach'}</small></td><td><div className="crm-checkpoints"><Checkpoint done={Boolean(s.profile?.completedAt)} label="Profile"/><Checkpoint done={Boolean(s.call?.completed_at)} label="Call held"/><Checkpoint done={Boolean(s.focus.trim())} label="Coaching focus"/></div></td><td>{state.action==='Confirm call outcome'||state.action==='Check call outcome'||state.key==='not_booked'?<button className="ss-button" onClick={()=>onBooking(s)}>{state.action}<ArrowRight size={14}/></button>:<Link className="ss-button" to={studentLink(s)}>{state.action}<ArrowRight size={14}/></Link>}<Link className="crm-secondary-link" to={studentLink(s)}>Open questionnaire</Link></td></tr>)}</tbody></table></div>}
    <p className="crm-footnote">Booking times are shown in {Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/_/g,' ')}. Onboarding is complete when the call is marked held, the questionnaire is agreed and the coaching focus is saved.</p>
  </>;
}
function Checkpoint({done,label}:{done:boolean;label:string}) {return <span className={done?'crm-check-done':''}><span className="crm-check-dot">{done&&<Check size={10}/>}</span>{label}</span>;}

function LeadPanel({lead,cohortId,staff,activeIds,data,refresh,onClose,onSaved}:{lead?:Lead;cohortId:string;staff:StaffPerson[];activeIds:Set<string>;data:CrmWorkspace;refresh:()=>Promise<void>;onClose:()=>void;onSaved:(lead:Lead)=>Promise<void>}) {
  const [previous,setPrevious]=useState(lead);const [input,setInput]=useState<LeadInput>(lead?leadInput(lead):blankLead(cohortId));const [saved,setSaved]=useState(JSON.stringify(input));const [busy,setBusy]=useState(false);const [error,setError]=useState('');const applications=lead?data.applications.filter(a=>a.lead_id===lead.id):[];const [tab,setTab]=useState(applications.length?'application':'details');const [note,setNote]=useState('');const now=useNow();const [paymentDirty,setPaymentDirty]=useState(false);const [paymentBusy,setPaymentBusy]=useState(false);
  const dirty=paymentDirty||JSON.stringify(input)!==saved||!!note.trim();useDirtyWarning(dirty);
  const history=useQuery({queryKey:['lead-activity',lead?.id],queryFn:()=>loadLeadActivity(lead!.id),enabled:!!lead});
  const change=<K extends keyof LeadInput>(key:K,value:LeadInput[K])=>setInput(p=>({...p,[key]:value}));
  // Granting access links the student record, which changes the lead's saved version.
  const syncAfterGrant=useRef(false);
  useEffect(()=>{if(!syncAfterGrant.current||!lead)return;syncAfterGrant.current=false;setPrevious(lead);if(JSON.stringify(input)===saved){const fresh=leadInput(lead);setInput(fresh);setSaved(JSON.stringify(fresh));}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[lead?.updated_at]);
  const close=()=>{if(!busy&&!paymentBusy&&(!dirty||window.confirm('Discard unsaved changes to this lead?')))onClose();};
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setError('');setBusy(true);try{const record=await saveLead(input,previous);setPrevious(record);setInput(leadInput(record));setSaved(JSON.stringify(leadInput(record)));await onSaved(record);toast.success('Lead saved.');}catch(e){setError(errorText(e));}finally{setBusy(false);}};
  const addNote=async()=>{setError('');setBusy(true);try{await addLeadNote(lead!.id,note);setNote('');await history.refetch();toast.success('Note added.');}catch(e){setError(errorText(e));}finally{setBusy(false);}};
  return <Sheet open onOpenChange={open=>{if(!open)close();}}><SheetContent className="student-success crm-drawer" onEscapeKeyDown={e=>{e.preventDefault();close();}} onInteractOutside={e=>{e.preventDefault();close();}}><div className="crm-drawer-head"><SheetTitle>{lead?lead.full_name:'Add person'}</SheetTitle><SheetDescription>{lead?lead.email:'Add someone who has shown interest, for example from a DM or an email.'}</SheetDescription>{lead&&<div className="crm-inline"><StageBadge stage={leadStage(lead,activeIds)==='enrolled'?'enrolled':lead.stage!=='closed'&&hasPaid(lead,data.payments)?'paid':lead.stage}/>{lead.stage==='applied'&&latestApplications(applications).get(lead.id)&&(()=>{const due=deadline(latestApplications(applications).get(lead.id)!.submitted_at,data.settings.reply_target_hours,now);return <Chip tone={due.tone}>{due.label}</Chip>;})()}{lead.enrollment_id&&<Link className="ss-link" to={`${successRoot}/${lead.cohort_id}/students/${lead.enrollment_id}?tab=Onboarding`} onClick={e=>{if(dirty&&!window.confirm('Discard unsaved changes and open the student record?'))e.preventDefault();}}>Student record <ArrowRight size={14}/></Link>}</div>}{lead&&!lead.enrollment_id&&!hasPaid(lead,data.payments)&&['applied','approved','offer_sent'].includes(lead.stage)&&<LeadActions lead={lead} dirty={dirty} offerHours={data.settings.offer_hold_hours} replyHours={data.settings.reply_target_hours} onClosed={onClose} refresh={async()=>{await refresh();await history.refetch();}}/>}</div>
    {lead&&<LeadLinks application={latestApplications(applications).get(lead.id)} data={data}/>}
    {lead&&(lead.email_thread_url||lead.application_url)&&<div className="crm-source-links">{lead.email_thread_url&&<a className="ss-button" href={lead.email_thread_url} target="_blank" rel="noopener noreferrer"><Link2 size={14}/> Open Gmail conversation</a>}{lead.application_url&&<a className="ss-button" href={lead.application_url} target="_blank" rel="noopener noreferrer"><Link2 size={14}/> Open application</a>}</div>}
    {lead&&<div className="crm-tabs">{applications.length>0&&<button type="button" aria-current={tab==='application'?'page':undefined} onClick={()=>setTab('application')}>Application</button>}<button type="button" aria-current={tab==='details'?'page':undefined} onClick={()=>setTab('details')}>Details</button><button type="button" aria-current={tab==='activity'?'page':undefined} onClick={()=>setTab('activity')}>Activity</button><button type="button" aria-current={tab==='payments'?'page':undefined} onClick={()=>setTab('payments')}>Payments</button></div>}
    <form onSubmit={submit} className={tab==='details'?'crm-editor':'hidden'}><fieldset disabled={busy}>
      <div className="crm-form-section"><h3>Contact</h3><div className="crm-form-grid"><label className="ss-field">Full name<input required maxLength={160} value={input.full_name} onChange={e=>change('full_name',e.target.value)}/></label><label className="ss-field">Email<input type="email" required maxLength={254} value={input.email} onChange={e=>change('email',e.target.value)} readOnly={Boolean(lead?.enrollment_id)}/></label></div></div>
      <div className="crm-form-section"><h3>Pipeline & follow-up</h3><div className="crm-form-grid"><label className="ss-field">Stage<select value={input.stage} disabled={Boolean(lead?.enrollment_id&&activeIds.has(lead.enrollment_id))} onChange={e=>change('stage',e.target.value as LeadStage)}>{Object.entries(leadStages).filter(([k])=>!['enrolled','paid'].includes(k)).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label><OwnerField staff={staff} value={input.owner_id} change={v=>change('owner_id',v)}/></div><label className="ss-field">Next action<input placeholder="e.g. Reply with the offer and answer their question" maxLength={1000} value={input.next_action} onChange={e=>change('next_action',e.target.value)}/></label><DateField label="Follow-up date" value={input.due_on} change={v=>change('due_on',v)}/>{lead?.next_action&&<button className="crm-text-button" type="button" onClick={()=>{change('next_action','');change('due_on',null);}}>Clear completed follow-up</button>}</div>
      <div className="crm-form-section"><h3>Where they came from</h3><label className="ss-field">First contact<select value={input.first_contact_channel} onChange={e=>change('first_contact_channel',e.target.value)}>{leadChannels.map(s=><option key={s} value={s}>{s}</option>)}</select></label><label className="ss-field">Original source<input list="crm-sources" required maxLength={100} value={input.source} onChange={e=>change('source',e.target.value)}/><datalist id="crm-sources">{leadSources.map(s=><option key={s} value={s}/>)}</datalist></label><p className="crm-footnote">Keep the original source when they later apply. Use Not recorded when it is unknown.</p><label className="ss-field">Source detail<input placeholder="Campaign, referral name or original conversation" maxLength={1000} value={input.source_detail} onChange={e=>change('source_detail',e.target.value)}/></label></div>
      <div className="crm-form-section"><h3>Context for the onboarding call</h3><label className="ss-field">Goals and application notes<textarea rows={4} maxLength={4000} value={input.goals} onChange={e=>change('goals',e.target.value)} placeholder="What they want help with, in their own words"/></label><label className="ss-field">Link to their work<input type="url" placeholder="https://" maxLength={2048} value={input.music_url??''} onChange={e=>change('music_url',e.target.value||null)}/></label><label className="ss-field">Gmail conversation<input type="url" placeholder="https://mail.google.com/…" maxLength={2048} value={input.email_thread_url??''} onChange={e=>change('email_thread_url',e.target.value||null)}/></label><label className="ss-field">Application link<input type="url" placeholder="https://" maxLength={2048} value={input.application_url??''} onChange={e=>change('application_url',e.target.value||null)}/></label></div>

    </fieldset><div className="crm-drawer-footer">{error&&<p role="alert" className="ss-error">{error}</p>}<span>{JSON.stringify(input)!==saved?'Unsaved changes':lead?'Saved':'New lead'}</span><button type="submit" disabled={busy} className="ss-button ss-primary">{busy?'Saving…':'Save lead'}</button></div></form>
    {lead&&tab==='details'&&!(lead.enrollment_id&&activeIds.has(lead.enrollment_id))&&<PortalAccess lead={lead} paid={hasPaid(lead,data.payments)} refresh={async()=>{syncAfterGrant.current=true;await refresh();await history.refetch();}}/>}
    {lead&&tab==='application'&&<ApplicationAnswers applications={applications} data={data}/>}
    {lead&&<div hidden={tab!=='payments'}><LeadPayments onDirty={setPaymentDirty} onBusy={setPaymentBusy} lead={lead} payments={data.payments} currency={data.settings.currency} refresh={async()=>{await refresh();await history.refetch();}}/></div>}
    {tab==='activity'&&lead&&<div className="crm-activity"><label className="ss-field">Add a note<textarea value={note} maxLength={6000} onChange={e=>setNote(e.target.value)} placeholder="What was discussed? What needs to happen next?"/></label><button className="ss-button ss-primary" disabled={busy||!note.trim()} onClick={()=>void addNote()}><Plus size={15}/> Add note</button>{error&&<p className="ss-error" role="alert">{error}</p>}{history.isPending?<SuccessLoading/>:history.isError?<SuccessError error={history.error} retry={()=>void history.refetch()}/>:<ol className="crm-timeline">{[...(history.data??[])].reverse().map(a=><li key={a.id}><span className="crm-timeline-dot"/><div><strong>{a.kind==='note'?'Note':a.kind==='created'?'Lead added':'Record updated'}</strong><p>{a.body}</p><small>{readableDate(a.created_at,true)} · {staff.find(s=>s.user_id===a.actor_id)?.full_name??'System'}</small></div></li>)}</ol>}</div>}
  </SheetContent></Sheet>;
}
function LeadActions({lead,dirty,offerHours,replyHours,refresh,onClosed}:{lead:Lead;dirty:boolean;offerHours:number;replyHours:number;refresh:()=>Promise<void>;onClosed:()=>void}) {
  const [busy,setBusy]=useState(false); const [asking,setAsking]=useState<'approve'|'close'|null>(null);
  const ask=(step:'approve'|'close')=>{if(busy)return;if(dirty){toast.error('Save or discard your changes first.');return;}setAsking(step);};
  const [link,setLink]=useState(lead.stage==='offer_sent'?paymentLink(lead.email,lead.id):'');
  const copy=async(value:string)=>{try{await navigator.clipboard.writeText(value);toast.success('Payment link copied. Paste it into your offer email.');}catch{toast.error('Copy did not work. Select the link and copy it by hand.');}};
  const approve=async()=>{
    setAsking(null);setBusy(true);
    try{const result=await sendOffer(lead.id);setLink(result.payment_url);await refresh();void copy(result.payment_url);if(result.warning)toast.warning(result.warning);}
    catch(e){toast.error(errorText(e));}finally{setBusy(false);}
  };
  const notAFit=async()=>{
    setAsking(null);setBusy(true);
    try{await saveLead({...leadInput(lead),stage:'closed',next_action:'',due_on:null},lead);await addLeadNote(lead.id,'Marked as not a fit.');await refresh();toast.success(`${lead.full_name} closed.`);onClosed();}
    catch(e){toast.error(errorText(e));}finally{setBusy(false);}
  };
  return <div className="ca-actions"><div className="crm-inline">
      {link?<button type="button" className="ss-button ss-primary" onClick={()=>void copy(link)}><Link2 size={14}/>Copy payment link</button>:<button type="button" className="ss-button ss-primary" disabled={busy} onClick={()=>ask('approve')}><Send size={14}/>{busy?'Working…':'Approve and get payment link'}</button>}
      <button type="button" className="ss-button" disabled={busy} onClick={()=>ask('close')}>Not a fit</button>
    </div>
    <small>{link?'Their own checkout link, with their email filled in. Paste it into your offer email.':'Approve moves them to Offer sent. Not a fit closes them and sends no email.'}</small>
    {link&&<input readOnly value={link} aria-label="Payment link" onFocus={e=>e.currentTarget.select()}/>}
    {asking==='approve'&&<ConfirmStep title={`Approve ${lead.full_name}?`} confirmLabel="Approve and get link" cancelLabel="Not yet" onCancel={()=>setAsking(null)} onConfirm={()=>void approve()} steps={[`They move to Offer sent, and a ${offerHours}-hour countdown starts as your reminder to follow up.`,'You get their own payment link, with their email already filled in.',"They aren't emailed yet. You send them the link in your offer email.",'Once they pay, they get portal access and move to Paid on their own.']}/>}
    {asking==='close'&&<ConfirmStep title={`Mark ${lead.full_name} as not a fit?`} confirmLabel="Mark as not a fit" cancelLabel="Keep reviewing" onCancel={()=>setAsking(null)} onConfirm={()=>void notAFit()} steps={['They move to Closed and leave To review.',`They aren't emailed. They were told they'd hear back within ${replyHours} hours, so reply to them yourself.`,'Their application stays on file, and you can reopen them from Closed at any time.']}/>}
  </div>;
}
function PortalAccess({lead,paid,refresh}:{lead:Lead;paid:boolean;refresh:()=>Promise<void>}) {
  const [busy,setBusy]=useState(false); const [asking,setAsking]=useState(false);
  const grant=async()=>{
    setAsking(false);setBusy(true);
    try{const result=await grantPortalAccess(lead.id);await refresh();toast.success(result.already_active?'They already had portal access.':result.reactivated?'Portal access switched back on.':'Portal access granted.');}
    catch(e){toast.error(errorText(e));}finally{setBusy(false);}
  };
  return <div className="crm-access"><button type="button" className="ss-button" disabled={busy} onClick={()=>setAsking(true)}><KeyRound size={14}/>{busy?'Granting access…':'Grant portal access'}</button><small>For payments outside Shopify, or if automatic access did not arrive.</small>
    {asking&&<ConfirmStep title={`Give ${lead.full_name} portal access?`} confirmLabel="Give access" cancelLabel="Not yet" onCancel={()=>setAsking(false)} onConfirm={()=>void grant()} steps={[...(paid?[]:['No payment is recorded for them yet, so check they have paid first.']),`${lead.email} can open the student portal, signing in with a code sent to that email.`,'The welcome email sends too, if it is switched on in Klaviyo.']}/>}
  </div>;
}
function ShopifyOrderAlerts({orders,leads,openLead,refresh}:{orders:ShopifyOrderRecord[];leads:Lead[];openLead:(id:string)=>void;refresh:()=>Promise<void>}) {
  const [busy,setBusy]=useState('');
  const open=orders.filter(o=>!o.reviewed_at&&(o.status==='failed'||o.flags.length>0)).sort((a,b)=>b.received_at.localeCompare(a.received_at));
  if(!open.length)return null;
  const check=async(id:string)=>{setBusy(id);try{await markShopifyOrderChecked(id);await refresh();toast.success('Marked as checked.');}catch(e){toast.error(errorText(e));}finally{setBusy('');}};
  return <section className="crm-shopify-alerts" aria-labelledby="crm-shopify-alerts-title"><header><AlertTriangle size={17}/><h2 id="crm-shopify-alerts-title">Shopify orders to check <span>{open.length}</span></h2></header><ul>{open.map(o=>{const lead=leads.find(l=>l.id===o.lead_id);return <li key={o.shopify_order_id}><div><strong>{o.order_name??`Order ${o.shopify_order_id}`}{o.test_order?' · test order':''}</strong><span>{lead?.full_name??o.email??'No email on the order'} · {readableDate(o.received_at,true)}</span>{o.status==='failed'?<p>Access not granted yet: {o.last_error??'unknown error'}. If it is still missing, use Grant portal access on their lead.</p>:<ul>{o.flags.map(f=><li key={f}>{f}</li>)}</ul>}</div><div className="crm-inline">{lead&&<button type="button" className="ss-button" onClick={()=>openLead(lead.id)}>Open lead</button>}<button type="button" className="crm-text-button" disabled={busy===o.shopify_order_id} onClick={()=>void check(o.shopify_order_id)}>Mark as checked</button></div></li>;})}</ul></section>;
}
function OwnerField({staff,value,change}:{staff:StaffPerson[];value:string|null;change:(v:string|null)=>void}) {return <label className="ss-field">Owner<select value={value??''} onChange={e=>change(e.target.value||null)}><option value="">Unassigned</option>{staff.map(s=><option key={s.user_id} value={s.user_id}>{s.full_name}</option>)}</select></label>;}
function BookingPanel({student:s,staff,close,saved}:{student:CrmStudent;staff:StaffPerson[];close:()=>void;saved:()=>Promise<void>}) {
  const [date,setDate]=useState(localDateTime(s.call?.booked_at??null).slice(0,10));const [time,setTime]=useState(localDateTime(s.call?.booked_at??null).slice(11));const [held,setHeld]=useState(Boolean(s.call?.completed_at));const [owner,setOwner]=useState(s.call?.owner_id??null);const [notes,setNotes]=useState(s.call?.notes??'');const [busy,setBusy]=useState(false);const [error,setError]=useState('');
  const dirty=date!==localDateTime(s.call?.booked_at??null).slice(0,10)||time!==localDateTime(s.call?.booked_at??null).slice(11)||held!==Boolean(s.call?.completed_at)||owner!==(s.call?.owner_id??null)||notes!==(s.call?.notes??'');useDirtyWarning(dirty);
  const dismiss=()=>{if(!busy&&(!dirty||window.confirm('Discard unsaved booking changes?')))close();};
  return <Sheet open onOpenChange={open=>{if(!open)dismiss();}}><SheetContent className="student-success crm-drawer" onEscapeKeyDown={e=>{e.preventDefault();dismiss();}} onInteractOutside={e=>{e.preventDefault();dismiss();}}><SheetTitle>Onboarding call</SheetTitle><SheetDescription>{s.name} · {s.email}</SheetDescription><form className="crm-editor" onSubmit={async e=>{e.preventDefault();setError('');setBusy(true);try{if(time&&!date)throw new Error('Choose a call date as well as a time.');await saveOnboardingCall(s.id,{booked_at:date?new Date(`${date}T${time}`).toISOString():null,completed_at:held?(s.call?.completed_at??new Date().toISOString()):null,owner_id:owner,notes},s.call);await saved();toast.success('Onboarding booking saved.');}catch(e){setError(errorText(e));}finally{setBusy(false);}}}><fieldset disabled={busy}><div className="crm-form-section"><OwnerField staff={staff} value={owner} change={setOwner}/><DateField label="Call date" value={date||null} change={v=>{setDate(v??'');if(!v)setTime('');}}/><label className="ss-field">Call time<input type="text" placeholder="19:00" pattern="([01][0-9]|2[0-3]):[0-5][0-9]" required={Boolean(date)} value={time} onChange={e=>setTime(e.target.value)}/><span className="ss-muted">24-hour time, shown in {Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/_/g,' ')}</span></label><label className="crm-checkbox"><input type="checkbox" checked={held} onChange={e=>setHeld(e.target.checked)}/> The onboarding call has taken place</label><label className="ss-field">Booking notes<textarea maxLength={4000} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Rescheduling details or anything Rob needs before the call"/></label></div><p className="crm-footnote">This records the booking for staff. It does not send a calendar invitation.</p></fieldset><div className="crm-drawer-footer">{error&&<p role="alert" className="ss-error">{error}</p>}<span>{dirty?'Unsaved changes':'Booking details'}</span><button className="ss-button ss-primary" disabled={busy} type="submit">{busy?'Saving…':'Save booking'}</button></div></form></SheetContent></Sheet>;
}

function DateField({label,value,change}:{label:string;value:string|null;change:(v:string|null)=>void}) {
  const [open,setOpen]=useState(false);
  const choose=(date:Date|undefined)=>{change(date?localDay(date):null);setOpen(false);};
  const selected=value?new Date(`${value}T12:00:00`):undefined;
  return <div className="ss-field crm-date-field"><span>{label}</span><button type="button" className="crm-date-input" aria-label={`${label}: ${value?readableDate(value):'Choose date'}`} aria-expanded={open} onClick={()=>setOpen(!open)}><CalendarDays size={14}/>{value?readableDate(value):'Choose date'}</button>{open&&<div className="crm-calendar"><Calendar mode="single" selected={selected} defaultMonth={selected} onSelect={choose} weekStartsOn={1} classNames={{day_selected:'crm-calendar-selected',day_today:'crm-calendar-today',head_cell:'crm-calendar-weekday',day_outside:'crm-calendar-outside'}}/><div className="crm-date-shortcuts"><button type="button" onClick={()=>choose(new Date())}>Today</button><button type="button" onClick={()=>{const d=new Date();d.setDate(d.getDate()+1);choose(d);}}>Tomorrow</button><button type="button" onClick={()=>choose(undefined)}>Clear</button></div></div>}</div>;
}
