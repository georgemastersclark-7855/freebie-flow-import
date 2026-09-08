import type { OnboardingTask, PortalUser, WeekDefinition, WeekSubmission } from "./types";

export function submissionParts(week: WeekDefinition, submission: WeekSubmission) {
  const parts: Array<{ id: string; title: string; description: string; format: string; complete: boolean; status: string }> = [];
  if (week.requiredIdeas > 0) parts.push({
    id: "song-starters", title: "Song starter loops",
    description: `${week.requiredIdeas} short ideas. A groove, a chord idea or a hook.`,
    format: "MP3 or WAV", complete: submission.ideas.length >= week.requiredIdeas,
    status: submission.ideas.length >= week.requiredIdeas ? `${submission.ideas.length} loops added` : `${submission.ideas.length} of ${week.requiredIdeas} added`,
  });
  if (week.songRequired) parts.push({
    id: "weekly-song", title: songInstructions(week).title,
    description: week.number < 5 ? "Develop one loop from the intro through the end of the first chorus or drop." : "The latest full-track version of the song you selected in week 4.",
    format: "One MP3 or WAV", complete: Boolean(submission.song), status: submission.song ? "Added" : "Not added yet",
  });
  if (week.stemsRequired) parts.push({
    id: "stems", title: "Matching stems",
    description: "Export the separate audio parts from that same version of your song.",
    format: "One ZIP file", complete: Boolean(submission.stems), status: submission.stems ? "Added" : "Not added yet",
  });
  return parts;
}

export const portalHome = (user: PortalUser, tasks: OnboardingTask[]) => {
  if (user.role !== "student") return "/mentorship-demo/admin";
  return !tasks.length || tasks.some((task) => !task.complete)
    ? "/mentorship-demo/welcome"
    : "/mentorship-demo/submissions";
};

export const songInstructions = (week: WeekDefinition) => week.number >= 5
  ? { title: "Track progress", detail: "Build out and finish the track you selected in week 4. Upload your latest full-track progress and updated stems; no new idea is required.", uploadHelp: "MP3 or WAV. Your latest version of the same selected track." }
  : { title: "Weekly song", detail: "Choose one of your song starter loops and develop it into this week's song: a regular song structure from the intro through the end of the first chorus or drop.", uploadHelp: "MP3 or WAV. Intro through the end of the first chorus or drop." };

export const formatDeadline = (deadline?: string | null, timezone = "Europe/London") => {
  if (!deadline) return "Friday, time to be confirmed";
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit",
    timeZone: timezone, timeZoneName: "short",
  }).format(new Date(deadline));
};

export const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export const formatFileSize = (bytes: number) => {
  if (bytes < 1_000_000) return `${Math.max(1, Math.round(bytes / 1_000))} KB`;
  return `${(bytes / 1_000_000).toFixed(bytes > 100_000_000 ? 0 : 1)} MB`;
};
