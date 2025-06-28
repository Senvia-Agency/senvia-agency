
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook recebido");

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
    
    if (!signature) {
      throw new Error("Stripe signature não encontrada");
    }

    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET não configurado");
    }

    // Verificar assinatura do webhook
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      logStep("Webhook verificado com sucesso", { type: event.type });
    } catch (err) {
      logStep("Erro na verificação do webhook", { error: err.message });
      return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 });
    }

    // Processar apenas eventos de checkout session completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      logStep("Processando checkout session completed", { sessionId: session.id, email: session.customer_email });

      if (!session.customer_email) {
        logStep("Session sem email do cliente, ignorando");
        return new Response(JSON.stringify({ received: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      // Atualizar unified_leads
      const { data: lead, error: leadSelectError } = await supabaseClient
        .from('unified_leads')
        .select('id, payment_status')
        .eq('email', session.customer_email)
        .eq('stripe_session_id', session.id)
        .single();

      if (leadSelectError && leadSelectError.code !== 'PGRST116') {
        logStep("Erro ao buscar lead", { error: leadSelectError });
        throw leadSelectError;
      }

      if (lead) {
        // Atualizar lead existente
        const { error: leadUpdateError } = await supabaseClient
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

        if (leadUpdateError) {
          logStep("Erro ao atualizar lead", { error: leadUpdateError });
          throw leadUpdateError;
        }

        logStep("Lead atualizado com sucesso", { leadId: lead.id, email: session.customer_email });
      } else {
        logStep("Lead não encontrado para esta session", { email: session.customer_email, sessionId: session.id });
      }

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
          logStep("Erro ao criar payment", { error: paymentError });
          throw paymentError;
        }

        logStep("Payment criado com sucesso", { email: session.customer_email });
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
          logStep("Erro ao criar customer", { error: customerError });
        } else {
          logStep("Customer criado com sucesso", { email: session.customer_email });
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERRO no webhook", { message: errorMessage });
    
    return new Response(JSON.stringify({
      error: errorMessage,
      received: false
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
