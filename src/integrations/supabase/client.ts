
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://qxywcjwdlphldutxdyxg.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4eXdjandkbHBobGR1dHhkeXhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3MDcyMTYsImV4cCI6MjA1MDI4MzIxNn0.IHYSKdvr82jEjKhKkp4vkJwqCwW_fvYUNfHXWvQP9rU"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: window.localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})
