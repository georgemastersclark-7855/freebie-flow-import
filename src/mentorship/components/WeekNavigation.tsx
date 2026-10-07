import { useScheduleTimezone } from "../useScheduleTimezone";
import { NavLink } from "react-router-dom";
import { Check, LockKeyhole, Bell } from "lucide-react";
import { usePortalStore } from "../PortalStore";
import { cx, weekOpeningLabel } from "../utils";

export function WeekNavigation({ onNavigate }: { onNavigate?: () => void }) {
  const { timezone } = useScheduleTimezone();
  const { weeks, submissions } = usePortalStore();
  return <ol className="my-2 ml-5 space-y-1 border-l border-white/10 pl-3" aria-label="Mentorship weeks">
    {weeks.map((week) => {
      const submission = submissions.find((item) => item.weekNumber === week.number);
      const feedback = submission?.feedback && !submission.feedback.actionConfirmedAt;
      const submitted = ["submitted", "late"].includes(submission?.state ?? "");
      if (week.phase === "upcoming") return <li key={week.number}>
        <div aria-disabled="true" className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-xs text-[#85847c]" title={weekOpeningLabel(week, timezone)}>
          <span>Week {week.number}{week.opensLabel && <span className="mt-1 block text-[10px]">{weekOpeningLabel(week, timezone)}</span>}</span>
          <LockKeyhole size={12} aria-label="Locked" className="shrink-0" />
        </div>
      </li>;
      return <li key={week.number}><NavLink to={`/mentorship-portal/week/${week.number}`} onClick={onNavigate}
        className={({ isActive }) => cx("mp-focus-ring flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-xs transition", isActive ? "bg-white/10 font-bold text-white" : "text-[#b6b3a8] hover:bg-white/5 hover:text-white")}>
        <span>Week {week.number}</span>
        {feedback ? <Bell size={12} fill="currentColor" className="text-[#D3FF02]" aria-label="Feedback action required" /> : week.phase === "current" ? <span className="text-[9px] font-bold uppercase tracking-wider">Current</span> : submitted ? <Check size={12} aria-label="Submitted" /> : null}
      </NavLink></li>;
    })}
  </ol>;
}
