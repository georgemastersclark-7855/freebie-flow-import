import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import { usePortalStore } from "../PortalStore";
import { describeAuthError, isValidEmail, normalizeEmail } from "../auth";
import { PrimaryButton } from "./PortalUI";
import { AuthHeading, AuthNotice } from "./AuthLayout";

interface PasswordSignInProps {
  title: string;
  intro: ReactNode;
  initialEmail?: string;
  onEmailChange?: (email: string) => void;
  /** Starts the "email me a code, then choose a new password" flow for this email. */
  onForgotPassword: (email: string) => void;
  /** Runs after the password is accepted and the portal has loaded. */
  onSignedIn?: () => void | Promise<void>;
  footer?: ReactNode;
}

/** Email and password. Forgot password hands over to the emailed-code flow. */
export function PasswordSignIn({ title, intro, initialEmail = "", onEmailChange, onForgotPassword, onSignedIn, footer }: PasswordSignInProps) {
  const { login } = usePortalStore();
  const [email, setEmailValue] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const emailInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);

  const setEmail = (value: string) => { setEmailValue(value); onEmailChange?.(value); };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!isValidEmail(email)) { setError("Enter the email you paid with, like name@example.com."); emailInput.current?.focus(); return; }
    if (!password) { setError("Enter your password. First time here? Set up your login below."); passwordInput.current?.focus(); return; }
    setSubmitting(true);
    try {
      await login(normalizeEmail(email), password);
      await onSignedIn?.();
    } catch (reason) {
      setError(describeAuthError(reason, "password").message);
      setSubmitting(false);
      passwordInput.current?.focus();
    }
  };

  // Forgot password needs an email first; with one, the reset code goes straight out.
  const forgotPassword = () => {
    setError("");
    if (!email.trim()) {
      setError("Enter your email above, then tap Forgot password again.");
      emailInput.current?.focus();
      return;
    }
    if (!isValidEmail(email)) {
      setError("Check your email address, then tap Forgot password again.");
      emailInput.current?.focus();
      return;
    }
    onForgotPassword(normalizeEmail(email));
  };

  return (
    <>
      <AuthHeading title={title}>{intro}</AuthHeading>
      <form onSubmit={(event) => void submit(event)} className="mp-login-form" noValidate>
        <label className="mp-login-field">
          <span className="mp-login-label">Email address</span>
          <span className="mp-login-input-wrap">
            <Mail className="mp-login-input-icon" size={18} aria-hidden="true" />
            <input ref={emailInput} value={email} onChange={(event) => setEmail(event.target.value)} name="email" type="email" inputMode="email" autoComplete="username" autoCapitalize="none" autoCorrect="off" spellCheck={false} autoFocus={!initialEmail} placeholder="you@email.com" className="mp-focus-ring mp-login-input" />
          </span>
        </label>
        <div className="mp-login-field">
          <div className="mp-login-password-label">
            <label htmlFor="portal-password" className="mp-login-label">Password</label>
            <button type="button" onClick={forgotPassword} disabled={submitting} className="mp-focus-ring mp-login-forgot">Forgot password?</button>
          </div>
          <span className="mp-login-input-wrap">
            <LockKeyhole className="mp-login-input-icon" size={18} aria-hidden="true" />
            <input ref={passwordInput} id="portal-password" value={password} onChange={(event) => setPassword(event.target.value)} name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" autoFocus={Boolean(initialEmail)} placeholder="Your password" className="mp-focus-ring mp-login-input mp-login-password" />
            <button type="button" onClick={() => setShowPassword((value) => !value)} className="mp-focus-ring mp-login-reveal" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </span>
        </div>
        {error && <AuthNotice tone="error">{error}</AuthNotice>}
        <PrimaryButton type="submit" disabled={submitting} className="mp-login-submit">
          {submitting ? <><LoaderCircle size={18} className="animate-spin" aria-hidden="true" />Signing you in...</> : <>Sign in<ArrowRight size={18} aria-hidden="true" /></>}
        </PrimaryButton>
      </form>
      {footer}
    </>
  );
}
