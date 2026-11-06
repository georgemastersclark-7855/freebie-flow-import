import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { readableDate } from '../crm';
import { loadFunnel, type CrmWorkspace, type FunnelData, type FunnelRow } from '../crmApi';
import { SuccessError } from './AdminCohorts';
import { Chip } from './AdminCrmPipeline';

const sourceOptions=[['all','All'],['instagram','Instagram'],['link_in_bio','Link in bio'],['email','Email'],['youtube','YouTube'],['facebook','Facebook'],['other','Direct or other']] as const;
const periodOptions=[['all','All time',0],['7d','Last 7 days',7*86400000],['24h','Last 24 hours',86400000]] as const;
const sourceName=(key:string)=>sourceOptions.find(([k])=>k===key)?.[1]??key;
const deviceNames:Record<string,string>={phone:'Phone',tablet:'Tablet',desktop:'Desktop'};
const failureNames:Record<string,string>={'400':'Answers rejected','409':'Already sent with different answers','410':'Applications closed','429':'Too many attempts','503':'Our server was unavailable','Timed out':'Timed out','No connection':'No connection'};
const failureName=(detail:string)=>failureNames[detail]??(/^\d+$/.test(detail)?`Server replied ${detail}`:detail||'Unknown');
const num=(n:number)=>n.toLocaleString('en-GB');
const percent=(n:number,of:number)=>of>0?`${Math.round(n/of*100)}%`:'0%';
const spoken=(seconds:number)=>seconds<=0?'No data':seconds<60?`${seconds}s`:`${Math.floor(seconds/60)}m${seconds%60?` ${seconds%60}s`:''}`;
const sinceOf=(period:string)=>{const ms=periodOptions.find(([k])=>k===period)?.[2];return ms?new Date(Date.now()-ms).toISOString():null;};
// Klaviyo adds the campaign's ID in brackets; staff only need the name.
const campaignName=(key:string)=>key.replace(/\s*\([^()]*\)\s*$/,'')||key;

export function FunnelReport({data,cohortId}:{data:CrmWorkspace;cohortId:string}) {
  const [source,setSource]=useState('all'); const [period,setPeriod]=useState('all');
  const query=useQuery({queryKey:['crm-funnel',cohortId,source,period],queryFn:()=>loadFunnel(cohortId,sinceOf(period),source==='all'?null:source),refetchInterval:60000,placeholderData:keepPreviousData});
  const f=query.data;
  return <div className="ca-report">
    <div className="ca-filters">
      <div role="group" aria-label="Where visits came from"><small>Came from</small>{sourceOptions.map(([key,label])=><button key={key} type="button" className="ca-pick" aria-pressed={source===key} onClick={()=>setSource(key)}>{label}</button>)}</div>
      <div role="group" aria-label="Period"><small>Period</small>{periodOptions.map(([key,label])=><button key={key} type="button" className="ca-pick" aria-pressed={period===key} onClick={()=>setPeriod(key)}>{label}</button>)}</div>
    </div>
    {query.isError?<SuccessError error={query.error} retry={()=>void query.refetch()}/>:!f?<div className="ss-empty" role="status">Loading the funnel…</div>:<>
      {f.visits===0?<div className="ca-panel"><div className="ca-empty"><strong>Nothing counted yet</strong><p>{source!=='all'||period!=='all'?'No visits match these filters. Try All and All time.':'Visits to the sales page and application form will appear here as they happen.'}</p></div></div>:<FunnelNumbers f={f} data={data}/>}
      <p className="crm-footnote">A visit is one browser session, so someone who comes back later counts again. Signed-in staff are not counted. No answers, names or emails are stored.{f.first_event?` Counting started ${readableDate(f.first_event)}.`:''}</p>
    </>}
  </div>;
}

