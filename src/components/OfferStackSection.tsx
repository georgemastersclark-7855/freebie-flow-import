import { ArrowRight, Check } from "lucide-react";

// Placeholder Thumbnails - REPLACE THESE with your actual product covers
const thumbCourse = "https://placehold.co/200x200/18181b/ffffff?text=Course+Cover";
const thumbFiles = "https://placehold.co/200x200/18181b/ffffff?text=Project+Files";
const thumbBonus1 = "https://placehold.co/200x200/18181b/ffffff?text=Bonus+1";
const thumbBonus2 = "https://placehold.co/200x200/18181b/ffffff?text=Bonus+2";

const OfferStackSection = () => {
  return (
    <section className="relative py-24 px-4 md:px-6 bg-[#050505]">
      
      {/* Connector Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-zinc-800 to-transparent"></div>
      
      <div className="max-w-4xl mx-auto relative z-10 pt-8">
        
        {/* HEADER */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <span className="py-1.5 px-4 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-300 text-xs font-bold uppercase tracking-widest">
              WHAT YOU GET
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tighter">
            Join The Producer Blueprint.
          </h2>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto">
            Get immediate access to the complete system, templates, and <span className="text-[#FF4F33] font-bold">2 FREE bonuses</span>.
          </p>
        </div>

        {/* THE STACK CARD */}
        <div className="rounded-3xl border border-zinc-800 bg-[#0A0A0A] overflow-hidden shadow-2xl shadow-black/50 relative animate-fade-in-up">
          
          {/* Subtle top lighting */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          <div className="p-6 md:p-10">
            
            {/* LIST ITEMS WITH THUMBNAILS */}
            <ul className="space-y-8">
              
              {/* ITEM 1: MAIN COURSE */}
              <li className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between group">
                <div className="flex gap-6 flex-1">
                  {/* THUMBNAIL */}
                  <div className="shrink-0 w-24 h-24 bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden relative shadow-lg group-hover:border-zinc-600 transition-colors">
                    <img src={thumbCourse} alt="Course Thumbnail" className="w-full h-full object-cover" />
                    {/* Subtle inner glow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
                  </div>
                  
                  {/* CONTENT */}
                  <div className="flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-white group-hover:text-zinc-200 transition-colors">
                      The Producer Blueprint Course™
                    </h3>
                    <p className="text-zinc-400 text-sm mt-2 leading-relaxed max-w-md font-medium">
                      The complete start-to-finish workflow. 7 modules, 75+ lessons. Lifetime updates included.
                    </p>
                  </div>
                </div>
                
                {/* VALUE */}
                <div className="shrink-0 pl-10 md:pl-0 pt-4 md:pt-0">
                  <span className="inline-block py-1.5 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm font-mono font-bold">
                    $497 Value
                  </span>
                </div>
              </li>

              {/* ITEM 2: PROJECT FILES */}
              <li className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between group">
                <div className="flex gap-6 flex-1">
                  {/* THUMBNAIL */}
                  <div className="shrink-0 w-24 h-24 bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden relative shadow-lg group-hover:border-zinc-600 transition-colors">
                    <img src={thumbFiles} alt="Project Files Thumbnail" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
                  </div>
                  
                  {/* CONTENT */}
                  <div className="flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-white group-hover:text-zinc-200 transition-colors">
                      Ableton Project Files & Templates
                    </h3>
                    <p className="text-zinc-400 text-sm mt-2 leading-relaxed max-w-md font-medium">
                      Download the exact starting templates and finished project files Rob uses in sessions.
                    </p>
                  </div>
                </div>
                
                {/* VALUE */}
                <div className="shrink-0 pl-10 md:pl-0 pt-4 md:pt-0">
                  <span className="inline-block py-1.5 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm font-mono font-bold">
                    $197 Value
                  </span>
                </div>
              </li>

              {/* DIVIDER */}
              <li className="h-px bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 w-full my-6"></li>

              {/* ITEM 3: BONUS 1 */}
              <li className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between group">
                <div className="flex gap-6 flex-1">
                  {/* THUMBNAIL */}
                  <div className="shrink-0 w-24 h-24 bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden relative shadow-lg group-hover:border-zinc-600 transition-colors">
                    <img src={thumbBonus1} alt="Bonus 1 Thumbnail" className="w-full h-full object-cover" />
                    {/* Bonus Overlay Tag on Image */}
                    <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white border border-white/10">
                      Bonus #1
                    </div>
                  </div>
                  
                  {/* CONTENT */}
                  <div className="flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-white group-hover:text-zinc-200 transition-colors flex items-center gap-3">
                      Social Media & Business Module
                    </h3>
                    <p className="text-zinc-400 text-sm mt-2 leading-relaxed max-w-md">
                      Turn production into income. Strategies for growing a following & building real customers.
                    </p>
                  </div>
                </div>
                
                {/* VALUE */}
                <div className="shrink-0 pl-10 md:pl-0 pt-4 md:pt-0 flex items-center gap-3">
                  <span className="text-zinc-500 text-sm font-mono line-through font-medium decoration-zinc-600 decoration-2">
                    $97
                  </span>
                  <span className="inline-block py-1.5 px-3 rounded-lg bg-white text-black border border-white/20 text-xs font-mono font-extrabold tracking-wider shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                    FREE
                  </span>
                </div>
              </li>

              {/* ITEM 4: BONUS 2 */}
              <li className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between group">
                <div className="flex gap-6 flex-1">
                  {/* THUMBNAIL */}
                  <div className="shrink-0 w-24 h-24 bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden relative shadow-lg group-hover:border-zinc-600 transition-colors">
                    <img src={thumbBonus2} alt="Bonus 2 Thumbnail" className="w-full h-full object-cover" />
                    {/* Bonus Overlay Tag on Image */}
                    <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white border border-white/10">
                      Bonus #2
                    </div>
                  </div>
                  
                  {/* CONTENT */}
                  <div className="flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-white group-hover:text-zinc-200 transition-colors flex items-center gap-3">
                      Rob's TikTok/IG Breakdown Vault
                    </h3>
                    <p className="text-zinc-400 text-sm mt-2 leading-relaxed max-w-md">
                      Exclusive project walkthroughs from Rob's viral content + downloadable presets.
                    </p>
                  </div>
                </div>
                
                {/* VALUE */}
                <div className="shrink-0 pl-10 md:pl-0 pt-4 md:pt-0 flex items-center gap-3">
                  <span className="text-zinc-500 text-sm font-mono line-through font-medium decoration-zinc-600 decoration-2">
                    $147
                  </span>
                  <span className="inline-block py-1.5 px-3 rounded-lg bg-white text-black border border-white/20 text-xs font-mono font-extrabold tracking-wider shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                    FREE
                  </span>
                </div>
              </li>

            </ul>
          </div>

          {/* FOOTER / PRICING AREA */}
          <div className="bg-zinc-900/90 border-t border-zinc-800 p-8 md:p-12 flex flex-col items-center text-center backdrop-blur-xl relative z-10">
            
            {/* Total Value */}
            <div className="mb-6 space-y-1">
              <p className="text-zinc-500 font-medium text-sm uppercase tracking-wide">
                Total Value
              </p>
              <p className="text-3xl font-bold text-zinc-400 line-through decoration-zinc-600 decoration-2 opacity-70">
                $938
              </p>
            </div>

            {/* The Price */}
            <div className="flex flex-col items-center justify-center gap-2 mb-10">
              <span className="text-2xl font-medium text-white">One-time payment of only:</span>
              <span className="text-6xl md:text-7xl font-black text-[#FF4F33] tracking-tighter drop-shadow-[0_0_25px_rgba(255,79,51,0.2)]">
                $297
              </span>
            </div>

            {/* PRIMARY CTA BUTTON */}
            <button className="w-full md:max-w-md group relative inline-flex h-16 items-center justify-center overflow-hidden rounded-full bg-white font-bold text-black transition-all duration-300 hover:bg-[#FF4F33] hover:text-white hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(255,79,51,0.5)]">
              <span className="relative text-lg uppercase tracking-wide flex items-center gap-3">
                Get Instant Access <ArrowRight className="w-6 h-6" />
              </span>
            </button>

            {/* Guarantee/Secure Text */}
            <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-xs text-zinc-500 font-medium uppercase tracking-wider">
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-zinc-400" />
                Lifetime Access
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-zinc-400" />
                Secure Payment
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-zinc-400" />
                30-Day Guarantee
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfferStackSection;
