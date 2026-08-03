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
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-7 lg:px-10 lg:py-10 xl:px-14">
      <header>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#77766f]">Rob Late's Producer Mentorship</div>
          <h1 className="mp-display mt-2 text-[46px] leading-[0.95] text-[#f2efe6] sm:text-[58px]">SUBMIT YOUR WORK.</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#8f8e85]">Upload ideas as you make them, then send Rob your weekly song and stems by the deadline.</p>
        </div>
      </header>

      {newFeedback && (
        <Link to={`/mentorship-portal/week/${newFeedback.weekNumber}#feedback`} className="mp-focus-ring mt-8 flex flex-col gap-4 rounded-2xl border border-white/[0.1] bg-white/[0.035] p-5 transition hover:border-white/20 hover:bg-white/[0.05] sm:flex-row sm:items-center">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-[#ddd9d0]"><Headphones size={19} /></span>
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[#8f8e85]">New from Rob</span>
            <span className="mt-1 block text-base font-bold text-white">Your Week {newFeedback.weekNumber} feedback is ready.</span>
            <span className="mt-0.5 block text-xs text-[#b9a197]">Listen to the feedback and confirm your next action.</span>
          </span>
          <span className="inline-flex items-center gap-2 text-sm font-bold text-[#e3dfd6]">Open feedback <ArrowRight size={16} /></span>
        </Link>
      )}

      <section className="mt-8">
        <div className="mp-card overflow-hidden rounded-3xl">
          <div className="border-b border-white/[0.08] px-5 py-5 sm:px-7">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#77766f]">Current submission</div>
                <h2 className="mp-display mt-2 text-[35px] leading-none text-white sm:text-[42px]">WEEK {currentWeek.number}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#96958c]">{currentSubmission.ideas.length} of {currentWeek.requiredIdeas} ideas uploaded. Add the remaining files before Friday.</p>
              </div>
              <StatusPill state={currentSubmission.state} />
            </div>
          </div>
          <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_240px]">
            <div>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-[#8f8e85]">Ideas uploaded</div>
                  <div className="mt-1 text-3xl font-black tracking-[-0.05em] text-white">{currentSubmission.ideas.length}/{currentWeek.requiredIdeas}</div>
                </div>
                <div className="text-right text-xs text-[#77766f]"><Clock3 className="mb-1 ml-auto" size={16} />Due {currentWeek.deadlineLabel}</div>
              </div>
              <div className="mt-3"><ProgressBar value={currentSubmission.ideas.length} max={currentWeek.requiredIdeas} /></div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ChecklistRow complete={currentSubmission.ideas.length >= currentWeek.requiredIdeas} title={`${currentWeek.requiredIdeas} ideas`} detail="Upload them as you create them" />
                <ChecklistRow complete={Boolean(currentSubmission.song)} title="Selected song" detail="Intro to end of first chorus" />
                <ChecklistRow complete={Boolean(currentSubmission.stems)} title="Stems ZIP" detail="Your surgery entry" />
              </div>
            </div>
            <Link to={`/mentorship-portal/week/${currentWeek.number}`} className="mp-focus-ring group flex min-h-[180px] flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.035] p-5 text-white transition hover:border-[#D3FF02]/35 hover:bg-white/[0.05]">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#D3FF02] text-black"><ArrowRight size={19} className="transition group-hover:translate-x-0.5" /></span>
              <span>
                <span className="block text-[11px] font-bold uppercase tracking-[0.15em] text-[#8f8e85]">Continue Week {currentWeek.number}</span>
                <span className="mt-1 block text-xl font-black tracking-[-0.03em]">Upload your next idea</span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#77766f]">Submission history</div>
            <h2 className="mp-display mt-1 text-[34px] leading-none text-[#ece9e0]">CHOOSE A WEEK</h2>
          </div>
          <div className="hidden text-xs text-[#77766f] sm:block">Review previous uploads or open the current week.</div>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {weeks.map((week) => {
            const submission = submissions.find((item) => item.weekNumber === week.number)!;
            const future = week.phase === "upcoming";
            const feedbackReady = Boolean(submission.feedback);
            return (
              <Link key={week.number} to={`/mentorship-portal/week/${week.number}`} className={cx("mp-focus-ring group rounded-2xl border p-5 transition", week.phase === "current" ? "border-white/15 bg-white/[0.035] hover:border-white/25" : "border-white/[0.08] bg-[#141411] hover:border-white/15", future && "opacity-65 hover:opacity-100")}>
                <div className="flex items-start justify-between gap-4">
                  <div className={cx("grid h-9 w-9 place-items-center rounded-full border text-xs font-black", week.phase === "current" ? "border-white/15 bg-white/[0.07] text-white" : submission.state === "submitted" ? "border-[#9be15d]/25 bg-[#9be15d]/10 text-[#b8ef87]" : "border-white/[0.08] bg-white/[0.05] text-[#8f8e85]")}>{submission.state === "submitted" ? <Check size={15} strokeWidth={3} /> : week.number}</div>
                  {feedbackReady ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D3FF02]/20 bg-[#D3FF02]/[0.06] px-2.5 py-1 text-[11px] font-semibold text-[#D3FF02]"><Headphones size={12} />Feedback ready</span>
                  ) : !future && <StatusPill state={submission.state} />}
                </div>
                <h3 className="mt-5 text-lg font-black tracking-[-0.03em] text-[#e9e6dd]">Week {week.number}</h3>
                <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/[0.07] pt-4">
                  <span className="text-xs font-semibold text-[#8f8e85]">{submission.ideas.length}/{week.requiredIdeas || "–"} ideas</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b5b2a9] transition group-hover:text-white">{feedbackReady ? "Listen to feedback" : "Open"} <ArrowRight size={14} /></span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

    </div>
  );
}
