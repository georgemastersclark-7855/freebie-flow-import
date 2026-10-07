import soundLibraryThumbnail from "./assets/thumbnails/sound-library.jpg";
import sessionTemplateThumbnail from "./assets/thumbnails/session-template.jpg";
import referencePlaylistThumbnail from "./assets/thumbnails/reference-playlist.jpg";
import stemsThumbnail from "./assets/thumbnails/stems-workflow.jpg";

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
}

export const setupLessons: SetupLesson[] = [
  {
    key: "sound-library",
    intro: "I used to spend half my time in sessions searching for sounds while everyone else waited for me to come up with an idea. Of course it was stressful. I had nothing organised or prepared. Having familiar sounds ready means I can get something going while the room is excited. That's what I want you to take from this lesson.",
    notes: [
      { title: "Get an idea going before perfecting the sounds", text: "Being a good producer is about knowing what goes together and getting people excited about an idea. I often start with sounds I intend to replace or improve later. Have your favourite samples organised and get to know them. Sometimes I know exactly which kick or transition I want, so I just type its name into the search bar." },
      { title: "Keep finding new sounds for your sonic palette", text: "Your sound library is your sonic palette. The samples, textures and instruments you keep reaching for all contribute to the music you make, so give some thought to what you're putting in there.\n\nMake time to go looking for new sounds. Explore Splice, dig through packs, sample something interesting and save the things that get you excited. I'm always finding new sounds and updating my folders as my taste changes. Treat that as part of your process, alongside writing and producing. Keep your palette fresh and you give yourself fresh ideas to work with." },
      { title: "Save the sounds and effects you keep rebuilding", text: "If you use the same effects or instrument settings across lots of tracks, save them so you can recall them quickly. I show you my racks and my go-to sub sound. Your folders and tools will be different because your taste and the way you work are different. Use what makes sense in your setup." },
      { title: "Keep your own song starters ready to play", text: "I also keep a folder of my own melody loops. Sometimes nothing is happening in a session, then someone hears one and goes, 'Oh, that's sick. I've got an idea for that.' Those are your own musical ideas, separate from the samples you use to make them. Keep them easy to browse and play. You'll be building that collection throughout the mentorship." },
    ],
    actions: ["Organise your samples into folders or collections that suit the music you make, with your favourites easy to find.", "Save the effects and instrument setups you use repeatedly so you can recall them quickly.", "Keep your own song starters together so you can browse and play them in a session.", "Make time in your routine to discover and audition new sounds, then add the ones you like to your library."],
    outcome: "You can reach for familiar sounds quickly, play through your own ideas and keep adding fresh sounds as your taste develops.",
  },
  {
    key: "session-template",
    intro: "When you're working with a vocalist, you want to be able to record an idea and play it back while everyone's excited about it. Think ahead about what you'll need ready. I use a simple home template and a more prepared writing-session template. I'll show you both so you can adapt them to how you work.",
    notes: [
      { title: "Choose what needs to be ready for the session", text: "At home I often like an empty arrangement, especially if an artist is sending me stems to work on. My usual reverbs, delay and a few tools for checking what I'm hearing are enough. Your template can be that simple. Start with the things you actually reach for each time." },
      { title: "Prepare to record and write with other people", text: "My writing-session template has vocals, melodics, drums and effects grouped and ready. There's a basic vocal chain so I can grab a mic, record and play it back without stopping to load everything. I've also got a sound for getting chords or melodies down and drum racks with my favourite samples. It means we can get straight into making something." },
      { title: "Adapt the template to your own workflow", text: "These things are in my template because I use them a lot. Yours might be different. Take the useful bits and use the tools you have. Once I'm writing, I still cut things out, add things in and change settings to suit the song or vocalist. If you've already got a template that works, check what else would save you time." },
    ],
    actions: ["Look at the setup jobs you repeat and decide what you want ready when a project opens.", "Save the returns, instruments, sounds and effects you regularly use into a template that suits you.", "If you work with vocalists, prepare a recording track and a useful starting vocal chain.", "Keep the template easy to adapt once you start writing."],
    outcome: "You can open a session with the things you need already available and get an idea down quickly.",
  },
  {
    key: "reference-playlist",
    intro: "I don't like walking into the studio and just fishing for ideas. I'd rather arrive excited about something I've heard and ready to try it. I use references for two things: getting inspired before I start, and checking the track once I've got an idea going. Both are habits I want you to build into your process.",
    notes: [
      { title: "Listen for things you want to try in your own music", text: "We're all a sum of our influences. It might be an unexpected snare, a drum fill, a vocal sound or one small bit of sound design that gets you excited. Save those tracks in a playlist. The genre and release date don't matter. Listen back before you write so you've got something to draw from when you get to the studio." },
      { title: "Keep discovering music outside the studio", text: "I use Spotify's Song Radio to find music from a song I'm into. I'll listen through while I'm doing other things, then add anything that catches my ear to my own playlist. Later, I can play it back and remember what made me want to try a synth sound or drum pattern. Make listening part of your day so you're regularly finding ideas." },
      { title: "Compare your developing track with a suitable reference", text: "The track that inspired you might have drums you love but a mix you wouldn't aim for. Once your idea is taking shape, choose a similar released track to compare it with. Listen to the length, the time it takes to reach the first drop, the loudness and the balance of the instruments and vocals. I do this while I'm producing so it helps me make decisions as I go." },
    ],
    actions: ["Start or update a playlist of music that gets you excited, including tracks outside your usual genre.", "Keep listening and discovering new music, then save the tracks with details you want to come back to.", "Listen back before a writing session and find something you want to explore.", "As your track develops, choose a suitable reference to compare its structure, balance and overall sound with yours."],
    outcome: "You've got music to draw inspiration from and know how to choose a useful reference for the track you're producing.",
  },
  {
    key: "stems-workflow",
    intro: "In this video I show you how I want your stems delivered so I can open them and get straight to work. Sending files properly is a professional skill, and the way you hand them over can be one of the first impressions you make on another producer or engineer.",
    notes: [
      { title: "Group related parts so I can work with them", text: "For our live sessions, I want a small, clearly organised set of grouped stems. I use vocals, melodics, drums and effects. Keep the main lead vocal separate, combine related backing vocals, and combine layers of the same instrument where it makes sense, such as guitars or bass parts.\n\nFor drums, send the kicks together, the main snare/clap parts together, and the remaining percussion and top loops together. Risers, impacts and transitions can be one effects stem. Only include the parts your song has. I need enough control to work on the music without importing a separate file for every small sound." },
      { title: "Your stems make a first impression", text: "The first thing another producer or engineer receives from you might be a folder of stems. How those files arrive gives them an early impression of what you're like to work with. Clearly named files that line up and contain everything they need show that you've thought about their side of the job. For future collaborations, check how the person receiving your files wants them delivered." },
      { title: "Use the same range and export settings for every stem", text: "All your stems need to be exactly the same length. Set one range from the first sound through to the end, including any reverb tails, and use it for every export. I show you how to mark that range with a MIDI clip in Ableton. Leave the mastering chain off. In the video I export WAV at 44.1 kHz, with MP3 turned off. Follow the settings shown on screen." },
      { title: "Name the files so I can see what they are", text: "Use the category followed by the part, such as Vocals - Lead, Melodics - Guitar or Drums - Kick, and make it clear when parts are grouped. Name the folder with your name, track name, mentorship week and BPM. ZIP that folder and upload it alongside the matching version of your weekly song." },
    ],
    actions: ["Watch how I group and export the parts, then follow that workflow when preparing your submissions.", "Use one export range for every stem so all files are the same length, including the ending and effect tails.", "Export grouped WAV stems at 44.1 kHz with the mastering chain off, following the settings in the video.", "Name the files by category and part, and include your name, track, week and BPM in the folder name.", "ZIP the folder and upload it alongside the matching weekly song."],
    outcome: "You know how to deliver a clearly named set of grouped stems that I can open and get straight to work with.",
  },
];

export const setupLessonPath = (key: string) => `/mentorship-portal/setup/${encodeURIComponent(key)}`;
