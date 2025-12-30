import { ArrowRight, Check, Play, Star } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const TheProducerBlueprint001 = () => {
  // Album art placeholders for the marquee
  const albumArt = [
    { id: 1, alt: "Album 1" },
    { id: 2, alt: "Album 2" },
    { id: 3, alt: "Album 3" },
    { id: 4, alt: "Album 4" },
    { id: 5, alt: "Album 5" },
    { id: 6, alt: "Album 6" },
    { id: 7, alt: "Album 7" },
    { id: 8, alt: "Album 8" },
  ];

  // Video case studies data
  const caseStudies = [
    {
      name: "Alex M.",
      role: "EDM Producer",
      quote: "Finally understood the full workflow from start to finish.",
    },
    {
      name: "Sarah J.",
      role: "Pop Producer",
      quote: "The mixing section alone was worth 10x the price.",
    },
    {
      name: "David R.",
      role: "Hip-Hop Producer",
      quote: "My tracks sound professional now. No more guessing.",
    },
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
          <div className="flex -space-x-3">
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
          Watch <span className="text-white font-semibold">Rob Late</span> (The Chainsmokers, Marshmello) demonstrate the end-to-end process he uses to write, produce, and mix professional records from a home studio.
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
                  className="flex-shrink-0 w-24 h-24 mx-3 rounded-lg bg-zinc-800 grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer hover:scale-105"
                >
                  <div className="w-full h-full rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-zinc-600 text-xs">
                    {album.alt}
                  </div>
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

        {/* Row 1: Wall of Love (Image Placeholders) */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div 
                key={item}
                className="aspect-[4/5] rounded-2xl border border-white/10 bg-zinc-900/50 shadow-2xl hover:scale-105 transition-transform duration-300 overflow-hidden group cursor-pointer"
              >
                {/* Placeholder Content */}
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-800/50 to-zinc-900/50">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-zinc-700/50 mx-auto mb-3 flex items-center justify-center">
                      <span className="text-zinc-500 text-lg">📸</span>
                    </div>
                    <p className="text-zinc-600 text-sm">Screenshot {item}</p>
                  </div>
                </div>
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
                <p className="text-zinc-300 text-base leading-relaxed">
                  "{study.quote}"
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 text-sm font-medium">
                    {study.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{study.name}</p>
                    <p className="text-zinc-500 text-xs">{study.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TheProducerBlueprint001;
