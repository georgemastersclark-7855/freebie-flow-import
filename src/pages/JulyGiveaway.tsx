import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useUTMTracking } from "@/hooks/useUTMTracking";
import { toast } from "@/hooks/use-toast";

interface LeadMagnet {
  id: string;
  title: string;
  description: string;
  file_name: string;
  file_path: string;
  download_count: number;
}

const JulyGiveaway = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [leadMagnets, setLeadMagnets] = useState<LeadMagnet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const utmParams = useUTMTracking();

  useEffect(() => {
    // Load saved Zapier webhook URL on component mount
    const savedWebhookUrl = localStorage.getItem('zapier_webhook_url');
    if (savedWebhookUrl) {
      console.log('Loaded saved Zapier webhook URL:', savedWebhookUrl);
    }
    
    fetchLeadMagnets();
  }, []);

  const fetchLeadMagnets = async () => {
    try {
      console.log('Fetching lead magnets...');
      const { data, error } = await supabase
        .from('lead_magnets')
        .select('*')
        .eq('is_active', true)
        .eq('title', 'Rob Late IG Stems Giveaway - July 2025')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching lead magnets:', error);
        toast({
          title: "Error",
          description: "Failed to load giveaway content. Please refresh the page.",
          variant: "destructive",
        });
        return;
      }

      console.log('Lead magnets fetched:', data);
      setLeadMagnets(data || []);
    } catch (error) {
      console.error('Unexpected error fetching lead magnets:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !name) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    console.log('Submitting form for July Giveaway with:', { name, email, utmParams });

    try {
      // Insert lead into Supabase
      const leadData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        utm_source: utmParams.utm_source || null,
        utm_medium: utmParams.utm_medium || null,
        utm_campaign: utmParams.utm_campaign || null,
        utm_term: utmParams.utm_term || null,
        utm_content: utmParams.utm_content || null,
        referrer: utmParams.referrer || null,
        user_agent: navigator.userAgent,
        ip_address: null, // Will be populated by Supabase if needed
      };

      console.log('Inserting lead data:', leadData);
      
      const { data: insertedLead, error: leadError } = await supabase
        .from('leads')
        .insert(leadData)
        .select()
        .single();

      if (leadError) {
        console.error('Error inserting lead:', leadError);
        toast({
          title: "Error",
          description: "Failed to submit form. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log('Lead inserted successfully:', insertedLead);

      // Send to Zapier/Klaviyo
      await sendToZapier({
        leadId: insertedLead.id,
        name: leadData.name,
        email: leadData.email,
        utmParams,
        timestamp: new Date().toISOString(),
        campaign: 'July Giveaway 2025'
      });

      setIsSubmitted(true);
      toast({
        title: "Success!",
        description: "Welcome to the July Giveaway! Your download links are now available below.",
      });

    } catch (error) {
      console.error('Unexpected error during form submission:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendToZapier = async (leadData: any) => {
    const webhookUrl = localStorage.getItem('zapier_webhook_url');
    
    if (!webhookUrl) {
      console.log('No Zapier webhook URL configured, skipping Zapier integration');
      return;
    }

    try {
      console.log('Sending data to Zapier:', leadData);
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify(leadData),
      });

      console.log('Data sent to Zapier successfully');
      
    } catch (error) {
      console.error('Error sending to Zapier:', error);
      // Don't show error to user as this is optional functionality
    }
  };

  const handleDownload = async (leadMagnet: LeadMagnet) => {
    console.log('Starting download for July Giveaway:', leadMagnet);

    try {
      // For Dropbox links, open directly in new tab to trigger download
      window.open(leadMagnet.file_path, '_blank');
      
      console.log('Download initiated for:', leadMagnet.file_name);

      // Track the download
      const downloadData = {
        lead_magnet_id: leadMagnet.id,
        utm_source: utmParams.utm_source || null,
        utm_medium: utmParams.utm_medium || null,
        utm_campaign: utmParams.utm_campaign || null,
        utm_term: utmParams.utm_term || null,
        utm_content: utmParams.utm_content || null,
      };

      console.log('Tracking download:', downloadData);
      
      const { error: downloadError } = await supabase
        .from('lead_downloads')
        .insert(downloadData);

      if (downloadError) {
        console.error('Error tracking download:', downloadError);
      } else {
        console.log('Download tracked successfully');
      }

      // Update download count
      const { error: updateError } = await supabase
        .from('lead_magnets')
        .update({ 
          download_count: leadMagnet.download_count + 1 
        })
        .eq('id', leadMagnet.id);

      if (updateError) {
        console.error('Error updating download count:', updateError);
      } else {
        console.log('Download count updated successfully');
        // Update local state
        setLeadMagnets(prev => 
          prev.map(lm => 
            lm.id === leadMagnet.id 
              ? { ...lm, download_count: lm.download_count + 1 }
              : lm
          )
        );
      }

      toast({
        title: "Download Started!",
        description: "Your July Giveaway download should start automatically.",
      });

    } catch (error) {
      console.error('Error during download:', error);
      toast({
        title: "Download Error",
        description: "Failed to start download. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading July Giveaway...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/c8da1c3b-55d4-4566-a55a-77a3b6a95f42.png" 
                alt="Rob Late" 
                className="h-12 w-12 rounded-full object-cover border-2 border-primary/20"
              />
              <div>
                <h1 className="text-xl font-bold text-foreground">Rob Late</h1>
                <p className="text-sm text-muted-foreground">July 2025 IG Stems Giveaway</p>
              </div>
            </div>
            <Badge variant="secondary" className="hidden sm:flex">
              Exclusive Giveaway
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full border bg-background/50 backdrop-blur-sm mb-6">
              <span className="text-sm font-medium text-primary">🎵 July 2025 Exclusive</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Rob Late IG Stems
              <br />
              <span className="text-3xl md:text-5xl">July Giveaway</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Get exclusive Instagram-ready stems from Rob Late's latest production vault. Perfect for content creators and music producers.
            </p>

            <div className="relative max-w-md mx-auto mb-8">
              <img 
                src="/lovable-uploads/ae79f8b9-bd73-4786-ad60-2fe1bd5c27af.png" 
                alt="July Giveaway Preview" 
                className="w-full rounded-2xl shadow-2xl border border-border/20"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>

          {/* Form or Download Section */}
          {!isSubmitted ? (
            <Card className="max-w-md mx-auto bg-background/80 backdrop-blur-sm border-border/50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-center mb-6 text-foreground">
                  Get Your Free July Stems
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="bg-background/50"
                    />
                  </div>
                  
                  <div>
                    <Input
                      type="email"
                      placeholder="Your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-background/50"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Getting Your Stems...' : 'Get Free July Stems'}
                  </Button>
                </form>
                
                <p className="text-xs text-center text-muted-foreground mt-4">
                  Free download • No spam • Instant access
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">✨ Welcome to the July Giveaway!</span>
                </div>
                <h2 className="text-3xl font-bold mb-4 text-foreground">Your Downloads Are Ready</h2>
                <p className="text-muted-foreground">
                  Click below to download your exclusive July 2025 IG stems pack
                </p>
              </div>

              <div className="grid gap-6">
                {leadMagnets.map((leadMagnet) => (
                  <Card key={leadMagnet.id} className="bg-background/80 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2 text-foreground">
                            {leadMagnet.title}
                          </h3>
                          <p className="text-muted-foreground mb-3">
                            {leadMagnet.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>📁 {leadMagnet.file_name}</span>
                            <span>⬇️ {leadMagnet.download_count} downloads</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => handleDownload(leadMagnet)}
                        className="w-full"
                        size="lg"
                      >
                        Download July Stems Pack
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {leadMagnets.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No downloads available at the moment.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 Rob Late • July IG Stems Giveaway
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default JulyGiveaway;