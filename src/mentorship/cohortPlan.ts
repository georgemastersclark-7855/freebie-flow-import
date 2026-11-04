import type { ScheduleCall, ScheduleWeek } from "./scheduleAdminApi";
import type { SalesEmail } from "./salesEmailsApi";
import { scheduleIsoToLocalInput, scheduleLocalInputToIso } from "./scheduleTimezone";
import { shiftInstant, validatePlan, type CohortPlannerSettings, type PlannerOneOffs, type SchedulePattern, type SchedulePlan } from "./schedulePattern";

// The cohort planner: pick the day applications open and every other date is planned from it.
// All rules are in UK time, so a 7pm call stays at 7pm across the clock changes.
export const PLAN_ZONE = "Europe/London";
export const PLANNED_CALLS = 6;
export const PLANNED_SUBMISSIONS = 5;
// Cohort 2's id, as used by its application form seed migration.
export const COHORT_TWO_ID = "faa94fb4-dcf0-4d96-9369-d834c71fb0c2";
const COHORT_TWO_OPENS_ON = "2026-11-04";

export type Day = string;
export type PhaseKey = "warm" | "sales" | "onb" | "w1" | "w2" | "w3" | "w4" | "w5" | "w6";
export type PlannerEventType = "sales" | "email" | "onb" | "call" | "due" | "rev";
export interface Phase { key: PhaseKey; label: string; from: Day; to: Day }
export interface PlannedSlot { number: number; startsAt: string; endsAt: string }
export interface PlannedEmail { id: string; daysFromOpen: number; subject: string; note: string; campaign: string }

// The sales emails, relative to the day applications open. They move with the sales week. Each one
// is matched to its Klaviyo campaign by name ("C2 Sales 1 - ..."), and the real subject and copy
// come from there. The subjects here only show if Klaviyo can't be reached. Nothing is sent or
// scheduled from the calendar.
export const PLANNED_EMAILS: PlannedEmail[] = [
  { id: "warm-up-1", daysFromOpen: -3, campaign: "Warm Up 1", subject: "Warm-up email 1", note: "A production lesson. No pitch." },
  { id: "warm-up-2", daysFromOpen: -2, campaign: "Warm Up 2", subject: "Warm-up email 2", note: "Value, then the waitlist sign-up: the mentorship opens this week, reply WAITLIST for first access." },
  { id: "priority-access", daysFromOpen: -1, campaign: "Sales 1", subject: "you're getting priority access", note: "To the waitlist." },
  { id: "raising-the-standard", daysFromOpen: 0, campaign: "Sales 2", subject: "i'm raising the standard", note: "Full list. Rob posts on Instagram stories." },
  { id: "practising", daysFromOpen: 2, campaign: "Sales 3", subject: "what are you actually practising?", note: "" },
  { id: "bass", daysFromOpen: 3, campaign: "Sales 4", subject: "his bass wasn't the problem", note: "" },
  { id: "folder", daysFromOpen: 5, campaign: "Sales 5", subject: "the folder i take into writing sessions", note: "" },
  { id: "work-on-together", daysFromOpen: 6, campaign: "Sales 6", subject: "here's what we'll work on together", note: "Includes the price." },
  { id: "last-call", daysFromOpen: 7, campaign: "Last Call", subject: "Last call", note: "Applications close at 11:59pm UK time." },
];

const CALL_NOTES = [
  "Kickoff. Week 1 opens straight after. Nothing to review yet.",
  "Feedback on submission 1, plus live production.",
  "Feedback on submission 2, plus live production.",
  "Feedback on submission 3, plus live production.",
  "Feedback on submission 4. Everyone picks the track to finish.",
  "Finished tracks played and reviewed. Last touchpoint. Week 6 closes in the portal when this call starts.",
];
const SUBMISSION_NOTES = [
  "Submission 1: 5 songstarters + 1 developed idea.",
  "Submission 2: 5 songstarters + 1 developed idea.",
  "Submission 3: 5 songstarters + 1 developed idea.",
  "Submission 4: the last set of songstarters. 20 ideas in total.",
  "Submission 5: the finished track.",
];
export const defaultCallTitle = (number: number) => number === 1 ? "Kickoff call" : number === PLANNED_CALLS ? "Final call" : `Group call ${number}`;
export const plannerCallLabel = (number: number) => number === PLANNED_CALLS ? `Call ${number}: final call` : `Call ${number}`;

