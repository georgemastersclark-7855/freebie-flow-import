import { useEffect, useState, useRef } from "react";
import { ArrowRight, Check, CheckCircle2, Play, Pause, Star, ChevronDown, Zap, X } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// =====================================================================
// THE PRODUCER BLUEPRINT - OPTIMIZED LANDING PAGE
// =====================================================================
// 
// CONVERSION OPTIMIZATION CHANGES FROM ORIGINAL:
// 
// 1. RESTRUCTURED PAGE FLOW: Pain → Belief → Solution → Proof → Offer
// 2. PAIN-LED HEADLINE: Opens with their problem, not our solution
// 3. REMOVED ABOVE-VSL CTA: Let them watch first, then decide
// 4. ADDED BELIEF INSTALLATION: Section that reframes the root cause
// 5. COMPRESSED "MEET ROB": Credibility without self-indulgence
// 6. OUTCOME-FOCUSED CURRICULUM: "What you'll be able to do" not features
// 7. TESTIMONIALS AFTER DESIRE: Moved social proof to reinforce, not lead
// 8. AUTHENTIC URGENCY: Outcome-based ("another year passes") not timers
// 9. RISK REVERSAL LANGUAGE: Addressed without fake guarantees
// 10. EXIT INTENT POPUP: Email capture for retargeting
// 11. STICKY MOBILE CTA: Appears after scrolling past hero
// 12. FAQ EXPANDED: Addresses all key objections from Customer Avatar
// 
// NO COUNTDOWN TIMERS. NO FAKE SCARCITY. NO GURU TACTICS.
// This audience is too sophisticated for that.
// =====================================================================

// =========================
// ASSET IMPORTS (Same as original - adjust paths as needed)
// =========================
import testimonial1 from "@/assets/testimonials/testimonial-1.jpeg";
import testimonial2 from "@/assets/testimonials/testimonial-2.jpeg";
import testimonial3 from "@/assets/testimonials/testimonial-3.jpeg";
import austriaTestimonial from "@/assets/testimonials/austria-testimonial.jpg";
import rsmyth111Testimonial from "@/assets/testimonials/rsmyth111-testimonial.jpeg";
import levinMusicTestimonial from "@/assets/testimonials/levin-music-testimonial.jpeg";
import deepintheforestTestimonial from "@/assets/testimonials/deepintheforest-testimonial.jpg";
import nateSawyerTestimonial from "@/assets/testimonials/nate-sawyer-testimonial.jpg";
import completePackageTestimonial from "@/assets/testimonials/complete-package-testimonial.jpg";
import switzerlandTestimonial from "@/assets/testimonials/switzerland-testimonial.jpeg";
import djkieraTestimonial from "@/assets/testimonials/djkiera-testimonial.mp4";
import djkieraThumbnail from "@/assets/testimonials/djkiera-thumbnail.jpg";
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
import usingAbletonGif from "@/assets/using-ableton.gif";
import robMarshmello from "@/assets/rob-marshmello.jpg";
import robMarsmelloCropped from "@/assets/rob-marshmello-cropped.jpg";
import robStudio from "@/assets/rob-home-studio.jpg";
import robGaryBarlow from "@/assets/rob-gary-barlow.jpg";
import robHomeStudioWide from "@/assets/rob-home-studio-wide.jpg";
import robChainsmokers from "@/assets/rob-chainsmokers.jpg";
import robChainsmokersGif from "@/assets/rob-chainsmokers.gif";
import robFirstStudio from "@/assets/rob-first-studio.jpg";
import robLockdownStudio from "@/assets/rob-lockdown-guitar.png";
import robLateSignature from "@/assets/rob-late-signature-white.png";
import robWritingSession from "@/assets/rob-writing-session.jpg";
import vocalProductionStudio from "@/assets/vocal-production-studio.png";
import abletonSession from "@/assets/ableton-session.png";
import drumProductionGif from "@/assets/drum-production.gif";
import mixingMasteringStudio from "@/assets/mixing-mastering-studio.jpg";
import soundDesignStudio from "@/assets/sound-design-studio.png";
import tiktokBreakdownVault from "@/assets/tiktok-breakdown-vault.png";
import robOnLaptop from "@/assets/rob-on-laptop.jpg";
import robPovStudio from "@/assets/rob-pov-studio-new.png";
import producerBlueprintThumbnail from "@/assets/producer-blueprint-thumbnail.jpg";
import abletonTemplatesThumbnail from "@/assets/ableton-templates-thumbnail.png";
import socialMediaBonusThumbnail from "@/assets/social-media-bonus-thumbnail.png";
import tiktokVaultThumbnail from "@/assets/tiktok-vault-thumbnail.png";
import avatarBen from "@/assets/avatars/avatar-ben.webp";
import avatarProducer1 from "@/assets/avatars/avatar-producer-1.png";
import avatarProducer2 from "@/assets/avatars/avatar-producer-2.png";
import avatarProducer3 from "@/assets/avatars/avatar-producer-3.png";
import avatarKosana from "@/assets/avatars/avatar-kosana.jpg";

