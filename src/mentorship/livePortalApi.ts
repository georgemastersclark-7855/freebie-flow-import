/* eslint-disable @typescript-eslint/no-explicit-any */
// This adapter is intentionally isolated until the additive mentorship migration
// is applied and the generated Supabase Database type can be refreshed.
import type { User } from "@supabase/supabase-js";
import { Upload } from "tus-js-client";
import { supabase } from "@/integrations/supabase/client";
import type {
  FileKind,
  OnboardingTask,
  PortalCall,
  PortalFile,
  PortalRole,
  PortalUser,
  SetupVideo,
  WeekDefinition,
  WeekSubmission,
  WeekState,
} from "./types";

const db = supabase as any;
const submissionsBucket = "mentorship-submissions";
const feedbackBucket = "mentorship-feedback";
const videosBucket = "mentorship-videos";

interface ProfileRow {
  user_id: string;
  full_name: string;
  email: string;
  role: PortalRole;
}

interface EnrollmentRow {
  id: string;
  cohort_id: string;
  user_id: string;
}

interface CohortRow {
  id: string;
  display_name: string;
  current_week: number;
  circle_url: string | null;
  timezone: string;
}

interface WeekRow {
  id: string;
  week_number: number;
  title: string;
  short_title: string;
  brief: string;
  required_ideas: number;
  song_required: boolean;
  stems_required: boolean;
  deadline_at: string | null;
}

interface SubmissionRow {
  id: string;
  week_id: string;
  state: WeekState;
  submitted_at: string | null;
}

interface SubmissionFileRow {
  id: string;
  submission_id: string;
  kind: "idea" | "song" | "stems";
  storage_path: string;
  file_name: string;
  size_bytes: number;
  uploaded_at: string;
}

interface FeedbackRow {
  id: string;
  submission_id: string;
  written_notes: string;
  next_action: string;
  audio_storage_path: string | null;
  audio_file_name: string | null;
  video_url: string | null;
  published_at: string;
  viewed_at: string | null;
  action_confirmed_at: string | null;
  student_next_action: string | null;
}

interface TaskRow {
  id: string;
  task_key: string;
  title: string;
  description: string;
  action_label: string | null;
  action_url: string | null;
  position: number;
}

interface ResourceRow {
  id: string;
  resource_kind: "welcome_video" | "setup_video";
  title: string;
  description: string;
  duration_label: string | null;
  video_url: string | null;
  storage_path: string | null;
}

interface CallRow {
  id: string;
  title: string;
  starts_at: string;
  calendar_url: string | null;
  circle_event_url: string | null;
}

interface ProgressRow {
  task_id: string;
  completed_at: string | null;
}

export interface LivePortalBootstrap {
  user: PortalUser;
  weeks: WeekDefinition[];
  submissions: WeekSubmission[];
  onboardingTasks: OnboardingTask[];
  setupVideos: SetupVideo[];
  welcomeVideoUrl?: string;
  firstCall?: PortalCall;
  circleUrl?: string;
}

const signedUrl = async (bucket: string, path?: string | null) => {
  if (!path) return undefined;
  const { data, error } = await db.storage.from(bucket).createSignedUrl(path, 60 * 60);
  if (error) throw error;
  return data.signedUrl as string;
};

const deadlineLabel = (deadline: string | null, timezone: string) => {
  if (!deadline) return "Friday, 6:00pm";
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    hour: "numeric",
    minute: "2-digit",
    timeZone: timezone,
  }).format(new Date(deadline));
};

const portalFile = async (row: SubmissionFileRow): Promise<PortalFile> => ({
  id: row.id,
  name: row.file_name,
  size: Number(row.size_bytes),
  kind: row.kind,
  uploadedAt: row.uploaded_at,
  storagePath: row.storage_path,
  objectUrl: await signedUrl(submissionsBucket, row.storage_path),
});

