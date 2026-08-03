import { useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePortalStore } from "../PortalStore";
import { PortalMark, PrimaryButton } from "../components/PortalUI";

export function PortalSetPassword() {
  const { setPassword } = usePortalStore();
  const navigate = useNavigate();
  const [password, setPasswordValue] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (password !== confirmation) {
      setError("The passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      await setPassword(password);
      navigate("/mentorship-portal", { replace: true });
    } catch (passwordError) {
      setError(passwordError instanceof Error ? passwordError.message : "Unable to set your password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mentorship-portal grid min-h-screen place-items-center px-5 py-12">
      <div className="w-full max-w-[440px]">
        <PortalMark />
        <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#77766f]">Producer mentorship</div>
          <h1 className="mp-display mt-3 text-[44px] leading-none text-[#f2efe6]">SET YOUR PASSWORD</h1>
          <p className="mt-3 text-sm leading-6 text-[#8f8e85]">Choose it once, then this device can keep you signed in throughout the mentorship.</p>
          <form onSubmit={submit} className="mt-7 space-y-4">
            <label className="block"><span className="mb-2 block text-xs font-semibold text-[#bbb8af]">New password</span><span className="relative block"><LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6f6e67]" size={17} /><input value={password} onChange={(event) => setPasswordValue(event.target.value)} type={showPassword ? "text" : "password"} autoComplete="new-password" className="mp-focus-ring w-full rounded-xl border border-white/10 bg-white/[0.035] py-3.5 pl-11 pr-12 text-sm text-white" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="mp-focus-ring absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#77766f] hover:text-white" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>
            <label className="block"><span className="mb-2 block text-xs font-semibold text-[#bbb8af]">Confirm password</span><span className="relative block"><LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6f6e67]" size={17} /><input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} type={showPassword ? "text" : "password"} autoComplete="new-password" className="mp-focus-ring w-full rounded-xl border border-white/10 bg-white/[0.035] py-3.5 pl-11 pr-4 text-sm text-white" /></span></label>
            {error && <div className="rounded-xl border border-red-400/20 bg-red-950/30 px-4 py-3 text-sm text-red-200">{error}</div>}
            <PrimaryButton type="submit" disabled={submitting} className="w-full">{submitting ? "Saving…" : "Save password"}<ArrowRight size={17} /></PrimaryButton>
          </form>
        </div>
      </div>
    </div>
  );
}
