import { Link } from "react-router-dom";
import * as Popover from "@radix-ui/react-popover";
import { ArrowRight, ChevronRight, Video, X } from "lucide-react";
import type { PortalCall, WeekDefinition, WeekSubmission } from "../types";
import { usePortalStore } from "../PortalStore";
import { usePortalClock } from "../usePortalClock";
import { callCalendarEvent, callEnd, countdown, deadlineCalendarEvent, localScheduleTime, nextScheduledCall, safeScheduleUrl, timestamp, weekTiming } from "../schedule";
import { CalendarActions } from "./CalendarActions";
import { CountdownDisplay, CallDateTile, TimeBar, SubmissionMilestones, TimingStatus } from "./DeadlineVisuals";
import { cx } from "../utils";


function CallDetails({ call, now }: { call: PortalCall; now: number }) {
  const event = callCalendarEvent(call);
  const joiningUrl = safeScheduleUrl(call.circleUrl);
  const started = Date.parse(call.startsAt) <= now;
  const live = started && callEnd(call) > now;
  return <>
    <div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-widest text-[#aaa99f]">Group call</p><h3 className="mt-2 text-lg font-bold">{call.title}</h3></div><Popover.Close className="mp-focus-ring rounded-lg p-1.5 text-[#aaa99f]" aria-label="Close call details"><X size={17} /></Popover.Close></div>
    <p className="mt-3 text-sm font-semibold">{localScheduleTime(call.startsAt)}</p>
    <p className="mt-1 text-xs text-[#aaa99f]">{live ? "In progress" : started ? "Call ended" : `Starts in ${countdown(Date.parse(call.startsAt), now)}`} · Times shown in your timezone</p>
    <div className="mt-5 flex flex-wrap gap-3">{event && <CalendarActions event={event} />}{joiningUrl && <a href={joiningUrl} target="_blank" rel="noreferrer" className="mp-focus-ring inline-flex items-center gap-2 rounded-lg bg-[#D3FF02] px-3 py-2.5 text-xs font-bold text-black"><Video size={15} />{live ? "Join call" : "Open joining link"}</a>}</div>
    {!joiningUrl && <p className="mt-4 text-xs leading-5 text-[#aaa99f]">The joining link will appear here when confirmed. You can save the date now.</p>}
  </>;
}

export function CallDetailsButton({ call, now, children, className }: { call: PortalCall; now: number; children: React.ReactNode; className?: string }) {
  return <Popover.Root><Popover.Trigger asChild><button type="button" className={cx("mp-focus-ring", className)}>{children}</button></Popover.Trigger><Popover.Portal><Popover.Content aria-label="Group call details" align="end" sideOffset={10} collisionPadding={16} className="mentorship-portal mp-calendar-menu z-[70] w-[360px] max-w-[calc(100vw-32px)] rounded-2xl border border-white/20 p-5 shadow-2xl"><CallDetails call={call} now={now} /></Popover.Content></Popover.Portal></Popover.Root>;
}

export function DeadlineStrip() {
  const { weeks, submissions, calls } = usePortalStore();
  const now = usePortalClock(1000);
  const current = weeks.find((week) => week.phase === "current");
  const nextWeek = weeks.find((week) => week.phase === "upcoming");
  const week = current ?? nextWeek;
  const submission = submissions.find((item) => item.weekNumber === week?.number);
  const timing = week ? weekTiming(week, submission, now) : undefined;
  const call = nextScheduledCall(calls, now);
  const urgent = timing?.state === "soon" || timing?.state === "overdue";
  const complete = timing?.state === "submitted";
  const feedback = timing?.state === "feedback";
  const to = week ? `/mentorship-portal/week/${week.number}${feedback ? "#feedback" : ""}` : "/mentorship-portal/dashboard";
  const callLive = call && Date.parse(call.startsAt) <= now;

  const target = timing?.state === "upcoming" ? timestamp(week?.opensAt) : timestamp(week?.deadlineAt);
  const running = Boolean(target && target > now);
  const countdownLabel = timing?.state === "upcoming" ? "Opens in" : "Time left";
  return <section aria-label="Your upcoming deadlines and calls" className="mp-deadline-strip">
    <div className="mp-deadline-strip-inner">
      <Link to={to} className={cx("mp-focus-ring mp-deadline-item mp-deadline-submission", urgent && "mp-deadline-urgent")}>
        <div className="min-w-0 flex-1">
          <div className="mp-strip-heading"><span className="mp-milestone-label">{week ? `Week ${week.number} submission` : "Weekly submissions"}</span><ChevronRight size={14} /></div>
          <div className="mp-strip-timer-row">{complete || feedback || timing?.state === "overdue" ? <TimingStatus state={timing?.state ?? ""} label={timing?.label ?? "Schedule to be confirmed"} /> : <><span className="mp-strip-status-label">{running && <i className="mp-live-dot" />}{target ? countdownLabel : "Dates to be confirmed"}</span><CountdownDisplay target={target} now={now} compact label={countdownLabel} /></>}</div>
          {!complete && !feedback && <TimeBar elapsed={timing?.elapsed} urgent={urgent} running={running && timing?.state !== "upcoming"} compact />}
          <div className="mp-strip-date">{complete || feedback ? timing?.detail : timestamp(week?.deadlineAt) !== undefined ? `Due ${localScheduleTime(week?.deadlineAt)}` : "Your countdown starts when dates are set"}</div>
        </div>
      </Link>
      {call ? <CallDetailsButton call={call} now={now} className="mp-deadline-item mp-deadline-call">
        <CallDateTile startsAt={call.startsAt} live={callLive} /><span className="min-w-0 flex-1 text-left"><span className="mp-strip-heading"><span className="mp-milestone-label">{callLive ? "Group call in progress" : "Next group call"}</span><ChevronRight size={14} /></span><span className="mp-strip-timer-row">{callLive ? <span className="mp-call-live-label"><i className="mp-live-dot" />Live now</span> : <><span className="mp-strip-status-label">Starts in</span><CountdownDisplay target={Date.parse(call.startsAt)} now={now} compact label="Call starts in" /></>}</span><span className="mp-strip-date">{localScheduleTime(call.startsAt)}</span></span>
      </CallDetailsButton> : <div className="mp-deadline-item mp-deadline-call"><CallDateTile /><div className="min-w-0 flex-1"><p className="mp-milestone-label">Next group call</p><div className="mp-strip-timer-row"><span className="mp-strip-status-label">Date to be confirmed</span><CountdownDisplay now={now} compact /></div></div></div>}
    </div>
  </section>;
}

export function WeekDeadlinePanel({ week, submission }: { week: WeekDefinition; submission: WeekSubmission }) {
  const { calls, user } = usePortalStore();
  const now = usePortalClock(1000);
  const timing = weekTiming(week, submission, now);
  const urgent = ["soon", "overdue"].includes(timing.state);
  const complete = timing.state === "submitted";
  const feedback = timing.state === "feedback";
  const event = deadlineCalendarEvent(week, user?.cohortId ?? "mentorship");
  const weekCalls = calls.filter((item) => Boolean(week.id) && item.weekId === week.id);
  const call = nextScheduledCall(weekCalls, now) ?? [...weekCalls].filter((item) => timestamp(item.startsAt) !== undefined).sort((a, b) => Date.parse(b.startsAt) - Date.parse(a.startsAt))[0];
  const partsReady = submission.ideas.length > 0 || submission.song || submission.stems;
  const action = feedback ? "Read feedback" : complete ? "View submitted files" : partsReady ? "Continue your submission" : "Start your submission";
  const target = feedback ? "feedback" : week.requiredIdeas > 0 ? "song-starters" : "weekly-song";
  const targetTime = timing.state === "upcoming" ? timestamp(week.opensAt) : timestamp(week.deadlineAt);
  const running = Boolean(targetTime && targetTime > now);
  const hasStatus = complete || feedback || timing.state === "overdue";
  return <section className={cx("mp-week-deadline mt-6", urgent && "mp-deadline-urgent")} aria-label={`Week ${week.number} schedule`}>
    <div className="flex flex-wrap items-start justify-between gap-5">
      <div className="min-w-0"><p className="mp-milestone-label">{complete || feedback ? `Week ${week.number} status` : timing.state === "upcoming" ? "Week opens in" : "Submission deadline"}</p>
        <div className="mt-3">{hasStatus ? <TimingStatus state={timing.state} label={timing.label} /> : <CountdownDisplay target={targetTime} now={now} label={timing.state === "upcoming" ? "Week opens in" : "Time until submission deadline"} />}</div>
        <p className="mt-3 text-xs text-[#c0cee2]">{targetTime ? timing.detail : "Dates to be confirmed"}{week.deadlineAt && !complete && !feedback ? " · Your timezone" : ""}</p>
      </div>
      <div className="flex flex-wrap gap-2">{event && !complete && !feedback && <CalendarActions event={event} />}<a href={`#${target}`} className={cx("mp-focus-ring inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold", complete ? "border border-white/20 text-white" : "bg-[#D3FF02] text-black")}>{action}<ArrowRight size={15} /></a></div>
    </div>
    {!complete && !feedback && <div className="mt-8"><TimeBar elapsed={timing.elapsed} urgent={urgent} running={running && timing.state !== "upcoming"} /></div>}
    <div className="mt-5 border-t border-white/15 pt-4"><p className="mp-milestone-label mb-3">Your submission progress</p><SubmissionMilestones week={week} submission={submission} /></div>
    {call && <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-4"><div className="flex items-center gap-3"><CallDateTile startsAt={call.startsAt} /><div><p className="text-xs font-bold">{call.title}</p><p className="mt-1 text-xs text-[#c0cee2]">{localScheduleTime(call.startsAt)}</p></div></div><CallDetailsButton call={call} now={now} className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold">Call details<ChevronRight size={14} /></CallDetailsButton></div>}
  </section>;
}
