import { toast } from "sonner";
import { CalendarClock, Check, LoaderCircle, Save } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  createScheduleCall,
  loadCohortSchedule,
  loadScheduleCohorts,
  saveScheduleCall,
  saveScheduleWeek,
  scheduleIsoToLocalInput,
  scheduleLocalInputToIso,
  scheduleLocalPreview,
  type ScheduleCall,
  type ScheduleCohort,
  type ScheduleWeek,
} from "../scheduleAdminApi";

type WeekDraft = { opensAt: string; deadlineAt: string };
type CallDraft = { title: string; startsAt: string; endsAt: string; joinUrl: string; weekId: string };
type NewCallDraft = CallDraft;

const sameWeek = (a: WeekDraft, b: WeekDraft) => a.opensAt === b.opensAt && a.deadlineAt === b.deadlineAt;
const sameCall = (a: CallDraft, b: CallDraft) => a.title === b.title && a.startsAt === b.startsAt && a.endsAt === b.endsAt && a.joinUrl === b.joinUrl && a.weekId === b.weekId;
const localInput = (value: string | null, timezone: string) => scheduleIsoToLocalInput(value, timezone);
const inputToIsoKeepingInstant = (value: string, original: string | null, timezone: string) =>
  original && value === localInput(original, timezone) ? original : scheduleLocalInputToIso(value, timezone);
const preview = (value: string, timezone: string) => {
  if (!value) return "";
  try { return scheduleLocalPreview(value, timezone); }
  catch (reason) { return reason instanceof Error ? reason.message : "Invalid local time."; }
};

function Field({ label, value, onChange, type = "text", placeholder, required = false, hint }: {
  label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string; required?: boolean; hint?: string;
}) {
  return <label className="block min-w-0 space-y-1.5 text-xs font-semibold text-[#aaa99f]">
    <span>{label}</span>
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      required={required}
      className="mp-focus-ring min-h-11 w-full rounded-xl border border-white/10 bg-[#11110f] px-3 text-sm font-medium text-[#f2efe6] placeholder:text-[#66655f]"
    />
    {hint && <span className="block text-[11px] font-normal text-[#77766f]">{hint}</span>}
  </label>;
}

