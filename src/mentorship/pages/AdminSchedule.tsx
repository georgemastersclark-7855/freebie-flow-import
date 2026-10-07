import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, Globe2, List, LoaderCircle, Plus, Video } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import {
  createScheduleCall, loadCohortSchedule, loadScheduleCohorts, saveScheduleCall, saveScheduleWeek,
  scheduleIsoToLocalInput, scheduleLocalInputToIso, scheduleLocalPreview,
  type ScheduleCall, type ScheduleCohort, type ScheduleWeek,
} from "../scheduleAdminApi";
import { calendarDayLabel, calendarEvents, calendarMonthDays, shiftCalendarMonth, type CalendarEvent } from "../staffCalendar";
import "../staffCalendar.css";

type Editor = { kind: "week"; week: ScheduleWeek } | { kind: "call"; call?: ScheduleCall };
type Draft = { title: string; start: string; end: string; url: string; weekId: string };
const emptyDraft: Draft = { title: "", start: "", end: "", url: "", weekId: "" };
const eventLabels = { call: "Group call", deadline: "Submission deadline", opening: "Week opens" };
const toLocal = scheduleIsoToLocalInput;
const keepInstant = (value: string, original: string | null, timezone: string) => original && value === toLocal(original, timezone) ? original : scheduleLocalInputToIso(value, timezone);

function Field({ label, value, onChange, type = "text", required = false, placeholder }: {
  label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean; placeholder?: string;
}) {
  return <label className="sc-field"><span>{label}</span><input type={type} value={value} required={required} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /></label>;
}

