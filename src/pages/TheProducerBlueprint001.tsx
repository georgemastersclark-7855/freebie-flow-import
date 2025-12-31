import { ArrowRight, Check, Play, Star, X, Youtube, Lightbulb } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import testimonial1 from "@/assets/testimonials/testimonial-1.jpeg";
import testimonial2 from "@/assets/testimonials/testimonial-2.jpeg";
import testimonial3 from "@/assets/testimonials/testimonial-3.jpeg";
import chainsomokersFriday from "@/assets/album-art/chainsmokers-friday.jpeg";

const TheProducerBlueprint001 = () => {
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
    { text: "Collecting \"tricks\" like trading cards" },
    { text: "Conflicting advice from dozens of creators" },
    { text: "Disconnected tips with no context" },
    { text: "Hard drive full of 8-bar loops" },
    { text: "Teachers who teach, but don't produce" },
  ];

  // Comparison data - The Blueprint Method
  const blueprintBenefits = [
    { text: "One complete workflow from a working pro" },
    { text: "Seeing the \"why\" behind 10,000 micro-decisions" },
    { text: "Logical progression: Blank project to Master" },
    { text: "A real reference point (not just theory)" },
    { text: "From a producer still landing placements" },
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

        {/* Hero VSL Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Video Glow */}
          <div 
            className="absolute inset-0 -z-10 blur-3xl opacity-30"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255,79,51,0.3) 0%, transparent 70%)',
            }}
          />
          
          <div className="relative aspect-video bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden group cursor-pointer">
            {/* Video Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900" />
            
            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-[#FF4F33] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,79,51,0.5)] group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              </div>
            </div>

            {/* Overlay Text */}
            <div className="absolute bottom-6 left-6 text-left">
              <p className="text-xs uppercase tracking-widest text-zinc-400 mb-1">
                Watch The Overview
              </p>
              <p className="text-xl font-serif italic text-white">
                See How It Works
              </p>
            </div>
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

      {/* SECTION 3: REALITY CHECK */}
      <section className="relative z-10 px-6 md:px-12 py-24 bg-gradient-to-b from-transparent via-zinc-900/30 to-transparent">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-zinc-700 bg-zinc-900/50 mb-8">
              <span className="text-sm font-medium text-zinc-300">The Reality Check</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-4">
              Why you're still stuck in{' '}
              <span className="font-serif italic font-normal text-zinc-200">Tutorial Hell</span>.
            </h2>
            
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              It's not a lack of talent. It's a lack of context.
            </p>
          </div>

          {/* Two Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The YouTube Trap */}
            <div className="bg-[#0A0A0A] rounded-3xl p-8 border border-zinc-800/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <Youtube className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white">The YouTube Trap</h3>
              </div>
              
              <p className="text-zinc-400 leading-relaxed mb-6">
                You watch a tutorial on compression. Then one on EQ. Then one on chords. You collect "tricks" like trading cards, but you have no idea how they fit together.
              </p>
              
              <p className="text-zinc-500 text-sm border-t border-zinc-800 pt-6">
                <span className="text-white font-medium">The Result?</span> A hard drive full of 8-bar loops that never become finished songs.
              </p>
            </div>

            {/* The Blueprint Method */}
            <div className="bg-[#0A0A0A] rounded-3xl p-8 border border-[#FF4F33]/30 relative overflow-hidden">
              {/* Subtle glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF4F33]/10 blur-3xl pointer-events-none" />
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#FF4F33]/20 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-[#FF4F33]" />
                  </div>
                  <h3 className="text-xl font-bold text-white">The Blueprint Method</h3>
                </div>
                
                <p className="text-zinc-400 leading-relaxed mb-6">
                  You don't need more tips. You need a reference point. You need to watch a pro make 10,000 micro-decisions in real-time.
                </p>
                
                <p className="text-zinc-500 text-sm border-t border-zinc-800 pt-6">
                  <span className="text-[#FF4F33] font-medium">From a blank project file</span> to a Spotify-ready master. No skipping steps. No secrets. Just the work.
                </p>
              </div>
            </div>
          </div>

          {/* Quote */}
          <div className="text-center mt-16">
            <blockquote className="text-xl md:text-2xl text-zinc-400 font-serif italic max-w-2xl mx-auto">
              "You can't learn to paint a masterpiece by only looking at the brush strokes. You need to watch the painter."
            </blockquote>
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

      {/* SECTION 5: COMPARISON */}
      <section className="relative z-10 px-6 md:px-12 py-24 bg-gradient-to-b from-transparent via-zinc-900/30 to-transparent">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-zinc-700 bg-zinc-900/50 mb-8">
              <span className="text-sm font-medium text-zinc-300">Why This</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-4">
              Why You're Still Stuck in{' '}
              <br className="hidden md:block" />
              <span className="font-serif italic font-normal text-zinc-200">Tutorial Hell.</span>
            </h2>
            
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              It's not a lack of talent. It's a lack of context.
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
                  <h3 className="text-lg font-semibold text-white">The Blueprint Method</h3>
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
              You don't need more "content". You need a professional reference point.
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
    </div>
  );
};

export default TheProducerBlueprint001;
