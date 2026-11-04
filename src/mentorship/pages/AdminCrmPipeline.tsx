import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Clock3, Link2 } from 'lucide-react';
import { toast } from 'sonner';
import { crmRoot, leadStages, onboardingState, paymentLink, readableDate, type Lead } from '../crm';
import { hasPaid } from '../crmAnalytics';
import type { CrmWorkspace } from '../crmApi';
import { answerLinks, answerOf, applicationChannel, applicationsPerDay, closesDate, closesTime, deadline, latestApplications, namedLinks, pipelineStages, timeLeft, type ApplicationRecord, type PipelineKey } from '../crmPipeline';

/** The current time, refreshed each minute so countdowns stay right while the page is open. */
export function useNow(every = 60_000) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), every); return () => clearInterval(timer); }, [every]);
  return now;
}
const pad = (n: number) => String(n).padStart(2, '0');
const initials = (name: string) => name.split(' ').map(w => w[0]).slice(0, 2).join('');
export const Chip = ({ tone, children }: { tone: 'gray' | 'amber' | 'red' | 'green'; children: React.ReactNode }) => <span className={`ca-chip ca-chip-${tone}`}>{children}</span>;
const Person = ({ lead }: { lead: Lead }) => <span className="ca-person"><span className="ca-avatar" aria-hidden="true">{initials(lead.full_name)}</span><span><strong>{lead.full_name}</strong><small>{lead.email}</small></span></span>;
const linksHeading = (label: string | null) => { const words = (label || 'Their links').replace(/^their\s+/i, ''); return words[0].toUpperCase() + words.slice(1); };

export function placesFilled(data: CrmWorkspace) {
  const paidLeads = data.leads.filter(l => l.stage !== 'closed' && hasPaid(l, data.payments));
  const counted = new Set(paidLeads.map(l => l.enrollment_id));
  const enrolledOnly = data.students.filter(s => !s.is_walkthrough && s.status === 'active' && !counted.has(s.id));
  return paidLeads.length + enrolledOnly.length;
}

function TimeLeftCard({ data, days, now }: { data: CrmWorkspace; days: { key: string; today: boolean }[]; now: number }) {
  const title = <small className="ca-time-title"><Clock3 size={14} aria-hidden="true"/>Time left</small>;
  if (!data.closesAt) return <div className="ca-card ca-time ca-time-open">{title}<strong>Open</strong><p>No close date set</p></div>;
  const left = timeLeft(data.closesAt, now);
  const closes = new Date(data.closesAt).getTime(); const start = Date.parse(`${days[0]?.key}T00:00:00Z`);
  const remaining = closes > start ? Math.min(1, Math.max(0, (closes - now) / (closes - start))) : 0;
  const dayNumber = days.findIndex(d => d.today) + 1;
  return <div className="ca-card ca-time">{title}
    {left ? <div className="ca-clock" role="timer" aria-label={`${left.days} days, ${left.hours} hours and ${left.minutes} minutes left`}>
      <span><b>{pad(left.days)}</b><i>days</i></span><span><b>{pad(left.hours)}</b><i>hrs</i></span><span><b>{pad(left.minutes)}</b><i>mins</i></span>
    </div> : <strong>Closed</strong>}
    {left && <div className="ca-drain"><div className="ca-drain-bar" role="progressbar" aria-label="Time remaining" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(remaining * 100)}><i style={{ width: `${remaining * 100}%` }}/></div>{dayNumber > 0 && <span>Day {dayNumber} of {days.length}</span>}</div>}
    <p>{left ? 'Closes' : 'Closed'} {closesDate(data.closesAt, data.timezone)}<em>{closesTime(data.closesAt, data.timezone)}</em></p>
  </div>;
}

export function CrmStats({ data, now }: { data: CrmWorkspace; now: number }) {
  const applications = [...latestApplications(data.applications).values()];
  const days = applicationsPerDay(applications, data.timezone, data.closesAt, now);
  const today = days.find(d => d.today)?.count ?? 0;
  const filled = placesFilled(data); const left = data.capacity - filled;
  const tallest = Math.max(3, ...days.map(d => d.count));
  return <div className="ca-stats">
    <div className="ca-card"><small>Applications</small><strong>{applications.length}</strong><span>{today} today</span></div>
    <div className="ca-card"><small>Places filled</small><strong>{filled} <em>of {data.capacity}</em></strong><span>{left > 0 ? `${left} left` : left === 0 ? 'Full' : `${-left} over`}</span></div>
    <TimeLeftCard data={data} days={days} now={now}/>
    <div className="ca-card ca-chart"><small>Applications per day</small><div className="ca-bars" role="img" aria-label={days.map(d => `${d.label}: ${d.count}`).join(', ')}>{days.map(d => <div key={d.key} className={`ca-bar${d.future ? ' ca-bar-future' : ''}${d.today ? ' ca-bar-today' : ''}`}><b>{d.count || ''}</b><i style={{ height: d.count ? Math.round(d.count / tallest * 52) + 6 : 4 }}/>{d.label}</div>)}</div></div>
  </div>;
}