// Calendar-date arithmetic, independent of clock changes.
export const addDays = (day: Day, days: number): Day => new Date(Date.UTC(Number(day.slice(0, 4)), Number(day.slice(5, 7)) - 1, Number(day.slice(8, 10)) + days, 12)).toISOString().slice(0, 10);
export const weekdayOf = (day: Day) => new Date(`${day}T12:00:00Z`).getUTCDay();
export const daysBetween = (from: Day, to: Day) => Math.round((Date.parse(`${to}T12:00:00Z`) - Date.parse(`${from}T12:00:00Z`)) / 86_400_000);
export const isDay = (value: unknown): value is Day => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && addDays(value, 0) === value;
export const ukLocal = (iso: string) => scheduleIsoToLocalInput(iso, PLAN_ZONE);
export const ukDay = (iso: string) => ukLocal(iso).slice(0, 10);
export const ukInstant = (day: Day, time: string) => scheduleLocalInputToIso(`${day}T${time}`, PLAN_ZONE)!;
export const ukToday = (now = Date.now()) => ukDay(new Date(now).toISOString());
/** A datetime-local value in UK time to an instant. Throws with a plain message. */
export const ukInputToIso = (value: string) => scheduleLocalInputToIso(value, PLAN_ZONE);

export const plannerFilters: Record<PlannerEventType, { label: string; on: boolean }> = {
  sales: { label: "Sales milestones", on: true },
  email: { label: "Show emails in the calendar", on: false },
  onb: { label: "Onboarding", on: true },
  call: { label: "Live calls", on: true },
  due: { label: "Work due", on: true },
  rev: { label: "Rob reviews", on: false },
};
export const dayLabel = (day: Day, options: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short" }) => new Intl.DateTimeFormat("en-GB", { ...options, timeZone: "UTC" }).format(new Date(`${day}T12:00:00Z`));
/** "19:00" to "7pm", "23:59" to "11:59pm". */
export function clockLabel(time: string) {
  if (!time) return "";
  const hour = Number(time.slice(0, 2)), minute = time.slice(3, 5);
  return `${hour % 12 || 12}${minute === "00" ? "" : `:${minute}`}${hour < 12 ? "am" : "pm"}`;
}
export const ukTimeLabel = (iso: string) => clockLabel(ukLocal(iso).slice(11));
export const ukMoment = (iso: string) => `${dayLabel(ukDay(iso))}, ${ukTimeLabel(iso)}`;
const shift = (iso: string, minutes = 0) => minutes ? shiftInstant(iso, minutes, PLAN_ZONE) : iso;
const same = (a: string | null | undefined, b: string | null | undefined) => a === b || (Boolean(a) && Boolean(b) && Date.parse(a!) === Date.parse(b!));

export interface CohortTimeline {
  opensOn: Day;
  waitlistOn: Day;
  closesOn: Day;
  closesAt: string;
  onboarding: { from: Day; to: Day };
  calls: PlannedSlot[];
  submissions: { number: number; dueAt: string }[];
  emails: (PlannedEmail & { day: Day })[];
  phases: Phase[];
}

/** The rules, with no one-off changes. */
export function planCohort(opensOn: Day): CohortTimeline {
  const closesOn = addDays(opensOn, 7);
  let kickoff = addDays(closesOn, 4);
  while (weekdayOf(kickoff) !== 0) kickoff = addDays(kickoff, 1);
  const callDays = Array.from({ length: PLANNED_CALLS }, (_, index) => addDays(kickoff, index * 7));
  const calls = callDays.map((day, index) => ({ number: index + 1, startsAt: ukInstant(day, "19:00"), endsAt: ukInstant(day, "20:30") }));
  // Each submission is due the Thursday after its call and reviewed on the next call.
  const submissions = callDays.slice(0, PLANNED_SUBMISSIONS).map((day, index) => ({ number: index + 1, dueAt: ukInstant(addDays(day, 4), "23:59") }));
  const weekLabels = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5 · finish the track", "Week 6 · final call"];
  const phases: Phase[] = [
    { key: "warm", label: "Warm-up", from: addDays(opensOn, -3), to: addDays(opensOn, -2) },
    { key: "sales", label: "Sales week", from: addDays(opensOn, -1), to: closesOn },
    { key: "onb", label: "Onboarding", from: addDays(closesOn, 1), to: addDays(closesOn, 3) },
    ...callDays.map((day, index) => ({ key: `w${index + 1}` as PhaseKey, label: weekLabels[index], from: day, to: index === PLANNED_CALLS - 1 ? day : addDays(day, 6) })),
  ];
  return {
    opensOn, waitlistOn: addDays(opensOn, -1), closesOn, closesAt: ukInstant(closesOn, "23:59"),
    onboarding: { from: addDays(closesOn, 1), to: addDays(closesOn, 3) },
    calls, submissions, phases,
    emails: PLANNED_EMAILS.map((email) => ({ ...email, day: addDays(opensOn, email.daysFromOpen) })),
  };
}

export interface PlannerDraft {
  opensOn: Day;
  oneOffs: PlannerOneOffs;
  /** Topic and joining link edits, by call number. */
  callText: Record<string, { title: string; joinUrl: string }>;
}
export const emptyOneOffs = (): PlannerOneOffs => ({ calls: {}, weeks: {} });

export interface ResolvedWeek { number: number; opensAt: string; deadlineAt: string; rule: { opensAt: string; deadlineAt: string }; moved: boolean }
export interface ResolvedCall extends PlannedSlot { planned: PlannedSlot; moved: boolean }
export interface ResolvedPlan { timeline: CohortTimeline; calls: ResolvedCall[]; weeks: ResolvedWeek[] }

/**
 * Portal weeks follow the actual calls and deadlines: week 1 opens when the kickoff call ends,
 * week N opens the moment week N-1's deadline passes, weeks 1 to 5 are due on their Thursday.
 * Week 6 has nothing due, but the portal needs a deadline: it is the final call's start, so
 * nothing in the portal is due after the final call. The submission 5 deadline is not usable
 * because week 6 opens at that same moment and the database needs the deadline after the opening.
 */
export function resolvePlan(draft: PlannerDraft): ResolvedPlan {
  const timeline = planCohort(draft.opensOn);
  const calls = timeline.calls.map((call) => {
    const oneOff = draft.oneOffs.calls[call.number];
    return { ...call, startsAt: shift(call.startsAt, oneOff?.start), endsAt: shift(call.endsAt, oneOff?.end), planned: call, moved: Boolean(oneOff && (oneOff.start || oneOff.end)) };
  });
  const weeks: ResolvedWeek[] = [];
  for (let number = 1; number <= PLANNED_CALLS; number += 1) {
    const oneOff = draft.oneOffs.weeks[number];
    const rule = {
      opensAt: number === 1 ? calls[0].endsAt : weeks[number - 2].deadlineAt,
      deadlineAt: number <= PLANNED_SUBMISSIONS ? timeline.submissions[number - 1].dueAt : calls[PLANNED_CALLS - 1].startsAt,
    };
    weeks.push({ number, rule, opensAt: shift(rule.opensAt, oneOff?.opens), deadlineAt: shift(rule.deadlineAt, oneOff?.deadline), moved: Boolean(oneOff && (oneOff.opens || oneOff.deadline)) });
  }
  return { timeline, calls, weeks };
}

type Snapshot = { weeks: ScheduleWeek[]; calls: ScheduleCall[]; pattern: SchedulePattern | null };

/** Which saved call is call N: the pattern's link first, then a call linked to week N. */
export function assignCalls(snapshot: Snapshot) {
  const ids: Record<number, string> = {};
  const used = new Set<string>();
  for (let number = 1; number <= PLANNED_CALLS; number += 1) {
    let call = snapshot.calls.find((item) => item.id === snapshot.pattern?.callIds?.[number] && !used.has(item.id));
    const week = snapshot.weeks.find((item) => item.number === number);
    if (!call && week) call = snapshot.calls.filter((item) => item.weekId === week.id && !used.has(item.id)).sort((a, b) => a.startsAt.localeCompare(b.startsAt))[0];
    if (call) { ids[number] = call.id; used.add(call.id); }
  }
  return ids;
}

const cleanOneOffs = (oneOffs: PlannerOneOffs): PlannerOneOffs => ({
  calls: Object.fromEntries(Object.entries(oneOffs.calls ?? {}).filter(([, value]) => value && (value.start || value.end))),
  weeks: Object.fromEntries(Object.entries(oneOffs.weeks ?? {}).filter(([, value]) => value && (value.opens || value.deadline))),
});
// Postgres jsonb reorders object keys, so compare values rather than JSON text.
const oneOffKey = (oneOffs: PlannerOneOffs | undefined) => {
  const clean = cleanOneOffs(oneOffs ?? emptyOneOffs());
  const sorted = <T,>(record: Record<string, T>) => Object.entries(record).sort(([a], [b]) => Number(a) - Number(b));
  return JSON.stringify([sorted(clean.calls).map(([key, value]) => [key, value.start || 0, value.end || 0]), sorted(clean.weeks).map(([key, value]) => [key, value.opens || 0, value.deadline || 0])]);
};
export const sameDraft = (a: PlannerDraft, b: PlannerDraft) => a.opensOn === b.opensOn && oneOffKey(a.oneOffs) === oneOffKey(b.oneOffs)
  && JSON.stringify(Object.entries(a.callText).sort()) === JSON.stringify(Object.entries(b.callText).sort());

export function plannerSettings(draft: PlannerDraft, timeline: CohortTimeline, publishedAt: string | null): CohortPlannerSettings {
  return {
    version: 1, zone: PLAN_ZONE, applicationsOpenOn: draft.opensOn, publishedAt, oneOffs: cleanOneOffs(draft.oneOffs),
    sales: { waitlistOn: timeline.waitlistOn, opensOn: timeline.opensOn, closesAt: timeline.closesAt },
    onboarding: timeline.onboarding,
    emails: timeline.emails.map((email) => ({ id: email.id, subject: email.subject, sendOn: email.day, daysFromOpen: email.daysFromOpen })),
  };
}

export interface BuiltPlan { plan: SchedulePlan; resolved: ResolvedPlan; callIds: Record<number, string>; missingWeeks: number[] }

/** Expands the draft into the rows save_mentorship_schedule writes. Existing ids, topics and links are kept. */
export function buildPlannerPlan(snapshot: Snapshot, draft: PlannerDraft, idFor: (number: number) => string, publishedAt: string | null = null): BuiltPlan {
  const resolved = resolvePlan(draft);
  const weekByNumber = new Map(snapshot.weeks.map((week) => [week.number, week]));
  const weeks = snapshot.weeks.map((week) => {
    const planned = resolved.weeks[week.number - 1];
    return planned ? { ...week, opensAt: planned.opensAt, deadlineAt: planned.deadlineAt } : { ...week };
  });
  const missingWeeks = resolved.weeks.map((week) => week.number).filter((number) => !weekByNumber.has(number));
  const saved = assignCalls(snapshot);
  const calls = snapshot.calls.map((call) => ({ ...call }));
  const callIds: Record<number, string> = {};
  for (const slot of resolved.calls) {
    const id = saved[slot.number] ?? idFor(slot.number);
    callIds[slot.number] = id;
    const existing = calls.find((call) => call.id === id);
    const text = draft.callText[slot.number];
    const next: ScheduleCall = {
      id, updatedAt: existing?.updatedAt,
      title: text?.title ?? existing?.title ?? defaultCallTitle(slot.number),
      joinUrl: text?.joinUrl ?? existing?.joinUrl ?? snapshot.pattern?.joinUrl ?? "",
      startsAt: slot.startsAt, endsAt: slot.endsAt,
      weekId: weekByNumber.get(slot.number)?.id ?? existing?.weekId ?? null,
    };
    if (existing) Object.assign(existing, next); else calls.push(next);
  }
  // Keep the version 1 pattern truthful for anything that still reads it: dates that differ from a
  // plain weekly repeat are marked as one-offs.
  const callStartsAt = resolved.timeline.calls[0].startsAt, callEndsAt = resolved.timeline.calls[0].endsAt;
  const week1 = resolved.weeks[0];
  const weekly = (iso: string, number: number) => shiftInstant(iso, (number - 1) * 7 * 1440, PLAN_ZONE);
  const weekExceptions: SchedulePattern["weekExceptions"] = {};
  for (const week of weeks) {
    const planned = resolved.weeks[week.number - 1];
    if (!planned || week.number === 1) continue;
    const flags = { opensAt: !same(planned.opensAt, weekly(week1.opensAt, week.number)), deadlineAt: !same(planned.deadlineAt, weekly(week1.deadlineAt, week.number)) };
    if (flags.opensAt || flags.deadlineAt) weekExceptions[week.id] = flags;
  }
  const callExceptions = resolved.calls.filter((slot) => !same(slot.startsAt, weekly(callStartsAt, slot.number)) || !same(slot.endsAt, weekly(callEndsAt, slot.number))).map((slot) => callIds[slot.number]);
  const pattern: SchedulePattern = {
    version: 1, opensAt: week1.opensAt, deadlineAt: week1.deadlineAt, callStartsAt, callEndsAt,
    callTitle: snapshot.pattern?.callTitle || "Group call", joinUrl: snapshot.pattern?.joinUrl ?? "",
    callIds: Object.fromEntries(Object.entries(callIds).map(([number, id]) => [number, id])),
    weekExceptions, callExceptions,
    planner: plannerSettings(draft, resolved.timeline, publishedAt),
  };
  return { plan: validatePlan({ weeks, calls, pattern }), resolved, callIds, missingWeeks };
}

export interface PlanChanges { weeks: number; calls: number; newCalls: number; deadlines: number; plannerChanged: boolean; any: boolean }
export function planChanges(snapshot: Snapshot, plan: SchedulePlan): PlanChanges {
  const weekChanges = plan.weeks.filter((week) => { const old = snapshot.weeks.find((item) => item.id === week.id); return !old || !same(old.opensAt, week.opensAt) || !same(old.deadlineAt, week.deadlineAt); });
  const deadlines = plan.weeks.filter((week) => week.number <= PLANNED_SUBMISSIONS && !same(snapshot.weeks.find((item) => item.id === week.id)?.deadlineAt, week.deadlineAt)).length;
  let newCalls = 0;
  const calls = plan.calls.filter((call) => {
    const old = snapshot.calls.find((item) => item.id === call.id);
    if (!old) { newCalls += 1; return true; }
    return !same(old.startsAt, call.startsAt) || !same(old.endsAt, call.endsAt) || old.title !== call.title || old.joinUrl !== call.joinUrl || old.weekId !== call.weekId;
  }).length;
  const saved = snapshot.pattern?.planner;
  const next = plan.pattern?.planner;
  const plannerChanged = !saved || saved.applicationsOpenOn !== next?.applicationsOpenOn || oneOffKey(saved.oneOffs) !== oneOffKey(next?.oneOffs);
  return { weeks: weekChanges.length, calls, newCalls, deadlines, plannerChanged, any: Boolean(weekChanges.length || calls || plannerChanged) };
}

export function draftFromSnapshot(snapshot: Snapshot, cohortId: string, today: Day): PlannerDraft {
  const saved = snapshot.pattern?.planner;
  if (saved?.version === 1 && isDay(saved.applicationsOpenOn)) {
    return { opensOn: saved.applicationsOpenOn, oneOffs: { calls: { ...saved.oneOffs?.calls }, weeks: { ...saved.oneOffs?.weeks } }, callText: {} };
  }
  return { opensOn: defaultOpensOn(snapshot, cohortId, today), oneOffs: emptyOneOffs(), callText: {} };
}

function defaultOpensOn(snapshot: Snapshot, cohortId: string, today: Day) {
  if (cohortId === COHORT_TWO_ID) return COHORT_TWO_OPENS_ON;
  // An existing Sunday kickoff call means applications opened eleven days earlier.
  const kickoff = snapshot.calls.find((call) => call.id === assignCalls(snapshot)[1]);
  if (kickoff && weekdayOf(ukDay(kickoff.startsAt)) === 0) return addDays(ukDay(kickoff.startsAt), -11);
  let day = addDays(today, 4);
  while (weekdayOf(day) !== 3) day = addDays(day, 1);
  return day;
}

const listJoin = (items: string[]) => items.length <= 1 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
const inChristmasWeek = (day: Day) => day.slice(5) >= "12-21" && day.slice(5) <= "12-31";

export function planWarnings(resolved: ResolvedPlan, today: Day, publishedOpensOn?: Day) {
  const warnings: string[] = [];
  const finalCall = resolved.calls[PLANNED_CALLS - 1];
  const finalDay = ukDay(finalCall.startsAt);
  const festive = [
    ...resolved.calls.slice(0, -1).filter((call) => inChristmasWeek(ukDay(call.startsAt))).map((call) => `call ${call.number}`),
    ...resolved.weeks.slice(0, PLANNED_SUBMISSIONS).filter((week) => inChristmasWeek(ukDay(week.deadlineAt))).map((week) => `submission ${week.number}`),
  ];
  if (inChristmasWeek(finalDay)) warnings.push(`The final call falls in Christmas week (21 to 31 December), on ${dayLabel(finalDay, { weekday: "long", day: "numeric", month: "long" })}.${festive.length ? ` So ${festive.length === 1 ? "does" : "do"} ${listJoin(festive)}.` : ""}`);
  else if (festive.length) warnings.push(`${listJoin(festive).replace(/^./, (letter) => letter.toUpperCase())} ${festive.length === 1 ? "falls" : "fall"} in Christmas week (21 to 31 December).`);
  // Only when choosing new dates: a published sales week that has started is meant to be in the past.
  if (resolved.timeline.waitlistOn < today && resolved.timeline.opensOn !== publishedOpensOn) warnings.push(`The waitlist day, ${dayLabel(resolved.timeline.waitlistOn, { weekday: "long", day: "numeric", month: "long" })}, is in the past.`);
  const late = [
    ...resolved.weeks.slice(0, PLANNED_SUBMISSIONS).filter((week) => Date.parse(week.deadlineAt) > Date.parse(finalCall.startsAt)).map((week) => `Submission ${week.number}`),
    ...resolved.weeks.slice(PLANNED_SUBMISSIONS).filter((week) => Date.parse(week.deadlineAt) > Date.parse(finalCall.startsAt)).map((week) => `Week ${week.number} in the portal`),
  ];
  if (late.length) warnings.push(`${listJoin(late)} ${late.length === 1 ? "is" : "are"} due after the final call. The final call should be the last touchpoint.`);
  return warnings;
}

export interface PlannerEvent {
  key: string;
  day: Day;
  type: PlannerEventType;
  time: string;
  title: string;
  note: string;
  at?: string;
  call?: { number?: number; id: string };
  week?: number;
  /** The email as it is in Klaviyo, when it has been found there. */
  copy?: SalesEmail;
}

const copyFor = (email: PlannedEmail, copies: SalesEmail[]) => copies.find((copy) => copy.key.toLowerCase() === email.campaign.toLowerCase());

export function plannerEvents(built: BuiltPlan, copies: SalesEmail[] = []): PlannerEvent[] {
  const { resolved, plan, callIds } = built;
  const t = resolved.timeline;
  const events: PlannerEvent[] = [
    { key: "waitlist", day: t.waitlistOn, type: "sales", time: "", title: "Waitlist early access", note: "24-hour head start for the waitlist." },
    { key: "open", day: t.opensOn, type: "sales", time: "", title: "Applications open", note: "Open to the full list." },
    { key: "close", day: t.closesOn, type: "sales", time: "23:59", title: "Applications close", note: "", at: t.closesAt },
    ...t.emails.map((email) => {
      const copy = copyFor(email, copies);
      const sends = copy?.sendAt && copy.status !== "Draft" ? ukLocal(copy.sendAt).slice(11) : "";
      return { key: `email:${email.id}`, day: email.day, type: "email" as const, time: sends, title: copy?.subject || email.subject, note: email.note, copy };
    }),
  ];
  for (let day = t.onboarding.from; day <= t.onboarding.to; day = addDays(day, 1)) {
    events.push({ key: `onb:${day}`, day, type: "onb", time: "", title: "Onboarding 1:1s", note: day === t.onboarding.from ? "Rob's one-to-one call with each student." : "" });
  }
  for (const call of resolved.calls) {
    events.push({ key: `call:${call.number}`, day: ukDay(call.startsAt), type: "call", time: ukLocal(call.startsAt).slice(11), title: plannerCallLabel(call.number), note: CALL_NOTES[call.number - 1], at: call.startsAt, call: { number: call.number, id: callIds[call.number] } });
  }
  const planned = new Set(Object.values(callIds));
  for (const call of plan.calls.filter((item) => !planned.has(item.id))) {
    events.push({ key: `call:${call.id}`, day: ukDay(call.startsAt), type: "call", time: ukLocal(call.startsAt).slice(11), title: call.title, note: "Added outside the plan. It keeps its own date.", at: call.startsAt, call: { id: call.id } });
  }
  for (const week of resolved.weeks.slice(0, PLANNED_SUBMISSIONS)) {
    const day = ukDay(week.deadlineAt);
    events.push({ key: `due:${week.number}`, day, type: "due", time: ukLocal(week.deadlineAt).slice(11), title: "Submission deadline", note: SUBMISSION_NOTES[week.number - 1], at: week.deadlineAt, week: week.number });
    for (const offset of [1, 2]) events.push({ key: `rev:${week.number}:${offset}`, day: addDays(day, offset), type: "rev", time: "", title: "Rob reviews", note: offset === 1 ? `Rob listens to submission ${week.number} and records feedback.` : "" });
  }
  return events.sort((a, b) => a.day.localeCompare(b.day) || (a.time || "00:00").localeCompare(b.time || "00:00"));
}

/** From a week before the waitlist day to a week after the final call, in whole Sunday-first rows. */
export function plannerRange(resolved: ResolvedPlan) {
  let from = addDays(resolved.timeline.waitlistOn, -7);
  from = addDays(from, -weekdayOf(from));
  const finalDay = [ukDay(resolved.calls[PLANNED_CALLS - 1].startsAt), resolved.timeline.phases[resolved.timeline.phases.length - 1].to].sort().pop()!;
  let to = addDays(finalDay, 7);
  to = addDays(to, 6 - weekdayOf(to));
  return { from, to };
}

export function monthsLabel(resolved: ResolvedPlan) {
  const start = ukDay(resolved.calls[0].startsAt), end = ukDay(resolved.calls[PLANNED_CALLS - 1].startsAt);
  const month = (day: Day) => dayLabel(day, { month: "long" });
  if (start.slice(0, 7) === end.slice(0, 7)) return `${month(start)} ${start.slice(0, 4)}`;
  return start.slice(0, 4) === end.slice(0, 4) ? `${month(start)} to ${month(end)} ${end.slice(0, 4)}` : `${month(start)} ${start.slice(0, 4)} to ${month(end)} ${end.slice(0, 4)}`;
}