// =========================
// EXIT INTENT POPUP COMPONENT
// =========================
const ExitIntentPopup = ({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to email service (Klaviyo, etc.)
    console.log("Email captured:", email);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-fade-in-up">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Wait - before you go...
            </h3>
            <p className="text-zinc-400 mb-6">
              Get my free <span className="text-white font-semibold">"Producer's Starter Kit"</span> - 
              3 Ableton templates + my personal drum samples. No spam, just value.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your best email"
                required
                className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#D3FF02]/50 transition-colors"
              />
              <button
                type="submit"
                className="w-full bg-[#D3FF02] text-black font-bold py-3 px-6 rounded-xl hover:bg-[#b8e000] transition-colors"
              >
                Send Me The Free Kit →
              </button>
            </form>

            <p className="text-zinc-600 text-xs mt-4 text-center">
              Join 12,000+ producers on the list
            </p>
          </>
        ) : (
          <div className="text-center py-8">
            <CheckCircle2 className="w-12 h-12 text-[#D3FF02] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Check your inbox!</h3>
            <p className="text-zinc-400">The Starter Kit is on its way.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// =========================
// STICKY MOBILE CTA COMPONENT
// =========================
const StickyMobileCTA = ({ visible }: { visible: boolean }) => {
  if (!visible) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-black/95 backdrop-blur-md border-t border-zinc-800 p-3 animate-slide-up">
      <a 
        href="#pricing"
        className="flex items-center justify-center gap-2 bg-[#D3FF02] text-black font-bold py-3 px-6 rounded-xl w-full"
      >
        Get Instant Access - $297
        <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
};

// =========================
// TESTIMONIAL CARD COMPONENT (Unchanged from original)
// =========================
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
}

const TestimonialCard = ({ id, name, handle, title, media, isVideo, quote, avatar, poster }: TestimonialCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoClick = () => {
    if (!videoRef.current || !isVideo) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="snap-center shrink-0 w-[85vw] max-w-[320px] md:w-auto md:max-w-none bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-colors group">
      {/* Profile Header */}
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
            <svg viewBox="0 0 22 22" className="h-3.5 w-3.5 fill-[#0095F6]">
              <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
            </svg>
          </div>
          <p className="text-zinc-500 text-xs">{handle} • {title}</p>
        </div>
      </div>

      {/* Media */}
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
            muted
            loop
            playsInline
            preload="none"
          />
        ) : (
          <img 
            src={media}
            alt={`${name} testimonial`}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
            loading="lazy"
          />
        )}
        {isVideo && !isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
              <Play className="w-6 h-6 text-white fill-white ml-1" />
            </div>
          </div>
        )}
      </div>

      {/* Quote */}
      <div className="p-5 md:p-6">
        <p className="text-zinc-200 text-base font-medium leading-snug">"{quote}"</p>
      </div>
    </div>
  );
};

