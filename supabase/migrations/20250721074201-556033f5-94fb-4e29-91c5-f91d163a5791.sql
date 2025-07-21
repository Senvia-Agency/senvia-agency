-- Habilitar RLS nas tabelas que não têm
ALTER TABLE public.follow_up ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contatos_agente ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.n8n_chat_histories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.n8n_fila_mensagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para as tabelas que precisam (apenas para admins ou sistema)
-- Follow up - apenas admins podem ver/editar
CREATE POLICY "Only admins can view follow_up" ON public.follow_up 
FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can manage follow_up" ON public.follow_up 
FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- Contatos agente - apenas admins
CREATE POLICY "Only admins can view contatos_agente" ON public.contatos_agente 
FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can manage contatos_agente" ON public.contatos_agente 
FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- N8N tables - apenas sistema/service role
CREATE POLICY "Service role can manage n8n_chat_histories" ON public.n8n_chat_histories 
FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role can manage n8n_fila_mensagens" ON public.n8n_fila_mensagens 
FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Sessions - apenas admins
CREATE POLICY "Only admins can manage sessions" ON public.sessions 
FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- Agents - apenas admins
CREATE POLICY "Only admins can view agents" ON public.agents 
FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can manage agents" ON public.agents 
FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- Política especial para permitir inserção pública em unified_leads (para formulários)
CREATE POLICY "Allow public inserts for forms" ON public.unified_leads 
FOR INSERT TO anon, authenticated 
WITH CHECK (true);

-- Comentários para documentar as políticas
COMMENT ON POLICY "Allow public inserts for forms" ON public.unified_leads 
IS 'Permite que formulários públicos insiram leads na tabela unified_leads';