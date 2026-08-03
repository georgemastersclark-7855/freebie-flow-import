import type {
  AdminStudent,
  OnboardingTask,
  PortalUser,
  ReviewItem,
  SetupVideo,
  WeekDefinition,
  WeekSubmission,
} from "./types";

export const demoSetupVideos: SetupVideo[] = [
  { id: "sound-library", title: "Craft your sound library", duration: "7:34", description: "Build a trusted stash so every session starts with momentum." },
  { id: "session-template", title: "Build your session template", duration: "6:48", description: "Set up the workhorse project you will use for every weekly rep." },
  { id: "reference-playlist", title: "Curate your reference playlist", duration: "4:21", description: "Choose the references that keep your structure and decisions honest." },
  { id: "stems-workflow", title: "Export stems properly", duration: "8 min", description: "Prepare files Rob can open quickly if your track is selected for surgery." },
];

export const demoStudent: PortalUser = {
  id: "student-jack",
  name: "Jack",
  email: "jack@demo.com",
  role: "student",
  cohortName: "Cohort 2",
};

export const demoCoach: PortalUser = {
  id: "coach-rob",
  name: "Rob",
  email: "rob@demo.com",
  role: "coach",
  cohortName: "Cohort 2",
};

export const demoAdmin: PortalUser = {
  id: "admin-george",
  name: "George",
  email: "george@demo.com",
  role: "admin",
  cohortName: "Cohort 2",
};

export const weekDefinitions: WeekDefinition[] = [
  {
    number: 1,
    title: "Ideas into songs",
    shortTitle: "Ideas into songs",
    brief: "5 ideas, 1 selected song and its stems.",
    requiredIdeas: 5,
    songRequired: true,
    stemsRequired: true,
    deadlineLabel: "Friday, 6:00pm",
    phase: "complete",
  },
  {
    number: 2,
    title: "Structure",
    shortTitle: "Structure",
    brief: "3 ideas, 1 selected song and its stems.",
    requiredIdeas: 3,
    songRequired: true,
    stemsRequired: true,
    deadlineLabel: "Friday, 6:00pm",
    phase: "current",
  },
  {
    number: 3,
    title: "A-list projects",
    shortTitle: "A-list projects",
    brief: "3 ideas, 1 selected song and its stems.",
    requiredIdeas: 3,
    songRequired: true,
    stemsRequired: true,
    deadlineLabel: "Friday, 6:00pm",
    phase: "upcoming",
  },
  {
    number: 4,
    title: "Sound selection",
    shortTitle: "Sound selection",
    brief: "3 ideas, 1 selected song and flag your strongest song so far.",
    requiredIdeas: 3,
    songRequired: true,
    stemsRequired: true,
    deadlineLabel: "Friday, 6:00pm",
    phase: "upcoming",
  },
  {
    number: 5,
    title: "The build-out",
    shortTitle: "Build-out",
    brief: "Build out the song selected in Week 4.",
    requiredIdeas: 0,
    songRequired: true,
    stemsRequired: true,
    deadlineLabel: "Friday, 6:00pm",
    phase: "upcoming",
  },
  {
    number: 6,
    title: "Finish and ship",
    shortTitle: "Finish",
    brief: "Finish and box off the selected track.",
    requiredIdeas: 0,
    songRequired: true,
    stemsRequired: true,
    deadlineLabel: "Friday, 6:00pm",
    phase: "upcoming",
  },
];

const iso = (day: number, hour = 15) =>
  new Date(2026, 7, day, hour, 0, 0).toISOString();

export const initialSubmissions: WeekSubmission[] = [
  {
    weekNumber: 1,
    state: "submitted",
    ideas: [
      { id: "w1-i1", name: "01 Piano hook.mp3", size: 8_300_000, kind: "idea", uploadedAt: iso(7, 11) },
      { id: "w1-i2", name: "02 Vocal chop.mp3", size: 10_100_000, kind: "idea", uploadedAt: iso(7, 12) },
      { id: "w1-i3", name: "03 Dark arp.mp3", size: 7_600_000, kind: "idea", uploadedAt: iso(7, 13) },
      { id: "w1-i4", name: "04 Guitar loop.mp3", size: 12_800_000, kind: "idea", uploadedAt: iso(7, 14) },
      { id: "w1-i5", name: "05 Midnight bass.mp3", size: 9_900_000, kind: "idea", uploadedAt: iso(7, 15) },
    ],
    song: { id: "w1-song", name: "Midnight Signal v3.wav", size: 82_400_000, kind: "song", uploadedAt: iso(7, 16) },
    stems: { id: "w1-stems", name: "Midnight Signal stems.zip", size: 684_000_000, kind: "stems", uploadedAt: iso(7, 16) },
    submittedAt: iso(7, 16),
    feedback: {
      id: "feedback-w1",
      text: "The hook is working and the sound palette feels coherent. The eight bars before the chorus repeat the same information, so you can get there sooner without losing any tension.",
      nextAction: "Remove four bars before the chorus and rebuild the transition using movement in the existing vocal chop.",
      audioName: "Rob feedback - Week 1.m4a",
      publishedAt: iso(9, 10),
    },
  },
  {
    weekNumber: 2,
    state: "in_progress",
    ideas: [
      { id: "w2-i1", name: "01 Glass keys.mp3", size: 9_100_000, kind: "idea", uploadedAt: iso(11, 14) },
      { id: "w2-i2", name: "02 Summer vocal.mp3", size: 11_800_000, kind: "idea", uploadedAt: iso(12, 10) },
    ],
  },
  ...[3, 4, 5, 6].map<WeekSubmission>((weekNumber) => ({
    weekNumber,
    state: "not_started",
    ideas: [],
  })),
];

