import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { type, record } = await req.json()
    console.log('Webhook received:', { type, leadId: record?.id })

    // Apenas processa leads da promoção do agente WhatsApp
    if (record.source_page !== 'promo_agente_whatsapp') {
      console.log('Skipping - not promo lead')
      return new Response(JSON.stringify({ message: 'Skipped - not promo lead' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      })
    }

    // Calcular score de qualificação
    let qualificationScore = 0
    
    // Pontuação por segmento relevante
    const relevantSegments = ['saude-bem-estar', 'beleza-estetica', 'servicos-profissionais']
    if (relevantSegments.includes(record.segment)) {
      qualificationScore += 30
    }
    
    // Pontuação por volume de clientes
    if (record.monthly_clients >= 50) {
      qualificationScore += 40
    } else if (record.monthly_clients >= 10) {
      qualificationScore += 20
    }
    
    // Pontuação por WhatsApp válido
    if (record.whatsapp && record.whatsapp.length >= 9) {
      qualificationScore += 20
    }
    
    // Pontuação por empresa (não é pessoa física)
    if (record.company_name) {
      qualificationScore += 10
    }

    // Atualizar score no Supabase
    const { error: updateError } = await supabaseClient
      .from('leads_ia')
      .update({ 
        qualification_score: qualificationScore,
        agent_conversation_status: qualificationScore >= 50 ? 'pending' : 'low_priority'
      })
      .eq('id', record.id)

    if (updateError) {
      console.error('Error updating lead:', updateError)
      throw updateError
    }

    // Se qualificado (score >= 50), envia para n8n
    if (qualificationScore >= 50) {
      const n8nWebhookUrl = Deno.env.get('N8N_WEBHOOK_URL')
      
      if (n8nWebhookUrl) {
        console.log('Sending qualified lead to n8n...')
        
        const n8nPayload = {
          leadId: record.id,
          fullName: record.full_name,
          whatsapp: record.whatsapp,
          email: record.email,
          companyName: record.company_name,
          segment: record.segment,
          monthlyClients: record.monthly_clients,
          qualificationScore: qualificationScore,
          sourcePage: record.source_page,
          createdAt: record.created_at
        }

        const n8nResponse = await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(n8nPayload)
        })

        if (!n8nResponse.ok) {
          console.error('n8n webhook failed:', await n8nResponse.text())
        } else {
          console.log('Lead sent to n8n successfully')
        }
      } else {
        console.log('N8N_WEBHOOK_URL not configured')
      }
    } else {
      console.log(`Lead score too low (${qualificationScore}/100) - not sending to n8n`)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        qualificationScore,
        sentToN8n: qualificationScore >= 50
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in webhook:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
