import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Bell, ChevronDown, FolderClock } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { usePortalStore } from "../PortalStore";
import { cx } from "../utils";
import { WeekNavigation } from "./WeekNavigation";

export function WeeklySubmissionsNavigation({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const { pathname } = useLocation();
  const { submissions } = usePortalStore();
  const [open, setOpen] = useState(true);
  const active = pathname.startsWith("/mentorship-portal/week/");
  const pendingFeedback = submissions.some((submission) => submission.feedback && !submission.feedback.actionConfirmedAt);

  useEffect(() => {
    if (pathname.startsWith("/mentorship-portal/week/")) setOpen(true);
  }, [pathname]);

  return <Collapsible open={open} onOpenChange={setOpen}>
    <CollapsibleTrigger className={cx(
      "mp-focus-ring flex w-full items-center gap-3 rounded-xl border text-left text-sm font-semibold transition",
      mobile ? "px-4 py-3" : "px-3 py-2.5",
      active
        ? "border-white/35 bg-white/[0.12] text-white"
        : mobile
          ? "border-white/[0.07] bg-white/[0.025] text-[#dedbd2] hover:border-white/15 hover:bg-white/[0.05]"
          : "border-transparent text-[#8f8e85] hover:border-white/10 hover:bg-white/[0.04] hover:text-[#e5e1d8]",
    )}>
      <FolderClock size={mobile ? 18 : 17} className="shrink-0" aria-hidden="true" />
      <span className="min-w-0 flex-1">Your Weekly Submissions</span>
      {pendingFeedback && <Bell size={13} className="shrink-0 text-[#D3FF02]" fill="currentColor" aria-label="Feedback action required" />}
      <ChevronDown size={15} aria-hidden="true" className={cx("mp-week-navigation-chevron shrink-0", open && "rotate-180")} />
    </CollapsibleTrigger>
    <CollapsibleContent className="mp-week-navigation-content"><WeekNavigation onNavigate={onNavigate} /></CollapsibleContent>
  </Collapsible>;
}
