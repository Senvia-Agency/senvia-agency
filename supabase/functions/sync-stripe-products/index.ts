
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

    // Buscar todos os produtos do Stripe com expansão de dados
    logStep("Fetching Stripe products with expanded data");
    const stripeProducts = await stripe.products.list({ 
      limit: 100,
      expand: ['data.default_price']
    });
    logStep("Found Stripe products", { count: stripeProducts.data.length });

    // Buscar todos os preços do Stripe
    logStep("Fetching Stripe prices");
    const stripePrices = await stripe.prices.list({ 
      limit: 100
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
        logStep("Processing Stripe product", { 
          id: stripeProduct.id, 
          name: stripeProduct.name,
          active: stripeProduct.active 
        });

        // Determinar categoria baseada no nome/metadata
        let category = 'assistant';
        const name = stripeProduct.name.toLowerCase();
        const metadata = stripeProduct.metadata || {};
        
        if (metadata.category) {
          category = metadata.category;
        } else if (name.includes('landing') || name.includes('page')) {
          category = 'landing_pages';
        } else if (name.includes('website') || name.includes('site')) {
          category = 'websites';
        } else if (name.includes('ecommerce') || name.includes('loja')) {
          category = 'ecommerce';
        }

        // Preparar dados do produto para inserção/atualização
        const productData = {
          stripe_product_id: stripeProduct.id,
          name: stripeProduct.name,
          description: stripeProduct.description || null,
          category: category,
          status: stripeProduct.active ? 'active' : 'inactive',
          active: stripeProduct.active,
          pricing_model: 'subscription',
          features: stripeProduct.features ? stripeProduct.features.reduce((acc, feature) => {
            acc[feature.name] = true;
            return acc;
          }, {}) : {},
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
          stripe_default_price_id: typeof stripeProduct.default_price === 'string' 
            ? stripeProduct.default_price 
            : stripeProduct.default_price?.id || null,
          updated_at: new Date().toISOString()
        };

        // Verificar se produto já existe
        const { data: existingProduct } = await supabaseClient
          .from('products')
          .select('id')
          .eq('stripe_product_id', stripeProduct.id)
          .single();

        let productRecord;
        if (existingProduct) {
          // Atualizar produto existente
          const { data: updatedProduct, error: updateError } = await supabaseClient
            .from('products')
            .update(productData)
            .eq('stripe_product_id', stripeProduct.id)
            .select()
            .single();

          if (updateError) {
            logStep("Error updating product", { error: updateError });
            syncResults.errors.push(`Product update ${stripeProduct.name}: ${updateError.message}`);
            continue;
          }
          productRecord = updatedProduct;
          logStep("Product updated", { productId: productRecord.id, name: productRecord.name });
        } else {
          // Inserir novo produto
          const { data: newProduct, error: insertError } = await supabaseClient
            .from('products')
            .insert(productData)
            .select()
            .single();

          if (insertError) {
            logStep("Error inserting product", { error: insertError });
            syncResults.errors.push(`Product insert ${stripeProduct.name}: ${insertError.message}`);
            continue;
          }
          productRecord = newProduct;
          logStep("Product inserted", { productId: productRecord.id, name: productRecord.name });
        }

        syncResults.products_synced++;

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
            logStep("Processing Stripe price", { 
              priceId: stripePrice.id, 
              productId: stripePrice.product,
              unitAmount: stripePrice.unit_amount,
              currency: stripePrice.currency,
              type: stripePrice.type
            });

            const isRecurring = stripePrice.type === 'recurring';
            const interval = stripePrice.recurring?.interval;
            
            // Gerar nome do plano baseado no preço
            let planName = stripePrice.nickname || `${stripeProduct.name}`;
            if (isRecurring && interval) {
              planName += ` - ${interval === 'month' ? 'Mensal' : interval === 'year' ? 'Anual' : interval}`;
            } else if (!isRecurring) {
              planName += ' - Pagamento Único';
            }

            const priceAmount = (stripePrice.unit_amount || 0) / 100;

            // Preparar dados do plano
            const planData = {
              product_id: productRecord.id,
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
              limits: stripePrice.metadata || {},
              // Novos campos do Stripe
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

            // Verificar se plano já existe
            const { data: existingPlan } = await supabaseClient
              .from('product_plans')
              .select('id')
              .eq('product_id', productRecord.id)
              .eq('name', planName)
              .single();

            if (existingPlan) {
              // Atualizar plano existente
              const { error: updatePlanError } = await supabaseClient
                .from('product_plans')
                .update(planData)
                .eq('id', existingPlan.id);

              if (updatePlanError) {
                logStep("Error updating plan", { error: updatePlanError });
                syncResults.errors.push(`Plan update ${planName}: ${updatePlanError.message}`);
              } else {
                logStep("Plan updated", { planName, priceId: stripePrice.id });
              }
            } else {
              // Inserir novo plano
              const { error: insertPlanError } = await supabaseClient
                .from('product_plans')
                .insert(planData);

              if (insertPlanError) {
                logStep("Error inserting plan", { error: insertPlanError });
                syncResults.errors.push(`Plan insert ${planName}: ${insertPlanError.message}`);
              } else {
                syncResults.plans_synced++;
                logStep("Plan inserted", { planName, priceId: stripePrice.id });
              }
            }
          } catch (planError) {
            logStep("Error processing plan", { error: planError, priceId: stripePrice.id });
            syncResults.errors.push(`Plan processing error for ${stripePrice.id}: ${planError.message}`);
          }
        }
      } catch (productError) {
        logStep("Error processing product", { error: productError, productId: stripeProduct.id });
        syncResults.errors.push(`Product processing error for ${stripeProduct.id}: ${productError.message}`);
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
    logStep("ERROR in sync-stripe-products", { message: errorMessage, stack: error instanceof Error ? error.stack : undefined });
    
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
