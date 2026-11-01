import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, LoaderCircle, LockKeyhole } from "lucide-react";
import { toast } from "sonner";
import { usePortalStore } from "../PortalStore";
import { MIN_PASSWORD_LENGTH, describeAuthError, purposeForLink, readAuthUrl, type PasswordPurpose } from "../auth";
import { AuthHeading, AuthLayout, AuthNotice } from "../components/AuthLayout";
import { EmailCodeFlow } from "../components/EmailCodeFlow";
import { PrimaryButton } from "../components/PortalUI";

const formCopy: Record<PasswordPurpose, { title: string; intro: string; saved: string }> = {
  setup: { title: "Choose your password", intro: `At least ${MIN_PASSWORD_LENGTH} characters. Next time, sign in with the email you paid with and this password.`, saved: "Password saved. Welcome in." },
  reset: { title: "Choose a new password", intro: `At least ${MIN_PASSWORD_LENGTH} characters. You'll use it with the email you paid with.`, saved: "New password saved. You're back in." },
};

/**
 * The last step of login setup and password reset, after a code or link has
 * signed the student in. Without a valid session (an expired or already-used
 * link) it offers a fresh code instead of a form that can't save.
 */
export function PortalSetPassword() {
  const { setPassword, hasAuthSession, passwordStep, finishPasswordStep, user, staffUser } = usePortalStore();
  const accountEmail = (staffUser ?? user)?.email;
  const location = useLocation();
  const navigate = useNavigate();
  const [link] = useState(() => readAuthUrl(location.search, location.hash));
  const [phase, setPhase] = useState<"checking" | "form" | "expired">(link.error ? "expired" : "checking");
  const linkPurpose = link.hasSessionTokens || link.tokenHash ? purposeForLink(link.type) : undefined;
  const purpose: PasswordPurpose = passwordStep ?? linkPurpose ?? "reset";
  const [password, setPasswordValue] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const passwordInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (link.error) navigate(location.pathname, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase !== "checking") return;
    let active = true;
    void hasAuthSession()
      .then((signedIn) => { if (active) setPhase(signedIn ? "form" : "expired"); })
      .catch(() => { if (active) setPhase("expired"); });
    return () => { active = false; };
  }, [phase, hasAuthSession]);

  const done = (message: string) => {
    finishPasswordStep();
    toast.success(message);
    navigate("/mentorship-portal", { replace: true });
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (password.length < MIN_PASSWORD_LENGTH) { setError(`Use at least ${MIN_PASSWORD_LENGTH} characters.`); passwordInput.current?.focus(); return; }
    if (password !== confirmation) { setError("The passwords don't match. Type the same password in both boxes."); return; }
    setSubmitting(true);
    try {
      await setPassword(password);
      done(formCopy[purpose].saved);
    } catch (reason) {
      const problem = describeAuthError(reason, "set-password");
      // Choosing the password they already have still leaves them with a working login.
      if (problem.kind === "same-password") { done("That's already your password. You're in."); return; }
      if (problem.kind === "session-missing" || problem.kind === "expired") { setSubmitting(false); setPhase("expired"); return; }
      setError(problem.message);
      setSubmitting(false);
    }
  };

  if (phase === "checking") {
    return (
      <AuthLayout>
        <AuthHeading title={formCopy[purpose].title}>
          <p className="mp-login-checking"><LoaderCircle size={16} className="animate-spin" aria-hidden="true" />One moment while we check your link.</p>
        </AuthHeading>
      </AuthLayout>
    );
  }

  if (phase === "expired") {
    return (
      <AuthLayout below={<Link to="/mentorship-portal" className="mp-focus-ring mp-login-back">Back to sign in</Link>}>
        <EmailCodeFlow
          purpose={purpose}
          title="That link has expired"
          intro={<p>That link has expired or was already used. Enter your email and we'll send a fresh code.</p>}
          notice={<AuthNotice tone="success">Once you've entered the code, you can choose your password straight away.</AuthNotice>}
          onVerified={() => { setError(""); setPhase("form"); }}
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthHeading title={formCopy[purpose].title}>
        <p>{formCopy[purpose].intro}</p>
        {accountEmail && <p className="mp-login-sent-to">For <strong>{accountEmail}</strong></p>}
      </AuthHeading>
      <form onSubmit={(event) => void submit(event)} className="mp-login-form" noValidate>
        {/* Lets password managers save the new password against the right email. */}
        {accountEmail && <input type="email" name="username" autoComplete="username" value={accountEmail} readOnly tabIndex={-1} aria-hidden="true" className="sr-only" />}
        <label className="mp-login-field">
          <span className="mp-login-label">{purpose === "setup" ? "Password" : "New password"}</span>
          <span className="mp-login-input-wrap">
            <LockKeyhole className="mp-login-input-icon" size={18} aria-hidden="true" />
            <input ref={passwordInput} value={password} onChange={(event) => setPasswordValue(event.target.value)} type={showPassword ? "text" : "password"} name="new-password" autoComplete="new-password" autoFocus minLength={MIN_PASSWORD_LENGTH} className="mp-focus-ring mp-login-input mp-login-password" />
            <button type="button" onClick={() => setShowPassword((value) => !value)} className="mp-focus-ring mp-login-reveal" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </span>
        </label>
        <label className="mp-login-field">
          <span className="mp-login-label">Type it again</span>
          <span className="mp-login-input-wrap">
            <LockKeyhole className="mp-login-input-icon" size={18} aria-hidden="true" />
            <input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} type={showPassword ? "text" : "password"} name="confirm-password" autoComplete="new-password" className="mp-focus-ring mp-login-input" />
          </span>
        </label>
        {error && <AuthNotice tone="error">{error}</AuthNotice>}
        <PrimaryButton type="submit" disabled={submitting} className="mp-login-submit">
          {submitting ? <><LoaderCircle size={18} className="animate-spin" aria-hidden="true" />Saving...</> : <>{purpose === "setup" ? "Save and open the portal" : "Save new password"}<ArrowRight size={18} aria-hidden="true" /></>}
        </PrimaryButton>
      </form>
    </AuthLayout>
  );
}
