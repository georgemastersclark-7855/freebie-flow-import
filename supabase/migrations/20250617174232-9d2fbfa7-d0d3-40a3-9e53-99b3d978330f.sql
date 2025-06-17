
-- Create a table to store lead information with UTM tracking
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  referrer TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table to track download events linked to leads
CREATE TABLE public.lead_downloads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  lead_magnet_id UUID REFERENCES public.lead_magnets(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT
);

-- Enable RLS on leads table
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Enable RLS on lead_downloads table  
ALTER TABLE public.lead_downloads ENABLE ROW LEVEL SECURITY;

-- Allow public access to insert leads (for form submissions)
CREATE POLICY "Anyone can create leads" ON public.leads
FOR INSERT WITH CHECK (true);

-- Allow public access to view leads (for download tracking)
CREATE POLICY "Anyone can view leads" ON public.leads
FOR SELECT USING (true);

-- Allow public access to insert download records
CREATE POLICY "Anyone can create download records" ON public.lead_downloads
FOR INSERT WITH CHECK (true);

-- Allow public access to view download records
CREATE POLICY "Anyone can view download records" ON public.lead_downloads
FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX idx_leads_email ON public.leads(email);
CREATE INDEX idx_leads_created_at ON public.leads(created_at);
CREATE INDEX idx_lead_downloads_lead_id ON public.lead_downloads(lead_id);
CREATE INDEX idx_lead_downloads_downloaded_at ON public.lead_downloads(downloaded_at);
