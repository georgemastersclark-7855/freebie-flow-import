import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, FileAudio, LoaderCircle, Search } from "lucide-react";
import { useAdminOverview } from "../useAdminOverview";
import { cx } from "../utils";

type QueueFilter = "pending" | "draft" | "published";

export function AdminReviewQueue() {
  const { overview, loading, error } = useAdminOverview();
  const [filter, setFilter] = useState<QueueFilter>("pending");
  const [query, setQuery] = useState("");
  const pending = overview.reviews.filter((review) => review.status !== "published");
  const filters: { value: QueueFilter; label: string; count: number }[] = [
    { value: "pending", label: "To review", count: pending.length },
    { value: "draft", label: "Drafts", count: overview.reviews.filter((review) => review.status === "draft").length },
    { value: "published", label: "Published", count: overview.reviews.filter((review) => review.status === "published").length },
  ];
  const normalized = query.trim().toLowerCase();
  const visibleReviews = overview.reviews.filter((review) =>
    (filter === "pending" ? review.status !== "published" : review.status === filter)
    && (!normalized || `${review.studentName} ${review.songName}`.toLowerCase().includes(normalized)),
  );

  if (loading) return <div className="grid min-h-[55vh] place-items-center text-xs font-bold uppercase tracking-[0.16em] text-[#77766f]"><span className="inline-flex items-center gap-2"><LoaderCircle size={16} className="animate-spin" />Loading review queue</span></div>;
  if (error) return <div role="alert" className="mx-auto mt-12 max-w-2xl rounded-2xl border border-red-400/20 bg-red-950/20 p-5 text-sm text-red-200">{error}</div>;

  return (
    <div className="mx-auto max-w-[1250px] px-4 py-8 sm:px-7 lg:px-10 lg:py-10 xl:px-12">
      <header>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8f8e85]">{overview.cohortName} / Week {overview.currentWeek}</p>
        <h1 className="mp-display mt-3 text-[34px] leading-tight text-[#f2efe6] sm:text-[48px]">REVIEW QUEUE</h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-[#aaa99f]">{pending.length} {pending.length === 1 ? "submission is" : "submissions are"} waiting for your feedback. Open a track to listen, leave notes or pick up a draft.</p>
      </header>

      <section className="mt-8" aria-label="Submission reviews">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter submissions">
            {filters.map((item) => <button key={item.value} type="button" aria-pressed={filter === item.value} onClick={() => setFilter(item.value)} className={cx("mp-focus-ring inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold", filter === item.value ? "border-white/25 bg-white/10 text-white" : "border-white/10 text-[#8f8e85] hover:text-white")}>
              {item.label}<span className="rounded-md bg-white/5 px-1.5 py-0.5">{item.count}</span>
            </button>)}
          </div>
          <label className="relative block sm:w-[270px]">
            <span className="sr-only">Search submissions</span>
            <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#77766f]" size={16} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Search student or track" className="mp-focus-ring h-11 w-full rounded-xl border border-white/10 bg-black/20 pl-10 pr-3 text-sm text-white placeholder:text-[#77766f]" />
          </label>
        </div>

        <div className="mt-5 space-y-3">
          {visibleReviews.map((review) => <article key={review.id} className="mp-card flex flex-col gap-5 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex min-w-0 items-start gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-xs font-bold text-[#ddd9d0]" aria-hidden="true">{review.studentName.split(/\s+/).map((part) => part[0]).slice(0, 2).join("")}</div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-bold text-[#f2efe6]">{review.studentName}</h2>
                  <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-semibold text-[#b6b3a8]">{review.status === "draft" ? "Draft saved" : review.status === "published" ? "Feedback published" : "Awaiting feedback"}</span>
                </div>
                <p className="mt-2 flex items-start gap-2 text-sm text-[#b6b3a8]"><FileAudio size={16} className="mt-0.5 shrink-0" aria-hidden="true" /><span className="break-all">{review.songName}</span></p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#8f8e85]"><span>Week {review.weekNumber}</span><span>{review.submittedLabel}</span><span className="inline-flex items-center gap-1.5">{review.stemsReady && <Check size={13} aria-hidden="true" />}{review.stemsReady ? "Stems ready" : "No stems uploaded"}</span></div>
              </div>
            </div>
            <Link to={`/mentorship-portal/admin/review/${review.id}`} aria-label={`${review.status === "draft" ? "Continue feedback for" : review.status === "published" ? "View feedback for" : "Review"} ${review.studentName}`} className={cx("mp-focus-ring inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold", review.status === "published" ? "border border-white/15 bg-white/5 text-white" : "bg-[#D3FF02] text-black")}>
              {review.status === "draft" ? "Continue feedback" : review.status === "published" ? "View feedback" : "Review submission"}<ArrowRight size={16} />
            </Link>
          </article>)}
          {!visibleReviews.length && <div className="rounded-2xl border border-dashed border-white/15 px-6 py-12 text-center"><h2 className="text-lg font-bold text-[#f2efe6]">{normalized ? "No matching submissions" : filter === "published" ? "No feedback published yet" : filter === "draft" ? "No saved drafts" : "You're all caught up"}</h2><p className="mt-3 text-sm text-[#8f8e85]">{normalized ? "Try another student name or track title." : filter === "published" ? "Reviewed submissions will appear here once feedback is published." : filter === "draft" ? "Feedback you save before publishing will appear here." : "New submissions will appear here when students send their work."}</p></div>}
        </div>
      </section>
    </div>
  );
}
