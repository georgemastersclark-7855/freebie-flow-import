import { demoStudent, initialOnboardingTasks, weekDefinitions } from "./demoData";
import type { AdminOverview, OnboardingTask, PortalFile, ReviewFeedback, ReviewItem, WeekSubmission } from "./types";

export interface DemoSession {
  submissions: WeekSubmission[];
  feedback: Record<number, ReviewFeedback>;
  surgeryWeeks: number[];
  onboardingTasks: OnboardingTask[];
  files: Record<string, Blob>;
}

export function emptyDemoSession(): DemoSession {
  return {
    submissions: weekDefinitions.map((week) => ({ id: crypto.randomUUID(), weekNumber: week.number, state: "not_started", ideas: [] })),
    feedback: {}, surgeryWeeks: [], files: {},
    onboardingTasks: initialOnboardingTasks.map((task) => ({ ...task, complete: false })),
  };
}

export function demoReviewItems(session: DemoSession): ReviewItem[] {
  return session.submissions.filter((submission) => (submission.state === "submitted" || submission.state === "late") && submission.song).map((submission) => ({
    id: `review-${submission.id}`, submissionId: submission.id, studentId: demoStudent.id,
    studentName: "Jack Morris", studentEmail: demoStudent.email, cohortId: "interactive-demo",
    weekNumber: submission.weekNumber, songName: submission.song!.name,
    submittedLabel: submission.submittedAt ? new Date(submission.submittedAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "Just now",
    stemsReady: Boolean(submission.stems), ideaNames: submission.ideas.map((file) => file.name),
    status: session.feedback[submission.weekNumber]?.status ?? "awaiting",
    song: submission.song, stems: submission.stems, ideas: submission.ideas,
    feedback: session.feedback[submission.weekNumber], surgerySelected: session.surgeryWeeks.includes(submission.weekNumber),
  }));
}

export function demoOverview(session: DemoSession): AdminOverview {
  const week = weekDefinitions.find((item) => item.phase === "current")!;
  const submission = session.submissions.find((item) => item.weekNumber === week.number)!;
  const feedback = session.feedback[week.number];
  const hasWork = Boolean(submission.ideas.length || submission.song || submission.stems);
  return {
    cohortId: "interactive-demo", cohortName: "Cohort 2", currentWeek: week.number, deadlineLabel: week.deadlineLabel,
    reviews: demoReviewItems(session).filter((review) => review.weekNumber === week.number),
    students: [{ id: demoStudent.id, name: "Jack Morris", email: demoStudent.email, initials: "JM",
      ideasSubmitted: submission.ideas.length, ideasRequired: week.requiredIdeas,
      songSubmitted: Boolean(submission.song), stemsSubmitted: Boolean(submission.stems),
      attendance: 0, attendanceTotal: 0, surgeryCount: session.surgeryWeeks.length,
      feedbackState: submission.feedback?.actionConfirmedAt ? "actioned" : feedback?.status ?? "awaiting",
      status: hasWork ? "on_track" : "not_started",
      lastActivity: submission.feedback?.actionConfirmedAt ? "Feedback actioned" : submission.feedback?.viewedAt ? "Feedback viewed" : submission.submittedAt ? "Work submitted" : hasWork ? "Uploading this week's work" : "No uploads yet",
    }],
  };
}

export function fileMetadata(file: File, kind: PortalFile["kind"]): PortalFile {
  return { id: crypto.randomUUID(), name: file.name, size: file.size, kind, uploadedAt: new Date().toISOString() };
}

// One isolated browser database. No live accounts, storage buckets or emails.
const databaseName = "rla-mentorship-interactive-demo-v1";
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, 1);
    request.onupgradeneeded = () => request.result.createObjectStore("session");
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function readDemoSession(): Promise<DemoSession> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("session", "readonly");
    const request = transaction.objectStore("session").get("current");
    transaction.oncomplete = () => { db.close(); resolve(request.result ?? emptyDemoSession()); };
    transaction.onabort = () => { db.close(); reject(transaction.error); };
  });
}

export async function writeDemoSession(session: DemoSession): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("session", "readwrite");
    transaction.objectStore("session").put(session, "current");
    transaction.oncomplete = () => { db.close(); resolve(); };
    transaction.onabort = () => { db.close(); reject(new Error("Your browser couldn't save this demo. Free some storage or try a smaller file.")); };
  });
}

// Rebuild playable URLs from saved Blobs after refresh. Never persist Blob URLs.
export function hydrateDemoSession(session: DemoSession, urls: Map<string, string>): DemoSession {
  for (const [id, blob] of Object.entries(session.files)) {
    if (!urls.has(id)) urls.set(id, URL.createObjectURL(blob));
  }
  for (const [id, url] of urls) {
    if (!session.files[id]) { URL.revokeObjectURL(url); urls.delete(id); }
  }
  const hydrateFile = (file: PortalFile): PortalFile => ({ ...file, objectUrl: urls.get(file.id) });
  return {
    ...session,
    feedback: Object.fromEntries(Object.entries(session.feedback).map(([week, feedback]) => [week, { ...feedback, audioUrl: feedback.audioStoragePath ? urls.get(feedback.audioStoragePath) : undefined }])),
    submissions: session.submissions.map((submission) => ({ ...submission,
      ideas: submission.ideas.map(hydrateFile), song: submission.song ? hydrateFile(submission.song) : undefined,
      stems: submission.stems ? hydrateFile(submission.stems) : undefined,
      feedback: submission.feedback ? { ...submission.feedback, audioUrl: session.feedback[submission.weekNumber]?.audioStoragePath ? urls.get(session.feedback[submission.weekNumber].audioStoragePath!) : undefined } : undefined,
    })),
  };
}
