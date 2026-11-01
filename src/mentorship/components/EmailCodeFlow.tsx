import { useEffect, useRef, useState, type ClipboardEvent, type FormEvent, type ReactNode } from "react";
import { ArrowRight, KeyRound, LoaderCircle, Mail } from "lucide-react";
import { usePortalStore } from "../PortalStore";
import {
  CODE_LENGTH,
  NEUTRAL_CODE_MESSAGE,
  RESEND_SECONDS,
  describeAuthError,
  digitsOnly,
  isValidEmail,
  normalizeEmail,
  pendingCode,
  startResendCooldown,
  type CodeChannel,
  type PasswordPurpose,
} from "../auth";
import { PrimaryButton } from "./PortalUI";
import { AuthHeading, AuthNotice, TextButton } from "./AuthLayout";

const copy: Record<PasswordPurpose, { title: string; intro: string }> = {
  setup: { title: "Set up your login", intro: "Enter the email you paid with. We'll email you a code to confirm it's you, then you choose a password." },
  reset: { title: "Reset your password", intro: "Enter the email you paid with. We'll email you a code, then you choose a new password." },
};

interface EmailCodeFlowProps {
  purpose: PasswordPurpose;
  title?: string;
  intro?: ReactNode;
  /** Shown above the email field, e.g. to explain an expired link. */
  notice?: ReactNode;
  initialEmail?: string;
  /** Send the code straight away for this email (Forgot password with the email filled in). */
  sendOnStart?: boolean;
  /** Renders "Back to sign in" when provided. */
  onBack?: (email: string) => void;
  /** Runs once the code is accepted; the password screen comes next. */
  onVerified?: () => void;
}

/**
 * Proves the student owns the email with a one-time 6-digit code, for setting up
 * or resetting a login. The same neutral message shows whether or not the email
 * has an account, so the page never reveals who is enrolled.
 */
