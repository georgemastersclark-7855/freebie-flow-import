import { Link } from "react-router-dom";
import * as Popover from "@radix-ui/react-popover";
import { ArrowRight, CalendarDays, Check, ChevronRight, Clock3, Headphones, Video, X } from "lucide-react";
import type { PortalCall, WeekDefinition, WeekSubmission } from "../types";
import { usePortalStore } from "../PortalStore";
import { usePortalClock } from "../usePortalClock";
import { callCalendarEvent, callEnd, countdown, deadlineCalendarEvent, localScheduleTime, nextScheduledCall, safeScheduleUrl, timestamp, weekTiming } from "../schedule";
import { CalendarActions } from "./CalendarActions";
import { cx } from "../utils";

function TimeBar({ elapsed, urgent = false }: { elapsed: number; urgent?: boolean }) {
  return <div className={cx("mp-time-track", urgent && "mp-time-track-urgent")} role="progressbar" aria-label="Submission window elapsed" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(elapsed)} aria-valuetext={`${Math.round(elapsed)}% of the submission window has elapsed`}>
    <div className="mp-time-fill" style={{ width: `${elapsed}%` }}><span className="mp-time-fill-inner" /></div>
  </div>;
}

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
  const now = usePortalClock();
  const current = weeks.find((week) => week.phase === "current");
  const nextWeek = weeks.find((week) => week.phase === "upcoming");
  const week = current ?? nextWeek;
  const submission = submissions.find((item) => item.weekNumber === week?.number);
  const timing = week ? weekTiming(week, submission, now) : undefined;
  const call = nextScheduledCall(calls, now);
  const urgent = timing?.state === "soon" || timing?.state === "overdue";
  const complete = timing?.state === "submitted";
  const feedback = timing?.state === "feedback";
  const Icon = feedback ? Headphones : complete ? Check : Clock3;
  const to = week ? `/mentorship-portal/week/${week.number}${feedback ? "#feedback" : ""}` : "/mentorship-portal/dashboard";
  const callLive = call && Date.parse(call.startsAt) <= now;

  return <section aria-label="Your upcoming deadlines and calls" className="mp-deadline-strip">
    <div className="mp-deadline-strip-inner">
      <Link to={to} className={cx("mp-focus-ring mp-deadline-item mp-deadline-submission", urgent && "mp-deadline-urgent")}>
        <span className={cx("mp-milestone-icon", complete && "mp-milestone-complete")} key={timing?.state}><Icon size={18} aria-hidden="true" /></span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1"><span className="mp-milestone-label">{week ? `Week ${week.number} submission` : "Weekly submissions"}</span><span key={timing?.label} className="mp-clock-value">{timing?.label ?? "Schedule to be confirmed"}</span></div>
          {timing?.elapsed !== undefined && !complete && !feedback && <div className="mt-2"><TimeBar elapsed={timing.elapsed} urgent={urgent} /></div>}
          <div className="mt-1.5 flex items-center justify-between gap-3 text-[11px] text-[#aaa99f]"><span>{complete || feedback ? timing?.detail : timestamp(week?.deadlineAt) !== undefined ? `Due ${localScheduleTime(week?.deadlineAt)}` : timing?.state === "upcoming" ? timing.detail : "Dates will appear once confirmed"}</span><ChevronRight size={14} className="shrink-0" aria-hidden="true" /></div>
        </div>
      </Link>
      {call ? <CallDetailsButton call={call} now={now} className="mp-deadline-item mp-deadline-call">
        <span className="mp-milestone-icon"><CalendarDays size={18} aria-hidden="true" /></span><span className="min-w-0 flex-1 text-left"><span className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1"><span className="mp-milestone-label">{callLive ? "Group call in progress" : "Next group call"}</span><span className="mp-clock-value" key={callLive ? "live" : countdown(Date.parse(call.startsAt), now)}>{callLive ? "Now" : `In ${countdown(Date.parse(call.startsAt), now)}`}</span></span><span className="mt-1.5 flex items-center justify-between gap-3 text-[11px] text-[#aaa99f]"><span>{localScheduleTime(call.startsAt)}</span><ChevronRight size={14} className="shrink-0" /></span></span>
      </CallDetailsButton> : <div className="mp-deadline-item mp-deadline-call"><span className="mp-milestone-icon"><CalendarDays size={18} aria-hidden="true" /></span><div><p className="mp-milestone-label">Next group call</p><p className="mt-1 text-xs text-[#aaa99f]">Date to be confirmed</p></div></div>}
    </div>
  </section>;
}

export function WeekDeadlinePanel({ week, submission }: { week: WeekDefinition; submission: WeekSubmission }) {
  const { calls, user } = usePortalStore();
  const now = usePortalClock();
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
  return <section className={cx("mp-week-deadline mt-6", urgent && "mp-deadline-urgent")} aria-label={`Week ${week.number} schedule`}>
    <div className="flex flex-wrap items-start justify-between gap-5">
      <div><p className="mp-milestone-label">{complete || feedback ? `Week ${week.number} status` : "Submission deadline"}</p><p key={timing.state} className="mp-deadline-headline mt-2 flex items-center gap-2.5">{complete && <Check size={22} className="mp-milestone-complete" />}{feedback && <Headphones size={22} />}<span key={timing.label} className="mp-clock-value">{timing.label}</span></p><p className="mt-2 text-xs text-[#aaa99f]">{timing.detail}{week.deadlineAt && !complete && !feedback ? " · Your timezone" : ""}</p></div>
      <div className="flex flex-wrap gap-2">{event && !complete && !feedback && <CalendarActions event={event} />}<a href={`#${target}`} className={cx("mp-focus-ring inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold", complete ? "border border-white/20 text-white" : "bg-[#D3FF02] text-black")}>{action}<ArrowRight size={15} /></a></div>
    </div>
    {timing.elapsed !== undefined && !complete && !feedback && <div className="mt-5"><div className="mb-2 flex flex-wrap justify-between gap-2 text-[10px] font-semibold text-[#aaa99f]"><span>Submission window elapsed</span><span>Opened {localScheduleTime(week.opensAt)}</span></div><TimeBar elapsed={timing.elapsed} urgent={urgent} /></div>}
    {call && <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4"><div className="flex items-center gap-3"><CalendarDays size={17} className="text-[#aaa99f]" /><div><p className="text-xs font-bold">{call.title}</p><p className="mt-1 text-xs text-[#aaa99f]">{localScheduleTime(call.startsAt)}</p></div></div><CallDetailsButton call={call} now={now} className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold">Call details<ChevronRight size={14} /></CallDetailsButton></div>}
  </section>;
}
