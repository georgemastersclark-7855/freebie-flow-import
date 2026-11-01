import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { usePortalStore } from "../PortalStore";
import type { PasswordPurpose } from "../auth";
import { AuthLayout, AuthNotice } from "../components/AuthLayout";
import { EmailCodeFlow } from "../components/EmailCodeFlow";
import { PasswordSignIn } from "../components/PasswordSignIn";
import { SecondaryButton } from "../components/PortalUI";

type Mode = { kind: "password" } | { kind: "code"; purpose: PasswordPurpose; sendOnStart: boolean };

/**
 * The student front door: email and password. First-timers and anyone who's
 * forgotten their password prove the email with a one-time code, then choose one.
 */
export function PortalLogin() {
  const { backend } = usePortalStore();
  const location = useLocation();
  const arrival = (location.state ?? {}) as { signedOut?: boolean; email?: string };
  const [mode, setMode] = useState<Mode>({ kind: "password" });
  const [email, setEmail] = useState(arrival.email ?? "");
  const [formKey, setFormKey] = useState(0);
  const [signedOutNotice, setSignedOutNotice] = useState(Boolean(arrival.signedOut));

  const open = (next: Mode, currentEmail: string) => {
    setEmail(currentEmail);
    setSignedOutNotice(false);
    setMode(next);
  };

  const fillDemo = (value: string) => {
    setEmail(value);
    setMode({ kind: "password" });
    setFormKey((key) => key + 1);
  };

  return (
    <AuthLayout below={import.meta.env.DEV && backend === "demo" && (
      <details className="mp-login-demo">
        <summary className="mp-focus-ring">Preview accounts</summary>
        <p>Fill an email and type any password, or try first-time setup.</p>
        <div className="mp-login-demo-buttons">
          <button type="button" onClick={() => fillDemo("jack@demo.com")} className="mp-focus-ring">Student</button>
          <button type="button" onClick={() => fillDemo("nobody@demo.com")} className="mp-focus-ring">No place found</button>
          <Link to="/mentorship-portal/auth/confirm?token_hash=demo&type=email" className="mp-focus-ring">Email link</Link>
          <Link to="/mentorship-portal/set-password#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired" className="mp-focus-ring">Expired link</Link>
          <Link to="/mentorship-portal/staff" className="mp-focus-ring">Staff entrance</Link>
        </div>
      </details>
    )}>
      {mode.kind === "password" ? (
        <PasswordSignIn
          key={formKey}
          title="Sign in"
          intro={<p>Sign in with the email you paid with.</p>}
          initialEmail={email}
          onEmailChange={setEmail}
          onForgotPassword={(value) => open({ kind: "code", purpose: "reset", sendOnStart: true }, value)}
          footer={<>
            {signedOutNotice && <div className="mt-4"><AuthNotice tone="success">You're signed out. See you next time.</AuthNotice></div>}
            <div className="mp-login-first-time">
              <h2>First time here?</h2>
              <p>New to the portal? Set up your login in a minute: we'll email you a code to confirm it's you, then you choose a password.</p>
              <SecondaryButton onClick={() => open({ kind: "code", purpose: "setup", sendOnStart: false }, email)} className="mp-login-secondary mt-4">Set up your login<ArrowRight size={18} aria-hidden="true" /></SecondaryButton>
            </div>
          </>}
        />
      ) : (
        <EmailCodeFlow
          key={`${mode.purpose}-${formKey}`}
          purpose={mode.purpose}
          initialEmail={email}
          sendOnStart={mode.sendOnStart}
          onBack={(value) => open({ kind: "password" }, value)}
        />
      )}
    </AuthLayout>
  );
}
