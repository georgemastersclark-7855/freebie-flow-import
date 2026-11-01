import type { ReactNode } from "react";
import { CheckCircle2, CircleAlert } from "lucide-react";
import robWorking from "@/assets/rob-working-3-loop.mp4";
import "../login.css";
import { SUPPORT_EMAIL } from "../auth";
import { cx } from "../utils";

export const AUTH_HEADING_ID = "portal-auth-heading";

/** The dark, filmed backdrop shared by every sign-in screen. */
export function AuthLayout({ children, below }: { children: ReactNode; below?: ReactNode }) {
  return (
    <div className="mentorship-portal mp-login">
      <div className="mp-login-backdrop" aria-hidden="true">
        <video autoPlay muted loop playsInline tabIndex={-1} src={robWorking} className="mp-login-film" />
      </div>
      <main className="mp-login-content">
        <header className="mp-login-brand">
          <div className="mp-login-identity">
            <div className="mp-login-portrait" style={{ background: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)" }}>
              <img src="/assets/rob-profile.jpg" alt="Rob Late" width={52} height={52} />
            </div>
            <span>ROB LATE'S</span>
          </div>
          <p className="mp-display mp-login-title"><span>PRODUCER</span><span>MENTORSHIP</span></p>
        </header>
        <section className="mp-login-card" aria-labelledby={AUTH_HEADING_ID}>{children}</section>
        <SupportLine />
        {below}
      </main>
    </div>
  );
}

export function AuthHeading({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mp-login-card-heading">
      <h1 id={AUTH_HEADING_ID} tabIndex={-1}>{title}</h1>
      {children}
    </div>
  );
}

/** Plain text on purpose: a mailto-only link fails for anyone without a mail app set up. */
export function SupportLine() {
  return <p className="mp-login-support">Stuck? Email <span className="mp-login-support-email">{SUPPORT_EMAIL}</span></p>;
}

export function AuthNotice({ tone, children, id }: { tone: "success" | "error"; children: ReactNode; id?: string }) {
  const Icon = tone === "success" ? CheckCircle2 : CircleAlert;
  return (
    <div id={id} role={tone === "error" ? "alert" : "status"} className={cx("mp-login-notice", tone === "error" ? "is-error" : "is-success")}>
      <Icon size={18} aria-hidden="true" className="mp-login-notice-icon" />
      <div>{children}</div>
    </div>
  );
}

export function PortalLoading() {
  return <div className="mentorship-portal grid min-h-screen place-items-center"><div role="status" className="text-xs font-bold uppercase tracking-[0.18em] text-[#77766f]">Loading your mentorship...</div></div>;
}

export function TextButton({ children, onClick, disabled, className }: { children: ReactNode; onClick: () => void; disabled?: boolean; className?: string }) {
  return <button type="button" onClick={onClick} disabled={disabled} className={cx("mp-focus-ring mp-login-link", className)}>{children}</button>;
}
