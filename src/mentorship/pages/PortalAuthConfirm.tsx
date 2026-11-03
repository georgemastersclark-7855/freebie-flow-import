import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { usePortalStore } from "../PortalStore";
import { purposeForLink, readAuthUrl } from "../auth";
import { AuthHeading, AuthLayout, AuthNotice } from "../components/AuthLayout";
import { EmailCodeFlow } from "../components/EmailCodeFlow";
import { PrimaryButton } from "../components/PortalUI";

type Phase = "checking" | "ready" | "verifying" | "expired" | "request";

/**
 * Where emailed links land (the emails carry a code and a link). The token is only
 * used when the student taps the button, so email security scanners that open
 * links in advance can't spend it. Then they choose their password.
 */
export function PortalAuthConfirm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyEmailLink, hasAuthSession, queuePasswordStep } = usePortalStore();
  const [link] = useState(() => readAuthUrl(location.search, location.hash));
  const [phase, setPhase] = useState<Phase>(() => (link.tokenHash && !link.error ? "ready" : "checking"));
  const purpose = purposeForLink(link.type);

  // Error details stay out of the address bar once read.
  useEffect(() => {
    if (link.error) navigate(location.pathname, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Older links arrive already signed in (#access_token=...), and Supabase reads
  // them on load: those go on to choose a password. A used or expired link from
  // someone who is already signed in (a second tap) just opens the portal.
  // Anyone else can ask for a fresh email.
  useEffect(() => {
    if (phase !== "checking") return;
    let active = true;
    void hasAuthSession().then((signedIn) => {
      if (!active) return;
      if (signedIn && link.hasSessionTokens && !link.error) {
        queuePasswordStep(purpose);
        navigate("/mentorship-portal/set-password", { replace: true });
      } else if (signedIn) {
        navigate("/mentorship-portal", { replace: true });
      } else {
        setPhase(link.error || link.hasSessionTokens ? "expired" : "request");
      }
    }).catch(() => { if (active) setPhase("request"); });
    return () => { active = false; };
  }, [phase, hasAuthSession, navigate, purpose, queuePasswordStep, link.hasSessionTokens]);

  const continueToPortal = async () => {
    if (!link.tokenHash) return;
    setPhase("verifying");
    try {
      await verifyEmailLink(link.tokenHash, link.type);
      // The portal home routes on: to the password screen, or to "no place found".
      navigate("/mentorship-portal", { replace: true });
    } catch {
      navigate(location.pathname, { replace: true });
      setPhase("expired");
    }
  };

  if (phase === "checking") {
    return (
      <AuthLayout>
        <AuthHeading title="Checking your link">
          <p className="mp-login-checking"><LoaderCircle size={16} className="animate-spin" aria-hidden="true" />One moment.</p>
        </AuthHeading>
      </AuthLayout>
    );
  }

  if (phase === "ready" || phase === "verifying") {
    const reset = purpose === "reset";
    return (
      <AuthLayout>
        <AuthHeading title={reset ? "Reset your password" : "You're nearly in"}>
          <p>{reset ? "Tap the button, then choose a new password." : "Tap the button, then choose your password."}</p>
        </AuthHeading>
        <div className="mp-login-form">
          <PrimaryButton onClick={() => void continueToPortal()} disabled={phase === "verifying"} className="mp-login-submit">
            {phase === "verifying"
              ? <><LoaderCircle size={18} className="animate-spin" aria-hidden="true" />Checking your link...</>
              : <>{reset ? "Continue to reset your password" : "Continue to your portal"}<ArrowRight size={18} aria-hidden="true" /></>}
          </PrimaryButton>
        </div>
        <p className="mp-login-help mt-4">This extra tap stops email scanners from using up your link before you do.</p>
      </AuthLayout>
    );
  }

  const expired = phase === "expired";
  return (
    <AuthLayout below={<Link to="/mentorship-portal" className="mp-focus-ring mp-login-back">Back to sign in</Link>}>
      <EmailCodeFlow
        purpose={purpose}
        title={expired ? "That link has expired" : undefined}
        intro={expired ? <p>That link has expired or was already used. Enter your email and we'll send a fresh one.</p> : undefined}
        notice={expired ? <AuthNotice tone="success">Once you've used the new link, you can choose your password straight away.</AuthNotice> : undefined}
        onVerified={() => navigate("/mentorship-portal", { replace: true })}
      />
    </AuthLayout>
  );
}
