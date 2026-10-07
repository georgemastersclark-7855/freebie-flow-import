import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarDays,
  ClipboardList,
  FolderClock,
  Gauge,
  LogOut,
  Menu,
  BookOpen,
  Library,
  Package,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePortalStore } from "../PortalStore";
import { PortalMark } from "./PortalUI";
import { communityName } from "../onboarding";
import { toast } from "sonner";
import { cx } from "../utils";
import { WeeklySubmissionsNavigation } from "./WeeklySubmissionsNavigation";
import { ProfileDialog } from "./ProfileDialog";
import { DeadlineStrip } from "./DeadlineStrip";
import { MasterBundleDialog } from "./MasterBundleCard";
import { StudentAvatar } from "./StudentAvatar";
import { StaffSettingsNavigation } from "./StaffSettingsNavigation";

const studentNavigation = [
  { to: "/mentorship-portal/dashboard", label: "Dashboard", icon: Gauge },
  { to: "/mentorship-portal/setup", label: "Studio Setup", icon: BookOpen },
  { to: null, label: "Your Weekly Submissions", icon: FolderClock },
  { to: "/mentorship-portal/library", label: "Song Starter Library", icon: Library },
];

const staffNavigation = [
  { to: "/mentorship-portal/admin/cohorts", label: "Cohorts & students", icon: Users, adminOnly: false },
  { to: "/mentorship-portal/admin", label: "Cohort overview", icon: Gauge, adminOnly: false },
  { to: "/mentorship-portal/admin/reviews", label: "Review queue", icon: ClipboardList, adminOnly: false },
  { to: "/mentorship-portal/admin/schedule", label: "Calendar", icon: CalendarDays, adminOnly: false },
];

function isNavigationActive(to: string, label: string, pathname: string) {
  if (pathname === to) return true;
  if (label === "Cohorts & students") return pathname.startsWith(`${to}/`);
  if (label === "Studio Setup") return pathname.startsWith(`${to}/`);
  if (label === "Review queue") return pathname.startsWith("/mentorship-portal/admin/review/");
  return false;
}

