
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SYNC-STRIPE-PAYMENTS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Iniciando sincronização de pagamentos do Stripe");

    // Verificar se é admin
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: userData } = await supabaseClient.auth.getUser(token);
      
      if (userData.user) {
        const { data: profile } = await supabaseClient
          .from('profiles')
          .select('role')
          .eq('user_id', userData.user.id)
          .single();
        
        if (profile?.role !== 'admin') {
          throw new Error("Acesso negado - apenas administradores");
        }
      }
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    logStep("Buscando sessões de checkout paid no Stripe");

    // Buscar sessões de checkout concluídas dos últimos 30 dias
    const thirtyDaysAgo = Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000);
    
    const sessions = await stripe.checkout.sessions.list({
      status: 'complete',
      created: { gte: thirtyDaysAgo },
      limit: 100
    });

    logStep(`Encontradas ${sessions.data.length} sessões concluídas`);

    let syncedCount = 0;
    let updatedLeads = 0;
    let createdCustomers = 0;

    for (const session of sessions.data) {
      try {
        if (!session.customer_email) continue;

        logStep(`Processando sessão ${session.id} para ${session.customer_email}`);

        // Verificar se já existe na tabela payments
        const { data: existingPayment } = await supabaseClient
          .from('payments')
          .select('id')
          .eq('stripe_session_id', session.id)
          .single();

        if (!existingPayment) {
          // Criar registro na tabela payments
          const { error: paymentError } = await supabaseClient
            .from('payments')
            .insert({
              email: session.customer_email,
              amount: session.amount_total || 499,
              currency: session.currency || 'eur',
              status: 'paid',
              stripe_session_id: session.id,
              stripe_customer_id: session.customer,
              stripe_payment_id: session.payment_intent
            });

          if (paymentError) {
            logStep(`Erro ao criar payment para ${session.customer_email}:`, paymentError);
          } else {
            syncedCount++;
            logStep(`Payment criado para ${session.customer_email}`);
          }
        }

        // Verificar se existe lead correspondente e atualizar
        const { data: lead } = await supabaseClient
          .from('unified_leads')
          .select('id, payment_status, converted')
          .eq('email', session.customer_email)
          .eq('stripe_session_id', session.id)
          .single();

        if (lead && lead.payment_status !== 'paid') {
          const { error: leadError } = await supabaseClient
            .from('unified_leads')
            .update({
              payment_status: 'paid',
              lead_status: 'converted',
              converted: true,
              conversion_date: new Date().toISOString(),
              stripe_customer_id: session.customer,
              stripe_payment_id: session.payment_intent
            })
            .eq('id', lead.id);

          if (leadError) {
            logStep(`Erro ao atualizar lead ${lead.id}:`, leadError);
          } else {
            updatedLeads++;
            logStep(`Lead ${lead.id} atualizado para paid`);
          }
        }

        // Verificar se precisa criar cliente
        const { data: existingCustomer } = await supabaseClient
          .from('customers')
          .select('id')
          .eq('email', session.customer_email)
          .single();

        if (!existingCustomer && lead) {
          // Criar cliente baseado no lead
          const { error: customerError } = await supabaseClient
            .from('customers')
            .insert({
              full_name: lead.full_name || session.customer_email,
              email: session.customer_email,
              phone: lead.phone,
              company_name: lead.company_name,
              website: lead.website,
              original_lead_id: lead.id,
              acquisition_source: lead.source_page,
              stripe_customer_id: session.customer,
              total_spent: (session.amount_total || 499) / 100,
              last_payment_date: new Date().toISOString(),
              acquisition_date: lead.created_at
            });

          if (customerError) {
            logStep(`Erro ao criar customer para ${session.customer_email}:`, customerError);
          } else {
            createdCustomers++;
            logStep(`Customer criado para ${session.customer_email}`);
          }
        }

      } catch (sessionError) {
        logStep(`Erro ao processar sessão ${session.id}:`, sessionError);
      }
    }

    logStep("Sincronização concluída", {
      syncedPayments: syncedCount,
      updatedLeads,
      createdCustomers
    });

    return new Response(JSON.stringify({
      success: true,
      synced_payments: syncedCount,
      updated_leads: updatedLeads,
      created_customers: createdCustomers,
      total_sessions_processed: sessions.data.length
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERRO na sincronização", { message: errorMessage });
    
    return new Response(JSON.stringify({
      error: errorMessage,
      success: false
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
