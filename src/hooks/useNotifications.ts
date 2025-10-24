import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface NotificationLog {
  id: string;
  notification_type: string;
  recipient_email: string;
  subject: string;
  sent_at: string;
  status: string;
  brevo_message_id?: string;
  error_message?: string;
  entity_id?: string;
  entity_type?: string;
}

export const useNotifications = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notificationLogs, isLoading } = useQuery({
    queryKey: ['notification-logs'],
    queryFn: async () => {
      console.log('Buscando logs de notificações...');
      
      const { data, error } = await supabase
        .from('notification_logs')
        .select('*')
        .order('sent_at', { ascending: false })
        .limit(50);
      
      if (error) {
        console.error('Erro ao buscar logs de notificações:', error);
        throw error;
      }
      
      console.log('Logs de notificações encontrados:', data);
      return data as NotificationLog[];
    },
  });

  const sendTestNotificationMutation = useMutation({
    mutationFn: async (type: string) => {
      console.log('Enviando notificação de teste:', type);
      
      const testData = {
        new_lead: {
          full_name: "João Silva (Teste)",
          email: "joao.teste@exemplo.com",
          phone: "+351 912 345 678",
          company_name: "Empresa Teste Lda",
          interest_type: "landing_page_basic",
          source_page: "website",
          created_at: new Date().toISOString()
        },
        sale_completed: {
          sale_number: "VD2024-TEST",
          customer_name: "Cliente Teste",
          service_name: "Landing Page Premium",
          total_value: 1299.99
        },
        payment_received: {
          email: "cliente.teste@exemplo.com",
          amount: 99.99,
          status: "paid",
          created_at: new Date().toISOString()
        },
        system_error: {
          error_type: "Teste de Sistema",
          message: "Esta é uma notificação de teste para verificar se o sistema está funcionando.",
          timestamp: new Date().toISOString(),
          details: "Teste enviado manualmente pelo administrador"
        }
      };

      const { data, error } = await supabase.functions.invoke('send-notification-email', {
        body: {
          type: type,
          subject: `🧪 Teste: ${type === 'new_lead' ? 'Novo Lead' : 
                   type === 'sale_completed' ? 'Venda Concluída' : 
                   type === 'payment_received' ? 'Pagamento Recebido' : 
                   'Erro do Sistema'}`,
          data: testData[type as keyof typeof testData]
        }
      });
      
      if (error) {
        console.error('Erro ao enviar notificação de teste:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: (data) => {
      console.log('Notificação de teste enviada com sucesso:', data);
      queryClient.invalidateQueries({ queryKey: ['notification-logs'] });
      toast({
        title: "Notificação de teste enviada!",
        description: "Verifique sua caixa de email e os logs abaixo.",
      });
    },
    onError: (error) => {
      console.error('Erro ao enviar notificação de teste:', error);
      toast({
        title: "Erro ao enviar notificação",
        description: "Não foi possível enviar a notificação de teste.",
        variant: "destructive"
      });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'text-green-400';
      case 'failed': return 'text-red-400';
      case 'pending': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'new_lead': return '🎯';
      case 'sale_completed': return '💰';
      case 'payment_received': return '✅';
      case 'customer_updated': return '👤';
      case 'monthly_report': return '📊';
      case 'system_error': return '⚠️';
      default: return '📧';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'new_lead': return 'Novo Lead';
      case 'sale_completed': return 'Venda Concluída';
      case 'payment_received': return 'Pagamento Recebido';
      case 'customer_updated': return 'Cliente Atualizado';
      case 'monthly_report': return 'Relatório Mensal';
      case 'system_error': return 'Erro do Sistema';
      default: return type;
    }
  };

  return {
    notificationLogs,
    isLoading,
    sendTestNotification: sendTestNotificationMutation.mutate,
    isSendingTest: sendTestNotificationMutation.isPending,
    getStatusColor,
    getTypeIcon,
    getTypeName
  };
};