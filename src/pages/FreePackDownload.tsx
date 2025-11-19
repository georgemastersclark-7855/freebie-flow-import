import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import robStudio from "@/assets/rob-studio.png";

const FreePackDownload = () => {
  const handleDownload = () => {
    window.open("https://drive.google.com/uc?export=download&id=18XjzF-HLTpI72HltTmYlDnigveuSMkR9", "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Free Sample Pack
          </h1>
          <p className="text-xl text-muted-foreground">
            Your exclusive download is ready
          </p>
        </div>

        <div className="flex justify-center">
          <img
            src={robStudio}
            alt="Rob Late in studio"
            className="w-48 h-48 rounded-full object-cover border-4 border-primary shadow-lg"
          />
        </div>

        <div className="space-y-4">
          <p className="text-lg text-foreground">
            Thanks for being part of the community! Click below to download your free sample pack.
          </p>
          
          <Button 
            onClick={handleDownload}
            size="lg"
            className="gap-2 text-lg px-8 py-6"
          >
            <Download className="w-5 h-5" />
            Download Sample Pack
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Having trouble downloading? Contact support
        </p>
      </div>
    </div>
  );
};

export default FreePackDownload;
