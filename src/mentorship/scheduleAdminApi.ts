/* eslint-disable @typescript-eslint/no-explicit-any */
// Supabase generated types have not been refreshed for the mentorship schema.
import type { SchedulePattern, SchedulePlan } from "./schedulePattern";
export { scheduleIsoToLocalInput, scheduleLocalInputToIso, scheduleLocalPreview } from "./scheduleTimezone";
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

export async function loadCohortSchedule(cohortId: string): Promise<ScheduleSnapshot> {
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
