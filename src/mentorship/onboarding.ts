import type { OnboardingTask, SetupVideo } from "./types";

// Verified against Rob's paid-student welcome emails and the live event page.
// A cohort-specific URL in the database takes precedence over this default.
export const mentorshipBookingUrl = "https://calendly.com/roblate/onboarding";

export const studioSetupIntroduction = "I want everyone ready to work together from the same professional starting point. These four lessons cover your sound library, session template, references and stems workflow. If you've already got these dialled in, check your setup against mine and fill any gaps. Keep what's working for you. If this is new to you, I'll walk you through it step by step.";

export const setupVideoOutline: SetupVideo[] = [
  { id: "sound-library", key: "sound-library", title: "Craft your sound library", duration: "", description: "Build a collection of sounds you can reach for straight away." },
  { id: "session-template", key: "session-template", title: "Build your session template", duration: "", description: "Get your project ready so you can open your DAW and start writing." },
  { id: "reference-playlist", key: "reference-playlist", title: "Curate your reference playlist", duration: "", description: "Choose the tracks that will guide your sound and production decisions." },
  { id: "stems-workflow", key: "stems-workflow", title: "Export stems properly", duration: "", description: "Get your weekly song ready for Rob to open in a live session." },
];

// Keep the expected setup visible even when a recording is still being prepared.
export const completeSetupOutline = (videos: SetupVideo[]) => [
  ...setupVideoOutline.map((outline) => videos.find((video) => (video.key ?? video.id) === outline.key) ?? outline),
  ...videos.filter((video) => !setupVideoOutline.some((outline) => outline.key === (video.key ?? video.id))),
];

export const onboardingTaskCopy = (task: OnboardingTask): OnboardingTask => {
  switch (task.key ?? task.id) {
    case "book-call":
      return { ...task, title: "Book your 1:1 with Rob", description: "Already working on a track? Bring it to our onboarding call. Send me the section you want help with and tell me where you're getting stuck. We'll listen together and work out what you should focus on.", actionLabel: "Book my onboarding", actionUrl: task.actionUrl?.trim() || mentorshipBookingUrl };
    case "prework":
      return { ...task, title: "Check your setup before we start", description: studioSetupIntroduction, actionLabel: "Open Studio Setup", actionUrl: "/mentorship-portal/setup" };
    case "circle":
      return { ...task, title: "Join the private group", description: "Meet the other producers, say hello and tell us what you're working towards. This is where you can ask me questions between calls.", actionLabel: "Join the group" };
    case "first-call":
      return { ...task, title: "Save your first group call", description: "Put it in your calendar so you've got the time set aside. Bring your questions and be ready to work.", actionLabel: "Add to my calendar" };
    default:
      return task;
  }
};

export const communityName = (url?: string) => url && /^https:\/\/(chat\.)?whatsapp\.com\//i.test(url) ? "WhatsApp group" : "Private group";
