import { Check, Flag, Headphones } from "lucide-react";
import type { WeekDefinition, WeekSubmission } from "../types";
import { countdownParts, timestamp } from "../schedule";
import { cx } from "../utils";

export function CountdownDisplay({ target, now, compact = false, label = "Time remaining" }: { target?: number; now: number; compact?: boolean; label?: string }) {
  const parts = countdownParts(target, now);
  const values = parts ? [parts.days, parts.hours, parts.minutes, parts.seconds] : undefined;
  return <span className={cx("mp-countdown", compact && "mp-countdown-compact", !parts && "mp-countdown-unset")} role="timer" aria-live="off" aria-label={parts ? `${label}: ${parts.days} days, ${parts.hours} hours, ${parts.minutes} minutes, ${parts.seconds} seconds` : "Schedule not confirmed"}>
    {["Days", "Hrs", "Min", "Sec"].map((unit, index) => <span className="mp-countdown-unit" key={unit} aria-hidden="true"><span className="mp-countdown-number"><span key={values?.[index] ?? "unset"}>{values ? String(values[index]).padStart(2, "0") : "--"}</span></span><span className="mp-countdown-unit-label">{unit}</span></span>)}
  </span>;
}

export function TimeBar({ elapsed, urgent = false, running = false, compact = false }: { elapsed?: number; urgent?: boolean; running?: boolean; compact?: boolean }) {
  const value = elapsed === undefined ? undefined : Math.max(0, Math.min(100, elapsed));
  return <div className={cx("mp-timeline", urgent && "mp-timeline-urgent", running && "mp-timeline-running", compact && "mp-timeline-compact", value === undefined && "mp-timeline-unset")}>
    <div className="mp-timeline-rail" role={value === undefined ? undefined : "progressbar"} aria-label={value === undefined ? "Submission dates not confirmed" : "Submission window elapsed"} aria-valuemin={value === undefined ? undefined : 0} aria-valuemax={value === undefined ? undefined : 100} aria-valuenow={value === undefined ? undefined : Math.round(value)} aria-valuetext={value === undefined ? undefined : `${Math.round(value)}% of the submission window has elapsed`}>
      <span className="mp-timeline-fill" style={{ width: `${value ?? 0}%` }}><span /></span>
      <span className="mp-timeline-ticks" aria-hidden="true">{[0, 1, 2, 3, 4].map((tick) => <i key={tick} />)}</span>
      {value !== undefined && <span className="mp-timeline-marker" style={{ left: `${value}%` }} aria-hidden="true"><i />{!compact && running && <span>Now</span>}</span>}
    </div>
    {!compact && <div className="mp-timeline-endpoints" aria-hidden="true"><span><span className="mp-timeline-start-dot" />Opens</span><span><Flag size={12} />Deadline</span></div>}
  </div>;
}

export function CallDateTile({ startsAt, live = false }: { startsAt?: string; live?: boolean }) {
  const valid = timestamp(startsAt) !== undefined;
  return <span className={cx("mp-call-date-tile", live && "mp-call-date-live")} aria-hidden="true"><span>{valid ? new Intl.DateTimeFormat("en-GB", { month: "short" }).format(new Date(startsAt!)) : "Call"}</span><strong>{valid ? new Date(startsAt!).getDate() : "--"}</strong></span>;
}

export function SubmissionMilestones({ week, submission }: { week: WeekDefinition; submission: WeekSubmission }) {
  const sent = ["submitted", "late"].includes(submission.state);
  const steps = [
    ...(week.requiredIdeas > 0 ? [{ title: "Song starters", detail: `${Math.min(submission.ideas.length, week.requiredIdeas)}/${week.requiredIdeas}`, done: submission.ideas.length >= week.requiredIdeas, target: "song-starters" }] : []),
    ...(week.songRequired ? [{ title: "Weekly song", detail: submission.song ? "Added" : "Add file", done: Boolean(submission.song), target: "weekly-song" }] : []),
    ...(week.stemsRequired ? [{ title: "Stems", detail: submission.stems ? "Added" : "Add ZIP", done: Boolean(submission.stems), target: "stems" }] : []),
    { title: "Send to Rob", detail: sent ? "Sent" : "Submit", done: sent, target: "send-to-rob" },
  ];
  return <div className="mp-upload-milestones" aria-label="Your submission progress">{steps.map((step, index) => {
    const Tag = sent && step.target === "send-to-rob" ? "span" : "a";
    return <Tag href={Tag === "a" ? `#${step.target}` : undefined} key={step.title} className={cx("mp-focus-ring mp-upload-milestone", step.done && "is-done")} aria-label={`${step.title}: ${step.detail}`}><span className="mp-upload-milestone-node">{step.done ? <Check size={13} /> : index + 1}</span><span><strong>{step.title}</strong><small>{step.detail}</small></span></Tag>;
  })}</div>;
}

export function TimingStatus({ state, label }: { state: string; label: string }) {
  const Icon = state === "feedback" ? Headphones : state === "submitted" ? Check : Flag;
  return <span className={cx("mp-timing-status", state === "submitted" && "is-done")}><span className="mp-timing-status-icon"><Icon size={20} /></span><span>{label}</span></span>;
}