function FunnelNumbers({f,data}:{f:FunnelData;data:CrmWorkspace}) {
  // The latest wording of each question wins, in case the form was edited.
  const titles=new Map<string,string>();
  for(const application of [...data.applications].sort((a,b)=>b.submitted_at.localeCompare(a.submitted_at)))for(const a of application.answers??[])if(!titles.has(a.key))titles.set(a.key,a.question);
  const titleOf=(key:string)=>titles.get(key)??(key.replace(/[_-]+/g,' ').replace(/^./,c=>c.toUpperCase()));
  const steps:[string,number][]=[['Opened the sales page',f.steps.page_view??0],['Scrolled halfway down',f.scroll['50']??0],['Saw the price',f.steps.price_seen??0],['Clicked an Apply button',f.steps.apply_click??0],['Opened the application form',f.steps.form_view??0],['Started the form',f.steps.form_start??0],['Reached the final check',f.steps.review_view??0],['Pressed Send application',f.steps.send_click??0],['Application saved',f.steps.send_ok??0]];
  const base=steps[0][1]||Math.max(...steps.map(([,n])=>n),1);
  const opened=f.steps.form_view??0; const sent=f.steps.send_ok??0;
  const left=(x:FunnelData['questions'][number])=>Math.max(x.reached-x.answered,0);
  const biggest=Math.max(0,...f.questions.map(left)); const worst=biggest>0?f.questions.findIndex(x=>left(x)===biggest):-1;
  const emails=[...f.campaigns.filter(c=>c.source==='email').reduce((all,c)=>{const key=campaignName(c.key);const row=all.get(key)??{key,visits:0,apply:0,form:0,started:0,sent:0};for(const k of ['visits','apply','form','started','sent'] as const)row[k]+=c[k];return all.set(key,row);},new Map<string,FunnelRow>()).values()].sort((a,b)=>b.visits-a.visits);
  const crm=f.first_event?data.applications.filter(a=>new Date(a.submitted_at).getTime()>=new Date(f.first_event!).getTime()).length:null;
  const problems=f.send_failures.length+f.question_errors.length+f.page_errors.length>0;
  const rows:[string,number][]=[['Scrolled 25% of the way down',f.scroll['25']??0],['Scrolled 50% of the way down',f.scroll['50']??0],['Scrolled 75% of the way down',f.scroll['75']??0],['Reached the bottom of the page',f.scroll['100']??0],['Played the main video',f.video_plays['main video']??0],['Played a testimonial video',f.video_plays['testimonial video']??0],['Clicked Apply and jumped to the price',f.apply_clicks.to_price??0],['Clicked Apply and went to the form',f.apply_clicks.to_form??0],['Opened in the Instagram or Facebook app',f.in_app_visits]];
  const visitTable=(label:string,list:FunnelRow[],name:(key:string)=>string)=><div className="ca-panel"><table className="ca-table ca-table-plain ca-table-small"><thead><tr><th>{label}</th><th className="ca-num">Visits</th><th className="ca-num">Clicked Apply</th><th className="ca-num">Opened form</th><th className="ca-num">Started form</th><th className="ca-num">Sent application</th></tr></thead><tbody>{list.map(r=><tr key={r.key}><td>{name(r.key)}</td><td className="ca-num">{num(r.visits)}</td><td className="ca-num">{num(r.apply)}</td><td className="ca-num">{num(r.form)}</td><td className="ca-num">{num(r.started)}</td><td className="ca-num">{num(r.sent)}</td></tr>)}</tbody></table></div>;
  return <>
    <div className="ca-grid4 ca-grid-pairs">
      <div className="ca-card"><small>Visits</small><strong>{num(f.visits)}</strong><span>Browser sessions on the sales page or form</span></div>
      <div className="ca-card"><small>Opened the form</small><strong>{num(opened)}</strong><span>{percent(opened,f.visits)} of visits</span></div>
      <div className="ca-card"><small>Applications sent</small><strong>{num(sent)}</strong><span>{percent(sent,f.visits)} of visits</span></div>
      <div className="ca-card"><small>Typical time on sales page</small><strong>{spoken(f.page_seconds)}</strong><span>Half of visits stay longer than this</span></div>
    </div>
    <section className="ca-card"><h2>From first visit to application</h2><p>Each visit counts once at each step. Percentages are of the visits that opened the sales page.</p>
      <div className="ca-funnel">{steps.map(([label,n])=><div key={label} className="ca-funnel-row" title={`${label}: ${num(n)} ${n===1?'visit':'visits'} (${percent(n,base)} of the first step)`}><span>{label}</span><div className="ca-funnel-track"><i style={{width:`${Math.min(n/base*100,100)}%`,minWidth:n?4:0}}/></div><b>{num(n)} <span>{percent(n,base)}</span></b></div>)}</div>
      {crm!==null&&<div className="ca-places-time"><span>The CRM has {num(crm)} {crm===1?'application':'applications'} since counting began</span></div>}
    </section>
    {f.questions.length>0&&<section className="ca-card ca-card-table ca-gap"><h2>Where people stop in the form</h2><p>Left here is how many people saw a question and did not answer it. Couldn't continue is how many times the form turned an answer down.</p>
      <div className="ca-panel"><table className="ca-table ca-table-plain"><thead><tr><th>Question</th><th className="ca-num">Reached</th><th className="ca-num">Answered</th><th className="ca-num">Left here</th><th className="ca-num">Typical time</th><th className="ca-num">Couldn't continue</th></tr></thead><tbody>
        {f.questions.map((x,i)=><tr key={`${x.step}:${x.question}`}><td><div className="ca-person"><div><strong>{titleOf(x.question)}</strong>{x.step!==null&&<small>Question {x.step}</small>}</div></div></td><td className="ca-num">{num(x.reached)}</td><td className="ca-num">{num(x.answered)}</td><td className="ca-num">{i===worst&&<Chip tone="amber">Biggest drop</Chip>}{num(left(x))} <span className="ca-pct">({percent(left(x),x.reached)})</span></td><td className="ca-num">{spoken(x.median_ms>0?Math.max(1,Math.round(x.median_ms/1000)):0)}</td><td className="ca-num">{num(x.errors)}</td></tr>)}
      </tbody></table></div>
    </section>}
    <div className={`ca-gap ${emails.length?'ca-two ca-two-tables':''}`}>
      <section className="ca-card ca-card-table"><h2>Where visits came from</h2><p>Each source in full, whatever you picked above.</p>{visitTable('Source',f.sources,sourceName)}</section>
      {emails.length>0&&<section className="ca-card ca-card-table"><h2>Which email</h2><p>Visits from each email campaign.</p>{visitTable('Email',emails,k=>k)}</section>}
    </div>
    <div className="ca-gap ca-two ca-two-tables">
      <section className="ca-card ca-card-table"><h2>Phone or desktop</h2><p>The device people used.</p>{visitTable('Device',f.devices,k=>deviceNames[k]??k)}</section>
      <section className="ca-card"><h2>Scrolling and video</h2><p>Visits that did each of these.</p><div className="ca-rows">{rows.map(([label,n])=><div key={label}>{label}<b>{num(n)}</b></div>)}</div></section>
    </div>
    {problems&&<section className="ca-card ca-gap"><h2>Problems</h2><p>Things that went wrong for visitors. Worth a look if the numbers are high.</p>
      {f.send_failures.length>0&&<><h3>Applications that would not send</h3><div className="ca-rows">{f.send_failures.map(x=><div key={x.detail}><span>{failureName(x.detail)}</span><b>{num(x.count)}</b></div>)}</div></>}
      {f.question_errors.length>0&&<><h3>Messages people got stuck on</h3><div className="ca-rows">{f.question_errors.map(x=><div key={`${x.question}:${x.detail}`}><span>{titleOf(x.question)}<small>{x.detail||'No message'}</small></span><b>{num(x.count)}</b></div>)}</div></>}
      {f.page_errors.length>0&&<><h3>Page errors</h3><div className="ca-rows">{f.page_errors.map(x=><div key={`${x.event}:${x.detail}`}><span>{x.event==='form_error'?'The form would not load':'Something broke on the page'}<small>{x.detail||'No message'}</small></span><b>{num(x.count)}</b></div>)}</div></>}
    </section>}
  </>;
}