export function AdminSchedule() {
  const [cohorts, setCohorts] = useState<ScheduleCohort[]>([]);
  const [cohortId, setCohortId] = useState("");
  const [weeks, setWeeks] = useState<ScheduleWeek[]>([]);
  const [calls, setCalls] = useState<ScheduleCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [view, setView] = useState<"month" | "agenda">("month");
  const [filters, setFilters] = useState({ call: true, deadline: true, opening: true });
  const [editor, setEditor] = useState<Editor>();
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const initialDraft = useRef<Draft>(emptyDraft);
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  const [editorError, setEditorError] = useState("");
  const [discard, setDiscard] = useState(false);
  const cohort = cohorts.find((item) => item.id === cohortId);
  const timezone = cohort?.timezone ?? "UTC";
  const today = toLocal(new Date().toISOString(), timezone).slice(0, 10);

  useEffect(() => {
    let live = true;
    setLoading(true); setError("");
    loadScheduleCohorts().then((rows) => {
      if (!live) return;
      setCohorts(rows); setCohortId((current) => rows.some((row) => row.id === current) ? current : rows[0]?.id ?? "");
      if (!rows.length) setLoading(false);
    }).catch((reason: unknown) => { if (live) { setError(reason instanceof Error ? reason.message : "Unable to load cohorts."); setLoading(false); } });
    return () => { live = false; };
  }, [retry]);

  useEffect(() => {
    if (!cohortId) return;
    let live = true;
    setLoading(true); setError(""); setWeeks([]); setCalls([]);
    loadCohortSchedule(cohortId).then((result) => {
      if (!live) return;
      setWeeks(result.weeks); setCalls(result.calls);
      const all = calendarEvents(result.weeks, result.calls, timezone);
      const localToday = toLocal(new Date().toISOString(), timezone).slice(0, 10);
      setMonth((all.find((item) => item.local.slice(0, 10) >= localToday)?.local ?? localToday).slice(0, 7));
    }).catch((reason: unknown) => { if (live) setError(reason instanceof Error ? reason.message : "Unable to load this schedule."); })
      .finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, [cohortId, timezone, retry]);

  const allEvents = useMemo(() => calendarEvents(weeks, calls, timezone), [weeks, calls, timezone]);
  const events = allEvents.filter((event) => filters[event.kind]);
  const monthEvents = events.filter((event) => event.local.startsWith(month));
  const days = calendarMonthDays(month);
  const missingWeeks = weeks.filter((week) => !week.opensAt || !week.deadlineAt).length;
  const dirty = JSON.stringify(draft) !== JSON.stringify(initialDraft.current);

  function openEditor(next: Editor, date?: string) {
    const values: Draft = next.kind === "week"
      ? { ...emptyDraft, start: toLocal(next.week.opensAt, timezone), end: toLocal(next.week.deadlineAt, timezone) }
      : next.call
        ? { title: next.call.title, start: toLocal(next.call.startsAt, timezone), end: toLocal(next.call.endsAt, timezone), url: next.call.joinUrl, weekId: next.call.weekId ?? "" }
        : { ...emptyDraft, title: "Group coaching call", start: `${date ?? today}T19:00`, end: `${date ?? today}T20:30` };
    setDraft(values); initialDraft.current = values; setEditor(next); setEditorError(""); setDiscard(false);
  }
  function editEvent(event: CalendarEvent) {
    if (event.kind === "call") {
      const call = calls.find((item) => item.id === event.sourceId);
      if (call) openEditor({ kind: "call", call });
    } else {
      const week = weeks.find((item) => item.id === event.sourceId);
      if (week) openEditor({ kind: "week", week });
    }
  }
  function closeEditor() {
    if (savingRef.current) return;
    if (dirty) setDiscard(true);
    else setEditor(undefined);
  }
  const change = (key: keyof Draft, value: string) => { setDraft((current) => ({ ...current, [key]: value })); setDiscard(false); setEditorError(""); };

  async function save() {
    if (!editor || !cohort || savingRef.current) return;
    setEditorError("");
    try {
      const originalStart = editor.kind === "week" ? editor.week.opensAt : editor.call?.startsAt ?? null;
      const originalEnd = editor.kind === "week" ? editor.week.deadlineAt : editor.call?.endsAt ?? null;
      const start = keepInstant(draft.start, originalStart, timezone);
      const end = keepInstant(draft.end, originalEnd, timezone);
      if (start && end && Date.parse(end) <= Date.parse(start)) throw new Error(editor.kind === "week" ? "The submission deadline must be after the week opens." : "The call must end after it starts.");
      if (editor.kind === "call") {
        if (!draft.title.trim() || !start || !end) throw new Error("Enter a call title, start time and end time.");
        if (draft.url.trim()) {
          let valid = false;
          try { const url = new URL(draft.url.trim()); valid = url.protocol === "https:" && !url.username && !url.password; } catch { /* Show the field error below. */ }
          if (!valid) throw new Error("Enter a valid HTTPS joining link, or leave it blank.");
        }
      }
      savingRef.current = true; setSaving(true);
      if (editor.kind === "week") {
        await saveScheduleWeek(editor.week.id, { opensAt: start, deadlineAt: end });
        setWeeks((current) => current.map((week) => week.id === editor.week.id ? { ...week, opensAt: start, deadlineAt: end } : week));
      } else {
        const values = { title: draft.title.trim(), startsAt: start!, endsAt: end!, joinUrl: draft.url.trim(), weekId: draft.weekId || null };
        if (editor.call) {
          await saveScheduleCall(editor.call, values);
          setCalls((current) => current.map((call) => call.id === editor.call!.id ? { ...call, ...values } : call));
        } else {
          const id = await createScheduleCall(cohortId, values);
          setCalls((current) => [...current, { id, ...values }]);
        }
      }
      if (start || end) setMonth((draft.start || draft.end).slice(0, 7));
      toast.success(editor.kind === "week" ? `Week ${editor.week.number} dates saved` : "Group call saved");
      setEditor(undefined);
    } catch (reason) { setEditorError(reason instanceof Error ? reason.message : "Couldn't save. Please try again."); }
    finally { savingRef.current = false; setSaving(false); }
  }

  const shortDate = (value: string | null) => value ? calendarDayLabel(toLocal(value, timezone).slice(0, 10), { day: "numeric", month: "short" }) : "Not set";
  const duration = (() => {
    if (editor?.kind !== "call" || !draft.start || !draft.end) return "";
    try {
      const minutes = (Date.parse(keepInstant(draft.end, editor.call?.endsAt ?? null, timezone)!) - Date.parse(keepInstant(draft.start, editor.call?.startsAt ?? null, timezone)!)) / 60000;
      return minutes > 0 ? `${Math.floor(minutes / 60) ? `${Math.floor(minutes / 60)}h ` : ""}${minutes % 60 ? `${minutes % 60}min` : ""}`.trim() : "";
    } catch { return ""; }
  })();

  return <div className="staff-calendar">
    <header className="sc-header">
      <div><p className="sc-eyebrow">Programme management</p><h1>Calendar</h1><p>Manage week openings, submission deadlines and group calls.</p></div>
      <button className="sc-button sc-primary" disabled={loading || !cohort || Boolean(error)} onClick={() => openEditor({ kind: "call" })}><Plus size={17} />Add group call</button>
    </header>
    <div className="sc-context">
      <label className="sc-cohort">Cohort<select aria-label="Cohort" value={cohortId} disabled={loading} onChange={(event) => setCohortId(event.target.value)}>{cohorts.map((item) => <option key={item.id} value={item.id}>{item.displayName}</option>)}</select></label>
      <span className="sc-timezone"><Globe2 size={15} />{timezone}<span>All times shown in this timezone</span></span>
    </div>
    {error && <div className="sc-error" role="alert">{error}<button className="sc-button" onClick={() => setRetry((value) => value + 1)}>Try again</button></div>}
    {loading ? <div className="sc-empty"><LoaderCircle size={22} className="animate-spin" />Loading calendar...</div> : !cohort ? <div className="sc-empty">No active or draft cohorts are available.</div> : !error && <div className="sc-layout">
      <section className="sc-calendar" aria-label="Cohort calendar">
        <div className="sc-toolbar">
          <div className="sc-month-controls"><button className="sc-icon-button" aria-label="Previous month" onClick={() => setMonth(shiftCalendarMonth(month, -1))}><ChevronLeft size={19} /></button><button className="sc-icon-button" aria-label="Next month" onClick={() => setMonth(shiftCalendarMonth(month, 1))}><ChevronRight size={19} /></button><h2 aria-live="polite">{calendarDayLabel(`${month}-01`, { month: "long", year: "numeric" })}</h2><button className="sc-button sc-today" onClick={() => setMonth(today.slice(0, 7))}>Today</button></div>
          <div className="sc-view-switch" aria-label="Calendar view"><button aria-pressed={view === "month"} onClick={() => setView("month")}><CalendarDays size={15} />Month</button><button aria-pressed={view === "agenda"} onClick={() => setView("agenda")}><List size={16} />Agenda</button></div>
        </div>
        <div className="sc-legend" aria-label="Event filters">{(Object.keys(eventLabels) as CalendarEvent["kind"][]).map((kind) => <button key={kind} aria-pressed={filters[kind]} className={`sc-filter sc-${kind}`} onClick={() => setFilters((current) => ({ ...current, [kind]: !current[kind] }))}><span className="sc-dot" />{eventLabels[kind]}</button>)}</div>
        {view === "month" ? <div className="sc-month-scroll"><div className="sc-month-grid">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => <div className="sc-weekday" key={day}>{day}</div>)}
          {days.map((day) => <div className={`sc-day ${day.startsWith(month) ? "" : "sc-outside"} ${day === today ? "sc-current-day" : ""}`} key={day}>
            <button className="sc-day-number" aria-label={`Add group call on ${calendarDayLabel(day, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`} onClick={() => openEditor({ kind: "call" }, day)}><span>{Number(day.slice(8))}</span><Plus size={12} /></button>
            <div className="sc-day-events">{events.filter((event) => event.local.startsWith(day)).map((event) => <button className={`sc-event sc-${event.kind}`} key={event.id} title={`${event.local.slice(11)} ${event.title}`} onClick={() => editEvent(event)}><span>{event.local.slice(11)}</span><span>{event.title}</span></button>)}</div>
          </div>)}
        </div></div> : <div className="sc-agenda">
          {monthEvents.length ? [...new Set(monthEvents.map((event) => event.local.slice(0, 10)))].map((day) => <section className="sc-agenda-day" key={day}><h3>{calendarDayLabel(day)}</h3>{monthEvents.filter((event) => event.local.startsWith(day)).map((event) => <button key={event.id} className={`sc-agenda-event sc-${event.kind}`} onClick={() => editEvent(event)}><span className="sc-dot" /><time>{event.local.slice(11)}</time><span><strong>{event.title}</strong><small>{eventLabels[event.kind]}</small></span><ChevronRight size={16} /></button>)}</section>) : <div className="sc-empty"><CalendarDays size={26} /><strong>No events to show this month</strong><span>Set a week's dates or add a group call. Check the filters if events are hidden.</span></div>}
        </div>}
        <div className="sc-calendar-footer"><span>Click a date to add a call. Click an event to edit it.</span><span>{monthEvents.length} event{monthEvents.length === 1 ? "" : "s"} this month</span></div>
      </section>
      <aside className="sc-weeks" aria-label="Weekly schedule">
        <div className="sc-weeks-heading"><h2>Weekly schedule</h2><span>{missingWeeks ? `${missingWeeks} to complete` : "Dates set"}</span></div>
        <p>Set when each week opens and when submissions are due.</p>
        {!weeks.length && <p>No weeks have been set up yet.</p>}
        {weeks.map((week) => <button className="sc-week" key={week.id} onClick={() => openEditor({ kind: "week", week })} aria-label={`Edit Week ${week.number} dates`}><span className="sc-week-heading"><strong>Week {week.number}</strong><span>{!week.opensAt || !week.deadlineAt ? "Set dates" : "Edit dates"}<ChevronRight size={13} /></span></span><span className="sc-week-date"><span>Opens</span><span className={!week.opensAt ? "sc-missing" : ""}>{shortDate(week.opensAt)}</span></span><span className="sc-week-date"><span>Deadline</span><span className={!week.deadlineAt ? "sc-missing" : ""}>{shortDate(week.deadlineAt)}</span></span></button>)}
        <div className="sc-sync-note"><Clock3 size={17} /><p>Saved dates power the student countdowns and Add to calendar buttons.</p></div>
      </aside>
    </div>}

    <Dialog open={Boolean(editor)} onOpenChange={(open) => { if (!open) closeEditor(); }}>
      <DialogContent className="staff-calendar sc-editor" onInteractOutside={(event) => event.preventDefault()}>
        <DialogTitle>{editor?.kind === "week" ? `Week ${editor.week.number} dates` : editor?.call ? "Edit group call" : "Add group call"}</DialogTitle>
        <DialogDescription className="sc-dialog-description">{editor?.kind === "week" ? "Control when students can access this week and when their work is due." : "Set the time and joining link for your live session."}</DialogDescription>
        <div className="sc-editor-zone"><Globe2 size={15} />All times in {timezone}</div>
        <form onSubmit={(event) => { event.preventDefault(); void save(); }}>
          <fieldset disabled={saving} className="sc-form">
            {editor?.kind === "call" && <Field label="Call title" value={draft.title} required onChange={(value) => change("title", value)} />}
            <div className="sc-time-fields"><Field label={editor?.kind === "week" ? "Week opens" : "Starts"} type="datetime-local" value={draft.start} required={editor?.kind === "call"} onChange={(value) => change("start", value)} /><Field label={editor?.kind === "week" ? "Submission deadline" : "Ends"} type="datetime-local" value={draft.end} required={editor?.kind === "call"} onChange={(value) => change("end", value)} /></div>
            {duration && <p className="sc-duration"><Clock3 size={14} />{duration} duration</p>}
            {editor?.kind === "call" && <><Field label="Joining link (optional)" type="url" value={draft.url} placeholder="https://zoom.us/j/..." onChange={(value) => change("url", value)} /><label className="sc-field"><span>Link to a week (optional)</span><select value={draft.weekId} onChange={(event) => change("weekId", event.target.value)}><option value="">No linked week</option>{weeks.map((week) => <option key={week.id} value={week.id}>Week {week.number}</option>)}</select></label></>}
            {editor?.kind === "week" && <p className="sc-hint">Leave a date blank if it's not confirmed yet.</p>}
            {draft.start && <p className="sc-hint">{(() => { try { return scheduleLocalPreview(draft.start, timezone); } catch { return "Check the date and time before saving."; } })()}</p>}
            <p className="sc-save-note">Saving updates the schedule students see in the portal.</p>
            {editorError && <div className="sc-error" role="alert">{editorError}</div>}
            {discard && <div className="sc-discard" role="alert"><strong>Discard your unsaved changes?</strong><div><button type="button" className="sc-button" onClick={() => setDiscard(false)}>Keep editing</button><button type="button" className="sc-button sc-danger" onClick={() => setEditor(undefined)}>Discard changes</button></div></div>}
            <div className="sc-form-actions"><button type="button" className="sc-button" onClick={closeEditor}>Cancel</button><button type="submit" disabled={saving || (editor?.kind === "week" || editor?.call ? !dirty : false)} className="sc-button sc-primary">{saving ? <LoaderCircle size={16} className="animate-spin" /> : editor?.kind === "call" ? <Video size={16} /> : <CalendarDays size={16} />}{saving ? "Saving..." : "Save changes"}</button></div>
          </fieldset>
        </form>
      </DialogContent>
    </Dialog>
  </div>;
}