export async function loadLivePortal(user: User): Promise<LivePortalBootstrap> {
  const { data: profileData, error: profileError } = await db
    .from("mentorship_profiles")
    .select("user_id, full_name, email, role")
    .eq("user_id", user.id)
    .single();
  if (profileError) throw new Error("Your mentorship profile has not been provisioned yet.");
  const profile = profileData as ProfileRow;

  const portalUser: PortalUser = {
    id: profile.user_id,
    name: profile.full_name,
    email: profile.email,
    role: profile.role,
    cohortName: "Rob Late's Producer Mentorship",
  };

  if (profile.role !== "student") {
    return { user: portalUser, weeks: [], submissions: [], onboardingTasks: [], setupVideos: [] };
  }

  const { data: enrollmentData, error: enrollmentError } = await db
    .from("mentorship_enrollments")
    .select("id, cohort_id, user_id")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("enrolled_at", { ascending: false })
    .limit(1)
    .single();
  if (enrollmentError) throw new Error("No active mentorship enrolment was found for this account.");
  const enrollment = enrollmentData as EnrollmentRow;

  const [cohortResult, weeksResult, tasksResult, progressResult, submissionsResult, resourcesResult, firstCallResult] = await Promise.all([
    db.from("mentorship_cohorts").select("id, display_name, current_week, circle_url, timezone").eq("id", enrollment.cohort_id).single(),
    db.from("mentorship_weeks").select("*").eq("cohort_id", enrollment.cohort_id).order("week_number"),
    db.from("mentorship_onboarding_tasks").select("*").eq("cohort_id", enrollment.cohort_id).order("position"),
    db.from("mentorship_onboarding_progress").select("task_id, completed_at").eq("enrollment_id", enrollment.id),
    db.from("mentorship_submissions").select("id, week_id, state, submitted_at").eq("enrollment_id", enrollment.id),
    db.from("mentorship_resources").select("id, resource_kind, title, description, duration_label, video_url, storage_path").eq("cohort_id", enrollment.cohort_id).eq("published", true).order("position"),
    db.from("mentorship_calls").select("id, title, starts_at, calendar_url, circle_event_url").eq("cohort_id", enrollment.cohort_id).gte("starts_at", new Date().toISOString()).order("starts_at").limit(1).maybeSingle(),
  ]);

  const firstError = [cohortResult, weeksResult, tasksResult, progressResult, submissionsResult, resourcesResult, firstCallResult].find((result) => result.error)?.error;
  if (firstError) throw firstError;

  const cohort = cohortResult.data as CohortRow;
  const weekRows = weeksResult.data as WeekRow[];
  const taskRows = tasksResult.data as TaskRow[];
  const progressRows = progressResult.data as ProgressRow[];
  const submissionRows = submissionsResult.data as SubmissionRow[];
  const resourceRows = resourcesResult.data as ResourceRow[];
  const firstCallRow = firstCallResult.data as CallRow | null;
  const submissionIds = submissionRows.map((submission) => submission.id);

  const [filesResult, feedbackResult] = submissionIds.length
    ? await Promise.all([
        db.from("mentorship_submission_files").select("*").in("submission_id", submissionIds).order("uploaded_at"),
        db.from("mentorship_feedback").select("*").in("submission_id", submissionIds).eq("status", "published"),
      ])
    : [{ data: [], error: null }, { data: [], error: null }];
  if (filesResult.error) throw filesResult.error;
  if (feedbackResult.error) throw feedbackResult.error;

  const fileRows = filesResult.data as SubmissionFileRow[];
  const feedbackRows = feedbackResult.data as FeedbackRow[];
  const files = await Promise.all(fileRows.map(portalFile));

  const weeks: WeekDefinition[] = weekRows.map((week) => ({
    id: week.id,
    number: week.week_number,
    title: week.title,
    shortTitle: week.short_title,
    brief: week.brief,
    requiredIdeas: week.required_ideas,
    songRequired: week.song_required,
    stemsRequired: week.stems_required,
    deadlineLabel: deadlineLabel(week.deadline_at, cohort.timezone),
    phase: week.week_number < cohort.current_week ? "complete" : week.week_number === cohort.current_week ? "current" : "upcoming",
  }));

  const submissions: WeekSubmission[] = weeks.map((week) => {
    const row = submissionRows.find((submission) => submission.week_id === week.id);
    if (!row) throw new Error(`Week ${week.number} has not been provisioned for this student.`);
    const rowFiles = files.filter((file) => fileRows.find((source) => source.id === file.id)?.submission_id === row.id);
    const feedback = feedbackRows.find((item) => item.submission_id === row.id);
    return {
      id: row.id,
      weekNumber: week.number,
      state: row.state,
      ideas: rowFiles.filter((file) => file.kind === "idea"),
      song: rowFiles.find((file) => file.kind === "song"),
      stems: rowFiles.find((file) => file.kind === "stems"),
      submittedAt: row.submitted_at ?? undefined,
      feedback: feedback ? {
        id: feedback.id,
        text: feedback.written_notes,
        nextAction: feedback.next_action,
        audioName: feedback.audio_file_name ?? undefined,
        audioUrl: undefined,
        videoUrl: feedback.video_url ?? undefined,
        publishedAt: feedback.published_at,
        viewedAt: feedback.viewed_at ?? undefined,
        actionConfirmedAt: feedback.action_confirmed_at ?? undefined,
        studentNextAction: feedback.student_next_action ?? undefined,
      } : undefined,
    };
  });

  for (const submission of submissions) {
    const feedback = feedbackRows.find((item) => item.id === submission.feedback?.id);
    if (feedback?.audio_storage_path && submission.feedback) {
      submission.feedback.audioUrl = await signedUrl(feedbackBucket, feedback.audio_storage_path);
    }
  }

  const completedTaskIds = new Set(progressRows.filter((row) => row.completed_at).map((row) => row.task_id));
  const onboardingTasks: OnboardingTask[] = taskRows.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    actionLabel: task.action_label ?? undefined,
    actionUrl: task.action_url
      ?? (task.task_key === "circle" ? cohort.circle_url : undefined)
      ?? (task.task_key === "first-call" ? firstCallRow?.calendar_url : undefined)
      ?? (task.task_key === "prework" ? "#setup-videos" : undefined),
    complete: completedTaskIds.has(task.id),
  }));

  const setupVideos: SetupVideo[] = await Promise.all(resourceRows
    .filter((resource) => resource.resource_kind === "setup_video")
    .map(async (resource) => ({
      id: resource.id,
      title: resource.title,
      duration: resource.duration_label ?? "",
      description: resource.description,
      url: resource.video_url ?? await signedUrl(videosBucket, resource.storage_path),
    })));
  const welcomeVideo = resourceRows.find((resource) => resource.resource_kind === "welcome_video");
  const welcomeVideoUrl = welcomeVideo
    ? welcomeVideo.video_url ?? await signedUrl(videosBucket, welcomeVideo.storage_path)
    : undefined;
  const firstCall: PortalCall | undefined = firstCallRow ? {
    id: firstCallRow.id,
    title: firstCallRow.title,
    startsAt: firstCallRow.starts_at,
    displayTime: new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      hour: "numeric",
      minute: "2-digit",
      timeZone: cohort.timezone,
      timeZoneName: "short",
    }).format(new Date(firstCallRow.starts_at)),
    calendarUrl: firstCallRow.calendar_url ?? undefined,
    circleUrl: firstCallRow.circle_event_url ?? undefined,
  } : undefined;

  portalUser.cohortId = cohort.id;
  portalUser.enrollmentId = enrollment.id;
  portalUser.cohortName = cohort.display_name;

  return {
    user: portalUser,
    weeks,
    submissions,
    onboardingTasks,
    setupVideos,
    welcomeVideoUrl,
    firstCall,
    circleUrl: cohort.circle_url ?? undefined,
  };
}

