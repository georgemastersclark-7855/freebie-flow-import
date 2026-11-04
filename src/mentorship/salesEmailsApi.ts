import { supabase } from "@/integrations/supabase/client";
import { scheduleDemoBackend } from "./scheduleAdminApi";
import { demoLoadSalesEmails } from "./scheduleDemo";

export interface EmailRun { text: string; bold: boolean }
export interface SalesEmail {
  /** The part of the Klaviyo campaign name the plan matches on: "C2 Sales 1 - ..." is "Sales 1". */
  key: string;
  status: string;
  sendAt: string | null;
  subject: string;
  previewText: string;
  paragraphs: EmailRun[][];
}

/** The cohort's sales emails as they are in Klaviyo right now. Read-only. */
export async function loadSalesEmails(cohortId: string): Promise<SalesEmail[]> {
  if (scheduleDemoBackend) return demoLoadSalesEmails();
  const { data, error } = await supabase.functions.invoke("mentorship-sales-emails", { body: { cohort_id: cohortId } });
  if (error) {
    let text = "The emails couldn't be loaded from Klaviyo.";
    const context = (error as { context?: unknown }).context;
    if (context instanceof Response) { try { const body = await context.clone().json(); if (typeof body?.error === "string" && body.error.trim()) text = body.error.trim(); } catch { /* keep the generic message */ } }
    throw new Error(text);
  }
  if (!data?.ok) throw new Error("The emails couldn't be loaded from Klaviyo.");
  return (data.emails as { key: string; status: string; send_at: string | null; subject: string; preview_text: string; paragraphs: EmailRun[][] }[]).map((email) => ({
    key: email.key, status: email.status, sendAt: email.send_at, subject: email.subject, previewText: email.preview_text, paragraphs: email.paragraphs,
  }));
}