export function PipelineStrip({ counts, current, cohortId }: { counts: Record<PipelineKey, number>; current: string; cohortId: string }) {
  return <nav className="ca-strip" aria-label="Stages">{pipelineStages.map((stage, i) => <Link key={stage.key} className={`ca-tile ca-t${i + 1}`} aria-current={current === stage.key ? 'page' : undefined} to={`${crmRoot}/${stage.key === 'onboarding' ? 'onboarding' : 'leads'}?cohort=${cohortId}${stage.key === 'onboarding' ? '' : `&view=${stage.key}`}`}><small>{stage.label}</small><strong>{counts[stage.key]}</strong><span>{stage.hint}</span></Link>)}</nav>;
}

const Empty = ({ title, children }: { title: string; children: React.ReactNode }) => <div className="ca-panel"><div className="ca-empty"><strong>{title}</strong><p>{children}</p></div></div>;
const Arrow = ({ name }: { name: string }) => <td className="ca-arrow"><span className="sr-only">Open {name}</span><ChevronRight size={17} aria-hidden="true"/></td>;
const rowProps = (lead: Lead, openLead: (id: string) => void) => ({ tabIndex: 0, onClick: () => openLead(lead.id), onKeyDown: (e: React.KeyboardEvent) => { if (e.key === 'Enter') openLead(lead.id); } });

