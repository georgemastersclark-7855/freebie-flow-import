
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";

const Success = () => {
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

  const handleDownload = (magnet: typeof leadMagnets[0]) => {
    // In a real app, this would trigger actual file downloads
    toast({
      title: "Download Started",
      description: `Downloading ${magnet.fileName}`,
    });
    console.log("Downloading:", magnet.fileName);
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
              Your Downloads
              <span className="bg-gradient-to-r from-[#DEFF00] to-[#B8CC00] bg-clip-text text-transparent block">
                ARE READY
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-8 animate-fade-in">
              Get instant access to all your free resources below.
            </p>

            {/* Downloads Grid */}
            <div className="space-y-4 max-w-md mx-auto lg:mx-0 animate-fade-in">
              {leadMagnets.map((magnet) => (
                <div
                  key={magnet.id}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 hover:bg-gray-800/70 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <h3 className="text-lg font-semibold mb-1">{magnet.title}</h3>
                      <p className="text-gray-400 text-sm">{magnet.description}</p>
                    </div>
                    <Button
                      onClick={() => handleDownload(magnet)}
                      className="ml-4 bg-gradient-to-r from-[#DEFF00] to-[#B8CC00] hover:from-[#B8CC00] hover:to-[#9BAA00] text-black font-semibold"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-400 mt-4 animate-fade-in">
              All files are ready for instant download. Enjoy your free resources!
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
            Powered by{" "}
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

export default Success;
