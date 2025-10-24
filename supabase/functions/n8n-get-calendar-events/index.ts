import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-n8n-api-key',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validar API key do n8n
    const n8nApiKey = req.headers.get('x-n8n-api-key');
    const expectedApiKey = Deno.env.get('N8N_API_KEY');

    if (!n8nApiKey || n8nApiKey !== expectedApiKey) {
      console.error('Unauthorized: Invalid or missing API key');
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Invalid API key' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Criar cliente Supabase com service role
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Parse do body
    const { user_id, email } = await req.json();

    if (!user_id && !email) {
      throw new Error('user_id or email is required');
    }

    console.log(`Fetching calendar for user_id: ${user_id}, email: ${email}`);

    // Buscar integração do calendário
    let query = supabaseClient
      .from('customer_calendar_integrations')
      .select('*')
      .eq('provider', 'google')
      .eq('sync_enabled', true);

    if (user_id) {
      query = query.eq('user_id', user_id);
    } else if (email) {
      // Buscar diretamente pelo email na tabela
      query = query.eq('email', email);
    }

    const { data: integration, error: fetchError } = await query.single();

    if (fetchError || !integration) {
      console.error('Calendar integration not found:', fetchError);
      throw new Error('Calendar not connected for this user');
    }

    console.log(`Found integration for user_id: ${integration.user_id}, email: ${integration.email}`);

    // Check if token needs refresh
    const tokenExpiresAt = new Date(integration.token_expires_at);
    const now = new Date();
    let accessToken = integration.access_token;

    if (tokenExpiresAt <= now) {
      console.log('Token expired, refreshing...');
      
      // Refresh token
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
        const errorText = await refreshResponse.text();
        console.error('Failed to refresh token:', errorText);
        throw new Error('Failed to refresh token');
      }

      const newTokens = await refreshResponse.json();
      accessToken = newTokens.access_token;
      const expiresAt = new Date(Date.now() + newTokens.expires_in * 1000);

      // Update tokens in database (works with both user_id and email)
      const updateQuery = supabaseClient
        .from('customer_calendar_integrations')
        .update({
          access_token: accessToken,
          token_expires_at: expiresAt.toISOString(),
        })
        .eq('provider', 'google');

      if (integration.user_id) {
        updateQuery.eq('user_id', integration.user_id);
      } else if (integration.email) {
        updateQuery.eq('email', integration.email);
      }

      await updateQuery;

      console.log('Token refreshed successfully');
    }

    // Fetch calendar events from Google
    const timeMin = new Date().toISOString();
    const timeMax = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days

    console.log(`Fetching events from Google Calendar API...`);

    const calendarResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
      `timeMin=${encodeURIComponent(timeMin)}&` +
      `timeMax=${encodeURIComponent(timeMax)}&` +
      `singleEvents=true&` +
      `orderBy=startTime&` +
      `maxResults=100`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!calendarResponse.ok) {
      const error = await calendarResponse.text();
      console.error('Calendar API error:', error);
      throw new Error('Failed to fetch calendar events');
    }

    const calendarData = await calendarResponse.json();

    // Update last sync time (works with both user_id and email)
    const syncUpdateQuery = supabaseClient
      .from('customer_calendar_integrations')
      .update({
        last_synced_at: new Date().toISOString(),
      })
      .eq('provider', 'google');

    if (integration.user_id) {
      syncUpdateQuery.eq('user_id', integration.user_id);
    } else if (integration.email) {
      syncUpdateQuery.eq('email', integration.email);
    }

    await syncUpdateQuery;

    // Transform events to our format
    const events = calendarData.items?.map((event: any) => ({
      id: event.id,
      title: event.summary || 'Sem título',
      description: event.description || '',
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
      location: event.location || '',
      attendees: event.attendees?.map((a: any) => a.email) || [],
      status: event.status,
      link: event.htmlLink,
    })) || [];

    console.log(`Successfully fetched ${events.length} events`);

    // Get user email (from integration or profiles)
    let userEmail = integration.email || email;
    
    if (!userEmail && integration.user_id) {
      const { data: userProfile } = await supabaseClient
        .from('profiles')
        .select('email')
        .eq('user_id', integration.user_id)
        .single();
      
      userEmail = userProfile?.email;
    }

    return new Response(
      JSON.stringify({
        success: true,
        user_id: integration.user_id,
        email: userEmail,
        events,
        count: events.length,
        synced_at: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

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
