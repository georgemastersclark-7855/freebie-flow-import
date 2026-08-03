export type PortalRole = "student" | "coach" | "admin";

export type WeekState =
  | "not_started"
  | "in_progress"
  | "ready"
  | "submitted"
  | "late";

export type FileKind = "idea" | "song" | "stems" | "feedback" | "baseline";

export interface PortalUser {
  id: string;
  name: string;
  email: string;
  role: PortalRole;
  cohortName: string;
  cohortId?: string;
  enrollmentId?: string;
}

export interface PortalFile {
  id: string;
  name: string;
  size: number;
  kind: FileKind;
  uploadedAt: string;
  objectUrl?: string;
  storagePath?: string;
}

export interface WeekDefinition {
  id?: string;
  number: number;
  title: string;
  shortTitle: string;
  brief: string;
  requiredIdeas: number;
  songRequired: boolean;
  stemsRequired: boolean;
  deadlineLabel: string;
  phase: "current" | "complete" | "upcoming";
}

export interface FeedbackRecord {
  id: string;
  text: string;
  nextAction: string;
  audioName?: string;
  audioUrl?: string;
  videoUrl?: string;
  publishedAt: string;
  viewedAt?: string;
  actionConfirmedAt?: string;
  studentNextAction?: string;
}

export interface WeekSubmission {
  id?: string;
  weekNumber: number;
  state: WeekState;
  ideas: PortalFile[];
  song?: PortalFile;
  stems?: PortalFile;
  submittedAt?: string;
  feedback?: FeedbackRecord;
}

export interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionUrl?: string;
  complete: boolean;
}

export interface SetupVideo {
  id: string;
  title: string;
  duration: string;
  description: string;
  url?: string;
}

export interface PortalCall {
  id: string;
  title: string;
  startsAt: string;
  displayTime: string;
  calendarUrl?: string;
  circleUrl?: string;
}

export interface AdminStudent {
  id: string;
  name: string;
  email: string;
  initials: string;
  ideasSubmitted: number;
  ideasRequired: number;
  songSubmitted: boolean;
  stemsSubmitted: boolean;
  attendance: number;
  attendanceTotal: number;
  surgeryCount: number;
  feedbackState: "awaiting" | "draft" | "published" | "actioned";
  status: "on_track" | "needs_attention" | "not_started";
  lastActivity: string;
}

export interface ReviewFeedback {
  id?: string;
  status: "awaiting" | "draft" | "published";
  writtenNotes: string;
  nextAction: string;
  audioStoragePath?: string;
  audioFileName?: string;
  audioUrl?: string;
  videoUrl?: string;
}

export interface ReviewItem {
  id: string;
  submissionId?: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  cohortId?: string;
  weekNumber: number;
  songName: string;
  submittedLabel: string;
  stemsReady: boolean;
  ideaNames: string[];
  status: "awaiting" | "draft" | "published";
  song?: PortalFile;
  stems?: PortalFile;
  ideas?: PortalFile[];
  feedback?: ReviewFeedback;
  surgerySelected?: boolean;
}

export interface AdminOverview {
  cohortId: string;
  cohortName: string;
  currentWeek: number;
  deadlineLabel: string;
  students: AdminStudent[];
  reviews: ReviewItem[];
}
