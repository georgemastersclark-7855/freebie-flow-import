import { useEffect } from "react";
import { ArrowRight, Check, Play, Star, X, Youtube } from "lucide-react";
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

// Signature Placeholder
const robSignature = "https://placehold.co/300x100/000000/FFFFFF/png?text=Rob+Late+Signature";

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
  const miniSocialProofImages = [
    austriaTestimonial,
    rsmyth111Testimonial,
    levinMusicTestimonial,
    deepintheforestTestimonial,
    nateSawyerTestimonial,
    completePackageTestimonial,
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans relative overflow-hidden">
      {/* Aurora Glow Effect */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse at center bottom, rgba(255,200,150,0.15) 0%, rgba(255,120,50,0.1) 25%, rgba(255,79,51,0.05) 50%, transparent 70%)",
        }}
      />

      {/* Navigation Bar */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 max-w-7xl mx-auto">
        <div className="text-xl font-bold tracking-tight">The Producer Blueprint</div>
        <div className="flex items-center gap-6">
          <a href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">
            Log In
          </a>
          <button className="bg-white text-black px-5 py-2 rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors">
            Get Instant Access
          </button>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="relative z-10 px-6 md:px-12 pt-16 md:pt-24 pb-20 max-w-5xl mx-auto text-center">
        {/* HERO AMBIENT GLOW */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FF4F33]/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
        
        {/* Social Proof Eyebrow */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="flex -space-x-3 relative">
            <Avatar className="w-10 h-10 border-2 border-[#050505]">
              <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" />
              <AvatarFallback>U1</AvatarFallback>
            </Avatar>
            <Avatar className="w-10 h-10 border-2 border-[#050505]">
              <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" />
              <AvatarFallback>U2</AvatarFallback>
            </Avatar>
            <Avatar className="w-10 h-10 border-2 border-[#050505]">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" />
              <AvatarFallback>U3</AvatarFallback>
            </Avatar>
            {/* +500 Badge */}
            <div className="w-10 h-10 rounded-full bg-[#FF4F33] border-2 border-[#050505] flex items-center justify-center text-white text-[10px] font-bold">
              +500
            </div>
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
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.04em] leading-[1.05] mb-6">
          The Complete Production Workflow.
          <br />
          <span className="font-serif italic font-normal tracking-normal text-zinc-200">Start to Finish.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Watch <span className="text-white font-semibold">Rob Late</span> (The Chainsmokers, Marshmello, Clean Bandit)
          demonstrate the end-to-end process he uses to write, produce, and mix professional records from a home studio.
        </p>

        {/* CTA Area */}
        <div className="mb-8">
          <button className="inline-flex items-center gap-2 bg-[#FF4F33] text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-[#e64530] transition-all shadow-[0_0_40px_rgba(255,79,51,0.4)] hover:shadow-[0_0_50px_rgba(255,79,51,0.5)]">
            Start The Blueprint Today
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Benefit Bullets */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-400 mb-16">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#FF4F33]" />
            Complete start-to-finish workflow
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#FF4F33]" />
            Home studio focused
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#FF4F33]" />
            Updated for 2025
          </div>
        </div>

        {/* Hero VSL Container with Vidalytics */}
        <div
          className="w-full max-w-6xl mx-auto relative group cursor-pointer mb-24 animate-fade-in"
          style={{ animationDelay: "0.5s" }}
        >
          {/* Large Ambient Glow Behind VSL */}
          <div 
            className="absolute -inset-32 pointer-events-none z-0"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255,120,50,0.15) 0%, rgba(255,79,51,0.08) 40%, transparent 70%)',
            }}
          />
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-[#FF4F33]/10 blur-3xl rounded-[30px] opacity-40 group-hover:opacity-60 transition duration-700" />

          {/* Video Container */}
          <div className="relative w-full bg-zinc-900 rounded-[24px] border border-white/10 overflow-hidden shadow-2xl">
            {/* Vidalytics Embed */}
            <div
              id="vidalytics_embed_V5HrhyRBNAeDtppA"
              style={{ width: "100%", position: "relative", paddingTop: "56.25%" }}
            />
          </div>
        </div>

        {/* Footer: Scrolling Credits */}
        <div className="w-full max-w-7xl mx-auto relative z-20 mt-12 mb-20">
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

      {/* ================= MINI SOCIAL PROOF SECTION (FIXED TO 6) ================= */}
      <section className="pt-32 pb-0 px-6 bg-[#050505] overflow-hidden relative z-10">
        {/* Ambient Glow Behind Unfiltered Feedback */}
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none z-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.03) 0%, transparent 60%)',
          }}
        />
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-zinc-400 text-xs font-bold uppercase tracking-wide mb-6">
            Unfiltered Feedback
          </div>

          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
              Hear it directly from <span className="font-serif italic text-white">the producers.</span>
            </h2>
            <p className="text-zinc-400 text-lg">Join 500+ producers who have upgraded their workflow.</p>
          </div>

          {/* MASONRY WALL (Fading out) */}
          <div className="w-full relative z-0">
            <div className="columns-1 md:columns-3 gap-6 space-y-6 pb-96">
              {/* Display only the top 6 testimonials */}
              {miniSocialProofImages.map((img, idx) => (
                <div key={idx} className="break-inside-avoid">
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

            {/* MASSIVE FADE OVERLAY */}
            <div className="absolute bottom-0 left-0 w-full h-[800px] bg-gradient-to-t from-[#050505] via-[#050505] to-transparent z-10 pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: PAIN AGITATION (CINEMATIC VIDEO + SCRIBBLES) ================= */}
      <section className="py-32 px-6 bg-[#050505] relative z-20 -mt-[500px]">
        {/* Deep Red Ambient Glow Behind Tutorial Hell */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[800px] pointer-events-none z-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(180,30,30,0.08) 0%, rgba(120,20,20,0.04) 40%, transparent 70%)',
          }}
        />
        <div className="max-w-7xl mx-auto">
          
          {/* 1. HEADLINE AREA */}
          <div className="text-center mb-16 relative z-10">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-white/5 bg-white/5 text-[#FF4F33] text-[10px] font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
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
            <div className="md:w-1/4 space-y-16 text-center md:text-right order-2 md:order-1 relative z-10">
              
              {/* Item 1: Wrong Mentors */}
              <div className="space-y-2 relative group">
                <h4 className="text-white font-medium text-lg relative inline-block">
                  Wrong Mentors
                  {/* Scribble: Underline */}
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#FF4F33]/60" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M2,5 Q50,8 98,2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </h4>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Learning from "content creators" who optimize for views, not working producers who optimize for results.
                </p>
              </div>
              
              {/* Item 2: Fragmented Knowledge */}
              <div className="space-y-2 relative">
                <h4 className="text-white font-medium text-lg">Fragmented Knowledge</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  You're watching a mixing tip from one YouTuber and an arrangement hack from another. Nothing connects.
                </p>
                {/* Scribble: Arrow pointing right to video */}
                <div className="hidden md:block absolute -right-16 top-1/2 -translate-y-1/2 w-12 h-12 opacity-60">
                   <svg viewBox="0 0 50 50" className="text-[#FF4F33] w-full h-full transform -rotate-12">
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
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#FF4F33]/5 blur-[80px] rounded-full pointer-events-none"></div>
              
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
            <div className="md:w-1/4 space-y-16 text-center md:text-left order-3 relative z-10">
              
              {/* Item 3: Frankenstein Workflow */}
              <div className="space-y-2 relative">
                <div className="relative inline-block">
                  <h4 className="text-white font-medium text-lg relative z-10">Frankenstein Workflow</h4>
                  {/* Scribble: Circle around title */}
                  <svg className="absolute -top-3 -left-4 w-[120%] h-[180%] text-[#FF4F33]/40 z-0 pointer-events-none" viewBox="0 0 100 50" preserveAspectRatio="none">
                    <path d="M10,20 Q50,5 90,20 T10,20" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Trying to build a pro sound by stitching together random advice. It falls apart the moment you try to finish a track.
                </p>
              </div>
              
              {/* Item 4: The Highlight Reel */}
              <div className="space-y-2 relative">
                {/* Scribble: Arrow pointing left to video */}
                <div className="hidden md:block absolute -left-16 top-0 w-12 h-12 opacity-60">
                   <svg viewBox="0 0 50 50" className="text-[#FF4F33] w-full h-full transform rotate-12 scale-x-[-1]">
                     <path d="M5,25 Q25,10 45,25" fill="none" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                   </svg>
                </div>
                
                <h4 className="text-white font-medium text-lg">The "Highlight Reel"</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  You only see the polished result on YouTube, never the messy problem-solving required to actually finish music.
                </p>
              </div>
            </div>
          </div>

          {/* Connector Line to Solution */}
          <div className="mt-24 flex flex-col items-center opacity-20">
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
          
          {/* Header Content */}
          <div className="text-center mb-24">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-zinc-400 text-xs font-bold uppercase tracking-wide mb-8 backdrop-blur-sm shadow-xl">
              The Producer Blueprint 2.0
            </div>
            
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 text-white drop-shadow-2xl">
              See How "A-List" Music Is <br />
              Actually Made <span className="font-serif italic text-zinc-400">In A Home Studio.</span>
            </h2>
            
            {/* UPDATED SUBHEADLINE */}
            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              In 2026, it is possible to make top-streaming music from a home setup. Most producers plateau simply because they don't know what "good" looks like during the messy middle.
            </p>
          </div>

          {/* 3. THE 4 PILLARS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            
            {/* Card 01 */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-[#FF4F33]/30 transition-colors duration-500">
              <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl text-white select-none pointer-events-none group-hover:opacity-20 transition-opacity">01</div>
              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mb-6 text-[#FF4F33]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">From "Loop Phase" To Finished Record</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Stop hoarding unfinished ideas. Watch Rob's personal workflow for taking a track from a 4-bar loop to a complete arrangement. No rigid frameworks - just the fluid process of actually finishing songs.
                </p>
              </div>
            </div>

            {/* Card 02 */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-[#FF4F33]/30 transition-colors duration-500">
              <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl text-white select-none pointer-events-none group-hover:opacity-20 transition-opacity">02</div>
              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mb-6 text-[#FF4F33]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">The "Bedroom" Mixing Standard</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  You don't always need a pro engineer. Learn the functional mixing and mastering process Rob uses to get tracks ready for label demos, live sets, or streaming releases - all from a laptop on the road.
                </p>
              </div>
            </div>

            {/* Card 03 */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-[#FF4F33]/30 transition-colors duration-500">
              <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl text-white select-none pointer-events-none group-hover:opacity-20 transition-opacity">03</div>
              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mb-6 text-[#FF4F33]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Session-Proven Chains</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Your mixes sound thin because your processing is wrong. Copy the exact vocal and drum chains Rob uses in sessions with major artists to get that loud, punchy commercial sound without over-complicating it.
                </p>
              </div>
            </div>

            {/* Card 04 */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-[#FF4F33]/30 transition-colors duration-500">
              <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl text-white select-none pointer-events-none group-hover:opacity-20 transition-opacity">04</div>
              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mb-6 text-[#FF4F33]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Design Sounds With Intent</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Stop relying on happy accidents. Learn the fundamentals of sound design so you can build the exact 808s, leads, and pads you hear in your head, rather than endlessly hunting through Splice folders.
                </p>
              </div>
            </div>

          </div>

          {/* BRIDGE / CTA */}
          <div className="text-center mt-20 max-w-2xl mx-auto pb-12">
            <button className="group inline-flex items-center gap-3 text-white text-lg font-medium hover:text-[#FF4F33] transition-all">
              <span className="border-b border-white/30 pb-0.5 group-hover:border-[#FF4F33]">See The Curriculum</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </section>

      {/* ================= SECTION: THE ORIGIN STORY (MEET YOUR INSTRUCTOR) ================= */}
      <section className="py-24 px-6 bg-[#050505] relative z-20 overflow-hidden">
        {/* Background Grid Texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-20 lg:mb-0">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-400 text-xs font-bold uppercase tracking-wide mb-6">
              Meet Your Instructor
            </div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6">Rob Late.</h2>
            <div className="inline-block relative">
              <p className="text-xl md:text-2xl text-zinc-400 font-medium tracking-tight">
                Credits: The Chainsmokers, Marshmello, Clean Bandit, Gary Barlow.
              </p>
              <p className="text-sm text-[#FF4F33] font-bold uppercase tracking-widest mt-2">
                (All produced from a home studio)
              </p>
            </div>
          </div>

          {/* TIMELINE CONTAINER */}
          {/* FIX: 
              - Added lg:h-[900px] to give the section fixed height on desktop. 
              - This creates space so top cards don't hit the subtitle.
          */}
          <div className="relative lg:h-[900px]">
            
            {/* DESKTOP CENTRAL LINE (Fixed to center) */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#FF4F33]/30 to-transparent -translate-y-1/2 z-0"></div>

            {/* MOBILE VERTICAL LINE (Hidden on Desktop) */}
            <div className="lg:hidden absolute top-0 bottom-0 left-8 w-0.5 bg-gradient-to-b from-[#FF4F33]/10 via-[#FF4F33]/50 to-[#FF4F33]/10 z-0"></div>

            {/* Timeline Items Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-4 relative z-10 h-full">
              
              {/* ITEM 1: 2019 (TOP) */}
              {/* Desktop: Absolute position relative to center line */}
              <div className="relative flex flex-col justify-center lg:block">
                {/* Dot */}
                <div className="absolute left-8 lg:left-1/2 top-0 lg:top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#050505] border-2 border-[#FF4F33] rounded-full z-20 shadow-[0_0_10px_#FF4F33]"></div>
                
                {/* Content - Anchored BOTTOM-1/2 + Margin to sit above line */}
                <div className="pl-20 lg:pl-0 w-full group lg:absolute lg:bottom-1/2 lg:mb-12 lg:left-0 lg:right-0"> 
                  <div className="bg-white p-2 pb-8 shadow-xl rotate-1 group-hover:rotate-0 transition-transform duration-500 ease-out max-w-[280px] mx-auto mb-6">
                    <div className="aspect-square bg-zinc-200 overflow-hidden mb-0 grayscale group-hover:grayscale-0 transition-all duration-700">
                      <img
                        src={robFirstStudio}
                        className="w-full h-full object-cover"
                        alt="2019 Setup"
                      />
                    </div>
                    <div className="pt-4 px-2 font-mono text-xs text-zinc-500 text-center tracking-widest uppercase">
                      2019: The Grind
                    </div>
                  </div>
                  <div className="text-left lg:text-center">
                    <h3 className="text-white font-bold text-lg mb-2">The 9-5 Grind</h3>
                    <p className="text-zinc-500 text-xs leading-relaxed">
                      I was working a sales job for a phone mount company, producing music as a "hobby" in the evenings.
                      I got told to 'get a proper job' more times than I can count. This was my first setup - classic
                      Focusrite interface, but it worked.
                    </p>
                  </div>
                </div>
              </div>

              {/* ITEM 2: 2020 (BOTTOM) */}
              <div className="relative flex flex-col justify-center lg:block">
                {/* Dot */}
                <div className="absolute left-8 lg:left-1/2 top-0 lg:top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#050505] border-2 border-[#FF4F33] rounded-full z-20 shadow-[0_0_10px_#FF4F33]"></div>

                {/* Content - Anchored TOP-1/2 + Margin to sit below line */}
                <div className="pl-20 lg:pl-0 w-full group mt-12 lg:mt-0 lg:absolute lg:top-1/2 lg:mt-12 lg:left-0 lg:right-0">
                  <div className="bg-white p-2 pb-8 shadow-xl -rotate-2 group-hover:rotate-0 transition-transform duration-500 ease-out max-w-[280px] mx-auto mb-6">
                    <div className="aspect-square bg-zinc-200 overflow-hidden mb-0 grayscale group-hover:grayscale-0 transition-all duration-700">
                      <img
                        src={robLockdownStudio}
                        className="w-full h-full object-cover"
                        alt="2020 Lockdown"
                      />
                    </div>
                    <div className="pt-4 px-2 font-mono text-xs text-zinc-500 text-center tracking-widest uppercase">
                      2020: Lockdown
                    </div>
                  </div>
                  <div className="text-left lg:text-center">
                    <h3 className="text-white font-bold text-lg mb-2">The Lockdown Era</h3>
                    <p className="text-zinc-500 text-xs leading-relaxed">
                      Stuck in a spare room in my London flat during lockdown, I started taking remote sessions. I
                      posted some Reels sampling random objects in my studio. A few started getting views. I didn't know
                      it yet, but everything changed right here (post more content, kids).
                    </p>
                  </div>
                </div>
              </div>

              {/* ITEM 3: 2021 (TOP) */}
              <div className="relative flex flex-col justify-center lg:block">
                {/* Dot */}
                <div className="absolute left-8 lg:left-1/2 top-0 lg:top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#050505] border-2 border-[#FF4F33] rounded-full z-20 shadow-[0_0_10px_#FF4F33]"></div>

                {/* Content - Anchored BOTTOM-1/2 */}
                <div className="pl-20 lg:pl-0 w-full group lg:absolute lg:bottom-1/2 lg:mb-12 lg:left-0 lg:right-0">
                  <div className="bg-white p-2 pb-8 shadow-xl rotate-2 group-hover:rotate-0 transition-transform duration-500 ease-out max-w-[280px] mx-auto mb-6">
                    <div className="aspect-square bg-zinc-200 overflow-hidden mb-0 grayscale group-hover:grayscale-0 transition-all duration-700">
                      <img src={robChainsmokers} className="w-full h-full object-cover" alt="The Chainsmokers" />
                    </div>
                    <div className="pt-4 px-2 font-mono text-xs text-zinc-500 text-center tracking-widest uppercase">
                      2021: Breakthrough
                    </div>
                  </div>
                  <div className="text-left lg:text-center">
                    <h3 className="text-white font-bold text-lg mb-2">The Breakthrough</h3>
                    <p className="text-zinc-500 text-xs leading-relaxed">
                      My content was going viral, followers growing. Drew from{" "}
                      <span className="text-white">The Chainsmokers</span> DM'd me after seeing a video and we started
                      working on music together. No management, no label connections at this point - just making cool
                      music & getting reach with content.
                    </p>
                  </div>
                </div>
              </div>

              {/* ITEM 4: 2022-23 (BOTTOM) */}
              <div className="relative flex flex-col justify-center lg:block">
                {/* Dot */}
                <div className="absolute left-8 lg:left-1/2 top-0 lg:top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#050505] border-2 border-[#FF4F33] rounded-full z-20 shadow-[0_0_10px_#FF4F33]"></div>

                {/* Content - Anchored TOP-1/2 */}
                <div className="pl-20 lg:pl-0 w-full group mt-12 lg:mt-0 lg:absolute lg:top-1/2 lg:mt-12 lg:left-0 lg:right-0">
                  <div className="bg-white p-2 pb-8 shadow-xl -rotate-1 group-hover:rotate-0 transition-transform duration-500 ease-out max-w-[280px] mx-auto mb-6">
                    <div className="aspect-square bg-zinc-200 overflow-hidden mb-0 grayscale group-hover:grayscale-0 transition-all duration-700">
                      <img
                        src={robGaryBarlow}
                        className="w-full h-full object-cover"
                        alt="Sessions"
                      />
                    </div>
                    <div className="pt-4 px-2 font-mono text-xs text-zinc-500 text-center tracking-widest uppercase">
                      2022: A-List
                    </div>
                  </div>
                  <div className="text-left lg:text-center">
                    <h3 className="text-white font-bold text-lg mb-2">The A-List Sessions</h3>
                    <p className="text-zinc-500 text-xs leading-relaxed">
                      The major artist sessions started stacking up: Marshmello, Clean Bandit, Gary Barlow. The crazy
                      part is I was still doing it all from a home setup, proving you don't need a million-dollar
                      facility to play at the top level.
                    </p>
                  </div>
                </div>
              </div>

              {/* ITEM 5: TODAY (TOP) */}
              <div className="relative flex flex-col justify-center lg:block">
                {/* Dot */}
                <div className="absolute left-8 lg:left-1/2 top-0 lg:top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-[#FF4F33] rounded-full z-20 shadow-[0_0_20px_#FF4F33] animate-pulse"></div>

                {/* Content - Anchored BOTTOM-1/2 */}
                <div className="pl-20 lg:pl-0 w-full group lg:absolute lg:bottom-1/2 lg:mb-12 lg:left-0 lg:right-0">
                  <div className="bg-white p-2 pb-8 shadow-xl rotate-2 group-hover:rotate-0 transition-transform duration-500 ease-out max-w-[280px] mx-auto mb-6">
                    <div className="aspect-square bg-zinc-200 overflow-hidden mb-0 group-hover:scale-105 transition-transform duration-700">
                      <img
                        src={robStudio}
                        className="w-full h-full object-cover object-center"
                        alt="Rob's Current Studio"
                      />
                    </div>
                    <div className="pt-4 px-2 font-mono text-xs text-zinc-500 text-center tracking-widest uppercase">
                      TODAY: The Blueprint
                    </div>
                  </div>
                  <div className="text-left lg:text-center">
                    <h3 className="text-[#FF4F33] font-bold text-lg mb-2">The Producer Blueprint</h3>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      100 Million+ streams later, I moved house and built a dedicated space in my garage. It's still a
                      home studio. It's basically the same gear. I just have fancier lights now.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TIMELINE FOOTER */}
          <div className="mt-24 max-w-2xl mx-auto text-center relative z-20">
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 md:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF4F33]/5 blur-3xl rounded-full pointer-events-none"></div>
              <h4 className="text-white font-medium tracking-tight text-2xl md:text-3xl mb-4">
                "What is The Producer Blueprint?"
              </h4>
              <p className="text-zinc-400 text-lg leading-relaxed mb-2">
                A solid income from 'making music', doing what we all love. Control over your time. No boss.
              </p>
              <p className="text-[#FF4F33] font-bold uppercase tracking-widest text-sm">Priceless.</p>
            </div>

            {/* Signature Image */}
            <div className="mt-8 flex justify-center opacity-70">
              <img
                src={robSignature}
                alt="Rob Late Signature"
                className="h-16 w-auto object-contain invert"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: THE ERA OF HOME STUDIO PRODUCTION */}
      <section className="relative z-10 px-6 md:px-12 py-24 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Left Column - Header */}
          <div>
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-zinc-700 bg-zinc-900/50 mb-6">
              <span className="text-sm font-medium text-zinc-300">The Blueprint Has Changed</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-6">
              It's The Era of <br />
              <span className="font-serif italic font-normal text-zinc-200">Home Studio Production.</span>
            </h2>

            <p className="text-zinc-400 text-lg">
              Major industry credits from a home studio is now a reality. I can show you the blueprint.
            </p>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-6">
            <p className="text-zinc-300 leading-relaxed">
              You no longer need a £10k mic to be 'pro'. There are kids making 100-million stream hits on laptops. DJs
              are producing headline tracks in hotel rooms. I produce in coffee shops with headphones when I need a
              change of scene.
            </p>

            <p className="text-zinc-300 leading-relaxed">
              Many people are stuck in the headspace of "I need this pro gear or setup" before I can make top music. But
              the people who 'just do' - who have fun making music - have 10x the output, and therefore make 10x the
              progress.
            </p>

            <p className="text-zinc-300 leading-relaxed">
              To be a working producer you need efficiency of output, creative workflows to fall back on, and to have a
              strong sense of taste.
            </p>

            <p className="text-zinc-300 leading-relaxed">
              I can help you develop these. This is why I built The Producer Blueprint.
            </p>

            <div className="pt-4">
              <button className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-zinc-200 transition-all">
                See How The Blueprint Works
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: WHAT'S INSIDE */}
      <section className="relative z-10 px-6 md:px-12 py-24 max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-zinc-700 bg-zinc-900/50 mb-8">
            <span className="text-sm font-medium text-zinc-300">What's Inside</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-4">
            7 modules. 70+ lessons.
            <br />
            <span className="font-serif italic font-normal text-zinc-200">The Producer Blueprint.</span>
          </h2>

          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Every workflow Rob uses to produce release-ready music from a home studio.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="space-y-4 mb-8">
          {modules.map((module, index) => (
            <div
              key={index}
              className="bg-[#0A0A0A] rounded-2xl p-6 border border-zinc-800/50 hover:border-zinc-700/50 transition-colors flex items-start gap-6"
            >
              <span className="text-[#FF4F33] font-bold text-lg shrink-0">{module.number}</span>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">{module.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{module.description}</p>
              </div>
            </div>
          ))}

          {/* Bonus Modules */}
          {bonusModules.map((module, index) => (
            <div
              key={index}
              className="bg-[#0A0A0A] rounded-2xl p-6 border border-[#FF4F33]/20 hover:border-[#FF4F33]/30 transition-colors flex items-start gap-6"
            >
              <span className="text-[#FF4F33] font-bold text-sm shrink-0 px-2 py-1 bg-[#FF4F33]/10 rounded-lg">
                Bonus
              </span>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">{module.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{module.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 pt-8 border-t border-zinc-800/50">
          <p className="text-zinc-400 text-sm mb-6 flex items-center justify-center gap-2">
            <Check className="w-4 h-4 text-[#FF4F33]" />
            Plus downloadable project files, templates, and presets.
          </p>

          <button className="inline-flex items-center gap-2 bg-[#FF4F33] text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-[#e64530] transition-all shadow-[0_0_40px_rgba(255,79,51,0.4)] hover:shadow-[0_0_50px_rgba(255,79,51,0.5)]">
            Start The Blueprint Today
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* ================= OFFER STACK SECTION ================= */}
      <section className="py-32 px-6 bg-[#050505] border-t border-white/5 relative z-30">
        <div className="max-w-7xl mx-auto">
          {/* Headline Area */}
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 leading-[1.1]">
              <span className="font-serif italic font-normal text-zinc-400 lowercase tracking-normal">Introducing</span>{" "}
              <br />
              The Producer Blueprint.
            </h2>
            <div className="inline-block bg-zinc-900 border border-white/10 px-6 py-2 rounded-full">
              <span className="text-zinc-300 font-medium">
                Join today and get{" "}
                <span className="text-white underline decoration-[#FF4F33] underline-offset-4 font-bold">
                  2 FREE Bonuses
                </span>{" "}
                included.
              </span>
            </div>
          </div>

          {/* Product Mockup Placeholder */}
          <div className="w-full max-w-5xl mx-auto aspect-[16/9] bg-zinc-900 border border-white/10 rounded-2xl mb-24 flex items-center justify-center relative overflow-hidden shadow-2xl group">
            {/* Using the imported image if available, else placeholder text */}
            <img
              src={productStackMockup}
              alt="Product Stack"
              className="relative z-20 object-contain w-3/4 h-3/4"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <p className="text-zinc-600 font-mono text-sm uppercase tracking-widest z-10 absolute">
              [ Insert Product Mockup Image ]
            </p>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div>
          </div>

          {/* Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            {/* LEFT COLUMN: The Clean Stack */}
            <div className="lg:col-span-7">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-8 border-b border-white/10 pb-4">
                What You Get
              </h3>

              {/* Core Item (ONLY ONE) */}
              <div className="space-y-8 mb-12">
                <div className="flex gap-6 items-start group">
                  <div className="w-6 h-6 rounded-full bg-[#FF4F33] flex-shrink-0 flex items-center justify-center text-white mt-1">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div className="flex-1 pb-8 border-b border-white/5">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-bold text-white group-hover:text-[#FF4F33] transition-colors">
                        The Producer Blueprint Course
                      </h4>
                      <span className="text-zinc-500 font-mono text-xs bg-zinc-900 px-2 py-1 rounded border border-white/5">
                        $497 Value
                      </span>
                    </div>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      7 modules, 70+ lessons. The complete production workflow Rob uses to produce release-ready music
                      from a home studio. Includes Ableton project files and templates.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bonuses Section */}
              <div className="bg-zinc-900/30 border border-[#FF4F33]/20 rounded-2xl p-6 md:p-8 relative">
                <div className="absolute -top-3 left-6 bg-[#050505] px-2">
                  <span className="text-xs font-bold text-[#FF4F33] uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF4F33] animate-pulse"></span>
                    Free Bonuses Included
                  </span>
                </div>

                <div className="space-y-8 mt-2">
                  {/* Bonus 1 */}
                  <div className="flex gap-5">
                    <div className="w-12 h-12 bg-black border border-white/10 rounded flex-shrink-0 flex items-center justify-center text-white text-lg font-serif italic">
                      01
                    </div>
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-lg font-bold text-white">Social Media, Business & Music Industry Module</h4>
                        <span className="text-zinc-500 font-mono text-xs line-through decoration-zinc-600">
                          $97 Value
                        </span>
                      </div>
                      <p className="text-zinc-400 text-sm leading-relaxed">
                        Turn production into income. Growing a following, making content, and building real customers.
                      </p>
                    </div>
                  </div>

                  {/* Bonus 2 */}
                  <div className="flex gap-5">
                    <div className="w-12 h-12 bg-black border border-white/10 rounded flex-shrink-0 flex items-center justify-center text-white text-lg font-serif italic">
                      02
                    </div>
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-lg font-bold text-white">Rob's TikTok/IG Breakdown Vault</h4>
                        <span className="text-zinc-500 font-mono text-xs line-through decoration-zinc-600">
                          $147 Value
                        </span>
                      </div>
                      <p className="text-zinc-400 text-sm leading-relaxed">
                        Project walkthroughs from Rob's viral content, plus downloadable project files and presets.
                        Updated regularly with new breakdowns.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Total */}
              <div className="lg:hidden mt-8 flex justify-between items-center border-t border-white/10 pt-6">
                <span className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Total Value</span>
                <span className="text-zinc-400 line-through text-xl decoration-red-500 decoration-2">$741</span>
              </div>
            </div>

            {/* RIGHT COLUMN: Sticky Pricing Card */}
            <div className="lg:col-span-5 relative">
              <div className="sticky top-8 bg-[#0F0F0F] border-2 border-[#FF4F33] rounded-3xl p-8 shadow-[0_0_60px_-15px_rgba(255,79,51,0.2)]">
                <div className="text-center border-b border-white/10 pb-8 mb-8">
                  <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Join Today</h3>
                  <p className="text-zinc-500 text-xs font-bold tracking-[0.2em] uppercase">Secure Instant Access</p>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <span className="text-zinc-400 font-medium">Total Value</span>
                  <span className="text-zinc-500 line-through decoration-zinc-500 decoration-1 text-lg">$741</span>
                </div>

                <div className="flex justify-between items-end mb-10">
                  <span className="text-white text-xl font-bold uppercase">Your Price</span>
                  <span className="text-6xl font-black text-[#FF4F33] tracking-tighter">$297</span>
                </div>

                <button className="w-full bg-white hover:bg-zinc-200 text-black text-lg font-black uppercase tracking-wide py-5 rounded-xl mb-6 transition-transform hover:scale-[1.02] shadow-xl flex items-center justify-center gap-2 group">
                  Start The Blueprint
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    ></path>
                  </svg>
                </button>

                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-zinc-500 text-xs font-medium">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      ></path>
                    </svg>
                    30-Day 100% Money Back Guarantee
                  </div>
                  <div className="flex items-center justify-center gap-2 text-zinc-600 text-[10px] font-medium uppercase tracking-wide">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5z" />
                    </svg>
                    Instant Login via Email
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* ================= RESULTS REEL & PROOF SECTION ================= */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          <div className="max-w-6xl mx-auto px-6">
            
            {/* Headline */}
            <div className="text-center mb-16">
              <span className="inline-block bg-[#FF4F33]/10 text-[#FF4F33] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                Student Wins
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.04em] leading-[1.05] text-white mb-6">
                Real Results. <span className="font-serif italic font-normal tracking-normal text-zinc-200">Real Producers.</span>
              </h2>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                From "bedroom producer" to signed artist. Here is what happens when you have a professional workflow.
              </p>
            </div>

            {/* ROW 1: VERTICAL VIDEO TRIO (9:16 Aspect) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              
              {/* Video Card 1 - @djkiera */}
              <div className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 cursor-pointer">
                <div className="absolute inset-0">
                  <video
                    src={djkieraTestimonial}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </div>
                  </div>
                  
                  {/* Result Badge */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pt-16">
                    <div className="text-left">
                      <p className="text-white font-semibold text-lg">@djkiera</p>
                      <p className="text-zinc-400 text-sm">Kiera • UK</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Card 2 */}
              <div className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 cursor-pointer">
                <div className="absolute inset-0">
                  <img
                    src={streamingNumbersTestimonial}
                    alt="100k Streams testimonial"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </div>
                  </div>
                  
                  {/* Result Badge */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pt-16">
                    <div className="text-left">
                      <p className="text-white font-semibold text-lg">"100k Streams in 1 Month"</p>
                      <p className="text-zinc-400 text-sm">Sarah J. • USA</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Card 3 */}
              <div className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 cursor-pointer">
                <div className="absolute inset-0">
                  <img
                    src={headroomRecordsTestimonial}
                    alt="Quit my job testimonial"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </div>
                  </div>
                  
                  {/* Result Badge */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pt-16">
                    <div className="text-left">
                      <p className="text-white font-semibold text-lg">"Quit my job to produce"</p>
                      <p className="text-zinc-400 text-sm">David R. • Canada</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 2: EXTRA SCREENSHOTS (Masonry) */}
            <div className="mt-20">
              <p className="text-center text-zinc-500 text-sm uppercase tracking-widest mb-8">More feedback from the community</p>
              
              <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                <div className="break-inside-avoid">
                  <div className="rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-colors">
                    <img src={drewAdieuTestimonial} alt="Drew testimonial" className="w-full" />
                  </div>
                </div>
                <div className="break-inside-avoid">
                  <div className="rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-colors">
                    <img src={aaronly0nsYoutubeTestimonial} alt="Aaron testimonial" className="w-full" />
                  </div>
                </div>
                <div className="break-inside-avoid">
                  <div className="rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-colors">
                    <img src={austriaTestimonial} alt="Austria testimonial" className="w-full" />
                  </div>
                </div>
                <div className="break-inside-avoid">
                  <div className="rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-colors">
                    <img src={completePackageTestimonial} alt="Complete package testimonial" className="w-full" />
                  </div>
                </div>
                <div className="break-inside-avoid">
                  <div className="rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-colors">
                    <img src={nateSawyerTestimonial} alt="Nate Sawyer testimonial" className="w-full" />
                  </div>
                </div>
                <div className="break-inside-avoid">
                  <div className="rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-colors">
                    <img src={deepintheforestTestimonial} alt="Deep in the forest testimonial" className="w-full" />
                  </div>
                </div>
                <div className="break-inside-avoid">
                  <div className="rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-colors">
                    <img src={rsmyth111Testimonial} alt="Rsmyth testimonial" className="w-full" />
                  </div>
                </div>
                <div className="break-inside-avoid">
                  <div className="rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-colors">
                    <img src={levinMusicTestimonial} alt="Levin Music testimonial" className="w-full" />
                  </div>
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
                      className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-[#FF4F33]/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-sm mb-2">Email Address</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-[#FF4F33]/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Order Bump */}
                <div className="bg-[#FF4F33]/5 border-2 border-dashed border-[#FF4F33]/30 rounded-xl p-4">
                  <div className="text-center mb-3">
                    <span className="inline-block bg-[#FF4F33] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      One-Time Offer
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="orderBump"
                      className="mt-1 w-5 h-5 rounded border-zinc-600 bg-zinc-800 text-[#FF4F33] focus:ring-[#FF4F33] focus:ring-offset-0 cursor-pointer"
                    />
                    <label htmlFor="orderBump" className="cursor-pointer flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-semibold">YES, ADD: Alpha Drums 3 Sample Pack</span>
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-500 line-through text-sm">$97</span>
                          <span className="text-[#FF4F33] font-bold">+$37</span>
                        </div>
                      </div>
                      <p className="text-zinc-400 text-sm mb-2">
                        Rob's premium drum library with over 700 curated sounds from sessions with A-list artists. Kicks, snares, and percussion that cut through any mix.
                      </p>
                      <p className="text-[#FF4F33] text-xs font-medium">&gt;&gt; Click box to add this deal</p>
                    </label>
                  </div>
                </div>

                {/* Total & CTA */}
                <div className="pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-zinc-400">Total Due Today:</span>
                    <span className="text-2xl font-bold text-white">$297.00</span>
                  </div>

                  <button className="w-full bg-[#FF4F33] hover:bg-[#FF4F33]/90 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-[#FF4F33]/25 flex items-center justify-center gap-2">
                    Get Instant Access
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  {/* Trust Badges */}
                  <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-zinc-800">
                    <div className="flex items-center gap-2 text-zinc-500 text-sm">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 text-sm">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>30-Day Guarantee</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
    </div>
  );
};

export default TheProducerBlueprint001;