export const initialOnboardingTasks: OnboardingTask[] = [
  {
    id: "book-call",
    title: "Book your onboarding call with Rob",
    description: "Choose a time, then bring your best existing track and the goal you submitted with your application.",
    actionLabel: "Book your call",
    complete: true,
  },
  {
    id: "prework",
    title: "Complete the four setup videos",
    description: "Build the sound library, session template, reference playlist and stems workflow you will use every week.",
    actionLabel: "Continue watching",
    actionUrl: "#setup-videos",
    complete: false,
  },
  {
    id: "circle",
    title: "Join the private Circle space",
    description: "Calls, announcements and conversation with Rob live there throughout the six weeks.",
    actionLabel: "Open Circle",
    complete: true,
  },
  {
    id: "first-call",
    title: "Put the first live call in your calendar",
    description: "Sunday at 6:00pm UK time. Come live and be ready to work.",
    actionLabel: "Add to calendar",
    complete: false,
  },
];

export const adminStudents: AdminStudent[] = [
  { id: "student-jack", name: "Jack Morris", email: "jack@demo.com", initials: "JM", ideasSubmitted: 2, ideasRequired: 3, songSubmitted: false, stemsSubmitted: false, attendance: 2, attendanceTotal: 2, surgeryCount: 0, feedbackState: "actioned", status: "on_track", lastActivity: "2 hours ago" },
  { id: "student-maya", name: "Maya Chen", email: "maya@example.com", initials: "MC", ideasSubmitted: 3, ideasRequired: 3, songSubmitted: true, stemsSubmitted: true, attendance: 2, attendanceTotal: 2, surgeryCount: 1, feedbackState: "awaiting", status: "on_track", lastActivity: "34 minutes ago" },
  { id: "student-theo", name: "Theo Brooks", email: "theo@example.com", initials: "TB", ideasSubmitted: 3, ideasRequired: 3, songSubmitted: true, stemsSubmitted: false, attendance: 1, attendanceTotal: 2, surgeryCount: 0, feedbackState: "awaiting", status: "needs_attention", lastActivity: "Yesterday" },
  { id: "student-ella", name: "Ella Rhodes", email: "ella@example.com", initials: "ER", ideasSubmitted: 1, ideasRequired: 3, songSubmitted: false, stemsSubmitted: false, attendance: 2, attendanceTotal: 2, surgeryCount: 0, feedbackState: "published", status: "needs_attention", lastActivity: "2 days ago" },
  { id: "student-nico", name: "Nico Hayes", email: "nico@example.com", initials: "NH", ideasSubmitted: 3, ideasRequired: 3, songSubmitted: true, stemsSubmitted: true, attendance: 2, attendanceTotal: 2, surgeryCount: 0, feedbackState: "draft", status: "on_track", lastActivity: "3 hours ago" },
  { id: "student-sam", name: "Sam Walker", email: "sam@example.com", initials: "SW", ideasSubmitted: 0, ideasRequired: 3, songSubmitted: false, stemsSubmitted: false, attendance: 1, attendanceTotal: 2, surgeryCount: 1, feedbackState: "actioned", status: "not_started", lastActivity: "5 days ago" },
  { id: "student-lena", name: "Lena Cole", email: "lena@example.com", initials: "LC", ideasSubmitted: 2, ideasRequired: 3, songSubmitted: true, stemsSubmitted: true, attendance: 2, attendanceTotal: 2, surgeryCount: 0, feedbackState: "awaiting", status: "on_track", lastActivity: "1 hour ago" },
  { id: "student-omar", name: "Omar Price", email: "omar@example.com", initials: "OP", ideasSubmitted: 3, ideasRequired: 3, songSubmitted: true, stemsSubmitted: true, attendance: 2, attendanceTotal: 2, surgeryCount: 0, feedbackState: "published", status: "on_track", lastActivity: "4 hours ago" },
  { id: "student-ivy", name: "Ivy Mason", email: "ivy@example.com", initials: "IM", ideasSubmitted: 1, ideasRequired: 3, songSubmitted: false, stemsSubmitted: false, attendance: 2, attendanceTotal: 2, surgeryCount: 0, feedbackState: "awaiting", status: "needs_attention", lastActivity: "Yesterday" },
  { id: "student-finn", name: "Finn Doyle", email: "finn@example.com", initials: "FD", ideasSubmitted: 3, ideasRequired: 3, songSubmitted: true, stemsSubmitted: true, attendance: 2, attendanceTotal: 2, surgeryCount: 0, feedbackState: "actioned", status: "on_track", lastActivity: "20 minutes ago" },
];

export const reviewItems: ReviewItem[] = [
  { id: "review-maya-w2", studentId: "student-maya", studentName: "Maya Chen", weekNumber: 2, songName: "Stay Close v4.wav", submittedLabel: "Today, 3:42pm", stemsReady: true, ideaNames: ["Air guitar.mp3", "Stay Close idea.mp3", "Reverse vocal.mp3"], status: "awaiting" },
  { id: "review-theo-w2", studentId: "student-theo", studentName: "Theo Brooks", weekNumber: 2, songName: "After Hours 120bpm.wav", submittedLabel: "Yesterday, 8:14pm", stemsReady: false, ideaNames: ["Bell loop.mp3", "After Hours idea.mp3", "Low vocal.mp3"], status: "awaiting" },
  { id: "review-nico-w2", studentId: "student-nico", studentName: "Nico Hayes", weekNumber: 2, songName: "Slow Burn intro-drop.wav", submittedLabel: "Today, 11:06am", stemsReady: true, ideaNames: ["Slow Burn.mp3", "Muted piano.mp3", "Perc idea.mp3"], status: "draft" },
];
