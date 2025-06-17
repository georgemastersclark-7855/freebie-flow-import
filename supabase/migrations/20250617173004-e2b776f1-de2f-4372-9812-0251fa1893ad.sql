
-- Create a storage bucket for lead magnet files
INSERT INTO storage.buckets (id, name, public)
VALUES ('lead-magnets', 'lead-magnets', true);

-- Create RLS policies for the lead-magnets bucket
-- Allow public access to view files (since these are lead magnets meant to be downloaded)
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'lead-magnets');

-- Allow authenticated users to upload files (for admin purposes)
CREATE POLICY "Authenticated users can upload lead magnets" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'lead-magnets' AND auth.role() = 'authenticated');

-- Allow authenticated users to update files
CREATE POLICY "Authenticated users can update lead magnets" ON storage.objects
FOR UPDATE USING (bucket_id = 'lead-magnets' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete lead magnets" ON storage.objects
FOR DELETE USING (bucket_id = 'lead-magnets' AND auth.role() = 'authenticated');

-- Create a table to store lead magnet metadata
CREATE TABLE public.lead_magnets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  download_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on lead_magnets table
ALTER TABLE public.lead_magnets ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active lead magnets
CREATE POLICY "Public can view active lead magnets" ON public.lead_magnets
FOR SELECT USING (is_active = true);

-- Allow authenticated users to manage lead magnets
CREATE POLICY "Authenticated users can manage lead magnets" ON public.lead_magnets
FOR ALL USING (auth.role() = 'authenticated');
