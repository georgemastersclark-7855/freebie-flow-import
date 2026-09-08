import { useEffect, useState } from "react";
import { AlertCircle, ArrowLeft, ArrowRight, Check, CheckCircle2, Clock3, ExternalLink, Headphones, LockKeyhole, Send } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { usePortalStore } from "../PortalStore";
import {
  FileDrop,
  FileRow,
  MockAudioPlayer,
  PrimaryButton,
  SecondaryButton,
  StatusPill,
} from "../components/PortalUI";
import { cx, submissionParts } from "../utils";

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
  const [busy, setBusy] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [nextAction, setNextAction] = useState(submission?.feedback?.studentNextAction ?? "");
  const savedNextAction = submission?.feedback?.studentNextAction;
  useEffect(() => { setNextAction(savedNextAction ?? ""); setSubmissionMessage(""); }, [weekNumber, savedNextAction]);
  const feedbackId = submission?.feedback?.id;
  const feedbackViewedAt = submission?.feedback?.viewedAt;

  useEffect(() => {
    if (feedbackId && !feedbackViewedAt) {
      void markFeedbackViewed(weekNumber).catch(() => toast.error("We couldn't mark this feedback as viewed."));
    }
  }, [weekNumber, feedbackId, feedbackViewedAt, markFeedbackViewed]);

  if (!definition || !submission || !Number.isInteger(weekNumber)) {
    return <Navigate to="/mentorship-portal/submissions" replace />;
  }

  const locked = definition.phase === "upcoming";
  const submitted = submission.state === "submitted" || submission.state === "late";
  const canEdit = !locked && !submitted;
  const parts = submissionParts(definition, submission);
  const readyToSend = parts.length > 0 && parts.every((part) => part.complete);
  const missingParts = parts.filter((part) => !part.complete);
  const submittedLabel = submission.submittedAt ? new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(submission.submittedAt)) : "";

  const uploadFiles = async (kind: "idea" | "song" | "stems", files: File[]) => {
    if (busy || !canEdit || !files.length) return;
    setBusy(true);
    setSubmissionMessage("");
    const toastId = toast.loading(files.length > 1 ? `Uploading ${files.length} files…` : `Uploading ${files[0]?.name ?? "file"}…`);
    try {
      await addFiles(weekNumber, kind, files);
      toast.success(files.length > 1 ? "Files uploaded." : "File uploaded.", { id: toastId });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.", { id: toastId });
    } finally { setBusy(false); }
  };

  const removeUploadedFile = async (kind: "idea" | "song" | "stems", fileId: string) => {
    if (busy || !canEdit) return;
    setBusy(true);
    setSubmissionMessage("");
    try {
      await removeFile(weekNumber, kind, fileId);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to remove the file.");
    } finally { setBusy(false); }
  };

  const submit = async () => {
    if (busy || !canEdit || !readyToSend) return;
    setBusy(true);
    try {
      const result = await submitWeek(weekNumber);
      setSubmissionMessage(result.message);
      if (result.ok) toast.success(result.message);
      else toast.error(result.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to submit. Please try again.");
    } finally { setBusy(false); }
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
    <div className="mx-auto max-w-[1120px] px-4 py-8 sm:px-7 lg:px-10 lg:py-10 xl:px-12">
      <Link to="/mentorship-portal/submissions" className="mp-focus-ring inline-flex items-center gap-2 rounded-lg text-xs font-semibold text-[#aaa99f] hover:text-white"><ArrowLeft size={15} />Back to your weekly work</Link>

      <header className="mt-7">
        <div className="flex flex-wrap items-center justify-between gap-4"><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#b6b3a8]">{definition.title}</p><StatusPill state={submission.state} /></div>
        <h1 className="mp-display mt-4 text-[#f2efe6]">WEEK {weekNumber} {submitted ? "SUBMISSION" : locked ? "PREVIEW" : "UPLOAD"}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#aaa99f]">{submitted ? "Your files are saved below. This is also where you'll find Rob's feedback on this week's work." : weekNumber < 5 ? "Add your song starter loops, the one you've developed into a weekly song, and its matching stems. Send everything to Rob once you're ready." : "Build out the track you selected in week 4. Add your latest full-track version and its matching stems, then send them to Rob."}</p>
        {!submitted && <p className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#d4d0c5]"><Clock3 size={14} />Due {definition.deadlineLabel}</p>}
      </header>

      {locked && <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/15 bg-white/[0.035] p-5 text-sm text-[#aaa99f]"><LockKeyhole className="mt-0.5 shrink-0 text-white" size={18} /><div><p className="font-bold text-[#eeeae1]">A look ahead at week {weekNumber}</p><p className="mt-1 text-xs leading-5">Uploads open when the cohort reaches this week. For now, you can see what you'll be working on.</p></div></div>}
      {submitted && !submission.feedback && <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/15 bg-white/[0.035] p-5"><CheckCircle2 size={21} className="mt-0.5 shrink-0 text-white" /><div><p className="text-sm font-bold text-[#eeeae1]">Sent to Rob. You're done for this week.</p><p className="mt-1 text-xs leading-5 text-[#aaa99f]">Your song is in the review queue. Your feedback will appear here when it's ready.</p>{submittedLabel && <p className="mt-2 text-[11px] text-[#939187]">Sent {submittedLabel}</p>}</div></div>}

      {canEdit && <nav aria-label="Upload steps" className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-3 border-y border-white/10 py-4">{parts.map((part, index) => <a key={part.id} href={`#${part.id}`} className="mp-focus-ring inline-flex items-center gap-2 rounded text-xs font-semibold text-[#b6b3a8]"><span className="grid h-6 w-6 place-items-center rounded-full border border-white/20 text-[10px] text-[#f2efe6]">{part.complete ? <Check size={12} /> : index + 1}</span>{part.title}<ArrowRight size={12} className="ml-1" /></a>)}<a href="#send-to-rob" className="mp-focus-ring inline-flex items-center gap-2 rounded text-xs font-semibold text-[#b6b3a8]"><span className="grid h-6 w-6 place-items-center rounded-full border border-white/20 text-[10px] text-[#f2efe6]">{parts.length + 1}</span>Send to Rob</a></nav>}

      <div className="mt-7 space-y-5">
          {submission.feedback && (
            <section id="feedback" className="scroll-mt-24 overflow-hidden rounded-3xl border border-white/[0.1] bg-[#141411]">
              <div className="border-b border-white/[0.08] bg-white/[0.025] px-5 py-4 sm:px-7"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-[#ddd9d0]"><Headphones size={17} /></span><div className="text-sm font-bold text-white">Rob's feedback</div></div></div>
              <div className="space-y-5 p-5 sm:p-7">
                {submission.feedback.audioName && <MockAudioPlayer file={submission.feedback.audioUrl ? { id: `${submission.feedback.id}-audio`, name: submission.feedback.audioName, size: 0, kind: "feedback", uploadedAt: submission.feedback.publishedAt, objectUrl: submission.feedback.audioUrl } : undefined} label={submission.feedback.audioName} />}
                {submission.feedback.videoUrl && <a href={submission.feedback.videoUrl} target="_blank" rel="noreferrer" className="mp-focus-ring inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-[#f2efe6]">Watch Rob's video feedback <ExternalLink size={14} /></a>}
                <div><div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#77766f]">Rob's notes</div><p className="mt-2 text-sm leading-6 text-[#c8c4bb]">{submission.feedback.text}</p></div>
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4"><div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8f8e85]">Your next action</div><p className="mt-2 text-sm font-semibold leading-6 text-[#e3e0d7]">{submission.feedback.nextAction}</p></div>
                {submission.feedback.actionConfirmedAt ? (
                  <div className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4"><Check className="mt-0.5 shrink-0 text-[#f2efe6]" size={17} /><div><div className="text-sm font-bold text-[#d9d6cd]">Action confirmed</div><div className="mt-1 text-xs leading-5 text-[#77766f]">{submission.feedback.studentNextAction}</div></div></div>
                ) : (
                  <div><label htmlFor="next-action" className="text-xs font-bold text-[#bbb8af]">In your own words, what will you do next?</label><textarea id="next-action" value={nextAction} onChange={(event) => setNextAction(event.target.value)} rows={3} className="mp-focus-ring mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-[#e5e1d8] placeholder:text-[#5f5e58]" placeholder="My next action is..." /><SecondaryButton onClick={saveFeedbackAction} className="mt-3">I've got it <Check size={15} /></SecondaryButton></div>
                )}
              </div>
            </section>
          )}

        <div className="flex items-center justify-between gap-4"><h2 className="text-lg font-bold text-[#eeeae1]">{submitted ? "What you sent" : locked ? "This week's uploads" : "Add your files"}</h2>{canEdit && <p className="text-xs text-[#aaa99f]" aria-live="polite">{busy ? "Working on your files..." : "Uploads save as you go"}</p>}</div>
        {parts.map((part, index) => <section key={part.id} id={part.id} className="mp-card scroll-mt-24 rounded-3xl p-5 sm:p-7" aria-labelledby={`${part.id}-title`}>
          <div className="flex items-start gap-3 sm:gap-4"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/20 text-xs font-bold text-[#eeeae1]">{submitted && part.complete ? <Check size={16} /> : String(index + 1).padStart(2, "0")}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><h3 id={`${part.id}-title`} className="text-xl font-bold text-[#eeeae1]">{part.title}</h3><span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-semibold text-[#b6b3a8]">{part.complete && <Check size={12} />}{locked ? part.format : part.status}</span></div><p className="mt-2 max-w-2xl text-sm leading-6 text-[#aaa99f]">{part.description}</p></div></div>

          {part.id === "song-starters" && <div className="mt-5 space-y-4">
            {canEdit && <FileDrop disabled={busy} label={part.complete ? "Add another loop" : "Choose your loop files"} help="MP3 or WAV. You can select several at once. Up to 2 GB per file." kind="idea" accept="audio/mpeg,audio/wav,audio/x-wav,.mp3,.wav" multiple onFiles={(files) => void uploadFiles("idea", files)} />}
            {submission.ideas.length > 0 && <details open={submitted} className="group rounded-xl border border-white/10"><summary className="mp-focus-ring cursor-pointer rounded-xl px-4 py-3 text-xs font-semibold text-[#d4d0c5]">{submission.ideas.length} uploaded loop{submission.ideas.length === 1 ? "" : "s"}</summary><div className="space-y-2 border-t border-white/10 p-3">{submission.ideas.map((file) => <FileRow key={file.id} file={file} showDownload={submitted} onRemove={canEdit && !busy ? () => void removeUploadedFile("idea", file.id) : undefined} />)}</div></details>}
            {!canEdit && !submission.ideas.length && <p className="text-xs text-[#939187]">No loops uploaded.</p>}
          </div>}

          {part.id === "weekly-song" && <div className="mt-5">{submission.song ? <div className="space-y-3">{submission.song.objectUrl && <MockAudioPlayer file={submission.song} label="Play your song" />}<FileRow file={submission.song} onRemove={canEdit && !busy ? () => void removeUploadedFile("song", submission.song!.id) : undefined} showDownload={submitted} /></div> : canEdit ? <FileDrop disabled={busy} label={weekNumber < 5 ? "Choose your weekly song" : "Choose your track progress"} help="One MP3 or WAV. Up to 2 GB." kind="song" accept="audio/mpeg,audio/wav,audio/x-wav,.mp3,.wav" onFiles={(files) => void uploadFiles("song", files)} /> : <p className="text-xs text-[#939187]">No song uploaded.</p>}</div>}

          {part.id === "stems" && <div className="mt-5 space-y-4">{submission.stems ? <FileRow file={submission.stems} onRemove={canEdit && !busy ? () => void removeUploadedFile("stems", submission.stems!.id) : undefined} showDownload={submitted} /> : canEdit ? <FileDrop disabled={busy} label="Choose your stems ZIP" help="One ZIP containing your exported audio stems. Up to 2 GB." kind="stems" accept=".zip,application/zip" onFiles={(files) => void uploadFiles("stems", files)} /> : <p className="text-xs text-[#939187]">No stems uploaded.</p>}<Link to="/mentorship-portal/setup/stems-workflow" className="mp-focus-ring inline-flex items-center gap-2 rounded text-xs font-semibold text-[#b6b3a8]">Need help exporting stems?<ArrowRight size={13} /></Link></div>}
        </section>)}

        {canEdit && <section id="send-to-rob" aria-labelledby="send-title" className="scroll-mt-24 rounded-3xl border border-white/20 bg-[#1b1b17] p-5 sm:p-7">
          <div className="flex items-start gap-3 sm:gap-4"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/20 text-xs font-bold text-[#eeeae1]">{String(parts.length + 1).padStart(2, "0")}</span><div><h3 id="send-title" className="text-xl font-bold text-[#eeeae1]">Send your work to Rob</h3><p className="mt-2 text-sm leading-6 text-[#aaa99f]">Check you've uploaded the right version of your song and its matching stems. Once sent, these files are locked for review.</p></div></div>
          <div className="mt-5 flex flex-wrap gap-2">{parts.map((part) => <a key={part.id} href={`#${part.id}`} className="mp-focus-ring inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-xs text-[#d4d0c5]">{part.complete ? <Check size={13} /> : <span className="h-3 w-3 rounded-full border border-white/30" />}{part.title}{!part.complete && <span className="text-[#939187]">needed</span>}</a>)}</div>
          <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-md text-xs leading-5 text-[#aaa99f]" aria-live="polite">{busy ? "Please wait for the current upload or update to finish." : readyToSend ? "Everything is added. Send it when you're happy with it." : `Still to add: ${missingParts.map((part) => part.title.toLowerCase()).join(", ")}.`}</p><PrimaryButton disabled={busy || !readyToSend} onClick={() => void submit()} className="shrink-0">{busy ? "Please wait..." : `Send week ${weekNumber} to Rob`}<Send size={16} /></PrimaryButton></div>
          {submissionMessage && <div role="status" className={cx("mt-4 rounded-xl border px-4 py-3 text-xs leading-5", submissionMessage.startsWith("Week") ? "border-white/15 bg-white/[0.035] text-[#d4d0c5]" : "border-red-400/20 bg-red-950/25 text-red-200")}><div className="flex items-start gap-2"><AlertCircle size={14} className="mt-0.5 shrink-0" />{submissionMessage}</div></div>}
        </section>}
      </div>
      <div className="mt-8 border-t border-white/10 pt-5"><Link to="/mentorship-portal/submissions" className="mp-focus-ring inline-flex items-center gap-2 rounded text-xs font-semibold text-[#b6b3a8]"><ArrowLeft size={14} />Back to your weekly work</Link></div>
    </div>
  );
}
