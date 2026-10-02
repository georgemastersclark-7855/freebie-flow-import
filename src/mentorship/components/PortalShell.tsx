import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  Bell,
  ClipboardList,
  FolderClock,
  Gauge,
  LogOut,
  Menu,
  Video,
  BookOpen,
  Library,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { usePortalStore } from "../PortalStore";
import { PortalMark } from "./PortalUI";
import { communityName } from "../onboarding";
import { toast } from "sonner";
import { cx } from "../utils";
import { WeekNavigation } from "./WeekNavigation";

const studentNavigation = [
  { to: "/mentorship-portal/dashboard", label: "Dashboard", icon: Gauge },
  { to: "/mentorship-portal/setup", label: "Studio Setup", icon: BookOpen },
  { to: "/mentorship-portal/submissions", label: "Your Weekly Submissions", icon: FolderClock },
  { to: "/mentorship-portal/library", label: "Song Starter Library", icon: Library },
];

const staffNavigation = [
  { to: "/mentorship-portal/admin", label: "Cohort overview", icon: Gauge, adminOnly: false },
  { to: "/mentorship-portal/admin/videos", label: "Manage videos", icon: Video, adminOnly: true },
  { to: "/mentorship-portal/admin/reviews", label: "Review queue", icon: ClipboardList, adminOnly: false },
];

