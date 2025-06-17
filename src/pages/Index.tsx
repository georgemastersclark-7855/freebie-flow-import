import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Download, Mail, User } from "lucide-react";

const Index = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const { toast } = useToast();

  // Sample lead magnets - in a real app, these would come from a CMS or database
  const leadMagnets = [
    {
      id: 1,
      title: "Ultimate Marketing Guide",
      description: "Complete guide to digital marketing strategies",
      fileUrl: "#", // Replace with actual file URLs
      fileName: "marketing-guide.pdf"
    },
    {
      id: 2,
      title: "Social Media Templates",
      description: "20 ready-to-use social media post templates",
      fileUrl: "#",
      fileName: "social-templates.zip"
    },
    {
      id: 3,
      title: "Email Sequence Pack",
      description: "7-day email sequence templates",
      fileUrl: "#",
      fileName: "email-sequences.pdf"
    }
  ];

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

    // Send to Zapier webhook if URL is provided
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "no-cors",
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            timestamp: new Date().toISOString(),
            source: "squeeze_page",
          }),
        });
        
        console.log("Lead data sent to Zapier:", formData);
      } catch (error) {
        console.error("Error sending to Zapier:", error);
      }
    }

    // Simulate form processing
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
      toast({
        title: "Success!",
        description: "Welcome! Your downloads are ready below.",
      });
    }, 1000);
  };

  const handleDownload = (magnet: typeof leadMagnets[0]) => {
    // In a real app, this would trigger actual file downloads
    toast({
      title: "Download Started",
      description: `Downloading ${magnet.fileName}`,
    });
    console.log("Downloading:", magnet.fileName);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <header className="flex justify-center mb-12">
            <img 
              src="/lovable-uploads/ae79f8b9-bd73-4786-ad60-2fe1bd5c27af.png" 
              alt="YourBrand Logo" 
              className="h-12 w-auto"
            />
          </header>

          {/* Download Page Content */}
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#DEFF00] to-[#B8CC00] bg-clip-text text-transparent">
                Welcome, {formData.name}!
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Your free downloads are ready. Get instant access to all resources below.
              </p>
            </div>

            {/* Downloads Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {leadMagnets.map((magnet) => (
                <div
                  key={magnet.id}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#DEFF00] to-[#B8CC00] rounded-lg mx-auto mb-4">
                    <Download className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{magnet.title}</h3>
                  <p className="text-gray-400 mb-4 text-sm">{magnet.description}</p>
                  <Button
                    onClick={() => handleDownload(magnet)}
                    className="w-full bg-gradient-to-r from-[#DEFF00] to-[#B8CC00] hover:from-[#B8CC00] hover:to-[#9BAA00] text-black font-semibold"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download {magnet.fileName}
                  </Button>
                </div>
              ))}
            </div>

            {/* Zapier Webhook Configuration */}
            <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-4">Zapier Integration</h3>
              <Input
                type="url"
                placeholder="Enter your Zapier webhook URL"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
              <p className="text-sm text-gray-400 mt-2">
                Lead data will be sent to Klaviyo via this webhook
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Header */}
      <header className="relative z-10 flex justify-center pt-8 mb-12">
        <img 
          src="/lovable-uploads/ae79f8b9-bd73-4786-ad60-2fe1bd5c27af.png" 
          alt="YourBrand Logo" 
          className="h-12 w-auto"
        />
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center min-h-[80vh]">
        {/* Left Column - Content */}
        <div className="lg:w-1/2 lg:pr-12 mb-12 lg:mb-0 text-center lg:text-left">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in">
            Get Your
            <span className="bg-gradient-to-r from-[#DEFF00] to-[#B8CC00] bg-clip-text text-transparent block">
              Free Downloads
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 animate-fade-in">
            Unlock exclusive marketing resources, templates, and guides that will transform your business. 
            Join thousands of entrepreneurs who are already winning.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto lg:mx-0 animate-fade-in">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="pl-12 py-6 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 text-lg backdrop-blur-sm focus:border-[#DEFF00] transition-colors"
                required
              />
            </div>
            
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="email"
                placeholder="Your email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-12 py-6 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 text-lg backdrop-blur-sm focus:border-[#DEFF00] transition-colors"
                required
              />
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-[#DEFF00] to-[#B8CC00] hover:from-[#B8CC00] hover:to-[#9BAA00] transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-[#DEFF00]/25 text-black"
            >
              {isLoading ? "Processing..." : "Get My Free Downloads"}
            </Button>
          </form>

          <p className="text-sm text-gray-400 mt-4 animate-fade-in">
            No spam. Unsubscribe at any time. Your data is secure.
          </p>
        </div>

        {/* Right Column - Hero Image */}
        <div className="lg:w-1/2 relative">
          <div className="relative mx-auto max-w-lg">
            {/* Gradient overlay for visual appeal */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#DEFF00]/20 to-[#B8CC00]/20 rounded-2xl blur-xl"></div>
            
            {/* Main hero image container - no padding so image touches border */}
            <div className="relative bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl hover:scale-105 transition-transform duration-500 inline-block overflow-hidden">
              <img
                src="/lovable-uploads/3f8daf99-6f60-45d7-b57e-e340c42d6a8e.png"
                alt="Pro Drums Music Production"
                className="rounded-2xl shadow-2xl"
              />
            </div>
            
            {/* Floating elements for visual interest - moved outside overflow container */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-[#DEFF00] to-[#B8CC00] rounded-full flex items-center justify-center animate-pulse">
              <Download className="w-8 h-8 text-black" />
            </div>
            
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-[#B8CC00] to-[#DEFF00] rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-black" />
            </div>
          </div>
        </div>
      </div>

      {/* Zapier Configuration Section */}
      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-md mx-auto bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-center">Admin: Zapier Integration</h3>
          <Input
            type="url"
            placeholder="Enter your Zapier webhook URL for Klaviyo"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
          <p className="text-sm text-gray-400 mt-2 text-center">
            Connect to Klaviyo via Zapier webhook
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
