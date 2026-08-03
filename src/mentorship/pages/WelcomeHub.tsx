import { ArrowRight, Check, Clock3, Play, Sparkles } from "lucide-react";
import robOnLaptop from "@/assets/rob-on-laptop.jpg";
import { usePortalStore } from "../PortalStore";
import { PrimaryButton, ProgressBar, SecondaryButton } from "../components/PortalUI";
import { cx } from "../utils";

export function WelcomeHub() {
  const { onboardingTasks, toggleOnboardingTask, setupVideos, welcomeVideoUrl, firstCall } = usePortalStore();
  const completeCount = onboardingTasks.filter((task) => task.complete).length;

  return (
    <div className="mx-auto max-w-[1320px] px-4 py-8 sm:px-7 lg:px-10 lg:py-10 xl:px-14">
      <section className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#151512]">
        <div className="absolute inset-0 lg:left-[54%]"><img src={robOnLaptop} alt="Rob Late working in his studio" className="h-full w-full object-cover opacity-55" /><div className="absolute inset-0 bg-gradient-to-r from-[#151512] via-[#151512]/85 to-[#151512]/15" /></div>
        <div className="relative z-10 max-w-[720px] px-5 py-10 sm:px-9 sm:py-14 lg:px-12 lg:py-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[11px] font-bold text-[#bbb8af]"><Sparkles size={13} /> Welcome to Rob Late's Producer Mentorship</div>
          <h1 className="mp-display mt-6 text-[49px] leading-[0.92] text-white sm:text-[64px]">LET'S GET YOU READY TO WORK.</h1>
          <p className="mt-5 max-w-xl text-[15px] leading-7 text-[#aaa99f]">Do these in order before the first group call. When we start, your sounds, template and references should already be out of the way.</p>
          {welcomeVideoUrl ? <a href={welcomeVideoUrl} target="_blank" rel="noreferrer" className="mp-focus-ring mt-7 inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-black text-[#11110f]"><span className="grid h-7 w-7 place-items-center rounded-full bg-[#171714] text-white"><Play size={13} fill="currentColor" /></span>Watch Rob's welcome</a> : <button type="button" disabled className="mt-7 inline-flex cursor-not-allowed items-center gap-3 rounded-full bg-white/70 px-5 py-3 text-sm font-black text-[#11110f]"><span className="grid h-7 w-7 place-items-center rounded-full bg-[#171714] text-white"><Play size={13} fill="currentColor" /></span>Watch Rob's welcome</button>}
        </div>
      </section>

      <section className="mt-7 grid gap-6 lg:grid-cols-[1fr_330px]">
        <div className="space-y-6">
          <div className="mp-card rounded-3xl p-5 sm:p-7">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div><div className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#77766f]">Do these first</div><h2 className="mp-display mt-2 text-[36px] leading-none text-[#efebe3]">YOUR STARTING CHECKLIST</h2></div>
              <div className="text-sm font-bold text-[#d6d3ca]">{completeCount} of {onboardingTasks.length} complete</div>
            </div>
            <div className="mt-4"><ProgressBar value={completeCount} max={onboardingTasks.length} /></div>
            <div className="mt-6 divide-y divide-white/[0.08]">
              {onboardingTasks.map((task, index) => (
                <div key={task.id} className="flex flex-col gap-4 py-5 first:pt-1 sm:flex-row sm:items-center">
                  <button type="button" onClick={() => toggleOnboardingTask(task.id)} className={cx("mp-focus-ring grid h-9 w-9 shrink-0 place-items-center rounded-full border text-sm font-black", task.complete ? "border-[#9be15d]/35 bg-[#9be15d]/12 text-[#b8ef87]" : "border-white/15 bg-white/[0.025] text-[#77766f]")} aria-label={`${task.complete ? "Mark incomplete" : "Mark complete"}: ${task.title}`}>{task.complete ? <Check size={16} strokeWidth={3} /> : index + 1}</button>
                  <div className="min-w-0 flex-1"><div className={cx("text-sm font-bold", task.complete ? "text-[#aaa99f] line-through decoration-white/20" : "text-[#ece9e0]")}>{task.title}</div><div className="mt-1 text-xs leading-5 text-[#77766f]">{task.description}</div></div>
                  {task.actionLabel && (task.actionUrl ? <a href={task.actionUrl} target={task.actionUrl.startsWith("#") ? undefined : "_blank"} rel={task.actionUrl.startsWith("#") ? undefined : "noreferrer"} className="mp-focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-[#f2efe6] transition hover:border-white/20 hover:bg-white/[0.07] sm:min-w-[150px]">{task.actionLabel}<ArrowRight size={14} /></a> : <SecondaryButton className="pointer-events-none opacity-45 sm:min-w-[150px]">{task.actionLabel}<ArrowRight size={14} /></SecondaryButton>)}
                </div>
              ))}
            </div>
          </div>

          <div id="setup-videos" className="scroll-mt-8">
            <div className="mb-4"><div className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#77766f]">Pre-work</div><h2 className="mp-display mt-1 text-[34px] leading-none text-[#ece9e0]">YOUR SETUP VIDEOS</h2></div>
            <div className="grid gap-3 sm:grid-cols-2">
              {setupVideos.map((video, index) => (
                <a href={video.url ?? undefined} target={video.url ? "_blank" : undefined} rel={video.url ? "noreferrer" : undefined} aria-disabled={!video.url} key={video.id} className={cx("group overflow-hidden rounded-2xl border border-white/[0.08] bg-[#141411] text-left transition", video.url ? "mp-focus-ring hover:border-white/15" : "cursor-not-allowed opacity-60")}>
                  <div className="relative aspect-[16/8.5] overflow-hidden bg-[#1b1b17]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(255,255,255,0.06),transparent_38%)]" />
                    <div className="absolute left-4 top-4 text-[11px] font-black tracking-[0.15em] text-white/25">{String(index + 1).padStart(2, "0")}</div>
                    <span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-[#11110f] transition group-hover:scale-105"><Play size={15} fill="currentColor" className="ml-0.5" /></span>
                    <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2 py-1 text-[10px] font-bold text-white/70">{video.duration}</span>
                  </div>
                  <div className="p-4"><div className="text-sm font-black text-[#e8e4dc]">{video.title}</div><div className="mt-1.5 text-xs leading-5 text-[#77766f]">{video.description}</div></div>
                </a>
              ))}
              {!setupVideos.length && <div className="col-span-full rounded-2xl border border-dashed border-white/10 p-6 text-sm text-[#77766f]">Rob's setup videos will appear here before your first call.</div>}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="mp-card rounded-3xl p-5">
            <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.05] text-[#aaa99f]"><Clock3 size={19} /></span><div><div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#77766f]">First live call</div><div className="text-sm font-bold text-[#e8e4dc]">{firstCall?.displayTime ?? "Date coming shortly"}</div></div></div>
            <div className="my-5 h-px bg-white/[0.08]" />
            <p className="text-xs leading-5 text-[#85847c]">Rob will explain the weekly system, the consistency prize and how tracks are chosen for surgery.</p>
            {firstCall?.calendarUrl ? <a href={firstCall.calendarUrl} target="_blank" rel="noreferrer" className="mp-focus-ring mt-5 inline-flex min-h-10 w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-[#f2efe6]">Add to calendar</a> : <SecondaryButton className="pointer-events-none mt-5 w-full opacity-45">Add to calendar</SecondaryButton>}
          </div>
        </aside>
      </section>
    </div>
  );
}
