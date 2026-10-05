import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import * as Accordion from "@radix-ui/react-accordion";
import { ArrowRight, Check, ChevronDown, Clock3, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { usePortalStore } from "../PortalStore";
import { completeSetupOutline, onboardingTaskCopy } from "../onboarding";
import { BookingCalendar } from "./BookingCalendar";
import { ProgressBar } from "./PortalUI";
import { GroupJoin } from "./GroupJoin";
import { cx } from "../utils";

export function OnboardingChecklist() {
  const { onboardingTasks, toggleOnboardingTask, setupVideos, firstCall } = usePortalStore();
  const location = useLocation();
  const [savingTask, setSavingTask] = useState<string>();
  const [expandedTask, setExpandedTask] = useState<string>();
  const [bookingOpen, setBookingOpen] = useState(false);
  const tasks = onboardingTasks.map(onboardingTaskCopy);
  const nextTask = tasks.find((task) => !task.complete && task.actionUrl) ?? tasks.find((task) => !task.complete);
  const completeCount = tasks.filter((task) => task.complete).length;
  const videos = completeSetupOutline(setupVideos);
  const readyVideos = videos.filter((video) => Boolean(video.url)).length;

  const linkedTaskId = onboardingTasks.find((item) => location.hash === `#onboarding-${item.id}`)?.id;
  // React to a new deep link, not completion updates to the same task.
  useEffect(() => {
    setExpandedTask(linkedTaskId);
    if (!linkedTaskId) return;
    const frame = requestAnimationFrame(() => document.getElementById(`onboarding-${linkedTaskId}`)?.scrollIntoView({ block: "start" }));
    return () => cancelAnimationFrame(frame);
  }, [linkedTaskId]);

  const toggle = async (id: string) => {
    setSavingTask(id);
    try {
      await toggleOnboardingTask(id);
      setExpandedTask(undefined);
      setBookingOpen(false);
    } catch (error) { toast.error(error instanceof Error ? error.message : "Your progress couldn't save. Please try again."); }
    finally { setSavingTask(undefined); }
  };

  return <section id="onboarding-steps" aria-labelledby="onboarding-title" className="mp-onboarding-panel min-w-0 scroll-mt-24 rounded-3xl border border-white/20 bg-[#191917] p-5 sm:p-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 id="onboarding-title" className="text-xl font-bold">Your onboarding</h2>
      <span className="rounded-full border border-white/20 px-2.5 py-1 text-xs font-semibold text-[#d4d0c5]" aria-live="polite">{completeCount} / {tasks.length} complete</span>
    </div>
    <p className="mb-4 mt-2 text-sm leading-6 text-[#b7b7ad]">Get ready for your first session. Work through each step and tick it off. Your progress is saved.</p>
    <ProgressBar value={completeCount} max={tasks.length || 1} />
    <Accordion.Root type="single" collapsible value={expandedTask ?? nextTask?.id ?? ""} onValueChange={(value) => { setExpandedTask(value); setBookingOpen(false); }} className="mt-5 space-y-2">
      {tasks.map((task, index) => {
        const key = task.key ?? task.id;
        const isBooking = key === "book-call";
        const isSetup = key === "prework";
        const canComplete = isSetup ? readyVideos === videos.length : Boolean(task.actionUrl);
        const isNext = task.id === nextTask?.id;
        const waiting = !task.complete && !task.actionUrl;
        const status = task.complete ? "Complete" : waiting ? key === "circle" ? "Awaiting invite" : key === "first-call" ? "Awaiting call details" : "Awaiting details" : isNext ? "Your next step" : "To do";
        const unavailableReason = isSetup
          ? readyVideos ? `${readyVideos} of ${videos.length} lessons available. You can start now and tick this off once all ${videos.length} lessons are available and completed.` : "Your setup videos will appear here when they're ready. You can review the lesson instructions now."
          : key === "circle" ? "Your group invite will appear here when it's ready."
          : key === "first-call" ? "Your calendar link will appear here once the call details are confirmed."
          : "The link for this step will appear here when it's ready.";

        return <Accordion.Item key={task.id} value={task.id} id={`onboarding-${task.id}`} className={cx("mp-onboarding-step scroll-mt-24 rounded-xl border", task.complete ? "border-white/10" : isNext ? "border-white/35" : "border-white/15")}>
          <Accordion.Header>
            <Accordion.Trigger className="mp-focus-ring group flex w-full items-center gap-3 rounded-xl p-3.5 text-left">
              <span className={cx("grid h-8 w-8 shrink-0 place-items-center rounded-full border text-xs font-bold", task.complete ? "border-white/15 bg-white/10" : "border-white/30")} aria-hidden="true">{task.complete ? <Check size={16} /> : `0${index + 1}`}</span>
              <span className="min-w-0 flex-1"><span className="block text-sm font-bold leading-5">{task.title}</span><span className={cx("mt-1 flex items-center gap-1.5 text-xs", isNext && !waiting ? "font-semibold text-white" : "text-[#aaa99f]")}>{waiting && <Clock3 size={12} aria-hidden="true" />}{status}</span></span>
              <ChevronDown size={17} className="shrink-0 text-[#aaa99f] transition group-data-[state=open]:rotate-180" aria-hidden="true" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="px-3.5 pb-4">
            <p className="border-t border-white/10 pt-3 text-sm leading-6 text-[#b7b7ad]">{task.description}</p>
            {key === "first-call" && <p className="mt-3 text-xs font-semibold text-[#d4d0c5]">{firstCall?.displayTime ?? "Your call date will appear here once confirmed."}</p>}
            {isBooking && task.actionUrl && <BookingCalendar url={task.actionUrl} open={bookingOpen} onToggle={() => setBookingOpen((value) => !value)} />}
            {key === "circle" && <GroupJoin url={task.actionUrl} />}
            {!isBooking && key !== "circle" && task.actionUrl && (isSetup ? <Link to={task.actionUrl} className="mp-focus-ring mt-4 inline-flex items-center gap-2 rounded-lg bg-[#D3FF02] px-4 py-3 text-sm font-bold text-black">{task.actionLabel}<ArrowRight size={16} /></Link> : <a href={task.actionUrl} target="_blank" rel="noreferrer" className="mp-focus-ring mt-4 inline-flex items-center gap-2 rounded-lg bg-[#D3FF02] px-4 py-3 text-sm font-bold text-black">{task.actionLabel}<ArrowRight size={16} /></a>)}
            {!canComplete && !task.complete && <p id={`onboarding-waiting-${task.id}`} className="mt-3 text-xs leading-5 text-[#aaa99f]">{unavailableReason}</p>}
            {(canComplete || task.complete) && <div className="mt-4 border-t border-white/10 pt-3">
              <label className={cx("inline-flex items-center gap-2.5 text-xs font-semibold text-[#d4d0c5]", savingTask ? "opacity-50" : "cursor-pointer")}>
                {savingTask === task.id ? <Loader2 size={16} className="animate-spin" aria-label="Saving progress" /> : <input type="checkbox" checked={task.complete} disabled={Boolean(savingTask)} onChange={() => void toggle(task.id)} className="mp-focus-ring h-4 w-4 accent-white" aria-label={`Mark ${task.title} ${task.complete ? "incomplete" : "complete"}`} />}
                {task.complete ? "Complete" : isBooking ? "I've booked my call" : "I've done this"}
              </label>
            </div>}
          </Accordion.Content>
        </Accordion.Item>;
      })}
    </Accordion.Root>
    {!tasks.length && <p className="mt-4 text-sm text-[#aaa99f]">Your personal onboarding steps will appear here when your enrolment is ready.</p>}
  </section>;
}
