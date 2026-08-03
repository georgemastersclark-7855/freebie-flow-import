import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, Check, Clock3, Headphones, LoaderCircle, Search, Sparkles, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { adminStudents, reviewItems } from "../demoData";
import { loadLiveAdminOverview } from "../liveAdminApi";
import { usePortalStore } from "../PortalStore";
import type { AdminOverview } from "../types";
import { cx } from "../utils";

const feedbackLabels = { awaiting: "Awaiting review", draft: "Draft saved", published: "Published", actioned: "Actioned" } as const;

export function AdminDashboard() {
  const { backend } = usePortalStore();
  const [overview, setOverview] = useState<AdminOverview>({
    cohortId: "demo-cohort",
    cohortName: "Cohort 2",
    currentWeek: 2,
    deadlineLabel: "Friday, 6:00pm",
    students: adminStudents,
    reviews: reviewItems,
  });
  const [loading, setLoading] = useState(backend === "supabase");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (backend !== "supabase") return;
    let active = true;
    setLoading(true);
    loadLiveAdminOverview()
      .then((data) => { if (active) setOverview(data); })
      .catch((reason) => { if (active) setError(reason instanceof Error ? reason.message : "Unable to load the cohort."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [backend]);

  const visibleStudents = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return normalized
      ? overview.students.filter((student) => `${student.name} ${student.email}`.toLowerCase().includes(normalized))
      : overview.students;
  }, [overview.students, query]);
  const submitted = overview.students.filter((student) => student.songSubmitted).length;
  const stemsReady = overview.students.filter((student) => student.stemsSubmitted).length;
  const rescue = overview.students.filter((student) => student.status !== "on_track").length;
  const total = overview.students.length;

  if (loading) return <div className="grid min-h-[55vh] place-items-center text-xs font-bold uppercase tracking-[0.16em] text-[#77766f]"><span className="inline-flex items-center gap-2"><LoaderCircle size={16} className="animate-spin" />Loading cohort</span></div>;
  if (error) return <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-red-400/20 bg-red-950/20 p-5 text-sm text-red-200">{error}</div>;

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-7 lg:px-10 lg:py-10 xl:px-14">
      <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div><div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8f8e85]">{overview.cohortName} operations</div><h1 className="mp-display mt-2 text-[48px] leading-[0.92] text-[#f2efe6] sm:text-[62px]">WEEK {overview.currentWeek} OVERVIEW</h1><p className="mt-3 text-sm text-[#8f8e85]">{overview.deadlineLabel} submission deadline.</p></div>
      </header>

      <section className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[{ label: "Songs submitted", value: `${submitted}/${total}`, detail: `${Math.max(0, total - submitted)} still missing`, icon: Headphones, accent: "primary" }, { label: "Stems ready", value: `${stemsReady}/${total}`, detail: "Surgery eligible", icon: Sparkles, accent: "green" }, { label: "Active students", value: total.toString(), detail: "Current cohort", icon: Users, accent: "neutral" }, { label: "Needs a check-in", value: rescue.toString(), detail: "Personal rescue queue", icon: AlertTriangle, accent: "warning" }].map(({ label, value, detail, icon: Icon, accent }) => (
          <div key={label} className="mp-card rounded-2xl p-5"><div className="flex items-center justify-between"><div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#77766f]">{label}</div><Icon size={17} className={cx(accent === "primary" && "text-[#88887f]", accent === "green" && "text-[#9be15d]", accent === "warning" && "text-amber-400", accent === "neutral" && "text-[#88887f]")} /></div><div className="mt-3 text-3xl font-black tracking-[-0.06em] text-white">{value}</div><div className="mt-1 text-xs text-[#77766f]">{detail}</div></div>
        ))}
      </section>

      <section className="mt-7 grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="mp-card overflow-hidden rounded-3xl">
          <div className="flex flex-col justify-between gap-4 border-b border-white/[0.08] px-5 py-5 sm:flex-row sm:items-center sm:px-6"><div><div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#77766f]">Cohort board</div><h2 className="mt-1 text-base font-black text-[#ece9e0]">Every student, one screen</h2></div><label className="relative block sm:w-[250px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#66655f]" size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Search students" className="mp-focus-ring h-10 w-full rounded-xl border border-white/[0.08] bg-black/20 pl-9 pr-3 text-xs text-white placeholder:text-[#5f5e58]" /></label></div>
          <div className="mp-scrollbar overflow-x-auto">
            <table className="w-full min-w-[880px] border-collapse text-left">
              <thead><tr className="border-b border-white/[0.08] text-[10px] font-bold uppercase tracking-[0.12em] text-[#66655f]"><th className="px-6 py-3.5">Student</th><th className="px-3 py-3.5">Ideas</th><th className="px-3 py-3.5">Song</th><th className="px-3 py-3.5">Stems</th><th className="px-3 py-3.5">Calls</th><th className="px-3 py-3.5">Surgery</th><th className="px-3 py-3.5">Feedback</th><th className="px-6 py-3.5 text-right">Status</th></tr></thead>
              <tbody className="divide-y divide-white/[0.065]">
                {visibleStudents.map((student) => (
                  <tr key={student.id} className="group transition hover:bg-white/[0.02]"><td className="px-6 py-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-white/[0.06] text-[11px] font-black text-[#d2cfc6]">{student.initials}</span><div><div className="text-sm font-bold text-[#e5e1d8]">{student.name}</div><div className="text-[11px] text-[#66655f]">{student.lastActivity}</div></div></div></td><td className="px-3 py-4"><span className={cx("text-sm font-black", student.ideasSubmitted >= student.ideasRequired ? "text-[#b8ef87]" : "text-[#e0ddd4]")}>{student.ideasSubmitted}/{student.ideasRequired}</span></td><td className="px-3 py-4">{student.songSubmitted ? <Check size={16} className="text-[#b8ef87]" /> : <span className="text-[#4f4e49]">—</span>}</td><td className="px-3 py-4">{student.stemsSubmitted ? <Check size={16} className="text-[#b8ef87]" /> : <span className="text-[#4f4e49]">—</span>}</td><td className="px-3 py-4 text-xs font-semibold text-[#aaa99f]">{student.attendanceTotal ? `${student.attendance}/${student.attendanceTotal}` : "—"}</td><td className="px-3 py-4 text-xs font-semibold text-[#aaa99f]">{student.surgeryCount}</td><td className="px-3 py-4"><span className={cx("rounded-full border px-2 py-1 text-[10px] font-bold", student.feedbackState === "awaiting" && "border-white/10 bg-white/[0.04] text-[#aaa99f]", student.feedbackState === "draft" && "border-white/10 bg-white/[0.04] text-[#99988f]", student.feedbackState === "published" && "border-blue-400/15 bg-blue-950/25 text-blue-300", student.feedbackState === "actioned" && "border-[#9be15d]/20 bg-[#14200f] text-[#b8ef87]")}>{feedbackLabels[student.feedbackState]}</span></td><td className="px-6 py-4 text-right"><span className={cx("inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-bold", student.status === "on_track" ? "border-[#9be15d]/20 bg-[#14200f] text-[#b8ef87]" : student.status === "needs_attention" ? "border-amber-400/20 bg-amber-950/25 text-amber-300" : "border-red-400/20 bg-red-950/25 text-red-300")}><span className="h-1.5 w-1.5 rounded-full bg-current" />{student.status === "on_track" ? "On track" : student.status === "needs_attention" ? "Check in" : "Not started"}</span></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="mp-card rounded-3xl p-5"><div className="flex items-center justify-between"><div><div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#77766f]">Rob's queue</div><h2 className="mt-1 text-base font-black text-[#ece9e0]">Submission reviews</h2></div><span className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.05] text-xs font-black text-white">{overview.reviews.length}</span></div><div className="mt-5 space-y-2.5">{overview.reviews.length ? overview.reviews.map((item) => <Link key={item.id} to={`/mentorship-portal/admin/review/${item.id}`} className="mp-focus-ring group block rounded-2xl border border-white/[0.08] bg-black/20 p-4 transition hover:border-white/15"><div className="flex items-start justify-between gap-3"><div><div className="text-sm font-bold text-[#e5e1d8]">{item.studentName}</div><div className="mt-0.5 text-[11px] text-[#77766f]">{item.songName}</div></div><ArrowRight size={15} className="text-[#66655f] transition group-hover:translate-x-0.5 group-hover:text-white" /></div><div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3 text-[10px] font-semibold text-[#66655f]"><span>{item.status === "published" ? "Feedback published" : item.status === "draft" ? "Draft saved" : item.submittedLabel}</span><span className={item.stemsReady ? "text-[#9fcb7b]" : "text-amber-300"}>{item.stemsReady ? "Stems ready" : "No stems"}</span></div></Link>) : <div className="rounded-2xl border border-dashed border-white/10 p-4 text-xs leading-5 text-[#77766f]">No completed submissions are waiting for Rob yet.</div>}</div></div>

          <div className="rounded-3xl border border-amber-400/15 bg-amber-950/15 p-5"><div className="flex items-center gap-2 text-sm font-black text-amber-200"><AlertTriangle size={17} />Rescue queue</div><div className="mt-4 space-y-3">{overview.students.filter((student) => student.status !== "on_track").slice(0, 3).map((student) => <div key={student.id} className="flex items-center justify-between gap-3"><div><div className="text-xs font-bold text-[#ddd9d0]">{student.name}</div><div className="text-[10px] text-[#77766f]">{student.lastActivity}</div></div><a href={`mailto:${student.email}`} className="mp-focus-ring rounded-lg border border-amber-400/15 px-2.5 py-1.5 text-[10px] font-bold text-amber-200">Check in</a></div>)}</div></div>

          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5"><div className="flex items-center gap-2 text-sm font-bold text-[#dedbd2]"><Clock3 size={16} className="text-[#8f8e85]" />Friday workflow</div><ol className="mt-4 space-y-3 text-xs text-[#77766f]"><li>1. Check missing submissions at 6:00pm.</li><li>2. Send personal rescue messages.</li><li>3. Rob selects two surgery tracks Saturday.</li><li>4. Publish written or voice feedback.</li></ol></div>
        </aside>
      </section>
    </div>
  );
}
