import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Gem, Music, Flame, ChevronRight, Share2, Twitter, Facebook, PartyPopper } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { sendZapierEvent } from "@/lib/zapier";
const AlphaDrums3VipList = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVipClosed] = useState(true); // VIP list is now closed

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Store in Supabase
      const { error } = await supabase
        .from('leads')
        .insert([
          {
            name: name,
            email: email,
            utm_source: 'alphadrums3',
            utm_campaign: 'vip-list'
          }
        ]);

      if (error) throw error;

      // Send to Zapier
      await sendZapierEvent({
        name: name,
        email: email,
        source: 'Alpha Drums 3 VIP List',
        timestamp: new Date().toISOString()
      });

      setIsSubmitted(true);
      toast.success('Success! Check your email for confirmation.');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong. Please try again.');
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
              <span className="text-sm font-medium text-red-400 font-zurich-condensed flex items-center gap-1">
                <Flame size={16} className="text-red-400" />
                Exclusive: Only 250 Launch Bonuses Available
              </span>
            </div>

            {/* Banner Image */}
            <div className="max-w-2xl mx-auto mb-8">
              <img src="/lovable-uploads/a4ac1d92-9ce0-4d0e-bb2a-bf824beaedaf.png" alt="Alpha Drums 3 VIP List - Rob Late" className="w-full rounded-2xl shadow-2xl" />
            </div>

            <p className="text-base text-white max-w-3xl mx-auto mb-12 font-zurich-condensed font-normal">
              Get <span className="text-[#DEFF00]">Fractals FREE</span> (worth $35) when you order Alpha Drums 3. 
              Limited to the first 250 producers. Be the first to unlock <span className="font-semibold">Alpha Drums 3</span> - my biggest drum library yet, 
              with over <span className="text-[#DEFF00]">700 battle-tested sounds</span> straight from real sessions.
            </p>

            {/* VIP Signup Form */}
            <div className="max-w-md mx-auto mb-16" id="vip-signup-form">
              {isVipClosed ? (
                <Card className="bg-red-900/20 border-red-500/30">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-2xl font-bold text-white mb-3 font-zurich-condensed">
                      VIP List has now closed
                    </h3>
                    <p className="text-red-200 font-zurich-condensed text-lg">Alpha Drums 3 will be launching Saturday 6th September. If you're in, you're in. Check your inbox tomorrow morning for early access.</p>
                    <p className="text-red-200 font-zurich-condensed text-lg mt-4">If you missed it, don't worry - you'll still get the launch email with everyone else. Just be ready to move fast for those 250 Fractals bonuses.</p>
                  </CardContent>
                </Card>
              ) : isSubmitted ? (
                <Card className="bg-green-900/20 border-green-500/30">
                  <CardContent className="p-6 text-center">
                    <PartyPopper className="w-12 h-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-3 font-zurich-condensed">
                      You're on the VIP list!
                    </h3>
                    <p className="text-green-200 font-zurich-condensed">
                      Check your email for confirmation. You'll get early access 2.5 hours before everyone else.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="relative">
                  {/* External glow effect */}
                  <div className="absolute inset-0 bg-white/20 blur-2xl rounded-lg"></div>
                  
                  <Card className="bg-gray-900/50 border-gray-700 relative z-10">
                    <CardContent className="p-6">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-white font-zurich-condensed">Name</Label>
                          <Input
                            id="name"
                            type="text"
                            placeholder="Your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 font-zurich-condensed"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-white font-zurich-condensed">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 font-zurich-condensed"
                          />
                        </div>
                        
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full bg-gradient-to-r from-[#DEFF00] to-[#B8CC00] hover:from-[#B8CC00] hover:to-[#9BAA00] text-black font-semibold font-zurich-condensed"
                        >
                          {isLoading ? 'Joining...' : 'Join VIP List'}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>

          {/* Body Content */}
          <div className="max-w-3xl mx-auto text-center space-y-8 mb-16">
            <h2 className="text-2xl font-bold text-white font-zurich-condensed mb-6">Join VIP List</h2>
            
            <p className="text-base text-gray-300 font-zurich-condensed">
              The VIP list gets a <span className="text-[#DEFF00] font-semibold">2.5-hour head start</span> before the public notification. 
              Based on past launches, these bonuses will be gone in under 2 hours.
            </p>

            <p className="text-base text-gray-300 font-zurich-condensed">
              Thousands of producers grabbed Alpha Drums 1 & 2 on launch day. 
              <span className="text-white font-semibold"> This one will go even faster.</span>
            </p>

            <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-700">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-b from-white via-gray-300 to-gray-500 bg-clip-text text-transparent font-zurich-condensed mb-2 flex items-center justify-center gap-2">
                  <Gem size={24} className="text-white drop-shadow-sm" />
                  VIP Early Access Rewards
                </h3>
              </div>
              
              <div className="space-y-4 max-w-2xl mx-auto">
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600/30 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <img src="/lovable-uploads/c70a01f4-97bc-4fb1-90e7-5262f590a25b.png" alt="Fractals FX Pack" className="w-24 h-24 object-contain drop-shadow-lg" />
                    <div>
                      <h5 className="text-white font-bold font-zurich-condensed text-lg mb-1">First 250 Orders</h5>
                      <p className="text-gray-300 font-zurich-condensed text-sm">
                        Get the Fractals FX Pack FREE ($35 value)
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center my-8 py-4 border-t border-b border-gray-600/30">
                  <h4 className="text-xl font-bold text-white font-zurich-condensed mb-1">
                    Everyone in the first 250 gets entered to win:
                  </h4>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600/30 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Music size={32} className="text-white drop-shadow-sm" style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #d1d5db 50%, #9ca3af 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))'
                  }} />
                    <div>
                      <h5 className="text-white font-bold font-zurich-condensed text-lg mb-1">25 x Music Feedbacks</h5>
                      <p className="text-gray-300 font-zurich-condensed text-sm">
                        I'll personally review your track and send you detailed feedback
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600/30 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Flame size={32} className="text-white drop-shadow-sm" style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #d1d5db 50%, #9ca3af 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))'
                  }} />
                    <div>
                      <h5 className="text-white font-bold font-zurich-condensed text-lg mb-1">3 x 1-to-1 Zoom Calls</h5>
                      <p className="text-gray-300 font-zurich-condensed text-sm">
                        Score a 30-minute 1-on-1 Zoom call with me to talk production, mixing, or whatever you need
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-base text-gray-300 font-zurich-condensed">
                <ChevronRight size={20} className="text-[#DEFF00] flex-shrink-0" />
                <span>
                  <span className="text-white font-semibold">Join the VIP list now</span> and secure your early access + your shot at these exclusive bonuses.
                </span>
              </div>
            </div>

            {/* Social Share Section */}
            <div className="mt-12 pt-8 border-t border-gray-700">
              <h3 className="text-lg font-bold text-white font-zurich-condensed mb-4 text-center">Share with Fellow Producers</h3>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Button onClick={() => {
                const url = window.location.href;
                const text = "Join the Alpha Drums 3 VIP list and get Fractals FREE ($35 value) + early access!";
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
              }} variant="outline" size="sm" className="bg-gray-800/50 border-gray-600 hover:bg-gray-700/50 text-white w-full sm:w-auto">
                  <Twitter size={16} className="mr-2" />
                  Share on X
                </Button>
                <Button onClick={() => {
                const url = window.location.href;
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
              }} variant="outline" size="sm" className="bg-gray-800/50 border-gray-600 hover:bg-gray-700/50 text-white w-full sm:w-auto">
                  <Facebook size={16} className="mr-2" />
                  Share on Facebook
                </Button>
                <Button onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'Alpha Drums 3 VIP List',
                    text: 'Join the Alpha Drums 3 VIP list and get Fractals FREE ($35 value) + early access!',
                    url: window.location.href
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied to clipboard!");
                }
              }} variant="outline" size="sm" className="bg-gray-800/50 border-gray-600 hover:bg-gray-700/50 text-white w-full sm:w-auto">
                  <Share2 size={16} className="mr-2" />
                  Share Link
                </Button>
              </div>
            </div>

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