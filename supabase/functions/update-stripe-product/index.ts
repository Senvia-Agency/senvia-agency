
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[UPDATE-STRIPE-PRODUCT] ${step}${detailsStr}`);
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

    const { product_id, name, description, active, category } = await req.json();
    logStep("Request data received", { product_id, name, description, active, category });

    // Buscar produto no Supabase para obter stripe_product_id
    const { data: product, error: productError } = await supabaseClient
      .from('products')
      .select('stripe_product_id')
      .eq('id', product_id)
      .single();

    if (productError || !product?.stripe_product_id) {
      throw new Error("Product not found or missing Stripe ID");
    }

    logStep("Product found", { stripe_product_id: product.stripe_product_id });

    // Atualizar produto no Stripe
    const updateData: any = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (active !== undefined) updateData.active = active;
    if (category) {
      updateData.metadata = { category };
    }

    const stripeProduct = await stripe.products.update(product.stripe_product_id, updateData);
    logStep("Stripe product updated", { id: stripeProduct.id });

    // Atualizar produto no Supabase
    const supabaseUpdateData = {
      name: stripeProduct.name,
      description: stripeProduct.description || null,
      active: stripeProduct.active,
      status: stripeProduct.active ? 'active' : 'inactive',
      category: category || undefined,
      stripe_updated: stripeProduct.updated,
      updated_at: new Date().toISOString()
    };

    const { data: updatedProduct, error: updateError } = await supabaseClient
      .from('products')
      .update(supabaseUpdateData)
      .eq('id', product_id)
      .select()
      .single();

    if (updateError) {
      logStep("Error updating product in Supabase", { error: updateError });
      throw new Error(`Failed to update product: ${updateError.message}`);
    }

    logStep("Product updated successfully");

    return new Response(JSON.stringify({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in update-stripe-product", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
