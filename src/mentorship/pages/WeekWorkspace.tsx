import { useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowLeft, ArrowRight, Check, CheckCircle2, Clock3, ExternalLink, Headphones, LockKeyhole, Send, Sparkles } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { usePortalStore } from "../PortalStore";
import {
  ChecklistRow,
  FileDrop,
  FileRow,
  MockAudioPlayer,
  PrimaryButton,
  ProgressBar,
  SecondaryButton,
  StatusPill,
} from "../components/PortalUI";
import { cx } from "../utils";

export function WeekWorkspace() {
  const { weekNumber: weekParam } = useParams();
  const weekNumber = Number(weekParam);
  const {
    weeks,
    submissions,
    addFiles,
    removeFile,
    submitWeek,
    markFeedbackViewed,
    confirmFeedbackAction,
  } = usePortalStore();
  const definition = weeks.find((week) => week.number === weekNumber);
  const submission = submissions.find((item) => item.weekNumber === weekNumber);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [nextAction, setNextAction] = useState(submission?.feedback?.studentNextAction ?? "");
  const feedbackId = submission?.feedback?.id;
  const feedbackViewedAt = submission?.feedback?.viewedAt;

  useEffect(() => {
    if (feedbackId && !feedbackViewedAt) {
      void markFeedbackViewed(weekNumber).catch(() => toast.error("We couldn't mark this feedback as viewed."));
    }
  }, [weekNumber, feedbackId, feedbackViewedAt, markFeedbackViewed]);

  const checks = useMemo(() => {
    if (!definition || !submission) return [];
    return [
      { complete: definition.requiredIdeas === 0 || submission.ideas.length >= definition.requiredIdeas, title: definition.requiredIdeas ? `${definition.requiredIdeas} ideas uploaded` : "Build-out uploaded" },
      { complete: !definition.songRequired || Boolean(submission.song), title: definition.number >= 5 ? "Current build uploaded" : "Selected song uploaded" },
      { complete: !definition.stemsRequired || Boolean(submission.stems), title: "Stems ZIP uploaded" },
    ];
  }, [definition, submission]);

  if (!definition || !submission || !Number.isInteger(weekNumber)) {
    return <Navigate to="/mentorship-portal/submissions" replace />;
  }

  const locked = definition.phase === "upcoming";
  const submitted = submission.state === "submitted" || submission.state === "late";
  const canEdit = !locked && !submitted;
  const completeCount = checks.filter((check) => check.complete).length;
  const submittedLabel = submission.submittedAt ? new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(submission.submittedAt)) : "";

  const uploadFiles = async (kind: "idea" | "song" | "stems", files: File[]) => {
    const toastId = toast.loading(files.length > 1 ? `Uploading ${files.length} files…` : `Uploading ${files[0]?.name ?? "file"}…`);
    try {
      await addFiles(weekNumber, kind, files);
      toast.success(files.length > 1 ? "Files uploaded." : "File uploaded.", { id: toastId });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.", { id: toastId });
    }
  };

  const removeUploadedFile = async (kind: "idea" | "song" | "stems", fileId: string) => {
    try {
      await removeFile(weekNumber, kind, fileId);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to remove the file.");
    }
  };

  const submit = async () => {
    const result = await submitWeek(weekNumber);
    setSubmissionMessage(result.message);
    if (result.ok) toast.success(result.message);
    else toast.error("Your submission is not complete yet.");
  };

  const saveFeedbackAction = async () => {
    if (!nextAction.trim()) {
      toast.error("Write your next action first.");
      return;
    }
    try {
      await confirmFeedbackAction(weekNumber, nextAction.trim());
      toast.success("Next action confirmed.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to confirm the next action.");
    }
  };

  return (
    <div className="mx-auto max-w-[1320px] px-4 py-8 sm:px-7 lg:px-10 lg:py-10 xl:px-14">
      <Link to="/mentorship-portal/submissions" className="mp-focus-ring inline-flex items-center gap-2 rounded-lg text-xs font-bold text-[#8f8e85] hover:text-white"><ArrowLeft size={15} />Back to submissions</Link>

      <header className="mt-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div className="max-w-[760px]">
          <div className="flex flex-wrap items-center gap-3"><span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8f8e85]">Week {definition.number}</span><StatusPill state={submission.state} /></div>
          <h1 className="mp-display mt-3 text-[48px] leading-[0.92] text-[#f2efe6] sm:text-[64px]">{definition.title.toUpperCase()}</h1>
        </div>
        <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] px-4 py-3">
          <Clock3 size={18} className="text-[#8f8e85]" />
          <div><div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#77766f]">Submission deadline</div><div className="text-sm font-bold text-[#e5e1d8]">{definition.deadlineLabel}</div></div>
        </div>
      </header>

      {locked && (
        <div className="mt-7 flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 text-sm text-[#9a9991]"><LockKeyhole className="mt-0.5 shrink-0 text-[#8f8e85]" size={17} /><div><div className="font-bold text-[#d8d5cc]">This week has not opened yet.</div><div className="mt-1 text-xs">You can see what is coming, but uploads will open when the cohort reaches Week {weekNumber}.</div></div></div>
      )}

      {submitted && !submission.feedback && (
        <div className="mt-7 flex flex-col gap-4 rounded-2xl border border-[#9be15d]/20 bg-[#14200f] p-5 sm:flex-row sm:items-center"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#9be15d]/15 text-[#b8ef87]"><CheckCircle2 size={20} /></span><div className="min-w-0 flex-1"><div className="text-sm font-bold text-[#dff6cb]">Week {weekNumber} is with Rob.</div><div className="mt-1 text-xs text-[#8fa87b]">Rob will review your selected song before Sunday. Be on the call to find out which tracks go into surgery.</div></div>{submittedLabel && <span className="text-xs font-semibold text-[#8fa87b]">Submitted {submittedLabel}</span>}</div>
      )}

      {submission.feedback && (
        <a href="#feedback" className="mp-focus-ring mt-7 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-white/20 hover:bg-white/[0.04] sm:flex-row sm:items-center">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-[#aaa99f]"><Headphones size={18} /></span>
          <span className="min-w-0 flex-1"><span className="block text-sm font-bold text-white">Rob's Week {weekNumber} feedback is ready.</span><span className="mt-1 block text-xs text-[#8f8e85]">Listen to the review and leave with one clear next action.</span></span>
          <span className="inline-flex items-center gap-2 text-xs font-bold text-[#d9d6cd]">Open feedback <ArrowRight size={14} /></span>
        </a>
      )}

      <div className="mt-7 grid gap-6 xl:grid-cols-[1fr_310px]">
        <div className="space-y-6">
          {submission.feedback && (
            <section id="feedback" className="scroll-mt-8 overflow-hidden rounded-3xl border border-white/[0.1] bg-[#141411]">
              <div className="border-b border-white/[0.08] bg-white/[0.025] px-5 py-4 sm:px-7"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-[#ddd9d0]"><Headphones size={17} /></span><div><div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8f8e85]">Feedback from Rob</div><div className="text-sm font-bold text-white">Week {weekNumber} review</div></div></div></div>
              <div className="space-y-5 p-5 sm:p-7">
                {submission.feedback.audioName && <MockAudioPlayer file={submission.feedback.audioUrl ? { id: `${submission.feedback.id}-audio`, name: submission.feedback.audioName, size: 0, kind: "feedback", uploadedAt: submission.feedback.publishedAt, objectUrl: submission.feedback.audioUrl } : undefined} label={submission.feedback.audioName} />}
                {submission.feedback.videoUrl && <a href={submission.feedback.videoUrl} target="_blank" rel="noreferrer" className="mp-focus-ring inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-[#f2efe6]">Watch Rob's video feedback <ExternalLink size={14} /></a>}
                <div><div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#77766f]">Rob's notes</div><p className="mt-2 text-sm leading-6 text-[#c8c4bb]">{submission.feedback.text}</p></div>
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4"><div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8f8e85]">Your next action</div><p className="mt-2 text-sm font-semibold leading-6 text-[#e3e0d7]">{submission.feedback.nextAction}</p></div>
                {submission.feedback.actionConfirmedAt ? (
                  <div className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4"><Check className="mt-0.5 shrink-0 text-[#b8ef87]" size={17} /><div><div className="text-sm font-bold text-[#d9d6cd]">Action confirmed</div><div className="mt-1 text-xs leading-5 text-[#77766f]">{submission.feedback.studentNextAction}</div></div></div>
                ) : (
                  <div><label htmlFor="next-action" className="text-xs font-bold text-[#bbb8af]">In your own words, what will you do next?</label><textarea id="next-action" value={nextAction} onChange={(event) => setNextAction(event.target.value)} rows={3} className="mp-focus-ring mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-[#e5e1d8] placeholder:text-[#5f5e58]" placeholder="My next action is..." /><SecondaryButton onClick={saveFeedbackAction} className="mt-3">I've got it <Check size={15} /></SecondaryButton></div>
                )}
              </div>
            </section>
          )}

          {definition.requiredIdeas > 0 && (
            <section className="mp-card rounded-3xl p-5 sm:p-7">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div><div className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#77766f]">Part 1</div><h2 className="mp-display mt-1 text-[34px] leading-none text-[#ece9e0]">YOUR IDEAS</h2><p className="mt-2 text-xs leading-5 text-[#77766f]">Upload them as you make them. Rob's main review stays focused on the selected song.</p></div>
                <div className="shrink-0 text-right"><div className="text-3xl font-black tracking-[-0.05em] text-white">{submission.ideas.length}/{definition.requiredIdeas}</div><div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#77766f]">ideas uploaded</div></div>
              </div>
              <div className="mt-4"><ProgressBar value={submission.ideas.length} max={definition.requiredIdeas} /></div>
              <div className="mt-5 space-y-2">
                {submission.ideas.map((file) => <FileRow key={file.id} file={file} onRemove={canEdit ? () => void removeUploadedFile("idea", file.id) : undefined} />)}
              </div>
              {canEdit && <div className="mt-3"><FileDrop compact label={submission.ideas.length ? "Upload another idea" : "Upload your first idea"} help="MP3 or WAV. Name it so you can recognise it later." kind="idea" accept="audio/mpeg,audio/wav,audio/x-wav,.mp3,.wav" multiple onFiles={(files) => void uploadFiles("idea", files)} /></div>}
            </section>
          )}

          <section className="mp-card rounded-3xl p-5 sm:p-7">
            <div><div className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#77766f]">Part {definition.requiredIdeas > 0 ? 2 : 1}</div><h2 className="mp-display mt-1 text-[34px] leading-none text-[#ece9e0]">{definition.number >= 5 ? "YOUR CURRENT BUILD" : "YOUR SELECTED SONG"}</h2><p className="mt-2 text-xs leading-5 text-[#77766f]">This is the file Rob listens to and reviews. Use MP3 for speed or WAV for full quality.</p></div>
            <div className="mt-5">
              {submission.song ? (
                <div className="space-y-3"><MockAudioPlayer file={submission.song} label={submission.song.name} /><FileRow file={submission.song} onRemove={canEdit ? () => void removeUploadedFile("song", submission.song!.id) : undefined} showDownload={submitted} /></div>
              ) : canEdit ? (
                <FileDrop label="Upload your selected song" help="MP3 or WAV. Intro through the end of the first chorus." kind="song" accept="audio/mpeg,audio/wav,audio/x-wav,.mp3,.wav" onFiles={(files) => void uploadFiles("song", files)} />
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-[#77766f]">No song uploaded yet.</div>
              )}
            </div>
          </section>

          <section className="mp-card rounded-3xl p-5 sm:p-7">
            <div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.05] text-[#aaa99f]"><Sparkles size={18} /></span><div><h2 className="text-base font-black text-[#ece9e0]">Surgery files</h2><p className="mt-1 text-xs leading-5 text-[#77766f]">Stems make this week's song eligible for live surgery. Uploading them does not mean Rob will review every stem separately.</p></div></div>
            <div className="mt-5">
              {submission.stems ? <FileRow file={submission.stems} onRemove={canEdit ? () => void removeUploadedFile("stems", submission.stems!.id) : undefined} showDownload={submitted} /> : canEdit ? <FileDrop label="Upload stems ZIP" help="One ZIP using the naming convention from the setup video." kind="stems" accept=".zip,application/zip" onFiles={(files) => void uploadFiles("stems", files)} /> : <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-[#77766f]">No stems uploaded yet.</div>}
            </div>
          </section>

        </div>

        <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
          <div className="mp-card rounded-3xl p-5">
            <div className="flex items-center justify-between gap-3"><div><div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#77766f]">Weekly checklist</div><div className="mt-1 text-sm font-bold text-[#e5e1d8]">{completeCount} of {checks.length} ready</div></div><div className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-sm font-black text-[#aaa99f]">{Math.round((completeCount / checks.length) * 100)}%</div></div>
            <div className="mt-4"><ProgressBar value={completeCount} max={checks.length} /></div>
            <div className="mt-5 space-y-4">{checks.map((check) => <ChecklistRow key={check.title} complete={check.complete} title={check.title} />)}</div>
            {canEdit && <PrimaryButton onClick={() => void submit()} className="mt-6 w-full">Submit Week {weekNumber}<Send size={16} /></PrimaryButton>}
            {submissionMessage && <div className={cx("mt-3 rounded-xl border px-3 py-2.5 text-xs leading-5", submissionMessage.startsWith("Week") ? "border-[#9be15d]/15 bg-[#14200f] text-[#b8d99c]" : "border-red-400/20 bg-red-950/25 text-red-200")}><div className="flex items-start gap-2"><AlertCircle size={14} className="mt-0.5 shrink-0" />{submissionMessage}</div></div>}
          </div>
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5"><div className="text-sm font-bold text-[#dedbd2]">Remember the shape</div><p className="mt-2 text-xs leading-5 text-[#77766f]">Every weekly song runs from the intro to the end of the first chorus, at a commercial length.</p></div>
        </aside>
      </div>

      <div className="mt-10 flex items-center justify-between border-t border-white/[0.08] pt-6"><Link to={`/mentorship-portal/week/${Math.max(1, weekNumber - 1)}`} className={cx("mp-focus-ring inline-flex items-center gap-2 rounded-lg text-xs font-bold", weekNumber === 1 ? "pointer-events-none opacity-30" : "text-[#8f8e85] hover:text-white")}><ArrowLeft size={14} />Previous week</Link><Link to={`/mentorship-portal/week/${Math.min(6, weekNumber + 1)}`} className={cx("mp-focus-ring inline-flex items-center gap-2 rounded-lg text-xs font-bold", weekNumber === 6 ? "pointer-events-none opacity-30" : "text-[#8f8e85] hover:text-white")}>Next week<ArrowRight size={14} /></Link></div>
    </div>
  );
}
