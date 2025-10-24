-- Add email column to customer_calendar_integrations
ALTER TABLE customer_calendar_integrations 
ADD COLUMN IF NOT EXISTS email TEXT;

-- Make user_id nullable to allow connections without login
ALTER TABLE customer_calendar_integrations 
ALTER COLUMN user_id DROP NOT NULL;

-- Add constraint: must have email OR user_id
ALTER TABLE customer_calendar_integrations
ADD CONSTRAINT must_have_email_or_user_id 
CHECK (email IS NOT NULL OR user_id IS NOT NULL);

-- Add unique index for email+provider combinations
CREATE UNIQUE INDEX IF NOT EXISTS idx_calendar_email_provider 
ON customer_calendar_integrations(email, provider) 
WHERE email IS NOT NULL;

-- Update RLS policies to allow service role operations
DROP POLICY IF EXISTS "Users can delete their own calendar integrations" ON customer_calendar_integrations;
DROP POLICY IF EXISTS "Users can insert their own calendar integrations" ON customer_calendar_integrations;
DROP POLICY IF EXISTS "Users can update their own calendar integrations" ON customer_calendar_integrations;
DROP POLICY IF EXISTS "Users can view their own calendar integrations" ON customer_calendar_integrations;

-- New policies that work with email OR user_id
CREATE POLICY "Users can view their own calendar integrations" 
ON customer_calendar_integrations 
FOR SELECT 
USING (
  (auth.uid() = user_id) OR 
  (email IS NOT NULL AND email = auth.email())
);

CREATE POLICY "Users can insert their own calendar integrations" 
ON customer_calendar_integrations 
FOR INSERT 
WITH CHECK (
  (auth.uid() = user_id) OR 
  (email IS NOT NULL)
);

CREATE POLICY "Users can update their own calendar integrations" 
ON customer_calendar_integrations 
FOR UPDATE 
USING (
  (auth.uid() = user_id) OR 
  (email IS NOT NULL AND email = auth.email())
);

CREATE POLICY "Users can delete their own calendar integrations" 
ON customer_calendar_integrations 
FOR DELETE 
USING (
  (auth.uid() = user_id) OR 
  (email IS NOT NULL AND email = auth.email())
);