export async function signInLivePortal(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (error) throw error;
  if (!data.user) throw new Error("Unable to sign in.");
  return loadLivePortal(data.user);
}

export async function signOutLivePortal() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function requestLivePasswordReset(email: string) {
  const redirectTo = `${window.location.origin}/mentorship-portal/set-password`;
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
  if (error) throw error;
}

export async function setLivePortalPassword(password: string) {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
}

const safeFileName = (name: string) => name
  .normalize("NFKD")
  .replace(/[^a-zA-Z0-9._-]+/g, "-")
  .replace(/-+/g, "-")
  .replace(/^-|-$/g, "")
  .slice(-120) || "audio-file";

const resumableUpload = async (file: File, objectPath: string) => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData.session?.access_token;
  if (!supabaseUrl || !publishableKey || !accessToken) throw new Error("Your session expired. Sign in again.");

  await new Promise<void>((resolve, reject) => {
    const upload = new Upload(file, {
      endpoint: `${supabaseUrl}/storage/v1/upload/resumable`,
      retryDelays: [0, 1_000, 3_000, 5_000, 10_000],
      headers: { authorization: `Bearer ${accessToken}`, apikey: publishableKey },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      chunkSize: 6 * 1024 * 1024,
      metadata: {
        bucketName: submissionsBucket,
        objectName: objectPath,
        contentType: file.type || "application/octet-stream",
        cacheControl: "3600",
      },
      onError: (error) => reject(error),
      onSuccess: () => resolve(),
    });
    upload.findPreviousUploads().then((previous) => {
      if (previous[0]) upload.resumeFromPreviousUpload(previous[0]);
      upload.start();
    }).catch(reject);
  });
};

