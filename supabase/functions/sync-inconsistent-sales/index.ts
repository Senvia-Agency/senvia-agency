import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    console.log('🔄 Iniciando sincronização de vendas inconsistentes...')

    // 1. Atualizar Diana Solonari (VD2025-0022)
    const { error: diaraError } = await supabaseClient
      .from('sales')
      .update({
        paid_amount: 60,
        payment_status: 'paid',
        updated_at: new Date().toISOString()
      })
      .eq('id', 'b011dce6-4176-44b4-b9db-5877be6d48d1')

    if (diaraError) {
      console.error('❌ Erro ao atualizar Diana:', diaraError)
      throw diaraError
    }
    console.log('✅ Diana Solonari atualizada')

    // 2. Atualizar João Basilio - Gestão de Tráfego (VD2025-0017)
    const { error: joaoGestaoError } = await supabaseClient
      .from('sales')
      .update({
        paid_amount: 50,
        payment_status: 'paid',
        updated_at: new Date().toISOString()
      })
      .eq('id', '2d5876e9-bc3d-477f-9eec-10619e109cde')

    if (joaoGestaoError) {
      console.error('❌ Erro ao atualizar João (Gestão):', joaoGestaoError)
      throw joaoGestaoError
    }
    console.log('✅ João Basilio (Gestão) atualizado')

    // 3. Criar receivable faltante para João Basilio - Servidor IA
    const { error: receivableError } = await supabaseClient
      .from('recurring_receivables')
      .insert({
        recurring_service_id: 'ca8b5879-98d7-4103-b511-c71ef320ffdf',
        customer_id: 'b3c47d21-e035-4718-9010-19456b6a7b3e',
        amount: 20,
        paid_amount: 20,
        due_date: '2025-11-01',
        payment_status: 'paid',
        paid_at: new Date().toISOString()
      })

    if (receivableError) {
      console.error('❌ Erro ao criar receivable João (Servidor):', receivableError)
      throw receivableError
    }
    console.log('✅ Receivable criado para João (Servidor)')

    // 4. Atualizar venda João Basilio - Servidor IA (VD2025-0026)
    const { error: joaoServidorError } = await supabaseClient
      .from('sales')
      .update({
        payment_status: 'paid',
        updated_at: new Date().toISOString()
      })
      .eq('id', '0e8bb934-f78c-4928-a8cc-dfb359a61f1c')

    if (joaoServidorError) {
      console.error('❌ Erro ao atualizar João (Servidor):', joaoServidorError)
      throw joaoServidorError
    }
    console.log('✅ João Basilio (Servidor) atualizado')

    // 5. Atualizar next_billing_date
    const { error: billingError } = await supabaseClient
      .from('recurring_services')
      .update({
        next_billing_date: '2025-12-01'
      })
      .eq('id', 'ca8b5879-98d7-4103-b511-c71ef320ffdf')

    if (billingError) {
      console.error('❌ Erro ao atualizar next_billing_date:', billingError)
      throw billingError
    }
    console.log('✅ Next billing date atualizado')

    console.log('🎉 Sincronização concluída com sucesso!')

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Vendas inconsistentes sincronizadas com sucesso',
        details: {
          diana_updated: true,
          joao_gestao_updated: true,
          joao_servidor_receivable_created: true,
          joao_servidor_updated: true,
          billing_date_updated: true
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('❌ Erro na sincronização:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
