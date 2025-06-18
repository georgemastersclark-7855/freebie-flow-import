
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Download, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUTMTracking } from "@/hooks/useUTMTracking";

interface LeadMagnet {
  id: string;
  title: string;
  description: string;
  file_name: string;
  file_path: string;
  download_count: number;
}

const Index = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [leadMagnets, setLeadMagnets] = useState<LeadMagnet[]>([]);
  const [leadId, setLeadId] = useState<string | null>(null);
  // Set the Zapier webhook URL directly
  const zapierWebhook = "https://hooks.zapier.com/hooks/catch/14759876/uotfoui/";
  const { toast } = useToast();
  const utmParams = useUTMTracking();

  // Save the webhook to localStorage on component mount
  useEffect(() => {
    localStorage.setItem('klaviyo_zapier_webhook', zapierWebhook);
  }, []);

  // Fetch lead magnets from Supabase
  useEffect(() => {
    const fetchLeadMagnets = async () => {
      try {
        const { data, error } = await supabase
          .from('lead_magnets')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching lead magnets:', error);
          return;
        }

        setLeadMagnets(data || []);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchLeadMagnets();
  }, []);

  const sendToZapier = async (leadData: any) => {
    if (!zapierWebhook) {
      console.log('No Zapier webhook configured');
      return;
    }

    try {
      await fetch(zapierWebhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          ...leadData,
          event_type: "lead_magnet_download",
          source: "rob_late_website",
          timestamp: new Date().toISOString()
        }),
      });

      console.log('Data sent to Zapier/Klaviyo:', leadData);
    } catch (error) {
      console.error('Error sending to Zapier:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create lead record with UTM tracking
      const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .insert({
          name: formData.name,
          email: formData.email,
          utm_source: utmParams.utm_source,
          utm_medium: utmParams.utm_medium,
          utm_campaign: utmParams.utm_campaign,
          utm_term: utmParams.utm_term,
          utm_content: utmParams.utm_content,
          referrer: utmParams.referrer,
          ip_address: null, // Could be captured server-side
          user_agent: navigator.userAgent
        })
        .select()
        .single();

      if (leadError) {
        console.error('Error creating lead:', leadError);
        toast({
          title: "Error",
          description: "Failed to save lead information",
          variant: "destructive",
        });
        return;
      }

      setLeadId(leadData.id);
      setIsSubmitted(true);
      
      // Send to Zapier/Klaviyo
      await sendToZapier({
        leadId: leadData.id,
        name: formData.name,
        email: formData.email,
        utmParams: utmParams,
        event: 'lead_captured'
      });

      toast({
        title: "Success!",
        description: "Your download is ready below.",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (leadMagnet: LeadMagnet) => {
    try {
      // Get the signed URL for download
      const { data, error } = await supabase.storage
        .from('lead-magnets')
        .createSignedUrl(leadMagnet.file_path, 3600); // 1 hour expiry

      if (error) {
        console.error('Error creating signed URL:', error);
        toast({
          title: "Download Error",
          description: "Failed to prepare download. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Track download event
      if (leadId) {
        const { error: downloadError } = await supabase
          .from('lead_downloads')
          .insert({
            lead_id: leadId,
            lead_magnet_id: leadMagnet.id,
            utm_source: utmParams.utm_source,
            utm_medium: utmParams.utm_medium,
            utm_campaign: utmParams.utm_campaign,
            utm_term: utmParams.utm_term,
            utm_content: utmParams.utm_content
          });

        if (downloadError) {
          console.error('Error tracking download:', downloadError);
        }

        // Send download event to Zapier/Klaviyo
        await sendToZapier({
          leadId: leadId,
          name: formData.name,
          email: formData.email,
          downloadedFile: leadMagnet.file_name,
          utmParams: utmParams,
          event: 'file_downloaded'
        });
      }

      // Increment download count
      await supabase
        .from('lead_magnets')
        .update({ download_count: leadMagnet.download_count + 1 })
        .eq('id', leadMagnet.id);

      // Trigger download
      const link = document.createElement('a');
      link.href = data.signedUrl;
      link.download = leadMagnet.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download Started",
        description: `Downloading ${leadMagnet.file_name}`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Error",
        description: "Failed to download file. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden flex flex-col font-zurich">
      <div className="flex-grow mb-16 md:mb-0">
        {/* Header */}
        <header className="relative z-10 flex justify-center pt-8 mb-12">
          <img
            src="/lovable-uploads/ae79f8b9-bd73-4786-ad60-2fe1bd5c27af.png"
            alt="YourBrand Logo"
            className="h-12 w-auto"
          />
        </header>

        {/* Hero Section */}
        <div className="container mx-auto px-4 md:px-4 flex flex-col lg:flex-row items-center gap-8 lg:gap-12 min-h-[80vh]">
          {/* Left Column - Content */}
          <div className="lg:w-1/2 mb-12 lg:mb-0 text-center lg:text-left px-1 lg:px-0">
            <h1
              className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-akira mb-6 lg:mb-4 leading-none animate-fade-in"
              style={{ fontWeight: 700 }}
            >
              {isSubmitted ? (
                <>
                  Your Download
                  <span className="bg-gradient-to-r from-[#DEFF00] to-[#B8CC00] bg-clip-text text-transparent block">
                    IS READY
                  </span>
                </>
              ) : (
                <>
                  <span className="block">Get Your FREE</span>
                  <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent block">
                    DOWNLOADS
                  </span>
                </>
              )}
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-10 lg:mb-8 animate-fade-in font-zurich-condensed px-0 lg:px-0">
              {isSubmitted 
                ? "Get instant access to your free resource below."
                : "Enter your name and email below and I'll fire the download link straight to your inbox."
              }
            </p>

            {/* Form or Download Box */}
            <div className="max-w-md mx-auto lg:mx-0 animate-fade-in px-1 lg:px-0">
              {isSubmitted ? (
                // Download Boxes
                <div className="space-y-4">
                  {leadMagnets.length > 0 ? (
                    leadMagnets.map((leadMagnet) => (
                      <div key={leadMagnet.id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:bg-gray-800/70 transition-all duration-300">
                        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#DEFF00] to-[#B8CC00] rounded-lg mx-auto mb-4">
                          <Download className="w-8 h-8 text-black" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-center font-zurich">{leadMagnet.title}</h3>
                        <p className="text-gray-400 mb-4 text-sm text-center font-zurich">{leadMagnet.description}</p>
                        <Button
                          onClick={() => handleDownload(leadMagnet)}
                          className="w-full bg-gradient-to-r from-[#DEFF00] to-[#B8CC00] hover:from-[#B8CC00] hover:to-[#9BAA00] text-black font-semibold font-zurich-condensed"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download {leadMagnet.file_name}
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
                      <p className="text-center text-gray-400 font-zurich">No downloads available at the moment.</p>
                    </div>
                  )}
                </div>
              ) : (
                // Form
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-12 py-6 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 text-lg backdrop-blur-sm focus:border-[#DEFF00] transition-colors font-zurich-condensed"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Download className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="email"
                      placeholder="Your email address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-12 py-6 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 text-lg backdrop-blur-sm focus:border-[#DEFF00] transition-colors font-zurich-condensed"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-[#DEFF00] to-[#B8CC00] hover:from-[#B8CC00] hover:to-[#9BAA00] transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-[#DEFF00]/25 text-black font-zurich-condensed"
                    style={{
                      boxShadow: '0 0 20px rgba(222, 255, 0, 0.4), 0 0 40px rgba(222, 255, 0, 0.2), 0 0 60px rgba(222, 255, 0, 0.1)'
                    }}
                  >
                    {isLoading ? "Processing..." : "Get My Free Downloads"}
                  </Button>
                </form>
              )}
            </div>

            <p className="text-sm text-gray-400 mt-6 lg:mt-4 animate-fade-in font-zurich-condensed px-0 lg:px-0">
              {isSubmitted 
                ? "All files are ready for instant download. Enjoy your free resources!"
                : "No spam. Unsubscribe at any time."
              }
            </p>
          </div>

          {/* Right Column - Hero Image */}
          <div className="lg:w-1/2 relative flex justify-center lg:justify-end">
            <div className="relative mx-auto max-w-lg lg:max-w-md xl:max-w-lg">
              {/* Gradient overlay for visual appeal */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#DEFF00]/20 to-[#B8CC00]/20 rounded-2xl blur-xl"></div>

              {/* Main hero image container */}
              <div className="relative bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl hover:scale-105 transition-transform duration-500 inline-block overflow-hidden">
                <img
                  src="/lovable-uploads/3f8daf99-6f60-45d7-b57e-e340c42d6a8e.png"
                  alt="Pro Drums Music Production"
                  className="rounded-2xl shadow-2xl"
                />
              </div>

              {/* Rob's Signature Overlay - Adjusted position */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-20">
                <img
                  src="/lovable-uploads/c8da1c3b-55d4-4566-a55a-77a3b6a95f42.png"
                  alt="Rob's Signature"
                  className="h-20 w-auto opacity-95 drop-shadow-lg"
                />
              </div>

              {/* Floating element for visual interest - bottom left only, smaller on mobile */}
              <div className="absolute -bottom-4 -left-4 w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center">
                <Download className="w-4 h-4 md:w-6 md:h-6 text-black" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900/50 border-t border-gray-700 py-6">
        <div className="container mx-auto px-6 md:px-4 text-center">
          <p className="text-gray-400 font-zurich-condensed">
            Sample Packs & Presets Available at{" "}
            <a
              href="https://roblate.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#DEFF00] hover:text-[#B8CC00] transition-colors underline"
            >
              roblate.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