export async function uploadLiveSubmissionFiles(
  portalUser: PortalUser,
  week: WeekDefinition,
  submission: WeekSubmission,
  kind: FileKind,
  selectedFiles: File[],
) {
  if (!portalUser.cohortId || !submission.id) throw new Error("This submission is not ready for uploads.");
  if (!(["idea", "song", "stems"] as FileKind[]).includes(kind)) throw new Error("Unsupported file type.");

  for (const file of selectedFiles) {
    const path = `${portalUser.id}/${portalUser.cohortId}/week-${week.number}/${kind}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
    await resumableUpload(file, path);
    const { error } = await db.from("mentorship_submission_files").insert({
      submission_id: submission.id,
      uploader_id: portalUser.id,
      kind,
      storage_path: path,
      file_name: file.name,
      mime_type: file.type || null,
      size_bytes: file.size,
    });
    if (error) {
      await db.storage.from(submissionsBucket).remove([path]);
      throw error;
    }
  }

  const { error: stateError } = await db.rpc("start_mentorship_submission", { target_submission_id: submission.id });
  if (stateError) throw stateError;
}

export async function removeLiveSubmissionFile(file: PortalFile) {
  if (!file.storagePath) throw new Error("The stored file path is missing.");
  const { error: storageError } = await db.storage.from(submissionsBucket).remove([file.storagePath]);
  if (storageError) throw storageError;
  const { error: rowError } = await db.from("mentorship_submission_files").delete().eq("id", file.id);
  if (rowError) throw rowError;
}

export async function submitLiveWeek(submissionId: string) {
  const { data, error } = await db.rpc("submit_mentorship_week", { target_submission_id: submissionId });
  if (error) throw error;
  return data as string;
}

export async function setLiveOnboardingTask(enrollmentId: string, taskId: string, complete: boolean) {
  if (complete) {
    const { error } = await db.from("mentorship_onboarding_progress").upsert({
      enrollment_id: enrollmentId,
      task_id: taskId,
      completed_at: new Date().toISOString(),
    });
    if (error) throw error;
  } else {
    const { error } = await db.from("mentorship_onboarding_progress").delete().eq("enrollment_id", enrollmentId).eq("task_id", taskId);
    if (error) throw error;
  }
}

export async function markLiveFeedbackViewed(feedbackId: string) {
  const { error } = await db.rpc("mark_mentorship_feedback_viewed", { target_feedback_id: feedbackId });
  if (error) throw error;
}

export async function confirmLiveFeedbackAction(feedbackId: string, nextAction: string) {
  const { error } = await db.rpc("confirm_mentorship_feedback_action", {
    target_feedback_id: feedbackId,
    next_action_text: nextAction,
  });
  if (error) throw error;
}
