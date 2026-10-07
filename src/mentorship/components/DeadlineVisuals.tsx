import { Check } from "lucide-react";
import type { WeekDefinition, WeekSubmission } from "../types";
import { cx } from "../utils";

export function TimeBar({ elapsed, urgent = false }: { elapsed?: number; urgent?: boolean }) {
  if (elapsed === undefined) return null;
  const value = Math.max(0, Math.min(100, elapsed));
  return <div className={cx("mp-time-progress", urgent && "is-urgent")} role="progressbar" aria-label="Submission window elapsed" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value)}>
    <span style={{ width: `${value}%` }}><i /></span>
  </div>;
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
