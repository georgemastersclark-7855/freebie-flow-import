import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  addDays, dayLabel, daysBetween, clockLabel, ukLocal, ukMoment, PLANNED_CALLS, PLANNED_SUBMISSIONS,
  type BuiltPlan, type Day, type Phase, type PlannerEvent, type PlannerEventType,
} from "../cohortPlan";
import type { SalesEmail } from "../salesEmailsApi";

export type PlannerZone = { zone: string; city: string };
export type EmailCopyStatus = { loading: boolean; error: string; retry: () => void };

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// Phone width: the full phase names don't fit a seventh of the screen.
const SHORT_PHASE: Record<Phase["key"], string> = { warm: "Warm", sales: "Sales", onb: "1:1s", w1: "Wk 1", w2: "Wk 2", w3: "Wk 3", w4: "Wk 4", w5: "Wk 5", w6: "Wk 6" };
const MONTH = (day: Day) => dayLabel(day, { month: "long", year: "numeric" });
const longDay = (day: Day) => dayLabel(day, { weekday: "long", day: "numeric", month: "long" });
const zoneTime = (zone: string, date: Date) => new Intl.DateTimeFormat("en-GB", { timeZone: zone, hour: "numeric", minute: "2-digit", hour12: true }).format(date).replace(/\s/g, "").toLowerCase();
const zoneDay = (zone: string, date: Date) => new Intl.DateTimeFormat("en-GB", { timeZone: zone, weekday: "short", day: "numeric", month: "short" }).format(date);

function MailIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>;
}

export interface CallEditValues { title: string; start: string; end: string; url: string }
export interface WeekEditValues { opens: string; deadline: string }
export interface PlannerEditing {
  onApplyCall: (number: number, values: CallEditValues) => string | undefined;
  onResetCall: (number: number) => void;
  onApplyWeek: (number: number, values: WeekEditValues) => string | undefined;
  onResetWeek: (number: number) => void;
}

interface CalendarProps {
  built: BuiltPlan;
  events: PlannerEvent[];
  range: { from: Day; to: Day };
  today: Day;
  filters: Record<PlannerEventType, boolean>;
  selected: Day | null;
  onSelect: (day: Day | null) => void;
  zones: PlannerZone[];
  opensOn: Day;
  onOpensOnChange: (day: Day) => void;
  onDragChange: (dragging: boolean) => void;
  editing: PlannerEditing;
  emailCopy: EmailCopyStatus;
}

