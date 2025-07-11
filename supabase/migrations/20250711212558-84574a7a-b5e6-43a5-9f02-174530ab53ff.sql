-- Criar tabela para configurações gerais do sistema
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  setting_type TEXT NOT NULL DEFAULT 'general',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ativar RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Criar política para administradores
CREATE POLICY "Only admins can manage system settings"
ON public.system_settings
FOR ALL
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Inserir configurações padrão
INSERT INTO public.system_settings (setting_key, setting_value, setting_type, description) VALUES
('site_name', '"SENVIA"', 'general', 'Nome do site'),
('site_description', '"Soluções digitais para o seu negócio"', 'general', 'Descrição do site'),
('contact_email', '"admin@senvia.pt"', 'general', 'Email de contato principal'),
('support_email', '"suporte@senvia.pt"', 'general', 'Email de suporte'),
('company_address', '"Lisboa, Portugal"', 'general', 'Endereço da empresa'),
('auto_sync', 'true', 'system', 'Sincronização automática'),
('email_notifications', 'true', 'system', 'Notificações por email'),
('backup_frequency', '"daily"', 'system', 'Frequência de backup'),
('max_upload_size', '50', 'system', 'Tamanho máximo de upload em MB'),
('session_timeout', '30', 'system', 'Timeout de sessão em minutos'),
('api_rate_limit', '100', 'system', 'Limite de requests por minuto'),
('maintenance_mode', 'false', 'system', 'Modo de manutenção'),
('enable_debug_logs', 'false', 'system', 'Logs de debug'),
('theme_mode', '"auto"', 'ui', 'Tema padrão do sistema'),
('default_language', '"pt"', 'ui', 'Idioma padrão'),
('currency', '"EUR"', 'ui', 'Moeda padrão')
ON CONFLICT (setting_key) DO NOTHING;

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();