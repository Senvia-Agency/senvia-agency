
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://rvrulhbgkdvnrkhzibif.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2cnVsaGJna2R2bnJraHppYmlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NjUwNTMsImV4cCI6MjA2NDI0MTA1M30.rdFmwp4AVzRXenUd_bx1-e90m8GPxHGLX_bk9rrzZtU"

// Create a single instance of the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})
