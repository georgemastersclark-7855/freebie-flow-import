import type { ScheduleCall, ScheduleWeek } from "./scheduleAdminApi";
import { scheduleIsoToLocalInput as local, scheduleLocalInputToIso as iso } from "./scheduleTimezone";

export interface SchedulePattern {
  version: 1;
  opensAt: string;
  deadlineAt: string;
  callStartsAt: string | null;
  callEndsAt: string | null;
  callTitle: string;
  joinUrl: string;
  callIds: Record<string, string>;
  weekExceptions: Record<string, { opensAt?: boolean; deadlineAt?: boolean }>;
  callExceptions: string[];
}
export interface SchedulePlan { weeks: ScheduleWeek[]; calls: ScheduleCall[]; pattern: SchedulePattern | null }
export type PatternInput = Pick<SchedulePattern, "opensAt" | "deadlineAt" | "callStartsAt" | "callEndsAt" | "callTitle" | "joinUrl">;
const same = (a: string | null, b: string | null) => a === b || (a !== null && b !== null && Date.parse(a) === Date.parse(b));

// Arithmetic is in the cohort's wall clock, so a weekly 19:00 call stays at 19:00 across DST.
export function shiftLocal(value: string, minutes: number) {
  return new Date(Date.parse(`${value}:00Z`) + minutes * 60000).toISOString().slice(0, 16);
}
export function localDifference(a: string, b: string, zone: string) {
  return (Date.parse(`${local(a, zone)}:00Z`) - Date.parse(`${local(b, zone)}:00Z`)) / 60000;
}
export function shiftInstant(value: string, minutes: number, zone: string) {
  return minutes === 0 ? value : iso(shiftLocal(local(value, zone), minutes), zone)!;
}
const weekly = (value: string, week: number, zone: string) => shiftInstant(value, (week - 1) * 7 * 1440, zone);

export function validatePlan(plan: SchedulePlan) {
  for (const w of plan.weeks) {
    if (w.opensAt && w.deadlineAt && Date.parse(w.deadlineAt) <= Date.parse(w.opensAt)) throw new Error(`Week ${w.number}: the deadline must be after the opening. Check any one-off dates.`);
  }
  for (const c of plan.calls) {
    if (!c.title.trim() || !Number.isFinite(Date.parse(c.startsAt))) throw new Error("Enter a call title and start time.");
    if (c.endsAt && Date.parse(c.endsAt) <= Date.parse(c.startsAt)) throw new Error("The call must end after it starts.");
    if (c.joinUrl) {
      let valid = false;
      try { const url = new URL(c.joinUrl); valid = url.protocol === "https:" && !url.username && !url.password; } catch { /* Validation below. */ }
      if (!valid) throw new Error("Enter a valid HTTPS joining link, or leave it blank.");
    }
  }
  return plan;
}

export function buildWeeklyPattern(current: SchedulePlan, input: PatternInput, zone: string, idForWeek: (week: number) => string): SchedulePlan {
  if (!input.opensAt || !input.deadlineAt) throw new Error("Set Week 1's opening and submission deadline first.");
  if (Boolean(input.callStartsAt) !== Boolean(input.callEndsAt)) throw new Error("Set both the first call's start and end time, or leave both blank.");
  const previous = current.pattern;
  if (previous?.callStartsAt && !input.callStartsAt) throw new Error("Keep the weekly call dates set. Edit a specific call to reschedule it.");
  const pattern: SchedulePattern = { ...input, version: 1, callIds: { ...previous?.callIds }, weekExceptions: structuredClone(previous?.weekExceptions ?? {}), callExceptions: [...previous?.callExceptions ?? []] };
  const weeks = current.weeks.map((week) => {
    const expected = { opensAt: weekly(input.opensAt, week.number, zone), deadlineAt: weekly(input.deadlineAt, week.number, zone) };
    const exceptions = { ...pattern.weekExceptions[week.id] };
    for (const field of ["opensAt", "deadlineAt"] as const) {
      // Existing dates and changes made by older clients are kept as exceptions.
      const baseline = previous ? weekly(previous[field], week.number, zone) : expected[field];
      if (week.number !== 1 && week[field] && !same(week[field], baseline)) exceptions[field] = true;
      if (exceptions[field]) expected[field] = week[field]!;
    }
    pattern.weekExceptions[week.id] = exceptions;
    return { ...week, ...expected };
  });
  const calls = current.calls.map((call) => ({ ...call }));
  if (input.callStartsAt && input.callEndsAt) {
    for (const week of weeks) {
      let call = calls.find((c) => c.id === pattern.callIds[week.number]);
      if (!call && !previous?.callIds[week.number]) {
        let candidates = calls.filter((c) => c.weekId === week.id && !Object.values(pattern.callIds).includes(c.id));
        if (!previous && week.number === 1 && !candidates.length && calls.length === 1 && !calls[0].weekId) candidates = [calls[0]];
        if (candidates.length > 1) throw new Error(`Week ${week.number} has more than one call. Keep one linked to the week before creating its weekly pattern.`);
        call = candidates[0];
      }
      const start = weekly(input.callStartsAt, week.number, zone);
      const end = weekly(input.callEndsAt, week.number, zone);
      if (call) {
        pattern.callIds[week.number] = call.id;
        call.weekId = week.id;
        const oldStart = previous?.callStartsAt ? weekly(previous.callStartsAt, week.number, zone) : start;
        const oldEnd = previous?.callEndsAt ? weekly(previous.callEndsAt, week.number, zone) : end;
        if (week.number !== 1 && (!same(call.startsAt, oldStart) || !same(call.endsAt, oldEnd))) {
          if (!pattern.callExceptions.includes(call.id)) pattern.callExceptions.push(call.id);
        }
        if (!pattern.callExceptions.includes(call.id)) { call.startsAt = start; call.endsAt = end; }
      } else {
        const id = idForWeek(week.number);
        pattern.callIds[week.number] = id;
        calls.push({ id, weekId: week.id, title: input.callTitle.trim() || "Group coaching call", startsAt: start, endsAt: end, joinUrl: input.joinUrl.trim() });
      }
    }
  }
  return validatePlan({ weeks, calls, pattern });
}

