import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { sendZapierEvent } from "@/lib/zapier";
import { toast } from "sonner";
const AlphaDrums3VipList = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Configure Alpha Drums 3 specific Zapier webhook
  useEffect(() => {
    const originalWebhook = localStorage.getItem('klaviyo_zapier_webhook');
    const alphaDrums3Webhook = 'https://hooks.zapier.com/hooks/catch/14759876/uhinw2k/';

    // Set Alpha Drums 3 webhook for this page
    localStorage.setItem('klaviyo_zapier_webhook', alphaDrums3Webhook);
    console.log('Alpha Drums 3: Configured Zapier webhook:', alphaDrums3Webhook);

    // Cleanup: restore original webhook when component unmounts
    return () => {
      if (originalWebhook) {
        localStorage.setItem('klaviyo_zapier_webhook', originalWebhook);
      } else {
        localStorage.removeItem('klaviyo_zapier_webhook');
      }
      console.log('Alpha Drums 3: Restored original webhook configuration');
    };
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsLoading(true);
    try {
      // Insert lead into Supabase
      const {
        error: leadError
      } = await supabase.from('leads').insert([{
        name: name.trim(),
        email: email.trim(),
        utm_campaign: 'Alpha Drums 3 VIP List',
        user_agent: navigator.userAgent,
        referrer: document.referrer || null
      }]);
      if (leadError) {
        console.error('Error inserting lead:', leadError);
        toast.error("Failed to save your information. Please try again.");
        return;
      }

      // Send to Zapier/Klaviyo
      const zapierResult = await sendZapierEvent({
        email: email.trim(),
        name: name.trim(),
        campaign: 'Alpha Drums 3 VIP List',
        timestamp: new Date().toISOString(),
        source: 'vip-signup'
      });
      if (zapierResult.ok) {
        setIsSubmitted(true);
        toast.success("Welcome to the VIP list! You'll get early access to Alpha Drums 3.");
      } else {
        toast.error("Sign up successful, but there was an issue with our notification system.");
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const scrollToForm = () => {
    const formElement = document.getElementById('vip-signup-form');
    if (formElement) {
      formElement.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <div className="min-h-screen bg-black font-zurich">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <img src="/lovable-uploads/ae79f8b9-bd73-4786-ad60-2fe1bd5c27af.png" alt="Rob Late Audio Logo" className="h-16 w-auto object-contain" />
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

            {/* Banner Image */}
            <div className="max-w-2xl mx-auto mb-8">
              <img src="/lovable-uploads/bc88d671-3cfe-46c6-bfb2-2c42e6820982.png" alt="Alpha Drums 3 VIP List - Get 1hr Early Access" className="w-full rounded-2xl shadow-2xl" />
            </div>

            <p className="text-lg text-white max-w-3xl mx-auto mb-12 font-zurich-condensed font-normal">
              Get <span className="text-[#DEFF00]">Fractals FREE</span> (worth $35) when you order Alpha Drums 3. 
              Limited to the first 250 producers.
            </p>

            {/* VIP Signup Form */}
            <div className="max-w-md mx-auto mb-16" id="vip-signup-form">
              {!isSubmitted ? <Card className="bg-gray-900/50 border-gray-700">
                  <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Input id="name" type="text" value={name} onChange={e => setName(e.target.value)} className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 placeholder:text-sm focus:border-[#DEFF00] focus:ring-[#DEFF00]" placeholder="Enter your name" required />
                      </div>
                      
                      <div className="space-y-2">
                        <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 placeholder:text-sm focus:border-[#DEFF00] focus:ring-[#DEFF00]" placeholder="Enter your email" required />
                      </div>
                      
                      <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-[#DEFF00] to-[#B8CC00] hover:from-[#B8CC00] hover:to-[#9BAA00] text-black font-semibold font-zurich-condensed text-base py-3 h-auto mt-6">
                        {isLoading ? "Joining..." : "Join VIP List"}
                      </Button>
                    </form>
                  </CardContent>
                </Card> : <Card className="bg-green-900/20 border-green-500/30">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">🎉</div>
                    <h3 className="text-xl font-bold text-white mb-2 font-zurich-condensed">
                      You're In!
                    </h3>
                    <p className="text-green-300 font-zurich-condensed">
                      Welcome to the Alpha Drums 3 VIP list. You'll get early access when it drops!
                    </p>
                  </CardContent>
                </Card>}
            </div>
          </div>

          {/* Body Content */}
          <div className="max-w-3xl mx-auto text-center space-y-8 mb-16">
            <h2 className="text-2xl font-bold text-white font-zurich-condensed mb-6">Join VIP List</h2>
            
            <p className="text-lg text-gray-300 font-zurich-condensed">
              Be the first to unlock <span className="text-white font-semibold">Alpha Drums 3</span> - my biggest drum library yet, 
              with over <span className="text-[#DEFF00]">700 battle-tested sounds</span> straight from real sessions.
            </p>

            <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-700">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-[#DEFF00] font-zurich-condensed mb-2">
                  🎯 VIP Early Access Rewards
                </h3>
              </div>
              
              <div className="space-y-6 text-center max-w-2xl mx-auto">
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/30">
                  <div className="flex items-start gap-3">
                    <span className="text-[#DEFF00] font-bold text-xl">⚡</span>
                    <p className="text-gray-300 font-zurich-condensed text-base">
                      <span className="text-white font-semibold">First 250 orders:</span> Get the Fractals FX Pack FREE ($35 value)
                    </p>
                  </div>
                </div>
                
                <div className="text-center my-6 py-4 border-t border-b border-gray-600/30">
                  <h4 className="text-lg font-bold text-white font-zurich-condensed mb-1">
                    Everyone in the first 250 gets entered to win:
                  </h4>
                </div>
                
                <div className="flex items-start gap-3">
                  <span className="text-[#DEFF00] font-bold">🎵</span>
                  <p className="text-gray-300 font-zurich-condensed">
                    <span className="text-white font-semibold">25 x Music Feedbacks:</span> I'll personally review your track and send you detailed feedback
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <span className="text-[#DEFF00] font-bold">🔥</span>
                  <p className="text-gray-300 font-zurich-condensed">
                    <span className="text-white font-semibold">3 x 1-to-1 Zoom Calls:</span> Score a 30-minute 1-on-1 Zoom call with me to talk production, mixing, or whatever you need
                  </p>
                </div>
              </div>
            </div>

            <p className="text-lg text-gray-300 font-zurich-condensed">
              The VIP list gets a <span className="text-[#DEFF00] font-semibold">2.5-hour head start</span> before the public notification. 
              Based on past launches, these bonuses will be gone in under 2 hours.
            </p>

            <p className="text-lg text-gray-300 font-zurich-condensed">
              Thousands of producers grabbed Alpha Drums 1 & 2 on launch day. 
              <span className="text-white font-semibold"> This one will go even faster.</span>
            </p>

            <p className="text-lg text-gray-300 font-zurich-condensed">
              👉 <span className="text-white font-semibold">Join the VIP list now</span> and secure your early access + your shot at these exclusive bonuses.
            </p>

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
    </div>;
};
export default AlphaDrums3VipList;