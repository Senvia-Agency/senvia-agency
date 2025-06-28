
-- Criar tabela para configurações administrativas
CREATE TABLE public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID NOT NULL,
  settings_key TEXT NOT NULL,
  settings_value JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(admin_user_id, settings_key)
);

-- Adicionar RLS para segurança
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Política para admins poderem gerenciar suas próprias configurações
CREATE POLICY "Admins can manage their own settings" 
ON public.admin_settings 
USING (admin_user_id = auth.uid());

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_admin_settings_updated_at
  BEFORE UPDATE ON public.admin_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
