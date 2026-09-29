import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { demoAdmin, demoCoach, demoStudent, demoSetupVideos, weekDefinitions } from "./demoData";
import { demoOverview, demoReviewItems, emptyDemoSession, fileMetadata, hydrateDemoSession, readDemoSession, writeDemoSession, type DemoSession } from "./demoSession";
import type { AdminOverview, FileKind, OnboardingTask, PortalCall, PortalUser, ReviewItem, SetupVideo, WeekDefinition, WeekSubmission } from "./types";

interface FeedbackInput { writtenNotes: string; nextAction: string; videoUrl: string; audioFile?: File }
interface PortalStoreValue {
  ready: boolean; backend: "demo" | "supabase"; authError?: string; user: PortalUser | null;
  weeks: WeekDefinition[]; submissions: WeekSubmission[]; onboardingTasks: OnboardingTask[];
  setupVideos: SetupVideo[]; welcomeVideoUrl?: string; firstCall?: PortalCall; circleUrl?: string;
  adminOverview: AdminOverview; demoReviews: ReviewItem[];
  login: (email: string, password: string) => Promise<PortalUser>; logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>; setPassword: (password: string) => Promise<void>; refresh: () => Promise<void>;
  toggleOnboardingTask: (id: string) => Promise<void>;
  addFiles: (week: number, kind: FileKind, files: File[]) => Promise<void>;
  removeFile: (week: number, kind: FileKind, id: string) => Promise<void>;
  submitWeek: (week: number) => Promise<{ ok: boolean; message: string }>;
  markFeedbackViewed: (week: number) => Promise<void>;
  confirmFeedbackAction: (week: number, action: string) => Promise<void>;
  saveDemoFeedback: (reviewId: string, input: FeedbackInput, publish: boolean) => Promise<ReviewItem>;
  setDemoSurgery: (reviewId: string, selected: boolean) => Promise<void>;
  resetDemo: () => Promise<void>;
}
const PortalStore = createContext<PortalStoreValue | null>(null);
const sessionKey = "rla-mentorship-review-demo-session";
const storedUser = (): PortalUser | null => {
  try { return JSON.parse(localStorage.getItem(sessionKey) ?? "null"); } catch { return null; }
};

