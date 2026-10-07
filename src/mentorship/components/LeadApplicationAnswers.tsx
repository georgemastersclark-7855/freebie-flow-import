import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type ApplicationAnswer = { question: string; answer: string };
type ApplicationSubmission = { id: string; submitted_at: string; answers: ApplicationAnswer[] };
type RawSubmission = { id: string; submitted_at: string; answers: unknown };
type ApplicationsTableClient = {
  from: (table: string) => {
    select: (columns: string) => {
      eq: (column: string, value: string) => {
        order: (column: string, options: { ascending: boolean }) => Promise<{
          data: RawSubmission[] | null;
          error: { message: string } | null;
        }>;
      };
    };
  };
};

function parseAnswers(value: unknown): ApplicationAnswer[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap(item => {
    if (!item || typeof item !== "object") return [];
    const { question, answer } = item as Record<string, unknown>;
    if (typeof question !== "string" || typeof answer !== "string") return [];
    return [{ question, answer }];
  });
}

async function loadApplicationSubmissions(leadId: string): Promise<ApplicationSubmission[]> {
  const client = supabase as unknown as ApplicationsTableClient;
  const { data, error } = await client
    .from("mentorship_applications")
    .select("id,submitted_at,answers")
    .eq("lead_id", leadId)
    .order("submitted_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(row => ({
    id: row.id,
    submitted_at: row.submitted_at,
    answers: parseAnswers(row.answers),
  }));
}

function submittedLabel(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || "Date unavailable";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export function LeadApplicationAnswers({ leadId }: { leadId: string }) {
  const query = useQuery({
    queryKey: ["lead-application-answers", leadId],
    queryFn: () => loadApplicationSubmissions(leadId),
    enabled: Boolean(leadId),
  });
  const [latestOpen, setLatestOpen] = useState(true);

  if (query.isPending) return <p className="ss-muted" role="status">Loading application answers…</p>;
  if (query.isError) return <div className="ss-error" role="alert">Application answers could not be loaded. <button className="ss-button" type="button" onClick={() => void query.refetch()}>Try again</button></div>;
  if (!query.data?.length) return null;

  return <section className="ss-card">
    <h2>Application answers</h2>
    {query.data.map((submission, index) => {
      const latest = index === 0;
      return <details
        className="ss-transcript"
        key={submission.id}
        open={latest ? latestOpen : undefined}
        onToggle={latest ? event => setLatestOpen(event.currentTarget.open) : undefined}
      >
        <summary>
          {latest ? "Latest application" : "Earlier application"} <span className="ss-muted">· {submittedLabel(submission.submitted_at)}</span>
        </summary>
        {submission.answers.length ? <div className="ss-stack mt-3">
          {submission.answers.map((item, answerIndex) => <div key={`${submission.id}-${answerIndex}`}>
            <h3>{item.question}</h3>
            <p className="ss-prose">{item.answer}</p>
          </div>)}
        </div> : <p className="ss-muted mt-3">No answers were recorded for this submission.</p>}
      </details>;
    })}
  </section>;
}
