import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  demoAdmin,
  demoCoach,
  demoStudent,
  demoSetupVideos,
  initialOnboardingTasks,
  initialSubmissions,
  weekDefinitions,
} from "./demoData";
import {
  confirmLiveFeedbackAction,
  loadLivePortal,
  markLiveFeedbackViewed,
  removeLiveSubmissionFile,
  requestLivePasswordReset,
  setLiveOnboardingTask,
  signInLivePortal,
  signOutLivePortal,
  setLivePortalPassword,
  submitLiveWeek,
  uploadLiveSubmissionFiles,
  type LivePortalBootstrap,
} from "./livePortalApi";
import type {
  FileKind,
  OnboardingTask,
  PortalFile,
  PortalCall,
  PortalUser,
  SetupVideo,
  WeekDefinition,
  WeekSubmission,
} from "./types";

interface SubmitResult {
  ok: boolean;
  message: string;
}

interface PortalStoreValue {
  ready: boolean;
  backend: "demo" | "supabase";
  authError?: string;
  user: PortalUser | null;
  weeks: WeekDefinition[];
  submissions: WeekSubmission[];
  onboardingTasks: OnboardingTask[];
  setupVideos: SetupVideo[];
  welcomeVideoUrl?: string;
  firstCall?: PortalCall;
  circleUrl?: string;
  login: (email: string, password: string) => Promise<PortalUser>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  setPassword: (password: string) => Promise<void>;
  refresh: () => Promise<void>;
  toggleOnboardingTask: (id: string) => Promise<void>;
  addFiles: (weekNumber: number, kind: FileKind, files: File[]) => Promise<void>;
  removeFile: (weekNumber: number, kind: FileKind, fileId: string) => Promise<void>;
  submitWeek: (weekNumber: number) => Promise<SubmitResult>;
  markFeedbackViewed: (weekNumber: number) => Promise<void>;
  confirmFeedbackAction: (weekNumber: number, nextAction: string) => Promise<void>;
}

const PortalStore = createContext<PortalStoreValue | null>(null);
const liveBackend = import.meta.env.VITE_MENTORSHIP_BACKEND === "supabase";
const sessionKey = "rla-mentorship-demo-session";
const submissionKey = "rla-mentorship-demo-submissions";
const onboardingKey = "rla-mentorship-demo-onboarding-v2";

const readStored = <T,>(key: string, fallback: T): T => {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
};

const deriveDemoUser = (email: string): PortalUser => {
  const normalized = email.trim().toLowerCase();
  if (normalized.startsWith("rob")) return { ...demoCoach, email: normalized };
  if (normalized.startsWith("george")) return { ...demoAdmin, email: normalized };
  return { ...demoStudent, email: normalized || demoStudent.email };
};