export function PortalShell() {
  const { user, logout, circleUrl, weeks, backend, staffUser, resetTestUploads } = usePortalStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [bundleOpen, setBundleOpen] = useState(false);
  const bundleTrigger = useRef<HTMLButtonElement | null>(null);
  const mobileMenuButton = useRef<HTMLButtonElement | null>(null);
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
  const profileRequired = user?.role === "student" && !user.profile?.completedAt;
  const navigation = staff ? staffNavigation.filter((item) => !item.adminOnly || user?.role === "admin") : studentNavigation;
  const currentWeek = weeks.find((week) => week.phase === "current");
  useEffect(() => {
    const section = location.hash.slice(1);
    if (["master-bundle", "setup-videos", "song-starters", "weekly-song", "stems", "send-to-rob", "feedback"].includes(section)) {
      document.getElementById(section)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (!location.hash) window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);

  const signOut = async () => {
    try {
      await logout();
      navigate("/mentorship-portal");
    } catch { toast.error("Unable to sign out. Please try again."); }
  };

  return (
    <div className="mentorship-portal relative flex min-h-screen">

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col border-r border-white/[0.08] bg-[#151619] p-5 backdrop-blur-xl lg:flex overflow-y-auto">
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
          {navigation.map(({ to, label, icon: Icon }, index) => {
            if (to === null) return <WeeklySubmissionsNavigation key={label} />;
            const active = isNavigationActive(to, label, location.pathname);
            return <div key={`${label}-${index}`}><Link
              to={to}
              aria-current={active ? "page" : undefined}
              className={cx(
                "mp-focus-ring flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-semibold transition",
                active
                  ? "border-white/35 bg-white/[0.12] text-white"
                  : "border-transparent text-[#8f8e85] hover:border-white/10 hover:bg-white/[0.04] hover:text-[#e5e1d8]",
              )}
            >
              <Icon size={17} className="shrink-0" />
              <span>{label}</span>
            </Link></div>
          })}
          {!staff && <MasterBundleShortcut open={bundleOpen} onClick={(button) => { bundleTrigger.current = button; setBundleOpen(true); }} />}
        </nav>

        <div className="mt-auto pt-6">
          {user?.role === "admin" && <div className="mb-4"><StaffSettingsNavigation /></div>}
          {!staff && circleUrl && (
            <a href={circleUrl} target={circleUrl ? "_blank" : undefined} rel={circleUrl ? "noreferrer" : undefined} className="mp-focus-ring mb-3 flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 py-3 text-sm font-semibold text-[#b9b6ad] hover:border-white/15 hover:text-white">
              {communityName(circleUrl)}
              <ArrowUpRight size={16} />
            </a>
          )}
          <div className="flex items-center gap-3 border-t border-white/[0.08] pt-4">
            <button type="button" onClick={() => setEditingProfile(true)} disabled={staff} aria-label={staff ? user?.name : "Edit profile"} className="mp-focus-ring flex min-w-0 flex-1 items-center gap-3 rounded-lg text-left disabled:cursor-default">
              <StudentAvatar name={user?.name ?? "Student"} src={user?.profile?.photoUrl} size={36} member={Boolean(user?.profile?.completedAt)} />
              <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-[#e5e1d8]">{user?.name}</span><span className="mt-0.5 block truncate text-[11px] text-[#99978e]">{staff ? user?.role : "Edit profile"}</span></span>
            </button>
            <button type="button" onClick={() => void signOut()} className="mp-focus-ring rounded-lg p-2 text-[#77766f] hover:bg-white/[0.05] hover:text-white" aria-label="Sign out"><LogOut size={16} /></button>
          </div>
        </div>
      </aside>

      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-white/[0.08] bg-[#151619] px-4 backdrop-blur-xl lg:hidden">
        <PortalMark compact />
        <div className="text-center">
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#77766f]">{user?.cohortName ?? "Producer mentorship"}</div>
          <div className="text-xs font-semibold text-[#d9d6cd]">{currentWeek ? `Week ${currentWeek.number} of 6` : "Six-week mentorship"}</div>
        </div>
        <button ref={mobileMenuButton} type="button" onClick={() => setMobileOpen(true)} className="mp-focus-ring rounded-lg p-2 text-white" aria-label="Open navigation"><Menu size={21} /></button>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button type="button" className="absolute inset-0 bg-black/75" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />
          <div className="absolute inset-y-0 right-0 flex w-[86%] max-w-[340px] flex-col border-l border-white/10 bg-[#11110f] p-5 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between">
              <PortalMark />
              <button type="button" onClick={() => setMobileOpen(false)} className="mp-focus-ring rounded-lg p-2 text-[#aaa99f]" aria-label="Close navigation"><X size={20} /></button>
            </div>
            <nav className="mt-8 space-y-2">
              {navigation.map(({ to, label, icon: Icon }, index) => {
                if (to === null) return <WeeklySubmissionsNavigation key={label} mobile onNavigate={() => setMobileOpen(false)} />;
                const active = isNavigationActive(to, label, location.pathname);
                return <div key={`${label}-mobile-${index}`}><Link to={to} onClick={() => setMobileOpen(false)} aria-current={active ? "page" : undefined} className={cx(
                  "mp-focus-ring flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition",
                  active ? "border-white/35 bg-white/[0.12] text-white" : "border-white/[0.07] bg-white/[0.025] text-[#dedbd2] hover:border-white/15 hover:bg-white/[0.05]",
                )}>
                  <Icon size={18} className="shrink-0" /> <span>{label}</span>
                </Link></div>
              })}
              {!staff && <MasterBundleShortcut open={bundleOpen} onClick={(button) => { bundleTrigger.current = button; setMobileOpen(false); setBundleOpen(true); }} />}
            </nav>
            {!staff && circleUrl && <a href={circleUrl} target="_blank" rel="noreferrer" className="mp-focus-ring mt-4 flex items-center justify-between rounded-xl border border-white/10 p-4 text-sm text-[#d4d0c5]">{communityName(circleUrl)}<ArrowUpRight size={16} /></a>}
            {!staff && <button type="button" onClick={() => { setMobileOpen(false); setEditingProfile(true); }} className="mp-focus-ring mt-6 flex w-full items-center gap-3 rounded-xl border border-white/15 p-4 text-left"><StudentAvatar name={user?.name ?? "Student"} src={user?.profile?.photoUrl} size={40} member={Boolean(user?.profile?.completedAt)} /><span className="min-w-0"><span className="block truncate text-sm font-bold">{user?.name}</span><span className="mt-1 block text-xs text-[#aaa99f]">Edit profile</span></span></button>}
            <div className="mt-auto pt-8">
              {user?.role === "admin" && <StaffSettingsNavigation mobile onNavigate={() => setMobileOpen(false)} />}
              <button type="button" onClick={() => void signOut()} className="mp-focus-ring mt-4 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#8f8e85]"><LogOut size={17} /> Sign out</button>
            </div>
          </div>
        </div>
      )}

      <main className="relative z-10 min-w-0 flex-1 pt-16 lg:ml-[260px] lg:pt-0">
        {backend === "demo" && <div className="border-b border-white/15 bg-white/5 px-4 py-2 text-center text-xs text-[#b6b3a8]">Preview with example student data. No live submissions or messages.</div>}
        {staffUser && (
          <div className="border-b border-white/10 bg-white/[0.035] px-5 py-3 text-xs text-[#b9b6ad]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span>{staff ? "Rob's view" : `Student view: ${user?.name ?? "Test Student"}`} · Saved online</span>
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
        {!staff && <DeadlineStrip />}
        <Outlet />
      </main>
      {!staff && <MasterBundleDialog open={bundleOpen} onOpenChange={setBundleOpen} onReturnFocus={() => { if (bundleTrigger.current?.isConnected) bundleTrigger.current.focus(); else mobileMenuButton.current?.focus(); }} />}
      {!staff && (profileRequired || editingProfile) && <ProfileDialog key={user?.enrollmentId ?? user?.id} required={Boolean(profileRequired)} onClose={() => setEditingProfile(false)} />}
    </div>
  );
}

function MasterBundleShortcut({ open, onClick }: { open: boolean; onClick: (button: HTMLButtonElement) => void }) {
  return <div className="!mt-5 border-t border-white/10 pt-4"><button type="button" onClick={(event) => onClick(event.currentTarget)} aria-haspopup="dialog" aria-expanded={open} className="mp-focus-ring flex w-full items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.025] px-3 py-3 text-left text-sm font-semibold text-[#d4d0c5] transition hover:border-white/25 hover:bg-white/[0.06]"><Package size={17} className="shrink-0" /><span className="flex-1">Master Bundle</span><span className="rounded border border-white/15 bg-white/[0.06] px-1.5 py-0.5 text-[9px] font-semibold text-[#b6b3a8]">Included</span></button></div>;
}
