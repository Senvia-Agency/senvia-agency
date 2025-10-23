
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Sale } from "./types";
import { useCreateActivity } from "@/hooks/useActivityHistory";

// Função auxiliar para calcular próxima data de cobrança
const calculateNextBillingDate = (startDate: string, billingDay: number): string => {
  const start = new Date(startDate);
  const now = new Date();
  
  // Se a data de início é no futuro, retorna ela
  if (start > now) {
    return startDate;
  }
  
  // Calcular próximo mês de cobrança
  const nextBilling = new Date(now.getFullYear(), now.getMonth(), billingDay);
  
  // Se o dia já passou neste mês, vai para o próximo
  if (nextBilling <= now) {
    nextBilling.setMonth(nextBilling.getMonth() + 1);
  }
  
  return nextBilling.toISOString().split('T')[0];
};

export const useCreateSale = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createActivity = useCreateActivity();
  
  return useMutation({
    mutationFn: async (newSale: Omit<Sale, 'id' | 'sale_number' | 'remaining_amount' | 'created_at' | 'updated_at'>) => {
      console.log('Criando nova venda:', newSale);
      
      const { data, error } = await supabase
        .from('sales')
        .insert([newSale])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar venda:', error);
        throw error;
      }
      
      console.log('Venda criada com sucesso:', data);
      return data;
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['admin-revenue-metrics'] });
      
      // Se é recorrente e tem customer_id, criar o serviço recorrente
      if (data.is_recurring && data.customer_id && data.recurring_billing_day && data.recurring_start_date) {
        try {
          console.log('Criando serviço recorrente para venda:', data.id);
          
          const nextBillingDate = calculateNextBillingDate(
            data.recurring_start_date, 
            data.recurring_billing_day
          );
          
          const { data: recurringService, error: recurringError } = await supabase
            .from('recurring_services')
            .insert([{
              customer_id: data.customer_id,
              service_id: data.service_id,
              service_name: data.service_name,
              service_description: data.service_description,
              monthly_amount: data.total_value,
              billing_day: data.recurring_billing_day,
              start_date: data.recurring_start_date,
              next_billing_date: nextBillingDate,
              status: 'active'
            }])
            .select()
            .single();
          
          if (recurringError) {
            console.error('Erro ao criar serviço recorrente:', recurringError);
            throw recurringError;
          }
          
          console.log('Serviço recorrente criado:', recurringService);
          
          // Se a data de início é hoje ou no passado, criar primeira cobrança
          const startDate = new Date(data.recurring_start_date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          startDate.setHours(0, 0, 0, 0);
          
          if (startDate <= today) {
            const billingPeriodStart = data.recurring_start_date;
            const billingPeriodEnd = new Date(startDate);
            billingPeriodEnd.setMonth(billingPeriodEnd.getMonth() + 1);
            
            const { error: receivableError } = await supabase
              .from('recurring_receivables')
              .insert([{
                recurring_service_id: recurringService.id,
                customer_id: data.customer_id,
                amount: data.total_value,
                due_date: data.recurring_start_date,
                billing_period_start: billingPeriodStart,
                billing_period_end: billingPeriodEnd.toISOString().split('T')[0],
                status: 'pending'
              }]);
            
            if (receivableError) {
              console.error('Erro ao criar primeira cobrança:', receivableError);
            } else {
              console.log('Primeira cobrança criada com sucesso');
            }
          }
          
          queryClient.invalidateQueries({ queryKey: ['recurring-services'] });
          queryClient.invalidateQueries({ queryKey: ['recurring-receivables'] });
          queryClient.invalidateQueries({ queryKey: ['recurring-stats'] });
          
          // Criar atividade sobre o serviço recorrente
          createActivity.mutate({
            entity_type: 'customer',
            entity_id: data.customer_id,
            activity_type: 'status_change',
            title: 'Serviço recorrente iniciado',
            description: `Serviço recorrente "${data.service_name}" iniciado - €${Number(data.total_value).toFixed(2)}/mês - Cobrança todo dia ${data.recurring_billing_day}`,
            contact_method: 'sistema'
          });
        } catch (error) {
          console.error('Erro ao configurar recorrência:', error);
          toast({
            title: "Aviso",
            description: "Venda criada mas houve erro ao configurar recorrência.",
            variant: "destructive"
          });
        }
      }
      
      // Criar atividade no histórico do cliente se a venda tiver customer_id
      if (data.customer_id && !data.is_recurring) {
        createActivity.mutate({
          entity_type: 'customer',
          entity_id: data.customer_id,
          activity_type: 'payment_update',
          title: 'Nova venda registrada',
          description: `Venda #${data.sale_number} criada - ${data.service_name} - €${Number(data.total_value).toFixed(2)}`,
          contact_method: 'sistema'
        });
      }
      
      toast({
        title: "Venda criada",
        description: data.is_recurring 
          ? "Venda criada e serviço recorrente configurado com sucesso!" 
          : "A venda foi criada com sucesso."
      });
    },
    onError: (error: any) => {
      console.error('Erro na criação da venda:', error);
      toast({
        title: "Erro ao criar venda",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};
