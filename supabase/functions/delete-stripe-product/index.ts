
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[DELETE-STRIPE-PRODUCT] ${step}${detailsStr}`);
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

    const { product_id } = await req.json();
    logStep("Request data received", { product_id });

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

    // Desativar produto no Stripe (não é possível deletar completamente)
    const stripeProduct = await stripe.products.update(product.stripe_product_id, {
      active: false
    });
    logStep("Stripe product deactivated", { id: stripeProduct.id });

    // Deletar planos associados do Supabase
    await supabaseClient
      .from('product_plans')
      .delete()
      .eq('product_id', product_id);
    logStep("Product plans deleted from Supabase");

    // Deletar produto do Supabase
    const { error: deleteError } = await supabaseClient
      .from('products')
      .delete()
      .eq('id', product_id);

    if (deleteError) {
      logStep("Error deleting product from Supabase", { error: deleteError });
      throw new Error(`Failed to delete product: ${deleteError.message}`);
    }

    logStep("Product deleted successfully");

    return new Response(JSON.stringify({
      success: true,
      message: "Product deleted successfully (deactivated in Stripe)"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in delete-stripe-product", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
