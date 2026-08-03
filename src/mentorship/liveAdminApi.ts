/* eslint-disable @typescript-eslint/no-explicit-any */
// This adapter stays isolated until the mentorship migration is applied and the
// generated Supabase Database type can be refreshed.
import { supabase } from "@/integrations/supabase/client";
import type {
  AdminOverview,
  AdminStudent,
  PortalFile,
  ReviewFeedback,
  ReviewItem,
} from "./types";

const db = supabase as any;
const submissionsBucket = "mentorship-submissions";
const feedbackBucket = "mentorship-feedback";

type FeedbackInput = {
  writtenNotes: string;
  nextAction: string;
  videoUrl: string;
  audioFile?: File;
  existingAudioStoragePath?: string;
  existingAudioFileName?: string;
};

const initials = (name: string) => name
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0]?.toUpperCase())
  .join("") || "?";

const relativeTime = (date?: string | null) => {
  if (!date) return "No activity yet";
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 1_000));
  if (seconds < 60) return "Just now";
  if (seconds < 3_600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86_400) return `${Math.floor(seconds / 3_600)} hours ago`;
  if (seconds < 172_800) return "Yesterday";
  return `${Math.floor(seconds / 86_400)} days ago`;
};

const submittedLabel = (date?: string | null) => {
  if (!date) return "Not submitted";
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
};

const deadlineLabel = (deadline?: string | null, timezone = "Europe/London") => {
  if (!deadline) return "Friday, 6:00pm";
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    hour: "numeric",
    minute: "2-digit",
    timeZone: timezone,
  }).format(new Date(deadline));
};

const safeFileName = (name: string) => name
  .normalize("NFKD")
  .replace(/[^a-zA-Z0-9._-]+/g, "-")
  .replace(/-+/g, "-")
  .replace(/^-|-$/g, "")
  .slice(-120) || "feedback-audio";

async function signFile(bucket: string, path?: string | null) {
  if (!path) return undefined;
  const { data, error } = await db.storage.from(bucket).createSignedUrl(path, 60 * 60);
  if (error) throw error;
  return data.signedUrl as string;
}

