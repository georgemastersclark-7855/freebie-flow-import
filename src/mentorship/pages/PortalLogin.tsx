import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import robWorking from "@/assets/rob-working-3-loop.mp4";
import signature from "@/assets/rob-late-signature-white.png";
import { usePortalStore } from "../PortalStore";
import { PortalMark, PrimaryButton } from "../components/PortalUI";
import { cx } from "../utils";
import { toast } from "sonner";

export function PortalLogin() {
  const { user, login, backend, authError, requestPasswordReset } = usePortalStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    navigate(user.role === "student" ? "/mentorship-portal/submissions" : "/mentorship-portal/admin", { replace: true });
  }, [user, navigate]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const nextUser = await login(email, password);
      navigate(nextUser.role === "student" ? "/mentorship-portal/submissions" : "/mentorship-portal/admin");
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
    <div className="mentorship-portal relative grid min-h-screen overflow-hidden lg:grid-cols-[1.08fr_0.92fr]">
      <div className="mp-grain absolute inset-0 z-30" />
      <section className="relative hidden min-h-screen overflow-hidden lg:block">
        <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover opacity-45 grayscale" src={robWorking} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/55 to-[#0b0b0a]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent" />
        <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14">
          <PortalMark />
          <div className="max-w-[560px] pb-6">
            <h1 className="mp-display text-[62px] leading-[0.92] text-white xl:text-[76px]">ROB LATE'S PRODUCER MENTORSHIP.</h1>
            <p className="mt-5 max-w-md text-[15px] leading-7 text-white/65">Upload this week's music and pick up Rob's feedback.</p>
            <img src={signature} alt="Rob Late" className="mt-8 h-10 w-auto object-contain opacity-80" />
          </div>
        </div>
      </section>

      <section className="relative z-10 flex min-h-screen items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-[430px]">
          <div className="mb-10 lg:hidden"><PortalMark /></div>
          <div className="mb-8">
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#77766f]">Producer mentorship</div>
            <h2 className="mp-display mt-3 text-[44px] leading-none text-[#f2efe6] sm:text-[52px]">SIGN IN</h2>
            <p className="mt-3 text-sm leading-6 text-[#8f8e85]">Use the email address you joined with.</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-[#bbb8af]">Email address</span>
              <span className="relative block">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6f6e67]" size={17} />
                <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" placeholder="you@email.com" className="mp-focus-ring h-13 w-full rounded-xl border border-white/10 bg-white/[0.035] py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-[#5f5e58] hover:border-white/15" />
              </span>
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-[#bbb8af]">Password</span>
              <span className="relative block">
                <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6f6e67]" size={17} />
                <input value={password} onChange={(event) => setPassword(event.target.value)} type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Your password" className="mp-focus-ring h-13 w-full rounded-xl border border-white/10 bg-white/[0.035] py-3.5 pl-11 pr-12 text-sm text-white placeholder:text-[#5f5e58] hover:border-white/15" />
                <button type="button" onClick={() => setShowPassword((value) => !value)} className="mp-focus-ring absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#77766f] hover:text-white" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>
              </span>
            </label>
            <div className="flex items-center justify-between gap-4 py-1 text-xs">
              <label className="flex cursor-pointer items-center gap-2 text-[#8f8e85]">
                <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="h-4 w-4 accent-white" />
                Keep me signed in
              </label>
              <button type="button" onClick={() => void forgotPassword()} className="mp-focus-ring rounded text-[#c5c1b8] hover:text-white">Forgot password?</button>
            </div>
            {(error || authError) && <div className="rounded-xl border border-red-400/20 bg-red-950/30 px-4 py-3 text-sm text-red-200">{error || authError}</div>}
            <PrimaryButton type="submit" disabled={submitting} className="w-full">
              {submitting ? "Signing in..." : "Sign in"}<ArrowRight size={17} />
            </PrimaryButton>
          </form>

          {import.meta.env.DEV && backend === "demo" && (
            <div className="mt-7 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#77766f]">Local preview</div>
              <p className="mt-1 text-xs text-[#8f8e85]">Load a demo account, then press Sign in.</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => loadDemo("student")} className={cx("mp-focus-ring rounded-lg border px-3 py-2 text-xs font-semibold", email.startsWith("jack") ? "border-white/25 bg-white/[0.08] text-white" : "border-white/[0.08] text-[#aaa99f]")}>Student view</button>
                <button type="button" onClick={() => loadDemo("coach")} className={cx("mp-focus-ring rounded-lg border px-3 py-2 text-xs font-semibold", email.startsWith("rob") ? "border-white/25 bg-white/[0.08] text-white" : "border-white/[0.08] text-[#aaa99f]")}>Rob's view</button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
