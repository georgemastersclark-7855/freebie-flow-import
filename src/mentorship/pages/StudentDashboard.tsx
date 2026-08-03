import { ArrowRight, Check, Clock3, Headphones } from "lucide-react";
import { Link } from "react-router-dom";
import { usePortalStore } from "../PortalStore";
import { ChecklistRow, ProgressBar, StatusPill } from "../components/PortalUI";
import { cx } from "../utils";

export function StudentDashboard() {
  const { weeks, submissions } = usePortalStore();
  const currentWeek = weeks.find((week) => week.phase === "current") ?? weeks[0];
  const currentSubmission = submissions.find((submission) => submission.weekNumber === currentWeek.number)!;
  const newFeedback = submissions.find((submission) => submission.feedback && !submission.feedback.viewedAt);

  return (
    <div className="mx-auto max-w-[1320px] px-4 py-8 sm:px-7 lg:px-10 lg:py-10 xl:px-14">
      <header className="max-w-2xl">
        <h1 className="mp-display text-[40px] leading-none text-[#f2efe6] sm:text-[48px]">YOUR SUBMISSIONS</h1>
        <p className="mt-3 text-sm leading-6 text-[#8f8e85]">Upload song ideas throughout the week, then add your weekly song and stems before Friday.</p>
      </header>

      {newFeedback && (
        <Link to={`/mentorship-portal/week/${newFeedback.weekNumber}#feedback`} className="mp-focus-ring mt-6 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3.5 transition hover:border-white/20 hover:bg-white/[0.05]">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/[0.06] text-[#d8d5cc]"><Headphones size={16} /></span>
          <span className="min-w-0 flex-1 text-sm font-semibold text-[#e8e5dd]">Week {newFeedback.weekNumber} feedback is ready</span>
          <span className="hidden items-center gap-2 text-xs font-bold text-[#b8b5ad] sm:inline-flex">Listen now <ArrowRight size={14} /></span>
        </Link>
      )}

      <section className="mp-card mt-6 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex min-w-0 items-center gap-4">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.05] text-sm font-black text-white">{currentWeek.number}</div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-2xl font-black tracking-[-0.04em] text-[#f0ede5]">Week {currentWeek.number}</h2>
                <StatusPill state={currentSubmission.state} />
              </div>
              <div className="mt-1 text-xs text-[#9b9991]">{currentWeek.title}</div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-[#77766f]"><Clock3 size={13} />Due {currentWeek.deadlineLabel}</div>
            </div>
          </div>
          <Link to={`/mentorship-portal/week/${currentWeek.number}`} className="mp-focus-ring inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#D3FF02] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#b8e000]">Continue uploading <ArrowRight size={16} /></Link>
        </div>

        <div className="mt-6 border-t border-white/[0.08] pt-5">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm font-semibold text-[#d8d5cc]">{currentSubmission.ideas.length} of {currentWeek.requiredIdeas} ideas uploaded</div>
            <div className="text-xs text-[#77766f]">Week {currentWeek.number} progress</div>
          </div>
          <div className="mt-3"><ProgressBar value={currentSubmission.ideas.length} max={currentWeek.requiredIdeas} /></div>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <ChecklistRow complete={currentSubmission.ideas.length >= currentWeek.requiredIdeas} title={`${currentWeek.requiredIdeas} ideas`} detail="Upload as you create them" />
            <ChecklistRow complete={Boolean(currentSubmission.song)} title="Weekly song" detail="Intro to first chorus" />
            <ChecklistRow complete={Boolean(currentSubmission.stems)} title="Stems ZIP" detail="For live surgery" />
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between gap-4">
          <h2 className="text-lg font-black text-[#e8e5dd]">All six weeks</h2>
          <div className="hidden text-xs text-[#77766f] sm:block">Open any week to review its files.</div>
        </div>
        <div className="grid gap-2.5 md:grid-cols-2">
          {weeks.map((week) => {
            const submission = submissions.find((item) => item.weekNumber === week.number)!;
            const future = week.phase === "upcoming";
            const feedbackReady = Boolean(submission.feedback);
            return (
              <Link key={week.number} to={`/mentorship-portal/week/${week.number}`} className={cx("mp-focus-ring group flex items-center gap-3 rounded-xl border border-white/[0.08] bg-[#141411] p-4 transition hover:border-white/[0.18] hover:bg-white/[0.025]", week.phase === "current" && "border-white/15", future && "opacity-60 hover:opacity-90")}>
                <div className={cx("grid h-8 w-8 shrink-0 place-items-center rounded-full border text-xs font-black", submission.state === "submitted" ? "border-white/12 bg-white/[0.06] text-[#c8c5bc]" : "border-white/[0.08] bg-white/[0.04] text-[#8f8e85]")}>{submission.state === "submitted" ? <Check size={14} strokeWidth={3} /> : week.number}</div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-[#e5e2da]">Week {week.number}</div>
                  <div className="mt-0.5 text-[11px] text-[#77766f]">{week.title} · {week.requiredIdeas ? `${submission.ideas.length}/${week.requiredIdeas} ideas` : "Weekly song"}</div>
                </div>
                {feedbackReady ? <span className="text-[11px] font-bold text-[#D3FF02]">Feedback ready</span> : !future ? <StatusPill state={submission.state} /> : null}
                <ArrowRight size={14} className="shrink-0 text-[#66655f] transition group-hover:translate-x-0.5 group-hover:text-white" />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
