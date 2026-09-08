import soundLibraryThumbnail from "./assets/thumbnails/sound-library.jpg";
import sessionTemplateThumbnail from "./assets/thumbnails/session-template.jpg";
import referencePlaylistThumbnail from "./assets/thumbnails/reference-playlist.jpg";
import stemsThumbnail from "@/assets/ableton-session.webp";

export const setupLessonThumbnails: Record<string, string> = {
  "sound-library": soundLibraryThumbnail,
  "session-template": sessionTemplateThumbnail,
  "reference-playlist": referencePlaylistThumbnail,
  "stems-workflow": stemsThumbnail,
};

export interface SetupLesson {
  key: string;
  intro: string;
  notes: { title: string; text: string }[];
  actions: string[];
  outcome: string;
  worksheet: { title: string; description: string; filename: string; text: string };
}

export const setupLessons: SetupLesson[] = [
  {
    key: "sound-library",
    intro: "When you get a good idea, you want to be able to follow it straight away. Get a few sounds you love within reach so you can spend your session making music.",
    notes: [
      { title: "Build a palette you'll actually use", text: "Start with a small selection of drums, bass sounds, chords, textures and hooks that suit the music you want to make. Audition them, pick your favourites and put them somewhere you can find without thinking. You can add to this as you go." },
      { title: "Put your sounds to work", text: "Try a few combinations and make a short song starter. A groove, a chord idea or a hook is enough to start exploring. Let the sounds help you make decisions, then move on to another idea. You don't need to perfect the mix at this point." },
    ],
    actions: ["Create one easy-to-find favourites folder or collection in your DAW.", "Choose a starting selection of drums, bass, chords and melodic sounds.", "Open a blank project and make a short loop using that selection."],
    outcome: "You've got a sound palette you like and can get an idea going without a long search through folders.",
    worksheet: { title: "My sound-library plan", description: "A simple worksheet for organising your favourites and testing them in a loop.", filename: "Rob-Late-Sound-Library-Plan.txt", text: "MY SOUND-LIBRARY PLAN\nRob Late's Producer Mentorship\n\nThe sound or direction I want to explore:\n\nWhere my favourites live:\n\nDRUMS\nKicks:\nSnares / claps:\nHats / percussion:\n\nBASS\n\nCHORDS / PADS\n\nLEADS / HOOKS / TEXTURES\n\nFIRST TEST\nSounds I tried together:\nWhat worked:\nOne change to try next:\n\nREADY CHECK\n[ ] My favourites are easy to find.\n[ ] I can load them into a project.\n[ ] I've made a short song starter with them.\n" },
  },
  {
    key: "session-template",
    intro: "Your template should get you into the session quickly. Set up the things you reach for every time, then leave yourself room to follow the idea.",
    notes: [
      { title: "Make the first few minutes easy", text: "Create clearly named tracks for the parts you usually start with: drums, bass, chords, lead or vocal ideas and effects. Set up the routing and a few useful sends you know you'll use. Keep the project light enough that opening it feels quick." },
      { title: "Test it before you need it", text: "Save your template, close the project and open a fresh copy. Load a few sounds, record something and make a rough bounce. Sort out missing samples or routing problems now, while there's no good idea waiting for you to get on with it." },
    ],
    actions: ["Name and organise your starting tracks and groups.", "Set up the routing and sends you use most often, then save the template.", "Open a new project from it and test recording, playback and exporting."],
    outcome: "You can open a fresh session and start building a song starter straight away.",
    worksheet: { title: "Session-template checklist", description: "Plan your tracks and routing, then check your template works in a fresh project.", filename: "Rob-Late-Session-Template-Checklist.txt", text: "MY SESSION TEMPLATE\nRob Late's Producer Mentorship\n\nTemplate name:\nSaved location:\n\nSTARTING TRACKS / GROUPS\nDrums:\nBass:\nChords:\nLead / vocal ideas:\nEffects / textures:\nReference track:\n\nROUTING AND SENDS I ACTUALLY USE\n\nREADY CHECK\n[ ] Tracks and groups are clearly named.\n[ ] My usual routing works.\n[ ] The project opens without missing samples or plugins.\n[ ] I can record and play back audio.\n[ ] I've exported and listened to a test bounce.\n[ ] A fresh copy is saved as my starting template.\n" },
  },
  {
    key: "reference-playlist",
    intro: "Pick a few tracks that show where you want your music to go. The useful part is being able to say what you like about them and hear how they get there.",
    notes: [
      { title: "Give each reference a job", text: "One track might have the drum sound you're after. Another might have a great hook or a really effective build into the chorus. Write down what you're listening for so each reference helps you make a specific decision." },
      { title: "Listen to how the idea develops", text: "Follow the intro through to the end of the first chorus or drop. Notice when the hook arrives, what changes between sections and what creates the lift. That's the stretch you'll be developing in your weekly songs. Use it to understand the decisions, then make your own." },
    ],
    actions: ["Choose a small set of references you can easily return to.", "Write one specific thing you want to learn from each track.", "Listen from the intro through the first chorus or drop and note the key changes."],
    outcome: "You've got a useful set of references and can explain what each one is helping you hear.",
    worksheet: { title: "Reference listening notes", description: "Capture the hook, structure and energy changes that matter to your own music.", filename: "Rob-Late-Reference-Listening-Notes.txt", text: "REFERENCE LISTENING NOTES\nRob Late's Producer Mentorship\n\nTrack / artist:\nListening link:\n\nWHAT I'M USING THIS REFERENCE FOR\n\nINTRO TO FIRST CHORUS / DROP\nIntro starts:\nFirst hook appears:\nBuild / transition:\nChorus / drop starts:\nEnd of first chorus / drop:\n\nWHAT CHANGES?\nSounds added or removed:\nEnergy / contrast:\nWhat makes the hook work:\n\nONE DECISION TO TRY IN MY OWN MUSIC\n\nRepeat these notes for each reference in your playlist.\n" },
  },
  {
    key: "stems-workflow",
    intro: "Your stems let me get inside the track when we work on a project live. Give yourself a simple export routine so everything lines up and we can get straight into the music.",
    notes: [
      { title: "Keep everything lined up", text: "Export separate WAV audio files for the parts in your song, all starting at the same point. Keep the silence at the beginning of a part if it enters later. Use a consistent export range and leave space for reverb or delay tails at the end." },
      { title: "Check the handover", text: "Give the files clear names and put them in one folder with the track title and BPM. Import the exports into a blank session from the same starting position and listen through. Include the creative effects that are part of the sound, and flag anything that needs explaining in a short note. ZIP the folder and upload it alongside your weekly song." },
    ],
    actions: ["Export your audio parts from the same starting point and name them clearly.", "Import the files into a blank session and check that the song lines up.", "ZIP the checked folder, ready to upload with your weekly song."],
    outcome: "You've tested an export and know how to send a tidy set of stems with your weekly submission.",
    worksheet: { title: "Stems handover checklist", description: "An export check and a short handover-note template to keep with your files.", filename: "Rob-Late-Stems-Handover-Checklist.txt", text: "STEMS HANDOVER CHECKLIST\nRob Late's Producer Mentorship\n\n[ ] Each part is exported as WAV audio.\n[ ] Every file starts at the same point.\n[ ] The export range includes the ending and effect tails.\n[ ] Files have clear names.\n[ ] I've imported the exports into a blank project and checked alignment.\n[ ] I've listened through and checked that no important parts are missing.\n[ ] The folder is zipped and ready to upload alongside the song bounce.\n\nHANDOVER NOTE\nProducer:\nTrack title:\nWeek / version:\nBPM:\nKey, if known:\nNotes on effects / anything Rob should know:\n\nWeeks 1 to 4: weekly song from intro through the end of the first chorus or drop.\nWeeks 5 and 6: progress and updated stems for your selected full track.\n" },
  },
];

export const setupLessonPath = (key: string) => `/mentorship-demo/setup/${encodeURIComponent(key)}`;
