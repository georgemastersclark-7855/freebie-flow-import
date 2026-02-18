import { useEffect, useState, useRef } from "react";
import type { RefObject } from "react";
import { ArrowRight, Check, CheckCircle2, Play, Pause, Star, TrendingUp, Music2, X, Youtube, ChevronDown, ChevronUp, PlayCircle, Zap, Instagram, MessageCircle, Music, User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Below-fold assets (loaded lazily via /public)
const testimonial1 = "/assets/testimonials/testimonial-1.jpeg";
const testimonial2 = "/assets/testimonials/testimonial-2.jpeg";
const testimonial3 = "/assets/testimonials/testimonial-3.jpeg";
const austriaTestimonial = "/assets/testimonials/austria-testimonial.jpg";
const rsmyth111Testimonial = "/assets/testimonials/rsmyth111-testimonial.jpeg";
const levinMusicTestimonial = "/assets/testimonials/levin-music-testimonial.jpeg";
const deepintheforestTestimonial = "/assets/testimonials/deepintheforest-testimonial.jpg";
const nateSawyerTestimonial = "/assets/testimonials/nate-sawyer-testimonial.jpg";
const completePackageTestimonial = "/assets/testimonials/complete-package-testimonial.jpg";
const switzerlandTestimonial = "/assets/testimonials/switzerland-testimonial.jpeg";
const djkieraTestimonial = "/assets/testimonials/djkiera-testimonial.mp4";
const djkieraThumbnail = "/assets/testimonials/djkiera-thumbnail.jpg";
const test1Testimonial = "/assets/testimonials/test1-testimonial.mp4";
const test1Thumbnail = "/assets/testimonials/test1-thumbnail.png";
const streamingNumbersTestimonial = "/assets/testimonials/streaming-numbers-testimonial.jpg";
const drewAdieuTestimonial = "/assets/testimonials/drew-adieu-testimonial.jpg";
const headroomRecordsTestimonial = "/assets/testimonials/headroom-records-testimonial.jpg";
const aaronly0nsYoutubeTestimonial = "/assets/testimonials/aaronly0ns-youtube-testimonial.jpg";
const usingAbletonGif = "/assets/using-ableton.gif";
const solutionVideo = "/assets/solution-video.mp4";
const robMarshmello = "/assets/rob-marshmello.jpg";
const robMarsmelloCropped = "/assets/rob-marshmello-cropped.jpg";
const robStudio = "/assets/rob-home-studio.jpg";
const robGaryBarlow = "/assets/rob-gary-barlow.jpg";
const robHomeStudioWide = "/assets/rob-home-studio-wide.jpg";
const robChainsmokers = "/assets/rob-chainsmokers.jpg";
const robChainsmokersGif = "/assets/rob-chainsmokers.mp4";
const robFirstStudio = "/assets/rob-first-studio.jpg";
const robLockdownStudio = "/assets/rob-lockdown-guitar.png";
const earlyDaysSticker = "/assets/early-days-sticker.png";
const nowSticker = "/assets/now-sticker.png";
const robLateSignature = "/assets/rob-late-signature-white.png";
const robWritingSession = "/assets/rob-writing-session.jpg";
const artistSoundsIdentity = "/assets/artist-sounds-identity.webp";
const vocalProductionStudio = "/assets/vocal-production-studio.png";
const abletonSession = "/assets/ableton-session.webp";
const drumProductionGif = "/assets/drum-production.mp4";
const mixingMasteringStudio = "/assets/mixing-mastering-studio.jpg";
const robWorkingLoop = "/assets/rob-working-loop.m4v";
const soundDesignStudio = "/assets/sound-design-studio.png";
const tiktokBreakdownVault = "/assets/tiktok-breakdown-vault.png";
const robOnLaptop = "/assets/rob-on-laptop.jpg";
const robPovStudio = "/assets/rob-pov-studio-new.png";
const robWorking3Loop = "/assets/rob-working-3-loop.mp4";
const blueprintLaptopMockup = "/assets/producer-blueprint-mockup.jpg";
const producerBlueprintThumbnail = "/assets/producer-blueprint-thumbnail.jpg";
const abletonTemplatesThumbnail = "/assets/ableton-templates-thumbnail.webp";
const avatarKosana = "/assets/avatars/avatar-kosana.jpg";
const avatarChrisGeorgiou = "/assets/avatars/avatar-chris-georgiou.jpg";

// Signature Placeholder
const robSignature = "https://placehold.co/300x100/000000/FFFFFF/png?text=Rob+Late+Signature";

// ================= TESTIMONIAL CARD COMPONENT =================
interface TestimonialCardProps {
  id: string;
  name: string;
  handle: string;
  title: string;
  media: string;
  isVideo: boolean;
  quote: string;
  avatar: string;
  poster?: string;
  activeVideoId?: string | null;
  onPlay?: (id: string) => void;
}

const TestimonialCard = ({ id, name, handle, title, media, isVideo, quote, avatar, poster, activeVideoId, onPlay }: TestimonialCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Pause this video when another video starts playing
  useEffect(() => {
    if (activeVideoId && activeVideoId !== id && isPlaying) {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  }, [activeVideoId, id, isPlaying]);

  const handleVideoClick = () => {
    if (!videoRef.current || !isVideo) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
      onPlay?.(id);
    }
  };

  return (
    <div className="snap-center shrink-0 w-[85vw] max-w-[320px] md:w-auto md:max-w-none bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-colors group">
      
      {/* CLEAN PROFILE HEADER */}
      <div className="p-4 flex items-center gap-3">
        <div className="relative p-[2px] rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]">
          <div className="bg-black p-[2px] rounded-full">
            <Avatar className="w-10 h-10 border-none">
              <AvatarImage src={avatar} className="object-cover" />
              <AvatarFallback>{name[0]}</AvatarFallback>
            </Avatar>
          </div>
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <p className="text-white font-bold text-sm tracking-tight">{name}</p>
            {/* Meta Verified Badge */}
            <svg viewBox="0 0 22 22" className="h-3.5 w-3.5 fill-[#0095F6]">
              <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
            </svg>
          </div>
          <p className="text-zinc-500 text-xs">{handle} • {title}</p>
        </div>
      </div>

      {/* DYNAMIC ASPECT RATIO: 4:5 on Mobile, 9:16 on Desktop */}
      <div 
        className="relative aspect-[4/5] md:aspect-[9/16] overflow-hidden bg-zinc-900 cursor-pointer"
        onClick={handleVideoClick}
      >
        {isVideo ? (
          <video
            ref={videoRef}
            src={media}
            poster={poster}
            className="absolute inset-0 w-full h-full object-cover"
            loop
            playsInline
            preload="none"
            style={{ transform: 'translateZ(0)' }}
          />
        ) : (
          <img 
            src={media}
            alt={`${name} testimonial`}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
            loading="lazy"
            decoding="async"
          />
        )}
        {/* Play Button Overlay - show when not playing (videos) or on hover (images) */}
        {isVideo && !isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-lg">
              <Play className="w-6 h-6 text-white fill-white ml-1" />
            </div>
          </div>
        )}
        {!isVideo && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-lg">
              <Play className="w-6 h-6 text-white fill-white ml-1" />
            </div>
          </div>
        )}
      </div>

      {/* CAPTION AREA */}
      <div className="p-5 md:p-6">
        <p className="text-zinc-200 text-base font-medium leading-snug">
          "{quote}"
        </p>
      </div>
    </div>
  );
};

