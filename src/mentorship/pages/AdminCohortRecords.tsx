import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, ExternalLink, Search, Users, ShieldCheck } from 'lucide-react';
import { StudentAvatar } from '../components/StudentAvatar';
import { loadCohortRecord, loadCohortRecordList, recordRoot, recordSourceUrl, type RecordFinding, type CohortRecordPayload } from '../cohortRecordsApi';
import { successRoot } from '../studentSuccessApi';
import '../studentSuccess.css';

function counted(count: number, label: string) { return `${count} ${label}${count === 1 ? '' : 's'}`; }

export function CohortRecordCards() {
  const query = useQuery({ queryKey: ['cohort-record-list'], queryFn: loadCohortRecordList });
  if (query.isPending) return <div role="status" className="ss-empty">Loading more cohorts…</div>;
  if (query.isError) return <div className="ss-error" role="alert">Unable to load all cohorts. <button className="ss-button" onClick={() => void query.refetch()}>Try again</button></div>;
  return <>{query.data.map(cohort => <Link key={cohort.id} to={`${recordRoot}/${cohort.id}`} className="ss-card ss-cohort">
    <span className="ss-cohort-icon"><Users size={22}/></span><h2>{cohort.name}</h2><p>Rob Late's Producer Mentorship</p><div className="ss-row"><span>{counted(cohort.student_count, 'student record')}</span><span className="ss-link">View students <ArrowRight size={16}/></span></div>
  </Link>)}</>;
}

function Finding({ finding, sources }: { finding: RecordFinding; sources: CohortRecordPayload['sources'] }) {
  return <article className="ss-card"><span className="ss-badge">{finding.category}</span><h2 className="mt-3">{finding.title}</h2><p>{finding.text}</p>
    <details className="ss-transcript"><summary>View supporting notes</summary>{finding.evidence.map((e, i) => {
      const source = sources.find(s => s.id === e.sourceId);
      const url = recordSourceUrl(e.url);
      return <div key={i} className="ss-feedback"><h3>{source?.title}</h3><p className="ss-muted">{source?.dateLabel} · {e.locator}</p><blockquote className="ss-prose mt-3">{e.quote}</blockquote>{url && <a className="ss-link mt-3" href={url} target="_blank" rel="noreferrer">Open recording at this point <ExternalLink size={13}/></a>}</div>;
    })}</details>
  </article>;
}

export function AdminCohortRecords() {
  const { recordCohortId = '', recordStudentId } = useParams();
  const [search, setSearch] = useState('');
  const [params, setParams] = useSearchParams();
  const tabs = ['Overview', 'Calls & notes', 'Music'];
  const tab = tabs.includes(params.get('tab') ?? '') ? params.get('tab')! : 'Overview';
  const query = useQuery({ queryKey: ['cohort-record', recordCohortId], queryFn: () => loadCohortRecord(recordCohortId) });
  const cohort = query.data;
  const student = cohort?.payload.students.find(s => s.id === recordStudentId);
  const sources = cohort?.payload.sources.filter(s => student?.sourceIds.includes(s.id)) ?? [];
  const matchingStudents = cohort?.payload.students.filter(s => `${s.name} ${s.subtitle}`.toLowerCase().includes(search.toLowerCase())) ?? [];
  const back = recordStudentId ? `${recordRoot}/${recordCohortId}` : successRoot;
  return <section className="student-success">
    <Link to={back} className="ss-back"><ArrowLeft size={15}/>{recordStudentId ? `All students · ${cohort?.name ?? 'Cohort'}` : 'All cohorts'}</Link>
    <p className="ss-private"><ShieldCheck size={14}/> Staff workspace · Notes and follow-ups are private</p>
    {query.isPending ? <div className="ss-empty mt-5" role="status">Loading student records…</div> : query.isError ? <div className="ss-error mt-5" role="alert"><p>Unable to load this cohort.</p><button className="ss-button" onClick={() => void query.refetch()}>Try again</button></div> : !cohort ? null : recordStudentId && !student ? <div className="ss-empty mt-5">Student record not found.</div> : student ? <>
      <header className="ss-profile-header"><StudentAvatar name={student.name} size={80}/><div className="ss-profile-heading"><div className="ss-row"><h1>{student.name}</h1><span className="ss-badge">{cohort.name}</span></div><p>{student.subtitle}</p></div></header>
      <nav className="ss-tabs" aria-label="Student record sections">{tabs.map(t => <button key={t} aria-current={tab === t ? 'page' : undefined} onClick={() => setParams({ tab: t })}>{t}{t === 'Calls & notes' && <> <span>{sources.length}</span></>}</button>)}</nav>
      {tab === 'Overview' && <div className="ss-columns"><div className="ss-stack"><section className="ss-card"><h2>Focus for coaching</h2><p>{student.focus}</p></section>{student.findings.map((f, i) => <Finding key={i} finding={f} sources={sources}/>)}</div><aside className="ss-stack"><section className="ss-card"><h2>Suggested next check-in</h2><p className="ss-muted">Questions to review with the student.</p>{student.questions.map((q, i) => <div key={i} className="ss-note-preview"><h3>{q.text}</h3><p>{q.reason}</p></div>)}</section><section className="ss-card"><h2>Call notes</h2><p>{counted(sources.length, 'call')} linked to this student.</p><button className="ss-link mt-4" onClick={() => setParams({ tab: 'Calls & notes' })}>Read call notes <ArrowRight size={15}/></button></section></aside></div>}
      {tab === 'Calls & notes' && <div className="ss-stack">{sources.map(source => <article key={source.id} className="ss-card"><div className="ss-row"><h2>{source.title}</h2><span className="ss-muted">{source.dateLabel}</span></div><p>{source.note}</p>{recordSourceUrl(source.url) && <a className="ss-link mt-3" href={recordSourceUrl(source.url)} target="_blank" rel="noreferrer">Open recording <ExternalLink size={13}/></a>}<details className="ss-transcript"><summary>Read transcript</summary><div className="ss-prose">{source.transcript}</div></details></article>)}</div>}
      {tab === 'Music' && <div className="ss-stack">{student.music.map((f, i) => <Finding key={i} finding={f} sources={sources}/>)}<section className="ss-card"><h2>Uploads & comparisons</h2><p>No audio files have been linked to this record yet. Call notes above capture the music discussed and any live work Rob did.</p></section></div>}
    </> : <>
      <header className="ss-heading"><div><h1>{cohort.name}</h1><p>Student records, coaching context and call notes.</p></div></header>
      <div className="ss-toolbar"><label className="ss-search"><Search size={17}/><input aria-label="Search students" placeholder="Search students" value={search} onChange={e => setSearch(e.target.value)}/></label><span className="ss-muted">{counted(matchingStudents.length, 'student record')}</span></div>
      <div className="ss-directory">{matchingStudents.map(s => <Link key={s.id} to={`${recordRoot}/${cohort.id}/students/${s.id}`} className="ss-card ss-student-card"><div className="ss-student-heading"><StudentAvatar name={s.name} size={64}/><div><h2>{s.name}</h2><p>{s.subtitle}</p></div></div><h3 className="mt-5">Focus for coaching</h3><p>{s.focus}</p><div className="ss-tags"><span className="ss-badge">{counted(s.sourceIds.length, 'call record')}</span></div><span className="ss-link mt-5">Open student record <ArrowRight size={16}/></span></Link>)}</div>
      {!matchingStudents.length && <div className="ss-empty">No students match your search.</div>}
    </>}
  </section>;
}
