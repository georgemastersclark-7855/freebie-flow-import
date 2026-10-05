import { useMemo, useState } from "react";
import { ArrowUpRight, Download, Headphones, Library, Music2, RotateCw, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { usePortalStore } from "../PortalStore";

const submissionsBucket = "mentorship-submissions";
let activePreview: HTMLAudioElement | null = null;

// Kept in this page module because downloads are private to this view.
// eslint-disable-next-line react-refresh/only-export-components
export async function getSongStarterDownloadUrl(storagePath: string, fileName: string) {
  const { data, error } = await supabase.storage
    .from(submissionsBucket)
    .createSignedUrl(storagePath, 60, { download: fileName });
  if (error) throw error;
  return data.signedUrl;
}

function LibraryAudioPreview({ fileName, objectUrl, onRefresh }: { fileName: string; objectUrl?: string; onRefresh: () => Promise<void> }) {
  const [audioError, setAudioError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const retry = async () => {
    setRefreshing(true);
    try {
      await onRefresh();
      setAudioError(false);
    } catch {
      setAudioError(true);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="rounded-xl border border-white/[0.08] bg-black/20 p-3">
      {objectUrl ? (
        <audio
          controls
          preload="none"
          src={objectUrl}
          aria-label={`Play ${fileName}`}
          className="h-10 w-full accent-white [color-scheme:dark]"
          onPlay={(event) => {
            const current = event.currentTarget;
            if (activePreview && activePreview !== current) activePreview.pause();
            activePreview = current;
            setAudioError(false);
          }}
          onPause={(event) => { if (activePreview === event.currentTarget) activePreview = null; }}
          onEnded={(event) => { if (activePreview === event.currentTarget) activePreview = null; }}
          onError={() => setAudioError(true)}
        />
      ) : <p className="flex min-h-10 items-center gap-2 text-xs text-[#8f8e85]"><Headphones size={15} />Preview link expired</p>}
      {(audioError || !objectUrl) && <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-[#b6b3a8]">
        {audioError && <span role="status">Audio couldn’t load. The private preview link may have expired.</span>}
        <button type="button" onClick={() => void retry()} disabled={refreshing} className="mp-focus-ring inline-flex min-h-8 items-center gap-1.5 rounded-lg px-2 font-semibold text-[#eeeae1] hover:bg-white/[0.05] disabled:opacity-50">
          <RotateCw size={13} className={refreshing ? "animate-spin" : ""} />Refresh preview
        </button>
      </div>}
    </div>
  );
}

export function SongStarterLibrary() {
  const { weeks, submissions, refresh } = usePortalStore();
  const [query, setQuery] = useState("");
  const [weekFilter, setWeekFilter] = useState("all");
  const [downloadError, setDownloadError] = useState("");

  const availableWeeks = useMemo(() => weeks.filter((week) => week.phase !== "upcoming"), [weeks]);
  const weeksByNumber = useMemo(() => new Map(weeks.map((week) => [week.number, week])), [weeks]);
  const libraryEntries = useMemo(() => submissions
    .filter((submission) => {
      const week = weeksByNumber.get(submission.weekNumber);
      return Boolean(week && week.phase !== "upcoming");
    })
    .flatMap((submission) => submission.ideas.map((file) => ({
      file,
      weekNumber: submission.weekNumber,
      weekTitle: weeksByNumber.get(submission.weekNumber)?.title ?? `Week ${submission.weekNumber}`,
    }))),
  [submissions, weeksByNumber]);
  const entries = useMemo(() => libraryEntries
    .filter(({ file, weekNumber }) =>
      (weekFilter === "all" || String(weekNumber) === weekFilter)
      && file.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
    )
    .sort((a, b) => a.weekNumber - b.weekNumber || a.file.name.localeCompare(b.file.name)),
  [libraryEntries, query, weekFilter]);

  const totalAdded = libraryEntries.length;
  const totalRequired = weeks.reduce((sum, week) => sum + week.requiredIdeas, 0);
  const openWeek = weeks.find((week) => week.phase === "current");
  const openWeekSubmission = submissions.find((submission) => submission.weekNumber === openWeek?.number);
  const canAddLoop = Boolean(openWeek && openWeek.requiredIdeas > 0
    && openWeekSubmission?.state !== "submitted" && openWeekSubmission?.state !== "late");
  const addLoopHref = canAddLoop && openWeek ? `/mentorship-portal/week/${openWeek.number}#song-starters` : "/mentorship-portal/submissions";
  const addLoopLabel = canAddLoop ? "Add a song starter" : "Open weekly submissions";
  const hasAnyLoops = libraryEntries.length > 0;

  const downloadFile = async (file: { name: string; objectUrl?: string; storagePath?: string }) => {
    setDownloadError("");
    try {
      const href = file.storagePath
        ? await getSongStarterDownloadUrl(file.storagePath, file.name)
        : file.objectUrl;
      if (!href) throw new Error("The download link is unavailable. Refresh the library and try again.");
      const link = document.createElement("a");
      link.href = href;
      link.download = file.name;
      link.target = "_blank";
      link.rel = "noreferrer";
      document.body.append(link);
      link.click();
      link.remove();
    } catch (error) {
      setDownloadError(error instanceof Error ? error.message : "The download link could not be created.");
    }
  };

  return (
    <div className="mx-auto max-w-[1320px] px-4 py-8 sm:px-7 lg:px-10 lg:py-10 xl:px-14">
      <header className="max-w-3xl">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8f8e85]">Your music / Song starters</p>
        <h1 className="mp-display mt-3 text-[42px] leading-[0.98] text-[#f2efe6] sm:text-[54px]">SONG STARTER LIBRARY</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#aaa99f]">Every loop you’ve added to your weekly work, gathered in one place so you can listen back and find the ideas you want to build on.</p>
      </header>

      <section aria-label="Library progress" className="mp-card mt-7 flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-[#c7c4bb]"><Library size={18} /></span>
          <div>
            <p className="text-sm font-bold text-[#eeeae1]">{totalAdded} song starters / {totalRequired}-starter minimum</p>
            <p className="mt-1 text-xs text-[#85847c]">Your uploaded loops from weeks that have opened</p>
          </div>
        </div>
        <Link to={addLoopHref} className="mp-focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#D3FF02] px-4 py-2.5 text-sm font-bold text-black transition hover:bg-[#e0ff52]">
          {addLoopLabel} <ArrowUpRight size={16} />
        </Link>
      </section>

      {downloadError && <p role="alert" className="mt-4 rounded-xl border border-red-300/20 bg-red-950/20 px-4 py-3 text-sm text-red-200">{downloadError}</p>}

      <section aria-label="Song starter files" className="mt-7">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative min-w-0 flex-1 sm:max-w-md">
            <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77766f]" />
            <label htmlFor="song-starter-search" className="sr-only">Search by filename</label>
            <input
              id="song-starter-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search filenames"
              className="mp-focus-ring min-h-11 w-full rounded-xl border border-white/10 bg-[#10100e] pl-10 pr-3 text-sm text-[#eeeae1] placeholder:text-[#77766f]"
            />
          </div>
          <div className="sm:w-48">
            <label htmlFor="song-starter-week" className="sr-only">Filter by week</label>
            <select
              id="song-starter-week"
              value={weekFilter}
              onChange={(event) => setWeekFilter(event.target.value)}
              className="mp-focus-ring min-h-11 w-full rounded-xl border border-white/10 bg-[#10100e] px-3 text-sm text-[#d4d0c5]"
            >
              <option value="all">All open weeks</option>
              {availableWeeks.map((week) => <option key={week.number} value={week.number}>Week {week.number}</option>)}
            </select>
          </div>
        </div>

        {entries.length > 0 ? (
          <ul className="grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-2 xl:grid-cols-3">
            {entries.map(({ file, weekNumber, weekTitle }) => (
              <li key={`${weekNumber}-${file.id}`} className="mp-card min-w-0 rounded-2xl p-4 sm:p-5">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.05] text-[#b6b3a8]"><Music2 size={18} /></span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8f8e85]">Week {weekNumber} / {weekTitle}</p>
                    <h2 className="mt-1 break-words text-sm font-bold leading-5 text-[#eeeae1]">{file.name}</h2>
                  </div>
                </div>

                <div className="mt-4"><LibraryAudioPreview fileName={file.name} objectUrl={file.objectUrl} onRefresh={refresh} /></div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.08] pt-3">
                  <Link to={`/mentorship-portal/week/${weekNumber}#song-starters`} className="mp-focus-ring inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-[#b6b3a8] hover:bg-white/[0.04] hover:text-[#f2efe6]">
                    Open week {weekNumber} <ArrowUpRight size={14} />
                  </Link>
                  <button type="button" onClick={() => void downloadFile(file)} className="mp-focus-ring inline-flex min-h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-3 text-xs font-semibold text-[#d4d0c5] hover:bg-white/[0.07]">
                    <Download size={14} />Download
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mp-card rounded-2xl px-5 py-10 text-center sm:px-8 sm:py-14">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/[0.035] text-[#aaa99f]"><Headphones size={20} /></span>
            <h2 className="mt-4 text-lg font-bold text-[#eeeae1]">{hasAnyLoops ? "No loops match that search" : "Your song starters will appear here"}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#8f8e85]">{hasAnyLoops ? "Try another filename or choose a different week." : "Add your first loop in the open week. Every song starter you upload will be saved here automatically."}</p>
            {!hasAnyLoops && <Link to={addLoopHref} className="mp-focus-ring mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#D3FF02] px-4 py-2.5 text-sm font-bold text-black transition hover:bg-[#e0ff52]">{addLoopLabel} <ArrowUpRight size={16} /></Link>}
          </div>
        )}
      </section>
    </div>
  );
}
