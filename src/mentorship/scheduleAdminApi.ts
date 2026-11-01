/* eslint-disable @typescript-eslint/no-explicit-any */
// Supabase generated types have not been refreshed for the mentorship schema.
import type { SchedulePattern, SchedulePlan } from "./schedulePattern";
export { scheduleIsoToLocalInput, scheduleLocalInputToIso, scheduleLocalPreview } from "./scheduleTimezone";
import { supabase } from "@/integrations/supabase/client";
import { demoLoadCohorts, demoLoadSchedule, demoSaveCohortDates, demoSaveSchedule } from "./scheduleDemo";

const db = supabase as any;
// Matches PortalStore: only a local dev build can use the demo data.
export const scheduleDemoBackend = import.meta.env.DEV && import.meta.env.VITE_MENTORSHIP_BACKEND === "demo";

export interface ScheduleCohort {
  id: string;
  displayName: string;
  internalName: string;
  timezone: string;
  status: string;
  startsAt: string | null;
  endsAt: string | null;
}

export interface ScheduleWeek {
  id: string;
  number: number;
  updatedAt?: string;
  opensAt: string | null;
  deadlineAt: string | null;
}

export interface ScheduleCall {
  id: string;
  title: string;
  updatedAt?: string;
  startsAt: string;
  endsAt: string | null;
  weekId: string | null;
  joinUrl: string;
}

export async function loadScheduleCohorts(): Promise<ScheduleCohort[]> {
  if (scheduleDemoBackend) return demoLoadCohorts();
  const { data, error } = await db
    .from("mentorship_cohorts")
    .select("id, display_name, internal_name, timezone, status, starts_at, ends_at")
    .in("status", ["active", "draft"])
    .order("starts_at", { ascending: false, nullsFirst: false });
  if (error) throw error;
  return (data ?? []).map((row: any) => ({
    id: row.id,
    displayName: row.display_name,
    internalName: row.internal_name,
    timezone: row.timezone || "UTC",
    status: row.status,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
  }));
}

export async function loadCohortSchedule(cohortId: string): Promise<ScheduleSnapshot> {
  if (scheduleDemoBackend) return demoLoadSchedule();
  const [weekResult, callResult, cohortResult] = await Promise.all([
    db.from("mentorship_weeks").select("id, week_number, opens_at, deadline_at, updated_at").eq("cohort_id", cohortId).order("week_number"),
    db.from("mentorship_calls").select("id, title, starts_at, ends_at, week_id, circle_event_url, updated_at")
      .eq("cohort_id", cohortId).eq("call_type", "group").order("starts_at"),
    db.from("mentorship_cohorts").select("schedule_pattern, schedule_revision").eq("id", cohortId).single(),
  ]);
  if (weekResult.error) throw weekResult.error;
  if (callResult.error) throw callResult.error;
  if (cohortResult.error) throw cohortResult.error;
  return {
    pattern: cohortResult.data.schedule_pattern,
    revision: cohortResult.data.schedule_revision,
    weeks: (weekResult.data ?? []).map((row: any) => ({
      id: row.id,
      updatedAt: row.updated_at,
      number: row.week_number,
      opensAt: row.opens_at,
      deadlineAt: row.deadline_at,
    })),
    calls: (callResult.data ?? []).map((row: any) => ({
      id: row.id,
      updatedAt: row.updated_at,
      title: row.title,
      startsAt: row.starts_at,
      endsAt: row.ends_at,
      weekId: row.week_id,
      joinUrl: row.circle_event_url ?? "",
    })),
  };
}

export interface ScheduleSnapshot {
  weeks: ScheduleWeek[];
  calls: ScheduleCall[];
  pattern: SchedulePattern | null;
  revision: number;
}

export async function saveSchedulePlan(cohortId: string, snapshot: ScheduleSnapshot, plan: SchedulePlan) {
  if (scheduleDemoBackend) return demoSaveSchedule(snapshot, plan);
  const { error } = await db.rpc("save_mentorship_schedule", {
    p_cohort_id: cohortId,
    p_revision: snapshot.revision,
    p_expected: {
      weeks: snapshot.weeks.map(({ id, updatedAt }) => ({ id, updatedAt })),
      calls: snapshot.calls.map(({ id, updatedAt }) => ({ id, updatedAt })),
    },
    p_pattern: plan.pattern,
    p_weeks: plan.weeks,
    p_calls: plan.calls,
  });
  if (error) throw new Error(error.message || "Unable to save the schedule.");
  return loadCohortSchedule(cohortId);
}

/** Staff can already update their cohort row (the "Mentorship staff manage cohorts" policy). */
export async function saveCohortDates(cohortId: string, startsAt: string, endsAt: string) {
  if (scheduleDemoBackend) return demoSaveCohortDates(startsAt, endsAt);
  const { data, error } = await db.from("mentorship_cohorts").update({ starts_at: startsAt, ends_at: endsAt }).eq("id", cohortId).select("id");
  if (error) throw new Error(error.message || "Unable to save the cohort dates.");
  if (!data?.length) throw new Error("You don't have access to change this cohort's dates.");
}

export type ApplicationCloseStatus =
  | { state: "needs-update" }
  | { state: "ready"; forms: number; closesAt: string | null }
  | { state: "unknown" };

const missingColumn = (error: any) => error?.code === "42703" || (/closes_at/.test(error?.message ?? "") && /does not exist|could not find/i.test(error?.message ?? ""));
const missingFunction = (error: any) => error?.code === "PGRST202" || error?.code === "42883" || /could not find the function/i.test(error?.message ?? "");

/** The close time lives on the application form. Reading it fails until the planner migration is applied. */
export async function loadApplicationClose(cohortId: string): Promise<ApplicationCloseStatus> {
  if (scheduleDemoBackend) return { state: "needs-update" };
  const { data, error } = await db.from("mentorship_application_forms").select("id, closes_at").eq("cohort_id", cohortId);
  if (error) return missingColumn(error) ? { state: "needs-update" } : { state: "unknown" };
  // Coaches can't read form rows, so an empty list doesn't prove there is no form.
  if (!data?.length) return { state: "unknown" };
  const times = data.map((row: any) => row.closes_at).filter(Boolean).sort();
  return { state: "ready", forms: data.length, closesAt: times[0] ?? null };
}

export class ApplicationCloseError extends Error {
  constructor(public reason: "needs-update" | "admin-only" | "failed", message: string) { super(message); }
}

/** Admin-only, like opening and closing the form by hand. Added by 20261031170000_cohort_planner_application_close.sql. */
export async function setApplicationClose(cohortId: string, closesAt: string): Promise<number> {
  if (scheduleDemoBackend) throw new ApplicationCloseError("needs-update", "The application close time needs one database update.");
  const { data, error } = await db.rpc("set_mentorship_application_close", { p_cohort_id: cohortId, p_closes_at: closesAt });
  if (error) {
    if (missingFunction(error)) throw new ApplicationCloseError("needs-update", "The application close time needs one database update.");
    if (error.code === "42501") throw new ApplicationCloseError("admin-only", "Only an admin can set the application close time.");
    throw new ApplicationCloseError("failed", error.message || "Unable to set the application close time.");
  }
  return Number(data ?? 0);
}