async function findWorkingCohort() {
  for (const status of ["active", "draft"]) {
    const { data, error } = await db
      .from("mentorship_cohorts")
      .select("id, display_name, current_week, timezone")
      .eq("status", status)
      .order("starts_at", { ascending: false, nullsFirst: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    if (data) return data;
  }
  throw new Error("No active or draft mentorship cohort exists yet.");
}

export async function loadLiveAdminOverview(): Promise<AdminOverview> {
  const cohort = await findWorkingCohort();
  const [weekResult, enrollmentResult] = await Promise.all([
    db.from("mentorship_weeks").select("id, week_number, required_ideas, song_required, stems_required, deadline_at").eq("cohort_id", cohort.id).eq("week_number", cohort.current_week).single(),
    db.from("mentorship_enrollments").select("id, user_id, enrolled_at").eq("cohort_id", cohort.id).eq("status", "active").order("enrolled_at"),
  ]);
  if (weekResult.error) throw weekResult.error;
  if (enrollmentResult.error) throw enrollmentResult.error;

  const week = weekResult.data;
  const enrollments = enrollmentResult.data ?? [];
  const userIds = enrollments.map((row: any) => row.user_id);
  const enrollmentIds = enrollments.map((row: any) => row.id);
  if (!enrollmentIds.length) {
    return {
      cohortId: cohort.id,
      cohortName: cohort.display_name,
      currentWeek: cohort.current_week,
      deadlineLabel: deadlineLabel(week.deadline_at, cohort.timezone),
      students: [],
      reviews: [],
    };
  }

  const [profileResult, submissionResult, callResult, allSubmissionResult] = await Promise.all([
    db.from("mentorship_profiles").select("user_id, full_name, email").in("user_id", userIds),
    db.from("mentorship_submissions").select("id, enrollment_id, state, submitted_at, updated_at").eq("week_id", week.id).in("enrollment_id", enrollmentIds),
    db.from("mentorship_calls").select("id").eq("cohort_id", cohort.id).lte("starts_at", new Date().toISOString()),
    db.from("mentorship_submissions").select("id, enrollment_id").in("enrollment_id", enrollmentIds),
  ]);
  if (profileResult.error) throw profileResult.error;
  if (submissionResult.error) throw submissionResult.error;
  if (callResult.error) throw callResult.error;
  if (allSubmissionResult.error) throw allSubmissionResult.error;

  const profiles = profileResult.data ?? [];
  const submissions = submissionResult.data ?? [];
  const submissionIds = submissions.map((row: any) => row.id);
  const callIds = (callResult.data ?? []).map((row: any) => row.id);
  const allSubmissionIds = (allSubmissionResult.data ?? []).map((row: any) => row.id);
  const [fileResult, feedbackResult, attendanceResult, surgeryResult] = await Promise.all([
    submissionIds.length
      ? db.from("mentorship_submission_files").select("*").in("submission_id", submissionIds).order("uploaded_at")
      : Promise.resolve({ data: [], error: null }),
    submissionIds.length
      ? db.from("mentorship_feedback").select("*").in("submission_id", submissionIds)
      : Promise.resolve({ data: [], error: null }),
    callIds.length
      ? db.from("mentorship_call_attendance").select("enrollment_id, attended").in("call_id", callIds)
      : Promise.resolve({ data: [], error: null }),
    allSubmissionIds.length
      ? db.from("mentorship_surgeries").select("submission_id").in("submission_id", allSubmissionIds)
      : Promise.resolve({ data: [], error: null }),
  ]);
  if (fileResult.error) throw fileResult.error;
  if (feedbackResult.error) throw feedbackResult.error;
  if (attendanceResult.error) throw attendanceResult.error;
  if (surgeryResult.error) throw surgeryResult.error;

  const files = fileResult.data ?? [];
  const feedback = feedbackResult.data ?? [];
  const attendance = attendanceResult.data ?? [];
  const surgeries = surgeryResult.data ?? [];
  const portalFiles = new Map<string, PortalFile>();
  await Promise.all(files.map(async (row: any) => {
    portalFiles.set(row.id, {
      id: row.id,
      name: row.file_name,
      size: Number(row.size_bytes),
      kind: row.kind,
      uploadedAt: row.uploaded_at,
      storagePath: row.storage_path,
      objectUrl: await signFile(submissionsBucket, row.storage_path),
    });
  }));

  const students: AdminStudent[] = [];
  const reviews: ReviewItem[] = [];

  for (const enrollment of enrollments) {
    const profile = profiles.find((row: any) => row.user_id === enrollment.user_id);
    const submission = submissions.find((row: any) => row.enrollment_id === enrollment.id);
    const rowFiles = submission ? files.filter((row: any) => row.submission_id === submission.id) : [];
    const ideaRows = rowFiles.filter((row: any) => row.kind === "idea");
    const songRow = rowFiles.find((row: any) => row.kind === "song");
    const stemsRow = rowFiles.find((row: any) => row.kind === "stems");
    const feedbackRow = submission ? feedback.find((row: any) => row.submission_id === submission.id) : undefined;
    const attendanceRows = attendance.filter((row: any) => row.enrollment_id === enrollment.id);
    const enrollmentSubmissionIds = (allSubmissionResult.data ?? [])
      .filter((row: any) => row.enrollment_id === enrollment.id)
      .map((row: any) => row.id);
    const feedbackState: AdminStudent["feedbackState"] = feedbackRow?.status === "published"
      ? feedbackRow.action_confirmed_at ? "actioned" : "published"
      : feedbackRow?.status === "draft" ? "draft" : "awaiting";
    const requiredComplete = ideaRows.length >= week.required_ideas
      && (!week.song_required || Boolean(songRow))
      && (!week.stems_required || Boolean(stemsRow));
    const hasStarted = rowFiles.length > 0;
    const activityDates = [submission?.updated_at, ...rowFiles.map((row: any) => row.uploaded_at)].filter(Boolean);
    const mostRecent = activityDates.sort()[activityDates.length - 1] ?? enrollment.enrolled_at;

    students.push({
      id: enrollment.user_id,
      name: profile?.full_name ?? "Student",
      email: profile?.email ?? "",
      initials: initials(profile?.full_name ?? "Student"),
      ideasSubmitted: ideaRows.length,
      ideasRequired: week.required_ideas,
      songSubmitted: Boolean(songRow),
      stemsSubmitted: Boolean(stemsRow),
      attendance: attendanceRows.filter((row: any) => row.attended).length,
      attendanceTotal: callIds.length,
      surgeryCount: surgeries.filter((row: any) => enrollmentSubmissionIds.includes(row.submission_id)).length,
      feedbackState,
      status: requiredComplete || submission?.state === "submitted" || submission?.state === "late"
        ? "on_track"
        : hasStarted ? "needs_attention" : "not_started",
      lastActivity: relativeTime(mostRecent),
    });

    if (submission && songRow && ["submitted", "late"].includes(submission.state)) {
      const feedbackRecord: ReviewFeedback | undefined = feedbackRow ? {
        id: feedbackRow.id,
        status: feedbackRow.status,
        writtenNotes: feedbackRow.written_notes,
        nextAction: feedbackRow.next_action,
        audioStoragePath: feedbackRow.audio_storage_path ?? undefined,
        audioFileName: feedbackRow.audio_file_name ?? undefined,
        audioUrl: await signFile(feedbackBucket, feedbackRow.audio_storage_path),
        videoUrl: feedbackRow.video_url ?? undefined,
      } : undefined;
      reviews.push({
        id: submission.id,
        submissionId: submission.id,
        studentId: enrollment.user_id,
        studentName: profile?.full_name ?? "Student",
        studentEmail: profile?.email ?? "",
        cohortId: cohort.id,
        weekNumber: cohort.current_week,
        songName: songRow.file_name,
        submittedLabel: submittedLabel(submission.submitted_at),
        stemsReady: Boolean(stemsRow),
        ideaNames: ideaRows.map((row: any) => row.file_name),
        status: feedbackRow?.status ?? "awaiting",
        song: portalFiles.get(songRow.id),
        stems: stemsRow ? portalFiles.get(stemsRow.id) : undefined,
        ideas: ideaRows.map((row: any) => portalFiles.get(row.id)).filter(Boolean) as PortalFile[],
        feedback: feedbackRecord,
        surgerySelected: surgeries.some((row: any) => row.submission_id === submission.id),
      });
    }
  }

  return {
    cohortId: cohort.id,
    cohortName: cohort.display_name,
    currentWeek: cohort.current_week,
    deadlineLabel: deadlineLabel(week.deadline_at, cohort.timezone),
    students,
    reviews: reviews.sort((a, b) => a.submittedLabel.localeCompare(b.submittedLabel)),
  };
}

export async function setLiveSurgerySelection(review: ReviewItem, staffUserId: string, selected: boolean) {
  if (!review.submissionId) throw new Error("The submission is missing from this review.");
  if (selected) {
    const { error } = await db.from("mentorship_surgeries").upsert({
      submission_id: review.submissionId,
      selected_by: staffUserId,
    }, { onConflict: "submission_id" });
    if (error) throw error;
  } else {
    const { error } = await db.from("mentorship_surgeries").delete().eq("submission_id", review.submissionId);
    if (error) throw error;
  }
}

async function uploadFeedbackAudio(review: ReviewItem, file: File) {
  if (!review.cohortId) throw new Error("The cohort is missing from this review.");
  const path = `${review.studentId}/${review.cohortId}/week-${review.weekNumber}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
  const { error } = await db.storage.from(feedbackBucket).upload(path, file, {
    contentType: file.type || "application/octet-stream",
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  return { path, fileName: file.name };
}

async function prepareAudio(review: ReviewItem, input: FeedbackInput) {
  if (!input.audioFile) {
    return {
      path: input.existingAudioStoragePath ?? null,
      fileName: input.existingAudioFileName ?? null,
      newPath: undefined as string | undefined,
    };
  }
  const uploaded = await uploadFeedbackAudio(review, input.audioFile);
  return { path: uploaded.path, fileName: uploaded.fileName, newPath: uploaded.path };
}

export async function saveLiveFeedbackDraft(review: ReviewItem, authorId: string, input: FeedbackInput) {
  if (!review.submissionId) throw new Error("The submission is missing from this review.");
  const audio = await prepareAudio(review, input);
  const { error } = await db.from("mentorship_feedback").upsert({
    submission_id: review.submissionId,
    author_id: authorId,
    status: "draft",
    written_notes: input.writtenNotes.trim(),
    next_action: input.nextAction.trim(),
    audio_storage_path: audio.path,
    audio_file_name: audio.fileName,
    video_url: input.videoUrl.trim() || null,
  }, { onConflict: "submission_id" });
  if (error) {
    if (audio.newPath) await db.storage.from(feedbackBucket).remove([audio.newPath]);
    throw error;
  }
  if (audio.newPath && input.existingAudioStoragePath && input.existingAudioStoragePath !== audio.newPath) {
    await db.storage.from(feedbackBucket).remove([input.existingAudioStoragePath]);
  }
  return audio;
}

export async function publishLiveFeedback(review: ReviewItem, input: FeedbackInput) {
  if (!review.submissionId) throw new Error("The submission is missing from this review.");
  const audio = await prepareAudio(review, input);
  const { data, error } = await supabase.functions.invoke("publish-mentorship-feedback", {
    body: {
      submission_id: review.submissionId,
      written_notes: input.writtenNotes.trim(),
      next_action: input.nextAction.trim(),
      audio_storage_path: audio.path,
      audio_file_name: audio.fileName,
      video_url: input.videoUrl.trim() || null,
    },
  });
  if (error || data?.error) {
    if (audio.newPath) await db.storage.from(feedbackBucket).remove([audio.newPath]);
    throw error ?? new Error(data.error);
  }
  if (audio.newPath && input.existingAudioStoragePath && input.existingAudioStoragePath !== audio.newPath) {
    await db.storage.from(feedbackBucket).remove([input.existingAudioStoragePath]);
  }
  return data as { feedback_id: string; notification_queued: boolean };
}
