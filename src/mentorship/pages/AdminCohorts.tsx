import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, Search, Users, ShieldCheck } from 'lucide-react';
import { StudentAvatar } from '../components/StudentAvatar';
import { loadSuccessCohorts, loadCohortWorkspace, successRoot } from '../studentSuccessApi';
import { studentProgress } from '../studentSuccess';
import { loadCohortRecordList, recordRoot } from '../cohortRecordsApi';
import '../studentSuccess.css';

export function SuccessLoading() { return <div className="ss-empty" role="status">Loading student records…</div>; }
export function SuccessError({ error, retry }: { error: unknown; retry: () => void }) {
  return <div className="ss-error" role="alert"><p>{error instanceof Error ? error.message : 'Unable to load records.'}</p><button onClick={retry} className="ss-button">Try again</button></div>;
}
export function SuccessPrivacy() { return <p className="ss-private"><ShieldCheck size={14} /> Staff workspace · Notes and follow-ups are private</p>; }
export function AdminCohorts() {
  const query = useQuery({ queryKey: ['success-cohorts'], queryFn: loadSuccessCohorts });
  const records = useQuery({ queryKey: ['cohort-record-list'], queryFn: loadCohortRecordList });
  const cohorts = [...(query.data??[]).map(c=>({id:c.id,name:c.internal_name,description:c.display_name,status:c.status,detail:c.starts_at?`Starts ${new Date(c.starts_at).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}`:'Start date not set',url:`${successRoot}/${c.id}`})),...(records.data??[]).map(c=>({id:c.id,name:c.name,description:"Rob Late's Producer Mentorship",status:'',detail:`${c.student_count} student records`,url:`${recordRoot}/${c.id}`}))].sort((a,b)=>a.name.localeCompare(b.name,undefined,{numeric:true}));
  return <section className="student-success ss-cohort-directory"><SuccessPrivacy /><header className="ss-heading"><div><span className="ss-directory-label">STUDENT MANAGEMENT</span><h1>Cohorts & students</h1><p>Choose a cohort to open student records, music and coaching notes.</p></div><span className="ss-directory-count"><Users size={16}/>{cohorts.length} cohorts</span></header>
    {query.isPending||records.isPending?<SuccessLoading/>:query.isError||records.isError?<SuccessError error={query.error??records.error} retry={()=>{void query.refetch();void records.refetch();}}/>:<div className="ss-directory ss-cohort-grid">{cohorts.map((c,i)=><Link key={c.id} to={c.url} className={`ss-cohort-tile ${c.status==='draft'?'ss-cohort-upcoming':''}`}><div className="ss-cohort-tile-top"><span className="ss-cohort-number">{String(i+1).padStart(2,'0')}</span>{c.status&&<span className="ss-badge">{c.status}</span>}</div><div className="ss-cohort-tile-body"><h2>{c.name}</h2><p>{c.description}</p><div className="ss-cohort-detail"><Users size={16}/>{c.detail}</div></div><footer><span>Open cohort</span><span className="ss-cohort-open"><ArrowRight size={18}/></span></footer></Link>)}{!cohorts.length&&<div className="ss-empty">No cohorts have been created yet.</div>}</div>}
  </section>;
}
export function AdminCohortStudents() {
  const { cohortId = '' } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const cohorts = useQuery({ queryKey: ['success-cohorts'], queryFn: loadSuccessCohorts });
  const query = useQuery({ queryKey: ['success-cohort', cohortId], queryFn: () => loadCohortWorkspace(cohortId) });
  const data = query.data;
  const matches = data?.students.map(student => ({ student, progress: studentProgress(data, student) })).filter(({ student, progress }) => {
    const text = [student.name, student.email, student.profile?.artistName].join(' ').toLowerCase();
    return text.includes(search.toLowerCase()) && (filter === 'all' || (filter === 'attention' ? progress.needsAttention : student.status === filter));
  });
  const realStudents = data?.students.filter(s => !s.is_walkthrough) ?? [];
  return <section className="student-success"><Link to={successRoot} className="ss-back"><ArrowLeft size={15}/> All cohorts</Link><SuccessPrivacy />
    <header className="ss-heading"><div><h1>{data?.cohort.internal_name ?? 'Students'}</h1><p>Student records, music and follow-ups.</p></div><label className="ss-field">Cohort<select value={cohortId} onChange={e => navigate(`${successRoot}/${e.target.value}`)}>{cohorts.data?.map(c => <option key={c.id} value={c.id}>{c.internal_name} · {c.status}</option>)}</select></label></header>
    {query.isPending ? <SuccessLoading /> : query.isError ? <SuccessError error={query.error} retry={() => void query.refetch()}/> : data && <>
      <div className="ss-stats"><div><strong>{realStudents.length}</strong><span>Students</span></div><div><strong>{realStudents.filter(s => studentProgress(data, s).needsAttention).length}</strong><span>Need attention</span></div><div><strong>{realStudents.reduce((n, s) => n + studentProgress(data, s).reviews, 0)}</strong><span>Awaiting feedback</span></div><div><strong>{data.actions.filter(a => !a.completed_at && realStudents.some(s => s.id === a.enrollment_id)).length}</strong><span>Open follow-ups</span></div></div>
      <div className="ss-toolbar"><label className="ss-search"><Search size={17}/><input aria-label="Search students" placeholder="Search name, artist or email" value={search} onChange={e => setSearch(e.target.value)}/></label><label className="ss-field"><span className="sr-only">Filter students</span><select value={filter} onChange={e => setFilter(e.target.value)}><option value="all">All students</option><option value="attention">Needs attention</option><option value="active">Active</option><option value="completed">Completed</option><option value="inactive">Inactive</option></select></label><span className="ss-muted">{matches?.length} records</span></div>
      <div className="ss-directory">{matches?.map(({ student, progress }) => <Link className="ss-card ss-student-card" key={student.id} to={`${successRoot}/${cohortId}/students/${student.id}`}>
        <div className="ss-student-heading"><StudentAvatar name={student.name} src={student.profile?.photoUrl} size={64} member={Boolean(student.profile?.completedAt)}/><div><h2>{student.name}</h2><p>{student.profile?.artistName || student.email}</p></div></div>
        <div className="ss-tags"><span className="ss-badge">{student.is_walkthrough ? 'Your test student' : student.status}</span>{student.profile?.daw && <span className="ss-badge">{student.profile.daw}</span>}</div>
        <div className="ss-mini-stats"><span><strong>{progress.submitted}/6</strong> Weeks submitted</span><span><strong>{progress.starters}</strong> Song starters</span><span><strong>{progress.surgeries}</strong> Live surgeries</span></div>
        <div className="ss-card-status">{progress.missingWeeks.length > 0 && <p className="ss-warning">Missing submission: week {progress.missingWeeks.map(w => w.week_number).join(', ')}</p>}{progress.reviews > 0 && <p>{progress.reviews} submission{progress.reviews === 1 ? '' : 's'} awaiting feedback</p>}{progress.actions.length > 0 && <p>{progress.actions.length} open follow-up{progress.actions.length === 1 ? '' : 's'}</p>}{!progress.needsAttention && <p>No open follow-ups or overdue submissions.</p>}</div>
        <span className="ss-link">Open student record <ArrowRight size={16}/></span>
      </Link>)}</div>{!matches?.length && <div className="ss-empty">No students match this view.</div>}
    </>}
  </section>;
}
