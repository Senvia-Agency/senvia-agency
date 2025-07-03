
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Iniciando geração automática de contas recorrentes...')
    
    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Call the database function to generate recurring receivables
    const { data: generatedCount, error } = await supabase
      .rpc('generate_recurring_receivables')

    if (error) {
      console.error('Erro ao gerar contas recorrentes:', error)
      throw error
    }

    console.log(`${generatedCount} contas recorrentes geradas com sucesso`)

    // Get current stats to include in response
    const { data: stats, error: statsError } = await supabase
      .rpc('get_recurring_stats')

    if (statsError) {
      console.error('Erro ao obter estatísticas:', statsError)
    }

    const response = {
      success: true,
      generated_count: generatedCount,
      timestamp: new Date().toISOString(),
      stats: stats?.[0] || null
    }

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Erro na função de geração automática:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
