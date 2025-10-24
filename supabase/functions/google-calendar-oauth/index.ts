import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Service role client for bypassing RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Regular client for auth (when available)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { code, email, action } = await req.json();

    if (!email && action === 'connect') {
      throw new Error('Email is required');
    }

    if (action === 'connect') {
      // Exchange authorization code for tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: Deno.env.get('GOOGLE_CLIENT_ID') ?? '',
          client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET') ?? '',
          redirect_uri: `${req.headers.get('origin')}/dashboard/calendar`,
          grant_type: 'authorization_code',
        }),
      });

      if (!tokenResponse.ok) {
        const error = await tokenResponse.text();
        console.error('Token exchange failed:', error);
        throw new Error('Failed to exchange authorization code');
      }

      const tokens = await tokenResponse.json();
      
      // Calculate token expiration
      const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

      // Save tokens to database using service role (bypass RLS)
      const { error: dbError } = await supabaseAdmin
        .from('customer_calendar_integrations')
        .upsert({
          user_id: null, // No user_id for anonymous connections
          email: email,
          provider: 'google',
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          token_expires_at: expiresAt.toISOString(),
          scopes: tokens.scope.split(' '),
        }, {
          onConflict: 'email,provider'
        });

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to save integration');
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Calendar connected successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'refresh') {
      if (!email) {
        throw new Error('Email is required for refresh');
      }

      // Get current integration
      const { data: integration, error: fetchError } = await supabaseAdmin
        .from('customer_calendar_integrations')
        .select('*')
        .eq('email', email)
        .eq('provider', 'google')
        .single();

      if (fetchError || !integration) {
        throw new Error('Integration not found');
      }

      // Refresh access token
      const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          refresh_token: integration.refresh_token,
          client_id: Deno.env.get('GOOGLE_CLIENT_ID') ?? '',
          client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET') ?? '',
          grant_type: 'refresh_token',
        }),
      });

      if (!refreshResponse.ok) {
        throw new Error('Failed to refresh token');
      }

      const newTokens = await refreshResponse.json();
      const expiresAt = new Date(Date.now() + newTokens.expires_in * 1000);

      // Update tokens using service role
      const { error: updateError } = await supabaseAdmin
        .from('customer_calendar_integrations')
        .update({
          access_token: newTokens.access_token,
          token_expires_at: expiresAt.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('email', email)
        .eq('provider', 'google');

      if (updateError) {
        throw new Error('Failed to update tokens');
      }

      return new Response(
        JSON.stringify({ success: true, access_token: newTokens.access_token }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    throw new Error('Invalid action');

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
