import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, ClipboardList, Users } from 'lucide-react';
import { SuccessPrivacy } from './AdminCohorts';
import { sopRoot, staffSops } from '../staffSops';
import { successRoot } from '../studentSuccessApi';
import { crmRoot } from '../crm';
import '../studentSuccess.css';
import '../staffSops.css';

export function AdminSops() {
  const { sopId } = useParams();
  const guide = staffSops.find(s => s.id === sopId);
  if (sopId && !guide) return <section className="student-success"><Link className="ss-back" to={sopRoot}><ArrowLeft size={15}/> SOP library</Link><h1>Guide not found</h1></section>;
  return <section className="student-success sop-workspace">
    {guide && <Link className="ss-back" to={sopRoot}><ArrowLeft size={15}/> SOP library</Link>}
    <SuccessPrivacy/>
    <header className="ss-heading"><div><h1>{guide?.title ?? 'SOP library'}</h1><p>{guide?.description ?? 'Practical guides for onboarding, coaching and following up with students.'}</p></div>{guide && <span className="ss-badge">Led by {guide.owner}</span>}</header>
    {!guide ? <>
      <div className="ss-directory">{staffSops.map((s, i) => <Link key={s.id} to={`${sopRoot}/${s.id}`} className="ss-card sop-guide-card"><span className="ss-cohort-icon">{i === 0 ? <ClipboardList size={23}/> : i === 1 ? <Users size={23}/> : <BookOpen size={23}/>}</span><span className="ss-badge">{s.owner}</span><h2>{s.title}</h2><p>{s.description}</p><span className="ss-link">Open guide <ArrowRight size={15}/></span></Link>)}</div>
      <section className="ss-card sop-start"><div><h2>Open an onboarding questionnaire</h2><p>See who needs onboarding, then open their saved questionnaire from the queue.</p></div><Link className="ss-button ss-primary" to={`${crmRoot}/onboarding`}>Open onboarding <ArrowRight size={15}/></Link></section>
    </> : <div className="sop-layout"><div className="ss-stack">
      <section className="ss-notice"><h2>Leave with</h2><p>{guide.outcome}</p></section>
      {guide.sections.map((section, i) => <section key={section.title} id={`step-${i + 1}`} className="ss-card sop-step"><div className="sop-step-heading"><span>{i + 1}</span><h2>{section.title}</h2></div><ul>{section.points.map(p => <li key={p}>{p}</li>)}</ul></section>)}
    </div><aside className="ss-card sop-outline"><h2>Call guide</h2><nav aria-label="Guide sections">{guide.sections.map((s, i) => <a key={s.title} href={`#step-${i + 1}`}><span>{i + 1}</span>{s.title}</a>)}</nav><Link className="ss-button ss-primary" to={successRoot}>Open student records <ArrowRight size={15}/></Link>{guide.id === 'onboarding' && <p className="ss-muted">Choose a student, then open the Onboarding tab to work through the questionnaire.</p>}</aside></div>}
  </section>;
}
