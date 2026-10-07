import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { loadStudentLead } from '../crmApi';
import { crmRoot } from '../crm';
import { safeSourceUrl } from '../studentSuccessApi';

export function StudentLeadContext({enrollmentId}:{enrollmentId:string}) {
  const query=useQuery({queryKey:['student-lead',enrollmentId],queryFn:()=>loadStudentLead(enrollmentId)});
  const lead=query.data;
  if(query.isError)return <p className="ss-muted">Application context could not be loaded. <button className="ss-link" onClick={()=>void query.refetch()}>Try again</button></p>;
  if(!lead)return null;
  return <section className="ss-card"><div className="ss-row"><h2>From their application & enquiry</h2><span className="ss-badge">{lead.source}</span></div>{lead.goals&&<p className="ss-prose">{lead.goals}</p>}<div className="ss-profile-links">{safeSourceUrl(lead.music_url)&&<a href={safeSourceUrl(lead.music_url)} target="_blank" rel="noreferrer">Listen to their music <ExternalLink size={13}/></a>}{safeSourceUrl(lead.application_url)&&<a href={safeSourceUrl(lead.application_url)} target="_blank" rel="noreferrer">Original application <ExternalLink size={13}/></a>}<Link to={`${crmRoot}/leads?cohort=${lead.cohort_id}&lead=${lead.id}`}>Lead details & history <ArrowRight size={13}/></Link></div></section>;
}
