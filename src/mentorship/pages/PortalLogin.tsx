import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import robWorking from "@/assets/rob-working-3-loop.mp4";
import "../login.css";
import { usePortalStore } from "../PortalStore";
import { PrimaryButton } from "../components/PortalUI";
import { cx } from "../utils";
import { toast } from "sonner";

export function PortalLogin() {
  const { login, backend, authError, requestPasswordReset, staffUser, selectView, logout } = usePortalStore();
  const navigate = useNavigate();
  const chooseView = async (view: "student" | "staff") => {
    setSubmitting(true);
    setError("");
    try {
      await selectView(view);
      navigate(view === "student" ? "/mentorship-portal/dashboard" : "/mentorship-portal/admin");
    } catch (error) { setError(error instanceof Error ? error.message : "Unable to open this view."); }
    finally { setSubmitting(false); }
  };
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

        {staffUser ? (
          <section className="mp-login-card" aria-labelledby="portal-choose-view">
            <div className="mp-login-card-heading">
              <h2 id="portal-choose-view">Choose your view</h2>
              <p>Open the cohort dashboard or work through the portal as a test student.</p>
            </div>
            <div className="mt-6 grid gap-3">
              <PrimaryButton disabled={submitting} onClick={() => void chooseView("staff")} className="justify-between">Rob's view <ArrowRight size={18} /></PrimaryButton>
              <button disabled={submitting} onClick={() => void chooseView("student")} className="mp-focus-ring flex items-center justify-between rounded-xl border border-white/20 bg-white/5 px-5 py-4 font-bold text-white disabled:opacity-50">Student view <ArrowRight size={18} /></button>
            </div>
            <p className="mt-5 text-xs leading-5 text-[#aaa99f]">Uploads and feedback are saved online. The test student does not receive emails.</p>
            {error && <div role="alert" className="mp-login-error">{error}</div>}
            <button onClick={() => void logout().catch(() => setError("Unable to sign out."))} className="mp-focus-ring mt-4 text-xs text-[#aaa99f] underline underline-offset-4">Sign out</button>
          </section>
        ) : <section className="mp-login-card" aria-labelledby="portal-sign-in">
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
        </section>}

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
