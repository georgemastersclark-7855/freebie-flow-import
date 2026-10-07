import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Settings, Video } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cx } from "../utils";

const videosPath = "/mentorship-portal/admin/videos";

export function StaffSettingsNavigation({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const { pathname } = useLocation();
  const active = pathname === videosPath;
  const [open, setOpen] = useState(active);

  useEffect(() => {
    if (pathname === videosPath) setOpen(true);
  }, [pathname]);

  return <nav aria-label="Portal settings">
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className={cx(
        "mp-focus-ring flex w-full items-center gap-3 rounded-xl border text-left text-sm font-semibold transition",
        mobile ? "px-4 py-3" : "px-3 py-2.5",
        active ? "border-white/35 bg-white/[0.12] text-white" : "border-transparent text-[#8f8e85] hover:border-white/10 hover:bg-white/[0.04] hover:text-white",
      )}>
        <Settings size={17} aria-hidden="true" />
        <span className="flex-1">Settings</span>
        <ChevronDown size={15} aria-hidden="true" className={cx("mp-week-navigation-chevron", open && "rotate-180")} />
      </CollapsibleTrigger>
      <CollapsibleContent className="mp-week-navigation-content">
        <div className="ml-5 mt-1 border-l border-white/10 pl-3">
          <Link to={videosPath} onClick={onNavigate} aria-current={active ? "page" : undefined} className={cx(
            "mp-focus-ring flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition",
            active ? "bg-white/10 font-semibold text-white" : "text-[#aaa99f] hover:bg-white/[0.04] hover:text-white",
          )}><Video size={16} aria-hidden="true" />Manage videos</Link>
        </div>
      </CollapsibleContent>
    </Collapsible>
  </nav>;
}
