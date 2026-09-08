import { ArrowRight, Check, ChevronDown, Clock3, Headphones, LockKeyhole } from "lucide-react";
import { Link } from "react-router-dom";
import { usePortalStore } from "../PortalStore";
import { ProgressBar, StatusPill } from "../components/PortalUI";
import { cx, submissionParts } from "../utils";

export function StudentDashboard() {
  const { weeks, submissions } = usePortalStore();
  const currentWeek = weeks.find((week) => week.phase === "current") ?? weeks.find((week) => week.phase === "upcoming") ?? weeks[weeks.length - 1];
  const currentSubmission = submissions.find((submission) => submission.weekNumber === currentWeek?.number);
  const pendingFeedback = submissions.filter((submission) => submission.feedback && !submission.feedback.actionConfirmedAt);

  if (!currentWeek || !currentSubmission) return <div className="p-8 text-sm text-[#aaa99f]">Your weekly workspace is being prepared. <Link to="/mentorship-demo/welcome" className="underline">Go to your setup steps</Link>.</div>;

  const parts = submissionParts(currentWeek, currentSubmission);
  const requiredFiles = currentWeek.requiredIdeas + Number(currentWeek.songRequired) + Number(currentWeek.stemsRequired);
  const addedFiles = Math.min(currentSubmission.ideas.length, currentWeek.requiredIdeas) + Number(currentWeek.songRequired && Boolean(currentSubmission.song)) + Number(currentWeek.stemsRequired && Boolean(currentSubmission.stems));
  const nextPart = parts.find((part) => !part.complete);
  const submitted = currentSubmission.state === "submitted" || currentSubmission.state === "late";
  const upcoming = currentWeek.phase === "upcoming";
  const weekUrl = `/mentorship-demo/week/${currentWeek.number}`;
  const previousWeeks = weeks.filter((week) => week.number !== currentWeek.number && week.phase !== "upcoming");
  const upcomingWeeks = weeks.filter((week) => week.number !== currentWeek.number && week.phase === "upcoming");
  const hasFiles = currentSubmission.ideas.length > 0 || Boolean(currentSubmission.song || currentSubmission.stems);
  const action = upcoming ? "Preview this week" : submitted ? (currentSubmission.feedback ? "Open Rob's feedback" : "View what I sent") : nextPart ? `${hasFiles ? "Continue" : "Start"} week ${currentWeek.number}` : "Review & send to Rob";
  const destination = `${weekUrl}${upcoming ? "" : submitted ? (currentSubmission.feedback ? "#feedback" : "") : `#${nextPart?.id ?? "send-to-rob"}`}`;

  return (
    <div className="mx-auto max-w-[1320px] px-4 py-8 sm:px-7 lg:px-10 lg:py-10 xl:px-14">
      <header className="max-w-2xl">
        <h1 className="mp-display text-[#f2efe6]">YOUR WEEKLY WORK</h1>
        <p className="mt-4 text-sm leading-6 text-[#aaa99f]">Your music goes here. Upload each week's work, send it to Rob, then come back for your feedback.</p>
      </header>

      <section aria-labelledby="current-week-title" className="mp-card mt-8 overflow-hidden rounded-3xl">
        <div className="p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#b6b3a8]">{upcoming ? "Coming up" : currentWeek.phase === "current" ? "This week" : "Latest week"} / Week {currentWeek.number}</p>
            <StatusPill state={currentSubmission.state} />
          </div>
          <h2 id="current-week-title" className="mt-4 text-2xl font-bold tracking-tight text-[#f2efe6] sm:text-3xl">{upcoming ? `Week ${currentWeek.number} opens soon` : submitted ? (currentSubmission.feedback ? "Rob's feedback is ready" : "Your music is with Rob") : nextPart ? `Let's get week ${currentWeek.number} uploaded` : "Everything's added. Ready to send?"}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#aaa99f]">{upcoming ? "You can look through the brief now. Uploads open when this week begins." : submitted ? (currentSubmission.feedback ? "Open your feedback and decide what you'll put into practice next." : "You're done for this week. Your feedback will appear here when Rob has reviewed your song.") : currentWeek.number < 5 ? "Add your song starters, the one you've developed into your weekly song, and its matching stems." : "Keep working on your selected track. Add your latest full-track version and its matching stems."}</p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#b6b3a8]">
            <span>This week's focus: <strong className="font-semibold text-[#e9e5dc]">{currentWeek.title}</strong></span>
            {!submitted && <span className="inline-flex items-center gap-1.5"><Clock3 size={13} />Due {currentWeek.deadlineLabel}</span>}
          </div>

          <div className={cx("mt-6 grid gap-3", parts.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2")}>
            {parts.map((part, index) => (
              <Link key={part.id} to={`${weekUrl}#${part.id}`} className="mp-focus-ring group flex flex-col rounded-2xl border border-white/10 bg-black/15 p-4 transition hover:border-white/25 hover:bg-white/[0.025]">
                <div className="flex items-center justify-between gap-3"><span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#939187]">{String(index + 1).padStart(2, "0")} / {part.format}</span>{part.complete && <Check size={15} className="shrink-0 text-white" />}</div>
                <h3 className="mt-3 text-sm font-bold text-[#eeeae1]">{part.title}</h3>
                <p className="mt-2 flex-1 text-xs leading-5 text-[#aaa99f]">{part.description}</p>
                <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/[0.08] pt-3 text-xs font-semibold text-[#d4d0c5]"><span>{upcoming ? "Opens soon" : submitted ? "View files" : part.status}</span><ArrowRight size={14} className="shrink-0 transition group-hover:translate-x-0.5" /></div>
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 border-t border-white/10 bg-white/[0.025] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div className="max-w-sm flex-1">
            {submitted ? <p className="flex items-center gap-2 text-sm font-semibold text-[#d4d0c5]"><Check size={16} />Week {currentWeek.number} sent to Rob</p> : upcoming ? <p className="flex items-center gap-2 text-sm text-[#aaa99f]"><LockKeyhole size={15} />Uploads open in week {currentWeek.number}</p> : <><div className="mb-2 flex justify-between gap-4 text-xs font-semibold text-[#d4d0c5]"><span>{nextPart ? `Next: ${nextPart.title.toLowerCase()}` : "Ready for your final check"}</span><span>{addedFiles} / {requiredFiles} files added</span></div><ProgressBar value={addedFiles} max={requiredFiles || 1} /><p className="mt-2 text-[11px] leading-5 text-[#939187]">Uploads save as you go. Send to Rob when you're ready.</p></>}
          </div>
          <Link to={destination} className="mp-focus-ring inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#D3FF02] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#b8e000]">{action}<ArrowRight size={16} /></Link>
        </div>
      </section>

      {pendingFeedback.filter((item) => item.weekNumber !== currentWeek.number).map((item) => <Link key={item.weekNumber} to={`/mentorship-demo/week/${item.weekNumber}#feedback`} className="mp-focus-ring mt-5 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.035] p-4 transition hover:border-white/25"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/[0.06] text-white"><Headphones size={17} /></span><div className="min-w-0 flex-1"><p className="text-sm font-bold text-[#eeeae1]">Rob's feedback on week {item.weekNumber}</p><p className="mt-1 text-xs text-[#aaa99f]">Your next action is waiting.</p></div><span className="flex items-center gap-2 text-xs font-semibold text-[#eeeae1]"><span className="hidden sm:inline">Open feedback</span><ArrowRight size={15} /></span></Link>)}

      {previousWeeks.length > 0 && <section className="mt-8"><h2 className="mb-4 text-lg font-bold text-[#eeeae1]">Earlier weeks</h2><div className="overflow-hidden rounded-2xl border border-white/10 divide-y divide-white/[0.08]">{previousWeeks.map((week) => {
        const item = submissions.find((submission) => submission.weekNumber === week.number);
        if (!item) return null;
        return <Link key={week.number} to={`/mentorship-demo/week/${week.number}`} className="mp-focus-ring flex items-center gap-4 bg-white/[0.015] px-4 py-4 transition hover:bg-white/[0.04]"><span className="text-xs font-bold text-[#939187]">{String(week.number).padStart(2, "0")}</span><div className="min-w-0 flex-1"><p className="text-sm font-bold text-[#e9e5dc]">Week {week.number}: {week.title}</p><p className="mt-1 text-xs text-[#939187]">{item.feedback ? "Your files and Rob's feedback" : item.submittedAt ? "Sent to Rob. Awaiting feedback." : "Your saved uploads"}</p></div><ArrowRight size={15} className="shrink-0 text-[#b6b3a8]" /></Link>;
      })}</div></section>}

      {upcomingWeeks.length > 0 && <details className="group mt-6 rounded-2xl border border-white/10 bg-white/[0.015]"><summary className="mp-focus-ring flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl p-4 text-sm font-semibold text-[#b6b3a8] [&::-webkit-details-marker]:hidden"><span className="inline-flex items-center gap-2"><LockKeyhole size={15} />Coming up: weeks {upcomingWeeks.map((week) => week.number).join(", ")}</span><ChevronDown size={16} className="shrink-0 transition group-open:rotate-180" /></summary><div className="border-t border-white/10">{upcomingWeeks.map((week) => <Link key={week.number} to={`/mentorship-demo/week/${week.number}`} className="mp-focus-ring flex items-center justify-between gap-3 px-4 py-3 text-xs text-[#aaa99f] hover:bg-white/[0.035]"><span>Week {week.number}: {week.title}</span><span className="inline-flex items-center gap-2 text-[#d4d0c5]">Preview<ArrowRight size={13} /></span></Link>)}</div></details>}
    </div>
  );
}