export function AdminSchedule() {
  const [cohorts, setCohorts] = useState<ScheduleCohort[]>([]);
  const [cohortId, setCohortId] = useState("");
  const [weeks, setWeeks] = useState<ScheduleWeek[]>([]);
  const [calls, setCalls] = useState<ScheduleCall[]>([]);
  const [weekDrafts, setWeekDrafts] = useState<Record<string, WeekDraft>>({});
  const [callDrafts, setCallDrafts] = useState<Record<string, CallDraft>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string>();
  const [error, setError] = useState("");
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [addingCall, setAddingCall] = useState(false);
  const [newCall, setNewCall] = useState<NewCallDraft>({ title: "", startsAt: "", endsAt: "", joinUrl: "", weekId: "" });
  const savingRef = useRef(false);
  useEffect(() => { if (error) toast.error(error); }, [error]);

  useEffect(() => {
    let live = true;
    loadScheduleCohorts().then((rows) => {
      if (!live) return;
      setCohorts(rows);
      setCohortId(rows[0]?.id ?? "");
    }).catch((reason: unknown) => {
      if (live) setError(reason instanceof Error ? reason.message : "Unable to load cohorts.");
    }).finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, []);

  useEffect(() => {
    if (!cohortId) {
      setWeeks([]);
      setCalls([]);
      setWeekDrafts({});
      setCallDrafts({});
      return;
    }
    let live = true;
    setLoading(true);
    setError("");
    loadCohortSchedule(cohortId).then(({ weeks: loadedWeeks, calls: loadedCalls }) => {
      if (!live) return;
      setWeeks(loadedWeeks);
      setCalls(loadedCalls);
      const timezone = cohorts.find((item) => item.id === cohortId)?.timezone ?? "UTC";
      setWeekDrafts(Object.fromEntries(loadedWeeks.map((week) => [week.id, { opensAt: localInput(week.opensAt, timezone), deadlineAt: localInput(week.deadlineAt, timezone) }])));
      setCallDrafts(Object.fromEntries(loadedCalls.map((call) => [call.id, { title: call.title, startsAt: localInput(call.startsAt, timezone), endsAt: localInput(call.endsAt, timezone), joinUrl: call.joinUrl, weekId: call.weekId ?? "" }])));
      setSaved({});
    }).catch((reason: unknown) => {
      if (live) setError(reason instanceof Error ? reason.message : "Unable to load this cohort schedule.");
    }).finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, [cohortId, cohorts]);

  const cohort = useMemo(() => cohorts.find((item) => item.id === cohortId), [cohorts, cohortId]);

  async function saveWeek(week: ScheduleWeek) {
    if (savingRef.current || !cohort) return;
    const draft = weekDrafts[week.id];
    if (!draft) return;
    let opensAt: string | null;
    let deadlineAt: string | null;
    try {
      opensAt = inputToIsoKeepingInstant(draft.opensAt, week.opensAt, cohort.timezone);
      deadlineAt = inputToIsoKeepingInstant(draft.deadlineAt, week.deadlineAt, cohort.timezone);
      if (opensAt && deadlineAt && Date.parse(deadlineAt) <= Date.parse(opensAt)) {
        setError("The submission deadline must be after the week opens."); return;
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Enter valid cohort-local dates and times."); return;
    }
    const key = `week:${week.id}`;
    savingRef.current = true;
    setSaving(key); setError(""); setSaved((current) => ({ ...current, [key]: false }));
    try {
      await saveScheduleWeek(week.id, { opensAt, deadlineAt });
      const refreshed = { ...week, opensAt, deadlineAt };
      setWeeks((current) => current.map((item) => item.id === week.id ? refreshed : item));
      setSaved((current) => ({ ...current, [key]: true }));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : `Week ${week.number} could not be saved.`);
    } finally { setSaving(undefined); savingRef.current = false; }
  }

  async function saveCall(call: ScheduleCall) {
    if (savingRef.current || !cohort) return;
    const draft = callDrafts[call.id];
    if (!draft || !draft.title.trim() || !draft.startsAt || !draft.endsAt) return;
    let start: string | null;
    let end: string | null;
    try {
      start = inputToIsoKeepingInstant(draft.startsAt, call.startsAt, cohort.timezone);
      end = inputToIsoKeepingInstant(draft.endsAt, call.endsAt, cohort.timezone);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Enter valid cohort-local dates and times."); return;
    }
    if (!start || !end || !Number.isFinite(Date.parse(start)) || !Number.isFinite(Date.parse(end)) || Date.parse(end) <= Date.parse(start)) {
      setError("A call end time must be later than its start time."); return;
    }
    if (draft.joinUrl.trim()) {
      try { if (new URL(draft.joinUrl).protocol !== "https:") throw new Error(); }
      catch { setError("Use a valid HTTPS join link, or leave the field empty."); return; }
    }
    const key = `call:${call.id}`;
    savingRef.current = true;
    setSaving(key); setError(""); setSaved((current) => ({ ...current, [key]: false }));
    try {
      await saveScheduleCall(call, { title: draft.title, startsAt: start, endsAt: end, joinUrl: draft.joinUrl, weekId: draft.weekId || null });
      setCalls((current) => current.map((item) => item.id === call.id ? { ...item, title: draft.title, startsAt: start!, endsAt: end, joinUrl: draft.joinUrl, weekId: draft.weekId || null } : item));
      setSaved((current) => ({ ...current, [key]: true }));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The call could not be saved.");
    } finally { setSaving(undefined); savingRef.current = false; }
  }

  async function addCall() {
    if (savingRef.current || !cohort || !newCall.title.trim() || !newCall.startsAt || !newCall.endsAt) return;
    let startsAt: string | null;
    let endsAt: string | null;
    try {
      startsAt = scheduleLocalInputToIso(newCall.startsAt, cohort.timezone);
      endsAt = scheduleLocalInputToIso(newCall.endsAt, cohort.timezone);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Enter valid cohort-local dates and times."); return;
    }
    if (!startsAt || !endsAt || Date.parse(endsAt) <= Date.parse(startsAt)) {
      setError("Enter a valid call start and an end time later than the start."); return;
    }
    if (newCall.joinUrl.trim()) {
      try { if (new URL(newCall.joinUrl).protocol !== "https:") throw new Error(); }
      catch { setError("Use a valid HTTPS join link, or leave the field empty."); return; }
    }
    savingRef.current = true;
    setSaving("new-call"); setError("");
    try {
      const id = await createScheduleCall(cohortId, { ...newCall, startsAt, endsAt, weekId: newCall.weekId || null });
      const addedCall: ScheduleCall = { id, title: newCall.title.trim(), startsAt, endsAt, weekId: newCall.weekId || null, joinUrl: newCall.joinUrl.trim() };
      setCalls((current) => [...current, addedCall].sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt)));
      setCallDrafts((current) => ({ ...current, [id]: { ...newCall, title: newCall.title.trim() } }));
      setNewCall({ title: "", startsAt: "", endsAt: "", joinUrl: "", weekId: "" });
      setAddingCall(false);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The group call could not be created.");
    } finally { setSaving(undefined); savingRef.current = false; }
  }

  return <div className="mx-auto max-w-[1180px] px-4 py-8 sm:px-7 lg:px-10 lg:py-12">
    <header className="max-w-2xl">
      <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#77766f]">Staff tools</p>
      <h1 className="mp-display mt-2 text-[46px] leading-none text-[#f1eee6] sm:text-[58px]">COHORT CALENDAR</h1>
      <p className="mt-4 text-sm leading-6 text-[#8f8e85]">Set each week's release and submission deadline, then update or add group calls. Date and time fields use the selected cohort's timezone.</p>
    </header>

    {error && <div role="alert" className="mt-6 rounded-xl border border-red-300/20 bg-red-950/20 p-4 text-sm text-red-200">{error}</div>}
    {loading && <div className="mt-8 flex items-center gap-2 text-sm text-[#aaa99f]"><LoaderCircle className="animate-spin" size={16} />Loading schedule…</div>}
    {!loading && cohorts.length === 0 && <div className="mp-card mt-8 rounded-2xl p-6 text-sm text-[#aaa99f]">No active or draft cohorts are available to your account.</div>}

    {!loading && cohort && <fieldset disabled={Boolean(saving)} className="min-w-0">
      <div className="mp-card mt-7 flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="block space-y-1.5 text-xs font-semibold text-[#aaa99f]" htmlFor="schedule-cohort">Cohort</label>
        <select id="schedule-cohort" value={cohortId} disabled={Boolean(saving)} onChange={(event) => setCohortId(event.target.value)} className="mp-focus-ring min-h-11 w-full rounded-xl border border-white/10 bg-[#11110f] px-3 text-sm text-[#f2efe6] disabled:opacity-50 sm:max-w-sm">
          {cohorts.map((item) => <option key={item.id} value={item.id}>{item.displayName}</option>)}
        </select>
      </div>
      <p className="mt-3 text-xs text-[#77766f]">Enter times in {cohort.timezone}. Students see the same events in their own timezone.</p>

      <section className="mt-8" aria-labelledby="week-schedule-heading">
        <div className="mb-4 flex items-center gap-2 text-[#dedbd2]"><CalendarClock size={17} /><h2 id="week-schedule-heading" className="text-sm font-bold">Weekly release and deadlines</h2></div>
        {weeks.length === 0 && <div className="mp-card rounded-2xl p-5 text-sm text-[#8f8e85]">No weeks have been set up for this cohort yet.</div>}
        <div className="space-y-3">{weeks.map((week) => {
          const draft = weekDrafts[week.id] ?? { opensAt: "", deadlineAt: "" };
          const original = { opensAt: localInput(week.opensAt, cohort.timezone), deadlineAt: localInput(week.deadlineAt, cohort.timezone) };
          const key = `week:${week.id}`;
          const dirty = !sameWeek(draft, original);
          return <article key={week.id} className="mp-card grid gap-4 rounded-2xl p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:p-5">
            <div><h3 className="mb-3 text-sm font-bold text-[#f2efe6]">Week {week.number}</h3><div className="grid gap-3 sm:grid-cols-2">
              <Field label={`Opens at (${cohort.timezone})`} type="datetime-local" value={draft.opensAt} hint={draft.opensAt ? `Local time: ${preview(draft.opensAt, cohort.timezone)}` : "Not set"} onChange={(value) => setWeekDrafts((current) => ({ ...current, [week.id]: { ...draft, opensAt: value } }))} />
              <Field label={`Submission deadline (${cohort.timezone})`} type="datetime-local" value={draft.deadlineAt} hint={draft.deadlineAt ? `Local time: ${preview(draft.deadlineAt, cohort.timezone)}` : "Not set"} onChange={(value) => setWeekDrafts((current) => ({ ...current, [week.id]: { ...draft, deadlineAt: value } }))} />
            </div></div>
            <button type="button" onClick={() => void saveWeek(week)} disabled={!dirty || Boolean(saving)} className="mp-focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-bold text-[#11110f] disabled:cursor-not-allowed disabled:opacity-40">{saving === key ? <LoaderCircle size={15} className="animate-spin" /> : saved[key] && !dirty ? <Check size={15} /> : <Save size={15} />}{saving === key ? "Saving…" : saved[key] && !dirty ? "Saved" : "Save week"}</button>
          </article>;
        })}</div>
      </section>

      <section className="mt-9" aria-labelledby="group-calls-heading">
        <div className="mb-4 flex items-center gap-2 text-[#dedbd2]"><CalendarClock size={17} /><h2 id="group-calls-heading" className="text-sm font-bold">Group calls</h2></div>
        {calls.length === 0 && <div className="mp-card rounded-2xl p-5 text-sm text-[#8f8e85]">No group calls are scheduled yet. Nothing has been added.</div>}
        <div className="space-y-3">{calls.map((call) => {
          const draft = callDrafts[call.id] ?? { title: call.title, startsAt: "", endsAt: "", joinUrl: call.joinUrl, weekId: call.weekId ?? "" };
          const original = { title: call.title, startsAt: localInput(call.startsAt, cohort.timezone), endsAt: localInput(call.endsAt, cohort.timezone), joinUrl: call.joinUrl, weekId: call.weekId ?? "" };
          const key = `call:${call.id}`;
          const dirty = !sameCall(draft, original);
          const linkedWeek = weeks.find((week) => week.id === call.weekId);
          return <article key={call.id} className="mp-card rounded-2xl p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><h3 className="text-sm font-bold text-[#f2efe6]">{linkedWeek ? `Week ${linkedWeek.number}` : "Not linked to a week"}</h3></div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Call title" value={draft.title} required onChange={(value) => setCallDrafts((current) => ({ ...current, [call.id]: { ...draft, title: value } }))} />
              <Field label="Join link (HTTPS)" value={draft.joinUrl} placeholder="https://…" onChange={(value) => setCallDrafts((current) => ({ ...current, [call.id]: { ...draft, joinUrl: value } }))} />
              <Field label={`Starts at (${cohort.timezone})`} type="datetime-local" value={draft.startsAt} hint={draft.startsAt ? `Local time: ${preview(draft.startsAt, cohort.timezone)}` : ""} required onChange={(value) => setCallDrafts((current) => ({ ...current, [call.id]: { ...draft, startsAt: value } }))} />
              <Field label={`Ends at (${cohort.timezone})`} type="datetime-local" value={draft.endsAt} hint={draft.endsAt ? `Local time: ${preview(draft.endsAt, cohort.timezone)}` : ""} required onChange={(value) => setCallDrafts((current) => ({ ...current, [call.id]: { ...draft, endsAt: value } }))} />
              <label className="block space-y-1.5 text-xs font-semibold text-[#aaa99f]">Week (optional)<select value={draft.weekId} onChange={(event) => setCallDrafts((current) => ({ ...current, [call.id]: { ...draft, weekId: event.target.value } }))} className="mp-focus-ring min-h-11 w-full rounded-xl border border-white/10 bg-[#11110f] px-3 text-sm font-medium text-[#f2efe6]"><option value="">Not linked to a week</option>{weeks.map((week) => <option key={week.id} value={week.id}>Week {week.number}</option>)}</select></label>
            </div>
            <div className="mt-4 flex justify-end"><button type="button" onClick={() => void saveCall(call)} disabled={!dirty || Boolean(saving) || !draft.title.trim() || !draft.startsAt || !draft.endsAt} className="mp-focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-bold text-[#11110f] disabled:cursor-not-allowed disabled:opacity-40">{saving === key ? <LoaderCircle size={15} className="animate-spin" /> : saved[key] && !dirty ? <Check size={15} /> : <Save size={15} />}{saving === key ? "Saving…" : saved[key] && !dirty ? "Saved" : "Save call"}</button></div>
          </article>;
        })}</div>
        <div className="mt-4">{!addingCall ? <button type="button" onClick={() => { setNewCall({ title: "", startsAt: "", endsAt: "", joinUrl: "", weekId: "" }); setAddingCall(true); }} className="mp-focus-ring min-h-11 rounded-xl border border-white/15 px-4 text-sm font-semibold text-[#e2dfd6] hover:bg-white/[0.05]">Add group call</button> : <article className="mp-card rounded-2xl p-4 sm:p-5">
          <h3 className="mb-4 text-sm font-bold text-[#f2efe6]">New group call</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Call title" value={newCall.title} required onChange={(value) => setNewCall((current) => ({ ...current, title: value }))} />
            <Field label="Join link (HTTPS), optional" value={newCall.joinUrl} placeholder="https://…" onChange={(value) => setNewCall((current) => ({ ...current, joinUrl: value }))} />
            <Field label={`Starts at (${cohort.timezone})`} type="datetime-local" value={newCall.startsAt} required hint={newCall.startsAt ? `Local time: ${preview(newCall.startsAt, cohort.timezone)}` : ""} onChange={(value) => setNewCall((current) => ({ ...current, startsAt: value }))} />
            <Field label={`Ends at (${cohort.timezone})`} type="datetime-local" value={newCall.endsAt} required hint={newCall.endsAt ? `Local time: ${preview(newCall.endsAt, cohort.timezone)}` : ""} onChange={(value) => setNewCall((current) => ({ ...current, endsAt: value }))} />
            <label className="block space-y-1.5 text-xs font-semibold text-[#aaa99f]">Week (optional)<select value={newCall.weekId} onChange={(event) => setNewCall((current) => ({ ...current, weekId: event.target.value }))} className="mp-focus-ring min-h-11 w-full rounded-xl border border-white/10 bg-[#11110f] px-3 text-sm font-medium text-[#f2efe6]"><option value="">Not linked to a week</option>{weeks.map((week) => <option key={week.id} value={week.id}>Week {week.number}</option>)}</select></label>
          </div>
          <div className="mt-4 flex justify-end gap-2"><button type="button" onClick={() => setAddingCall(false)} disabled={Boolean(saving)} className="mp-focus-ring min-h-11 rounded-xl px-4 text-sm font-semibold text-[#aaa99f]">Cancel</button><button type="button" onClick={() => void addCall()} disabled={Boolean(saving) || !newCall.title.trim() || !newCall.startsAt || !newCall.endsAt} className="mp-focus-ring inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm font-bold text-[#11110f] disabled:cursor-not-allowed disabled:opacity-40">{saving === "new-call" ? <LoaderCircle size={15} className="animate-spin" /> : <Save size={15} />}{saving === "new-call" ? "Saving…" : "Save new call"}</button></div>
        </article>}</div>
      </section>
    </fieldset>}
  </div>;
}
