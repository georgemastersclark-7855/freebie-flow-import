import { useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import robWorking from "@/assets/rob-working-3-loop.mp4";
import "../login.css";
import { usePortalStore } from "../PortalStore";
import { PrimaryButton } from "../components/PortalUI";
import { cx } from "../utils";
import { toast } from "sonner";

export function PortalLogin() {
  const { login, backend, authError, requestPasswordReset } = usePortalStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  const loadDemo = (role: "student" | "coach") => {
    setEmail(role === "student" ? "jack@demo.com" : "rob@demo.com");
    setPassword("demo");
  };

  const forgotPassword = async () => {
    try {
      await requestPasswordReset(email);
      toast.success(backend === "supabase" ? "Check your email for a password-reset link." : "Password reset is disabled in the local demo.");
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : "Unable to send a reset email.");
    }
  };

  return (
    <div className="mentorship-portal mp-login">
      <div className="mp-login-backdrop" aria-hidden="true">
        <video autoPlay muted loop playsInline tabIndex={-1} src={robWorking} className="mp-login-film" />
      </div>
      <div className="mp-grain mp-login-grain" aria-hidden="true" />

      <main className="mp-login-content">
        <header className="mp-login-brand">
          <div className="mp-login-identity">
            <div className="mp-login-portrait" style={{ background: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)" }}>
              <img src="/assets/rob-profile.jpg" alt="Rob Late" width={52} height={52} />
            </div>
            <span>ROB LATE'S</span>
          </div>
          <h1 className="mp-display mp-login-title"><span>PRODUCER</span><span>MENTORSHIP</span></h1>
        </header>

        <section className="mp-login-card" aria-labelledby="portal-sign-in">
          <div className="mp-login-card-heading">
            <h2 id="portal-sign-in">Sign in</h2>
            <p>Use the email address you joined with.</p>
          </div>

          <form onSubmit={submit} className="mp-login-form">
            <label className="mp-login-field">
              <span className="mp-login-label">Email address</span>
              <span className="mp-login-input-wrap">
                <Mail className="mp-login-input-icon" size={18} />
                <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" placeholder="you@email.com" className="mp-focus-ring mp-login-input" />
              </span>
            </label>
            <div className="mp-login-field">
              <div className="mp-login-password-label">
                <label htmlFor="portal-password" className="mp-login-label">Password</label>
                <button type="button" onClick={() => void forgotPassword()} className="mp-focus-ring mp-login-forgot">Forgot password?</button>
              </div>
              <span className="mp-login-input-wrap">
                <LockKeyhole className="mp-login-input-icon" size={18} />
                <input id="portal-password" aria-label="Password" value={password} onChange={(event) => setPassword(event.target.value)} type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Your password" className="mp-focus-ring mp-login-input mp-login-password" />
                <button type="button" onClick={() => setShowPassword((value) => !value)} className="mp-focus-ring mp-login-reveal" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </span>
            </div>
            {(error || authError) && <div role="alert" className="mp-login-error">{error || authError}</div>}
            <PrimaryButton type="submit" disabled={submitting} className="mp-login-submit">
              {submitting ? "Signing in..." : "Sign in"}<ArrowRight size={18} />
            </PrimaryButton>
          </form>
        </section>

        {import.meta.env.DEV && backend === "demo" && (
          <details className="mp-login-demo">
            <summary className="mp-focus-ring">Preview accounts</summary>
            <p>Choose a view, then press Sign in.</p>
            <div className="mp-login-demo-buttons">
              <button type="button" onClick={() => loadDemo("student")} className={cx("mp-focus-ring", email.startsWith("jack") && "is-selected")}>Student view</button>
              <button type="button" onClick={() => loadDemo("coach")} className={cx("mp-focus-ring", email.startsWith("rob") && "is-selected")}>Rob's view</button>
            </div>
          </details>
        )}
      </main>
    </div>
  );
}
