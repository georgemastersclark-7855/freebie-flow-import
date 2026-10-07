import { scheduleIsoToLocalInput, type ScheduleCall, type ScheduleWeek } from "./scheduleAdminApi";

export type CalendarEvent = { id: string; kind: "call" | "deadline" | "opening"; title: string; local: string; sourceId: string };
export const calendarDate = (date: Date) => `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
export const calendarDayLabel = (day: string, options: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long" }) => new Intl.DateTimeFormat("en-GB", { ...options, timeZone: "UTC" }).format(new Date(`${day}T12:00:00Z`));
export function calendarMonthDays(month: string) {
  const first = new Date(`${month}-01T12:00:00Z`);
  const offset = (first.getUTCDay() + 6) % 7;
  const count = Math.ceil((offset + new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate()) / 7) * 7;
  return Array.from({ length: count }, (_, index) => calendarDate(new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), 1 - offset + index, 12))));
}
export function shiftCalendarMonth(month: string, offset: number) {
  const date = new Date(`${month}-01T12:00:00Z`);
  return calendarDate(new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + offset, 1, 12))).slice(0, 7);
}
export function calendarEvents(weeks: ScheduleWeek[], calls: ScheduleCall[], timezone: string): CalendarEvent[] {
  const events: CalendarEvent[] = calls.map((call) => ({ id: `call:${call.id}`, kind: "call", title: call.title, local: scheduleIsoToLocalInput(call.startsAt, timezone), sourceId: call.id }));
  for (const week of weeks) {
    if (week.opensAt) events.push({ id: `opening:${week.id}`, kind: "opening", title: `Week ${week.number} opens`, local: scheduleIsoToLocalInput(week.opensAt, timezone), sourceId: week.id });
    if (week.deadlineAt) events.push({ id: `deadline:${week.id}`, kind: "deadline", title: `Week ${week.number} deadline`, local: scheduleIsoToLocalInput(week.deadlineAt, timezone), sourceId: week.id });
  }
  return events.sort((a, b) => a.local.localeCompare(b.local));
}
