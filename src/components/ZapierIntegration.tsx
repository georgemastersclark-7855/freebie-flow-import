
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Zap } from "lucide-react";
import { getKlaviyoWebhookUrl } from "@/config/marketing";


interface ZapierData {
  leadId: string;
  name: string;
  email: string;
  downloadedFile: string;
  utmParams: Record<string, string>;
  timestamp: string;
}

interface ZapierIntegrationProps {
  onSendToKlaviyo: (data: ZapierData) => Promise<void>;
}

export const ZapierIntegration = ({ onSendToKlaviyo }: ZapierIntegrationProps) => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isConfigured, setIsConfigured] = useState(false);
  const { toast } = useToast();

  const handleConfigureWebhook = () => {
    if (!webhookUrl) {
      toast({
        title: "Error",
        description: "Please enter your Zapier webhook URL",
        variant: "destructive",
      });
      return;
    }

    setIsConfigured(true);
    localStorage.setItem('klaviyo_zapier_webhook', webhookUrl);
    
    toast({
      title: "Success",
      description: "Zapier webhook configured for Klaviyo integration",
    });
  };

  const sendToZapier = async (data: ZapierData) => {
    if (!webhookUrl) {
      console.warn('No webhook URL configured');
      return;
    }

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          ...data,
          event_type: "lead_magnet_download",
          source: "rob_late_website"
        }),
      });

      console.log('Data sent to Zapier/Klaviyo:', data);
      
      toast({
        title: "Data Sent",
        description: "Lead information sent to Klaviyo via Zapier",
      });
    } catch (error) {
      console.error('Error sending to Zapier:', error);
      toast({
        title: "Integration Error",
        description: "Failed to send data to Klaviyo. Please check your webhook configuration.",
        variant: "destructive",
      });
    }
  };

  // Load saved or default webhook URL on component mount
  useEffect(() => {
    const savedWebhook = localStorage.getItem('klaviyo_zapier_webhook');
    const defaultWebhook = getKlaviyoWebhookUrl();
    const effective = savedWebhook || defaultWebhook;
    if (effective) {
      setWebhookUrl(effective);
      setIsConfigured(true);
    }
  }, []);

  return (
    <div className="space-y-4">
      {!isConfigured ? (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-[#DEFF00]" />
            <h3 className="text-lg font-semibold">Klaviyo Integration Setup</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="webhook">Zapier Webhook URL</Label>
              <Input
                id="webhook"
                type="url"
                placeholder="https://hooks.zapier.com/hooks/catch/..."
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="bg-gray-800/50 border-gray-600 text-white"
              />
            </div>
            
            <Button
              onClick={handleConfigureWebhook}
              className="bg-gradient-to-r from-[#DEFF00] to-[#B8CC00] text-black"
            >
              Configure Klaviyo Integration
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-400">
          ✅ Klaviyo integration configured via Zapier
        </div>
      )}
    </div>
  );
};
