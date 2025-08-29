import React, { useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUTMTracking } from "@/hooks/useUTMTracking";

const AlphaDrums3VipList = () => {
  const utmParams = useUTMTracking();

  useEffect(() => {
    // Load Klaviyo form script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=WrvxHn';
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const scrollToForm = () => {
    const formElement = document.querySelector('.klaviyo-form-WrvxHn');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-black font-zurich">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <img 
              src="/lovable-uploads/ae79f8b9-bd73-4786-ad60-2fe1bd5c27af.png" 
              alt="Rob Late Audio Logo" 
              className="h-16 w-auto object-contain" 
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            {/* Eyebrow */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
              <span className="text-sm font-medium text-red-400 font-zurich-condensed">
                🔥 Exclusive: Only 250 Launch Bonuses Available
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl font-bold font-akira mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Alpha Drums 3 VIP List
              <br />
              <span className="text-3xl md:text-5xl">1hr Early Access</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto mb-12 font-zurich-condensed font-semibold">
              Get <span className="text-[#DEFF00]">Fractals FREE</span> (worth $59) when you order Alpha Drums 3. 
              Limited to the first 250 producers.
            </p>
          </div>

          {/* Klaviyo Form */}
          <div className="max-w-md mx-auto mb-16">
            <Card className="bg-gray-950/90 backdrop-blur-sm border-gray-700">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-center mb-6 text-white font-zurich-condensed">
                  Join the VIP List
                </h2>
                
                {/* Klaviyo Form Embed */}
                <div className="klaviyo-form-WrvxHn"></div>
                
                <p className="text-xs text-center text-gray-400 mt-4">
                  1-hour early access • Free $59 bonus • No spam
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Body Content */}
          <div className="max-w-3xl mx-auto text-center space-y-8 mb-16">
            <p className="text-lg text-gray-300 font-zurich-condensed">
              Be the first to unlock <span className="text-white font-semibold">Alpha Drums 3</span> - my biggest drum library yet, 
              with over <span className="text-[#DEFF00]">700 battle-tested sounds</span> straight from real sessions.
            </p>

            <p className="text-lg text-gray-300 font-zurich-condensed">
              ⚡ The first 250 orders will get the <span className="text-white font-semibold">Fractals FX Pack FREE</span> ($35 value) - 
              and the VIP list gets a <span className="text-[#DEFF00]">1-hour head start</span> before the public notification.
            </p>

            <p className="text-lg text-gray-300 font-zurich-condensed">
              Thousands of producers grabbed Alpha Drums 1 & 2 on launch day. 
              <span className="text-white font-semibold"> This one will go even faster.</span>
            </p>

            <p className="text-lg text-gray-300 font-zurich-condensed">
              👉 <span className="text-white font-semibold">Join the VIP list now</span> and secure your early access.
            </p>

            {/* CTA Button */}
            <div className="pt-8">
              <Button 
                onClick={scrollToForm}
                className="bg-gradient-to-r from-[#DEFF00] to-[#B8CC00] hover:from-[#B8CC00] hover:to-[#9BAA00] text-black font-semibold font-zurich-condensed text-lg px-8 py-4 h-auto"
                size="lg"
              >
                Join the VIP List
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative max-w-2xl mx-auto">
            <img 
              src="/lovable-uploads/c3977c47-ba35-48ce-ab95-c20b978cf4f8.png" 
              alt="Alpha Drums 3 - Studio Production" 
              className="w-full rounded-2xl shadow-2xl border border-gray-700" 
              style={{
                filter: 'drop-shadow(0 0 20px rgba(222, 255, 0, 0.3))',
                boxShadow: '0 0 40px rgba(222, 255, 0, 0.2)'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl"></div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-sm text-gray-400">
              © 2025 Rob Late • Alpha Drums 3 VIP List
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AlphaDrums3VipList;