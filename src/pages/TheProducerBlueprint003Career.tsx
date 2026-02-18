import { lazy, Suspense, useEffect } from "react";
import { useShopifyCheckout } from "@/hooks/useShopifyCheckout";
import { useProducerBlueprintMeta } from "@/hooks/useProducerBlueprintMeta";
import { usePageMeta } from "@/hooks/usePageMeta";
import { ArrowRight, Check, Star } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";


const BelowFold = lazy(() => import("@/components/blueprint/BelowFold003Career"));

const TheProducerBlueprint003Career = () => {
  const { nameRef, emailRef, isLoading, handleCheckout } = useShopifyCheckout();
  const { trackScrollToPricing, trackOrderBumpChecked, trackFinalCheckoutClick } = useProducerBlueprintMeta("tpb_003_career");
  usePageMeta({
    title: "The Producer Blueprint | Make Money With Music",
    description: "Learn how to turn your production skills into real income. Sessions, sync placements, sample packs, and more. The complete production and business workflow behind 100M+ streams.",
    canonical: "https://audio.roblate.com/make-money-with-music",
  });

  // Load Vidalytics script (deferred to avoid blocking hero paint)
  useEffect(() => {
    let script: HTMLScriptElement | null = null;

    const loadVidalytics = () => {
      script = document.createElement("script");
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
    };

    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(loadVidalytics, { timeout: 3000 });
      return () => {
        cancelIdleCallback(id);
        if (script && document.body.contains(script)) document.body.removeChild(script);
      };
    } else {
      const timer = setTimeout(loadVidalytics, 2000);
      return () => {
        clearTimeout(timer);
        if (script && document.body.contains(script)) document.body.removeChild(script);
      };
    }
  }, []);

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
        <div className="text-xl font-bold tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">The Producer Blueprint<sup className="text-[10px] font-normal ml-0.5">™</sup></div>
        <div className="flex items-center gap-6">
          <a href="#pricing" onClick={() => trackScrollToPricing({ cta_location: "nav_bar" })} className="bg-white text-black px-5 py-2 rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors">
            Get Instant Access
          </a>
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
              <AvatarImage src="/avatars/avatar-ben.webp" className="object-cover" />
              <AvatarFallback>B</AvatarFallback>
            </Avatar>
            <Avatar className="w-8 h-8 md:w-10 md:h-10 border-2 border-[#050505]">
              <AvatarImage src="/avatars/avatar-producer-1.webp" className="object-cover" />
              <AvatarFallback>P1</AvatarFallback>
            </Avatar>
            <Avatar className="w-8 h-8 md:w-10 md:h-10 border-2 border-[#050505]">
              <AvatarImage src="/avatars/avatar-producer-2.webp" className="object-cover" />
              <AvatarFallback>P2</AvatarFallback>
            </Avatar>
            <Avatar className="w-8 h-8 md:w-10 md:h-10 border-2 border-[#050505]">
              <AvatarImage src="/avatars/avatar-producer-3.webp" className="object-cover" />
              <AvatarFallback>P3</AvatarFallback>
            </Avatar>
          </div>
          <div className="text-left">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-white text-white" />
              ))}
            </div>
            <p className="text-zinc-500 text-sm">1,200+ producers enrolled</p>
          </div>
        </div>

        {/* Headline */}
        <h1 className="hero-headline text-2xl md:text-5xl lg:text-6xl font-black tracking-[-0.05em] leading-[1.1] md:leading-[1.05] md:font-bold mb-6 md:mb-10 md:max-w-4xl md:mx-auto">
          Get the production workflow behind 100M+ streams so you can start earning a real income from music (without a label, manager, or expensive studio).
        </h1>

        {/* Subheadline */}
        <p className="text-zinc-400 text-base md:text-lg max-w-3xl mx-auto mb-8 md:mb-12 leading-relaxed">
          <span className="text-white font-semibold">Rob Late</span> built multiple income streams from production sessions, sample packs, brand deals, and sync placements, all from a home studio. Inside The Producer Blueprint, he breaks down the exact creative workflow and business approach that made it possible.
        </p>

        {/* Desktop/Mobile flex container with order swapping */}
        <div className="flex flex-col">
          
          {/* CTA Area - order-2 on mobile (after VSL), order-1 on desktop (before VSL) */}
          <div className="order-2 md:order-1 mb-6 md:mb-8">
            <a href="#pricing" onClick={() => trackScrollToPricing({ cta_location: "hero" })} className="inline-flex items-center gap-2 bg-[#D3FF02] text-black px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-[#b8e000] transition-all shadow-[0_0_40px_rgba(211,255,2,0.4)] hover:shadow-[0_0_50px_rgba(211,255,2,0.5)]">
              Start Building Your Music Income
              <ArrowRight className="w-5 h-5" />
            </a>
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
              Updated for 2026
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

            {/* VSL Label */}
            <div className="text-center mb-3 md:hidden">
              <span className="text-white text-[11px] font-bold tracking-tight">Watch: Inside The Producer Blueprint</span>
            </div>

            {/* Video Container */}
            <div className="relative w-full bg-zinc-900 rounded-[24px] border border-white/10 overflow-hidden shadow-2xl">

              {/* Vidalytics Embed */}
              <div
                id="vidalytics_embed_V5HrhyRBNAeDtppA"
                className="relative z-10 w-full"
                style={{ width: "100%", position: "relative", paddingTop: "56.25%" }}
              />
            </div>
          </div>
        </div>

      </main>

      <Suspense fallback={<div />}>
        <BelowFold
          trackScrollToPricing={trackScrollToPricing}
          trackOrderBumpChecked={trackOrderBumpChecked}
          trackFinalCheckoutClick={trackFinalCheckoutClick}
          nameRef={nameRef}
          emailRef={emailRef}
          isLoading={isLoading}
          handleCheckout={handleCheckout}
        />
      </Suspense>
    </div>
  );
};

export default TheProducerBlueprint003Career;
