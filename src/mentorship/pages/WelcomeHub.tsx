import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Check, ChevronDown, Headphones, Library } from "lucide-react";
import robOnLaptop from "@/assets/rob-on-laptop.jpg";
import { usePortalStore } from "../PortalStore";
import { ProgressBar, StatusPill } from "../components/PortalUI";
import { PortalVideo } from "../components/PortalVideo";
import { OnboardingChecklist } from "../components/OnboardingChecklist";
import { onboardingTaskCopy } from "../onboarding";
import { submissionParts, weekOpeningLabel } from "../utils";

function LoopMethod() {
  const { weeks } = usePortalStore();
  const target = weeks.reduce((sum, week) => sum + week.requiredIdeas, 0);
  return <section aria-labelledby="loop-method-title" className="mt-8 rounded-3xl border border-white/10 bg-white/[0.02] p-5 sm:p-8">
    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#aaa99f]">How the mentorship works</p>
    <h2 id="loop-method-title" className="mp-display mp-lesson-title mt-3">ROB'S LOOP METHOD</h2>
    <p className="mt-4 max-w-3xl text-sm leading-7 text-[#b6b3a8]">I go into writing sessions with a folder full of song starters. We play through ideas until something connects, then build the song around it. Over these six weeks, you'll start building your own library and practise turning those sparks into songs.</p>
    <ol className="mt-7 grid gap-6 md:grid-cols-3">
      <li><div className="flex items-center gap-3 text-xs font-bold text-[#aaa99f]"><span>01 / WEEKS 1 TO 4</span><ArrowRight size={16} /></div><h3 className="mt-3 text-lg font-bold">Build your library</h3><p className="mt-2 text-sm leading-6 text-[#aaa99f]">Make five fresh song starters each week. A chord progression, a groove, a hook. These are short ideas with room for an artist or writer to bring something of their own.</p></li>
      <li><div className="flex items-center gap-3 text-xs font-bold text-[#aaa99f]"><span>02 / DEVELOP ONE EACH WEEK</span><ArrowRight size={16} /></div><h3 className="mt-3 text-lg font-bold">Hear the song's potential</h3><p className="mt-2 text-sm leading-6 text-[#aaa99f]">Choose one starter and produce it from the intro through the first chorus or drop. That's the point we often work to in sessions so the artist can decide what to take forward. Upload it with matching stems for my feedback.</p></li>
      <li><div className="text-xs font-bold text-[#aaa99f]">03 / WEEKS 5 AND 6</div><h3 className="mt-3 text-lg font-bold">Finish your strongest track</h3><p className="mt-2 text-sm leading-6 text-[#aaa99f]">At the end of week 4, choose the song you want to finish. Use the final two weeks to build it out and get it over the line, uploading your progress and updated stems. No new starters needed.</p></li>
    </ol>
    <div className="mt-7 grid gap-5 border-t border-white/10 pt-6 md:grid-cols-2">
      <div><h3 className="text-sm font-bold">The reps make it a habit</h3><p className="mt-2 text-xs leading-6 text-[#aaa99f]">Make ideas, develop one, get feedback and put it into practice. On our calls, we'll work through what came up that week and produce a selected track together. You'll see how I make decisions and take that into your next session.</p></div>
      <div><h3 className="text-sm font-bold">A library you can keep building</h3><p className="mt-2 text-xs leading-6 text-[#aaa99f]">{target ? `Your target is ${target} song starters alongside your finished track. ` : "You'll build a bank of song starters alongside your finished track. "}Take those ideas into collaborations or return to them for your own music. Your weekly loops appear automatically in your Song Starter Library.</p><Link to="/mentorship-portal/library" className="mp-focus-ring mt-3 inline-flex items-center gap-2 rounded text-xs font-bold text-white">Open your library<ArrowRight size={14} /></Link></div>
    </div>
  </section>;
}

