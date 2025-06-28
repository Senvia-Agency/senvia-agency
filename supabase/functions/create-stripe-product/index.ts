
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

    const { name, description, category, pricing_model, plans } = await req.json();
    logStep("Request data received", { name, description, category, pricing_model, plansCount: plans?.length });

    // Criar produto no Stripe
    const stripeProduct = await stripe.products.create({
      name,
      description: description || undefined,
      metadata: {
        category: category || 'assistant',
        pricing_model: pricing_model || 'subscription'
      }
    });
    logStep("Stripe product created", { id: stripeProduct.id, name: stripeProduct.name });

    // Criar preços no Stripe se fornecidos
    const stripePrices = [];
    if (plans && plans.length > 0) {
      for (const plan of plans) {
        const priceData: any = {
          product: stripeProduct.id,
          currency: plan.currency || 'eur',
          nickname: plan.name,
          metadata: plan.metadata || {}
        };

        if (plan.price_monthly) {
          priceData.unit_amount = Math.round(plan.price_monthly * 100);
          priceData.recurring = { interval: 'month' };
        } else if (plan.price_yearly) {
          priceData.unit_amount = Math.round(plan.price_yearly * 100);
          priceData.recurring = { interval: 'year' };
        }

        const stripePrice = await stripe.prices.create(priceData);
        stripePrices.push(stripePrice);
        logStep("Stripe price created", { id: stripePrice.id, amount: stripePrice.unit_amount });
      }
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

    // Salvar planos no Supabase
    for (let i = 0; i < stripePrices.length; i++) {
      const stripePrice = stripePrices[i];
      const plan = plans[i];
      
      const planData = {
        product_id: productRecord.id,
        name: plan.name,
        description: plan.description || `Plano ${plan.name}`,
        price_monthly: plan.price_monthly || null,
        price_yearly: plan.price_yearly || null,
        currency: (plan.currency || 'eur').toUpperCase(),
        status: stripePrice.active ? 'active' : 'inactive',
        stripe_price_id_monthly: stripePrice.recurring?.interval === 'month' ? stripePrice.id : null,
        stripe_price_id_yearly: stripePrice.recurring?.interval === 'year' ? stripePrice.id : null,
        features: plan.features || {},
        limits: plan.limits || {},
        stripe_created: stripePrice.created,
        stripe_updated: stripePrice.updated || stripePrice.created,
        stripe_active: stripePrice.active,
        stripe_billing_scheme: stripePrice.billing_scheme,
        stripe_currency_options: stripePrice.currency_options || null,
        stripe_custom_unit_amount: stripePrice.custom_unit_amount || null,
        stripe_lookup_key: stripePrice.lookup_key || null,
        stripe_metadata: stripePrice.metadata || {},
        stripe_nickname: stripePrice.nickname || null,
        stripe_product_id: stripePrice.product as string,
        stripe_recurring: stripePrice.recurring || null,
        stripe_tax_behavior: stripePrice.tax_behavior || null,
        stripe_tiers: stripePrice.tiers || null,
        stripe_tiers_mode: stripePrice.tiers_mode || null,
        stripe_transform_quantity: stripePrice.transform_quantity || null,
        stripe_type: stripePrice.type,
        stripe_unit_amount: stripePrice.unit_amount || null,
        stripe_unit_amount_decimal: stripePrice.unit_amount_decimal || null,
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

    logStep("Product and plans created successfully");

    return new Response(JSON.stringify({
      success: true,
      message: "Product created successfully",
      product: productRecord,
      stripe_product_id: stripeProduct.id
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
