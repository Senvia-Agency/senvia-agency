
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-STRIPE-PRODUCT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    const { name, description, category, pricing_model, plans, images } = await req.json();
    logStep("Request data received", { name, description, category, pricing_model, plansCount: plans?.length, imagesCount: images?.length });

    // Criar produto no Stripe
    const stripeProductData: any = {
      name,
      description: description || undefined,
      images: images || [],
      metadata: {
        category: category || 'assistant',
        pricing_model: pricing_model || 'subscription'
      }
    };

    const stripeProduct = await stripe.products.create(stripeProductData);
    logStep("Stripe product created", { id: stripeProduct.id, name: stripeProduct.name });

    // Criar preços no Stripe se fornecidos (para assinaturas)
    const stripePrices = [];
    if (pricing_model === 'subscription' && plans && plans.length > 0) {
      for (const plan of plans) {
        // Criar preço mensal se fornecido
        if (plan.price_monthly) {
          const monthlyPriceData: any = {
            product: stripeProduct.id,
            currency: plan.currency || 'eur',
            nickname: `${plan.name} - Mensal`,
            unit_amount: Math.round(plan.price_monthly * 100),
            recurring: { interval: 'month' },
            metadata: { plan_name: plan.name, billing_cycle: 'monthly' }
          };

          const monthlyPrice = await stripe.prices.create(monthlyPriceData);
          stripePrices.push(monthlyPrice);
          logStep("Monthly price created", { id: monthlyPrice.id, amount: monthlyPrice.unit_amount });
        }

        // Criar preço anual se fornecido
        if (plan.price_yearly) {
          const yearlyPriceData: any = {
            product: stripeProduct.id,
            currency: plan.currency || 'eur',
            nickname: `${plan.name} - Anual`,
            unit_amount: Math.round(plan.price_yearly * 100),
            recurring: { interval: 'year' },
            metadata: { plan_name: plan.name, billing_cycle: 'yearly' }
          };

          const yearlyPrice = await stripe.prices.create(yearlyPriceData);
          stripePrices.push(yearlyPrice);
          logStep("Yearly price created", { id: yearlyPrice.id, amount: yearlyPrice.unit_amount });
        }
      }
    } else if (pricing_model === 'payment') {
      // Para pagamento único, criar um preço simples
      // Por enquanto, usar um valor padrão - isso será melhorado
      const oneTimePriceData: any = {
        product: stripeProduct.id,
        currency: 'eur',
        nickname: `${name} - Pagamento Único`,
        unit_amount: 999, // €9.99 como exemplo
        metadata: { payment_type: 'one_time' }
      };

      const oneTimePrice = await stripe.prices.create(oneTimePriceData);
      stripePrices.push(oneTimePrice);
      logStep("One-time price created", { id: oneTimePrice.id, amount: oneTimePrice.unit_amount });
    }

    // Salvar produto no Supabase
    const productData = {
      stripe_product_id: stripeProduct.id,
      name: stripeProduct.name,
      description: stripeProduct.description || null,
      category: category || 'assistant',
      status: stripeProduct.active ? 'active' : 'inactive',
      active: stripeProduct.active,
      pricing_model: pricing_model || 'subscription',
      features: {},
      metadata: stripeProduct.metadata || {},
      stripe_created: stripeProduct.created,
      stripe_updated: stripeProduct.updated,
      stripe_url: stripeProduct.url || null,
      stripe_images: stripeProduct.images || [],
      stripe_package_dimensions: stripeProduct.package_dimensions || null,
      stripe_shippable: stripeProduct.shippable || false,
      stripe_statement_descriptor: stripeProduct.statement_descriptor || null,
      stripe_tax_code: stripeProduct.tax_code || null,
      stripe_unit_label: stripeProduct.unit_label || null,
      stripe_default_price_id: stripePrices[0]?.id || null,
      updated_at: new Date().toISOString()
    };

    const { data: productRecord, error: productError } = await supabaseClient
      .from('products')
      .insert(productData)
      .select()
      .single();

    if (productError) {
      logStep("Error saving product to Supabase", { error: productError });
      throw new Error(`Failed to save product: ${productError.message}`);
    }

    logStep("Product saved to Supabase", { productId: productRecord.id });

    // Salvar planos no Supabase (se for assinatura)
    if (pricing_model === 'subscription' && plans && plans.length > 0) {
      for (let i = 0; i < plans.length; i++) {
        const plan = plans[i];
        
        // Encontrar preços mensais e anuais para este plano
        const monthlyPrice = stripePrices.find(p => 
          p.metadata?.plan_name === plan.name && p.metadata?.billing_cycle === 'monthly'
        );
        const yearlyPrice = stripePrices.find(p => 
          p.metadata?.plan_name === plan.name && p.metadata?.billing_cycle === 'yearly'
        );
        
        const planData = {
          product_id: productRecord.id,
          name: plan.name,
          description: plan.description || `Plano ${plan.name}`,
          price_monthly: plan.price_monthly || null,
          price_yearly: plan.price_yearly || null,
          currency: (plan.currency || 'eur').toUpperCase(),
          status: 'active',
          stripe_price_id_monthly: monthlyPrice?.id || null,
          stripe_price_id_yearly: yearlyPrice?.id || null,
          features: plan.features || {},
          limits: plan.limits || {},
          stripe_created: monthlyPrice?.created || yearlyPrice?.created || Math.floor(Date.now() / 1000),
          stripe_updated: monthlyPrice?.created || yearlyPrice?.created || Math.floor(Date.now() / 1000),
          stripe_active: true,
          stripe_billing_scheme: monthlyPrice?.billing_scheme || yearlyPrice?.billing_scheme || 'per_unit',
          stripe_currency_options: null,
          stripe_custom_unit_amount: null,
          stripe_lookup_key: null,
          stripe_metadata: { plan_name: plan.name },
          stripe_nickname: plan.name,
          stripe_product_id: stripeProduct.id,
          stripe_recurring: monthlyPrice?.recurring || yearlyPrice?.recurring || null,
          stripe_tax_behavior: null,
          stripe_tiers: null,
          stripe_tiers_mode: null,
          stripe_transform_quantity: null,
          stripe_type: monthlyPrice?.type || yearlyPrice?.type || 'recurring',
          stripe_unit_amount: monthlyPrice?.unit_amount || yearlyPrice?.unit_amount || null,
          stripe_unit_amount_decimal: null,
          updated_at: new Date().toISOString()
        };

        const { error: planError } = await supabaseClient
          .from('product_plans')
          .insert(planData);

        if (planError) {
          logStep("Error saving plan to Supabase", { error: planError });
        } else {
          logStep("Plan saved to Supabase", { planName: plan.name });
        }
      }
    } else if (pricing_model === 'payment' && stripePrices.length > 0) {
      // Para pagamento único, criar um "plano" simples
      const oneTimePrice = stripePrices[0];
      const planData = {
        product_id: productRecord.id,
        name: `${name} - Pagamento Único`,
        description: `Compre ${name} com pagamento único`,
        price_monthly: null,
        price_yearly: null,
        currency: oneTimePrice.currency.toUpperCase(),
        status: 'active',
        stripe_price_id_monthly: oneTimePrice.id,
        stripe_price_id_yearly: null,
        features: {},
        limits: {},
        stripe_created: oneTimePrice.created,
        stripe_updated: oneTimePrice.created,
        stripe_active: oneTimePrice.active,
        stripe_billing_scheme: oneTimePrice.billing_scheme,
        stripe_currency_options: null,
        stripe_custom_unit_amount: null,
        stripe_lookup_key: null,
        stripe_metadata: oneTimePrice.metadata || {},
        stripe_nickname: oneTimePrice.nickname,
        stripe_product_id: stripeProduct.id,
        stripe_recurring: null,
        stripe_tax_behavior: null,
        stripe_tiers: null,
        stripe_tiers_mode: null,
        stripe_transform_quantity: null,
        stripe_type: oneTimePrice.type,
        stripe_unit_amount: oneTimePrice.unit_amount,
        stripe_unit_amount_decimal: null,
        updated_at: new Date().toISOString()
      };

      const { error: planError } = await supabaseClient
        .from('product_plans')
        .insert(planData);

      if (planError) {
        logStep("Error saving one-time plan to Supabase", { error: planError });
      } else {
        logStep("One-time plan saved to Supabase");
      }
    }

    logStep("Product and plans created successfully");

    return new Response(JSON.stringify({
      success: true,
      message: "Product created successfully",
      product: productRecord,
      stripe_product_id: stripeProduct.id,
      pricing_model: pricing_model
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-stripe-product", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
