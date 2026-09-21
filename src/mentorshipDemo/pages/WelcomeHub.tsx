import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Clock3, Loader2, Play } from "lucide-react";
import { toast } from "sonner";
import robOnLaptop from "@/assets/rob-on-laptop.jpg";
import { usePortalStore } from "../PortalStore";
import { ProgressBar } from "../components/PortalUI";
import { BookingCalendar } from "../components/BookingCalendar";
import { PortalVideo } from "../components/PortalVideo";
import { completeSetupOutline, onboardingTaskCopy } from "../onboarding";
import { setupLessonPath, setupLessonThumbnails } from "../setupLessons";
import type { SetupVideo } from "../types";
import { cx } from "../utils";

function SetupVideoCard({ video, index }: { video: SetupVideo; index: number }) {
  const thumbnail = setupLessonThumbnails[video.key ?? video.id];
  return (
    <Link to={setupLessonPath(video.key ?? video.id)} aria-label={`Open lesson: ${video.title}`} className="mp-focus-ring block overflow-hidden rounded-2xl border border-white/[0.08] bg-black/20 transition hover:border-white/20">
        <div className="relative flex aspect-video flex-col items-center justify-center gap-3 overflow-hidden bg-[#1b1b17] px-5 text-center">
          {thumbnail && <img src={thumbnail} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
          <span className="relative grid h-12 w-12 place-items-center rounded-full border border-white/30 bg-black/45 text-white shadow-lg backdrop-blur-sm"><Play size={20} className="ml-0.5" fill="currentColor" /></span>
          <p className="relative text-xs font-semibold leading-5 text-white">Watch lesson</p>
        </div>
      <div className="p-4">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.12em] text-[#939187]"><span>Setup {index + 1}</span>{video.url && video.duration && <span>{video.duration}</span>}</div>
        <h4 className="mt-2 text-sm font-bold text-[#eeeae1]">{video.title}</h4>
        <p className="mt-2 text-xs leading-5 text-[#aaa99f]">{video.description}</p>
      </div>
    </Link>
  );
}

export function WelcomeHub() {
  const { user, onboardingTasks, toggleOnboardingTask, setupVideos, welcomeVideoUrl, firstCall } = usePortalStore();
  const [savingTask, setSavingTask] = useState<string>();
  const [bookingOpen, setBookingOpen] = useState(false);
  const tasks = onboardingTasks.map(onboardingTaskCopy);
  const videos = completeSetupOutline(setupVideos);
  const completeCount = tasks.filter((task) => task.complete).length;
  const allComplete = tasks.length > 0 && completeCount === tasks.length;
  const nextTask = tasks.find((task) => !task.complete && task.actionUrl);
  const nextIsBooking = nextTask && (nextTask.key ?? nextTask.id) === "book-call";
  const firstName = user?.name.trim().split(/\s+/)[0] || "producer";

  const toggleTask = async (id: string) => {
    if (savingTask) return;
    setSavingTask(id);
    try {
      await toggleOnboardingTask(id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Your progress couldn't save. Please try again.");
    } finally {
      setSavingTask(undefined);
    }
  };

  const openBooking = () => {
    setBookingOpen(true);
    if (nextTask) document.getElementById(`onboarding-${nextTask.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-7 lg:px-10 lg:py-10 xl:px-12">
      <header className="mb-7 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex min-w-0 max-w-full items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#b6b3a8]">
          <svg aria-hidden="true" focusable="false" className="h-4 w-4 shrink-0 fill-[#0095F6]" viewBox="0 0 22 22">
            <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
          </svg>
          <span className="[overflow-wrap:anywhere]">{firstName}, your mentorship starts here</span>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-[#aaa99f]">{user?.cohortName} · Six weeks with Rob</span>
      </header>

      <section className="overflow-hidden rounded-[28px] border border-white/10 bg-[#151512]">
        <div className="grid items-center lg:grid-cols-[0.85fr_1.15fr]">
          <div className="mp-welcome-copy flex min-w-0 flex-col justify-center p-6 sm:p-9">
            <p className="text-sm font-semibold text-[#f2efe6]">You're in, {firstName}.</p>
            <h1 className="mp-display mp-welcome-title mt-4 text-[#f2efe6]">LET'S GET<br />YOU STARTED.</h1>
            <p className="mt-5 max-w-md text-sm leading-6 text-[#b6b3a8]">Really glad to have you here. Watch my welcome, get your call booked in and work through the steps below. You'll have everything ready to start making music.</p>
            <p className="mt-4 text-sm font-bold text-[#f2efe6]">Rob x</p>
          </div>
          <div className="min-w-0 p-5 pt-0 sm:p-7 sm:pt-0 lg:pl-0 lg:pt-7">
            <PortalVideo src={welcomeVideoUrl} poster={robOnLaptop} title="A welcome from Rob" description="Start here. I'll walk you through the next six weeks and help you get set up for your first session." />
          </div>
        </div>
        <div className="flex flex-col gap-4 border-t border-white/[0.08] bg-white/[0.025] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-9">
          <div className="max-w-sm flex-1"><div aria-live="polite" className="mb-2 flex justify-between gap-5 text-xs font-semibold text-[#c5c2b7]"><span>{allComplete ? "You're ready to go" : "Your setup progress"}</span><span>{completeCount} / {tasks.length} steps</span></div><ProgressBar value={completeCount} max={tasks.length || 1} /></div>
          {allComplete ? <Link to="/mentorship-demo/submissions" className="mp-focus-ring inline-flex items-center justify-center gap-2 rounded-xl bg-[#D3FF02] px-5 py-3 text-sm font-bold text-black">Go to my submissions <ArrowRight size={16} /></Link> : nextIsBooking ? <button type="button" onClick={openBooking} className="mp-focus-ring inline-flex items-center justify-center gap-2 rounded-xl bg-[#D3FF02] px-5 py-3 text-sm font-bold text-black">Book my onboarding <ArrowRight size={16} /></button> : nextTask ? <a href={`#onboarding-${nextTask.id}`} className="mp-focus-ring inline-flex items-center justify-center gap-2 rounded-xl bg-[#D3FF02] px-5 py-3 text-sm font-bold text-black">{nextTask.actionLabel} <ArrowRight size={16} /></a> : <a href="#onboarding-steps" className="mp-focus-ring inline-flex items-center gap-2 text-sm font-semibold text-[#f2efe6]">Explore your next steps <ArrowRight size={16} /></a>}
        </div>
      </section>

      <div className="mt-8 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
        <section id="onboarding-steps" className="min-w-0 scroll-mt-24">
          <div className="mb-5"><h2 className="text-xl font-bold text-[#f2efe6]">Here's what to do next</h2><p className="mt-2 text-sm leading-6 text-[#aaa99f]">Work through these in order and tick each step when you've done it. Your progress is saved, so you can come back to it.</p></div>
          <div className="space-y-4">
            {tasks.map((task, index) => {
              const prework = (task.key ?? task.id) === "prework";
              const isFirstCall = (task.key ?? task.id) === "first-call";
              const isBooking = (task.key ?? task.id) === "book-call";
              const canComplete = prework ? videos.every((video) => Boolean(video.url)) : Boolean(task.actionUrl);
              return (
                <article id={`onboarding-${task.id}`} key={task.id} className={cx("mp-card scroll-mt-24 rounded-3xl p-5 sm:p-6", task.complete && "border-white/20")}>
                  <div className="flex items-start gap-4">
                    <span className={cx("grid h-9 w-9 shrink-0 place-items-center rounded-full border text-sm font-bold", task.complete ? "border-white/25 bg-white/10 text-[#f2efe6]" : "border-white/15 text-[#b6b3a8]")}>{task.complete ? <Check size={16} /> : String(index + 1).padStart(2, "0")}</span>
                    <div className="min-w-0"><h3 className="text-lg font-bold text-[#eeebe2]">{task.title}</h3><p className="mt-2 text-sm leading-6 text-[#aaa99f]">{task.description}</p></div>
                  </div>
                  {isFirstCall && <p className="mt-4 rounded-xl bg-white/[0.035] p-3 text-sm font-semibold text-[#d4d0c5]">{firstCall?.displayTime ?? "Your first call date will appear here once confirmed."}</p>}
                  {isBooking && task.actionUrl && <BookingCalendar url={task.actionUrl} open={bookingOpen} onToggle={() => setBookingOpen((value) => !value)} />}
                  {prework && <div id="setup-videos" className="mt-5 grid scroll-mt-24 gap-3 sm:grid-cols-2">{videos.map((video, videoIndex) => <SetupVideoCard key={video.id} video={video} index={videoIndex} />)}</div>}
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] pt-4">
                    {!prework && !isBooking && (task.actionUrl ? <a href={task.actionUrl} target={task.actionUrl.startsWith("#") ? undefined : "_blank"} rel={task.actionUrl.startsWith("#") ? undefined : "noreferrer"} className="mp-focus-ring inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-[#f2efe6]">{task.actionLabel}<ArrowRight size={14} /></a> : <span className="text-xs leading-5 text-[#aaa99f]">{isFirstCall ? "Calendar invite coming soon." : "Your link will appear here shortly."} You can work on your setup in the meantime.</span>)}
                    {prework && <p className="max-w-xs text-xs leading-5 text-[#aaa99f]">Tick this once you've watched the lessons and put your setup together.</p>}
                    <label className={cx("inline-flex items-center gap-2.5 text-xs font-semibold text-[#d4d0c5]", (!canComplete && !task.complete) || savingTask ? "cursor-not-allowed opacity-50" : "cursor-pointer")}>
                      {savingTask === task.id ? <Loader2 size={16} className="animate-spin" /> : <input type="checkbox" checked={task.complete} disabled={Boolean(savingTask) || (!canComplete && !task.complete)} onChange={() => void toggleTask(task.id)} className="mp-focus-ring h-4 w-4 accent-white" aria-label={`Mark ${task.title} ${task.complete ? "incomplete" : "complete"}`} />}
                      {task.complete ? "Done" : isBooking ? "I've booked my call" : "I've done this"}
                    </label>
                  </div>
                </article>
              );
            })}
            {!tasks.length && <div className="mp-card rounded-2xl p-6 text-sm leading-6 text-[#aaa99f]">Your personal setup steps are being prepared. You can explore the weekly plan, or email us below if you need a hand.</div>}
          </div>
          <Link to="/mentorship-demo/submissions" className="mp-focus-ring mt-6 inline-flex items-center gap-2 rounded-lg py-2 text-sm font-semibold text-[#b6b3a8]">Take a look at my submissions <ArrowRight size={15} /></Link>
        </section>

        <aside className="space-y-4 xl:sticky xl:top-6">
          <section className="mp-card rounded-3xl p-5">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#aaa99f]"><Clock3 size={14} /> Your six weeks</div>
            <h2 aria-label="Loops to songs to finished track" className="mp-display mp-programme-title mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[#f2efe6]">
              <span className="inline-flex items-center gap-3">LOOPS <ArrowRight aria-hidden="true" className="h-[1em] w-[1em] shrink-0" /></span>
              <span className="inline-flex items-center gap-3">SONGS <ArrowRight aria-hidden="true" className="h-[1em] w-[1em] shrink-0" /></span>
              <span>FINISHED TRACK</span>
            </h2>
            <ol className="mt-6 space-y-5">
              <li><p className="text-xs font-bold text-[#f2efe6]">01 / Make your song starters</p><p className="mt-2 text-xs leading-5 text-[#aaa99f]">Build a bank of loops, like the ideas I take into writing sessions. A groove, a chord idea, a hook. Give yourself a few directions to try.</p></li>
              <li><p className="text-xs font-bold text-[#f2efe6]">02 / Develop one each week</p><p className="mt-2 text-xs leading-5 text-[#aaa99f]">Choose one loop and produce it from the intro through the end of the first chorus or drop. This is your weekly song. Upload it with its stems for my feedback.</p></li>
              <li><p className="text-xs font-bold text-[#f2efe6]">03 / Finish your strongest track</p><p className="mt-2 text-xs leading-5 text-[#aaa99f]">In weeks 5 and 6, build out the track you selected in week 4. Keep uploading your progress and updated stems. No new loops or weekly songs at this point.</p></li>
            </ol>
          </section>
          <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-5"><h2 className="text-sm font-bold text-[#e9e5dc]">Need a hand?</h2><p className="mt-2 text-xs leading-5 text-[#aaa99f]">If you get stuck with access, booking or your setup, drop us a line and we'll help you get sorted.</p><a href="mailto:team@roblate.com" className="mp-focus-ring mt-4 inline-block rounded text-sm font-semibold text-[#f2efe6]">team@roblate.com</a></section>
        </aside>
      </div>
    </div>
  );
}
