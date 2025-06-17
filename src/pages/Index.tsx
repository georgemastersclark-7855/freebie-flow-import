
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Download, User } from "lucide-react";

const Index = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Single lead magnet for download
  const leadMagnet = {
    id: 1,
    title: "Ultimate Marketing Guide",
    description: "Complete guide to digital marketing strategies",
    fileUrl: "#", // Replace with actual file URL
    fileName: "marketing-guide.pdf"
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

    // Simulate form processing
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
      toast({
        title: "Success!",
        description: "Your download is ready below.",
      });
    }, 1000);
  };

  const handleDownload = () => {
    // In a real app, this would trigger actual file downloads
    toast({
      title: "Download Started",
      description: `Downloading ${leadMagnet.fileName}`,
    });
    console.log("Downloading:", leadMagnet.fileName);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden flex flex-col">
      <div className="flex-grow">
        {/* Header */}
        <header className="relative z-10 flex justify-center pt-8 mb-12">
          <img
            src="/lovable-uploads/ae79f8b9-bd73-4786-ad60-2fe1bd5c27af.png"
            alt="YourBrand Logo"
            className="h-12 w-auto"
          />
        </header>

        {/* Hero Section */}
        <div className="container mx-auto px-6 md:px-4 flex flex-col lg:flex-row items-center min-h-[80vh]">
          {/* Left Column - Content */}
          <div className="lg:w-1/2 lg:pr-12 mb-12 lg:mb-0 text-center lg:text-left">
            <h1
              className="text-3xl md:text-6xl font-neutronic mb-6 leading-tight animate-fade-in"
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
                  Get Your
                  <span className="bg-gradient-to-r from-[#DEFF00] to-[#B8CC00] bg-clip-text text-transparent block">
                    FREE DOWNLOADS
                  </span>
                </>
              )}
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-8 animate-fade-in">
              {isSubmitted 
                ? "Get instant access to your free resource below."
                : "Enter your name and email below and I'll fire the download link straight to your inbox."
              }
            </p>

            {/* Form or Download Box */}
            <div className="max-w-md mx-auto lg:mx-0 animate-fade-in">
              {isSubmitted ? (
                // Download Box
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:bg-gray-800/70 transition-all duration-300">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#DEFF00] to-[#B8CC00] rounded-lg mx-auto mb-4">
                    <Download className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-center">{leadMagnet.title}</h3>
                  <p className="text-gray-400 mb-4 text-sm text-center">{leadMagnet.description}</p>
                  <Button
                    onClick={handleDownload}
                    className="w-full bg-gradient-to-r from-[#DEFF00] to-[#B8CC00] hover:from-[#B8CC00] hover:to-[#9BAA00] text-black font-semibold"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download {leadMagnet.fileName}
                  </Button>
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
                      className="pl-12 py-6 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 text-lg backdrop-blur-sm focus:border-[#DEFF00] transition-colors"
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
              )}
            </div>

            <p className="text-sm text-gray-400 mt-4 animate-fade-in">
              {isSubmitted 
                ? "All files are ready for instant download. Enjoy your free resources!"
                : "No spam. Unsubscribe at any time. Your data is secure."
              }
            </p>
          </div>

          {/* Right Column - Hero Image */}
          <div className="lg:w-1/2 relative">
            <div className="relative mx-auto max-w-lg">
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

              {/* Floating element for visual interest - bottom left only */}
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <Download className="w-6 h-6 text-black" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900/50 border-t border-gray-700 py-6">
        <div className="container mx-auto px-6 md:px-4 text-center">
          <p className="text-gray-400">
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
