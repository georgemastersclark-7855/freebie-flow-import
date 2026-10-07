import { Link } from "react-router-dom";
import * as Popover from "@radix-ui/react-popover";
import { CalendarDays, Check, ChevronRight, Clock3, Headphones, Video, X } from "lucide-react";
import type { PortalCall, WeekDefinition, WeekSubmission } from "../types";
import { usePortalStore } from "../PortalStore";
import { usePortalClock } from "../usePortalClock";
import { callCalendarEvent, callEnd, countdown, deadlineCalendarEvent, localScheduleTime, nextScheduledCall, safeScheduleUrl, timestamp, weekTiming } from "../schedule";
import { CalendarActions } from "./CalendarActions";
import { TimeBar, SubmissionMilestones } from "./DeadlineVisuals";
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

function ScheduleBadge({ text, urgent = false }: { text: string; urgent?: boolean }) {
  return <span className={cx("mp-schedule-badge", urgent && "is-urgent")} role="timer" aria-live="off">{text}</span>;
}

export function DeadlineStrip() {
  const { weeks, submissions, calls } = usePortalStore();
  const now = usePortalClock();
  const week = weeks.find((item) => item.phase === "current") ?? weeks.find((item) => item.phase === "upcoming");
  const submission = submissions.find((item) => item.weekNumber === week?.number);
  const timing = week ? weekTiming(week, submission, now) : undefined;
  const call = nextScheduledCall(calls, now);
  const feedback = timing?.state === "feedback";
  const submitted = timing?.state === "submitted";
  const urgent = timing?.state === "soon" || timing?.state === "overdue";
  const scheduled = timestamp(week?.deadlineAt) !== undefined || timestamp(week?.opensAt) !== undefined;
  const Icon = feedback ? Headphones : submitted ? Check : Clock3;
  const to = week ? `/mentorship-portal/week/${week.number}${feedback ? "#feedback" : ""}` : "/mentorship-portal/dashboard";
  const detail = feedback ? "Feedback ready" : submitted ? "Submitted" : scheduled ? timing?.state === "upcoming" ? localScheduleTime(week?.opensAt) : localScheduleTime(week?.deadlineAt) : "Date to be confirmed";
  const callLive = call && Date.parse(call.startsAt) <= now;

  return <section aria-label="Your upcoming deadlines and calls" className="mp-deadline-strip">
    <div className="mp-deadline-strip-inner">
      <Link to={to} className="mp-focus-ring mp-deadline-item">
        <Icon size={16} className="mp-schedule-icon" />
        <span className="mp-schedule-copy"><strong>{week ? `Week ${week.number} submission` : "Weekly submissions"}</strong><span>{detail}</span></span>
        {scheduled && !feedback && !submitted && timing && <ScheduleBadge text={timing.label} urgent={urgent} />}
        <ChevronRight size={14} className="mp-schedule-chevron" />
        {scheduled && !feedback && !submitted && timing?.state !== "upcoming" && <TimeBar elapsed={timing?.elapsed} urgent={urgent} />}
      </Link>
      {call ? <CallDetailsButton call={call} now={now} className="mp-deadline-item mp-deadline-call">
        <CalendarDays size={16} className="mp-schedule-icon" /><span className="mp-schedule-copy"><strong>{callLive ? "Group call in progress" : "Next group call"}</strong><span>{localScheduleTime(call.startsAt)}</span></span>
        <ScheduleBadge text={callLive ? "Live now" : `In ${countdown(Date.parse(call.startsAt), now)}`} /><ChevronRight size={14} className="mp-schedule-chevron" />
      </CallDetailsButton> : <div className="mp-deadline-item mp-deadline-call"><CalendarDays size={16} className="mp-schedule-icon" /><span className="mp-schedule-copy"><strong>Next group call</strong><span>Date to be confirmed</span></span></div>}
    </div>
  </section>;
}

export function WeekDeadlinePanel({ week, submission }: { week: WeekDefinition; submission: WeekSubmission }) {
  const { calls, user } = usePortalStore();
  const now = usePortalClock();
  const timing = weekTiming(week, submission, now);
  const urgent = ["soon", "overdue"].includes(timing.state);
  const finished = ["submitted", "feedback"].includes(timing.state);
  const event = deadlineCalendarEvent(week, user?.cohortId ?? "mentorship");
  const call = nextScheduledCall(calls.filter((item) => Boolean(week.id) && item.weekId === week.id), now);
  const scheduled = timestamp(week.deadlineAt) !== undefined;
  const total = week.requiredIdeas + Number(week.songRequired) + Number(week.stemsRequired);
  const uploaded = Math.min(submission.ideas.length, week.requiredIdeas) + Number(week.songRequired && Boolean(submission.song)) + Number(week.stemsRequired && Boolean(submission.stems));

  return <section className="mp-week-deadline mt-6" aria-label={`Week ${week.number} schedule`}>
    <div className="mp-submission-summary"><h2>Your submission</h2><span>{uploaded} of {total} files added</span></div>
    <SubmissionMilestones week={week} submission={submission} />
    {scheduled && !finished && <div className="mp-week-schedule-row"><span className="mp-week-schedule-date"><Clock3 size={15} />Due {localScheduleTime(week.deadlineAt)}</span><ScheduleBadge text={timing.label} urgent={urgent} />{event && <CalendarActions event={event} />}</div>}
    {call && <div className="mp-week-schedule-row"><span className="mp-week-schedule-date"><CalendarDays size={15} />{call.title} · {localScheduleTime(call.startsAt)}</span><CallDetailsButton call={call} now={now} className="mp-schedule-details">Call details<ChevronRight size={14} /></CallDetailsButton></div>}
  </section>;
}
