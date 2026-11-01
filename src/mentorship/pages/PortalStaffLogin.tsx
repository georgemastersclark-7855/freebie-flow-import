import { useState } from "react";
import { Link } from "react-router-dom";
import { usePortalStore } from "../PortalStore";
import { nextStaffStep, type StaffSignInStep } from "../staffAuth";
import { AuthHeading, AuthLayout, PortalLoading } from "../components/AuthLayout";
import { EmailCodeFlow } from "../components/EmailCodeFlow";
import { PasswordSignIn } from "../components/PasswordSignIn";
import { SignedInHome } from "../components/SignedInHome";
import { PortalNoAccess } from "./PortalNoAccess";

/** The team entrance. Role checks still happen on the server for every request. */
export function PortalStaffLogin() {
  const { user, ready, accessIssue, backend } = usePortalStore();
  const [step, setStep] = useState<StaffSignInStep>({ kind: "password" });
  const [resetting, setResetting] = useState(false);
  const [email, setEmail] = useState("");
  const [formKey, setFormKey] = useState(0);

  if (!ready) return <PortalLoading />;
  if (accessIssue) return <PortalNoAccess />;
  // Anyone already signed in goes on: staff to the staff dashboard, a student who
  // found this page to their portal, and anyone mid-reset to the password screen.
  if (user) return <SignedInHome />;

  const fillDemo = (value: string) => { setEmail(value); setResetting(false); setFormKey((key) => key + 1); };

  return (
    <AuthLayout below={import.meta.env.DEV && backend === "demo" && (
      <details className="mp-login-demo">
        <summary className="mp-focus-ring">Preview accounts</summary>
        <p>Fill an email, type any password, then press Sign in.</p>
        <div className="mp-login-demo-buttons">
          <button type="button" onClick={() => fillDemo("rob@demo.com")} className="mp-focus-ring">Rob (coach)</button>
          <button type="button" onClick={() => fillDemo("george@demo.com")} className="mp-focus-ring">George (admin)</button>
        </div>
      </details>
    )}>
      {resetting ? (
        <EmailCodeFlow purpose="reset" initialEmail={email} sendOnStart onBack={(value) => { setEmail(value); setResetting(false); }} />
      ) : step.kind === "password" ? (
        <PasswordSignIn
          key={formKey}
          title="Team sign-in"
          intro={<p>For Rob and the mentorship team. Student? <Link to="/mentorship-portal" className="mp-focus-ring mp-login-inline-link">Sign in here</Link>.</p>}
          initialEmail={email}
          onEmailChange={setEmail}
          onForgotPassword={(value) => { setEmail(value); setResetting(true); }}
          onSignedIn={async () => setStep(await nextStaffStep(step))}
        />
      ) : (
        <AuthHeading title="Signing you in" />
      )}
    </AuthLayout>
  );
}
