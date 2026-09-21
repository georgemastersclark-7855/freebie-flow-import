import { useRef, useState } from "react";
import { ArrowRight, Check, Clock3, Headphones, LoaderCircle, Mail, MessageCircle, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { cx } from "../utils";
import { useAdminOverview } from "../useAdminOverview";
import type { AdminStudent, ReviewItem } from "../types";

type StudentFilter = "all" | "review" | "checkin" | "missing";
const feedbackLabels = { awaiting: "Awaiting feedback", draft: "Draft saved", published: "Published", actioned: "Feedback actioned" } as const;

function checkInReason(student: AdminStudent) {
  if (student.status === "not_started") return "Hasn't started this week";
  const missing = [!student.songSubmitted && "Song not uploaded", !student.stemsSubmitted && student.songSubmitted && "Stems not uploaded", student.ideasSubmitted < student.ideasRequired && "Loops incomplete"];
  return missing.filter(Boolean).join(" · ") || "Check in on progress";
}

function StudentIdentity({ student }: { student: AdminStudent }) {
  return <div className="flex items-start gap-3">
    <span aria-hidden="true" className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-xs font-bold text-[#ddd9d0]">{student.initials}</span>
    <div className="min-w-0"><h3 className="text-sm font-bold text-[#f2efe6]">{student.name}</h3><p className="mt-1 text-xs text-[#939188]">{student.lastActivity}</p>{student.status !== "on_track" && <p className="mt-1.5 max-w-[220px] text-[11px] leading-4 text-[#d7bd65]">{checkInReason(student)}</p>}</div>
  </div>;
}

function LoopProgress({ student }: { student: AdminStudent }) {
  return <div><span className="text-sm font-semibold tabular-nums text-[#dedbd2]">{student.ideasRequired ? `${student.ideasSubmitted} / ${student.ideasRequired}` : "None due"}</span>{student.ideasRequired > 0 && <div aria-hidden="true" className="mt-2 h-1 w-14 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[#c7c4bb]" style={{ width: `${Math.min(100, student.ideasSubmitted / student.ideasRequired * 100)}%` }} /></div>}</div>;
}

function UploadStatus({ student }: { student: AdminStudent }) {
  return <div className="space-y-1.5 text-xs"><p className={cx("flex items-center gap-1.5", student.songSubmitted ? "text-[#e2dfd6]" : "text-[#939188]")}>{student.songSubmitted && <Check size={13} aria-hidden="true" />}{student.songSubmitted ? "Song uploaded" : "No song yet"}</p><p className={cx("flex items-center gap-1.5", student.stemsSubmitted ? "text-[#e2dfd6]" : "text-[#939188]")}>{student.stemsSubmitted && <Check size={13} aria-hidden="true" />}{student.stemsSubmitted ? "Stems ready" : "No stems yet"}</p></div>;
}

function FeedbackStatus({ student, review }: { student: AdminStudent; review?: ReviewItem }) {
  const state = review?.status ?? student.feedbackState;
  // A student can have saved files without sending a submission for review.
  const label = !review && state === "awaiting" ? (student.songSubmitted ? "Not in review queue" : "Waiting for song") : feedbackLabels[state];
  return <span className={cx("inline-flex rounded-md px-2 py-1 text-[11px] font-semibold", review && state !== "published" ? "border border-white/15 bg-white/[0.07] text-[#f2efe6]" : "text-[#aaa99f]")}>{label}</span>;
}

function StudentActions({ student, review }: { student: AdminStudent; review?: ReviewItem }) {
  return <div className="flex flex-wrap items-center gap-2 xl:flex-col xl:items-end">
    {review && <Link to={`/mentorship-demo/admin/review/${review.id}`} aria-label={`${review.status === "draft" ? "Continue feedback for" : review.status === "published" ? "View feedback for" : "Review"} ${student.name}`} className="mp-focus-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold text-[#ece9e0] transition hover:border-white/30 hover:bg-white/10">{review.status === "draft" ? "Continue draft" : review.status === "published" ? "View feedback" : "Review"}<ArrowRight size={14} aria-hidden="true" /></Link>}
    {student.status !== "on_track" && student.email && <a href={`mailto:${student.email}`} aria-label={`Email ${student.name}`} className="mp-focus-ring inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold text-[#b6b3a8] hover:text-white"><Mail size={13} aria-hidden="true" />Email</a>}
    {!review && student.status === "on_track" && <span className="text-xs text-[#939188]">{!student.songSubmitted ? "Waiting for song" : student.feedbackState === "published" || student.feedbackState === "actioned" ? "Up to date" : "No action yet"}</span>}
  </div>;
}

export function AdminDashboard() {
  const { overview, loading, error } = useAdminOverview();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<StudentFilter>("all");
  const trackerHeading = useRef<HTMLHeadingElement>(null);
  const total = overview.students.length;
  const submitted = overview.students.filter((student) => student.songSubmitted).length;
  const stemsReady = overview.students.filter((student) => student.stemsSubmitted).length;
  const checkIns = overview.students.filter((student) => student.status !== "on_track");
  const pendingReviews = overview.reviews.filter((review) => review.status !== "published");
  const drafts = pendingReviews.filter((review) => review.status === "draft").length;
  const reviewsByStudent = new Map(overview.reviews.map((review) => [review.studentId, review]));
  const pendingStudentIds = new Set(pendingReviews.map((review) => review.studentId));
  const filters: { value: StudentFilter; label: string; count: number }[] = [
    { value: "all", label: "Everyone", count: total },
    { value: "review", label: "To review", count: overview.students.filter((student) => pendingStudentIds.has(student.id)).length },
    { value: "checkin", label: "Check-ins", count: checkIns.length },
    { value: "missing", label: "No song yet", count: total - submitted },
  ];
  const normalized = query.trim().toLowerCase();
  const visibleStudents = overview.students.filter((student) =>
    (filter === "all" || (filter === "review" && pendingStudentIds.has(student.id)) || (filter === "checkin" && student.status !== "on_track") || (filter === "missing" && !student.songSubmitted))
    && (!normalized || `${student.name} ${student.email}`.toLowerCase().includes(normalized)),
  );
  function showCheckIns() {
    setQuery("");
    setFilter("checkin");
    trackerHeading.current?.focus();
  }

  if (loading) return <div className="grid min-h-[55vh] place-items-center text-xs font-bold uppercase tracking-[0.16em] text-[#939188]"><span className="inline-flex items-center gap-2"><LoaderCircle size={16} className="animate-spin" />Loading cohort</span></div>;
  if (error) return <div role="alert" className="mx-auto mt-12 max-w-2xl rounded-2xl border border-red-400/20 bg-red-950/20 p-5 text-sm text-red-200">{error}</div>;

  return (
    <div className="mp-admin-overview mx-auto max-w-[1500px] px-4 py-8 sm:px-7 lg:px-10 lg:py-10 xl:px-12">
      <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#aaa99f]">{overview.cohortName} / {total} {total === 1 ? "producer" : "producers"}</p><h1 className="mp-display mp-overview-title mt-3 text-[#f2efe6]">THIS WEEK, ROB.</h1><p className="mt-3 text-sm text-[#aaa99f]">The music, the feedback and who's keeping up.</p></div>
        <div className="flex shrink-0 items-center gap-3 rounded-xl border border-white/10 px-4 py-3"><Clock3 size={17} aria-hidden="true" className="text-[#aaa99f]" /><div><p className="text-xs font-bold text-[#e2dfd6]">Week {overview.currentWeek} submissions</p><p className="mt-1 text-xs text-[#aaa99f]">{overview.deadlineLabel}</p></div></div>
      </header>

      <section className="mt-7 grid gap-4 lg:grid-cols-[1.35fr_1fr]" aria-label="Your next actions">
        <div className="flex flex-col justify-between rounded-2xl border border-white/20 bg-gradient-to-br from-[#262621] to-[#171714] p-5 sm:p-7">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#c7c4bb]"><Headphones size={16} aria-hidden="true" />Your feedback</div>
          <div className="mt-5 flex items-center gap-4"><span className="text-[52px] font-bold leading-none tracking-[-0.05em] text-[#f2efe6]">{pendingReviews.length}</span><div><h2 className="text-xl font-bold text-[#f2efe6]">{pendingReviews.length ? `track${pendingReviews.length === 1 ? "" : "s"} ready to review` : "You're all caught up"}</h2><p className="mt-1.5 text-sm text-[#aaa99f]">{pendingReviews.length ? "Listen in. Leave feedback. Keep them moving." : "New submissions will appear here when they're sent."}</p></div></div>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3"><Link to="/mentorship-demo/admin/reviews" className="mp-focus-ring inline-flex items-center justify-center gap-3 rounded-xl bg-[#D3FF02] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#e0ff57]">{pendingReviews.length ? "Open review queue" : "View feedback"}<ArrowRight size={17} aria-hidden="true" /></Link>{drafts > 0 && <span className="text-xs text-[#c7c4bb]">{drafts} saved {drafts === 1 ? "draft" : "drafts"} to pick up</span>}</div>
        </div>

        <div className="mp-card flex flex-col justify-between rounded-2xl p-5 sm:p-7">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#aaa99f]"><MessageCircle size={16} aria-hidden="true" />Keep everyone moving</div>
          <div className="mt-5"><h2 className="text-xl font-bold text-[#f2efe6]">{checkIns.length ? `${checkIns.length} ${checkIns.length === 1 ? "producer needs" : "producers need"} a check-in` : "Everyone's on track"}</h2><p className="mt-2 text-sm leading-6 text-[#aaa99f]">{checkIns.length ? checkIns.map((student) => student.name.split(" ")[0]).slice(0, 4).join(", ") + (checkIns.length > 4 ? ` and ${checkIns.length - 4} more.` : ".") : "You can see everyone's uploads and feedback below."}</p></div>
          <div className="mt-5"><button type="button" onClick={showCheckIns} className="mp-focus-ring inline-flex items-center gap-3 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-bold text-[#ece9e0] transition hover:bg-white/10">View check-ins<ArrowRight size={16} aria-hidden="true" /></button></div>
        </div>
      </section>

      <section className="mp-card mt-7 overflow-hidden rounded-2xl" aria-labelledby="cohort-tracker-title">
        <div className="border-b border-white/10 p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 ref={trackerHeading} id="cohort-tracker-title" tabIndex={-1} className="mp-focus-ring scroll-mt-8 text-xl font-bold text-[#f2efe6]">Your producers</h2><p className="mt-2 text-xs text-[#aaa99f]">Week {overview.currentWeek} at a glance</p></div><div className="flex gap-6 text-xs text-[#aaa99f]"><div><span className="mr-1.5 text-lg font-bold tabular-nums text-[#ece9e0]">{submitted}<span className="text-sm font-normal text-[#aaa99f]">/{total}</span></span>songs uploaded</div><div><span className="mr-1.5 text-lg font-bold tabular-nums text-[#ece9e0]">{stemsReady}<span className="text-sm font-normal text-[#aaa99f]">/{total}</span></span>stems ready</div></div></div>
          <div className="mt-5 flex flex-col justify-between gap-4 xl:flex-row xl:items-center"><div className="flex flex-wrap gap-2" role="group" aria-label="Filter students">{filters.map((item) => <button key={item.value} type="button" aria-pressed={filter === item.value} onClick={() => setFilter(item.value)} className={cx("mp-focus-ring inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition", filter === item.value ? "border-[#e2dfd6] bg-[#e2dfd6] text-[#171714]" : "border-white/10 text-[#aaa99f] hover:border-white/25 hover:text-white")}>{item.label}<span className={cx("rounded px-1.5 py-0.5 tabular-nums", filter === item.value ? "bg-black/10" : "bg-white/5")}>{item.count}</span></button>)}</div><label className="relative block xl:w-[240px]"><span className="sr-only">Search students</span><Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#939188]" size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Search students" className="mp-focus-ring h-10 w-full rounded-lg border border-white/15 bg-black/20 pl-9 pr-3 text-sm text-white placeholder:text-[#939188]" /></label></div>
        </div>

        <div className="hidden xl:block"><table className="w-full border-collapse text-left"><caption className="sr-only">Week {overview.currentWeek} student progress and feedback</caption><thead><tr className="border-b border-white/10 bg-black/15 text-[10px] font-bold uppercase tracking-[0.1em] text-[#aaa99f]"><th scope="col" className="px-6 py-3.5">Producer</th><th scope="col" className="px-3 py-3.5">Loops</th><th scope="col" className="px-3 py-3.5">Uploads</th><th scope="col" className="px-3 py-3.5">Feedback</th><th scope="col" className="px-3 py-3.5">Live calls</th><th scope="col" className="px-6 py-3.5 text-right">Next step</th></tr></thead><tbody className="divide-y divide-white/[0.07]">{visibleStudents.map((student) => {
          const review = reviewsByStudent.get(student.id);
          return <tr key={student.id} className="transition hover:bg-white/[0.025]"><td className="px-6 py-5"><StudentIdentity student={student} /></td><td className="px-3 py-5"><LoopProgress student={student} /></td><td className="px-3 py-5"><UploadStatus student={student} /></td><td className="px-3 py-5"><FeedbackStatus student={student} review={review} /></td><td className="px-3 py-5 text-xs"><p className="text-[#c7c4bb]">{student.attendanceTotal ? `${student.attendance}/${student.attendanceTotal} attended` : "No calls yet"}</p><p className="mt-1.5 text-[#939188]">{student.surgeryCount} {student.surgeryCount === 1 ? "surgery" : "surgeries"}</p></td><td className="px-6 py-5 text-right"><StudentActions student={student} review={review} /></td></tr>;
        })}</tbody></table></div>

        <div className="divide-y divide-white/10 xl:hidden">{visibleStudents.map((student) => {
          const review = reviewsByStudent.get(student.id);
          return <article key={student.id} className="p-5"><StudentIdentity student={student} /><div className="mt-5 grid grid-cols-[0.6fr_1fr_1fr] gap-3"><div><p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#939188]">Loops</p><LoopProgress student={student} /></div><div><p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#939188]">Uploads</p><UploadStatus student={student} /></div><div><p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#939188]">Live calls</p><p className="text-xs text-[#c7c4bb]">{student.attendanceTotal ? `${student.attendance}/${student.attendanceTotal} attended` : "No calls yet"}</p><p className="mt-1.5 text-xs text-[#939188]">{student.surgeryCount} {student.surgeryCount === 1 ? "surgery" : "surgeries"}</p></div></div><div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-4"><FeedbackStatus student={student} review={review} /><StudentActions student={student} review={review} /></div></article>;
        })}</div>
        {!visibleStudents.length && <div className="px-6 py-12 text-center"><h3 className="text-lg font-bold text-[#f2efe6]">{normalized ? "No matching producers" : !total ? "Your cohort is taking shape" : "Nothing here to follow up"}</h3><p className="mt-2 text-sm text-[#aaa99f]">{normalized ? "Try another name or clear your search." : !total ? "Students will appear here once they join the cohort." : "Choose another filter to see the rest of your cohort."}</p>{(normalized || filter !== "all") && <button type="button" onClick={() => { setQuery(""); setFilter("all"); }} className="mp-focus-ring mt-4 rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-[#ece9e0]">Show everyone</button>}</div>}
        {visibleStudents.length > 0 && <p aria-live="polite" className="border-t border-white/10 px-6 py-3 text-xs text-[#939188]">Showing {visibleStudents.length} of {total} producers</p>}
      </section>
    </div>
  );
}