const makeDemoFile = (file: File, kind: FileKind): PortalFile => ({
  id: `${kind}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  name: file.name,
  size: file.size,
  kind,
  uploadedAt: new Date().toISOString(),
  objectUrl: URL.createObjectURL(file),
});

export function PortalStoreProvider({ children }: { children: ReactNode }) {
  const backend = liveBackend ? "supabase" as const : "demo" as const;
  const [ready, setReady] = useState(!liveBackend);
  const [user, setUser] = useState<PortalUser | null>(() =>
    liveBackend ? null : readStored<PortalUser | null>(sessionKey, null),
  );
  const [weeks, setWeeks] = useState<WeekDefinition[]>(() => liveBackend ? [] : weekDefinitions);
  const [submissions, setSubmissions] = useState<WeekSubmission[]>(() =>
    liveBackend ? [] : readStored(submissionKey, initialSubmissions),
  );
  const [onboardingTasks, setOnboardingTasks] = useState<OnboardingTask[]>(() =>
    liveBackend ? [] : readStored(onboardingKey, initialOnboardingTasks),
  );
  const [circleUrl, setCircleUrl] = useState<string | undefined>();
  const [authError, setAuthError] = useState<string | undefined>();
  const [setupVideos, setSetupVideos] = useState<SetupVideo[]>(() => liveBackend ? [] : demoSetupVideos);
  const [welcomeVideoUrl, setWelcomeVideoUrl] = useState<string | undefined>();
  const [firstCall, setFirstCall] = useState<PortalCall | undefined>(() => liveBackend ? undefined : {
    id: "demo-first-call",
    title: "First live call",
    startsAt: "2026-08-09T17:00:00.000Z",
    displayTime: "Sunday, 6:00pm UK",
  });

  const applyLiveBootstrap = useCallback((bootstrap: LivePortalBootstrap) => {
    setUser(bootstrap.user);
    setWeeks(bootstrap.weeks);
    setSubmissions(bootstrap.submissions);
    setOnboardingTasks(bootstrap.onboardingTasks);
    setSetupVideos(bootstrap.setupVideos);
    setWelcomeVideoUrl(bootstrap.welcomeVideoUrl);
    setFirstCall(bootstrap.firstCall);
    setCircleUrl(bootstrap.circleUrl);
    setAuthError(undefined);
  }, []);

  const clearLiveState = useCallback(() => {
    setUser(null);
    setWeeks([]);
    setSubmissions([]);
    setOnboardingTasks([]);
    setSetupVideos([]);
    setWelcomeVideoUrl(undefined);
    setFirstCall(undefined);
    setCircleUrl(undefined);
  }, []);

  const refresh = useCallback(async () => {
    if (!liveBackend) return;
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      clearLiveState();
      return;
    }
    applyLiveBootstrap(await loadLivePortal(data.user));
  }, [applyLiveBootstrap, clearLiveState]);

  useEffect(() => {
    if (!liveBackend) return;
    let active = true;
    const restore = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user && active) {
          const bootstrap = await loadLivePortal(data.session.user);
          if (active) applyLiveBootstrap(bootstrap);
        }
      } catch (error) {
        if (active) {
          clearLiveState();
          setAuthError(error instanceof Error ? error.message : "Unable to restore your mentorship session.");
        }
      } finally {
        if (active) setReady(true);
      }
    };
    void restore();
    return () => { active = false; };
  }, [applyLiveBootstrap, clearLiveState]);

  useEffect(() => {
    if (liveBackend) return;
    if (user) window.localStorage.setItem(sessionKey, JSON.stringify(user));
    else window.localStorage.removeItem(sessionKey);
  }, [user]);

  useEffect(() => {
    if (liveBackend) return;
    const serializable = submissions.map((submission) => ({
      ...submission,
      ideas: submission.ideas.map(({ objectUrl: _objectUrl, ...file }) => file),
      song: submission.song
        ? (({ objectUrl: _objectUrl, ...file }) => file)(submission.song)
        : undefined,
      stems: submission.stems
        ? (({ objectUrl: _objectUrl, ...file }) => file)(submission.stems)
        : undefined,
    }));
    window.localStorage.setItem(submissionKey, JSON.stringify(serializable));
  }, [submissions]);

  useEffect(() => {
    if (!liveBackend) window.localStorage.setItem(onboardingKey, JSON.stringify(onboardingTasks));
  }, [onboardingTasks]);

  const login = useCallback(async (email: string, password: string) => {
    if (!email.trim() || !password.trim()) throw new Error("Enter your email and password.");
    if (liveBackend) {
      setReady(false);
      setAuthError(undefined);
      try {
        const bootstrap = await signInLivePortal(email, password);
        applyLiveBootstrap(bootstrap);
        return bootstrap.user;
      } finally {
        setReady(true);
      }
    }
    const nextUser = deriveDemoUser(email);
    setUser(nextUser);
    return nextUser;
  }, [applyLiveBootstrap]);

  const logout = useCallback(async () => {
    if (liveBackend) await signOutLivePortal();
    clearLiveState();
    if (!liveBackend) {
      setWeeks(weekDefinitions);
      setSubmissions(readStored(submissionKey, initialSubmissions));
      setOnboardingTasks(readStored(onboardingKey, initialOnboardingTasks));
      setSetupVideos(demoSetupVideos);
    }
  }, [clearLiveState]);

  const requestPasswordReset = useCallback(async (email: string) => {
    if (!email.trim()) throw new Error("Enter your email address first.");
    if (liveBackend) await requestLivePasswordReset(email);
  }, []);

  const setPassword = useCallback(async (password: string) => {
    if (password.length < 8) throw new Error("Use at least 8 characters.");
    if (!liveBackend) return;
    await setLivePortalPassword(password);
    await refresh();
  }, [refresh]);

  const toggleOnboardingTask = useCallback(async (id: string) => {
    const task = onboardingTasks.find((item) => item.id === id);
    if (!task) return;
    const complete = !task.complete;
    if (liveBackend) {
      if (!user?.enrollmentId) throw new Error("Your enrolment is not available.");
      await setLiveOnboardingTask(user.enrollmentId, id, complete);
    }
    setOnboardingTasks((current) => current.map((item) => item.id === id ? { ...item, complete } : item));
  }, [onboardingTasks, user?.enrollmentId]);

  const addFiles = useCallback(async (weekNumber: number, kind: FileKind, files: File[]) => {
    if (liveBackend) {
      if (!user) throw new Error("Sign in before uploading.");
      const week = weeks.find((item) => item.number === weekNumber);
      const submission = submissions.find((item) => item.weekNumber === weekNumber);
      if (!week || !submission) throw new Error("Submission not found.");
      await uploadLiveSubmissionFiles(user, week, submission, kind, files);
      await refresh();
      return;
    }
    setSubmissions((current) => current.map((submission) => {
      if (submission.weekNumber !== weekNumber) return submission;
      const uploaded = files.map((file) => makeDemoFile(file, kind));
      const next = { ...submission, state: "in_progress" as const };
      if (kind === "idea") next.ideas = [...submission.ideas, ...uploaded];
      if (kind === "song") next.song = uploaded[0];
      if (kind === "stems") next.stems = uploaded[0];
      return next;
    }));
  }, [refresh, submissions, user, weeks]);

  const removeFile = useCallback(async (weekNumber: number, kind: FileKind, fileId: string) => {
    const submission = submissions.find((item) => item.weekNumber === weekNumber);
    const file = kind === "idea"
      ? submission?.ideas.find((item) => item.id === fileId)
      : kind === "song" ? submission?.song : submission?.stems;
    if (!file) return;
    if (liveBackend) {
      await removeLiveSubmissionFile(file);
      await refresh();
      return;
    }
    setSubmissions((current) => current.map((item) => {
      if (item.weekNumber !== weekNumber) return item;
      if (kind === "idea") return { ...item, ideas: item.ideas.filter((candidate) => candidate.id !== fileId) };
      if (kind === "song" && item.song?.id === fileId) return { ...item, song: undefined };
      if (kind === "stems" && item.stems?.id === fileId) return { ...item, stems: undefined };
      return item;
    }));
  }, [refresh, submissions]);

  const submitWeek = useCallback(async (weekNumber: number): Promise<SubmitResult> => {
    const definition = weeks.find((week) => week.number === weekNumber);
    const submission = submissions.find((item) => item.weekNumber === weekNumber);
    if (!definition || !submission) return { ok: false, message: "Week not found." };

    const missing: string[] = [];
    if (submission.ideas.length < definition.requiredIdeas) {
      const count = definition.requiredIdeas - submission.ideas.length;
      missing.push(`${count} more idea${count === 1 ? "" : "s"}`);
    }
    if (definition.songRequired && !submission.song) missing.push("your selected song");
    if (definition.stemsRequired && !submission.stems) missing.push("your stems ZIP");
    if (missing.length) return { ok: false, message: `Add ${missing.join(", ")} before submitting.` };

    if (liveBackend) {
      if (!submission.id) return { ok: false, message: "Submission not found." };
      try {
        await submitLiveWeek(submission.id);
        await refresh();
      } catch (error) {
        return { ok: false, message: error instanceof Error ? error.message : "Unable to submit this week." };
      }
    } else {
      setSubmissions((current) => current.map((item) => item.weekNumber === weekNumber
        ? { ...item, state: "submitted", submittedAt: new Date().toISOString() }
        : item));
    }
    return { ok: true, message: `Week ${weekNumber} is submitted to Rob.` };
  }, [refresh, submissions, weeks]);

  const markFeedbackViewed = useCallback(async (weekNumber: number) => {
    const submission = submissions.find((item) => item.weekNumber === weekNumber);
    if (!submission?.feedback) return;
    if (liveBackend) await markLiveFeedbackViewed(submission.feedback.id);
    setSubmissions((current) => current.map((item) => item.weekNumber === weekNumber && item.feedback
      ? { ...item, feedback: { ...item.feedback, viewedAt: item.feedback.viewedAt ?? new Date().toISOString() } }
      : item));
  }, [submissions]);

  const confirmFeedbackAction = useCallback(async (weekNumber: number, nextAction: string) => {
    const submission = submissions.find((item) => item.weekNumber === weekNumber);
    if (!submission?.feedback) return;
    if (liveBackend) await confirmLiveFeedbackAction(submission.feedback.id, nextAction);
    setSubmissions((current) => current.map((item) => item.weekNumber === weekNumber && item.feedback
      ? {
          ...item,
          feedback: {
            ...item.feedback,
            viewedAt: item.feedback.viewedAt ?? new Date().toISOString(),
            actionConfirmedAt: new Date().toISOString(),
            studentNextAction: nextAction,
          },
        }
      : item));
  }, [submissions]);

  const value = useMemo<PortalStoreValue>(() => ({
    ready,
    backend,
    authError,
    user,
    weeks,
    submissions,
    onboardingTasks,
    setupVideos,
    welcomeVideoUrl,
    firstCall,
    circleUrl,
    login,
    logout,
    requestPasswordReset,
    setPassword,
    refresh,
    toggleOnboardingTask,
    addFiles,
    removeFile,
    submitWeek,
    markFeedbackViewed,
    confirmFeedbackAction,
  }), [
    ready, backend, authError, user, weeks, submissions, onboardingTasks, setupVideos, welcomeVideoUrl, firstCall, circleUrl,
    login, logout, requestPasswordReset, setPassword, refresh, toggleOnboardingTask, addFiles, removeFile,
    submitWeek, markFeedbackViewed, confirmFeedbackAction,
  ]);

  return <PortalStore.Provider value={value}>{children}</PortalStore.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePortalStore() {
  const context = useContext(PortalStore);
  if (!context) throw new Error("usePortalStore must be used inside PortalStoreProvider");
  return context;
}
