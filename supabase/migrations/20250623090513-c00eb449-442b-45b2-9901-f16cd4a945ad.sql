
-- Criar tabela de produtos da SENVIA
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'assistant', 'landing_pages', 'websites', etc
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'inactive', 'discontinued'
  features JSONB, -- Lista de funcionalidades do produto
  pricing_model TEXT NOT NULL DEFAULT 'subscription', -- 'subscription', 'one_time', 'usage_based'
  
  -- Metadados
  metadata JSONB
);

-- Criar tabela de planos de cada produto
CREATE TABLE public.product_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  name TEXT NOT NULL, -- 'Basic', 'Premium', 'Enterprise'
  description TEXT,
  price_monthly DECIMAL(10,2),
  price_yearly DECIMAL(10,2),
  currency TEXT NOT NULL DEFAULT 'EUR',
  
  -- Limites e funcionalidades do plano
  features JSONB, -- Ex: {"max_projects": 5, "support": "email"}
  limits JSONB, -- Ex: {"api_calls": 1000, "storage_gb": 10}
  
  status TEXT NOT NULL DEFAULT 'active',
  stripe_price_id_monthly TEXT,
  stripe_price_id_yearly TEXT
);

-- Criar tabela de assinaturas dos clientes
CREATE TABLE public.customer_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES public.product_plans(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Status da assinatura
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'cancelled', 'expired', 'suspended'
  billing_cycle TEXT NOT NULL DEFAULT 'monthly', -- 'monthly', 'yearly'
  
  -- Datas importantes
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  next_billing_date TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  
  -- Integração com Stripe
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  
  -- Configurações específicas do produto
  product_config JSONB, -- Configurações específicas para cada produto
  usage_data JSONB, -- Dados de uso (API calls, storage usado, etc)
  
  -- Índice único para evitar duplicatas
  UNIQUE(user_id, product_id, status)
);

-- Criar tabela para histórico de faturas
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id UUID REFERENCES public.customer_subscriptions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Detalhes da fatura
  invoice_number TEXT NOT NULL UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'
  
  -- Período de faturação
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Integração com Stripe
  stripe_invoice_id TEXT,
  stripe_payment_intent_id TEXT,
  
  -- Dados da fatura
  line_items JSONB, -- Detalhes dos itens faturados
  metadata JSONB
);

-- Criar tabela para configurações de conta do cliente
CREATE TABLE public.customer_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Preferências de notificação
  email_notifications BOOLEAN DEFAULT true,
  billing_notifications BOOLEAN DEFAULT true,
  product_updates BOOLEAN DEFAULT true,
  
  -- Configurações de faturação
  billing_email TEXT,
  billing_address JSONB, -- Endereço de faturação
  tax_id TEXT, -- NIF/VAT ID
  
  -- Configurações gerais
  timezone TEXT DEFAULT 'Europe/Lisbon',
  language TEXT DEFAULT 'pt',
  theme TEXT DEFAULT 'light',
  
  -- Configurações específicas por produto
  product_preferences JSONB
);

-- Inserir produtos iniciais da SENVIA
INSERT INTO public.products (name, description, category, features) VALUES
('SENVIA Assistant', 'Assistente de IA inteligente para automação de tarefas e atendimento', 'assistant', '{"ai_powered": true, "24_7_support": true, "integrations": ["whatsapp", "email", "web"]}'::jsonb),
('SENVIA Landing Pages', 'Criação de landing pages profissionais e otimizadas para conversão', 'landing_pages', '{"templates": true, "analytics": true, "ab_testing": true, "mobile_optimized": true}'::jsonb),
('SENVIA Websites', 'Desenvolvimento de websites completos e responsivos', 'websites', '{"responsive": true, "seo_optimized": true, "cms": true, "hosting": true}'::jsonb),
('SENVIA E-commerce', 'Plataforma completa de e-commerce', 'ecommerce', '{"payment_gateway": true, "inventory": true, "analytics": true, "multi_currency": true}'::jsonb);

-- Inserir planos para cada produto
INSERT INTO public.product_plans (product_id, name, description, price_monthly, price_yearly, features, limits) 
SELECT 
  p.id,
  plan_data.name,
  plan_data.description,
  plan_data.price_monthly,
  plan_data.price_yearly,
  plan_data.features::jsonb,
  plan_data.limits::jsonb
FROM public.products p
CROSS JOIN (
  VALUES 
    ('Basic', 'Plano básico ideal para começar', 29.90, 299.00, '{"support": "email", "priority": "normal"}', '{"projects": 3, "monthly_requests": 1000}'),
    ('Premium', 'Plano avançado para negócios em crescimento', 79.90, 799.00, '{"support": "priority", "priority": "high", "custom_domain": true}', '{"projects": 10, "monthly_requests": 5000}'),
    ('Enterprise', 'Solução completa para empresas', 199.90, 1999.00, '{"support": "dedicated", "priority": "highest", "custom_integration": true}', '{"projects": -1, "monthly_requests": -1}')
) AS plan_data(name, description, price_monthly, price_yearly, features, limits);

-- Índices para performance
CREATE INDEX idx_customer_subscriptions_user_id ON public.customer_subscriptions(user_id);
CREATE INDEX idx_customer_subscriptions_status ON public.customer_subscriptions(status);
CREATE INDEX idx_customer_subscriptions_product_id ON public.customer_subscriptions(product_id);
CREATE INDEX idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX idx_invoices_subscription_id ON public.invoices(subscription_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);

-- Triggers para atualizar updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_product_plans_updated_at
  BEFORE UPDATE ON public.product_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_subscriptions_updated_at
  BEFORE UPDATE ON public.customer_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_settings_updated_at
  BEFORE UPDATE ON public.customer_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_settings ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para products (público para leitura)
CREATE POLICY "Anyone can view active products" 
ON public.products 
FOR SELECT 
USING (status = 'active');

-- Políticas RLS para product_plans (público para leitura)
CREATE POLICY "Anyone can view active plans" 
ON public.product_plans 
FOR SELECT 
USING (status = 'active');

-- Políticas RLS para customer_subscriptions (apenas proprietário)
CREATE POLICY "Users can view their own subscriptions" 
ON public.customer_subscriptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" 
ON public.customer_subscriptions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" 
ON public.customer_subscriptions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Políticas RLS para invoices (apenas proprietário)
CREATE POLICY "Users can view their own invoices" 
ON public.invoices 
FOR SELECT 
USING (auth.uid() = user_id);

-- Políticas RLS para customer_settings (apenas proprietário)
CREATE POLICY "Users can view their own settings" 
ON public.customer_settings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" 
ON public.customer_settings 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" 
ON public.customer_settings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Função para criar configurações padrão quando um usuário se inscreve
CREATE OR REPLACE FUNCTION public.create_default_customer_settings()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.customer_settings (user_id, billing_email)
  VALUES (NEW.user_id, NEW.email)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Trigger para criar configurações padrão quando um perfil é criado
CREATE TRIGGER create_customer_settings_on_profile_creation
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_customer_settings();