export function editWeekDates(current: SchedulePlan, id: string, dates: Pick<ScheduleWeek, "opensAt" | "deadlineAt">, scope: "one" | "series", zone: string, idForWeek: (week: number) => string) {
  const week = current.weeks.find((w) => w.id === id)!;
  const p = current.pattern;
  if (scope === "series" && week.number === 1 && p) {
    if (!dates.opensAt || !dates.deadlineAt) throw new Error("The weekly pattern needs an opening and a deadline.");
    const delta = localDifference(dates.opensAt, week.opensAt ?? p.opensAt, zone);
    // Moving the programme start carries the deadline and calls with it unless the deadline was explicitly edited too.
    const deadline = same(dates.deadlineAt, week.deadlineAt) ? shiftInstant(p.deadlineAt, delta, zone) : dates.deadlineAt;
    const adjusted = structuredClone(current);
    delete adjusted.pattern!.weekExceptions[id];
    return buildWeeklyPattern(adjusted, { ...p, opensAt: dates.opensAt, deadlineAt: deadline, callStartsAt: p.callStartsAt && shiftInstant(p.callStartsAt, delta, zone), callEndsAt: p.callEndsAt && shiftInstant(p.callEndsAt, delta, zone) }, zone, idForWeek);
  }
  const plan = structuredClone(current);
  const target = plan.weeks.find((w) => w.id === id)!;
  Object.assign(target, dates);
  if (plan.pattern) {
    const exceptions = plan.pattern.weekExceptions[id] ?? {};
    for (const field of ["opensAt", "deadlineAt"] as const) {
      if (!same(dates[field], week[field])) exceptions[field] = !same(dates[field], weekly(plan.pattern[field], week.number, zone));
    }
    plan.pattern.weekExceptions[id] = exceptions;
  }
  return validatePlan(plan);
}

export function editCallDates(current: SchedulePlan, call: ScheduleCall, scope: "one" | "series", zone: string, idForWeek: (week: number) => string) {
  let plan = structuredClone(current);
  const p = plan.pattern;
  const old = plan.calls.find((c) => c.id === call.id);
  if (scope === "series" && p?.callIds[1] === call.id) {
    if (!call.endsAt) throw new Error("The weekly call needs an end time.");
    p.callExceptions = p.callExceptions.filter((id) => id !== call.id);
    plan = buildWeeklyPattern(plan, { ...p, callStartsAt: call.startsAt, callEndsAt: call.endsAt }, zone, idForWeek);
    // Title/link edits apply only to the selected call; later meetings can have their own links.
  } else if (p && old && Object.values(p.callIds).includes(call.id) && (!same(old.startsAt, call.startsAt) || !same(old.endsAt, call.endsAt))) {
    if (!p.callExceptions.includes(call.id)) p.callExceptions.push(call.id);
  }
  plan.calls = [...plan.calls.filter((c) => c.id !== call.id), call];
  return validatePlan(plan);
}

export function restorePatternDate(current: SchedulePlan, kind: "week" | "call", id: string, zone: string) {
  const plan = structuredClone(current), p = plan.pattern;
  if (!p) return plan;
  if (kind === "week") {
    const week = plan.weeks.find((w) => w.id === id)!;
    week.opensAt = weekly(p.opensAt, week.number, zone); week.deadlineAt = weekly(p.deadlineAt, week.number, zone);
    delete p.weekExceptions[id];
  } else {
    const number = Number(Object.entries(p.callIds).find(([, value]) => value === id)?.[0]);
    const call = plan.calls.find((c) => c.id === id)!;
    if (number && p.callStartsAt && p.callEndsAt) { call.startsAt = weekly(p.callStartsAt, number, zone); call.endsAt = weekly(p.callEndsAt, number, zone); }
    p.callExceptions = p.callExceptions.filter((value) => value !== id);
  }
  return validatePlan(plan);
}
