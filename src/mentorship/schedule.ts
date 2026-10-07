import type { PortalCall, WeekDefinition, WeekSubmission } from "./types";

export const timestamp = (value?: string) => value && Number.isFinite(Date.parse(value)) ? Date.parse(value) : undefined;
export const callEnd = (call: PortalCall) => {
  const start = timestamp(call.startsAt) ?? 0;
  const end = timestamp(call.endsAt);
  return end !== undefined && end > start ? end : start + 90 * 60_000;
};

export function nextScheduledCall(calls: PortalCall[], now: number) {
  return [...calls].filter((call) => timestamp(call.startsAt) !== undefined && callEnd(call) > now)
    .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt))[0];
}

export function countdown(target: number, now: number) {
  const minutes = Math.max(0, Math.ceil((target - now) / 60_000));
  if (minutes === 0) return "0 min";
  if (minutes >= 1440) return `${Math.floor(minutes / 1440)}d ${Math.floor(minutes % 1440 / 60)}h`;
  if (minutes >= 60) return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  return `${minutes} min`;
}

export function countdownParts(target: number | undefined, now: number) {
  if (target === undefined || !Number.isFinite(target)) return undefined;
  const seconds = Math.max(0, Math.ceil((target - now) / 1000));
  return { days: Math.floor(seconds / 86400), hours: Math.floor(seconds % 86400 / 3600), minutes: Math.floor(seconds % 3600 / 60), seconds: seconds % 60 };
}

export function localScheduleTime(value?: string, timezone?: string) {
  if (timestamp(value) === undefined) return "Date to be confirmed";
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZoneName: "short", timeZone: timezone,
  }).format(new Date(value!));
}

export function weekTiming(week: WeekDefinition, submission: WeekSubmission | undefined, now: number) {
  const opens = timestamp(week.opensAt);
  const due = timestamp(week.deadlineAt);
  const elapsed = opens !== undefined && due !== undefined && due > opens
    ? Math.max(0, Math.min(100, (now - opens) / (due - opens) * 100)) : undefined;
  if (submission?.feedback && !submission.feedback.actionConfirmedAt) return { state: "feedback", label: "Your feedback is ready", detail: "Read Rob's notes", elapsed } as const;
  if (submission && ["submitted", "late"].includes(submission.state)) return { state: "submitted", label: "Submitted to Rob", detail: submission.feedback ? "Feedback received" : "Awaiting feedback", elapsed } as const;
  if (opens !== undefined && opens > now) return { state: "upcoming", label: `Opens in ${countdown(opens, now)}`, detail: localScheduleTime(week.opensAt), elapsed } as const;
  if (week.phase === "upcoming") return { state: "upcoming", label: `Opens in week ${week.number}`, detail: "Opening date to be confirmed", elapsed: undefined } as const;
  if (due === undefined) return { state: "unscheduled", label: "Deadline to be confirmed", detail: "Your weekly submission", elapsed } as const;
  if (now >= due) return { state: "overdue", label: "Deadline passed", detail: `Due ${localScheduleTime(week.deadlineAt)}`, elapsed } as const;
  return { state: due - now <= 86_400_000 ? "soon" : "open", label: `${countdown(due, now)} remaining`, detail: `Due ${localScheduleTime(week.deadlineAt)}`, elapsed } as const;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  description: string;
  location?: string;
}

export const safeScheduleUrl = (url?: string) => {
  try { const parsed = new URL(url ?? ""); return ["https:", "http:"].includes(parsed.protocol) ? parsed.href : undefined; }
  catch { return undefined; }
};

export function callCalendarEvent(call: PortalCall): CalendarEvent | undefined {
  if (timestamp(call.startsAt) === undefined) return undefined;
  const location = safeScheduleUrl(call.circleUrl);
  return { id: `call-${call.id}`, title: call.title, startsAt: call.startsAt, endsAt: new Date(callEnd(call)).toISOString(),
    location, description: `Rob Late's Producer Mentorship\n${location ? `Join the call: ${location}\n` : ""}Check the portal for the latest call details: https://audio.roblate.com/mentorship-portal/dashboard` };
}

export function deadlineCalendarEvent(week: WeekDefinition, cohortId: string): CalendarEvent | undefined {
  const due = timestamp(week.deadlineAt);
  if (due === undefined) return undefined;
  return { id: `deadline-${cohortId}-${week.id ?? week.number}`, title: `Week ${week.number} submission deadline | Rob Late`,
    startsAt: week.deadlineAt!, endsAt: new Date(due).toISOString(),
    description: `Send your week ${week.number} submission to Rob before this deadline.\nhttps://audio.roblate.com/mentorship-portal/week/${week.number}` };
}

const calendarStamp = (value: string) => new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
export function googleCalendarUrl(event: CalendarEvent) {
  const params = new URLSearchParams({ action: "TEMPLATE", text: event.title, dates: `${calendarStamp(event.startsAt)}/${calendarStamp(event.endsAt)}`, details: event.description });
  if (event.location) params.set("location", event.location);
  return `https://calendar.google.com/calendar/render?${params}`;
}

// RFC 5545 TEXT escaping, CRLF endings and 75-octet folding (including UTF-8).
const escapeText = (text: string) => text.replace(/\\/g, "\\\\").replace(/\r\n|\r|\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,");
const fold = (line: string) => {
  const encoder = new TextEncoder();
  let result = "", size = 0;
  for (const character of line) {
    const bytes = encoder.encode(character).length;
    if (size + bytes > 75) { result += "\r\n "; size = 1; }
    result += character; size += bytes;
  }
  return result;
};
export function calendarFile(event: CalendarEvent, now = Date.now()) {
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Rob Late Audio//Producer Mentorship//EN", "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
    `UID:${escapeText(event.id)}@audio.roblate.com`, `DTSTAMP:${calendarStamp(new Date(now).toISOString())}`,
    `DTSTART:${calendarStamp(event.startsAt)}`, ...(Date.parse(event.endsAt) > Date.parse(event.startsAt) ? [`DTEND:${calendarStamp(event.endsAt)}`] : []),
    `SUMMARY:${escapeText(event.title)}`, `DESCRIPTION:${escapeText(event.description)}`,
    ...(event.location ? [`LOCATION:${escapeText(event.location)}`] : []), "END:VEVENT", "END:VCALENDAR"];
  return lines.map(fold).join("\r\n") + "\r\n";
}
