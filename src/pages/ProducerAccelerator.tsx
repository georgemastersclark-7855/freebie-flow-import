import { ArrowRight, Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import robHomeStudio from "@/assets/rob-home-studio.jpg";
import chainsmokersFriday from "@/assets/album-art/chainsmokers-friday.jpeg";
import chainsmokersNoShade from "@/assets/album-art/chainsmokers-no-shade.jpeg";
import chainsmokersSeeYouAgain from "@/assets/album-art/chainsmokers-see-you-again.jpeg";
import flawesDontBlameMe from "@/assets/album-art/flawes-dont-blame-me.jpg";
import tiandaNothingButLove from "@/assets/album-art/tianda-nothing-but-love.jpeg";

const ProducerAccelerator = () => {
  const typeformUrl = "https://your-typeform-url.typeform.com/to/xxxxx"; // Replace with actual Typeform URL

  const benefits = [
    "Direct feedback on your music from me",
    "Weekly live calls (90 mins)",
    "Private WhatsApp group to ask questions",
    "Limited to 15 people",
  ];

  const forYouIf = [
    "You're serious about making music your career.",
    "You're already making tracks - doesn't matter if you've released or not",
    "You're willing to share your work and take action on feedback",
    "You can commit to 8 weeks of showing up",
  ];

  const notForYouIf = [
    "You're just starting out and still learning your DAW",
    "You're not ready to have your music critiqued directly",
    "You can't commit to the weekly calls",
  ];

  const credits = [
    { src: chainsmokersFriday, alt: "The Chainsmokers - Friday" },
    { src: chainsmokersNoShade, alt: "The Chainsmokers - No Shade" },
    { src: chainsmokersSeeYouAgain, alt: "The Chainsmokers - See You Again" },
    { src: flawesDontBlameMe, alt: "Flawes - Don't Blame Me" },
    { src: tiandaNothingButLove, alt: "Tianda - Nothing But Love" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
      {/* Aurora Glow Effect */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse at center bottom, rgba(211,255,2,0.15) 0%, rgba(180,230,0,0.1) 25%, rgba(211,255,2,0.05) 50%, transparent 70%)",
        }}
      />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 max-w-7xl mx-auto">
        <div className="text-xl font-bold tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
          The Producer Blueprint<sup className="text-[10px] font-normal ml-0.5">™</sup>
        </div>
        <a
          href={typeformUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-black px-5 py-2 rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors"
        >
          Apply Now
        </a>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 px-6 py-16 md:py-24">
        {/* Two-Column Hero */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-16 max-w-7xl mx-auto">
          {/* Left Column - Content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.05em] leading-[1.1] mb-4 md:mb-6">
              Have Rob Late
              <br />
              <span className="font-serif italic font-normal tracking-normal text-zinc-200">
                Mentor You
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-zinc-400 mb-10 md:mb-12">
              8-week small group mentorship for producers
            </p>

            {/* Body Copy */}
            <p className="text-zinc-400 text-base md:text-xl leading-relaxed mb-10 md:mb-12 max-w-xl mx-auto lg:mx-0">
              I'm opening up places for the first ever Producer Accelerator.
              <br /><br />
              15 producers get mentored directly by me for 8 weeks. I help you finish more music, 
              improve your sound, and get clarity on what's actually holding you back in your music (and career).
            </p>

            {/* Benefits List */}
            <div className="mb-10 md:mb-12">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-6">What you get:</h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 justify-center lg:justify-start">
                    <Check className="w-5 h-5 text-[#D3FF02] flex-shrink-0" />
                    <span className="text-zinc-300 text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="mb-16 lg:mb-0">
              <p className="text-zinc-400 mb-6">Spaces are super limited. Click to apply below.</p>
              <a
                href={typeformUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#D3FF02] text-black px-8 py-4 rounded-2xl text-lg font-bold hover:bg-[#b8e000] transition-all shadow-[0_0_40px_rgba(211,255,2,0.4)]"
              >
                Apply Now
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Right Column - Image + Credits */}
          <div className="lg:w-1/2 mt-10 lg:mt-0">
            {/* Hero Image */}
            <div className="relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#D3FF02]/20 blur-[100px] rounded-full pointer-events-none" />
              <img
                src={robHomeStudio}
                alt="Rob Late in his home studio"
                className="relative z-10 w-full rounded-2xl shadow-2xl"
              />
            </div>

            {/* Credits Row */}
            <div className="mt-8">
              <p className="text-xs text-zinc-500 uppercase tracking-[0.2em] mb-4 text-center">
                Credits from artists like:
              </p>
              <div className="flex justify-center gap-3 flex-wrap">
                {credits.map((credit, index) => (
                  <img
                    key={index}
                    src={credit.src}
                    alt={credit.alt}
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Who Is This For Section */}
        <div className="max-w-7xl mx-auto mt-24 md:mt-32">
          <h2 className="text-3xl md:text-4xl font-black tracking-[-0.03em] text-center mb-10 md:mb-12">
            Who is this for?
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* This is for you if */}
            <div className="border border-zinc-800 bg-[#0A0A0A] rounded-2xl p-6 md:p-8">
              <h3 className="text-xl font-bold text-white mb-6">This is for you if:</h3>
              <div className="space-y-4">
                {forYouIf.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#D3FF02] flex-shrink-0 mt-0.5" />
                    <span className="text-zinc-400">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* This isn't for you if */}
            <div className="border border-zinc-800 bg-[#0A0A0A] rounded-2xl p-6 md:p-8">
              <h3 className="text-xl font-bold text-white mb-6">This isn't for you if:</h3>
              <div className="space-y-4">
                {notForYouIf.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-zinc-400">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-[#030303] border-t border-zinc-800 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="text-xl font-bold tracking-tight mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                The Producer Blueprint<sup className="text-[10px] font-normal ml-0.5">™</sup>
              </div>
              <p className="text-zinc-500 text-sm max-w-md">
                The complete production system for modern producers who want to create professional-sounding tracks consistently.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
              <div className="space-y-2">
                <Link to="/legal/privacy-policy" className="block text-sm text-zinc-500 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/legal/terms-of-service" className="block text-sm text-zinc-500 hover:text-white transition-colors">
                  Terms of Service
                </Link>
                <Link to="/legal/earnings-disclaimer" className="block text-sm text-zinc-500 hover:text-white transition-colors">
                  Earnings Disclaimer
                </Link>
                <Link to="/legal/refund-policy" className="block text-sm text-zinc-500 hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Contact</h4>
              <a href="mailto:team@roblate.com" className="text-sm text-zinc-500 hover:text-white transition-colors">
                team@roblate.com
              </a>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-zinc-800">
            <p className="text-xs text-zinc-600 mb-4">
              This site is not a part of the Facebook website or Facebook Inc. Additionally, this site is NOT endorsed by Facebook in any way. FACEBOOK is a trademark of FACEBOOK, Inc.
            </p>
            <p className="text-xs text-zinc-600">
              © {new Date().getFullYear()} Rob Late. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProducerAccelerator;
