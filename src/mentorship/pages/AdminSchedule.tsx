import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, Globe2, Repeat2, List, LoaderCircle, Plus, Video } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import {
  loadCohortSchedule, loadScheduleCohorts, saveSchedulePlan,
  scheduleIsoToLocalInput, scheduleLocalInputToIso, scheduleLocalPreview,
  type ScheduleCall, type ScheduleCohort, type ScheduleWeek, type ScheduleSnapshot,
} from "../scheduleAdminApi";
import { calendarDayLabel, calendarEvents, calendarMonthDays, shiftCalendarMonth, type CalendarEvent } from "../staffCalendar";
import { buildWeeklyPattern, editWeekDates, editCallDates, shiftLocal, shiftInstant, localDifference, restorePatternDate, type SchedulePlan, type PatternInput } from "../schedulePattern";
import { TimezoneReference } from "../components/ScheduleTimezone";
import "../staffCalendar.css";

type Editor = { kind: "pattern" } | { kind: "week"; week: ScheduleWeek } | { kind: "call"; call?: ScheduleCall };
type Draft = { title: string; start: string; end: string; url: string; weekId: string };
const emptyDraft: Draft = { title: "", start: "", end: "", url: "", weekId: "" };
const eventLabels = { call: "Group call", deadline: "Submission deadline", opening: "Week opens" };
const toLocal = scheduleIsoToLocalInput;
const keepInstant = (value: string, original: string | null, timezone: string) => original && value === toLocal(original, timezone) ? original : scheduleLocalInputToIso(value, timezone);

function Field({ label, value, onChange, type = "text", required = false, placeholder }: {
  label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean; placeholder?: string;
}) {
  return <label className="sc-field"><span>{label}</span><input type={type} value={value} required={required} placeholder={placeholder} onInput={type === "datetime-local" ? (event) => onChange(event.currentTarget.value) : undefined} onChange={(event) => onChange(event.target.value)} /></label>;
}

