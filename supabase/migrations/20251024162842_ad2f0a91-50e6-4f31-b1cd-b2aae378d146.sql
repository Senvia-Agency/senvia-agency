-- Create customer_calendar_integrations table for OAuth tokens
CREATE TABLE IF NOT EXISTS public.customer_calendar_integrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  provider TEXT DEFAULT 'google' NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_expires_at TIMESTAMPTZ NOT NULL,
  scopes TEXT[] NOT NULL,
  calendar_id TEXT,
  sync_enabled BOOLEAN DEFAULT true,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, provider)
);

-- Enable RLS
ALTER TABLE public.customer_calendar_integrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own calendar integrations"
  ON public.customer_calendar_integrations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own calendar integrations"
  ON public.customer_calendar_integrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calendar integrations"
  ON public.customer_calendar_integrations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calendar integrations"
  ON public.customer_calendar_integrations FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_calendar_integrations_user_id 
  ON public.customer_calendar_integrations(user_id);
  
CREATE INDEX IF NOT EXISTS idx_calendar_integrations_sync 
  ON public.customer_calendar_integrations(sync_enabled, last_synced_at);

-- Trigger for updated_at
CREATE TRIGGER update_customer_calendar_integrations_updated_at
  BEFORE UPDATE ON public.customer_calendar_integrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();