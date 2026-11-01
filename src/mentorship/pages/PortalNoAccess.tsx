import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoaderCircle, LogOut, RefreshCw } from "lucide-react";
import { usePortalStore } from "../PortalStore";
import { SUPPORT_EMAIL, describeAuthError } from "../auth";
import { AuthHeading, AuthLayout, AuthNotice, TextButton } from "../components/AuthLayout";
import { PrimaryButton, SecondaryButton } from "../components/PortalUI";

/** Signed in, but there's no place to open. Always offers a way out. */
export function PortalNoAccess() {
  const { accessIssue, retryAccess, logout } = usePortalStore();
  const navigate = useNavigate();
  const [busy, setBusy] = useState<"" | "retry" | "switch" | "sign-out">("");
  const [error, setError] = useState("");
  const loadFailed = accessIssue?.kind === "load-failed";

  const leave = async (intent: "switch" | "sign-out") => {
    setBusy(intent);
    setError("");
    try {
      await logout("local");
      navigate("/mentorship-portal", { replace: true, state: intent === "sign-out" ? { signedOut: true } : {} });
    } catch (reason) {
      setError(describeAuthError(reason, "sign-out").message);
      setBusy("");
    }
  };

  const retry = async () => {
    setBusy("retry");
    setError("");
    try { await retryAccess(); }
    finally { setBusy(""); }
  };

  return (
    <AuthLayout>
      <AuthHeading title={loadFailed ? "We couldn't open your portal" : "We can't find your place yet"}>
        {loadFailed
          ? <p>Something went wrong loading your mentorship. Check your connection and try again. If it keeps happening, email {SUPPORT_EMAIL}.</p>
          : <p>We can't find a place in the mentorship for this email. If you've just paid, it can take a few minutes. Otherwise email {SUPPORT_EMAIL}.</p>}
        {accessIssue?.email && <p className="mp-login-sent-to">Signed in as <strong>{accessIssue.email}</strong></p>}
      </AuthHeading>
      <div className="mp-login-form">
        {error && <AuthNotice tone="error">{error}</AuthNotice>}
        <PrimaryButton onClick={() => void retry()} disabled={Boolean(busy)} className="mp-login-submit">
          {busy === "retry" ? <LoaderCircle size={18} className="animate-spin" aria-hidden="true" /> : <RefreshCw size={18} aria-hidden="true" />}
          {busy === "retry" ? "Checking..." : loadFailed ? "Try again" : "Check again"}
        </PrimaryButton>
        <SecondaryButton onClick={() => void leave("switch")} disabled={Boolean(busy)} className="mp-login-secondary">
          {busy === "switch" ? "Signing out..." : "Try another email"}
        </SecondaryButton>
      </div>
      <div className="mp-login-actions is-single">
        <TextButton onClick={() => void leave("sign-out")} disabled={Boolean(busy)}><LogOut size={16} aria-hidden="true" />{busy === "sign-out" ? "Signing out..." : "Sign out"}</TextButton>
      </div>
    </AuthLayout>
  );
}
