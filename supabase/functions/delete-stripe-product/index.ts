
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
    if (!stripeKey) {
      logStep("ERROR: STRIPE_SECRET_KEY not found");
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    const requestBody = await req.json();
    const { product_id } = requestBody;
    
    logStep("Request data received", { product_id });

    if (!product_id) {
      throw new Error("Product ID is required");
    }

    // Buscar produto no Supabase para obter stripe_product_id
    const { data: product, error: productError } = await supabaseClient
      .from('products')
      .select('stripe_product_id, name')
      .eq('id', product_id)
      .single();

    logStep("Product query result", { product, error: productError });

    if (productError) {
      logStep("Error fetching product", { error: productError });
      throw new Error(`Failed to fetch product: ${productError.message}`);
    }

    if (!product) {
      logStep("Product not found");
      throw new Error("Product not found");
    }

    // Se tem stripe_product_id, tentar desativar no Stripe
    if (product.stripe_product_id) {
      try {
        logStep("Attempting to deactivate Stripe product", { stripe_product_id: product.stripe_product_id });
        
        const stripeProduct = await stripe.products.update(product.stripe_product_id, {
          active: false
        });
        
        logStep("Stripe product deactivated successfully", { id: stripeProduct.id });
      } catch (stripeError) {
        logStep("Warning: Failed to deactivate Stripe product", { error: stripeError });
        // Continuar mesmo se falhar no Stripe, pois queremos deletar do Supabase
      }
    } else {
      logStep("No Stripe product ID found, skipping Stripe deactivation");
    }

    // Deletar planos associados primeiro (devido a foreign keys)
    try {
      const { error: deletePlansError } = await supabaseClient
        .from('product_plans')
        .delete()
        .eq('product_id', product_id);

      if (deletePlansError) {
        logStep("Error deleting product plans", { error: deletePlansError });
        throw new Error(`Failed to delete product plans: ${deletePlansError.message}`);
      }
      
      logStep("Product plans deleted successfully");
    } catch (plansError) {
      logStep("Error in plans deletion", { error: plansError });
      throw plansError;
    }

    // Deletar produto do Supabase
    try {
      const { data: deletedProduct, error: deleteError } = await supabaseClient
        .from('products')
        .delete()
        .eq('id', product_id)
        .select();

      logStep("Product deletion result", { deletedProduct, error: deleteError });

      if (deleteError) {
        logStep("Error deleting product from Supabase", { error: deleteError });
        throw new Error(`Failed to delete product: ${deleteError.message}`);
      }

      if (!deletedProduct || deletedProduct.length === 0) {
        logStep("No product was deleted - product may not exist");
        throw new Error("Product not found or already deleted");
      }

      logStep("Product deleted successfully from Supabase");
    } catch (deleteProductError) {
      logStep("Error in product deletion", { error: deleteProductError });
      throw deleteProductError;
    }

    logStep("Delete operation completed successfully");

    return new Response(JSON.stringify({
      success: true,
      message: `Product "${product.name}" deleted successfully`,
      details: {
        product_id,
        stripe_deactivated: !!product.stripe_product_id
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("FINAL ERROR in delete-stripe-product", { 
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined 
    });
    
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMessage,
      details: "Check function logs for more information"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
