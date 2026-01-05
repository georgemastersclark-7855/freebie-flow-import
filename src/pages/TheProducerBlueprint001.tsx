import { useEffect, useState } from "react";
import { ArrowRight, Check, CheckCircle2, Play, Star, TrendingUp, Music2, X, Youtube, ChevronDown, ChevronUp, PlayCircle, Zap, Instagram, MessageCircle, Music, User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Assets
import testimonial1 from "@/assets/testimonials/testimonial-1.jpeg";
import testimonial2 from "@/assets/testimonials/testimonial-2.jpeg";
import testimonial3 from "@/assets/testimonials/testimonial-3.jpeg";
import austriaTestimonial from "@/assets/testimonials/austria-testimonial.jpg";
import rsmyth111Testimonial from "@/assets/testimonials/rsmyth111-testimonial.jpeg";
import levinMusicTestimonial from "@/assets/testimonials/levin-music-testimonial.jpeg";
import deepintheforestTestimonial from "@/assets/testimonials/deepintheforest-testimonial.jpg";
import nateSawyerTestimonial from "@/assets/testimonials/nate-sawyer-testimonial.jpg";
import completePackageTestimonial from "@/assets/testimonials/complete-package-testimonial.jpg";
import djkieraTestimonial from "@/assets/testimonials/djkiera-testimonial.mp4";
import chainsomokersFriday from "@/assets/album-art/chainsmokers-friday.jpeg";
import streamingNumbersTestimonial from "@/assets/testimonials/streaming-numbers-testimonial.jpg";
import drewAdieuTestimonial from "@/assets/testimonials/drew-adieu-testimonial.jpg";
import headroomRecordsTestimonial from "@/assets/testimonials/headroom-records-testimonial.jpg";
import aaronly0nsYoutubeTestimonial from "@/assets/testimonials/aaronly0ns-youtube-testimonial.jpg";
import chainsmokersNoShade from "@/assets/album-art/chainsmokers-no-shade.jpeg";
import chainsmokersSeeYouAgain from "@/assets/album-art/chainsmokers-see-you-again.jpeg";
import flawesDontBlameMe from "@/assets/album-art/flawes-dont-blame-me.jpg";
import januaryAllMyFriends from "@/assets/album-art/january-all-my-friends.jpg";
import tiandaNothingButLove from "@/assets/album-art/tianda-nothing-but-love.jpeg";
import chainsmokersTennisCourt from "@/assets/album-art/chainsmokers-tennis-court.jpeg";
import productStackMockup from "@/assets/product-stack-mockup.png";
import tutorialHellVideo from "@/assets/tutorial-hell-video.mp4";
import solutionVideo from "@/assets/solution-video.mp4";
import robMarshmello from "@/assets/rob-marshmello.jpg";
import robMarsmelloCropped from "@/assets/rob-marshmello-cropped.jpg";
import robStudio from "@/assets/rob-home-studio.jpg";
import robGaryBarlow from "@/assets/rob-gary-barlow.jpg";
import robHomeStudioWide from "@/assets/rob-home-studio-wide.jpg";
import robChainsmokers from "@/assets/rob-chainsmokers.jpg";
import robFirstStudio from "@/assets/rob-first-studio.jpg";
import robLockdownStudio from "@/assets/rob-lockdown-studio.jpg";
import earlyDaysSticker from "@/assets/early-days-sticker.png";
import nowSticker from "@/assets/now-sticker.png";
import robLateSignature from "@/assets/rob-late-signature-white.png";
import robWritingSession from "@/assets/rob-writing-session.jpg";
import vocalProductionStudio from "@/assets/vocal-production-studio.png";
import abletonSession from "@/assets/ableton-session.png";
import drumProductionGif from "@/assets/drum-production.gif";
import mixingMasteringStudio from "@/assets/mixing-mastering-studio.jpg";
import foundationLaptop from "@/assets/foundation-laptop.png";
import soundDesignStudio from "@/assets/sound-design-studio.png";
import tiktokBreakdownVault from "@/assets/tiktok-breakdown-vault.png";
import robOnLaptop from "@/assets/rob-on-laptop.jpg";
import arrangementEnergyScreenshot from "@/assets/arrangement-energy-screenshot.png";
import robPovStudio from "@/assets/rob-pov-studio-new.png";
import blueprintLaptopMockup from "@/assets/producer-blueprint-mockup.jpg";
import producerBlueprintThumbnail from "@/assets/producer-blueprint-thumbnail.jpg";
import abletonTemplatesThumbnail from "@/assets/ableton-templates-thumbnail.png";
import socialMediaBonusThumbnail from "@/assets/social-media-bonus-thumbnail.png";
import tiktokVaultThumbnail from "@/assets/tiktok-vault-thumbnail.png";
import avatarBen from "@/assets/avatars/avatar-ben.webp";
import avatarProducer1 from "@/assets/avatars/avatar-producer-1.png";
import avatarProducer2 from "@/assets/avatars/avatar-producer-2.png";
import avatarProducer3 from "@/assets/avatars/avatar-producer-3.png";

// Signature Placeholder
const robSignature = "https://placehold.co/300x100/000000/FFFFFF/png?text=Rob+Late+Signature";

// ================= CURRICULUM SECTION COMPONENT =================
const CurriculumSection = () => {
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
      image: robWritingSession,
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
  ];

  return (
    <section id="curriculum" className="py-12 md:py-24 px-4 md:px-6 bg-[#050505] relative z-20">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-10 md:mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-400 text-xs font-bold uppercase tracking-wide mb-4">
            What's Inside The Program
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white mb-4 md:mb-6">
            7 Modules. 75+ Lessons. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
              The Producer Blueprint.
            </span>
          </h2>
          <p className="text-base md:text-xl text-zinc-400 font-medium tracking-tight">
            The complete step-by-step workflow to go from <span className="text-white">"Idea"</span> to <span className="text-white">"Release Ready Song."</span>
          </p>
        </div>

        {/* STACKED LIST LAYOUT (Slim Compact + Drawer) */}
        <div className="flex flex-col gap-3 md:gap-4 mb-16 md:mb-32">
          {modules.map((module) => {
            const isOpen = expandedModule === module.id;
            
            return (
              <div 
                key={module.id}
                className={`group relative w-full border rounded-xl md:rounded-2xl overflow-hidden transition-all duration-500 ease-in-out ${
                  isOpen 
                    ? 'border-zinc-600 bg-zinc-900 shadow-[0_0_30px_rgba(255,255,255,0.05)]' 
                    : 'border-zinc-800 bg-gradient-to-b from-zinc-900 via-[#0A0A0A] to-black hover:border-zinc-700'
                }`}
              >
                {/* MOBILE: Row layout | DESKTOP: Column layout */}
                <div className="flex flex-row md:flex-col items-start md:items-stretch">
                  
                  {/* LEFT/TOP: IMAGE SECTION - stays at top-left on mobile */}
                  <div className="relative z-30 w-24 h-24 md:w-[300px] md:h-auto shrink-0 self-start">
                    <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay z-10"></div>
                    <img 
                      src={module.image} 
                      alt={module.title} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* RIGHT/BOTTOM: CONTENT SECTION */}
                  <div className="flex-1 flex flex-col relative min-w-0">
                    
                    {/* TOP SECTION: Compact View */}
                    <div className={`flex flex-col justify-center px-4 py-3 md:px-8 md:py-6 ${isOpen ? '' : 'md:h-[280px]'} shrink-0 relative z-20`}>
                      
                      {/* Background Number (Subtle Watermark) */}
                      <div className="absolute top-2 right-3 md:top-4 md:right-6 text-4xl md:text-7xl font-bold text-white/5 select-none pointer-events-none">
                        {module.id}
                      </div>

                      <div className="pr-8 md:pr-12">
                        <h3 className="text-base md:text-3xl font-bold text-white tracking-tight mb-1 md:mb-3 leading-tight md:leading-none group-hover:text-zinc-100 transition-colors">
                          {module.title}
                          {module.subtitle && (
                            <span className="hidden md:inline font-serif italic font-normal text-zinc-500 ml-2 group-hover:text-zinc-400 transition-colors">
                              {module.subtitle}
                            </span>
                          )}
                        </h3>
                        {/* Description - remove line-clamp when expanded */}
                        <p className={`text-zinc-400 text-[11px] md:text-sm leading-snug md:leading-relaxed mb-2 md:mb-6 max-w-lg font-medium group-hover:text-zinc-300 transition-colors ${isOpen ? '' : 'line-clamp-2 md:line-clamp-3'}`}>
                          {module.desc}
                        </p>
                        
                        {/* TOGGLE BUTTON - Text link on mobile, styled on desktop */}
                        <button 
                          onClick={() => toggleModule(module.id)}
                          className="inline-flex items-center text-[10px] md:text-xs font-bold tracking-[0.1em] md:tracking-[0.15em] text-zinc-500 uppercase hover:text-white transition-colors"
                        >
                          {isOpen ? 'Hide' : 'View Lessons'}
                          <span className={`ml-1.5 md:ml-2 transform transition-transform duration-300 text-sm md:text-base ${isOpen ? 'rotate-180 -translate-y-[1px]' : 'group-hover:translate-y-1'}`}>
                            ↓
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* BOTTOM SECTION: Drawer */}
                    <div 
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="border-t border-white/5 bg-black/20 p-4 md:p-8 pt-3 md:pt-4">
                        <div className="flex items-center gap-3 mb-4 md:mb-6">
                          <h4 className="text-[10px] md:text-xs font-bold text-zinc-600 uppercase tracking-widest">
                            Module Breakdown
                          </h4>
                          <div className="h-px bg-zinc-800 flex-1"></div>
                        </div>
                        
                        {/* LESSON GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 md:gap-y-3 gap-x-12">
                          {module.lessons.map((lesson, idx) => (
                            <div key={idx} className="flex items-start group/lesson cursor-default">
                              <span className="mr-2 md:mr-3 text-zinc-700 text-[10px] mt-[3px] md:mt-[5px] group-hover/lesson:text-[#D3FF02] transition-colors">▶</span>
                              <span className="text-zinc-400 text-xs md:text-sm font-medium group-hover/lesson:text-zinc-200 transition-colors">{lesson}</span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-zinc-800/50 flex justify-end">
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
        <section className="relative pb-16 md:pb-32 px-4 md:px-6 bg-[#050505] overflow-hidden">
          
          {/* VISUAL CONNECTOR */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-12 md:h-24 bg-gradient-to-b from-zinc-800 to-transparent"></div>
          
          <div className="max-w-6xl mx-auto relative z-10 pt-8 md:pt-16">
            
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
                  <div className="w-24 h-24 md:w-full md:h-56 bg-zinc-900 relative overflow-hidden shrink-0">
                    <img 
                      src={robOnLaptop}
                      alt="Social Media Module Mockup" 
                      className="absolute inset-0 w-full h-full object-cover object-[center_42%] transition-transform duration-700 group-hover:scale-105 z-0" 
                    />
                    {/* Desktop-only Value Badge on Image */}
                    <div className="hidden md:block absolute top-4 right-4 bg-black/70 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-lg z-20">
                      Value: <span className="line-through text-zinc-500 mx-1">$97</span> <span className="text-[#D3FF02]">FREE</span>
                    </div>
                  </div>

                  {/* CONTENT AREA */}
                  <div className="p-3 md:p-8 flex-1 flex flex-col bg-[#0A0A0A] relative z-20">
                    {/* Mobile: Badge on its own line */}
                    <div className="flex items-center justify-between mb-1 md:hidden">
                      <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">BONUS #1</span>
                      <span className="bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded">
                        FREE
                      </span>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-sm md:text-2xl font-bold text-white group-hover:text-[#D3FF02] transition-colors leading-tight mb-1 md:mb-3">
                      <span className="hidden md:inline text-zinc-500 text-base font-bold mr-1">BONUS #1:</span>
                      <span className="md:hidden">Social Media & Business</span>
                      <span className="hidden md:inline">Social Media, Business & Music Industry Module</span>
                    </h3>
                    
                    {/* Description - expandable on mobile */}
                    <p className={`text-zinc-400 text-[11px] md:text-sm leading-relaxed md:mb-6 md:flex-1 transition-all duration-300 ${expandedBonus === 'bonus1' ? '' : 'line-clamp-2 md:line-clamp-none'}`}>
                      Talent is only half the battle. I break down exactly how I built a following of 170k+ and how to turn your production skills into a sustainable income (Brand deals, Sample Packs, Sync, Production).
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
                  <div className="w-24 h-24 md:w-full md:h-56 bg-zinc-900 relative overflow-hidden shrink-0">
                    <img 
                      src={tiktokBreakdownVault} 
                      alt="TikTok Vault Mockup"
                      className="absolute inset-0 w-full h-full object-cover object-[center_70%] transition-transform duration-700 group-hover:scale-105 z-0" 
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
                      <span className="bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded">
                        FREE
                      </span>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-sm md:text-2xl font-bold text-white group-hover:text-[#D3FF02] transition-colors leading-tight mb-1 md:mb-3">
                      <span className="hidden md:inline text-zinc-500 text-base font-bold mr-1">BONUS #2:</span>
                      <span className="md:hidden">TikTok/IG Breakdown Vault</span>
                      <span className="hidden md:inline">Rob's TikTok/IG Breakdown Vault</span>
                    </h3>
                    
                    {/* Description - expandable on mobile */}
                    <p className={`text-zinc-400 text-[11px] md:text-sm leading-relaxed md:mb-6 md:flex-1 transition-all duration-300 ${expandedBonus === 'bonus2' ? '' : 'line-clamp-2 md:line-clamp-none'}`}>
                      The ultimate "Cheat Sheet." Get exclusive access to project files and walkthroughs of my most viral content. See the exact layers, processing, and decisions behind the videos.
                    </p>
                    
                    {/* Mobile tap hint */}
                    <span className={`md:hidden text-[10px] text-zinc-600 mt-1 transition-opacity ${expandedBonus === 'bonus2' ? 'opacity-0' : 'opacity-0'}`}>
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
          </div>
        </section>

        {/* ================= OFFER STACK SECTION (REVISED) ================= */}
        <section className="relative py-12 md:py-24 px-4 md:px-6 bg-[#050505]">
          
          {/* Connector Line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-12 md:h-24 bg-gradient-to-b from-zinc-800 to-transparent"></div>
          
          <div className="max-w-3xl mx-auto relative z-10 pt-4 md:pt-8">
            
            {/* HEADER */}
            <div className="text-center mb-10 md:mb-16">
              <div className="inline-block mb-4">
                <span className="py-1.5 px-4 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-300 text-xs font-bold uppercase tracking-widest">
                  WHAT YOU GET
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 tracking-tighter">
                Join The Producer <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400 drop-shadow-[0_0_25px_rgba(255,255,255,0.25)]">Blueprint.</span>
              </h2>
              {/* Subhead - Neutralized "2 FREE bonuses" */}
              <p className="text-zinc-400 text-base md:text-xl max-w-2xl mx-auto">
                Get immediate access to the complete system, templates, and <span className="text-white font-bold">2 FREE bonuses</span>.
              </p>
            </div>

            {/* THE STACK CARD */}
            <div className="rounded-3xl border border-zinc-800 bg-[#0A0A0A] overflow-hidden shadow-2xl shadow-black/50 relative animate-fade-in-up">
              
              {/* Subtle top lighting */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

              <div className="p-6 md:p-10">
                
                {/* LIST ITEMS */}
                <ul className="space-y-4 md:space-y-8">
                  
                  {/* ITEM 1: MAIN PROGRAM */}
                  <li className="flex flex-row gap-3 md:gap-6 items-start group relative">
                    {/* THUMBNAIL */}
                    <div className="shrink-0 w-14 h-14 md:w-24 md:h-24 bg-zinc-900 rounded-lg md:rounded-xl border border-zinc-800 overflow-hidden relative shadow-lg group-hover:border-zinc-600 transition-colors">
                      <img src={producerBlueprintThumbnail} alt="Program Thumbnail" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
                    </div>
                    
                    {/* CONTENT */}
                    <div className="flex flex-col justify-center flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base md:text-xl font-bold text-white group-hover:text-zinc-200 transition-colors leading-tight">
                          The Producer Blueprint Program™
                        </h3>
                        {/* RETAIL PRICE - Mobile Top Right */}
                        <span className="shrink-0 inline-block py-1 px-2 md:py-1.5 md:px-3 rounded-md md:rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs md:text-sm font-mono font-bold">
                          $497
                        </span>
                      </div>
                      <p className="text-zinc-400 text-xs md:text-sm mt-1 md:mt-2 leading-relaxed max-w-md">
                        The complete 7-module video program. 75+ lessons. Learn to produce top-streaming music.
                      </p>
                    </div>
                  </li>

                  {/* ITEM 2: PROJECT FILES */}
                  <li className="flex flex-row gap-3 md:gap-6 items-start group relative">
                    {/* THUMBNAIL */}
                    <div className="shrink-0 w-14 h-14 md:w-24 md:h-24 bg-zinc-900 rounded-lg md:rounded-xl border border-zinc-800 overflow-hidden relative shadow-lg group-hover:border-zinc-600 transition-colors">
                      <img src={abletonTemplatesThumbnail} alt="Files Thumbnail" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
                    </div>
                    
                    {/* CONTENT */}
                    <div className="flex flex-col justify-center flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base md:text-xl font-bold text-white group-hover:text-zinc-200 transition-colors leading-tight">
                          Ableton Project Files & Templates
                        </h3>
                        {/* RETAIL PRICE - Mobile Top Right */}
                        <span className="shrink-0 inline-block py-1 px-2 md:py-1.5 md:px-3 rounded-md md:rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs md:text-sm font-mono font-bold">
                          $197
                        </span>
                      </div>
                      <p className="text-zinc-400 text-xs md:text-sm mt-1 md:mt-2 leading-relaxed max-w-md">
                        Download the exact starting templates and finished project files Rob uses in sessions.
                      </p>
                    </div>
                  </li>

                  {/* DIVIDER */}
                  <li className="h-px bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 w-full my-4 md:my-6"></li>

                  {/* ITEM 3: BONUS 1 */}
                  <li className="flex flex-row gap-3 md:gap-6 items-start group relative">
                    {/* THUMBNAIL */}
                    <div className="shrink-0 w-14 h-14 md:w-24 md:h-24 bg-zinc-900 rounded-lg md:rounded-xl border border-zinc-800 overflow-hidden relative shadow-lg group-hover:border-zinc-600 transition-colors">
                      <img src={socialMediaBonusThumbnail} alt="Bonus 1 Thumbnail" className="w-full h-full object-cover" />
                    </div>
                    
                    {/* CONTENT */}
                    <div className="flex flex-col justify-center flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base md:text-xl font-bold text-white group-hover:text-zinc-200 transition-colors leading-tight">
                          Social Media & Business Module
                          <span className="ml-1 md:ml-2 inline-block align-middle text-[#D3FF02] text-[8px] md:text-[10px] border border-[#D3FF02]/30 bg-[#D3FF02]/10 px-1.5 md:px-2 py-0.5 rounded uppercase tracking-wider">
                            Bonus
                          </span>
                        </h3>
                        {/* RETAIL + FREE - Mobile Top Right */}
                        <div className="shrink-0 flex items-center gap-1.5 md:gap-3">
                          <span className="text-zinc-500 text-xs md:text-sm font-mono line-through font-medium decoration-zinc-600 decoration-2">
                            $97
                          </span>
                          <span className="inline-block py-1 px-2 md:py-1.5 md:px-3 rounded-md md:rounded-lg bg-white text-black border border-white/20 text-[10px] md:text-xs font-mono font-extrabold tracking-wider shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                            FREE
                          </span>
                        </div>
                      </div>
                      <p className="text-zinc-400 text-xs md:text-sm mt-1 md:mt-2 leading-relaxed max-w-md">
                        Turn production into income. Strategies for growing a following & building real customers.
                      </p>
                    </div>
                  </li>

                  {/* ITEM 4: BONUS 2 */}
                  <li className="flex flex-row gap-3 md:gap-6 items-start group relative">
                    {/* THUMBNAIL */}
                    <div className="shrink-0 w-14 h-14 md:w-24 md:h-24 bg-zinc-900 rounded-lg md:rounded-xl border border-zinc-800 overflow-hidden relative shadow-lg group-hover:border-zinc-600 transition-colors">
                      <img src={tiktokVaultThumbnail} alt="Bonus 2 Thumbnail" className="w-full h-full object-cover" />
                    </div>
                    
                    {/* CONTENT */}
                    <div className="flex flex-col justify-center flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base md:text-xl font-bold text-white group-hover:text-zinc-200 transition-colors leading-tight">
                          Rob's TikTok/IG Breakdown Vault
                          <span className="ml-1 md:ml-2 inline-block align-middle text-[#D3FF02] text-[8px] md:text-[10px] border border-[#D3FF02]/30 bg-[#D3FF02]/10 px-1.5 md:px-2 py-0.5 rounded uppercase tracking-wider">
                            Bonus
                          </span>
                        </h3>
                        {/* RETAIL + FREE - Mobile Top Right */}
                        <div className="shrink-0 flex items-center gap-1.5 md:gap-3">
                          <span className="text-zinc-500 text-xs md:text-sm font-mono line-through font-medium decoration-zinc-600 decoration-2">
                            $147
                          </span>
                          <span className="inline-block py-1 px-2 md:py-1.5 md:px-3 rounded-md md:rounded-lg bg-white text-black border border-white/20 text-[10px] md:text-xs font-mono font-extrabold tracking-wider shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                            FREE
                          </span>
                        </div>
                      </div>
                      <p className="text-zinc-400 text-xs md:text-sm mt-1 md:mt-2 leading-relaxed max-w-md">
                        Exclusive project walkthroughs from Rob's viral content + downloadable presets.
                      </p>
                    </div>
                  </li>

                </ul>
              </div>

              {/* FOOTER / PRICING AREA */}
              <div className="bg-zinc-900/90 border-t border-zinc-800 p-6 md:p-12 flex flex-col items-center text-center backdrop-blur-xl relative z-10">
                
                {/* Total Value */}
                <div className="mb-4 md:mb-6 space-y-0.5 md:space-y-1">
                  <p className="text-zinc-500 font-medium text-[10px] md:text-sm uppercase tracking-wide">
                    Total Value
                  </p>
                  <p className="text-xl md:text-3xl font-bold text-zinc-400 line-through decoration-zinc-600 decoration-2 opacity-70">
                    $938
                  </p>
                </div>

                {/* The Price (12 MONTHS FOCUS) */}
                <div className="flex flex-col items-center justify-center gap-1 md:gap-2 mb-1 md:mb-2">
                  <span className="text-base md:text-2xl font-medium text-white">12 Months Full Access:</span>
                  <span className="text-5xl md:text-7xl font-black text-[#D3FF02] tracking-tighter drop-shadow-[0_0_25px_rgba(211,255,2,0.2)]">
                    $297
                  </span>
                </div>

                {/* Clarification Text */}
                <p className="text-zinc-500 text-[10px] md:text-sm font-medium mb-6 md:mb-10">
                  One-time payment. No auto-renew.
                </p>

                {/* PRIMARY CTA BUTTON */}
                <button className="w-full md:max-w-md group relative inline-flex h-14 md:h-16 items-center justify-center overflow-hidden rounded-full bg-white font-bold text-black transition-all duration-300 hover:bg-[#D3FF02] hover:text-black hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(211,255,2,0.5)]">
                  <span className="relative text-base md:text-lg uppercase tracking-wide flex items-center gap-2 md:gap-3">
                    Get Instant Access <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                  </span>
                </button>

                {/* TRUST BADGES (Clarified) */}
                <div className="mt-6 md:mt-8 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-8 text-[10px] md:text-xs text-zinc-500 font-medium uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 md:gap-2">
                    <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-zinc-400" />
                    1 Year Access
                  </span>
                  <span className="flex items-center gap-1.5 md:gap-2">
                    <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-zinc-400" />
                    One-Time Payment
                  </span>
                  <span className="flex items-center gap-1.5 md:gap-2">
                    <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 text-zinc-400" />
                    Instant Digital Delivery
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

const TheProducerBlueprint001 = () => {
  // Load Vidalytics script on mount
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.innerHTML = `
      (function (v, i, d, a, l, y, t, c, s) {
        y='_'+d.toLowerCase();c=d+'L';if(!v[d]){v[d]={};}if(!v[c]){v[c]={};}if(!v[y]){v[y]={};}var vl='Loader',vli=v[y][vl],vsl=v[c][vl + 'Script'],vlf=v[c][vl + 'Loaded'],ve='Embed';
        if (!vsl){vsl=function(u,cb){
          if(t){cb();return;}s=i.createElement("script");s.type="text/javascript";s.async=1;s.src=u;
          if(s.readyState){s.onreadystatechange=function(){if(s.readyState==="loaded"||s.readyState=="complete"){s.onreadystatechange=null;vlf=1;cb();}};}else{s.onload=function(){vlf=1;cb();};}
          i.getElementsByTagName("head")[0].appendChild(s);
        };}
        vsl(l+'loader.min.js',function(){if(!vli){var vlc=v[c][vl];vli=new vlc();}vli.loadScript(l+'player.min.js',function(){var vec=v[d][ve];t=new vec();t.run(a);});});
      })(window, document, 'Vidalytics', 'vidalytics_embed_V5HrhyRBNAeDtppA', 'https://fast.vidalytics.com/embeds/TEaBLdFh/V5HrhyRBNAeDtppA/');
    `;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

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
  ];

  const bonusModules = [
    {
      title: "Music Business",
      description: "Turn production into income. Growing a following, making content, and building real customers.",
    },
    {
      title: "Breakdown Vault",
      description:
        "Project walkthroughs from Rob's viral content. See the thinking behind every decision. Updated regularly.",
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
    austriaTestimonial,
    rsmyth111Testimonial,
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans relative overflow-hidden">
      {/* Aurora Glow Effect */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse at center bottom, rgba(211,255,2,0.15) 0%, rgba(180,230,0,0.1) 25%, rgba(211,255,2,0.05) 50%, transparent 70%)",
        }}
      />

      {/* Navigation Bar - LOGIN REMOVED */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 max-w-7xl mx-auto">
        <div className="text-xl font-bold tracking-tight">The Producer Blueprint</div>
        <div className="flex items-center gap-6">
          <button className="bg-white text-black px-5 py-2 rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors">
            Get Instant Access
          </button>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="relative z-10 px-6 md:px-12 pt-8 md:pt-24 pb-4 md:pb-32 max-w-5xl mx-auto text-center">
        {/* HERO AMBIENT GLOW */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D3FF02]/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
        
        {/* Social Proof Eyebrow */}
        <div className="flex items-center justify-center gap-3 md:gap-4 mb-6 md:mb-10">
          <div className="flex -space-x-3 relative">
            <Avatar className="w-8 h-8 md:w-10 md:h-10 border-2 border-[#050505]">
              <AvatarImage src={avatarBen} className="object-cover" />
              <AvatarFallback>B</AvatarFallback>
            </Avatar>
            <Avatar className="w-8 h-8 md:w-10 md:h-10 border-2 border-[#050505]">
              <AvatarImage src={avatarProducer1} className="object-cover" />
              <AvatarFallback>P1</AvatarFallback>
            </Avatar>
            <Avatar className="w-8 h-8 md:w-10 md:h-10 border-2 border-[#050505]">
              <AvatarImage src={avatarProducer2} className="object-cover" />
              <AvatarFallback>P2</AvatarFallback>
            </Avatar>
            <Avatar className="w-8 h-8 md:w-10 md:h-10 border-2 border-[#050505]">
              <AvatarImage src={avatarProducer3} className="object-cover" />
              <AvatarFallback>P3</AvatarFallback>
            </Avatar>
          </div>
          <div className="text-left">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-white text-white" />
              ))}
            </div>
            <p className="text-zinc-500 text-sm">500+ producers enrolled</p>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-[-0.04em] leading-[1.05] mb-6 md:mb-10">
          The Complete Production Workflow.
          <br />
          <span className="font-serif italic font-normal tracking-normal text-zinc-200">Start to Finish.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-zinc-400 text-base md:text-xl max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed">
          Watch <span className="text-white font-semibold">Rob Late</span> (The Chainsmokers, Marshmello, Clean Bandit)
          demonstrate the end-to-end process he uses to write, produce, and mix professional records from a home studio.
        </p>

        {/* Desktop/Mobile flex container with order swapping */}
        <div className="flex flex-col">
          
          {/* CTA Area - order-2 on mobile (after VSL), order-1 on desktop (before VSL) */}
          <div className="order-2 md:order-1 mb-6 md:mb-8">
            <button className="inline-flex items-center gap-2 bg-[#D3FF02] text-black px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-[#b8e000] transition-all shadow-[0_0_40px_rgba(211,255,2,0.4)] hover:shadow-[0_0_50px_rgba(211,255,2,0.5)]">
              Start The Blueprint Today
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Benefit Bullets - order-3 on mobile (after CTA), order-2 on desktop (before VSL) */}
          <div className="order-3 md:order-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-400 mb-8 md:mb-12">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#D3FF02]" />
              Complete start-to-finish workflow
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#D3FF02]" />
              Home studio focused
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#D3FF02]" />
              Updated for 2025
            </div>
          </div>

          {/* Hero VSL Container - order-1 on mobile (first), order-3 on desktop (after CTA & Benefits) */}
          <div
            className="order-1 md:order-3 w-full max-w-6xl mx-auto relative group cursor-pointer mb-8 md:mb-16 animate-fade-in"
            style={{ animationDelay: "0.5s" }}
          >
            {/* Large Ambient Glow Behind VSL */}
            <div 
              className="absolute -inset-32 pointer-events-none z-0"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(180,230,0,0.15) 0%, rgba(211,255,2,0.08) 40%, transparent 70%)',
              }}
            />
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-[#D3FF02]/10 blur-3xl rounded-[30px] opacity-40 group-hover:opacity-60 transition duration-700" />

            {/* Video Container */}
            <div className="relative w-full bg-zinc-900 rounded-[24px] border border-white/10 overflow-hidden shadow-2xl">
              
              {/* THE VISIBLE OVERLAY - Mobile only */}
              <div className="absolute top-3 left-3 z-30 pointer-events-none md:hidden">
                <div className="px-2 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold tracking-tight">
                  Watch: Inside The Producer Blueprint
                </div>
              </div>

              {/* Vidalytics Embed */}
              <div
                id="vidalytics_embed_V5HrhyRBNAeDtppA"
                className="relative z-10 w-full"
                style={{ width: "100%", position: "relative", paddingTop: "56.25%" }}
              />
            </div>
          </div>
        </div>

        {/* Footer: Scrolling Credits */}
        <div className="w-full max-w-7xl mx-auto relative z-20 my-12 md:my-24">
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-10 text-center">
            ROB LATE CREDITS
          </p>

          {/* Added mask-image style for the fade effect */}
          <div 
            className="overflow-hidden relative"
            style={{
              maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
            }}
          >
            {/* Marquee Container */}
            <div
              className="flex gap-12 w-max animate-marquee hover:[animation-play-state:paused] items-start"
              style={{ animationDuration: "60s" }}
            >
            {/* Credit Item 1 */}
            <div className="flex flex-col items-center w-32 shrink-0 group cursor-pointer">
              <img
                src={chainsomokersFriday}
                className="w-32 h-32 object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                alt="The Chainsmokers - Friday"
              />
              <p className="text-white font-bold text-xs mt-4 text-center leading-tight">The Chainsmokers</p>
              <p className="text-zinc-500 text-[10px] text-center mt-1">Friday ft. Fridayy</p>
            </div>
            {/* Credit Item 2 */}
            <div className="flex flex-col items-center w-32 shrink-0 group cursor-pointer">
              <img
                src={chainsmokersNoShade}
                className="w-32 h-32 object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                alt="The Chainsmokers - No Shade At Pitti"
              />
              <p className="text-white font-bold text-xs mt-4 text-center leading-tight">The Chainsmokers</p>
              <p className="text-zinc-500 text-[10px] text-center mt-1">No Shade At Pitti</p>
            </div>
            {/* Credit Item 3 */}
            <div className="flex flex-col items-center w-32 shrink-0 group cursor-pointer">
              <img
                src={chainsmokersSeeYouAgain}
                className="w-32 h-32 object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                alt="The Chainsmokers - See You Again"
              />
              <p className="text-white font-bold text-xs mt-4 text-center leading-tight">The Chainsmokers</p>
              <p className="text-zinc-500 text-[10px] text-center mt-1">See You Again</p>
            </div>
            {/* Credit Item 4 */}
            <div className="flex flex-col items-center w-32 shrink-0 group cursor-pointer">
              <img
                src="https://placehold.co/200x200/18181b/ffffff?text=Gary+Barlow"
                className="w-32 h-32 object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                alt="Gary Barlow"
              />
              <p className="text-white font-bold text-xs mt-4 text-center leading-tight">Gary Barlow</p>
              <p className="text-zinc-500 text-[10px] text-center mt-1">Session Work</p>
            </div>
            {/* Credit Item 5 */}
            <div className="flex flex-col items-center w-32 shrink-0 group cursor-pointer">
              <img
                src="https://placehold.co/200x200/18181b/ffffff?text=Spinnin"
                className="w-32 h-32 object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                alt="Spinnin' Records"
              />
              <p className="text-white font-bold text-xs mt-4 text-center leading-tight">Spinnin' Records</p>
              <p className="text-zinc-500 text-[10px] text-center mt-1">Official Remix</p>
            </div>
            {/* Credit Item 6 */}
            <div className="flex flex-col items-center w-32 shrink-0 group cursor-pointer">
              <img
                src={chainsmokersTennisCourt}
                className="w-32 h-32 object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                alt="The Chainsmokers - Tennis Court"
              />
              <p className="text-white font-bold text-xs mt-4 text-center leading-tight">The Chainsmokers</p>
              <p className="text-zinc-500 text-[10px] text-center mt-1">Tennis Court</p>
            </div>
            {/* Credit Item 7 */}
            <div className="flex flex-col items-center w-32 shrink-0 group cursor-pointer">
              <img
                src={flawesDontBlameMe}
                className="w-32 h-32 object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                alt="Flawes - Don't Blame Me"
              />
              <p className="text-white font-bold text-xs mt-4 text-center leading-tight">Flawes</p>
              <p className="text-zinc-500 text-[10px] text-center mt-1">Don't Blame Me</p>
            </div>
            {/* Credit Item 8 */}
            <div className="flex flex-col items-center w-32 shrink-0 group cursor-pointer">
              <img
                src={januaryAllMyFriends}
                className="w-32 h-32 object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                alt="January - All My Friends Are Famous"
              />
              <p className="text-white font-bold text-xs mt-4 text-center leading-tight">January</p>
              <p className="text-zinc-500 text-[10px] text-center mt-1">All My Friends Are Famous</p>
            </div>
            {/* Credit Item 9 */}
            <div className="flex flex-col items-center w-32 shrink-0 group cursor-pointer">
              <img
                src={tiandaNothingButLove}
                className="w-32 h-32 object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                alt="Tianda - Nothing But Love"
              />
              <p className="text-white font-bold text-xs mt-4 text-center leading-tight">Tianda</p>
              <p className="text-zinc-500 text-[10px] text-center mt-1">Nothing But Love</p>
            </div>

            {/* DUPLICATE SET FOR INFINITE LOOP */}
            <div className="flex flex-col items-center w-32 shrink-0 group cursor-pointer">
              <img
                src={chainsomokersFriday}
                className="w-32 h-32 object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                alt="The Chainsmokers - Friday"
              />
              <p className="text-white font-bold text-xs mt-4 text-center leading-tight">The Chainsmokers</p>
              <p className="text-zinc-500 text-[10px] text-center mt-1">Friday ft. Fridayy</p>
            </div>
            <div className="flex flex-col items-center w-32 shrink-0 group cursor-pointer">
              <img
                src={chainsmokersNoShade}
                className="w-32 h-32 object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                alt="The Chainsmokers - No Shade At Pitti"
              />
              <p className="text-white font-bold text-xs mt-4 text-center leading-tight">The Chainsmokers</p>
              <p className="text-zinc-500 text-[10px] text-center mt-1">No Shade At Pitti</p>
            </div>
            <div className="flex flex-col items-center w-32 shrink-0 group cursor-pointer">
              <img
                src={chainsmokersSeeYouAgain}
                className="w-32 h-32 object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                alt="The Chainsmokers - See You Again"
              />
              <p className="text-white font-bold text-xs mt-4 text-center leading-tight">The Chainsmokers</p>
              <p className="text-zinc-500 text-[10px] text-center mt-1">See You Again</p>
            </div>
            <div className="flex flex-col items-center w-32 shrink-0 group cursor-pointer">
              <img
                src="https://placehold.co/200x200/18181b/ffffff?text=Gary+Barlow"
                className="w-32 h-32 object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                alt="Gary Barlow"
              />
              <p className="text-white font-bold text-xs mt-4 text-center leading-tight">Gary Barlow</p>
              <p className="text-zinc-500 text-[10px] text-center mt-1">Session Work</p>
            </div>
            <div className="flex flex-col items-center w-32 shrink-0 group cursor-pointer">
              <img
                src="https://placehold.co/200x200/18181b/ffffff?text=Spinnin"
                className="w-32 h-32 object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                alt="Spinnin' Records"
              />
              <p className="text-white font-bold text-xs mt-4 text-center leading-tight">Spinnin' Records</p>
              <p className="text-zinc-500 text-[10px] text-center mt-1">Official Remix</p>
            </div>
            <div className="flex flex-col items-center w-32 shrink-0 group cursor-pointer">
              <img
                src={chainsmokersTennisCourt}
                className="w-32 h-32 object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                alt="The Chainsmokers - Tennis Court"
              />
              <p className="text-white font-bold text-xs mt-4 text-center leading-tight">The Chainsmokers</p>
              <p className="text-zinc-500 text-[10px] text-center mt-1">Tennis Court</p>
            </div>
            <div className="flex flex-col items-center w-32 shrink-0 group cursor-pointer">
              <img
                src={flawesDontBlameMe}
                className="w-32 h-32 object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                alt="Flawes - Don't Blame Me"
              />
              <p className="text-white font-bold text-xs mt-4 text-center leading-tight">Flawes</p>
              <p className="text-zinc-500 text-[10px] text-center mt-1">Don't Blame Me</p>
            </div>
            <div className="flex flex-col items-center w-32 shrink-0 group cursor-pointer">
              <img
                src={januaryAllMyFriends}
                className="w-32 h-32 object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                alt="January - All My Friends Are Famous"
              />
              <p className="text-white font-bold text-xs mt-4 text-center leading-tight">January</p>
              <p className="text-zinc-500 text-[10px] text-center mt-1">All My Friends Are Famous</p>
            </div>
            <div className="flex flex-col items-center w-32 shrink-0 group cursor-pointer">
              <img
                src={tiandaNothingButLove}
                className="w-32 h-32 object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                alt="Tianda - Nothing But Love"
              />
              <p className="text-white font-bold text-xs mt-4 text-center leading-tight">Tianda</p>
              <p className="text-zinc-500 text-[10px] text-center mt-1">Nothing But Love</p>
            </div>
            </div>
          </div>
        </div>
      </main>

      {/* ================= MINI SOCIAL PROOF SECTION ================= */}
      <section className="pt-0 md:pt-32 pb-0 px-6 bg-[#050505] overflow-hidden relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-zinc-400 text-xs font-bold uppercase tracking-wide mb-6">
            Unfiltered Feedback
          </div>

          <div className="text-center mb-6 md:mb-24">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4 leading-[1.1]">
              Hear it directly from <span className="font-serif italic text-white">the producers.</span>
            </h2>
            <p className="text-zinc-400 text-base md:text-lg">Join 500+ producers who have upgraded their workflow.</p>
          </div>

          {/* MASONRY WALL - Cinematic fade on desktop, clean on mobile */}
          <div className="w-full relative z-0 overflow-hidden md:max-h-[700px]">
            <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6 pb-12 md:pb-32">
              {/* Mobile: Show mobile-specific order (3 images) */}
              {miniSocialProofImagesMobile.map((img, idx) => (
                <div key={`mobile-${idx}`} className="break-inside-avoid max-w-[92%] mx-auto md:hidden">
                  <div className="rounded-xl border border-white/10 overflow-hidden shadow-2xl hover:scale-[1.01] transition-transform duration-300 group cursor-pointer bg-[#121212]">
                    <img
                      src={img}
                      className="w-full h-auto block opacity-90 group-hover:opacity-100 transition-opacity object-contain"
                      alt={`Testimonial ${idx + 1}`}
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
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-white/5 bg-white/5 text-[#D3FF02] text-[10px] font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
              For Self-Taught Producers
            </div>
            
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6 text-white leading-[1.1]">
              Why You're Still Stuck In <br />
              <span className="font-serif italic text-white">Tutorial Hell.</span>
            </h2>
            <p className="text-zinc-500 text-base md:text-lg font-light max-w-xl mx-auto leading-relaxed">
              You have the taste. You have the plugins. <span className="text-zinc-400">But your hard drive is a graveyard of unfinished ideas.</span>
            </p>
          </div>

          {/* 2. CINEMATIC GRID LAYOUT */}
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-12 md:gap-8">
            
            {/* LEFT COLUMN TEXT */}
            <div className="md:w-1/4 space-y-10 md:space-y-16 text-center md:text-right order-2 md:order-1 relative z-10">
              
              {/* Item 1: Wrong Mentors */}
              <div className="space-y-1.5 relative group">
                <h4 className="text-white font-medium text-base md:text-lg relative inline-block">
                  Wrong Mentors
                  {/* Scribble: Underline */}
                  <svg className="absolute -bottom-1.5 md:-bottom-2 left-0 w-full h-2 md:h-3 text-[#D3FF02]/60" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M2,5 Q50,8 98,2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </h4>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Learning from "content creators" who optimize for views, not working producers who optimize for results.
                </p>
              </div>
              
              {/* Item 2: Fragmented Knowledge */}
              <div className="space-y-1.5 relative">
                <h4 className="text-white font-medium text-base md:text-lg">Fragmented Knowledge</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  You're watching a mixing tip from one YouTuber and an arrangement hack from another. Nothing connects.
                </p>
                {/* Scribble: Arrow pointing right to video */}
                <div className="hidden md:block absolute -right-16 top-1/2 -translate-y-1/2 w-12 h-12 opacity-60">
                   <svg viewBox="0 0 50 50" className="text-[#D3FF02] w-full h-full transform -rotate-12">
                     <path d="M5,25 Q25,10 45,25" fill="none" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                     <defs>
                       <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                         <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
                       </marker>
                     </defs>
                   </svg>
                </div>
              </div>
            </div>

            {/* CENTER VIDEO (THE VIGNETTE) */}
            <div className="md:w-1/2 order-1 md:order-2 relative flex justify-center">
              {/* Glow Effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#D3FF02]/5 blur-[80px] rounded-full pointer-events-none"></div>
              
              <div className="relative w-full max-w-md aspect-square overflow-visible flex items-center justify-center">
                <video 
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                  className="w-full h-full object-cover opacity-90 scale-110"
                  style={{
                    objectPosition: '60% center', 
                    maskImage: 'radial-gradient(circle, black 35%, transparent 65%)',
                    WebkitMaskImage: 'radial-gradient(circle, black 35%, transparent 65%)'
                  }}
                  src={tutorialHellVideo}
                />
              </div>
            </div>

            {/* RIGHT COLUMN TEXT */}
            <div className="md:w-1/4 space-y-10 md:space-y-16 text-center md:text-left order-3 relative z-10">
              
              {/* Item 3: Frankenstein Workflow */}
              <div className="space-y-1.5 relative">
                <div className="relative inline-block">
                  <h4 className="text-white font-medium text-base md:text-lg relative z-10">Frankenstein Workflow</h4>
                  {/* Scribble: Circle around title */}
                  <svg className="absolute -top-2 md:-top-3 -left-3 md:-left-4 w-[115%] md:w-[120%] h-[160%] md:h-[180%] text-[#D3FF02]/40 z-0 pointer-events-none" viewBox="0 0 100 50" preserveAspectRatio="none">
                    <path d="M10,20 Q50,5 90,20 T10,20" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Trying to build a pro sound by stitching together random advice. It falls apart the moment you try to finish a track.
                </p>
              </div>
              
              {/* Item 4: The Highlight Reel */}
              <div className="space-y-1.5 relative">
                {/* Scribble: Arrow pointing left to video */}
                <div className="hidden md:block absolute -left-16 top-0 w-12 h-12 opacity-60">
                   <svg viewBox="0 0 50 50" className="text-[#D3FF02] w-full h-full transform rotate-12 scale-x-[-1]">
                     <path d="M5,25 Q25,10 45,25" fill="none" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                   </svg>
                </div>
                
                <h4 className="text-white font-medium text-base md:text-lg">The "Highlight Reel"</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  You only see the polished result on YouTube, never the messy problem-solving required to actually finish music.
                </p>
              </div>
            </div>
          </div>

          {/* Connector Line to Solution */}
          <div className="mt-16 md:mt-24 flex flex-col items-center opacity-20">
            <div className="w-[1px] h-24 bg-gradient-to-b from-white via-white to-transparent"></div>
          </div>

        </div>
      </section>

      {/* ================= SECTION 3: THE SOLUTION (RESPONSIVE IMAGE SWAP) ================= */}
      <section className="relative bg-[#050505] z-20 border-t border-white/5 pt-0">
        
        {/* 1. CINEMATIC IMAGE HEADER */}
        <div className="relative w-full flex justify-center">
          {/* Height: Mobile 600px, Desktop 800px */}
          <div className="relative w-full max-w-6xl h-[600px] md:h-[800px] overflow-hidden">
            
            {/* MOBILE IMAGE (Visible < md) - Uses tall image for better verticality */}
            <img 
              src={robMarshmello}
              className="block md:hidden w-full h-full object-cover object-center opacity-80"
              alt="Rob and Marshmello Mobile"
            />
            
            {/* DESKTOP IMAGE (Visible >= md) - Uses cropped wide image */}
            <img 
              src={robHomeStudioWide}
              className="hidden md:block w-full h-full object-cover object-center opacity-80"
              alt="Rob in Home Studio Desktop"
            />
            
            {/* Top Vignette (Stronger to mask top hard edge) */}
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#050505] via-[#050505] to-transparent opacity-100"></div>
            
            {/* Bottom Fade (Deep fade for text overlap) */}
            <div className="absolute bottom-0 left-0 w-full h-[400px] md:h-[500px] bg-gradient-to-t from-[#050505] via-[#050505] to-transparent"></div>
            
            {/* Side Fades (Desktop only) */}
            <div className="hidden md:block absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#050505] to-transparent"></div>
            <div className="hidden md:block absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#050505] to-transparent"></div>
          </div>
        </div>

        {/* 2. CONTENT CONTAINER - Responsive negative margins */}
        <div className="max-w-7xl mx-auto px-6 relative z-10 -mt-[200px] md:-mt-[350px]">
          
          {/* HEADER AREA (CONTEXT) */}
          <div className="text-center mb-16 md:mb-24 max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-zinc-400 text-xs font-bold uppercase tracking-wide mb-8 backdrop-blur-sm shadow-xl">
              The Producer Blueprint 2.0
            </div>
            
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight mb-8 text-white drop-shadow-2xl leading-[1.1]">
              See How "A-List" Music Is <br />
              Actually Made <span className="font-serif italic text-white">In A Home Studio.</span>
            </h2>
            
            {/* TOP TEXT: The "Why" */}
            <p className="text-zinc-500 text-base md:text-lg font-light max-w-xl mx-auto leading-relaxed mb-8">
              It's the era of home studio production. You no longer need expensive gear. <span className="text-zinc-400">DJs are producing headline tracks in hotel rooms on a laptop and headphones.</span>
            </p>
            
            <p className="text-xl md:text-2xl font-semibold tracking-tight">
              <span className="text-zinc-400">The Producer Blueprint</span> <span className="text-white">will show you:</span>
            </p>
          </div>

          {/* 3. THE 4 PILLARS (THE CARDS) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative mb-20">
            
            {/* Card 01 */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-[#D3FF02]/30 transition-colors duration-500">
              <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl text-white select-none pointer-events-none group-hover:opacity-20 transition-opacity">01</div>
              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mb-6 text-[#D3FF02]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">From "Loop Phase" To Finished Record</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Stop hoarding unfinished ideas. Watch Rob's personal workflow for taking a track from a 4-bar loop to a complete arrangement. No rigid frameworks - just the fluid process of actually finishing songs.
                </p>
              </div>
            </div>

            {/* Card 02 */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-[#D3FF02]/30 transition-colors duration-500">
              <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl text-white select-none pointer-events-none group-hover:opacity-20 transition-opacity">02</div>
              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mb-6 text-[#D3FF02]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">The "Bedroom" Mixing Standard</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  You don't always need a pro engineer. Learn the functional mixing and mastering process Rob uses to get tracks ready for label demos, live sets, or streaming releases - all from a laptop on the road.
                </p>
              </div>
            </div>

            {/* Card 03 */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-[#D3FF02]/30 transition-colors duration-500">
              <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl text-white select-none pointer-events-none group-hover:opacity-20 transition-opacity">03</div>
              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mb-6 text-[#D3FF02]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Session-Proven Chains</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Your mixes sound thin because your processing is wrong. Copy the exact vocal and drum chains Rob uses in sessions with major artists to get that loud, punchy commercial sound without over-complicating it.
                </p>
              </div>
            </div>

            {/* Card 04 */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-[#D3FF02]/30 transition-colors duration-500">
              <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl text-white select-none pointer-events-none group-hover:opacity-20 transition-opacity">04</div>
              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mb-6 text-[#D3FF02]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Design Sounds With Intent</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Stop relying on happy accidents. Learn the fundamentals of sound design so you can build the exact 808s, leads, and pads you hear in your head, rather than endlessly hunting through Splice folders.
                </p>
              </div>
            </div>

          </div>

          {/* 4. FOOTER / BRIDGE (THE "CLOSER") */}
          <div className="text-center pb-24 max-w-3xl mx-auto">
            
            {/* The "How" - High Contrast Statement */}
            <p className="text-xl md:text-2xl text-white font-medium leading-relaxed mb-12">
              Learn top creative workflows with <span className="text-[#D3FF02]">an over-the-shoulder look</span> at how Rob Late goes from idea to finished song.
            </p>

            {/* CTA Button */}
            <button className="group inline-flex items-center gap-3 text-white text-lg font-medium hover:text-[#D3FF02] transition-all">
              <span className="border-b border-white/30 pb-0.5 group-hover:border-[#D3FF02]">See The Curriculum</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </section>

      {/* ================= VISUAL EVIDENCE: STUDIO POV ================= */}
      <section className="relative z-10 px-6 pb-8 -mt-12 pointer-events-none">
        <div className="max-w-lg mx-auto relative flex flex-col items-center justify-center">
          
          {/* 1. The Backlight Glow 
              (Purple/Blue ambient light to match the photo) 
          */}
          <div className="absolute inset-0 bg-indigo-600/30 blur-[80px] rounded-full transform scale-75 z-0"></div>

          {/* 2. The Vignetted Image Container 
              - Reduced to max-w-lg to stop it being huge
              - Mask is tighter to hide the top edge
          */}
          <div className="relative w-full aspect-video z-10">
            <img 
              src={robPovStudio} 
              alt="Rob Late Studio POV" 
              className="w-full h-full object-cover"
              style={{
                // Tighter mask: fades to transparent at 60% to ensure edges are invisible
                maskImage: 'radial-gradient(circle at center, black 25%, transparent 60%)',
                WebkitMaskImage: 'radial-gradient(circle at center, black 25%, transparent 60%)'
              }}
            />
          </div>
        </div>
      </section>

      {/* ================= SECTION: THE ORIGIN STORY (MEET YOUR INSTRUCTOR) ================= */}
      <section className="relative w-full bg-black pt-12 pb-24 px-4 overflow-hidden">
        
        {/* Subtle radial glow behind the content */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-zinc-800/30 blur-[120px] rounded-full pointer-events-none z-0" />
        
        <div className="relative max-w-7xl mx-auto z-10">
          
          {/* Header */}
          <div className="text-center mb-24 space-y-4">
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500 font-medium">Meet Your Instructor</p>
            <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter">
              Rob Late. Producer.
            </h2>
            <p className="text-xl text-zinc-400 font-medium">
              Credits: The Chainsmokers, Marshmello, Clean Bandit, Gary Barlow.
            </p>
            <p className="text-zinc-500 font-bold tracking-wide text-sm uppercase">
              (All produced from a home studio)
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 relative">
            
            {/* ITEM 1: 2019 */}
            <div className="relative flex flex-col items-center group transition-all duration-500 md:mt-0">
              <div className="relative bg-white p-3 pb-8 shadow-2xl transform transition-transform duration-300 hover:scale-105 hover:z-20 w-full max-w-[280px] -rotate-2">
                <div className="aspect-square bg-gray-200 overflow-hidden mb-4 grayscale contrast-125 transition-all duration-500 group-hover:grayscale-0">
                  <img src={robFirstStudio} alt="The 9-5 Grind" className="w-full h-full object-cover" />
                </div>
                <p className="text-center font-mono text-xs tracking-widest text-gray-800 uppercase">
                  2019: THE GRIND
                </p>
              </div>
              <div className="mt-8 text-center max-w-[240px]">
                <h3 className="text-white text-xl font-bold mb-3">The 9-5 Grind</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  I was working a sales job for a phone mount company, producing music as a 'hobby' in the evenings. Couple of super cheap production gigs here and there. This was my first setup - simple speakers, mic and interface. All you need!
                </p>
              </div>
            </div>

            {/* ITEM 2: 2020 */}
            <div className="relative flex flex-col items-center group transition-all duration-500 md:mt-32">
              <div className="relative bg-white p-3 pb-8 shadow-2xl transform transition-transform duration-300 hover:scale-105 hover:z-20 w-full max-w-[280px] rotate-1">
                <div className="aspect-square bg-gray-200 overflow-hidden mb-4 grayscale contrast-125 transition-all duration-500 group-hover:grayscale-0">
                  <img src={robLockdownStudio} alt="The Lockdown Era" className="w-full h-full object-cover object-center" />
                </div>
                <p className="text-center font-mono text-xs tracking-widest text-gray-800 uppercase">
                  2020: LOCKDOWN
                </p>
              </div>
              <div className="mt-8 text-center max-w-[240px]">
                <h3 className="text-white text-xl font-bold mb-3">The Lockdown Era</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Stuck in a spare room in my London flat during lockdown, I started taking remote sessions. I posted some Reels sampling random objects in my studio. A few started getting views. I didn't know it yet, but everything changed right here.
                </p>
              </div>
            </div>

            {/* ITEM 3: 2021 */}
            <div className="relative flex flex-col items-center group transition-all duration-500 md:mt-0">
              <div className="relative bg-white p-3 pb-8 shadow-2xl transform transition-transform duration-300 hover:scale-105 hover:z-20 w-full max-w-[280px] -rotate-1">
                <div className="aspect-square bg-gray-200 overflow-hidden mb-4 grayscale contrast-125 transition-all duration-500 group-hover:grayscale-0">
                  <img src={robChainsmokers} alt="The Breakthrough" className="w-full h-full object-cover object-top" />
                </div>
                <p className="text-center font-mono text-xs tracking-widest text-gray-800 uppercase">
                  2021: BREAKTHROUGH
                </p>
              </div>
              <div className="mt-8 text-center max-w-[240px]">
                <h3 className="text-white text-xl font-bold mb-3">The Breakthrough</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  My content was going viral, followers growing. Drew from <span className="text-white font-semibold">The Chainsmokers</span> DM'd me after seeing a video and we started working on music together. No management, no label connections at this point - just making cool music & getting reach with content.
                </p>
              </div>
            </div>

            {/* ITEM 4: 2022 */}
            <div className="relative flex flex-col items-center group transition-all duration-500 md:mt-32">
              <div className="relative bg-white p-3 pb-8 shadow-2xl transform transition-transform duration-300 hover:scale-105 hover:z-20 w-full max-w-[280px] rotate-2">
                <div className="aspect-square bg-gray-200 overflow-hidden mb-4 grayscale contrast-125 transition-all duration-500 group-hover:grayscale-0">
                  <img src={robGaryBarlow} alt="The A-List Sessions" className="w-full h-full object-cover object-center" />
                </div>
                <p className="text-center font-mono text-xs tracking-widest text-gray-800 uppercase">
                  2022: A-LIST
                </p>
              </div>
              <div className="mt-8 text-center max-w-[240px]">
                <h3 className="text-white text-xl font-bold mb-3">The A-List Sessions</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  The major artist sessions started stacking up: Marshmello, Clean Bandit, Gary Barlow. The crazy part is I was still doing it all from a home setup, proving you don't need a million-dollar facility to play at the top level.
                </p>
              </div>
            </div>

            {/* ITEM 5: TODAY */}
            <div className="relative flex flex-col items-center group transition-all duration-500 md:mt-0">
              <div className="relative bg-white p-3 pb-8 shadow-2xl transform transition-transform duration-300 hover:scale-105 hover:z-20 w-full max-w-[280px] -rotate-1">
                <div className="aspect-square bg-gray-200 overflow-hidden mb-4 grayscale contrast-125 transition-all duration-500 group-hover:grayscale-0">
                  <img src={robMarsmelloCropped} alt="The Producer Blueprint" className="w-full h-full object-cover object-center" />
                </div>
                <p className="text-center font-mono text-xs tracking-widest text-gray-800 uppercase">
                  TODAY: THE BLUEPRINT
                </p>
              </div>
              <div className="mt-8 text-center max-w-[240px]">
                <h3 className="text-white text-xl font-bold mb-3">The Producer Blueprint</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  100 Million+ streams later, I moved house and built a dedicated space in my garage. It's still a home studio. It's basically the same gear. I just have fancier lights now.
                </p>
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
      <CurriculumSection />



        {/* ================= WALL OF WINS SECTION ================= */}
        <section id="testimonials" className="relative py-12 md:py-24 overflow-hidden">
          
          {/* Background Ambient Glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D3FF02]/5 rounded-full blur-[150px]" />
          </div>

          <div className="max-w-6xl mx-auto px-6 relative z-10">
            
            {/* HEADER */}
            <div className="text-center mb-10 md:mb-16">
              <span className="inline-block bg-[#D3FF02]/10 text-[#D3FF02] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
                Student Wins
              </span>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05] text-white mb-4 md:mb-6">
                Real Results. <span className="font-serif italic font-normal tracking-normal text-zinc-200">Real Producers.</span>
              </h2>
              <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto">
                Real feedback from producers who are finally finishing their best music.
              </p>
            </div>

            {/* HERO CARDS - CAROUSEL ON MOBILE, GRID ON DESKTOP */}
            {/* We use -mx-6 on mobile to break out of the parent padding and let the carousel touch the screen edges */}
            <div className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory gap-4 pb-8 -mx-6 px-6 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0 md:mx-0 md:px-0 scrollbar-hide mb-20">
              
              {/* CARD 1: Kiera Video Testimonial */}
              <div className="snap-center shrink-0 w-[85vw] max-w-[320px] md:w-auto md:max-w-none bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-colors group">
                {/* MEDIA AREA */}
                <div className="relative aspect-[9/16] overflow-hidden bg-black cursor-pointer">
                  <video
                    src={djkieraTestimonial}
                    className="absolute inset-0 w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-white fill-white ml-1" />
                    </div>
                  </div>
                </div>
                {/* TEXT AREA */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-bold text-sm flex items-center gap-1">
                        Kiera
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#D3FF02] fill-[#D3FF02]/10" />
                      </p>
                      <p className="text-zinc-500 text-sm">@djkiera</p>
                    </div>
                  </div>
                  <p className="text-zinc-200 text-base font-medium leading-snug">
                    "The best investment I've made for my music career."
                  </p>
                </div>
              </div>

              {/* CARD 2: Headroom Records */}
              <div className="snap-center shrink-0 w-[85vw] max-w-[320px] md:w-auto md:max-w-none bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-colors group">
                {/* MEDIA AREA */}
                <div className="relative aspect-[9/16] overflow-hidden bg-black cursor-pointer">
                  <img 
                    src={headroomRecordsTestimonial}
                    alt="Headroom Records testimonial"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" 
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/0 transition-colors">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-white fill-white ml-1" />
                    </div>
                  </div>
                </div>
                {/* TEXT AREA */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-bold text-sm flex items-center gap-1">
                        David R.
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#D3FF02] fill-[#D3FF02]/10" />
                      </p>
                      <p className="text-zinc-500 text-sm">@david.prod</p>
                    </div>
                  </div>
                  <p className="text-zinc-200 text-base font-medium leading-snug">
                    "Headroom Records wants to sign my next single!"
                  </p>
                </div>
              </div>

              {/* CARD 3: Streaming Numbers */}
              <div className="snap-center shrink-0 w-[85vw] max-w-[320px] md:w-auto md:max-w-none bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-colors group">
                {/* MEDIA AREA */}
                <div className="relative aspect-[9/16] overflow-hidden bg-black cursor-pointer">
                  <img 
                    src={streamingNumbersTestimonial}
                    alt="Streaming numbers testimonial"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" 
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/0 transition-colors">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-white fill-white ml-1" />
                    </div>
                  </div>
                </div>
                {/* TEXT AREA */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-bold text-sm flex items-center gap-1">
                        Sarah Jenkins
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#D3FF02] fill-[#D3FF02]/10" />
                      </p>
                      <p className="text-zinc-500 text-sm">@sarah.music</p>
                    </div>
                  </div>
                  <p className="text-zinc-200 text-base font-medium leading-snug">
                    "Highest streaming numbers yet. 12k on the latest track."
                  </p>
                </div>
              </div>

              {/* Spacer for mobile scrolling */}
              <div className="w-2 shrink-0 md:hidden"></div>
            </div>

            {/* WALL OF PROOF (Masonry with 10 Images) */}
            <div className="mt-8">
              <p className="text-center text-zinc-500 text-sm uppercase tracking-widest mb-10">
                More Feedback From The Community
              </p>
              
              <div className="columns-2 lg:columns-3 gap-4 space-y-4">
                
                {/* Screenshot 1 */}
                <div className="break-inside-avoid rounded-xl overflow-hidden">
                  <img src={drewAdieuTestimonial} alt="Student feedback" className="w-full h-auto" />
                </div>
                
                {/* Screenshot 2 */}
                <div className="break-inside-avoid rounded-xl overflow-hidden">
                  <img src={nateSawyerTestimonial} alt="Student feedback" className="w-full h-auto" />
                </div>

                {/* Screenshot 3 */}
                <div className="break-inside-avoid rounded-xl overflow-hidden">
                  <img src={austriaTestimonial} alt="Student feedback" className="w-full h-auto" />
                </div>

                {/* Screenshot 4 */}
                <div className="break-inside-avoid rounded-xl overflow-hidden">
                  <img src={deepintheforestTestimonial} alt="Student feedback" className="w-full h-auto" />
                </div>

                {/* Screenshot 5 */}
                <div className="break-inside-avoid rounded-xl overflow-hidden">
                  <img src={completePackageTestimonial} alt="Student feedback" className="w-full h-auto" />
                </div>

                {/* Screenshot 6 */}
                <div className="break-inside-avoid rounded-xl overflow-hidden">
                  <img src={aaronly0nsYoutubeTestimonial} alt="Student feedback" className="w-full h-auto" />
                </div>

                {/* Screenshot 7 */}
                <div className="break-inside-avoid rounded-xl overflow-hidden">
                  <img src={rsmyth111Testimonial} alt="Student feedback" className="w-full h-auto" />
                </div>

                {/* Screenshot 8 */}
                <div className="break-inside-avoid rounded-xl overflow-hidden">
                  <img src={levinMusicTestimonial} alt="Student feedback" className="w-full h-auto" />
                </div>

                {/* Screenshot 9 */}
                <div className="break-inside-avoid rounded-xl overflow-hidden">
                  <img src={testimonial1} alt="Student feedback" className="w-full h-auto" />
                </div>

                {/* Screenshot 10 */}
                <div className="break-inside-avoid rounded-xl overflow-hidden">
                  <img src={testimonial2} alt="Student feedback" className="w-full h-auto" />
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* ================= CHECKOUT SECTION ================= */}
        <section id="checkout" className="relative py-24 md:py-32">
          <div className="max-w-xl mx-auto px-6">
            
            {/* Headline */}
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.04em] leading-[1.05] text-white mb-4">
                Get Instant Access
              </h2>
              <p className="text-zinc-400">
                Join 500+ producers building their career from a home studio.
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
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-semibold text-lg">The Producer Blueprint™</p>
                    <p className="text-zinc-500 text-sm">Complete System + 7 Modules + Templates</p>
                  </div>
                  <div className="text-right">
                    <span className="text-zinc-500 line-through text-sm block">$741</span>
                    <span className="text-white font-bold text-xl">$297</span>
                  </div>
                </div>

                {/* Bonuses */}
                <div className="space-y-2 py-4 border-y border-zinc-800">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-zinc-300">BONUS: Music Business Mastery</span>
                    </div>
                    <span className="text-green-500 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-zinc-300">BONUS: The Breakdown Vault</span>
                    </div>
                    <span className="text-green-500 font-medium">Free</span>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-zinc-400 text-sm mb-2">Full Name</label>
                    <input
                      type="text"
                      placeholder="Your full name"
                      className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-[#D3FF02]/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-sm mb-2">Email Address</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-[#D3FF02]/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Order Bump */}
                <div className="bg-[#D3FF02]/5 border-2 border-dashed border-[#D3FF02]/30 rounded-xl p-4">
                  <div className="text-center mb-3">
                    <span className="inline-block bg-[#D3FF02] text-black text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      One-Time Offer
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="orderBump"
                      className="mt-1 w-5 h-5 rounded border-zinc-600 bg-zinc-800 text-[#D3FF02] focus:ring-[#D3FF02] focus:ring-offset-0 cursor-pointer"
                    />
                    <label htmlFor="orderBump" className="cursor-pointer flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-semibold">YES, ADD: Alpha Drums 3 Sample Pack</span>
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-500 line-through text-sm">$97</span>
                          <span className="text-[#D3FF02] font-bold">+$37</span>
                        </div>
                      </div>
                      <p className="text-zinc-400 text-sm mb-2">
                        Rob's premium drum library with over 700 curated sounds from sessions with A-list artists. Kicks, snares, and percussion that cut through any mix.
                      </p>
                      <p className="text-[#D3FF02] text-xs font-medium">&gt;&gt; Click box to add this deal</p>
                    </label>
                  </div>
                </div>

                {/* Total & CTA */}
                <div className="pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-zinc-400">Total Due Today:</span>
                    <span className="text-2xl font-bold text-white">$297.00</span>
                  </div>

                  <button className="w-full bg-[#D3FF02] hover:bg-[#b8e000] text-black font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-[#D3FF02]/25 flex items-center justify-center gap-2">
                    Get Instant Access
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  {/* Trust Badges - Updated for Compliance */}
                  <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mt-6 pt-6 border-t border-zinc-800">
                    <div className="flex items-center gap-2 text-zinc-500 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-zinc-500" />
                      <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 text-sm">
                      <Zap className="w-4 h-4 text-zinc-500" />
                      <span>Instant Digital Delivery</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 text-sm">
                      <Check className="w-4 h-4 text-zinc-500" />
                      <span>One-Time Payment</span>
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
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-zinc-400">
                Everything you need to know about The Blueprint.
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

        {/* ================= FINAL SELL: THE CROSSROADS ================= */}
        <section className="relative py-24 px-6 bg-[#050505] border-t border-zinc-900">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              
              {/* Left: The Argument */}
              <div className="order-2 md:order-1">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                  You have <span className="text-[#D3FF02]">two choices</span> from here.
                </h2>
                
                <div className="space-y-8">
                  <div className="pl-6 border-l-2 border-zinc-800">
                    <h4 className="text-zinc-400 font-bold uppercase tracking-wider text-xs mb-2">Option 1</h4>
                    <p className="text-white font-medium text-lg mb-2">Keep guessing.</p>
                    <p className="text-zinc-500 text-sm leading-relaxed">
                      You can keep hunting for free tutorials, piecing together advice from different YouTubers, and wondering why your tracks still don't sound "pro." You might get there eventually, but it will cost you years of trial and error.
                    </p>
                  </div>

                  <div className="pl-6 border-l-2 border-[#D3FF02]">
                    <h4 className="text-[#D3FF02] font-bold uppercase tracking-wider text-xs mb-2">Option 2</h4>
                    <p className="text-white font-medium text-lg mb-2">Steal my workflow.</p>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      You get instant access to the exact system I use for major label releases. You skip the frustration, fix your workflow, and start finishing music you are proud to release.
                    </p>
                  </div>
                </div>

                <div className="mt-10">
                  <button className="w-full md:w-auto bg-white text-black px-8 py-4 rounded-xl text-lg font-bold hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-3">
                    Join The Producer Blueprint
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <p className="text-zinc-500 text-xs mt-4 text-center md:text-left">
                    Instant Digital Access • One-Time Payment
                  </p>
                </div>
              </div>

              {/* Right: Visual Anchor */}
              <div className="order-1 md:order-2 flex justify-center relative">
                {/* Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#D3FF02]/20 blur-[100px] rounded-full pointer-events-none"></div>
                
                <img 
                  src={productStackMockup} 
                  alt="The Producer Blueprint Package" 
                  className="relative z-10 w-full max-w-sm drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                />
              </div>

            </div>
          </div>
        </section>

        {/* ================= ROBUST FOOTER ================= */}
        <footer className="bg-[#030303] border-t border-zinc-900 pt-16 pb-8 px-6">
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
    </div>
  );
};

export default TheProducerBlueprint001;