export function WelcomeHub() {
  const { user, onboardingTasks, welcomeVideoUrl, weeks, submissions, nextCall } = usePortalStore();
  const completeCount = onboardingTasks.filter((task) => task.complete).length;
  const allComplete = onboardingTasks.length > 0 && completeCount === onboardingTasks.length;
  const currentWeek = weeks.find((week) => week.phase === "current");
  const submission = submissions.find((item) => item.weekNumber === currentWeek?.number);
  // Uploads and the cohort calendar must never hide unfinished onboarding.
  const inProgramme = allComplete;
  const nextTask = onboardingTasks.map(onboardingTaskCopy).find((task) => !task.complete);
  const feedback = submissions.filter((item) => item.feedback && !item.feedback.actionConfirmedAt && weeks.some((week) => week.number === item.weekNumber && week.phase !== "upcoming"));
  const starterCount = submissions.filter((item) => weeks.some((week) => week.number === item.weekNumber && week.phase !== "upcoming")).reduce((sum, item) => sum + item.ideas.length, 0);
  const starterTarget = weeks.reduce((sum, week) => sum + week.requiredIdeas, 0);
  const firstName = user?.name.trim().split(/\s+/)[0] || "producer";
  const submitted = submission && ["submitted", "late"].includes(submission.state);
  const parts = currentWeek && submission ? submissionParts(currentWeek, submission) : [];
  const nextPart = parts.find((part) => !part.complete);
  const weekUrl = currentWeek ? `/mentorship-portal/week/${currentWeek.number}` : "/mentorship-portal/submissions";
  const nextWeek = weeks.find((week) => week.phase === "upcoming");

  const welcome = <section className="overflow-hidden rounded-[28px] border border-white/10 bg-[#151512]">
    <div className="grid items-center lg:grid-cols-[0.8fr_1.2fr]">
      <div className="mp-welcome-copy min-w-0 p-6 sm:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#b6b3a8]">Watch this first</p>
        {inProgramme ? <h2 className="mp-display mp-welcome-title mt-4">LET'S GET<br />YOU STARTED.</h2> : <h1 className="mp-display mp-welcome-title mt-4">LET'S GET<br />YOU STARTED.</h1>}
        <p className="mt-5 max-w-md text-sm leading-6 text-[#b6b3a8]">Really glad to have you here, {firstName}. Start with my welcome video, read through how we'll work, then tick off your onboarding below. Let's get you ready for our first session.</p>
        <p className="mt-4 text-sm font-bold">Rob x</p>
      </div>
      <div className="min-w-0 p-5 pt-0 sm:p-7 sm:pt-0 lg:pl-0 lg:pt-7"><PortalVideo src={welcomeVideoUrl} poster={robOnLaptop} title="A welcome from Rob" description="Your introduction to the next six weeks, the Loop Method and getting ready for your first session." /></div>
    </div>
    {!inProgramme && <div className="flex flex-wrap items-center justify-between gap-5 border-t border-white/10 bg-white/[0.025] p-5 sm:px-9">
      <div className="w-full max-w-sm"><div className="mb-2 flex justify-between text-xs font-semibold text-[#c5c2b7]"><span>Your onboarding</span><span>{completeCount} / {onboardingTasks.length} complete</span></div><ProgressBar value={completeCount} max={onboardingTasks.length || 1} /></div>
      <div className="flex flex-wrap items-center gap-4">
        {nextTask && <div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#aaa99f]">Your next step</p><p className="mt-1 text-sm font-semibold">{nextTask.title}</p></div>}
        <a href={nextTask ? `#onboarding-${nextTask.id}` : "#onboarding-steps"} className="mp-focus-ring inline-flex items-center gap-2 rounded-xl bg-[#D3FF02] px-5 py-3 text-sm font-bold text-black">{completeCount ? "Continue onboarding" : "Start onboarding"}<ArrowRight size={16} /></a>
      </div>
    </div>}
  </section>;

  return <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-7 lg:px-10 lg:py-10 xl:px-12">
    <header className="mb-7 flex flex-wrap items-center justify-between gap-3">
      <div className="inline-flex min-w-0 max-w-full items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#b6b3a8]">
        <svg aria-hidden="true" focusable="false" className="h-4 w-4 shrink-0 fill-[#0095F6]" viewBox="0 0 22 22">
            <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
          </svg>
        <span className="[overflow-wrap:anywhere]">{inProgramme ? `${firstName}, your dashboard` : `${firstName}, your mentorship starts here`}</span>
      </div>
      <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-[#aaa99f]">{user?.cohortName} · {currentWeek ? `Week ${currentWeek.number} of 6` : "Six weeks with Rob"}</span>
    </header>

    {inProgramme ? <>
      <h1 className="mp-display">DASHBOARD</h1>
      <div className="mt-7 grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-4">
          {feedback.map((item) => <Link key={item.weekNumber} to={`/mentorship-portal/week/${item.weekNumber}#feedback`} className="mp-focus-ring flex items-center gap-4 rounded-2xl border border-white/20 bg-white/[0.05] p-5"><Headphones size={23} className="shrink-0" /><div className="flex-1"><h2 className="text-base font-bold">Feedback on week {item.weekNumber}</h2><p className="mt-1 text-xs text-[#aaa99f]">Read Rob's notes and confirm your next action.</p></div><ArrowRight size={18} /></Link>)}
          <section className="mp-card rounded-3xl p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3"><p className="text-xs font-bold uppercase tracking-widest text-[#aaa99f]">{currentWeek ? `Week ${currentWeek.number}` : "Weekly submissions"}</p>{submission && <StatusPill state={submission.state} />}</div>
            <h2 className="mt-4 text-2xl font-bold">{submitted ? "Your music is with Rob" : currentWeek ? currentWeek.number >= 5 ? "Finish your selected track" : "Your next set of ideas" : "Your first week opens soon"}</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[#aaa99f]">{submitted ? "Your files are saved. Pick up your feedback here when it's ready, and keep exploring your song starters." : currentWeek ? currentWeek.number >= 5 ? "Build out the song you chose in week 4. Upload the latest full-track version and its matching stems." : `Make ${currentWeek.requiredIdeas} song starters, develop one from the intro through the first chorus or drop, then send it with the matching stems.` : nextWeek ? weekOpeningLabel(nextWeek) : "Your weekly schedule will appear here when confirmed."}</p>
            {currentWeek && !submitted && <><p className="mt-4 text-xs font-semibold text-[#d4d0c5]">Due {currentWeek.deadlineLabel}</p><div className="mt-5"><ProgressBar value={parts.filter((part) => part.complete).length} max={parts.length || 1} /><p className="mt-2 text-xs text-[#aaa99f]">{parts.filter((part) => part.complete).length} / {parts.length} upload sections ready</p></div></>}
            {currentWeek && <Link to={`${weekUrl}${submitted ? "" : `#${nextPart?.id ?? "send-to-rob"}`}`} className="mp-focus-ring mt-6 inline-flex items-center gap-2 rounded-xl bg-[#D3FF02] px-5 py-3 text-sm font-bold text-black">{submitted ? "View my submission" : `Open week ${currentWeek.number}`}<ArrowRight size={16} /></Link>}
          </section>
        </div>
        <aside className="space-y-4">
          <section className="mp-card rounded-2xl p-5"><div className="flex items-center gap-2 text-xs font-bold text-[#b6b3a8]"><CalendarDays size={16} />Next group call</div><h2 className="mt-3 text-base font-bold">{nextCall?.title ?? "Your next session"}</h2><p className="mt-2 text-xs leading-6 text-[#aaa99f]">{nextCall?.displayTime ?? "The date and joining link will appear here once confirmed."}</p>{(nextCall?.circleUrl || nextCall?.calendarUrl) && <a href={nextCall.circleUrl ?? nextCall.calendarUrl} target="_blank" rel="noreferrer" className="mp-focus-ring mt-4 inline-flex items-center gap-2 rounded text-xs font-bold">{nextCall.circleUrl ? "Open call details" : "Add to calendar"}<ArrowRight size={14} /></a>}</section>
          <Link to="/mentorship-portal/library" className="mp-focus-ring mp-card block rounded-2xl p-5 transition hover:border-white/25"><div className="flex items-center gap-2 text-xs font-bold text-[#b6b3a8]"><Library size={16} />Song Starter Library</div><p className="mt-3 text-3xl font-bold">{starterCount}<span className="ml-2 text-sm font-normal text-[#aaa99f]">song starters</span></p><p className="mt-2 text-xs leading-6 text-[#aaa99f]">{starterTarget ? `${starterTarget}-starter target. ` : ""}Your ideas, ready to return to.</p><span className="mt-4 inline-flex items-center gap-2 text-xs font-bold">Open library<ArrowRight size={14} /></span></Link>
        </aside>
      </div>
      <details className="group mt-7 rounded-2xl border border-white/10 p-5"><summary className="mp-focus-ring flex cursor-pointer list-none items-center justify-between gap-3 rounded font-bold [&::-webkit-details-marker]:hidden"><span className="inline-flex items-center gap-2">{allComplete && <Check size={16} />}{allComplete ? "Onboarding complete" : `Finish onboarding (${completeCount}/${onboardingTasks.length})`}</span><ChevronDown size={17} className="transition group-open:rotate-180" /></summary><div className="mt-6"><OnboardingChecklist /></div></details>
      <details className="group mt-4 rounded-2xl border border-white/10 p-5"><summary className="mp-focus-ring flex cursor-pointer list-none items-center justify-between gap-3 rounded font-bold [&::-webkit-details-marker]:hidden">Welcome & how it works<ChevronDown size={17} className="transition group-open:rotate-180" /></summary><div className="mt-6">{welcome}<LoopMethod /></div></details>
    </> : <>{welcome}<LoopMethod /><div className="mt-8"><OnboardingChecklist /></div></>}
    <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 text-xs text-[#aaa99f]"><p>Need a hand with your access or setup?</p><a href="mailto:team@roblate.com" className="mp-focus-ring rounded font-semibold text-[#eeeae1]">team@roblate.com</a></footer>
  </div>;
}