export function PortalStoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PortalUser | null>(storedUser);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [session, setSession] = useState<DemoSession>(emptyDemoSession);
  const current = useRef(session);
  const queue = useRef(Promise.resolve());
  const urls = useRef(new Map<string, string>());
  const apply = useCallback((next: DemoSession) => { current.current = next; setSession(hydrateDemoSession(next, urls.current)); }, []);

  useEffect(() => {
    let active = true;
    readDemoSession().then((saved) => { if (active) { apply(saved); setReady(true); } }).catch(() => {
      if (active) setError("This browser couldn't open the demo storage. Enable site storage, then try again.");
    });
    const objectUrls = urls.current;
    return () => { active = false; objectUrls.forEach((url) => URL.revokeObjectURL(url)); objectUrls.clear(); };
  }, [apply]);

  // Serialize changes and save before reporting success, including audio Blobs.
  const update = useCallback((change: (previous: DemoSession) => DemoSession) => {
    const task = queue.current.then(async () => {
      const next = change(current.current);
      await writeDemoSession(next);
      apply(next);
    });
    queue.current = task.catch(() => undefined);
    return task;
  }, [apply]);

  const login = useCallback(async (email: string, _password: string) => {
    const normalized = email.trim().toLowerCase();
    const next = normalized.startsWith("rob") ? demoCoach : normalized.startsWith("george") ? demoAdmin : demoStudent;
    localStorage.setItem(sessionKey, JSON.stringify(next)); setUser(next); return next;
  }, []);
  const logout = useCallback(async () => { localStorage.removeItem(sessionKey); setUser(null); }, []);
  const refresh = useCallback(async () => { await queue.current; apply(await readDemoSession()); }, [apply]);
  const toggleOnboardingTask = useCallback((id: string) => update((previous) => ({ ...previous, onboardingTasks: previous.onboardingTasks.map((task) => task.id === id ? { ...task, complete: !task.complete } : task) })), [update]);

  const addFiles = useCallback((week: number, kind: FileKind, files: File[]) => update((previous) => {
    const definition = weekDefinitions.find((item) => item.number === week);
    const submission = previous.submissions.find((item) => item.weekNumber === week);
    if (!definition || !submission || definition.phase === "upcoming" || ["submitted", "late"].includes(submission.state)) throw new Error("This week is not open for uploads.");
    if (!["idea", "song", "stems"].includes(kind)) throw new Error("Unsupported upload type.");
    if (kind !== "idea" && files.length > 1) throw new Error("Choose one file for your song or stems.");
    const blobs = { ...previous.files };
    const uploaded = files.map((file) => {
      if (!(kind === "stems" ? /\.zip$/i : /\.(mp3|wav)$/i).test(file.name)) throw new Error(kind === "stems" ? "Upload your stems as one ZIP file." : "Upload an MP3 or WAV file.");
      if (!file.size || file.size > 2 * 1024 ** 3) throw new Error("Choose a non-empty file under 2 GB.");
      const metadata = fileMetadata(file, kind); blobs[metadata.id] = file; return metadata;
    });
    if (!uploaded.length) return previous;
    const next = { ...submission, state: "in_progress" as const };
    if (kind === "idea") next.ideas = [...submission.ideas, ...uploaded];
    if (kind === "song") { if (next.song) delete blobs[next.song.id]; next.song = uploaded[0]; }
    if (kind === "stems") { if (next.stems) delete blobs[next.stems.id]; next.stems = uploaded[0]; }
    return { ...previous, files: blobs, submissions: previous.submissions.map((item) => item === submission ? next : item) };
  }), [update]);

  const removeFile = useCallback((week: number, kind: FileKind, id: string) => update((previous) => {
    const submission = previous.submissions.find((item) => item.weekNumber === week);
    if (!submission || ["submitted", "late"].includes(submission.state)) throw new Error("Submitted files are locked for review.");
    const files = { ...previous.files }; delete files[id];
    return { ...previous, files, submissions: previous.submissions.map((item) => item !== submission ? item : {
      ...item, ideas: kind === "idea" ? item.ideas.filter((file) => file.id !== id) : item.ideas,
      song: kind === "song" && item.song?.id === id ? undefined : item.song,
      stems: kind === "stems" && item.stems?.id === id ? undefined : item.stems,
    }) };
  }), [update]);

  const submitWeek = useCallback(async (week: number) => {
    try {
      await update((previous) => {
        const definition = weekDefinitions.find((item) => item.number === week);
        const submission = previous.submissions.find((item) => item.weekNumber === week);
        if (!definition || !submission || definition.phase === "upcoming") throw new Error("This week is not open for submissions.");
        if (["submitted", "late"].includes(submission.state)) throw new Error("This week has already been submitted.");
        if (submission.ideas.length < definition.requiredIdeas || (definition.songRequired && !submission.song) || (definition.stemsRequired && !submission.stems)) throw new Error("Add your loops, selected song and stems ZIP before submitting.");
        return { ...previous, submissions: previous.submissions.map((item) => item === submission ? { ...item, state: "submitted", submittedAt: new Date().toISOString() } : item) };
      });
      return { ok: true, message: `Week ${week} is submitted to Rob.` };
    } catch (reason) { return { ok: false, message: reason instanceof Error ? reason.message : "Unable to save this submission." }; }
  }, [update]);

  const saveDemoFeedback = useCallback(async (reviewId: string, input: FeedbackInput, publish: boolean) => {
    let savedWeek = 0;
    await update((previous) => {
      const review = demoReviewItems(previous).find((item) => item.id === reviewId);
      if (!review) throw new Error("This submission is no longer in the queue.");
      if (!publish && review.status === "published") throw new Error("Published feedback cannot be changed to a draft.");
      if (!input.writtenNotes.trim() && !input.audioFile && !review.feedback?.audioStoragePath && !input.videoUrl.trim()) throw new Error("Add written, audio or video feedback first.");
      if (publish && !input.nextAction.trim()) throw new Error("Add one clear next action before publishing.");
      if (input.videoUrl.trim() && !/^https?:\/\//i.test(input.videoUrl.trim())) throw new Error("Use a full https video link.");
      const files = { ...previous.files };
      let audioStoragePath = review.feedback?.audioStoragePath;
      let audioFileName = review.feedback?.audioFileName;
      if (input.audioFile) {
        if (!input.audioFile.size || input.audioFile.size > 2 * 1024 ** 3) throw new Error("Choose a non-empty voice note under 2 GB.");
        if (audioStoragePath) delete files[audioStoragePath];
        audioStoragePath = crypto.randomUUID(); audioFileName = input.audioFile.name; files[audioStoragePath] = input.audioFile;
      }
      savedWeek = review.weekNumber;
      const feedback = { id: `feedback-${review.id}`, status: publish ? "published" as const : "draft" as const, writtenNotes: input.writtenNotes, nextAction: input.nextAction, videoUrl: input.videoUrl.trim(), audioStoragePath, audioFileName };
      return { ...previous, files, feedback: { ...previous.feedback, [savedWeek]: feedback },
        submissions: previous.submissions.map((submission) => submission.weekNumber === savedWeek && publish ? { ...submission, feedback: { id: feedback.id, text: feedback.writtenNotes, nextAction: feedback.nextAction, videoUrl: feedback.videoUrl, audioName: audioFileName, publishedAt: new Date().toISOString() } } : submission),
      };
    });
    return demoReviewItems(hydrateDemoSession(current.current, urls.current)).find((review) => review.weekNumber === savedWeek)!;
  }, [update]);

  const setDemoSurgery = useCallback((reviewId: string, selected: boolean) => update((previous) => {
    const review = demoReviewItems(previous).find((item) => item.id === reviewId);
    if (!review?.stemsReady) throw new Error("Upload stems before shortlisting this song.");
    return { ...previous, surgeryWeeks: [...previous.surgeryWeeks.filter((week) => week !== review.weekNumber), ...(selected ? [review.weekNumber] : [])] };
  }), [update]);
  const markFeedbackViewed = useCallback((week: number) => update((previous) => ({ ...previous, submissions: previous.submissions.map((item) => item.weekNumber === week && item.feedback ? { ...item, feedback: { ...item.feedback, viewedAt: item.feedback.viewedAt ?? new Date().toISOString() } } : item) })), [update]);
  const confirmFeedbackAction = useCallback((week: number, action: string) => update((previous) => ({ ...previous, submissions: previous.submissions.map((item) => item.weekNumber === week && item.feedback ? { ...item, feedback: { ...item.feedback, viewedAt: item.feedback.viewedAt ?? new Date().toISOString(), actionConfirmedAt: new Date().toISOString(), studentNextAction: action } } : item) })), [update]);
  const resetDemo = useCallback(() => update(() => emptyDemoSession()), [update]);
  const value = useMemo<PortalStoreValue>(() => ({
    ready, backend: "demo", user, weeks: weekDefinitions, submissions: session.submissions, onboardingTasks: session.onboardingTasks, setupVideos: demoSetupVideos,
    adminOverview: demoOverview(session), demoReviews: demoReviewItems(session), login, logout, refresh,
    requestPasswordReset: async () => {}, setPassword: async () => {}, toggleOnboardingTask, addFiles, removeFile, submitWeek, markFeedbackViewed, confirmFeedbackAction, saveDemoFeedback, setDemoSurgery, resetDemo,
  }), [ready, user, session, login, logout, refresh, toggleOnboardingTask, addFiles, removeFile, submitWeek, markFeedbackViewed, confirmFeedbackAction, saveDemoFeedback, setDemoSurgery, resetDemo]);

  if (error) return <div role="alert" className="mentorship-portal grid min-h-screen place-items-center p-8"><div><p>{error}</p><button type="button" className="mt-4 rounded border border-white/20 px-4 py-2" onClick={() => window.location.reload()}>Try again</button></div></div>;
  return <PortalStore.Provider value={value}>{children}</PortalStore.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePortalStore() {
  const context = useContext(PortalStore);
  if (!context) throw new Error("usePortalStore must be used inside PortalStoreProvider");
  return context;
}
