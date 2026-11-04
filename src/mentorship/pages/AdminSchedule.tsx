import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, Info, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import {
  ApplicationCloseError, loadApplicationClose, loadCohortSchedule, loadScheduleCohorts, saveCohortDates, saveSchedulePlan, setApplicationClose,
  type ApplicationCloseStatus, type ScheduleCohort, type ScheduleSnapshot,
} from "../scheduleAdminApi";
import {
  addDays, buildPlannerPlan, dayLabel, draftFromSnapshot, isDay, monthsLabel, planChanges, plannerEvents, plannerRange, planWarnings, sameDraft,
  ukDay, ukInputToIso, ukMoment, ukTimeLabel, ukToday, plannerFilters, PLAN_ZONE, PLANNED_CALLS,
  type Day, type PlannerDraft, type PlannerEventType,
} from "../cohortPlan";
import { editCallDates, editWeekDates, localDifference } from "../schedulePattern";
import { loadSalesEmails, type SalesEmail } from "../salesEmailsApi";
import { CohortPlannerCalendar, type CallEditValues, type PlannerZone, type WeekEditValues } from "../components/CohortPlannerCalendar";
import { TimezoneSelect } from "../components/ScheduleTimezone";
import { timezoneLocation } from "../timezoneLabels";
import { usePortalClock } from "../usePortalClock";
import "../cohortPlanner.css";

const ZONES: PlannerZone[] = [
  { zone: "Europe/London", city: "London" }, { zone: "America/New_York", city: "New York" }, { zone: "America/Toronto", city: "Toronto" },
  { zone: "America/Los_Angeles", city: "Los Angeles" }, { zone: "America/Vancouver", city: "Vancouver" }, { zone: "Europe/Berlin", city: "Berlin" },
  { zone: "Asia/Dubai", city: "Dubai" }, { zone: "Australia/Sydney", city: "Sydney" },
];
const clock = (zone: string, date: Date) => new Intl.DateTimeFormat("en-GB", { timeZone: zone, hour: "numeric", minute: "2-digit", hour12: true }).format(date).replace(/\s/g, "").toLowerCase();
const message = (reason: unknown, fallback: string) => reason instanceof Error && reason.message ? reason.message : fallback;
const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;
const listJoin = (items: string[]) => items.length <= 1 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
type Note = { tone: "ok" | "info" | "warn" | "error"; text: string };