export function PortalShell() {
  const { user, logout, submissions, circleUrl, weeks, backend, staffUser, resetTestUploads } = usePortalStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetting, setResetting] = useState(false);
  const reset = async () => {
    setResetting(true);
    try {
      await resetTestUploads();
      setConfirmReset(false);
      toast.success("Test uploads and feedback cleared.");
      navigate("/mentorship-portal");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Unable to clear test uploads."); }
    finally { setResetting(false); }
  };
  const staff = user?.role === "coach" || user?.role === "admin";
  const navigation = staff ? staffNavigation.filter((item) => !item.adminOnly || user?.role === "admin") : studentNavigation;
  const currentWeek = weeks.find((week) => week.phase === "current");
  useEffect(() => {
    const section = location.hash.slice(1);
    if (["setup-videos", "song-starters", "weekly-song", "stems", "send-to-rob", "feedback"].includes(section)) {
      document.getElementById(section)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (!location.hash) window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  const pendingFeedback = !staff && submissions.some((submission) => submission.feedback && !submission.feedback.actionConfirmedAt);

  const signOut = async () => {
    try {
      await logout();
      navigate("/mentorship-portal");
    } catch { toast.error("Unable to sign out. Please try again."); }
  };

  return (
    <div className="mentorship-portal relative flex min-h-screen">
      <div className="mp-grain fixed inset-0 z-50 opacity-70" />

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col border-r border-white/[0.08] bg-[#0d0d0b]/95 p-5 backdrop-blur-xl lg:flex overflow-y-auto">
        <PortalMark />
        <div className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-3.5">
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#77766f]">{staff ? "Current cohort" : "Current programme"}</div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-bold text-white">{user?.cohortName}</div>
              <div className="text-xs text-[#85847c]">Six-week producer mentorship</div>
            </div>
            <div className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-xs font-black text-[#aaa99f]">{currentWeek ? `${currentWeek.number}/6` : "6w"}</div>
          </div>
        </div>

        <nav className="mt-7 space-y-1.5" aria-label="Portal navigation">
          {navigation.map(({ to, label, icon: Icon }, index) => (
            <div key={`${label}-${index}`}><NavLink
              to={to}
              end
              className={() => {
                const active = `${location.pathname}${location.hash}` === to
                  || (label === "Studio Setup" && location.pathname.startsWith("/mentorship-portal/setup/"))
                  || (label === "Your Weekly Submissions" && location.pathname.startsWith("/mentorship-portal/week/"))
                  || (label === "Review queue" && location.pathname.startsWith("/mentorship-portal/admin/review/"));
                return cx(
                  "mp-focus-ring flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                  active
                    ? "bg-white/[0.07] text-white"
                    : "text-[#8f8e85] hover:bg-white/[0.04] hover:text-[#e5e1d8]",
                );
              }}
            >
              <Icon size={17} className="shrink-0" />
              <span>{label}</span>
              {label === "Your Weekly Submissions" && pendingFeedback && <Bell size={13} className="ml-auto text-[#D3FF02]" fill="currentColor" aria-label="Feedback action required" />}
            </NavLink>{label === "Your Weekly Submissions" && <WeekNavigation />}</div>
          ))}
        </nav>

        <div className="mt-auto pt-6">
          {!staff && circleUrl && (
            <a href={circleUrl} target={circleUrl ? "_blank" : undefined} rel={circleUrl ? "noreferrer" : undefined} className="mp-focus-ring mb-3 flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 py-3 text-sm font-semibold text-[#b9b6ad] hover:border-white/15 hover:text-white">
              {communityName(circleUrl)}
              <ArrowUpRight size={16} />
            </a>
          )}
          <div className="flex items-center gap-3 border-t border-white/[0.08] pt-4">
            <div className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-xs font-black text-white">{user?.name.slice(0, 1).toUpperCase()}</div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-[#e5e1d8]">{user?.name}</div>
              <div className="truncate text-[11px] capitalize text-[#77766f]">{user?.role}</div>
            </div>
            <button type="button" onClick={() => void signOut()} className="mp-focus-ring rounded-lg p-2 text-[#77766f] hover:bg-white/[0.05] hover:text-white" aria-label="Sign out"><LogOut size={16} /></button>
          </div>
        </div>
      </aside>

      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-white/[0.08] bg-[#0d0d0b]/95 px-4 backdrop-blur-xl lg:hidden">
        <PortalMark compact />
        <div className="text-center">
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#77766f]">{user?.cohortName ?? "Producer mentorship"}</div>
          <div className="text-xs font-semibold text-[#d9d6cd]">{currentWeek ? `Week ${currentWeek.number} of 6` : "Six-week mentorship"}</div>
        </div>
        <button type="button" onClick={() => setMobileOpen(true)} className="mp-focus-ring rounded-lg p-2 text-white" aria-label="Open navigation"><Menu size={21} /></button>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button type="button" className="absolute inset-0 bg-black/75" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />
          <div className="absolute inset-y-0 right-0 w-[86%] max-w-[340px] border-l border-white/10 bg-[#11110f] p-5 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between">
              <PortalMark />
              <button type="button" onClick={() => setMobileOpen(false)} className="mp-focus-ring rounded-lg p-2 text-[#aaa99f]" aria-label="Close navigation"><X size={20} /></button>
            </div>
            <nav className="mt-8 space-y-2">
              {navigation.map(({ to, label, icon: Icon }, index) => (
                <div key={`${label}-mobile-${index}`}><NavLink to={to} end onClick={() => setMobileOpen(false)} className="mp-focus-ring flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 text-sm font-semibold text-[#dedbd2]">
                  <Icon size={18} className="shrink-0" /> <span>{label}</span>
                  {label === "Your Weekly Submissions" && pendingFeedback && <Bell size={13} className="ml-auto text-[#D3FF02]" fill="currentColor" aria-label="Feedback action required" />}
                </NavLink>{label === "Your Weekly Submissions" && <WeekNavigation onNavigate={() => setMobileOpen(false)} />}</div>
              ))}
            </nav>
            {!staff && circleUrl && <a href={circleUrl} target="_blank" rel="noreferrer" className="mp-focus-ring mt-4 flex items-center justify-between rounded-xl border border-white/10 p-4 text-sm text-[#d4d0c5]">{communityName(circleUrl)}<ArrowUpRight size={16} /></a>}
            <button type="button" onClick={() => void signOut()} className="mp-focus-ring mt-8 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#8f8e85]"><LogOut size={17} /> Sign out</button>
          </div>
        </div>
      )}

      <main className="relative z-10 min-w-0 flex-1 pt-16 lg:ml-[260px] lg:pt-0">
        {backend === "demo" && <div className="border-b border-white/15 bg-white/5 px-4 py-2 text-center text-xs text-[#b6b3a8]">Preview with example student data. No live submissions or messages.</div>}
        {staffUser && (
          <div className="border-b border-white/10 bg-white/[0.035] px-5 py-3 text-xs text-[#b9b6ad]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span>{staff ? "Rob's view" : "Student view: Test Student"} · Saved online</span>
              <div className="flex items-center gap-5">
                <button type="button" disabled={resetting} onClick={() => navigate("/mentorship-portal")} className="mp-focus-ring font-bold text-white underline underline-offset-4">Switch view</button>
                <button type="button" disabled={resetting} onClick={() => setConfirmReset(true)} className="mp-focus-ring underline underline-offset-4">Clear test uploads</button>
              </div>
            </div>
            {confirmReset && <div role="alertdialog" aria-label="Clear test uploads" className="mt-4 rounded-xl border border-white/15 p-4">
              <p>Delete your test uploads and feedback from cloud storage? Student uploads and onboarding progress are kept.</p>
              <div className="mt-3 flex gap-4">
                <button type="button" disabled={resetting} onClick={() => void reset()} className="mp-focus-ring font-bold text-white">{resetting ? "Clearing..." : "Delete test uploads"}</button>
                <button type="button" disabled={resetting} onClick={() => setConfirmReset(false)} className="mp-focus-ring">Cancel</button>
              </div>
            </div>}
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
}
