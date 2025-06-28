
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://qxywcjwdlphldutxdyxg.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4eXdjandkbHBobGR1dHhkeXhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3MDcyMTYsImV4cCI6MjA1MDI4MzIxNn0.IHYSKdvr82jEjKhKkp4vkJwqCwW_fvYUNfHXWvQP9rU"

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
