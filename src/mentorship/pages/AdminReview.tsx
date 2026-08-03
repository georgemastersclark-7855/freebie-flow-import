import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Bell, Check, Download, Link2, LoaderCircle, Mic, Pause, Save, Send, Sparkles, Upload } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { reviewItems } from "../demoData";
import { loadLiveAdminOverview, publishLiveFeedback, saveLiveFeedbackDraft, setLiveSurgerySelection } from "../liveAdminApi";
import { usePortalStore } from "../PortalStore";
import type { PortalFile, ReviewItem } from "../types";
import { CollapsibleFiles, MockAudioPlayer, PrimaryButton, SecondaryButton } from "../components/PortalUI";
import { cx } from "../utils";

export function AdminReview() {
  const { reviewId } = useParams();
  const { backend, user } = usePortalStore();
  const demoReview = useMemo(() => reviewItems.find((item) => item.id === reviewId), [reviewId]);
  const [review, setReview] = useState<ReviewItem | undefined>(backend === "demo" ? demoReview : undefined);
  const [loading, setLoading] = useState(backend === "supabase");
  const [loadError, setLoadError] = useState("");
  const [notes, setNotes] = useState(demoReview?.status === "draft" ? "The hook lands. I would shorten the pre-chorus by four bars so the first chorus arrives before the energy flattens." : "");
  const [nextAction, setNextAction] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [recording, setRecording] = useState(false);
  const [audioFile, setAudioFile] = useState<File>();
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string>();
  const [published, setPublished] = useState(demoReview?.status === "published");
  const [saving, setSaving] = useState(false);
  const [updatingSurgery, setUpdatingSurgery] = useState(false);
  const recorderRef = useRef<MediaRecorder>();
  const streamRef = useRef<MediaStream>();
  const chunksRef = useRef<Blob[]>([]);

  const loadReview = async () => {
    if (backend !== "supabase" || !reviewId) return;
    const overview = await loadLiveAdminOverview();
    const found = overview.reviews.find((item) => item.id === reviewId);
    if (!found) throw new Error("This submission is no longer in Rob's review queue.");
    setReview(found);
    return found;
  };

  useEffect(() => {
    if (backend !== "supabase") return;
    let active = true;
    setLoading(true);
    loadLiveAdminOverview()
      .then((overview) => {
        if (!active) return;
        const found = overview.reviews.find((item) => item.id === reviewId);
        if (!found) throw new Error("This submission is no longer in Rob's review queue.");
        setReview(found);
      })
      .catch((error) => { if (active) setLoadError(error instanceof Error ? error.message : "Unable to load this review."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [backend, reviewId]);

  useEffect(() => {
    if (!review) return;
    setNotes(review.feedback?.writtenNotes ?? "");
    setNextAction(review.feedback?.nextAction ?? "");
    setVideoUrl(review.feedback?.videoUrl ?? "");
    setPublished(review.status === "published");
  }, [review]);

  useEffect(() => () => {
    if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, [audioPreviewUrl]);

  if (loading) return <div className="grid min-h-[55vh] place-items-center text-xs font-bold uppercase tracking-[0.16em] text-[#77766f]"><span className="inline-flex items-center gap-2"><LoaderCircle size={16} className="animate-spin" />Loading submission</span></div>;
  if (loadError) return <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-red-400/20 bg-red-950/20 p-5 text-sm text-red-200">{loadError}</div>;
  if (!review) return <Navigate to="/mentorship-portal/admin" replace />;

  const feedbackInput = () => ({
    writtenNotes: notes,
    nextAction,
    videoUrl,
    audioFile,
    existingAudioStoragePath: review.feedback?.audioStoragePath,
    existingAudioFileName: review.feedback?.audioFileName,
  });

  const hasFeedback = () => Boolean(notes.trim() || audioFile || review.feedback?.audioStoragePath || videoUrl.trim());

  const saveDraft = async () => {
    if (!hasFeedback()) {
      toast.error("Add written, audio or video feedback before saving.");
      return;
    }
    setSaving(true);
    try {
      if (backend === "supabase") {
        if (!user) throw new Error("Sign in again before saving feedback.");
        await saveLiveFeedbackDraft(review, user.id, feedbackInput());
        const refreshed = await loadReview();
        if (refreshed) setReview(refreshed);
        setAudioFile(undefined);
      } else {
        setReview({ ...review, status: "draft" });
      }
      setPublished(false);
      toast.success("Feedback draft saved.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save this draft.");
    } finally {
      setSaving(false);
    }
  };

  const publish = async () => {
    if (!hasFeedback()) {
      toast.error("Add written, audio or video feedback before publishing.");
      return;
    }
    if (!nextAction.trim()) {
      toast.error("Give the student one clear next action.");
      return;
    }
    setSaving(true);
    try {
      let queued = true;
      if (backend === "supabase") {
        const result = await publishLiveFeedback(review, feedbackInput());
        queued = result.notification_queued;
        const refreshed = await loadReview();
        if (refreshed) setReview(refreshed);
        setAudioFile(undefined);
      }
      setPublished(true);
      toast.success(queued ? `Feedback published to ${review.studentName}.` : "Feedback published. The email hook is not configured yet.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to publish this feedback.");
    } finally {
      setSaving(false);
    }
  };

  const finishRecording = (recorder: MediaRecorder) => {
    recorder.onstop = () => {
      const mimeType = recorder.mimeType || "audio/webm";
      const extension = mimeType.includes("mp4") ? "m4a" : mimeType.includes("ogg") ? "ogg" : "webm";
      const blob = new Blob(chunksRef.current, { type: mimeType });
      const file = new File([blob], `Rob feedback - Week ${review.weekNumber}.${extension}`, { type: mimeType });
      if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
      setAudioFile(file);
      setAudioPreviewUrl(URL.createObjectURL(file));
      setRecording(false);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = undefined;
      toast.success("Voice note attached.");
    };
  };

  const toggleRecording = async () => {
    if (recording) {
      recorderRef.current?.stop();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      streamRef.current = stream;
      recorderRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = (event) => { if (event.data.size) chunksRef.current.push(event.data); };
      finishRecording(recorder);
      recorder.start();
      setRecording(true);
    } catch {
      toast.error("Microphone access was not available. Upload an audio file instead.");
    }
  };

  const selectAudioFile = (file?: File) => {
    if (!file) return;
    if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
    setAudioFile(file);
    setAudioPreviewUrl(URL.createObjectURL(file));
  };

  const toggleSurgery = async () => {
    if (!review.stemsReady) {
      toast.error("This student has not uploaded stems.");
      return;
    }
    setUpdatingSurgery(true);
    try {
      const selected = !review.surgerySelected;
      if (backend === "supabase") {
        if (!user) throw new Error("Sign in again before changing the surgery queue.");
        await setLiveSurgerySelection(review, user.id, selected);
      }
      setReview({ ...review, surgerySelected: selected });
      toast.success(selected ? "Added to the live surgery shortlist." : "Removed from the surgery shortlist.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update the surgery shortlist.");
    } finally {
      setUpdatingSurgery(false);
    }
  };

  const feedbackPreview: PortalFile | undefined = audioPreviewUrl || review.feedback?.audioUrl ? {
    id: "feedback-preview",
    name: audioFile?.name ?? review.feedback?.audioFileName ?? "Rob's voice feedback",
    size: audioFile?.size ?? 0,
    kind: "feedback",
    uploadedAt: new Date().toISOString(),
    objectUrl: audioPreviewUrl ?? review.feedback?.audioUrl,
  } : undefined;

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-7 lg:px-10 lg:py-10 xl:px-14">
      <Link to="/mentorship-portal/admin" className="mp-focus-ring inline-flex items-center gap-2 rounded-lg text-xs font-bold text-[#8f8e85] hover:text-white"><ArrowLeft size={15} />Back to cohort overview</Link>

      <header className="mt-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><div><div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8f8e85]">Week {review.weekNumber} review</div><h1 className="mp-display mt-2 text-[48px] leading-[0.92] text-[#f2efe6] sm:text-[62px]">{review.studentName.toUpperCase()}</h1><p className="mt-3 text-sm text-[#8f8e85]">Submitted {review.submittedLabel}</p></div><div className="flex items-center gap-3"><span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-[#aaa99f]">{published ? "Feedback published" : review.status === "draft" ? "Draft saved" : "Awaiting review"}</span></div></header>

      <div className="mt-7 grid gap-6 xl:grid-cols-[1fr_390px]">
        <div className="space-y-6">
          <section className="mp-card rounded-3xl p-5 sm:p-7">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#77766f]">Selected song</div><h2 className="mt-1 text-lg font-black text-[#ece9e0]">{review.songName}</h2></div>{review.song?.objectUrl ? <a href={review.song.objectUrl} download={review.song.name} target="_blank" rel="noreferrer" className="mp-focus-ring inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 text-xs font-bold text-[#bbb8af]"><Download size={14} />Download WAV</a> : <button type="button" className="mp-focus-ring inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 text-xs font-bold text-[#bbb8af]"><Download size={14} />Download WAV</button>}</div>
            <div className="mt-5"><MockAudioPlayer file={review.song} label={review.songName} /></div>
            <div className="mt-4"><CollapsibleFiles files={review.ideaNames} /></div>
          </section>

          <section className="mp-card rounded-3xl p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4"><div><div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#77766f]">Rob's feedback</div><h2 className="mp-display mt-1 text-[34px] leading-none text-[#ece9e0]">RECORD THE DECISION</h2><p className="mt-2 max-w-2xl text-xs leading-5 text-[#77766f]">Leave written notes, a voice note or a video. The formal feedback stays attached to this exact submission.</p></div><Sparkles size={19} className="shrink-0 text-[#77766f]" /></div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => void toggleRecording()} className={cx("mp-focus-ring flex items-center gap-3 rounded-2xl border p-4 text-left transition", recording ? "border-red-400/30 bg-red-950/25" : audioFile || review.feedback?.audioStoragePath ? "border-white/15 bg-white/[0.035]" : "border-white/10 bg-black/20 hover:border-white/15")}><span className={cx("grid h-10 w-10 place-items-center rounded-full", recording ? "bg-red-500 text-white" : "bg-white text-black")}>{recording ? <Pause size={16} fill="currentColor" /> : audioFile || review.feedback?.audioStoragePath ? <Check size={17} /> : <Mic size={17} />}</span><span><span className="block text-sm font-black text-[#e5e1d8]">{recording ? "Recording… tap to stop" : audioFile || review.feedback?.audioStoragePath ? "Voice note attached" : "Record a voice note"}</span><span className="mt-0.5 block text-[11px] text-[#77766f]">{recording ? "Listening to your microphone" : "Record directly in the browser"}</span></span></button>
              <label className="mp-focus-ring flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-white/15"><span className="grid h-10 w-10 place-items-center rounded-full bg-white/[0.07] text-[#bbb8af]"><Upload size={16} /></span><span><span className="block text-sm font-black text-[#e5e1d8]">Upload voice feedback</span><span className="mt-0.5 block text-[11px] text-[#77766f]">M4A, MP3, WAV or WebM</span></span><input type="file" accept="audio/*,.m4a,.mp3,.wav,.webm" className="hidden" onChange={(event) => selectAudioFile(event.target.files?.[0])} /></label>
            </div>
            {feedbackPreview && <div className="mt-3"><MockAudioPlayer file={feedbackPreview} label={feedbackPreview.name} /></div>}

            <label className="mt-4 block rounded-2xl border border-white/10 bg-black/20 p-4"><span className="flex items-center gap-2 text-sm font-black text-[#e5e1d8]"><Link2 size={16} className="text-[#8f8e85]" />Add a video link</span><input value={videoUrl} onChange={(event) => setVideoUrl(event.target.value)} type="url" placeholder="Loom or unlisted video URL" className="mp-focus-ring mt-2.5 h-9 w-full rounded-lg border border-white/[0.08] bg-white/[0.035] px-3 text-xs text-white placeholder:text-[#56554f]" /></label>

            <label className="mt-5 block"><span className="text-xs font-bold text-[#bbb8af]">Written notes</span><textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={6} placeholder="What is working? What needs to change?" className="mp-focus-ring mt-2 w-full resize-y rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-[#e5e1d8] placeholder:text-[#56554f]" /></label>
            <label className="mt-4 block"><span className="text-xs font-bold text-[#bbb8af]">Their next action</span><textarea value={nextAction} onChange={(event) => setNextAction(event.target.value)} rows={3} placeholder="Give them one clear action to complete next." className="mp-focus-ring mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-[#e5e1d8] placeholder:text-[#56554f]" /></label>
          </section>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
          <div className="mp-card rounded-3xl p-5"><div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#77766f]">Submission details</div><dl className="mt-4 space-y-3 text-xs"><div className="flex justify-between gap-4"><dt className="text-[#77766f]">Ideas</dt><dd className="font-bold text-[#d9d6cd]">{review.ideaNames.length}</dd></div><div className="flex justify-between gap-4"><dt className="text-[#77766f]">Song</dt><dd className="font-bold text-[#d9d6cd]">Ready</dd></div><div className="flex justify-between gap-4"><dt className="text-[#77766f]">Stems</dt><dd className={cx("font-bold", review.stemsReady ? "text-[#d9d6cd]" : "text-[#d7bd65]")}>{review.stemsReady ? "Ready" : "Missing"}</dd></div><div className="flex justify-between gap-4"><dt className="text-[#77766f]">Live surgery</dt><dd className="font-bold text-[#d9d6cd]">{review.surgerySelected ? "Shortlisted" : "Not selected"}</dd></div></dl>{review.stems?.objectUrl ? <a href={review.stems.objectUrl} download={review.stems.name} target="_blank" rel="noreferrer" className="mp-focus-ring mt-5 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-[#f2efe6]"><Download size={14} />Download stems ZIP</a> : review.stemsReady && <SecondaryButton className="mt-5 w-full"><Download size={14} />Download stems ZIP</SecondaryButton>}<SecondaryButton onClick={() => void toggleSurgery()} className={cx("mt-2 w-full", (!review.stemsReady || updatingSurgery) && "pointer-events-none opacity-45")}>{review.surgerySelected ? "Remove from surgery" : "Shortlist for surgery"}</SecondaryButton></div>

          <div className="mp-card rounded-3xl p-5"><div className="flex items-center gap-2 text-sm font-black text-[#dedbd2]"><Bell size={16} className="text-[#8f8e85]" />When you publish</div><ul className="mt-4 space-y-3 text-xs leading-5 text-[#77766f]"><li className="flex gap-2"><Check size={14} className="mt-0.5 shrink-0 text-[#8f8e85]" />Feedback appears in the student's Week {review.weekNumber} page.</li><li className="flex gap-2"><Check size={14} className="mt-0.5 shrink-0 text-[#8f8e85]" />They receive an email with a direct link.</li><li className="flex gap-2"><Check size={14} className="mt-0.5 shrink-0 text-[#8f8e85]" />The tracker records viewed and actioned status.</li></ul></div>

          <div className="grid grid-cols-2 gap-2"><SecondaryButton onClick={() => void saveDraft()} className={saving ? "pointer-events-none opacity-50" : ""}><Save size={14} />Save draft</SecondaryButton><PrimaryButton onClick={() => void publish()} disabled={saving}><Send size={14} />Publish</PrimaryButton></div>
          {published && <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"><div className="flex items-center gap-2 text-sm font-bold text-[#dedbd2]"><Check size={16} className="text-[#8f8e85]" />Feedback sent</div><p className="mt-1 text-xs leading-5 text-[#77766f]">The student's email notification has been queued.</p></div>}
        </aside>
      </div>
    </div>
  );
}
