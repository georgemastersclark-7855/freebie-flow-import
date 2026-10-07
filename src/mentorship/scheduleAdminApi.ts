/* eslint-disable @typescript-eslint/no-explicit-any */
// Supabase generated types have not been refreshed for the mentorship schema.
import { supabase } from "@/integrations/supabase/client";

const db = supabase as any;

export interface ScheduleCohort {
  id: string;
  displayName: string;
  timezone: string;
}

export interface ScheduleWeek {
  id: string;
  number: number;
  opensAt: string | null;
  deadlineAt: string | null;
}

export interface ScheduleCall {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string | null;
  weekId: string | null;
  joinUrl: string;
}

export async function loadScheduleCohorts(): Promise<ScheduleCohort[]> {
  const { data, error } = await db
    .from("mentorship_cohorts")
    .select("id, display_name, timezone")
    .in("status", ["active", "draft"])
    .order("starts_at", { ascending: false, nullsFirst: false });
  if (error) throw error;
  return (data ?? []).map((row: any) => ({
    id: row.id,
    displayName: row.display_name,
    timezone: row.timezone || "UTC",
  }));
}

export async function loadCohortSchedule(cohortId: string): Promise<{ weeks: ScheduleWeek[]; calls: ScheduleCall[] }> {
  const [weekResult, callResult] = await Promise.all([
    db.from("mentorship_weeks").select("id, week_number, opens_at, deadline_at").eq("cohort_id", cohortId).order("week_number"),
    db.from("mentorship_calls").select("id, title, starts_at, ends_at, week_id, circle_event_url")
      .eq("cohort_id", cohortId).eq("call_type", "group").order("starts_at"),
  ]);
  if (weekResult.error) throw weekResult.error;
  if (callResult.error) throw callResult.error;
  return {
    weeks: (weekResult.data ?? []).map((row: any) => ({
      id: row.id,
      number: row.week_number,
      opensAt: row.opens_at,
      deadlineAt: row.deadline_at,
    })),
    calls: (callResult.data ?? []).map((row: any) => ({
      id: row.id,
      title: row.title,
      startsAt: row.starts_at,
      endsAt: row.ends_at,
      weekId: row.week_id,
      joinUrl: row.circle_event_url ?? "",
    })),
  };
}

export async function saveScheduleWeek(weekId: string, values: { opensAt: string | null; deadlineAt: string | null }) {
  const { data, error } = await db.from("mentorship_weeks").update({
    opens_at: values.opensAt,
    deadline_at: values.deadlineAt,
  }).eq("id", weekId).select("id").maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("No week row was updated. Check staff access and try again.");
}

export async function saveScheduleCall(call: ScheduleCall, values: { title: string; startsAt: string; endsAt: string | null; joinUrl: string; weekId: string | null }) {
  const { data, error } = await db.from("mentorship_calls").update({
    title: values.title.trim(),
    starts_at: values.startsAt,
    ends_at: values.endsAt,
    week_id: values.weekId,
    circle_event_url: values.joinUrl.trim() || null,
  }).eq("id", call.id).select("id").maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("No group call row was updated. Check staff access and try again.");
}

export async function createScheduleCall(cohortId: string, values: {
  title: string;
  startsAt: string;
  endsAt: string;
  joinUrl: string;
  weekId: string | null;
}): Promise<string> {
  const { data, error } = await db.from("mentorship_calls").insert({
    cohort_id: cohortId,
    week_id: values.weekId,
    call_type: "group",
    title: values.title.trim(),
    starts_at: values.startsAt,
    ends_at: values.endsAt,
    circle_event_url: values.joinUrl.trim() || null,
  }).select("id").maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("The call was not created. Check staff access and try again.");
  return data.id as string;
}

function getLocalParts(date: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(date);
  return Object.fromEntries(parts.map(({ type, value }) => [type, value]));
}

export function scheduleIsoToLocalInput(value: string | null, timezone: string) {
  if (!value) return "";
  const parts = getLocalParts(new Date(value), timezone);
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

export function scheduleLocalInputToIso(value: string, timezone: string): string | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) throw new Error("Enter a valid local date and time.");
  const [, year, month, day, hour, minute] = match;
  const desired = { year, month, day, hour, minute };
  const localAsUtc = Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
  const normalized = new Date(localAsUtc);
  if (normalized.getUTCFullYear() !== Number(year) || normalized.getUTCMonth() !== Number(month) - 1
    || normalized.getUTCDate() !== Number(day) || normalized.getUTCHours() !== Number(hour) || normalized.getUTCMinutes() !== Number(minute)) {
    throw new Error("Enter a valid calendar date and time.");
  }
  const offsets = new Set<number>();
  const formatter = new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  for (let deltaHours = -48; deltaHours <= 48; deltaHours += 6) {
    const sample = new Date(localAsUtc + deltaHours * 60 * 60 * 1000);
    const parts = Object.fromEntries(formatter.formatToParts(sample).map(({ type, value: part }) => [type, part]));
    const shownAsUtc = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), Number(parts.hour), Number(parts.minute));
    offsets.add(shownAsUtc - sample.getTime());
  }
  const matches: number[] = [];
  for (const offset of offsets) {
    const candidate = localAsUtc - offset;
    const parts = getLocalParts(new Date(candidate), timezone);
    if (parts.year === desired.year && parts.month === desired.month && parts.day === desired.day && parts.hour === desired.hour && parts.minute === desired.minute) matches.push(candidate);
  }
  if (matches.length === 0) throw new Error("That local time does not exist because the clocks change. Choose another time.");
  if (matches.length > 1) throw new Error("That local time occurs twice when the clocks change. Choose a time outside the repeated hour.");
  return new Date(matches[0]).toISOString();
}

export function scheduleLocalPreview(value: string, timezone: string) {
  if (!value) return "";
  const iso = scheduleLocalInputToIso(value, timezone);
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: timezone, timeZoneName: "short" }).format(new Date(iso));
}
