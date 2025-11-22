import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const EMAIL_ASSETS = [
  // Products
  { local: '/email-assets/products/vibe-machine-banner.jpg', storage: 'email-assets/products/vibe-machine-banner.jpeg' },
  { local: '/email-assets/products/super-sub-banner.jpg', storage: 'email-assets/products/super-sub-banner.jpeg' },
  
  // Photos
  { local: '/lovable-uploads/616b1376-9a21-4f57-8bcd-a84464c1a260.png', storage: 'email-assets/photos/rob-studio-session-1.jpeg' },
  { local: '/lovable-uploads/c70a01f4-97bc-4fb1-90e7-5262f590a25b.png', storage: 'email-assets/photos/rob-studio-session-2.jpeg' },
  { local: '/lovable-uploads/6ad6593f-5d1f-44a1-a0a0-d2f742e57195.png', storage: 'email-assets/photos/rob-studio-session-3.jpeg' },
  { local: '/lovable-uploads/ae79f8b9-bd73-4786-ad60-2fe1bd5c27af.png', storage: 'email-assets/photos/rob-studio-closeup.jpeg' },
  { local: '/lovable-uploads/a4ac1d92-9ce0-4d0e-bb2a-bf824beaedaf.png', storage: 'email-assets/photos/rob-mixing-desk.jpeg' },
  { local: '/lovable-uploads/c8da1c3b-55d4-4566-a55a-77a3b6a95f42.png', storage: 'email-assets/photos/rob-at-computer.jpeg' },
  { local: '/lovable-uploads/cf455da6-85cc-431f-bc41-2a6f15715d71.png', storage: 'email-assets/photos/rob-portrait-casual.jpeg' },
  { local: '/lovable-uploads/083210a4-ef8a-4bc1-922c-52b89fbf8fe8.png', storage: 'email-assets/photos/rob-teaching-session.jpeg' },
  { local: '/lovable-uploads/3f8daf99-6f60-45d7-b57e-e340c42d6a8e.png', storage: 'email-assets/photos/rob-with-student.jpeg' },
  { local: '/lovable-uploads/c3977c47-ba35-48ce-ab95-c20b978cf4f8.png', storage: 'email-assets/photos/rob-presenting.jpeg' },
  { local: '/lovable-uploads/545ec22c-6d73-449b-b6aa-a59885df6c82.png', storage: 'email-assets/photos/rob-casual-portrait.jpeg' },
  { local: '/lovable-uploads/bc88d671-3cfe-46c6-bfb2-2c42e6820982.png', storage: 'email-assets/photos/rob-studio-workspace.jpeg' },
  
  // Branding - Signatures
  { local: '/email-assets/branding/signatures/rob-late-signature-white.png', storage: 'email-assets/branding/signatures/rob-late-signature-white.png' },
  { local: '/email-assets/branding/signatures/rob-late-signature-black.png', storage: 'email-assets/branding/signatures/rob-late-signature-black.png' },
  
  // Branding - Logos
  { local: '/email-assets/branding/logos/rla-logo-white.png', storage: 'email-assets/branding/logos/rla-logo-white.png' },
  { local: '/email-assets/branding/logos/rla-logo-black.png', storage: 'email-assets/branding/logos/rla-logo-black.png' },
  { local: '/email-assets/branding/logos/rla-logo-profile-yellow.jpg', storage: 'email-assets/branding/logos/rla-logo-profile-yellow.jpeg' },
  { local: '/email-assets/branding/logos/rla-logo-type-2.png', storage: 'email-assets/branding/logos/rla-logo-type-2.png' },
  
  // Social Proof
  { local: '/email-assets/social-proof/drew-cymatics-testimonial-2.jpg', storage: 'email-assets/social-proof/drew-cymatics-testimonial-2.jpeg' },
  { local: '/email-assets/social-proof/dm-testimonial-label-signing.jpg', storage: 'email-assets/social-proof/dm-testimonial-label-signing.jpeg' },
  { local: '/email-assets/social-proof/dm-testimonial-10k-streams.jpg', storage: 'email-assets/social-proof/dm-testimonial-10k-streams.jpeg' },
  { local: '/email-assets/social-proof/dm-testimonial-producer-blueprint.jpg', storage: 'email-assets/social-proof/dm-testimonial-producer-blueprint.jpeg' },
  { local: '/email-assets/social-proof/dm-testimonial-quality-jump.jpg', storage: 'email-assets/social-proof/dm-testimonial-quality-jump.jpeg' },
  { local: '/email-assets/social-proof/instagram-thread-sample-packs.jpg', storage: 'email-assets/social-proof/instagram-thread-sample-packs.jpeg' },
];

export default function UploadEmailAssets() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ total: number; completed: number; failed: number }>({
    total: 0,
    completed: 0,
    failed: 0,
  });
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const uploadAssets = async () => {
    setUploading(true);
    setProgress({ total: EMAIL_ASSETS.length, completed: 0, failed: 0 });
    setLogs([]);
    
    addLog(`Starting upload of ${EMAIL_ASSETS.length} assets...`);

    for (const asset of EMAIL_ASSETS) {
      try {
        addLog(`Fetching: ${asset.local}`);
        
        // Fetch the file from public directory
        const response = await fetch(asset.local);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        
        const blob = await response.blob();
        const file = new File([blob], asset.storage.split('/').pop() || 'file', { type: blob.type });
        
        addLog(`Uploading to: ${asset.storage}`);
        
        // Upload to Supabase Storage
        const { error } = await supabase.storage
          .from('siteassets')
          .upload(asset.storage, file, {
            upsert: true,
            contentType: blob.type,
          });

        if (error) {
          throw error;
        }

        addLog(`✓ Successfully uploaded: ${asset.storage}`);
        setProgress(prev => ({ ...prev, completed: prev.completed + 1 }));
        
      } catch (error) {
        console.error(`Error uploading ${asset.local}:`, error);
        addLog(`✗ Failed to upload: ${asset.local} - ${error}`);
        setProgress(prev => ({ ...prev, failed: prev.failed + 1 }));
      }
    }

    setUploading(false);
    
    if (progress.failed === 0) {
      toast.success('All assets uploaded successfully!');
      addLog('✓ Upload complete! All assets are now available.');
    } else {
      toast.warning(`Upload complete with ${progress.failed} failures`);
      addLog(`⚠ Upload complete. ${progress.completed} succeeded, ${progress.failed} failed.`);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Email Assets Uploader</h1>
          <p className="text-muted-foreground">
            Upload all email assets from public directory to Supabase Storage (siteassets bucket)
          </p>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Total Assets: {EMAIL_ASSETS.length}</p>
                {progress.total > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Completed: {progress.completed} | Failed: {progress.failed}
                  </p>
                )}
              </div>
              <Button onClick={uploadAssets} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Start Upload'}
              </Button>
            </div>

            {progress.total > 0 && (
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary rounded-full h-2 transition-all duration-300"
                  style={{
                    width: `${((progress.completed + progress.failed) / progress.total) * 100}%`,
                  }}
                />
              </div>
            )}
          </div>
        </Card>

        {logs.length > 0 && (
          <Card className="p-6">
            <h2 className="font-semibold mb-4">Upload Log</h2>
            <div className="bg-secondary/50 rounded-lg p-4 max-h-96 overflow-y-auto">
              <div className="font-mono text-xs space-y-1">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className={
                      log.includes('✓')
                        ? 'text-green-600'
                        : log.includes('✗')
                        ? 'text-red-600'
                        : 'text-foreground'
                    }
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
