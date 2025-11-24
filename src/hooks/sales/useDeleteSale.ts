
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useDeleteSale = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (saleId: string) => {
      console.log('🗑️ Iniciando exclusão em cascata da venda:', saleId);
      
      // 1. Buscar dados da venda e serviços recorrentes relacionados
      const { data: sale, error: fetchError } = await supabase
        .from('sales')
        .select('id, customer_id, service_name, total_value, sale_number')
        .eq('id', saleId)
        .single();

      if (fetchError || !sale) {
        console.error('Erro ao buscar venda:', fetchError);
        throw new Error('Venda não encontrada');
      }

      // 2. Buscar IDs dos serviços recorrentes vinculados a esta venda
      const { data: recurringServices } = await supabase
        .from('recurring_services')
        .select('id')
        .eq('sale_id', saleId);

      // 3. Excluir recurring_receivables vinculados aos serviços recorrentes
      if (recurringServices && recurringServices.length > 0) {
        const recurringServiceIds = recurringServices.map(rs => rs.id);
        const { error: receivablesError } = await supabase
          .from('recurring_receivables')
          .delete()
          .in('recurring_service_id', recurringServiceIds);
        
        if (receivablesError) {
          console.error('Erro ao excluir receivables:', receivablesError);
        } else {
          console.log('✅ Recurring receivables excluídos');
        }
      }

      // 4. Excluir recurring_services vinculados à venda
      const { error: servicesError } = await supabase
        .from('recurring_services')
        .delete()
        .eq('sale_id', saleId);
      
      if (servicesError) {
        console.error('Erro ao excluir recurring services:', servicesError);
      } else {
        console.log('✅ Recurring services excluídos');
      }

      // 4b. EXTRA: Excluir recurring_services órfãos do mesmo customer
      // (serviços que ficaram sem sale_id por algum motivo)
      if (sale.customer_id && sale.service_name) {
        const { error: orphanServicesError } = await supabase
          .from('recurring_services')
          .delete()
          .eq('customer_id', sale.customer_id)
          .ilike('service_name', `%${sale.service_name}%`)
          .is('sale_id', null);
        
        if (orphanServicesError) {
          console.error('Erro ao excluir recurring services órfãos:', orphanServicesError);
        } else {
          console.log('✅ Recurring services órfãos excluídos');
        }
      }

      // 5. Excluir sale_payments
      const { error: paymentsError } = await supabase
        .from('sale_payments')
        .delete()
        .eq('sale_id', saleId);
      
      if (paymentsError) {
        console.error('Erro ao excluir sale payments:', paymentsError);
      } else {
        console.log('✅ Sale payments excluídos');
      }

      // 6. Excluir financial_movements relacionados (usando sale_number para correspondência confiável)
      if (sale.customer_id && sale.sale_number) {
        const { error: movementsError } = await supabase
          .from('financial_movements')
          .delete()
          .eq('customer_id', sale.customer_id)
          .ilike('description', `%${sale.sale_number}%`);
        
        if (movementsError) {
          console.error('Erro ao excluir financial movements:', movementsError);
        } else {
          console.log('✅ Financial movements excluídos');
        }
      }

      // 7. Excluir a venda
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', saleId);

      if (error) {
        console.error('Erro ao excluir venda:', error);
        throw error;
      }
      
      console.log('✅ Venda e todos os dados relacionados excluídos com sucesso');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['admin-revenue-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['financial-movements'] });
      queryClient.invalidateQueries({ queryKey: ['all-financial-movements'] });
      queryClient.invalidateQueries({ queryKey: ['recurring-services'] });
      queryClient.invalidateQueries({ queryKey: ['recurring-receivables'] });
      queryClient.invalidateQueries({ queryKey: ['unified-receivables'] });
      queryClient.invalidateQueries({ queryKey: ['accounts-receivable'] });
      toast({
        title: "Venda excluída",
        description: "A venda e todos os dados relacionados foram excluídos com sucesso."
      });
    },
    onError: (error: any) => {
      console.error('Erro na exclusão da venda:', error);
      toast({
        title: "Erro ao excluir venda",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};