export function AdminSchedule() {
  const [cohorts, setCohorts] = useState<ScheduleCohort[]>([]);
  const [cohortId, setCohortId] = useState("");
  const [snapshot, setSnapshot] = useState<ScheduleSnapshot>({ weeks: [], calls: [], pattern: null, revision: 0 });
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
  const [scope, setScope] = useState<"one" | "series">("one");
  const [patternDraft, setPatternDraft] = useState<PatternInput>();
  const initialPattern = useRef<PatternInput>();
  const ids = useRef<Record<number, string>>({});
  const idForWeek = (week: number) => ids.current[week] ??= crypto.randomUUID();
  const [dragging, setDragging] = useState<string>();
  const [dropDay, setDropDay] = useState<string>();
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const pointerDrag = useRef<{ id: string; x: number; y: number; active: boolean; day?: string }>();
  const suppressClickUntil = useRef(0);
  const [saveUncertain, setSaveUncertain] = useState(false);
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
      setSnapshot(result); setWeeks(result.weeks); setCalls(result.calls); setSaveUncertain(false);
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
  const dirty = editor?.kind === "pattern" ? JSON.stringify(patternDraft) !== JSON.stringify(initialPattern.current) || !snapshot.pattern : JSON.stringify(draft) !== JSON.stringify(initialDraft.current);
  const current: SchedulePlan = { weeks, calls, pattern: snapshot.pattern };
  const seriesEligible = Boolean(snapshot.pattern && (editor?.kind === "week" ? editor.week.number === 1 : editor?.kind === "call" && editor.call?.id === snapshot.pattern.callIds[1]));
  const isException = editor?.kind === "week" ? Object.values(snapshot.pattern?.weekExceptions[editor.week.id] ?? {}).some(Boolean) : editor?.kind === "call" && snapshot.pattern?.callExceptions.includes(editor.call?.id ?? "");

  function openPattern() {
    const first = weeks.find((w) => w.number === 1);
    const firstCalls = calls.filter((c) => c.weekId === first?.id);
    const call = calls.find((c) => c.id === snapshot.pattern?.callIds[1]) ?? (firstCalls.length === 1 ? firstCalls[0] : calls.length === 1 && !calls[0].weekId ? calls[0] : undefined);
    const p = snapshot.pattern;
    const values: PatternInput = p ? { ...p } : {
      opensAt: first?.opensAt ?? "", deadlineAt: first?.deadlineAt ?? "",
      callStartsAt: call?.startsAt ?? null, callEndsAt: call?.endsAt ?? null,
      callTitle: call?.title ?? "Group coaching call", joinUrl: call?.joinUrl ?? "",
    };
    setPatternDraft(values); initialPattern.current = values;
    setEditor({ kind: "pattern" }); setEditorError(""); setDiscard(false); ids.current = {};
  }
  function changePattern(key: keyof PatternInput, value: string) {
    const p = patternDraft;
    if (!p) return;
    try {
      let next: PatternInput = { ...p, [key]: value || (key.startsWith("call") && key !== "callTitle" ? null : "") };
      if (key === "opensAt" && p.opensAt && value) {
        const delta = localDifference(value, p.opensAt, timezone);
        next = { ...p, opensAt: value, deadlineAt: p.deadlineAt && shiftInstant(p.deadlineAt, delta, timezone), callStartsAt: p.callStartsAt && shiftInstant(p.callStartsAt, delta, timezone), callEndsAt: p.callEndsAt && shiftInstant(p.callEndsAt, delta, timezone) };
      }
      if (key === "callStartsAt" && p.callStartsAt && p.callEndsAt && value) next.callEndsAt = shiftInstant(p.callEndsAt, localDifference(value, p.callStartsAt, timezone), timezone);
      setPatternDraft(next); setEditorError(""); setDiscard(false);
    } catch (e) { setEditorError(e instanceof Error ? e.message : "Check the date and time."); }
  }

  function openEditor(next: Exclude<Editor, { kind: "pattern" }>, date?: string) {
    const values: Draft = next.kind === "week"
      ? { ...emptyDraft, start: toLocal(next.week.opensAt, timezone), end: toLocal(next.week.deadlineAt, timezone) }
      : next.call
        ? { title: next.call.title, start: toLocal(next.call.startsAt, timezone), end: toLocal(next.call.endsAt, timezone), url: next.call.joinUrl, weekId: next.call.weekId ?? "" }
        : { ...emptyDraft, title: "Group coaching call", start: `${date ?? today}T19:00`, end: `${date ?? today}T20:30` };
    setScope(next.kind === "week" && next.week.number === 1 || next.kind === "call" && next.call?.id === snapshot.pattern?.callIds[1] ? "series" : "one");
    ids.current = {};
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

  function makePlan(): SchedulePlan {
    if (!editor) return current;
    if (editor.kind === "pattern") return buildWeeklyPattern(current, patternDraft!, timezone, idForWeek);
    const originalStart = editor.kind === "week" ? editor.week.opensAt : editor.call?.startsAt ?? null;
    const originalEnd = editor.kind === "week" ? editor.week.deadlineAt : editor.call?.endsAt ?? null;
    const start = keepInstant(draft.start, originalStart, timezone);
    const end = keepInstant(draft.end, originalEnd, timezone);
    if (editor.kind === "week") return editWeekDates(current, editor.week.id, { opensAt: start, deadlineAt: end }, scope, timezone, idForWeek);
    if (!draft.title.trim() || !start || !end) throw new Error("Enter a call topic, start time and end time.");
    const call: ScheduleCall = { ...editor.call, id: editor.call?.id ?? idForWeek(0), title: draft.title.trim(), startsAt: start, endsAt: end, joinUrl: draft.url.trim(), weekId: draft.weekId || null };
    if (snapshot.pattern && Object.values(snapshot.pattern.callIds).includes(call.id) && call.weekId !== editor.call?.weekId) throw new Error("This call belongs to the weekly pattern. Keep its linked week, or add a separate call.");
    return editCallDates(current, call, scope, timezone, idForWeek);
  }
  const preview = (() => { try { return { plan: makePlan(), error: "" }; } catch (e) { return { plan: undefined, error: e instanceof Error ? e.message : "Check the dates." }; } })();
  async function save(override?: SchedulePlan) {
    if (!editor || !cohort || savingRef.current || saveUncertain) return;
    setEditorError("");
    try {
      const plan = override ?? makePlan();
      savingRef.current = true; setSaving(true);
      const result = await saveSchedulePlan(cohortId, snapshot, plan);
      setSnapshot(result); setWeeks(result.weeks); setCalls(result.calls);
      const start = editor.kind === "pattern" ? toLocal(plan.pattern?.opensAt ?? null, timezone) : draft.start;
      if (start) setMonth(start.slice(0, 7));
      toast.success(editor.kind === "pattern" || scope === "series" && seriesEligible ? "Weekly schedule saved" : "Date changes saved");
      setEditor(undefined);
    } catch (reason) {
      setEditorError(reason instanceof Error ? reason.message : "Couldn't save. Please reload the calendar.");
      if (savingRef.current) setSaveUncertain(true);
    } finally { savingRef.current = false; setSaving(false); }
  }
  function dropEvent(day: string, id: string) {
    const event = events.find((e) => e.id === id);
    setDragging(undefined); setDropDay(undefined);
    if (!event || day === event.local.slice(0, 10)) return;
    editEvent(event);
    const nextLocal = `${day}T${event.local.slice(11)}`;
    setDraft((d) => event.kind === "opening" ? { ...d, start: nextLocal } : event.kind === "deadline" ? { ...d, end: nextLocal } : { ...d, start: nextLocal, end: d.end ? shiftLocal(d.end, (Date.parse(`${nextLocal}:00Z`) - Date.parse(`${d.start}:00Z`)) / 60000) : "" });
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
      <div className="sc-header-actions"><button className="sc-button" disabled={loading || !weeks.length || Boolean(error)} onClick={openPattern}><Repeat2 size={17} />{snapshot.pattern ? "Edit weekly pattern" : "Set weekly pattern"}</button><button className="sc-button sc-primary" disabled={loading || !cohort || Boolean(error)} onClick={() => openEditor({ kind: "call" })}><Plus size={17} />Add group call</button></div>
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
          {days.map((day) => <div className={`sc-day ${day.startsWith(month) ? "" : "sc-outside"} ${day === today ? "sc-current-day" : ""} ${dropDay === day ? "sc-drop-target" : ""}`} key={day} data-schedule-day={day}>
            <button className="sc-day-number" aria-label={`Add group call on ${calendarDayLabel(day, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`} onClick={() => openEditor({ kind: "call" }, day)}><span>{Number(day.slice(8))}</span><Plus size={12} /></button>
            <div className="sc-day-events">{events.filter((event) => event.local.startsWith(day)).map((event) => <button className={`sc-event sc-${event.kind} ${dragging === event.id ? "sc-dragging" : ""}`} key={event.id}
              onPointerDown={(e) => { if (e.button !== 0) return; pointerDrag.current = { id: event.id, x: e.clientX, y: e.clientY, active: false }; e.currentTarget.setPointerCapture(e.pointerId); }}
              onPointerMove={(e) => {
                const drag = pointerDrag.current;
                if (!drag || drag.id !== event.id) return;
                if (!drag.active && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < 6) return;
                drag.active = true; setDragging(drag.id); setDragPosition({ x: e.clientX, y: e.clientY });
                drag.day = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>("[data-schedule-day]")?.dataset.scheduleDay;
                setDropDay(drag.day);
              }}
              onPointerUp={(e) => { const drag = pointerDrag.current; pointerDrag.current = undefined; if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId); if (drag?.active) { suppressClickUntil.current = Date.now() + 400; if (drag.day) dropEvent(drag.day, drag.id); } setDragging(undefined); setDropDay(undefined); }}
              onPointerCancel={() => { pointerDrag.current = undefined; setDragging(undefined); setDropDay(undefined); }}
 title={`${event.local.slice(11)} ${event.title}`} onClick={() => { if (Date.now() >= suppressClickUntil.current) editEvent(event); }}><span>{event.local.slice(11)}</span><span>{event.title}</span></button>)}</div>
          </div>)}
        </div></div> : <div className="sc-agenda">
          {monthEvents.length ? [...new Set(monthEvents.map((event) => event.local.slice(0, 10)))].map((day) => <section className="sc-agenda-day" key={day}><h3>{calendarDayLabel(day)}</h3>{monthEvents.filter((event) => event.local.startsWith(day)).map((event) => <button key={event.id} className={`sc-agenda-event sc-${event.kind}`} onClick={() => editEvent(event)}><span className="sc-dot" /><time>{event.local.slice(11)}</time><span><strong>{event.title}</strong><small>{eventLabels[event.kind]}</small></span><ChevronRight size={16} /></button>)}</section>) : <div className="sc-empty"><CalendarDays size={26} /><strong>No events to show this month</strong><span>Set a week's dates or add a group call. Check the filters if events are hidden.</span></div>}
        </div>}
        <div className="sc-calendar-footer"><span>Drag an event to move it. Click to edit its time or topic.</span><span>{monthEvents.length} event{monthEvents.length === 1 ? "" : "s"} this month</span></div>
      </section>
      <aside className="sc-weeks" aria-label="Weekly schedule">
        <div className="sc-weeks-heading"><h2>Weekly schedule</h2><span>{missingWeeks ? `${missingWeeks} to complete` : "Dates set"}</span></div>
        <p>{snapshot.pattern ? "Dates repeat weekly. Moving Week 1 shifts the programme; one-off dates stay fixed." : "Set Week 1 once to fill the programme. You can adjust individual dates afterwards."}</p>
        {!weeks.length && <p>No weeks have been set up yet.</p>}
        {weeks.map((week) => <button className="sc-week" key={week.id} onClick={() => openEditor({ kind: "week", week })} aria-label={`Edit Week ${week.number} dates`}><span className="sc-week-heading"><strong>Week {week.number}</strong><span>{Object.values(snapshot.pattern?.weekExceptions[week.id] ?? {}).some(Boolean) ? "One-off" : !week.opensAt || !week.deadlineAt ? "Set dates" : "Edit dates"}<ChevronRight size={13} /></span></span><span className="sc-week-date"><span>Opens</span><span className={!week.opensAt ? "sc-missing" : ""}>{shortDate(week.opensAt)}</span></span><span className="sc-week-date"><span>Deadline</span><span className={!week.deadlineAt ? "sc-missing" : ""}>{shortDate(week.deadlineAt)}</span></span></button>)}
        <TimezoneReference timezone={timezone} /><div className="sc-sync-note"><Clock3 size={17} /><p>Saved dates power the student countdowns and Add to calendar buttons.</p></div>
      </aside>
    </div>}

    {dragging && <div className="sc-drag-label" style={{ left: dragPosition.x + 12, top: dragPosition.y + 12 }}>{events.find((e) => e.id === dragging)?.title}<small>{dropDay ? calendarDayLabel(dropDay) : "Drop on a date"}</small></div>}
    <Dialog open={Boolean(editor)} onOpenChange={(open) => { if (!open) closeEditor(); }}>
      <DialogContent className={`staff-calendar sc-editor ${editor?.kind === "pattern" ? "sc-pattern-editor" : ""}`} onInteractOutside={(event) => event.preventDefault()}>
        <DialogTitle>{editor?.kind === "pattern" ? "Weekly pattern" : editor?.kind === "week" ? `Week ${editor.week.number} dates` : editor?.kind === "call" && editor.call ? "Edit group call" : "Add group call"}</DialogTitle>
        <DialogDescription className="sc-dialog-description">{editor?.kind === "pattern" ? "Set the first week and call. The remaining weeks follow every seven days, at the same local time." : editor?.kind === "week" ? "Control when students can access this week and when their work is due." : "Set the time and joining link for your live session."}</DialogDescription>
        <div className="sc-editor-zone"><Globe2 size={15} />All times in {timezone}</div>
        <form onSubmit={(event) => { event.preventDefault(); void save(); }}>
          <fieldset disabled={saving} className="sc-form">
            {editor?.kind === "call" && <Field label="Call topic" placeholder="e.g. Commercial Song Structure" value={draft.title} required onChange={(value) => change("title", value)} />}
            {editor?.kind !== "pattern" && <div className="sc-time-fields"><Field label={editor?.kind === "week" ? "Week opens" : "Starts"} type="datetime-local" value={draft.start} required={editor?.kind === "call"} onChange={(value) => change("start", value)} /><Field label={editor?.kind === "week" ? "Submission deadline" : "Ends"} type="datetime-local" value={draft.end} required={editor?.kind === "call"} onChange={(value) => change("end", value)} /></div>}
            {editor?.kind === "pattern" && patternDraft && <>
              <div className="sc-time-fields">{([ ["opensAt", "Week 1 opens"], ["deadlineAt", "Week 1 deadline"], ["callStartsAt", "First call starts (optional)"], ["callEndsAt", "First call ends"] ] as const).map(([key, label]) => <Field key={key} label={label} type="datetime-local" value={toLocal(patternDraft[key], timezone)} onChange={(value) => { try { changePattern(key, scheduleLocalInputToIso(value, timezone) ?? ""); } catch (e) { setEditorError(e instanceof Error ? e.message : "Check the time."); } }} />)}</div>
              <p className="sc-hint">Changing Week 1's opening shifts the deadline and first call with it. You can then fine-tune them here.</p>
              <Field label="Default topic for new calls" value={patternDraft.callTitle} onChange={(value) => changePattern("callTitle", value)} />
              <Field label="Joining link for new calls (optional)" value={patternDraft.joinUrl} type="url" onChange={(value) => changePattern("joinUrl", value)} />
              <p className="sc-hint">Existing call topics and links are kept. Edit each call to set its own topic.</p>
            </>}
            {seriesEligible && <label className="sc-field"><span>Apply date changes to</span><select value={scope} onChange={(e) => setScope(e.target.value as "one" | "series")}><option value="series">{editor?.kind === "week" ? "The weekly pattern" : "All weekly calls"}</option><option value="one">{editor?.kind === "week" ? "This week only" : "This call only"}</option></select><span className="sc-hint">{scope === "series" ? "Linked dates move together. One-off exceptions keep their dates." : "Saved as a one-off. Later changes to the pattern will leave this date in place."}</span></label>}
            {isException && <button className="sc-button" type="button" disabled={saveUncertain} onClick={() => { if (editor?.kind === "week" || editor?.kind === "call" && editor.call) void save(restorePatternDate(current, editor.kind, editor.kind === "week" ? editor.week.id : editor.call!.id, timezone)); }}>Reset dates to weekly pattern</button>}
            {duration && <p className="sc-duration"><Clock3 size={14} />{duration} duration</p>}
            {editor?.kind === "call" && <><Field label="Joining link (optional)" type="url" value={draft.url} placeholder="https://zoom.us/j/..." onChange={(value) => change("url", value)} /><label className="sc-field"><span>Link to a week (optional)</span><select value={draft.weekId} disabled={Boolean(editor?.call && snapshot.pattern && Object.values(snapshot.pattern.callIds).includes(editor.call.id))} onChange={(event) => change("weekId", event.target.value)}><option value="">No linked week</option>{weeks.map((week) => <option key={week.id} value={week.id}>Week {week.number}</option>)}</select></label></>}
            {editor?.kind === "week" && <p className="sc-hint">Leave a date blank if it's not confirmed yet.</p>}
            {editor?.kind !== "pattern" && draft.start && <p className="sc-hint">{(() => { try { return scheduleLocalPreview(draft.start, timezone); } catch { return "Check the date and time before saving."; } })()}</p>}
            {(editor?.kind === "call" || editor?.kind === "pattern") && <details className="sc-zone-details"><summary>Compare this call across time zones</summary><TimezoneReference timezone={timezone} value={editor.kind === "pattern" ? patternDraft?.callStartsAt : (() => { try { return keepInstant(draft.start, editor.call?.startsAt ?? null, timezone); } catch { return null; } })()} /></details>}
            {(editor?.kind === "pattern" || seriesEligible && scope === "series") && <div className="sc-pattern-preview"><strong>Schedule preview</strong><p>One-off dates are kept. All times are in {timezone}.</p>{preview.plan && <div className="sc-preview-scroll"><table><thead><tr><th>Week</th><th>Opens</th><th>Deadline</th><th>Group call</th></tr></thead><tbody>{preview.plan.weeks.map((w) => { const c = preview.plan!.calls.find((c) => c.id === preview.plan!.pattern?.callIds[w.number]); return <tr key={w.id}><th>{w.number}</th><td>{shortDate(w.opensAt)}<small>{toLocal(w.opensAt, timezone).slice(11)}{preview.plan!.pattern?.weekExceptions[w.id]?.opensAt && " · One-off"}</small></td><td>{shortDate(w.deadlineAt)}<small>{toLocal(w.deadlineAt, timezone).slice(11)}{preview.plan!.pattern?.weekExceptions[w.id]?.deadlineAt && " · One-off"}</small></td><td>{shortDate(c?.startsAt ?? null)}<small>{toLocal(c?.startsAt ?? null, timezone).slice(11)}{c && preview.plan!.pattern?.callExceptions.includes(c.id) && " · One-off"}</small></td></tr>; })}</tbody></table></div>}</div>}
            {preview.error && <p className="sc-error" role="alert">{preview.error}</p>}
            <p className="sc-save-note">Saving updates the schedule students see in the portal.</p>
            {editorError && <div className="sc-error" role="alert">{editorError}{saveUncertain && <button type="button" className="sc-button" onClick={() => { setEditor(undefined); setRetry((n) => n + 1); }}>Reload calendar</button>}</div>}
            {discard && <div className="sc-discard" role="alert"><strong>Discard your unsaved changes?</strong><div><button type="button" className="sc-button" onClick={() => setDiscard(false)}>Keep editing</button><button type="button" className="sc-button sc-danger" onClick={() => setEditor(undefined)}>Discard changes</button></div></div>}
            <div className="sc-form-actions"><button type="button" className="sc-button" onClick={closeEditor}>Cancel</button><button type="submit" disabled={saving || saveUncertain || Boolean(preview.error) || (editor?.kind !== "call" || editor.call ? !dirty : false)} className="sc-button sc-primary">{saving ? <LoaderCircle size={16} className="animate-spin" /> : editor?.kind === "call" ? <Video size={16} /> : <CalendarDays size={16} />}{saving ? "Saving..." : editor?.kind === "pattern" ? "Save weekly pattern" : "Save changes"}</button></div>
          </fieldset>
        </form>
      </DialogContent>
    </Dialog>
  </div>;
}