function usePrefersDark() {
  const query = "(prefers-color-scheme: dark)";
  const [dark, setDark] = useState(() => typeof window !== "undefined" && Boolean(window.matchMedia?.(query).matches));
  useEffect(() => {
    const media = window.matchMedia?.(query);
    if (!media) return;
    const update = () => setDark(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const forced = typeof document !== "undefined" ? document.documentElement.dataset.theme : undefined;
  return forced === "dark" ? true : forced === "light" ? false : dark;
}

function NoteIcon({ tone }: { tone: Note["tone"] }) {
  return tone === "ok" ? <CheckCircle2 size={16} aria-hidden="true" /> : tone === "info" ? <Info size={16} aria-hidden="true" /> : <AlertTriangle size={16} aria-hidden="true" />;
}

export function AdminSchedule() {
  const [cohorts, setCohorts] = useState<ScheduleCohort[]>([]);
  const [cohortId, setCohortId] = useState("");
  const [snapshot, setSnapshot] = useState<ScheduleSnapshot>();
  const [baseDraft, setBaseDraft] = useState<PlannerDraft>();
  const [draft, setDraft] = useState<PlannerDraft>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [filters, setFilters] = useState(() => Object.fromEntries(Object.entries(plannerFilters).map(([key, value]) => [key, value.on])) as Record<PlannerEventType, boolean>);
  const [selected, setSelected] = useState<Day | null>(null);
  const [dragging, setDragging] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [uncertain, setUncertain] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [pendingDiscard, setPendingDiscard] = useState<{ cohortId?: string }>();
  const [appClose, setAppClose] = useState<ApplicationCloseStatus>({ state: "unknown" });
  const [extraZone, setExtraZone] = useState(PLAN_ZONE);
  const [salesEmails, setSalesEmails] = useState<SalesEmail[]>();
  const [salesEmailsError, setSalesEmailsError] = useState("");
  const [salesEmailsRetry, setSalesEmailsRetry] = useState(0);
  const ids = useRef<Record<number, string>>({});
  const idFor = useCallback((number: number) => ids.current[number] ??= crypto.randomUUID(), []);
  const now = usePortalClock();
  const today = ukToday(now);
  const dark = usePrefersDark();
  const cohort = cohorts.find((item) => item.id === cohortId);

  useEffect(() => {
    let live = true;
    setLoading(true); setError("");
    loadScheduleCohorts().then((rows) => {
      if (!live) return;
      setCohorts(rows); setCohortId((current) => rows.some((row) => row.id === current) ? current : rows[0]?.id ?? "");
      if (!rows.length) setLoading(false);
    }).catch((reason: unknown) => { if (live) { setError(message(reason, "Unable to load cohorts.")); setLoading(false); } });
    return () => { live = false; };
  }, [retry]);

  useEffect(() => {
    if (!cohortId) return;
    let live = true;
    setLoading(true); setError(""); setSnapshot(undefined); setDraft(undefined); setSelected(null); setConfirming(false); setNotes([]); setUncertain(false);
    ids.current = {};
    Promise.all([loadCohortSchedule(cohortId), loadApplicationClose(cohortId)]).then(([result, close]) => {
      if (!live) return;
      const initial = draftFromSnapshot(result, cohortId, ukToday());
      setSnapshot(result); setBaseDraft(initial); setDraft(initial); setAppClose(close);
    }).catch((reason: unknown) => { if (live) setError(message(reason, "Unable to load this schedule.")); })
      .finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, [cohortId, retry]);

  // The calendar doesn't wait for Klaviyo: planned subjects show until the real ones arrive.
  useEffect(() => {
    if (!cohortId) return;
    let live = true;
    setSalesEmails(undefined); setSalesEmailsError("");
    loadSalesEmails(cohortId).then((rows) => { if (live) setSalesEmails(rows); })
      .catch((reason: unknown) => { if (live) setSalesEmailsError(message(reason, "The emails couldn't be loaded from Klaviyo.")); });
    return () => { live = false; };
  }, [cohortId, retry, salesEmailsRetry]);

  const result = useMemo(() => {
    if (!snapshot || !draft) return undefined;
    try { return { built: buildPlannerPlan(snapshot, draft, idFor, snapshot.pattern?.planner?.publishedAt ?? null), error: "" }; }
    catch (reason) { return { built: undefined, error: message(reason, "These dates don't fit together. Undo the last change.") }; }
  }, [snapshot, draft, idFor]);
  const built = result?.built;
  const events = useMemo(() => built ? plannerEvents(built, salesEmails) : [], [built, salesEmails]);
  const range = built ? plannerRange(built.resolved) : undefined;
  const warnings = built ? planWarnings(built.resolved, today, snapshot?.pattern?.planner?.applicationsOpenOn) : [];
  const changes = built && snapshot ? planChanges(snapshot, built.plan) : undefined;
  const dirty = Boolean(changes?.any);
  const touched = Boolean(draft && baseDraft && !sameDraft(draft, baseDraft));
  const saved = snapshot?.pattern?.planner;
  const publishedOn = saved?.publishedAt ? `${dayLabel(ukDay(saved.publishedAt))}, ${ukTimeLabel(saved.publishedAt)}` : "";
  const missingWeeks = built?.missingWeeks ?? [];
  const canPublish = Boolean(built && cohort && dirty && !missingWeeks.length && !publishing && !uncertain && !dragging);
  const zones = ZONES.some((item) => item.zone === extraZone) ? ZONES : [...ZONES, { zone: extraZone, city: timezoneLocation(extraZone).places.split(" · ").slice(-1)[0] }];

  useEffect(() => {
    if (!touched) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [touched]);

  const update = (next: PlannerDraft) => { setDraft(next); setConfirming(false); setNotes([]); };
  const moveOpen = (day: Day) => { if (draft && isDay(day) && day !== draft.opensOn) update({ ...draft, opensOn: day }); };

  function check(next: PlannerDraft) {
    if (!snapshot) throw new Error("Reload the calendar and try again.");
    buildPlannerPlan(snapshot, next, idFor);
    return next;
  }
  function applyCall(number: number, values: CallEditValues) {
    if (!built || !draft) return "Reload the calendar and try again.";
    try {
      const title = values.title.trim(), joinUrl = values.url.trim();
      const startsAt = ukInputToIso(values.start), endsAt = ukInputToIso(values.end);
      if (!title || !startsAt || !endsAt) return "Enter a call topic, start time and end time.";
      const existing = built.plan.calls.find((call) => call.id === built.callIds[number]);
      if (!existing) return "Reload the calendar and try again.";
      // The same checks as a one-off change in the old calendar: a valid HTTPS link, and an end after the start.
      editCallDates(built.plan, { ...existing, title, joinUrl, startsAt, endsAt }, "one", PLAN_ZONE, idFor);
      const planned = built.resolved.timeline.calls[number - 1];
      const start = localDifference(startsAt, planned.startsAt, PLAN_ZONE), end = localDifference(endsAt, planned.endsAt, PLAN_ZONE);
      const calls = { ...draft.oneOffs.calls };
      if (start || end) calls[number] = { start, end }; else delete calls[number];
      update(check({ ...draft, oneOffs: { ...draft.oneOffs, calls }, callText: { ...draft.callText, [number]: { title, joinUrl } } }));
    } catch (reason) { return message(reason, "Check the call's times and link."); }
  }
  function applyWeek(number: number, values: WeekEditValues) {
    if (!built || !draft) return "Reload the calendar and try again.";
    try {
      const opensAt = ukInputToIso(values.opens), deadlineAt = ukInputToIso(values.deadline);
      if (!opensAt || !deadlineAt) return "Enter both dates.";
      const week = built.plan.weeks.find((item) => item.number === number);
      if (week) editWeekDates(built.plan, week.id, { opensAt, deadlineAt }, "one", PLAN_ZONE, idFor);
      else if (Date.parse(deadlineAt) <= Date.parse(opensAt)) return "The deadline must be after the week opens.";
      const rule = built.resolved.weeks[number - 1].rule;
      const opens = localDifference(opensAt, rule.opensAt, PLAN_ZONE), deadline = localDifference(deadlineAt, rule.deadlineAt, PLAN_ZONE);
      const weeks = { ...draft.oneOffs.weeks };
      if (opens || deadline) weeks[number] = { opens, deadline }; else delete weeks[number];
      update(check({ ...draft, oneOffs: { ...draft.oneOffs, weeks } }));
    } catch (reason) { return message(reason, "Check the week's dates."); }
  }
  function resetCall(number: number) {
    if (!draft) return;
    const calls = { ...draft.oneOffs.calls }; delete calls[number];
    update({ ...draft, oneOffs: { ...draft.oneOffs, calls } });
  }
  function resetWeek(number: number) {
    if (!draft) return;
    const weeks = { ...draft.oneOffs.weeks }; delete weeks[number];
    update({ ...draft, oneOffs: { ...draft.oneOffs, weeks } });
  }

  function discard() {
    const next = pendingDiscard?.cohortId;
    setPendingDiscard(undefined);
    if (next) { setCohortId(next); return; }
    if (baseDraft) update(baseDraft);
  }

  async function publish() {
    if (!snapshot || !draft || !cohort || !canPublish) return;
    setPublishing(true); setNotes([]);
    let final: ReturnType<typeof buildPlannerPlan>;
    let next: ScheduleSnapshot;
    try {
      final = buildPlannerPlan(snapshot, draft, idFor, new Date().toISOString());
      next = await saveSchedulePlan(cohort.id, snapshot, final.plan);
    } catch (reason) {
      const text = message(reason, "Couldn't publish. Reload the calendar to see what was saved.");
      // A dropped connection can mean the save went through; reload before trying again.
      setUncertain(true); setNotes([{ tone: "error", text }]); setPublishing(false);
      return;
    }
    const results: Note[] = [{ tone: "ok", text: "Published. The student portal now shows these dates." }];
    const startsAt = final.resolved.calls[0].startsAt, endsAt = final.resolved.calls[PLANNED_CALLS - 1].endsAt;
    try {
      await saveCohortDates(cohort.id, startsAt, endsAt);
      setCohorts((rows) => rows.map((row) => row.id === cohort.id ? { ...row, startsAt, endsAt } : row));
      results.push({ tone: "ok", text: `Cohort dates set: ${dayLabel(ukDay(startsAt))} to ${dayLabel(ukDay(endsAt))}.` });
    } catch (reason) { results.push({ tone: "warn", text: `The cohort's start and end dates weren't saved. ${message(reason, "")}`.trim() }); }
    const closesAt = final.resolved.timeline.closesAt;
    const byHand = `Until then, close the application form by hand at ${ukMoment(closesAt)}.`;
    if (appClose.state === "needs-update") results.push({ tone: "info", text: `The application form close time needs one database update. ${byHand}` });
    else {
      try {
        const count = await setApplicationClose(cohort.id, closesAt);
        results.push(count ? { tone: "ok", text: `Application form set to close at ${ukMoment(closesAt)} UK time.` } : { tone: "info", text: "No application form is linked to this cohort, so there was no close time to set." });
        if (count) setAppClose({ state: "ready", forms: count, closesAt });
      } catch (reason) {
        if (reason instanceof ApplicationCloseError && reason.reason === "needs-update") { setAppClose({ state: "needs-update" }); results.push({ tone: "info", text: `${reason.message} ${byHand}` }); }
        else results.push({ tone: "warn", text: `${message(reason, "The application close time wasn't set.")} ${byHand}` });
      }
    }
    const initial = draftFromSnapshot(next, cohort.id, today);
    setSnapshot(next); setBaseDraft(initial); setDraft(initial); setConfirming(false); setNotes(results); setPublishing(false);
    toast.success("Dates published to the student portal");
  }

  function scrollToToday() {
    const cell = document.querySelector<HTMLElement>(`.cohort-planner [data-day="${today}"]`);
    cell?.scrollIntoView({ block: "center", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    cell?.focus({ preventScroll: true });
  }

  const t = built?.resolved.timeline;
  const kickoff = built?.resolved.calls[0], finalCall = built?.resolved.calls[PLANNED_CALLS - 1];
  const todayInRange = Boolean(range && today >= range.from && today <= range.to);
  const changeLine = changes ? [
    changes.weeks && plural(changes.weeks, "week"),
    changes.calls && plural(changes.calls, "call"),
    changes.deadlines && plural(changes.deadlines, "deadline"),
  ].filter(Boolean) as string[] : [];

  return <div className={`cohort-planner cp-theme${dragging ? " cp-is-dragging" : ""}`} lang="en-GB">
    <div className="cp-wrap">
      <header className="cp-top">
        <div className="cp-title">
          <h1>{cohort ? `${cohort.internalName || cohort.displayName}${built ? ` · ${monthsLabel(built.resolved)}` : ""}` : "Cohort planner"}</h1>
          <button type="button" className="cp-btn" onClick={scrollToToday} disabled={!todayInRange} title={todayInRange ? undefined : "Today is outside this plan"}>Today</button>
          <span className="cp-sub">Rob Late Mentorship · UK times</span>
          {cohorts.length > 1 && <label className="cp-cohort"><span>Cohort</span><select value={cohortId} disabled={loading || publishing} onChange={(event) => { if (touched) setPendingDiscard({ cohortId: event.target.value }); else setCohortId(event.target.value); }}>{cohorts.map((item) => <option key={item.id} value={item.id}>{item.internalName || item.displayName}</option>)}</select></label>}
        </div>
        <div className="cp-clockbar">
          <div className="cp-clock" aria-label="Time around the world now">{zones.map((item) => <div className="cp-zc" key={item.zone}><b>{clock(item.zone, new Date(now))}</b><span>{item.city}</span></div>)}</div>
          <div className="cp-compare"><span>Compare another time zone</span><TimezoneSelect label="Compare another time zone" value={extraZone} onChange={setExtraZone} date={new Date(now)} light={!dark} /></div>
        </div>
      </header>

      {error && <div className="cp-banner error" role="alert"><AlertTriangle size={16} aria-hidden="true" /><span>{error}</span><button type="button" className="cp-btn" onClick={() => setRetry((value) => value + 1)}>Try again</button></div>}
      {!loading && !built && result?.error && draft && <div className="cp-banner error" role="alert"><AlertTriangle size={16} aria-hidden="true" /><span>The saved plan can't be shown: {result.error}</span>
        <span className="cp-banner-actions"><button type="button" className="cp-btn" onClick={() => update({ ...draft, oneOffs: { calls: {}, weeks: {} }, callText: {} })}>Clear one-off changes</button></span></div>}
      {loading ? <div className="cp-loading"><LoaderCircle size={20} className="animate-spin" aria-hidden="true" />Loading the planner...</div>
        : !cohort ? !error && <div className="cp-loading">No active or draft cohorts are available.</div>
        : draft && t && kickoff && finalCall && built && range && <>
          <section className="cp-plan" aria-label="Sales week and publishing">
            <div className="cp-plan-row">
              <div className="cp-open">
                <span className="cp-open-label">Applications open</span>
                <div className="cp-nudge">
                  <button type="button" className="cp-btn cp-icon" aria-label="One day earlier" disabled={publishing} onClick={() => moveOpen(addDays(draft.opensOn, -1))}><ChevronLeft size={17} /></button>
                  <input type="date" aria-label="Applications open on" value={draft.opensOn} disabled={publishing} onChange={(event) => moveOpen(event.target.value)} />
                  <button type="button" className="cp-btn cp-icon" aria-label="One day later" disabled={publishing} onClick={() => moveOpen(addDays(draft.opensOn, 1))}><ChevronRight size={17} /></button>
                </div>
              </div>
              <div className="cp-publish">
                <span className={`cp-status ${dirty ? "draft" : "live"}`} role="status">{dirty ? "Draft, not published" : `Published ${publishedOn}`}</span>
                {touched && <button type="button" className="cp-btn" disabled={publishing} onClick={() => setPendingDiscard({})}>Discard changes</button>}
                <button type="button" className="cp-btn cp-primary" disabled={!canPublish} aria-expanded={confirming} onClick={() => { setConfirming(true); setNotes([]); }}>Lock in and publish</button>
              </div>
            </div>
            <p className="cp-keydates">Waitlist {dayLabel(t.waitlistOn)} · open {dayLabel(t.opensOn)} · close {dayLabel(t.closesOn)}, 11:59pm · onboarding {dayLabel(t.onboarding.from, { day: "numeric", month: "short" })} to {dayLabel(t.onboarding.to, { day: "numeric", month: "short" })} · kickoff {ukMoment(kickoff.startsAt)} · final call {ukMoment(finalCall.startsAt)}</p>
            <p className="cp-hint"><span className="cp-drag-hint">Drag the sales week on the calendar, nudge it a day at a time, or pick the date.</span><span className="cp-touch-hint">Nudge the sales week a day at a time with the arrows, or pick the date.</span> Everything else is planned from it. Nothing changes for students until you publish.{dirty && publishedOn ? ` Last published ${publishedOn}.` : ""}</p>
          </section>

          {pendingDiscard && <div className="cp-banner warn" role="alertdialog" aria-label="Discard draft changes">
            <AlertTriangle size={16} aria-hidden="true" /><span>{pendingDiscard.cohortId ? "Switching cohort discards your draft changes." : "Discard your draft changes?"} The published dates stay as they are.</span>
            <span className="cp-banner-actions"><button type="button" className="cp-btn" onClick={() => setPendingDiscard(undefined)}>Keep editing</button><button type="button" className="cp-btn cp-danger" onClick={discard}>Discard changes</button></span>
          </div>}

          {confirming && changes && <section className="cp-confirm" aria-label="Confirm publishing">
            <h2>Lock in and publish these dates?</h2>
            <p className="cp-confirm-lead">{changeLine.length ? `${listJoin(changeLine)} will be updated. Students will see these dates in the portal.` : "The portal already shows these dates. Publishing saves this plan."}</p>
            <ul>
              <li>Applications open {dayLabel(t.opensOn, { weekday: "long", day: "numeric", month: "long" })} and close {ukMoment(t.closesAt)} UK time.</li>
              <li>Kickoff call {ukMoment(kickoff.startsAt)}. Final call {ukMoment(finalCall.startsAt)}, the last touchpoint.</li>
              <li>Cohort dates: {dayLabel(ukDay(kickoff.startsAt))} to {dayLabel(ukDay(finalCall.endsAt))}.</li>
              <li>{appClose.state === "needs-update" ? `The application form close time needs one database update, so close the form by hand at ${ukMoment(t.closesAt)}.` : `The application form will be set to close at ${ukMoment(t.closesAt)}. This needs an admin account.`}</li>
              <li>Emails stay a plan here. Nothing is sent or scheduled.</li>
              {changes.newCalls > 0 && <li>{plural(changes.newCalls, "new call")} will be created. Add Zoom links from each call's day.</li>}
            </ul>
            {warnings.length > 0 && <p className="cp-confirm-warn"><AlertTriangle size={15} aria-hidden="true" />{plural(warnings.length, "warning")} above. You can still publish.</p>}
            <div className="cp-confirm-actions">
              <button type="button" className="cp-btn" disabled={publishing} onClick={() => setConfirming(false)}>Cancel</button>
              <button type="button" className="cp-btn cp-primary" disabled={!canPublish} onClick={() => void publish()}>{publishing && <LoaderCircle size={15} className="animate-spin" aria-hidden="true" />}{publishing ? "Publishing..." : "Publish to students"}</button>
            </div>
          </section>}

          {notes.length > 0 && <div className="cp-notes" role="status">{notes.map((note, index) => <p key={index} className={`cp-note ${note.tone}`}><NoteIcon tone={note.tone} /><span>{note.text}</span></p>)}
            {uncertain && <button type="button" className="cp-btn" onClick={() => setRetry((value) => value + 1)}>Reload the calendar</button>}</div>}
          {result?.error && <div className="cp-banner error" role="alert"><AlertTriangle size={16} aria-hidden="true" /><span>{result.error}</span></div>}
          {missingWeeks.length > 0 && <div className="cp-banner error" role="alert"><AlertTriangle size={16} aria-hidden="true" /><span>This cohort has {PLANNED_CALLS - missingWeeks.length} of {PLANNED_CALLS} weeks set up in the portal. Add week {listJoin(missingWeeks.map(String))} before publishing.</span></div>}
          {warnings.map((warning) => <div key={warning} className="cp-banner warn"><AlertTriangle size={16} aria-hidden="true" /><span>{warning}</span></div>)}

          <div className="cp-filters" role="group" aria-label="Show on the calendar">{(Object.keys(plannerFilters) as PlannerEventType[]).map((type) => <label key={type}>
            <input type="checkbox" checked={filters[type]} onChange={(event) => setFilters((current) => ({ ...current, [type]: event.target.checked }))} />
            <span className="cp-dot" style={{ background: `var(--cp-${type})` }} />{plannerFilters[type].label}</label>)}</div>

          <CohortPlannerCalendar built={built} events={events} range={range} today={today} filters={filters} selected={selected} onSelect={setSelected} zones={zones}
            opensOn={draft.opensOn} onOpensOnChange={moveOpen} onDragChange={setDragging}
            editing={{ onApplyCall: applyCall, onResetCall: resetCall, onApplyWeek: applyWeek, onResetWeek: resetWeek }}
            emailCopy={{ loading: !salesEmails && !salesEmailsError, error: salesEmailsError, retry: () => setSalesEmailsRetry((value) => value + 1) }} />
          <p className="cp-foot">Scroll down for later weeks. Hover the envelope to see that day's emails, or click a day for its details and the full email copy, under that week. Each row is one mentorship week: Sunday call (blue bar along the top of the square), work due Thursday 11:59pm, Rob reviews Friday and Saturday, then the next Sunday call reviews it. Uploads open as soon as the previous deadline closes. The final call on {dayLabel(ukDay(finalCall.startsAt), { weekday: "long", day: "numeric", month: "long" })} is the last touchpoint, and nothing is due after it.</p>
        </>}
    </div>
  </div>;
}
