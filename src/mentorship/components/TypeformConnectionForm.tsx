import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

type TypeformConnectionFormProps = {
  cohortId: string;
  onConnected: () => void | Promise<void>;
};

const DEFAULT_FORM_ID = "EpLfx77a";

async function safeErrorMessage(error: unknown, apiKey: string): Promise<string> {
  const generic = "We couldn't connect this Typeform. Check the form ID and token, then try again.";
  if (!error || typeof error !== "object" || !("context" in error)) return generic;

  const context = error.context;
  if (!(context instanceof Response)) return generic;

  // Function errors expose a Response in `context`; read only its documented
  // public error field and never surface arbitrary response or client details.
  return context.clone().json().then((body: unknown) => {
    if (!body || typeof body !== "object" || !("error" in body) || typeof body.error !== "string") return generic;
    const message = body.error.trim();
    if (!message || (apiKey && message.includes(apiKey))) return generic;
    return message;
  }).catch(() => generic);
}

export function TypeformConnectionForm({ cohortId, onConnected }: TypeformConnectionFormProps) {
  const [formId, setFormId] = useState(DEFAULT_FORM_ID);
  const [apiKey, setApiKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    setConnected(false);
    const submittedKey = apiKey;
    setApiKey("");

    try {
      const { data, error: invokeError } = await supabase.functions.invoke("connect-mentorship-typeform", {
        body: { form_id: formId.trim(), api_key: submittedKey, cohort_id: cohortId },
      });
      if (invokeError) {
        setError(await safeErrorMessage(invokeError, submittedKey));
        return;
      }
      if (!data?.ok) { setError("The connection wasn't confirmed. Please try again."); return; }
      setConnected(true);
      try { await onConnected(); } catch { setError("Typeform connected, but the cohort view couldn't refresh. Close and reopen this panel to see the latest status."); }
    } catch {
      setError("The connection could not be confirmed. Please retry.");
    } finally {
      setApiKey("");
      setBusy(false);
    }
  }

  return <section>
    <p>Connect the Typeform used for new mentorship applications. New completed applications will appear in the same contact record when the applicant’s email matches. Existing applications stay in Typeform.</p>
    <p>Before promoting this form, update its founding-cohort price to $2,497.</p>
    <p>Create a Typeform personal access token with <strong>forms:read</strong> and <strong>webhooks:read/write</strong> access in <a href="https://admin.typeform.com/user/tokens" target="_blank" rel="noreferrer">Typeform’s token settings</a>.</p>

    <form className="ss-form" onSubmit={submit}>
      <fieldset disabled={busy} className="contents">
        <label className="ss-field">
          Typeform form ID
          <input type="text" value={formId} onChange={event => setFormId(event.target.value)} required autoComplete="off" spellCheck={false} />
        </label>
        <label className="ss-field">
          Typeform access token
          <input type="password" value={apiKey} onChange={event => setApiKey(event.target.value)} required autoComplete="new-password" spellCheck={false} />
          <span>Your token is sent securely to connect the form and is not saved in this screen.</span>
        </label>
      </fieldset>
      {error && <p className="ss-error" role="alert">{error}</p>}
      {connected && <p className="ss-muted" role="status">Typeform connected. New completed applications will appear in the same contact by email.</p>}
      <button className="ss-button ss-primary" type="submit" disabled={busy || !formId.trim() || !apiKey.trim()}>
        {busy ? "Connecting…" : "Connect Typeform"}
      </button>
    </form>
  </section>;
}