// ================= CURRICULUM SECTION COMPONENT =================
const CurriculumSection = ({ onScrollToPricing }: { onScrollToPricing?: (loc: string) => void }) => {
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [expandedBonus, setExpandedBonus] = useState<string | null>(null);

  const toggleModule = (id: string) => {
    if (expandedModule === id) {
      setExpandedModule(null);
    } else {
      setExpandedModule(id);
    }
  };

  const toggleBonus = (id: string) => {
    if (expandedBonus === id) {
      setExpandedBonus(null);
    } else {
      setExpandedBonus(id);
    }
  };

  const modules = [
    {
      id: "01",
      title: "The Foundation",
      subtitle: "(Ableton Basics)",
      desc: "Stop fighting your DAW. Set up the exact templates, shortcuts, and preferences I use to stay in a \"flow state\" and work 2x faster. (Note: If you are an advanced user, you can skip this. If you are new, this saves you 6 months of headache.)",
      image: robPovStudio,
      video: robWorking3Loop,
      lessons: [
        "Ableton layout & menus",
        "Preferences & setting up projects",
        "Loading plugins",
        "Inputs, outputs & recording audio",
        "Using audio samples",
        "Warp & time stretching",
        "Using MIDI",
        "Shortcuts & key commands",
        "Saving & collect all"
      ]
    },
    {
      id: "02",
      title: "Sound Design That Cuts",
      desc: "Learn my DIY sampling techniques to create a sonic fingerprint unique to YOU. Master the synthesis fundamentals to build pads, plucks, and basses from scratch that sit perfectly in the mix without endless tweaking.",
      image: soundDesignStudio,
      lessons: [
        "ADSR Synthesis: The Building Blocks of Sound Design",
        "Secret Sauce: My Synth Plugin Toolbox",
        "Synthesis From Scratch: Designing Smooth Pads",
        "Synthesis From Scratch: Creating Rhythmic Plucks",
        "Synthesis From Scratch: Sub Bass Essentials",
        "Ultimate Serum Deep-Dive",
        "Serum Sound Design Masterclass",
        "Producer Hacks Vol. 1: Freezing & Slicing Audio",
        "Producer Hacks Vol. 2: Slicing & Resampling Audio",
        "Sidechain Secrets: Pumping FX + Volume Shaping",
        "Analogue Workflows: Using External FX Pedals"
      ]
    },
    {
      id: "03",
      title: "Pro Drum Production",
      desc: "The difference between \"demo\" and \"pro\" is usually in the drums. Learn my sample selection process, arrangement, bus processing, and sidechain secrets and more for drums that punch through laptop speakers.",
      image: drumProductionGif,
      video: drumProductionGif,
      lessons: [
        "Secret Sauce: My all time favourite drum plugins",
        "The Great Debate: audio vs. midi drums",
        "Rhythm Hacks: Using percussion tops & loops",
        "Elite Width: The stereo field & panning",
        "Drum Sauce: Sidechain compression masterclass",
        "Clean & Fat Drum Mixing",
        "Producer Hacks Vol.3: Resampling",
        "Producer Hacks Vol.4: Real beat breakdown",
        "Creating huge drum fills & transitions",
        "Producer Hacks Vol.5: Creating custom DIY percussion"
      ]
    },
    {
      id: "04",
      title: "Arrangement & Energy",
      desc: "Escaping the 'Loop Phase'. Learn how to structure a song to keep listeners hooked, using ear candy, transitions, and energy management to turn loops into full records.",
      image: abletonSession,
      lessons: [
        "Secret Sauce: My all time favourite FX plugins",
        "Creating Addictive Tracks: Song structure",
        "Producer Hacks Vol.6: Creating unique transitions",
        "Secret Sauce: Designing ear candy & custom ad-libs",
        "Building & Maintaining Huge Energy",
        "Utilising Epic Soundscapes & FX",
        "Recording Crispy Acoustic Guitars"
      ]
    },
    {
      id: "05",
      title: "Vocal Production",
      subtitle: "(The \"Secret Sauce\")",
      desc: "How to get crispy, radio-ready vocals in a less-than-perfect home setup. Recording, processing, harmony stacking techniques, and tuning workflows.",
      image: vocalProductionStudio,
      lessons: [
        "My personal recording setup & essential studio gear",
        "How to get clean & crispy vocals",
        "Secret Sauce: My personal vocal chain",
        "Using Autotune & Melodyne",
        "Ultimate Reverb Masterclass Part: 1",
        "Ultimate Reverb Masterclass Part: 2",
        "Workflow Hacks: Audio comping & songwriting secrets",
        "Creating Huge Vocals: Harmonies, placement & mixing",
        "Secret Sauce: Recording gang vocals",
        "Producer Hacks Vol.7: Vocal adlibs + my personal FX chain"
      ]
    },
    {
      id: "06",
      title: "Mixing & Mastering",
      desc: "Learn how I approach the final steps of the creation process to get music ready to send to the artist, label, or even to release to streaming platforms. Finish the job.",
      image: mixingMasteringStudio,
      video: robWorkingLoop,
      lessons: [
        "The honest truth about mixing & mastering",
        "Priority: Fix your monitoring & room acoustics",
        "EQ 101: Getting insanely clean mixes",
        "Creating Space: Dynamic EQ",
        "EQ Life Hack: Custom automation",
        "Avoiding Muddy Mixes: Advanced frequency carving",
        "The Truth About Compression",
        "Producer Hacks Vol.8: Sidechain compression deep dive",
        "Mastering: The real truth + my personal mastering chain",
        "Finish Like A Pro: How to export stems"
      ]
    },
    {
      id: "07",
      title: "Artist Sounds & Identity",
      desc: "How to analyze trends without copying them. Learn to deconstruct the sounds of top artists and rebuild them with your own unique sonic fingerprint.",
      image: artistSoundsIdentity,
      lessons: [
        "Finding Your Own Sound: Building a reference playlist & capturing ideas",
        "Workflow & Getting Inspired: Using Splice the right way",
        "Beat From Scratch: Giving your tracks a unique sonic fingerprint",
        "Creating Melody Loops: The fastest way to stack credits as a producer",
        "Artist Sounds: Vocal stutter effects",
        "Artist Sounds: Huge retro drums",
        "Artist Sounds: Fat 808's",
        "Percussion Masterclass: UK Garage, Drum & Bass + Future House"
      ]
    },
    {
      id: "08",
      title: "Marketing & Social Media",
      desc: "How to grow an audience online, make content that converts, and build real income streams from your production skills. This is the module most producers wish existed - Rob breaks down exactly how he turned social media into sessions, brand deals, sample pack sales, and sync placements.",
      image: robOnLaptop,
      lessons: [
        "Building Your Online Presence as a Producer",
        "Content That Converts: What to post & why",
        "Growing on TikTok, Instagram & YouTube",
        "Monetisation: Brand deals & sponsorships",
        "Selling Sample Packs & Presets",
        "Sync Licensing & Placements",
        "Building a Sustainable Music Income",
        "Turning Followers Into Real Clients"
      ]
    },
  ];

  return (
    <section id="curriculum" className="py-12 md:py-24 px-4 md:px-6 bg-[#050505] relative z-20 scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-10 md:mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-400 text-xs font-bold uppercase tracking-wide mb-4">
            What's Inside The Program
          </div>
          <h2 className="text-3xl md:text-6xl font-bold tracking-tighter text-white mb-4 md:mb-6">
            8 Modules. 80+ Lessons. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
              The Producer Blueprint.
            </span>
          </h2>
          <p className="text-base md:text-xl text-zinc-400 font-medium tracking-tight">
            The complete step-by-step workflow to go from <span className="text-white">"Idea"</span> to <span className="text-white">"Release Ready Song."</span>
          </p>
        </div>

        {/* MODULE CARDS - Mobile: Vertical list (no images) | Desktop: Horizontal cards with images */}
        <div className="flex flex-col gap-4 md:gap-6 mb-16 md:mb-32">
          {modules.map((module) => {
            const isOpen = expandedModule === module.id;
            
            return (
              <div 
                key={module.id}
                className={`group relative w-full border rounded-xl md:rounded-2xl overflow-hidden transition-all duration-500 ease-in-out ${
                  isOpen 
                    ? 'border-zinc-600 bg-zinc-900 shadow-[0_0_30px_rgba(255,255,255,0.05)]' 
                    : 'border-zinc-800 bg-gradient-to-b from-zinc-900 via-[#0A0A0A] to-black hover:border-zinc-700 md:bg-zinc-900/50 md:backdrop-blur-sm md:border-white/10 md:hover:border-[#D3FF02]/30'
                }`}
              >
                {/* MOBILE: Horizontal row with thumbnail | DESKTOP: Large horizontal cards */}
                <div className="flex flex-row md:flex-row">
                  
                  {/* MOBILE THUMBNAIL - Small square image/video (block md:hidden) */}
                  <div className="block md:hidden w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 m-4 mr-0">
                    {module.video ? (
                      <video src={module.video} autoPlay loop muted playsInline preload="none" className="w-full h-full object-cover" style={{ objectPosition: 'center 40%' }} />
                    ) : (
                      <img 
                        src={module.image} 
                        alt={module.title} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                  </div>

                  {/* DESKTOP IMAGE/VIDEO - Large w-1/3 (hidden md:block) */}
                  <div className="hidden md:block md:relative md:w-1/3 md:min-h-[200px] md:shrink-0 md:overflow-hidden md:rounded-l-2xl">
                    {module.video ? (
                      <video src={module.video} autoPlay loop muted playsInline preload="none" className="md:absolute md:inset-0 md:w-full md:h-full md:object-cover md:transition-transform md:duration-700 md:group-hover:scale-105" style={{ objectPosition: 'center 40%' }} />
                    ) : (
                      <img 
                        src={module.image} 
                        alt={module.title} 
                        className="md:absolute md:inset-0 md:w-full md:h-full md:object-cover md:transition-transform md:duration-700 md:group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                  </div>

                  {/* DESKTOP DIVIDER LINE (hidden md:block) */}
                  <div className="hidden md:block md:w-[1px] md:self-stretch md:bg-white/10"></div>

                  {/* CONTENT SECTION - Flex-1 on mobile, w-2/3 on desktop */}
                  <div className="flex-1 flex flex-col relative min-w-0 md:w-2/3">
                    
                    {/* MAIN CONTENT */}
                    <div className={`flex flex-col justify-center p-4 md:p-5 md:py-6 lg:p-8 ${isOpen ? '' : 'md:min-h-[200px]'} shrink-0 relative z-20`}>
                      
                      {/* Background Number (Subtle Watermark) - Desktop only */}
                      <div className="hidden md:block absolute md:top-6 md:right-8 lg:top-8 lg:right-12 md:text-8xl lg:text-9xl font-bold text-white/[0.03] select-none pointer-events-none">
                        {module.id}
                      </div>

                      <div className="pr-4 md:pr-12">
                        <h3 className="text-lg md:text-3xl font-bold text-white tracking-tight mb-1 md:mb-3 leading-tight group-hover:text-zinc-100 transition-colors">
                          {module.title}
                          {module.subtitle && (
                            <span className="hidden md:inline font-serif italic font-normal text-zinc-500 ml-2 group-hover:text-zinc-400 transition-colors">
                              {module.subtitle}
                            </span>
                          )}
                        </h3>
                        {/* Description - truncated when closed */}
                        <p className={`text-zinc-400 text-xs md:text-sm leading-relaxed mb-2 md:mb-6 max-w-lg font-medium group-hover:text-zinc-300 transition-colors ${isOpen ? '' : 'line-clamp-2 md:line-clamp-3'}`}>
                          {module.desc}
                        </p>
                        
                        {/* VIEW LESSONS BUTTON - Text link style */}
                        <button 
                          onClick={() => toggleModule(module.id)}
                          className="inline-flex items-center text-[10px] md:text-xs font-bold tracking-[0.12em] md:tracking-[0.15em] text-zinc-500 uppercase hover:text-white transition-colors"
                        >
                          {isOpen ? 'Hide' : 'View Lessons'}
                          <span className={`ml-1.5 md:ml-2 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'group-hover:translate-y-1'}`}>
                            ↓
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* EXPANDED DRAWER */}
                    <div 
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="border-t border-white/5 bg-black/20 p-6 md:p-8 pt-4">
                        <div className="flex items-center gap-3 mb-4 md:mb-6">
                          <h4 className="text-xs font-bold text-zinc-600 uppercase tracking-widest">
                            Module Breakdown
                          </h4>
                          <div className="h-px bg-zinc-800 flex-1"></div>
                        </div>
                        
                        {/* LESSON GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 md:gap-y-3 gap-x-12">
                          {module.lessons.map((lesson, idx) => (
                            <div key={idx} className="flex items-start group/lesson cursor-default">
                              <span className="mr-3 text-zinc-700 text-[10px] mt-[5px] group-hover/lesson:text-[#D3FF02] transition-colors">▶</span>
                              <span className="text-zinc-400 text-sm font-medium group-hover/lesson:text-zinc-200 transition-colors">{lesson}</span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-6 pt-4 border-t border-zinc-800/50 flex justify-end">
                          <button 
                            onClick={() => toggleModule(module.id)}
                            className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider hover:text-zinc-400 transition-colors flex items-center"
                          >
                            Close Module <span className="ml-1 text-lg leading-none">×</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= BONUS SECTION (No Overlay) ================= */}
        <section className="relative pt-24 md:pt-32 pb-16 md:pb-32 px-4 md:px-6 bg-[#050505] overflow-hidden">
          
          {/* VISUAL CONNECTOR */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 md:h-32 bg-gradient-to-b from-zinc-800 to-transparent"></div>
          
          <div className="max-w-6xl mx-auto relative z-10">
            
            {/* HEADER */}
            <div className="text-center mb-8 md:mb-16">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-[#D3FF02]/10 border border-[#D3FF02]/20 mb-3 md:mb-6 animate-pulse">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#D3FF02]"></span>
                <span className="text-[#D3FF02] text-[10px] md:text-xs font-bold uppercase tracking-widest">
                  Available for a limited time
                </span>
              </div>
              
              {/* Headline */}
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 md:mb-6 tracking-tighter">
                Get 2x <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D3FF02] to-[#D3FF02]">FREE</span> bonuses
              </h2>
              
              {/* Subhead */}
              <p className="text-base md:text-xl text-zinc-400 font-medium max-w-2xl mx-auto">
                Join today and get <span className="text-white underline decoration-[#D3FF02] decoration-2 underline-offset-4 font-bold">2 exclusive bonuses</span> included.
              </p>
            </div>

            {/* BONUS CARDS GRID */}
            <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-8">
              
              {/* --- BONUS #1 --- */}
              <div 
                className="group relative rounded-xl md:rounded-3xl border border-zinc-800 bg-[#0A0A0A] overflow-hidden hover:border-[#D3FF02]/40 transition-all duration-300 hover:shadow-2xl hover:shadow-[#D3FF02]/10 cursor-pointer md:cursor-default"
                onClick={() => toggleBonus('bonus1')}
              >
                
                {/* MOBILE: Row layout | DESKTOP: Column layout */}
                <div className="flex flex-row md:flex-col">
                  
                  {/* IMAGE AREA */}
                  <div className="w-28 self-stretch md:w-full md:h-56 md:self-auto bg-zinc-900 relative overflow-hidden shrink-0 rounded-l-xl md:rounded-l-none md:rounded-t-3xl">
                    <img 
                      src={abletonTemplatesThumbnail}
                      alt="Ableton Project Files & Templates" 
                      className="absolute inset-0 w-full h-full object-cover object-[center_42%] transition-transform duration-700 group-hover:scale-105 z-0" 
                      loading="lazy"
                      decoding="async"
                    />
                    {/* Desktop-only Value Badge on Image */}
                    <div className="hidden md:block absolute top-4 right-4 bg-black/70 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-lg z-20">
                      Value: <span className="line-through text-zinc-500 mx-1">$197</span> <span className="text-[#D3FF02]">FREE</span>
                    </div>
                  </div>

                  {/* CONTENT AREA */}
                  <div className="p-3 md:p-8 flex-1 flex flex-col bg-[#0A0A0A] relative z-20">
                    {/* Mobile: Badge on its own line */}
                    <div className="flex items-center justify-between mb-1 md:hidden">
                      <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">BONUS #1</span>
                      <span className="bg-[#D3FF02] text-black text-[10px] font-bold px-2 py-0.5 rounded">
                        FREE
                      </span>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-sm md:text-2xl font-bold text-white group-hover:text-[#D3FF02] transition-colors leading-tight mb-1 md:mb-3">
                      <span className="hidden md:inline text-zinc-500 text-2xl font-bold mr-2">BONUS #1:</span>
                      <span className="md:hidden">Ableton Project Files & Templates</span>
                      <span className="hidden md:inline">Ableton Project Files & Templates</span>
                    </h3>
                    
                    {/* Description - expandable on mobile */}
                    <p className={`text-zinc-400 text-[11px] md:text-sm leading-relaxed md:mb-6 md:flex-1 transition-all duration-300 ${expandedBonus === 'bonus1' ? '' : 'line-clamp-2 md:line-clamp-none'}`}>
                      Download the exact starting templates and finished project files Rob uses in sessions. Open them up, see how everything is built, and use them as your starting point.
                    </p>
                    
                    {/* Mobile tap hint */}
                    <span className={`md:hidden text-[10px] text-zinc-600 mt-1 transition-opacity ${expandedBonus === 'bonus1' ? 'opacity-0' : 'opacity-100'}`}>
                      Tap to read more
                    </span>
                    
                    {/* Desktop-only footer */}
                    <div className="hidden md:flex mt-auto pt-6 border-t border-zinc-800 justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 group-hover:text-zinc-400 transition-colors">
                        Instant Access
                      </span>
                      <span className="text-[#D3FF02] text-lg">+</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- BONUS #2 --- */}
              <div 
                className="group relative rounded-xl md:rounded-3xl border border-zinc-800 bg-[#0A0A0A] overflow-hidden hover:border-[#D3FF02]/40 transition-all duration-300 hover:shadow-2xl hover:shadow-[#D3FF02]/10 cursor-pointer md:cursor-default"
                onClick={() => toggleBonus('bonus2')}
              >
                
                {/* MOBILE: Row layout | DESKTOP: Column layout */}
                <div className="flex flex-row md:flex-col">
                  
                  {/* IMAGE AREA */}
                  <div className="w-28 self-stretch md:w-full md:h-56 md:self-auto bg-zinc-900 relative overflow-hidden shrink-0 rounded-l-xl md:rounded-l-none md:rounded-t-3xl">
                    <img 
                      src={tiktokBreakdownVault} 
                      alt="Rob's Breakdown Vault"
                      className="absolute inset-0 w-full h-full object-cover object-[center_70%] transition-transform duration-700 group-hover:scale-105 z-0" 
                      loading="lazy"
                      decoding="async"
                    />
                    {/* Desktop-only Value Badge on Image */}
                    <div className="hidden md:block absolute top-4 right-4 bg-black/70 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-lg z-20">
                      Value: <span className="line-through text-zinc-500 mx-1">$147</span> <span className="text-[#D3FF02]">FREE</span>
                    </div>
                  </div>

                  {/* CONTENT AREA */}
                  <div className="p-3 md:p-8 flex-1 flex flex-col bg-[#0A0A0A] relative z-20">
                    {/* Mobile: Badge on its own line */}
                    <div className="flex items-center justify-between mb-1 md:hidden">
                      <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">BONUS #2</span>
                      <span className="bg-[#D3FF02] text-black text-[10px] font-bold px-2 py-0.5 rounded">
                        FREE
                      </span>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-sm md:text-2xl font-bold text-white group-hover:text-[#D3FF02] transition-colors leading-tight mb-1 md:mb-3">
                      <span className="hidden md:inline text-zinc-500 text-2xl font-bold mr-2">BONUS #2:</span>
                      <span className="md:hidden">Rob's IG/TikTok Breakdown Vault</span>
                      <span className="hidden md:inline">Rob's IG/TikTok Breakdown Vault</span>
                    </h3>
                    
                    {/* Description - expandable on mobile */}
                    <p className={`text-zinc-400 text-[11px] md:text-sm leading-relaxed md:mb-6 md:flex-1 transition-all duration-300 ${expandedBonus === 'bonus2' ? '' : 'line-clamp-2 md:line-clamp-none'}`}>
                      Watch Rob break down his most viral videos step by step. He walks you through exactly how each one was made - the production decisions, the processing, and why it worked. Learn what's actually behind the content that built his audience.
                    </p>
                    
                    {/* Mobile tap hint */}
                    <span className={`md:hidden text-[10px] text-zinc-600 mt-1 transition-opacity ${expandedBonus === 'bonus2' ? 'opacity-0' : 'opacity-100'}`}>
                      Tap to read more
                    </span>
                    
                    {/* Desktop-only footer */}
                    <div className="hidden md:flex mt-auto pt-6 border-t border-zinc-800 justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 group-hover:text-zinc-400 transition-colors">
                        Instant Access
                      </span>
                      <span className="text-[#D3FF02] text-lg">+</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* BRIDGE CTA - Below Bonus Section */}
            <div className="flex flex-col items-center mt-12 md:mt-16">
              <a 
                href="#pricing" 
                onClick={() => onScrollToPricing?.("below_bonuses")}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-white text-black px-6 md:px-8 py-4 rounded-2xl text-lg font-black hover:bg-zinc-200 transition-all"
              >
                Start Producing Professional Music
                <ArrowRight className="w-5 h-5" />
              </a>
              <p className="mt-4 text-sm font-medium text-zinc-500">Get Instant Access</p>
            </div>
          </div>
        </section>


      </div>
    </section>
  );
};

interface BelowFoldProps {
  trackScrollToPricing: (opts: { cta_location: string }) => void;
  trackOrderBumpChecked: (opts: { value: number }) => void;
  trackFinalCheckoutClick: (opts: { value: number; order_bump_selected: boolean }) => void;
  nameRef: RefObject<HTMLInputElement>;
  emailRef: RefObject<HTMLInputElement>;
  isLoading: boolean;
  handleCheckout: (orderBumpAdded: boolean) => Promise<void>;
}

const BelowFold004Gear = ({ trackScrollToPricing, trackOrderBumpChecked, trackFinalCheckoutClick, nameRef, emailRef, isLoading, handleCheckout }: BelowFoldProps) => {
  const [kieraPlaying, setKieraPlaying] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [orderBumpAdded, setOrderBumpAdded] = useState(false);
  const [showAllWallOfProof, setShowAllWallOfProof] = useState(false);
  const kieraVideoRef = useRef<HTMLVideoElement>(null);

  // Course modules data
  const modules = [
    {
      number: "01",
      title: "Ableton Basics",
      description: "Layout, preferences, shortcuts, and project setup. The foundation everything else builds on.",
    },
    {
      number: "02",
      title: "Sound Design",
      description:
        "Synthesis fundamentals, Serum deep-dives, resampling techniques. Create your own sounds from scratch.",
    },
    {
      number: "03",
      title: "Drum Production",
      description:
        "Punchy drums that cut through. Sample selection, stereo width, sidechain compression, custom percussion.",
    },
    {
      number: "04",
      title: "Arrangement & Energy",
      description:
        "Turn ideas into full tracks. Song structure, transitions, ear candy, and maintaining energy throughout.",
    },
    {
      number: "05",
      title: "Vocal Production",
      description: "Recording setup, clean vocals, tuning, reverb, harmonies, and Rob's personal vocal chain.",
    },
    {
      number: "06",
      title: "Mixing & Mastering",
      description: "Clean, polished mixes that compete. EQ, compression, frequency carving, and Rob's mastering chain.",
    },
    {
      number: "07",
      title: "Artist Sounds",
      description:
        "Modern production techniques. Finding your sound, melody loops, vocal effects, and genre-specific percussion.",
    },
    {
      number: "08",
      title: "Marketing & Social Media",
      description:
        "Growing an audience online, making content that converts, and building real income streams from your production skills.",
    },
  ];

  const bonusModules = [
    {
      title: "Project Files & Templates",
      description: "Download the exact starting templates and finished project files Rob uses in sessions.",
    },
    {
      title: "IG/TikTok Breakdown Vault",
      description:
        "Watch Rob break down his most viral videos step by step. Learn what's actually behind the content that built his audience.",
    },
  ];

  // Selected 6 for the "Mini" Social Proof section
  // Desktop order (all 6 shown)
  const miniSocialProofImagesDesktop = [
    austriaTestimonial,
    rsmyth111Testimonial,
    levinMusicTestimonial,
    deepintheforestTestimonial,
    nateSawyerTestimonial,
    completePackageTestimonial,
  ];
  
  // Mobile order (first 3 shown, deepintheforest first)
  const miniSocialProofImagesMobile = [
    deepintheforestTestimonial,
    rsmyth111Testimonial,
    switzerlandTestimonial,
  ];

  return (
    <>
      {/* ================= MINI SOCIAL PROOF SECTION ================= */}
      <section id="reviews" className="pt-0 md:pt-8 pb-0 px-6 bg-[#050505] overflow-hidden relative z-10 scroll-mt-20">
        <div className="max-w-7xl mx-auto flex flex-col items-center">

          {/* MASONRY WALL - Cinematic fade on desktop, clean on mobile */}
          <div className="w-full relative z-0 overflow-hidden md:max-h-[700px]">
            <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6 pb-12 md:pb-32">
              {/* Mobile: Show mobile-specific order (3 images) */}
              {miniSocialProofImagesMobile.map((img, idx) => (
                <div key={`mobile-${idx}`} className="break-inside-avoid mx-auto md:hidden">
                  <div className="feedback-card rounded-2xl border-0 overflow-hidden shadow-2xl hover:scale-[1.01] transition-transform duration-300 group cursor-pointer bg-white/[0.02]">
                    <img
                      src={img}
                      className="w-full h-auto block opacity-90 group-hover:opacity-100 transition-opacity object-contain"
                      alt={`Testimonial ${idx + 1}`}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              ))}
              {/* Desktop: Show all 6 images in original order */}
              {miniSocialProofImagesDesktop.map((img, idx) => (
                <div key={`desktop-${idx}`} className="break-inside-avoid hidden md:block">
                  <div className="rounded-xl border border-white/10 overflow-hidden shadow-2xl hover:scale-[1.01] transition-transform duration-300 group cursor-pointer bg-[#121212]">
                    <img
                      src={img}
                      className="w-full h-auto block opacity-90 group-hover:opacity-100 transition-opacity object-contain"
                      alt={`Testimonial ${idx + 1}`}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              ))}
            </div>
            {/* Fade overlay - hidden on mobile, cinematic on desktop */}
            <div className="hidden md:block absolute bottom-0 left-0 w-full h-[400px] bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent z-20 pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: PAIN AGITATION (CINEMATIC VIDEO + SCRIBBLES) ================= */}
      <section className="py-16 md:py-32 px-6 bg-[#050505] relative z-20 md:-mt-32">
        {/* Deep Red Ambient Glow Behind Tutorial Hell */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[800px] pointer-events-none z-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(180,30,30,0.08) 0%, rgba(120,20,20,0.04) 40%, transparent 70%)',
          }}
        />
        <div className="max-w-7xl mx-auto">
          
          {/* 1. HEADLINE AREA */}
          <div className="text-center mb-10 md:mb-16 relative z-10">
            <span className="inline-block text-zinc-400 text-sm md:text-base font-medium tracking-widest uppercase mb-4">More Gear. More Plugins. Same Results.</span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.05em] md:font-bold mb-6 text-white leading-[1.1] problem-headline-gear">
              You're Not Short On Talent. You're Stuck In <br />
              <span className="bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">The Wrong Habits.</span>
            </h2>
            <p className="text-zinc-500 text-base md:text-lg font-light max-w-xl mx-auto leading-relaxed">
              You've spent thousands on plugins, sample packs, and gear upgrades. <span className="text-zinc-400">Your tracks still don't sound like what you hear on Spotify.</span>
            </p>
          </div>

          {/* 2. CINEMATIC GRID LAYOUT */}
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
            
            {/* LEFT COLUMN TEXT */}
            <div className="md:w-1/4 space-y-6 md:space-y-12 text-center order-2 md:order-1 relative z-10">
              
              {/* Item 1 */}
              <div className="rounded-xl border border-zinc-800 border-t border-t-white/10 bg-gradient-to-b from-zinc-900 via-[#0A0A0A] to-black backdrop-blur-sm p-4 md:p-5 space-y-1.5 relative">
                <h4 className="text-white font-medium text-base md:text-lg flex items-start gap-2">
                  <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  How many plugins have you bought that changed nothing?
                </h4>
                <p className="text-zinc-500 text-sm leading-relaxed pl-7">
                  Every new tool promises a breakthrough. None of them fix what's actually wrong.
                </p>
              </div>
              
              {/* Item 2 */}
              <div className="rounded-xl border border-zinc-800 border-t border-t-white/10 bg-gradient-to-b from-zinc-900 via-[#0A0A0A] to-black backdrop-blur-sm p-4 md:p-5 space-y-1.5 relative">
                <h4 className="text-white font-medium text-base md:text-lg flex items-start gap-2">
                  <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  Still think better gear is what's missing?
                </h4>
                <p className="text-zinc-500 text-sm leading-relaxed pl-7">
                  The producers behind the biggest records are using the same stock plugins you already own. The difference isn't equipment.
                </p>
              </div>
            </div>

            {/* CENTER VIDEO (THE VIGNETTE) */}
            <div className="md:w-1/2 order-1 md:order-2 relative flex justify-center">
              {/* Glow Effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#D3FF02]/5 blur-[80px] rounded-full pointer-events-none"></div>
              
              <div className="relative w-full max-w-md aspect-square overflow-visible flex items-center justify-center">
                <img 
                  src={usingAbletonGif}
                  alt="Using Ableton"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover opacity-90 scale-110"
                  style={{
                    objectPosition: '60% center', 
                    maskImage: 'radial-gradient(circle, black 50%, transparent 75%)',
                    WebkitMaskImage: 'radial-gradient(circle, black 50%, transparent 75%)'
                  }}
                />
              </div>
            </div>

            {/* RIGHT COLUMN TEXT */}
            <div className="md:w-1/4 space-y-6 md:space-y-12 text-center order-3 relative z-10">
              
              {/* Item 3 */}
              <div className="rounded-xl border border-zinc-800 border-t border-t-white/10 bg-gradient-to-b from-zinc-900 via-[#0A0A0A] to-black backdrop-blur-sm p-4 md:p-5 space-y-1.5 relative">
                <h4 className="text-white font-medium text-base md:text-lg flex items-start gap-2">
                  <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  Can you take a track from idea to master without getting stuck?
                </h4>
                <p className="text-zinc-500 text-sm leading-relaxed pl-7">
                  You know bits of everything but have no complete workflow. Every track is a different experiment with no repeatable process.
                </p>
              </div>
              
              {/* Item 4 */}
              <div className="rounded-xl border border-zinc-800 border-t border-t-white/10 bg-gradient-to-b from-zinc-900 via-[#0A0A0A] to-black backdrop-blur-sm p-4 md:p-5 space-y-1.5 relative">
                <h4 className="text-white font-medium text-base md:text-lg flex items-start gap-2">
                  <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  Spending hours on sound design before the arrangement works?
                </h4>
                <p className="text-zinc-500 text-sm leading-relaxed pl-7">
                  Hours tweaking kicks and EQ curves on tracks that were never structured properly in the first place.
                </p>
              </div>
            </div>
          </div>

          {/* Connector Line to Solution */}
          <div className="pb-0 md:mt-24 flex flex-col items-center opacity-20">
            <div className="w-[1px] h-20 md:h-24 bg-gradient-to-b from-white via-white to-transparent"></div>
          </div>

        </div>
      </section>

      {/* ================= SECTION 3: THE SOLUTION (RESTRUCTURED) ================= */}
      <section className="relative bg-[#050505] z-20 border-t border-white/5 pt-0 pb-0">

        {/* 1. CINEMATIC IMAGE HEADER */}
        <div className="relative w-full flex justify-center">
          {/* Height: Mobile 600px, Desktop 800px */}
          <div className="relative w-full max-w-6xl h-[600px] md:h-[800px] overflow-hidden">
            
            {/* MOBILE IMAGE */}
            <img 
              src={robMarshmello}
              className="block md:hidden w-full h-full object-cover object-top opacity-100 brightness-[1.15]"
              alt="Rob and Marshmello Mobile"
              loading="lazy"
              decoding="async"
            />
            
            {/* DESKTOP IMAGE */}
            <img 
              src={robHomeStudioWide}
              className="hidden md:block w-full h-full object-cover object-center opacity-80"
              alt="Rob in Home Studio Desktop"
              loading="lazy"
              decoding="async"
            />
            
            {/* Top Fade - Smooth transition from previous section */}
            <div className="absolute top-0 left-0 w-full h-24 md:h-40 bg-gradient-to-b from-[#050505] to-transparent z-10"></div>
            
            {/* Bottom Fade - DEEP VIGNETTE for text readability */}
            {/* Starts solid at bottom and reaches transparency at 60% height */}
            <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent z-10"></div>
            
            {/* Side Fades - Desktop only for cinematic framing */}
            <div className="hidden md:block absolute top-0 left-0 w-48 h-full bg-gradient-to-r from-[#050505] to-transparent z-10"></div>
            <div className="hidden md:block absolute top-0 right-0 w-48 h-full bg-gradient-to-l from-[#050505] to-transparent z-10"></div>
          </div>
        </div>

        {/* 2. CONTENT CONTAINER */}
        <div className="max-w-7xl mx-auto px-6 relative z-20 -mt-12 md:z-10 md:-mt-[350px]">
          <div className="text-center mb-6 md:mb-12 max-w-4xl mx-auto">
            <div className="inline-block mb-5">
              <span className="py-1.5 px-4 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-300 text-xs font-bold uppercase tracking-widest">
                HERE'S HOW TO FIX IT
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.05em] md:font-bold mb-0 text-white drop-shadow-2xl leading-[1.1]">
              What's Inside The <span className="bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">Blueprint.</span>
            </h2>
          </div>

          {/* The Bridge Subheadline */}
          <p className="text-base md:text-lg text-zinc-400 font-medium text-center mt-8 mb-10 max-w-2xl mx-auto leading-relaxed">
            Everything Rob uses to <span className="text-zinc-300">produce, mix, and master</span> release-ready tracks from a <span className="text-zinc-300">home studio</span>, and turn that skill into real income. The same workflow behind his sessions with <span className="text-zinc-300">major artists</span>.
          </p>

          {/* 3. FEATURE CARDS WITH ISOLATED LIGHTING */}
          <div className="relative isolate mb-20">
            <div 
              className="absolute inset-0 pointer-events-none z-0"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.10) 0%, rgba(200,200,200,0.05) 45%, transparent 75%)'
              }}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {[
                { id: "01", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>, title: "How to go from \"Loop Phase\" to finished record", desc: "Stop hoarding unfinished ideas. Watch Rob's personal workflow for taking a track from a 4-bar loop to a complete arrangement. No rigid frameworks - just the fluid process of actually finishing songs." },
                { id: "02", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>, title: "The \"Bedroom\" mixing standard for label-ready tracks", desc: "You don't always need a pro engineer. Learn the functional mixing and mastering process Rob uses to get tracks ready for label demos, live sets, or streaming releases - all from a laptop on the road." },
                { id: "03", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>, title: "Session-proven chains used with major artists", desc: "Your mixes sound thin because your processing is wrong. Copy the exact vocal and drum chains Rob uses in sessions with major artists to get that loud, punchy commercial sound without over-complicating it." },
                { id: "04", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>, title: "How to design professional sounds with intent", desc: "Stop relying on happy accidents. Learn the fundamentals of sound design so you can build the exact 808s, leads, and pads you hear in your head, rather than endlessly hunting through Splice folders." }
              ].map((card) => (
                <div key={card.id} className="bg-gradient-to-b from-zinc-900 via-[#0A0A0A] to-black border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group hover:border-zinc-600 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:scale-[1.01] transition-all duration-500">
                  <div className="absolute top-0 right-0 p-4 font-black text-6xl text-white/[0.03] select-none pointer-events-none">{card.id}</div>
                  <div className="relative z-10">
                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mb-6 text-zinc-400">
                      {card.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. FOOTER CLOSER */}
          <div className="text-center pb-24 max-w-3xl mx-auto">
            <p className="text-xl md:text-2xl text-white font-medium leading-relaxed mb-12">
              Learn top creative workflows with <span className="text-white font-bold">an over-the-shoulder look</span> at how Rob Late goes from idea to finished song.
            </p>
            <button className="group inline-flex items-center gap-3 text-white text-lg font-medium hover:text-white transition-all">
              <span className="border-b border-white/30 pb-0.5 group-hover:border-white">See The Curriculum</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ================= VISUAL EVIDENCE: STUDIO POV ================= */}
      <section className="relative z-10 px-6 py-16 pointer-events-none bg-black">
        <div className="max-w-lg mx-auto relative flex flex-col items-center justify-center">
          
          {/* 1. The Backlight Glow 
              (Purple/Blue ambient light to match the photo) 
          */}
          <div className="absolute inset-0 bg-white/5 blur-[80px] rounded-full transform scale-75 z-0"></div>

          {/* 2. Square Video Container */}
          <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden ring-1 ring-white/10 z-10">
            <video 
              src={robWorking3Loop} 
              autoPlay loop muted playsInline
              preload="none"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        {/* Vertical connector line */}
        <div className="flex flex-col items-center mt-16 opacity-20">
          <div className="w-[1px] h-20 md:h-24 bg-gradient-to-b from-white via-white to-transparent"></div>
        </div>
      </section>

      {/* ================= SECTION: THE ORIGIN STORY (MEET YOUR INSTRUCTOR) ================= */}
      <section className="relative w-full bg-black pt-12 pb-24 px-4 overflow-x-hidden">
        
        {/* Subtle radial glow behind the content */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-zinc-800/30 blur-[120px] rounded-full pointer-events-none z-0" />
        
        <div className="relative max-w-7xl mx-auto z-10">
          
          {/* Header */}
          <div className="text-center mb-24 space-y-4">
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500 font-medium">Meet Your Instructor</p>
            <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter">
              <span className="inline-flex items-center">
                Rob Late.
                <svg 
                  viewBox="0 0 22 22" 
                  className="ml-3 h-[0.6em] w-[0.6em] drop-shadow-[0_0_8px_rgba(0,149,246,0.3)]"
                  aria-label="Verified"
                >
                  <path 
                    fill="#0095F6" 
                    d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"
                  />
                </svg>
              </span>
              {" "}Producer.
            </h2>
            <p className="text-xl text-zinc-400 font-medium">
              Credits: The Chainsmokers, Marshmello, Clean Bandit, Gary Barlow.
            </p>
            <p className="text-zinc-500 font-bold tracking-wide text-sm uppercase">
              (All produced from a home studio)
            </p>
          </div>

          {/* Grid Layout */}
          <div className="relative">
            <div 
              className="absolute inset-0 pointer-events-none z-0"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.10) 0%, rgba(200,200,200,0.05) 45%, transparent 75%)'
              }}
            />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 relative z-10">
            
            {/* ITEM 1: 2019 - Peek left on mobile */}
            <div className="relative flex flex-col items-center group transition-all duration-500 md:mt-0">
              <div className="relative bg-white p-3 pb-8 shadow-2xl drop-shadow-2xl md:drop-shadow-none transform transition-transform duration-300 hover:scale-105 hover:z-20 w-[65%] -translate-x-8 md:w-full md:translate-x-0 max-w-[200px] md:max-w-[280px] -rotate-2">
                <div className="aspect-square bg-gray-200 overflow-hidden mb-4 contrast-125 transition-all duration-500">
                  <img src={robFirstStudio} alt="The 9-5 Grind" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                </div>
                <p className="text-center font-mono text-xs tracking-widest text-gray-800 uppercase">
                  2019: THE GRIND
                </p>
              </div>
              <div className="mt-8 text-center max-w-[240px] overflow-hidden">
                <h3 className="text-white text-xl font-bold mb-3 relative inline-block">
                  <span className="relative z-10">The 9-5 Grind</span>
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-[hsl(var(--pen-highlight)/0.9)] -z-10 -rotate-1 skew-x-12 block" />
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  I was working a sales job for a phone mount company, producing music as a 'hobby' in the evenings. Couple of super cheap production gigs here and there. This was my first setup - simple speakers, mic and interface. All you need!
                </p>
              </div>
            </div>

            {/* ITEM 2: 2020 - Peek right on mobile */}
            <div className="relative flex flex-col items-center group transition-all duration-500 md:mt-32">
              <div className="relative bg-white p-3 pb-8 shadow-2xl drop-shadow-2xl md:drop-shadow-none transform transition-transform duration-300 hover:scale-105 hover:z-20 w-[65%] translate-x-8 md:w-full md:translate-x-0 max-w-[200px] md:max-w-[280px] rotate-1">
                <div className="aspect-square bg-gray-200 overflow-hidden mb-4 contrast-125 transition-all duration-500">
                  <img src={robLockdownStudio} alt="The Lockdown Era" className="w-full h-full object-cover object-center" loading="lazy" decoding="async" />
                </div>
                <p className="text-center font-mono text-xs tracking-widest text-gray-800 uppercase">
                  2020: LOCKDOWN
                </p>
              </div>
              <div className="mt-8 text-center max-w-[240px] overflow-hidden">
                <h3 className="text-white text-xl font-bold mb-3 relative inline-block">
                  <span className="relative z-10">The Lockdown Era</span>
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-[hsl(var(--pen-highlight)/0.9)] -z-10 -rotate-1 skew-x-12 block" />
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Stuck in a spare room in my London flat during lockdown, I started taking remote sessions. I posted some Reels sampling random objects in my studio. A few started getting views. I didn't know it yet, but everything changed right here.
                </p>
              </div>
            </div>

            {/* ITEM 3: 2021 - Peek left on mobile */}
            <div className="relative flex flex-col items-center group transition-all duration-500 md:mt-0">
              <div className="relative bg-white p-3 pb-8 shadow-2xl drop-shadow-2xl md:drop-shadow-none transform transition-transform duration-300 hover:scale-105 hover:z-20 w-[65%] -translate-x-8 md:w-full md:translate-x-0 max-w-[200px] md:max-w-[280px] -rotate-1">
                <div className="aspect-square bg-gray-200 overflow-hidden mb-4 contrast-125 transition-all duration-500">
                  <img src={robChainsmokers} alt="The Breakthrough" className="w-full h-full object-cover object-top" />
                </div>
                <p className="text-center font-mono text-xs tracking-widest text-gray-800 uppercase">
                  2021: BREAKTHROUGH
                </p>
              </div>
              <div className="mt-8 text-center max-w-[240px] overflow-hidden">
                <h3 className="text-white text-xl font-bold mb-3 relative inline-block">
                  <span className="relative z-10">The Breakthrough</span>
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-[hsl(var(--pen-highlight)/0.9)] -z-10 -rotate-1 skew-x-12 block" />
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  My content was going viral, followers growing. Drew from <span className="text-white font-semibold">The Chainsmokers</span> DM'd me after seeing a video and we started working on music together. No management, no label connections at this point - just making cool music & getting reach with content.
                </p>
              </div>
            </div>

            {/* ITEM 4: 2022 - Peek right on mobile */}
            <div className="relative flex flex-col items-center group transition-all duration-500 md:mt-32">
              <div className="relative bg-white p-3 pb-8 shadow-2xl drop-shadow-2xl md:drop-shadow-none transform transition-transform duration-300 hover:scale-105 hover:z-20 w-[65%] translate-x-8 md:w-full md:translate-x-0 max-w-[200px] md:max-w-[280px] rotate-2">
                <div className="aspect-square bg-gray-200 overflow-hidden mb-4 contrast-125 transition-all duration-500">
                  <img src={robGaryBarlow} alt="The A-List Sessions" className="w-full h-full object-cover object-center" loading="lazy" decoding="async" />
                </div>
                <p className="text-center font-mono text-xs tracking-widest text-gray-800 uppercase">
                  2022: A-LIST
                </p>
              </div>
              <div className="mt-8 text-center max-w-[240px] overflow-hidden">
                <h3 className="text-white text-xl font-bold mb-3 relative inline-block">
                  <span className="relative z-10">The A-List Sessions</span>
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-[hsl(var(--pen-highlight)/0.9)] -z-10 -rotate-1 skew-x-12 block" />
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  The major artist sessions started stacking up: Marshmello, Clean Bandit, Gary Barlow. The crazy part is I was still doing it all from a home setup, proving you don't need a million-dollar facility to play at the top level.
                </p>
              </div>
            </div>

            {/* ITEM 5: TODAY - Peek left on mobile */}
            <div className="relative flex flex-col items-center group transition-all duration-500 md:mt-0">
              <div className="relative bg-white p-3 pb-8 shadow-2xl drop-shadow-2xl md:drop-shadow-none transform transition-transform duration-300 hover:scale-105 hover:z-20 w-[65%] -translate-x-8 md:w-full md:translate-x-0 max-w-[200px] md:max-w-[280px] -rotate-1">
                <div className="aspect-square bg-gray-200 overflow-hidden mb-4 contrast-125 transition-all duration-500">
                  <img src={robMarsmelloCropped} alt="The Producer Blueprint" className="w-full h-full object-cover object-center" loading="lazy" decoding="async" />
                </div>
                <p className="text-center font-mono text-xs tracking-widest text-gray-800 uppercase">
                  TODAY: THE BLUEPRINT
                </p>
              </div>
              <div className="mt-8 text-center max-w-[240px] overflow-hidden">
                <h3 className="text-white text-xl font-bold mb-3 relative inline-block">
                  <span className="relative z-10">The Producer Blueprint</span>
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-[hsl(var(--pen-highlight)/0.9)] -z-10 -rotate-1 skew-x-12 block" />
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  100 Million+ streams later, I moved house and built a dedicated space in my garage. It's still a home studio. It's basically the same gear. I just have fancier lights now.
                </p>
              </div>
            </div>

          </div>
          </div>

          {/* TIMELINE FOOTER - Quote & Signature */}
          <div className="mt-32 max-w-3xl mx-auto text-center">
            <div className="relative p-8">
              <h4 className="text-white font-medium tracking-tight text-2xl md:text-3xl leading-relaxed mb-6">
                "For me, the real 'producer blueprint' is a solid income from 'making music', doing what we all love. Having control over your time. No boss."
              </h4>
              <p className="text-[#D3FF02] font-bold uppercase tracking-widest text-sm mb-12">
                Priceless.
              </p>
              {/* Signature Image */}
              <div className="flex justify-center">
                <img 
                  src={robLateSignature} 
                  alt="Rob Late" 
                  className="h-20 w-auto object-contain opacity-80" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: CURRICULUM */}
      <CurriculumSection onScrollToPricing={(loc) => trackScrollToPricing({ cta_location: loc })} />



        {/* ================= WALL OF WINS SECTION ================= */}
        <section id="testimonials" className="relative py-12 md:py-24 overflow-x-clip scroll-mt-20">
          
          {/* Background Ambient Glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D3FF02]/5 rounded-full blur-[150px]" />
          </div>

          <div className="max-w-6xl mx-auto px-6 relative z-10">
            
            {/* HEADER */}
            <div className="text-center mb-10 md:mb-16">
              <span className="inline-block border border-zinc-700 text-zinc-300 bg-zinc-900/50 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
                Student Wins
              </span>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tighter leading-[1.05] text-white mb-4 md:mb-6">
                Real Results. <span className="font-serif italic font-normal tracking-normal text-zinc-200">Real Producers.</span>
              </h2>
              <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto">
                Real feedback from producers who are finally finishing their best music.
              </p>
            </div>

            {/* ================= SCROLLABLE GALLERY ================= */}
            <div 
              className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory gap-4 pb-8 -mx-6 px-6 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0 md:mx-0 md:px-0 scrollbar-hide mb-20"
              style={{ WebkitOverflowScrolling: 'touch', transform: 'translateZ(0)' }}
            >
              <TestimonialCard
                id="kiera"
                name="Kosana"
                handle="@djkosana"
                title="International DJ"
                media={djkieraTestimonial}
                isVideo={true}
                quote="An investment worth making."
                avatar={avatarKosana}
                poster={djkieraThumbnail}
                activeVideoId={activeVideoId}
                onPlay={setActiveVideoId}
              />
              <TestimonialCard
                id="david"
                name="Chris Georgiou"
                handle="@tokotamusic"
                title="Label-Signed Producer"
                media={test1Testimonial}
                isVideo={true}
                quote="The price of the course alone is worth it based on Rob showing how he creates his content."
                avatar={avatarChrisGeorgiou}
                poster={test1Thumbnail}
                activeVideoId={activeVideoId}
                onPlay={setActiveVideoId}
              />
              <TestimonialCard
                id="sarah"
                name="Marcus Cole"
                handle=""
                title="Music Producer"
                media={streamingNumbersTestimonial}
                isVideo={false}
                quote="Watch the full testimonial."
                avatar={streamingNumbersTestimonial}
                activeVideoId={activeVideoId}
                onPlay={setActiveVideoId}
              />
              
              {/* Spacer for mobile scrolling */}
              <div className="w-2 shrink-0 md:hidden"></div>
            </div>

            {/* WALL OF PROOF (Masonry with 10 Images) */}
            <div className="mt-8">
              <p className="text-center text-zinc-500 text-sm uppercase tracking-widest mb-10">
                More Feedback From Producers
              </p>
              
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                
                {/* Screenshot 1 */}
                <div className="feedback-card break-inside-avoid rounded-2xl border-0 overflow-hidden shadow-2xl transition-transform duration-300 bg-white/[0.02] md:bg-transparent md:border md:border-white/10">
                  <img src={drewAdieuTestimonial} alt="Student feedback" className="w-full h-auto opacity-90 hover:opacity-100 transition-opacity" loading="lazy" decoding="async" />
                </div>
                
                {/* Screenshot 2 */}
                <div className="feedback-card break-inside-avoid rounded-2xl border-0 overflow-hidden shadow-2xl transition-transform duration-300 bg-white/[0.02] md:bg-transparent md:border md:border-white/10">
                  <img src={nateSawyerTestimonial} alt="Student feedback" className="w-full h-auto opacity-90 hover:opacity-100 transition-opacity" loading="lazy" decoding="async" />
                </div>

                {/* Screenshot 3 */}
                <div className="feedback-card break-inside-avoid rounded-2xl border-0 overflow-hidden shadow-2xl transition-transform duration-300 bg-white/[0.02] md:bg-transparent md:border md:border-white/10">
                  <img src={austriaTestimonial} alt="Student feedback" className="w-full h-auto opacity-90 hover:opacity-100 transition-opacity" loading="lazy" decoding="async" />
                </div>

                {/* Screenshot 4 */}
                <div className="feedback-card break-inside-avoid rounded-2xl border-0 overflow-hidden shadow-2xl transition-transform duration-300 bg-white/[0.02] md:bg-transparent md:border md:border-white/10">
                  <img src={deepintheforestTestimonial} alt="Student feedback" className="w-full h-auto opacity-90 hover:opacity-100 transition-opacity" loading="lazy" decoding="async" />
                </div>

                {/* Screenshots 5-10: hidden on mobile until "Show More" */}
                <div className={`contents ${!showAllWallOfProof ? 'hidden sm:contents' : ''}`}>
                  {/* Screenshot 5 */}
                  <div className="feedback-card break-inside-avoid rounded-2xl border-0 overflow-hidden shadow-2xl transition-transform duration-300 bg-white/[0.02] md:bg-transparent md:border md:border-white/10">
                    <img src={completePackageTestimonial} alt="Student feedback" className="w-full h-auto opacity-90 hover:opacity-100 transition-opacity" loading="lazy" decoding="async" />
                  </div>

                  {/* Screenshot 6 */}
                  <div className="feedback-card break-inside-avoid rounded-2xl border-0 overflow-hidden shadow-2xl transition-transform duration-300 bg-white/[0.02] md:bg-transparent md:border md:border-white/10">
                    <img src={aaronly0nsYoutubeTestimonial} alt="Student feedback" className="w-full h-auto opacity-90 hover:opacity-100 transition-opacity" loading="lazy" decoding="async" />
                  </div>

                  {/* Screenshot 7 */}
                  <div className="feedback-card break-inside-avoid rounded-2xl border-0 overflow-hidden shadow-2xl transition-transform duration-300 bg-white/[0.02] md:bg-transparent md:border md:border-white/10">
                    <img src={rsmyth111Testimonial} alt="Student feedback" className="w-full h-auto opacity-90 hover:opacity-100 transition-opacity" loading="lazy" decoding="async" />
                  </div>

                  {/* Screenshot 8 */}
                  <div className="feedback-card break-inside-avoid rounded-2xl border-0 overflow-hidden shadow-2xl transition-transform duration-300 bg-white/[0.02] md:bg-transparent md:border md:border-white/10">
                    <img src={levinMusicTestimonial} alt="Student feedback" className="w-full h-auto opacity-90 hover:opacity-100 transition-opacity" loading="lazy" decoding="async" />
                  </div>

                  {/* Screenshot 9 */}
                  <div className="feedback-card break-inside-avoid rounded-2xl border-0 overflow-hidden shadow-2xl transition-transform duration-300 bg-white/[0.02] md:bg-transparent md:border md:border-white/10">
                    <img src={testimonial1} alt="Student feedback" className="w-full h-auto opacity-90 hover:opacity-100 transition-opacity" loading="lazy" decoding="async" />
                  </div>

                  {/* Screenshot 10 */}
                  <div className="feedback-card break-inside-avoid rounded-2xl border-0 overflow-hidden shadow-2xl transition-transform duration-300 bg-white/[0.02] md:bg-transparent md:border md:border-white/10">
                    <img src={testimonial2} alt="Student feedback" className="w-full h-auto opacity-90 hover:opacity-100 transition-opacity" loading="lazy" decoding="async" />
                  </div>
                </div>

              </div>
              
              {/* Show More button - mobile only */}
              {!showAllWallOfProof && (
                <button
                  onClick={() => setShowAllWallOfProof(true)}
                  className="mt-6 w-full py-3 rounded-xl border border-zinc-800 text-zinc-500 text-sm font-medium hover:text-zinc-300 hover:border-zinc-700 transition-colors sm:hidden"
                >
                  Show More Feedback
                </button>
              )}
            </div>

            {/* BRIDGE CTA - Below Social Proof Grid */}
            <div className="flex flex-col items-center mt-12 md:mt-16">
              <a 
                href="#pricing" 
                onClick={() => trackScrollToPricing({ cta_location: "below_social_proof" })}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-[#D3FF02] text-black px-6 md:px-8 py-4 rounded-2xl text-lg font-black hover:bg-[#b8e000] transition-all shadow-[0_0_40px_rgba(211,255,2,0.4)] hover:shadow-[0_0_50px_rgba(211,255,2,0.5)]"
              >
                Start Producing Professional Music
                <ArrowRight className="w-5 h-5" />
              </a>
              <p className="mt-4 text-sm font-medium text-zinc-500">Get Instant Access</p>
            </div>

          </div>
        </section>

        {/* ================= CLOSE SECTION: TWO-COLUMN CONTRAST ================= */}
        <section className="relative py-24 px-6 bg-[#050505] border-t border-zinc-900">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-zinc-800">
              
              {/* Left Column - Muted/Static */}
              <div className="bg-zinc-900/60 p-8 md:p-12 flex flex-col justify-center">
                <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest mb-4">Stay where you are</p>
                <h3 className="text-2xl md:text-3xl font-bold text-zinc-400 tracking-tighter mb-4">
                  Keep chasing the next plugin.
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  You can keep spending on new gear, new plugins, new sample packs. Keep thinking the next purchase will be the one that finally makes your music sound professional. But the producers getting real results aren't buying more. They're learning to use what they already have.
                </p>
              </div>

              {/* Right Column - Energised/Highlighted */}
              <div className="bg-[#0A0A0A] border-t md:border-t-0 md:border-l border-zinc-800 p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
                {/* Accent glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D3FF02]/10 blur-[100px] rounded-full pointer-events-none"></div>
                <div className="relative z-10">
                  <p className="text-[#D3FF02] text-xs font-bold uppercase tracking-widest mb-4">Or make the change</p>
                  <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tighter mb-4">
                    Start producing professional music from your home studio.
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                    Get instant access to the exact production workflow behind 100M+ streams. Learn how to get release-ready results from a basic home setup, no expensive gear or studio time required.
                  </p>
                  <a 
                    href="#pricing" 
                    onClick={() => trackScrollToPricing({ cta_location: "close_section" })}
                    className="inline-flex items-center justify-center gap-2 bg-[#D3FF02] text-black px-6 md:px-8 py-4 rounded-2xl text-base md:text-lg font-black hover:bg-[#b8e000] transition-all shadow-[0_0_40px_rgba(211,255,2,0.4)] hover:shadow-[0_0_50px_rgba(211,255,2,0.5)]"
                  >
                    Start Producing Professional Music
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* BRIDGE COPY + GIF */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center py-10 md:py-14">
              <div className="text-center md:text-left">
                <p className="text-lg md:text-xl text-zinc-300 leading-relaxed font-medium">
                  You've seen the difference between producers who sound professional and those who don't. It's not the gear. It's knowing how to get the most out of what you already have. The Producer Blueprint gives you the complete production workflow to do exactly that.
                </p>
              </div>
              <div className="flex justify-center relative">
                <div className="relative group max-w-md w-full">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#D3FF02]/20 blur-[100px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                  <video autoPlay muted loop playsInline preload="none" src={robChainsmokersGif}
                    className="relative z-10 w-full rounded-2xl border border-white/10 drop-shadow-2xl transform hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CHECKOUT SECTION ================= */}
        <section id="pricing" className="relative py-24 md:py-32 scroll-mt-20">
          <div className="max-w-xl mx-auto px-6">
            
            {/* Headline */}
            <div className="text-center mb-10 md:mb-16">
              <div className="inline-block mb-4">
                <span className="py-1.5 px-4 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-300 text-xs font-bold uppercase tracking-widest">
                  COMPLETE YOUR ORDER
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 tracking-tighter">
                Join The Producer <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400 drop-shadow-[0_0_25px_rgba(255,255,255,0.25)]">Blueprint<span className="text-white">™</span></span>
              </h2>
              <p className="text-zinc-400 text-base md:text-xl max-w-2xl mx-auto">
                Get immediate access to the complete program, templates, and <span className="text-white font-bold">2 FREE bonuses</span>.
              </p>
            </div>

            {/* Checkout Card */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
              
              {/* SSL Badge */}
              <div className="flex items-center justify-center gap-2 mb-6 pb-6 border-b border-zinc-800">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span className="text-zinc-400 text-xs uppercase tracking-wider font-medium">256-Bit SSL Secure</span>
              </div>

              <div className="space-y-6">
                
                {/* Product Info */}
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
                    <img src={producerBlueprintThumbnail} alt="Program Thumbnail" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex justify-between items-start">
                    <div>
                      <p className="text-white font-semibold text-lg">The Producer Blueprint™</p>
                      <p className="text-zinc-500 text-sm">Complete 8-Module Program</p>
                    </div>
                    <div className="text-right">
                      <span className="text-zinc-500 line-through text-sm block">$941</span>
                      <span className="text-white font-bold text-xl">$297</span>
                      <p className="text-zinc-500 text-[10px] mt-0.5">12 months full access. One-time payment.</p>
                    </div>
                  </div>
                </div>

                {/* Bonus Line Items */}
                <div className="space-y-2 border-t border-zinc-800 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#D3FF02] shrink-0" />
                      <span className="text-zinc-300 text-sm">BONUS: Ableton Project Files & Templates</span>
                    </div>
                    <span className="text-green-400 text-xs font-bold uppercase tracking-wider bg-green-400/10 px-2 py-0.5 rounded">Free</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#D3FF02] shrink-0" />
                      <span className="text-zinc-300 text-sm">BONUS: Rob's IG/TikTok Breakdown Vault</span>
                    </div>
                    <span className="text-green-400 text-xs font-bold uppercase tracking-wider bg-green-400/10 px-2 py-0.5 rounded">Free</span>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-zinc-400 text-sm mb-2">Full Name</label>
                    <input
                      ref={nameRef}
                      type="text"
                      placeholder="Your full name"
                      className="w-full bg-zinc-800/50 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#D3FF02]/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-sm mb-2">Email Address</label>
                    <input
                      ref={emailRef}
                      type="email"
                      placeholder="you@example.com"
                      className="w-full bg-zinc-800/50 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#D3FF02]/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Order Bump */}
                <div 
                  className={`border-2 border-dashed rounded-xl p-4 transition-all duration-300 ${
                    orderBumpAdded 
                      ? 'border-[#D3FF02]/40 bg-[#D3FF02]/5' 
                      : 'border-zinc-600'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="orderBump"
                      checked={orderBumpAdded}
                      onChange={(e) => {
                        setOrderBumpAdded(e.target.checked);
                        if (e.target.checked) {
                          trackOrderBumpChecked({ value: 37 });
                        }
                      }}
                      className="mt-1.5 w-5 h-5 rounded border-zinc-600 bg-zinc-800 text-[#D3FF02] focus:ring-[#D3FF02] focus:ring-offset-0 cursor-pointer"
                    />
                    <label htmlFor="orderBump" className="cursor-pointer flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="inline-block bg-white text-black text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                          Add-on
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-500 line-through text-sm">$105</span>
                          <span className="text-white font-bold">+$37</span>
                        </div>
                      </div>
                      <p className="text-white font-semibold mb-1">
                        Rob's Effects Chains 🎛️
                      </p>
                      <p className="text-zinc-400 text-sm">
                        8 signature Ableton racks from Rob's sessions. His vocal chain, creative vocal FX, sub bass processor, drum bus glue, snare enhancer, kick fattener, vibe/saturation tool, and tension builder. 100% stock plugins - drag, drop, done.
                      </p>
                      <p className="text-zinc-500 text-xs mt-1">
                        Requires Ableton 11 Standard or above.
                      </p>
                    </label>
                  </div>
                </div>

                {/* Total & CTA */}
                <div className="pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-zinc-400">Total Due Today:</span>
                    <span className="text-2xl font-bold text-white">${orderBumpAdded ? '334.00' : '297.00'}</span>
                  </div>

                  <button
                    onClick={() => {
                      trackFinalCheckoutClick({ value: orderBumpAdded ? 334 : 297, order_bump_selected: orderBumpAdded });
                      handleCheckout(orderBumpAdded);
                    }}
                    disabled={isLoading}
                    className="w-full bg-[#D3FF02] hover:bg-[#b8e000] text-black font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-[#D3FF02]/25 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        Start Producing Professional Music
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  {/* Trust Badges - Updated for Compliance */}
                  <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mt-6 pt-6 border-t border-zinc-800">
                    <div className="flex items-center gap-2 text-zinc-500 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-zinc-500" />
                      <span>SECURE PAYMENT</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 text-sm">
                      <Check className="w-4 h-4 text-zinc-500" />
                      <span>1 YEAR ACCESS</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 text-sm">
                      <Check className="w-4 h-4 text-zinc-500" />
                      <span>ONE-TIME PAYMENT</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FAQ SECTION ================= */}
        <section className="py-24 px-6 bg-[#050505] border-t border-zinc-900">
          <div className="max-w-3xl mx-auto">
            
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tighter">
                Frequently Asked Questions
              </h2>
              <p className="text-zinc-400">
                Everything you need to know about The Producer Blueprint.
              </p>
            </div>

            <div className="space-y-4">
              
              {/* FAQ ITEM 1 */}
              <div className="border border-zinc-800 rounded-xl bg-[#0A0A0A] overflow-hidden">
                <details className="group">
                  <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-white hover:text-[#D3FF02] transition-colors">
                    <span>Do I need to use Ableton Live?</span>
                    <span className="transition group-open:rotate-180">
                      <ChevronDown className="w-5 h-5" />
                    </span>
                  </summary>
                  <div className="text-zinc-400 text-sm px-6 pb-6 leading-relaxed">
                    I teach everything in <strong>Ableton Live</strong> and include my personal project files/templates for Ableton. However, the <em>principles</em> of sound design, arrangement, mixing, and vocal production apply to any DAW (FL Studio, Logic, Pro Tools). We have had plenty of students take the course working in other DAWs like Logic and FL Studio who have had huge success, and some who have used it as a chance to make the DAW switch! If you use another DAW, you can still get massive value, but you won't be able to open the project files.
                  </div>
                </details>
              </div>

              {/* FAQ ITEM 2 - GENRES */}
              <div className="border border-zinc-800 rounded-xl bg-[#0A0A0A] overflow-hidden">
                <details className="group">
                  <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-white hover:text-[#D3FF02] transition-colors">
                    <span>What genres is this for?</span>
                    <span className="transition group-open:rotate-180">
                      <ChevronDown className="w-5 h-5" />
                    </span>
                  </summary>
                  <div className="text-zinc-400 text-sm px-6 pb-6 leading-relaxed">
                    This is a <strong>multi-genre course</strong>. Rob's known for his Pop and EDM productions, so it's centred around this. However, the principles of this approach are universal and Rob works across multiple genres.
                  </div>
                </details>
              </div>

              {/* FAQ ITEM 3 */}
              <div className="border border-zinc-800 rounded-xl bg-[#0A0A0A] overflow-hidden">
                <details className="group">
                  <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-white hover:text-[#D3FF02] transition-colors">
                    <span>Do I need expensive 3rd party plugins?</span>
                    <span className="transition group-open:rotate-180">
                      <ChevronDown className="w-5 h-5" />
                    </span>
                  </summary>
                  <div className="text-zinc-400 text-sm px-6 pb-6 leading-relaxed">
                    No. While I do show you my favorite paid plugins (like Serum, FabFilter, etc.), I always explain the <strong>fundamental concept</strong> first. I also dedicate entire sections to "Stock Plugin" alternatives. You can achieve professional results with stock tools if you know how to use them.
                  </div>
                </details>
              </div>

              {/* FAQ ITEM 3 */}
              <div className="border border-zinc-800 rounded-xl bg-[#0A0A0A] overflow-hidden">
                <details className="group">
                  <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-white hover:text-[#D3FF02] transition-colors">
                    <span>Is this course for beginners?</span>
                    <span className="transition group-open:rotate-180">
                      <ChevronDown className="w-5 h-5" />
                    </span>
                  </summary>
                  <div className="text-zinc-400 text-sm px-6 pb-6 leading-relaxed">
                    This course is designed for <strong>Intermediate</strong> producers who know the basics but are stuck in the "loop phase" or aren't happy with their mix quality. However, I have included a "Module 1: Foundation" specifically for beginners or those switching to Ableton to get you up to speed fast.
                  </div>
                </details>
              </div>

              {/* FAQ ITEM 4 */}
              <div className="border border-zinc-800 rounded-xl bg-[#0A0A0A] overflow-hidden">
                <details className="group">
                  <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-white hover:text-[#D3FF02] transition-colors">
                    <span>How long do I get access for?</span>
                    <span className="transition group-open:rotate-180">
                      <ChevronDown className="w-5 h-5" />
                    </span>
                  </summary>
                  <div className="text-zinc-400 text-sm px-6 pb-6 leading-relaxed">
                    You get <strong>12 months of access</strong> to the full course, all downloads, and any updates released during that period. This is a one-time payment, not a subscription.
                  </div>
                </details>
              </div>
              
              {/* FAQ ITEM 5 */}
              <div className="border border-zinc-800 rounded-xl bg-[#0A0A0A] overflow-hidden">
                <details className="group">
                  <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-white hover:text-[#D3FF02] transition-colors">
                    <span>When do I get access?</span>
                    <span className="transition group-open:rotate-180">
                      <ChevronDown className="w-5 h-5" />
                    </span>
                  </summary>
                  <div className="text-zinc-400 text-sm px-6 pb-6 leading-relaxed">
                     Instantly. As soon as you complete your order, you'll receive an email with your login details to the private portal. You can start watching immediately.
                     <br /><br />
                     <em>Note: Due to the digital nature of this product (downloadable files/templates), all sales are final.</em>
                  </div>
                </details>
              </div>

            </div>
          </div>
        </section>

        {/* ================= WHO THIS IS FOR / NOT FOR ================= */}
        <section className="py-24 px-6 bg-[#050505] border-t border-zinc-900">
          <div className="max-w-4xl mx-auto">
            
            <div className="grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-zinc-800">
              
              {/* Left: This is for you */}
              <div className="bg-zinc-900/40 p-8 md:p-10">
                <h3 className="text-xl font-bold text-white mb-6 tracking-tight">This is for you if...</h3>
                <ul className="space-y-4">
                  {[
                    "You want to produce professional-sounding music without spending thousands on gear",
                    "You're tired of buying plugins and presets hoping they'll fix your sound",
                    "You're ready to learn the production skills that actually make the difference",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#D3FF02] shrink-0 mt-0.5" />
                      <span className="text-zinc-300 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right: This isn't for you */}
              <div className="bg-[#0A0A0A] border-t md:border-t-0 md:border-l border-zinc-800 p-8 md:p-10">
                <h3 className="text-xl font-bold text-white mb-6 tracking-tight">This isn't for you if...</h3>
                <ul className="space-y-4">
                  {[
                    "You'd rather keep buying gear than learn how to use what you have",
                    "You're expecting a magic plugin that does the work for you",
                    "You're not willing to put in the hours to develop real production skills",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <X className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
                      <span className="text-zinc-500 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA Below */}
            <div className="flex flex-col items-center mt-12">
              <a 
                href="#pricing" 
                onClick={() => trackScrollToPricing({ cta_location: "who_this_is_for" })}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-[#D3FF02] text-black px-6 md:px-8 py-4 rounded-2xl text-lg font-black hover:bg-[#b8e000] transition-all shadow-[0_0_40px_rgba(211,255,2,0.4)] hover:shadow-[0_0_50px_rgba(211,255,2,0.5)]"
              >
                Start Producing Professional Music
                <ArrowRight className="w-5 h-5" />
              </a>
              <p className="mt-4 text-sm font-medium text-zinc-500">Get Instant Access</p>
            </div>
          </div>
        </section>

        {/* ================= ROBUST FOOTER ================= */}
        <footer className="relative z-10 bg-[#030303] border-t border-zinc-900 pt-16 pb-8 px-6">
          <div className="max-w-6xl mx-auto">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
              
              {/* Column 1: Brand */}
              <div className="lg:col-span-1">
                <h3 className="text-white font-bold text-lg mb-3">The Producer Blueprint.</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  The complete program for modern music production. From idea to release-ready master.
                </p>
                {/* Social Links removed to prevent conversion leaks */}
              </div>

              {/* Column 2: Program */}
              <div>
                <h4 className="text-zinc-400 font-bold uppercase tracking-wider text-xs mb-4">Program</h4>
                <ul className="space-y-3">
                  <li><a href="#curriculum" className="text-zinc-500 hover:text-white text-sm transition-colors">Curriculum</a></li>
                  <li><a href="#testimonials" className="text-zinc-500 hover:text-white text-sm transition-colors">Testimonials</a></li>
                  <li><a href="https://www.soundssquad.io" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white text-sm transition-colors">Student Login</a></li>
                  <li><a href="mailto:team@roblate.com" className="text-zinc-500 hover:text-white text-sm transition-colors">Support</a></li>
                </ul>
              </div>

              {/* Column 3: Legal */}
              <div>
                <h4 className="text-zinc-400 font-bold uppercase tracking-wider text-xs mb-4">Legal</h4>
                <ul className="space-y-3">
                  <li><a href="/legal/privacy-policy" className="text-zinc-500 hover:text-white text-sm transition-colors">Privacy Policy</a></li>
                  <li><a href="/legal/terms-of-service" className="text-zinc-500 hover:text-white text-sm transition-colors">Terms of Service</a></li>
                  <li><a href="/legal/earnings-disclaimer" className="text-zinc-500 hover:text-white text-sm transition-colors">Earnings Disclaimer</a></li>
                  <li><a href="/legal/refund-policy" className="text-zinc-500 hover:text-white text-sm transition-colors">Refund Policy</a></li>
                </ul>
              </div>

              {/* Column 4: Contact */}
              <div>
                <h4 className="text-zinc-400 font-bold uppercase tracking-wider text-xs mb-4">Contact</h4>
                <p className="text-zinc-500 text-sm mb-2">Have questions?</p>
                <a href="mailto:team@roblate.com" className="text-white font-medium hover:text-[#D3FF02] transition-colors">
                  team@roblate.com
                </a>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-zinc-800 pt-8">
              {/* Bottom Legal Text (Ad Compliance) */}
              <div className="text-center space-y-4">
                <p className="text-zinc-600 text-xs">
                  © {new Date().getFullYear()} Rob Late Music. All rights reserved.
                </p>
                
                <div className="max-w-3xl mx-auto space-y-3">
                  <p className="text-zinc-700 text-[10px] leading-relaxed">
                    This site is not a part of the Facebook website or Facebook Inc. Additionally, This site is NOT endorsed by Facebook in any way. FACEBOOK is a trademark of FACEBOOK, Inc.
                  </p>
                  <p className="text-zinc-700 text-[10px] leading-relaxed">
                    DISCLAIMER: The sales figures stated above are my personal sales figures. Please understand my results are not typical, I'm not implying you'll duplicate them (or do anything for that matter). Your results will vary and depend on many factors. All business entails risk as well as massive and consistent effort and action.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </footer>
    </>
  );
};

export default BelowFold004Gear;
