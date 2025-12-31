import { useEffect } from "react";
import { ArrowRight, Check, Play, Star, X, Youtube } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import testimonial1 from "@/assets/testimonials/testimonial-1.jpeg";
import testimonial2 from "@/assets/testimonials/testimonial-2.jpeg";
import testimonial3 from "@/assets/testimonials/testimonial-3.jpeg";
import chainsomokersFriday from "@/assets/album-art/chainsmokers-friday.jpeg";
import productStackMockup from "@/assets/product-stack-mockup.png";

const TheProducerBlueprint001 = () => {
  // Load Vidalytics script on mount
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
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
      document.body.removeChild(script);
    };
  }, []);
  // Testimonial images
  const testimonials = [testimonial1, testimonial2, testimonial3];

  // Testimonial data with usernames
  const testimonialData = [
    { image: testimonial1, username: "@aaronly0ns" },
    { image: testimonial2, username: "@rsmyth111" },
    { image: testimonial3, username: "@levin_music" },
  ];

  // Album art for the marquee with artist names
  const albumArt = [
    { img: chainsomokersFriday, artist: "The Chainsmokers ft Fridayy" },
    { img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop", artist: "Marshmello" },
    { img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200&h=200&fit=crop", artist: "Clean Bandit" },
    { img: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=200&h=200&fit=crop", artist: "Spinnin' Records" },
    { img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&h=200&fit=crop", artist: "Tiesto" },
    { img: "https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=200&h=200&fit=crop", artist: "Kygo" },
  ];

  // Avatar images for scrolling row
  const avatarImages = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
  ];

  // Video case studies data
  const caseStudies = [
    {
      name: "ALEX M.",
      role: "Music Producer",
      location: "United Kingdom",
      quote: "My mixes used to sound muddy and thin. Following Module 6 completely changed how I EQ and compress drums.",
    },
    {
      name: "SARAH J.",
      role: "Artist / Songwriter",
      location: "United States",
      quote: "The workflow templates alone are worth the price. I finished 3 tracks in the first month after being stuck for a year.",
    },
    {
      name: "DAVID R.",
      role: "Bedroom Producer",
      location: "Canada",
      quote: "Rob explains the 'why', not just the 'how'. It's the first time I actually understood compression properly.",
    },
  ];

  // Course modules data
  const modules = [
    { number: "01", title: "Ableton Basics", description: "Layout, preferences, shortcuts, and project setup. The foundation everything else builds on." },
    { number: "02", title: "Sound Design", description: "Synthesis fundamentals, Serum deep-dives, resampling techniques. Create your own sounds from scratch." },
    { number: "03", title: "Drum Production", description: "Punchy drums that cut through. Sample selection, stereo width, sidechain compression, custom percussion." },
    { number: "04", title: "Arrangement & Energy", description: "Turn ideas into full tracks. Song structure, transitions, ear candy, and maintaining energy throughout." },
    { number: "05", title: "Vocal Production", description: "Recording setup, clean vocals, tuning, reverb, harmonies, and Rob's personal vocal chain." },
    { number: "06", title: "Mixing & Mastering", description: "Clean, polished mixes that compete. EQ, compression, frequency carving, and Rob's mastering chain." },
    { number: "07", title: "Artist Sounds", description: "Modern production techniques. Finding your sound, melody loops, vocal effects, and genre-specific percussion." },
  ];

  const bonusModules = [
    { title: "Music Business", description: "Turn production into income. Growing a following, making content, and building real customers." },
    { title: "Breakdown Vault", description: "Project walkthroughs from Rob's viral content. See the thinking behind every decision. Updated regularly." },
  ];

  // Comparison data - The YouTube Trap
  const youtubeProblems = [
    { text: "Hard drive full of unfinished songs" },
    { text: "Collecting \"tricks\" like trading cards" },
    { text: "Trying to assemble a professional workflow using random advice" },
    { text: "Disconnected tips with no context" },
    { text: "Learning from Youtubers, not working producers" },
  ];

  // Comparison data - The Blueprint Method
  const blueprintBenefits = [
    { text: "One complete workflow from a working pro" },
    { text: "Open up your creative approach" },
    { text: "A real reference point for what \"pro\" sounds like" },
    { text: "Seeing the \"why\" behind 1,000 micro-decisions" },
    { text: "Get consistent results on a minimal setup" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans relative overflow-hidden">
      {/* Aurora Glow Effect */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at center bottom, rgba(255,200,150,0.15) 0%, rgba(255,120,50,0.1) 25%, rgba(255,79,51,0.05) 50%, transparent 70%)',
        }}
      />

      {/* Navigation Bar */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 max-w-7xl mx-auto">
        <div className="text-xl font-bold tracking-tight">
          The Producer Blueprint
        </div>
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
          <span className="font-serif italic font-normal tracking-normal text-zinc-200">
            Start to Finish.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Watch <span className="text-white font-semibold">Rob Late</span> (The Chainsmokers, Marshmello, Clean Bandit) demonstrate the end-to-end process he uses to write, produce, and mix professional records from a home studio.
        </p>

        {/* CTA Area */}
        <div className="mb-8">
          <button 
            className="inline-flex items-center gap-2 bg-[#FF4F33] text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-[#e64530] transition-all shadow-[0_0_40px_rgba(255,79,51,0.4)] hover:shadow-[0_0_50px_rgba(255,79,51,0.5)]"
          >
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
        <div className="w-full max-w-6xl mx-auto relative group cursor-pointer mb-24 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-[#FF4F33]/10 blur-3xl rounded-[30px] opacity-40 group-hover:opacity-60 transition duration-700" />
          
          {/* Video Container */}
          <div className="relative w-full bg-zinc-900 rounded-[24px] border border-white/10 overflow-hidden shadow-2xl">
            {/* Vidalytics Embed */}
            <div 
              id="vidalytics_embed_V5HrhyRBNAeDtppA" 
              style={{ width: '100%', position: 'relative', paddingTop: '56.25%' }} 
            />
          </div>
        </div>

        {/* Credits Marquee */}
        <div className="mt-20 pt-10 border-t border-zinc-800/50">
          <p className="text-xs uppercase tracking-widest text-zinc-600 mb-8">
            Rob Late Credits
          </p>
          
          {/* Marquee Container */}
          <div className="relative overflow-hidden">
            {/* Fade Masks */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />
            
            {/* Scrolling Content */}
            <div className="flex animate-marquee" style={{ animationDuration: '60s' }}>
              {[...albumArt, ...albumArt].map((album, index) => (
                <div 
                  key={index}
                  className="flex-shrink-0 mx-3 text-center group cursor-pointer"
                >
                  <div className="w-24 h-24 rounded-lg overflow-hidden grayscale hover:grayscale-0 transition-all duration-300 group-hover:scale-105">
                    <img 
                      src={album.img} 
                      alt={album.artist}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-zinc-600 text-xs mt-2 group-hover:text-zinc-400 transition-colors">{album.artist}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ================= SOCIAL PROOF SECTION (FIXED) ================= */}
      <section className="py-32 px-6 bg-[#050505] overflow-hidden relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          
          {/* Eyebrow */}
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-zinc-400 text-xs font-bold uppercase tracking-wide mb-6">
            Unfiltered Feedback
          </div>

          {/* Headline */}
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
              Hear it directly from <span className="font-serif italic text-white">the producers.</span>
            </h2>
            <p className="text-zinc-400 text-lg">Join 500+ producers who have upgraded their workflow.</p>
          </div>

          {/* MASONRY WALL OF LOVE */}
          <div className="w-full relative z-0 mb-12">
            
            {/* CSS Columns for True Masonry (No fixed heights) */}
            <div className="columns-1 md:columns-3 gap-6 space-y-6 pb-48">
              
              {/* Screenshot 1 */}
              <div className="break-inside-avoid">
                <div className="rounded-xl border border-white/10 overflow-hidden shadow-2xl hover:scale-[1.01] transition-transform duration-300 group cursor-pointer bg-[#121212]">
                  <img src="https://placehold.co/600x500/18181b/ffffff?text=Aaron+Screenshot" className="w-full h-auto block opacity-90 group-hover:opacity-100 transition-opacity" alt="Aaron Screenshot" />
                </div>
              </div>

              {/* Screenshot 2 */}
              <div className="break-inside-avoid">
                <div className="rounded-xl border border-white/10 overflow-hidden shadow-2xl hover:scale-[1.01] transition-transform duration-300 group cursor-pointer bg-[#121212]">
                  <img src="https://placehold.co/600x650/18181b/ffffff?text=Rsmyth+Screenshot" className="w-full h-auto block opacity-90 group-hover:opacity-100 transition-opacity" alt="Rsmyth Screenshot" />
                </div>
              </div>

              {/* Screenshot 3 */}
              <div className="break-inside-avoid">
                <div className="rounded-xl border border-white/10 overflow-hidden shadow-2xl hover:scale-[1.01] transition-transform duration-300 group cursor-pointer bg-[#121212]">
                  <img src="https://placehold.co/600x400/18181b/ffffff?text=Levin+Screenshot" className="w-full h-auto block opacity-90 group-hover:opacity-100 transition-opacity" alt="Levin Screenshot" />
                </div>
              </div>

              {/* Placeholder 4 */}
              <div className="break-inside-avoid">
                <div className="rounded-xl border border-white/10 overflow-hidden shadow-2xl hover:scale-[1.01] transition-transform duration-300 group cursor-pointer bg-[#121212]">
                  <img src="https://placehold.co/600x550/18181b/ffffff?text=More+Feedback" className="w-full h-auto block opacity-90 group-hover:opacity-100 transition-opacity" alt="More Feedback" />
                </div>
              </div>

              {/* Placeholder 5 */}
              <div className="break-inside-avoid">
                <div className="rounded-xl border border-white/10 overflow-hidden shadow-2xl hover:scale-[1.01] transition-transform duration-300 group cursor-pointer bg-[#121212]">
                  <img src="https://placehold.co/600x300/18181b/ffffff?text=More+Feedback" className="w-full h-auto block opacity-90 group-hover:opacity-100 transition-opacity" alt="More Feedback" />
                </div>
              </div>
              
              {/* Placeholder 6 */}
              <div className="break-inside-avoid">
                <div className="rounded-xl border border-white/10 overflow-hidden shadow-2xl hover:scale-[1.01] transition-transform duration-300 group cursor-pointer bg-[#121212]">
                  <img src="https://placehold.co/600x450/18181b/ffffff?text=More+Feedback" className="w-full h-auto block opacity-90 group-hover:opacity-100 transition-opacity" alt="More Feedback" />
                </div>
              </div>
            </div>

            {/* GRADIENT FADE OVERLAY */}
            <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-[#050505] via-[#050505] to-transparent z-10 pointer-events-none"></div>
          </div>

          {/* ROW 2: VIDEO CASE STUDIES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full relative z-20 -mt-32">
            
            {/* Video 1 */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-[30px] p-2 hover:border-white/20 transition-all shadow-2xl shadow-black">
              <div className="relative aspect-video rounded-[24px] overflow-hidden bg-zinc-800 mb-6 group cursor-pointer">
                <img src="https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105" alt="Alex M. studio" />
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-[#FF4F33] rounded-full flex items-center justify-center pl-1 shadow-lg group-hover:scale-110 transition-transform">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M5 3l14 9-14 9V3z"/></svg>
                </div>
              </div>
              <div className="px-4 pb-6">
                <h3 className="text-white font-black text-xl uppercase mb-3 tracking-tight">ALEX M.</h3>
                <p className="text-zinc-400 text-sm mb-6 leading-relaxed border-l-2 border-white/10 pl-4">"My mixes used to sound muddy and thin. Following Module 6 completely changed how I EQ and compress drums."</p>
                <div className="text-xs flex flex-col gap-1">
                  <span className="text-white font-bold tracking-wide">Music Producer</span>
                  <span className="text-zinc-600">United Kingdom</span>
                </div>
              </div>
            </div>

            {/* Video 2 */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-[30px] p-2 hover:border-white/20 transition-all shadow-2xl shadow-black">
              <div className="relative aspect-video rounded-[24px] overflow-hidden bg-zinc-800 mb-6 group cursor-pointer">
                <img src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105" alt="Sarah J. studio" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-[#FF4F33] rounded-full flex items-center justify-center pl-1 shadow-lg group-hover:scale-110 transition-transform">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M5 3l14 9-14 9V3z"/></svg>
                </div>
              </div>
              <div className="px-4 pb-6">
                <h3 className="text-white font-black text-xl uppercase mb-3 tracking-tight">SARAH J.</h3>
                <p className="text-zinc-400 text-sm mb-6 leading-relaxed border-l-2 border-white/10 pl-4">"The workflow templates alone are worth the price. I finished 3 tracks in the first month after being stuck for a year."</p>
                <div className="text-xs flex flex-col gap-1">
                  <span className="text-white font-bold tracking-wide">Artist / Songwriter</span>
                  <span className="text-zinc-600">United States</span>
                </div>
              </div>
            </div>

            {/* Video 3 */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-[30px] p-2 hover:border-white/20 transition-all shadow-2xl shadow-black">
              <div className="relative aspect-video rounded-[24px] overflow-hidden bg-zinc-800 mb-6 group cursor-pointer">
                <img src="https://images.unsplash.com/photo-1478737270239-2f63b8625881?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105" alt="David R. studio" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-[#FF4F33] rounded-full flex items-center justify-center pl-1 shadow-lg group-hover:scale-110 transition-transform">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M5 3l14 9-14 9V3z"/></svg>
                </div>
              </div>
              <div className="px-4 pb-6">
                <h3 className="text-white font-black text-xl uppercase mb-3 tracking-tight">DAVID R.</h3>
                <p className="text-zinc-400 text-sm mb-6 leading-relaxed border-l-2 border-white/10 pl-4">"Rob explains the 'why', not just the 'how'. It's the first time I actually understood compression properly."</p>
                <div className="text-xs flex flex-col gap-1">
                  <span className="text-white font-bold tracking-wide">Bedroom Producer</span>
                  <span className="text-zinc-600">Canada</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: COMPARISON - Why You're Still Stuck */}
      <section className="relative z-10 px-6 md:px-12 py-24 bg-gradient-to-b from-transparent via-zinc-900/30 to-transparent">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-zinc-700 bg-zinc-900/50 mb-8">
              <span className="text-sm font-medium text-zinc-300">For The Self-Taught Producer</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-4">
              Why You're Still Stuck in{' '}
              <br className="hidden md:block" />
              <span className="font-serif italic font-normal text-zinc-200">Tutorial Hell.</span>
            </h2>
            
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              You've collected enough "tips" to last a lifetime, but you still can't finish a track.
            </p>
          </div>

          {/* Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {/* VS Badge (center on desktop) */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center">
                <span className="text-zinc-400 font-bold text-lg">VS</span>
              </div>
            </div>

            {/* YouTube Side */}
            <div className="bg-[#0A0A0A] rounded-3xl p-8 border border-zinc-800/50">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <Youtube className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-white">The YouTube Trap</h3>
              </div>
              
              <div className="space-y-4">
                {youtubeProblems.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-500/70 shrink-0 mt-0.5" />
                    <span className="text-zinc-400 text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile VS */}
            <div className="flex md:hidden items-center justify-center py-4">
              <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center">
                <span className="text-zinc-400 font-bold text-sm">VS</span>
              </div>
            </div>

            {/* Blueprint Side */}
            <div className="bg-[#0A0A0A] rounded-3xl p-8 border border-[#FF4F33]/30 relative overflow-hidden">
              {/* Subtle glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF4F33]/10 blur-3xl pointer-events-none" />
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-[#FF4F33] flex items-center justify-center">
                    <span className="text-white font-bold text-xs">PB</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">The Producer Blueprint</h3>
                </div>
                
                <div className="space-y-4">
                  {blueprintBenefits.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#FF4F33] shrink-0 mt-0.5" />
                      <span className="text-zinc-300 text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quote and CTA */}
          <div className="text-center mt-16">
            <blockquote className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-8">
              The problem isn't you or your talent. You simply lack the workflow to join it all together.
            </blockquote>
            
            <button 
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-zinc-200 transition-all"
            >
              Meet the Producer
              <ArrowRight className="w-5 h-5" />
            </button>
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
              It's The Era of{' '}
              <br />
              <span className="font-serif italic font-normal text-zinc-200">Home Studio Production.</span>
            </h2>
            
            <p className="text-zinc-400 text-lg">
              Major industry credits from a home studio is now a reality. I can show you the blueprint.
            </p>
          </div>
          
          {/* Right Column - Content */}
          <div className="space-y-6">
            <p className="text-zinc-300 leading-relaxed">
              You no longer need a £10k mic to be 'pro'. There are kids making 100-million stream hits on laptops. DJs are producing headline tracks in hotel rooms. I produce in coffee shops with headphones when I need a change of scene.
            </p>
            
            <p className="text-zinc-300 leading-relaxed">
              Many people are stuck in the headspace of "I need this pro gear or setup" before I can make top music. But the people who 'just do' - who have fun making music - have 10x the output, and therefore make 10x the progress.
            </p>
            
            <p className="text-zinc-300 leading-relaxed">
              To be a working producer you need efficiency of output, creative workflows to fall back on, and to have a strong sense of taste.
            </p>
            
            <p className="text-zinc-300 leading-relaxed">
              I can help you develop these. This is why I built The Producer Blueprint.
            </p>
            
            <div className="pt-4">
              <button 
                className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-zinc-200 transition-all"
              >
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
              <span className="text-[#FF4F33] font-bold text-sm shrink-0 px-2 py-1 bg-[#FF4F33]/10 rounded-lg">Bonus</span>
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
          
          <button 
            className="inline-flex items-center gap-2 bg-[#FF4F33] text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-[#e64530] transition-all shadow-[0_0_40px_rgba(255,79,51,0.4)] hover:shadow-[0_0_50px_rgba(255,79,51,0.5)]"
          >
            Start The Blueprint Today
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* ================= OFFER STACK SECTION (FIXED COPY) ================= */}
      <section className="py-32 px-6 bg-[#050505] border-t border-white/5 relative z-30">
        <div className="max-w-7xl mx-auto">
          
          {/* Headline Area */}
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 leading-[1.1]">
              <span className="font-serif italic font-normal text-zinc-400 lowercase tracking-normal">Introducing</span> <br />
              The Producer Blueprint.
            </h2>
            <div className="inline-block bg-zinc-900 border border-white/10 px-6 py-2 rounded-full">
              <span className="text-zinc-300 font-medium">Join today and get <span className="text-white underline decoration-[#FF4F33] underline-offset-4 font-bold">2 FREE Bonuses</span> included.</span>
            </div>
          </div>

          {/* Product Mockup Placeholder */}
          <div className="w-full max-w-5xl mx-auto aspect-[16/9] bg-zinc-900 border border-white/10 rounded-2xl mb-24 flex items-center justify-center relative overflow-hidden shadow-2xl group">
            <p className="text-zinc-600 font-mono text-sm uppercase tracking-widest z-10">[ Insert Product Mockup Image ]</p>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div>
          </div>

          {/* Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            
            {/* LEFT COLUMN: The Clean Stack */}
            <div className="lg:col-span-7">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-8 border-b border-white/10 pb-4">What You Get</h3>
              
              {/* Core Item (ONLY ONE) */}
              <div className="space-y-8 mb-12">
                <div className="flex gap-6 items-start group">
                  <div className="w-6 h-6 rounded-full bg-[#FF4F33] flex-shrink-0 flex items-center justify-center text-white mt-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <div className="flex-1 pb-8 border-b border-white/5">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-bold text-white group-hover:text-[#FF4F33] transition-colors">The Producer Blueprint Course</h4>
                      <span className="text-zinc-500 font-mono text-xs bg-zinc-900 px-2 py-1 rounded border border-white/5">$497 Value</span>
                    </div>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      7 modules, 70+ lessons. The complete production workflow Rob uses to produce release-ready music from a home studio. Includes Ableton project files and templates.
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
                    <div className="w-12 h-12 bg-black border border-white/10 rounded flex-shrink-0 flex items-center justify-center text-white text-lg font-serif italic">01</div>
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-lg font-bold text-white">Social Media, Business & Music Industry Module</h4>
                        <span className="text-zinc-500 font-mono text-xs line-through decoration-zinc-600">$97 Value</span>
                      </div>
                      <p className="text-zinc-400 text-sm leading-relaxed">Turn production into income. Growing a following, making content, and building real customers.</p>
                    </div>
                  </div>
                  
                  {/* Bonus 2 */}
                  <div className="flex gap-5">
                    <div className="w-12 h-12 bg-black border border-white/10 rounded flex-shrink-0 flex items-center justify-center text-white text-lg font-serif italic">02</div>
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-lg font-bold text-white">Rob's TikTok/IG Breakdown Vault</h4>
                        <span className="text-zinc-500 font-mono text-xs line-through decoration-zinc-600">$147 Value</span>
                      </div>
                      <p className="text-zinc-400 text-sm leading-relaxed">Project walkthroughs from Rob's viral content, plus downloadable project files and presets. Updated regularly with new breakdowns.</p>
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
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </button>

                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-zinc-500 text-xs font-medium">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                    30-Day 100% Money Back Guarantee
                  </div>
                  <div className="flex items-center justify-center gap-2 text-zinc-600 text-[10px] font-medium uppercase tracking-wide">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5z"/></svg>
                    Instant Login via Email
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CHECKOUT SECTION ================= */}
      <section className="py-32 px-6 bg-[#050505] border-t border-white/5 relative z-30">
        <div className="max-w-xl mx-auto">
          
          {/* Headline */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
              Get Instant<br />Access
            </h2>
            <p className="text-zinc-400 text-lg">
              Join 500+ producers building their career from a home studio.
            </p>
          </div>

          {/* Checkout Card */}
          <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            
            {/* SSL Badge */}
            <div className="bg-zinc-900 px-6 py-3 flex items-center justify-center gap-2 border-b border-white/5">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-zinc-400 text-xs font-medium uppercase tracking-widest">256-Bit SSL Secure</span>
            </div>

            <div className="p-8">
              
              {/* Product Info */}
              <div className="flex justify-between items-start mb-6 pb-6 border-b border-white/10">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">The Producer Blueprint™</h3>
                  <p className="text-zinc-500 text-sm">Complete System + 7 Modules + Templates</p>
                </div>
                <div className="text-right">
                  <span className="text-zinc-500 line-through text-sm block">$741</span>
                  <span className="text-2xl font-black text-white">$297</span>
                </div>
              </div>

              {/* Bonuses */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-zinc-300 text-sm">BONUS: Music Business Mastery</span>
                  </div>
                  <span className="text-green-500 text-sm font-medium">Free</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-zinc-300 text-sm">BONUS: The Breakdown Vault</span>
                  </div>
                  <span className="text-green-500 text-sm font-medium">Free</span>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-zinc-400 text-xs font-medium uppercase tracking-widest mb-2">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="John Smith" 
                    className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-[#FF4F33]/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 text-xs font-medium uppercase tracking-widest mb-2">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="you@example.com" 
                    className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-[#FF4F33]/50 transition-colors"
                  />
                </div>
              </div>

              {/* Order Bump */}
              <div className="mb-8">
                <div className="bg-[#FF4F33] text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-t-xl inline-block">
                  One-Time Offer
                </div>
                <div className="border-2 border-[#FF4F33] rounded-xl rounded-tl-none p-5 bg-[#FF4F33]/5">
                  <label className="flex gap-4 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded border-white/20 bg-transparent accent-[#FF4F33] mt-1 flex-shrink-0" />
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-white font-bold">YES, ADD: Alpha Drums 3 Sample Pack</span>
                        <span className="text-zinc-500 line-through text-sm">$97</span>
                        <span className="text-[#FF4F33] font-bold">+$37</span>
                      </div>
                      <p className="text-zinc-400 text-sm leading-relaxed mb-2">
                        Rob's premium drum library with over 700 curated sounds from sessions with A-list artists. Kicks, snares, and percussion that cut through any mix.
                      </p>
                      <p className="text-[#FF4F33] text-xs font-medium">&gt;&gt; Click box to add this deal</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Total & CTA */}
              <div className="space-y-4">
                <div className="flex justify-between items-center py-4 border-t border-white/10">
                  <span className="text-white font-bold text-lg">Total Due Today:</span>
                  <span className="text-3xl font-black text-white">$297.00</span>
                </div>

                <button className="w-full bg-[#FF4F33] hover:bg-[#FF4F33]/90 text-white text-lg font-black uppercase tracking-wide py-5 rounded-xl transition-all hover:scale-[1.02] shadow-xl flex items-center justify-center gap-2 group">
                  Get Instant Access
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-6 pt-4">
                  <div className="flex items-center gap-2 text-zinc-500 text-xs">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Secure Payment
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500 text-xs">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    30-Day Guarantee
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