export function ReviewList({ leads, data, now, openLead }: { leads: Lead[]; data: CrmWorkspace; now: number; openLead: (id: string) => void }) {
  if (!leads.length) return <Empty title="All caught up">New applications appear here the moment they come in.</Empty>;
  const latest = latestApplications(data.applications);
  const appliedAt = (l: Lead) => latest.get(l.id)?.submitted_at ?? l.created_at;
  const { list_columns: columns, links_question_key: linksKey, links_label: linksLabel, reply_target_hours: replyHours } = data.settings;
  return <div className="ca-panel"><table className="ca-table"><thead><tr><th>Applicant</th>{columns.map(c => <th key={c.key}>{c.label}</th>)}{linksKey && <th>{linksHeading(linksLabel)}</th>}<th>Reply due</th><th><span className="sr-only">Open</span></th></tr></thead><tbody>
    {[...leads].sort((a, b) => appliedAt(a).localeCompare(appliedAt(b))).map(l => {
      const application = latest.get(l.id); const due = deadline(appliedAt(l), replyHours, now);
      const links = namedLinks(answerLinks(answerOf(application, linksKey)));
      return <tr key={l.id} {...rowProps(l, openLead)}><td><Person lead={l}/></td>
        {columns.map(c => { const answer = answerOf(application, c.key); return <td key={c.key}>{/^yes\b/i.test(answer) ? <Chip tone="green">Yes</Chip> : answer || '—'}</td>; })}
        {linksKey && <td>{links.length === 1 ? <a className="ca-link" href={links[0].url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>{links[0].name}</a> : links.length ? <span className="ca-link">{links.length} links</span> : <Chip tone="red">No link</Chip>}</td>}
        <td><Chip tone={due.tone}>{due.label}</Chip></td><Arrow name={l.full_name}/></tr>;
    })}</tbody></table></div>;
}

export function OfferList({ leads, data, now, openLead }: { leads: Lead[]; data: CrmWorkspace; now: number; openLead: (id: string) => void }) {
  if (!leads.length) return <Empty title="No offers out yet">Approve someone and they move here with their payment link.</Empty>;
  const sentAt = (l: Lead) => [...data.milestones].filter(m => m.lead_id === l.id && m.milestone === 'offer_sent').map(m => m.occurred_at).sort().pop() ?? l.updated_at;
  const copy = async (l: Lead) => { try { await navigator.clipboard.writeText(paymentLink(l.email, l.id)); toast.success('Payment link copied.'); } catch { toast.error('Copy did not work. Open their record and copy it from there.'); } };
  return <div className="ca-panel"><table className="ca-table"><thead><tr><th>Applicant</th><th>Offer held for</th><th>Payment link</th><th><span className="sr-only">Open</span></th></tr></thead><tbody>
    {[...leads].sort((a, b) => sentAt(a).localeCompare(sentAt(b))).map(l => { const held = deadline(sentAt(l), data.settings.offer_hold_hours, now, 'Expired'); return <tr key={l.id} {...rowProps(l, openLead)}><td><Person lead={l}/></td><td><Chip tone={held.tone}>{held.label}</Chip></td><td><button type="button" className="ss-button" onClick={e => { e.stopPropagation(); void copy(l); }}><Link2 size={14}/>Copy link</button></td><Arrow name={l.full_name}/></tr>; })}
  </tbody></table></div>;
}

export function InterestedList({ leads, openLead }: { leads: Lead[]; openLead: (id: string) => void }) {
  if (!leads.length) return <Empty title="Nobody here yet">People who ask about this show up here. Use Add person for anyone who gets in touch another way.</Empty>;
  return <div className="ca-panel"><table className="ca-table"><thead><tr><th>Person</th><th>Added</th><th>Came from</th><th><span className="sr-only">Open</span></th></tr></thead><tbody>
    {[...leads].sort((a, b) => b.created_at.localeCompare(a.created_at)).map(l => <tr key={l.id} {...rowProps(l, openLead)}><td><Person lead={l}/></td><td>{readableDate(l.created_at)}</td><td><Chip tone="gray">{l.source}</Chip></td><Arrow name={l.full_name}/></tr>)}
  </tbody></table></div>;
}

export function PaidList({ leads, data, openLead }: { leads: Lead[]; data: CrmWorkspace; openLead: (id: string) => void }) {
  if (!leads.length) return <Empty title="No places filled yet">Students appear here on their own when their payment comes in.</Empty>;
  return <div className="ca-panel"><table className="ca-table"><thead><tr><th>Student</th><th>Paid</th><th>Onboarding</th><th><span className="sr-only">Open</span></th></tr></thead><tbody>
    {leads.map(l => { const student = data.students.find(s => s.id === l.enrollment_id); const paidOn = data.payments.filter(p => p.lead_id === l.id && p.kind === 'payment' && !p.voided_at).map(p => p.paid_on).sort()[0] ?? l.payment_on; const state = student ? onboardingState(student.call, student.questionnaire, student.focus) : null; return <tr key={l.id} {...rowProps(l, openLead)}><td><Person lead={l}/></td><td>{paidOn ? readableDate(paidOn) : '—'}</td><td>{state ? <Chip tone={state.key === 'complete' ? 'green' : 'gray'}>{state.label}</Chip> : '—'}</td><Arrow name={l.full_name}/></tr>; })}
  </tbody></table></div>;
}

/** Search results and closed people: anyone, shown with the stage they're at. */
export function PeopleList({ leads, stageOf, openLead, empty }: { leads: Lead[]; stageOf: (l: Lead) => string; openLead: (id: string) => void; empty: string }) {
  if (!leads.length) return <Empty title={empty}>Check the spelling, or use Add person to add them.</Empty>;
  return <div className="ca-panel"><table className="ca-table"><thead><tr><th>Person</th><th>Stage</th><th>Came from</th><th><span className="sr-only">Open</span></th></tr></thead><tbody>
    {[...leads].sort((a, b) => a.full_name.localeCompare(b.full_name)).map(l => <tr key={l.id} {...rowProps(l, openLead)}><td><Person lead={l}/></td><td><Chip tone="gray">{leadStages[stageOf(l) as keyof typeof leadStages]}</Chip></td><td>{l.source}</td><Arrow name={l.full_name}/></tr>)}
  </tbody></table></div>;
}

/** The links someone shared, shown at the top of their record. */
export function LeadLinks({ application, data }: { application: ApplicationRecord | undefined; data: CrmWorkspace }) {
  const key = data.settings.links_question_key;
  if (!key || !application) return null;
  const text = answerOf(application, key); const links = namedLinks(answerLinks(text));
  const instagram = answerOf(application, 'social').replace(/^@/, '');
  return <div className="ca-links"><h3>{data.settings.links_label}</h3>{links.length ? <div className="ca-link-pills">{links.map(link => <a key={link.url} className="ca-pill" href={link.url} target="_blank" rel="noreferrer">▶ {link.name}</a>)}</div> : <p className="ca-warn">No link.{text ? ` They wrote "${text}".` : ''}{instagram ? <> <a href={`https://instagram.com/${encodeURIComponent(instagram)}`} target="_blank" rel="noreferrer">Check @{instagram} on Instagram</a></> : null}</p>}</div>;
}

/** Their application: short answers as facts, long answers written out. Skips what's already shown above. */
export function ApplicationAnswers({ applications, data }: { applications: ApplicationRecord[]; data: CrmWorkspace }) {
  if (!applications.length) return <p className="ss-muted">No application from this person yet.</p>;
  const [latest, ...earlier] = [...applications].sort((a, b) => b.submitted_at.localeCompare(a.submitted_at));
  const hidden = new Set(['name', 'email', data.settings.links_question_key]);
  const answers = latest.answers.filter(a => a.answer?.trim() && !hidden.has(a.key));
  const short = answers.filter(a => a.answer.length <= 40 && !a.answer.includes('\n')); const long = answers.filter(a => !short.includes(a));
  return <div className="ca-answers">
    {short.length > 0 && <div className="ca-facts">{short.map(a => <div key={a.key}><small>{a.question}</small><strong>{a.answer}</strong></div>)}</div>}
    {long.map(a => <div key={a.key} className="ca-qa"><small>{a.question}</small><p>{a.answer}</p></div>)}
    <p className="ca-applied">Applied {readableDate(latest.submitted_at, true)} · Came from {applicationChannel(latest.attribution).toLowerCase()}</p>
    {earlier.map(application => <details key={application.id} className="ca-earlier"><summary>Earlier application · {readableDate(application.submitted_at, true)}</summary>{application.answers.filter(a => a.answer?.trim()).map(a => <div key={a.key} className="ca-qa"><small>{a.question}</small><p>{a.answer}</p></div>)}</details>)}
  </div>;
}
