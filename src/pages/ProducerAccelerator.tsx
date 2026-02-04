import { Button } from "@/components/ui/button";
import { Music, Video, MessageCircle, Users } from "lucide-react";

const ProducerAccelerator = () => {
  const typeformUrl = "https://your-typeform-url.typeform.com/to/xxxxx"; // Replace with actual Typeform URL

  const benefits = [
    { icon: Music, text: "Direct feedback on your music from me" },
    { icon: Video, text: "Weekly live calls (90 mins)" },
    { icon: MessageCircle, text: "Private WhatsApp group to ask questions" },
    { icon: Users, text: "Limited to 15 people" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <img
            src="/lovable-uploads/c70a01f4-97bc-4fb1-90e7-5262f590a25b.png"
            alt="Rob Late"
            className="h-8 md:h-10"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-12 md:py-20">
        <div className="max-w-2xl mx-auto text-center">
          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4">
            Have Rob Late Mentor You
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-zinc-400 font-['Zurich_BT_Condensed'] mb-8">
            8-week small group mentorship for producers
          </p>

          {/* Body Copy */}
          <div className="bg-zinc-900/50 border border-zinc-700 rounded-2xl p-6 md:p-8 mb-8 shadow-[0_0_40px_rgba(211,255,2,0.05)]">
            <p className="text-lg md:text-xl text-zinc-300 font-['Zurich_BT_Condensed'] leading-relaxed mb-8">
              I'm opening up places for the first ever Producer Accelerator.
              <br /><br />
              15 producers get mentored directly by me for 8 weeks. I help you finish more music, improve your sound, and get clarity on what's actually holding you back in your music (and career).
            </p>

            {/* Benefits */}
            <div className="space-y-4 text-left mb-8">
              <h2 className="text-xl font-bold text-white mb-4">What you get:</h2>
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#D3FF02]/10 flex items-center justify-center">
                    <benefit.icon className="w-5 h-5 text-[#D3FF02]" />
                  </div>
                  <span className="text-zinc-300 font-['Zurich_BT_Condensed'] text-lg">
                    {benefit.text}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="pt-6 border-t border-zinc-700">
              <p className="text-zinc-400 font-['Zurich_BT_Condensed'] mb-6">
                Spaces are super limited. Click to apply below.
              </p>
              
              <a
                href={typeformUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-[#D3FF02] text-black font-black text-lg px-10 py-6 rounded-full hover:bg-[#D3FF02]/90 hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(211,255,2,0.3)]">
                  Apply Now
                </Button>
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto text-center text-zinc-500 text-sm font-['Zurich_BT_Condensed']">
          © {new Date().getFullYear()} Rob Late. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default ProducerAccelerator;
