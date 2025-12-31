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

      {/* SECTION 2: SOCIAL PROOF */}
      <section className="relative z-10 px-6 md:px-12 py-24 max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          {/* Pill Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-zinc-700 bg-zinc-900/50 mb-8">
            <span className="text-sm font-medium text-zinc-300">Unfiltered Feedback</span>
          </div>
          
          {/* Headline */}
          <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-4">
            Hear it directly from{' '}
            <span className="font-serif italic font-normal text-zinc-200">the producers</span>.
          </h2>
          
          {/* Subheadline */}
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Join <span className="text-white font-semibold">500+ producers</span> who have upgraded their workflow.
          </p>
        </div>

        {/* Avatar Scrolling Row */}
        <div className="relative overflow-hidden mb-16">
          {/* Fade Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />
          
          <div className="flex animate-marquee gap-4" style={{ animationDuration: '30s' }}>
            {[...avatarImages, ...avatarImages, ...avatarImages].map((src, index) => (
              <Avatar key={index} className="w-16 h-16 flex-shrink-0 border-2 border-zinc-800">
                <AvatarImage src={src} />
                <AvatarFallback>U{index + 1}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>

        {/* Row 1: Wall of Love */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonialData.map((testimonial, index) => (
              <div 
                key={index}
                className="text-center"
              >
                <div className="aspect-[4/5] rounded-2xl border border-white/10 bg-[#121212] shadow-2xl hover:scale-[1.02] hover:border-white/20 transition-all duration-300 overflow-hidden cursor-pointer mb-3">
                  <img 
                    src={testimonial.image} 
                    alt={`${testimonial.username} screenshot`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-zinc-500 text-sm">{testimonial.username} screenshot</p>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Video Case Studies */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {caseStudies.map((study, index) => (
            <div 
              key={index}
              className="bg-[#0A0A0A] rounded-[30px] p-6 border border-zinc-800/50 hover:border-zinc-700/50 transition-colors"
            >
              {/* Video Thumbnail */}
              <div className="aspect-video rounded-2xl bg-zinc-900 mb-5 overflow-hidden relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 bg-[#FF4F33]/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                  </div>
                </div>
              </div>
              
              {/* Text Info */}
              <div className="space-y-3">
                <p className="text-white font-semibold text-sm tracking-wide">{study.name}</p>
                <p className="text-zinc-400 text-base leading-relaxed">
                  "{study.quote}"
                </p>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <span>{study.role}</span>
                  <span className="text-zinc-700">•</span>
                  <span>{study.location}</span>
                </div>
              </div>
            </div>
          ))}
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

      {/* SECTION: OFFER STACK */}
      <section className="py-32 px-6 bg-[#050505] border-t border-white/5 relative z-30">
        <div className="max-w-7xl mx-auto">
          
          {/* Headline Area */}
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-6 leading-[0.9]">
              Introducing <br /> 
              <span className="font-serif italic font-normal text-white">The Producer Blueprint.</span>
            </h2>
            <div className="inline-block bg-zinc-900 border border-white/10 px-6 py-2 rounded-full">
              <span className="text-zinc-300 font-medium">Join today and get <span className="text-white underline decoration-[#FF4F33] underline-offset-4 font-bold">2 FREE Bonuses</span> included.</span>
            </div>
          </div>

          {/* Product Mockup */}
          <div className="w-full max-w-4xl mx-auto mb-24">
            <img 
              src={productStackMockup} 
              alt="The Producer Blueprint Course Bundle" 
              className="w-full"
            />
          </div>

          {/* Offer Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* LEFT COLUMN: The Deliverables */}
            <div className="lg:col-span-7 space-y-12">
              
              {/* Core Course */}
              <div>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-[#FF4F33]">WHAT YOU GET:</span>
                </h3>
                <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 flex gap-6 hover:border-white/10 transition-colors">
                  <div className="w-8 h-8 bg-[#FF4F33] rounded-full flex-shrink-0 flex items-center justify-center text-white mt-1">
                    <Check className="w-4 h-4" strokeWidth={3} />
                  </div>
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-bold text-white">The Producer Blueprint Course</h4>
                      <span className="text-zinc-500 font-mono text-sm border border-white/10 px-2 py-1 rounded bg-zinc-900">$497 Value</span>
                    </div>
                    <p className="text-zinc-400 text-base leading-relaxed">
                      7 modules, 70+ lessons. The complete production workflow Rob uses to produce release-ready music from a home studio. Includes Ableton project files and templates.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bonuses Container */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
                  <span className="text-[#FF4F33]">FREE BONUSES INCLUDED:</span>
                </h3>
                
                {/* Bonus 1 */}
                <div className="bg-zinc-900/50 border border-[#FF4F33]/30 rounded-2xl p-8 flex gap-6 relative overflow-hidden group">
                  {/* Orange Glow Effect */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF4F33]/5 blur-3xl rounded-full pointer-events-none group-hover:bg-[#FF4F33]/10 transition-all"></div>
                  
                  <div className="w-8 h-8 border-2 border-[#FF4F33] rounded-full flex-shrink-0 flex items-center justify-center text-[#FF4F33] font-bold mt-1 text-lg">+</div>
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-bold text-white">Bonus 1: Music Business Mastery</h4>
                      <span className="text-zinc-500 font-mono text-sm border border-white/10 px-2 py-1 rounded bg-zinc-900">$97 Value</span>
                    </div>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      Turn production into income. Learn how to grow a following, make content that converts, and build a real customer base.
                    </p>
                  </div>
                </div>

                {/* Bonus 2 */}
                <div className="bg-zinc-900/50 border border-[#FF4F33]/30 rounded-2xl p-8 flex gap-6 relative overflow-hidden group">
                  {/* Orange Glow Effect */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF4F33]/5 blur-3xl rounded-full pointer-events-none group-hover:bg-[#FF4F33]/10 transition-all"></div>
                  <div className="w-8 h-8 border-2 border-[#FF4F33] rounded-full flex-shrink-0 flex items-center justify-center text-[#FF4F33] font-bold mt-1 text-lg">+</div>
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-bold text-white">Bonus 2: The Breakdown Vault</h4>
                      <span className="text-zinc-500 font-mono text-sm border border-white/10 px-2 py-1 rounded bg-zinc-900">$147 Value</span>
                    </div>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      Project walkthroughs from Rob's viral content, plus downloadable project files and presets. Updated regularly with new breakdowns.
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile Total Value (Hidden on Desktop) */}
              <div className="lg:hidden border-t border-white/10 pt-6 flex justify-between items-center">
                <span className="text-zinc-500 font-bold uppercase tracking-widest text-sm">Total Value</span>
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

                {/* Price Stack */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-zinc-400 font-medium">Total Value</span>
                  <span className="text-zinc-500 line-through decoration-zinc-500 decoration-1 text-lg">$741</span>
                </div>
                
                <div className="flex justify-between items-end mb-10">
                  <span className="text-white text-xl font-bold uppercase">Your Price</span>
                  <span className="text-6xl font-black text-[#FF4F33] tracking-tighter">$297</span>
                </div>

                {/* CTA */}
                <button className="w-full bg-white hover:bg-zinc-200 text-black text-lg font-black uppercase tracking-wide py-5 rounded-xl mb-6 transition-transform hover:scale-[1.02] shadow-xl flex items-center justify-center gap-2 group">
                  Start The Blueprint
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Trust Elements */}
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
    </div>
  );
};

export default TheProducerBlueprint001;
