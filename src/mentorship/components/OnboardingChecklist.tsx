import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { usePortalStore } from "../PortalStore";
import { completeSetupOutline, onboardingTaskCopy } from "../onboarding";
import { BookingCalendar } from "./BookingCalendar";
import { cx } from "../utils";

export function OnboardingChecklist() {
  const { onboardingTasks, toggleOnboardingTask, setupVideos, firstCall } = usePortalStore();
  const [savingTask, setSavingTask] = useState<string>();
  const [bookingOpen, setBookingOpen] = useState(false);
  const tasks = onboardingTasks.map(onboardingTaskCopy);
  const nextTask = tasks.find((task) => !task.complete);
  const toggle = async (id: string) => {
    setSavingTask(id);
    try { await toggleOnboardingTask(id); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Your progress couldn't save. Please try again."); }
    finally { setSavingTask(undefined); }
  };
  return <section id="onboarding-steps" className="scroll-mt-24">
    <h2 className="text-2xl font-bold text-[#f2efe6]">Get ready for your first session</h2>
    <p className="mt-2 text-sm leading-6 text-[#aaa99f]">Your onboarding checklist. Work through the steps below and tick each one off as you go. Your progress is saved.</p>
    <div className="mt-5 grid items-start gap-4 md:grid-cols-2">
      {tasks.map((task, index) => {
        const key = task.key ?? task.id;
        const isBooking = key === "book-call";
        const isSetup = key === "prework";
        const canComplete = isSetup ? completeSetupOutline(setupVideos).every((video) => Boolean(video.url)) : Boolean(task.actionUrl);
        return <article key={task.id} id={`onboarding-${task.id}`} className={cx("mp-card scroll-mt-24 rounded-2xl p-5", task.id === nextTask?.id && "ring-1 ring-white/35", isBooking && bookingOpen && "md:col-span-2")}>
          {task.id === nextTask?.id && <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.14em] text-[#e9e5dc]">Your next step</p>}
          <div className="flex items-start gap-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/20 text-xs font-bold text-[#d4d0c5]">{task.complete ? <Check size={15} /> : `0${index + 1}`}</span>
            <div><h3 className="text-base font-bold text-[#eeeae1]">{task.title}</h3><p className="mt-2 text-sm leading-7 text-[#b7b7ad]">{task.description}</p></div>
          </div>
          {key === "first-call" && <p className="mt-4 text-xs font-semibold text-[#d4d0c5]">{firstCall?.displayTime ?? "Your call date will appear here once confirmed."}</p>}
          {isBooking && task.actionUrl && <BookingCalendar url={task.actionUrl} open={bookingOpen} onToggle={() => setBookingOpen((value) => !value)} />}
          {!isBooking && task.actionUrl && (isSetup ? <Link to={task.actionUrl} className="mp-focus-ring mt-4 inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2.5 text-xs font-bold text-white">{task.actionLabel}<ArrowRight size={14} /></Link> : <a href={task.actionUrl} target="_blank" rel="noreferrer" className="mp-focus-ring mt-4 inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2.5 text-xs font-bold text-white">{task.actionLabel}<ArrowRight size={14} /></a>)}
          <div className="mt-4 border-t border-white/10 pt-4">
            <label className={cx("inline-flex items-center gap-2.5 text-xs font-semibold text-[#d4d0c5]", (!canComplete && !task.complete) || savingTask ? "opacity-50" : "cursor-pointer")}>
              {savingTask === task.id ? <Loader2 size={16} className="animate-spin" /> : <input type="checkbox" checked={task.complete} disabled={Boolean(savingTask) || (!canComplete && !task.complete)} onChange={() => void toggle(task.id)} className="mp-focus-ring h-4 w-4 accent-white" aria-label={`Mark ${task.title} ${task.complete ? "incomplete" : "complete"}`} />}
              {task.complete ? "Done" : isBooking ? "I've booked my call" : "I've done this"}
            </label>
          </div>
        </article>;
      })}
    </div>
    {!tasks.length && <p className="mt-4 text-sm text-[#aaa99f]">Your personal onboarding steps will appear here when your enrolment is ready.</p>}
  </section>;
}
