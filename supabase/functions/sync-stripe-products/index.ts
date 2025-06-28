
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SYNC-STRIPE-PRODUCTS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    // Use service role key to bypass RLS
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Buscar todos os produtos do Stripe
    logStep("Fetching Stripe products");
    const stripeProducts = await stripe.products.list({ 
      limit: 100,
      active: true 
    });
    logStep("Found Stripe products", { count: stripeProducts.data.length });

    // Buscar todos os preços do Stripe
    logStep("Fetching Stripe prices");
    const stripePrices = await stripe.prices.list({ 
      limit: 100,
      active: true 
    });
    logStep("Found Stripe prices", { count: stripePrices.data.length });

    const syncResults = {
      products_synced: 0,
      plans_synced: 0,
      errors: []
    };

    // Sincronizar cada produto
    for (const stripeProduct of stripeProducts.data) {
      try {
        logStep("Processing product", { id: stripeProduct.id, name: stripeProduct.name });

        // Determinar categoria baseada no nome/descrição
        let category = 'assistant';
        const name = stripeProduct.name.toLowerCase();
        if (name.includes('landing') || name.includes('page')) {
          category = 'landing_pages';
        } else if (name.includes('website') || name.includes('site')) {
          category = 'websites';
        } else if (name.includes('ecommerce') || name.includes('loja')) {
          category = 'ecommerce';
        }

        // Upsert produto na tabela products
        const { data: product, error: productError } = await supabaseClient
          .from('products')
          .upsert({
            stripe_product_id: stripeProduct.id,
            name: stripeProduct.name,
            description: stripeProduct.description || null,
            category: category,
            status: stripeProduct.active ? 'active' : 'inactive',
            active: stripeProduct.active,
            pricing_model: 'subscription',
            features: stripeProduct.metadata || {},
            metadata: {
              stripe_created: stripeProduct.created,
              stripe_updated: stripeProduct.updated,
              stripe_url: stripeProduct.url,
              stripe_images: stripeProduct.images
            }
          }, { 
            onConflict: 'stripe_product_id',
            ignoreDuplicates: false 
          })
          .select()
          .single();

        if (productError) {
          logStep("Error upserting product", { error: productError });
          syncResults.errors.push(`Product ${stripeProduct.name}: ${productError.message}`);
          continue;
        }

        syncResults.products_synced++;
        logStep("Product synced", { productId: product.id });

        // Buscar preços para este produto
        const productPrices = stripePrices.data.filter(
          price => price.product === stripeProduct.id
        );

        logStep("Found prices for product", { 
          productId: stripeProduct.id, 
          pricesCount: productPrices.length 
        });

        // Sincronizar cada preço como um plano
        for (const stripePrice of productPrices) {
          try {
            const isRecurring = stripePrice.type === 'recurring';
            const interval = stripePrice.recurring?.interval;
            
            let planName = `${stripeProduct.name}`;
            if (isRecurring) {
              planName += ` - ${interval === 'month' ? 'Mensal' : interval === 'year' ? 'Anual' : interval}`;
            } else {
              planName += ' - Pagamento Único';
            }

            const priceAmount = (stripePrice.unit_amount || 0) / 100;

            const { error: planError } = await supabaseClient
              .from('product_plans')
              .upsert({
                product_id: product.id,
                name: planName,
                description: stripePrice.nickname || `Plano ${planName}`,
                price_monthly: interval === 'month' ? priceAmount : null,
                price_yearly: interval === 'year' ? priceAmount : null,
                currency: stripePrice.currency.toUpperCase(),
                status: stripePrice.active ? 'active' : 'inactive',
                stripe_price_id_monthly: interval === 'month' ? stripePrice.id : null,
                stripe_price_id_yearly: interval === 'year' ? stripePrice.id : null,
                features: {
                  billing_scheme: stripePrice.billing_scheme,
                  usage_type: stripePrice.usage_type,
                  tiers_mode: stripePrice.tiers_mode
                },
                limits: stripePrice.metadata || {}
              }, { 
                onConflict: 'product_id,name',
                ignoreDuplicates: false 
              });

            if (planError) {
              logStep("Error upserting plan", { error: planError });
              syncResults.errors.push(`Plan ${planName}: ${planError.message}`);
            } else {
              syncResults.plans_synced++;
              logStep("Plan synced", { planName });
            }
          } catch (planError) {
            logStep("Error processing plan", { error: planError });
            syncResults.errors.push(`Plan processing error: ${planError.message}`);
          }
        }
      } catch (productError) {
        logStep("Error processing product", { error: productError });
        syncResults.errors.push(`Product processing error: ${productError.message}`);
      }
    }

    logStep("Sync completed", syncResults);

    return new Response(JSON.stringify({
      success: true,
      message: "Stripe products synchronized successfully",
      results: syncResults
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in sync-stripe-products", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
