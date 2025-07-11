import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SEND-NOTIFICATION] ${step}${detailsStr}`);
};

interface NotificationData {
  type: 'new_lead' | 'sale_completed' | 'payment_received' | 'customer_updated' | 'monthly_report' | 'system_error';
  to_email?: string;
  subject: string;
  data: any;
}

const getEmailTemplate = (type: string, data: any): string => {
  switch (type) {
    case 'new_lead':
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">🎯 Novo Lead Recebido!</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Nome:</strong> ${data.full_name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Telefone:</strong> ${data.phone || 'Não informado'}</p>
            <p><strong>Empresa:</strong> ${data.company_name || 'Não informada'}</p>
            <p><strong>Interesse:</strong> ${data.interest_type}</p>
            <p><strong>Fonte:</strong> ${data.source_page}</p>
          </div>
          <p style="color: #64748b;">Acesse o painel administrativo para mais detalhes.</p>
        </div>
      `;
    
    case 'sale_completed':
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">💰 Nova Venda Realizada!</h2>
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Número da Venda:</strong> ${data.sale_number}</p>
            <p><strong>Cliente:</strong> ${data.customer_name}</p>
            <p><strong>Serviço:</strong> ${data.service_name}</p>
            <p><strong>Valor:</strong> €${data.total_value}</p>
            <p><strong>Status:</strong> ${data.sale_status}</p>
          </div>
          <p style="color: #64748b;">Parabéns pela nova venda!</p>
        </div>
      `;
    
    case 'payment_received':
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">✅ Pagamento Recebido!</h2>
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Cliente:</strong> ${data.email}</p>
            <p><strong>Valor:</strong> €${data.amount}</p>
            <p><strong>Status:</strong> ${data.status}</p>
            <p><strong>Data:</strong> ${new Date(data.created_at).toLocaleDateString('pt-PT')}</p>
          </div>
          <p style="color: #64748b;">O pagamento foi processado com sucesso.</p>
        </div>
      `;
    
    case 'customer_updated':
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">👤 Cliente Atualizado</h2>
          <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Cliente:</strong> ${data.full_name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Status:</strong> ${data.customer_status}</p>
            <p><strong>Última atualização:</strong> ${new Date(data.updated_at).toLocaleDateString('pt-PT')}</p>
          </div>
          <p style="color: #64748b;">As informações do cliente foram atualizadas.</p>
        </div>
      `;
    
    case 'monthly_report':
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">📊 Relatório Mensal</h2>
          <div style="background: #faf5ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Novos Leads:</strong> ${data.new_leads}</p>
            <p><strong>Vendas Concluídas:</strong> ${data.completed_sales}</p>
            <p><strong>Receita Total:</strong> €${data.total_revenue}</p>
            <p><strong>Clientes Ativos:</strong> ${data.active_customers}</p>
          </div>
          <p style="color: #64748b;">Confira o relatório completo no painel administrativo.</p>
        </div>
      `;
    
    case 'system_error':
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">⚠️ Erro do Sistema</h2>
          <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <p><strong>Tipo:</strong> ${data.error_type}</p>
            <p><strong>Mensagem:</strong> ${data.message}</p>
            <p><strong>Data/Hora:</strong> ${new Date(data.timestamp).toLocaleString('pt-PT')}</p>
            ${data.details ? `<p><strong>Detalhes:</strong> ${data.details}</p>` : ''}
          </div>
          <p style="color: #64748b;">Por favor, verifique o sistema o mais breve possível.</p>
        </div>
      `;
    
    default:
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Notificação do Sistema</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <pre>${JSON.stringify(data, null, 2)}</pre>
          </div>
        </div>
      `;
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    if (!brevoApiKey) {
      throw new Error("BREVO_API_KEY is not set");
    }
    logStep("Brevo API key verified");

    // Initialize Supabase client to get system settings
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { type, to_email, subject, data }: NotificationData = await req.json();
    logStep("Notification data received", { type, to_email, subject });

    // Get system settings to determine recipient email
    const { data: emailSettings, error: settingsError } = await supabaseClient
      .from('system_settings')
      .select('setting_key, setting_value')
      .in('setting_key', ['contact_email', 'support_email', 'email_notifications']);

    if (settingsError) {
      logStep("Error fetching email settings", settingsError);
    }

    const settings = emailSettings?.reduce((acc: any, setting) => {
      try {
        acc[setting.setting_key] = JSON.parse(setting.setting_value);
      } catch {
        acc[setting.setting_key] = setting.setting_value;
      }
      return acc;
    }, {}) || {};

    // Check if email notifications are enabled
    if (!settings.email_notifications) {
      logStep("Email notifications are disabled");
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Email notifications are disabled" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Determine recipient email
    const recipientEmail = to_email || 
      (type === 'system_error' ? settings.support_email : settings.contact_email) ||
      'admin@senvia.pt';

    logStep("Sending to email", recipientEmail);

    // Generate email HTML content
    const htmlContent = getEmailTemplate(type, data);

    // Send email via Brevo API
    const emailPayload = {
      sender: {
        name: "SENVIA",
        email: settings.contact_email || "noreply@senvia.pt"
      },
      to: [
        {
          email: recipientEmail,
          name: "SENVIA Admin"
        }
      ],
      subject: subject,
      htmlContent: htmlContent
    };

    logStep("Sending email via Brevo", { recipient: recipientEmail, subject });

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": brevoApiKey,
        "content-type": "application/json"
      },
      body: JSON.stringify(emailPayload)
    });

    const responseData = await response.json();

    if (!response.ok) {
      logStep("Brevo API error", responseData);
      throw new Error(`Brevo API error: ${JSON.stringify(responseData)}`);
    }

    logStep("Email sent successfully", responseData);

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: responseData.messageId,
      recipient: recipientEmail 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in send-notification-email", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});