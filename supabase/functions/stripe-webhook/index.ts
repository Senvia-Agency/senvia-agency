
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const logStep = (step: string, details?: any) => {
  const timestamp = new Date().toISOString();
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[${timestamp}] [STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("=== WEBHOOK RECEBIDO ===");
    logStep("Method", req.method);
    logStep("Headers", Object.fromEntries(req.headers.entries()));

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    
    logStep("Body length", body.length);
    logStep("Signature present", !!signature);
    
    if (!signature) {
      logStep("ERRO: Stripe signature não encontrada");
      return new Response("Stripe signature não encontrada", { 
        status: 400,
        headers: corsHeaders 
      });
    }

    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      logStep("ERRO: STRIPE_WEBHOOK_SECRET não configurado");
      return new Response("STRIPE_WEBHOOK_SECRET não configurado", { 
        status: 500,
        headers: corsHeaders 
      });
    }

    logStep("Webhook secret configurado", "✓");

    // Verificar assinatura do webhook
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      logStep("Webhook verificado com sucesso", { 
        type: event.type, 
        id: event.id,
        created: event.created 
      });
    } catch (err) {
      logStep("ERRO na verificação do webhook", { 
        error: err.message,
        signature: signature.substring(0, 20) + '...',
        secretPrefix: webhookSecret.substring(0, 10) + '...'
      });
      return new Response(`Webhook signature verification failed: ${err.message}`, { 
        status: 400,
        headers: corsHeaders 
      });
    }

    // Processar apenas eventos de checkout session completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      logStep("=== PROCESSANDO CHECKOUT SESSION ===", { 
        sessionId: session.id, 
        email: session.customer_email,
        amount: session.amount_total,
        currency: session.currency,
        paymentStatus: session.payment_status
      });

      if (!session.customer_email) {
        logStep("Session sem email do cliente, ignorando");
        return new Response(JSON.stringify({ received: true, message: "Session sem email" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      // Buscar lead existente por email
      logStep("Buscando lead por email", session.customer_email);
      const { data: existingLeads, error: leadSearchError } = await supabaseClient
        .from('unified_leads')
        .select('*')
        .eq('email', session.customer_email)
        .order('created_at', { ascending: false });

      if (leadSearchError) {
        logStep("Erro ao buscar leads", leadSearchError);
        throw leadSearchError;
      }

      logStep("Leads encontrados", existingLeads?.length || 0);

      let targetLead = null;
      
      // Primeiro, tentar encontrar lead com mesmo stripe_session_id
      if (existingLeads && existingLeads.length > 0) {
        targetLead = existingLeads.find(lead => lead.stripe_session_id === session.id);
        
        if (!targetLead) {
          // Se não encontrou por session_id, pegar o lead mais recente não pago
          targetLead = existingLeads.find(lead => lead.payment_status !== 'paid') || existingLeads[0];
        }
      }

      if (targetLead) {
        logStep("Atualizando lead existente", { 
          leadId: targetLead.id, 
          currentStatus: targetLead.payment_status 
        });

        // Atualizar lead existente
        const { error: leadUpdateError } = await supabaseClient
          .from('unified_leads')
          .update({
            payment_status: 'paid',
            lead_status: 'converted',
            converted: true,
            conversion_date: new Date().toISOString(),
            conversion_value: session.amount_total ? (session.amount_total / 100) : 4.99,
            stripe_session_id: session.id,
            stripe_customer_id: session.customer,
            stripe_payment_id: session.payment_intent
          })
          .eq('id', targetLead.id);

        if (leadUpdateError) {
          logStep("Erro ao atualizar lead", leadUpdateError);
          throw leadUpdateError;
        }

        logStep("Lead atualizado com sucesso", { 
          leadId: targetLead.id, 
          email: session.customer_email 
        });
      } else {
        logStep("Nenhum lead encontrado para este email, criando novo registro");
        
        // Criar novo lead se não existir
        const newLead = {
          full_name: session.customer_details?.name || session.customer_email,
          email: session.customer_email,
          phone: session.customer_details?.phone || null,
          source_page: 'stripe_checkout',
          interest_type: 'landing_page',
          lead_status: 'converted',
          payment_status: 'paid',
          converted: true,
          conversion_date: new Date().toISOString(),
          conversion_value: session.amount_total ? (session.amount_total / 100) : 4.99,
          stripe_session_id: session.id,
          stripe_customer_id: session.customer,
          stripe_payment_id: session.payment_intent
        };

        const { data: newLeadData, error: leadCreateError } = await supabaseClient
          .from('unified_leads')
          .insert(newLead)
          .select()
          .single();

        if (leadCreateError) {
          logStep("Erro ao criar novo lead", leadCreateError);
        } else {
          logStep("Novo lead criado com sucesso", { leadId: newLeadData.id });
          targetLead = newLeadData;
        }
      }

      // Verificar/criar registro na tabela payments
      logStep("Verificando tabela payments");
      const { data: existingPayment } = await supabaseClient
        .from('payments')
        .select('id')
        .eq('stripe_session_id', session.id)
        .single();

      if (!existingPayment) {
        const paymentData = {
          email: session.customer_email,
          amount: session.amount_total || 499,
          currency: session.currency || 'eur',
          status: 'paid',
          stripe_session_id: session.id,
          stripe_customer_id: session.customer,
          stripe_payment_id: session.payment_intent,
          lead_id: targetLead?.id || null
        };

        const { error: paymentError } = await supabaseClient
          .from('payments')
          .insert(paymentData);

        if (paymentError) {
          logStep("Erro ao criar payment", paymentError);
        } else {
          logStep("Payment criado com sucesso");
        }
      } else {
        logStep("Payment já existe", existingPayment.id);
      }

      // Verificar/criar cliente
      logStep("Verificando tabela customers");
      const { data: existingCustomer } = await supabaseClient
        .from('customers')
        .select('id')
        .eq('email', session.customer_email)
        .single();

      if (!existingCustomer && targetLead) {
        const customerData = {
          full_name: targetLead.full_name || session.customer_email,
          email: session.customer_email,
          phone: targetLead.phone,
          company_name: targetLead.company_name,
          website: targetLead.website,
          original_lead_id: targetLead.id,
          acquisition_source: targetLead.source_page,
          stripe_customer_id: session.customer,
          total_spent: (session.amount_total || 499) / 100,
          last_payment_date: new Date().toISOString(),
          acquisition_date: targetLead.created_at
        };

        const { error: customerError } = await supabaseClient
          .from('customers')
          .insert(customerData);

        if (customerError) {
          logStep("Erro ao criar customer", customerError);
        } else {
          logStep("Customer criado com sucesso");
        }
      } else {
        logStep("Customer já existe ou lead não encontrado");
      }

      logStep("=== PROCESSAMENTO CONCLUÍDO ===");
    } else {
      logStep("Evento ignorado", { type: event.type });
    }

    return new Response(JSON.stringify({ 
      received: true, 
      event_type: event.type,
      processed: event.type === 'checkout.session.completed'
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("=== ERRO CRÍTICO ===", { 
      message: errorMessage,
      stack: error instanceof Error ? error.stack : 'No stack trace' 
    });
    
    return new Response(JSON.stringify({
      error: errorMessage,
      received: false,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
