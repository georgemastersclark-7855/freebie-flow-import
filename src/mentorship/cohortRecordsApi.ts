import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

const sourceSchema = z.object({ id: z.string(), title: z.string(), dateLabel: z.string(), url: z.string().nullable(), note: z.string(), transcript: z.string() });
const evidenceSchema = z.object({ sourceId: z.string(), locator: z.string(), quote: z.string(), url: z.string().nullable() });
const findingSchema = z.object({ category: z.string(), title: z.string(), text: z.string(), evidence: z.array(evidenceSchema) });
const studentSchema = z.object({ id: z.string(), name: z.string(), subtitle: z.string(), focus: z.string(), findings: z.array(findingSchema), questions: z.array(z.object({ text: z.string(), reason: z.string() })), music: z.array(findingSchema), sourceIds: z.array(z.string()) });
const payloadSchema = z.object({ version: z.literal(1), students: z.array(studentSchema), sources: z.array(sourceSchema) });
export type CohortRecordPayload = z.infer<typeof payloadSchema>;
export type RecordFinding = z.infer<typeof findingSchema>;
export const recordRoot = '/mentorship-portal/admin/cohorts/records';

// Additive table is not included in the generated database types yet.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;
export async function loadCohortRecordList(): Promise<{ id: string; name: string; student_count: number }[]> {
  const { data, error } = await db.from('mentorship_cohort_records').select('id,name,student_count').order('name');
  if (error) throw error;
  return data;
}
export async function loadCohortRecord(id: string): Promise<{ id: string; name: string; payload: CohortRecordPayload }> {
  const { data, error } = await db.from('mentorship_cohort_records').select('id,name,payload').eq('id', id).maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('Cohort not found.');
  return { id: data.id, name: data.name, payload: payloadSchema.parse(data.payload) };
}
export function recordSourceUrl(value: string | null) {
  if (!value) return undefined;
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url.href : undefined; } catch { return undefined; }
}
