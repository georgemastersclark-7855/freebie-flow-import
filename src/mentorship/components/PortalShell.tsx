import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  Bell,
  ClipboardList,
  FolderClock,
  Gauge,
  LogOut,
  Menu,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import { usePortalStore } from "../PortalStore";
import { PortalMark } from "./PortalUI";
import { cx } from "../utils";

const studentNavigation = [
  { to: "/mentorship-portal/welcome", label: "Start here", icon: Sparkles },
  { to: "/mentorship-portal/submissions", label: "Submit your work", icon: FolderClock },
];

const staffNavigation = [
  { to: "/mentorship-portal/admin", label: "Cohort overview", icon: Gauge },
  { to: "/mentorship-portal/admin/review/review-maya-w2", label: "Review queue", icon: ClipboardList },
];

export function PortalShell() {
  const { user, logout, submissions, circleUrl } = usePortalStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const staff = user?.role === "coach" || user?.role === "admin";
  const navigation = staff ? staffNavigation : studentNavigation;
  const pendingFeedback = !staff && submissions.some((submission) => submission.feedback && !submission.feedback.actionConfirmedAt);

  const signOut = async () => {
    await logout();
    navigate("/mentorship-portal");
  };

  return (
    <div className="mentorship-portal relative flex min-h-screen">
      <div className="mp-grain fixed inset-0 z-50 opacity-70" />

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col border-r border-white/[0.08] bg-[#0d0d0b]/95 p-5 backdrop-blur-xl lg:flex">
        <PortalMark />
        <div className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-3.5">
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#77766f]">{staff ? "Current cohort" : "Current programme"}</div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-bold text-white">{staff ? "Cohort 2" : "Rob Late"}</div>
              <div className="text-xs text-[#85847c]">Six-week producer mentorship</div>
            </div>
            <div className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-xs font-black text-[#aaa99f]">2/6</div>
          </div>
        </div>

        <nav className="mt-7 space-y-1.5" aria-label="Portal navigation">
          {navigation.map(({ to, label, icon: Icon }, index) => (
            <NavLink
              key={`${label}-${index}`}
              to={to}
              className={() => {
                const active = location.pathname === to
                  || (label === "Submit your work" && location.pathname.startsWith("/mentorship-portal/week/"))
                  || (label === "Review queue" && location.pathname.startsWith("/mentorship-portal/admin/review/"));
                return cx(
                  "mp-focus-ring flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                  active
                    ? "bg-white/[0.07] text-white"
                    : "text-[#8f8e85] hover:bg-white/[0.04] hover:text-[#e5e1d8]",
                );
              }}
            >
              <Icon size={17} />
              <span>{label}</span>
              {label === "Submit your work" && pendingFeedback && <Bell size={13} className="ml-auto text-[#D3FF02]" fill="currentColor" aria-label="Feedback action required" />}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto">
          {!staff && (
            <a href={circleUrl ?? "#circle"} target={circleUrl ? "_blank" : undefined} rel={circleUrl ? "noreferrer" : undefined} className="mp-focus-ring mb-3 flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 py-3 text-sm font-semibold text-[#b9b6ad] hover:border-white/15 hover:text-white">
              Open Circle
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
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#77766f]">{staff ? "Cohort 2" : "Producer mentorship"}</div>
          <div className="text-xs font-semibold text-[#d9d6cd]">Week 2 of 6</div>
        </div>
        <button type="button" onClick={() => setMobileOpen(true)} className="mp-focus-ring rounded-lg p-2 text-white" aria-label="Open navigation"><Menu size={21} /></button>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button type="button" className="absolute inset-0 bg-black/75" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />
          <div className="absolute inset-y-0 right-0 w-[86%] max-w-[340px] border-l border-white/10 bg-[#11110f] p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <PortalMark />
              <button type="button" onClick={() => setMobileOpen(false)} className="mp-focus-ring rounded-lg p-2 text-[#aaa99f]" aria-label="Close navigation"><X size={20} /></button>
            </div>
            <nav className="mt-8 space-y-2">
              {navigation.map(({ to, label, icon: Icon }, index) => (
                <NavLink key={`${label}-mobile-${index}`} to={to} onClick={() => setMobileOpen(false)} className="mp-focus-ring flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 text-sm font-semibold text-[#dedbd2]">
                  <Icon size={18} /> <span>{label}</span>
                  {label === "Submit your work" && pendingFeedback && <Bell size={13} className="ml-auto text-[#D3FF02]" fill="currentColor" aria-label="Feedback action required" />}
                </NavLink>
              ))}
            </nav>
            <button type="button" onClick={() => void signOut()} className="mp-focus-ring mt-8 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#8f8e85]"><LogOut size={17} /> Sign out</button>
          </div>
        </div>
      )}

      <main className="relative z-10 min-w-0 flex-1 pt-16 lg:ml-[260px] lg:pt-0">
        <Outlet />
      </main>
    </div>
  );
}