// =========================
// MAIN LANDING PAGE COMPONENT
// =========================
const ClaudeTest = () => {
  // State
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const exitIntentShown = useRef(false);

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !exitIntentShown.current) {
        exitIntentShown.current = true;
        setShowExitIntent(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  // Sticky CTA visibility on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight * 0.8;
      setShowStickyCTA(scrollY > heroHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load Vidalytics script
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.innerHTML = `
      (function (v, i, d, a, l, y, t, c, s) {
        y='_'+d.toLowerCase();c=d+'L';if(!v[d]){v[d]={};}if(!v[c]){v[c]={};}if(!v[y]){v[y]={};}var vl='Loader',vli=v[y][vl],vsl=v[c][vl + 'Script'],vlf=v[c][vl + 'Loaded'],ve='Embed';
        if (!vsl){vsl=function(u,cb){
          if(t){cb();return;}s=i.createElement("script");s.type="text/javascript";s.async=1;s.src=u;
          if(s.readyState){s.onreadystatechange=function(){if(s.readyState==="loaded"||s.readyState=="complete"){s.onreadystatechange=null;vlf=1;cb();};};}else{s.onload=function(){vlf=1;cb();};}
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

  // Module data with OUTCOME-FOCUSED descriptions
  const modules = [
    {
      id: "01",
      title: "The Foundation",
      subtitle: "(Ableton Basics)",
      outcome: "After this, you'll stop fighting your DAW and work 2x faster with templates and shortcuts that actually stick.",
      desc: "Set up the exact templates, shortcuts, and preferences I use to stay in flow state. Skippable if you're advanced.",
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
      outcome: "After this, you'll build the exact sounds you hear in your head instead of endlessly scrolling through presets.",
      desc: "DIY sampling techniques to create a sonic fingerprint unique to YOU. Master synthesis fundamentals to build pads, plucks, and basses from scratch.",
      image: soundDesignStudio,
      lessons: [
        "ADSR Synthesis: The Building Blocks",
        "Secret Sauce: My Synth Plugin Toolbox",
        "Designing Smooth Pads From Scratch",
        "Creating Rhythmic Plucks",
        "Sub Bass Essentials",
        "Ultimate Serum Deep-Dive",
        "Serum Sound Design Masterclass",
        "Freezing & Slicing Audio",
        "Sidechain Secrets: Pumping FX",
        "Analogue Workflows: External FX Pedals"
      ]
    },
    {
      id: "03",
      title: "Pro Drum Production",
      outcome: "After this, your drums will finally punch through laptop speakers and sound 'pro' without hours of processing.",
      desc: "The difference between 'demo' and 'pro' is usually in the drums. Sample selection, arrangement, bus processing, and more.",
      image: drumProductionGif,
      lessons: [
        "My all time favourite drum plugins",
        "Audio vs. MIDI drums debate",
        "Using percussion tops & loops",
        "The stereo field & panning",
        "Sidechain compression masterclass",
        "Clean & Fat Drum Mixing",
        "Resampling techniques",
        "Real beat breakdown",
        "Creating huge drum fills & transitions",
        "Custom DIY percussion"
      ]
    },
    {
      id: "04",
      title: "Arrangement & Energy",
      outcome: "After this, you'll finally escape the loop phase and turn 8-bar ideas into full songs that hold attention.",
      desc: "How to structure a song to keep listeners hooked. Ear candy, transitions, and energy management.",
      image: abletonSession,
      lessons: [
        "My all time favourite FX plugins",
        "Song structure that holds attention",
        "Creating unique transitions",
        "Designing ear candy & custom ad-libs",
        "Building & Maintaining Huge Energy",
        "Epic Soundscapes & FX",
        "Recording Crispy Acoustic Guitars"
      ]
    },
    {
      id: "05",
      title: "Vocal Production",
      subtitle: "(The \"Secret Sauce\")",
      outcome: "After this, you'll get crispy, release-ready vocals even in an untreated bedroom.",
      desc: "Recording, processing, harmony stacking, and tuning workflows. The vocal chain I use on major sessions.",
      image: vocalProductionStudio,
      lessons: [
        "My personal recording setup",
        "How to get clean & crispy vocals",
        "My personal vocal chain",
        "Using Autotune & Melodyne",
        "Ultimate Reverb Masterclass Pt. 1 & 2",
        "Audio comping & songwriting secrets",
        "Harmonies, placement & mixing",
        "Recording gang vocals",
        "Vocal adlibs + my personal FX chain"
      ]
    },
    {
      id: "06",
      title: "Mixing & Mastering",
      outcome: "After this, your tracks will be polished enough to send to artists, labels, or release yourself - no engineer needed.",
      desc: "Get music release-ready. This isn't about competing with world-class mix engineers. It's about finishing the job.",
      image: mixingMasteringStudio,
      lessons: [
        "The honest truth about mixing & mastering",
        "Fix your monitoring & room acoustics",
        "EQ 101: Getting insanely clean mixes",
        "Creating Space: Dynamic EQ",
        "EQ automation life hack",
        "Advanced frequency carving",
        "The Truth About Compression",
        "Sidechain compression deep dive",
        "My personal mastering chain",
        "How to export stems"
      ]
    },
    {
      id: "07",
      title: "Artist Sounds & Identity",
      outcome: "After this, you'll know how to deconstruct any trending sound and rebuild it with your own fingerprint.",
      desc: "Analyze trends without copying them. Build a reference playlist and capture ideas with your unique sonic identity.",
      image: robWritingSession,
      lessons: [
        "Finding Your Own Sound",
        "Using Splice the right way",
        "Giving tracks a unique sonic fingerprint",
        "Creating Melody Loops",
        "Vocal stutter effects",
        "Huge retro drums",
        "Fat 808's",
        "UK Garage, Drum & Bass + Future House percussion"
      ]
    },
  ];

  // FAQ data - EXPANDED to address all key objections
  const faqs = [
    {
      id: "ableton",
      question: "Do I need to use Ableton Live?",
      answer: "I teach everything in Ableton Live and include my personal project files/templates for Ableton. However, the principles of sound design, arrangement, mixing, and vocal production apply to any DAW (FL Studio, Logic, Pro Tools). We have had plenty of students working in other DAWs who have had huge success. If you use another DAW, you can still get massive value - you just won't be able to open the project files."
    },
    {
      id: "courses-before",
      question: "I've bought courses before and they didn't help. How is this different?",
      answer: "Most courses are taught by people who teach for a living, not people who produce for a living. They give you theory that sounds good but doesn't actually help when you sit down to make music. I'm still in the trenches working with artists weekly. I'm not showing you theory - I'm showing you what I actually do on real sessions. The decisions I make. The problems I run into. How I solve them. And more importantly - why."
    },
    {
      id: "youtube",
      question: "Can't I just learn this on YouTube for free?",
      answer: "You could try. But here's the problem: most YouTubers are content creators optimising for views, not producers optimising for workflow. Their advice often conflicts. You'll spend years piecing together fragments that don't connect into a cohesive process. I've seen producers stuck in this loop for 5+ years. The Blueprint gives you the whole picture in one place - the complete workflow from someone actually doing it at the highest level."
    },
    {
      id: "beginner",
      question: "Is this course for beginners?",
      answer: "This course is designed for intermediate producers who know the basics but are stuck in the 'loop phase' or aren't happy with their mix quality. However, Module 1 covers foundations for beginners or those switching to Ableton. If you're brand new to production, I'd recommend getting comfortable with your DAW basics first, then coming back."
    },
    {
      id: "genre",
      question: "What genres does this cover?",
      answer: "This is a multi-genre course. I'm known for Pop and EDM productions, so it's centred around that. However, the principles are universal - sound design, arrangement, mixing, workflow. These translate to any genre. The techniques I use on Chainsmokers records work just as well for hip-hop, R&B, or electronic music."
    },
    {
      id: "plugins",
      question: "Do I need expensive 3rd party plugins?",
      answer: "No. While I show you my favorite paid plugins (Serum, FabFilter, etc.), I always explain the fundamental concept first and dedicate entire sections to stock plugin alternatives. You can achieve professional results with stock tools if you know how to use them. The problem is rarely your plugins - it's your process."
    },
    {
      id: "time",
      question: "How much time do I need to commit?",
      answer: "The full program is 75+ lessons, but you don't need to watch everything at once. Most students go through the core modules in 4-6 weeks at 3-4 hours per week. The lessons are designed so you can apply what you learn immediately in your sessions - not just watch passively."
    },
    {
      id: "access",
      question: "How long do I get access for?",
      answer: "You get 12 months of full access to the complete course, all downloads, and any updates released during that period. This is a one-time payment, not a subscription. Most students complete the program well within this timeframe."
    },
    {
      id: "results",
      question: "What results can I expect?",
      answer: "I can't promise you'll become the next Marshmello - that depends on your effort and creativity. What I can promise is that you'll finally have a clear reference point for how professional music actually gets made. Students consistently report: finishing tracks for the first time in years, getting their first placements, and finally understanding what was 'missing' from their process."
    },
    {
      id: "refund",
      question: "What if it's not for me?",
      answer: "Due to the digital nature of this product (downloadable files, templates, project files), all sales are final. I'm upfront about this because I want you to be certain before you join. Watch the free training video above, read the testimonials, and if you have questions, email team@roblate.com before purchasing."
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans relative overflow-x-hidden">
      
      {/* Exit Intent Popup */}
      <ExitIntentPopup 
        isOpen={showExitIntent} 
        onClose={() => setShowExitIntent(false)} 
      />
      
      {/* Sticky Mobile CTA */}
      <StickyMobileCTA visible={showStickyCTA} />

      {/* =========================
          NAVIGATION
          ========================= */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 max-w-7xl mx-auto">
        <div className="text-xl font-bold tracking-tight">
          The Producer Blueprint<sup className="text-[10px] font-normal ml-0.5">™</sup>
        </div>
        <a 
          href="#pricing" 
          className="bg-white text-black px-5 py-2 rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors"
        >
          Get Access
        </a>
      </nav>

      {/* =========================
          HERO SECTION
          - PAIN-LED HEADLINE (Not solution description)
          - NO CTA above VSL (Let them watch first)
          - Disqualification hook
          ========================= */}
      <main className="relative z-10 px-6 md:px-12 pt-8 md:pt-16 pb-4 md:pb-24 max-w-5xl mx-auto text-center">
        
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D3FF02]/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
        
        {/* Disqualification Hook - Creates "velvet rope" psychology */}
        <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-400 text-xs font-medium mb-6">
          <span className="text-zinc-500">For intermediate producers stuck in the loop phase</span>
        </div>

        {/* PAIN-LED HEADLINE */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-[-0.04em] leading-[1.1] mb-6">
          Most Producers Don't Have A <span className="text-zinc-400">Talent</span> Problem.
          <br />
          <span className="font-serif italic font-normal tracking-normal">They Have A Finishing Problem.</span>
        </h1>

        {/* Subheadline - Speaks to THEIR pain, not our solution */}
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed">
          If your hard drive is full of 8-bar loops that never became songs - if you know what good music sounds like but your stuff just doesn't sound like that yet - 
          <span className="text-white"> watch this.</span>
        </p>

        {/* Social Proof - Below subhead, above VSL */}
        <div className="flex items-center justify-center gap-3 md:gap-4 mb-8">
          <div className="flex -space-x-3">
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

        {/* VSL CONTAINER - NO CTA ABOVE */}
        <div className="w-full max-w-4xl mx-auto relative group mb-8">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-[#D3FF02]/10 blur-3xl rounded-[30px] opacity-40 group-hover:opacity-60 transition duration-700" />

          {/* VSL Label */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
            <span className="bg-zinc-900 border border-zinc-800 px-4 py-1.5 rounded-full text-xs font-medium text-zinc-400">
              ▶ Free Training (12 min)
            </span>
          </div>

          {/* Video Container */}
          <div className="relative w-full bg-zinc-900 rounded-[24px] border border-white/10 overflow-hidden shadow-2xl">
            <div
              id="vidalytics_embed_V5HrhyRBNAeDtppA"
              className="relative z-10 w-full"
              style={{ width: "100%", position: "relative", paddingTop: "56.25%" }}
            />
          </div>
        </div>

        {/* CTA AFTER VSL - Soft commitment language */}
        <div className="flex flex-col items-center gap-4">
          <a 
            href="#pricing" 
            className="inline-flex items-center gap-2 bg-[#D3FF02] text-black px-8 py-4 rounded-2xl text-lg font-bold hover:bg-[#b8e000] transition-all shadow-[0_0_40px_rgba(211,255,2,0.3)]"
          >
            Start The Blueprint Today
            <ArrowRight className="w-5 h-5" />
          </a>
          <p className="text-zinc-500 text-sm">
            Join 500+ producers who've upgraded their workflow
          </p>
        </div>
      </main>

      {/* =========================
          PAIN AGITATION SECTION
          - Moved UP (before solution)
          - More visceral language
          - Cost of inaction
          ========================= */}
      <section className="py-20 md:py-32 px-6 bg-[#050505] relative z-10">
        {/* Red ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-red-900/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block text-[#D3FF02] text-xs font-bold uppercase tracking-widest mb-4">
              Sound Familiar?
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Your hard drive is a graveyard.
            </h2>
            <p className="text-zinc-500 text-lg mt-4 max-w-2xl mx-auto">
              Folders full of projects you started with excitement and abandoned at the 8-bar mark. Ideas that felt great for 20 minutes and then just... died.
            </p>
          </div>

          {/* Pain Points - Visceral, specific language */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-3">The Loop That Never Ends</h3>
              <p className="text-zinc-400 leading-relaxed">
                You open your DAW, you mess around, you get something going. Then you hit a wall. You don't know what comes next. You start tweaking things that don't need tweaking. You second-guess every decision. Eventually you save the project, tell yourself you'll come back to it, and you never do.
              </p>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-3">The Gap You Can Hear</h3>
              <p className="text-zinc-400 leading-relaxed">
                Maybe once in a while you actually finish something. But it takes months. And even then, you're not sure it's good enough to release. You compare it to the records you admire and something's just... off. You can hear the gap. You just can't close it.
              </p>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-3">Tutorial Hell</h3>
              <p className="text-zinc-400 leading-relaxed">
                You've watched hundreds of hours of YouTube tutorials. Conflicting advice from dozens of creators who all disagree with each other. Tips and tricks that work in isolation but fall apart when you try to make an actual song. The problem isn't that you don't have enough information. You have too much.
              </p>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-3">The Plugin Trap</h3>
              <p className="text-zinc-400 leading-relaxed">
                You've bought plugins you were sure would fix your sound. Downloaded sample packs, maybe taken a course or two. You've done everything you're supposed to do. And yet. Your music still sounds like a demo. No plugin is going to fix that.
              </p>
            </div>
          </div>

          {/* Cost of Inaction - Authentic urgency */}
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-zinc-400 text-lg leading-relaxed mb-4">
              If you keep doing what you've been doing, you'll still be collecting loops this time next year. And the year after that.
            </p>
            <p className="text-white text-xl font-medium">
              A year from now, you could still be stuck. Or you could have a catalog of finished music you're actually proud of.
            </p>
          </div>
        </div>
      </section>

      {/* =========================
          BELIEF INSTALLATION SECTION
          - NEW SECTION (wasn't in original)
          - Reframes the root cause
          - Installs beliefs #1, #2, #3
          ========================= */}
      <section className="py-20 md:py-32 px-6 bg-[#050505] border-t border-zinc-900 relative z-10">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4">
              Here's The Truth
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight mb-6">
              It's not your talent. It's not your gear.
            </h2>
          </div>

          {/* Belief Installation Content */}
          <div className="space-y-8 text-lg text-zinc-400 leading-relaxed max-w-3xl mx-auto">
            
            <p>
              <span className="text-white font-medium">The problem isn't your gear.</span> I've heard bedroom producers make incredible music on laptops and headphones. I do it - at airports, coffee shops, while travelling. And I've seen guys with ten thousand dollar setups make absolute garbage. Gear doesn't close the gap.
            </p>

            <p>
              <span className="text-white font-medium">The problem isn't talent either.</span> If you can hear that your music isn't where you want it to be, you have taste. Taste is the hard part. Execution can be learned.
            </p>

            <p>
              <span className="text-white font-medium">And it's definitely not more tutorials.</span> Most of those guys are content creators optimising for views. Not producers taking real sessions optimising for workflow and output. That's why their advice feels fragmented - because it is.
            </p>

            <div className="bg-zinc-900/50 border-l-4 border-[#D3FF02] p-6 rounded-r-xl my-12">
              <p className="text-white text-xl font-medium mb-2">
                So what IS the problem?
              </p>
              <p className="text-zinc-300">
                You've never actually seen how this gets done. On an average day. Routinely. To a deadline. Not a tutorial on one isolated technique. The actual workflow. The decision-making. How someone navigates from blank project to finished song without getting stuck.
              </p>
              <p className="text-[#D3FF02] font-bold mt-4">
                You've seen fragments. You've never seen the whole picture.
              </p>
            </div>

            <p className="text-center text-white text-xl">
              That's exactly why I built The Producer Blueprint.
            </p>
          </div>
        </div>
      </section>

      {/* =========================
          SOLUTION REVEAL
          - What the Blueprint IS
          - Features as outcomes
          ========================= */}
      <section className="relative py-20 md:py-32 px-6 bg-[#050505] border-t border-zinc-900">
        
        {/* Hero Image with Vignette */}
        <div className="relative w-full max-w-6xl mx-auto h-[400px] md:h-[500px] overflow-hidden rounded-3xl mb-16">
          <img 
            src={robHomeStudioWide}
            className="w-full h-full object-cover object-center opacity-70"
            alt="Rob in Home Studio"
          />
          {/* Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/50"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/50 via-transparent to-[#050505]/50"></div>
          
          {/* Overlay Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <span className="text-[#D3FF02] text-xs font-bold uppercase tracking-widest mb-4">
              Introducing
            </span>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
              The Producer Blueprint
            </h2>
            <p className="text-zinc-300 text-lg md:text-xl max-w-2xl">
              The complete production workflow from a working producer with 100M+ streams.
              <br />
              <span className="text-white font-medium">All from a home studio.</span>
            </p>
          </div>
        </div>

        {/* What You Get */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-zinc-400 text-lg">
              See exactly how I approach production - not how I think you should approach it, but 
              <span className="text-white font-medium"> what I actually do when I sit down to make music.</span>
            </p>
          </div>

          {/* Feature Cards - Outcome Focused */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "🎯",
                title: "Escape The Loop Phase",
                desc: "Watch my personal workflow for taking a track from a 4-bar idea to a complete arrangement. No rigid frameworks - just the fluid process of actually finishing songs."
              },
              {
                icon: "🎚️",
                title: "Functional Mixing",
                desc: "Get tracks release-ready without hiring an engineer. This isn't about competing with world-class mixers - it's about finishing the job yourself."
              },
              {
                icon: "🔊",
                title: "Sound Design With Intent",
                desc: "Stop relying on happy accidents. Build the exact 808s, leads, and pads you hear in your head instead of endlessly hunting through Splice."
              },
              {
                icon: "💡",
                title: "The 'Why' Behind Everything",
                desc: "Not just what I do, but why I do it. So you can apply the thinking to your own music and solve problems independently."
              }
            ].map((card, idx) => (
              <div key={idx} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-colors">
                <div className="text-3xl mb-4">{card.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{card.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================
          CREDIBILITY SECTION (Compressed)
          - Installs Belief #4
          - Shorter than original
          ========================= */}
      <section className="py-20 md:py-32 px-6 bg-[#050505] border-t border-zinc-900">
        <div className="max-w-5xl mx-auto">
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Image */}
            <div className="relative">
              <img 
                src={robChainsmokers}
                alt="Rob with The Chainsmokers"
                className="rounded-2xl shadow-2xl"
              />
            </div>

            {/* Content - Compressed credibility */}
            <div>
              <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4 block">
                About Rob
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                Still in the trenches.
                <br />
                <span className="text-zinc-400">Not a retired pro.</span>
              </h2>
              
              <div className="space-y-4 text-zinc-400 leading-relaxed">
                <p>
                  I've worked with The Chainsmokers, Marshmello, Clean Bandit, Take That. Over 100 million streams. All from a home studio in Oxford.
                </p>
                <p>
                  No label. No manager at the start. Drew from The Chainsmokers literally found me through an Instagram video and DM'd me. Gary Barlow came to my house for sessions - we'd only connected through social media.
                </p>
                <p className="text-white font-medium">
                  I'm not a retired pro teaching techniques from 10 years ago. I'm not a YouTuber who just teaches. I'm in sessions weekly with major artists - and I'm showing you exactly what I do.
                </p>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-zinc-800">
                <div>
                  <div className="text-2xl font-bold text-white">100M+</div>
                  <div className="text-zinc-500 text-sm">Streams</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">170K+</div>
                  <div className="text-zinc-500 text-sm">Followers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">500+</div>
                  <div className="text-zinc-500 text-sm">Students</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          CURRICULUM SECTION
          - Outcome-focused descriptions
          - Cleaner accordion
          ========================= */}
      <section id="curriculum" className="py-20 md:py-32 px-6 bg-[#050505] border-t border-zinc-900 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4">
              What's Inside
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              7 Modules. 75+ Lessons.
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              The complete workflow from idea to release-ready track.
            </p>
          </div>

          {/* Module List */}
          <div className="space-y-4">
            {modules.map((module) => {
              const isOpen = expandedModule === module.id;
              
              return (
                <div 
                  key={module.id}
                  className={`border rounded-2xl overflow-hidden transition-all ${
                    isOpen ? 'border-zinc-600 bg-zinc-900' : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700'
                  }`}
                >
                  {/* Module Header */}
                  <button
                    onClick={() => setExpandedModule(isOpen ? null : module.id)}
                    className="w-full p-6 text-left flex items-start gap-4"
                  >
                    <span className="text-zinc-600 font-mono text-sm mt-1">{module.id}</span>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {module.title}
                        {module.subtitle && (
                          <span className="font-serif italic font-normal text-zinc-500 ml-2">
                            {module.subtitle}
                          </span>
                        )}
                      </h3>
                      {/* OUTCOME-FOCUSED tagline */}
                      <p className="text-[#D3FF02] text-sm font-medium mb-2">
                        {module.outcome}
                      </p>
                      <p className="text-zinc-500 text-sm">
                        {module.desc}
                      </p>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Expanded Lessons */}
                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 border-t border-zinc-800">
                      <div className="grid md:grid-cols-2 gap-2">
                        {module.lessons.map((lesson, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-zinc-400 text-sm py-1">
                            <Check className="w-4 h-4 text-[#D3FF02]" />
                            {lesson}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bonuses */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <span className="inline-block bg-[#D3FF02]/10 text-[#D3FF02] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
                Plus 2 Free Bonuses
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Bonus #1</span>
                  <span className="text-[#D3FF02] text-sm font-bold">FREE</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Music Business Module</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Turn production into income. How I built 170k+ followers and multiple income streams without a manager or label deal. The exact content strategy that got Drew from The Chainsmokers to DM me.
                </p>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Bonus #2</span>
                  <span className="text-[#D3FF02] text-sm font-bold">FREE</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">TikTok/IG Breakdown Vault</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Project files and walkthroughs from my most viral content. See the exact layers, processing, and decisions behind the videos. Updated regularly with new breakdowns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          SOCIAL PROOF SECTION
          - AFTER desire is established
          - Result-focused testimonials
          ========================= */}
      <section id="testimonials" className="py-20 md:py-32 px-6 bg-[#050505] border-t border-zinc-900 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4">
              Student Results
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Real producers. Real results.
            </h2>
            <p className="text-zinc-400 text-lg">
              These aren't people with more talent than you. They just got a workflow that works.
            </p>
          </div>

          {/* Video Testimonials Carousel */}
          <div 
            className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory gap-4 pb-8 -mx-6 px-6 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0 md:mx-0 md:px-0 scrollbar-hide mb-16"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <TestimonialCard
              id="kiera"
               name="Kosana"
               handle="@djkosana"
              title="International DJ"
              media={djkieraTestimonial}
              isVideo={true}
              quote="The best investment I've made for my music career."
              avatar={avatarKosana}
              poster={djkieraThumbnail}
            />
            <TestimonialCard
              id="david"
              name="David R."
              handle="@david.prod"
              title="Label-Signed Producer"
              media={headroomRecordsTestimonial}
              isVideo={false}
              quote="Headroom Records wants to sign my next single!"
              avatar={avatarProducer1}
            />
            <TestimonialCard
              id="sarah"
              name="Sarah J."
              handle="@sarah.music"
              title="Electronic Producer"
              media={streamingNumbersTestimonial}
              isVideo={false}
              quote="Highest streaming numbers yet. 12k on the latest track."
              avatar={avatarProducer2}
            />
          </div>

          {/* Screenshot Wall */}
          <div className="columns-2 lg:columns-3 gap-4 space-y-4">
            {[
              drewAdieuTestimonial,
              nateSawyerTestimonial,
              austriaTestimonial,
              deepintheforestTestimonial,
              completePackageTestimonial,
              rsmyth111Testimonial,
            ].map((img, idx) => (
              <div key={idx} className="break-inside-avoid rounded-xl border border-zinc-800 overflow-hidden">
                <img src={img} alt={`Testimonial ${idx + 1}`} className="w-full h-auto opacity-90 hover:opacity-100 transition-opacity" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================
          PRICING SECTION
          - Clear value stack
          - Risk reversal language
          - No fake countdown timers
          ========================= */}
      <section id="pricing" className="py-20 md:py-32 px-6 bg-[#050505] border-t border-zinc-900 scroll-mt-20">
        <div className="max-w-xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Get Instant Access
            </h2>
            <p className="text-zinc-400">
              Everything you need to stop collecting loops and start finishing music.
            </p>
          </div>

          {/* Pricing Card */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden">
            
            {/* SSL Badge */}
            <div className="flex items-center justify-center gap-2 p-4 border-b border-zinc-800">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="text-zinc-500 text-xs uppercase tracking-wider">Secure Checkout</span>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              
              {/* What's Included */}
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-semibold">The Producer Blueprint™</p>
                    <p className="text-zinc-500 text-sm">7 Modules • 75+ Lessons • Project Files</p>
                  </div>
                  <span className="text-zinc-400 font-mono">$497</span>
                </div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-semibold">Ableton Templates & Files</p>
                    <p className="text-zinc-500 text-sm">The exact templates I use in sessions</p>
                  </div>
                  <span className="text-zinc-400 font-mono">$197</span>
                </div>

                <div className="h-px bg-zinc-800"></div>

                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-[#D3FF02] text-xs font-bold">BONUS</span>
                    <p className="text-white font-semibold">Music Business Module</p>
                  </div>
                  <span className="text-[#D3FF02] font-mono">FREE</span>
                </div>
                
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-[#D3FF02] text-xs font-bold">BONUS</span>
                    <p className="text-white font-semibold">Breakdown Vault</p>
                  </div>
                  <span className="text-[#D3FF02] font-mono">FREE</span>
                </div>
              </div>

              {/* Total */}
              <div className="bg-zinc-800/50 rounded-xl p-4 text-center">
                <p className="text-zinc-500 text-sm mb-1">Total Value: <span className="line-through">$938</span></p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-zinc-400">12 Months Access:</span>
                  <span className="text-4xl font-bold text-white">$297</span>
                </div>
                <p className="text-zinc-600 text-xs mt-2">One-time payment. No subscription.</p>
              </div>

              {/* CTA */}
              <a 
                href="https://checkout.roblate.com/blueprint" 
                className="block w-full bg-[#D3FF02] text-black font-bold py-4 px-8 rounded-xl text-lg text-center hover:bg-[#b8e000] transition-all shadow-[0_0_30px_rgba(211,255,2,0.3)]"
              >
                Get Instant Access →
              </a>

              {/* Trust Signals */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3" /> Instant Digital Access
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3" /> 12 Months Full Access
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Start Learning Today
                </span>
              </div>
            </div>

            {/* Risk Reversal - Honest, not fake guarantee */}
            <div className="bg-zinc-900 border-t border-zinc-800 p-6 text-center">
              <p className="text-zinc-400 text-sm leading-relaxed">
                <span className="text-white font-medium">Questions before you join?</span>
                <br />
                Email <a href="mailto:team@roblate.com" className="text-[#D3FF02] hover:underline">team@roblate.com</a> and I'll personally help you decide if this is right for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          FAQ SECTION
          - EXPANDED to address all objections
          ========================= */}
      <section className="py-20 md:py-32 px-6 bg-[#050505] border-t border-zinc-900">
        <div className="max-w-3xl mx-auto">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Common Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => {
              const isOpen = expandedFaq === faq.id;
              
              return (
                <div key={faq.id} className="border border-zinc-800 rounded-xl bg-zinc-900/30 overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                    className="w-full p-5 text-left flex justify-between items-center gap-4"
                  >
                    <span className="text-white font-medium">{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-zinc-400 text-sm leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================
          FINAL CTA - "THE CROSSROADS"
          - Authentic urgency (outcome-based)
          - Strong two-paths framework
          ========================= */}
      <section className="py-20 md:py-32 px-6 bg-[#050505] border-t border-zinc-900">
        <div className="max-w-5xl mx-auto">
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 leading-tight">
                You have two choices from here.
              </h2>
              
              <div className="space-y-8">
                <div className="pl-6 border-l-2 border-zinc-800">
                  <h4 className="text-zinc-500 font-bold uppercase tracking-wider text-xs mb-2">Option 1</h4>
                  <p className="text-white font-medium text-lg mb-2">Keep guessing.</p>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    You can keep hunting for free tutorials, piecing together advice from different YouTubers, and wondering why your tracks still don't sound "pro." Another year passes. Your hard drive gets heavier with more unfinished projects. The dream gets quieter.
                  </p>
                </div>

                <div className="pl-6 border-l-2 border-[#D3FF02]">
                  <h4 className="text-[#D3FF02] font-bold uppercase tracking-wider text-xs mb-2">Option 2</h4>
                  <p className="text-white font-medium text-lg mb-2">See how it's actually done.</p>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Get instant access to the exact workflows I use for major label releases. Skip the frustration, fix your process, and start finishing music you're actually proud to release. Most students report major breakthroughs within the first few modules.
                  </p>
                </div>
              </div>

              <div className="mt-10">
                <a 
                  href="#pricing" 
                  className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-xl text-lg font-bold hover:bg-zinc-200 transition-all"
                >
                  Join The Producer Blueprint
                  <ArrowRight className="w-5 h-5" />
                </a>
                <p className="text-zinc-600 text-xs mt-4">
                  Instant Access • One-Time Payment • 12 Months Full Access
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#D3FF02]/20 blur-[100px] rounded-full pointer-events-none"></div>
              <img 
                src={robChainsmokersGif} 
                alt="Rob Late with The Chainsmokers" 
                className="relative z-10 w-full max-w-md rounded-2xl shadow-2xl mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          FOOTER
          ========================= */}
      <footer className="bg-[#030303] border-t border-zinc-900 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-white font-bold mb-4">The Producer Blueprint</h3>
              <p className="text-zinc-600 text-sm">The complete program for modern music production.</p>
            </div>
            <div>
              <h4 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4">Program</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#curriculum" className="text-zinc-600 hover:text-white transition-colors">Curriculum</a></li>
                <li><a href="#testimonials" className="text-zinc-600 hover:text-white transition-colors">Testimonials</a></li>
                <li><a href="#pricing" className="text-zinc-600 hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/privacy" className="text-zinc-600 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="text-zinc-600 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4">Support</h4>
              <a href="mailto:team@roblate.com" className="text-zinc-400 hover:text-white transition-colors text-sm">
                team@roblate.com
              </a>
            </div>
          </div>

          <div className="border-t border-zinc-900 pt-8 text-center">
            <p className="text-zinc-700 text-xs">
              © {new Date().getFullYear()} Rob Late Music. All rights reserved.
            </p>
            <p className="text-zinc-800 text-[10px] mt-4 max-w-2xl mx-auto">
              This site is not a part of the Facebook website or Facebook Inc. FACEBOOK is a trademark of FACEBOOK, Inc. 
              Results mentioned are not typical. Your results will vary based on effort and other factors.
            </p>
          </div>
        </div>
      </footer>

      {/* Bottom padding for sticky CTA on mobile */}
      <div className="h-20 md:hidden"></div>
    </div>
  );
};

export default ClaudeTest;
