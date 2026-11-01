// Dev preview only (VITE_MENTORSHIP_BACKEND=demo): an in-memory cohort, so the staff calendar can be
// tried without a live account. Nothing here talks to Supabase.
import type { SchedulePlan } from "./schedulePattern";
import type { ScheduleCohort, ScheduleSnapshot } from "./scheduleAdminApi";

const storageKey = "rla-mentorship-demo-schedule";
const stamp = () => new Date().toISOString();

interface DemoState { cohort: ScheduleCohort; snapshot: ScheduleSnapshot }

function freshState(): DemoState {
  return {
    cohort: { id: "faa94fb4-dcf0-4d96-9369-d834c71fb0c2", displayName: "Rob Late's Producer Mentorship", internalName: "Cohort 2", timezone: "Europe/London", status: "draft", startsAt: null, endsAt: null },
    snapshot: {
      revision: 0, pattern: null, calls: [],
      weeks: Array.from({ length: 6 }, (_, index) => ({ id: `00000000-0000-4000-8000-00000000000${index + 1}`, number: index + 1, opensAt: null, deadlineAt: null, updatedAt: stamp() })),
    },
  };
}

function read(): DemoState {
  try {
    const stored = window.sessionStorage.getItem(storageKey);
    if (stored) return JSON.parse(stored) as DemoState;
  } catch { /* Fall back to a fresh demo cohort. */ }
  return freshState();
}
function write(state: DemoState) {
  try { window.sessionStorage.setItem(storageKey, JSON.stringify(state)); } catch { /* Demo state lasts for this page only. */ }
}
const pause = () => new Promise((resolve) => window.setTimeout(resolve, 250));
// Store the pattern the way Postgres jsonb returns it: object keys ordered by length, then text.
const asJsonb = (value: unknown): unknown => Array.isArray(value) ? value.map(asJsonb)
  : value && typeof value === "object" ? Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.length - b.length || (a < b ? -1 : a > b ? 1 : 0)).map(([key, item]) => [key, asJsonb(item)]))
  : value;

export async function demoLoadCohorts() { await pause(); return [read().cohort]; }
export async function demoLoadSchedule(): Promise<ScheduleSnapshot> { await pause(); return structuredClone(read().snapshot); }

export async function demoSaveSchedule(snapshot: ScheduleSnapshot, plan: SchedulePlan) {
  await pause();
  const state = read();
  if (state.snapshot.revision !== snapshot.revision) throw new Error("This schedule has changed. Close the editor and reload the calendar before saving.");
  const now = stamp();
  state.snapshot = {
    revision: state.snapshot.revision + 1,
    pattern: asJsonb(plan.pattern) as SchedulePlan["pattern"],
    weeks: plan.weeks.map((week) => ({ ...week, updatedAt: now })),
    calls: plan.calls.map((call) => ({ ...call, updatedAt: now })).sort((a, b) => a.startsAt.localeCompare(b.startsAt)),
  };
  write(state);
  return structuredClone(state.snapshot);
}

export async function demoSaveCohortDates(startsAt: string, endsAt: string) {
  await pause();
  const state = read();
  state.cohort = { ...state.cohort, startsAt, endsAt };
  write(state);
}
