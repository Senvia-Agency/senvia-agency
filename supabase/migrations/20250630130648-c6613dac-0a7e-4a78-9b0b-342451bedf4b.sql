
-- Criar tabela para histórico de atividades de leads e clientes
CREATE TABLE public.activity_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('lead', 'customer')),
  entity_id UUID NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('contact', 'status_change', 'note_added', 'payment_update', 'conversion', 'email_sent', 'call_made', 'meeting_scheduled')),
  title TEXT NOT NULL,
  description TEXT,
  contact_person TEXT, -- Pessoa que fez o contato/atividade
  contact_method TEXT, -- email, phone, whatsapp, meeting, etc.
  metadata JSONB, -- dados adicionais específicos da atividade
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para contatos ativos (quem está trabalhando com cada lead/cliente)
CREATE TABLE public.entity_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('lead', 'customer')),
  entity_id UUID NOT NULL,
  contact_person TEXT NOT NULL, -- Nome da pessoa responsável
  contact_role TEXT, -- Papel da pessoa (vendedor, suporte, gerente, etc.)
  contact_email TEXT,
  contact_phone TEXT,
  is_primary BOOLEAN DEFAULT false, -- Contato principal
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  assigned_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(entity_type, entity_id, contact_person) -- Evitar duplicatas
);

-- Índices para performance
CREATE INDEX idx_activity_history_entity ON public.activity_history(entity_type, entity_id);
CREATE INDEX idx_activity_history_created_at ON public.activity_history(created_at DESC);
CREATE INDEX idx_entity_contacts_entity ON public.entity_contacts(entity_type, entity_id);

-- Habilitar RLS
ALTER TABLE public.activity_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entity_contacts ENABLE ROW LEVEL SECURITY;

-- Políticas RLS - apenas admins podem acessar
CREATE POLICY "Only admins can view activity history" 
ON public.activity_history 
FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can insert activity history" 
ON public.activity_history 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update activity history" 
ON public.activity_history 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete activity history" 
ON public.activity_history 
FOR DELETE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can view entity contacts" 
ON public.entity_contacts 
FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can insert entity contacts" 
ON public.entity_contacts 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update entity contacts" 
ON public.entity_contacts 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete entity contacts" 
ON public.entity_contacts 
FOR DELETE 
USING (public.is_admin(auth.uid()));

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_activity_history_updated_at 
BEFORE UPDATE ON public.activity_history 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_entity_contacts_updated_at 
BEFORE UPDATE ON public.entity_contacts 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
