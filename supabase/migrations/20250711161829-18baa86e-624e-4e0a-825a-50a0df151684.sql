-- Criar algumas atividades de exemplo para demonstrar o histórico do cliente
INSERT INTO activity_history (entity_type, entity_id, activity_type, title, description, contact_method) VALUES
  ('customer', 'c9071d90-013a-4655-91ca-8010fd82e8d4', 'status_change', 'Cliente criado', 'Cliente registrado no sistema a partir de conversão de lead', 'sistema'),
  ('customer', 'c9071d90-013a-4655-91ca-8010fd82e8d4', 'payment_update', 'Pagamento recebido', 'Pagamento de €4.99 processado com sucesso via Stripe', 'stripe'),
  ('customer', 'c9071d90-013a-4655-91ca-8010fd82e8d4', 'contact', 'Primeiro contato realizado', 'Ligação inicial para apresentação dos serviços', 'telefone'),
  ('customer', 'c9071d90-013a-4655-91ca-8010fd82e8d4', 'status_change', 'Status alterado', 'Status do cliente alterado de "pendente" para "ativo"', 'sistema');