export function CohortPlannerCalendar({ built, events, range, today, filters, selected, onSelect, zones, opensOn, onOpensOnChange, onDragChange, editing, emailCopy }: CalendarProps) {
  const t = built.resolved.timeline;
  const [frozen, setFrozen] = useState<{ from: Day; to: Day }>();
  const [dragLabel, setDragLabel] = useState<{ x: number; y: number; day: Day }>();
  const drag = useRef<{ pointerId: number; x: number; y: number; grab: Day; start: Day; active: boolean; last: Day; cells: { day: Day; rect: DOMRect }[]; scrollY: number }>();
  const gridRef = useRef<HTMLDivElement>(null);
  const suppressClick = useRef(0);
  const shown = frozen ?? range;
  const phaseOf = (day: Day): Phase | undefined => t.phases.find((phase) => day >= phase.from && day <= phase.to);
  const kickoffDay = events.find((event) => event.call?.number === 1)?.day;
  const marks: Record<Day, { kind: "kick" | "close"; full: string; short: string }> = {};
  if (kickoffDay) marks[kickoffDay] = { kind: "kick", full: "Kickoff", short: "Kickoff" };
  marks[t.closesOn] = { kind: "close", full: "Applications close", short: "Close" };
  const visible = (day: Day) => events.filter((event) => event.day === day && filters[event.type]);

  const rows: Day[][] = [];
  for (let day = shown.from; day <= shown.to; day = addDays(day, 7)) rows.push(Array.from({ length: 7 }, (_, index) => addDays(day, index)));

  function endDrag(cancel = false) {
    const current = drag.current;
    drag.current = undefined;
    if (current?.active) {
      suppressClick.current = Date.now() + 350;
      if (cancel) onOpensOnChange(current.start);
      onDragChange(false);
    }
    setFrozen(undefined); setDragLabel(undefined);
  }
  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => { if (event.key === "Escape" && drag.current?.active) endDrag(true); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function pointerDown(event: ReactPointerEvent<HTMLDivElement>, day: Day) {
    // Touch keeps scrolling the page; phones use the arrows or the date picker instead.
    if (event.button !== 0 || event.pointerType === "touch" || !gridRef.current) return;
    drag.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, grab: day, start: opensOn, active: false, last: opensOn, cells: [], scrollY: window.scrollY };
  }
  // Handlers live on the grid, which never re-renders away.
  function pointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;
    if (!current.active) {
      if (!event.buttons) { drag.current = undefined; return; }
      if (Math.hypot(event.clientX - current.x, event.clientY - current.y) < 6) return;
      // Capture only once it is a drag, so a plain click still opens the day.
      current.active = true; setFrozen(shown); onDragChange(true);
      event.currentTarget.setPointerCapture(event.pointerId);
      // Rows change height as the sales week moves, so hit-test against where the days were when the drag began.
      current.cells = [...(gridRef.current?.querySelectorAll<HTMLElement>("[data-day]") ?? [])].map((cell) => ({ day: cell.dataset.day!, rect: cell.getBoundingClientRect() }));
    }
    const scrolled = window.scrollY - current.scrollY;
    const over = current.cells.find(({ rect }) => event.clientX >= rect.left && event.clientX < rect.right && event.clientY + scrolled >= rect.top && event.clientY + scrolled < rect.bottom)?.day;
    const next = over ? addDays(current.start, daysBetween(current.grab, over)) : current.last;
    if (next !== current.last) { current.last = next; onOpensOnChange(next); }
    setDragLabel({ x: event.clientX, y: event.clientY, day: next });
  }
  function pointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (!drag.current || drag.current.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    endDrag();
  }

  function pick(day: Day) {
    if (Date.now() < suppressClick.current) return;
    onSelect(selected === day ? null : day);
  }
  function keyPick(event: KeyboardEvent<HTMLDivElement>, day: Day) {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); pick(day); }
  }

  const grid: ReactNode[] = DOW.map((name) => <div className="cp-dow" key={`dow-${name}`} aria-hidden="true">{name}</div>);
  rows.forEach((row, rowIndex) => {
    const firstOfMonth = row.find((day) => day.endsWith("-01"));
    if (rowIndex === 0 || firstOfMonth) {
      const monthDay = rowIndex === 0 ? row[0] : firstOfMonth!;
      grid.push(<div className="cp-mon" key={`mon-${monthDay}`} role="heading" aria-level={2}>{MONTH(monthDay)}</div>);
    }
    row.forEach((day, column) => {
      const phase = phaseOf(day);
      const mark = marks[day];
      const isToday = day === today;
      const dayEvents = visible(day).filter((event) => !(mark?.kind === "close" && event.key === "close"));
      const emails = events.filter((event) => event.day === day && event.type === "email");
      const isCall = events.some((event) => event.day === day && event.type === "call");
      const sales = phase?.key === "sales";
      const showLabel = phase && (day === phase.from || column === 0);
      const className = ["cp-cell", column === 6 && "c7", isToday && "today", day === selected && "sel", isCall && filters.call && "callday",
        mark ? `mark-${mark.kind}` : isToday && "mark-here", sales && "salesday", phase && `ph-${phase.key}`].filter(Boolean).join(" ");
      const date = Number(day.slice(8));
      const summary = [
        mark?.full, ...events.filter((event) => event.day === day).map((event) => `${event.time ? `${clockLabel(event.time)} ` : ""}${event.type === "email" ? `email: ${event.title}` : event.title}`),
      ].filter(Boolean);
      grid.push(<div key={day} className={className} data-day={day} role="button" tabIndex={0} aria-expanded={day === selected}
        aria-label={`${longDay(day)}${phase ? `, ${phase.label}` : ""}${isToday ? ", today" : ""}${summary.length ? `. ${[...new Set(summary)].join(". ")}` : ""}`}
        onClick={() => pick(day)} onKeyDown={(event) => keyPick(event, day)}
        onPointerDown={sales ? (event) => pointerDown(event, day) : undefined}>
        <div className="cp-head">
          <span className="cp-hl"><span className="cp-n">{date === 1 ? dayLabel(day, { day: "numeric", month: "short" }) : date}</span>
            {!filters.email && emails.length > 0 && <span className={`cp-mail${column >= 4 ? " tip-r" : ""}`} aria-hidden="true"><MailIcon />
              <span className="cp-tip"><i>Email{emails.length > 1 ? "s" : ""} to the list</i>{emails.map((email) => <span key={email.key}>{email.title}</span>)}</span></span>}
          </span>
          {showLabel && <span className="cp-wk" style={{ color: `var(--cp-l-${phase.key})` }}><span className="full">{phase.label.split(" · ")[0]}</span><span className="short" aria-hidden="true">{SHORT_PHASE[phase.key]}</span></span>}
        </div>
        {mark && <span className={`cp-badge ${mark.kind}`}><span className="full">{mark.full}</span><span className="short">{mark.short}</span></span>}
        {dayEvents.map((event) => <div key={event.key} className={`cp-ev ${event.type}`} title={`${event.time && event.type !== "due" ? `${clockLabel(event.time)} ` : ""}${event.title}`}>
          {(event.type === "email" || event.type === "onb") && <span className="cp-dot" style={{ background: `var(--cp-${event.type})` }} />}
          {event.time && event.type !== "due" && event.type !== "sales" && <span className="t">{clockLabel(event.time)}</span>}
          <b>{event.title}</b>
        </div>)}
        {sales && <span className="cp-money" aria-hidden="true">$</span>}
      </div>);
    });
    if (selected && row.includes(selected)) {
      grid.push(<DayDetails key={`detail-${selected}`} day={selected} phase={phaseOf(selected)} events={events.filter((event) => event.day === selected)}
        built={built} zones={zones} editing={editing} emailCopy={emailCopy} onClose={() => { const day = selected; onSelect(null); requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-day="${day}"]`)?.focus({ preventScroll: true })); }} />);
    }
  });

  return <>
    <div ref={gridRef} className={`cp-grid${frozen ? " cp-dragging" : ""}`} role="group" aria-label="Cohort calendar, Sunday to Saturday. Scroll for later weeks."
      onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={() => endDrag(true)} onLostPointerCapture={() => { if (drag.current) endDrag(); }}>{grid}</div>
    {dragLabel && createPortal(<div className="cp-theme cp-drag-label" style={{ left: dragLabel.x + 14, top: dragLabel.y + 14 }}>Applications open<small>{dayLabel(dragLabel.day, { weekday: "long", day: "numeric", month: "long" })}</small></div>, document.body)}
  </>;
}

function ZoneGrid({ title, at, zones }: { title: string; at: string; zones: PlannerZone[] }) {
  const date = new Date(at);
  return <div className="cp-zones"><h3>{title} in other time zones</h3><div className="cp-zl">{zones.map((zone) => <div key={zone.zone}><span>{zone.city}</span><b>{zoneTime(zone.zone, date)}</b><span>{zoneDay(zone.zone, date)}</span></div>)}</div></div>;
}

const toInput = (iso: string | null | undefined) => iso ? ukLocal(iso) : "";

function CallEditor({ number, built, onApply, onReset, onDone }: { number: number; built: BuiltPlan; onApply: PlannerEditing["onApplyCall"]; onReset: PlannerEditing["onResetCall"]; onDone: () => void }) {
  const call = built.plan.calls.find((item) => item.id === built.callIds[number]);
  const moved = built.resolved.calls[number - 1]?.moved;
  const [values, setValues] = useState<CallEditValues>({ title: call?.title ?? "", start: toInput(call?.startsAt), end: toInput(call?.endsAt), url: call?.joinUrl ?? "" });
  const [error, setError] = useState("");
  const set = (key: keyof CallEditValues, value: string) => { setValues((current) => ({ ...current, [key]: value })); setError(""); };
  return <form className="cp-edit" onSubmit={(event) => { event.preventDefault(); const problem = onApply(number, values); if (problem) setError(problem); else onDone(); }}>
    <label className="wide"><span>Call topic</span><input value={values.title} required onChange={(event) => set("title", event.target.value)} /></label>
    <label><span>Starts (UK time)</span><input type="datetime-local" value={values.start} required onChange={(event) => set("start", event.target.value)} /></label>
    <label><span>Ends (UK time)</span><input type="datetime-local" value={values.end} required onChange={(event) => set("end", event.target.value)} /></label>
    <label className="wide"><span>Zoom link (optional)</span><input type="url" inputMode="url" placeholder="https://zoom.us/j/..." value={values.url} onChange={(event) => set("url", event.target.value)} /></label>
    <p className="wide cp-edit-note">A one-off change for this call. It joins the draft and moves with the sales week. Students see it once you publish.</p>
    {error && <p className="wide cp-error" role="alert">{error}</p>}
    <div className="wide cp-edit-actions">
      {moved && <button type="button" className="cp-btn" onClick={() => { onReset(number); onDone(); }}>Move back to the planned time</button>}
      <button type="button" className="cp-btn" onClick={onDone}>Cancel</button>
      <button type="submit" className="cp-btn cp-primary">Apply to draft</button>
    </div>
  </form>;
}

function WeekEditor({ number, built, onApply, onReset, onDone }: { number: number; built: BuiltPlan; onApply: PlannerEditing["onApplyWeek"]; onReset: PlannerEditing["onResetWeek"]; onDone: () => void }) {
  const week = built.resolved.weeks[number - 1];
  const [values, setValues] = useState<WeekEditValues>({ opens: toInput(week?.opensAt), deadline: toInput(week?.deadlineAt) });
  const [error, setError] = useState("");
  const set = (key: keyof WeekEditValues, value: string) => { setValues((current) => ({ ...current, [key]: value })); setError(""); };
  return <form className="cp-edit" onSubmit={(event) => { event.preventDefault(); const problem = onApply(number, values); if (problem) setError(problem); else onDone(); }}>
    <label><span>Week {number} opens in the portal (UK time)</span><input type="datetime-local" value={values.opens} required onChange={(event) => set("opens", event.target.value)} /></label>
    <label><span>{number <= PLANNED_SUBMISSIONS ? `Submission ${number} deadline (UK time)` : `Week ${number} closes (UK time)`}</span><input type="datetime-local" value={values.deadline} required onChange={(event) => set("deadline", event.target.value)} /></label>
    <p className="wide cp-edit-note">A one-off change for week {number}. {number < PLANNED_CALLS ? `Week ${number + 1} still opens the moment this deadline passes. ` : ""}Students see it once you publish.</p>
    {error && <p className="wide cp-error" role="alert">{error}</p>}
    <div className="wide cp-edit-actions">
      {week?.moved && <button type="button" className="cp-btn" onClick={() => { onReset(number); onDone(); }}>Back to the planned dates</button>}
      <button type="button" className="cp-btn" onClick={onDone}>Cancel</button>
      <button type="submit" className="cp-btn cp-primary">Apply to draft</button>
    </div>
  </form>;
}

function sendLine(copy: SalesEmail) {
  if (copy.status === "Draft") return "Draft in Klaviyo, not scheduled yet. The copy could still change.";
  if (!copy.sendAt) return `${copy.status} in Klaviyo.`;
  return `${copy.status === "Sent" ? "Sent" : "Scheduled for"} ${ukMoment(copy.sendAt)} UK time.`;
}

function EmailDetails({ copy, status }: { copy?: SalesEmail; status: EmailCopyStatus }) {
  const [open, setOpen] = useState(false);
  if (!copy) {
    if (status.loading) return <span>Checking Klaviyo for this email...</span>;
    if (status.error) return <span>{status.error} <button type="button" className="cp-link" onClick={status.retry}>Try again</button></span>;
    return <span>Not in Klaviyo yet. The copy will show here once it's added.</span>;
  }
  return <>
    <span>{sendLine(copy)}</span>
    <div className="cp-row-actions"><button type="button" className="cp-link" aria-expanded={open} onClick={() => setOpen((value) => !value)}>{open ? "Hide email" : "Show email"}</button></div>
    {open && <div className="cp-email">
      <dl>
        <div><dt>Subject</dt><dd>{copy.subject}</dd></div>
        {copy.previewText && <div><dt>Preview text</dt><dd>{copy.previewText}</dd></div>}
      </dl>
      <div className="cp-email-body">{copy.paragraphs.map((runs, index) => <p key={index}>{runs.map((run, part) => run.bold ? <strong key={part}>{run.text}</strong> : <span key={part}>{run.text}</span>)}</p>)}</div>
    </div>}
  </>;
}

function DayDetails({ day, phase, events, built, zones, editing, emailCopy, onClose }: { day: Day; phase?: Phase; events: PlannerEvent[]; built: BuiltPlan; zones: PlannerZone[]; editing: PlannerEditing; emailCopy: EmailCopyStatus; onClose: () => void }) {
  const [open, setOpen] = useState<{ kind: "call" | "week"; number: number }>();
  const timed = events.find((event) => event.type === "call" && event.at) ?? events.find((event) => event.type === "due" && event.at) ?? events.find((event) => event.at);
  const week6 = built.resolved.weeks[PLANNED_CALLS - 1];
  return <div className="cp-detail" aria-live="polite">
    <h2>{longDay(day)}{phase && <span className="cp-ph" style={{ background: `var(--cp-p-${phase.key})`, color: `var(--cp-l-${phase.key})` }}>{phase.label}</span>}
      <button type="button" className="cp-btn cp-close" onClick={onClose}>Close</button></h2>
    {events.length ? events.map((event) => {
      const number = event.call?.number;
      const call = number ? built.plan.calls.find((item) => item.id === built.callIds[number]) : undefined;
      const movedCall = number ? built.resolved.calls[number - 1]?.moved : false;
      const movedWeek = event.week ? built.resolved.weeks[event.week - 1]?.moved : false;
      return <div className="cp-drow" key={event.key}>
        <div className="tm">{event.time ? clockLabel(event.time) : event.type === "email" ? "" : "All day"}</div>
        <div className="what">
          <b><span className="cp-dot" style={{ background: `var(--cp-${event.type})` }} />{event.type === "email" ? `Email: ${event.title}` : event.title}{(movedCall || movedWeek) && <em className="cp-tag">One-off</em>}</b>
          {event.note && <span>{event.note}</span>}
          {event.type === "email" && <EmailDetails copy={event.copy} status={emailCopy} />}
          {call && <span>Topic students see: {call.title}{call.joinUrl ? " · Zoom link set" : " · No Zoom link yet"}</span>}
          {number && open?.kind === "call" && open.number === number && <CallEditor key={`call-${number}-${built.plan.pattern?.planner?.applicationsOpenOn}`} number={number} built={built} onApply={editing.onApplyCall} onReset={editing.onResetCall} onDone={() => setOpen(undefined)} />}
          {event.week && open?.kind === "week" && open.number === event.week && <WeekEditor key={`week-${event.week}`} number={event.week} built={built} onApply={editing.onApplyWeek} onReset={editing.onResetWeek} onDone={() => setOpen(undefined)} />}
          {number === PLANNED_CALLS && open?.kind === "week" && open.number === PLANNED_CALLS && <WeekEditor key="week-6" number={PLANNED_CALLS} built={built} onApply={editing.onApplyWeek} onReset={editing.onResetWeek} onDone={() => setOpen(undefined)} />}
          {!open && (number || event.week) && <div className="cp-row-actions">
            {number && <button type="button" className="cp-link" onClick={() => setOpen({ kind: "call", number })}>Edit call</button>}
            {event.week && <button type="button" className="cp-link" onClick={() => setOpen({ kind: "week", number: event.week! })}>Edit week {event.week} dates</button>}
            {number === PLANNED_CALLS && <button type="button" className="cp-link" onClick={() => setOpen({ kind: "week", number: PLANNED_CALLS })}>Edit week {PLANNED_CALLS} dates</button>}
          </div>}
          {number === PLANNED_CALLS && week6 && <span>Week {PLANNED_CALLS} in the portal: {ukMoment(week6.opensAt)} to {ukMoment(week6.deadlineAt)}.{week6.moved ? " Changed as a one-off." : ""}</span>}
        </div>
      </div>;
    }) : <p className="cp-empty">Nothing scheduled on this day.</p>}
    {timed?.at && <ZoneGrid title={timed.type === "due" ? "Submission deadline" : timed.title} at={timed.at} zones={zones} />}
  </div>;
}
