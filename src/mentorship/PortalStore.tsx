import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePortalClock } from "./usePortalClock";
import { nextScheduledCall } from "./schedule";
import type { EmailOtpType, User } from "@supabase/supabase-js";
import { isAuthSessionMissingError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import {
  demoAuthError,
  MIN_PASSWORD_LENGTH,
  normalizeEmail,
  purposeForLink,
  readPasswordStep,
  writePasswordStep,
  type CodeChannel,
  type PasswordPurpose,
} from "./auth";
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
  hasLiveSession,
  loadLivePortal,
  PortalAccessError,
  markLiveFeedbackViewed,
  removeLiveSubmissionFile,
  resetLiveWalkthrough,
  requestLivePasswordReset,
  sendLiveSetupCode,
  setLiveOnboardingTask,
  signInLivePortal,
  signOutLivePortal,
  setLivePortalPassword,
  submitLiveWeek,
  uploadLiveSubmissionFiles,
  verifyLiveEmailCode,
  verifyLiveEmailLink,
  type LivePortalBootstrap,
} from "./livePortalApi";
import { normalizeStudentProfileInput, saveLiveStudentProfile } from "./studentProfileApi";
import type {
  StudentProfileInput,
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

/** Signed in, but the portal can't open: no place found, or it failed to load. */
export interface PortalAccessIssue {
  kind: "no-enrolment" | "load-failed";
  email?: string;
}

export type SignOutScope = "local" | "global";

interface PortalStoreValue {
  ready: boolean;
  backend: "demo" | "supabase";
  accessIssue?: PortalAccessIssue;
  user: PortalUser | null;
  /** Set for coaches and admins, including while they preview the student portal. */
  staffUser?: PortalUser;
  selectView: (view: "student" | "staff") => Promise<void>;
  resetTestUploads: () => Promise<void>;
  saveProfile: (input: StudentProfileInput, photo?: File) => Promise<void>;
  weeks: WeekDefinition[];
  submissions: WeekSubmission[];
  onboardingTasks: OnboardingTask[];
  setupVideos: SetupVideo[];
  welcomeVideoUrl?: string;
  firstCall?: PortalCall;
  nextCall?: PortalCall;
  calls: PortalCall[];
  circleUrl?: string;
  login: (email: string, password: string) => Promise<void>;
  /** Emails a 6-digit code to set up or reset a login. Resolves with how it was sent. */
  sendEmailCode: (email: string, purpose: PasswordPurpose) => Promise<CodeChannel>;
  /** Checks the code, signs in, and queues the choose-a-password screen. */
  verifyEmailCode: (email: string, code: string, channel: CodeChannel, purpose: PasswordPurpose) => Promise<void>;
  verifyEmailLink: (tokenHash: string, type: EmailOtpType) => Promise<void>;
  /** Set after a code or link signs someone in, until they've chosen a password. */
  passwordStep?: PasswordPurpose;
  queuePasswordStep: (purpose: PasswordPurpose) => void;
  finishPasswordStep: () => void;
  hasAuthSession: () => Promise<boolean>;
  logout: (scope?: SignOutScope) => Promise<void>;
  retryAccess: () => Promise<void>;
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
// A published build must never fall back to demo authentication.
const liveBackend = !import.meta.env.DEV || import.meta.env.VITE_MENTORSHIP_BACKEND !== "demo";
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

const viewKey = "rla-portal-view";
const readStoredView = (): "student" | "staff" => {
  try { return window.sessionStorage.getItem(viewKey) === "student" ? "student" : "staff"; } catch { return "staff"; }
};
const writeStoredView = (view: "student" | "staff") => {
  try {
    if (view === "student") window.sessionStorage.setItem(viewKey, view);
    else window.sessionStorage.removeItem(viewKey);
  } catch { /* storage unavailable */ }
};

// Demo emails: rob... opens the staff dashboard as a coach, george... as admin,
// nobody... shows the "no place found" screen, anything else is a student.
const deriveDemoUser = (email: string): PortalUser | null => {
  const normalized = normalizeEmail(email);
  if (normalized.startsWith("nobody")) return null;
  if (normalized.startsWith("rob")) return { ...demoCoach, email: normalized };
  if (normalized.startsWith("george")) return { ...demoAdmin, email: normalized };
  return { ...demoStudent, email: normalized || demoStudent.email };
};
const demoPreviewStudent = (): PortalUser => ({ ...demoStudent, id: "walkthrough-student", name: "Test Student" });

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
  // Only a view preference is stored locally. Files and feedback always use Supabase.
  const selectedView = useRef<"student" | "staff">(readStoredView());
  const [demoStored] = useState(() => liveBackend ? null : readStored<PortalUser | null>(sessionKey, null));
  const [staffUser, setStaffUser] = useState<PortalUser | undefined>(() =>
    demoStored && demoStored.role !== "student" ? demoStored : undefined,
  );
  const [user, setUser] = useState<PortalUser | null>(() =>
    demoStored && demoStored.role !== "student" && selectedView.current === "student" ? demoPreviewStudent() : demoStored,
  );
  const [weeks, setWeeks] = useState<WeekDefinition[]>(() => liveBackend ? [] : weekDefinitions);
  const [submissions, setSubmissions] = useState<WeekSubmission[]>(() =>
    liveBackend ? [] : readStored(submissionKey, initialSubmissions),
  );
  const [onboardingTasks, setOnboardingTasks] = useState<OnboardingTask[]>(() =>
    liveBackend ? [] : readStored(onboardingKey, initialOnboardingTasks),
  );
  const [circleUrl, setCircleUrl] = useState<string | undefined>();
  const [accessIssue, setAccessIssue] = useState<PortalAccessIssue | undefined>();
  const [passwordStep, setPasswordStepState] = useState<PasswordPurpose | undefined>(() => readPasswordStep());
  const setPasswordStep = useCallback((step?: PasswordPurpose) => {
    writePasswordStep(step);
    setPasswordStepState(step);
  }, []);
  const [setupVideos, setSetupVideos] = useState<SetupVideo[]>(() => liveBackend ? [] : demoSetupVideos);
  const [welcomeVideoUrl, setWelcomeVideoUrl] = useState<string | undefined>();
  const [calls, setCalls] = useState<PortalCall[]>([]);
  const scheduleNow = usePortalClock();
  const nextCall = useMemo(() => nextScheduledCall(calls, scheduleNow), [calls, scheduleNow]);
  const [firstCall, setFirstCall] = useState<PortalCall | undefined>();

  const applyLiveBootstrap = useCallback((bootstrap: LivePortalBootstrap) => {
    setUser(bootstrap.user);
    setStaffUser(bootstrap.staffUser);
    setWeeks(bootstrap.weeks);
    setSubmissions(bootstrap.submissions);
    setOnboardingTasks(bootstrap.onboardingTasks);
    setSetupVideos(bootstrap.setupVideos);
    setWelcomeVideoUrl(bootstrap.welcomeVideoUrl);
    setFirstCall(bootstrap.firstCall);
    setCalls(bootstrap.calls ?? []);
    setCircleUrl(bootstrap.circleUrl);
    setAccessIssue(undefined);
  }, []);

  const clearLiveState = useCallback(() => {
    setUser(null);
    setStaffUser(undefined);
    setWeeks([]);
    setSubmissions([]);
    setOnboardingTasks([]);
    setSetupVideos([]);
    setWelcomeVideoUrl(undefined);
    setFirstCall(undefined);
    setCalls([]);
    setCircleUrl(undefined);
  }, []);

  // Every sign-in, sign-out and tab change goes through one load path. A sequence
  // number drops results that arrive after the session has moved on.
  const loadSeq = useRef(0);
  const sessionUserId = useRef<string | null>(null);
  const currentLoad = useRef<Promise<boolean> | null>(null);

  const resetSession = useCallback(() => {
    loadSeq.current += 1;
    sessionUserId.current = null;
    currentLoad.current = null;
    selectedView.current = "staff";
    writeStoredView("staff");
    clearLiveState();
    setAccessIssue(undefined);
    setPasswordStep(undefined);
  }, [clearLiveState, setPasswordStep]);

  /** Resolves true when the portal opened, false when it found a problem. */
  const loadSession = useCallback((authUser: User): Promise<boolean> => {
    const seq = ++loadSeq.current;
    sessionUserId.current = authUser.id;
    const run = (async () => {
      try {
        let bootstrap: LivePortalBootstrap;
        try {
          bootstrap = await loadLivePortal(authUser, selectedView.current === "student");
        } catch (error) {
          if (selectedView.current !== "student") throw error;
          // A staff preview that can't open falls back to the staff dashboard.
          selectedView.current = "staff";
          writeStoredView("staff");
          bootstrap = await loadLivePortal(authUser, false);
        }
        if (seq === loadSeq.current) applyLiveBootstrap(bootstrap);
        return true;
      } catch (error) {
        if (seq !== loadSeq.current) return false;
        clearLiveState();
        setAccessIssue({
          kind: error instanceof PortalAccessError ? "no-enrolment" : "load-failed",
          email: authUser.email ?? undefined,
        });
        return false;
      }
    })();
    currentLoad.current = run;
    return run;
  }, [applyLiveBootstrap, clearLiveState]);

  const ensureLoaded = useCallback((authUser: User) => (
    sessionUserId.current === authUser.id && currentLoad.current ? currentLoad.current : loadSession(authUser)
  ), [loadSession]);

  const refresh = useCallback(async () => {
    if (!liveBackend) return;
    const seq = loadSeq.current;
    const { data, error } = await supabase.auth.getUser();
    if (!data.user) {
      // Only a missing or rejected session signs the student out; a dropped
      // connection keeps them where they are.
      const signedOut = !error || isAuthSessionMissingError(error) || [401, 403].includes(Number((error as { status?: number }).status));
      if (signedOut && seq === loadSeq.current) resetSession();
      if (!signedOut) throw error;
      return;
    }
    const bootstrap = await loadLivePortal(data.user, selectedView.current === "student");
    if (seq !== loadSeq.current || sessionUserId.current !== data.user.id) return;
    applyLiveBootstrap(bootstrap);
  }, [applyLiveBootstrap, resetSession]);

  useEffect(() => {
    if (!liveBackend) return;
    let active = true;
    // Every tab hears sign-ins and sign-outs, including those made in another tab.
    // Supabase callbacks must not await auth calls directly, so work is deferred.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      window.setTimeout(() => {
        if (!active) return;
        if (event === "INITIAL_SESSION") {
          const restore = session?.user ? ensureLoaded(session.user) : Promise.resolve(false);
          void restore.finally(() => { if (active) setReady(true); });
        } else if ((event === "SIGNED_IN" || event === "PASSWORD_RECOVERY") && session?.user) {
          if (session.user.id !== sessionUserId.current) void ensureLoaded(session.user);
        } else if (event === "SIGNED_OUT") {
          resetSession();
        }
      }, 0);
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [ensureLoaded, resetSession]);

  useEffect(() => {
    if (!liveBackend || !user?.id) return;
    // Refresh at the next scheduled release, without restarting audio each minute.
    const nextRelease = weeks.filter((week) => week.phase === "upcoming" && week.opensAt)
      .map((week) => Date.parse(week.opensAt!)).filter((time) => time > Date.now()).sort((a, b) => a - b)[0];
    const timer = nextRelease ? window.setTimeout(() => { void refresh().catch(() => undefined); }, Math.min(nextRelease - Date.now() + 1000, 2_147_000_000)) : undefined;
    const onFocus = () => {
      const playing = Array.from(document.querySelectorAll("audio, video")).some((node) => !(node as HTMLMediaElement).paused);
      if (!playing) void refresh().catch(() => undefined);
    };
    window.addEventListener("focus", onFocus);
    return () => { window.clearTimeout(timer); window.removeEventListener("focus", onFocus); };
  }, [refresh, user?.id, weeks]);

  useEffect(() => {
    if (liveBackend) return;
    const signedIn = staffUser ?? user;
    if (signedIn) window.localStorage.setItem(sessionKey, JSON.stringify(signedIn));
    else window.localStorage.removeItem(sessionKey);
  }, [staffUser, user]);

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

  const selectView = useCallback(async (view: "student" | "staff") => {
    if (!liveBackend) {
      if (!staffUser) throw new Error("Staff access required.");
      selectedView.current = view;
      writeStoredView(view);
      setUser(view === "student" ? demoPreviewStudent() : staffUser);
      return;
    }
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw new Error("Sign in before choosing a view.");
    const bootstrap = await loadLivePortal(data.user, view === "student");
    if (!bootstrap.staffUser) throw new Error("Staff access required.");
    loadSeq.current += 1;
    sessionUserId.current = data.user.id;
    selectedView.current = view;
    writeStoredView(view);
    applyLiveBootstrap(bootstrap);
  }, [applyLiveBootstrap, staffUser]);

  const saveProfile = useCallback(async (input: StudentProfileInput, photo?: File) => {
    if (!user || user.role !== "student") throw new Error("Open your student account before editing your profile.");
    if (liveBackend) {
      if (!user.enrollmentId) throw new Error("Your enrolment is not available. Please sign in again.");
      const profile = await saveLiveStudentProfile(user.enrollmentId, input, photo);
      setUser((current) => current?.enrollmentId === user.enrollmentId ? { ...current, profile, name: profile.displayName } : current);
      return;
    }
    const { displayName, artistName, instagram, musicUrl, daw } = normalizeStudentProfileInput(input);
    const photoUrl = photo ? await new Promise<string>((resolve, reject) => {
      const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error("Unable to save photo.")); reader.readAsDataURL(photo);
    }) : user.profile?.photoUrl;
    if (!photoUrl) throw new Error("Add a profile photo to continue.");
    setUser({ ...user, name: displayName, profile: { displayName, artistName, instagram, musicUrl, daw, photoUrl, photoPath: "local-preview", completedAt: user.profile?.completedAt ?? new Date().toISOString() } });
  }, [user]);

  const resetTestUploads = useCallback(async () => {
    await resetLiveWalkthrough();
    await refresh();
  }, [refresh]);

  const demoSignIn = useCallback((email: string, step?: PasswordPurpose) => {
    const nextUser = deriveDemoUser(email);
    selectedView.current = "staff";
    writeStoredView("staff");
    if (!nextUser) {
      setPasswordStep(undefined);
      setUser(null);
      setStaffUser(undefined);
      setAccessIssue({ kind: "no-enrolment", email: normalizeEmail(email) });
      return;
    }
    setPasswordStep(step);
    setAccessIssue(undefined);
    setStaffUser(nextUser.role === "student" ? undefined : nextUser);
    setUser(nextUser);
  }, [setPasswordStep]);

  // Each sign-in waits until the portal has loaded (or found a problem), so the
  // page that asked can keep its button busy until there's somewhere to go. A
  // code or link sign-in queues the password screen first, so nothing routes
  // past it while the portal loads.
  const completeSignIn = useCallback(async (authUser: User, step?: PasswordPurpose) => {
    selectedView.current = "staff";
    writeStoredView("staff");
    setPasswordStep(step);
    const opened = await loadSession(authUser);
    if (!opened) setPasswordStep(undefined);
  }, [loadSession, setPasswordStep]);

  const login = useCallback(async (email: string, password: string) => {
    if (!email.trim() || !password) throw new Error("Enter your email and password.");
    if (liveBackend) {
      await completeSignIn(await signInLivePortal(email, password));
      return;
    }
    demoSignIn(email);
  }, [completeSignIn, demoSignIn]);

  const sendEmailCode = useCallback(async (email: string, purpose: PasswordPurpose): Promise<CodeChannel> => {
    if (liveBackend) {
      if (purpose === "setup") return sendLiveSetupCode(email);
      await requestLivePasswordReset(email);
      return "recovery";
    }
    await new Promise((resolve) => window.setTimeout(resolve, 450));
    return purpose === "setup" ? "email" : "recovery";
  }, []);

  const verifyEmailCode = useCallback(async (email: string, code: string, channel: CodeChannel, purpose: PasswordPurpose) => {
    if (liveBackend) {
      await completeSignIn(await verifyLiveEmailCode(email, code, channel), purpose);
      return;
    }
    await new Promise((resolve) => window.setTimeout(resolve, 450));
    if (code === "000000") throw demoAuthError("otp_expired", "Token has expired or is invalid", 403);
    demoSignIn(email, purpose);
  }, [completeSignIn, demoSignIn]);

  const verifyEmailLink = useCallback(async (tokenHash: string, type: EmailOtpType) => {
    if (liveBackend) {
      await completeSignIn(await verifyLiveEmailLink(tokenHash, type), purposeForLink(type));
      return;
    }
    await new Promise((resolve) => window.setTimeout(resolve, 450));
    if (tokenHash === "expired") throw demoAuthError("otp_expired", "Email link is invalid or has expired", 403);
    demoSignIn(demoStudent.email, purposeForLink(type));
  }, [completeSignIn, demoSignIn]);

  const queuePasswordStep = useCallback((purpose: PasswordPurpose) => setPasswordStep(purpose), [setPasswordStep]);
  const finishPasswordStep = useCallback(() => setPasswordStep(undefined), [setPasswordStep]);

  const hasAuthSession = useCallback(async () => liveBackend ? hasLiveSession() : Boolean(user), [user]);

  const retryAccess = useCallback(async () => {
    if (!liveBackend) return;
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) { await loadSession(data.session.user); }
    else resetSession();
  }, [loadSession, resetSession]);

  const logout = useCallback(async (scope: SignOutScope = "local") => {
    if (liveBackend) await signOutLivePortal(scope);
    resetSession();
    if (!liveBackend) {
      setStaffUser(undefined);
      setWeeks(weekDefinitions);
      setSubmissions(readStored(submissionKey, initialSubmissions));
      setOnboardingTasks(readStored(onboardingKey, initialOnboardingTasks));
      setSetupVideos(demoSetupVideos);
    }
  }, [resetSession]);

  const requestPasswordReset = useCallback(async (email: string) => {
    if (!email.trim()) throw new Error("Enter your email address first.");
    if (liveBackend) await requestLivePasswordReset(email);
    else await new Promise((resolve) => window.setTimeout(resolve, 450));
  }, []);

  const setPassword = useCallback(async (password: string) => {
    // Supabase checks its own minimum too; this keeps the message friendly.
    if (password.length < MIN_PASSWORD_LENGTH) throw new Error(`Use at least ${MIN_PASSWORD_LENGTH} characters.`);
    if (!liveBackend) return;
    await setLivePortalPassword(password);
  }, []);

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
    const definition = weeks.find((week) => week.number === weekNumber);
    const current = submissions.find((submission) => submission.weekNumber === weekNumber);
    if (!definition || !current || definition.phase === "upcoming" || current.state === "submitted" || current.state === "late") throw new Error("This week is not open for uploads.");
    if (!files.length) return;
    if (kind !== "idea" && files.length > 1) throw new Error("Upload one file at a time for your song or stems.");
    for (const file of files) {
      const supported = kind === "stems" ? /\.zip$/i.test(file.name) : /\.(mp3|wav)$/i.test(file.name);
      if (!supported) throw new Error(kind === "stems" ? "Upload your stems as one ZIP file." : "Upload your audio as an MP3 or WAV file.");
      if (!file.size) throw new Error(`${file.name} is empty. Export the file again before uploading.`);
      if (file.size > 2 * 1024 * 1024 * 1024) throw new Error(`${file.name} is larger than the 2 GB upload limit.`);
    }
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

    if (definition.phase === "upcoming") return { ok: false, message: "This week has not opened yet." };
    if (submission.state === "submitted" || submission.state === "late") return { ok: false, message: "This week has already been submitted." };
    const missing: string[] = [];
    if (submission.ideas.length < definition.requiredIdeas) {
      const count = definition.requiredIdeas - submission.ideas.length;
      missing.push(`${count} more song starter loop${count === 1 ? "" : "s"}`);
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
    accessIssue,
    user,
    staffUser,
    selectView,
    resetTestUploads,
    saveProfile,
    weeks,
    submissions,
    onboardingTasks,
    setupVideos,
    welcomeVideoUrl,
    firstCall,
    nextCall,
    calls,
    circleUrl,
    login,
    sendEmailCode,
    verifyEmailCode,
    verifyEmailLink,
    passwordStep,
    queuePasswordStep,
    finishPasswordStep,
    hasAuthSession,
    logout,
    retryAccess,
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
    ready, backend, accessIssue, user, staffUser, selectView, resetTestUploads, saveProfile, weeks, submissions, onboardingTasks, setupVideos, welcomeVideoUrl, firstCall, nextCall, calls, circleUrl,
    login, sendEmailCode, verifyEmailCode, verifyEmailLink, passwordStep, queuePasswordStep, finishPasswordStep, hasAuthSession, logout, retryAccess, requestPasswordReset, setPassword, refresh, toggleOnboardingTask, addFiles, removeFile,
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