export function EmailCodeFlow({ purpose, title, intro, notice, initialEmail = "", sendOnStart = false, onBack, onVerified }: EmailCodeFlowProps) {
  const { sendEmailCode, verifyEmailCode, backend } = usePortalStore();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState(initialEmail);
  const [channel, setChannel] = useState<CodeChannel>(purpose === "setup" ? "email" : "recovery");
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(sendOnStart);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [resent, setResent] = useState(false);
  const [resendAt, setResendAt] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const emailInput = useRef<HTMLInputElement>(null);
  const codeInput = useRef<HTMLInputElement>(null);
  const lastTried = useRef("");
  const mounted = useRef(true);
  const started = useRef(false);
  useEffect(() => () => { mounted.current = false; }, []);

  const secondsLeft = Math.max(0, Math.ceil((resendAt - now) / 1000));

  useEffect(() => {
    if (resendAt <= Date.now()) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [resendAt]);

  useEffect(() => {
    if (step === "code") codeInput.current?.focus();
  }, [step]);

  const showCodeStep = (sentBy: CodeChannel, seconds: number, rememberCooldown: boolean) => {
    if (rememberCooldown) startResendCooldown(email, purpose, sentBy, seconds);
    setChannel(sentBy);
    setNow(Date.now());
    setResendAt(Date.now() + seconds * 1000);
    setStep("code");
  };

  const send = async (mode: "first" | "resend") => {
    const address = normalizeEmail(email);
    setError("");
    setResent(false);
    if (!isValidEmail(address)) {
      setError("Enter the email you paid with, like name@example.com.");
      setStep("email");
      window.setTimeout(() => emailInput.current?.focus(), 0);
      return;
    }
    // Inside the cooldown a code is already on its way, so go straight to it.
    // The portal never asks Supabase twice in a row, which would hint whether
    // the email has an account.
    const pending = pendingCode(address, purpose);
    if (pending) {
      if (mode === "resend") setError(`Please wait ${pending.seconds} seconds before asking for another code.`);
      showCodeStep(pending.channel, pending.seconds, false);
      return;
    }
    const fallbackChannel: CodeChannel = purpose === "setup" ? "email" : "recovery";
    setSending(true);
    try {
      const sentBy = await sendEmailCode(address, purpose);
      showCodeStep(sentBy, RESEND_SECONDS, true);
      if (mode === "resend") setResent(true);
    } catch (reason) {
      const problem = describeAuthError(reason, purpose === "setup" ? "send-code" : "reset");
      if (problem.kind === "no-account") {
        // Unknown emails look exactly like known ones.
        showCodeStep(fallbackChannel, RESEND_SECONDS, true);
        if (mode === "resend") setResent(true);
      } else if (problem.kind === "rate-limit" && problem.waitSeconds) {
        showCodeStep(fallbackChannel, problem.waitSeconds, true);
        if (mode === "resend") setError(problem.message);
      } else {
        setError(problem.message);
        if (mode === "first") { setStep("email"); window.setTimeout(() => emailInput.current?.focus(), 0); }
      }
    } finally {
      if (mounted.current) setSending(false);
    }
  };

  useEffect(() => {
    if (!sendOnStart || started.current) return;
    started.current = true;
    void send("first");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verify = async (value: string) => {
    if (verifying) return;
    if (value.length !== CODE_LENGTH) {
      setError(`Enter the ${CODE_LENGTH}-digit code from your email.`);
      codeInput.current?.focus();
      return;
    }
    lastTried.current = value;
    setError("");
    setResent(false);
    setVerifying(true);
    try {
      await verifyEmailCode(normalizeEmail(email), value, channel, purpose);
      onVerified?.();
    } catch (reason) {
      if (!mounted.current) return;
      setError(describeAuthError(reason, "verify-code").message);
      setCode("");
      setVerifying(false);
      codeInput.current?.focus();
    }
  };

  // Continue as soon as the last digit lands, whether typed, pasted or autofilled.
  useEffect(() => {
    if (step === "code" && code.length === CODE_LENGTH && code !== lastTried.current) void verify(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, step]);

  const pasteCode = (event: ClipboardEvent<HTMLInputElement>) => {
    const text = event.clipboardData.getData("text");
    const found = text.match(/\b\d{6}\b/)?.[0] ?? digitsOnly(text);
    if (!found) return;
    event.preventDefault();
    setCode(digitsOnly(found));
  };

  const changeEmail = () => {
    setStep("email");
    setCode("");
    setError("");
    setResent(false);
    lastTried.current = "";
    window.setTimeout(() => { emailInput.current?.focus(); emailInput.current?.select(); }, 0);
  };

  const back = onBack && (
    <div className="mp-login-actions is-single">
      <TextButton onClick={() => onBack(email)} disabled={verifying}>Back to sign in</TextButton>
    </div>
  );

  if (step === "email" && sending && sendOnStart && !error) {
    return (
      <AuthHeading title={copy[purpose].title}>
        <p className="mp-login-checking"><LoaderCircle size={16} className="animate-spin" aria-hidden="true" />Sending your code...</p>
      </AuthHeading>
    );
  }

  if (step === "code") {
    return (
      <>
        <AuthHeading title="Check your email">
          <p>{NEUTRAL_CODE_MESSAGE}</p>
          <p className="mp-login-sent-to">Sent to <strong>{normalizeEmail(email)}</strong></p>
        </AuthHeading>
        <form onSubmit={(event: FormEvent) => { event.preventDefault(); void verify(code); }} className="mp-login-form" noValidate>
          <label className="mp-login-field">
            <span className="mp-login-label">{CODE_LENGTH}-digit code</span>
            <span className="mp-login-input-wrap">
              <KeyRound className="mp-login-input-icon" size={18} aria-hidden="true" />
              <input
                ref={codeInput}
                value={code}
                onChange={(event) => { setCode(digitsOnly(event.target.value)); if (error) setError(""); }}
                onPaste={pasteCode}
                name="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
                enterKeyHint="go"
                spellCheck={false}
                placeholder={"0".repeat(CODE_LENGTH)}
                aria-describedby="portal-code-help"
                aria-invalid={Boolean(error) || undefined}
                readOnly={verifying}
                className="mp-focus-ring mp-login-input mp-login-code-input"
              />
            </span>
            <span id="portal-code-help" className="mp-login-help">Can't see it? Check spam or promotions. It can take a minute to arrive.</span>
          </label>
          {error && <AuthNotice tone="error">{error}</AuthNotice>}
          {resent && !error && <AuthNotice tone="success">We've sent a new code. Use the one in the newest email.</AuthNotice>}
          <PrimaryButton type="submit" disabled={verifying} className="mp-login-submit">
            {verifying ? <><LoaderCircle size={18} className="animate-spin" aria-hidden="true" />Checking your code...</> : <>Continue<ArrowRight size={18} aria-hidden="true" /></>}
          </PrimaryButton>
        </form>
        <div className="mp-login-actions">
          <TextButton onClick={() => void send("resend")} disabled={sending || verifying || secondsLeft > 0}>
            {sending ? "Sending..." : secondsLeft > 0 ? <>Resend code in <span className="tabular-nums">{secondsLeft}s</span></> : "Resend code"}
          </TextButton>
          <TextButton onClick={changeEmail} disabled={verifying}>Use a different email</TextButton>
        </div>
        {back}
        {backend === "demo" && <p className="mp-login-demo-hint">Preview: any 6 digits works. 000000 shows the expired-code message.</p>}
      </>
    );
  }

  return (
    <>
      <AuthHeading title={title ?? copy[purpose].title}>{intro ?? <p>{copy[purpose].intro}</p>}</AuthHeading>
      {notice && <div className="mt-5">{notice}</div>}
      <form onSubmit={(event: FormEvent) => { event.preventDefault(); void send("first"); }} className="mp-login-form" noValidate>
        <label className="mp-login-field">
          <span className="mp-login-label">Email address</span>
          <span className="mp-login-input-wrap">
            <Mail className="mp-login-input-icon" size={18} aria-hidden="true" />
            <input
              ref={emailInput}
              value={email}
              onChange={(event) => { setEmail(event.target.value); if (error) setError(""); }}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="send"
              autoFocus
              placeholder="you@email.com"
              aria-invalid={Boolean(error) || undefined}
              className="mp-focus-ring mp-login-input"
            />
          </span>
        </label>
        {error && <AuthNotice tone="error">{error}</AuthNotice>}
        <PrimaryButton type="submit" disabled={sending} className="mp-login-submit">
          {sending ? <><LoaderCircle size={18} className="animate-spin" aria-hidden="true" />Sending your code...</> : <>Email me a code<ArrowRight size={18} aria-hidden="true" /></>}
        </PrimaryButton>
      </form>
      {back}
    </>
  );
}
